# 旧版网站 (txy2020) 分析与 Docker 化方案

## 1. 技术栈分析 (Tech Stack)

通过对 `res/txy2020` 的代码审计：
*   **语言**: PHP (推测兼容 PHP 5.6 - 7.4)。
*   **框架**: `phpGrace` (轻量级国产框架，版本 1.1)。
*   **数据库**: MySQL (配置文件指向 `127.0.0.1`, 库名 `a1`)。
*   **服务器**: Apache (根目录含 `.htaccess`，依赖 `mod_rewrite` 进行路由分发)。
*   **依赖管理**: 无 `composer.json`，依赖项直接包含在源码中 (`plug-ins`, `phpGrace` 目录)。
*   **外部服务**: 配置中提及阿里云 OSS (`OSS_HOST`)，但默认配置似乎使用了本地存储 (`pg_static` => `/`)。

## 2. Docker 化改造计划 (Containerization)

### 2.1 镜像选型
*   使用 `php:7.4-apache` 作为基础镜像。
*   启用 Apache `mod_rewrite` 模块（框架路由必需）。
*   安装 PHP 扩展: `mysqli`, `pdo`, `pdo_mysql`, `gd` (通常用于验证码/图片处理)。

### 2.2 配置文件适配
原 `txy2020/phpGrace/config.php` 硬编码了数据库连接：
```php
'host' => '127.0.0.1', // 在 Docker 中这是错误的，你是连不上宿主机的
'user' => 'root',
```
**改造方案**:
1.  **推荐**: 修改 `config.php` 读取环境变量 (`getenv('DB_HOST')`)。
2.  **替代**: 如果不修改源码，需配置 Docker 网络别名（较复杂），建议直接修改源码适配 Docker。

### 2.3 `docker-compose.yml`
*   **web**: 构建 PHP 镜像，端口映射 8080:80。
*   **db**: MySQL 5.7 镜像 (因代码较老，5.7 兼容性最好)。
*   **phpmyadmin**: 可选，方便查看数据。

## 3. ECS 部署可行性 (Deploy to ECS)

**结论: 完全可行 (High Feasibility)**

### 部署路径:
1.  **构建 (Build)**: 编写 `Dockerfile`，将 `res/txy2020` 代码 COPY 进镜像 `/var/www/html`。
2.  **推送 (Push)**: 将镜像推送到阿里云 ACR 或腾讯云 TCR。
3.  **数据库 (RDS)**: 在云端购买 RDS MySQL (或者在 ECS 上自建 MySQL 容器)。
4.  **运行 (Run)**:
    *   ECS + Docker Compose (最简单)。
    *   或者 ECS 裸机部署。

### 风险点:
*   **数据库迁移**: 已确认 `res/db_dump.sql` 为配套数据库备份，包含 `txy_` 前缀的完整表结构和数据。**风险已消除**。

---

## 4. 实施文件草稿

### Dockerfile
```dockerfile
FROM php:7.4-apache

# 开启 Rewrite 模块 (phpGrace路由必需)
RUN a2enmod rewrite

# 安装扩展
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql mysqli

# 复制源码
COPY . /var/www/html/

# 设置权限
RUN chown -R www-data:www-data /var/www/html
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - DB_HOST=db
      - DB_USER=root
      - DB_PWD=root
      - DB_NAME=a1
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: a1
    volumes:
      - ./db_dump.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
```

### 数据库配置修改 (实施计划)
我们将修改 `phpGrace/config.php` 以优先读取环境变量，保持本地兼容性。
```php
'host' => getenv('DB_HOST') ?: '127.0.0.1',
'user' => getenv('DB_USER') ?: 'root',
'pwd'  => getenv('DB_PWD')  ?: '',
```
