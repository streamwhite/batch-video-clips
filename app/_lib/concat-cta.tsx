import { $ } from 'execa';
import * as fs from 'fs';
import * as path from 'path';
interface ConcatCTAParams {
  inputPath: string;
  outPutPath: string;
  CTA: string;
  archivePath: string;
}

export async function concatCTA({
  inputPath,
  outPutPath,
  CTA,
  archivePath,
}: ConcatCTAParams) {
  const files = fs.readdirSync(inputPath);
  for (let index = 0; index < files.length; index++) {
    console.log(`start processing file ${files[index]}`);
    const fileName = files[index];
    const filePath = path.join(inputPath, fileName);
    try {
      await $`ffmpeg -loglevel error -i ${filePath} -i ${CTA} -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" ${path.join(
        outPutPath,
        fileName
      )}`;
    } catch (error) {
      console.error(`Error processing file ${fileName}: ${error}`);
    }
  }
}

// readme
// 所有的文件需要有音轨；否则，会报错,这个怎么防止。
// 因此，所有视频转一次格式再用，但是这样太浪费时间了。
// archive, 功能已经转移
