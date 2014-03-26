<?php

/*
 * configuration for production environment
 * 
 */

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
