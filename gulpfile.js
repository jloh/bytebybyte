var gulp         = require("gulp"),
    less         = require("gulp-less"),
    cleancss     = require('gulp-clean-css');
    csscomb      = require('gulp-csscomb');
    rename       = require('gulp-rename');
    autoprefixer = require("gulp-autoprefixer"),
    hash         = require("gulp-hash"),
    del          = require("del")

// Compile LESS files to CSS
gulp.task("less", function () {
  del(["static/css/**/*"])
  gulp.src("src/less/main.less")
    .pipe(less({outputStyle : "compressed"}))
    .pipe(autoprefixer({browsers : ["last 20 versions"]}))
    .pipe(csscomb())
    .pipe(cleancss())
    .pipe(hash())
    .pipe(rename({
      suffix: '.min'
     }))
    .pipe(gulp.dest("static/css"))
    // Create hash map
    .pipe(hash.manifest("hash.json"))
    // Put the map into the data directory for hugo to find
    .pipe(gulp.dest("data/css"))
})

// Watch asset folder for changes
gulp.task("watch", ["less"], function () {
  gulp.watch(["src/less/*.less", "src/less/**/*.less"], ["less"])
})

// Build task
gulp.task('default', ['less'])
