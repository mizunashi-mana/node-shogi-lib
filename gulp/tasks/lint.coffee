module.exports = (gulp, $, conf) ->
  merge = require 'merge2'
  runSequence = require 'run-sequence'

  {paths} = conf

  gulp.task 'lint:gulp:coffee', ->
    gulp.src [
      paths.gulp.file
      paths.gulp.tasks
    ]
      .pipe do $.coffeelint
      .pipe do $.coffeelint.reporter
      .pipe $.coffeelint.reporter 'fail'

  gulp.task 'lint:gulp', (cb) ->
    runSequence 'lint:gulp:coffee'
      , cb

  gulp.task 'lint:config', ->
    throw new Error 'not implement!'

  gulp.task 'lint:src:ts', ->
    gulp.src [
      paths.srcDir.srcTs
      paths.tests.srcDir.srcTs
      paths.srcDir.libTypings
    ]
      .pipe do $.tslint
      .pipe $.tslint.report 'verbose'

  gulp.task 'lint:src', (cb) ->
    runSequence 'lint:src:ts'
      , cb

  gulp.task 'lint', (cb) ->
    runSequence 'lint:gulp'
      #, 'lint:config'
      , 'lint:src'
      , cb
