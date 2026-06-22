import { defineConfig } from 'vita-site'
import './assets/style.scss'
import { isString } from 'vitarx'

export default defineConfig({
  enhanceApp: (_app, { router }) => {
    router.afterEach((to) => {
      const title = to.meta['title']
      if (isString(title)) {
        document.title = `${title} - Viswoole PHP Framework`
      } else {
        document.title = 'Viswoole - 基于Swoole的PHP框架'
      }
    })
  }
})
