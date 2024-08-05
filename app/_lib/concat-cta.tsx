import { $ } from 'execa';
import * as path from 'path';
interface ConcatCTAParams {
  videos: string[];
  outPutPath: string;
  CTA: string;
  archivePath?: string;
}

export async function concatCTA({
  videos,
  outPutPath,
  CTA,
  archivePath,
}: ConcatCTAParams) {
  for (let index = 0; index < videos.length; index++) {
    console.log(`start processing file ${videos[index]}`);
    const filePath = videos[index];
    const fileName = path.basename(filePath);
    const command = `ffmpeg  -loglevel error -i ${filePath} -i ${CTA} -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" ${path.join(
      outPutPath,
      fileName
    )}`;
    try {
      await $(command);
    } catch (error) {
      console.error(`Error processing file ${fileName}: ${error}`);
    }
  }
}

// ffmpeg -loglevel error -i "uploads\张国荣知名电影霸王别姬-菊仙赎身.mp4" -i "uploads\CTA-ZH.mp4" -filter_complex """[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[outv][outa]""" -map """[outv]""" -map """[outa]""" "张国荣知名电影霸王别姬-菊仙赎身.mp4"

// readme
// 所有的文件需要有音轨；否则，会报错,这个怎么防止。
// 因此，所有视频转一次格式再用，但是这样太浪费时间了。
// archive, 功能已经转移
