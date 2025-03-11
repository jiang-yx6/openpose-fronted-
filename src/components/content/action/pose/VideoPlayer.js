import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import './VideoPlayer.css';

const VideoPlayer = ({ type, hlsUrl, onScoreUpdate }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hlsUrl) return;
    
    console.log(`加载视频: ${type}`, hlsUrl);
    
    // 检查 URL 是否是 HLS 流 (.m3u8)
    const isHlsStream = hlsUrl.includes('.m3u8');
    
    if (isHlsStream && Hls.isSupported()) {
      // 使用 HLS.js 播放 HLS 流
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      const hls = new Hls({
        debug: false,
        enableWorker: true
      });
      
      hls.loadSource(hlsUrl); 
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play().catch(e => console.log('自动播放失败:', e));
        setIsLoading(false);
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS 错误:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('网络错误，请检查连接');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('媒体错误，尝试恢复');
              hls.recoverMediaError();
              break;
            default:
              setError('播放错误，请重试');
              break;
          }
        }
      });
      
      hlsRef.current = hls;
    } else {
      // 直接使用 video 标签播放普通视频
      videoRef.current.src = hlsUrl;
      
      videoRef.current.onloadeddata = () => {
        setIsLoading(false);
      };
      
      videoRef.current.onerror = (e) => {
        console.error('视频加载错误:', e);
        setError('视频加载失败，请重试');
      };
    }
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    };
  }, [hlsUrl, type]);

  return (
    <div className="video-container">
      <div className="video-label">{type === 'standard' ? '标准视频' : '练习视频'}</div>
      <video
        ref={videoRef}
        className="video-player"
        controls
        playsInline
      />
      {isLoading && <div className="loading-indicator">正在加载视频...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VideoPlayer; 