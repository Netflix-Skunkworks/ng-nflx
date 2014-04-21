var gulp = require('gulp');
var karma = require('gulp-karma');

var testFiles = [
  'bower_components/angular/angular.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'bower_components/lodash/dist/lodash.js',
  'src/*.js',
  'test/*Spec.js'
];

gulp.task('test', function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('default', ['test']);
