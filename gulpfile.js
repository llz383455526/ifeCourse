var gulp = require('gulp');
var uglify = require('gulp-uglify');

var less = require('gulp-less');
var postcss = require('gulp-postcss');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var pump = require('pump');
var del = require('del');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');




// var flexOption = {
//     jsSrc: 'flexbox/js/*.js',
//     cssSrc: 'flexbox/css/*.less',
//     cssType: 'less', //normal,less,scss
//     output: 'flexbox/build/'
// }

getTaskCall(flexOption);
// gulp.task('clean', commonTask.cleanTask);
// gulp.task('js', commonTask.jsTask);
// gulp.task('css', commonTask.cssTask);
// gulp.task('watch', function() {
//     gulp.watch(commonTask.jsSrc, ['js']);
//     gulp.watch(commonTask.cssSrc, ['css']);
// });

gulp.task('default', ['watch']);

/**
 * option 模块配置
 */
function getTaskCall(option) {


    /**
     * clean task
     */
    function cleanTask() {
        return del.sync([option.output + '*']);
    }
    /**
     * jsTask
     */
    function jsTask() {
        pump([
            gulp.src([option.jsSrc]),
            plumber(),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('.'),
            gulp.dest(option.output + 'js')
        ]);
    }

    //css task
    var cssTask = null;
    if (option.cssType == "normal") {
        cssTask = function() {
            pump([
                gulp.src([option.cssSrc]),
                plumber(),
                sourcemaps.init(),
                postcss([require('autoprefixer')]),
                concat('index.css'),
                cleanCss(),
                sourcemaps.write('.'),
                gulp.dest(option.output + 'css')
            ]);
        }
    } else if (option.cssType == "less") {
        cssTask = function() {
            pump([
                gulp.src([option.cssSrc]),
                changed('./', { extension: '.css' }),
                plumber(),
                sourcemaps.init(),
                less(),
                postcss([require('autoprefixer')]),
                concat('index.css'),
                cleanCss(),
                sourcemaps.write('.'),
                gulp.dest(option.output + 'css')
            ]);
        }
    }


    var commonTask = {
        cleanTask: cleanTask,
        jsTask: jsTask,
        jsSrc: option.jsSrc,
        cssTask: cssTask,
        cssSrc: option.cssSrc
    }

    gulp.task('clean', commonTask.cleanTask);
    gulp.task('js', commonTask.jsTask);
    gulp.task('css', commonTask.cssTask);
    gulp.task('watch', ['clean'], function() {
        gulp.watch(commonTask.jsSrc, ['js']).
        on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running js tasks...');
        });
        gulp.watch(commonTask.cssSrc, ['css']).
        on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running css tasks...');
        });
    });

}