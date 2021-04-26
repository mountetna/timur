FROM etna-base
# Perform these steps first to allow better caching behavior
COPY src/Gemfile src/Gemfile.lock /app/
RUN bundle install
COPY src/package.json src/package-lock.json /app/
RUN npm install
COPY src /app/

ARG APP_NAME
ARG RUN_NPM_INSTALL
ARG SKIP_RUBY_SETUP=1
RUN /entrypoints/build.sh
RUN npm run build
