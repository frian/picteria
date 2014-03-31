<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


// infomaniak subdomain
// $galsDir = '/picteria/web/galleries/';
$galsDir = '/web/galleries/';

/**
 * -- galleries index ---------------------------------------------------------
 */
$app->get('/', function () use ($app, $galsDir) {

  $rootDir = $_SERVER['DOCUMENT_ROOT'];
  
  $rootDir = preg_replace( "/\/$/", '', $rootDir);
  
  $galleriesPath = $_SERVER['DOCUMENT_ROOT'].$galsDir;
  
  // get galleries list
  $galleries = glob($galleriesPath.'*' , GLOB_ONLYDIR);

  // galleriesData
  $galleriesData = array();

  // get the first pic of the gallery
  foreach ( $galleries as $gal ) {
    $prevPics = array();
    foreach (glob($gal . "/prev-*") as $prevPic) {
      array_push( $prevPics, basename($prevPic).PHP_EOL);
      break;
    }
    $pic = preg_replace("/prev-*/", '', $prevPics[0]);

    $galleriesData[basename($gal)] = $galsDir.basename($gal).'/'.$pic.PHP_EOL;
  }
  
  return $app['twig']->render('index.twig', array( 'galleriesData' => $galleriesData ));
})
->bind('home');


/**
 * -- show gallery ------------------------------------------------------------
 */
$app->get('/{gallery}/{size}/{id}', function ($gallery, $size, $id) use ($app, $galsDir) {

  // get the previews
  list($prevPics, $picCount) = showPreviews($size, $galsDir, $gallery, $id); 

  // get the first preview
  $firstPreview = reset($prevPics);

  // get pic name from preview
  $pic = preg_replace("/prev-/", '', $firstPreview);

  // ajax
  if ( $app['request']->isXmlHttpRequest() ) {
    return $app['twig']->render('galleryContent.twig', array(
        'prevPics' => $prevPics,
        'pic'      => $pic,
        'gallery'  => $gallery,
        'galItems' => $picCount
    ));
  }

  // no ajax
  return $app['twig']->render('gallery.twig', array( 
    'prevPics' => $prevPics,
    'pic'      => $pic,
    'gallery'  => $gallery,
    'galItems' => $picCount
  ));

});


/**
 * -- show pic ----------------------------------------------------------------
 */
$app->get('/{gallery}/{picNum}', function ($gallery, $picNum) use ($app, $galsDir) {
  
 
  $galleryPath =  $_SERVER['DOCUMENT_ROOT'].$galsDir.$gallery;
  
  $pics = scandir($galleryPath);
  
  foreach ($pics as $pic) {
    if ( preg_match('/^\.\.?$/', $pic) ) { array_shift($pics);  }
  }

  $numPics = count($pics);
  
  if ( $picNum > $numPics / 2 ) {
    $picNum = $numPics / 2;
  }
  
  return $app['twig']->render('image.twig', array(
    'gallery' => $gallery,
    'pic'     => $pics[ $picNum - 1 ]
  ));
  
});


/**
 * -- show previews only ------------------------------------------------------
 */
$app->get('/prev/{gallery}/{size}/{id}', function ($gallery, $size, $id) use ($app, $galsDir) {

  // get the previews
  list($prevPics, $picCount) = showPreviews($size, $galsDir, $gallery, $id);

  // ajax
  if ( $app['request']->isXmlHttpRequest() ) {
    return $app['twig']->render('galleryContentPreviews.twig', array(
        'prevPics' => $prevPics,
        'gallery'  => $gallery
    ));
  }

});


/**
 * -- handle errors -----------------------------------------------------------
 */
$app->error(function (\Exception $e, $code) use ($app) {

  if ($app['debug']) {
    return;
  }

  // 404.html, 40x.html, 4xx.html, 500.html 5xx.html, default.html
  $templates = array(
    'errors/'.$code.'.twig',
    'errors/'.substr($code, 0, 2).'x.twig',
    'errors/'.substr($code, 0, 1).'xx.twig',
    'errors/default.twig',
  );

  return new Response($app['twig']->resolveTemplate($templates)->render(array('code' => $code)), $code);
});
