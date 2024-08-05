'use client';
import * as React from 'react';
import { convertVideos } from '../actions/actions';
const { useState, useRef, useEffect } = React;

export default function Home() {
  return (
    <div>
      <h1>Convert videos to MP4</h1>
      <div className='pt-10 videos'>
        <h2>Upload Video Files</h2>
        <div className=''>
          <form action={convertVideos} id='files-form'>
            <input type='file' name='files' id='files' multiple required />
          </form>
        </div>
      </div>
      <div className='start'>
        <button id='start'>start</button>
      </div>
      <div className='progress'>all video files are converted</div>
    </div>
  );
}
