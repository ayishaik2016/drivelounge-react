import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Typography, Form } from "antd";
import CarDetailModal from "./../../Users/carDetails";
import { getLocaleMessages } from "redux/helper";
import { pick } from "lodash";

const { Title, Paragraph } = Typography;
const CarCardItem = (props) => {
  const [showModel, setShowModel] = useState(false);
  const {
    carid,
    brandname,
    carpriceperday,
    model,
    carmileagename,
    transmission,
    url,
    year,
    caryear,
    showLModal,
    decimal,
    symbol,
    pickup,
    isspecificlocation,
  } = props;

  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )

  const showModalDetail = () => {
    setShowModel(!showModel);
  };

  const RentNow = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // let localValue = JSON.parse(localStorage.getItem('searchCriteria')) || [];
    // localValue['carid'] = carid;
    // localStorage.removeItem('searchCriteria');
    // localStorage.setItem('searchCriteria',JSON.stringify(localValue));
    // dispatch({
    //   type: actions.SET_SELECTED_CAR_ID,
    //   carid,
    // });
    // history.push({
    //   pathname: "/detail",
    //   state: { carid: carid },
    // });
  };
  return (
    <>
      {showModel && (
        <CarDetailModal
          {...props}
          carid={carid}
          visible={showModel}
          onCancel={() => showModalDetail()}
        />
      )}
      <Col xs={24} sm={12} md={8}>
        <div className="box-cars" key={carid}>
          <div className="box_cars_flex">
            {isspecificlocation ? (
              <p className="delivery_avail">
                {getLocaleMessages("Delivery Available")}
              </p>
            ) : (
              <div></div>
            )}
            <p>{pickup}</p>
          </div>
          <div className="images">
            <div>
              <img src={`https://api.drivelounge.com/${url}`} alt="Jaguar" />
            </div>
          </div>
          <Typography className="text-center">
            <Title level={3}> {brandname} </Title>
            <Title level={4}>
              {symbol
                ? `${getLocaleMessages(preferredCurrency)} ${(carpriceperday * parseFloat(currencyConversion).toFixed(2)).toFixed(decimal)}`
                : `${(carpriceperday * parseFloat(currencyConversion).toFixed(2)).toFixed(decimal)} ${getLocaleMessages(
                  preferredCurrency
                  )}`}{" "}
              <span> / {getLocaleMessages("Day")}</span>
            </Title>
            <Paragraph>
              <span>
                <img
                  src={require("./../../../assets/images/icon1.png").default}
                  alt="Jaguar"
                  className="icons"
                />
                {`${getLocaleMessages("Model")}: ${model}`}
              </span>
              <span>{`${getLocaleMessages("Year")}: ${year}`}</span>
              {/* <span>
                
                <img
                  src={require("./../../../assets/images/icon2.png").default}
                  alt="Jaguar"
                  className="icons"
                />
                {transmission}
              </span> */}
              {/* <span>
                
                <img
                  src={require("./../../../assets/images/icon3.png").default}
                  alt="Jaguar"
                  className="icons"
                />
                {carmileagename}
              </span> */}
            </Paragraph>
          </Typography>
          <div className="rent-car-details">
            <span onClick={RentNow}> {getLocaleMessages("Rent Car")} </span>
            <span onClick={() => showModalDetail(true)}>
              {" "}
              {getLocaleMessages("Details")}{" "}
            </span>
          </div>
        </div>
      </Col>
    </>
  );
};

export default CarCardItem;
