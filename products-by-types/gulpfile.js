// Ваш код
var gulp = require('gulp'), // Сообственно Gulp JS
    less         = require('gulp-less'), //плагин для Less
    eslint       = require('gulp-eslint'),// проерка кода ESlint
    autoprefixer = require('gulp-autoprefixer'), // автопрефиксер
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat') // Склейка файлов
     sourcemaps = require('gulp-sourcemaps');
     watch = require('gulp-watch'),
     livereload = require('gulp-livereload'), // Livereload для Gulp
     lr = require('tiny-lr'), // Минивебсервер для livereload
     connect = require('connect'), // Webserver
    server = lr(),
    browserSync = require('browser-sync').create();

    gulp.task('browser-sync', function() {
        browserSync.init({
            server: {
                baseDir: "./dist"
            }
        });
        
    });
    gulp.task('lint', function() {
        return gulp.src('src/**/*.js','!node_modules/**')
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    });
    gulp.task('styles', function() {
        return gulp.src('src/less/*.less')
            .pipe(less())
            .pipe(concat('all.css'))
            .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
            .pipe(gulp.dest('./dist/css/'))
            .pipe(browserSync.stream())
            .pipe(livereload(server));
    });
        gulp.task('styles-prod', function() {
        return gulp.src('src/less/*.less')
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(concat('all.css'))
            .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
            .pipe(csso())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./dist/css/'))
    });

    gulp.task('copy-images', function() {
        return gulp.src('src/img/*')
            .pipe(gulp.dest('./dist/img'));
    });

    gulp.task('min-images', function() {
        return gulp.src('src/img/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/img'));

    });

    // Собираем JS
    gulp.task('scripts', function() {
        return gulp.src(['src/js/*.js'])
            .pipe(concat('all.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
            .pipe(sourcemaps.init())
            .pipe(gulp.dest('./dist/js'))
            .pipe(browserSync.stream())
             .pipe(livereload(server));
    });
    gulp.task('scripts-prod', function() {
        return gulp.src(['src/js/*.js'])
            .pipe(sourcemaps.init())
            .pipe(concat('all.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
            .pipe(uglify())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./dist/js'))


    });
    gulp.task('copy-html', function(){
        return gulp.src('src/*.html')
            .pipe(gulp.dest('./dist/'))
            .pipe(livereload(server));
    });
    // Локальный сервер для разработки
    gulp.task('http-server', function() {
        connect()
            .use(require('connect-livereload')())
            .use(connect.static('./dist'))
            .listen('9000');

        console.log('Server listening on http://localhost:9000');
    }); 


    gulp.task('watch', function() {

        watch(['./src/less/*.less'], function () {
            gulp.start('styles');
        });

         watch(['./src/*.html'], function () {
            gulp.start('copy-html');
         });

         watch(['./src/js/*.js'], function () {
            gulp.start('scripts');
        });

        watch(['./src/img/*.*'], function () {
            gulp.start('copy-images');
        });
    });
    // *** Default task
    gulp.task('default', ['copy-html', 'styles', 'scripts', 'copy-images'] );
    gulp.task('prod', ['copy-html', 'styles-prod', 'scripts-prod', 'min-images']);


