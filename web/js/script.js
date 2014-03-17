$(function() {

  // get image list
  var images = $('#container').find('img').map(function() { return this.id; }).get();

  // get previews list
  var previews = $('#controls').find('img.preview').map(function() { return this.id; }).get();
  
  // get id of current image
  var currentImgId = '#' + images[0];
  
  // image mode : screen / image
  var mode = 'image';

  
  // -- show first image on page load -----------------------------------------
  showImage(currentImgId, mode);

  // -- show previews on page load --------------------------------------------
  showPreviews(previews);


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

//    $('#picteria-1').attr('src', "/galleries/buds/002.jpg");
    
    currentImgNumber = img.replace('picteria-', '');

    $.ajax({
      url: "buds/" + currentImgNumber,
      type: "get",
//      data: values,
      success: function(data){
//          alert("success");
          $("#container").html(data);
          setTimeout(function(){showImage('#picteria-1', mode);},200);
          
      },
      error:function(){
//          alert("failure");
          $("#container").html('There is error while submit');
      }
  });
//    currentImgNumber++;
    
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
  $(document).keydown(function(e) {
    console.log(e.which);
    if ( e.which == 82 ) { // r : switch mode
      mode = switchMode(currentImgId, mode);
    }
    else if ( e.which == 38 ) {
      nextPreviews(previews);
    }
    else if ( e.which == 40 ) {
      prevPreviews(previews);
    }
  });


});


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
//  console.log('showImage : ' + mode);
  mode == 'screen' ? fullScreen(currentImgId) : fullImage(currentImgId);
}


function showPreviews(previews, offset) {

  if ( !offset ) {
    offset = 0;
//    console.log( offset );
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

