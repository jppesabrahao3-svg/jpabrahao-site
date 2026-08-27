import fs from "node:fs"
import path from "node:path"
import { imageSize } from "image-size"

export type GalleryItem = { src: string; type: "image" | "video"; width: number; height: number }

const IMAGES_DIR = path.join(process.cwd(), "public", "demo-marketing", "imagens")
const VIDEOS_DIR = path.join(process.cwd(), "public", "demo-marketing", "videos")
const IMAGE_SAMPLE_SIZE = 38

// Vertical reels/stories reference ratio. Ler metadata real de video e mais custoso
// e nao e necessario para o layout do moodboard.
const VIDEO_DIMENSIONS = { width: 1080, height: 1920 }

function readDirSafe(dir: string): string[] {
  try {
    return fs.readdirSync(dir)
  } catch {
    return []
  }
}

function sample(files: string[], size: number): string[] {
  if (files.length <= size) return files
  const step = Math.max(1, Math.round(files.length / size))
  const picked: string[] = []
  for (let i = 0; i < files.length && picked.length < size; i += step) {
    picked.push(files[i])
  }
  for (let i = 0; picked.length < size && i < files.length; i++) {
    if (!picked.includes(files[i])) picked.push(files[i])
  }
  return picked.slice(0, size)
}

function readImageDimensions(filePath: string): { width: number; height: number } {
  try {
    const buffer = fs.readFileSync(filePath)
    const { width, height } = imageSize(buffer)
    return { width, height }
  } catch {
    return { width: 1080, height: 1080 }
  }
}

export function getMoodboardItems(): GalleryItem[] {
  const imageFiles = readDirSafe(IMAGES_DIR)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort()
  const videoFiles = readDirSafe(VIDEOS_DIR)
    .filter((f) => /\.(mp4|webm|mov)$/i.test(f))
    .sort()

  const images: GalleryItem[] = sample(imageFiles, IMAGE_SAMPLE_SIZE).map((f) => {
    const { width, height } = readImageDimensions(path.join(IMAGES_DIR, f))
    return { src: `/demo-marketing/imagens/${f}`, type: "image", width, height }
  })

  const videos: GalleryItem[] = videoFiles.map((f) => ({
    src: `/demo-marketing/videos/${f}`,
    type: "video",
    ...VIDEO_DIMENSIONS,
  }))

  return [...images, ...videos]
}
