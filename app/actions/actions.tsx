'use server';

import path from 'path';
import pino from 'pino';
import { clip } from '../_lib/clip';
import { concatCTA as mergeCTA } from '../_lib/concat-cta';
import { batchConvert } from '../_lib/convert';
import { recoverFileName } from '../_lib/file-naming';
import * as wrappedFs from '../_lib/fs';
import { getVideosAndClips } from '../_lib/utils';

const logger = pino(
  {
    level: 'info',
  },
  pino.destination('./pino-logger.log')
);

// clip videos
export async function clipVideos(formData: FormData) {
  //   re-structure data from form data

  const { videos, clips } = getVideosAndClips(formData);
  const uploadPath = 'uploads';
  // ensure has upload folder
  await wrappedFs.ensureDirAsync(uploadPath);

  // save videos
  for (const video of videos) {
    const file = video as File;
    try {
      await wrappedFs.writeFileAsync(file, uploadPath);
    } catch (error) {
      logger.error('An error occurred:', error);
    }
  }
  // clip videos
  try {
    await clip(clips, [], uploadPath);
    return { isCompleted: true };
  } catch (error) {
    logger.error('An error occurred:', error);
  }
}

// convert videos to mp4
export async function convertVideos(formData: FormData) {
  // get videos
  const { videos } = getVideosAndClips(formData);
  // write videos to disk
  const uploadPath = 'uploads';
  await wrappedFs.ensureDirAsync(uploadPath);
  // save videos
  // todo: put in to a  function
  for (const video of videos) {
    const file = video as File;
    try {
      await wrappedFs.writeFileAsync(file, uploadPath);
    } catch (error) {
      logger.error('An error occurred:', error);
    }
  }
  const outPutFolder = 'output';

  //convert videos to mp4
  try {
    await batchConvert(uploadPath, outPutFolder);
    return { isCompleted: true };
  } catch (error) {
    logger.error('An error occurred:', error);
  }
}

export async function concatCTA(formData: FormData) {
  // get videos
  const { videos } = getVideosAndClips(formData);
  // get cta
  const cta = formData.get('cta') as File;
  // write videos to disk
  const uploadPath = 'uploads';
  await wrappedFs.ensureDirAsync(uploadPath);
  // save videos
  // todo: put in to a  function
  for (const video of [...videos, cta]) {
    const file = video as File;
    try {
      await wrappedFs.writeFileAsync(file, uploadPath);
    } catch (error) {
      logger.error('An error occurred:', error);
    }
  }
  const outPutFolder = 'output';

  //convert videos to mp4
  try {
    await mergeCTA({
      videos: videos.map((video) => recoverFileName(video as File)),
      outPutPath: outPutFolder,
      CTA: path.join(uploadPath, recoverFileName(cta)),
      inputPath: uploadPath,
    });
    return { isCompleted: true };
  } catch (error) {
    logger.error('An error occurred:', error);
  }
}
