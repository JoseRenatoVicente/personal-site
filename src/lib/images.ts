import probe from 'probe-image-size'
import { getCache, setCache } from '@lib/cache'

import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { join } from 'node:path'
import { processEnv } from '@lib/processEnv'
import { pipeline } from 'node:stream/promises'
import { createHash } from 'node:crypto'
import { Readable } from 'node:stream'

const streamPipeline = pipeline

function fetchToNodeStream(readableStream: ReadableStream): Readable {
  const reader = readableStream.getReader()
  return new Readable({
    async read() {
      const { done, value } = await reader.read()
      if (done) {
        this.push(null)
      } else {
        this.push(Buffer.from(value))
      }
    },
  })
}

/**
 * Determine image dimensions
 *
 * probe-image-size reacts sensitivily on bad network connections
 * See: https://github.com/nodeca/probe-image-size/issues/46
 * Frequent fails signify bad network connections
 *
 * Current measures:
 *
 * 1. Caching results to fs
 * 2. Retries on fail
 * 3. Reduced network timeouts to speed up retries
 *
 */

const maxRetries = 50
const read_timeout = 3000 // ms
const response_timeout = 3000 // ms

const calcHash = async (input: ArrayBuffer | string) => {
  const hash = createHash('sha1')
  const data = typeof input === 'string' ? input : Buffer.from(input)
  hash.update(data)
  return hash.digest('hex')
}

const genCacheKey = async (url: string, noCache?: boolean) => {
  if (noCache) return null
  return await calcHash(url)
}

export interface Dimensions {
  width: number
  height: number
}

export const imageDimensions = async (url: string | undefined | null, noCache?: boolean): Promise<Dimensions | null> => {
  if (!url) return null

  const cacheKey = await genCacheKey(url, noCache)
  const cached = getCache<Dimensions>(cacheKey)
  if (cached) return cached

  let width = 0
  let height = 0

  let hasError: boolean
  let retry = 0

  do {
    try {
      const { width: w, height: h } = await probe(url, {
        read_timeout,
        response_timeout,
      })
      width = w
      height = h
      hasError = false
    } catch (error_) {
      const error = error_ as { code: string }
      const { code } = error

      hasError = true
      retry = retry + 1

      if (code === 'ECONTENT') {
        // no content: width + height = 0
        hasError = false
      }
      if (!['ECONNRESET', 'ECONTENT'].includes(code)) {
        console.warn(`images.ts: Error while probing image with url: ${url}.`)
        throw error_
      }
      //console.warn(`images.ts: Network error while probing image with url: ${url}.`)
    }
  } while (hasError && retry < maxRetries)
  if (hasError) throw new Error(`images.ts: Bad network connection. Failed image probe after ${maxRetries} retries for url: ${url}.`)
  if (0 === width + height) return null

  setCache(cacheKey, { width, height })
  return { width, height }
}

export const imageDimensionsFromFile = async (file: string, noCache?: boolean) => {
  if (!file) return null

  const cacheKey = await genCacheKey(file, noCache)
  const cached = getCache<Dimensions>(cacheKey)
  if (cached) return cached

  const { width, height } = await probe(createReadStream(file))
  if (0 === width + height) return null

  setCache(cacheKey, { width, height })
  return { width, height }
}

/**
 * If the sourceImage flag is set, stream images
 * from localhost to the public image folder
 */

const imageRoot = join(process.cwd(), 'public/images')

export const normalizedImageUrl = async (url: string) => {
  const localhostRegExp = /^http:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/.*)*\/(.*)$/
  const filename = url.match(localhostRegExp)?.reverse()[0]

  if (processEnv.nextImages.source && filename) {
    const filePath = join(imageRoot, filename)

    if (!existsSync(filePath)) {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`images.ts: unexpected response ${response.statusText}`)
      if (response.body) {
        const nodeStream = fetchToNodeStream(response.body)
        await streamPipeline(nodeStream, createWriteStream(filePath))
      } else {
        throw new Error('Response body is null')
      }
    }
    return `${processEnv.siteUrl}/images/${filename}`
  }
  return url.startsWith('//') ? `https:${url}` : url
}
