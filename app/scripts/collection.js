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

  	//Generate a random number of albums between 25 and 100
  	var randomNum = Math.floor((Math.random() * 100) + 25);

  	for(var i=0; i < randomNum ; i++){
  		var $newThumbnail = buildAlbumThumbnail();
  		$collection.append($newThumbnail);
  	}
  });
}