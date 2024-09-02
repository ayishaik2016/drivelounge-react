import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Button, Typography } from "antd";
import Icon from "@ant-design/icons";
import CarDetailModel from "./carDetails";
import actions from "./../../redux/Listing/actions";
import { getLocaleMessages } from "redux/helper";
import { useLocation } from "react-router";

const { Title, Paragraph } = Typography;
const HeartSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
  </svg>
);
const HeartIcon = (props) => <Icon component={HeartSvg} {...props} />;

const CarItem = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    brandname,
    carid,
    agentid,
    cartype,
    carpriceperday,
    deposite,
    insurance,
    model,
    seat,
    speed,
    transmission,
    url,
    year,
  } = props;
  const [showModel, setShowModel] = useState(false);
  const [ChangeColor, setChangeColor] = useState("black");

  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )

  const showModalDetail = () => {
    setShowModel(!showModel);
  };

  const handleFavorite = () => {
    const userid = JSON.parse(localStorage.getItem("user_data"))["id"] || 0;

    if (ChangeColor == "black") setChangeColor("red");
    else setChangeColor("black");

    dispatch({
      type: actions.REMOVE_FAVORITE,
      payload: {
        userid: userid,
        carid: carid,
      },
    });
  };

  const handleRentNow = () => {
    window.location.replace("/");
    //  let localValue = JSON.parse(localStorage.getItem('searchCriteria')) || [];
    //   localValue['carid'] = carid;
    //   localStorage.removeItem('searchCriteria');
    //   localStorage.setItem('searchCriteria', JSON.stringify(localValue));
    //   dispatch({
    //   type: actions.SET_SELECTED_CAR_ID,
    //   carid,
    //   });
    //   history.push({
    //   pathname: '/detail',
    //   state: { carid: carid },
    //   });
  };

  return (
    <>
      {showModel && (
        <CarDetailModel
          {...props}
          visible={showModel}
          onCancel={() => showModalDetail()}
        />
      )}
      <Col span={8}>
        <div className="car-container">
          <div className="img">
            {/* <div onClick={handleRentNow}> */}
            <div className="fav" onClick={handleFavorite}>
              <HeartIcon style={{ color: "red" }} />
            </div>
            <div onClick={handleRentNow}>
              <img src={`https://api.drivelounge.com/${url}`} alt="Car" />
            </div>
            {/* <span className="year">
              {' '}
              {`${getLocaleMessages("Model")}: ${model}`} <br /> {`${getLocaleMessages("Year")}: ${year}`}{' '}
            </span> */}
          </div>
          <Title level={3}> {brandname} </Title>
          <div className="specification">
            <div className="box">
              <div>
                <img
                  src={require("./../../assets/images/Comfortable.png").default}
                  alt="Car"
                />
                <span> {getLocaleMessages("Comfortable")} </span>
              </div>
            </div>
            <div className="box">
              <div>
                <img
                  src={
                    require("./../../assets/images/Automatic-gear.png").default
                  }
                  alt="Car"
                />
                <span>
                  {" "}
                  {transmission !== undefined
                    ? getLocaleMessages(transmission)
                    : ""}{" "}
                </span>
              </div>
            </div>
            <div className="box">
              <div>
                <img
                  src={
                    require("./../../assets/images/full-Coverage.png").default
                  }
                  alt="Car"
                />
                <span>
                  {" "}
                  {insurance !== undefined ? getLocaleMessages(insurance) : ""}
                </span>
              </div>
            </div>
            <div className="box">
              <div>
                <img
                  src={require("./../../assets/images/UnLimited.png").default}
                  alt="Car"
                />
                <span>
                  {" "}
                  {speed !== undefined ? getLocaleMessages(speed) : ""}
                </span>
              </div>
            </div>
            <div className="box">
              <div>
                <img
                  src={require("./../../assets/images/5-Persons.png").default}
                  alt="Car"
                />
                <span>
                  {" "}
                  {cartype !== undefined ? getLocaleMessages(cartype) : ""}{" "}
                </span>
              </div>
            </div>
            <div className="box cursor-pointer" onClick={showModalDetail}>
              <div>
                <img
                  src={
                    require("./../../assets/images/view-all-arrow.png").default
                  }
                  alt="Car"
                />
                <span> {getLocaleMessages("View all Specifications")} </span>
              </div>
            </div>
            <div className="foroneDays">
              <Paragraph>
                {getLocaleMessages("for 1 Day's")}
                <span className="bold">{`${getLocaleMessages(
                  preferredCurrency
                )} ${carpriceperday * parseFloat(currencyConversion).toFixed(2)}`}</span>
              </Paragraph>
              <Button onClick={handleRentNow}>
                {" "}
                {getLocaleMessages("Rent Now")}{" "}
              </Button>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default CarItem;
