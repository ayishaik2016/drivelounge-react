import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Typography, Form, Image, Tabs, Modal } from "antd";
import { history, store } from "./../../redux/store";
import actions from "./../../redux/car/actions";
import clickactions from "./../../redux/Listing/actions";
import ReviewList from "./ReviewList";
import { getLocaleMessages } from "redux/helper";
import { Formatcurrency } from "helpers/constant";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const CarModelDetails = (props) => {
  const [usedForm] = Form.useForm();
  const dispatch = useDispatch();
  const { carInterriorImagesList, carReivewList } = useSelector(
    (state) => state.CarListing
  );
  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )
  const {
    brandname,
    carid,
    carpriceperday,
    deposite,
    insurance,
    model,
    seat,
    speed,
    carspeedlimit,
    cartype,
    transmission,
    url,
    year,
    visible,
    onCancel,
    agencyname,
    agentid,
    agentlogo,
    decimal,
    symbol,
  } = props;

  useEffect(() => {
    dispatch({
      type: actions.GET_CAR_INTERIOR_LIST,
      payload: carid,
    });
  }, [carid]);

  const handleRentNow = () => {
    let localValue = JSON.parse(localStorage.getItem("searchCriteria")) || [];
    localValue["carid"] = carid;
    localStorage.removeItem("searchCriteria");
    localStorage.setItem("searchCriteria", JSON.stringify(localValue));
    dispatch({
      type: clickactions.SET_SELECTED_CAR_ID,
      carid,
    });
    history.push({
      pathname: "/detail",
      state: { carid: carid },
    });
  };
  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={false}
        className="modal-detail-popup"
        width="100%"
        destroyOnClose
      >
        <div className="car-container">
          <div className="img">
            <div>
              <a>
                <img src={`https://api.drivelounge.com/${url}`} alt="Car" />
              </a>
            </div>
            {/* <div>
              <span className="year">
                {' '}
                {`${getLocaleMessages("Model")}: ${model}`} <br /> {`${getLocaleMessages("Year")}: ${year}`}{' '}
              </span>
            </div> */}
          </div>
          <div className="model_title">
            <span>{`${getLocaleMessages("Brand")}: ${brandname}`} </span>
            <span className="model_name">{`${getLocaleMessages(
              "Model"
            )}: ${model}`}</span>
          </div>
          {/* <div>
            <Row>
              <Title level={5}> {`Agency Name:`} </Title>          
              <Image style={{marginLeft: "5px", marginRight: "5px"}} width={20} src={`https://api.drivelounge.com/${agentlogo}`}/>
              <Title level={5}> {agencyname} </Title>
            </Row>      
          </div>          */}

          <div className="specification">
            {/* <div className="box">
              <div>
                <img
                  src={require('./../../assets/images/Comfortable.png').default}
                  alt="Car"
                />
                <span> Comfortable </span>
              </div>
            </div> */}
            <div className="box">
              <span className="year">
                {`${getLocaleMessages("Year")}: ${year}`}
              </span>
              {/* <div>
                <img
                  src={require('./../../assets/images/Comfortable.png').default}
                  alt="Car"
                />
                <span> Comfortable </span>
              </div> */}
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
                  {insurance !== undefined
                    ? getLocaleMessages(insurance)
                    : ""}{" "}
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
                  {speed !== undefined ? getLocaleMessages(speed) : ""}{" "}
                  {carspeedlimit > 0 && `(${carspeedlimit})`}
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
            {/* <div className="box cursor-pointer" >
                            <div>
                              
                              <img
                                src={
                                  require("./../../assets/images/view-all-arrow.png")
                                    .default
                                }
                                alt="Car"
                              />
                              <span>View all Specifications</span>
                            </div>
                          </div> */}
            <div className="foroneDays">
              <Paragraph>
                {getLocaleMessages("for 1 Day's")}
                <span className="bold">
                  {symbol
                    ? `${getLocaleMessages(preferredCurrency)} ${(carpriceperday * parseFloat(currencyConversion).toFixed(2)).toFixed(
                        decimal
                      )}`
                    : `${Formatcurrency(carpriceperday * parseFloat(currencyConversion).toFixed(2))} ${getLocaleMessages(
                        preferredCurrency
                      )}`}
                </span>
              </Paragraph>
              {/* <Button>Rent Now</Button> */}
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab={getLocaleMessages("All Specification")} key="1">
            <div className="fullSpecification">
              {/* <div className="box">
                <div>
                  <img
                    src={
                      require('./../../assets/images/Comfortable.png').default
                    }
                    alt="Car"
                  />
                </div>
                <span> Comfortable </span>
              </div> */}
              <div className="box">
                <div>
                  <img
                    src={
                      require("./../../assets/images/Automatic-gear.png")
                        .default
                    }
                    alt="Car"
                  />
                </div>
                <span>
                  {" "}
                  {transmission !== undefined
                    ? getLocaleMessages(transmission)
                    : ""}{" "}
                </span>
              </div>
              <div className="box">
                <div>
                  <img
                    src={
                      require("./../../assets/images/full-Coverage.png").default
                    }
                    alt="Car"
                  />
                </div>
                <span>
                  {" "}
                  {insurance !== undefined
                    ? getLocaleMessages(insurance)
                    : ""}{" "}
                </span>
              </div>
              <div className="box">
                <div>
                  <img
                    src={require("./../../assets/images/UnLimited.png").default}
                    alt="Car"
                  />
                </div>
                <span>
                  {" "}
                  {speed !== undefined ? getLocaleMessages(speed) : ""}
                  {carspeedlimit > 0 && `(${carspeedlimit})`}
                </span>
              </div>
              <div className="box">
                <div>
                  <img
                    src={require("./../../assets/images/5-Persons.png").default}
                    alt="Car"
                  />
                </div>
                <span>
                  {" "}
                  {cartype !== undefined ? getLocaleMessages(cartype) : ""}{" "}
                </span>
              </div>
            </div>
          </TabPane>
          <TabPane tab={getLocaleMessages("Image Gallery")} key="2">
            <Row style={{ height: "220px", overflowY: "auto" }}>
              {carInterriorImagesList &&
                carInterriorImagesList.map((image, index) => (
                  <Col span={8} key={index}>
                    <Image
                      width="100%"
                      height="100px"
                      src={`https://api.drivelounge.com/${image.carinterriorimagename}`}
                    />
                  </Col>
                ))}
            </Row>
          </TabPane>
          {/* <TabPane tab={getLocaleMessages("Rate & Reviews")} key="3">
            {carReivewList && <ReviewList carid={carid} agentid={agentid} />}            
          </TabPane> */}
        </Tabs>
      </Modal>
    </>
  );
};

export default CarModelDetails;
