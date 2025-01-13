import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  message,
  Divider,
  Tabs,
  Input,
  Modal,
  Form,
  Rate,
} from "antd";
import "../../../assets/css/userStyle.css";
import { history, store } from "redux/store";
import actions from "./../../../redux/user/actions";
import settingsAction from "../../../redux/admin/booking/actions";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import {
  format,
  compareDesc,
  addHours,
  addDays,
  compareAsc,
  parseISO,
} from "date-fns";
import CancelReason from "./CancelReason";
import ProfileHead from "../MyProfile/ProfileHeader";
import ratingsAction from "./../../../redux/admin/ratingsManagement/actions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";
import loadash from "lodash";
const { Content } = Layout;
const { Paragraph, Title } = Typography;
const { TabPane } = Tabs;
const MyBookingInformation = () => {
  const user = JSON.parse(localStorage.getItem("user_data"))["id"] || 0;
  const [usedForm] = Form.useForm();
  const dispatch = useDispatch();
  const [ShowCancelDialog, setShowCancelDialog] = useState(false);
  const [SelectedBooking, setSelectedBooking] = useState({});
  const { mybookinginfo, isLoading } = useSelector(
    (state) => state.CarReservation
  );
  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )
  const [FilteredCompleteBooking, setFilteredCompleteBooking] = useState([]);
  const [FilteredUpcomingBooking, setFilteredUpcomingBooking] = useState([]);
  const [FilteredCancelledBooking, setFilteredCancelledBooking] = useState([]);
  const { profile } = useSelector((state) => state.CarReservation);
  const [visible, setvisible] = useState(false);
  const [SelectForRate, setSelectForRate] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  const getTimerCount = (paymentTransactionDate) => {
    const paymentValidityDate = new Date(new Date(paymentTransactionDate).getTime() + 60 * 60 * 24 * 1000);
    const paymentDifferenceDate = new Date(paymentValidityDate - currentDate);

    if (paymentDifferenceDate <= 0) {
      return getLocaleMessages("Payment Expired"); 
    }

    const hours = Math.floor(paymentDifferenceDate / (1000 * 60 * 60)); // hours
    const minutes = Math.floor((paymentDifferenceDate % (1000 * 60 * 60)) / (1000 * 60)); // minutes
    const seconds = Math.floor((paymentDifferenceDate % (1000 * 60)) / 1000); // seconds

    return hours + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  }

  useEffect(() => {
    // Set an interval to update the current time every second
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const checkCancel = ({ bookingdate, status }) => {
    let addedDate = addDays(parseISO(bookingdate), 2);
    if (compareAsc(addedDate, new Date()) > 0 && status !== 0) return true;
    else return false;
  };

  const handleCancel = (id, userid) => {
    setShowCancelDialog(!ShowCancelDialog);
    setSelectedBooking({ id: id, userid, userid });
  };

  const handleComplete = (val) => {
    var filters = [];
    if (val == 2) {
      mybookinginfo.filter((book) => {
        book.bookingCountDown = getTimerCount(book.paymenttransactiondate);
        if (book.bookingstatus == 1 || book.bookingstatus == 2) {
          filters.push(book);
        }
      });
    } else {
      filters = mybookinginfo.filter((book) => book.bookingstatus == val);
    }
    loadash.orderBy(filters, ["id"], ["desc"]);
    switch (val) {
      case 2:
        setFilteredUpcomingBooking(filters);
        break;
      case 0:
        setFilteredCancelledBooking(filters);
        break;
      default:
        setFilteredCompleteBooking(filters);
        break;
    }
  };

  const handleTabChange = (key) => {
    setselectedDefaultTabKey(key);
  };

  useEffect(() => {
    handleComplete(3);
    handleComplete(2);
    handleComplete(0);
  }, [mybookinginfo, currentDate]);

  const getBookingStatus = (status) => {
    if (status == 1) return getLocaleMessages("Confirmed");
    else if (status == 0) return getLocaleMessages("Cancelled");
    else if (status == 3) return getLocaleMessages("Completed");
    else return getLocaleMessages("Pending");
  };
  const getPaymentStatus = (status) => {
    if (status == 1) return getLocaleMessages("Completed");
    else if (status == 0) return getLocaleMessages("Pending");
    else if (status == 2) return getLocaleMessages("Failed");
    else if (status == 3) return getLocaleMessages("Refunded");
    else if (status == 4) return getLocaleMessages("Refund Pending");
    else return getLocaleMessages("Pending");
  };
  const getPaymentLink = (paymenttransaction) => {
    let payId = paymenttransaction.payid;
    let paymentUrl = paymenttransaction.targetUrl + '?paymentid=' + payId;

    if(paymentUrl) {
      return paymentUrl;
    } else {
      return '/';
    }
  };

  const handleBookingPayment = (bookingid) => {
    const id = bookingid;
   
    dispatch({
      type: settingsAction.CHANGE_BOOKING_PAYMENT,
      payload: { id: id },
    });
    return;
  };
  useEffect(() => {
    dispatch({
      type: actions.GET_MYBOOKING_INFORMATION,
      payload: { id: user },
    });
    dispatch({
      type: actions.GET_USER_PROFILE,
      payload: user,
    });
  }, []);

  const handleSelectedBooking = (bookingid) => {
    history.push({
      pathname: "bookingdetails",
      state: bookingid,
      tabkey: selectedDefaultTabKey,
    });
  };

  const handleRateUs = (item) => {
    const { carid, agentid, userid, isreviewed, id } = item;
    if (isreviewed == 0) {
      setSelectForRate({ carid, agentid, userid, id });
      setvisible(!visible);
    } else {
      message.warn(getLocaleMessages("Already reviewed this product"));
    }
  };

  const handleSubmitReview = (values) => {
    let data = {
      bookingid: SelectForRate.id,
      userid: SelectForRate.userid,
      agentid: SelectForRate.agentid,
      carid: SelectForRate.carid,
      rating: values.rate,
      title:
        values.rate >= 4
          ? getLocaleMessages("Good")
          : values.rate <= 2
          ? getLocaleMessages("Bad")
          : getLocaleMessages("Moderate"),
      description: values.comment,
    };
    dispatch({
      type: ratingsAction.CREATE_RATING_LIST,
      payload: data,
      callBackAction: () => {
        usedForm.resetFields();
        dispatch({
          type: actions.GET_MYBOOKING_INFORMATION,
          payload: { id: user },
        });
      },
    });
    setvisible(!visible);
  };

  const [selectedDefaultTabKey, setselectedDefaultTabKey] = useState(
    history.location.query && history.location.query.tabkey !== undefined
      ? history.location.query.tabkey
      : 2
  );

  return (
    <>
      <LoadingOverlay
        active={isLoading}
        spinner
        text={getLocaleMessages("Loading your content...")}
      >
        <Modal
          title={getLocaleMessages("Drop your comments here")}
          visible={visible}
          className="modal_plan_some"
          onCancel={() => {
            setvisible(!visible);
            usedForm.resetFields();
          }}
          centered
          footer={false}
          width={450}
          destroyOnClose
        >
          <Form form={usedForm} onFinish={handleSubmitReview}>
            <Form.Item
              name="comment"
              placeholder={getLocaleMessages("Please write you comments here")}
              rules={[
                {
                  required: true,
                  message: getLocaleMessages("Please enter the comments"),
                },
              ]}
            >
              <Input.TextArea placeholder="" />
            </Form.Item>

            <Form.Item
              label={getLocaleMessages("Rating")}
              name="rate"
              rules={[
                {
                  required: true,
                  message: getLocaleMessages(
                    "Please give the rating for this service"
                  ),
                },
              ]}
            >
              <Rate allowHalf defaultValue={2.5} />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              {getLocaleMessages("SEND")}
            </Button>
          </Form>
        </Modal>

        <Layout className={"on-boarding"}>
          {" "}
          <Header />
          <Layout>
            <Content className="content_mt">
              <ProfileHead {...profile} selectionKey="booking" />
              <section className="my-account">
                <div className="container">
                  <CancelReason
                    visible={ShowCancelDialog}
                    setSelectedBooking={setSelectedBooking}
                    SelectedBooking={SelectedBooking}
                    setShowCancelDialog={setShowCancelDialog}
                  ></CancelReason>

                  <div className="myBooking_flex">
                    <Title level={3}>{getLocaleMessages("My Bookings")}</Title>
                    <Title level={5}>
                      {mybookinginfo.length > 0
                        ? `${getLocaleMessages("Total Bookings")} (${
                            mybookinginfo.length
                          })`
                        : getLocaleMessages("No record found")}
                    </Title>
                  </div>

                  <Tabs
                    centered
                    defaultActiveKey={selectedDefaultTabKey}
                    onChange={handleTabChange}
                  >
                    <TabPane
                      tab={`${getLocaleMessages("Upcoming")} (${
                        FilteredUpcomingBooking.length
                      })`}
                      key="2"
                    >
                      <div className={{ textAlign: "center" }}>
                        {FilteredUpcomingBooking &&
                          FilteredUpcomingBooking.map((mybook) => (
                            <div className="my-carbox" key={mybook.id}>
                              <div className="img">
                                <div>
                                  <img
                                    src={`https://api.drivelounge.com/${mybook.url}`}
                                    alt="Car"
                                  />
                                </div>
                              </div>
                              <Paragraph className="id">
                                {getLocaleMessages("Booking No")}:{" "}
                                {mybook.bookingno.length > 8
                                  ? mybook.bookingno.substr(
                                      mybook.bookingno.length - 8
                                    )
                                  : mybook.bookingno}
                              </Paragraph>

                              <Title level={3}> {mybook.brandname} </Title>
                              <Paragraph className="date">
                                {getLocaleMessages("Car No")}: {mybook.carno}
                              </Paragraph>
                              {/* {!checkCancel(mybook) && (
                                <span className="completed_btn upcoming">
                                  {getBookingStatus(mybook.status)}
                                </span>
                              )}{' '} */}

                              <Paragraph className="date">
                                {getLocaleMessages("Pickup:")}{" "}
                                {mybook.pickupdate &&
                                  format(
                                    new Date(mybook.pickupdate),
                                    "dd/MM/yyyy hh:mm a"
                                  )}
                              </Paragraph>
                              <Paragraph className="price">
                                {getLocaleMessages(preferredCurrency)} {mybook.totalcost * parseFloat(currencyConversion).toFixed(2)}
                              </Paragraph>

                              <Paragraph className="id">
                                {getLocaleMessages("Booking Status")}:{" "}
                                {getBookingStatus(mybook.status)}
                              </Paragraph>

                              <Paragraph className="id">
                                {getLocaleMessages("Payment Status")}:{" "}
                                {getPaymentStatus(mybook.paymentstatus)}
                              </Paragraph>

                              {/* {checkCancel(mybook) && mybook.status !== 0 && (
                              <Button
                                onClick={() =>
                                  handleCancel(mybook.id, mybook.userid)
                                }
                              >
                                {getLocaleMessages("Cancel")}
                              </Button>
                            )} */}

                              
                              {mybook.bookingstatus == 1 && (mybook.paymentstatus == 0 || mybook.paymentstatus == 2) && (
                                <div className="my-booking-timer" direction="ltr">
                                  <p>{getLocaleMessages("Time left to complete the payment")}: <b>{mybook.bookingCountDown}</b></p>
                                </div>
                              )}

                              <div className="my-carbox-flex-box" direction="ltr">
                                <Button
                                  onClick={() =>
                                    handleSelectedBooking(mybook.id)
                                  }
                                  type="primary"
                                >
                                  {getLocaleMessages("View")}
                                </Button>

                                {/* {(mybook.bookingstatus == 1 && mybook.paymentstatus == 0 && mybook.paymenttransactionjson != '') && (
                                  <Button
                                    onClick={() =>
                                      window.location.href = getPaymentLink(JSON.parse(mybook.paymenttransactionjson))
                                    }
                                    type="primary"
                                  >
                                    {getLocaleMessages("Pay Now")}
                                  </Button>
                                )} */}

                                 {mybook.bookingstatus == 1 && (mybook.paymentstatus == 0 || mybook.paymentstatus == 2) && (
                                  <Button
                                    onClick={() => handleBookingPayment(mybook.bookingno)}
                                    type="primary"
                                  >
                                    {getLocaleMessages("Pay Now")}
                                  </Button>
                                )}
                                
                              </div>

                            </div>
                          ))}
                      </div>
                    </TabPane>
                    <TabPane
                      tab={`${getLocaleMessages("Cancelled")} (${
                        FilteredCancelledBooking.length
                      })`}
                      key="3"
                    >
                      <div className={{ textAlign: "center" }}>
                        {FilteredCancelledBooking &&
                          FilteredCancelledBooking.map((mybook) => (
                            <div className="my-carbox" key={mybook.id}>
                              <div className="img">
                                <div>
                                  <img
                                    src={`https://api.drivelounge.com/${mybook.url}`}
                                    alt="Car"
                                  />
                                </div>
                              </div>
                              <Paragraph className="id">
                                {getLocaleMessages("Booking No")}:
                                {mybook.bookingno.length > 8
                                  ? mybook.bookingno.substr(
                                      mybook.bookingno.length - 8
                                    )
                                  : mybook.bookingno}
                              </Paragraph>
                              <Title level={3}> {mybook.brandname} </Title>
                              <Paragraph className="date">
                                {getLocaleMessages("Car No")}: {mybook.carno}
                              </Paragraph>
                              {/* {!checkCancel(mybook) && (
                                <span className="completed_btn cancel">
                                  {getBookingStatus(mybook.status)}
                                </span>
                              )}{' '} */}

                              <Paragraph className="date">
                                {getLocaleMessages("Pickup:")}{" "}
                                {mybook.pickupdate &&
                                  format(
                                    new Date(mybook.pickupdate),
                                    "dd/MM/yyyy hh:mm a"
                                  )}
                              </Paragraph>
                              <Paragraph className="price">
                                {getLocaleMessages(preferredCurrency)} {mybook.totalcost * parseFloat(currencyConversion).toFixed(2)}
                              </Paragraph>
                              <Paragraph className="id">
                                {getLocaleMessages("Payment Status")}:{" "}
                                {getPaymentStatus(mybook.paymentstatus)}
                              </Paragraph>
                              {/* {checkCancel(mybook) && mybook.status !== 0 && (
                              <Button
                                onClick={() =>
                                  handleCancel(mybook.id, mybook.userid)
                                }
                              >
                                {getLocaleMessages("Cancel")}
                              </Button>
                            )} */}

                              <div className="my-carbox-flex-box">
                                <Button
                                  onClick={() =>
                                    handleSelectedBooking(mybook.id)
                                  }
                                  type="primary"
                                >
                                  {getLocaleMessages("View")}
                                </Button>
                                
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabPane>
                    <TabPane
                      tab={`${getLocaleMessages("Completed")} (${
                        FilteredCompleteBooking.length
                      })`}
                      key="1"
                    >
                      <div className={{ textAlign: "center" }}>
                        {FilteredCompleteBooking &&
                          FilteredCompleteBooking.map((mybook) => (
                            <div className="my-carbox" key={mybook.id}>
                              <div className="img">
                                <div>
                                  <img
                                    src={`https://api.drivelounge.com/${mybook.url}`}
                                    alt="Car"
                                  />
                                </div>
                              </div>
                              <Paragraph className="id">
                                {getLocaleMessages("Booking No")}:{" "}
                                {mybook.bookingno.length > 8
                                  ? mybook.bookingno.substr(
                                      mybook.bookingno.length - 8
                                    )
                                  : mybook.bookingno}
                              </Paragraph>
                              <Title level={3}> {mybook.brandname} </Title>
                              <Paragraph className="date">
                                {getLocaleMessages("Car No")}: {mybook.carno}
                              </Paragraph>
                              {/* {!checkCancel(mybook) && (
                                <span className="completed_btn">
                                  {getBookingStatus(mybook.status)}
                                </span>
                              )}{' '} */}
                              <Paragraph className="date">
                                {getLocaleMessages("Pickup:")}{" "}
                                {mybook.pickupdate &&
                                  format(
                                    new Date(mybook.pickupdate),
                                    "dd/MM/yyyy hh:mm a"
                                  )}
                              </Paragraph>
                              <Paragraph className="price">
                                {getLocaleMessages(preferredCurrency)} {mybook.totalcost * parseFloat(currencyConversion).toFixed(2)}
                              </Paragraph>

                              {/* {checkCancel(mybook) && mybook.status !== 0 && (
                              <Button
                                onClick={() =>
                                  handleCancel(mybook.id, mybook.userid)
                                }
                              >
                                Cancel
                              </Button>
                            )} */}
                              <div className="my-carbox-flex-box">
                                <Button
                                  onClick={() =>
                                    handleSelectedBooking(mybook.id)
                                  }
                                  type="primary"
                                >
                                  {getLocaleMessages("View")}
                                </Button>
                                {mybook?.isreviewed !== 1 && (
                                  <Button
                                    onClick={() => handleRateUs(mybook)}
                                    className="rate_us"
                                  >
                                    {getLocaleMessages("Rate Us")}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </section>
            </Content>
          </Layout>
          <Footer />
        </Layout>
      </LoadingOverlay>
    </>
  );
};
export default MyBookingInformation;
