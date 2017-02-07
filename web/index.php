<?php

// load Silex
require_once __DIR__.'/../vendor/autoload.php';

// load application core
$app = require __DIR__.'/../src/app.php';

// cload configuration
require __DIR__.'/../config/prod.php';

// load controllers
require __DIR__.'/../src/controllers.php';

// load anything more ...

// run app
$app->run();
