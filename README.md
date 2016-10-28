tablelist.js
============

Tablelist Javascript SDK for Angular.js

### Installation
`bower install tablelist-js`

#### Dependencies
The SDK relies on Angular.js and ngResource
```
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular-resource.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular-cookie.min.js"></script>
```

#### Download
Production (minified):
```
<script src="//assets.tablelist.com/js/tablelist/VERSION/tablelist.min.js"></script>
<script>tablelist('production')</script>
``` 

Development:
```
<script src="//assets.tablelist.com/js/tablelist/VERSION/tablelist.js"></script>
<script>tablelist('development')</script>
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

To watch files as you make changes run:
```
make js
``` 
This will allow you to develop and run unit tests without rebuilding from the terminal.

#### Versioning the SDK

Ensure that the version is incremented for each PR in the following files:

**./bower.json**
```
{
    "name": "Tablelist JS SDK",
 -  "version": "1.4.5",
 +  "version": "1.4.6",
```

**./package.json**
```
{
    "name": "tablelist.js",
 -  "version": "1.4.5",
 +  "version": "1.4.6",
```

Once your changes have been merged in to master, you need to create a tag for the new version. Only do this once the PR is finished.

```git tag``` will list all current tags
```git tag 1.4.6``` will create a new tag for the new version (1.4.6)
```git push --tags``` will push the tags to master

Now you should be able to run bower install and get the new version.

#### Build SDK

Simply call:
```
make
```
This will build `tablelist.js` and `tablelist-dev.js` in the `./build` directory.

or 

```
gulp release
```

for building tablelist.js, and tablelist.min.js in the `./release` directory.

#### Testing

To run the unit tests call:
```
make tests
```


You can also open `./test/index.html` manually.
