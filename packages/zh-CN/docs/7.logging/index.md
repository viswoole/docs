# 日志

Viswoole 日志系统为 Swoole 协程环境设计：协程内产生的日志先聚合缓存，协程结束时一次性批量写入，显著减少 IO 次数；同时支持多通道（Channel）、按级别路由、调用来源追踪与控制台彩色输出。

## 核心特性

- **协程聚合写入**：日志先缓存在当前协程的记录器（Recorder）中，协程结束批量落盘，一条请求几十条日志只有一次 IO
- **级别快捷方法**：`alert` / `error` / `warning` / `info` / `debug` / `sql` / `task` 七个级别开箱即用，`mixed()` 支持任意自定义级别
- **多通道（Channel）**：不同日志可写入不同目标，`type_channel` 配置可将指定级别（如 error）路由到独立通道
- **来源追踪**：可选记录日志调用的文件与行号，便于定位问题
- **控制台输出**：开发环境可同步输出带 ANSI 颜色的日志到终端
- **自动清理**：内置 File 驱动按天分目录存储，并通过定时器每日自动清理过期日志

## 快速开始

```php
use Viswoole\Log\Facade\Log;

// 记录业务信息
Log::info('用户登录', ['uid' => 1, 'channel' => 'password']);

// 记录运行时错误
Log::error('支付回调失败', ['order_id' => 'ORD001', 'msg' => '验签失败']);

// SQL / 任务等业务专用级别
Log::sql('查询执行完成', ['sql' => $sql, 'time' => '2.3ms']);

// 任意自定义级别（如 PSR-3 的 emergency）
Log::mixed('emergency', '数据库连接池耗尽', ['pool_size' => 64]);
```

## 架构概览

```text
Log Facade（静态门面）
   │ 转发调用
   ▼
LogManager（管理器：级别路由 + 来源注入）
   │ type_channel 命中 → 指定通道（可多个）
   │ 未命中            → default 通道
   ▼
DriveInterface（驱动契约）          协程内：Recorder（聚合缓存，析构时批量 save）
   ├── Collector（级别快捷方法）  ─┐
   └── Drive（抽象基类）          ─┴─ Drives\File（内置文件驱动）
```

一次典型写入路径：`Log::info(...)` → `LogManager` 注入调用来源并按级别选通道 → 通道驱动的 `record()` 把日志推入当前协程的 `Recorder` → 协程结束时 `Recorder` 析构，调用驱动的 `save()` 批量持久化。

## 配置文件

日志配置位于 `config/log.php`：

```php
use Viswoole\Log\Drives\File;

return [
  // 默认通道
  'default' => 'file',
  // 按日志级别指定写入通道，例如：['error' => 'email']
  'type_channel' => [],
  // 是否跟踪日志来源
  'trace_source' => true,
  // 是否同时将日志输出到控制台（只建议在开发环境中使用）
  'console' => false,
  // 日志通道，驱动需继承 \Viswoole\Log\Drive 或实现 \Viswoole\Log\Contract\DriveInterface
  'channels' => [
    'file' => File::class,
  ],
];
```

## 文档导航

| 文档 | 类型 | 说明 |
| --- | --- | --- |
| [使用指南](1.usage.md) | 操作指南 | 各级别方法、协程聚合写入与通道操作 |
| [级别与通道](2.levels-and-channels.md) | 参考 | 级别体系、type_channel 路由与控制台输出 |
| [配置详解](3.configuration.md) | 参考 | log.php 全配置项、File 驱动与自定义驱动 |
