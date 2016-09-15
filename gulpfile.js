var gulp =require('gulp'),
    browserSync=require('browser-sync'),
    jade=require('gulp-jade'),
    autoprefixer=require('gulp-autoprefixer'),
    rename=require('gulp-rename'),
    sass=require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    htmlmin = require('gulp-html-minifier'),
    uglify = require('gulp-uglify'),
    prettify = require('gulp-jsbeautifier'),/*
  cleanCSS = require('gulp-clean-css'),*/
    gulpif = require('gulp-if');

/* ------------------------ Directory Settings ---------------------- */
var devPath  = './dev',
    jadePath = devPath + "/jade",
    sassPath = devPath + "/sass",
    devCssPath  = devPath + "/css",
    devJsPath  = devPath + "/js",
    devImgPath  = devPath + "/images"
    devVendorPath  = devPath + "/vendor";

var destPath = "./dest",
    htmlPath = destPath + "/site",
    cssPath = htmlPath  +"/assets/css",
    imgPath = htmlPath  +"/assets/images",
    jsPath = htmlPath  +"/assets/js";
    vendorPath = htmlPath  +"/assets/vendor";



/* ------------------------ task config Settings ---------------------- */

var  portNumber= 8001; /* port for browserSync UI */
var minification =false; /* set to false if output showld not be minified html,css,js */
var sassSettings={
      outputStyle: (minification===true)?'compressed': 'expanded',
      onError: browserSync.notify
    };

var jadeSettings={
      pretty: true
    };

var autoprefixerSettings={
      browsers: ['last 35 versions'],
      cascade: false
    };

var browserSyncSettings={
      server: {
        baseDir: htmlPath
      },
      ui: {
        port: portNumber
      }
    };
var uglifySettings={
      sequences: true,
      dead_code: true,
      drop_debugger: true,
      conditionals: true,
      booleans: true,
      loops: true,
      evaluate: true,
      unused: true,
      if_return: true,
      join_vars: true,
      cascade: true,
      drop_console: true
    };
var htmlSettings={
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeAttributeQuotes: true,
      removeComments:true,
      removeEmptyAttributes:true
    };
var plumberSettings=function(error){
  console.log(error);
  this.emit('end');
}
/* ------------------------ Exprn match ---------------------- */

var htmlmatch=[
                htmlPath +"/*.html"
              ],
    jadematch=[
                jadePath  + "/**/*.jade" ,
                '!' + jadePath  + '/**/_*/**/*'
              ],
    sassmatch=[
                sassPath  + "/**/*.sass",
                sassPath  + "/**/*.scss",
                '!' +  sassPath  + '/**/_*/**/*'
              ],
    sassallmatch=[
                sassPath  + "/**/*.sass",
                sassPath  + "/**/*.scss" 
              ],
    jsmatch=[
              devJsPath+"/**/*.js",
              "!"+devJsPath+"/**/*.min.js",
              '!' + devJsPath  + '/**/_*/**/*'
            ],
    imgmatch=[devImgPath+'/**/*'],
    vendormatch=[devVendorPath+'/**/*'],
    jadeallmatch=[
                jadePath  + "/**/*.jade"
              ];

/* ------------------------ Vendor Copy  ---------------------- */
gulp.task('vendor',function(){
  return gulp.src(vendormatch)
        .pipe(plumber(plumberSettings))
        .pipe(gulp.dest(vendorPath))
});

/* ------------------------ sass  task ---------------------- */
gulp.task('sass',function(){
  return gulp.src(sassmatch)
        .pipe(plumber(plumberSettings))
        .pipe(sass(sassSettings)).on('error',function(e){console.log(e);})
        .pipe(autoprefixer(autoprefixerSettings)) 
        .pipe(gulp.dest(cssPath))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(devCssPath))
});
 
 
/* ------------------------ jade  task ---------------------- */
gulp.task('jade',function(){
 
  return gulp.src(jadematch)
        .pipe(plumber(plumberSettings))
        .pipe(jade(jadeSettings))
        .pipe(gulpif(minification===true, htmlmin(htmlSettings)))
        .pipe(gulp.dest(htmlPath)) 

});
 

/* ------------------------ js  task ---------------------- */
gulp.task('scripts',function(){
  return gulp.src(jsmatch) 
        .pipe(plumber(plumberSettings))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulpif(minification===true,uglify(uglifySettings))) 
        .pipe(prettify())
        .pipe(gulp.dest(jsPath))
});


/* ------------------------ image min  task ---------------------- */
gulp.task('imgmin',function(){
  return gulp.src(imgmatch)
        .pipe(plumber(plumberSettings))
        .pipe(gulpif(minification===true,imagemin()))  
        .pipe(gulp.dest(imgPath))
});


/* ------------------------ browserSync  task ---------------------- */
gulp.task('browser-sync', ['sass', 'jade','scripts'], function() {
  return browserSync(browserSyncSettings);
});


/* ------------------------  watch  task -------------------------- */
gulp.task('watch',function(){
  gulp.watch(sassallmatch,['sass']);
  gulp.watch(imgmatch,['imgmin']);
  gulp.watch(jsmatch,['scripts']);
  gulp.watch(jadeallmatch,['jade']);
  gulp.watch(htmlmatch).on('change',browserSync.reload);

});


/* ------------------------ default gulp task -------------------------- */
gulp.task('default',['vendor','browser-sync','watch']);
