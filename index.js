'use strict';

/**
* Module dependencies.
**/

const spawn = require('child_process').spawn;
const Writable = require('stream').Writable;

/**
* Module body.
**/

// ** Utils ** //

const getArrayFromString = (str) => {
  return str.split(' ');
}

// ** Streams ** //

const generateOutputStream = () => {
  let outputStream = new Writable;
  outputStream._buffer = null;
  outputStream._write = function (chunk, enc, next) {
    if (outputStream._buffer) {
      outputStream._buffer = Buffer.concat([outputStream._buffer, chunk]);
    } else {
      outputStream._buffer = Buffer.from(chunk);
    }

    next();
  };

  return outputStream;
}

const getBufferFromStream = (stream) => {
  if (stream) {
    return stream._buffer;
  }

  return null;
}

// ** Processes ** //

const spawnProcess = (params, outputStream = undefined, callback = undefined) => {
  let proc = spawn('ffmpeg', params);

  if (outputStream) {
    proc.stdout.pipe(outputStream);
  }

  proc.on('close', (code) => {
    if (callback) {
      callback(getBufferFromStream(outputStream));
    }
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

/**
* Export.
**/

module.exports = {
  stream: (params) => {
    let { inputFormat = undefined,
      inputFramerate = undefined,
      inputParamsString = undefined,
      inputSource,
      outputPixFormat = undefined,
      outputFormat = undefined,
      outputParamsString = undefined,
      outputStream = undefined,
      onProcessClose = undefined} = params;

    let commandParams = [];

    if (inputFormat) {
      commandParams.push('-f');
      commandParams.push(inputFormat.toString());
    }

    if (inputFramerate) {
      commandParams.push('-framerate');
      commandParams.push(inputFramerate.toString());
    }

    if (inputParamsString) {
      commandParams = commandParams.push(getArrayFromString(inputParamsString.toString()));
    }

    commandParams.push('-i');
    commandParams.push(inputSource.toString());
    commandParams.push('-y');

    if (outputPixFormat) {
      commandParams.push('-pix_fmt');
      commandParams.push(outputPixFormat.toString());
    }

    if (outputFormat) {
      commandParams.push('-f');
      commandParams.push(outputFormat.toString());
    }

    if (outputParamsString) {
      commandParams = commandParams.concat(getArrayFromString(outputParamsString.toString()));
    }

    commandParams.push('pipe:1');

    if (!outputStream) {
      outputStream = generateOutputStream();
    }

    return spawnProcess(commandParams, outputStream, onProcessClose);
  }
}
