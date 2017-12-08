import fs from 'fs';

const passFile = file => {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (!stats.isFile()) {
        const err = new TypeError(`${file} is not a file`);
        err.file = file;
        return reject(err);
      }
      resolve({file, stats});
    });
  });
};

const openFile = ({file}) => {
  return new Promise((resolve, reject) => {
    fs.open(file, 'r+', (err, fd) => {
      if (err) {
        if (fd) {
          err.fd = fd; // eslint-disable-line no-param-reassign
        }
        return reject(err);
      }
      resolve(fd);
    });
  });
};

const closeFile = fd => {
  return new Promise((resolve, reject) => {
    fs.close(fd, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const touchFile = fd => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    fs.futimes(fd, date, date, err => {
      if (err) {
        err.fd = fd; // eslint-disable-line no-param-reassign
        return reject(err);
      }
      resolve(fd);
    });
  });
};

const returnStats = file => {
  return () => passFile(file);
};

const onError = err => {
  throw err;
};

const onPassError = onError;
const onOpenError = onError;
const onTouchError = onError;
const onCloseError = err => {
  if (err.fd) {
    return closeFile(err.fd);
  }
  if (err.file) {
    return err.file;
  }
  throw err;
};

const touchMs = file => Promise.resolve(file)
  .then(passFile)
  .then(openFile, onPassError)
  .then(touchFile, onOpenError)
  .then(closeFile, onTouchError)
  .then(returnStats(file), onCloseError);

export default touchMs;
