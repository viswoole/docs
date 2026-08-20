# 数据库

Viswoole 提供了功能完善的数据库系统，支持多种数据库驱动、查询构造器、ORM 模型、关联关系等特性。本文档将系统介绍 Viswoole 数据库的完整使用方法。

## 架构概览

```
┌─────────────────────────────────────────────────────┐
│                    应用层 (App)                      │
├─────────────────────────────────────────────────────┤
│                   Db 门面 (Facade)                    │
│         table() / channel() / transaction()          │
├──────────────────┬──────────────────────────────────┤
│   查询构造器      │        ORM 模型 (Model)           │
│   QueryBuilder   │    CRUD / 关联 / 访问器            │
├──────────────────┴──────────────────────────────────┤
│              数据库通道 (Channel)                     │
│              PDOChannel / ...                        │
├─────────────────────────────────────────────────────┤
│              PDO / MySQL / PostgreSQL                │
└─────────────────────────────────────────────────────┘
```

## 核心特性

| 特性           | 说明                                    |
| -------------- | --------------------------------------- |
| **多通道支持** | 支持配置多个数据库连接，可灵活切换      |
| **查询构造器** | 链式调用 API，支持复杂条件查询          |
| **ORM 模型**   | 面向对象的数据操作，支持访问器/修改器   |
| **关联关系**   | 一对一、一对多关联及预加载              |
| **事务管理**   | 支持手动事务、闭包事务与嵌套事务        |
| **软删除**     | 可选的软删除机制，支持恢复数据          |
| **自动时间戳** | 自动维护 create_time / update_time 字段 |
| **分块查询**   | 支持 cursor 和 chunk 处理大数据量       |

## 快速开始

### 基础查询

```php
use Viswoole\\Database\\Facade\\Db;

// 查询所有用户
$users = Db::table('users')->select();

// 按主键查找，返回 DataSet 对象（空结果时为空 DataSet，非 null）
$user = Db::table('users')->find(1);

// 判断是否查询到记录应使用 isEmpty()，空 DataSet 在 PHP 中恒为 truthy
if (!$user->isEmpty()) {
    echo $user->name;
}

// 条件查询
$admins = Db::table('users')
    ->where('role', 'admin')
    ->where('status', 1)
    ->select();
```

### ORM 模型

```php
namespace App\\Model;

use Viswoole\\Database\\Model;

class UsersModel extends Model
{
    protected string $table = 'users';
    protected string $pk = 'id';
}

// 使用模型查询
$user = UsersModel::find(1);
$users = UsersModel::where('status', 1)->select();
```

### 事务操作

```php
use Viswoole\\Database\\Facade\\Db;

// 闭包事务（推荐）
Db::startTransaction(function () {
    Db::table('users')->insert(['name' => '张三']);
    Db::table('logs')->insert(['action' => 'create_user']);
});

// 手动事务
Db::startTransaction();
try {
    Db::table('users')->insert(['name' => '张三']);
    Db::commit();
} catch (\\Throwable $e) {
    Db::rollBack();
}
```

### 嵌套事务

同一协程内事务支持多层嵌套，内层事务基于数据库 `SAVEPOINT` 实现，可独立回滚而不影响外层：

```php
Db::startTransaction(function () {          // 外层事务
    Db::table('users')->insert(['name' => '张三']);
    try {
        Db::startTransaction(function () {  // 内层事务（SAVEPOINT）
            Db::table('logs')->insert(['action' => 'debug']);
            throw new \\RuntimeException('内层失败');
        });
    } catch (\\RuntimeException) {
        // 内层已独立回滚：logs 记录被丢弃，外层事务不受影响、可继续使用
    }
    Db::table('orders')->insert(['user_id' => 1]);
}); // 最终落库：users 与 orders，logs 被内层回滚丢弃
```

嵌套规则：

- `commit()` / `rollBack()` 始终作用于**当前最内层**事务，各层需按后开先关（LIFO）顺序收尾；
- 内层 `rollBack()` 仅回滚到该层保存点，只丢弃该层作用域内的写入，外层数据不受影响；
- 内层 `commit()` 仅释放保存点，数据仍受最外层事务保护，最外层提交时才真正落库；
- `Db::transactionLevel()` 返回当前嵌套层级（`0` 表示当前协程无事务）。

> **注意**：
>
> - 跨通道/跨库事务不保证原子性（无两阶段提交），需跨库原子性的业务请自行实现补偿逻辑；
> - 事务基于协程上下文隔离，不同协程各自开启的事务互不影响。

## 文档导航

| 文档                             | 说明                                 |
| -------------------------------- | ------------------------------------ |
| [数据库配置](1.configuration.md) | 配置文件说明、环境变量、多通道设置   |
| [查询构造器](2.query-builder.md) | CRUD 操作、条件查询、聚合、连接查询  |
| [ORM 模型](3.orm-model.md)       | 模型定义、CRUD、软删除、访问器修改器 |
| [关联查询](4.relations.md)       | 一对一、一对多关联定义与使用         |
| [数据库迁移](5.migrations.md)    | 迁移基础说明                         |
