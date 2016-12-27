gulp        = require 'gulp'
shell       = require 'gulp-shell'
bowerFiles  = require 'main-bower-files'
clean       = require 'del'
uglify      = require 'gulp-uglify'
filter      = require 'gulp-filter'
concat      = require 'gulp-concat'
js_minify   = require 'gulp-ngmin'
preprocess  = require 'gulp-preprocess'
gutil       = require 'gulp-util'
coffee      = require 'gulp-coffee'
changed     = require 'gulp-changed'
coffeelint  = require 'gulp-coffeelint'
css_minify  = require 'gulp-minify-css'
ngAnnotate  = require 'gulp-ng-annotate'
html_minify = require 'gulp-minify-html'
server      = require 'gulp-webserver'

require('dotenv').config( { path: process.env.HOME + '/.env'})

js_filter  = filter '**/*.js', { restore: true }
css_filter = filter '**/*.css', { restore: true }

src  = 'src'
dest = process.env.TP_CONTROL_NAME
name = 'tableau'

gulp.task 'clean', ->
    clean.sync("#{dest}/*")

gulp.task 'components', ->
	gulp.src bowerFiles()
    .pipe js_filter
    .pipe concat "#{name}-components.js"
    .pipe gulp.dest "#{dest}/js"
    .pipe js_filter.restore
    .pipe css_filter
    .pipe concat "#{name}-components.css"
    .pipe gulp.dest "#{dest}/css"
    .pipe css_filter.restore

gulp.task 'coffee', ->
	gulp.src [ "#{src}/bootstrap.coffee", "#{src}/controller/*.coffee", "#{src}/directives/*.coffee", "#{src}/factory/*.coffee", "#{src}/directive/*.coffee"]
		.pipe changed "#{dest}/js", { extention: '.js' }
		.pipe preprocess()
		.pipe coffee({ bare: true }).on('error', gutil.log)
		.pipe concat "#{name}.js"
		.pipe ngAnnotate()
		.pipe gulp.dest "#{dest}/js"

# gulp.task 'jqueryJs', ->
#   gulp.src "#{src}/js/*.js"
#     .pipe concat    "#{name}-dependencies.js"
#     .pipe gulp.dest "#{dest}/js"

gulp.task 'css', ->
  gulp.src "#{src}/css/*.css"
    .pipe changed   "#{dest}/css}"
    .pipe concat    "#{name}-styles.css"
    .pipe gulp.dest "#{dest}/css"

gulp.task 'copy_other', ->
  gulp.src "#{src}/img/cd-arrow.svg"
    .pipe gulp.dest "#{dest}/medias/img"
  gulp.src "#{src}/view/barNav/*"
    .pipe gulp.dest "#{dest}/templates/barNav"
  gulp.src "#{src}/font/*.ttf"
    .pipe gulp.dest "#{dest}/font/"
  gulp.src "#{src}/data/*.csv"
    .pipe gulp.dest "#{dest}/data/"
  gulp.src "#{src}/fonts/**"
    .pipe gulp.dest "#{dest}/fonts/"
  gulp.src "#{src}/js/*.js"
    .pipe gulp.dest "#{dest}/js"

gulp.task 'compress', ['components'], ->
	gulp.src "#{dest}/js/*.js"
		.pipe ngAnnotate({single_quotes:true})
		.pipe gulp.dest("#{dest}/js")
  gulp.src "#{dest}/css/*.css"
    .pipe css_minify({compatibility: 'ie8'})
    .pipe gulp.dest("#{dest}/css")

gulp.task 'minify', ['compress'], ->
  gulp.src "#{dest}/js/*.js"
    .pipe uglify()
    .pipe gulp.dest("#{dest}/js")

gulp.task 'lint', ->
	gulp.src [ "#{src}**/*.coffee", 'gulpfile.coffee' ]
		.pipe coffeelint()
		.pipe coffeelint.reporter()

gulp.task 'copy', ['components'], ->
  gulp.src "#{src}/index.html"
    .pipe gulp.dest "#{dest}"
  gulp.src "#{src}/views/*.html"
		.pipe gulp.dest "#{dest}/templates/"
  gulp.src "#{src}/modals/*.html"
    .pipe gulp.dest "#{dest}/modals/"
  gulp.src "#{src}/*.xlsx"
    .pipe gulp.dest "#{dest}"
  gulp.src "bower_components/alasql/dist/alasql.min.js"
    .pipe gulp.dest "#{dest}/js"

gulp.task 'htmlCopy', ->
  gulp.src "#{src}/index.html"
    .pipe gulp.dest "#{dest}"
  gulp.src "#{src}/views/*.html"
		.pipe gulp.dest "#{dest}/templates/"
  gulp.src "#{src}/modals/*.html"
    .pipe gulp.dest "#{dest}/modals/"

gulp.task 'copy_json', ->
  gulp.src "Json/*"
    .pipe gulp.dest "#{dest}/Json"

gulp.task 'img_copy', ->
  gulp.src "#{src}/img/**/*"
    .pipe gulp.dest "#{dest}/img/"

# au lieu de copy sh on utilise dest maintenant
gulp.task 'dest', ->
  gulp.src "#{dest}/**"
      .pipe gulp.dest "/var/www/#{dest}"

gulp.task 'webserver', ['common'],() ->
  gulp.src("#{dest}")
    .pipe(server({
        livereload       : true,
        directoryListing : false,
        open             : true
    }))

gulp.task 'watch', ->
    gulp.watch ['src/controller/*.coffee', 'src/directive/*.coffee', 'src/factory/*.coffee'],  ['coffee']
    gulp.watch ['src/index.html', 'src/views/*.html', 'src/modals/*.html'],  ['htmlCopy']
    gulp.watch ['src/css/*.css'], ['css']

gulp.task 'common',  ['clean', 'copy', 'coffee', 'css', 'copy_other', 'copy_json', 'img_copy']
# gulp.task 'default', [ 'common']
gulp.task 'default', ['webserver', 'watch']
