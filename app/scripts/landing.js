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