var gulp = require('gulp');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var connect = require('gulp-connect');
var open = require('gulp-open');
var del = require('del');
var runSequence = require('run-sequence');
var _static = require('node-static');

gulp.task('clean', function() {
  return del([
    'public/app/index.html',
    'public/app/assets/**/*'
  ]);
});

gulp.task('views', function(done) {
  gulp.src('./index.html')
    .pipe(gulp.dest('./public/'))
    .on('end', done);
});

gulp.task('inject', function(done) {
  gulp.src('./public/index.html')
    .pipe(inject(gulp.src(['assets/js/app/**/*.js'], {read: false})))
    .pipe(gulp.dest('./public/'))
    .on('end', done);
});

gulp.task('connect', function() {
  var fileServer = new _static.Server('.', { cache: 0});

  return connect.server({
    root: 'public',
    port: 3001,
    livereload: true,
    middleware: function() {
      return [
        function (req, res, next) {
          if (req.url.indexOf('/assets') === 0) {
            console.log('yayay')
            fileServer.serve(req, res);
          } else {
            next();
          }
        }
      ];
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(['assets/js/app/**/*.js'], function(event) {
    if (event.type === 'added' || event.type === 'deleted') {
      runSequence('clean', 'views', 'inject', 'reload-app');
    } else {
      runSequence('reload-app');
    }
  });

  gulp.watch('./public/index.html', function() {
    runSequence('clean', 'views', 'inject',  'reload-app');
  });
});

gulp.task('reload-app', function() {
  console.log('reload')
  return gulp.src('public/index.html')
    .pipe(connect.reload());
});

gulp.task('open', function(done) {
  var options = {
    uri: 'http://localhost:3001'
  };

  gulp.src(__filename)
    .pipe(open(options))
    .on('end', done);
});

gulp.task('default', function(done) {
  runSequence(
    'clean',
    'views',
    'inject',
    ['connect', 'watch'],
    'open'
  );
});