import { parse as urlParse } from 'node:url'
import GhostContentAPI, { Params, PostOrPage, SettingsResponse, Pagination, PostsOrPages, Tag, Author } from '@tryghost/content-api'
import { normalizePost } from '@lib/ghost-normalize'
import { Node } from 'unist'
import { collections as config } from '@routesConfig'
import { Collections } from '@lib/collections'

import { ghostAPIUrl, ghostAPIKey, processEnv, ProcessEnvProps } from '@lib/processEnv'
import { imageDimensions, normalizedImageUrl, Dimensions } from '@lib/images'
import { IToC } from '@lib/toc'

import { contactPage, Locale } from '@appConfig'
import { getCache, getOrCreate, setCache } from '@lib/cache'

export interface NextImage {
  url: string
  dimensions: Dimensions
}

export interface NavItem {
  url: string
  label: string
}

interface BrowseResults<T> extends Array<T> {
  meta: { pagination: Pagination }
}

export interface GhostSettings extends SettingsResponse {
  processEnv: ProcessEnvProps
  title: string
  description: string
  secondary_navigation?: NavItem[]
  iconImage?: NextImage
  logoImage?: NextImage
  coverImage?: NextImage
  locale?: string
}

export interface GhostTag extends Tag {
  featureImage?: NextImage
}

export interface GhostAuthor extends Author {
  profileImage?: NextImage
}

export interface GhostPostOrPage extends PostOrPage {
  featureImage?: NextImage | null
  htmlAst?: Node | null
  toc?: IToC[] | null
}

export type GhostPostsOrPages = BrowseResults<GhostPostOrPage>

export type GhostTags = BrowseResults<GhostTag>

export type GhostAuthors = BrowseResults<GhostAuthor>

const api = new GhostContentAPI({
  url: ghostAPIUrl,
  key: ghostAPIKey,
  version: 'v5.0',
})

const postAndPageFetchOptions: Params = {
  limit: 'all',
  include: ['tags', 'authors', 'count.posts'],
  order: ['featured DESC', 'published_at DESC'],
}

const tagAndAuthorFetchOptions: Params = {
  limit: 'all',
  include: 'count.posts',
  filter: 'visibility:public'
}

const postAndPageSlugOptions: Params = {
  limit: 'all',
  fields: 'slug',
}

const excludePostOrPageBySlug = () => {
  if (!contactPage) return ''
  return 'slug:-contact'
}

// helpers
export const createNextImage = async (url?: string | null): Promise<NextImage | undefined> => {
  if (!url) return undefined
  const normalizedUrl = await normalizedImageUrl(url)
  const dimensions = await imageDimensions(normalizedUrl)
  return (dimensions && { url: normalizedUrl, dimensions }) || undefined
}

async function createNextFeatureImages(nodes: BrowseResults<Tag | PostOrPage>): Promise<GhostTags | PostsOrPages> {
  const { meta } = nodes
  const images = await Promise.all(nodes.map((node) => createNextImage(node.feature_image)))
  const results = nodes.map((node, i) => ({
    ...node,
    ...(images[i] && { featureImage: images[i] }),
  }))
  return Object.assign(results, { meta })
}

async function createNextProfileImages(nodes: BrowseResults<Author>): Promise<GhostAuthors> {
  const { meta } = nodes
  const images = await Promise.all(nodes.map((node) => createNextImage(node.profile_image)))
  const results = nodes.map((node, i) => ({
    ...node,
    ...(images[i] && { profileImage: images[i] }),
  }))
  return Object.assign(results, { meta })
}

export async function createNextProfileImagesFromAuthors(nodes: Author[] | undefined): Promise<Author[] | undefined> {
  if (!nodes) return undefined
  const images = await Promise.all(nodes.map((node) => createNextImage(node.profile_image)))
  return nodes.map((node, i) => ({
    ...node,
    ...(images[i] && { profileImage: images[i] }),
  }))
}

