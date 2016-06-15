
var gSimplemde;
var gFileName;

$(function() {

  splitMe.init();
  
  $("#container").height( $(window).height());
  $("#editor").height( $(window).height() - $("#topnav").outerHeight());

  $("#sidebar").height( $(window).height());
  
  /*
  $('#editor textarea').wysihtml5({
    useLineBreaks: false,
    parserRules: { tags: { p: {} }, classes: {} }
  });
  */

  gSimplemde = new SimpleMDE({
    autoDownloadFontAwesome: false,
    autofocus: true,
    autosave: {
        enabled: false,
        uniqueId: "_default",
        delay: 1000,
    },
    indentWithTabs: false,
    spellChecker: false,
    parsingConfig: {
      allowAtxHeaderWithoutSpace: false
    },
    showIcons: ["bold", "italic", "quote"],
    hideIcons: ["heading", "side-by-side", "fullscreen", "guide"]
  });
  
  $(".CodeMirror").height( $(window).height() - $("#topnav").outerHeight() - $(".editor-toolbar").outerHeight() - 32);

  $(window).resize(function() {
    $("#container").height( $(window).height());
    $("#editor").height( $(window).height() - $("#topnav").outerHeight());
    $(".CodeMirror").height( $(window).height() - $("#topnav").outerHeight() - $(".editor-toolbar").outerHeight() - 32);
    $("#sidebar").height( $(window).height());
  });

  /*
  $("#sidebar h5").click(function() { 
    $(".expander", $(this)).toggleClass("active").toggleClass("fa-plus-circle").toggleClass("fa-minus-circle");
    $($(this).siblings()[0]).slideToggle();
  });
  */

  if (window.require)
    initalize();
});

function initalize() {
  const remote = require('electron').remote;
  const Menu = remote.Menu
  const MenuItem = remote.MenuItem;
  const dialog = remote.dialog;
  const shell = remote.shell;
  
  var fs = require('fs');

  // Open links in a seperate browser window
  $(document).on('click', 'a[href^="http"]', function(event) {
     event.preventDefault();
     shell.openExternal(this.href);
  });
    
  var fileExtentions = ['txt','text','md','htm','html'];

  $('#editor .editor-toolbar').prepend('<a id="openFile" title="Open (Cmd-O)" tabindex="-1" class="fa fa-folder-open"></a>'
                                      +'<a id="saveFile" title="Save (Cmd-B)" tabindex="-1" class="fa fa-save disabled"></a>'
                                      +'<i class="separator">|</i>');
                                      
  $("#openFile").on('click', fileOpen);
  $("#saveFile").on('click', saveFile);
  
  function fileOpen() {
   dialog.showOpenDialog({ filters: [
     { name: 'text', extensions: fileExtentions }
    ]}, function (fileNames) {
    if (fileNames === undefined) return;
    var fileName = fileNames[0];
    gFileName = fileName;
    $("#saveFile").removeClass("disabled");
    fs.readFile(fileName, 'utf-8', function(err, data) {
      gSimplemde.value(data);
      findEntites(data);
    });
   }); 
  }
  
  function fileSaveAs() {
    dialog.showSaveDialog({ filters: [
       { name: 'text', extensions: fileExtentions }
      ]}, function (fileName) {
      if (fileName === undefined) return;
      gFileName = fileName;
      fs.writeFile(fileName, gSimplemde.value(), function(err) {
        if (err) return;
          
        Materialize.toast('File saved', 1000);
      });
    }); 
  }
  
  function saveFile() {
    if (gFileName === undefined || gFileName === null) return;
    fs.writeFile(gFileName, gSimplemde.value(), function(err) {
      if (err) return;
        
      Materialize.toast('Changes saved', 1000);
    });
  }
  
  function debouncedLookup() {
    if (gSimplemde.value() == "") {
      $("#entites").html('');
    } else {
      findEntites(gSimplemde.value());
    }
  };
  gSimplemde.codemirror.on("change",  $.debounce(500, debouncedLookup));
  
  const contextMenu = new Menu();
  contextMenu.append(new MenuItem({
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }));
  contextMenu.append(new MenuItem({
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }));
  contextMenu.append(new MenuItem({
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }));
  
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.popup(remote.getCurrentWindow());
  }, false);

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open…',
          accelerator: 'CmdOrCtrl+O',
          click() { fileOpen(); }
        },
        {
          type: 'separator'
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click() { saveFile(); }
        },
        {
          label: 'Save As…',
          accelerator: 'Shift+CmdOrCtrl+S',
          click() { fileSaveAs(); }
        }
        /*
        {
          type: 'separator'
        },
        {
          label: 'Page Setup',
          role: 'pagesetup'
        },
        {
          label: 'Print…',
          accelerator: 'CmdOrCtrl+P',
          role: 'print'
        }
        */
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          click(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { require('electron').shell.openExternal('http://electron.atom.io'); }
        },
      ]
    },
  ];

  if (process.platform === 'darwin') {
    const name = remote.app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() { remote.app.quit(); }
        },
      ]
    });
    // Window menu.
    template[3].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    );
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}


  
function findEntites(text) {
  try {
    if (!text || text == "") {
      $("#entites").html('');
      return;
    }
    const remote = require('electron').remote;
    var entityFinder = remote.getGlobal('exportedModules').entityFinder;
    var consecutiveCapitalizedWordsRegexp = /([A-Z][a-zA-Z0-9-]*)([\s][A-Z][a-zA-Z0-9-]*)+/gm;
    var consecutiveCapitalizedWords = text.match(consecutiveCapitalizedWordsRegexp);
    var capitalizedWordsRegexp = /([A-Z][a-zA-Z0-9-]*)/gm;
    var capitalizedWords = text.match(capitalizedWordsRegexp);
    var concepts = consecutiveCapitalizedWords;
    capitalizedWords.forEach(function(word) {
      var addToList = true;
      concepts.forEach(function(concept) {
        if (concept == word || concept.indexOf(word) > -1)
          addToList = false;
      });
      if (addToList == true)
        concepts.push(word);
    });
    concepts.forEach(function(concept) {
      if (!concept.startsWith("The "))
        return;
    
      var shorterConcept = concept.replace(/^The /, '');
      var addToList = true;
      concepts.forEach(function(concept) {
        if (concept == shorterConcept)
          addToList = false;
      });
      if (addToList == true)
        concepts.push(shorterConcept);
    });
    $('#entities div[data-title]').attr("data-stale", "true");
    concepts.forEach(function(concept) {
      entityFinder.find(concept, 'en', {limit: 1})
      .then(function(entities) {
        entities.forEach(function(entity) {
          var entityHtml = '<div data-title="'+entity.wikiPage.title+'">'
                          +'<p><h5><a href="http://en.wikipedia.org/wiki/'+entity.wikiPage.title.replace(/ /g, '_')+'"><i class="fa fa-fw fa-external-link"></i> '+entity.name+'</a></h5></p>'
                          +'<p>'+entity.description+'</p>';

          if ($('#sidebar div[data-title="'+entity.wikiPage.title+'"]').length == 0) {
            $("#entities").prepend(entityHtml);
          } else {
            $('#entities div[data-title="'+entity.wikiPage.title+'"]').removeAttr("data-stale");
          }
        });
      });
    });
    setTimeout(function() {
      $('#entities div[data-stale]').remove();
    }, 1000);
  } catch(e) {
  }
}
