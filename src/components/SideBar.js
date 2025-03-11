import React from 'react';
import './SideBar.css';
import {NavLink, Routes, Route} from 'react-router-dom';

const SideBar = () =>{
    return (
        <div className='sidebar'>
            <div className='sidebar-header'>
                <h2>康复医疗系统</h2>
            </div>
            <div className="sidebar-menu">
                <ul>
                    <li>
                        <NavLink className='sidebar-link-main' to='/'>首页</NavLink>
                    </li>
                    <li>
                        <NavLink className='sidebar-link-action' to='/action'>康复动作</NavLink>
                    </li>
                    <li>
                        <NavLink className='sidebar-link-model' to='/model'>康复大模型</NavLink>
                    </li>
                </ul>
            </div>
        
        </div>        
    )
}

export default SideBar;