import { useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import { AiOutlinePause, AiOutlineScissor, AiFillSound, AiOutlineFieldTime } from 'react-icons/ai';
import { BsFillPlayFill } from 'react-icons/bs';

function MusicPlayer({ file }) {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    var w = WaveSurfer.create({
      container: '#waveform',
      scrollParent: true,
      autoCenter: true,
      cursorColor: 'violet',
      loopSelection: true,
      waveColor: '#211027',
      progressColor: '#fff',
      backgroundColor: '#e1dfdf',
      responsive: true,
      plugins: [
        CursorPlugin?.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            'background-color': '#000',
            color: '#fff',
          },
        }),
        TimelinePlugin.create({
          container: '#wave-timeline',
        }),
        RegionsPlugin.create({}),
      ],
    });

    w.on('seek', progress => {
      setCurrentTime(w.getDuration() * progress);
    });

    w.on('ready', () => {
      w.enableDragSelection({});
      setDuration(w.getDuration());
    });

    w.on('audioprocess', () => {
      setCurrentTime(w.getCurrentTime());
    });

    w.on('region-updated', region => {
      const regions = region.wavesurfer.regions.list;
      const keys = Object.keys(regions);
      if (keys.length > 1) {
        regions[keys[0]].remove();
      }
    });

    w.on('finish', function () {
      w.playing = false;
      setPlaying(false);
    });
    w.loadBlob(file);

    setWavesurfer(w);
    return () => w.destroy();
  }, []);

  useEffect(() => {
    if (wavesurfer) wavesurfer?.setVolume(volume);
  }, [volume, wavesurfer]);

  useEffect(() => {
    if (wavesurfer) wavesurfer?.zoom(zoom);
  }, [zoom, wavesurfer]);

  const handleToggle = () => {
    if (playing) {
      wavesurfer.pause();
      setPlaying(false);
    } else {
      wavesurfer.play();
      setPlaying(true);
    }
  };

  const handleVolumeSlider = e => {
    setVolume(e.target.value);
  };

  const handleZoomSlider = e => {
    setZoom(e.target.value);
  };

  const handleTrim = () => {
    if (wavesurfer) {
      const region = wavesurfer.regions.list[Object.keys(wavesurfer.regions.list)[0]];

      if (region) {
        const start = region.start;
        const end = region.end;
        const original_buffer = wavesurfer.backend.buffer;
        const sampleRate = original_buffer.sampleRate;
        const numChannels = original_buffer.numberOfChannels;
        const trimStart = start * sampleRate;
        const trimEnd = end * sampleRate;
        const trimmedBufferLength = original_buffer.length - (trimEnd - trimStart);
        const trimmedBuffer = wavesurfer.backend.ac.createBuffer(numChannels, trimmedBufferLength, sampleRate);
        let trimmedIndex = 0;
        for (let i = 0; i < numChannels; i++) {
          const channelData = original_buffer.getChannelData(i);
          for (let j = 0; j < channelData.length; j++) {
            if (j < trimStart || j >= trimEnd) {
              trimmedBuffer.copyToChannel(new Float32Array([channelData[j]]), i, trimmedIndex++);
            }
          }
        }
        const regions = wavesurfer.regions.list;
        const keys = Object.keys(regions);
        regions[keys[0]].remove();

        wavesurfer.loadDecodedBuffer(trimmedBuffer);
      }
    }
  };

  const handleDownload = () => {
    const buffer = wavesurfer.backend.buffer;
    const channelData = buffer.getChannelData(0);
    const bitDepth = 16; // or 24 or 32
    // const sampleRate = buffer.sampleRate;
    const bufferLength = channelData.length;

    // Convert the channel data to an ArrayBuffer
    const arrayBuffer = new ArrayBuffer((bufferLength * bitDepth) / 8);
    const dataView = new DataView(arrayBuffer);
    let offset = 0;
    for (let i = 0; i < bufferLength; i++) {
      let value = channelData[i];
      if (value > 1) {
        value = 1;
      }
      if (value < -1) {
        value = -1;
      }
      dataView.setInt16(offset, value * 32767, true); // convert to 16-bit integer
      offset += 2;
    }

    // Create a Blob object from the ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    console.log(blob);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audio.wav';
    link.click();
    URL.revokeObjectURL(url);
  // };
  };
  return (
    <div className='w-[70vw] m-auto'>
      <div className='controls flex align-middle justify-around'>
        <button className='bg-black text-white p-3' onClick={handleToggle}>
          {playing ? <AiOutlinePause /> : <BsFillPlayFill />}
        </button>
        <button className='bg-black text-white p-3' onClick={handleTrim}>
          <AiOutlineScissor />
        </button>
        <button className='bg-black text-white p-3' onClick={handleDownload}>
          download
        </button>
        <div>
          <label htmlFor='customRange1' className='mb-2 inline-block text-neutral-700 dark:text-neutral-200'>
            <AiFillSound />
          </label>
          <input
            type='range'
            onChange={handleVolumeSlider}
            value={volume}
            min='0'
            max='1'
            step='0.05'
            className='transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200'
            id='customRange1'
          />
        </div>
        <div>
          <label htmlFor='customRange1' className='mb-2 inline-block text-neutral-700 dark:text-neutral-200'>
            <AiOutlineFieldTime />
          </label>
          <input
            type='range'
            min='1'
            max='1000'
            value={zoom}
            onChange={handleZoomSlider}
            step='0.05'
            className='transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200'
            id='customRange1'
          />
        </div>
      </div>
      <div id='waveform' className='relative mt-10'></div>
      <div id='wave-timeline' />
      <div className='flex justify-between top-10 text-xl'>
        <span>{currentTime.toFixed(2)}</span>
        <span>{duration.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default MusicPlayer;
