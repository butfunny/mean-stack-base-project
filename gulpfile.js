var gulp = require('gulp');
var fs = require('fs');
var $q = require("q");


var nodemon = require('gulp-nodemon');
gulp.task('start-server', function () {

    nodemon({
        script: 'server.js',
        ext: 'js',
        "ignore": [
            ".idea/",
            ".git/",

            "build/",
            "doc/",
            "node_modules/",
            "/public"
        ],
        env: {'NODE_ENV': 'development'}
    });

});

gulp.task('inject-js', function () {

    return $q.all([injectPublicJs(), injectServerJs()]);
});

function injectPublicJs() {
    var sort = require('gulp-sort');
    var inject = require('gulp-inject');

    var defer = $q.defer();
    var sources = gulp.src('./public/angular/**/*.js', {read: false}).pipe(sort());

    gulp.src("./public/index.html").pipe(inject(sources, {
        ignorePath: "/public",
        starttag: "<!-- inject:spa-js-start -->",
        endtag: "<!-- inject:spa-js-end -->",
        transform: function (filepath, file, i, length) {
            return "<script src=\"" + filepath + "\"></script>";
        }
    }))
        .pipe(gulp.dest('./public'))
        .on("end", function () {
            console.log("Injected public js files");
            defer.resolve();
        })
    ;
    return defer.promise;
}

function injectServerJs() {
    var sort = require('gulp-sort');
    var inject = require('gulp-inject');

    var defer = $q.defer();
    var sources = gulp.src(['./server/**/*.js', "!./server/common/*.*"], {read: false}).pipe(sort());

    gulp.src("./server.js").pipe(inject(sources, {
        ignorePath: "/server",
        starttag: "// inject:server-js start",
        endtag: "// inject:server-js end",
        transform: function (filepath, file, i, length) {
            return "require(\"" + filepath.replace(/^/, "./server") + "\")(injector);";
        }
    }))
        .pipe(gulp.dest('./'))
        .on("end", function () {
            console.log("Injected server js files");
            defer.resolve();
        })
    ;
    return defer.promise;
}

gulp.task('compile-sass', function () {
    var watch = ['./pubic/angular/**/*.scss'];
    var sass = require('gulp-sass');
    var compileSass = function () {
        console.log("Compiling sass files");
        return gulp.src('./public/assets/sass/app.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./public/assets/css'));
    };

    gulp.watch(watch, compileSass);
    compileSass();

    console.log("Watching scss files");
});