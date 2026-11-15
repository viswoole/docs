# 监控（Monitoring）

慢请求监控（Slow Request Monitor）是框架内置的**旁路观测设施**：当一个 HTTP 请求的耗时超过阈值时，把该请求的元信息、参数、响应、数据库与缓存操作明细整理成一份已脱敏的 JSON 快照，交给可替换的存储实现（默认写入 `runtime/slow-requests` 目录）。它帮助你回答「这条慢请求慢在哪」——是某条 SQL 拖了后腿，还是缓存频繁未命中，抑或是响应体过大。

监控全程旁路运行：任何内部失败（配置异常、存储不可用等）只记录告警，绝不影响业务响应；未达到阈值的请求不产生任何写入成本。

## 文档导航

| 文档 | 类型 | 说明 |
| --- | --- | --- |
| [慢请求监控](1.slow-request-monitor.md) | 操作指南 | 启用监控、配置采集范围、请求关联 ID、快照记录结构 |
| [隐私与采集预算](2.privacy-and-limits.md) | 参考 | 内置脱敏规则、按路径敏感字段、SQL/绑定值开关、字节与条数预算、自定义正文裁剪 |
| [记录写入器与扩展点](3.trace-writer.md) | 参考 | `TraceWriterInterface` 契约、自定义写入器、缓存监控装饰器、`TraceContext` API |

## 能力速览

```php
// config/monitor.php —— 开箱即用，仅两行配置即可启用
return [
  'enabled' => true,
  // 需要文件日志时指定内置写入器；也可在服务提供者中绑定自己的实现
  'writer'  => \\Viswoole\\Monitor\\Writer\\JsonTraceWriter::class,
  // 超过 500ms 的请求才写入记录；0 表示记录全部请求（开发调试用）
  'threshold_ms' => 500,
];
```

```php
// 业务代码中随时可拿到当前请求的关联 ID（与快照和响应头一致）
use Viswoole\\Monitor\\TraceContext;

$requestId = TraceContext::requestId(); // 未启用监控时为 null
```

```php
// 缓存操作会被自动装饰器采集（store、operation、key、结果摘要），无需任何改动
use Viswoole\\Core\\Facade\\Cache;

Cache::store('redis')->set('user:1', $user, 3600);
```

## 阅读建议

- **只想尽快用起来**：读 [慢请求监控](1.slow-request-monitor.md) 即可，两行配置 + 重启生效。
- **关心数据安全**：监控默认会脱敏密码、令牌等敏感字段并隐藏 SQL 绑定值，但建议完整阅读 [隐私与采集预算](2.privacy-and-limits.md)，按业务追加敏感字段。
- **想接入 ELK / ClickHouse 等外部系统**：实现 [记录写入器](3.trace-writer.md) 中的 `TraceWriterInterface` 即可，收到的快照已完成脱敏与限额。

## 与其他章节的关系

- 监控在 HTTP 入口（`HttpEventHandle::onRequest`）挂载采集，请求生命周期见 [生命周期钩子](../8.advanced/2.lifecycle-hooks.md)。
- 数据库与缓存操作的采集点位于连接池与缓存商店内部，原理见 [数据库](../5.database/index.md) 与 [缓存](../6.cache/index.md)。
- 默认写入器基于框架文件日志（JSON 模式）实现，日志系统说明见 [日志](../7.logging/index.md)。
- 生产环境建议配合 [生产配置](../10.deployment/1.production-config.md) 调整阈值与预算，避免快照占用过多磁盘。
