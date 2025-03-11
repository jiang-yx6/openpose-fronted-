import React from "react";
import { NavLink } from "react-router-dom";
import "./Category.css";
const Category = () => {
    return (
        <div className="category-header">
            <div className="category-container">
                <div className="category-items">
                    
                    <NavLink to="/action" className="category-item-all category-item">
                        全部
                    </NavLink>
                    <NavLink to="/action/category/bone" className="category-item-bone category-item">
                        骨科康复
                    </NavLink>
                    <NavLink to="/action/category/nerve" className="category-item-nerve category-item">
                        神经康复
                    </NavLink>
                    <NavLink to="/action/category/pregnancy" className="category-item-pregnancy category-item">
                        产后康复
                    </NavLink>
                    <NavLink to="/action/category/pain" className="category-item-pain category-item">
                        疼痛康复
                    </NavLink>
                    <NavLink to="/action/category/burn" className="category-item-burn category-item">
                        烧伤康复
                    </NavLink>
                    <NavLink to="/action/category/child" className="category-item-child category-item">
                        儿童康复
                    </NavLink>
                    <NavLink to="/action/category/old" className="category-item-old category-item">
                        老年康复
                    </NavLink>
                    <NavLink to="/action/category/heart" className="category-item-heart category-item">
                        心肺康复
                    </NavLink>
                    <NavLink to="/action/category/cancer" className="category-item-cancer category-item">
                        肿瘤康复
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Category;