'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    plumber = require('gulp-plumber'),
    browserSync = require("browser-sync"),
    spritesmith = require('gulp.spritesmith'),
    notify = require('gulp-notify'),
    jade = require('gulp-jade'),
    reload = browserSync.reload;;

var path = {
    build: {
      html: 'build/',
      js: 'build/js/',
      css: 'build/css/',
      img: 'build/images/',
      fonts: 'build/fonts/'
    },
    src: {
      js: 'src/js/main.js',
      md: 'src/js/modernizr.js',
      style: 'src/style/style.scss',
      img: 'src/images/img/*.*',
      fonts: 'src/fonts/**/*.*',
      jade: 'src/jade/*.jade',
      sprite: 'src/images/ico/*.*'
    },
    watch: {
      js: 'src/js/**/*.js',
      style: 'src/style/**/*.scss',
      img: 'src/images/img/*.*',
      fonts: 'src/fonts/**/*.*',
      jade: 'src/jade/**/*.jade',
      sprite: 'src/images/ico/*.*'
    },
    test: {
      html: 'test/',
      js: 'test/js/',
      css: 'test/css/',
      img: 'test/images/',
      fonts: 'test/fonts/'
    },
    clean: './build',
    clean_test: './test/'

};

var config_build = {
  server: {
      baseDir: ["./build"]
  },
  // tunnel: true,
  host: 'localhost',
  port: 9000
};

var config_test = {
  server: {
      baseDir: ["./test"]
  },
  // tunnel: true,
  host: 'localhost',
  port: 9000
};

gulp.task('webserver_build', function () {
  browserSync.init(config_build);
});

gulp.task('webserver_test', function () {
  browserSync(config_test);
});


gulp.task('html:build', function () {
  var YOUR_LOCALS = {};
  gulp.src(path.src.jade)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('html_test:build', function () {
    var YOUR_LOCALS = {};
    gulp.src(path.src.jade)
    .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title: 'Jade',
          message: err.message
        }))
      }))
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(path.test.html))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('js_test:build', function () {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(gulp.dest(path.test.js));
});

gulp.task('md:build', function () {
  gulp.src(path.src.md)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('md_test:build', function () {
  gulp.src(path.src.md)
    .pipe(rigger())
    .pipe(gulp.dest(path.test.js))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(sass({
        includePaths: ['src/style/'],
        outputStyle: 'compressed',
        sourceMap: true,
        errLogToConsole: true

    }))
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});


gulp.task('style_test:build', function () {
  gulp.src(path.src.style)
    .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title: 'Styles',
          message: err.message
        }))
      }))
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.test.css))
    .pipe(reload({stream: true}));
});


gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

gulp.task('image_test:build', function () {
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.test.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('fonts_test:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.test.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(path.src.sprite).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    imgPath: '../images/sprite.png',
    padding: 10
  }));
    spriteData.img.pipe(gulp.dest('src/images/img/'));
    spriteData.css.pipe(gulp.dest('src/style/partials/'));
});


gulp.task('build', [
  'html:build',
  'style:build',
  'js:build',
  'md:build',
  'fonts:build',
  'image:build',
  'sprite'
]);

gulp.task('test', [
  'html_test:build',
  'style_test:build',
  'js_test:build',
  'md_test:build',
  'fonts_test:build',
  'image_test:build',
  'sprite'
]);


gulp.task('watch', function(){
  watch([path.watch.jade], function(event, cb) {
    gulp.start('html:build');
    });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
    });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
    gulp.start('md:build');
    });
  watch([path.watch.sprite], function(event, cb) {
    gulp.start('sprite');
    });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
    });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
    });
});

gulp.task('watch_test', function(){
  watch([path.watch.jade], function(event, cb) {
    gulp.start('html_test:build');
    });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style_test:build');
    });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js_test:build');
    gulp.start('md_test:build');
    });
  watch([path.watch.sprite], function(event, cb) {
    gulp.start('sprite');
    });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image_test:build');
    });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts_test:build');
    });
});




// Удаление папки build

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});


// Удаление папки test

gulp.task('clean_test', function (cb) {
  rimraf(path.clean_test, cb);
});


// Папка на продакшн(build)

gulp.task('pr', ['build', 'webserver_build', 'watch']);


// Папка для работы(test)

gulp.task('default', ['test', 'webserver_test', 'watch_test']);