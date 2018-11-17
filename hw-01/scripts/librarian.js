const fs = require('fs');
const path = require('path');

const Clerk = require('./helpers/clerk').Clerk;
const Args = require('./helpers/args');

let settings = Args.parse({
  from: '../mess', // default mess directory path
  to: '../result', // default target result path
  debug: false, // default debug mode (log some process in console)
  delsrc: false // default flag to delete source directory
}, ['from', 'to']);

Args.validate(settings.from, settings.to, () => {
  const clerk = new Clerk(settings.debug);
  clerk.log(settings);
});
