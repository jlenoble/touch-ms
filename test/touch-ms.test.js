import {expect} from 'chai';
import gulp from 'gulp';
import {Stator} from 'stat-again';
import {tmpDir} from 'cleanup-wrapper';
import touchMs from '../src/touch-ms';

describe('Testing touch', function () {
  it(`mtime is updated`, tmpDir('build3', function () {
    const glob = 'src/touch-ms.js';
    const glob2 = 'build3/src/touch-ms.js';
    const stator = new Stator(glob);
    const stator2 = new Stator(glob2);

    return new Promise((resolve, reject) =>
      gulp.src(glob, {base: process.cwd()})
        .pipe(gulp.dest('build3'))
        .on('error', reject)
        .on('end', resolve))
      .then(() => {
        return touchMs(glob2);
      }).then(({stats}) => {
        expect(stats.mtime).not.to.be.undefined;
        return stator2.isNewerThan(stator);
      }).then(yes => {
        expect(yes).to.be.true;
      });
  }));
});
