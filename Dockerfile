FROM etna-base
ARG APP_NAME
ARG RUN_NPM_INSTALL
ARG SKIP_RUBY_SETUP=1
# Perform these steps first to allow better caching behavior
ADD src/Gemfile src/Gemfile.lock /app/
RUN bundle install
ADD src/package.json src/package-lock.json /app/
RUN npm install
ADD src /app/
RUN /entrypoints/build.sh
RUN npm run build
