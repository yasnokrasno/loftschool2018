#Homeworks

###Librarian

Simple files sorting: All files from given directory 
will be moved to target directory in subdirectories,
corresponding to the first letter of the file name.

Quickstart:

``npm run hw-01``

Task will be completed in default directories with debug mode enabled.
If you want to change target or source directories you can run script directly:

``node hw-01/scripts/generate-mess.js``

``node hw-01/scripts/librarian.js -from ../mess -to ../result --debug``

Argument names are prefixed by `-` and stands before corresponding value:

* `-from` - source directory path. Default is: `"./hw-01/mess"`
* `-to` - target directory path. Default is: `"./hw-01/result"`
 
Flags are prefixed by `--`:

* `--debug` - print to the console the execution process.
* `--delsrc` - delete source directory. 

