// 视频相关的 API
import request from './request';

export const videoApi = {
    // 上传视频进行评估
    uploadVideos: async (standardVideo, exerciseVideo) => {
        const formData = new FormData();
        formData.append('standard', standardVideo);
        formData.append('exercise', exerciseVideo);
        return request.post('/api/upload-videos/', formData);
    },

    // 获取评估结果
    getAssessmentResult: async (sessionId) => {
        return request.get(`/api/assessment-result/${sessionId}`);
    },

    // 获取帧得分
    getFrameScores: async (sessionId) => {
        return request.get(`/api/frame-scores/${sessionId}`);
    }
};