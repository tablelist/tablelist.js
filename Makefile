
default:
	gulp

release:
	gulp release

js:
	gulp
	gulp watch

build:
	gulp

test: build
	./node_modules/karma/bin/karma start karma.conf.js

test-unit:
	./node_modules/.bin/_mocha \
	tests/unit/**/*.js \
	-t 20000 -R spec

test-integration:
	./node_modules/.bin/_mocha \
	tests/integration/**/*.js \
	-t 20000 -R spec

test-runner:
	gulp
	open ./tests/test-runner/index.html