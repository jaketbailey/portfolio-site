#!/usr/bin/env node
// Prepares the gallery for serving from the home server.
//
//   node scripts/build-gallery.mjs --src ./photos-src --out ./photos-out
//
// For every image in --src it writes two webp derivatives into --out and keeps
// --out/gallery.json in step. The manifest is updated *in place*: existing
// entries keep their hand-written metadata and their position in the array, new
// photos are appended with blank fields ready to fill in. Re-running after
// adding a few frames is therefore safe and cheap.
//
// EXIF is deliberately stripped from the derivatives (metadata is written by
// hand in the manifest, so there's no reason to ship camera serials and GPS).

import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SIZES = {
    thumb: { width: 1200, quality: 78 },
    full: { width: 2560, quality: 82 },
}

const SOURCE_EXTENSIONS = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.tif',
    '.tiff',
    '.webp',
    '.avif',
])

// Fields the manifest carries for each photo. Everything but the first few is
// yours to fill in; the script never overwrites a non-empty value.
const METADATA_TEMPLATE = {
    name: '',
    caption: '',
    camera: '',
    lens: '',
    film: '',
    focalLength: '',
    aperture: '',
    shutter: '',
    iso: '',
    location: '',
    date: '',
}

function parseArgs(argv) {
    // GALLERY_ROOT (set per machine in .env, see .env.example) is a folder
    // holding photos/ (originals) and gallery/ (what the server mounts).
    const root = process.env.GALLERY_ROOT || null
    const args = {
        src: root ? path.join(root, 'photos') : './photos-src',
        out: root ? path.join(root, 'gallery') : './photos-out',
        root,
        force: false,
        watermark: '',
    }
    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i]
        if (arg === '--src') args.src = argv[++i]
        else if (arg === '--out') args.out = argv[++i]
        else if (arg === '--watermark') args.watermark = argv[++i] ?? ''
        else if (arg === '--force') args.force = true
        else if (arg === '--help' || arg === '-h') args.help = true
        else throw new Error(`Unknown argument: ${arg}`)
    }
    return args
}

const slugify = (name) =>
    path
        .basename(name, path.extname(name))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

async function mtimeOrZero(file) {
    try {
        return (await fs.stat(file)).mtimeMs
    } catch {
        return 0
    }
}

async function readManifest(file) {
    try {
        const parsed = JSON.parse(await fs.readFile(file, 'utf8'))
        const photos = Array.isArray(parsed) ? parsed : parsed.photos
        return {
            photos: Array.isArray(photos) ? photos : [],
            watermark: parsed.watermark ?? '',
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw new Error(
                `Existing ${file} is not valid JSON: ${error.message}`
            )
        }
        return { photos: [], watermark: '' }
    }
}

