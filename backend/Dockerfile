FROM php:8.4-fpm-alpine AS base

RUN apk add --no-cache \
        postgresql-dev icu-dev libzip-dev oniguruma-dev \
        nginx supervisor \
    && docker-php-ext-install \
        pdo_pgsql bcmath mbstring intl zip opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --optimize

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/99-production.ini

EXPOSE 8080
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
