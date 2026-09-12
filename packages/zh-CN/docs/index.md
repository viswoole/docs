# Viswoole 文档

Viswoole 是一个基于 PHP 8.4 与 Swoole 协程引擎构建的高性能常驻内存框架：以依赖注入容器为核心，通过注解（Attribute）驱动路由、参数注入与验证，内置连接池与协程隔离机制，让传统 PHP 开发习惯无缝迁移到全协程运行时。

## 核心特性

### 协程（Coroutine）

Swoole 常驻内存 + 全栈协程（Coroutine）运行时，IO 密集场景下可轻松承载上万并发连接。框架对容器单例做了**按请求（根协程）隔离**，每个 HTTP 请求拥有独立的容器上下文，请求结束自动销毁——你无需担心常驻内存带来的状态污染。

### 注解路由（Annotation Routing）

在控制器方法上标注 `#[RouteMapping]` 即完成路由注册，无需手动维护路由文件；`#[AutoController]` 可将整个类的公开方法一键暴露为接口。注解中的标题、描述会自动进入 API 文档。

### 依赖注入（Dependency Injection）

全局唯一的应用容器 `App::factory()` 管理服务绑定与解析，支持类名、闭包、实例多种绑定方式，控制器方法参数可按类型自动注入，配合 `#[InjectGet]`、`#[InjectPost]` 等注解实现请求参数的声明式获取。

### 参数验证（Validation）

`#[Min]`、`#[Length]`、`#[Mobile]` 等验证规则注解直接标注在方法参数上，容器注入参数时自动执行校验，失败即抛出带语义的异常，业务代码零侵入。

### API 文档（ApiDoc）

开启 `router.api_doc` 配置后，框架基于注解路由与参数注入信息自动生成接口文档：参数来源（query/body/header/file）、类型、描述、返回结构一应俱全，无需额外维护文档。

### 连接池（Connection Pool）

MySQL（PDO）与 Redis 连接由连接池统一管理，协程内自动获取与归还，避免高并发下反复建连的开销，也杜绝了连接被多个协程交叉使用的隐患。

## 环境要求速览

| 依赖项 | 版本要求 | 说明 |
| --- | --- | --- |
| PHP | >= 8.4 | 需启用 CLI 模式运行 |
| Swoole 扩展 | >= 5.1 | 协程引擎，框架核心依赖 |
| PDO 扩展 | * | 数据库访问（使用数据库功能时必需） |
| Redis 扩展 | * | Redis 客户端（缓存、连接池等功能依赖） |
| sockets 扩展 | * | 通常随 PHP 默认安装 |
| fileinfo 扩展 | * | 上传文件类型识别 |
| Composer | 最新版 | PHP 包管理器 |

::: warning:部署模式
Viswoole 基于 Swoole 常驻内存运行，**不支持** PHP-FPM / Nginx + Apache 的传统部署方式，服务通过 `php viswoole server:start` 命令直接启动，Nginx 仅作为反向代理使用。
:::

## 文档导航

### 入门

- [快速开始](1.getting-started/index.md) —— 环境准备、安装框架、启动第一个服务
- [安装说明](1.getting-started/1.installation.md) —— 环境要求、Composer 安装、常见问题
- [项目结构](1.getting-started/2.project-structure.md) —— 目录职责与请求生命周期

### 核心概念

- [核心概念](2.core-concepts/index.md) —— 容器、门面（Facade）、事件系统、协程模型、验证器

### Web 开发

- [路由](3.routing/index.md) —— 路由配置、注解路由、编程式路由、中间件、API 文档生成
- [控制器](4.controllers/index.md) —— 创建控制器、自动注入、请求与响应对象、文件上传

### 数据与状态

- [数据库](5.database/index.md) —— 连接配置、查询构建器、ORM 模型、关联关系
- [缓存](6.cache/index.md) —— 缓存使用、驱动、标签缓存
- [日志](7.logging/index.md) —— 日志使用、级别与通道、配置

### 进阶与运维

- [进阶功能](8.advanced/index.md) —— 异步任务、生命周期钩子、服务提供者、命令行、助手函数
- [配置系统](9.configuration/index.md) —— 环境变量（.env）与配置文件
- [部署上线](10.deployment/index.md) —— 生产环境配置与容器化部署

## 最小可运行示例

```php
<?php
declare(strict_types=1);

namespace App\\Controller;

use Viswoole\\Router\\Annotation\\AutoController;
use Viswoole\\HttpServer\\AutoInject\\InjectGet;

#[AutoController]
class Hello
{
    /**
     * 问好
     */
    public function index(#[InjectGet] string $name = 'Viswoole'): string
    {
        return "Hello, {$name}!";
    }
}
```

`#[AutoController]` 会将类的全部公开方法自动注册为路由（无需逐个标注 `#[RouteMapping]`），路由标题取自方法的文档注释。

启动服务后访问 `http://127.0.0.1:9501/hello/index?name=World`：

```bash
php viswoole server:start
# 服务默认监听 0.0.0.0:9501（config/server.php 中定义）
```

## 下一步

建议从 [快速开始](1.getting-started/index.md) 入手，跟随教程完成安装并跑通第一个接口；有一定基础后可阅读 [项目结构](1.getting-started/2.project-structure.md) 理解框架的运行方式。
