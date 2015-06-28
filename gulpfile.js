"use strict";
var gulp = require("gulp");
var typescript = require("gulp-typescript");
var concat = require('gulp-concat');
var header = require('gulp-header');
var stream = require('event-stream');
var rename = require('gulp-rename');
var del = require('del');


var typings = ["./typings/tsd.d.ts", "./components/phosphor/dist/phosphor.d.ts"];

var tsSources = [
    "index",
    "app",
    "NotebookComponent",
    "nbformat",
    "demodata",
    "mathjaxutils",
    "kernel"
].map(function(name) {return "./src/" + name + ".ts"; });


gulp.task('clean', function(cb) {
  del(['./dist'], cb);
});


gulp.task('src', function() {
    var project = typescript.createProject({
        declarationFiles: true,
        noImplicitAny: false,
        target: 'ES5',
        module: 'amd'
    });

  var src = gulp.src(typings.concat(tsSources))
    .pipe(typescript(project));

  var dts = src.dts.pipe(concat('phosphor-notebook.d.ts'))
    .pipe(gulp.dest('./dist'));

  var js = src//.pipe(concat('phosphor-notebook.js'))
    .pipe(header('"use strict";\n'))
    .pipe(gulp.dest('./dist'));

  return stream.merge(dts, js);
});


gulp.task('build', ['src']);


gulp.task('dist', ['build'], function() {
  return gulp.src('./dist/phosphor-notebook.js')
       //.pipe(uglify())
    .pipe(rename('phosphor-notebook.min.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('watch', function() {
  gulp.watch(tsSources, ['src']);
});


gulp.task('default', ['dist']);
