# 部署上线

本章解决「如何把 Viswoole 应用安全、稳定地跑在生产环境」的问题。Viswoole 基于 Swoole 常驻内存运行，部署方式与传统 PHP-FPM 应用有本质差异：进程由框架命令管理，代码变更需要重启进程才能生效。

## 先理解部署差异

传统 FPM 应用每次请求都重新加载全部代码，文件改了下次请求即生效；Viswoole 的 Worker 进程启动后代码常驻内存：

| 变更类型 | 生效方式 |
| --- | --- |
| 业务代码（控制器、服务等实现） | `server:reload` 重载 Worker 进程，或完整重启 |
| 路由、配置、`.env` | 通常需完整重启 |
| 服务提供者注册、启动期逻辑 | 必须 `server:close` + `server:start` 完整重启 |

详细的生效边界、守护模式与命令用法见 [生产环境配置](1.production-config.md)。

## 本章内容

### [生产环境配置](1.production-config.md)

操作指南，逐项完成生产部署核对：

- 关闭调试模式（框架默认开启，**必须显式关闭**）
- 以守护进程（Daemon）方式启动：`server:start -d`
- 制定重启策略：哪些变更可以 reload、哪些必须完整重启
- 开启路由缓存（`router.cache`），减少请求期路由解析开销
- 日志与连接池的生产要点
- Nginx 反向代理与 systemd 进程守护配置

### [容器化部署](2.container-deploy.md)

操作指南，基于框架仓库自带的 `Dockerfile` 与 `docker-compose.yml`：

- 解读自带镜像与编排的设计（开发态目录挂载、端口映射、服务互访）
- 启动应用与 MySQL / Redis 服务并在容器内运行框架命令
- 面向生产的镜像优化建议：镜像内安装依赖、`.dockerignore`、健康检查

## 部署前自查清单

- [ ] `.env` 中 `app_debug=false`（框架默认值为 `true`，**必须显式关闭**）
- [ ] `runtime/` 目录对运行用户可写（日志、缓存、路由缓存写入依赖它）
- [ ] 已确认重启策略：服务提供者等启动期注册的变更需 `server:close` + `server:start` 完整重启
- [ ] 生产环境建议开启路由缓存（`router.cache.enable`）
- [ ] 不要直接暴露 Swoole 端口（默认 9501），用 Nginx 反向代理对外服务
- [ ] 容器化部署时，敏感信息通过环境变量或 Secrets 注入，不打包进镜像

## 下一步

- 准备上线？从 [生产环境配置](1.production-config.md) 开始逐项核对
- 使用 Docker 或 Kubernetes？直接阅读 [容器化部署](2.container-deploy.md)
- 部署后的日志与监控：[日志](../7.logging/index.md)
