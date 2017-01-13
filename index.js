'use strict';

/**
* Module dependencies.
**/

const spawn = require('child_process').spawn;
const Writable = require('stream').Writable;

/**
* Module body.
**/

const spawnProcess = (params, outputStream = null) => {
  let proc = spawn('ffmpeg', params);

  if (outputStream) {
    proc.stdout.pipe(outputStream);
  }

  proc.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  proc.killProcess = () => {
    proc.kill();

    return getBufferFromStream(outputStream);
  };

  proc.getBuffer = () => {
    return getBufferFromStream(outputStream);
  }

  return proc;
}

const getBufferFromStream = (stream) => {
  if (stream) {
    return stream._buffer;
  }

  return null;
}

/**
* Export.
**/

module.exports = {
  stream: (params) => {
    let { inputFormat,
      inputFramerate,
      inputParamsString = '',
      inputSource,
      outputPixFormat,
      outputFormat,
      outputParamsString = '',
      outputStream = null } = params;

    let commandParams = [];
    commandParams.push('-f');
    commandParams.push(inputFormat.toString());
    commandParams.push('-framerate');
    commandParams.push(inputFramerate.toString());

    if (inputParamsString) {
      commandParams.push(inputParamsString.toString());
    }

    commandParams.push('-i');
    commandParams.push(inputSource.toString());
    commandParams.push('-y');
    commandParams.push('-pix_fmt');
    commandParams.push(outputPixFormat.toString());
    commandParams.push('-f');
    commandParams.push(outputFormat.toString());

    if (outputParamsString) {
      commandParams.push(outputParamsString.toString());
    }

    commandParams.push('pipe:1');

    if (!outputStream) {
      outputStream = new Writable;
      outputStream._buffer = null;
      outputStream._write = function (chunk, enc, next) {
        if (outputStream._buffer) {
          outputStream._buffer = Buffer.concat([outputStream._buffer, chunk]);
        } else {
          outputStream._buffer = Buffer.from(chunk);
        }

        next();
      };
    }

    return spawnProcess(commandParams, outputStream);
  }
}
