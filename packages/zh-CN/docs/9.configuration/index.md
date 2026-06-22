# 配置管理

Viswoole 提供灵活的配置管理系统，支持多格式配置文件、环境变量注入、延迟加载和运行时动态修改，满足从开发到生产各阶段的需求。

## 文档导航

| 文档                          | 说明                         |
| ----------------------------- | ---------------------------- |
| [环境变量](1.env.md)          | .env 文件与 env() 函数使用   |
| [配置文件](2.config-files.md) | config/ 目录结构与多格式支持 |
| [延迟加载](3.lazy-load.md)    | 懒加载机制与性能优化         |

## 核心组件

```
┌─────────────────────────────────────────────┐
│              配置访问层                       │
│         config('database.host')             │
├─────────────────────────────────────────────┤
│              Config 管理器                    │
│  ┌──────────┬──────────┬──────────┐        │
│  │  PHP     │   JSON   │ YAML/INI │        │
│  │  配置文件  │  配置文件  │  配置文件  │        │
│  └──────────┴──────────┴──────────┘        │
├─────────────────────────────────────────────┤
│              Env 环境变量                     │
│          .env + getenv()                    │
└─────────────────────────────────────────────┘
```

## 快速开始

```php
// 读取配置值
$debug = config('app.debug');           // 布尔值
$timezone = config('app.default_timezone');    // 字符串

// 多级访问（点号分隔）
// 注意：cache.php 默认仅配置了 file 驱动，如需访问 redis 请先在 cache.php 中配置 redis store
$cacheDriver = config('cache.default');  // 当前默认缓存驱动

// 获取默认值
$debug = config('app.debug', false);    // 不存在时返回 false

// 获取全部配置
$all = config();

// 设置运行时配置（仅当前进程有效）
// 注意：config() 辅助函数仅支持读取，写入需使用 Config 门面
use Viswoole\\Core\\Facade\\Config;
Config::set(['app.debug' => false]);

// 使用门面
Config::get('app.debug');
Config::set('app.debug', false);
Config::has('app.debug');
```
