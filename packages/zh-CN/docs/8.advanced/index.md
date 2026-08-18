# 高级特性

Viswoole 框架基于 Swoole 提供了一系列高级特性，包括异步任务管理、中间件机制、服务事件钩子、驱动扩展和命令行工具。

## 文档导航

| 文档                               | 说明                       |
| ---------------------------------- | -------------------------- |
| [异步任务](1.async-task.md)        | TaskManager 任务管理与投递 |
| [中间件](2.middleware.md)          | HTTP 请求中间件机制        |
| [服务事件 HOOK](3.service-hook.md) | Swoole 服务器生命周期事件  |
| [自定义驱动](4.custom-driver.md)   | 缓存/日志/数据库驱动扩展   |
| [控制台与命令行](5.console.md)     | Symfony Console 命令行工具 |

## 特性概览

```
┌─────────────────────────────────────────────────────┐
│                   高级特性                           │
├──────────┬──────────┬───────────┬────────┬──────────┤
│ 异步任务  │  中间件  │  事件HOOK │ 驱动扩展│ 控制台   │
│          │          │           │        │          │
│ Task     │ Middleware│ Server    │ Cache  │ Command  │
│ Manager  │ Pipeline │ EventHook │ Log    │ Line     │
│          │          │           │ DB     │          │
└──────────┴──────────┴───────────┴────────┴──────────┘
```

## 快速索引

### 异步任务

```php
use Viswoole\\Core\\Facade\\Task;

// 注册任务处理器
Task::register('sms', function (TaskProxy $task) {
    sendSms($task->data['phone'], $task->data['code']);
    $task->finish('发送成功');
});

// 投递异步任务
Task::emit('sms', ['phone' => '138****8888', 'code' => '123456']);
```

### 中间件

```php
class CorsMiddleware implements MiddlewareInterface
{
    public function process(Closure $handler): mixed
    {
        response()->setHeader('Access-Control-Allow-Origin', '*');
        return $handler();
    }
}
```

### 服务事件

```php
// config/server.php
'events' => [
    'workerStart' => function ($server, $workerId) {
        // Worker 启动时执行初始化
    },
]
```
