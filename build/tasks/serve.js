var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('serve', ['build'], function(done) {
    nodemon({ script: 'server/main.js' });
});
