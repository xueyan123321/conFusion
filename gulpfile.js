
var gulp = require('gulp'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	changed = require('gulp-changed'),
	rev = require('gulp-rev'),
	browserSync= require('browser-sync'),
	del = require('del'),
	ngannotate = require('gulp-ng-annotate');

gulp.task('jshint',function(){
	return gulp.src('app/scripts/**/*.js')
		   .pipe(jshint('.jshintrc'))
		   .pipe(jshint.reporter(stylish));
});

//clean
gulp.task('clean',function(){
	return del(['dist']);
});

//Default task
gulp.task('default',['clean'],function(){
	gulp.start('usemin','imagemin','copyfonts','copyviews');
});

gulp.task('usemin',['jshint'],function(){
	return gulp.src('./app/**/*.html')
		   .pipe(usemin({
		   	css:[minifycss(),rev()],
		   	js:[ngannotate(),rev()]
		   }))
		   .pipe(gulp.dest('dist/'));
});



//Images
gulp.task('imagemin',function(){
	return del(['dist/images']),gulp.src('app/images/**/*')
		   .pipe(cache(imagemin({optimizationLevel:3,progressive:true,interlaced:true})))
		   .pipe(gulp.dest('dist/images'))
		   .pipe(notify({message:'Images task complete'}));
})

gulp.task('copyfonts',['clean'],function(){
	return gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
	.pipe(gulp.dest('./dist/fonts')),
	gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
	.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copyviews',function(){
	return del(['dist/views']),gulp.src('app/views/**')
		   .pipe(gulp.dest('./dist/views'))
})

//Watch
gulp.task('watch',['browser-sync'],function(){
	gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}',['usemin']);

	gulp.watch('app/images/**/*',['imagemin']);

});

gulp.task('browser-sync',['default'],function(){
	var files = [
		'app/**/*.html',
		'app/styles/**/*.css',
		'app/images/**/*.png',
		'app/scripts/**/*.js',
		'dist/**/*'
	];

	browserSync.init(files,{
		server:{
			baseDir:"dist",
			index:"index.html"
		},
		reloadDelay:1000
	});

	//Watch any files in dist/, reload on change
	gulp.watch(['dist/**']).on('change',browserSync.reload);
});

