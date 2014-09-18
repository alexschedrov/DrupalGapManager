#!/usr/bin/env node
var commands = require('../lib/commands'),
  dgm_core = require('../lib/dgm_core'),
  argv = require('minimist')(process.argv.slice(2)),
  args = argv._;

dgm_core.bootstrap(commands, args, argv);
