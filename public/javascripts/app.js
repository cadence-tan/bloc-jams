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
require.register("scripts/album", function(exports, require, module) {
// Example Album
var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '/images/album-placeholder.png',

  songs: [
      { name: 'Blue', length: '4:26' },
      { name: 'Green', length: '3:14' },
      { name: 'Red', length: '5:01' },
      { name: 'Pink', length: '3:21'},
      { name: 'Magenta', length: '2:15'}
    ]
};

// Another Example Album
var albumMarconi = {
  name: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: '/images/album-placeholder2.png',

  songs: [
      { name: 'Hello, Operator?', length: '1:01' },
      { name: 'Ring, ring, ring', length: '5:01' },
      { name: 'Fits in your pocket', length: '3:21'},
      { name: 'Can you hear me now?', length: '3:14' },
      { name: 'Wrong phone number', length: '2:15'}
    ]
};

 var currentlyPlayingSong = null;

 var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr>'
      + '  <td class="song-number col-md-1" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="col-md-9">' + songName + '</td>'
      + '  <td class="col-md-2">' + songLength + '</td>'
      + '</tr>'
      ;
  
    // Instead of returning the row immediately, we'll attach hover
    // functionality to it first.
     var $row = $(template);
    
     var onHover = function(event) {
       var songNumberCell = $(this).find('.song-number');
       var songNumber = songNumberCell.data('song-number');
       if (songNumber !== currentlyPlayingSong) {
         songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
       }
     };
    
     var offHover = function(event) {
       var songNumberCell = $(this).find('.song-number');
       var songNumber = songNumberCell.data('song-number');
       if (songNumber !== currentlyPlayingSong) {
             songNumberCell.html(songNumber);
           }

     };
     
     

     // Toggle the play, pause, and song number based on which play/pause button we clicked on.
      var clickHandler = function(event) {
        var songNumber = $(this).data('song-number');
         

        if (currentlyPlayingSong !== null) {
             // Revert to song number for currently playing song because user started playing new song.
             currentlyPlayingCell = $('.song-number[data-song-number="' + currentlyPlayingSong + '"]');
             currentlyPlayingCell.html(currentlyPlayingSong);
           }
        
           if (currentlyPlayingSong !== songNumber) {
             // Switch from Play -> Pause button to indicate new song is playing.
             $(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>');
             currentlyPlayingSong = songNumber;
           }
           else if (currentlyPlayingSong === songNumber) {
             // Switch from Pause -> Play button to pause currently playing song.
             $(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
             currentlyPlayingSong = null;
           }
         };


    $row.find('.song-number').click(clickHandler);
        
        
    $row.hover(onHover, offHover);
     return $row;

    };


  var changeAlbumView = function(album) {
    // Update the album title
    var $albumTitle = $('.album-title');
    $albumTitle.text(album.name);
  
    // Update the album artist
    var $albumArtist = $('.album-artist');
    $albumArtist.text(album.artist);
  
    // Update the meta information
    var $albumMeta = $('.album-meta-info');
    $albumMeta.text(album.year + " on " + album.label);
  
    // Update the album image
    var $albumImage = $('.album-image img');
    $albumImage.attr('src', album.albumArtUrl);
  
    // Update the Song List
    var $songList = $(".album-song-listing");
    $songList.empty();
    var songs = album.songs;
    for (var i = 0; i < songs.length; i++) {
      var songData = songs[i];
      var $newRow = createSongRow(i + 1, songData.name, songData.length);
      $songList.append($newRow);
    }
  
  };


  var updateSeekPercentage = function($seekBar, event) {
     var barWidth = $seekBar.width();
     // get mouse x offset here
     var offsetX = event.pageX - $seekBar.offset().left;
   
     var offsetXPercent = (offsetX  / barWidth) * 100;
       offsetXPercent = Math.max(0, offsetXPercent);
       offsetXPercent = Math.min(100, offsetXPercent);
     
       var percentageString = offsetXPercent + '%';
       $seekBar.find('.fill').width(percentageString);
       $seekBar.find('.thumb').css({left: percentageString});
   }


  
 var setupSeekBars = function() {
 
   $seekBars = $('.player-bar .seek-bar');
   $seekBars.click(function(event) {
     updateSeekPercentage($(this), event);
   });

   $seekBars.find('.thumb').mousedown(function(event){
       var $seekBar = $(this).parent();

       $seekBar.addClass('no-animate');

    
       $(document).bind('mousemove.thumb', function(event){
         updateSeekPercentage($seekBar, event);
       });
    
       //cleanup
       $(document).bind('mouseup.thumb', function(){

        $seekBar.removeClass('no-animate');

         $(document).unbind('mousemove.thumb');
         $(document).unbind('mouseup.thumb');
       });
    
     });


 };

  

 // This 'if' condition is used to prevent the jQuery modifications
 // from happening on non-Album view pages.
 //  - Use a regex to validate that the url has "/album" in its path.
 if (document.URL.match(/\/album.html/)) {
  // Wait until the HTML is fully processed.
  $(document).ready(function() {
  	changeAlbumView(albumPicasso);
    setupSeekBars();    
  });
 }
});

