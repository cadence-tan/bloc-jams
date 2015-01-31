(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/app", function(exports, require, module) {
require("./landing");
require('./collection');
});

;require.register("scripts/collection", function(exports, require, module) {
var buildAlbumThumbnail = function() {
	var template =
	'<div class="collection-album-container col-md-2">'
	+ '  <img src="/images/album-placeholder.png"/>'
	+ '  <div class="caption album-collection-info">'
	+ '    <p>'
	+ '      <a class="album-name" href="/album.html"> Album Name </a>'
	+ '      <br/>'
	+ '      <a href="/album.html"> Artist name </a>'
	+ '      <br/>'
	+ '      X songs'
	+ '      <br/>'
	+ '	  	 X:XX Total Length'
	+ '		 <br/>'
	+ '    </p>'
	+ '  </div>'
	+ '</div>';

	return $(template);
};


if (document.URL.match(/\/collection.html/)) {
  // Wait until the HTML is fully processed.
  $(document).ready(function() {
  	var $collection = $(".collection-container .row");
  	$collection.empty();

  	var randomNum = Math.floor((Math.random() * 100) + 25);

  	for(var i=0; i < randomNum ; i++){
  		var $newThumbnail = buildAlbumThumbnail();
  		$collection.append($newThumbnail);
  	}
  });
}
});

;require.register("scripts/landing", function(exports, require, module) {
$(document).ready(function() { 
  //Add an exclamation point to the end of "Turn the music up!" 
   $('.hero-content h3').click(function(){
     var subText = $(this).text();
     $(this).text(subText + "!");
   });

  //Animate selling points on hover
   var onHoverAction = function(event){
    console.log('Hover action triggered.');
    $(this).animate({'margin-top':'10px'});
  };

  var offHoverAction = function(event) {
    console.log('off-Hover action triggered');
    $(this).animate({'margin-top':'0px'});
  };

  $('.selling-points .point').hover(onHoverAction, offHoverAction);


  //Change the "Turn the music up!" colors on a hover event
  $('.hero-content h3').hover(function(){
    // this will execute when we hover over the object
    console.log('Hover action triggered.');
     $(this).css('color', 'red');
  }, function(){
    // this will execute when we hover off the object
    console.log('off-Hover action triggered');
     $(this).css('color', 'white');
  });

  //Change the font-size of the selling points on a click event
  $(".selling-points .point h5").click(function(){       
    $(this).animate({fontSize: '29px'}, "slow");
  });

 //Bloc Jams header fade-out when it's clicked 
  $( ".navbar-header").click(function() {
    $(this).fadeOut( "slow" );
  });
});
});

;
//# sourceMappingURL=app.js.map