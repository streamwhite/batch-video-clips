'use client';
import * as React from 'react';
const { useState, useRef } = React;
import VideosClipsAmount from './_components/VideosClipsAmount';
import { ClipAmount, ClipInfo } from './_components/definitions/definitions';

import { clipVideos } from './actions/actions';
import ClipInfoUI from './_components/ClipInfo';

export default function Home() {
  // create progress ref
  const progressRef = useRef<HTMLDivElement>(null);

  const [videos, setVideos] = useState<FileList | null>(null);
  const hasVideo = videos && videos.length > 0;
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
  // record start time of clipping
  type ClippingTime = {
    start: number;
    end: number;
  };
  let timeUsed = 0;
  const clippingTime: ClippingTime = { start: 0, end: 0 };
  function handleStart() {
    clippingTime.start = Date.now();
    setIsInClipping(true);
    setIsComplete(false);
    const formData = generateFormData();
    clipVideos(formData).then((res) => {
      if (res?.isCompleted) {
        timeUsed = Date.now() - clippingTime.start;
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
        <h2>Upload Video Files</h2>
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
      <div className={`videos ${hasVideo ? '' : 'hide'}`}>
        <form action=''>
          <h2>Clips Amount for Each Video</h2>
          <VideosClipsAmount
            videos={videos}
            recordClipsAmount={recordClipsAmount}
            clipsAmount={clipsAmount}
          />
        </form>
      </div>
      <div className={`timeslots ${hasVideo ? '' : 'hide'}`}>
        <h2>Time Slots</h2>
        <form action='' id='times-form'>
          <ClipInfoUI
            clipsAmount={clipsAmount}
            updateClipInfo={updateClipInfo}
            clipInfo={clipInfo}
          />
        </form>
      </div>
      <div className={`start-clip ${hasVideo ? '' : 'hide'}`}>
        <button id='start-clip' onClick={handleStart} disabled={isInClipping}>
          {isInClipping ? 'Clipping' : 'Start'}
        </button>
      </div>
      <div className='progress' ref={progressRef}>
        {isComplete ? (
          <p>
            All clips Are finished with {(timeUsed / 60000).toFixed(2)} minutes
          </p>
        ) : null}
      </div>
    </main>
  );
}
