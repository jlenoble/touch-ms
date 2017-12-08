import Muter, {captured} from 'muter';
import {expect} from 'chai';
import TouchMs from '../src/touch-ms';

describe('Testing TouchMs', function () {
  const muter = Muter(console, 'log'); // eslint-disable-line new-cap

  it(`Class TouchMs says 'Hello world!'`, captured(muter, function () {
    new TouchMs();
    expect(muter.getLogs()).to.equal('Hello world!\n');
  }));
});
