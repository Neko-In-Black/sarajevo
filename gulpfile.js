'use strict';
const
  /* Основные плагины */
  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  less = require('gulp-less'),
  // sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  prefixer = require('gulp-autoprefixer'),
  relpath = require('path'),
  del = require('del'),
  /* Плагины для сжатия и конкатинации */
  htmlmin = require('gulp-htmlmin'),
  include = require('gulp-include'),
  cssmin = require('gulp-csso'),
  jsmin = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  concat = require('gulp-concat'),
  /* Оптимизация */
  cleanCss = require('gulp-clean-css'),
  media = require('gulp-group-css-media-queries'),
  rename = require('gulp-rename'),
  /* SVG Спрайты */
  svgstore = require('gulp-svgstore'),
  svgmin = require('gulp-svgmin'),
  /* Преобразование в WebP */
  webP = require('gulp-webp');

/* Выбор препроцессора */
const preproc = less;

/* Основные пути */
const path = {
  /* Пути для папок с готовыми файлами */
  build: {
    html: './build/',
    js: './build/js/',
    css: './build/css/',
    img: './build/img/',
    font: './build/fonts/'
  },
  /* Пути для папок с исходными файлами */
  src: {
    html: './src/*.html',
    htmlInclude: './src/html_partials',
    style: './src/style/main.+(less|scss)',
    js: [
      './src/js/jquery-3.3.1.min.js',
      './src/js/wow.min.js',
      './src/js/main.js'
    ],
    webP: './src/img/main/*.*',
    imgWebPDest: './src/img/webP',
    css: './src/css/',
    img: ['./src/img/**/*.*', '!./src/img/svg-icons/*.*'],
    font: './src/fonts/**/*.*'
  },

  /* Пути для создания спрайтов */
  sprite: {
    src: './src/img/svg-icons/*.svg',
    dest: './src/img/'
  },

  /* Пути для прослушки изменений файлов */
  watch: {
    html: './src/**/*.html',
    js: './src/js/**/*.js',
    style: './src/style/**/*.*',
    img: './src/img/**/*.*',
    font: './src/fonts/**/*.*'
  },
  /* Очистка сборки */
  clean: {
    src: './build/'
  }
};

/* Конфигурация локального сервера */
const config = {
  server: {
    baseDir: './build/'
  },
  tunnel: false,
  notify: true,
  host: 'localhost',
  port: 9000
};

/* Сборка Html */
const htmlBuild = () => {
  return gulp
    .src(path.src.html)
    .pipe(plumber())
    .pipe(include({
      extensions: 'html',
      includePaths: path.src.htmlInclude
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeComments: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({
      stream: true
    }));
};
exports.htmlBuild = gulp.series(htmlBuild);
/* end Сборка Html */

/* Сборка CSS */
const styleBuild = () => {
  return gulp
    .src(path.src.style, {
      sourcemaps: true
    })
    .pipe(plumber())
    .pipe(preproc())
    .pipe(gulp.dest(path.src.css))
    .pipe(prefixer({
      browsers: ['last 10 versions', '> 3%', 'ie 11']
    }))
    .pipe(cleanCss(
    //   {
    //   level: {
    //     1: {
    //       all: true,
    //     },
    //     2: {
    //       all: true
    //     }
    //   }
    // }
    ))
    .pipe(media())
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.build.css, {
      sourcemaps: '.'
    }))
    .pipe(reload({
      stream: true
    }));
};
exports.styleBuild = gulp.series(styleBuild);
/* end Сборка CSS */

/* Сборка JS */
const jsBuild = () => {
  return gulp
    .src(path.src.js, {
      sourcemaps: true
    })
    .pipe(plumber())
    .pipe(concat('all.js'))
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.build.js, {
      sourcemaps: '.'
    }))
    .pipe(reload({
      stream: true
    }));
};
exports.jsBuild = gulp.series(jsBuild);
/* end Сборка JS */

/* Сборка Изображений */
const imageBuild = () => {
  return gulp
    .src(path.src.img)
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true,
        optimizationLevel: 2
      }),
      imagemin.jpegtran({
        progressive: true,
      }),
      imagemin.optipng({
        optimizationLevel: 5,
        bitDepthReduction: true,
        paletteReduction: true
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({
      stream: true
    }));
};
exports.imageBuild = gulp.series(imageBuild);
/* end Сборка Изображений */

/* Сборка SVG-спрайтов */

const svgSpriteBuild = () => {
  return gulp
    .src(path.sprite.src)
    .pipe(svgmin(function (file) {
      var prefix = relpath.basename(file.relative, relpath.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            removeViewBox: true,
            minify: true
          }
        }]
      };
    }))
    .pipe(rename({
      prefix: 'sprite-'
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(path.sprite.dest));
};
exports.svgSpriteBuild = gulp.series(svgSpriteBuild);
/* end Сборка SVG-спрайтов */

/* сборка WebP изображений */
const webPBuild = () => {
  return gulp
    .src(path.src.webP)
    .pipe(webP())
    .pipe(gulp.dest(path.src.imgWebPDest));
};
exports.webPBuild = gulp.series(webPBuild);
/* end сборка WebP изображений */

/* Сборка Шрифтов */
const fontBuild = () => {
  return gulp
    .src(path.src.font)
    .pipe(gulp.dest(path.build.font));
};
exports.fontBuild = gulp.series(fontBuild);
/* end Сборка Шрифтов */

/* удаление билда */
const deleteBuild = () => {
  return del(path.clean.src);
};
exports.deleteBuild = gulp.series(deleteBuild);
/* end удаление билда */

/* Watcher */
const watcher = () => {
  gulp.watch(path.watch.html, htmlBuild);
  gulp.watch(path.watch.style, styleBuild);
  gulp.watch(path.watch.img, imageBuild);
  gulp.watch(path.watch.js, jsBuild);
  gulp.watch(path.watch.font, fontBuild);
};
exports.watcher = gulp.series(watcher);
/* end Watcher */

/* Server */
const server = () => {
  return browserSync(config);
};
exports.server = gulp.series(server);
/* end Server */

/* Build & Default */
exports.build = gulp.series(
  deleteBuild,
  gulp.parallel(htmlBuild, styleBuild, jsBuild, fontBuild), svgSpriteBuild, imageBuild);

exports.default = gulp.series(exports.build, gulp.parallel(server, watcher));