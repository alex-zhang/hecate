var fs = require('fs');
var os = require('os');
var path = require('path');
var readAppFileSync = require('../readAppFileSync');
var envUsername = require('../envUserName');
var listThemes = require('../listThemes');
var override_mixin = require('../override_mixin');
var marked = require('marked');
var process_md_meta = require('../process_md_meta');
var highlight = require('highlight.js');

module.exports = function(file, options) {
  // console.dir(options);
  if(!file) {
    console.log("");
    console.log("  Error u must type a file name");
    console.log("");
    options.help('create');
    return;
  }

  var extname = path.extname(file);
  if(extname !== '.html' && extname !== '.md') {
    console.log("");
    console.log("  Error u must type a file ext name which is .md or .html");
    console.log("");
    options.help('create');
    return;
  }

  var isCreateMarkdownMode = extname === '.md';
  var isCreateTemplateMode = options.template;
  if(isCreateMarkdownMode && !isCreateTemplateMode && !fs.existsSync(file)) {
    console.log("");
    console.log("  Error the file is not exsit! u need use: '-p' flag to create .md file first");
    console.log("");
    options.help('create');
    return;
  }

  var theme = options.theme || listThemes.DEFAULT_THEME;
  var hasDoc = !!options.document;
  var commandOptionsHTMLContext = createCommandOptionsHTMlContext(file, options);

  var buildPromise;
  // console.log(options.markdown);

  console.log("------------------------------------------------------------");
  console.log("  Build Start:");
  console.log("");

  var startTime = new Date().getTime();

  if(isCreateMarkdownMode) {
    if(isCreateTemplateMode) {
      buildPromise = createMarkdownTemplatePromise(file, theme);
    } else {//here is create html by exsit markdown file.
      buildPromise = createMarkdownHTMLByMarkdownTemplatePromise(file,
        theme,
        hasDoc,
        commandOptionsHTMLContext);
    }
  } else {
    buildPromise = createHTMLPromise(file,
      theme,
      hasDoc,
      commandOptionsHTMLContext);
  }

  buildPromise.then(
    function(file) {
      console.log(`  Build Success:                         `);
      console.log(`                 file: ${file}`);
      console.log(`                 time: ${gettimeDiff(startTime)}s`);
      console.log("------------------------------------------------------------");
    },
    function(reason) {
      console.log(`  Build Error:                           `);
      console.log(`               reason: ${reason}`);
      console.log(" ");
      if(reason instanceof Error) {
        console.log(`${reason.stack}`);
      }

      console.log("------------------------------------------------------------");
    })
}

//------------------------------------------------------------------------------
function createMarkdownTemplatePromise(file, theme) {
  // console.log("createHTMLPromise");
  return readThemeTempalteContentPromise(theme, 'template.md')
    .then(function(fileContent) {
      return writeMarkdownContentFile(file, fileContent);
    }
  );
}
//------------------------------------------------------------------------------

function createMarkdownHTMLByMarkdownTemplatePromise(file,
  theme,
  hasDoc,
  commandOptionsHTMLContext) {
  // console.log("createMarkdownHTMLByMarkdownTemplatePromise");
  var layoutHTMLContent, markdownContent, themeContent;
  var templateHTMLContent;

  return Promise.all([
    readTempalteContentPromise('layout.html'),
    readFileContentPromise(file),
    readThemeTempalteContentPromise(theme, 'theme.css'),
  ])
  .then(function(values) {
    layoutHTMLContent = values[0];
    markdownContent = values[1];
    themeContent = values[2];
    return createHTMLContentFromMarkdownContentPromise(markdownContent);
  })
  .then(function(fileContent) {
    templateHTMLContent = fileContent;
    return createHTMLTemplateFileContentContextPromise(layoutHTMLContent, hasDoc);
  })
  .then(function(templateHTMLFileContext) {
    var htmlContext = override_mixin({},
      commandOptionsHTMLContext)(templateHTMLFileContext)({
      '${impress_style}': themeContent,
      '${impress_template}': templateHTMLContent
    })();
    return replaceTemplateHTMLContentTemplateCharsPromise(layoutHTMLContent, htmlContext);
  })
  .then(function(filecontent) {
    return writeHTMLContentFile(`${file}`, filecontent);
  })
}

//------------------------------------------------------------------------------
function createHTMLPromise(file,
  theme,
  hasDoc,
  commandOptionsHTMLContext) {
  // console.log("createHTMLPromise" , file);
  var layoutHTMLContent, templateHTMLContent, themeContent;

  return Promise.all([
    readTempalteContentPromise('layout.html'),
    readThemeTempalteContentPromise(theme, 'template.html'),
    readThemeTempalteContentPromise(theme, 'theme.css'),
  ])
  .then(function(values) {
    layoutHTMLContent = values[0];
    templateHTMLContent = values[1];
    themeContent = values[2];
    return createHTMLTemplateFileContentContextPromise(layoutHTMLContent, hasDoc);
  })
  .then(function(templateHTMLFileContext) {
    var htmlContext = override_mixin({}, commandOptionsHTMLContext)(templateHTMLFileContext)({
      '${impress_style}': themeContent,
      '${impress_template}': templateHTMLContent
    })();
    return replaceTemplateHTMLContentTemplateCharsPromise(layoutHTMLContent, htmlContext);
  })
  .then(function(filecontent) {
    return writeHTMLContentFile(`${file}`, filecontent);
  })
}

