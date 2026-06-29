import { builder, onHide, onShow, shallowRef } from 'vitarx'
import { RouterLink } from 'vitarx-router'
import './index.scss'

interface Feature {
  icon: string
  title: string
  description: string
}

/**
 * 首屏 Hero 区域
 */
const Hero = builder(() => {
  const copy = shallowRef(false)

  /** 复制安装命令 */
  function copyInstall() {
    if (copy.value) return
    copy.value = true

    const text = 'composer create-project viswoole/viswoole myProject'
    const fallbackCopy = () => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
      } catch {
        // ignore
      } finally {
        document.body.removeChild(textarea)
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .catch(fallbackCopy)
        .finally(() => {
          setTimeout(() => {
            copy.value = false
          }, 2000)
        })
    } else {
      fallbackCopy()
      setTimeout(() => {
        copy.value = false
      }, 2000)
    }
  }

  return (
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="dot"></span>
          PHP 8.3+ &amp; Swoole 5.0+
        </div>
        <h1>
          基于 <span class="gradient-text">Swoole 协程</span> 的<br />
          <span class="gradient-text">高性能</span> PHP 框架
        </h1>
        <p class="hero-desc">
          Viswoole 提供协程级高性能驱动，优雅的依赖注入与参数校验，
          内置服务发现与异步任务管理，让后端开发更高效、更稳定。
        </p>
        <div class="hero-actions">
          <RouterLink to="/docs" class="btn btn-primary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            快速开始
          </RouterLink>
          <a href="https://github.com/viswoole/viswoole" target="_blank" class="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path>
            </svg>
            GitHub
          </a>
          <a href="https://gitee.com/viswoole/viswoole" target="_blank" class="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.483a.594.594 0 01-.593.592H9.777c-.346 0-.627.28-.627.627v.767c0 .346.28.627.627.627h6.33c.327 0 .593.265.593.592v1.483a.594.594 0 01-.593.593H9.777c-.346 0-.627.28-.627.627v.767c0 .346.28.627.627.627h8.297c.328 0 .593.266.593.593v1.483a.594.594 0 01-.593.592H9.777c-1.527 0-2.767-1.24-2.767-2.766V8.099c0-1.527 1.24-2.766 2.767-2.766h8.297z"></path>
            </svg>
            Gitee
          </a>
        </div>
        <div class="hero-install">
          <span>$</span>
          <code>composer create-project viswoole/viswoole myProject</code>
          <button class="copy-btn" onClick={copyInstall} title="复制">
            <svg
              v-if={copy.value}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-success)"
              stroke-width="2"
              stroke-linecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <div class="stat-value">PHP 8.3+</div>
            <div class="stat-label">运行环境</div>
          </div>
          <div class="stat">
            <div class="stat-value">Swoole 5+</div>
            <div class="stat-label">协程引擎</div>
          </div>
          <div class="stat">
            <div class="stat-value">Apache 2.0</div>
            <div class="stat-label">开源协议</div>
          </div>
          <div class="stat">
            <div class="stat-value">PSR</div>
            <div class="stat-label">规范遵循</div>
          </div>
        </div>
      </div>
    </section>
  )
})

/**
 * 核心特性展示区
 */
