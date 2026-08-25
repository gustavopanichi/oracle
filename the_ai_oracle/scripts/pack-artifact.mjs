import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Repackage the single-file build as a body-only page.
 *
 * Some hosts (Claude Artifacts among them) supply their own
 * <!doctype>/<html>/<head>/<body> skeleton and expect the page's own content
 * without those wrappers. Run after `npm run build:single`.
 */
const src = readFileSync('dist-single/index.html', 'utf8')

const head = src.match(/<head>([\s\S]*?)<\/head>/)?.[1]
const body = src.match(/<body>([\s\S]*?)<\/body>/)?.[1]
if (!head || !body) throw new Error('Unexpected build output: no <head>/<body> found')

// The host emits its own charset; everything else (title, font links, the
// inlined stylesheet and module script) travels with the page.
const out = `${head.replace(/<meta charset=[^>]*>\s*/i, '').trim()}\n${body.trim()}\n`

writeFileSync('the-ai-oracle.html', out)
console.log(`the-ai-oracle.html — ${(out.length / 1024).toFixed(0)} kB`)
