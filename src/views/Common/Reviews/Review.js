import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Card,
  Carousel,
  Skeleton,
  Input,
  Form,
  Avatar,
  Rate,
  DatePicker,
  Menu,
  Space,
  Dropdown,
  Checkbox,
  Modal,
  message,
  Divider,
} from "antd";
import "../../../assets/css/userStyle.css";

import ProfileSide from "../MyProfile/ProfileSideMenu";
import actions from "./../../../redux/user/actions";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { format } from "date-fns";
import ProfileHead from "../MyProfile/ProfileHeader";
import { getLocaleMessages } from "redux/helper";
const { Content } = Layout;
const { Paragraph, Title } = Typography;

const Review = () => {
  const dispatch = useDispatch();
  const { userreviewlist, profile } = useSelector(
    (state) => state.CarReservation
  );
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_data"))["id"] || 0;

    dispatch({
      type: actions.GET_USER_REVIEW,
      payload: user,
    });
    dispatch({
      type: actions.GET_USER_PROFILE,
      payload: user,
    });
  }, []);
  return (
    <Layout className={"on-boarding"}>
      <Header />
      <Content className="content_mt">
        <ProfileHead {...profile} selectionKey="reviews" />
        <section className="my-account">
          <div className="container">
            <Row gutter={30}>
              {/* <Col span={6}>
								<div className="side-nav-account">
									<ProfileSide />
								</div>
							</Col> */}
              <Col span={18}>
                <Title level={3} className="profile-header">
                  {getLocaleMessages("Rating and Reviews")}
                </Title>

                <ul className="review-loop">
                  {userreviewlist &&
                    userreviewlist.map((review) => {
                      return (
                        <li>
                          <Typography className="box">
                            <Title level={4}>
                              {review.username}
                              <span className="date">
                                {format(
                                  new Date(review.created_at),
                                  "dd/MM/yyyy hh:mm a"
                                )}
                              </span>
                            </Title>
                            <Rate allowHalf value={review.rating} disabled />
                            <Paragraph>{review.description}</Paragraph>
                          </Typography>
                        </li>
                      );
                    })}
                </ul>
              </Col>
            </Row>
          </div>
        </section>
      </Content>
      <Footer />
    </Layout>
  );
};
export default Review;
