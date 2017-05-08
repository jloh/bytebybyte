var gulp         = require("gulp"),
    less         = require("gulp-less"),
    cleancss     = require('gulp-clean-css');
    csscomb      = require('gulp-csscomb');
    rename       = require('gulp-rename');
    autoprefixer = require("gulp-autoprefixer"),
    hash         = require("gulp-hash"),
    del          = require("del"),
    template     = require('gulp-template')

// Compile LESS files to CSS
gulp.task("less", function() {
  del(["static/css/**/*"])
  // A return is needed here so that gulp waits for this task to write its JSON hash
  return gulp.src("src/less/main.less")
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

// Generate our _headers file
// We only need to do this during actual deployment since its just used by netlify
// Must be done after the 'less' function so that our JSON exists
gulp.task("headers", ['less'], function() {
  // Load our JSON file
  var cssjson = require('./data/css/hash.json')
  gulp.src('src/_headers')
    .pipe(template({maincss: cssjson['main.css']}))
    .pipe(gulp.dest('static'))
})

// Watch asset folder for changes
gulp.task("watch", ["less"], function () {
  gulp.watch(["src/less/*.less", "src/less/**/*.less"], ["less"])
})

// Build task
gulp.task('default', ['less', 'headers'])
