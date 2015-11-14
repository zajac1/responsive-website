var gulp = require('gulp'),
    $    = require('gulp-load-plugins')({
            rename:
                {
                   'gulp-if': 'gulpif',
                   'gulp-minify-html': 'minifyHTML'
                } 
            }),
    imageminOptipng = require('imagemin-optipng'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    notifier = require('node-notifier');

var destRoot       = 'dist',
    assetsRoot     = 'assets',
    sassRoot       = 'dev/scss/main.scss',
    jsRoot         = 'dev/js/main.js',
    sassDest       = assetsRoot + '/css',
    jsDest         = assetsRoot + '/js',
    pngSrc         = 'dev/scss/img/*.png',
    pngDest        = destRoot + '/img/',
    minifyHTMLSrc  = destRoot + '/**/*.html',
    minifyHTMLDest = destRoot;

function ErrorReporter(err) {
    var errorTitle = "Error: " + err.message;
    var errorContent =  err.fileName + "\n" + "Line number: " + err.lineNumber;
    notifier.notify({title: errorTitle, message: errorContent });
}

gulp.task('sass2css', function () {
  return gulp.src(sassRoot)
    .pipe($.sass())
    .on('error', ErrorReporter)
    .pipe($.autoprefixer({browsers: ['last 2 versions', 'Explorer 10']}))
    .pipe(gulp.dest(sassDest))
    .pipe(reload({stream: true}));
});


// https://github.com/jshint/jshint/blob/master/examples/.jshintrc
gulp.task('js', function() {
  return gulp.src(jsRoot)
    .pipe($.jshint('.jshintrc')) 
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(jsDest));
});

gulp.task('watch', ['sass2css'],  function () {
    browserSync.init({ server: "." });
    gulp.watch("dev/scss/*.scss", ['sass2css']);
    gulp.watch('dev/js/*.js').on('change', reload);
    gulp.watch("./*.html").on('change', reload);
});


gulp.task('pngOptimize', function () {
    return gulp.src(pngSrc)
        .pipe(imageminOptipng({optimizationLevel: 2})())
        .pipe(gulp.dest(pngDest));
});

gulp.task('minifyHTML', function() {
    var opts = { conditionals: true, spare: true };

    return gulp.src(minifyHTMLSrc)
        .pipe($.minifyHTML(opts))
        .pipe(gulp.dest(minifyHTMLDest));
})

gulp.task('assets', function() {
   var assets = $.useref.assets();
   return gulp.src('./*.html')
        .pipe(assets)
        .pipe($.gulpif('*.js', $.uglify()))
        .pipe($.gulpif('*.css', $.minifyCss()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(destRoot))
});

gulp.task('default', ['sass2css', 'js']); 
gulp.task('build', ['sass2css', 'assets', 'pngOptimize', 'minifyHTML'], function() {
    notifier.notify({ title: 'Production Build', message: 'Done' });
});
