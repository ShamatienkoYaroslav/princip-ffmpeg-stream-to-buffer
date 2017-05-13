'use strict';

const fs = require('fs');
const fstb = require('../index');

let inputFormat, inputSource;
const outputFormat = 'jpg';

if (process.platform == 'darwin') {
  inputFormat = 'rtsp';
  inputSource = 'rtsp://media.smart-streaming.com/mytest/mp4:sample.mp4';
}

const proc = fstb.stream({
  inputFormat: inputFormat,
  inputParamsString: '-loglevel quiet',
  inputSource: inputSource,
  outputFormat,
  outputParamsString: '-f image2pipe -preset ultrafast',
  // onProcessClose: (buffer) => {
  //   fs.writeFileSync('./out.' + outputFormat, buffer);
  // }
});

setInterval(() => {
  fs.writeFileSync('./out.' + outputFormat, proc.getBuffer());
}, 100);
