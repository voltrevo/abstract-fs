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

These methods are synchronous because all they do is wrap the path you provide. This also means that when directories or files are moved, they won't be followed, because the abstraction doesn't know about any underlying filesystem stuff, it only cares about the path you give it.

#### Get a directory abstraction

``` js
var log = abstractFs.System.Dir('log');
```

#### Get a file abstraction

``` js
var foobar = abstractFs.System.File('foobar');
```

### Memory

*Not yet implemented.*

#### Get a directory abstraction

``` js
// var log = abstractFs.Memory.Dir('log');
```

#### Get a file abstraction

``` js
// var foobar = abstractFs.Memory.File('foobar');
```

### File

#### Write

``` js
foobar.write(
  new Buffer('Contents of foobar.\n')
);
```

#### Read

``` js
foobar.read().then(function(foobarData) {
  console.log(foobarData.toString()); // Contents of foobar.
});
```

#### Delete

``` js
foobar.delete().then(function() {
  console.log('Finished deleting foobar.');
});
```

#### Exists

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
