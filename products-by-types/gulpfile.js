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
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(concat('all.css'))
            .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
           // .pipe(csso())
            .pipe(gulp.dest('./dist/css/'))
            .pipe(browserSync.stream());
    });

    gulp.task('images', function() {
        return gulp.src('src/img/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/img'));
    });


    // Собираем JS
    gulp.task('scripts', function() {
        gulp.src(['src/js/*.js'])
            .pipe(sourcemaps.init())
            .pipe(concat('all.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
            .pipe(gulp.dest('./dist/js'))
            .pipe(uglify())
            .pipe(browserSync.stream());
    });

    // *** Default task
    gulp.task('default', ['styles', 'scripts', 'images']);