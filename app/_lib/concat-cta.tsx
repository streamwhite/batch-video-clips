#! /usr/bin/env node
'use strict';
import { $ } from 'execa';
import { path } from 'zx';

// read files in directory
// const inputPath = 'output/clips';
// const outPutPath = 'output/completed';
// const CTA = 'CTA-ZH.mp4';
// const archivePath = 'output/clips-bak';

async function concatCTA({ inputPath, outPutPath, CTA, archivePath }) {
  const files = fs.readdirSync(inputPath);
  for (let index = 0; index < files.length; index++) {
    console.log(`start processing file ${files[index]}`);
    const fileName = files[index];
    const filePath = path.join(inputPath, fileName);
    try {
      await $`ffmpeg  -loglevel error -i ${filePath} -i ${CTA} -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" ${path.join(
        outPutPath,
        fileName
      )}`;

      await $`mv ${filePath} ${path.join(archivePath, fileName)}`;
    } catch (error) {
      console.error(`Error processing file ${fileName}: ${error}`);
    }
  }
}

// concat each video file with CTA
export default concatCTA;

// readme
// 所有的文件需要有音轨；否则，会报错,这个怎么防止。
// 因此，所有视频转一次格式再用，但是这样太浪费时间了。
// archive, 功能已经转移
