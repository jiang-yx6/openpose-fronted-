import React,{ useRef ,useState} from 'react';
// import { NavLink } from 'react-router-dom';
import './VideoDisplay.css';
import EventBus from '../../../../utils/EventBus';

const VideoDisplay = () => {
    // // 伪代码示例
    // const { category } = useParams();  // 获取路由参数
    // useEffect(() => {
    // // 根据 category 参数请求对应的视频数据
    // fetchVideosByCategory(category);
    // }, [category]);

    const VideoList = [
        {
            id: 1,
            title:'俯卧撑动作',
            description:'俯卧撑动作',
            thumbnail: '/standard.png',
            videoUrl: '/standard.mp4',
        },
        {
            id: 2,
            title:'俯卧撑动作',
            description:'俯卧撑动作',
            thumbnail: '/standard.png',
            videoUrl: '/standard.mp4',
        },
        {
            id: 3,
            title:'俯卧撑动作',
            description:'俯卧撑动作',
            thumbnail: '/standard.png',
            videoUrl: '/standard.mp4',
        },
        {
            id: 4,
            title:'俯卧撑动作',
            description:'俯卧撑动作',
            thumbnail: '/standard.png',
            videoUrl: '/standard.mp4',
        },
        {
            id: 5,
            title:'俯卧撑动作',
            description:'俯卧撑动作',
            thumbnail: '/standard.png',
            videoUrl: '/standard.mp4',
        },
        {
            id: 6,
            title:'俯卧撑动作',
            description:'俯卧撑动作',
            thumbnail: '/standard.png',
            videoUrl: '/standard.mp4',
        },
    ]
    const videoRefs = useRef({});
    const rightvideoRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState({
        id: null,
        thumbnail: '/standard.png',
        videoUrl: '/standard.mp4',
    });


    const handleVideoClick = (video) =>{
        setSelectedVideo(video);
        try{
            if(rightvideoRef.current){
                const rightThumbnail = document.querySelector('.video-bigger-show-right-item img');
                if(rightThumbnail){
                    rightThumbnail.style.display = 'none';
                }
                rightvideoRef.current.src = video.videoUrl;
                rightvideoRef.current.style.display = 'block';
                setTimeout(() => {
                    const playPromise = rightvideoRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error('Error playing video:', error);
                        });
                    }
                }, 100);
            }
        }catch(error){
            console.error('Error setting selected video:', error);
        }
       
    }

    const handleMouseEnter = (id) =>{
        const videoElement = videoRefs.current[id];

        if(videoElement){
            videoElement.style.display='block';
            videoElement.muted= true;
            videoElement.play();

            const thumbnail = videoElement.previousElementSibling;
            if(thumbnail){
                thumbnail.style.display='none';
            }
        }
    }


    const handleMouseLeave = (id) =>{
        const videoElement = videoRefs.current[id];
        if(videoElement){
            videoElement.style.display = 'none';
            videoElement.pause();
            // 显示缩略图
            const thumbnail = videoElement.previousElementSibling;
            if(thumbnail){
                thumbnail.style.display = 'block';
            }
        }
    }

    const handleConfirm = () => {
        if (selectedVideo && selectedVideo.videoUrl) {
            // 获取视频文件
            fetch(selectedVideo.videoUrl)
                .then(response => response.blob())
                .then(blob => {
                    const file = new File([blob], 'standard.mp4', { type: 'video/mp4' });
                    EventBus.publish('standardVideoSelected', file);
                })
                .catch(error => {
                    console.error('Error fetching video:', error);
                });
        }
    }

    return (
        <>
            <h1>Video Display</h1>
            <div className='video-display-container'>
                <div className='video-smaller-show-left'>
                    {
                        VideoList.map((item) =>{
                            return (
                                <div className='video-display-item' 
                                    key={item.id}
                                    onMouseEnter={()=> handleMouseEnter(item.id)}
                                    onMouseLeave={()=> handleMouseLeave(item.id)}
                                    onClick={()=> handleVideoClick(item)}
                                    >
                                    <div className='video-thumbnail'>
                                        <img src={item.thumbnail} 
                                            alt="video" />
                                        <video ref={el => videoRefs.current[item.id] = el}
                                            src={item.videoUrl}
                                            loop
                                            style={{display: 'none'}}
                                            />
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='video-bigger-show-right'>
                    <div className='video-bigger-show-right-item'>
                        <img src={'/standard.png'} alt='video' ></img>
                        <video 
                        ref = {rightvideoRef}
                        src={'/standard.mp4'} 
                        style={{display: 'none'}}
                        controls></video>
                    </div>
                    <button className='video-bigger-show-right-button' onClick={handleConfirm}>确定</button>
                </div>
            </div>
            
        </>
    );
};

export default VideoDisplay;
