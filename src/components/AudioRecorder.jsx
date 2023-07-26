import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaStop, FaMicrophone, FaUpload } from 'react-icons/fa'; // Using Font Awesome icons
import { usePostSongToIdentifyQuery } from '../redux/services/shazamCore';
import Error from './Error';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState([]);

  const [audioReady, setAudioReady] = useState(false); // State to track if recorded audio is ready for sending
  const maxFileSizeBytes = 3 * 1024 * 1024; // 3MB

  const mediaRecorderRef = useRef(null);
  const getTotalChunkSize = () => chunks.reduce((totalSize, chunk) => totalSize + chunk.size, 0);

  const { data, refetch } = usePostSongToIdentifyQuery({
    enabled: false,
  });
  console.log(data);
  const handleSendAudioChunks = async () => {
    if (chunks.length > 0) {
      // Convert the audio chunks to a single Blob
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });

      // Convert the audio Blob to a base64-encoded string using the FileReader API
      const base64AudioData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          resolve(base64Data);
        };
      });

      // Call the API to send the audio data
      refetch({ base64AudioData });
    }
  };

  const startRecording = () => {
    setRecording(true);
    setChunks([]);
    setAudioReady(false); // Reset audio ready state when starting a new recording
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            if (getTotalChunkSize() + event.data.size <= maxFileSizeBytes) {
              setChunks((prevChunks) => [...prevChunks, event.data]);
            } else {
              mediaRecorder.stop();
            }
          }
        };
        mediaRecorder.onstop = () => {
          setRecording(false);
          setAudioReady(true); // Mark recorded audio as ready for sending
        };
        mediaRecorder.start();
      })
      .catch((err) => new Error(err));
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  useEffect(() => {
    if (chunks.length > 0) {
      setAudioReady(true);
    } else {
      setAudioReady(false);
    }
  }, [chunks]);

  return (
    <div className="p-4 pl-5 pb-5 max-w-md mx-auto border border-gray-300 rounded-lg shadow-lg bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Audio Recorder</h1>
      <div className="flex items-center">
        {recording ? (
          <>
            <FaMicrophone className="w-6 h-6 mr-2 text-red-600 animate-pulse" />
            <span className="text-red-600">Recording...</span>
          </>
        ) : (
          <>
            <FaMicrophone className="w-6 h-6 mr-2 text-gray-600" />
            <span className="text-gray-600">Idle</span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4 mt-5">
        {recording ? (
          <button
            type="button"
            className="px-4 pt-2 pb-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={stopRecording}
          >
            <FaStop className="w-5 h-5 mr-2 mt-2" />
            Stop Recording
          </button>
        ) : (
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={startRecording}
          >
            <FaPlay className="w-5 h-5 mr-2 mt-2" />
            Start Recording
          </button>
        )}
        <button
          type="button"
          className={`px-4 py-2 ${
            audioReady
              ? 'bg-blue-600 hover:bg-blue-700 text-white active:bg-sky-600'
              : 'bg-blue-300 cursor-not-allowed text-gray-600'
          } rounded-md`}
          disabled={!audioReady}
          onClick={handleSendAudioChunks}
        >
          <FaUpload className="w-5 h-5 mr-2 m-1" />
          Send Audio
        </button>
      </div>
    </div>
  );
};

export default AudioRecorder;
