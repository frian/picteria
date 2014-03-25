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
//  var currentImgNumber = $(previews).get(-1);
  currentImgNumber = currentImgNumber.replace('picteria-', '');
  currentImgNumber = currentImgNumber.replace('-prev', '');
  console.log( 'on load currentImgNumber : ' + currentImgNumber);


  // image mode : screen / image
  var mode = 'image';

  // total number of previews
  var numPreviews = 0;

  // number of previews showed in previous previews screens
  var previewShowed = 0;

  
  var PreviousNumPreviews = 0;

  // -- show first image on page load -----------------------------------------
  showImage(currentImgId, mode);


  // add active state style
  console.log( 'currentImgId : ' + currentImgId );
  $('#picteria-' + currentImgNumber + '-prev').css('border', '1px solid white');


  // -- handle screen resize --------------------------------------------------
  $(window).resize(function() {
    showImage(currentImgId, mode);
  });


  // -- Handle show image -----------------------------------------------------
    $(document).on("click", '#controlsContainer .preview', function() {

//    $.each(images, function(index, item) {
//      $('#' + item).addClass('hide');
//    });

    $(currentImgId + '-prev').css('border', 'none');
    
    // get clicked element id    
    var id = $(this).attr('id');

    // get corresponding img id
    var img = id.replace('-prev', '');

    
    currentImgId = '#' + img;

    $(currentImgId + '-prev').css('border', '1px solid white');
    
    currentImgNumber = img.replace('picteria-', '');

    console.log('currentImgNumber : ' + currentImgNumber );
    
    $.ajax({
      url: '/' + gal + '/' + currentImgNumber,
      type: "get",
      success: function(data){
        $("#container").html(data);
        showImage('#picteria-1', mode);
        
      },
      error:function() {
        $("#container").html('There is error while submit');
      }
    }); 

    $('#picteria-1').removeClass('hide');
    
//    $.each(images, function(index, item) {
//      if ( item == img ) {
//        showImage('#picteria-1', mode);
//      }
//      else {
//        $('#' + item).addClass('hide');
//      }
//    });
  });


  // -- Handle next previews --------------------------------------------------
  $('#next').click(function() {

  });


  // -- Handle previous previews ----------------------------------------------
  $('#prev').click(function() {

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
      nextPreviews(previews, numPreviews);
    }
    else if ( e.which == 40 ) {
      prevPreviews(previews, numPreviews);
    }
    else if ( e.which == 39 ) {

      if ($('#picteria-' + ( parseInt(currentImgNumber) + 1 ) + '-prev').length == 0) {

        var galItems = $('#controls').attr('data-galItems');

        if ( currentImgNumber == galItems ) {
          return false;
        }

        url = '/' + gal + '/' + getWidth() + '/' + ( parseInt(currentImgNumber) + 1 );

        $.ajax({
          url: url,
          type: "get",
          success: function(data){
            $("body").html(data);
            showImage('#picteria-1', mode);
            $('#picteria-' + currentImgNumber + '-prev').css('border', '1px solid white');
          },
          error:function() {
            $("#container").html('There is error while submit');
          }
        });
        currentImgNumber++;
      }
      else {
        currentImgNumber = nextImage(gal, currentImgNumber, mode);
      }
    }
    else if ( e.which == 37 ) {
      
      if ($('#picteria-' + ( parseInt(currentImgNumber) - 1 ) + '-prev').length == 0) {

        if ( currentImgNumber == 1 ) {
          return false;
        }

        url = '/' + gal + '/' + getWidth() + '/' + ( parseInt(currentImgNumber) - 1 );

        $.ajax({
          url: url,
          type: "get",
          success: function(data){
            $("body").html(data);
            showImage('#picteria-1', mode);
            $('#picteria-' + currentImgNumber + '-prev').css('border', '1px solid white');
          },
          error:function() {
            $("#container").html('There is error while submit');
          }
        });
        currentImgNumber--;
      }
      else {
        currentImgNumber = prevImage(gal, currentImgNumber, mode);
      }
    }
    else if ( e.which == 66 ) {
      window.location.href = "http://picteria/index.php/";
    }
  });


});


function nextImage(gal, currentImgNumber, mode) {

  if ($('#picteria-' + ( parseInt(currentImgNumber) + 1 ) + '-prev').length == 0) {
    return currentImgNumber;
  }

  // remove active state style from previous preview
  $('#picteria-' + currentImgNumber + '-prev').css('border', 'none');
  
  currentImgNumber++;

  $.ajax({
    url: '/' + gal + '/' + currentImgNumber,
    type: "get",
    success: function(data){
      $("#container").html(data);
      showImage('#picteria-1', mode);
    },
    error:function() {
      $("#container").html('There is error while submit');
    }
  });
  
  // add active state style to current preview
  $('#picteria-' + currentImgNumber + '-prev').css('border', '1px solid white');

  return currentImgNumber;
}


function prevImage(gal, currentImgNumber, mode) {

  if ($('#picteria-' + ( parseInt(currentImgNumber) - 1 ) + '-prev').length == 0) {
    return currentImgNumber;
  }

  // remove active state style from previous preview
  $('#picteria-' + currentImgNumber + '-prev').css('border', 'none');

  currentImgNumber--;
  if (currentImgNumber < 1) { currentImgNumber = 1; }

  $.ajax({
    url: '/' + gal + '/' + currentImgNumber,
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


function nextPreviews(previews, step) {

}


function prevPreviews(previews, step) {

}


function switchMode(currentImgId, mode) {

  mode == 'screen' ? mode='image': mode='screen';

  // set icon to display
  var icon = 'resize';
  if ( mode == 'image' ) { icon = 'fullscreen'; }
  
  // show image
  showImage('#picteria-1', mode, 'resize');

  // show icon
  $('#mode').attr('src', '/img/' + icon + '.png');

  return mode;
}


function showImage(currentImgId, mode, resize) {

  setTimeout(function(){
    mode == 'screen' ? fullScreen(currentImgId, resize) : fullImage(currentImgId, resize);
  }, 50);
}


function fullImage(currentImgId, resize) {
  console.log('currentImgId in full image : ' + currentImgId );
  var item = $(currentImgId);

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


function fullScreen(currentImgId, resize) {

  var item = $(currentImgId);

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
