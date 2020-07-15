#!/bin/bash
set -e

export PATH="/app/node_modules/.bin:/app/vendor/bundle/$RUBY_VERSION/bin:$PATH"
cp npmrc ~/.npmrc || true
mkdir -p public/js

if [ -z "$SKIP_RUBY_SETUP" ]; then
  bundle check || bundle install -j "$(nproc)"
  mkdir -p tmp/pids

  rm -f tmp/pids/*.pid
  if [ -z "$SKIP_DB_WAIT" ]; then
    dockerize -wait tcp://timur_db:5432 -timeout 60s
    ./bin/timur migrate
  fi
fi

if [ -n "$RUN_NPM_INSTALL" ]; then
  npm install --unsafe-perm

  if [ -z "$MASTER_BUILD" ]; then
    echo 'Not master build, performing link to local etna-js...'
    npm link ../etna/packages/etna-js
  fi

  ./bin/timur create_routes
fi

exec "$@"
