import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import archiver from "archiver"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")
    const type = searchParams.get("type") // 'mp3', 'wav', 'stems', 'exclusive', 'unlimited'

    if (!slug) {
        return new NextResponse("Missing slug", { status: 400 })
    }

    const publicDir = path.join(process.cwd(), "public")

    // --- SMART SEARCH HELPERS ---

    // Normalize string: remove numbers at start, lowercase, remove special chars to compare 'core' names
    function getCoreName(filename: string) {
        // Remove extension
        const nameWithoutExt = path.parse(filename).name
        // Remove leading numbers (e.g. "9abstract" -> "abstract", "05-beat" -> "-beat" -> "beat")
        // Also replace hyphens/underscores with spaces for looser matching
        return nameWithoutExt
            .replace(/^\d+/, '') // Remove leading digits
            .replace(/[-_]/g, ' ') // Replace separators with spaces
            .toLowerCase()
            .trim()
    }

    function findBestFileMatch(targetSlug: string, extension: string | null) {
        if (!fs.existsSync(publicDir)) return null

        const files = fs.readdirSync(publicDir)
        const targetCore = targetSlug.replace(/[-_]/g, ' ').toLowerCase().trim()

        // 1. Exact match (e.g. "abstract.wav")
        if (extension) {
            const exactPath = path.join(publicDir, `${targetSlug}.${extension}`)
            if (fs.existsSync(exactPath)) return exactPath
        }

        // 2. Fuzzy match
        // We look for a file that *contains* the target core name
        // Prioritize files that start with numbers followed by the name
        const match = files.find(file => {
            // Check extension if provided
            if (extension && !file.toLowerCase().endsWith(`.${extension}`)) return false

            const fileCore = getCoreName(file)

            // Check if file core is same as target core
            if (fileCore === targetCore) return true

            // Check if file contains target (e.g. "8another-live.wav" contains "another live")
            return fileCore.includes(targetCore)
        })

        if (match) return path.join(publicDir, match)
        return null
    }

    function findBestFolderMatch(targetSlug: string) {
        if (!fs.existsSync(publicDir)) return null

        const files = fs.readdirSync(publicDir)
        const targetCore = targetSlug.replace(/[-_]/g, ' ').toLowerCase().trim()

        const match = files.find(file => {
            const fullPath = path.join(publicDir, file)
            // Must be a directory
            try {
                if (!fs.statSync(fullPath).isDirectory()) return false
            } catch { return false }

            const folderName = file.toLowerCase().replace(/[-_]/g, ' ').trim()

            // Exact match (ignoring case/spaces)
            if (folderName === targetCore) return true

            // Or if folder name is just uppercase version of slug (handled by toLowerCase)
            return false
        })

        if (match) return path.join(publicDir, match)
        return null
    }

    // --- HANDLER LOGIC ---

    // Handle Exclusive / Unlimited / Stems (Zip Bundle)
    if (type === "exclusive" || type === "unlimited" || type === "stems") {

        // 1. Find Stems (Folder preferred, else file)
        let stemsPath = findBestFolderMatch(slug)
        let stemsIsFolder = true

        if (!stemsPath) {
            // Fallback: Look for a zip/rar/wav file that looks like stems
            const files = fs.readdirSync(publicDir)
            const targetCore = slug.replace(/[-_]/g, ' ').toLowerCase().trim()

            const stemFile = files.find(f => {
                const lower = f.toLowerCase()
                // Must have strict stem keywords
                if (!lower.includes("stem") && !lower.includes("trackout")) return false
                // Must match the song name
                const core = getCoreName(f)
                return core.includes(targetCore)
            })

            if (stemFile) {
                stemsPath = path.join(publicDir, stemFile)
                stemsIsFolder = false
            }
        }

        const headers = new Headers()
        headers.set("Content-Type", "application/zip")
        headers.set("Content-Disposition", `attachment; filename=${slug}-bundle.zip`)

        const archive = archiver("zip", { zlib: { level: 9 } })

        // @ts-ignore
        const stream = new ReadableStream({
            start(controller) {
                archive.on('data', chunk => controller.enqueue(chunk))
                archive.on('end', () => controller.close())
                archive.on('error', err => controller.error(err))

                // Add Stems
                if (stemsPath) {
                    if (stemsIsFolder) {
                        archive.directory(stemsPath, "Stems")
                    } else {
                        archive.file(stemsPath, { name: path.basename(stemsPath) })
                    }
                }

                // Add MP3
                const mp3Path = findBestFileMatch(slug, "mp3")
                if (mp3Path) archive.file(mp3Path, { name: `${slug}.mp3` })

                // Add WAV
                const wavPath = findBestFileMatch(slug, "wav")
                if (wavPath) archive.file(wavPath, { name: `${slug}.wav` })

                archive.finalize()
            }
        })

        // @ts-ignore
        return new NextResponse(stream, { headers })
    }

    // Handle Single Files (WAV / MP3)
    const ext = type === "wav" ? "wav" : "mp3"
    const filePath = findBestFileMatch(slug, ext)

    if (!filePath) {
        console.error(`File not found for slug: ${slug}, type: ${ext}`)
        return new NextResponse(`${ext.toUpperCase()} file not found (checked for ${slug})`, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)
    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": ext === "wav" ? "audio/wav" : "audio/mpeg",
            "Content-Disposition": `attachment; filename=${path.basename(filePath)}`
        }
    })
}
