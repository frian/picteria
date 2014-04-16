$(function() {

  // get links
  var indexImages = $('#indexContainer').find('a').map(function() { return $(this); }).get();
  var galleryNum = 0;

  // set first link as active
  indexImages[galleryNum].focus();
  $('#' + indexImages[galleryNum].attr("class")).css('display' , 'block');

  // clic on a gallery
  $('#indexContainer a').click(function(e) {
    e.preventDefault();
    var link = $(this).attr('href');
    var url = link + '/' + $(document).width() + '/' + '1';
    window.location.href = url;
  });

  // clic on help button
  $('#helpButton').click(function() {
    showHelp();
  });

  // clic on clode help button
  $('#helpButtonClose').click(function() {
    hideHelp();
  });

  
  // help accordion 
  var accordion_head = $('#accordeon li a.title');
  var accordion_body = $('#accordeon li.content');

  // handle clic
  accordion_head.on('click', function(event) {

    event.preventDefault();

    if ($(this).attr('class') != 'title active'){
      accordion_body.slideUp('normal');
      $(this).parent().next().stop(true,true).slideToggle('normal');
      accordion_head.removeClass('active');
      $(this).addClass('active');
      $(this).blur();
    }
    else {
      accordion_body.slideUp('normal');
    }
  });



  var previewsState = 'off';
  var currentGallery = '';
  
  
  // -- keyboard shortcuts ----------------------------------------------------
  // right arrow : focus on next gallery         39
  // left arrow  : focus on prev gallery         37
  // show gallery preview                        32
  $(document).keydown(function(e) {
//    console.log(e.which);
    if ( e.which == 39 ) {

      e.preventDefault();

      galleryNum = focusNextGallery(indexImages, galleryNum);
      
      if (previewsState == 'on') {

        var id = $(document.activeElement).attr( 'href' ).replace( '/gallery/', '' );

        showGalPreview(id);

        currentGallery = id;
      }
     
    }
    else if ( e.which == 37 ) {

      e.preventDefault();
      
      galleryNum = focusPrevGallery(indexImages, galleryNum);

    }
    else if ( e.which == 32 ) {

      e.preventDefault();

      previewsState == 'off' ? previewsState = 'on' : previewsState = 'off';

      var id = $(document.activeElement).attr( 'href' ).replace( '/gallery/', '' );

      if ( previewsState == 'off' && id == currentGallery ) {
        $('#previews').remove();
      }
      else {
        showGalPreview(id);
      }

      currentGallery = id;
    }
  });
});


function showGalPreview(id) {
  
  url = '/preview/' + id;

  $.ajax({
    url: url,
    type: "get",
    success: function(data) {
      $('#previews').remove();
      $("body").append(data);
    },
    error:function() {
      $("#indexContainer").html('There is error while submit');
    }
  });
}


function focusNextGallery(indexImages, galleryNum) {

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

  return galleryNum;
}


function focusPrevGallery(indexImages, galleryNum) {
  
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

  return galleryNum;
}


function showHelp() {

  $('#helpButton').removeClass('showHelpButton');
  $('#helpButton').addClass('hideHelpButton');
  $('#help').removeClass('hideHelp');
  $('#help').addClass('showHelp');
  $('#helpButtonClose').removeClass('hideHelpButtonClose');
  $('#helpButtonClose').addClass('showHelpButtonClose');

  setTimeout(function(){
    $('#helpButtonClose').attr('src', '/img/back.png');
  }, 1200);
}


function hideHelp() {

  $('#helpButtonClose').attr('src', '/img/help.png');
  $('#help').removeClass('showHelp');    
  $('#help').addClass('hideHelp');
  $('#helpButton').addClass('showHelpButton');
  $('#helpButton').removeClass('hideHelpButton');
  $('#helpButtonClose').removeClass('showHelpButtonClose');
  $('#helpButtonClose').addClass('hideHelpButtonClose'); 
}

