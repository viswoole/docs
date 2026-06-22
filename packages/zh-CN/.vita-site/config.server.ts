import { defaultTheme } from '@vita-site/theme-default/server'
import { defineConfig } from 'vita-site/server'
import { defineConfig as defineViteConfig } from 'vite'

export default defineConfig({
  title: 'Viswoole - 基于 Swoole 协程的高性能 PHP 框架',
  keywords: 'Viswoole, PHP, Swoole, 协程, 高性能, 后端框架, 依赖注入, 参数校验',
  description:
    'Viswoole 是一款基于 Swoole 协程的高性能 PHP 后端框架，提供协程级高性能驱动、优雅的依赖注入与参数校验，内置服务发现与异步任务管理。',
  injectHead: [`<link rel="icon" href="/favicon.ico" />`],
  pageDirs: [{ dir: 'pages' }],
  docDirs: [{ dir: 'docs', prefix: '/docs' }],
  markdownIt: {
    shikiConfig: {
      langs: ['json', 'nginx', 'php', 'yaml', 'ini', 'dockerfile']
    }
  },
  plugins: [
    defaultTheme({
      title: 'Viswoole',
      color: '#1376e7',
      logo: '/logo.png',
      navLinks: [{ text: '文档', link: '/docs' }],
      edit: 'https://github.com/viswoole/docs/edit/main/packages/zh-CN/'
    })
  ],
  vite: defineViteConfig({
    server: {
      host: '0.0.0.0',
      port: 4000
    },
    preview: {
      host: '0.0.0.0',
      port: 4173
    },
    build: {
      cssCodeSplit: false
    }
  })
})
