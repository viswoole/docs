# 数据库

Viswoole 内置协程安全的数据库系统：通过通道（Channel）管理带连接池（Connection Pool）的数据库连接，在 Swoole 常驻内存环境下复用连接而不阻塞；在此之上提供链式调用的查询构造器（Query Builder）与 ORM 模型，覆盖从手写 SQL 到关联查询的完整场景。

> 本文依据框架源码 `src/Database/` 编写：`DbManager.php`、`BaseQuery.php`、`Model.php`、`Model/*` 与 `Channel/PDO/*`。

## 架构分层

| 层级 | 入口 | 职责 |
| --- | --- | --- |
| 门面（Facade） | `Viswoole\Database\Facade\Db` | 静态代理数据库管理器：切换通道、开启事务、执行原生 SQL |
| 查询构造器 | `Db::table()` 返回的 `BaseQuery` | 链式构建并执行参数化 SQL，运算符白名单防注入 |
| ORM 模型 | 继承 `Viswoole\Database\Model` | 表映射、自动时间戳、软删除、获取器/修改器、关联查询 |
| 数据库通道 | `PDOChannel` | 管理连接池与读写分离，将查询选项转换为参数化 SQL |

## 核心特性

| 特性 | 说明 |
| --- | --- |
| 多通道 | 支持配置多个数据库通道（连接），按名称灵活切换 |
| 连接池 | 基于 Swoole 连接池，协程间自动借还连接，无需手动管理 |
| 读写分离 | `host` 传数组即可启用多主多从，支持粘性读与强制主库 |
| 查询构造器 | 完整的 where / join / 聚合 / 分页 / 原生表达式链式 API |
| 事务 | 协程隔离的事务管理，支持嵌套（SAVEPOINT）与闭包自动提交/回滚 |
| 查询缓存 | `cache()` 一行开启，写入时自动清除对应缓存 |
| ORM 模型 | 自动时间戳、软删除、获取器/修改器、`with()` 关联预加载 |

## 快速上手

```php
use Viswoole\\Database\\Facade\\Db;
use Viswoole\\Database\\Model;

// 查询构造器：条件 + 分页查询
$list = Db::table('user')
    ->where('status', 1)
    ->whereIn('type', [1, 2])
    ->page(1, 20)
    ->select();                                  // 返回 Collection 集合

// 闭包事务：协程安全，异常自动回滚
Db::startTransaction(function () {
    Db::table('user')->insert(['name' => '张三']);
    Db::table('log')->insert(['action' => 'create_user']);
});

// ORM 模型：定义类即可获得完整 CRUD 与关联能力
class UserModel extends Model
{
    protected string $table = 'user';
    protected bool $enableSoftDelete = true;
}

$user = UserModel::find(1);
```

::: info:数据集判空
`find()` 未查到记录时返回空 `DataSet` 对象（不是 `null`），而空对象在 PHP 中恒为真值（truthy）。判断是否查到记录应使用 `$user->isEmpty()`。
:::

## 文档导航

| 文档 | 说明 |
| --- | --- |
| [数据库配置](1.configuration.md) | database.php 配置、连接池参数、读写分离、多通道 |
| [查询构造器](2.query-builder.md) | 条件、联表、聚合、分页、事务、查询缓存、原生 SQL |
| [ORM 模型](3.orm-model.md) | 模型定义、时间戳、软删除、获取器/修改器 |
| [关联关系](4.relations.md) | hasOne / hasMany / belongsToMany 与 `with()` 预加载 |

## 下一步

建议从 [数据库配置](1.configuration.md) 开始，完成通道与连接池配置后，再阅读 [查询构造器](2.query-builder.md) 与 [ORM 模型](3.orm-model.md)。
