import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { history, store } from "./../../../redux/store";
import { getRequest } from "./../../../helpers/axiosClient";
import filteractions from "./../../../redux/filters/actions";
import searchactions from "./../../../redux/Listing/actions";
import MaskedInput from "antd-mask-input";
import Map from "./../../Admin/Agency/MapDisplay";
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Collapse,
  Card,
  Input,
  Form,
  Modal,
  Menu,
  Radio,
  Image,
  InputNumber,
  message,
  Space,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  format,
  differenceInCalendarDays,
  parseISO,
  addDays,
  compareDesc,
} from "date-fns";
import bookingActions from "./../../../redux/user/actions";
import authactions from "./../../../redux/auth/actions";
import actions from "./../../../redux/car/actions";
import "../../../assets/css/userStyle.css";
//import SearchModal from './../../Common/Modals/SearchInformation';
import SignupModal from "./../../Common/Modals/Signup";
import SigninModal from "./../../Common/Modals/Signin";
import ForgotModal from "./../../Common/Modals/Forgot";
import OTP from "./../../Common/Modals/OneTimePassword";

import SearchModal from "./../../Common/Modals/EditDates";
import ChangePlaces from "./../../Common/Modals/EditPlaces";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { formProps } from "./../../../helpers/constant";
import { getLocaleMessages } from "redux/helper";
const { Content } = Layout;
const { Search } = Input;
const { Title, Paragraph } = Typography;

