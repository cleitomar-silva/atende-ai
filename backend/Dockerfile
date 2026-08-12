FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    libpq-dev \
    postgresql-dev \
    git \
    unzip \
    && docker-php-ext-install pdo_pgsql pgsql

RUN printf 'upload_max_filesize=20M\npost_max_size=32M\nmax_file_uploads=50\n' > /usr/local/etc/php/conf.d/uploads.ini

RUN printf 'opcache.enable=1\nopcache.enable_cli=1\nopcache.validate_timestamps=1\nopcache.revalidate_freq=30\nopcache.memory_consumption=256\nopcache.max_accelerated_files=20000\nopcache.interned_strings_buffer=16\n' > /usr/local/etc/php/conf.d/opcache-settings.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]

EXPOSE 9000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=9000"]