;require.register("scripts/app", function(exports, require, module) {
// require('./landing');
// require('./album');
// require('./collection');
// require('./profile');

// Example Album
var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '/images/album-placeholder.png',

  songs: [
       { name: 'Blue', length: '4:26', audioUrl: '/music/placeholders/blue' },
       { name: 'Green', length: '3:14', audioUrl: '/music/placeholders/green' },
       { name: 'Red', length: '5:01', audioUrl: '/music/placeholders/red' },
       { name: 'Pink', length: '3:21', audioUrl: '/music/placeholders/pink' },
       { name: 'Magenta', length: '2:15', audioUrl: '/music/placeholders/magenta' }
    ]
};


 blocJams = angular.module('BlocJams', ['ui.router']);

 blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);
 
   $stateProvider.state('landing', {
     url: '/',
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html'
   });
   
    $stateProvider.state('collection', {
     url: '/collection',
     controller: 'Collection.controller',
     templateUrl: '/templates/collection.html'
   });
   
      
   $stateProvider.state('album', {
     url: '/album',
     templateUrl: '/templates/album.html',
     controller: 'Album.controller'
   });
   
   $stateProvider.state('/song', {
     url: '/song',
     templateUrl: '/templates/song.html'
   });   
 }]);
 

 // This is a cleaner way to call the controller than crowding it on the module definition.
  blocJams.controller('Landing.controller', ['$scope', 'Logger', function($scope, Logger) {
   
   
  $scope.subText = "Turn the music up!";
 
  $scope.subTextClicked = function() {
  $scope.subText += '!';
   };
  
  $scope.title = "Bloc Jams"; 
  $scope.blocJamsClicked= function(o){
  $scope.title += "!";
       
  for(var j, x, i = o.length; i; j = 

  Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
   return o;
  };

  
  $scope.albumURLs = [
     '/images/album-placeholders/album-1.jpg',
     '/images/album-placeholders/album-2.jpg',
     '/images/album-placeholders/album-3.jpg',
     '/images/album-placeholders/album-4.jpg',
     '/images/album-placeholders/album-5.jpg',
     '/images/album-placeholders/album-6.jpg',
     '/images/album-placeholders/album-7.jpg',
     '/images/album-placeholders/album-8.jpg',
     '/images/album-placeholders/album-9.jpg',
   ];
  
  Logger.print("Hello World!");//logs "Hello World!
  
}]);
    
 blocJams.controller('Collection.controller', ['$scope', 'Logger', 'SongPlayer', function($scope, Logger, SongPlayer) {
   $scope.albums = [];
     for (var i = 0; i < 33; i++) {
     $scope.albums.push(angular.copy(albumPicasso));
   }
   
   Logger.print("Hello World!");  // logs "Hello World!"
    
   $scope.playAlbum = function(album){
     SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
   }
   
 }]);
    
 blocJams.controller('Album.controller', ['$scope', 'SongPlayer', 'Logger', function($scope, SongPlayer, Logger) {

   $scope.album = angular.copy(albumPicasso);
    
   var hoveredSong = null;
   
   $scope.onHoverSong = function(song){
     hoveredSong = song;
   };
    
   $scope.offHoverSong = function(song){
      hoveredSong = null;
   };
    
   $scope.getSongState = function(song) {
     if (song === SongPlayer.currentSong && SongPlayer.playing) {
       return 'playing';
     }
     else if (song === hoveredSong) {
       return 'hovered';
     }
     return 'default';
   };
    
   $scope.playSong =  function(song){  
        SongPlayer.setSong($scope.album, song);
   };
    
   $scope.pauseSong = function(song){
      SongPlayer.pause();
   }
   
   Logger.print("Hello World!");//logs Hello World!
 }]);
    
 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
   $scope.songPlayer = SongPlayer;
 }]);
    
 blocJams.service('SongPlayer', function() {
    var currentSoundFile = null;
   
    var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
   };
   
   return {
     currentSong: null,
     currentAlbum: null,
     playing: false,
 
     play: function() {
       this.playing = true;
       currentSoundFile.play();
     },
     pause: function() {
       this.playing = false;
       currentSoundFile.pause();
     },
     next: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex++;
       if (currentTrackIndex >= this.currentAlbum.songs.length) {
        currentTrackIndex = 0;//loop the songs
//      currentTrackIndex = null;//stop looping songs
       }
       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);
     },
      previous: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex--;
       if (currentTrackIndex < 0) {
       currentTrackIndex = this.currentAlbum.songs.length - 1;//loop the songs
//     currentTrackIndex = null;//stop looping songs
       }       
      var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
     },
     setSong: function(album, song) {
       if (currentSoundFile) {
        currentSoundFile.stop();
       }
       this.currentAlbum = album;
       this.currentSong = song;
       
    currentSoundFile = new buzz.sound(song.audioUrl, {
      formats: [ "mp3" ],
      preload: true
    });
       
      this.play();
    }
      
    
     
   };
 });
  
  blocJams.service('Logger', function() {
    this.print =  function(msg){
      console.log(msg);
    };
});
 
 blocJams.directive('slider', function(){
   var updateSeekPercentage = function($seekBar, event) {
     var barWidth = $seekBar.width();
     var offsetX =  event.pageX - $seekBar.offset().left;
 
     var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
     offsetXPercent = Math.max(0, offsetXPercent);
     offsetXPercent = Math.min(100, offsetXPercent);
 
     var percentageString = offsetXPercent + '%';
     $seekBar.find('.fill').width(percentageString);
     $seekBar.find('.thumb').css({left: percentageString});
   }
 
   return {
     templateUrl: '/templates/directives/slider.html', // We'll create these files shortly.
     replace: true,
     restrict: 'E',
    link: function(scope, element, attributes) {
 
      var $seekBar = $(element);
 
      $seekBar.click(function(event) {
        updateSeekPercentage($seekBar, event);
      });
 
      $seekBar.find('.thumb').mousedown(function(event){
        $seekBar.addClass('no-animate');
 
        $(document).bind('mousemove.thumb', function(event){
          updateSeekPercentage($seekBar, event);
        });
 
        //cleanup
        $(document).bind('mouseup.thumb', function(){
          $seekBar.removeClass('no-animate');
          $(document).unbind('mousemove.thumb');
          $(document).unbind('mouseup.thumb');
        });
 
      });
    }
  };
});

});

