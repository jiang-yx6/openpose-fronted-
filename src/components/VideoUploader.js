import React, { useState } from 'react';
import './VideoUploader.css';

const VideoUploader = ({ onStandardUpload, onExerciseUpload }) => {
  const [standardFile, setStandardFile] = useState(null);
  const [exerciseFile, setExerciseFile] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    setError(null);
    if (!file) {
      setError('请选择视频文件');
      return false;
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError('视频文件不能超过100MB');
      return false;
    }

    const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-m4v'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('只支持 MP4、MOV 格式的视频');
      return false;
    }
    return true;
  };

  const handleFileSelect = (file, isStandard) => {
    if (!validateFile(file)) return;
    
    if (isStandard) {
      setStandardFile(file);
      onStandardUpload(file);
    } else {
      setExerciseFile(file);
      onExerciseUpload(file);
    }
  };

  return (
    <div className="video-uploader">
      <div className="upload-container">
        <div className={`upload-box ${standardFile ? 'has-file' : ''}`}>
          <h3>标准视频</h3>
          <input
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={(e) => handleFileSelect(e.target.files[0], true)}
            id="standard-video"
          />
          <label htmlFor="standard-video">
            {standardFile ? (
              <>
                <span className="file-name">{standardFile.name}</span>
                <span className="change-file">更换文件</span>
              </>
            ) : (
              <>
                <i className="upload-icon">+</i>
                <span>选择文件</span>
              </>
            )}
          </label>
        </div>
        
        <div className={`upload-box ${exerciseFile ? 'has-file' : ''}`}>
          <h3>练习视频</h3>
          <input
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={(e) => handleFileSelect(e.target.files[0], false)}
            id="exercise-video"
          />
          <label htmlFor="exercise-video">
            {exerciseFile ? (
              <>
                <span className="file-name">{exerciseFile.name}</span>
                <span className="change-file">更换文件</span>
              </>
            ) : (
              <>
                <i className="upload-icon">+</i>
                <span>选择文件</span>
              </>
            )}
          </label>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VideoUploader; 