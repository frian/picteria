$(function() {
  var indexImages = $('#indexContainer').find('a').map(function() { return this; }).get();
  var galleryNum = 0;

  indexImages[galleryNum].focus();
  
  // -- keyboard shortcuts ----------------------------------------------------
  // right arrow : focus on next gallery
  // left arrow  : focus on prev gallery
  $(document).keydown(function(e) {
    console.log(e.which);
    if ( e.which == 39 ) {
      galleryNum++;
      if ( galleryNum >= indexImages.length ) { galleryNum = 0; }
      indexImages[galleryNum].focus();
    }
    else if ( e.which == 37 ) {
      galleryNum--;
      if ( galleryNum < 0 ) { galleryNum = indexImages.length - 1; }
      indexImages[galleryNum].focus();
    }
  });
});