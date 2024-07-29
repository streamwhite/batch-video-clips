'use client';
import * as React from 'react';
const { useState, useEffect } = React;
import VideosClipsAmount from './_components/VideosClipsAmount';
import { ClipAmount, ClipInfo } from './_components/definitions/definitions';
import ClipInfoUI from './_components/ClipInfo';
import { clipVideos } from './actions/actions';

export default function Home() {
  // create progress ref
  const progressRef = React.useRef<HTMLDivElement>(null);

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
    setIsInClipping(true);
    setIsComplete(false);
    const formData = generateFormData();
    clipVideos(formData).then((res) => {
      if (res?.isCompleted) {
        setIsComplete(true);
        setIsInClipping(false);
        progressRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // set isComplete
  const [isComplete, setIsComplete] = useState(false);
  const [isInClipping, setIsInClipping] = useState(false);

  return (
    <main>
      <h1>Batch Clip Videos</h1>
      <div className='pt-10 videos'>
        <h2>Video Files</h2>
        <div className=''>
          <form action='' id='files-form'>
            <input
              type='file'
              name='files'
              id='files'
              multiple
              required
              onChange={(e) => {
                setClipsAmount([]);
                setIsComplete(false);
                setVideos(e.target.files);
              }}
            />
          </form>
        </div>
      </div>
      <div className={`videos ${videos?.length ? '' : 'hide'}`}>
        <form action=''>
          <h2>Clips Amount for Each Video</h2>
          <VideosClipsAmount
            videos={videos}
            recordClipsAmount={recordClipsAmount}
            clipsAmount={clipsAmount}
          />
        </form>
      </div>
      <div className={`timeslots ${videos?.length ? '' : 'hide'}`}>
        <h2>Time Slots</h2>
        <form action='' id='times-form'>
          <ClipInfoUI
            clipsAmount={clipsAmount}
            updateClipInfo={updateClipInfo}
            clipInfo={clipInfo}
          />
        </form>
      </div>
      <div className='start-clip '>
        <button id='start-clip' onClick={handleStart} disabled={isInClipping}>
          {isInClipping ? 'Clipping' : 'Start'}
        </button>
      </div>
      <div className='progress' ref={progressRef}>
        <p>{isComplete ? 'All Videos Are Clipped ' : ''}</p>
      </div>
    </main>
  );
}
