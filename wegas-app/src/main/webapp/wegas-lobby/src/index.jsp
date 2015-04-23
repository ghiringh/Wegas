<!doctype html>
<html class="no-js" ng-app="Wegas">
  <head>
    <meta charset="utf-8">
    <title>Wegas - Web game authoring system</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->


    <!-- build:css({.tmp/serve,src}) styles/app.css -->
    <!-- inject:css -->
    <!-- css files will be automaticaly insert here -->
    <!-- endinject -->
     <!-- bower:css -->
    <link rel="stylesheet" href="bower_components/angular-loading-bar/src/loading-bar.css" />
    <!-- endbower -->
    <!-- endbuild -->
  </head>
  <body class="v2">
    <!--[if lt IE 10]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <flash:messages></flash:messages>
    <div ui-view="main" class="view view--main view--background-default"></div>

    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
    <script>
      (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
      function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
      e=o.createElement(i);r=o.getElementsByTagName(i)[0];
      e.src='//www.google-analytics.com/analytics.js';
      r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
      ga('create','UA-XXXXX-X');ga('send','pageview');
    </script>

    <!-- build:js(src) scripts/vendor.js -->
    <!-- bower:js -->
    <!-- run `gulp wiredep` to automaticaly populate bower script dependencies -->
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:js({.tmp/serve,.tmp/partials,src}) scripts/app.js -->
    <!-- inject:js -->
    <!-- js files will be automaticaly insert here -->
    <!-- endinject -->

    <!-- inject:partials -->
    <!-- angular templates will be automatically converted in js and inserted here -->
    <!-- endinject -->
    <!-- endbuild -->

  </body>
</html>
