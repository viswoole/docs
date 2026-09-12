# 高级特性

在掌握容器、路由与控制器之后，本组文档介绍框架面向生产场景的进阶能力：异步任务、生命周期钩子、服务提供者、命令行工具与全局助手函数。它们分别解决「耗时操作不阻塞请求」「介入服务进程生命周期」「组织模块级服务」「运维与自动化」「减少样板代码」五类问题。

## 文档导航

| 文档 | 类型 | 说明 |
| --- | --- | --- |
| [异步任务](1.async-task.md) | 操作指南 | 基于 Swoole Task 的任务注册、投递、队列持久化与结果等待 |
| [生命周期钩子](2.lifecycle-hooks.md) | 参考 | ServerEventHook 事件钩子与 HTTP 请求处理流程 |
| [服务提供者](3.service-provider.md) | 操作指南 | 编写与注册服务提供者、依赖包服务发现 |
| [命令行](4.console.md) | 参考 | 内置命令全表与自定义命令开发 |
| [助手函数](5.helpers.md) | 参考 | 17 个全局助手函数签名速查 |

## 能力速览

```php
use Viswoole\\Core\\Facade\\Task;
use Viswoole\\Core\\Server\\ServerEventHook;

// 异步任务：注册主题后投递，不阻塞当前请求
Task::register('email', \\App\\Task\\SendEmailTask::class);
Task::emit('email.notify', ['to' => 'user@example.com']);

// 生命周期钩子：Worker 进程启动时执行一次的初始化逻辑
ServerEventHook::addEvent('workerStart', function (\\Swoole\\Server $server, int $workerId): void {
    // 仅在业务 Worker 进程中执行
    if (!$server->taskworker) {
        // 预热缓存、注册定时器等
    }
});
```

命令行运维统一通过项目根目录的 `viswoole` 入口执行：

```bash
php viswoole server:start    # 启动服务
php viswoole server:reload   # 重载 Worker 进程
php viswoole server:close    # 关闭服务
```

## 阅读建议

- **首次接触异步任务**：按 [异步任务](1.async-task.md) → [生命周期钩子](2.lifecycle-hooks.md) 顺序阅读，前者依赖后者介绍的 `workerStart` 等概念。
- **组织业务代码**：模块化的服务注册方式见 [服务提供者](3.service-provider.md)，它与容器的关系在 [容器](../2.core-concepts/1.container.md) 中有更基础的说明。
- **写脚本、做部署**：[命令行](4.console.md) 与 [助手函数](5.helpers.md) 适合作为速查手册，遇到具体函数时再来查。
- **常驻内存注意事项**：本组特性全部运行在 Swoole 常驻进程内，请务必先阅读 [协程与常驻内存](../2.core-concepts/4.coroutine.md) 中的红线规则。

## 与其他章节的关系

- 生命周期钩子与框架级事件（`FrameworkEvent`）是两套机制，二者的分工对比见 [事件系统](../2.core-concepts/3.event-system.md)。
- 服务提供者是配置加载与依赖包集成的枢纽，相关配置文件说明见 [配置文件](../9.configuration/2.config-files.md)。
- 命令行中的部署类用法（守护进程、生产配置）在 [部署](../10.deployment/index.md) 章节有完整实践。
