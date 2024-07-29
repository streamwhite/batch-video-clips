'use server';

import { clip } from '../_lib/clip';
import * as wrappedFs from '../_lib/fs';
import pino from 'pino';

const logger = pino(
  {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
  pino.destination('./pino-logger.log')
);

// clip videos
export async function clipVideos(formData: FormData) {
  //   re-structure data from form data

  const { videos, clips } = getVideoAndClips(formData);
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
    // clip videos
    try {
      await clip(clips, [], uploadPath);
      return { isCompleted: true };
    } catch (error) {
      logger.error('An error occurred:', error);
    }
  }
}

function getVideoAndClips(formData: FormData) {
  const videos = Array.from(formData.getAll('video'));
  const clips = videos
    .map((_, index) => {
      const clips = formData.getAll(`video-${index + 1}-clips`);
      return clips.map((clip) => JSON.parse(clip.toString()));
    })
    .flat(2);

  return { videos, clips };
}
