'use client';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
const { useState, useEffect } = React;
import VideosClipsAmount from './_components/VideosClipsAmount';
import { ClipAmount, ClipInfo } from './_components/definitions/definitions';
import ClipInfoUI from './_components/ClipInfo';
import { clipVideos } from './actions/actions';

export default function Home() {
  const [videos, setVideos] = useState<FileList | null>(null);
  // save  video clips amount for each video

  const [clipsAmount, setClipsAmount] = useState<ClipAmount[]>([]);

  const [clipInfo, setClipInfo] = useState<ClipInfo[]>([]);
  function recordClipsAmount(item: ClipAmount) {
    const hasSameInput = clipsAmount.some((clip) => clip.name === item.name);
    if (!hasSameInput) {
      setClipsAmount([...clipsAmount, item]);
    } else {
      const clips = clipsAmount.map((clip) => {
        if (clip.name === item.name) {
          return item;
        }
        return clip;
      });
      setClipsAmount(clips);
    }
  }
  function updateClipInfo(singleClipInfo: ClipInfo) {
    const hasSameClipInfo = clipInfo.some(
      (clip) => clip.inputIdentifier === singleClipInfo.inputIdentifier
    );
    if (hasSameClipInfo) {
      // update or fill fields value
      const slots = clipInfo.map((slot) => {
        if (slot.inputIdentifier === singleClipInfo.inputIdentifier) {
          return { ...slot, ...singleClipInfo };
        }
        return slot;
      });
      setClipInfo(slots);
    } else {
      setClipInfo([...clipInfo, singleClipInfo]);
    }
  }
  // generate form date
  function generateFormData() {
    const formData = new FormData();
    videos &&
      Array.from(videos).forEach((video, index) => {
        const { amount, name } = clipsAmount[index];
        const clipArray = [];
        for (let i = 0; i < amount; i++) {
          const clipInfoIndex = index + i;
          const clip = clipInfo[clipInfoIndex];
          clipArray.push({
            start: clip.start,
            end: clip.end,
            description: clip.description,
            name,
          });
        }
        formData.append(`video`, video);
        formData.append(`video-${index + 1}-clips`, JSON.stringify(clipArray));
      });
    return formData;
  }
  function handleStart() {
    const formData = generateFormData();
    clipVideos(formData).then((res) => {});
  }
  // add form refs with useRef
  const videosRef = React.useRef<HTMLFormElement>(null);
  const clipInfoRef = React.useRef<HTMLFormElement>(null);
  const clipsAmountRef = React.useRef<HTMLFormElement>(null);

  return (
    <main>
      <Container className=''>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>Batch Clip Videos</h1>
            <div className='pt-10 videos'>
              <h2>Video Files</h2>
              <div className=''>
                <form action='' id='files-form' ref={videosRef}>
                  <input
                    type='file'
                    name='files'
                    id='files'
                    multiple
                    required
                    onChange={(e) => {
                      setClipsAmount([]);
                      setVideos(e.target.files);
                    }}
                  />
                </form>
              </div>
            </div>
            <div className='videos'>
              <form action='' ref={clipsAmountRef}>
                <h2>Clips Amount for Each Video</h2>
                <VideosClipsAmount
                  videos={videos}
                  recordClipsAmount={recordClipsAmount}
                  clipsAmount={clipsAmount}
                />
              </form>
            </div>
            <div className='timeslots'>
              <h2>Time Slots</h2>
              <form action='' id='times-form' ref={clipInfoRef}>
                <ClipInfoUI
                  clipsAmount={clipsAmount}
                  updateClipInfo={updateClipInfo}
                  clipInfo={clipInfo}
                />
              </form>
            </div>
            <div className='start-clip '>
              <button id='start-clip' onClick={handleStart}>
                Start
              </button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
