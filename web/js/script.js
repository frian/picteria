$(function() {

  // get gallery name
  var gal = $('title').text().split(" / ")[1];
  
  // get image list
  var images = $('#container').find('img').map(function() { return this.id; }).get();

  // get previews list
  var previews = $('#controls').find('img.preview').map(function() { return this.id; }).get();
  
  // get id of current image
  var currentImgId = '#' + images[0];

  // placeholder for the current image number
  var currentImgNumber = 1;
  
  // image mode : screen / image
  var mode = 'image';

  
  // -- show first image on page load -----------------------------------------
  setTimeout(function(){showImage(currentImgId, mode);}, 10);

  // -- show previews on page load --------------------------------------------
  setTimeout(function(){showPreviews(previews);},10);


  // -- handle screen resize --------------------------------------------------
  $(window).resize(function() {
    mode == 'screen' ? fullScreen(currentImgId, 'resize') : fullImage(currentImgId);
    showPreviews(previews);
  });


  // -- Handle show image -----------------------------------------------------
  // TODO : image load
  $('.preview').click(function() {

//    $.each(images, function(index, item) {
//      $('#' + item).addClass('hide');
//    });

    // get clicked element id    
    var id = $(this).attr('id');

    // get corresponding img id
    var img = id.replace('-prev', '');

    currentImgId = '#' + img;

    currentImgNumber = img.replace('picteria-', '');

    $.ajax({
      url: gal + '/' + currentImgNumber,
      type: "get",
      success: function(data){
        $("#container").html(data);
        setTimeout(function(){showImage('#picteria-1', mode);},20);
          
      },
      error:function(){
        $("#container").html('There is error while submit');
      }
  });
    
    console.log(currentImgId);

//    $.each(images, function(index, item) {

//      if ( item == img ) {
        showImage('#picteria-1', mode);
        $('#picteria-1').removeClass('hide');
        
//      }
//      else {
//        $('#' + item).addClass('hide');
//      }
//    });
  });


  // -- Handle next previews --------------------------------------------------
  $('#next').click(function() {
    nextPreviews(previews);
  });


  // -- Handle previous previews ----------------------------------------------
  $('#prev').click(function() {
    prevPreviews(previews);
  });


  // -- Handle mode change ----------------------------------------------------
  $('#mode').click(function() {
    mode = switchMode(currentImgId, mode);
    return mode;
  });


  // -- keyboard shortcuts ----------------------------------------------------
  // r :           switch mode
  // up arrow :    show next previews
  // down arrow :  show previous previews
  // right arrow : show next image
  // left arrow  : show previous image
  $(document).keydown(function(e) {
    console.log(e.which);
    if ( e.which == 82 ) {
      mode = switchMode(currentImgId, mode);
    }
    else if ( e.which == 38 ) {
      nextPreviews(previews);
    }
    else if ( e.which == 40 ) {
      prevPreviews(previews);
    }
    else if ( e.which == 39 ) {
      currentImgNumber = nextImage(gal, currentImgNumber, mode);
    }
    else if ( e.which == 37 ) {
      currentImgNumber = prevImage(gal, currentImgNumber, mode);
    }
  });


});


function nextImage(gal, currentImgNumber, mode) {

  console.log(currentImgNumber);
  currentImgNumber++;
  console.log(currentImgNumber);
  $.ajax({
    url: gal + '/' + currentImgNumber,
    type: "get",
    success: function(data){
      $("#container").html(data);
      setTimeout(function(){showImage('#picteria-1', mode);},20);
    },
    error:function(){
      $("#container").html('There is error while submit');
    }
  });
  return currentImgNumber;
}


function prevImage(gal, currentImgNumber, mode) {

  console.log('in prevImage');
  console.log(currentImgNumber);
  currentImgNumber--;
  if (currentImgNumber < 1) { currentImgNumber = 1; }
  console.log(currentImgNumber);
  $.ajax({
    url: gal + '/' + currentImgNumber,
    type: "get",
    success: function(data){
      $("#container").html(data);
      setTimeout(function(){showImage('#picteria-1', mode);},20);
    },
    error:function(){
      $("#container").html('There is error while submit');
    }
  });
  return currentImgNumber;
}


