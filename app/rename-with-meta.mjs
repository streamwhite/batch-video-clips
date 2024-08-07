#! /usr/bin/env node
// only for iphone videos
// get-videos-info with ffmpeg
import { $ } from 'zx';
$.verbose = false;
import { format } from 'date-fns';

// read directory files in raw folder
import fs from 'fs';
const inputFolder = 'raw';
// read dir and filter videos
const isVideo = (filename) => /\.(mov|mp4|avi|mkv|webm)$/i.test(filename);
const files = fs.readdirSync(inputFolder).filter(isVideo);

const getVideoInfo = async (video) => {
  // get video info with ffprobe
  // ffprobe -v quiet -print_format json -show_format -show_streams video_file.mp4
  const { stdout } =
    await $`ffprobe -v quiet -print_format json -show_format -show_streams ${inputFolder}/${video}`;
  //   codec_long_name,width,height,duration,creation_time,language,filename,

  // get following common used info
  const { format, streams } = JSON.parse(stdout);
  const {
    duration,
    tags: { creation_time },
    filename,
  } = format;
  const { codec_long_name, width, height } = streams[0];

  return {
    codec_long_name,
    width,
    height,
    duration,
    creation_time,
    filename,
  };
};

// rename each video file with video info
async function rename(videos) {
  for (const video of videos) {
    const ext = video.split('.').pop();
    const { codec_long_name, creation_time } = await getVideoInfo(video);
    const newFileName = `${
      format(new Date(creation_time), 'yyyy-MM-dd-HH-mm-ss') ?? ''
    }-${codec_long_name.split('/')[0].trim() ?? ''}.${ext}`;
    // rename file
    await $`mv ${inputFolder}/${video} ${inputFolder}/${newFileName}`;
  }
}
rename(files);
