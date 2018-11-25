# LoftSchool Homeworks :house: :computer:

## Summary

1. [Librarian](#1-librarian) - copying files from source directory with random nesting to new sorted directory. 
Includes only two dependencies: [fs](https://nodejs.org/api/fs.html) and [path](https://nodejs.org/api/path.html)
2. Refactoing of `librarian.js` and simple Express server
   * [Librarian2](#21-librarian2) - refactored version of Librarian with Promises & Async functions

## 1. Librarian

Simple files sorting based on native NodeJS [fs](https://nodejs.org/api/fs.html) callbacks.
Trying to struggle with "callback hell" without of 
[Promises](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise), 
[Generators](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Generator) 
and [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function) features.

All files from given directory will be moved to new target directory 
in subdirectories, corresponding to the first letter of the file name.

#### Quickstart:

```
npm run hw-01-init
npm run hw-01
```

Task will be completed in default directories.
If you want to change target or source directories you can run script directly:

```
cd hw-01/scripts
node generate-mess.js -dir ../mess -fill 10 -dep 5
node librarian.js -from ../mess -to ../result
```

Argument names are prefixed by `-` and stands before corresponding value. 
Flags (without of value) are prefixed by `--`.

__generate-mess.js__

* `-dir` - (_string_) target directory path. Default is: `"../mess"`
* `-fill` - (_int_) items count for each level of target directory. 
Files are created with 80% chance, directories with 20%, respectively.
* `-dep` - (_int_) nesting depth

__librarian.js__

* `-from` - (_string_) source directory path. Default is: `"../mess"`
* `-to` - (_string_) target directory path. Default is: `"../result"`
* `--delsrc` - delete source directory. 

## 2. Librarian refactor & simple Express server

### 2.1 Librarian2

Librarian2 is equal to Librarian from first homework, but using Promises & Async functions.

#### Quickstart:

```
npm run hw-02-init
npm run hw-02
```

Arguments are parsed by [Minimist](https://www.npmjs.com/package/minimist), 
so format will be the next:

- `node generate-mess2.js --dir=../mess --fill=10 --dep=5`
- `node librarian2.js --from=../mess --to=../result`

`generate-mess2.js` uses Promises and `librarian2.js` uses Async functions.