const escapeXml = (text) =>
    text.replace(
        /[<>&'"]/g,
        (char) =>
            ({
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                "'": '&apos;',
                '"': '&quot;',
            })[char]
    )

// An SVG the size of the image with the text in the bottom-right corner. Scaled
// off the shorter side so it reads the same on portrait and landscape frames,
// and given a soft shadow so it stays legible on bright skies as well as shadows.
function watermarkSvg(text, width, height) {
    const fontSize = Math.max(12, Math.round(Math.min(width, height) * 0.03))
    const margin = Math.round(fontSize * 0.9)
    return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
        <filter id="shadow" x="-10%" y="-50%" width="120%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="${fontSize * 0.15}" flood-color="#000" flood-opacity="0.6"/>
        </filter>
    </defs>
    <text x="${width - margin}" y="${height - margin}" text-anchor="end"
        font-family="Poppins, DM Sans, sans-serif" font-size="${fontSize}" font-weight="500"
        fill="#fff" fill-opacity="0.75" filter="url(#shadow)">${escapeXml(text)}</text>
</svg>`)
}

async function writeDerivative(
    srcPath,
    outPath,
    { maxWidth, quality, watermark }
) {
    let image = sharp(srcPath)
        .rotate() // honour the EXIF orientation before it's stripped
        .resize({
            width: maxWidth,
            height: maxWidth,
            fit: 'inside',
            withoutEnlargement: true,
        })
    if (watermark) {
        // The overlay has to match the resized dimensions, which aren't known
        // until the resize has actually run.
        const { data, info } = await image.toBuffer({ resolveWithObject: true })
        image = sharp(data).composite([
            { input: watermarkSvg(watermark, info.width, info.height) },
        ])
    }
    await image.webp({ quality }).toFile(outPath)
}

async function main() {
    const args = parseArgs(process.argv.slice(2))
    if (args.help) {
        console.log(
            'Usage: node scripts/build-gallery.mjs [--src dir] [--out dir] [--watermark text] [--force]\n' +
                'Without --src/--out, uses $GALLERY_ROOT/photos and $GALLERY_ROOT/gallery if GALLERY_ROOT\n' +
                'is set (e.g. in .env), else ./photos-src and ./photos-out.'
        )
        return
    }

    const srcDir = path.resolve(args.src)
    const outDir = path.resolve(args.out)
    console.log(
        args.root
            ? `Gallery root: ${args.root}`
            : 'GALLERY_ROOT not set; using local folders'
    )
    const manifestPath = path.join(outDir, 'gallery.json')

    let entries
    try {
        entries = await fs.readdir(srcDir)
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(
                `Source directory ${srcDir} does not exist. Put your originals there, or pass --src.`
            )
        }
        throw error
    }

    const sources = entries
        .filter((name) =>
            SOURCE_EXTENSIONS.has(path.extname(name).toLowerCase())
        )
        .sort((a, b) => a.localeCompare(b))

    if (sources.length === 0) {
        console.warn(`No images found in ${srcDir}`)
    }

    for (const size of Object.keys(SIZES)) {
        await fs.mkdir(path.join(outDir, size), { recursive: true })
    }

    const { photos: existing, watermark: previousWatermark } =
        await readManifest(manifestPath)
    // A changed (or added/removed) watermark makes every derivative stale.
    const watermarkChanged = previousWatermark !== args.watermark
    if (watermarkChanged && existing.length > 0) {
        console.log('Watermark changed — rebuilding every derivative.')
    }
    const byId = new Map(existing.map((photo) => [photo.id, photo]))
    const seen = new Set()
    const generated = []

    let built = 0
    let skipped = 0

    for (const fileName of sources) {
        const srcPath = path.join(srcDir, fileName)
        let id = slugify(fileName)
        // Two different originals can slug to the same name; keep them distinct.
        if (seen.has(id)) {
            id = `${id}-${createHash('sha1').update(fileName).digest('hex').slice(0, 6)}`
        }
        seen.add(id)

        const srcMtime = await mtimeOrZero(srcPath)
        const { width, height } = await sharp(srcPath).metadata()
        const outputs = {}

        for (const [size, { width: maxWidth, quality }] of Object.entries(
            SIZES
        )) {
            const relative = `${size}/${id}.webp`
            const outPath = path.join(outDir, relative)
            outputs[size] = relative

            if (
                !args.force &&
                !watermarkChanged &&
                (await mtimeOrZero(outPath)) > srcMtime
            ) {
                skipped += 1
                continue
            }

            await writeDerivative(srcPath, outPath, {
                maxWidth,
                quality,
                watermark: args.watermark,
            })
            built += 1
        }

        // Derived values are always refreshed; everything the manifest holds by
        // hand (including extras like `hidden` or `alt`) is carried across.
        const previous = byId.get(id) ?? {}
        const derivedKeys = ['id', 'file', 'thumb', 'full', 'width', 'height']
        const metadata = {}
        for (const key of Object.keys(METADATA_TEMPLATE)) {
            metadata[key] = previous[key] ?? METADATA_TEMPLATE[key]
        }
        for (const [key, value] of Object.entries(previous)) {
            if (!(key in METADATA_TEMPLATE) && !derivedKeys.includes(key)) {
                metadata[key] = value
            }
        }

        generated.push({
            id,
            file: fileName,
            thumb: outputs.thumb,
            full: outputs.full,
            width,
            height,
            ...metadata,
        })
    }

    // Preserve the order of the existing manifest; append genuinely new photos.
    const generatedById = new Map(generated.map((photo) => [photo.id, photo]))
    const ordered = []
    for (const photo of existing) {
        const refreshed = generatedById.get(photo.id)
        if (refreshed) {
            ordered.push(refreshed)
            generatedById.delete(photo.id)
        } else {
            console.warn(
                `! ${photo.id}: no source file in ${srcDir} any more — keeping the manifest entry, delete it by hand if that's intentional`
            )
            ordered.push(photo)
        }
    }
    const added = [...generatedById.values()]
    ordered.push(...added)

    await fs.writeFile(
        manifestPath,
        `${JSON.stringify(
            {
                version: 1,
                generatedAt: new Date().toISOString(),
                watermark: args.watermark,
                photos: ordered,
            },
            null,
            2
        )}\n`
    )

    console.log(
        `${sources.length} source image(s): ${built} derivative(s) written, ${skipped} up to date.`
    )
    console.log(
        `${added.length} new photo(s) added to ${path.relative(process.cwd(), manifestPath)}.`
    )
    if (added.length > 0) {
        console.log(
            `Fill in the blank metadata fields for: ${added.map((p) => p.id).join(', ')}`
        )
    }
}

main().catch((error) => {
    console.error(`\nbuild-gallery failed: ${error.message}`)
    process.exitCode = 1
})