const Home = () => {
  var localValue = JSON.parse(localStorage.getItem("searchCriteria")) || [];
  const localLang = localStorage.getItem("language");
  
  const [form] = Form.useForm();
  const [cardform] = Form.useForm();
  const dispatch = useDispatch();

  //modal
  const [buttonState, setButtonState] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLVisible, setIsModalLVisible] = useState(false);
  const [isForgotVisible, setIsForgotVisible] = useState(false);
  const [isOtpVisible, SetIsOtpVisible] = useState(false);
  const [OTPdata, setOTPdata] = useState("");
  const [couponText, setCouponText] = useState("");
  const [loading, setLoading] = useState(false);
  const { subLang, loader, isLoggedIn, isOtp, isemail } = useSelector(
    (state) => state.Auth
  );
  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )
  const [userinfo, setuserinfo] = useState({});
  const { paymentOption, reservationinfo } = useSelector(
    (state) => state.CarReservation
  );
  const { carFullInformationList, carInterriorImagesList } = useSelector(
    (state) => state.CarListing
  );
  const { filterCarElements } = useSelector((state) => state.Listing);
  const [SubTotal, setSubTotal] = useState(0);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [VatAmount, setVatAmount] = useState(0);
  const [VatPercent, setVatPercent] = useState(0);
  const [BookingDays, setBookingDays] = useState(2);
  const [Deposit, setDeposit] = useState(0);
  const [PricePerDay, setPricePerDay] = useState(0);
  const [DriverCharge, setDriverCharge] = useState(0);
  const [CouponCode, setCouponCode] = useState("");
  const [CouponVal, setCouponVal] = useState(0);
  const [CouponValue, setCouponValue] = useState(0);
  const [PaymentOption, setPaymentOption] = useState();
  const [PickupDate, setPickupDate] = useState(new Date());
  const [DropoffDate, setDropoffDate] = useState(new Date());
  const [isSideForm, setisSideForm] = useState(false);
  const [PickupPlace, setPickupPlace] = useState("");
  const [DropPlace, setDropPlace] = useState("");
  const [PickupCors, setPickupCors] = useState({
    lat: "",
    lng: "",
    address: "",
  });
  const [DropCors, setDropCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });
  const [ShowPickupPlace, setShowPickupPlace] = useState(false);
  const [SelectedCar, setSelectedCar] = useState();
  const [Type, setType] = useState(1);
  const [showMap, setShowMap] = useState(
    localStorage.getItem("showmap") !== null
      ? localStorage.getItem("showmap")
      : 0
  );
  const handleCheckout = async () => {
    if (localStorage.getItem("user_data") == null) {
      setIsModalLVisible(true);
      return;
    } else {
      onFinishPay();
      // setshowPayment(!showPayment);
    }
  };

  const Curencyval = (curencyval) => {
    return (
      // SelectedCar[0].symbol ? ( `SAR ${curencyval.toFixed(SelectedCar[0].decimal)}`):(`${curencyval.toFixed(SelectedCar[0].decimal)} SAR`)
      SelectedCar[0].symbol
        ? `${getLocaleMessages(preferredCurrency)} ${parseFloat(curencyval) * parseFloat(currencyConversion).toFixed(2)}`
        : `${parseFloat(parseFloat(curencyval) * parseFloat(currencyConversion)).toFixed(2)} ${getLocaleMessages(preferredCurrency)}`
    );
  };
  console.log("SelectedCar", SelectedCar);

  const Decimalval = (decimalval) => {
    if (SelectedCar !== undefined) {
      return decimalval.toFixed(SelectedCar[0].decimal);
    }
  };

  const handleApplyCouponCode = async (value) => {
    if (value !== "") {
      setCouponCode(value);
      setLoading(true);
      await getRequest(
        `public/coupon/getcouponvalue?code=${value}&agentid=${SelectedCar[0]?.agentid}`
      )
        .then((res) => {
          if (res?.data !== null && res?.data !== undefined) {
            if (res.data.data !== null && res.data.data !== undefined) {
              setLoading(false);
              const { couponvalue, expirydate, minvalue } = res.data.data;
              if (SubTotal < minvalue) {
                message.error(getLocaleMessages("Minimum cart value not met"));
                return;
              } else if (compareDesc(new Date(), expirydate)) {
                message.error(
                  getLocaleMessages("Coupon code expired, Please try another")
                );
              } else {
                setCouponValue(couponvalue);
                message.success(getLocaleMessages("Coupon Code applied"));
              }
            } else {
              setCouponValue(0);
              setCouponCode("");
              setLoading(false);
              message.error(getLocaleMessages("Please enter the valid coupon"));
            }
          } else {
            setCouponValue(0);
            setCouponCode("");
            setLoading(false);
            message.error(getLocaleMessages("Please enter the valid coupon"));
          }
        })
        .catch((err) => {
          message.error(
            err.message?.includes("401")
              ? getLocaleMessages("Please login to use coupon")
              : getLocaleMessages("Coupon not applied")
          );
          setCouponValue(0);
          setCouponCode("");
          setLoading(false);
        });
    } else {
      setCouponValue(0);
      setCouponCode("");
      setLoading(false);
      message.error(getLocaleMessages("Please enter the valid coupon"));
    }
  };

  useEffect(() => {
    dispatch({
      type: bookingActions.GET_PAYMENT_OPTION,
      payload: false,
    });
    dispatch({
      type: actions.GET_CAR_FULL_LIST,
      payload: false,
    });
  }, []);

  const handleCalculation = () => {
    if (SelectedCar !== undefined) {
      let subtotal =
        (SelectedCar !== undefined ? SelectedCar[0].carpriceperday : 0) *
        BookingDays;
      setSubTotal(subtotal);
      let hasdrivercharge =
        (SelectedCar !== undefined &&
        (SelectedCar[0].cardriver == 1 || SelectedCar[0].cardriver == 2)
          ? SelectedCar[0].drivercharge
          : 0) * BookingDays;
      setDriverCharge(hasdrivercharge);
      let drivercharge = filterCarElements.WithDriver ? hasdrivercharge : 0;
      let couponVal = subtotal * (CouponValue / 100);
      setCouponVal(couponVal);
      let vat = (subtotal - couponVal) * (VatPercent / 100);
      setVatAmount(vat);
      let total = subtotal + vat - Decimalval(couponVal);
      setTotalPrice(total);
    }
  };

  useEffect(() => {
    if (SelectedCar !== undefined) {
      let subtotal =
        (SelectedCar !== undefined ? SelectedCar[0].carpriceperday : 0) *
        BookingDays;
      setSubTotal(subtotal);
      let hasdrivercharge =
        (SelectedCar !== undefined ? SelectedCar[0].drivercharge : 0) *
        BookingDays;
      setDriverCharge(hasdrivercharge);
      let drivercharge = filterCarElements.WithDriver ? hasdrivercharge : 0;
      let couponVal = subtotal * (CouponValue / 100);
      setCouponVal(couponVal);
      let vat = (subtotal - couponVal) * (VatPercent / 100);
      setVatAmount(vat);
      let total = subtotal + vat - couponVal;
      setTotalPrice(total);
    }
  }, [SelectedCar]);

  const handleFormOk = () => {
    setisSideForm(!isSideForm);
  };

  const handleFormCancel = () => {
    setisSideForm(!isSideForm);
  };

  const handleBookingDays = (days) => {
    if (days > 0 && days < 100) {
      setBookingDays(days);
      setDropoffDate(addDays(new Date(filterCarElements.PickupDate), days));
    } else {
      message.warn(getLocaleMessages("Maximum 100 day's allowed"));
      setBookingDays(100);
      return;
    }
  };

  useEffect(() => {
    setPickupPlace(localValue["PickupPlace"]);
    setDropPlace(localValue["DropPlace"]);
    setPickupDate(filterCarElements.PickupDate);
    setDropoffDate(filterCarElements.DropoffDate);
    setPickupCors(localValue["PickupCors"]);
    setDropCors(localValue["DropCors"]);
    const diffInMs =
      new Date(filterCarElements.DropoffDate) -
      new Date(filterCarElements.PickupDate);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const days = Math.floor(diffInDays);
    setBookingDays(days < diffInDays ? days + 1 : days);
  }, [filterCarElements]);

  useEffect(() => {
    handleCalculation();
  }, [BookingDays, CouponValue]);

  // useEffect(() => {
  //   if(reservationinfo.totalrentaldays !== undefined){
  //     setPricePerDay(reservationinfo.priceperday);
  //     setDeposit(reservationinfo.deposit)
  //     setBookingDays(reservationinfo.totalrentaldays);
  //     setVatPercent(reservationinfo.vatpercent);
  //     setCouponValue(reservationinfo.couponvalue);
  //   }
  //   if(reservationinfo.id !== undefined){
  //     dispatch({
  //       type: bookingActions.GET_USER_INFO,
  //       payload: { id: reservationinfo.id },
  //     });
  //   }
  // }, [reservationinfo])

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("user_data")) || {};
    setuserinfo(data);
  }, [isLoggedIn]);

  useEffect(() => {
    if (localStorage.getItem("searchCriteria") == null) {
      // history.push("/listing");
    }
    let dataSearch = JSON.parse(localStorage.getItem("searchCriteria"));
    if (dataSearch !== null) {
      let carid = JSON.parse(localStorage.getItem("searchCriteria"))["carid"];

      if (carid !== null && carid > 0 && carFullInformationList.length > 0) {
        let findCar = carFullInformationList.filter(
          (car) => car.carid == carid
        );
        setSelectedCar(findCar);
        if (findCar !== undefined) {
          setVatPercent(findCar[0].vat);
        }
        handleCalculation();
      }
    } else {
      history.push("/listing");
    }
  }, [carFullInformationList]);

  const fOk = () => {
    setIsForgotVisible(false);
  };

  const resendOTP = () => {
    message.success(getLocaleMessages("OTP resent successfully"));
  };

  const onFinish = (values) => {
    const data = {
      ...values,
      contactnumber: values.contactnumber,
    };
    if (values.usertypeid == 3) {
      dispatch({
        type: authactions.CREATE_AUTHENTICATE_USER,
        payload: data,
        callBackAction: () => {
          showModal({ signupModalVisible: false });
          showLModal({ loginModalVisible: true });
        },
      });
    } else {
      dispatch({
        type: authactions.CREATE_AUTHENTICATE_VENDOR,
        payload: data,
        callBackAction: () => {
          showLModal({ loginModalVisible: true });
        },
      });
    }
  };

  const onFinishForgot = (values) => {
    dispatch({
      type: authactions.SEND_PASSWORD_RESET_LINK,
      payload: values,
      callBackAction: () => {
        LoginForgot({
          login: true,
          forgot: false,
        });
      },
    });
  };

  const onFinishOTP = () => {
    if (OTPdata.length === 4) {
      dispatch({
        type: authactions.VERIFY_OTP,
        payload: {
          otp: OTPdata,
          email: isemail,
        },
        callBackAction: () => {
          SetIsOtpVisible(false);
          setOTPdata("");
          setIsModalVisible(false);
          showLModal({ loginModalVisible: true });
        },
      });
    } else {
      message.error(getLocaleMessages("Please enter valid OTP"));
    }
  };

  const otpOk = () => {
    Modal.confirm({
      title: getLocaleMessages("Warning"),
      icon: <ExclamationCircleOutlined />,
      content: getLocaleMessages(
        "Are you sure to close this modal and the OTP modal never open"
      ),
      okText: getLocaleMessages("Ok"),
      cancelText: getLocaleMessages("Cancel"),
      maskClosable: true,
      mask: true,
      onOk: () => {
        dispatch({
          type: authactions.VERIFY_OTP_SUCCESS,
        });
      },
    });
  };

  const onChangeOTP = (value) => {
    setOTPdata(value);
  };

  const LoginSignup = ({ login, signup }) => {
    if (login) {
      setIsModalVisible(signup);
      setIsModalLVisible(login);
    } else if (signup) {
      setIsModalLVisible(login);
      setIsModalVisible(signup);
    }
  };

  const onFinishLogin = (values) => {
    dispatch({
      type: authactions.AUTHENTICATE_USER,
      payload: values,
      callBackAction: () => {
        showLModal({ loginModalVisible: false });
      },
    });
  };

  const LoginForgot = ({ login, forgot }) => {
    if (forgot) {
      setIsModalLVisible(login);
      setIsForgotVisible(forgot);
    } else if (login) {
      setIsForgotVisible(forgot);
      setIsModalLVisible(login);
    }
  };

  const showLModal = ({ loginModalVisible }) => {
    setIsModalLVisible(loginModalVisible);
  };

  const showModal = ({ signupModalVisible }) => {
    setIsModalVisible(signupModalVisible);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const option = localStorage.getItem("option") || 0;
      if (PaymentOption !== undefined && PaymentOption > 0) {
      } else {
        setPaymentOption(option);
      }
    }
  }, [isLoggedIn]);

  const [showPayment, setshowPayment] = useState(false);

  const onFinishPay = (values) => {
    if (BookingDays <= 0) {
      message.error(
        getLocaleMessages("Please Provide valid travel days to proceed")
      );
      return;
    }
    if (PickupCors?.address == "" || PickupPlace == "") {
      message.error(getLocaleMessages("Please choose your pickup location"));
      return;
    }
    if (DropCors?.address == "" || DropPlace == "") {
      message.error(getLocaleMessages("Please choose your drop location"));
      return;
    }
    // if (PaymentOption === undefined || PaymentOption <= 0) {
    //   message.error('Please choose your payment option');
    //   return;
    // }
    if (TotalPrice !== null && TotalPrice <= 0) {
      message.error(
        getLocaleMessages("Booking days and amount should be avalid one")
      );
      return;
    }

    if (localStorage.getItem("user_data") == null) {
      setIsModalLVisible(true);
    } else {
      let data = {
        agentid: SelectedCar !== undefined ? SelectedCar[0].agentid : 0,
        carid: filterCarElements.carid,
        pickupplace: PickupPlace,
        pickupdate: filterCarElements.PickupDate,
        dropplace: DropPlace,
        dropoffdate: DropoffDate, //filterCarElements.DropoffDate,
        pickcityid: filterCarElements.PickupPlaceId,
        dropcityid: filterCarElements.DropPlaceId,
        withdriver: filterCarElements.WithDriver === true || (SelectedCar !== undefined && SelectedCar[0].driver === "With Chauffeur") ? 1 : 0,
        driveramount: filterCarElements.WithDriver
          ? Decimalval(DriverCharge)
          : 0,
        deposit:
          SelectedCar !== undefined ? Decimalval(SelectedCar[0].deposite) : 0,
        priceperday:
          SelectedCar !== undefined
            ? Decimalval(SelectedCar[0].carpriceperday)
            : 0,
        totalrentaldays: BookingDays,
        couponcode: CouponCode,
        couponvalue: Decimalval(CouponVal),
        vatpercent: VatPercent,
        vatamount: Decimalval(VatAmount),
        subtotal: Decimalval(SubTotal),
        totalcost: Decimalval(TotalPrice),
        otheramount: 0,
        paymentmode: 1, //PaymentOption,
        paymentstatus: 1,
        paymenttransactionid: 1,
        pickupaddress: localValue.PickupCors?.address,
        dropoffaddress: filterCarElements.DropCors?.address,
        pickuplat: localValue.PickupCors?.lat,
        pickuplng: localValue.PickupCors?.lng,
        droplat: JSON.stringify(filterCarElements.DropCors?.lat),
        droplng: JSON.stringify(filterCarElements.DropCors?.lng),
        // cardinfo: {
        //   cardcvv: values.cardcvv || '222',
        //   cardexpiry: values.cardexpiry || '22/2025',
        //   cardholdername: values.cardholdername || 'Card Holder',
        //   carnumber: values.carnumber || '2222-2222-2222-2222',
        // },
        cardinfo: {
          cardcvv: "222",
          cardexpiry: "22/2025",
          cardholdername: "Card Holder",
          carnumber: "2222-2222-2222-2222",
        },
        showmap: showMap,
      };
      setButtonState(true);
      dispatch({
        type: bookingActions.CREATE_CAR_RESERVATION,
        payload: data,
        callBackAction: (resp) => {
          if (resp?.status < 400 && resp?.data !== "") {
            localStorage.removeItem("searchCriteria");
            localStorage.removeItem("faq");
            localStorage.removeItem("cms");
            localStorage.removeItem("showmap");
            dispatch({
              type: searchactions.CLEAR_SELECTED_CAR_FILTER,
              payload: false,
            });
            dispatch({
              type: filteractions.CLEAR_FILTERS,
            });
            setButtonState(false);
          } else {
            message.error("Sorry some error occured,booking not confirmed");
            setButtonState(false);
          }
        },
      });
    }
  };

  function getEnglishRentalDays() {
    return (
      <>
        {BookingDays} * {" "}
        {SelectedCar !== undefined &&
          SelectedCar[0].carpriceperday * parseFloat(currencyConversion).toFixed(2)}
      </>
    );
  }

  function getArabicRentalDays() {
    return (
      <>
        {SelectedCar !== undefined &&
          SelectedCar[0].carpriceperday * parseFloat(currencyConversion).toFixed(2)} * {BookingDays}
      </>
    );
  }

  return (
    <>
      <SignupModal
        visible={isModalVisible}
        onCancel={() => showModal({ signupModalVisible: false })}
        onFinish={onFinish}
        LoginSignup={LoginSignup}
        loader={loader}
      />
      {isForgotVisible && (
        <ForgotModal
          visible={isForgotVisible}
          onCancel={fOk}
          onFinish={onFinishForgot}
          onLoginForgot={LoginForgot}
          loader={loader}
        />
      )}
      <Modal
        title={false}
        visible={isOtpVisible}
        onCancel={otpOk}
        centered
        footer={false}
        className="modal-ui-1 modal-otp"
        width="100%"
        destroyOnClose
      >
        <div className="modal-body-ui">
          <h2> {getLocaleMessages("OTP Verification")} </h2>
          <p className="sub">
            {getLocaleMessages("Enter the OTP you received to")} <br />{" "}
            {isemail}
          </p>
          <div className="ant-form-item-four">
            <OTP OTPdata={OTPdata} onChangeOTP={onChangeOTP} />
          </div>
          <div className="ant-form-item">
            <Button
              type="primary"
              disabled={loader}
              loading={loader}
              onClick={onFinishOTP}
            >
              {getLocaleMessages("Verify")}
            </Button>
          </div>
          <p className="resend">
            <span onClick={resendOTP}> {getLocaleMessages("Resend OTP")} </span>
          </p>
        </div>
        <div className="modal-ui-right">
          <img
            src={require("./../../../assets/images/otp.png").default}
            alt="otp"
          />
        </div>
      </Modal>
      {isModalLVisible && (
        <SigninModal
          visible={isModalLVisible}
          onCancel={() => showLModal({ loginModalVisible: false })}
          onLoginForgot={LoginForgot}
          onFinish={onFinishLogin}
          LoginSignup={LoginSignup}
          loader={loader}
        />
      )}
      <SearchModal
        title={getLocaleMessages("Change Booking Information")}
        visible={isSideForm}
        onOk={handleFormOk}
        onCancel={handleFormCancel}
        footer={false}
        width="100%"
      />
      <ChangePlaces
        title={getLocaleMessages("Choose your pickup places")}
        visible={ShowPickupPlace}
        onOk={() => setShowPickupPlace(false)}
        onCancel={() => setShowPickupPlace(false)}
        placetype={Type}
        footer={false}
        width="100%"
      />
      <Layout className={"on-boarding"}>
        <Header />
        <Content className="content_mt">
          {/* <section className="search-result title_zero">
            <div className="container">
              <Title level={4}>{getLocaleMessages("Checkout")}</Title>
            </div>
          </section> */}

          <section className="car-listing">
            <div className="container">
              <Row gutter={30}>
                <Col span={17}>
                  {isLoggedIn && (
                    <div className="checkout-boxes">
                      <Title level={3}>
                        {" "}
                        {getLocaleMessages("Logged In")}{" "}
                      </Title>
                      <Paragraph>
                        {" "}
                        {getLocaleMessages(
                          "You are login in successfully"
                        )}{" "}
                      </Paragraph>
                      <Paragraph className="names">
                        <span>
                          {" "}
                          {userinfo &&
                            `${userinfo?.firstname} ${userinfo?.lastname}`}{" "}
                        </span>
                        <span> {userinfo && userinfo.email} </span>
                        <span> {userinfo && userinfo.contactnumber} </span>
                        {/* <span> Driving Age: {getAge(userinfo.dob)} </span> */}
                      </Paragraph>
                    </div>
                  )}
                  <div className="box_information_checkout">
                    <Row gutter={30}>
                      <Col span={12}>
                        <label>{getLocaleMessages("Pickup city")}</label>
                        <div className="bx_info_values">
                          {/* <label>{getLocaleMessages("City")}</label> */}
                          <p>
                            {PickupPlace !== undefined
                              ? PickupPlace
                              : reservationinfo.pickupplace}
                          </p>
                        </div>

                        <div className="bx_info_values">
                          <label>
                            {getLocaleMessages("Pickup  Date and Time")}
                          </label>
                          <p>
                            {PickupDate &&
                              format(
                                new Date(PickupDate),
                                "dd/MM/yyyy hh:mm a"
                              )}
                          </p>
                        </div>
                      </Col>
                      <Col span={12}>
                        <label>{getLocaleMessages("Dropoff city")}</label>
                        <div className="bx_info_values">
                          <p>
                            {DropPlace !== undefined
                              ? DropPlace
                              : reservationinfo?.pickupplace}
                          </p>
                        </div>
                        <div className="bx_info_values">
                          <label>
                            {getLocaleMessages("Dropoff Date and Time")}
                          </label>
                          <p>
                            {DropoffDate &&
                              format(
                                new Date(DropoffDate),
                                "dd/MM/yyyy hh:mm a"
                              )}
                          </p>
                        </div>
                      </Col>
                      {PickupCors !== undefined && showMap && (
                        <Col span={12}>
                          <div className="bx_info_values">
                            <label>
                              {SelectedCar !== undefined
                                ? PickupCors?.address === SelectedCar[0].address
                                  ? getLocaleMessages("Agency Address")
                                  : getLocaleMessages("Receiving Address")
                                : ""}
                            </label>
                            <p>
                              {SelectedCar !== undefined
                                ? PickupCors?.address === SelectedCar[0].address
                                  ? `${SelectedCar[0].agencyname} , ${SelectedCar[0].address}`
                                  : PickupCors?.address
                                : ""}
                            </p>
                          </div>
                        </Col>
                      )}
                      {showMap && (
                        <Col span={20}>
                          {PickupCors?.lat && PickupCors?.lng && (
                            <Map
                              center={{
                                lat: parseFloat(PickupCors?.lat),
                                lng: parseFloat(PickupCors?.lng),
                                address: PickupCors?.address,
                              }}
                              height="250px"
                              zoom={15}
                            />
                          )}
                        </Col>
                      )}
                    </Row>

                    {/* <div className="text-center">
                      <Button onClick={handleFormOk}>
                        {getLocaleMessages("Plan for some other dates?")}
                      </Button>
                    </div> */}
                  </div>
                  {/* <Collapse accordion>
                    <Panel header={`Pickup address`} key="1">
                      <div className="detail-description">
                        <Title level={4}>
                          Pickup address
                        </Title>
                        <Paragraph className="price">
                          <span>
                          {PickupPlace !== undefined && PickupPlace}
                          </span>
                        </Paragraph>

                      </div>
                    </Panel>
                  </Collapse>      <br/>
                  <Collapse accordion>
                    <Panel header={`Dropoff address`} key="1">
                      <div className="detail-description">
                        <Title level={4}>
                          Dropoff address
                        </Title>
                        <Paragraph className="price">
                          <span>
                          {DropPlace !== undefined && DropPlace}
                          </span>
                        </Paragraph>

                      </div>
                    </Panel>
                  </Collapse>      <br/>   */}

                  {/* <div className="checkout-boxes"> */}
                  {/* <Title level={3}> Card  Details </Title> */}

                  {showPayment && (
                    <div className="checkout-boxes checkout-boxes_credit">
                      <Title level={3}>
                        {getLocaleMessages("Credit Card Details")}{" "}
                      </Title>

                      <div className="dashboard-form">
                        <Form
                          form={cardform}
                          onFinish={onFinishPay}
                          {...formProps}
                          layout="vertical"
                        >
                          <Form.Item
                            name="carnumber"
                            label={getLocaleMessages("Card Number")}
                            rules={[
                              {
                                required: true,
                                message: getLocaleMessages(
                                  "Please input car number"
                                ),
                              },
                            ]}
                          >
                            {/* <Input placeholder="Car Number" /> */}
                            <MaskedInput
                              mask="1111 1111 1111 1111"
                              name="card"
                              size="20"
                            />
                          </Form.Item>

                          <Row gutter={30}>
                            <Col span={12} className="inner-content">
                              <Form.Item
                                name="cardexpiry"
                                label={getLocaleMessages("Expiry Date")}
                                rules={[
                                  {
                                    required: true,
                                    message: getLocaleMessages(
                                      "Please input you card expiry date"
                                    ),
                                  },
                                ]}
                              >
                                {/* <Input placeholder="Expiry Date" /> */}
                                <MaskedInput
                                  mask="11/1111"
                                  name="expiry"
                                  placeholder="mm/yyyy"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} className="inner-content">
                              <Form.Item
                                name="cardcvv"
                                label={getLocaleMessages("CVV Number")}
                                rules={[
                                  {
                                    required: true,
                                    message: getLocaleMessages(
                                      "Please input your CVV number"
                                    ),
                                  },
                                ]}
                              >
                                {/* <Input placeholder="CVV" /> */}
                                <MaskedInput mask="111" name="ccv" />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            name="cardholdername"
                            label={getLocaleMessages("Card Holder Name")}
                          >
                            <Input
                              placeholder={getLocaleMessages(
                                "Card Holder Name"
                              )}
                            />
                          </Form.Item>
                          <div className="button-center">
                            <Button
                              type="primary"
                              htmlType="submit"
                              className="save-btn"
                            >
                              {`Pay ${
                                SelectedCar !== undefined &&
                                Curencyval(TotalPrice)
                              }`}
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  )}
                  {/* <CreditCardInput
  cardNumberInputProps={{ value: cardNumber, onChange: handleCardNumberChange }}
  cardExpiryInputProps={{ value: expiry, onChange: handleCardExpiryChange }}
  cardCVCInputProps={{ value: cvc, onChange: handleCardCVCChange }}
  fieldClassName="input"
/> */}

                  {/* <Radio.Group
                      onChange={(value) => {
                        !isLoggedIn && localStorage.setItem('option',value.target.value)
                        setPaymentOption(value.target.value)
                      }}
                    >
                      {paymentOption &&
                        paymentOption.map((pay) => {
                          return (
                            <Radio key={pay.id} value={pay.id}>
                              {pay.paymentmethod}
                            </Radio>
                          );
                        })}
                    </Radio.Group> */}
                </Col>
                <Col span={7}>
                  <Title level={4} className="booking-title">
                    {getLocaleMessages("Book Now")}
                  </Title>
                  <div className="car-loop">
                    <Image
                      width={200}
                      src={`https://api.drivelounge.com/${
                        SelectedCar !== undefined && SelectedCar[0].url
                      }`}
                    />
                    <Title level={5}>
                      {" "}
                      {SelectedCar !== undefined &&
                        SelectedCar[0].brandname}{" "}
                    </Title>
                    <Paragraph>
                      {" "}
                      {SelectedCar !== undefined && SelectedCar[0].model}{" "}
                    </Paragraph>
                  </div>

                  <div className="do-you-have">
                    <Title level={4}>
                      {" "}
                      {getLocaleMessages("Do you have your coupon code")}{" "}
                    </Title>
                    {/* <Search
                      allowClear
                      enterButton={getLocaleMessages("Apply")}
                      size="medium"
                      onSearch={handleApplyCouponCode}
                    /> */}
                    <Input
                      onChange={(e) => {
                        setCouponText(e.target.value);
                        setCouponValue(0);
                      }}
                      allowClear
                      addonAfter={
                        <Button
                          style={{
                            border: "none",
                            background: "#bcab83",
                            color: "white",
                          }}
                          onClick={() => handleApplyCouponCode(couponText)}
                          disabled={
                            CouponValue !== 0 || couponText?.length === 0
                          }
                          loading={loading}
                        >
                          {getLocaleMessages("Apply")}
                        </Button>
                      }
                    />{" "}
                  </div>
                  <div className="total-rental-day">
                    <Title level={4}>
                      {" "}
                      {getLocaleMessages("Billing Details")}{" "}
                    </Title>
                    {/* <InputNumber
                      max={100}
                      value={BookingDays}
                      onChange={handleBookingDays}
                      disabled
                    /> */}
                    <Paragraph className="tot-days">
                      {getLocaleMessages("Total Rental Days")} ( {localLang === "ar"
                          ? getArabicRentalDays()
                          : getEnglishRentalDays()}
                      )
                    </Paragraph>
                    <Paragraph className="split">
                      {getLocaleMessages("Price")}
                      <span>
                        {/*SelectedCar !== undefined && (SelectedCar[0].symbol ? ( `SAR ${SubTotal.toFixed(SelectedCar[0].decimal)}`):(`${SubTotal.toFixed(SelectedCar[0].decimal)} SAR`))*/}
                        {SelectedCar !== undefined &&
                          Curencyval(SubTotal)}
                      </span>
                    </Paragraph>
                    {CouponValue > 0 && (
                      <Paragraph className="split">
                        {`- ${getLocaleMessages(
                          "Coupon Value"
                        )} ${CouponValue}%`}
                        <span>
                          {/*SelectedCar !== undefined && (SelectedCar[0].symbol ? (`SAR ${CouponValue.toFixed(SelectedCar[0].decimal)}`) : (`${CouponValue.toFixed(SelectedCar[0].decimal)} SAR`))*/}
                          {SelectedCar !== undefined &&
                            Curencyval(CouponVal)}
                        </span>
                      </Paragraph>
                    )}
                    <Paragraph className="split total">
                      {getLocaleMessages("Sub Total")}
                      <span>
                        {SelectedCar !== undefined &&
                          SubTotal !== undefined &&
                          Curencyval(SubTotal - CouponVal)}
                      </span>
                    </Paragraph>
                    <Paragraph className="split">
                      {`+ ${getLocaleMessages("VAT")} ${
                        SelectedCar !== undefined && SelectedCar[0].vat
                      }%`}
                      <span>
                        {" "}
                        {/*SelectedCar !== undefined && (SelectedCar[0].symbol ? (`SAR ${VatAmount.toFixed(SelectedCar[0].decimal)}`) :( `${VatAmount.toFixed(SelectedCar[0].decimal)} SAR`))*/}
                        {SelectedCar !== undefined &&
                          Curencyval(VatAmount)}
                      </span>
                    </Paragraph>

                    {/* {SelectedCar !== undefined && SelectedCar[0].deposite > 0 && (
                      <Paragraph className="split">
                        {getLocaleMessages("Deposit")}
                        <span>
                          {SelectedCar !== undefined &&
                            Curencyval(Decimalval(SelectedCar[0].deposite))}
                        </span>
                      </Paragraph>
                    )} */}
                    <Paragraph className="split total">
                      {getLocaleMessages("Total Amount")}
                      <span>
                        {/*SelectedCar !== undefined && (SelectedCar[0].symbol ? (`SAR ${TotalPrice.toFixed(SelectedCar[0].decimal)}`) : (`${TotalPrice.toFixed(SelectedCar[0].decimal)} SAR`))*/}
                        {SelectedCar !== undefined &&
                          Curencyval(TotalPrice)}
                      </span>
                    </Paragraph>
                    {!showPayment && (
                      <Paragraph className="split">
                        <Button
                          type="primary"
                          className="checkout-btn"
                          onClick={handleCheckout}
                          loading={buttonState}
                        >
                          {getLocaleMessages("Book Now")}
                        </Button>
                      </Paragraph>
                    )}
                    {(filterCarElements.WithDriver || (SelectedCar !== undefined && SelectedCar[0].driver == "With Chauffeur")) && (
                      <>
                        <Paragraph className="split">
                          {`${getLocaleMessages("Chauffeur Charge")}`}
                          <span>
                            {" "}
                            {/*SelectedCar !== undefined && (SelectedCar[0].symbol ? (`SAR ${VatAmount.toFixed(SelectedCar[0].decimal)}`) :( `${VatAmount.toFixed(SelectedCar[0].decimal)} SAR`))*/}
                            {SelectedCar !== undefined &&
                              Curencyval(DriverCharge)}
                          </span>
                        </Paragraph>
                        <span>{`[${getLocaleMessages("Note Driver")}]`}</span>
                      </>
                    )}

                    {SelectedCar !== undefined && SelectedCar[0].deposite > 0 && (
                      <Paragraph className="split">
                        {getLocaleMessages("Deposit")}
                        <span>
                          {SelectedCar !== undefined &&
                            Curencyval(Decimalval(SelectedCar[0].deposite))}
                        </span>
                      </Paragraph>
                    )}
                    <span>{`[${getLocaleMessages("Note Deposit")}]`}</span>
                  </div>
                </Col>
              </Row>
            </div>
          </section>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default Home;
