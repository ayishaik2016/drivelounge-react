import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/auth/actions";
import { Button, Typography } from "antd";
import ProfileSide from "./ProfileSideMenu";
import { UserOutlined } from "@ant-design/icons";
import userActions from "./../../../redux/user/actions";
import { getLocaleMessages } from "redux/helper";

const { Paragraph, Title } = Typography;

const ProfileHead = (props) => {
  const dispatch = useDispatch();
  const { firstname, lastname, email, contactnumber } = props;
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_data"))["id"] || 0;
    dispatch({
      type: userActions.GET_USER_PROFILE,
      payload: user,
    });
  }, []);

  return (
    <section className="profile-subheader">
      <div className="container">
        <div className="box">
          <div>
            <UserOutlined />
            <Title level={3}>{`${firstname} ${lastname}`}</Title>
            <Paragraph>
              <span>{email}</span>
              <span>{contactnumber}</span>
            </Paragraph>
          </div>
          <Button
            onClick={() => {
              dispatch({
                type: actions.LOGOUT_USER,
              });
            }}
          >
            {getLocaleMessages("Logout")}
          </Button>
        </div>
        <div className="side-nav-account">
          <ProfileSide {...props} />
        </div>
      </div>
    </section>
  );
};
export default ProfileHead;