async function createNextProfileImagesFromPosts(nodes: BrowseResults<PostOrPage>): Promise<PostsOrPages> {
  const { meta } = nodes
  const authors = await Promise.all(nodes.map((node) => createNextProfileImagesFromAuthors(node.authors)))
  const results = nodes.map((node, i) => ({
    ...node,
    ...(authors[i] && { authors: authors[i] }),
  }))
  return Object.assign(results, { meta })
}

export async function getAllSettings(): Promise<GhostSettings> {
  return await getOrCreate<GhostSettings>(
    'getAllSettings',
    async () => {
      const settings = await api.settings.browse()
      settings.url = settings?.url?.replace(/\/$/, ``)

      const iconImage = await createNextImage(settings.icon)
      const logoImage = await createNextImage(settings.logo)
      const coverImage = await createNextImage(settings.cover_image)

      return {
        processEnv,
        ...settings,
        title: settings.title || 'Blog',
        description: settings.description || '',
        ...(iconImage && { iconImage }),
        ...(logoImage && { logoImage }),
        ...(coverImage && { coverImage }),
      } as GhostSettings
    },
  );
}

export async function getAllTags(locale?: Locale): Promise<GhostTags> {
 return await getOrCreate<GhostTags>(
    'getAllTags' + (locale ? `_${locale}` : ''),
    async () => {

      if (!locale) {  
        const tags = await api.tags.browse(tagAndAuthorFetchOptions)
        return await createNextFeatureImages(tags)
      }

      const posts = await api.posts.browse({
        filter: `tags:hash-${locale}`,
        include: 'tags',
        limit: 'all'
      });
      
      // Extrair todas as tags e contar ocorrências
      const allTags = posts.flatMap(post => post.tags || []);
      const tagCountMap = new Map<string, number>();
      
      // Contar posts por tag
      allTags.forEach(tag => {
        if (tag.visibility === 'public') {
          const count = tagCountMap.get(tag.id) || 0;
          tagCountMap.set(tag.id, count + 1);
        }
      });
      
      // Filtrar tags únicas e adicionar contagem
      const uniqueTags = allTags.filter((tag, index, array) => 
        tag.visibility === 'public' && 
        array.findIndex(t => t.id === tag.id) === index
      ).map(tag => {
        return {
          ...tag,
          count: {
            posts: tagCountMap.get(tag.id) || 0
          }
        };
      });
      
      return await createNextFeatureImages(Object.assign(uniqueTags, { meta: posts.meta }));
    },
  );
}

export async function getAllAuthors(): Promise<GhostAuthors> {
  return await getOrCreate<GhostAuthors>(
    'getAllAuthors',
    async () => {
      const authors = await api.authors.browse(tagAndAuthorFetchOptions)
      return await createNextProfileImages(authors)
    },
  );
}

export async function getAllPosts(props?: { limit?: number; feature?: boolean, tag?: string }): Promise<GhostPostsOrPages> {
  const cached = getCache<GhostPostsOrPages>('getAllPosts' + props?.limit + props?.feature + props?.tag)
  if (cached) return cached

  let filter = excludePostOrPageBySlug()
  if (props?.feature === true) {
    filter = filter ? `${filter}+featured:true` : 'featured:true'
  } else if (props?.feature === false) {
    filter = filter ? `${filter}+featured:false` : 'featured:false'
  }
  
   if (props?.tag) {
    filter = filter ? `${filter}+tag:${props.tag}` : `tag:${props.tag}`;
  }

  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    filter,
    ...(props?.limit && { limit: props.limit }),
  })
  const results = await createNextProfileImagesFromPosts(posts)
  const result = await createNextFeatureImages(results)

  setCache('getAllPosts' + props?.limit + props?.feature + props?.tag, result)

  return result
}

