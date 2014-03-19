<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


// infomaniak subdomain
// $galsDir = '/picteria/web/galleries/';
$galsDir = 'web/galleries/';

/**
 * -- galleries index ---------------------------------------------------------
 */
$app->get('/', function () use ($app, $galsDir) {

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
    $galleriesData[basename($gal)] = '/'.$galsDir.basename($gal).'/'.$pic.PHP_EOL;
  }
  
  return $app['twig']->render('index.twig', array( 'galleriesData' => $galleriesData ));
})
->bind('home');


/**
 * -- show gallery ------------------------------------------------------------
 */
$app->get('/{gallery}', function ($gallery) use ($app, $galsDir) {

  $galleryPath =  $_SERVER['DOCUMENT_ROOT'].$galsDir.$gallery;

  // if gallery does not exist => 404
  if (!is_dir($galleryPath)) {
    return $app['twig']->render('errors/404.twig', array( 'code' => 404 ));
  }

  $prevPics = array();

  foreach (glob($galleryPath . "/prev-*") as $prevPic) {
    array_push( $prevPics, basename($prevPic).PHP_EOL);
  }

  $pics = array();
  $pics[0] = preg_replace("/prev-*/", '', $prevPics[0]);
  $pics[1] = preg_replace("/prev-*/", '', $prevPics[1]);

  return $app['twig']->render('gallery.twig', array( 
    'prevPics' => $prevPics,
    'pics'     => $pics,
    'gallery'  => $gallery
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