;require.register("scripts/collection", function(exports, require, module) {
var buildAlbumThumbnail = function() {
	var template =
	'<div class="collection-album-container col-md-2">'
	+ '  <div class="collection-album-image-container">'
	+ '  <img src="/images/album-placeholder.png"/>'
	+ '  </div>'
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


var buildAlbumOverlay = function(albumURL) {
  var template =
      '<div class="collection-album-image-overlay">'
    + '  <div class="collection-overlay-content">'
    + '    <a class="collection-overlay-button" href="' + albumURL + '">'
    + '      <i class="fa fa-play"></i>'
    + '    </a>'
    + '    &nbsp;'
    + '    <a class="collection-overlay-button">'
    + '      <i class="fa fa-plus"></i>'
    + '    </a>'
    + '  </div>'
    + '</div>'
    ;
  return $(template);
};

var updateCollectionView = function() {
  var $collection = $(".collection-container .row");
  //Empty entire collection, ensure there is only one in a page
  $collection.empty();

  for (var i = 0; i < 33; i++) {
    var $newThumbnail = buildAlbumThumbnail();
    $collection.append($newThumbnail);
  }

  var onHover = function(event) {
     $(this).append(buildAlbumOverlay("/album.html"));
   };

   var offHover = function(event) {
      $(this).find('.collection-album-image-overlay').remove();
    };

   $collection.find('.collection-album-image-container').hover(onHover, offHover);

};

if (document.URL.match(/\/collection.html/)) {
  // Wait until the HTML is fully processed.
	 $(document).ready(function() {
	     // Your code goes here.
	 updateCollectionView();
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

;require.register("scripts/profile", function(exports, require, module) {
//holds the name of our tab button container for selection later in the function
var tabsContainer = ".user-profile-tabs-container";
var selectTabHandler = function(event) {
  $tab = $(this);
  $(tabsContainer + " li").removeClass('active');
  $tab.parent().addClass('active');
  selectedTabName = $tab.attr('href');
  console.log(selectedTabName);
  $(".tab-pane").addClass('hidden');
  $(selectedTabName).removeClass('hidden');
  event.preventDefault();
};


if (document.URL.match(/\/profile.html/)) {
  $(document).ready(function() {
    var $tabs = $(tabsContainer + " a");
    $tabs.click(selectTabHandler);
    $tabs[0].click();
  });
}
});

;
//# sourceMappingURL=app.js.map