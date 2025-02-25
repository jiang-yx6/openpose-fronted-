import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './VideoRecorder.css';

const VideoRecorder = ({ onRecordingComplete }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [error, setError] = useState(null);

  const startRecording = () => {
    setRecordedVideo(null);
    setError(null);
    
    const stream = webcamRef.current.video.srcObject;
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });

    const chunks = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], 'exercise-recording.webm', { type: 'video/webm' });
      setRecordedVideo(file);
      onRecordingComplete?.(file);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    
    // 自动停止录制（30秒）
    setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') {
        stopRecording();
      }
    }, 30000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="video-recorder">
      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
        />
      </div>

      <div className="controls">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="record-button"
            disabled={!!recordedVideo}
          >
            开始录制
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="stop-button"
          >
            停止录制
          </button>
        )}
      </div>

      {recordedVideo && (
        <div className="preview">
          <h3>预览录制视频</h3>
          <video
            src={URL.createObjectURL(recordedVideo)}
            controls
            className="preview-video"
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VideoRecorder; 