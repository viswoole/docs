# 控制器与请求处理

控制器（Controller）是 HTTP 请求的业务入口：接收参数、执行业务逻辑、返回响应。Viswoole 通过 PHP 8 注解（Attribute）将控制器方法声明为路由，并基于依赖注入容器自动解析方法参数，让控制器保持轻薄。

## 请求处理流程

一个 HTTP 请求进入框架后的完整链路（入口为 `HttpEventHandle::onRequest`）：

1. Swoole 回调触发，框架将原始请求/响应封装为 `RequestInterface` 与 `ResponseInterface` 对象；
2. 路由分发器按「路径 + 请求方法 + 域名」匹配路由（注解路由与编程式路由共用一张路由表）；
3. 依次经过全局、服务级、路由级中间件；
4. 容器解析控制器方法参数（自动注入 → 类型校验 → 验证规则）并调用；
5. 根据返回值类型选择响应方式，完成输出。

## 本章内容

| 文档 | 类型 | 内容 |
| --- | --- | --- |
| [创建控制器](1.creating-controller.md) | 教程 | 控制器目录约定、注解注册、实例化时机、方法参数解析顺序 |
| [自动注入注解](2.auto-injection.md) | 参考 | `#[InjectGet]`、`#[InjectPost]`、`#[InjectHeader]`、`#[InjectFile]` 完整行为 |
| [Request 请求对象](3.request-object.md) | 参考 | 请求参数、请求头、Cookie、URI、上传文件的完整 API |
| [Response 响应对象](4.response-object.md) | 参考 | JSON/HTML 响应、状态码、Cookie、重定向、文件下载的完整 API |
| [文件上传](5.file-upload.md) | 操作指南 | `#[InjectFile]` 注入、`UploadedFile` 处理、文件校验与安全存储 |

## 关键机制速览

### 控制器按请求实例化

控制器类由容器反射创建，实例缓存于当前请求的协程上下文，请求结束即销毁。因此每个请求都会得到全新的控制器实例：可以在构造函数中安全注入依赖，也不必担心请求之间的状态污染。

### 方法参数解析顺序

控制器方法参数按固定流水线解析（细节见[创建控制器](1.creating-controller.md#方法参数解析顺序)）：

1. **取值**：动态路由变量（`{id}` 按参数名匹配）优先，其次方法默认值；
2. **前置注入注解**：`#[InjectGet]` 等以当前值为兜底，从指定请求数据源取值；
3. **类型校验**：内置类型做转换校验，类/接口类型由容器解析实例（如 `RequestInterface`）；
4. **验证规则**：`#[Min]`、`#[Length]` 等验证注解依次执行，失败抛出 `ValidateException`。

### 获取请求数据的三种方式

```php
use Viswoole\HttpServer\AutoInject\InjectGet;
use Viswoole\HttpServer\Contract\RequestInterface;
use Viswoole\HttpServer\Facade\Request;

// 方式一：注解注入（推荐，声明即校验）
public function show(#[InjectGet] int $id): array {}

// 方式二：类型注入，由容器解析 Request 实例
public function show(RequestInterface $request): array {}

// 方式三：静态门面，在任意位置读取请求数据
$id = Request::get('id');
```

## 相关章节

- [注解路由](../3.routing/2.annotation.md)：`#[Controller]`、`#[AutoController]`、`#[RouteMapping]` 注解参数详解
- [中间件](../3.routing/4.middleware.md)：在请求前后统一处理横切逻辑
- [验证器](../2.core-concepts/5.validation.md)：内置验证规则与自定义规则
- [容器](../2.core-concepts/1.container.md)：依赖注入与协程级单例隔离
