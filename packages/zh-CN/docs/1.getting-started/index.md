# 快速开始

本指南将在 5 分钟内带你完成 Viswoole 项目的创建、启动，并运行第一个 Hello World 应用。

## 前置条件

在开始之前，请确保你的开发环境已安装：

- **PHP >= 8.3**
- **Swoole 扩展 >= 5.1**
- **Composer**（PHP 包管理器）

> 环境安装的详细步骤请参阅 [安装说明](1.installation.md)。

## 创建项目

使用 Composer 创建一个新的 Viswoole 项目：

```bash
composer create-project viswoole/viswoole myProject
```

执行完成后，进入项目目录：

```bash
cd myProject
```

## 安装依赖

项目创建后，安装 Composer 依赖：

```bash
composer install
```

安装过程中会自动执行以下初始化命令：

- `vendor:publish` — 发布框架资源文件到项目
- `service:discover` — 扫描并注册服务提供者
- `command:discover` — 扫描并注册自定义命令

## 启动服务

使用 Viswoole CLI 启动 HTTP 服务：

```bash
# 前台启动（开发调试推荐）
php viswoole server:start http

# 后台启动（生产环境推荐，-d 表示 daemon 模式）
php viswoole server:start http -d
```

服务启动成功后，默认监听 `http://0.0.0.0:9501`，在浏览器中访问即可看到欢迎页面。

## 第一个路由

打开 `config/route/route.php`，你将看到框架生成的默认路由配置。让我们修改它来返回一个简单的 Hello World：

```php
<?php
declare (strict_types=1);

use Viswoole\\HttpServer\\Request;
use Viswoole\\HttpServer\\Response;
use Viswoole\\Router\\Facade\\Router;

// 根路径路由
Router::get('/', function (Request $request, Response $response) {
    return $response->html('<h1>Hello Viswoole</h1>');
})->setTitle('Welcome');

// 404 兜底处理
Router::miss(function (Request $request, Response $response) {
    return $response->status(404)->json([
        'message' => 'Not Found',
        'code' => 404
    ]);
});
```

修改保存后，如果使用了热重载（见下方），服务会自动重启；否则需要手动执行 [热重载](#热重载) 或 [重启服务](#管理服务)。

## 第一个控制器

在 `app/Controller/` 目录下创建控制器文件。Viswoole 支持通过注解（Attribute）自动注册路由：

```php
<?php
declare (strict_types=1);

namespace App\\Controller;

use Viswoole\\Router\\Annotation\\{AutoController, RouteMapping};
use Viswoole\\HttpServer\\AutoInject\\InjectGet;
use Viswoole\\HttpServer\\Facade\\Response;

/**
 * 示例控制器
 *
 * 使用 #[AutoController] 注解标记后，框架会自动扫描并注册该控制器下的路由。
 */
#[AutoController]
class Example
{
    /**
     * Hello World 路由
     *
     * 通过 #[InjectGet] 自动从 GET 请求参数中注入 $name，
     * 默认值为 'Viswoole'。
     *
     * @param string $name 名称参数
     * @return string HTML 响应内容
     */
    #[RouteMapping(method: 'GET', paths: '/hello')]
    public function hello(#[InjectGet] string $name = 'Viswoole'): string
    {
        return "<h1>Hello, {$name}!</h1>";
    }
}
```

访问 `http://localhost:9501/hello?name=World` 即可看到输出：`Hello, World!`

> **关键概念说明**：
>
> - `#[AutoController]` — 控制器级注解，标记后该类会被自动扫描注册
> - `#[RouteMapping]` — 方法级注解，定义 HTTP 方法和路径映射
> - `#[InjectGet]` — 参数注入注解，自动从 GET 请求中提取对应参数并进行类型校验

## 管理服务

Viswoole CLI 提供了完整的服务生命周期管理命令：

```bash
# 启动服务
php viswoole server:start http

# 强制启动服务 （如果服务已经启动，则先关闭后重新启动）
php viswoole server:start http -f

# 后台启动服务 （生产环境推荐）
php viswoole server:start http -d

# 热重载/重启服务（默认重载 worker 进程，不中断服务）
php viswoole server:reload http

# 仅重载 task 进程（传入 -t 参数）
php viswoole server:reload http -t

# 强制重启整个服务（关闭全部进程后重新启动，传入 -f 参数）
php viswoole server:reload http -f

# 关闭服务
php viswoole server:close http
```

> 以上命令中的 `http` 为服务名称，对应 `config/server.php` 中定义的服务键名。如果不传服务名称，则默认操作 `config/server.php` 中 `default_start_server` 指定的服务（默认 `http`）。

## 热重载

Viswoole 内置了基于文件监控的热重载脚本 `watch`，可在代码修改后自动重启服务：

```bash
# 监听默认服务（http）的文件变化
/bin/sh watch

# 指定监听的服务名称
/bin/sh watch http
```

该脚本基于 `find` 轮询实现，无需安装额外依赖，具备防抖机制（默认 1 秒），连续修改只触发一次重启。

## 下一步

完成快速开始后，建议继续阅读以下文档以深入了解框架：

- [安装说明](1.installation.md) — 了解详细的环境配置与依赖管理
- [项目结构介绍](2.project-structure.md) — 熟悉项目的目录结构与模块职责
