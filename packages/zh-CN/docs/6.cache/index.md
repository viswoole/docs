# 缓存

Viswoole 缓存系统通过门面（Facade）提供统一的键值缓存接口，屏蔽底层存储差异：业务代码面向 `Viswoole\Cache\Facade\Cache` 编程，即可在 File、Redis 或自定义驱动之间无缝切换，并内置缓存标签与竞争锁两类高频能力。

## 核心特性

- **多驱动支持**：内置 File（文件）与 Redis 两种驱动，通过配置切换，支持自定义驱动扩展
- **缓存标签（Tag）**：将多个缓存键归入逻辑分组，支持按组批量清除
- **竞争锁（Lock）**：基于驱动实现的分布式锁，支持重试等待、过期兜底与自动解锁
- **连接池（Connection Pool）**：Redis 驱动基于协程连接池管理连接，按协程借出、协程结束自动归还
- **门面调用**：无需依赖注入即可全局静态调用，多商店可按名称切换

## 快速开始

```php
use Viswoole\Cache\Facade\Cache;

// 写入缓存，3600 秒后过期
Cache::set('user:1', ['name' => '张三'], 3600);

// 读取缓存，不存在时返回默认值
$user = Cache::get('user:1', null);

// 标签分组：写入时关联标签，之后可一键清除整组缓存
Cache::tag('user:1')->set('profile:1', $profile, 3600);
Cache::tag('user:1')->clear();

// 竞争锁：防止并发重复处理
$lockId = Cache::lock('order:create', 10);
try {
    // 临界区业务...
} finally {
    Cache::unlock($lockId);
}
```

## 架构概览

```text
Cache Facade（静态门面）
   │ 转发调用
   ▼
CacheManager（多商店管理器）
   │ store('file') / store('redis') / store('自定义')
   ▼
CacheDriverInterface（驱动契约）
   ├── Driver\File    文件驱动（默认）
   ├── Driver\Redis   Redis 驱动（连接池）
   └── Driver\Tag     标签实现（依附于任意驱动）
```

`CacheManager` 在服务启动时读取 `config/cache.php` 的 `default` 与 `stores` 配置完成商店注册，所有未指定商店的调用都会转发到默认商店的驱动实例。

## 配置文件

缓存配置位于 `config/cache.php`：

```php
use Viswoole\Cache\Facade\Cache;

return [
  // 默认商店名称
  'default' => env('cache.store', 'file'),
  // 商店列表，键为商店名，值为驱动定义（类名 / 配置数组 / 实例）
  'stores' => [
    'file' => Cache::FILE_DRIVER,
  ],
];
```

## 文档导航

| 文档 | 类型 | 说明 |
| --- | --- | --- |
| [使用指南](1.usage.md) | 操作指南 | 读写、过期控制、数值增减、竞争锁等日常操作 |
| [缓存驱动](2.drivers.md) | 参考 | File / Redis 驱动参数、连接池与自定义驱动扩展 |
| [缓存标签](3.tags.md) | 操作指南 | 标签分组写入与批量清除 |
