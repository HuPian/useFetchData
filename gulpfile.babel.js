let gulp  = require('gulp');
let clean = require('gulp-clean');
let sequence = require('gulp-sequence');
let ts= require('gulp-typescript');
let tsProject = ts.createProject('./src/tsconfig.json')

function handleError (err) {
  console.log(err.toString());
  process.exit(-1);
}

//////////// lib ///////////
gulp.task('default', sequence('clean', 'compile'));
gulp.task('compile', (cb)=>{
    return tsProject.src()
    .pipe(tsProject())
    .on('error', handleError)
    .pipe(gulp.dest('lib'));
});

gulp.task('clean', (cb) => {
  return gulp.src('lib')
      .pipe(clean({force: true}));
});

