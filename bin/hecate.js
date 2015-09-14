#!/usr/bin/env node

var program = require('commander');
var packageJson = require('./package');
var fs = require('fs');
var listThemes = require('./lib/listThemes');

program.version(packageJson.version)

program
	.command('create <file>')
	.description('create the template html <file>')
	.option('-m, --theme <items>', 'use the theme to create the page, default is ' + listThemes.DEFAULT_THEME, listThemes())
	.option('-t, --title [value]', 'the page title, default is input file name')
	.option('-A, --author [value]', 'the page author, default will from your computer')
	.option('-D, --document', 'generate the doument comment')
	.option('-d, --desc [value]', 'the page description, default is empty')
	.option('-k, --keywords [value]', 'the page keywords for seo, default is input file name')
	.action(function(file, options) {
		// console.log('sdfsdfsadadasdasd');
    // console.log('exec "%s" using %s mode', value, options.exec_mode);
		excuteAction('create', file, options);
	})
	.on('--help', function() {
		console.log('  Example:');
		console.log("    create test.html -A 'Alex' -t 'Example'");
		console.log('');
	})

//--

program
	.command('list')
	.alias('ls')
	.description('list the content')
	.option('-m, --theme', 'list all the themes')
	.action(function(options) {
    //console.log('exec "%s" using %s mode', value, options.exec_mode);
		excuteAction('list', null, options);
	})
	.on('--help', function() {
		console.log('  Example:');
		console.log("    list -m");
		console.log('');
	})

// program
//   .command('*')
//   .action(function(env){
//     console.log('deploying "%s"', env);
//   });

program.parse(process.argv);

//--

if (!process.argv.slice(2).length) {
	program.outputHelp();
}

function excuteAction(action, value, options) {
	var handler = require('./lib/cmd_actions/' + action);
	try {
		handler.call(null, value, options);
	} catch (error) {
		console.log('error', error.stack);
	}
}
