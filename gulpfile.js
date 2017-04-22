var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    runSequence = require('run-sequence'),
    plugins = gulpLoadPlugins();


// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
    process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
    process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
    return plugins.nodemon({
        script: 'app/index.js',
        verbose: true
    });
});

// Run the project in development mode
gulp.task('default', function (done) {
    runSequence('env:dev', 'nodemon', done);
});
