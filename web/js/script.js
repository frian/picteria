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
  showImage(currentImgId, mode);

  // -- show previews on page load --------------------------------------------
  showPreviews(previews);

  var numPreviews = 0;
  
  setTimeout(function() {
    $.each(previews, function(index, item) {
     current = $('#' + item).attr('class');
     if ( current.match(/hide/) ) { return true; }; 
     numPreviews++;
    });
    return numPreviews;
  }, 60);


  // add active state style
  $(currentImgId + '-prev').css('border', '1px solid white');
  
  // -- handle screen resize --------------------------------------------------
  $(window).resize(function() {
    showImage(currentImgId, mode);
    showPreviews(previews);
  });


  // -- Handle show image -----------------------------------------------------
  // TODO : image load
  $('.preview').click(function() {

//    $.each(images, function(index, item) {
//      $('#' + item).addClass('hide');
//    });

    console.log('before' + currentImgId);
    
    $(currentImgId + '-prev').css('border', 'none');
    
    // get clicked element id    
    var id = $(this).attr('id');

    // get corresponding img id
    var img = id.replace('-prev', '');

    currentImgId = '#' + img;

    $(currentImgId + '-prev').css('border', '1px solid white');
    
    currentImgNumber = img.replace('picteria-', '');

    $.ajax({
      url: gal + '/' + currentImgNumber,
      type: "get",
      success: function(data){
        $("#container").html(data);
        showImage('#picteria-1', mode); 
      },
      error:function(){
        $("#container").html('There is error while submit');
      }
    });
    
    console.log('after' + currentImgId);

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
  // b :           back to galleries index
  $(document).keydown(function(e) {
//    console.log(e.which);
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
      if ( currentImgNumber % numPreviews == 0) {
        nextPreviews(previews);
        setTimeout(function() {
          $.each(previews, function(index, item) {
           current = $('#' + item).attr('class');
           if ( current.match(/hide/) ) { return true; }; 
           numPreviews++;
          });
          return numPreviews;
        }, 60);
      }
      currentImgNumber = nextImage(gal, currentImgNumber, mode);
    }
    else if ( e.which == 37 ) {
      if ( currentImgNumber % 5 == 0) {
        prevPreviews(previews);
      }
      currentImgNumber = prevImage(gal, currentImgNumber, mode);
    }
    else if ( e.which == 66 ) {
      window.location.href = "http://picteria/index.php/";
    }
  });


});


function nextImage(gal, currentImgNumber, mode) {

  // remove active state style from previous preview
  $('#picteria-' + currentImgNumber + '-prev').css('border', 'none');
  
  currentImgNumber++;
//  console.log(currentImgNumber);
  $.ajax({
    url: gal + '/' + currentImgNumber,
    type: "get",
    success: function(data){
      $("#container").html(data);
      showImage('#picteria-1', mode);
    },
    error:function(){
      $("#container").html('There is error while submit');
    }
  });
  
  // add active state style to current preview
  $('#picteria-' + currentImgNumber + '-prev').css('border', '1px solid white');

  return currentImgNumber;
}


function prevImage(gal, currentImgNumber, mode) {

  // remove active state style from previous preview
  $('#picteria-' + currentImgNumber + '-prev').css('border', 'none');

  currentImgNumber--;
  if (currentImgNumber < 1) { currentImgNumber = 1; }

  $.ajax({
    url: gal + '/' + currentImgNumber,
    type: "get",
    success: function(data){
      $("#container").html(data);
      showImage('#picteria-1', mode);
    },
    error:function(){
      $("#container").html('There is error while submit');
    }
  });

  // add active state style to current preview
  $('#picteria-' + currentImgNumber + '-prev').css('border', '1px solid white');

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

  setTimeout(function(){
    mode == 'screen' ? fullScreen(currentImgId) : fullImage(currentImgId);
  }, 50);

}


function showPreviews(previews, offset) {

  setTimeout(function() {
    if ( !offset ) {
      offset = 0;
    }
    
    $.each(previews, function(index, item) {
      $('#' + item).addClass('hide');
    });
  
    var screenWidth = getWidth() - 400; // place for navigation buttons
    var previewWidth = 0;
    
    var numPreviews = 0;
    
    $.each(previews, function(index, item) {
  
      // skip items before offset
      if ( index <  offset  ) {
        return true;
      }
      
      numPreviews++;
      
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
    console.log(numPreviews);
    // end setTimeout
  }, 50);

  

}


function fullImage(currentImgId) {
  
  var item = $(currentImgId);
  
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

