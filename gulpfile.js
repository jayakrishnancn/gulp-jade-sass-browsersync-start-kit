var gulp=require("gulp"),
	jade=require('gulp-jade'),
	sass=require('gulp-sass'),
	plumber = require('gulp-plumber'),
	rename =require('gulp-rename'),
	browserSync=require('browser-sync'),
	zip=require('gulp-zip'),
	autoprefixer = require('gulp-autoprefixer');

var	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	htmlmin = require('gulp-html-minifier'),
	cleanCSS = require('gulp-clean-css');

var prettify = require('gulp-jsbeautifier');
/*
*  directories
*/
var app="app";
var htmlPath="dest/public";
var assets=htmlPath+"/assets";
var sassPath=app+"/sass";
var jadePath=app+"/jade";
var jsPath=app+"/js";
var cssPath=assets+"/css";
var imgPath=app+"/images";
var portNumber=8011;
/* tasks */
/*
* 	server
*/

/* jade task */
gulp.task('jade',function(){
	gulp.src([jadePath+"/**/*.jade",'!'+jadePath+'/**/_*/**/*'])
	.pipe(plumber())
	.pipe(jade({
      pretty: true
    }))
   /* .pipe(htmlmin({collapseWhitespace: true,collapseBooleanAttributes: true,minifyCSS: true,minifyJS: true,minifyURLs: true,removeAttributeQuotes: true,removeComments:true,removeEmptyAttributes:true}))*/
    .pipe(gulp.dest(htmlPath))
});
/* jade task */
gulp.task('zipit',function(){
	gulp.src([htmlPath+"/**/*",'!'+htmlPath+'/**/_*/**/*'])
  .pipe(zip('public.zip'))
  .pipe(gulp.dest('dest'));
});


/* sass task */
gulp.task('sass',function(){
	gulp.src([sassPath+"/**/*.sass",sassPath+"/**/*.scss"])
	.pipe(plumber())
	.pipe(sass({outputStyle: 'expanded'}).on('error',function(x){console.log(x);},console.log))
    .pipe(autoprefixer({
            browsers: ['last 35 versions'],
            cascade: false
        }))
    /*.pipe(cleanCSS({compatibility: 'ie8'}))*/
	.pipe(gulp.dest(cssPath))
	.pipe(browserSync.stream());
});



/* sass task */
gulp.task('scripts',function(){
	gulp.src([jsPath+"/**/*.js","!"+jsPath+"/**/*.min.js"])
	.pipe(plumber())
	.pipe(rename({suffix:'.min'}))
	/*.pipe(uglify({
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
	}))*/
    .pipe(prettify())
	.pipe(gulp.dest(assets+'/js'));
});

gulp.task('imgmin',() =>

gulp.src(imgPath+'/**/*')
		.pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(assets+"/images"))
);
//
//	watch
//
gulp.task('watch',function(){
	browserSync.init({
	    server: {
	        baseDir: htmlPath,
	        directories: true
	    },
	    ui: {
			port: portNumber
		}
	});


	gulp.watch(jadePath+"/**/*.jade",['jade']);
	gulp.watch([sassPath+"/**/*.sass",sassPath+"/**/*.scss"],['sass']);
	gulp.watch(jsPath+"/**/*.js",['scripts']);
	gulp.watch(imgPath+"/**/*",['imgmin']);
	gulp.watch([htmlPath+"/*.html"]).on('change',browserSync.reload);
	});

/*
*  default task
*/
gulp.task('default',[ 'imgmin','sass','scripts','jade','watch']);
