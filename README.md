SimpleSite-One
==============

Simple Boilerplate Site -  Single Page, Owl Carousel, Smooth Scroll, Gulp workflow with sass, autoprefix, js, webpack, browser-sync and cache busting


----

##Demo
example output created in the `dist` directory:

[DEMO SITE OUTPUT](http://jparkerweb.github.io/SimpleSite-One/)



##Usage
* run `npm install'
* requires ruby sass (look at the sass lang install site for install instructions: http://sass-lang.com/install)
* run:
  * `gulp` (dev mode which will compile all assets and put them in the build directory unminified as well start spin up browser-sync with live reload functionality and watch for any changes)
  * `gulp build` (build assets minified and place into build directory)
  * `gulp dist` (build assets minified with appened hash file names to cache bust, as well as auto updated your html files with references to the new generated files)
