import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import AssessmentControl from './pose/AssessmentControl';
import "./Action.css"
import Category from './chooseVideo/Category';
import VideoDisplay from './chooseVideo/VideoDisplay';
const Action = () =>{
    return (
        <div className='action'>
            <h1>动作质量评估</h1>
            <Category></Category>

            <div className='video-display'>
              <Routes>
                <Route path="" element={<VideoDisplay />} />
                <Route path="category/:category" element={<VideoDisplay />} />
              </Routes>
            </div>
            {/* <nav>
            <NavLink to="" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
              上传视频
            </NavLink>
            <NavLink to="record" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              录制视频
            </NavLink>
            </nav> */}
            <div className="video-process-container">
              <Routes>
                  <Route path="" element={<AssessmentControl />} />
                  <Route path="record" element={<AssessmentControl useRecorder={true} />} />
              </Routes>
            </div>


              
        </div>


    )
}

export default Action;
