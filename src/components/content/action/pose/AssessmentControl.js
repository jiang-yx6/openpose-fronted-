import React, { useState, useCallback } from 'react';
import VideoUploader from './VideoUploader';
import VideoPlayer from './VideoPlayer';
import VideoRecorder from './VideoRecorder';
import FrameGallery from './FrameGallery';
import './AssessmentControl.css';
import EChart from './EChart';
const AssessmentControl = ({ useRecorder = false }) => {
  const [standardVideo, setStandardVideo] = useState(null);
  const [exerciseVideo, setExerciseVideo] = useState(null);
  const [standardVideoUrl, setStandardVideoUrl] = useState(null);
  const [exerciseVideoUrl, setExerciseVideoUrl] = useState(null);
  const [overlapVideoUrl, setOverlapVideoUrl] = useState(null);
  const [worstFramesList, setWorstFramesList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState(null);
  const [keyframeData, setKeyframeData] = useState([]);
  const [frameScores, setFrameScores] = useState(null);


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

  // 将文件转换为 base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // 移除 data:video/mp4;base64, 前缀
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
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

      // 将视频文件转换为 base64
      const standardBase64 = await fileToBase64(standardVideo);
      const exerciseBase64 = await fileToBase64(exerciseVideo);

      // 构建 JSON 数据
      const jsonData = {
        standard: standardBase64,
        exercise: exerciseBase64
      };

      const response = await fetch('api/upload-videos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });
      console.log('服务器响应状态:', response.status);

      if (!response.ok) {
        throw new Error('视频上传失败');
      }

      const data = await response.json();
      console.log('上传成功，收到数据:', data);
      if (data.session_id) {
        // 对于 HLS 流，使用 m3u8 文件
        // 对于普通视频，使用 mp4 文件
        setStandardVideoUrl(`http://127.0.0.1:8000${data.standard_video_hls}`);
        setExerciseVideoUrl(`http://127.0.0.1:8000${data.exercise_video_hls}`);
        setOverlapVideoUrl(`http://127.0.0.1:8000${data.overlap_video_hls}`);
        setFrameScores(data.exercise_frame_scores);
        data.exercise_worst_frames.forEach(frame => {
          const imgUrl = `http://127.0.0.1:8000${frame}`;
          setWorstFramesList(prevList => [...prevList, imgUrl]);
        });
        // 如果需要访问 HLS 流，可以使用以下 URL
        // const hlsUrl = `http://127.0.0.1:8000${data.hls_url}`;
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
    <div className='assessment-container'>
      <div className="assessment-container-left">
        
        <div className='left-video-uploader'>
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
        </div>
        

        {/* 视频播放器 */}
        {standardVideoUrl && exerciseVideoUrl && (
          <div className="videos-section">
            <VideoPlayer
              type="standard"
              hlsUrl={standardVideoUrl}
            />
            <VideoPlayer
              type="exercise"
              hlsUrl={exerciseVideoUrl}
              onScoreUpdate={handleScoreUpdate}
              onKeyframeUpload={handleKeyframeUpdate}
            />
            <VideoPlayer
              type="overlap"
              hlsUrl={overlapVideoUrl}
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

        {keyframeData && <FrameGallery keyframes={keyframeData}
        />}

      
      </div>
      <div className="assessment-container-right">
              <EChart frameScores={frameScores}/>
          <div className="video-process-chart-worst-frames">
          </div>
      </div>
    </div>
    
  );
};

export default AssessmentControl; 