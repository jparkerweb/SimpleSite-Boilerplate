// ==========================================
// ===             Require                ===
// ==========================================
	var browserSync = require('browser-sync'),
		runSequence = require('run-sequence');

	var gulp = require('gulp');

	var notify = require('gulp-notify'),
		gutil = require('gulp-util'),
		gulpif = require('gulp-if'),
		clean = require('gulp-clean'),
		rubySass = require('gulp-ruby-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		csso = require('gulp-csso'),
		webpack = require('gulp-webpack'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		revall = require('gulp-rev-all'),
		inject = require('gulp-inject');
// ==========================================



// ==========================================
// global variable to set minification on/off
//  the 'build' task will set it to true
//  while our 'default' task will not minify
	var doMinify = false;
// ==========================================



// ==========================================
// ===         setup Path variables       ===
// ==========================================
	var sourcePaths = {
		Base: 'src',
		SCSS: 'src/scss/**/*.scss',
		JS: 'src/js/**/*.js',
		JSVendor: 'src/js/vendor/**/*.js',
		JSBase: 'src/js',
		HTML: 'src/*.html'
	};
	var destPaths = {
		BuildBase: 'build',
		BuildCSS: 'build/css',
		BuildJS: 'build/js',
		BuildHTML: 'build/*.html',
		DistBase: 'dist',
		DistCSS: 'dist/css',
		DistJS: 'dist/js',
		DistHTML: 'dist/*.html'
	};
// ==========================================



// ==========================================
// ===           Static server            ===
// ==========================================
	// setup our browser-sync server
	gulp.task('browser-sync', function() {
		browserSync({
			server: {
				baseDir: "build/"
			}
		});
	});
	// reload
	gulp.task('reload', function () {
		console.log('browser-sync reload');
		browserSync.reload();
	});
// ==========================================



// ==========================================
// ===              Build                 === 
// ==========================================
	// -------------------------
	// --    task: SASS       --
	// -------------------------
	gulp.task('sass', function (callback) {
		runSequence(
			'clean-sass',
			'build-sass',
			callback);
	});
		// clean our build path
		gulp.task('clean-sass', function () {  
			return gulp.src([
					destPaths.BuildCSS + '/**/*.css'
				], {read: false})
				.pipe(clean({force: true}));
		});
		// task: compile SASS to CSS and AutoPrefix
		gulp.task('build-sass', function () {
			console.log("builidng sass");
			browserSync.notify("Compiling CSS, please wait...");
			// set sass complete message
			var sassCompleteMessage = "SASS Complete";
			if (doMinify) {
				sassCompleteMessage = sassCompleteMessage + " : MINIFIED";
			}

			return gulp.src(sourcePaths.SCSS)
				.pipe(rubySass()).on('error', notify.onError({message: 'sass error: <%= error %>'}))
				.pipe(autoprefixer('last 4 version'))
				.pipe(gulpif(doMinify, csso()))
				.pipe(gulp.dest(destPaths.BuildCSS))
				.pipe(notify({onLast: true, message: sassCompleteMessage}))
				.pipe(browserSync.reload({stream:true}));
		});


	// -------------------------
	// --    task: scripts    --
	// -------------------------
	gulp.task('scripts', function (callback) {
		runSequence(
			'clean-scripts',
			['vendor-scripts', 'webpack'],
			callback);
	});
		// clean our build path
		gulp.task('clean-scripts', function () { 
			return gulp.src([
					destPaths.BuildJS + '/**/*.js'
				], {read: false})
				.pipe(clean({force: true}));
		});
		// task: concat vendor scripts
		gulp.task('vendor-scripts', function() {
			return gulp.src(sourcePaths.JSVendor)
				.pipe(concat('1-vendor.js'))
				.pipe(gulpif(doMinify, uglify()))
				.pipe(gulp.dest(destPaths.BuildJS));
		});
		// task: Run Javascript files through Webpack
		gulp.task('webpack', function() {
			console.log(sourcePaths.JSBase + '/app.js');
			return gulp.src([sourcePaths.JSBase + '/app.js'])
				.pipe(webpack({
					output: { filename: "2-app.js" }
				}))
				.pipe(gulpif(doMinify, uglify()))
				.pipe(gulp.dest(destPaths.BuildJS));
		});


	// -------------------------
	// --task: Favicon (build)--
	// -------------------------
	gulp.task('favicon-build', function(callback){
		return gulp.src(sourcePaths.Base + '/favicon.ico')
			.pipe(gulp.dest(destPaths.BuildBase))
	});


	// -------------------------
	// --      task: html     --
	// -------------------------
	gulp.task('html', function (callback) {
		runSequence(
			'clean-html',
			'build-html',
			callback);
	});
		// clean our build path
		gulp.task('clean-html', function () { 
			return gulp.src([
					destPaths.BuildHTML
				], {read: false})
				.pipe(clean({force: true}));
		});
		// inject our built css and js source into our html file
		gulp.task('build-html', function() {
			var target = gulp.src(sourcePaths.HTML);
			var sources = gulp.src([
					destPaths.BuildJS + '/**/*.js', 
					destPaths.BuildCSS + '/**/*.css'
				], {read: false});
			var options = {
				relative: false,
				addRootSlash: false,
				ignorePath: destPaths.BuildBase
			};

			return target.pipe(inject(sources, options))
				.pipe(gulp.dest(destPaths.BuildBase))
				.pipe(browserSync.reload({stream:true}));
		});
// ==========================================



// ==========================================
// ===               DIST                 ===
// ==========================================
	// process files into our `dist` folder
	gulp.task('dist', function (callback) {
		runSequence(
			'build',
			'clean-dist',
			['dist-css', 'dist-js', 'favicon-dist'],
			'dist-html',
			callback);
	});
		// clean our build path
		gulp.task('clean-dist', function () {  
			return gulp.src([
					destPaths.DistBase + '/**/*.css',
					destPaths.DistBase + '/**/*.js',
					destPaths.DistBase + '/*.html'
				], {read: false})
				.pipe(clean({force: true}));
		});
		// chache bust css
		gulp.task('dist-css', function () {
			var revall = require('gulp-rev-all'); 
			return gulp.src([
					destPaths.BuildCSS + '/**/*.css'
				])
				.pipe(revall())
				.pipe(gulp.dest(destPaths.DistCSS));	
		});
		// cache bust js
		gulp.task('dist-js', function () {
			var revall = require('gulp-rev-all');
			return gulp.src([
					destPaths.BuildJS + '/**/*.js'
				])
				.pipe(revall())
				.pipe(gulp.dest(destPaths.DistJS));	
		});	
		// copy over favicon
		gulp.task('favicon-dist', function(callback){
			return gulp.src(sourcePaths.Base + '/favicon.ico')
				.pipe(gulp.dest(destPaths.DistBase))
		});		
		// create dist assets
		gulp.task('dist-html', function () {
			var target = gulp.src(sourcePaths.HTML);
			var sources = gulp.src([
					destPaths.DistJS + '/**/*.js', 
					destPaths.DistCSS + '/**/*.css'
				], {read: false});
			var options = {
				relative: false,
				addRootSlash: false,
				ignorePath: destPaths.DistBase
			};

			return target.pipe(inject(sources, options))
				.pipe(gulp.dest(destPaths.DistBase));
		});
// ==========================================



// -------------------------
// --     task: watch     --
// -------------------------
gulp.task('watch', function () {
	gulp.watch(sourcePaths.SCSS, ['sass']);
	gulp.watch(sourcePaths.JS, ['webpack', 'reload']);
	gulp.watch(sourcePaths.HTML, ['html']);
});

// -------------------------
// --    task: default    --
// -------------------------
gulp.task('default', function (callback) {
	runSequence(
		['sass', 'scripts', 'favicon-build'],
		'html',
		'browser-sync',
		'watch',
		callback);
});

// -------------------------
// --    task: build      --
// -------------------------
gulp.task('build', function (callback) {
	doMinify = true;
	runSequence(
		['sass', 'scripts'],
		'html',
		callback);
});