export async function getAllPostSlugs(): Promise<string[]> {
  return await getOrCreate<string[]>(
    'getAllPostSlugs',
    async () => {
      const posts = await api.posts.browse(postAndPageSlugOptions)
      return posts.map((p) => p.slug)
    },
  );
}

export async function getAllPages(props?: { limit: number }): Promise<GhostPostsOrPages> {
  return await getOrCreate<GhostPostsOrPages>(
    'getAllPages',
    async () => {
      const pages = await api.pages.browse({
        ...postAndPageFetchOptions,
        filter: excludePostOrPageBySlug(),
        ...(props && { ...props }),
      })
      return await createNextFeatureImages(pages)
    },
    props?.limit ? 'limit_' + props.limit : '',
  );
}

// specific data by slug
export async function getTagBySlug(slug: string): Promise<Tag> {
  return await getOrCreate<Tag>(
    'getTagBySlug',
    async () => {
      return await api.tags.read({
        ...tagAndAuthorFetchOptions,
        slug,
      })
    },
    slug,
  );
}

export async function getAuthorBySlug(slug: string): Promise<GhostAuthor> {
  return await getOrCreate<GhostAuthor>(
    'getAuthorBySlug',
    async () => {
      const author = await api.authors.read({
        ...tagAndAuthorFetchOptions,
        slug,
      })
      const profileImage = await createNextImage(author.profile_image)
      const result = {
        ...author,
        ...(profileImage && { profileImage }),
      }
      return result
    },
    slug,
  );
}

export async function getPostBySlug(slug: string): Promise<GhostPostOrPage | null> {
  let result: GhostPostOrPage
  try {
    const post = await api.posts.read({
      ...postAndPageFetchOptions,
      slug,
    })
    // older Ghost versions do not throw error on 404
    if (!post) return null

    const { url } = await getAllSettings()
    result = await normalizePost(post, (url && urlParse(url)) || undefined)
  } catch (error_) {
    const error = error_ as { response?: { status: number } }
    if (error.response?.status === 404) return null
    throw error_
  }
  return result
}

export async function getPageBySlug(slug: string): Promise<GhostPostOrPage | null> {
  let result: GhostPostOrPage
  try {
    const page = await api.pages.read({
      ...postAndPageFetchOptions,
      slug,
    })

    // older Ghost versions do not throw error on 404
    if (!page) return null

    const { url } = await getAllSettings()
    result = await normalizePost(page, (url && urlParse(url)) || undefined)
  } catch (error_) {
    const error = error_ as { response?: { status: number } }
    if (error.response?.status === 404) return null
    throw error_
  }
  return result
}

// specific data by author/tag slug
export async function getPostsByAuthor(slug: string): Promise<GhostPostsOrPages> {
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    filter: `authors.slug:${slug}`,
  })
  return await createNextFeatureImages(posts)
}

export async function getPostsByTag(
  slugOrSlugs: string | string[], 
  limit?: number, 
  excludeId?: string,
  locale?: Locale
): Promise<GhostPostsOrPages> {
  const exclude = (excludeId && `+id:-${excludeId}`) || ``
  
  // Constrói o filtro para uma ou várias tags
  let tagsFilter = '';
  if (Array.isArray(slugOrSlugs)) {
    // Para múltiplas tags, usamos [tag:tag1,tag2,tag3] na API Ghost
    tagsFilter = `tags:[${slugOrSlugs.join(',')}]`;
  } else {
    // Para uma tag única, usamos tags.slug:tag
    tagsFilter = `tags.slug:${slugOrSlugs}`;
  }
  
  // Adiciona filtro por locale se especificado
  let filter = `${tagsFilter}${exclude}`;
  if (locale) {
    filter = `${filter}+tags:hash-${locale}`;
  }
  
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    ...(limit && { limit: `${limit}` }),
    filter,
  })
  return await createNextFeatureImages(posts)
}

// Collections
export const collections = new Collections<PostOrPage>(config)
