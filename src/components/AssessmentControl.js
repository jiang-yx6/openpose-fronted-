import React, { useState, useCallback } from 'react';
import VideoUploader from './VideoUploader';
import VideoPlayer from './VideoPlayer';
import VideoRecorder from './VideoRecorder';
import FrameGallery from './FrameGallery';
import './AssessmentControl.css';

const AssessmentControl = ({ useRecorder = false }) => {
  const [standardVideo, setStandardVideo] = useState(null);
  const [exerciseVideo, setExerciseVideo] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState(null);
  const [keyframeData, setKeyframeData] = useState([]);

  const handleKeyframeUpdate = useCallback((data) => {
    setKeyframeData(prevData => [...prevData, data]);
    setError(null);
  }, []);
  
  const handleStandardUpload = useCallback((file) => {
    setStandardVideo(file);
    setError(null);
  }, []);

  const handleExerciseUpload = useCallback((file) => {
    setExerciseVideo(file);
    setError(null);
  }, []);

  const handleRecordingComplete = (recordedFile) => {
    setExerciseVideo(recordedFile);
    setError(null);
  };

  const handleStartAssessment = async () => {
    if (!standardVideo || !exerciseVideo) {
      setError('请选择两个视频文件');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setFinalScore(null);
      setProcessingStatus('');

      const formData = new FormData();
      formData.append('standardVideo', standardVideo);
      formData.append('exerciseVideo', exerciseVideo);

      const response = await fetch('api/upload-videos/', {
        method: 'POST',
        body: formData
      });
      console.log('服务器响应状态:', response.status);

      if (!response.ok) {
        throw new Error('视频上传失败');
      }

      const data = await response.json();
      console.log('上传成功，收到数据:', data);
      // 设置会话ID
      if (data.session_id) {  // 修改字段名以匹配后端
        setSessionId(data.session_id);
      } else {
        throw new Error('服务器未返回会话ID');
      }      

    } catch (err) {
      setError('上传失败：' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScoreUpdate = (scoreData) => {
    const { score, status } = scoreData;
    console.log('收到评分更新:', score, status);
    
    // 确保只保存数值
    setFinalScore(Number(score));
    setProcessingStatus(status);
  };

  return (
    <div className="assessment-container">
      {/* 视频上传或录制 */}
      {useRecorder ? (
        <div className="upload-record-section">
          <VideoUploader onStandardUpload={handleStandardUpload} exerciseDisabled={true}/>
          <VideoRecorder onRecordingComplete={handleRecordingComplete} />
        </div>) : (
          <VideoUploader onStandardUpload={handleStandardUpload} onExerciseUpload={handleExerciseUpload}/>
        )}
      <div className="control-section">
        <button onClick={handleStartAssessment} disabled={!standardVideo || !exerciseVideo || isProcessing}
          className="start-button">
          {isProcessing ? '处理中...' : '开始评估'}
        </button>
      </div>

      {/* 视频播放器 */}
      {sessionId && (
        <div className="videos-section">
          <VideoPlayer
            type="standard"
            sessionId={sessionId}
          />
          <VideoPlayer
            type="exercise"
            sessionId={sessionId}
            onScoreUpdate={handleScoreUpdate}
            onKeyframeUpload={handleKeyframeUpdate}
          />
        </div>
      )}

      {/* 评分显示 */}
      <div className="score-section">
        {processingStatus && (
          <div className="processing-status">
            {processingStatus === 'processing' ? '评分处理中...' : '评分完成'}
          </div>
        )}
        {finalScore !== null && (
          <div className="final-score">
            <h2>当前评分</h2>
            <div className="score-value">{finalScore.toFixed(2)}</div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {keyframeData && <FrameGallery keyframes={keyframeData} />}
    </div>
  );
};

export default AssessmentControl; 