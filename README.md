# abstract-fs
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Code Climate](https://codeclimate.com/github/voltrevo/abstract-fs/badges/gpa.svg)](https://codeclimate.com/github/voltrevo/abstract-fs)
> An abstract filesystem that can be backed in-memory or the real filesystem.


## Install

```sh
$ npm install --save abstract-fs
```


## Usage

``` js
'use strict';

var abstractFs = require('abstract-fs');
```

### System

#### Get a reference to a file

``` js
// This refers to the path to foobar, so if it gets moved, it won't be followed
var foobar = abstractFs.System.File('foobar');
```

#### Write to a file

``` js
foobar.write(
  new Buffer('Contents of foobar.\n')
);
```

#### Read from a file

``` js
foobar.read().then(function(foobarData) {
  console.log(foobarData.toString()); // Contents of foobar.
});
```

#### Delete a file

``` js
foobar.delete().then(function() {
  console.log('Finished deleting foobar.');
});
```

#### Check file existence

``` js
foobar.exists().then(function(exists) {
  console.log('foobar', (exists ? 'exists' : 'doesn\'t exist'));
});
```

## License

MIT © [Andrew Morris](http://andrewmorris.io/)


[npm-image]: https://badge.fury.io/js/abstract-fs.svg
[npm-url]: https://npmjs.org/package/abstract-fs
[travis-image]: https://travis-ci.org/voltrevo/abstract-fs.svg?branch=master
[travis-url]: https://travis-ci.org/voltrevo/abstract-fs
[daviddm-image]: https://david-dm.org/voltrevo/abstract-fs.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/voltrevo/abstract-fs
[coveralls-image]: https://coveralls.io/repos/voltrevo/abstract-fs/badge.svg
[coveralls-url]: https://coveralls.io/r/voltrevo/abstract-fs
