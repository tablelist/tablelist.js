
default:
	gulp

release:
	gulp release

js:
	gulp
	gulp watch

test: release
	./node_modules/karma/bin/karma start tests/karma.conf.js

test-unit:
	./node_modules/.bin/_mocha \
	tests/unit/**/*.js \
	-t 20000 -R spec

test-int:
	./node_modules/.bin/_mocha \
	tests/integration/**/*.js \
	-t 20000 -R spec

test-runner:
	gulp
	open ./tests/test-runner/index.html