const Features = builder(() => {
  const features: Feature[] = [
    {
      icon: '⚡',
      title: '协程高性能',
      description: '基于 Swoole 协程驱动，全异步非阻塞 IO，性能远超传统 PHP-FPM 模式。'
    },
    {
      icon: '💉',
      title: '依赖注入',
      description: '优雅的 IOC 容器，自动解析构造函数依赖，支持 Provider 服务注册与下发。'
    },
    {
      icon: '🛡️',
      title: '参数校验',
      description: '内置类型校验与扩展规则校验，注解声明即可生效，无需手写 validate 逻辑。'
    },
    {
      icon: '🔌',
      title: '服务发现',
      description: '自动扫描注册服务提供者，支持 Swoole 事件 HOOK，灵活扩展自定义服务。'
    },
    {
      icon: '📦',
      title: '异步任务',
      description: '内置轻量 Task 管理器，支持 TaskProxy 异步投递，中小项目开箱即用。'
    },
    {
      icon: '📘',
      title: 'API 文档生成',
      description: '注解驱动自动生成 API 文档，包含请求参数结构与响应数据结构。'
    }
  ]

  return (
    <section class="section" id="features">
      <div class="section-header fade-in">
        <span class="section-tag">Features</span>
        <h2 class="section-title">为高性能后端而生</h2>
        <p class="section-desc">每个特性都围绕性能与开发效率精心设计，让 PHP 后端开发焕然一新。</p>
      </div>
      <div class="features-grid">
        {features.map((feature) => (
          <div class="feature-card fade-in">
            <div class="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
})

/**
 * 代码展示区域
 */
const Code = builder(() => {
  /** 控制器代码示例（带语法高亮标记） */
  const controllerCode =
    '<span class="kw">&lt;?php</span>\n\n' +
    '<span class="kw">namespace</span> <span class="ns">App\\Controller</span>;\n\n' +
    '<span class="kw">use</span> <span class="ns">Viswoole\\HttpServer\\Contract\\RequestInterface</span>;\n' +
    '<span class="kw">use</span> <span class="ns">Viswoole\\HttpServer\\Contract\\ResponseInterface</span>;\n' +
    '<span class="kw">use</span> <span class="ns">App\\Interface\\UserInfo</span>;\n\n' +
    '/**\n' +
    ' * 用户控制器 - 展示依赖注入与参数校验\n' +
    ' */\n' +
    '<span class="kw">class</span> <span class="class">User</span>\n' +
    '{\n' +
    '    <span class="cmt">// 通过构造函数自动注入 Request 和 Response</span>\n' +
    '    <span class="kw">public function</span> <span class="fn">__construct</span>(\n' +
    '        <span class="kw">private</span> RequestInterface <span class="var">$request</span>,\n' +
    '        <span class="kw">private</span> ResponseInterface <span class="var">$response</span>,\n' +
    '    ) {}\n\n' +
    '    <span class="cmt">// 参数类型由接口自动校验，无需手写 validate</span>\n' +
    '    <span class="kw">public function</span> <span class="fn">info</span>(UserInfo <span class="var">$userInfo</span>): <span class="type">array</span>\n' +
    '    {\n' +
    '        <span class="kw">return</span> [\n' +
    '            <span class="str">&apos;name&apos;</span> => <span class="var">$userInfo</span>-><span class="prop">name</span>,\n' +
    '            <span class="str">&apos;gender&apos;</span> => <span class="var">$userInfo</span>-><span class="prop">gender</span>-><span class="prop">name</span>,\n' +
    '        ];\n' +
    '    }\n' +
    '}'

  /** 路由配置代码示例 */
  const routeCode =
    '<span class="kw">&lt;?php</span>\n\n' +
    '<span class="kw">use</span> <span class="ns">Viswoole\\Router\\Facade\\Router</span>;\n\n' +
    '<span class="cmt">// 注册路由组，支持中间件、前缀等配置</span>\n' +
    'Router::<span class="fn">group</span>(<span class="str">&apos;/api/v1&apos;</span>, <span class="kw">function</span> () {\n' +
    '    Router::<span class="fn">get</span>(<span class="str">&apos;/user/info&apos;</span>, [<span class="str">&apos;App\\\\Controller\\\\User&apos;</span>, <span class="str">&apos;info&apos;</span>]);\n' +
    '    Router::<span class="fn">post</span>(<span class="str">&apos;/user/create&apos;</span>, [<span class="str">&apos;App\\\\Controller\\\\User&apos;</span>, <span class="str">&apos;create&apos;</span>]);\n' +
    '    Router::<span class="fn">put</span>(<span class="str">&apos;/user/update&apos;</span>, [<span class="str">&apos;App\\\\Controller\\\\User&apos;</span>, <span class="str">&apos;update&apos;</span>]);\n' +
    '    Router::<span class="fn">delete</span>(<span class="str">&apos;/user/delete&apos;</span>, [<span class="str">&apos;App\\\\Controller\\\\User&apos;</span>, <span class="str">&apos;delete&apos;</span>]);\n' +
    '});'

  return (
    <section class="section" id="code">
      <div class="section-header fade-in">
        <span class="section-tag">Code</span>
        <h2 class="section-title">简洁而优雅</h2>
        <p class="section-desc">用最少的代码实现最多的功能，感受 Viswoole 的开发效率。</p>
      </div>

      {/* 控制器示例 */}
      <div class="code-showcase fade-in">
        <div class="code-desc">
          <h3>依赖注入 + 参数校验</h3>
          <p>构造函数自动注入请求与响应对象，接口类型自动校验请求参数，让开发者专注业务逻辑。</p>
          <ul>
            <li>IOC 容器自动解析依赖</li>
            <li>接口类型即校验规则</li>
            <li>无需手写 validate 逻辑</li>
            <li>完整 PSR 规范支持</li>
          </ul>
        </div>
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="code-filename">app/Controller/User.php</span>
          </div>
          <div class="code-body">
            <pre v-html={controllerCode}></pre>
          </div>
        </div>
      </div>

      {/* 路由示例 */}
      <div class="code-showcase fade-in" style={{ marginTop: '32px' }}>
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="code-filename">config/route/route.php</span>
          </div>
          <div class="code-body">
            <pre v-html={routeCode}></pre>
          </div>
        </div>
        <div class="code-desc">
          <h3>灵活的路由配置</h3>
          <p>支持闭包路由、控制器路由、路由组、中间件等多种方式，满足各种场景需求。</p>
          <ul>
            <li>RESTful 风格路由定义</li>
            <li>路由组统一管理前缀</li>
            <li>支持注解式自动路由</li>
            <li>中间件灵活拦截处理</li>
          </ul>
        </div>
      </div>
    </section>
  )
})

/**
 * 快速开始区域
 */
const QuickStart = builder(() => {
  const steps = [
    {
      num: '01',
      title: '创建项目',
      desc: '通过 Composer 快速创建项目脚手架',
      code: 'composer create-project viswoole/viswoole myProject'
    },
    {
      num: '02',
      title: '安装依赖',
      desc: '进入项目目录并安装 Composer 依赖',
      code: 'cd myProject && composer install'
    },
    {
      num: '03',
      title: '启动服务',
      desc: '启动 HTTP 服务，-d 参数后台运行',
      code: 'php viswoole server:start http -d'
    }
  ]

  return (
    <section class="section" id="quickstart">
      <div class="section-header fade-in">
        <span class="section-tag">Quick Start</span>
        <h2 class="section-title">三步快速上手</h2>
        <p class="section-desc">只需三条命令，即可启动一个完整的 Viswoole 项目。</p>
      </div>
      <div class="steps-grid fade-in">
        {steps.map((step) => (
          <div class="step-card">
            <div class="step-num">{step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            <div class="step-code">
              <code>{step.code}</code>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
})

/**
 * 站点首页组件
 */
export default function Home() {
  let observer: IntersectionObserver

  /** 页面显示时绑定滚动渐显动画 */
  onShow(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
  })

  /** 页面隐藏时断开观察器释放资源 */
  onHide(() => {
    if (observer) observer.disconnect()
  })

  return (
    <>
      <main>
        <Hero />
        <Features />
        <Code />
        <QuickStart />
      </main>
      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-left">
            <span>Viswoole</span>
          </div>
          <div class="footer-center">
            <div class="footer-links">
              <a href="https://github.com/viswoole/viswoole" target="_blank">
                GitHub
              </a>
              <a href="https://gitee.com/viswoole/viswoole" target="_blank">
                Gitee
              </a>
              <a href="https://github.com/viswoole/viswoole/issues" target="_blank">
                Issues
              </a>
              <a href="https://beian.miit.gov.cn/" target="_blank" class="footer-beian">
                黔ICP备2024032832号
              </a>
            </div>
          </div>
          <div class="footer-right">
            <div class="footer-copy">&copy; 2024 - present Viswoole. Apache-2.0 License.</div>
          </div>
        </div>
      </footer>
    </>
  )
}
