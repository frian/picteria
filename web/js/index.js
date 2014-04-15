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
    $('#helpButtonClose').removeClass('hideHelpButtonClose');
    $('#helpButtonClose').addClass('showHelpButtonClose');

    setTimeout(function(){
      $('#helpButtonClose').attr('src', '/img/back.png');
    }, 1200);
  });

 
  $('#helpButtonClose').click(function() {

    $('#helpButtonClose').attr('src', '/img/help.png');
    $('#help').removeClass('showHelp');    
    $('#help').addClass('hideHelp');
    $('#helpButton').addClass('showHelpButton');
    $('#helpButton').removeClass('hideHelpButton');
    $('#helpButtonClose').removeClass('showHelpButtonClose');
    $('#helpButtonClose').addClass('hideHelpButtonClose');
  });

  
  // help accordion 
  var accordion_head = $('#accordeon li a.title');
  var accordion_body = $('#accordeon li.content');

  // set first as active
  accordion_head.first().addClass('active').parent().next().slideDown('normal');

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
  });
  
  
  
  var previewsState = 'off';
  var currentGallery = '';
  
  
  // -- keyboard shortcuts ----------------------------------------------------
  // right arrow : focus on next gallery
  // left arrow  : focus on prev gallery
  $(document).keydown(function(e) {
    console.log(e.which);
    
    if ( e.which == 39 ) {

      e.preventDefault();
      
      // remove active state style at previous gallery
      $('#' + indexImages[galleryNum].attr("class")).css('display' , 'none');

      // current gallery
      galleryNum++;

      // if last gallery go to first
      if ( galleryNum >= indexImages.length ) { galleryNum = 0; }

      // set link as active
      indexImages[galleryNum].focus();
      
      console.log('prout' + indexImages[galleryNum].attr('class'));
      
      // set active style
      $('#' + indexImages[galleryNum].attr("class")).css('display' , 'block');

      
      if (previewsState == 'on') {
        var id = $(document.activeElement).attr( 'href' );
        id = id.replace( '/gallery/', '' );
        
        
        url = '/preview/' + id;
        
        $.ajax({
          url: url,
          type: "get",
          success: function(data) {
            $('#previews').remove();
            $("body"  ).append(data);
            // set link as active
            indexImages[galleryNum].focus();
            // set active style
            $('#' + indexImages[galleryNum].attr("class")).css('display' , 'block');

          },
          error:function() {
            $("#indexContainer").html('There is error while submit');
          }
        });
        currentGallery = id;
      }
     
    }
    else if ( e.which == 37 ) {

      e.preventDefault();
      
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
    else if ( e.which == 32 ) {

      e.preventDefault();

      previewsState == 'off' ? previewsState = 'on' : previewsState = 'off';

      var id = $(document.activeElement).attr( 'href' );
      id = id.replace( '/gallery/', '' );

      if ( previewsState == 'off' && id == currentGallery ) {
        console.log('match');
        $('#previews').remove();
//        $("#previews-" + galleryNum).toggleClass('hide');
      }
      else {
      
        url = '/preview/' + id;

        $.ajax({
          url: url,
          type: "get",
          success: function(data) {
            $('#previews').remove();
//            $("#previews-" + galleryNum).toggleClass('hide');
            $("body").append(data);
          },
          error:function() {
            $("#indexContainer").html('There is error while submit');
          }
        });
      }
      
      currentGallery = id;
    }
  });
});