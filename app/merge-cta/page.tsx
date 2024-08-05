'use client';
import * as React from 'react';
import { concatCTA } from '../actions/actions';
const { useState } = React;

export default function Home() {
  // isCompleted
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  return (
    <div>
      <h1>Convert videos to MP4</h1>
      <div className='pt-10 videos'>
        <form action='' id='files-form'>
          <h2>Upload Video Files</h2>

          <input type='file' name='video' id='files' multiple required />
          <h2>Upload call to action file </h2>
          <input type='file' name='cta' id='cta' multiple required />

          {/* todo reuse style */}
          <div>
            <button
              id='start'
              type='submit'
              onClick={(e) => {
                e.preventDefault();
                const form = document.getElementById(
                  'files-form'
                ) as HTMLFormElement;
                const formData = new FormData(form);
                concatCTA(formData).then((res) => {
                  if (res?.isCompleted) {
                    setIsCompleted(true);
                  }
                });
              }}
            >
              start
            </button>
          </div>
        </form>
      </div>
      {isCompleted ? (
        <div className='progress'>all video files are merged with CTA</div>
      ) : null}
    </div>
  );
}
