
default:
	gulp

release:
	gulp release

js:
	gulp
	gulp watch

tests:
	gulp
	open ./test/index.html