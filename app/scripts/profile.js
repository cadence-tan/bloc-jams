//holds the name of our tab button container for selection later in the function
var tabsContainer = ".user-profile-tabs-container";

var selectTabHandler = function(event){
  $tab = $(this);
  $(tabsContainer + "1i").removeClass('active');
  $tab.parent().addClass('active');
  selectTabName = $tab.attr('href');
 
  $(".tab-pane").addClass('hidden');
  $(selectTabName).removeClass('hidden');
  event.preventDefault();
};


if (document.URL.match(/\/profile.html/)) {
  $(document).ready(function() {
    var $tabs = $(tabsContainer + " a");
    $tabs.click(selectTabHandler);
    $tabs[0].click();
  });
}