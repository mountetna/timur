include ../make-base/stubs.mk
include ../make-base/docker-compose.mk
include ../make-base/etna-ruby.mk
include ../make-base/node.mk

# Ensure that routes.js is generated in the build output.
run-image-test::
	docker run --rm $(EXTRA_DOCKER_ARGS) -e $(app_name_capitalized)_ENV=test -e APP_NAME=$(app_name) -e RELEASE_TEST=1 $(fullTag) cat /app/public/js/routes.js
