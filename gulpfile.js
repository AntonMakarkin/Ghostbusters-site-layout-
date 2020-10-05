let projectFolder = require("path").basename(__dirname);
let sourceFolder = "src";
let fs = require('fs');

let path = {
    build:{
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        svg: projectFolder + "/svg/"
    },
    src:{
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/css/main.css",
        js: sourceFolder + "/js/script.js",
        img: sourceFolder + "/img/**/*.{jpg,png,gif,ico,webp}",
        svg: sourceFolder + "/svg/**/*.svg"
    },
    watch:{
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/css/**/*.css",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg,png,gif,ico,webp}",
        svg: sourceFolder + "/svg/**/*.svg"
    },
    clean: "./" + projectFolder + "/"
};

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    del = require("del"),
    autoprefixer = require("gulp-autoprefixer"),
    groupMedia = require("gulp-group-css-media-queries"),
    cleanCSS = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    webp = require('gulp-webp'),
    webphtml = require("gulp-webp-html"),
    webpcss = require("gulp-webpcss"),
    webpack = require('webpack-stream');

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + projectFolder + "/"
        },
        port: 8000,
        notify: false
    });
}

function html() {
    return src(path.src.html)
       .pipe(dest(path.build.html))
       .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css)
       .pipe(groupMedia())
       .pipe(
           autoprefixer({
               overrideBrowserlist: ["last 10 versions"],
               cascade: true
           })
       )
       .pipe(cleanCSS())
       .pipe(
           rename({
               extname: ".min.css"
           })
       )
       .pipe(dest(path.build.css))
       .pipe(browsersync.stream());
}

function images() {
    return src(path.src.img)
       .pipe(
           imagemin({
               progressive: true,
               svgoPlugins: [{ removeViewBox: false }],
               interlaced: true,
               optimizationLevel: 10
           })
       )
       .pipe(dest(path.build.img))
       .pipe(browsersync.stream());
}

function exportSVG() {
    return src(path.src.svg)
       .pipe(dest(path.build.svg))
       .pipe(browsersync.stream());
}

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/script.js")
               .pipe(webpack({
                   mode: 'production',
                   output: {
                       filename: 'script.js'
                   },
                   module: {
                       rules: [
                           {
                               test: /\.m?js$/,
                               exclude: /(node_modules|bower_components)/,
                               use: {
                                   loader: 'babel-loader',
                                   options: {
                                       presets: [["@babel/preset-env", {
                                           targets: {
                                               "node": "current"
                                           },
                                           "corejs": 3,
                                           "useBuiltIns": "usage"
                                       }]]
                                   }
                               }   
                           }
                       ]
                   }
               }))
               .pipe(gulp.dest(path.build.js))
               .on("end", browsersync.reload);
});

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], /*gulp.parallel("build-prod-js")*/);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.svg], exportSVG);
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html, images, exportSVG, /*"build-prod-js"*/));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.exportSVG = exportSVG;
exports.images = images;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;