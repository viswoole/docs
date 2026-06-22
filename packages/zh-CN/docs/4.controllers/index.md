# 控制器总览

控制器是 Viswoole 框架处理 HTTP 请求的核心组件，负责接收请求参数、执行业务逻辑并返回响应数据。框架提供了灵活的控制器注册方式和强大的自动参数注入机制，让开发者能够高效地构建 API 接口。

## 核心特性

- **自动路由注册**：通过注解自动将控制器方法映射为 HTTP 路由
- **参数自动注入**：支持 GET、POST、Header、File 等多种数据源的自动注入
- **类型安全**：基于 PHP 严格类型和自定义验证规则，确保数据合法性
- **DTO 对象映射**：支持将请求数据自动转换为类型化的 DTO 对象
- **高性能**：推荐使用静态方法，避免实例化开销

## 控制器模式

Viswoole 提供两种控制器注册模式：

| 模式       | 注解                | 特点                                  | 适用场景               |
| ---------- | ------------------- | ------------------------------------- | ---------------------- |
| 自动控制器 | `#[AutoController]` | 所有 public 方法自动注册为路由        | RESTful API、CRUD 操作 |
| 手动控制器 | `#[Controller]`     | 仅注册带 `#[RouteMapping]` 注解的方法 | 需要精确控制路由的场景 |

## 快速示例

```php
<?php
declare(strict_types=1);

namespace App\\Controller;

use Viswoole\\HttpServer\\AutoInject\\InjectGet;
use Viswoole\\Router\\Annotation\\AutoController;

/**
 * 用户控制器示例
 */
#[AutoController]
class UserController
{
    /**
     * 获取用户列表
     *
     * @param int $page 页码
     * @param int $size 每页数量
     * @return array 用户列表
     */
    public static function list(
        #[InjectGet] int $page = 1,
        #[InjectGet] int $size = 10
    ): array {
        // 业务逻辑...
        return ['page' => $page, 'size' => $size, 'data' => []];
    }

    /**
     * 获取用户详情
     *
     * @param int $id 用户ID
     * @return array 用户信息
     */
    public static function detail(#[InjectGet] int $id): array
    {
        return ['id' => $id, 'name' => 'Test User'];
    }
}
```

访问路径：

- `GET /usercontroller/list?page=1&size=10` → `UserController::list()`
- `GET /usercontroller/detail?id=100` → `UserController::detail()`

> **说明**：`#[AutoController]` 未设置 `prefix` 时，路径使用完整类名小写化（如 `UserController` → `usercontroller`），不去除 `Controller` 后缀。

## 文档导航

- [创建控制器](1.creating-controller.md) - 了解如何创建和配置控制器
- [自动参数注入](2.auto-injection.md) - 掌握参数注入的详细用法
- [Request 对象详解](3.request-object.md) - 深入理解请求对象的能力
- [Response 对象详解](4.response-object.md) - 学习响应对象的完整用法
- [文件上传处理](5.file-upload.md) - 处理文件上传的完整指南

## 最佳实践

### 1. 使用静态方法

```php
// ✅ 推荐：静态方法，无实例化开销
public static function index(): array
{
    return [];
}

// ❌ 避免：实例方法（除非需要维护状态）
public function index(): array
{
    return [];
}
```

### 2. 保持方法简洁

每个控制器方法应专注于单一职责，复杂逻辑应抽离到 Service 层：

```php
// ✅ 推荐：薄控制器，调用 Service 层
public static function userInfo(#[InjectPost] UserInfo $dto): array
{
    return UserService::getUserInfo($dto);
}

// ❌ 避免：在控制器中编写大量业务逻辑
public static function userInfo(#[InjectPost] UserInfo $dto): array
{
    // 几十行业务代码...
}
```

### 3. 使用 DTO 对象进行数据验证

对于复杂的请求体，使用 DTO 对象配合验证注解：

```php
public static function create(#[InjectPost] CreateUserDto $dto): array
{
    // $dto 已经过验证，可直接使用
    return UserService::create($dto);
}
```

### 4. 合理使用返回类型

根据接口需求选择合适的返回类型：

```php
// 返回数组（自动转为 JSON）
public static function list(): array { ... }

// 返回 ResponseInterface（完全控制响应）
public static function download(Response $response): ResponseInterface
{
    return $response->sendfile('/path/to/file.pdf');
}

// 返回字符串（直接作为响应体）
public static function hello(#[InjectGet] string $name): string
{
    return "Hello, {$name}!";
}
```

## 常见问题

### Q: 控制器的命名空间有什么要求？

A: 控制器必须位于 `App\Controller` 命名空间下，框架会自动扫描该目录。

### Q: 如何修改控制器的路由前缀？

A: 通过 `#[AutoController(prefix: 'api/v1')]` 或配置文件设置。

### Q: 私有方法和受保护方法会注册为路由吗？

A: 不会，只有 `public` 方法会被自动注册为路由。

### Q: 可以在同一个类上同时使用 AutoController 和 Controller 吗？

A: 不可以，`AutoController` 已继承 `Controller`，二者选一即可。
