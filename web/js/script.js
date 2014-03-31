$(function() {
  
  // get gallery name
  var gal = $('title').text().split(" / ")[1];
  
  // get image list
  var images = $('#container').find('img').map(function() { return this.id; }).get();

  // get previews list
  var previews = $('#controls').find('img.preview').map(function() { return this.id; }).get();
  
  // get id of current image
  var currentImgId = '#' + images[0];

  // place holder for the current image number
  var currentImgNumber = previews[0];

  currentImgNumber = currentImgNumber.replace('picteria-', '');
  currentImgNumber = currentImgNumber.replace('-prev', '');

  // image mode : screen / image
  var mode = 'image';

  // -- show first image on page load -----------------------------------------
  showImage(mode);

  // add active state style
  addActiveStyleCss(currentImgNumber);


  // -- handle screen resize --------------------------------------------------
  var lastExec = 0;

  
  $(window).resize(function() {
    lastExec = updatePreviews(lastExec, gal, currentImgNumber);
  });


  // -- Handle show image -----------------------------------------------------
  $(document).on("click", '#controlsContainer .preview', function() {

//    $.each(images, function(index, item) {
//      $('#' + item).addClass('hide');
//    });

    // remove active state from previous preview
    removeActiveStyleCss(currentImgNumber);
    
    // get clicked element id    
    var id = $(this).attr('id');

    // get corresponding img id
    var img = id.replace('-prev', '');

    // get corresponding id tag
    currentImgId = '#' + img;

    // get image number
    currentImgNumber = img.replace('picteria-', '');

    // add active state to current preview
    addActiveStyleCss(currentImgNumber);

    // get new pic
    $.ajax({
      url: '/' + gal + '/' + currentImgNumber,
      type: "get",
      success: function(data){
        $("#container").html(data);
        showImage(mode);
      },
      error:function() {
        $("#container").html('There is error while submit');
      }
    }); 

    // show new pic
    $('#picteria-1').removeClass('hide');
    
//    $.each(images, function(index, item) {
//      if ( item == img ) {
//        showImage(mode);
//      }
//      else {
//        $('#' + item).addClass('hide');
//      }
//    });
  });


  // -- Handle next previews --------------------------------------------------
  $(document).on("click", '#next', function() {
    nextPreviews(gal);
  });


  // -- Handle previous previews ----------------------------------------------
  $('#prev').click(function() {
    prevPreviews(gal);
  });


  // -- Handle mode change ----------------------------------------------------
  $('#mode').click(function() {
    mode = switchMode(mode);
    return mode;
  });


  // -- keyboard shortcuts ----------------------------------------------------
  // r :              switch mode                82
  // up arrow :       show next previews         38
  // down arrow :     show previous previews     40
  // right arrow :    show next image            39
  // left arrow  :    show previous image        37
  // b :              back to galleries index    66
  // h :              show /hide controls        72
  $(document).keydown(function(e) {
//    console.log(e.which);
    if ( e.which == 82 ) {
      mode = switchMode(mode);
    }
    else if ( e.which == 38 ) {
      nextPreviews(gal);
    }
    else if ( e.which == 40 ) {
      prevPreviews(gal);
    }
    else if ( e.which == 39 ) {
      currentImgNumber = nextImageHandler(gal, currentImgNumber, mode);
    }
    else if ( e.which == 37 ) {
      currentImgNumber = prevImageHandler(gal, currentImgNumber, mode);
    }
    else if ( e.which == 66 ) {
      window.location.href = "/";
    }
    else if ( e.which == 72 ) {
      $('#controls').toggleClass('hide');
    }
  });
});


function updatePreviews(lastExec, gal, currentImgNumber) {

  var delay = 500;

  if(Date.now() - lastExec > delay ) {
    url = '/prev/' + gal + '/' + getWidth() + '/' + parseInt(currentImgNumber) ;

    $.ajax({
      url: url,
      type: "get",
      success: function(data){
        $("#controlsContainer").html(data);
        showImage(mode);
        addActiveStyleCss(currentImgNumber);
      },
      error:function() {
        $("#controlsContainer").html('There is error while submit');
      }
    });

    lastExec = Date.now();
  }
  return lastExec;
}

function addActiveStyleCss(currentImgNumber) {
  $('#' +  currentImgNumber ).css('display' , 'block');
}


function removeActiveStyleCss(currentImgNumber) {
  $('#' +  currentImgNumber ).css('display' , 'none');
}


function nextImageHandler(gal, currentImgNumber, mode) {

  if ($('#picteria-' + ( parseInt(currentImgNumber) + 1 ) + '-prev').length == 0) {

    currentImgNumber = nextPage(gal, currentImgNumber, mode);
  }
  else {
    currentImgNumber = nextImage(gal, currentImgNumber, mode);
  }
  
  return currentImgNumber;
}


function prevImageHandler(gal, currentImgNumber, mode) {

  if ($('#picteria-' + ( parseInt(currentImgNumber) - 1 ) + '-prev').length == 0) {

    currentImgNumber = prevPage(gal, currentImgNumber, mode);
  }
  else {
    currentImgNumber = prevImage(gal, currentImgNumber, mode);
  }

  return currentImgNumber;
}


function nextPage(gal, currentImgNumber, mode) {

  var galItems = $('#controls').attr('data-galItems');
  
  if ( currentImgNumber == galItems ) {
    return currentImgNumber;
  }
  
  currentImgNumber++;
  
  url = '/' + gal + '/' + getWidth() + '/' + currentImgNumber;
  
  $.ajax({
    url: url,
    type: "get",
    success: function(data){
      $("body").html(data);
      showImage(mode);
      addActiveStyleCss(currentImgNumber);
    },
    error:function() {
      $("#container").html('There is error while submit');
    }
  });

  return currentImgNumber;
}


