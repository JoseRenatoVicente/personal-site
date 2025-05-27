import { PostOrPage } from '@tryghost/content-api'

const countImages = (html: string) => {
  if (!html) {
    return 0
  }
  return (html.match(/<img(.|\n)*?>/g) || []).length
}

const countWords = (text: string) => {
  if (!text) {
    return 0
  }

  text = text.replaceAll(/<(.|\n)*?>/g, ' ') // strip any HTML tags

  const pattern = /[a-zA-ZÀ-ÿ0-9_\u0392-\u03C9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g
  const match = text.match(pattern)
  let count = 0

  if (match === null) {
    return count
  }

  for (const element of match) {
    count += element.charCodeAt(0) >= 0x4E_00 ? element.length : 1;
  }

  return count
}

interface readingTimeProps {
  wordCount: number
  imageCount: number
}

const estimatedReadingTimeInMinutes = ({ wordCount, imageCount }: readingTimeProps) => {
  const wordsPerMinute = 275
  const wordsPerSecond = wordsPerMinute / 60
  let readingTimeSeconds = wordCount / wordsPerSecond

  // add 12 seconds for the first image, 11 for the second, etc. limiting at 3
  for (let i = 12; i > 12 - imageCount; i -= 1) {
    readingTimeSeconds += Math.max(i, 3)
  }

  const readingTimeMinutes = Math.round(readingTimeSeconds / 60)

  return readingTimeMinutes
}

const readingMinutes = (html?: string, additionalImages?: number): number => {
  if (!html) return 0

  let imageCount = countImages(html)
  const wordCount = countWords(html)

  if (additionalImages) imageCount += additionalImages

  return estimatedReadingTimeInMinutes({ wordCount, imageCount })
}

interface ReadingTimeOptions {
  minute?: string
  minutes?: string
}

export const readingTime = (post: PostOrPage, options: ReadingTimeOptions = {}) => {
  const minuteStr = typeof options.minute === 'string' ? options.minute : '1 min read'
  const minutesStr = typeof options.minutes === 'string' ? options.minutes : '% min read'

  if (!post.html && !post.reading_time) return ''

  const imageCount = post.feature_image ? 1 : 0
  const time = post.reading_time || readingMinutes(post.html!, imageCount)

  let readingTime = ''
  readingTime = time <= 1 ? minuteStr : minutesStr.replace('%', `${time}`);

  return readingTime
}
