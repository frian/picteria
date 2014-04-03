<?php

/*
 * configuration for production environment
 * 
 */

/*
 *  Gallery directory
 * 
 *    standard configuration
 *    should work in most cases
 *    if not commment the following line
 *    and uncomment line 21 below 
 */
$galsDir = '/web/galleries/';

/*
 *  configuration for some subdomains (provider dependent)
 *  
 *    $galsDir = '/<subdomain>/web/galleries/';
*/
// $galsDir = '/picteria/web/galleries/';


// load helper
require __DIR__.'/../src/helper.php';

// enable http caching
use Silex\Provider\HttpCacheServiceProvider;
$app->register(new HttpCacheServiceProvider());

// configure caching

// cache
$app['cache.path'] = __DIR__ . '/../var/cache';

// http cache dir
$app['http_cache.cache_dir'] = $app['cache.path'] . '/http';


$app['twig.path'] = array(__DIR__.'/../src/views');
// $app['twig.options'] = array('cache' => __DIR__.'/../var/cache/twig');
