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

### Dir

#### Get a subdirectory (which is another Dir / has the same api)

``` js
log.Dir('widget'); // This does not 'create' the directory (see *directory existence*).
```

### Get a file

``` js
log.File('stats'); // This does not create the file.
```

### Contents

``` js
log.contents().then(function(contents) {
  console.log(contents); // { dirs: [], files: [] }
});
```

Probably need `log` to be non-empty for a clearer example ;-)

```
log.File('widget/debug').write(new Buffer('widget created'));
log.File('stats').write(new Buffer('juicy stats'));

log.contents().then(function(contents) {
  console.log(contents); // { dirs: ['widget'], files: ['stats'] }
});
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

## Directory Existence

I've decided to make this abstraction not distinguish between empty directories and directories which don't exist. Git has this behaviour too. I think it results in a simpler abstraction. A filesystem cares about *files*, not directories. Directories only exist to contain files. There's actually a test that explicitly states that an abstract directory does not share the `.exists` method that a file provides.

One way to think about it is that all possible directories always exist, and are just empty (except of course the finite number of directories that are non-empty). This makes the silent 'creation' of directories needed to support a file at a location of your request a very natural thing, because as far as `abstract-fs` is concerned, the directories were already there. When using the `System` backed implementation of `abstract-fs`, 'real' directories are created as necessary, and when deleting the last file of a directory, the directory is deleted too. The policy is to balance separating you from this distinction with being conservative about silent operations.

Your mileage may vary if there is a pre-existing complex structure of empty directories or if something else is creating empty directories where `abstract-fs` is operating. `abstract-fs` is still experimental (although it is pretty well-tested), and this is especially true for this tricky situation. Please file an issue if you encounter any behaviour you feel should be adjusted.

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
