// ffmpeg -f rtsp -i rtsp://media.smart-streaming.com/mytest/mp4:sample.mp4 -vcodec copy -f mp4 -y MyVideoFFmpeg.mp4

'use strict';

const fs = require('fs');
const fstb = require('../index');

let inputFormat, inputSource;
const outputFormat = 'mp4';

inputFormat = 'rtsp';
inputSource = 'rtsp://media.smart-streaming.com/mytest/mp4:sample.mp4';

const proc = fstb.stream({
  inputFormat: inputFormat,
  inputSource: inputSource,
  inputParamsString: '-loglevel quiet',
  outputFormat,
  outputParamsString: '-vcodec copy -movflags frag_keyframe+empty_moov'
});

// setInterval(() => {
//   console.log('BUFFER: ', proc.getBuffer());
// }, 1000);

setTimeout(() => {
  let buffer = proc.killProcess();
  fs.writeFileSync('./out.' + outputFormat, buffer);
  process.exit();
}, 15000);
