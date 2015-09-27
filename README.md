# abstract-fs
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Code Climate](https://codeclimate.com/github/voltrevo/abstract-fs/badges/gpa.svg)](https://codeclimate.com/github/voltrevo/abstract-fs)
> An abstract filesystem that can be backed in-memory or by the real filesystem.


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

A pure javascript implementation. Asynchrony is only here to fulfill the same contract as other implementations.

#### Get a directory abstraction

``` js
var log = abstractFs.Memory.Dir();
```

#### Get a file abstraction

``` js
var foobar = abstractFs.Memory.File();
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

``` js
var writes = Promise.all([
  log.File('widget/debug').write(new Buffer('widget created')),
  log.File('stats').write(new Buffer('juicy stats'))
]);

writes.then(
  log.contents
).then(function(contents) {
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

One way to think about it is that all possible directories always exist, and are just empty (except of course the finite number of directories that are non-empty). Remembering that `.Dir(path)` doesn't mutate the filesystem in any way, you can actually ask for the contents of any directory (that hasn't been written to) and see that it's empty:

``` js
abstractFs.Memory.Dir().Dir('any-random-new-path-here').contents().then(function(contents) {
  console.log(contents); // { dirs: [], files: [] }
});
```

This makes the silent 'creation' of directories needed to support a file at a location of your request a very natural thing:

``` js
var memoryFs = abstractFs.Memory.Dir(); // System will do this too.

var writePromise = memoryFs.File('long/path/to/file').write(
  new Buffer('Hooray for eliminating edge cases!')
);

writePromise.then(function() {
  return Promise.all([
    memoryFs.contents,
    memoryFs.Dir('long').contents,
    memoryFs.Dir('path').contents,
    memoryFs.Dir('to').contents
  ]);
}).then(function(contentsList) {
  console.log(contentsList); /*
    [ { dirs: ['long'], files: []       },
      { dirs: ['path'], files: []       },
      { dirs: ['to']  , files: []       },
      { dirs: []      , files: ['file'] } ]
  */
});
```

As far as `abstract-fs` is concerned, the directories were already there. When using the `System` backed implementation of `abstract-fs`, 'real' directories are created as necessary, and when deleting the last file of a directory, the directory is deleted too. The policy is to balance separating you from this distinction with being conservative about silent operations.

Your mileage may vary if there is a pre-existing complex structure of empty directories or if something else is creating empty directories where `abstract-fs` is operating. `abstract-fs` is still experimental (although it is pretty well-tested), and this is especially true for this tricky situation. Please file an issue if you encounter any behaviour you feel should be adjusted.

## Testing

Staying on top of testing for this project is a high priority. There are some gaps in testing the private utilities, which should also probably be replaced with standard tools or made into their own modules, but the public api is well tested. A key feature is that the Memory and System implementations are mostly fed into exactly the same tests. The System implementation has a few more to test that it successfully writes to the real filesystem.

You can browse the test code in the `test` directory. Tests for the abstract api that are shared by Memory and System are generated using the code in `test/describers`.

``` sh
git clone git@github.com:voltrevo/abstract-fs.git
cd abstract-fs
npm install
npm test
```

```
> abstract-fs@0.0.2 test /Users/andrew/workspaces/abstract-apis/abstract-fs
> gulp

[23:02:46] Using gulpfile ~/workspaces/abstract-apis/abstract-fs/gulpfile.js
[23:02:46] Starting 'static'...
[23:02:46] Starting 'pre-test'...
[23:02:47] Finished 'pre-test' after 1.44 s
[23:02:47] Starting 'test'...


  Memory
    Dir
      implements empty dir
        ✓ contains nothing
        ✓ doesn't have an exists function
        ✓ after creating foo and bar, deleting foo does not delete bar
        ✓ file.exists throws an error when the path contains a file
        ✓ can enumerate its contents
        ✓ writing a file where the path contains a dir throws
        foo implements non-existent file
          ✓ doesn't exist
          ✓ reading throws because it doesn't exist
          ✓ deleting throws because it doesn't exist
          ✓ can be created
          ✓ file can be deleted
          ✓ throws if you try to write a non-buffer
        foo directory
          ✓ sees bar created from the parent directory
          foo/bar implements non-existent file
            ✓ doesn't exist
            ✓ reading throws because it doesn't exist
            ✓ deleting throws because it doesn't exist
            ✓ can be created
            ✓ file can be deleted
            ✓ throws if you try to write a non-buffer
          implements empty dir
            ✓ contains nothing
            ✓ doesn't have an exists function
            ✓ after creating foo and bar, deleting foo does not delete bar
            ✓ file.exists throws an error when the path contains a file
            ✓ can enumerate its contents
            ✓ writing a file where the path contains a dir throws
            foo implements non-existent file
              ✓ doesn't exist
              ✓ reading throws because it doesn't exist
              ✓ deleting throws because it doesn't exist
              ✓ can be created
              ✓ file can be deleted
              ✓ throws if you try to write a non-buffer
            foo directory
              ✓ sees bar created from the parent directory
              foo/bar implements non-existent file
                ✓ doesn't exist
                ✓ reading throws because it doesn't exist
                ✓ deleting throws because it doesn't exist
                ✓ can be created
                ✓ file can be deleted
                ✓ throws if you try to write a non-buffer
    File
      direct-file implements non-existent file
        ✓ doesn't exist
        ✓ reading throws because it doesn't exist
        ✓ deleting throws because it doesn't exist
        ✓ can be created
        ✓ file can be deleted
        ✓ throws if you try to write a non-buffer

  System
    Dir
      ✓ can write a file to a directory
      contents
        directories only included when non-empty
          ✓ single empty directory not included
          ✓ directory with empty directory not included
          ✓ directory with file included
          ✓ directory with directory with file included
      implements empty dir
        ✓ contains nothing
        ✓ doesn't have an exists function
        ✓ after creating foo and bar, deleting foo does not delete bar
        ✓ file.exists throws an error when the path contains a file
        ✓ can enumerate its contents
        ✓ writing a file where the path contains a dir throws
        foo implements non-existent file
          ✓ doesn't exist
          ✓ reading throws because it doesn't exist
          ✓ deleting throws because it doesn't exist
          ✓ can be created
          ✓ file can be deleted
          ✓ throws if you try to write a non-buffer
        foo directory
          ✓ sees bar created from the parent directory
          foo/bar implements non-existent file
            ✓ doesn't exist
            ✓ reading throws because it doesn't exist
            ✓ deleting throws because it doesn't exist
            ✓ can be created
            ✓ file can be deleted
            ✓ throws if you try to write a non-buffer
          implements empty dir
            ✓ contains nothing
            ✓ doesn't have an exists function
            ✓ after creating foo and bar, deleting foo does not delete bar
            ✓ file.exists throws an error when the path contains a file
            ✓ can enumerate its contents
            ✓ writing a file where the path contains a dir throws
            foo implements non-existent file
              ✓ doesn't exist
              ✓ reading throws because it doesn't exist
              ✓ deleting throws because it doesn't exist
              ✓ can be created
              ✓ file can be deleted
              ✓ throws if you try to write a non-buffer
            foo directory
              ✓ sees bar created from the parent directory
              foo/bar implements non-existent file
                ✓ doesn't exist
                ✓ reading throws because it doesn't exist
                ✓ deleting throws because it doesn't exist
                ✓ can be created
                ✓ file can be deleted
                ✓ throws if you try to write a non-buffer
    File
      direct-file implements non-existent file
        ✓ doesn't exist
        ✓ reading throws because it doesn't exist
        ✓ deleting throws because it doesn't exist
        ✓ can be created
        ✓ file can be deleted
        ✓ throws if you try to write a non-buffer

  afsPath
    check
      ✓ true for valid paths
      ✓ false for invalid paths
    validate
      ✓ doesn't throw for valid paths
      ✓ throws for invalid paths

  bind
    no args missing
      ✓ returns a function which takes no arguments
    single arg missing
      ✓ binds last two args
      ✓ binds outside args
      ✓ binds first two args
    two args missing
      ✓ binds first arg
      ✓ binds second arg
      ✓ binds third arg
    three args missing
      ✓ calls the original function


  105 passing (459ms)

--------------------------|----------|----------|----------|----------|----------------|
File                      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------------|----------|----------|----------|----------|----------------|
 lib/                     |      100 |      100 |      100 |      100 |                |
  afsPath.js              |      100 |      100 |      100 |      100 |                |
  index.js                |      100 |      100 |      100 |      100 |                |
 lib/Memory/              |      100 |      100 |      100 |      100 |                |
  Dir.js                  |      100 |      100 |      100 |      100 |                |
  File.js                 |      100 |      100 |      100 |      100 |                |
  UnderlyingFilesystem.js |      100 |      100 |      100 |      100 |                |
  index.js                |      100 |      100 |      100 |      100 |                |
 lib/Memory/util/         |      100 |      100 |      100 |      100 |                |
  delay.js                |      100 |      100 |      100 |      100 |                |
  isPrefix.js             |      100 |      100 |      100 |      100 |                |
 lib/System/              |      100 |       70 |      100 |      100 |                |
  Dir.js                  |      100 |     62.5 |      100 |      100 |                |
  File.js                 |      100 |      100 |      100 |      100 |                |
  index.js                |      100 |      100 |      100 |      100 |                |
 lib/util/                |      100 |      100 |      100 |      100 |                |
  PromiseMap.js           |      100 |      100 |      100 |      100 |                |
  handleError.js          |      100 |      100 |      100 |      100 |                |
  promiseFilter.js        |      100 |      100 |      100 |      100 |                |
  promiseSomeSerial.js    |      100 |      100 |      100 |      100 |                |
--------------------------|----------|----------|----------|----------|----------------|
All files                 |      100 |    91.67 |      100 |      100 |                |
--------------------------|----------|----------|----------|----------|----------------|


=============================== Coverage summary ===============================
Statements   : 100% ( 230/230 )
Branches     : 91.67% ( 33/36 )
Functions    : 100% ( 91/91 )
Lines        : 100% ( 229/229 )
================================================================================
[23:02:48] Finished 'test' after 923 ms
[23:02:48] Starting 'coveralls'...
[23:02:48] Finished 'coveralls' after 14 μs
[23:02:50] Finished 'static' after 4.05 s
[23:02:50] Starting 'default'...
[23:02:50] Finished 'default' after 16 μs
```

## TODO

- Simple access to System dirs/files that are temporary using require('tmp').
- LocalStorage implementation.
- File wrapper transformation for appending.
- Filesystem wrapper transformations e.g. utf-8, json, hash functions.
- Listening to change events via fsevents/polling/etc.
- Throttling/squashing change events.
- Synchronization of filesystems. (Conflict resolution?)
- Socket implementation.

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
