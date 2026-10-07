/**
 * Vite plugin: exposes content/cv.md as the virtual module `virtual:cv` (default export: CvData).
 *
 * - build: validation errors fail the build → GitHub Actions never deploys a broken CV
 * - dev:   editing cv.md / cv_transform_rules.md reloads the page; errors show in the Vite overlay
 */
import { resolve } from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import { CV_FILE, RULES_FILE, loadCv } from './index.ts'

const VIRTUAL_ID = 'virtual:cv'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

export default function cvPlugin(): Plugin {
  let root = process.cwd()
  let server: ViteDevServer | undefined

  return {
    name: 'cv-data',
    configResolved(config) {
      root = config.root
    },
    configureServer(devServer) {
      server = devServer
      const watched = [resolve(root, CV_FILE), resolve(root, RULES_FILE)]
      devServer.watcher.add(watched)
      devServer.watcher.on('change', file => {
        if (!watched.includes(resolve(file))) return
        const mod = devServer.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) devServer.moduleGraph.invalidateModule(mod)
        devServer.ws.send({ type: 'full-reload' })
      })
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined
      const { data, warnings, files } = loadCv({ root })
      this.addWatchFile(files.cv)
      this.addWatchFile(files.rules)
      for (const w of warnings) (server?.config.logger ?? console).warn(`[cv] ⚠️  ${w}`)
      return `export default ${JSON.stringify(data)}`
    }
  }
}
