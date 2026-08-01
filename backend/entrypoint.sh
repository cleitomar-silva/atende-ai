#!/bin/sh
set -e

if [ ! -f vendor/autoload.php ]; then
    echo "Instalando dependências do Composer..."
    composer install --no-interaction --prefer-dist
fi

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=.' .env; then
    php artisan key:generate
fi

exec "$@"
