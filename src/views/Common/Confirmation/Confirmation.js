import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Card,
  Input,
  Form,
  Menu,
  Tabs,
  Select,
  Image,
} from "antd";

import { history, store } from "./../../../redux/store";
import caractions from "./../../../redux/Listing/actions";
import actions from "./../../../redux/user/actions";
import "../../../assets/css/userStyle.css";
import { format } from "date-fns";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { getLocaleMessages } from "redux/helper";
import Map from "./../../Admin/Agency/MapDisplay";
import { Formatcurrency } from "helpers/constant";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [PickupAddress, setPickupAddress] = useState("");
  const [DropAddress, setDropAddress] = useState("");
  const { bookinginfo } = useSelector((state) => state.CarReservation);
  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )
  const {paymentStatus} = useSelector((state) => props.location.state);
  let confirmationMessage = getLocaleMessages("Your booking was successful  and waiting for agency confimation")
  if (paymentStatus !== undefined && paymentStatus > 0) {
    confirmationMessage = getLocaleMessages("Your payment is successful and ready to go")
  }
  useEffect(() => {
    const state = props.location.state;
    dispatch({
      type: actions.GET_BOOKING_CONFIRMATION,
      payload: { id: state.id },
    });
    if (state.id !== undefined && state.id > 0) {
      const data = 0;
      dispatch({
        type: caractions.SET_SELECTED_CAR_ID,
        data,
      });
    }
  
  }, []);

  // useEffect(() => {
  //   if(bookinginfo.id !== null && bookinginfo.id > 0){
  //     let paddress = JSON.parse(bookinginfo.pickupaddress)
  //     setPickupAddress(paddress.address)
  //     let daddress = JSON.parse(bookinginfo.dropoffaddress)
  //     setDropAddress(daddress.address)
  //   }
  // }, [])

  const handleMyAccount = () => {
    history.push("/booking");
  };
  const columnStyle = { paddingLeft: "40px" };

  return (
    <>
      <Layout className={"on-boarding"}>
        <Header />
        <Content className="content_mt">
          <section className="confirm-page">
            <div className="container">
              <div className="box">
                <Title level={3} style={{ textAlign: "center" }}>
                  {" "}
                  {confirmationMessage}{" "}
                </Title>
                <Paragraph className="fs-large" style={{ textAlign: "center" }}>
                  <strong>
                    {" "}
                    {getLocaleMessages("Booking No")}:{" "}
                    {bookinginfo !== undefined &&
                    bookinginfo.bookingcode !== undefined &&
                    bookinginfo.bookingcode.length !== undefined &&
                    bookinginfo.bookingcode.length > 8
                      ? bookinginfo.bookingcode.substr(
                          bookinginfo.bookingcode.length - 8
                        )
                      : bookinginfo.bookingcode}
                  </strong>
                </Paragraph>
                <div className="sucessImage" style={{ textAlign: "center" }}>
                  <img
                    src={require("../../../assets/images/confirm.gif").default}
                    alt=""
                  />
                </div>

                <Card
                  type="inner"
                  title={getLocaleMessages("Booking Information")}
                >
                  <Row gutter={20}>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Booking No")}{" "}
                      </Title>
                      <Paragraph>
                        {" "}
                        {bookinginfo !== undefined &&
                        bookinginfo.bookingcode !== undefined &&
                        bookinginfo.bookingcode.length !== undefined &&
                        bookinginfo.bookingcode.length > 8
                          ? bookinginfo.bookingcode.substr(
                              bookinginfo.bookingcode.length - 8
                            )
                          : bookinginfo.bookingcode}{" "}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Booking Date")}
                      </Title>
                      <Paragraph>
                        {bookinginfo?.bookingdate !== undefined
                          ? format(
                              new Date(bookinginfo?.bookingdate),
                              "dd/MM/yyyy hh:mm a"
                            )
                          : ""}{" "}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Pickup city")}{" "}
                      </Title>
                      <Paragraph> {bookinginfo.pickupplace} </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Dropoff city")}{" "}
                      </Title>
                      <Paragraph> {bookinginfo.dropoffaddress} </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Pickup Date")}
                      </Title>
                      <Paragraph>
                        {bookinginfo.pickupdate &&
                          format(
                            new Date(bookinginfo.pickupdate),
                            "dd/MM/yyyy"
                          )}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Drop Date")}{" "}
                      </Title>
                      <Paragraph>
                        {bookinginfo.dropoffdate &&
                          format(
                            new Date(bookinginfo.dropoffdate),
                            "dd/MM/yyyy"
                          )}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Pickup Time")}
                      </Title>
                      <Paragraph>
                        {bookinginfo.pickupdate &&
                          format(new Date(bookinginfo.pickupdate), "hh:mm a")}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}> {getLocaleMessages("Drop Time")}</Title>
                      <Paragraph>
                        {bookinginfo.pickupdate &&
                          format(new Date(bookinginfo.pickupdate), "hh:mm a")}
                      </Paragraph>
                    </Col>
                    {/* <Col span={12} style={columnStyle}>
                      <Title level={5}> {getLocaleMessages("Model")} </Title>
                      <Paragraph> {bookinginfo.carmodel} </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Total Rental Days")}{" "}
                      </Title>

                      <Paragraph> {bookinginfo.totalrentaldays} </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}> {getLocaleMessages("VAT%")} </Title>
                      <Paragraph> {bookinginfo.vatamount} </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {getLocaleMessages("Total Amount")}{" "}
                      </Title>
                      <Paragraph> {bookinginfo.totalcost} </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}> {getLocaleMessages("Deposit")} </Title>

                      <Paragraph> {bookinginfo.cardeposite} </Paragraph>
                    </Col> */}
                    {bookinginfo !== undefined &&
                      bookinginfo?.showmap === true &&
                      bookinginfo?.pickuplat &&
                      bookinginfo?.pickuplang && (
                        <Col span={24}>
                          <Col span={24}>
                            <Title
                              level={5}
                              style={{
                                marginLeft: "20px",
                                //textAlign: "left",
                              }}
                            >
                              {" "}
                              {getLocaleMessages(`Receiving Address`)}
                            </Title>
                            <Paragraph
                              style={{
                                marginLeft: "20px",
                                //textAlign: "left",
                              }}
                            >
                              {bookinginfo.pickupaddress}
                            </Paragraph>
                          </Col>
                        </Col>
                      )}
                  </Row>
                </Card>

                {/* <div className="box-bg">
                  <Row gutter={20}>
                    <Col span={8}>
                      <div className="text-center">
                        <img
                          src={`https://api.drivelounge.com/${bookinginfo.url}`}
                          alt="Jaguar"
                        />
                        <Title level={5}> {bookinginfo.brandname} </Title>

                        <Title level={3}>
                          {`${getLocaleMessages("SAR")}  ${
                            bookinginfo.totalcost
                          }`}
                        </Title>
                      </div>
                    </Col>
                    <Col span={16}>
                      <Row gutter={30}>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages("Pickup Location")}{" "}
                          </Title>
                          <Paragraph> {bookinginfo.pickupplace} </Paragraph>
                        </Col>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages("Drop Location")}{" "}
                          </Title>
                          <Paragraph> {bookinginfo.dropoffaddress} </Paragraph>
                        </Col>
                      </Row>
                      <Row gutter={30}>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages("Pickup Date & Time")}
                          </Title>
                          <Paragraph>
                            {bookinginfo.pickupdate &&
                              format(
                                new Date(bookinginfo.pickupdate),
                                "dd/MM/yyyy hh:mm a"
                              )}
                          </Paragraph>
                        </Col>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages("Dropoff Date & Time")}{" "}
                          </Title>
                          <Paragraph>
                            {bookinginfo.dropoffdate &&
                              format(
                                new Date(bookinginfo.dropoffdate),
                                "dd/MM/yyyy hh:mm a"
                              )}
                          </Paragraph>
                        </Col>
                      </Row>
                      <Row gutter={30}>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages("Model")}{" "}
                          </Title>
                          <Paragraph> {bookinginfo.carmodel} </Paragraph>
                        </Col>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages("Total Rental Days")}{" "}
                          </Title>

                          <Paragraph> {bookinginfo.totalrentaldays} </Paragraph>
                        </Col>
                      </Row>
                      <Row gutter={30}>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}> {getLocaleMessages("VAT%")} </Title>
                          <Paragraph> {bookinginfo.vatamount} </Paragraph>
                        </Col>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}>
                            {getLocaleMessages("Total Amount")}{" "}
                          </Title>
                          <Paragraph> {bookinginfo.totalcost} </Paragraph>
                        </Col>
                      </Row>
                      <Row gutter={30}>
                        <Col span={12} style={columnStyle}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages("Deposit")}{" "}
                          </Title>

                          <Paragraph> {bookinginfo.cardeposite} </Paragraph>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {}
                </div> */}
                {/* {bookinginfo !== undefined && bookinginfo.showmap && (
                  <div className="box-bg" style={{ textAlign: "center" }}>
                    <Row gutter={20}>
                      <Col span={18}>
                        <Row
                          gutter={30}
                          style={{ marginBottom: "2px solid red" }}
                        >

                        </Row>
                      </Col>
                    </Row>
                  </div>
                )} */}
                {bookinginfo !== undefined &&
                  bookinginfo?.showmap === true &&
                  bookinginfo?.pickuplat &&
                  bookinginfo?.pickuplang && (
                    <div
                      style={{
                        padding: "10px 0px",
                        width: "100%",
                        borderRadius: "15px",
                        marginBottom: "90px",
                      }}
                    >
                      <Map
                        center={{
                          lat: parseFloat(bookinginfo?.pickuplat),
                          lng: parseFloat(bookinginfo?.pickuplang),
                          address: bookinginfo?.pickupaddress,
                        }}
                        height="150px"
                        zoom={15}
                      />
                    </div>
                  )}

                <Card
                  style={{
                    marginTop: "10px",
                  }}
                  type="inner"
                  title={getLocaleMessages("Payment Information")}
                >
                  <Row gutter={20}>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Price per day")+"("+ preferredCurrency +")"}{" "}
                      </Title>
                      <Paragraph>
                        {" "}
                        {bookinginfo?.priceperday !== undefined
                          ? Formatcurrency(bookinginfo?.priceperday * parseFloat(currencyConversion).toFixed(2))
                          : ""}{" "}
                      </Paragraph>
                    </Col>

                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Total Rental Days")}{" "}
                      </Title>
                      <Paragraph> {bookinginfo.totalrentaldays} </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Total Cost")+"("+ preferredCurrency +")"}{" "}
                      </Title>
                      <Paragraph>
                        {" "}
                        {Formatcurrency(bookinginfo.totalcost * parseFloat(currencyConversion).toFixed(2))}{" "}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}> {getLocaleMessages("VAT")+"("+ preferredCurrency +")"} </Title>
                      <Paragraph>
                        {" "}
                        {Formatcurrency(bookinginfo.vatamount * parseFloat(currencyConversion).toFixed(2))}{" "}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages(
                          "Deposit [ Not: Deposit amount not included in total amount ]"
                        )+"("+ preferredCurrency +")"}{" "}
                      </Title>
                      <Paragraph>
                        {" "}
                        {Formatcurrency(bookinginfo.cardeposite * parseFloat(currencyConversion).toFixed(2))}{" "}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Coupon Value")+"("+ preferredCurrency +")"}{" "}
                      </Title>
                      <Paragraph>
                        {" "}
                        {bookinginfo?.couponvalue !== undefined
                          ? Formatcurrency(bookinginfo?.couponvalue * parseFloat(currencyConversion).toFixed(2))
                          : ""}{" "}
                      </Paragraph>
                    </Col>
                  </Row>
                </Card>
                <Card
                  style={{ marginTop: "10px", maxHeight: "60vh" }}
                  title={getLocaleMessages("Car Information")}
                  type="inner"
                >
                  <Row gutter={20}>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Car Number")}{" "}
                      </Title>
                      <Paragraph>
                        {" "}
                        {bookinginfo?.carno !== undefined
                          ? bookinginfo?.carno
                          : ""}{" "}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}> {getLocaleMessages("Make")} </Title>
                      <Paragraph> {bookinginfo.brandname} </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}> {getLocaleMessages("Car Year")} </Title>
                      <Paragraph>
                        {" "}
                        {bookinginfo?.caryear !== undefined
                          ? bookinginfo?.caryear
                          : ""}{" "}
                      </Paragraph>
                    </Col>
                    <Col span={12} style={columnStyle}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages("Car Model")}{" "}
                      </Title>
                      <Paragraph> {bookinginfo.carmodel} </Paragraph>
                    </Col>
                  </Row>
                  {/* <Row style={{ textAlign: "center" }} gutter={20}>
                    <Col style={{ textAlign: "center" }} span={24}>
                      <img
                        src={`https://api.drivelounge.com/${bookinginfo.url}`}
                        alt="Jaguar"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      ></img>
                    </Col>
                  </Row> */}
                  <Row style={{ textAlign: "center" }} gutter={30}>
                    <Col style={{ textAlign: "center" }} span={24}>
                      <div className="text-center">
                        <img
                          src={`https://api.drivelounge.com/${bookinginfo.url}`}
                          alt="Jaguar"
                          style={{ width: "250px", height: "150px" }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
                <Card
                  style={{ marginTop: "10px" }}
                  type="inner"
                  title={getLocaleMessages("Agency Information")}
                >
                  <Row gutter={30}>
                    <Col
                      span={24}
                      // style={{
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   display: "flex",
                      // }}
                    >
                      {/* <div>
                        <Image
                          style={{
                            marginLeft: "5px",
                            marginRight: "5px",
                            width: "120px",
                          }}
                          src={`https://api.drivelounge.com/${bookinginfo.agentlogo}`}
                        />
                      </div> */}
                      <Title level={5}></Title>
                    </Col>
                    <Col span={12}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages(`Agency Name`)}{" "}
                      </Title>
                      <Paragraph>{bookinginfo.agentname}</Paragraph>
                    </Col>
                    <Col span={12}>
                      <Title level={5}>
                        {" "}
                        {getLocaleMessages(`Contact Number`)}{" "}
                      </Title>
                      <Paragraph>{bookinginfo.contactnumber}</Paragraph>
                    </Col>
                    <Col span={12}>
                      <Title level={5}> {getLocaleMessages("Address")} </Title>
                      <Paragraph>{bookinginfo.address}</Paragraph>
                    </Col>
                  </Row>
                </Card>
                {/* <div
                  style={{
                    display: "inline-block",
                    padding: "30px 0px",
                    width: "100%",
                    marginTop:
                      bookinginfo !== undefined && bookinginfo?.showmap === true
                        ? "100px"
                        : "30px",
                    background: "#ededed",
                    borderRadius: "15px",
                  }}
                >
                  <Row gutter={20}>
                    <Col
                      span={8}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <div
                      // className="text-center"
                      // style={{
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   display: "flex",
                      // }}
                      >
                        <Image
                          style={{
                            marginLeft: "5px",
                            marginRight: "5px",
                            width: "120px",
                          }}
                          src={`https://api.drivelounge.com/${bookinginfo.agentlogo}`}
                        />
                      </div>
                    </Col>
                    <Col
                      span={16}
                      style={{
                        paddingLeft: "45px",
                        paddingRight: "130px",
                      }}
                    >
                      <Row gutter={30}>
                        <Col span={12}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages(`Agency Name`)}{" "}
                          </Title>
                          <Paragraph>{bookinginfo.agentname}</Paragraph>
                        </Col>
                        <Col span={12}>
                          <Title level={5}>
                            {" "}
                            {getLocaleMessages(`Contact Number`)}{" "}
                          </Title>
                          <Paragraph>{bookinginfo.contactnumber}</Paragraph>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div> */}
                {bookinginfo !== undefined &&
                  bookinginfo?.agentlat &&
                  bookinginfo?.agentlang && (
                    <div
                      style={{
                        display: "block",
                        marginTop: "10px",
                        marginBottom: "30px",
                      }}
                    >
                      <Map
                        center={{
                          lat: bookinginfo?.agentlat,
                          lng: bookinginfo?.agentlang,
                          address: bookinginfo?.agentadd,
                        }}
                        height="150px"
                        zoom={15}
                      />
                    </div>
                  )}
                <div
                  style={{
                    display: "flex",
                    marginTop: "120px",
                    marginBottom: "30px",
                    justifyContent: "center",
                  }}
                >
                  <Button type="primary" onClick={handleMyAccount}>
                    {getLocaleMessages("MY BOOKINGS")}
                  </Button>
                </div>
                <span>{`[${getLocaleMessages("Note Cancel Reservation")}]`}</span>
              </div>
            </div>
          </section>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default Home;
