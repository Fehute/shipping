var gulp = require('gulp'),
    connect = require('gulp-connect')

gulp.task('serve', function () {
    connect.server({
        root: '.',
        livereload: true,
        fallback: 'index.html',
        port: '82'
    });
});

// Start the tasks
gulp.task('default', ['serve']);
