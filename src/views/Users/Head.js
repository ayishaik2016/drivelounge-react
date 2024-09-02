import React, { useState,useEffect } from "react";
import {
  Layout,
  Button,
  Menu,
  Modal,
  Dropdown,
  message,
} from "antd";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../redux/auth/actions";
// import InjectMessage from "components/utility/intlMessages";
import { ExclamationCircleOutlined } from '@ant-design/icons';

import "./../../assets/css/header.scss";
import { getLocaleMessages } from './../../redux/helper';

//  const { Content } = Layout;
const Header = () => {

  const { subLang, loader, isLoggedIn, isOtp, isemail } = useSelector(state=>state.Auth);
  const dispatch = useDispatch();  

 
  const menu = (
    <Menu>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          {getLocaleMessages("About us")}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
         {getLocaleMessages(" Customer Support")}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          {getLocaleMessages("Download our app")}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
         {getLocaleMessages(" Our Pricing")}
        </a>
      </Menu.Item>
    </Menu>
  );


  const loginMenu = (
    <Menu>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          {getLocaleMessages("Dashboard")}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          {getLocaleMessages("Edit Profile")}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          {getLocaleMessages("Address Book")}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          {getLocaleMessages("Bookings")}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          {getLocaleMessages("Favourites")}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          {getLocaleMessages("Rate & Reviews")}
        </a>
      </Menu.Item>
      <Menu.Item key="logout" onClick={()=>{
                  dispatch({
                    type: actions.LOGOUT_USER
                  })
                }}>
        
          {getLocaleMessages("Logout")}
        
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout.Header className={"site-header"}>
        <div className="container">
          <div className="logo">
            {" "}
            <NavLink to={'/' }>
              <img
                src={require("./../../assets/images/logo.png")}
                alt=""
                className="img-fluid"
              />
            </NavLink>
          </div>
          {/* <Menu theme="light" mode="horizontal">
         
            {isLoggedIn && 
              <>
              <Menu.Item 
              className="border-right-none" 
              key={subLang === 'en' ? "english": "arabic"} 
              onClick={()=>{
                dispatch({
                  type: actions.CHANGE_LANGUAGE,
                  payload: subLang === 'en' ? 'ar' :'en'
                })
              }}
            >
              { subLang === 'en' ? "Arabic": "English"}
            </Menu.Item>
            <Menu.Item className="border-right-none">
              <Dropdown
                overlay={loginMenu}
                overlayClassName="extra-menu"
                trigger={["click"]}
              >
                <a
                  className="ant-dropdown-link user-loggin"
                  onClick={(e) => e.preventDefault()}
                >
                <img src={require("./../../assets/images/user.jpg")} />
                </a>
              </Dropdown>
            </Menu.Item>
              </>
            }
          </Menu> */}
        </div>
      </Layout.Header>
    </>
  );
};
export default Header;
