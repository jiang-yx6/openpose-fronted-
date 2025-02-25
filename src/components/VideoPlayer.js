import React, { useRef, useEffect, useState } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ type, sessionId, onScoreUpdate }) => {
  // Refs
  const videoRef = useRef(null);         // 视频元素引用
  const peerConnectionRef = useRef(null); // WebRTC连接（用于视频流）
  const wsRef = useRef(null);            // WebSocket连接（用于评分和信令）

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentScore, setCurrentScore] = useState(null);
  const [connectionState, setConnectionState] = useState('connecting');

  // 初始化 WebRTC 连接
  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    const peerConnection = new RTCPeerConnection(configuration);
    
    // 处理视频流
    peerConnection.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
        setIsLoading(false);
      }
    };

    // 处理 ICE 候选
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate
        }));
      }
    };

    // 在 PeerConnection 中监听状态变化
    peerConnection.onconnectionstatechange = () => {
      setConnectionState(peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        setIsLoading(false);
      }
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  };

  // WebSocket 连接管理
  const setupWebSocket = () => {
    console.log(`建立WebSocket连接: ${sessionId}, ${type}`);
    
    // 使用统一的 WebSocket 连接
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sessionId}/${type}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket连接已建立');
    };

    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('收到WebSocket消息:', message);

        switch (message.type) {
          case 'score_update':
            // 处理评分更新
            handleScoreUpdate(message);
            break;

          case 'offer':
            // 处理视频连接请求
            await handleVideoOffer(message);
            break;

          case 'ice-candidate':
            // 处理网络连接候选
            await handleIceCandidate(message);
            break;
          
          case 'keyframe_update':
            onKeyframeUpdate?.(message.data);
            break;

          default:
            console.warn('未知消息类型:', message.type);
        }
      } catch (error) {
        console.error('处理WebSocket消息错误:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket连接关闭');
      setError('连接已断开');
    };

    ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
      setError('连接错误，请刷新页面重试');
      setIsLoading(false);
    };

    return ws;
  };

  // 处理评分更新
  const handleScoreUpdate = (message) => {
    const score = Number(message.score);
    // 只在练习视频中更新分数
    if (type === 'exercise') {
      setCurrentScore(score);
      // 通知父组件
      onScoreUpdate?.({ score, status: message.status });
    }
  };

  // 处理视频 offer
  const handleVideoOffer = async (message) => {
    try {
      // 确保 PeerConnection 存在
      if (!peerConnectionRef.current) {
        initializePeerConnection();
      }

      // 设置远程描述
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(message.offer)
      );

      // 创建应答
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      // 发送应答
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'answer',
          answer: answer
        }));
      }
    } catch (error) {
      console.error('处理视频offer错误:', error);
      setError('视频连接失败');
    }
  };

  // 处理 ICE 候选
  const handleIceCandidate = async (message) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    } catch (error) {
      console.error('处理ICE候选错误:', error);
    }
  };

  // 组件挂载时设置连接
  useEffect(() => {
    if (!sessionId) return;

    const setup = async () => {
      try {
        setupWebSocket();
        // 不要在这里初始化 PeerConnection，等待 offer
      } catch (err) {
        console.error('连接设置错误:', err);
        setError('连接设置失败');
      }
    };

    setup();

    // 清理函数
    return () => {
      // 关闭 WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      // 关闭视频流
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      // 关闭 PeerConnection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // 重置状态
      setIsLoading(true);
      setError(null);
      setCurrentScore(null);
    };
  }, [sessionId, type]);

  // 5. 渲染UI
  return (
    <div className="video-container">
      {/* 视频播放器 */}
      <video
        ref={videoRef}
        className="video-player"
        autoPlay
        playsInline
      />
      
      {/* 只在练习视频中显示分数 */}
      {currentScore !== null && type === 'exercise' && (
        <div className="score-overlay">
          <div className="score-value">{currentScore.toFixed(2)}</div>
        </div>
      )}

      {/* 加载状态 */}
      {connectionState === 'connecting' && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <div>正在建立连接...</div>
        </div>
      )}

      {/* 错误信息 */}
      {connectionState === 'failed' && (
        <div className="error-message">
          连接失败，请刷新页面重试
        </div>
      )}
    </div>
  );
};

export default VideoPlayer; 