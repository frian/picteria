$(function() {

  var indexImages = $('#indexContainer').find('a').map(function() { return $(this); }).get();
  var galleryNum = 0;

  indexImages[galleryNum].focus();
  $('#' + indexImages[galleryNum].attr("class")).css('display' , 'block');

  
  $('#indexContainer a').click(function(e) {

    e.preventDefault();
    var link = $(this).attr('href');
    var url = link + '/' + $(document).width() + '/' + '1';
    window.location.href = url;
    console.log( 'clicked on gallery ' + url );
  });

  $('#helpButton').click(function() {
    $('#helpButton').removeClass('showHelpButton');
    $('#helpButton').addClass('hideHelpButton');
    $('#help').removeClass('hideHelp');
    $('#help').addClass('showHelp');
  });

  $('#helpButtonClose').click(function() {

    $('#help').removeClass('showHelp');    
    $('#help').addClass('hideHelp');
    $('#helpButton').addClass('showHelpButton');
    $('#helpButton').removeClass('hideHelpButton');
  });

  
  // -- keyboard shortcuts ----------------------------------------------------
  // right arrow : focus on next gallery
  // left arrow  : focus on prev gallery
  $(document).keydown(function(e) {
    console.log(e.which);
    if ( e.which == 39 ) {

      // remove active state style at previous gallery
      $('#' + indexImages[galleryNum].attr("class")).css('display' , 'none');

      // current gallery
      galleryNum++;

      // if last gallery go to first
      if ( galleryNum >= indexImages.length ) { galleryNum = 0; }

      // set link as active
      indexImages[galleryNum].focus();
      
      // set active style
      $('#' + indexImages[galleryNum].attr("class")).css('display' , 'block');
    }
    else if ( e.which == 37 ) {

      // remove active state style at previous gallery
      $('#' + indexImages[galleryNum].attr("class")).css('display' , 'none');

      // current gallery
      galleryNum--;
      
      // if first gallery go to last
      if ( galleryNum < 0 ) { galleryNum = indexImages.length - 1; }

      // set link as active
      indexImages[galleryNum].focus();

      // set active style
      $('#' + indexImages[galleryNum].attr("class")).css('display' , 'block');
    }
  });
});