<?php

function checkGalleryPath($galsDir, $gallery, $rootDir, $app) {

  $galleriesBasePath = $rootDir.$galsDir;

  if (!is_dir($galleriesBasePath)) {
    return 'configError';
  }

  $galleryPath = $galleriesBasePath.$gallery;
  
  // if gallery does not exist => 404
  if (!is_dir($galleryPath)) {
    $referer = $app['request']->headers->get('referer');
    return '404Error';
  }

  return $galleryPath;
}

function showPreviews($size, $galleryPath, $gallery, $id) {

  $screenWidth = $size - 180;
  $previewsWidth = 0;

  $picInfos = array();
  $prevPics = array();
  $picCount = 0;
  $screenNo = 1;
  $pagesInfos = array();
  $margin = 5;
  
  $firstPic = 1;

  // get pics per page
  foreach (glob($galleryPath . "/prev-*") as $prevPic) {

    $picCount++;
    $buffer = getimagesize($prevPic);
    if ( $buffer[0] == 90 ) {$buffer[0] = 120;}
    $previewsWidth += $buffer[0] + $margin; // fixes spacing issue

    if ( $previewsWidth + 120 + $margin > $screenWidth ) { // was : +90
      $pagesInfos[] = array( $screenNo, $firstPic, $picCount - 1 );
      $screenNo++;
      $previewsWidth = 0;
      $firstPic = $picCount;
    }
    $picsInfos[] = array( $screenNo, $picCount, basename($prevPic).PHP_EOL );
  }

  // get screen no
  foreach ($pagesInfos as $page) {
    if ( $id >= $page[1] && $id <= $page[2] ) {
      $screenNo = $page[0];
      break;
    }
  }

  // load corresponding previews
  foreach ($picsInfos as $pic) {
    if ( $pic[0] == $screenNo ) {
      $prevPics[$pic[1]] = $pic[2];
    }
  }
  return array($prevPics, $picCount);
}

