tablelist.js
============

Tablelist Javascript SDK for Angular.js

#### Dependencies
The SDK relies on Angular.js and ngResource
```
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-resource.min.js"></script>
```

#### Download
Production (minified):
```
<script src="//assets.tablelist.com/js/tablelist/VERSION/tablelist.js"></script>
``` 

Development:
```
<script src="//assets.tablelist.com/js/tablelist/VERSION/tablelist-dev.js"></script>
``` 

Development
===========

Start by installing gulp globally if you have not already:
```
npm install -g gulp
```

Install gulp dependencies
```
npm install
```


#### Build SDK

Simply call:
```
make
```
This will build `tablelist.js` and `tablelist-dev.js` in the `./build` directory.

#### Testing

To run the unit tests call:
```
make tests
```

You can also open `./test/index.html` manually.