<?php

function showPreviews($size, $galsDir, $gallery, $id) {

  $screenWidth = $size - 300;
  $previewsWidth = 0;

  $galleryPath =  $_SERVER['DOCUMENT_ROOT'].$galsDir.$gallery;

  // if gallery does not exist => 404
  if (!is_dir($galleryPath)) {
    return $app['twig']->render('errors/404.twig', array( 'code' => 404 ));
  }

  $picInfos = array();
  $prevPics = array();
  $picCount = 1;
  $screenNo = 1;
  $pagesInfos = array();

  $firstPic = 1;

  foreach (glob($galleryPath . "/prev-*") as $prevPic) {

    $buffer = getimagesize($prevPic);
    $previewsWidth += $buffer[0] + 15; // + 15 fixed spacing issue
    if ( $previewsWidth + 90 > $screenWidth ) {
      $pagesInfos[] = array( $screenNo, $firstPic, $picCount - 1 );
      $screenNo++;
      $previewsWidth = 0;
      $firstPic = $picCount;
    }

    $picsInfos[] = array( $screenNo, $picCount, basename($prevPic).PHP_EOL );

    $picCount++;
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
