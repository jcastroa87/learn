# ---- Stage 1: Install Composer dependencies ----
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader

COPY . .
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative

# ---- Stage 2: Production image with FrankenPHP ----
FROM dunglas/frankenphp:1-php8.3-bookworm

RUN install-php-extensions \
    pdo_pgsql \
    zip \
    bcmath \
    opcache \
    pcntl \
    intl

# OPcache + JIT configuration
RUN echo '\
opcache.enable=1\n\
opcache.memory_consumption=256\n\
opcache.interned_strings_buffer=64\n\
opcache.max_accelerated_files=32531\n\
opcache.validate_timestamps=0\n\
opcache.save_comments=1\n\
opcache.jit_buffer_size=128M\n\
opcache.jit=1255\n\
' > $PHP_INI_DIR/conf.d/opcache.ini

# Upload limits
RUN echo '\
upload_max_filesize=10M\n\
post_max_size=12M\n\
memory_limit=256M\n\
' > $PHP_INI_DIR/conf.d/uploads.ini

# Use production php.ini
RUN cp $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini

WORKDIR /app

COPY --from=vendor /app/vendor ./vendor
COPY . .

# Ensure storage and cache directories are writable
RUN mkdir -p storage/framework/{sessions,views,cache} \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Caddyfile for FrankenPHP
RUN echo '{\n\
    auto_https off\n\
    admin off\n\
}\n\
\n\
:8083 {\n\
    root * /app/public\n\
    encode zstd gzip\n\
    php_server\n\
}\n\
' > /etc/caddy/Caddyfile

EXPOSE 8083

CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
