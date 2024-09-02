import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Row, Typography } from "antd";
import CarCard from "./../../Users/FavoriteCard";
import favactions from "./../../../redux/Listing/actions";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import "../../../assets/css/userStyle.css";
import _ from "lodash";
import ProfileHead from "../MyProfile/ProfileHeader";
import { getLocaleMessages } from "redux/helper";
import { useLocation } from "react-router";

const { Content } = Layout;

const Favorties = (props) => {
  const location = useLocation();
  const { favoriteList } = useSelector((state) => state.Listing);
  const dispatch = useDispatch();
  const [modalDetails, SetModalDetails] = useState(false);
  const { profile } = useSelector((state) => state.CarReservation);
  const showModalDetail = () => {
    SetModalDetails(!modalDetails);
  };

  const handleRentNow = () => {
    // let localValue = JSON.parse(localStorage.getItem('searchCriteria')) || [];
    // localValue['carid'] = carid;
    // localStorage.removeItem('searchCriteria');
    // localStorage.setItem('searchCriteria', JSON.stringify(localValue));
    // dispatch({
    // type: actions.SET_SELECTED_CAR_ID,
    // carid,
    // });
    // history.push({
    // pathname: '/detail',
    // state: { carid: carid },
    // });
  };

  useEffect(() => {
    const userid = JSON.parse(localStorage.getItem("user_data"))["id"] || 0;
    dispatch({
      type: favactions.GET_FAVORITE,
      payload: { userid: userid },
    });
  }, []);

  return (
    <>
      <Layout className={"on-boarding"}>
        <Header />
        <Content className="content_mt">
          <ProfileHead {...profile} selectionKey="favorites" />
          <section className="car-listing fav_section_page">
            <div className="container">
              {favoriteList.length == 0 && (
                <div style={{ height: "500px", lineHeight: 500 }}>
                  {" "}
                  {getLocaleMessages("Nothing found")}
                </div>
              )}

              <Row gutter={30}>
                {favoriteList.length > 0 &&
                  favoriteList.map((car) => (
                    <CarCard
                      {...props}
                      key={car.carid}
                      handleRentNow={handleRentNow}
                      showModalDetail={showModalDetail}
                      {...car}
                    />
                  ))}
              </Row>
            </div>
          </section>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default Favorties;
