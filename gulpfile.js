var gulp = require('gulp');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var connect = require('gulp-connect');
var open = require('gulp-open');
var del = require('del');
var runSequence = require('run-sequence');
var _static = require('node-static');

var paths = {
  vendorJs: [
    'node_modules/angular/angular.js',
    'node_modules/angular-strap/dist/angular-strap.js',
    'node_modules/angular-strap/dist/angular-strap.tpl.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/moment/min/moment.min.js'
  ],
  vendorCss: [
    'node_modules/bootstrap/dist/css/bootstrap.css'
  ]
};

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
  var js = ['assets/js/app/**/*.js'];
  var css = ['assets/css/*.css'];

  gulp.src('./public/index.html')
    .pipe(inject(gulp.src([].concat(paths.vendorJs, paths.vendorCss, js, css), {read: false})))
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
          if (req.url.indexOf('/assets/') === 0) {
            fileServer.serve(req, res);
          } else if (req.url.indexOf('/node_modules/') === 0) {
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
  gulp.watch(['assets/**/*.*'], function(event) {
    if (event.type === 'added' || event.type === 'deleted') {
      runSequence('clean', 'views', 'inject', 'reload-app');
    } else {
      runSequence('reload-app');
    }
  });

  gulp.watch('./index.html', function() {
    runSequence('clean', 'views', 'inject', 'reload-app');
  });
});

gulp.task('reload-app', function() {
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
