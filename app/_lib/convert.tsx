#! /usr/bin/env node
import { $ } from 'execa';

// const inputPath = 'raw';
// const outPutPath = 'output/converted';
// const files = fs
//   .readdirSync(inputPath)
//   .filter((fileName) => isVideo(fileName.trim()));

// convert each video file
// process summary
await batchConvert(inputPath, outPutPath);

async function batchConvert(inputPath, outPutPath) {
  const files = fs
    .readdirSync(inputPath)
    .filter((fileName) => isVideo(fileName.trim()));
  const summary = [];
  for (let index = 0; index < files.length; index++) {
    const fileName = files[index];
    try {
      console.log(`start converting ${files[index]}...`);
      const expectedExt = 'mp4';
      const outputFileName = !fileName.endsWith(expectedExt)
        ? fileName.replace(ext, expectedExt)
        : fileName;
      await $`ffmpeg -loglevel error -i ${path.join(
        inputPath,
        fileName
      )} -c:a copy -s hd720 -ac 2 ${path.join(outPutPath, outputFileName)}`;
      summary.push(`${index + 1} of ${files.length}. ${fileName} converted`);
    } catch (error) {
      console.error(`Error converting file ${fileName}: ${error}`);
      summary.push(`${index + 1} of ${files.length}. ${fileName} failed`);
    }
  }
}

function isVideo(fileName) {
  return (
    fileName.endsWith('.mp4') ||
    fileName.endsWith('.avi') ||
    fileName.endsWith('.mkv') ||
    fileName.endsWith('.mov') ||
    fileName.endsWith('.webm')
  );
}
