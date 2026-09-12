# 配置系统

Viswoole 的配置由两个组件构成：`Env` 负责环境变量（`.env` 文件），`Config` 负责应用配置（`config/` 目录）。两者配合实现「一套代码，多环境部署」——结构性配置写在 `config/` 中，随环境变化的值通过 `env()` 从 `.env` 注入。

## 本章内容

### [环境变量](1.env.md)

`.env` 文件的格式约定（注释、引号、转义、行内注释）、`env()` 与 `Env` 类的读取方式、布尔值自动转换规则、变量名大小写与优先级。

### [配置文件](2.config-files.md)

`config/` 目录支持的多格式（php/yml/ini/json）、点号多级读取、`Config::set()` 的进程内语义、同名文件合并行为，以及 `config/lazy/` 懒加载机制。

## 两层配置的关系

```text
.env（环境层）          config/（应用层）
┌──────────────────┐    ┌──────────────────────────┐
│ app_debug=false  │    │ 'debug' => env('app_debug', true)
│ DATABASE_HOST=…  │ ─→ │ 'host'  => env('DATABASE_HOST', …)
└──────────────────┘    └──────────────────────────┘
      env() 读取                config() 读取
```

- `env()` 在**配置文件求值时**执行一次，结果随配置常驻内存，运行期修改 `.env` 不会生效；
- `config()` 每次调用都实时读取配置池，配合 `Config::set()` 可在运行期覆盖配置，但仅当前进程有效。

## 快速上手

```php
// 读取环境变量（键名不区分大小写，true/on 自动转布尔）
$debug = env('app_debug', false);

// 读取配置（点号多级，文件名即一级键）
$port = config('server.servers.http.construct.port');   // 9501

// 运行期覆盖配置（仅当前进程有效，重启丢失）
\Viswoole\Core\Facade\Config::set('app.debug', false);
```

::: info:配置加载时机
`.env` 与 `config/` 在进程启动时加载；`config/lazy/` 中的懒加载配置在 `AppInitialized` 事件后才加载。服务提供者的 `register()` 阶段不可访问懒加载配置。
:::

## 下一步

- 从 [环境变量](1.env.md) 开始了解 `.env` 的完整格式约定
- 直接查阅 [配置文件](2.config-files.md) 的多格式支持与懒加载机制
- 查看各配置文件的具体键位含义：[路由配置](../3.routing/1.configuration.md)、[数据库配置](../5.database/1.configuration.md)、[日志配置](../7.logging/3.configuration.md)
