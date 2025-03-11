import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import AssessmentControl from './components/content/action/pose/AssessmentControl';
import VideoRecorder from './components/content/action/pose/VideoRecorder';
import Header from './components/Header';
import SideBar from './components/SideBar';
import Home from './components/content/home/Home';
import Action from './components/content/action/Action';
import Model from './components/content/model/Model'; 
const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
      <Header/>
      <div className='main-layout'>
        <SideBar/>
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/action' element={<Action />} />
            <Route path='/model' element={<Model />} />
          </Routes>
        </div>
      </div>
     
      
        {/* <header className="app-header">
          <h1>动作评估系统</h1>
          <nav>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
              上传视频
            </NavLink>
            <NavLink to="/record"  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              录制视频
            </NavLink>
          </nav>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<AssessmentControl />} />
            <Route path="/record" element={<AssessmentControl useRecorder={true} />} />
          </Routes>
        </main> */}
      </div>
    </BrowserRouter>
  );
};

export default App;