function prevPage(gal, currentImgNumber, mode) {

  if ( currentImgNumber == 1 ) {
    return currentImgNumber;
  }

  currentImgNumber--;

  url = '/' + gal + '/' + getWidth() + '/' + ( parseInt(currentImgNumber) - 1 );

  $.ajax({
    url: url,
    type: "get",
    success: function(data){
      $("body").html(data);
      showImage(mode);
      addActiveStyleCss(currentImgNumber);
    },
    error:function() {
      $("#container").html('There is error while submit');
    }
  });
  
  return currentImgNumber;
}


function nextImage(gal, currentImgNumber, mode) {

  if ($('#picteria-' + ( parseInt(currentImgNumber) + 1 ) + '-prev').length == 0) {
    return currentImgNumber;
  }

  // remove active state style from previous preview
  removeActiveStyleCss(currentImgNumber);
  
  currentImgNumber++;

  $.ajax({
    url: '/' + gal + '/' + currentImgNumber,
    type: "get",
    success: function(data){
      $("#container").html(data);
      showImage(mode);
    },
    error:function() {
      $("#container").html('There is error while submit');
    }
  });
  
  // add active state style to current preview
  addActiveStyleCss(currentImgNumber);

  return currentImgNumber;
}


function prevImage(gal, currentImgNumber, mode) {

  if ($('#picteria-' + ( parseInt(currentImgNumber) - 1 ) + '-prev').length == 0) {
    return currentImgNumber;
  }

  // remove active state style from previous preview
  removeActiveStyleCss(currentImgNumber);

  currentImgNumber--;
  if (currentImgNumber < 1) { currentImgNumber = 1; }

  $.ajax({
    url: '/' + gal + '/' + currentImgNumber,
    type: "get",
    success: function(data){
      $("#container").html(data);
      showImage(mode);
    },
    error:function(){
      $("#container").html('There is error while submit');
    }
  });

  // add active state style to current preview
  addActiveStyleCss(currentImgNumber);
  
  return currentImgNumber;
}


function showImage(mode, resize) {

  setTimeout(function(){
    mode == 'screen' ? fullScreen(resize) : fullImage(resize);
  }, 50);
}


function fullImage(resize) {

  var item = $('#picteria-1');

  if (!resize) {

    var imgPath = item.attr( 'src' );
    var img = new Image();
    img.src = imgPath;

    img.onload = function() {
      _handleFullImageCss(item)
    };
  }
  else {
    _handleFullImageCss(item);
  }
}


function _handleFullImageCss(item) {

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


function fullScreen(resize) {

  var item = $('#picteria-1');

  item.addClass('hide');

  if (!resize) {

    var imgPath = item.attr( 'src' );
    var img = new Image();
    img.src = imgPath;

    img.onload = function() {
      _handleFullScreenCss(item);
    };
  }
  else {
    _handleFullScreenCss(item);
  }
  item.removeClass('hide');
}


function _handleFullScreenCss(item) {

  var screenWidth  = getWidth();
  var screenHeight = getHeight();
  var orientation  = getOrientation();

  //remove css added by fullImage
  item.css( 'max-width',  '' );
  item.css( 'max-height', '' );

  item.css('width', '');
  item.css('height', '');

  var OriginalImageWidth = item.width();
  var OriginalImageHeigth = item.height();

  if ( orientation == 'l' ) {
    var imgHeight = screenWidth / OriginalImageWidth * OriginalImageHeigth;    
    var topPos = ( screenHeight - imgHeight) / 2;
    item.css('width', screenWidth);
    item.css('height', imgHeight);
    item.css( 'top', topPos );
    item.css( 'left', 0 );
    
  }
  else {
    var imgWidth = screenHeight / OriginalImageHeigth * OriginalImageWidth;
    var leftPos = ( screenWidth - imgWidth) / 2;
    item.css('height', screenHeight);
    item.css('width', imgWidth);
    item.css( 'left', leftPos );
    item.css( 'top', 0 );
  }
}


function nextPreviews(gal) {

  var previews = $('#controls').find('img.preview').map(function() { return this.id; }).get();

  var lastImage = previews[previews.length - 1];
  lastImage = lastImage.replace('picteria-', '');
  lastImage = lastImage.replace('-prev', '');

  var galItems = $('#controls').attr('data-galItems');

  // next image
  lastImage++;

  if ( lastImage > galItems ) {
    return false;
  }

  updatePreviews(0, gal, lastImage);
}


function prevPreviews(gal) {

  var previews = $('#controls').find('img.preview').map(function() { return this.id; }).get();

  var firstImage = previews[0];
  firstImage = firstImage.replace('picteria-', '');
  firstImage = firstImage.replace('-prev', '');

  // previous image
  firstImage--;

  if ( firstImage <= 0 ) {
    return false;
  }

  updatePreviews(0, gal, firstImage);
}


function switchMode(mode) {

  mode == 'screen' ? mode='image': mode='screen';

  // set icon to display
  var icon = 'resize';
  if ( mode == 'image' ) { icon = 'fullscreen'; }
  
  // show image
  showImage(mode, 'resize');

  // show icon
  $('#mode').attr('src', '/img/' + icon + '.png');

  return mode;
}


function getWidth() {
 return $(document).width();
}


function getHeight() {
  return $(document).height();
}


function getOrientation() {

  if ( getWidth() * 0.80 > getHeight() ) {
    return 'l';
  }
  return 'p';
}


//function getSize() {
//return getWidth() + 'x' + getHeight();
//}