//------------------------------------------------------------------------------

function writeHTMLContentFile(file, fileContent) {
  return writeExtcontentFile(file, fileContent, '.html');
}

function writeMarkdownContentFile(file, fileContent) {
  return writeExtcontentFile(file, fileContent, '.md');
}

function writeExtcontentFile(file, fileContent, ensureExt) {
  var extname = path.extname(file);
  if(extname !== ensureExt ) {
    if(!extname) {
      file = file + ensureExt;
    } else {
      file = file.replace(extname, ensureExt);
    }
  }
  return writeContentFile(file, fileContent);
}

function writeContentFile(file, fileContent) {
  return new Promise(function(resolve, reject) {
    try {
      fs.writeFileSync(file, fileContent);
    } catch(error) {
      reject(file);
      return;
    }
    resolve(file);
  });
}

function readThemeTempalteContentPromise(theme, templateFileName) {
  return new Promise(function(resolve) {
    var templateContent = readAppFileSync(`./themes/${theme}/${templateFileName}`);
    resolve(templateContent);
  });
}

function readTempalteContentPromise(templateFileName) {
  return new Promise(function(resolve) {
    var templateContent = readAppFileSync(`./templates/${templateFileName}`);
    resolve(templateContent);
  });
}

function readFileContentPromise(file) {
  return new Promise(function(resolve) {
    var fileContent = fs.readFileSync(file, 'utf-8') || '';
    resolve(fileContent);
  });
}

function replaceTemplateHTMLContentTemplateCharsPromise(templateHTMLContent, htmlContext) {
  return Promise.resolve(
    templateHTMLContent.replace(getHTMLTemplateReplaceReg(),
      function(matchChars) {
        // console.log(htmlContext);
        if(htmlContext.hasOwnProperty(matchChars)) {
          return htmlContext[matchChars];
        }
        return matchChars;
      })
  );
}

function createHTMLTemplateFileContentContextPromise(htmlTemplateContent, hasDoc) {
  var matchCharsArr = htmlTemplateContent.match(getHTMLTemplateReplaceReg());
  var context = {};
  matchCharsArr.forEach(function(matchChars) {
    var validChars = matchChars.slice(2, -1);
    //we think file here.
    if(validChars.endsWith('.txt') ||
        validChars.endsWith('.js') ||
        validChars.endsWith('.css')) {
      if(validChars.startsWith('doc_') && !hasDoc) {
        context[matchChars] = '';
      } else {
        try {
          context[matchChars] = readAppFileSync('./templates/' + validChars);
        } catch(error) {
          context[matchChars] = matchChars;
        }
      }
    }
  });

  return Promise.resolve(context);
}

function createHTMLContentFromMarkdownContentPromise(markdownFileContent) {
  return new Promise(function(resolve, reject) {
    var renderer = new marked.Renderer();
    var originCode = renderer.code;
    var metaIdx = 0;
    var hasMetaEndFlag = false;
    var hasFirstMeta = false;

    renderer.code = function(codeText, language) {
      switch(language) {
        case 'embed-js':
          return `\n<script>${codeText}\n</script>`;
          break;
        case 'embed-css':
          return `\n<style>${codeText}\n</style>`;
          break;
        case 'embed-html':
          return codeText;
          break;
        case 'meta-end':
          if(!hasMetaEndFlag) {
            hasMetaEndFlag = true;
            //close the meta tag.
            return "</div>\n";
          }
          return '';
          break;
        case 'meta':
          var results = '';
          if(hasFirstMeta) {
            //close the meta tag.
            results += "</div>\n";
          }
          results += process_md_meta(codeText, metaIdx);
          metaIdx++;
          hasFirstMeta = true;
          return results;
          break;
      }

      return originCode.apply(renderer, arguments);
    }

    marked(markdownFileContent, {
        renderer: renderer,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: function (lang, codeText) {
          // console.log("=======================\n", highlight.highlight(codeText, lang, true).value);
          return highlight.highlight(codeText, lang, true).value;
        }
    },
    function(err, htmlContent) {
      if(err) {
        reject(err);
      } else {
        if(!hasMetaEndFlag) {
          //we need close the meta tag here
          resolve(htmlContent + '\n</div>');
        } else {
          resolve(htmlContent);
        }
      }
    });
  });
}

//-------------------------------------------------------------------------------

function getHTMLTemplateReplaceReg() {
  return /\${[\w|.]*}/g;
}

function createCommandOptionsHTMlContext(file, options) {
  return {
      '${title}': options.title || path.basename(file, path.extname(file)),
      '${author}': options.author || envUsername(),
      '${description}': options.desc || '',
      '${keywords}': options.keywords || path.basename(file, path.extname(file))
    }
}

function gettimeDiff(startTime) {
  return (new Date().getTime() - startTime) * 0.001;
}