function nextPreviews(previews) {

  offset = parseInt($('#next').attr('data-offset'));
  offset += 5;
  
  if ( offset >= previews.length ) {
    return false;
  }
  
  showPreviews(previews, offset);
  $('#next').attr('data-offset', offset);
  $('#prev').attr('data-offset', offset);
//  console.log( offset );
}


function prevPreviews(previews) {

  offset = $('#prev').attr('data-offset');
  offset -= 5;
  
  if ( offset < 0 ) {
    return false;
  }
  
  showPreviews(previews, offset);
  $('#next').attr('data-offset', offset);
  $('#prev').attr('data-offset', offset);
//  console.log( offset );

}


function switchMode(currentImgId, mode) {

  mode == 'screen' ? mode='image': mode='screen';
  var icon = 'resize';
  if ( mode == 'image' ) { icon = 'fullscreen'; }
  showImage('#picteria-1', mode);
  $('#mode').attr('src', '/img/' + icon + '.png');
  return mode;
}


function showImage(currentImgId, mode) {
  mode == 'screen' ? fullScreen(currentImgId) : fullImage(currentImgId);
}


function showPreviews(previews, offset) {

  if ( !offset ) {
    offset = 0;
  }
  
  $.each(previews, function(index, item) {
    $('#' + item).addClass('hide');
  });

  var screenWidth = getWidth() - 400; // 100px for the resize button
  var previewWidth = 0;

  $.each(previews, function(index, item) {

    // skip items before offset
    if ( index <  offset  ) {
      return true;
    }

    // finish when screen is full
    current = $('#' + item);
    previewWidth += current.width();
    if ( previewWidth >= screenWidth ) {
      return false;
    }

    // finish when we have no more previews
    if ( index >= previews.length ) {
      return false;
    }

    // show item
    current.removeClass('hide');
  });
}


function fullImage(currentImgId) {
  
  var item = $(currentImgId);
  
  console.log( 'item : ' + currentImgId  );
  
  item.css( 'max-width',  '100%' );
  item.css( 'max-height', '100%' );
  
  item.removeClass('hide');
  
  var orientation = getOrientation();
  
  // remove css added by fullScreen
  item.css('width', '');
  item.css('height', '');
  
  if ( orientation == 'l' ) {
    var leftPos = (getWidth() - item.width()) / 2;
    item.css('left', leftPos);
    item.css('top', 0);
  }
  else {
    var topPos = (getHeight() - item.height()) / 2;
    item.css('top', topPos);
    item.css('left', 0);
  }
}


function fullScreen(currentImgId) {

  var item = $(currentImgId);

  item.addClass('hide');
  
  var screenWidth = getWidth();
  var screenHeight = getHeight();
  var orientation = getOrientation();
  
  //remove css added by fullImage
  item.css( 'max-width',  '' );
  item.css( 'max-height', '' );

  item.css('width', '');
  item.css('height', '');
  
  OriginalImageWidth = item.width();
  OriginalImageHeigth = item.height();
  
//  console.log(OriginalImageWidth + ' ' + OriginalImageHeigth);
  
  if ( orientation == 'l' ) {
    var imgHeight = screenWidth / OriginalImageWidth * OriginalImageHeigth;
    console.log( 'imgHeight : ' + imgHeight );
    console.log( 'screenHeight : ' + screenHeight );
    
    var topPos = ( screenHeight - imgHeight) / 2;
    item.css('width', screenWidth);
    item.css('height', imgHeight);
    item.css( 'top', topPos );
    item.css( 'left', 0 );
    
  }
  else {
    var imgWidth = screenHeight / OriginalImageHeigth * OriginalImageWidth;
//    console.log( 'imgHeight : ' + imgHeight );
    var leftPos = ( screenWidth - imgWidth) / 2;
    item.css('height', screenHeight);
    item.css('width', imgWidth);
    item.css( 'left', leftPos );
    item.css( 'top', 0 );
  }

  item.removeClass('hide');
}


function getWidth() {
 return $(document).width();
}


function getHeight() {
  return $(document).height();
}


function getOrientation() {

  if ( getWidth() * 0.75 > getHeight() ) {
    return 'l';
  }
  return 'p';
}


//function getSize() {
//return getWidth() + 'x' + getHeight();
//}

