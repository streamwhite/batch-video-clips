'use strict';
// use ffmpeg to replace ffmpeg
let videoshow = (await import('videoshow')).default;

import fs from 'fs';

const videoOptions = {
  fps: 25,
  loop: 5, // seconds
  transition: false,
  transitionDuration: 1, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  // 常见的视频分辨率，是宽度
  size: '1080x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p',
};

const audioFile = './assets/audio.mp3';

export function images2video(images, fileName, { pptsFolder, imagesFolder }) {
  videoshow(images, videoOptions)
    .audio(audioFile)
    .save(`${imagesFolder}/${fileName}.mp4`)
    .on('error', function (err, stdout, stderr) {
      console.error('Error:', err);
      console.error('ffmpeg stderr:', stderr);
    })
    .on('end', function (videoPath) {
      console.log('Video created in:', videoPath, '\n');
      images.forEach((image, index) => {
        if (index === 0) {
          fs.renameSync(
            image,
            `${imagesFolder}/${fileName.split('-')[0]}-cover.jpg`
          );
        } else {
          fs.unlinkSync(image);
        }
      });
      fs.unlinkSync(`${pptsFolder}/${fileName}.pptx`, () => {});
    });
}
