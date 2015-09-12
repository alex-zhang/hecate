var commander = require('commander');
var packageJson = require('./package');
var fs = require('fs');
var listThemes = require('./lib/listThemes');

commander
	.command('create [file]', 'create the template page')
	// .option('-tm, --theme <items>', 'use the theme to create the page, default is ' + listThemes.DEFAULT_THEME, listThemes())
	// .option('-tt, --title [value]', 'the page title, default is input file name')
	// .option('-as, --author [value]', 'the page author, default will from your computer')
	// .option('-dc, --document', 'generate the doument comment')
	// .option('-ds, --desc [value]', 'the page description, default is \'\'')
	// .option('-kw, --keywords [value]', 'the page keywords for seo, default is input file name')
	.action(function(value, options){
    console.log('exec "%s" using %s mode', value, options.exec_mode);
		// excuteAction('create', value, options);
	})
  // .on('--help', function() {
	// 	console.log('');
  // 	console.log('  Examples: ');
	// 	console.log('');
	// 	console.log('    impress-generator new example.md');
	// 	console.log('');
  // })

//--

// commander
// 	.command('themes', 'list all page themes')
// 	.action(function(value, options){
//     //console.log('exec "%s" using %s mode', value, options.exec_mode);
// 		excuteAction('themes', value, options);
// 	})
//   .on('--help', function() {
// 		console.log('');
//   	console.log('  Examples: ');
// 		console.log('');
// 		console.log('    impress-generator themes');
// 		console.log('');
//   })

//--

commander
  .version(packageJson.version)
	// .usage('<cmd> [options]')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
	commander.outputHelp();
}

function excuteAction(action, value, options) {
	// var handler = require('./lib/cmd_actions/' + action);
	try {
		// handler.call(null, value, options);
	} catch (error) {
		// console.log('error', error.stack);
	}
}
