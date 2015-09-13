var listThemes = require('../listThemes');
var listThemesFuc = listThemes();

module.exports = function(target, options) {
	// console.dir(options);
  if(options.theme) {
  	var thems = listThemesFuc();
  	thems.forEach(function(theme) {
  		console.log(theme);
  	})
  } 
}
