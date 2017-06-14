"use strict";
// the convention is use the name of the module, when the module names contain a - so you have to pick good names and obvious names like concat
var gulp = require('gulp'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
    csso = require('gulp-csso'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del');
// minifyCss = require('gulp-clean-css');


// Moving files like this completely breaks build pipeline as well as development workflow, 
// so to fixed that let’s create some variables that contain the path of src folder as well as dist folders

var options = {
  src: 'src',
  dist: 'dist'
};

// useref is going to do all for us:
// 1. Concatenating Scripts in one app.js file
// gulp.task("concatScripts", function() {
//     return gulp.src([ //putting the return statement is because to each task know when the task is finish and start it.
//         'js/jquery.js',
//         'js/sticky/jquery.sticky.js',
//         'js/main.js'
//         ])
//     .pipe(maps.init())
//     .pipe(concat('app.js'))
//     .pipe(maps.write('./')) // .pipe(maps.write('../maps')) 
//     .pipe(gulp.dest('js'));
// });

// 2. Minification of our Javascirpt files
gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function() {
  return gulp.src(options.src + "/scss/application.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./')) // the current working directory relative to the gulp.dest directory
      .pipe(gulp.dest(options.src + '/css'));
});

gulp.task('watchFiles', function() {
  gulp.watch(options.src + '/scss/**/*.scss' , ['compileSass']); // gulp has something call globing pattern is simple a syntaz to matching a names of files like 'scss/**/*.scss' that means looking the subfolder looking the subdirectories and any file with the sass extension .scss
  // gulp.watch(options.dist + 'js/main.js', ['concatScripts']); we don't even need that
})

gulp.task('clean', function() {
  del(['dist', 'css/application.css*', 'js/app*.js*']);
});

gulp.task('html', ['compileSass'], function() {
  // var assets = useref.assets();
  return gulp.src(options.src + '/index.html')
  // gulp.src(options.src + '/index.html') // start by giving gulp a path
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', csso()))
    // .pipe(assets.restore()) 
    .pipe(useref())
    .pipe(gulp.dest(options.dist)) // the destination will be
});

// the right way but i don't know hot to organize it

// gulp.task('html', function () {
//     return gulp.src('app/*.html')
//         .pipe(useref())
//         .pipe(gulpif('*.js', uglify()))
//         .pipe(gulpif('*.css', minifyCss()))
//         .pipe(gulp.dest('dist'));
// });

gulp.task("build", ['html'], function() {
  return gulp.src([options.src + "/img/**", options.src + "/fonts/**"], { base: options.src})
            .pipe(gulp.dest(options.dist));
});

// this is the previous code:

// gulp.task("build", ['minifyScripts', 'compileSass'], function() {
//   return gulp.src(["css/application.css", "js/app.min.js", 'index.html',
//                    "img/**", "fonts/**"], { base: './'}) //i need to provide the gulp.source method with a parameter with the base option, it tells to gulp to keep the directories structure of everything that's provided in the source 
//             .pipe(gulp.dest('dist'));
// });


gulp.task('serve', ['watchFiles']);

gulp.task("default", ["clean"], function() {
  gulp.start('build'); // the build task will run once the clean task has finish
});
//the gulp.start method is going to change in gulp 4
