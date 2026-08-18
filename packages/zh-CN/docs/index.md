---
navOrder: -10
---

# 入门指南

欢迎来到 Viswoole 框架入门指南。本系列文档将帮助你从零开始快速上手 Viswoole，掌握基于 Swoole 协程的高性能 PHP 开发。

## 文档导航

### 快速开始

| 文档                                                     | 说明                                     |
| -------------------------------------------------------- | ---------------------------------------- |
| [快速开始](1.getting-started/index.md)                   | 5 分钟上手，运行你的第一个 Viswoole 应用 |
| [安装说明](1.getting-started/1.installation.md)          | 环境要求、安装步骤、依赖管理             |
| [项目结构介绍](1.getting-started/2.project-structure.md) | 目录结构解析、各模块职责说明             |

### 核心概念

| 文档                                                  | 说明                           |
| ----------------------------------------------------- | ------------------------------ |
| [核心概念总览](2.core-concepts/index.md)              | 架构层次、初始化流程与学习路径 |
| [依赖注入](2.core-concepts/1.dependency-injection.md) | 容器工作原理、绑定与解析机制   |
| [事件系统](2.core-concepts/2.event-system.md)         | 发布订阅模式与解耦通信         |
| [协程基础](2.core-concepts/3.coroutine.md)            | Swoole 协程模型与单例隔离      |
| [门面模式](2.core-concepts/4.facade.md)               | 静态代理与全局辅助函数         |
| [参数校验](2.core-concepts/5.validation.md)           | 类型系统与自定义扩展规则       |

### 路由系统

| 文档                                              | 说明                                   |
| ------------------------------------------------- | -------------------------------------- |
| [路由系统总览](3.routing/index.md)                | 两种注册方式对比与核心特性             |
| [配置文件路由](3.routing/1.configuration.md)      | Router 门面用法与动态参数              |
| [注解路由](3.routing/2.annotation.md)             | Controller/AutoController/RouteMapping |
| [路由分组](3.routing/3.route-group.md)            | 前缀、中间件与嵌套分组                 |
| [API 文档生成](3.routing/4.api-doc-generation.md) | 注解驱动自动生成接口文档               |

### 控制器与请求处理

| 文档                                                 | 说明                           |
| ---------------------------------------------------- | ------------------------------ |
| [控制器总览](4.controllers/index.md)                 | 注解驱动控制器与最佳实践       |
| [创建控制器](4.controllers/1.creating-controller.md) | AutoController 与 RESTful 设计 |
| [自动参数注入](4.controllers/2.auto-injection.md)    | GET/POST/Header/File 注入详解  |
| [Request 对象](4.controllers/3.request-object.md)    | 请求数据获取与 XSS 过滤机制    |
| [Response 对象](4.controllers/4.response-object.md)  | 响应构建与状态码管理           |
| [文件上传](4.controllers/5.file-upload.md)           | 文件接收、验证与安全处理       |

### 数据库与模型

| 文档                                        | 说明                       |
| ------------------------------------------- | -------------------------- |
| [数据库总览](5.database/index.md)           | ORM 系统架构与快速开始     |
| [数据库配置](5.database/1.configuration.md) | 多通道配置与读写分离       |
| [查询构造器](5.database/2.query-builder.md) | 链式 CRUD 操作与条件查询   |
| [ORM 模型](5.database/3.orm-model.md)       | 模型定义、生命周期与访问器 |
| [关联查询](5.database/4.relations.md)       | 一对一/一对多关系与预加载  |
| [数据库迁移](5.database/5.migrations.md)    | 版本化管理表结构           |

### 缓存系统

| 文档                             | 说明                       |
| -------------------------------- | -------------------------- |
| [缓存总览](6.cache/index.md)     | 架构概览与快速开始         |
| [基本用法](6.cache/1.usage.md)   | 读写过期与高级特性         |
| [缓存驱动](6.cache/2.drivers.md) | File 驱动与 Redis 驱动详解 |
| [缓存标签](6.cache/3.tags.md)    | 分组管理与批量清除         |

### 日志系统

| 文档                                     | 说明                        |
| ---------------------------------------- | --------------------------- |
| [日志总览](7.logging/index.md)           | 日志体系架构说明            |
| [使用方法](7.logging/1.usage.md)         | 记录与写入模式              |
| [日志级别](7.logging/2.levels.md)        | 标准级别与扩展级别          |
| [日志通道](7.logging/3.channels.md)      | File 驱动详细参数与存储结构 |
| [日志配置](7.logging/4.configuration.md) | 开发环境与生产环境配置对比  |

### 高级特性

| 文档                                          | 说明                           |
| --------------------------------------------- | ------------------------------ |
| [高级特性总览](8.advanced/index.md)           | 进阶功能导航                   |
| [异步任务](8.advanced/1.async-task.md)        | TaskManager 注册投递与等待 API |
| [中间件](8.advanced/2.middleware.md)          | MiddlewareInterface 与常用模式 |
| [服务事件 HOOK](8.advanced/3.service-hook.md) | Swoole 生命周期钩子注册        |
| [自定义驱动](8.advanced/4.custom-driver.md)   | 缓存/日志/数据库扩展开发指南   |
| [控制台命令](8.advanced/5.console.md)         | 内置命令列表与自定义命令开发   |

### 配置管理

| 文档                                          | 说明                           |
| --------------------------------------------- | ------------------------------ |
| [配置总览](9.configuration/index.md)          | 配置体系概述                   |
| [环境变量](9.configuration/1.env.md)          | .env 文件格式与 env() 函数使用 |
| [配置文件](9.configuration/2.config-files.md) | 多格式支持与 config() 访问方式 |
| [延迟加载](9.configuration/3.lazy-load.md)    | 延迟加载机制与性能优化策略     |

### 部署运维

| 文档                                              | 说明                       |
| ------------------------------------------------- | -------------------------- |
| [部署总览](10.deployment/index.md)                | 生产部署检查清单           |
| [生产配置](10.deployment/1.production-config.md)  | Swoole 参数调优与安全加固  |
| [容器化部署](10.deployment/2.container-deploy.md) | Docker/Kubernetes 编排方案 |

## 框架概览

Viswoole 是一款基于 [Swoole](https://www.swoole.com/) 协程的高性能 PHP 后端框架，致力于为开发者提供简洁、高效、可扩展的开发体验。

### 核心特性

- **协程高性能** — 基于 Swoole 协程引擎，相比传统 PHP-FPM 模式拥有数量级的性能提升
- **优雅的依赖注入** — IOC 容器自动解析构造函数依赖，无需手动管理对象生命周期
- **内置参数校验** — 类型校验 + 扩展规则双重保障，告别手写 validate 的繁琐
- **服务发现机制** — 自动扫描注册服务，支持灵活的自定义扩展
- **异步任务管理** — 内置轻量级 Task 管理器，中小型项目开箱即用
- **API 文档自动生成** — 注解驱动，自动生成请求/响应结构化文档

### 环境要求

| 依赖          | 版本要求 |
| ------------- | -------- |
| PHP           | >= 8.3   |
| Swoole 扩展   | >= 5.1   |
| fileinfo 扩展 | \*       |
| redis 扩展    | \*       |
| pdo 扩展      | \*       |
| sockets 扩展  | \*       |
| Composer      | 最新版   |

> **提示**：在开始之前，请确保你的开发环境已满足以上要求。详细的安装步骤请参阅 [安装说明](1.getting-started/1.installation.md)。
