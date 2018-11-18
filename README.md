#LoftSchool Homeworks

##01. Librarian

Simple files sorting based on native NodeJS fs callbacks.
Trying to struggle with "callback hell"
without of Promises, Generators and Async/Await features.

All files from given directory will be moved to new target directory 
in subdirectories, corresponding to the first letter of the file name.

Quickstart:

``npm run hw-01-init`` then
``npm run hw-01``

Task will be completed in default directories.
If you want to change target or source directories you can run script directly:

``cd hw-01/scripts``

``node generate-mess.js -dir ../mess -fill 10 -dep 5``

``node librarian.js -from ../mess -to ../result``

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
