<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Frian\Picteria\Helper;

// infomaniak subdomain
// $galsDir = '/picteria/web/galleries/';
// $galsDir = '/web/galleries/';

/**
 * -- galleries index ---------------------------------------------------------
 */
$app->get('/', function () use ($app, $galsDir) {

    // get root dir and remove ending slash
    $rootDir = preg_replace("/\/$/", '', $_SERVER['DOCUMENT_ROOT']);

    $galleriesBasePath = $rootDir.$galsDir;

    if (!is_dir($galleriesBasePath)) {
        return $app['twig']->render('errors/config.twig');
    }

    // get galleries list
    $galleries = glob($galleriesBasePath.'*', GLOB_ONLYDIR);

    // galleriesData
    $galleriesData = array();

    // get the first pic of the gallery
    foreach ($galleries as $gal) {
        $prevPics = array();
        foreach (glob($gal . "/prev-*") as $prevPic) {
            array_push($prevPics, basename($prevPic).PHP_EOL);
            break;
        }
        $pic = preg_replace("/prev-*/", '', $prevPics[0]);

        $galleriesData[basename($gal)] = basename($gal).'/'.$pic.PHP_EOL;
    }

    return $app['twig']->render('index.twig', array( 'galleriesData' => $galleriesData ));
})
->bind('home');


/**
 * -- show gallery ------------------------------------------------------------
 */
$gallery = $app['controllers_factory'];
$gallery->get('/{gallery}/{size}/{id}', function (Request $request, $gallery, $size, $id) use ($app, $galsDir, $rootDir) {

    $helper = new Helper();

    $galleryPath = $helper->checkGalleryPath($galsDir, $gallery, $rootDir, $app);

    if ($galleryPath == 'configError') {
        return $app['twig']->render('errors/config.twig');
    }
    elseif ($galleryPath == '404Error') {
        return $app['twig']->render('errors/404.twig');
    }

    // get the previews
    list($prevPics, $picCount) = $helper->showPreviews($size, $galleryPath, $gallery, $id);

    // get the first preview
    $firstPreview = reset($prevPics);

    // get pic name from preview
    $pic = preg_replace("/prev-/", '', $firstPreview);

    // ajax
    if ($request->isXmlHttpRequest()) {
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
$image = $app['controllers_factory'];
$image->get('/{gallery}/{picNum}', function ($gallery, $picNum) use ($app, $galsDir, $rootDir) {

    $helper = new Helper();

    $galleryPath = $helper->checkGalleryPath($galsDir, $gallery, $rootDir, $app);

    if ($galleryPath == 'configError') {
        return $app['twig']->render('errors/config.twig');
    }
    elseif ($galleryPath == '404Error') {
        return $app['twig']->render('errors/404.twig');
    }

    $pics = scandir($galleryPath);

    foreach ($pics as $pic) {
        if (preg_match('/^\.\.?$/', $pic)) {
            array_shift($pics);
        }
    }

    $numPics = count($pics);

    if ($picNum > $numPics / 2) {
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
$preview = $app['controllers_factory'];

$preview->get('/{gallery}/{size}/{id}', function (Request $request, $gallery, $size, $id) use ($app, $galsDir, $rootDir) {

    // $helper = new Helper();

    $galleryPath = checkGalleryPath($galsDir, $gallery, $rootDir, $app);

    if ($galleryPath == 'configError') {
        return $app['twig']->render('errors/config.twig');
    }
    elseif ($galleryPath == '404Error') {
        return $app['twig']->render('errors/404.twig');
    }


    // get the previews
    list($prevPics, ) = showPreviews($size, $galleryPath, $gallery, $id);

    // ajax
    if ($request->isXmlHttpRequest()) {
        return $app['twig']->render('galleryContentPreviews.twig', array(
            'prevPics' => $prevPics,
            'gallery'  => $gallery
        ));
    }
});


$preview->get('/{gallery}', function ($gallery) use ($app, $galsDir, $rootDir) {

    $helper = new Helper();

    $galleryPath = $helper->checkGalleryPath($galsDir, $gallery, $rootDir, $app);
    $previewsFileName = glob($galleryPath . "/prev-*");
    $previews = array();

    foreach ($previewsFileName as $prevPic) {
        array_push($previews, basename($prevPic).PHP_EOL);
    }
//   if ( $app['request']->isXmlHttpRequest() ) {
    return $app['twig']->render('previews.twig', array(
        'previews' => $previews,
        'gallery'  => $gallery
    ));
//   }
});


/**
 * -- handle errors -----------------------------------------------------------
 */
$app->error(function (\Exception $e, $code) use ($app) {

    // 404.html, 40x.html, 4xx.html, 500.html 5xx.html, default.html
    $templates = array(
        'errors/'.$code.'.twig',
        'errors/'.substr($code, 0, 2).'x.twig',
        'errors/'.substr($code, 0, 1).'xx.twig',
        'errors/default.twig',
    );

    return new Response($app['twig']->resolveTemplate($templates)->render());
});


$app->mount('/gallery', $gallery);
$app->mount('/image', $image);
$app->mount('/preview', $preview);
