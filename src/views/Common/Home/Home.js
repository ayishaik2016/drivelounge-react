import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import AddressAutoComplete from "./../AutoCompleteSearch/AutoComplete";
import CurrencyModel from "./CurrencyModel";
import _ from "lodash";
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
  DatePicker,
  Menu,
  Space,
  Dropdown,
  Checkbox,
  Modal,
  Avatar,
  message,
  Select,
  Popconfirm,
  Alert,
} from "antd";
// import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UserAddOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  FieldTimeOutlined,
  UserOutlined,
  CommentOutlined,
  LogoutOutlined,
  ProfileOutlined,
  CaretDownOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import actions from "./../../../redux/auth/actions";
import currencyactions from "./../../../redux/currency/actions"
import caractions from "./../../../redux/car/actions";
import commonactions from "./../../../redux/common/actions";
import filteractions from "./../../../redux/filters/actions";
import SignupModal from "./../Modals/Signup";
import SigninModal from "./../Modals/Signin";
import ForgotModal from "./../Modals/Forgot";
import OTP from "./../Modals/OneTimePassword";
import searchactions from "./../../../redux/Listing/actions";
import "../../../assets/css/userStyle.css";
import CarCardItem from "./CarCardItem";
import { history, store } from "./../../../redux/store";
import {
  format,
  endOfToday,
  endOfDay,
  parseISO,
  differenceInCalendarDays,
  addDays,
  compareDesc,
  compareAsc,
} from "date-fns";
import moment from "moment";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import {
  getLocalDataType,
  getLocalData,
  getLocaleMessages,
} from "redux/helper";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import styled from "styled-components";
import { formatPhoneNumberIntl } from "react-phone-number-input";

const { Content } = Layout;
const { Option } = Select;
const { Title, Paragraph } = Typography;

const disabledHours = () => {
  var hours = [];
  for (var i = 0; i < moment().hour(); i++) {
    hours.push(i);
  }
  return hours;
};

const getDisabledMinutes = (selectedHour) => {
  var minutes = [];
  if (selectedHour === moment().hour()) {
    for (var i = 0; i < moment().minute(); i++) {
      minutes.push(i);
    }
  }
  return minutes;
};

const Home = (props) => {
  const localLang = localStorage.getItem("language");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { subLang, loader, isLoggedIn, isOtp, isemail } = useSelector(
    (state) => state.Auth
  );
  const {currencyList, preferredCurrency, currencyConversion, isCurrencyLoading}=useSelector(
    (state) => state.Currency
  )
  const { carFullInformationList } = useSelector((state) => state.CarListing);
  const { cityList, brandList, filteredCityList } = useSelector(
    (state) => state.Common
  );

  const StyledTimePicker = styled(TimePicker)`
    & .rc-time-picker-panel-select-option-selected {
      background-color: #edeffe;
      font-weight: normal;
    }

    & .rc-time-picker-clear {
      margin-top: 3px;
      ${localLang !== null
        ? localLang !== undefined && localLang === "en"
          ? "right:1px"
          : "left:10px;right:unset"
        : "right:1px"}
    }
    & .rc-time-picker-clear-icon:after {
      font-size: 8px;
      left: 10px;
      background-color: #c0c7c7;
      color: #ffffff;
      width: 12px;
      height: 11px;
      -moz-border-radius: 70px;
      -webkit-border-radius: 70px;
      border-radius: 70px;
      padding: 2px 2px 10px 2px;
    }

    & .rc-time-picker-panel-select,
    & .rc-time-picker-input,
    & .rc-time-picker-panel-input {
      font-size: 18px;

      ::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  `;
  const onChange = ({ file }) => {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLVisible, setIsModalLVisible] = useState(false);
  const [isForgotVisible, setIsForgotVisible] = useState(false);
  const [isOtpVisible, SetIsOtpVisible] = useState(false);
  const [OTPdata, setOTPdata] = useState("");
  const [ShowAlert, setShowAlert] = useState(false);
  const [PickupPlace, setPickupPlace] = useState("");
  const [PickupPlaceId, setPickupPlaceId] = useState("");
  const [DropPlace, setDropPlace] = useState("");
  const [DropPlaceId, setDropPlaceId] = useState("");
  const [IsDropoffSelected, setIsDropoffSelected] = useState(false);
  const [WithDriver, setWithDriver] = useState(false);
  const [CheckSelected, setCheckSelected] = useState(0);
  const [PickupCors, setPickupCors] = useState({});
  const [DropoffCors, setDropoffCors] = useState({});
  const [LoggedUsername, setLoggedUsername] = useState("");
  const [SignupData, setSignupData] = useState({});
  const [TopCarsDisplay, setTopCarsDisplay] = useState([]);
  const [Platinum, setPlatinum] = useState([]);
  const [Gold, setGold] = useState([]);
  const [Silver, setSilver] = useState([]);
  const [OtherCars, setOtherCars] = useState([]);
  const [ResponsiveMenu, setResponsiveMenu] = useState(false);
  const [isCurrency,setIsCurrency]=useState(false);
  const [settingsDestination, setsettingsDestination] = useState({
    infinite: true,
    speed: 600,
    dots: true,
    arrows: true,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    // responsive: [
    //   {
    //     breakpoint: 500,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     },
    //   },
    // ],
  });
  // const disabledDate = (current) => {
  //   return current && current < moment().endOf('day');
  // };

  const handlePickCityChange = (e, v) => {
    if (v !== undefined) {
      if (v.children !== undefined) {
        setPickupPlace(v.children);
        setPickupPlaceId(v.value);
        // setDropPlace(v.children);
        setPickupCors(setCorsDetails(v.children, 1));
      }
    }
  };

  const handleDropCityChange = (e, v) => {
    if (v !== undefined) {
      if (v.children !== undefined) {
        setDropPlace(v.children);
        setDropPlaceId(v.value);
        setDropoffCors(setCorsDetails(v.children, 2));
      }
    }
  };

  const onlanguagechange = () => {
    dispatch({
      type: actions.CHANGE_LANGUAGE,
      payload: subLang === "en" ? "ar" : "en",
    });
  };

  useEffect(() => {
    dispatch({
      type: currencyactions.GET_CURRENCY_CONVERSION,
      payload: {
        code: preferredCurrency
      }
    })
  }, [preferredCurrency])

  useEffect(() => {
    const name = getLocalData("username");
    const fistname = getLocalData("firstname");
    const lastname = getLocalData("lastname");
    if (name !== null) {
      setLoggedUsername(name);
    } else {
      setLoggedUsername(fistname + " " + lastname);
    }
  }, [isLoggedIn]);

  const disabledDate = (current) => {
    let date = new Date(current);
    return new Date() > endOfDay(date);
  };

  const disabledDropDate = (current) => {
    const PickupDate = form.getFieldValue("PickupDate");
    let date = new Date(PickupDate);
    const days = differenceInCalendarDays(date, new Date());
    return current && current < moment(date).endOf("day");
  };

  useEffect(() => {
    localStorage.removeItem("searchCriteria");
    localStorage.removeItem("caridl");
    localStorage.removeItem("faq");
    localStorage.removeItem("cms");
    dispatch({
      type: searchactions.CLEAR_SELECTED_CAR_FILTER,
      payload: false,
    });
    dispatch({
      type: filteractions.CLEAR_FILTERS,
    });
    dispatch({
      type: commonactions.GET_BRAND_LIST,
      payload: false,
    });
    dispatch({
      type: caractions.GET_CAR_FULL_LIST,
      payload: false,
    });
    dispatch({
      type: commonactions.GET_CITY_LIST,
      payload: false,
    });
  }, []);

  useEffect(() => {
    if (isOtpVisible) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = () => undefined;
    }
  }, [isOtpVisible]);

  useEffect(() => {
    if (isOtp) {
      setIsModalVisible(false);
      SetIsOtpVisible(isOtp);
    } else {
      SetIsOtpVisible(false);
      setOTPdata("");
    }
  }, [isOtp]);

  useEffect(() => {
    if (filteredCityList?.length == 1)
      setsettingsDestination({ ...settingsDestination, slidesToShow: 1 });
    if (filteredCityList?.length == 2)
      setsettingsDestination({ ...settingsDestination, slidesToShow: 2 });
    if (filteredCityList?.length == 3)
      setsettingsDestination({ ...settingsDestination, slidesToShow: 3 });
  }, [cityList, filteredCityList]);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <ArrowRightOutlined />
      </div>
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <ArrowLeftOutlined />
      </div>
    );
  };

  const settings = {
    infinite: true,
    speed: 600,
    dots: false,
    arrows: true,
    autoplay: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const setCorsDetails = (address, type) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        let data = { lat: latLng.lat, lng: latLng.lng, address: address };
        type == 1 ? setPickupCors(data) : setDropoffCors(data);
      })
      .catch((error) => console.error("Error", error));
  };

  const formatDate = (date) => {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    const formattedToday = yyyy + "-" + mm + "-" + dd;
    return formattedToday;
  };
  /*
"en-IT", {
        hour12: false,
      }
*/
  const getCombinedDateObject = (date, time) => {
    let calculatedDateString = "";
    if (date && time) {
      let utcDate = formatDate(date);
      let utcTime = new Date(time).toLocaleTimeString();
      calculatedDateString = `${utcDate} ${utcTime}`;
    }
    let formattempDate = moment(
      calculatedDateString,
      "YYYY-MM-DD HH:mm:ss a"
    ).format();
    let finalDateTime = new Date(formattempDate);

    if (isNaN(finalDateTime.getTime())) return null;
    else return finalDateTime;
  };

  const onFinishSearch = (values) => {
    // if(ShowAlert){
    //   message.warn("Please accept or decline before proceed");
    //   return;
    // }
    let _pickupdate = new Date();
    let _dropoffdate = new Date();

    if (PickupPlace.length == "") {
      message.error("Please select the pickup city");
      return;
    }

    if (values.PickupDate !== undefined && values.PickupTime) {
      const date = format(new Date(values.PickupDate), "yyyy-MM-dd");
      const time = format(new Date(values.PickupTime), "hh:mm a");
      // _pickupdate = new Date(date + " " + time);
      _pickupdate = getCombinedDateObject(values.PickupDate, values.PickupTime);
    }

    if (values.DropoffDate !== undefined && values.DropoffTime) {
      const date = format(new Date(values.DropoffDate), "yyyy-MM-dd");
      const time = format(new Date(values.DropoffTime), "hh:mm a");
      // _dropoffdate = new Date(date + " " + time);
      _dropoffdate = getCombinedDateObject(
        values.DropoffDate,
        values.DropoffTime
      );
    }

    var beginningTime = moment();
    var endTime = moment(new Date(values.PickupTime), "hh:mm a");

    if (compareDesc(_pickupdate, _dropoffdate) <= 0) {
      if (values.PickupDate > values.DropoffDate) {
        message.error(
          getLocaleMessages(
            "Please select correct pickup date and Drop off date"
          )
        );
      } else {
        message.error(
          getLocaleMessages(
            "Please choose drop of date & time greater than pickup date & time"
          )
        );
      }
      return;
    }

    if (
      endTime?.isBefore(beginningTime) &&
      _pickupdate?.getDate() === new Date().getDate()
    ) {
      message.error(
        getLocaleMessages("Please select the time greater than current time")
      );
      return;
    }
    let data = {
      PickupPlace: PickupPlace,
      PickupPlaceId: PickupPlaceId,
      PickupDate: _pickupdate,
      DropPlace: IsDropoffSelected ? DropPlace : PickupPlace,
      DropPlaceId: IsDropoffSelected ? DropPlaceId : PickupPlaceId,
      DropoffDate: _dropoffdate,
      WithDriver: WithDriver,
      PickupCors: PickupCors,
      DropCors: IsDropoffSelected ? DropoffCors : PickupCors,
      DifferentDropoffLocation: IsDropoffSelected,
    };
    localStorage.setItem("searchCriteria", JSON.stringify(data));
    dispatch({
      type: searchactions.SET_SEARCH_CAR_DEFAULT,
      ...data,
    });
    history.push("/listing");
  };

  const topN = (arr, n) => {
    return arr
      ?.slice()
      ?.sort((a, b) => {
        return a.sortorder - b.sortorder;
      })
      ?.slice(0, n);
  };

  useEffect(() => {
    if (carFullInformationList?.length > 0) {
      // carFullInformationList.sort((a, b) =>
      //   a.carid > b.carid ? 1 : b.carid > a.carid ? -1 : 0
      // );
      // var topCars = carFullInformationList.slice(0, 12);
      // setTopCarsDisplay(topCars);
      // Platinum Cars
      let data = _.groupBy(carFullInformationList, (car) => car.category);
      setPlatinum(topN(data["1"], data["1"]?.length));
      setGold(topN(data["2"], data["2"]?.length));
      setSilver(topN(data["3"], data["3"]?.length));
      setOtherCars(topN(data["0"], 3));
    }
  }, [carFullInformationList]);

  useEffect(() => {
    form.setFieldsValue({ PickupLocation: PickupPlace });
  }, [PickupPlace]);

  useEffect(() => {
    form.setFieldsValue({ DropoffLocation: DropPlace });
  }, [DropPlace]);

  const [modalDetails, SetModalDetails] = useState(false);

  const showModalDetail = () => {
    SetModalDetails(!modalDetails);
  };

  const showModal = ({ signupModalVisible }) => {
    setIsModalVisible(signupModalVisible);
  };

  const showLModal = ({ loginModalVisible }) => {
    setIsModalLVisible(loginModalVisible);
  };

  const fOk = () => {
    setIsForgotVisible(false);
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

  const LoginSignup = ({ login, signup }) => {
    if (login) {
      setIsModalVisible(signup);
      setIsModalLVisible(login);
    } else if (signup) {
      setIsModalLVisible(login);
      setIsModalVisible(signup);
    }
  };

  const otpOk = () => {
    Modal.confirm({
      title: "Warning",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to close this modal and the otp modal never open",
      okText: "ok",
      cancelText: "Cancel",
      maskClosable: true,
      mask: true,
      onOk: () => {
        dispatch({
          type: actions.VERIFY_OTP_SUCCESS,
        });
      },
    });
  };

  const onFinish = (values) => {
    const data = {
      ...values,
      contactnumber: values.contactnumber,
    };
    if (values.usertypeid == 3 && values.agencyname !== "") {
      setSignupData(values);
      dispatch({
        type: actions.CREATE_AUTHENTICATE_USER,
        payload: data,
        callBackAction: () => {
          showLModal({ loginModalVisible: true });
        },
      });
    } else {
      dispatch({
        type: actions.CREATE_AUTHENTICATE_VENDOR,
        payload: data,
        callBackAction: () => {
          setIsModalVisible(false);
        },
      });
      showModal({ signupModalVisible: false });
    }
  };

  const onFinishLogin = (values) => {
    if (values.usertypeid == 3) {
      dispatch({
        type: actions.AUTHENTICATE_USER,
        payload: values,
        callBackAction: () => {
          showLModal({ loginModalVisible: false });
        },
      });
    } else {
      dispatch({
        type: actions.VENDOR_AUTHENTICATE_USER,
        payload: values,
        callBackAction: () => {
          showLModal({ loginModalVisible: false });
        },
      });
    }
  };

  const resendOTP = () => {
    message.success("OTP Resent successfully.");
  };

  const onFinishForgot = (values) => {
    if (values.email !== null && values.email !== "") {
      dispatch({
        type: actions.SEND_PASSWORD_RESET_LINK,
        payload: values,
        callBackAction: () => {
          LoginForgot({
            login: true,
            forgot: false,
          });
        },
      });
    } else {
      message.error("Please provide the valid email address");
    }
  };

  const onFinishOTP = () => {
    if (OTPdata.length === 4) {
      dispatch({
        type: actions.VERIFY_OTP,
        payload: {
          otp: OTPdata,
          email: isemail,
        },
        callBackAction: () => {
          SetIsOtpVisible(false);
          setOTPdata("");
          dispatch({
            type: actions.AUTHENTICATE_USER,
            payload: SignupData,
            callBackAction: () => {
              showLModal({ loginModalVisible: false });
            },
          });
          showLModal({ loginModalVisible: true });
          showModal({ signupModalVisible: false });
        },
      });
    } else {
      message.error("Please enter valid OTP");
    }
  };

  const onChangeOTP = (value) => {
    setOTPdata(value);
  };

  const extraMenu = (
    <Menu>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          About us
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          Customer Support
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="">
          Download our app
        </a>
      </Menu.Item>
    </Menu>
  );

  const loginMenu = (
    <Menu>
      <Menu.Item>
        <NavLink to="/profile">
          <ProfileOutlined /> {getLocaleMessages("My Profile")}
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to="/booking">
          <FieldTimeOutlined /> {getLocaleMessages("Bookings")}
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to="/favorites">
          <HeartOutlined /> {getLocaleMessages("Favorites")}
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to="/reviews">
          <CommentOutlined /> {getLocaleMessages("Rate & Reviews")}
        </NavLink>
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => {
          dispatch({
            type: actions.LOGOUT_USER,
          });
        }}
      >
        <LogoutOutlined /> {getLocaleMessages("Logout")}
      </Menu.Item>
    </Menu>
  );

  const menu = (
    <Menu>
      <Menu.Item
        key="en"
        onClick={() => {
          dispatch({
            type: actions.CHANGE_LANGUAGE,
            payload: "en",
          });
        }}
      >
        {localLang === "en" ? "English (EN)" : "الإنجليزية (EN)"}
      </Menu.Item>
      <Menu.Item
        key="ar"
        onClick={() => {
          dispatch({
            type: actions.CHANGE_LANGUAGE,
            payload: "ar",
          });
        }}
      >
        {localLang === "en" ? "Arabic (عربي )" : "العربية (ع)"}{" "}
      </Menu.Item>
    </Menu>
  );

  const handlePopOk = () => {
    setShowAlert(!ShowAlert);
  };

  useEffect(() => {
    if (!WithDriver) {
      setShowAlert(false);
    }
    if (!IsDropoffSelected) {
      setShowAlert(false);
    }
    if (WithDriver || IsDropoffSelected) {
      setShowAlert(true);
    }
  }, [WithDriver, IsDropoffSelected]);

  const handleDropoff = (e) => {
    // if(ShowAlert == true){
    //   message.warn("Please accept or decline before proceed");
    //   return;
    // }
    setCheckSelected(1);
    if (e.target.checked == true) {
      setShowAlert(!ShowAlert);
    }
    setIsDropoffSelected(e.target.checked);
    // setTimeout(() => {
    //   setShowAlert(false)
    // }, 3000);
  };

  const handleWithDriver = (e) => {
    // if(ShowAlert == true){
    //   message.warn("Please accept or decline before proceed");
    //   return;
    // }
    setWithDriver(e.target.checked);
    if (e.target.checked == true) {
      !ShowAlert && setShowAlert(!ShowAlert);
      setCheckSelected(2);
    } else {
      setCheckSelected(0);
    }
    // setTimeout(() => {
    //   setShowAlert(false);
    // }, 3000);
  };

  const handlePopCancel = () => {
    if (CheckSelected === 1) {
      form.setFieldsValue({ DifferentDropoffLocation: false });
      setIsDropoffSelected(false);
    }

    if (CheckSelected === 2) {
      form.setFieldsValue({ WithDriver: false });
      setWithDriver(false);
    }

    setIsDropoffSelected(false);
    setShowAlert(!ShowAlert);
    setCheckSelected(0);
  };

  const handleContactus = () => {
    const win = window.open("/contactus", "_blank");
    win.focus();
  };

  const handleAgency = () => {
    history.push("/agency/login");
  };

  const handleClickResponsiveMenu = () => {
    setResponsiveMenu(!ResponsiveMenu);
  };
  let destinationCities = cityList?.filter((car) => car?.showdashboard);
  const onChangeCurrency=(currencyType)=>{
    dispatch({
      type: currencyactions.CHANGE_CURRENCY,
      payload: currencyType,
      callBackAction: () => {
        console.log(currencyType,"currencyChange")
      },
    });
  }
  useEffect(
    ()=>{
      dispatch({
        type: currencyactions.GET_CURRENCY,
})
    },[]
  )
  
  return (
    <>
      <Layout className={"on-boarding"}>
        {isModalVisible && (
          <SignupModal
            visible={isModalVisible}
            onCancel={() => showModal({ signupModalVisible: false })}
            onFinish={onFinish}
            LoginSignup={LoginSignup}
            loader={loader}
            destroyOnClose
            onChange={onChange}
          />
        )}
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
        <ForgotModal
          visible={isForgotVisible}
          onCancel={fOk}
          onFinish={onFinishForgot}
          onLoginForgot={LoginForgot}
          loader={loader}
        />
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
              <span onClick={resendOTP}>
                {" "}
                {getLocaleMessages("Resend OTP")}{" "}
              </span>
            </p>
          </div>
          <div className="modal-ui-right">
            <img
              src={require("./../../../assets/images/otp.png").default}
              alt="otp"
            />
          </div>
        </Modal>


            <Button
              className="mobile_responsive_menu"
              type="primary"
              shape="circle"
              icon={ResponsiveMenu ? <CloseOutlined /> : <MenuOutlined />}
              onClick={handleClickResponsiveMenu}
            />

            <div
              className={
                ResponsiveMenu
                  ? "banner-header show_mobile_toggle"
                  : "banner-header"
              }
            >
            <div className="container">
              <div className="bottom-navigation">
                <ul>
                  <li>
                    <NavLink to="/"> {getLocaleMessages("Home")} </NavLink>
                  </li>
                  <li>
                    <NavLink to="/listing">
                      {" "}
                      {getLocaleMessages("Explore Vehicles")}{" "}
                    </NavLink>
                  </li>
                  <li>
                    <a onClick={handleContactus}>
                      {getLocaleMessages("Contact us")}
                    </a>
                  </li>
                </ul>
              </div>


              <div className="navigation">
              <div className="d-flex">
              <Button
                      type="text"
                         onClick={
                          ()=>setIsCurrency(true)
                         }
                    className="currentTypeBtn">
                      {preferredCurrency}
                    </Button>
                {!isLoggedIn && (
                  <div className="d-flex">
                   
                    <Button
                      type="text"
                      onClick={handleAgency}
                      icon={<UserAddOutlined />}
                    >
                      {getLocaleMessages("For Agency")}
                    </Button>
                    <Button
                      type="text"
                      onClick={() => showLModal({ loginModalVisible: true })}
                      icon={<UserOutlined />}
                    >
                      {getLocaleMessages("Login")}
                    </Button>
                    <div className="or"></div>
                    <Button
                      type="text"
                      onClick={() => showModal({ signupModalVisible: true })}
                      icon={<UserAddOutlined />}
                    >
                      {getLocaleMessages("Register")}
                    </Button>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="d-flex">
                    <Dropdown
                      overlay={loginMenu}
                      overlayClassName="extra-menu"
                      trigger={["click"]}
                    >
                      <a
                        className="antd-icons-cs"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Avatar size={40} icon={<UserOutlined />} />
                        {/* {`Hi, ${LoggedUsername}`} */}
                        {getLocalData("username") !== undefined &&
                        getLocalData("username") !== null
                          ? getLocalData("username").toLocaleLowerCase()
                          : ""}
                        <CaretDownOutlined />
                      </a>
                    </Dropdown>
                  </div>
                )}
                </div>



                <Dropdown overlay={menu} trigger={["click"]}>
                  <a
                    className="ant-language-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    {" "}
                    <GlobalOutlined />{" "}
                  </a>
                </Dropdown>
             
              </div>
              </div>
            </div>



        <Content>
          <section className="banner">
            <div className="container">
              <div className="banner-content">
                <div className="logo">
                  <img
                    src={
                      require("../../../assets/images/logo-large.png").default
                    }
                    alt=""
                  />
                </div>

                <Title> {getLocaleMessages("Let's find your ideal car")}</Title>
                <div className="banner-content-box">
                  {ShowAlert && (
                    <Alert
                      message={getLocaleMessages("Informational Notes")}
                      description={getLocaleMessages(
                        "This service is subject to rental agency availability and may attract additional charges."
                      )}
                      type="info"
                      showIcon
                      // action={
                      //   <Space direction="vertical">
                      //     <Button size="small" style={{color: '#16786e', background: '#fff',borderColor: '#16786e'}} onClick={handlePopOk}>
                      //       Accept
                      //     </Button>
                      //     <Button size="small" danger type="ghost" onClick={handlePopCancel}>
                      //       Decline
                      //     </Button>
                      //   </Space>
                      // }
                    />
                  )}
                  <Form
                    form={form}
                    name="horizontal_login"
                    layout="vertical"
                    onFinish={onFinishSearch}
                  >
                    <div className="se-form-flex">
                      <Form.Item
                        label={getLocaleMessages("Pick-up city")}
                        name="PickupLocation"
                        rules={[
                          {
                            required: true,
                            message: getLocaleMessages("Select pickup city"),
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          allowClear
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          autoComplete={"off"}
                          placeholder={""}
                          dropdownStyle={{ minWidth: "200px" }}
                          onChange={(value, option) =>
                            handlePickCityChange(value, option)
                          }
                        >
                          {cityList &&
                            cityList.map((value, idx) => {
                              return (
                                value.showdashboard && (
                                  <Option key={idx} value={value.id}>
                                    {value.cityname}
                                  </Option>
                                )
                              );
                            })}
                        </Select>

                        {/* <AddressAutoComplete
                          className="ant-input"
                          setLocation={setPickupPlace}
                        /> */}
                      </Form.Item>

                      <div className="se-form-flex-date">
                      <Form.Item
                        label={getLocaleMessages("Pick-up Date")}
                        name={"PickupDate"}
                        rules={[
                          {
                            required: true,
                            message: getLocaleMessages("Select pickup date"),
                          },
                        ]}
                      >
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          inputReadOnly
                          placeholder={getLocaleMessages("Select Date")}
                        />
                      </Form.Item>

                      <Form.Item
                        label={getLocaleMessages("Pick-up Time")}
                        name={"PickupTime"}
                        rules={[
                          {
                            required: true,
                            message: getLocaleMessages("Select pickup time"),
                          },
                        ]}
                      >
                        <StyledTimePicker
                          showSecond={false}
                          minuteStep={15}
                          format="h:mm a"
                          use12Hours
                          inputReadOnly
                          style={{
                            "& .rcTimePickerClear": {
                              right: "none",
                            },
                          }}
                        />
                        {/* <TimePicker
                          showSecond={false}
                          minuteStep={15}
                          format="h:mm a"
                          use12Hours
                          inputReadOnly
                        /> */}
                        {/* <TimePicker use12Hours value={SelectedPickupTime ?? undefined} onBlur={(time) => SetPickupTime(time)}  minuteStep={15} format="h:mm a"/> */}
                      </Form.Item>
                      </div>

                      {IsDropoffSelected && (
                        <Form.Item
                          label={getLocaleMessages("Dropoff city")}
                          name="DropoffLocation"
                          rules={[
                            {
                              required: true,
                              message: getLocaleMessages("Select dropoff city"),
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            autoComplete={"off"}
                            placeholder={""}
                            dropdownStyle={{ minWidth: "200px" }}
                            onChange={(value, option) =>
                              handleDropCityChange(value, option)
                            }
                          >
                            {cityList &&
                              cityList.map((value, idx) => {
                                return (
                                  <Option key={idx} value={value.id}>
                                    {value.cityname}
                                  </Option>
                                );
                              })}
                          </Select>
                          {/* <AddressAutoComplete setLocation={setDropPlace} /> */}
                        </Form.Item>
                      )}

                      <div className="se-form-flex-date">
                      <Form.Item
                        label={getLocaleMessages("Drop-off Date")}
                        name={"DropoffDate"}
                        rules={[
                          {
                            required: true,
                            message: getLocaleMessages("Select dropoff date"),
                          },
                        ]}
                      >
                        <DatePicker
                          disabledDate={disabledDropDate}
                          format="DD-MM-YYYY"
                          inputReadOnly
                          placeholder={getLocaleMessages("Select Date")}
                        />
                      </Form.Item>

                      <Form.Item
                        label={getLocaleMessages("Drop-off Time")}
                        name={"DropoffTime"}
                        rules={[
                          {
                            required: true,
                            message: getLocaleMessages("Select dropoff time"),
                          },
                        ]}
                      >
                        <StyledTimePicker
                          showSecond={false}
                          minuteStep={15}
                          format="h:mm a"
                          use12Hours
                          inputReadOnly
                        />
                        {/* <TimePicker
                          showSecond={false}
                          minuteStep={15}
                          format="h:mm a"
                          use12Hours
                          inputReadOnly
                        /> */}
                        {/* <TimePicker use12Hours value={SelectedDropoffTime ?? undefined} onSelect={(time) =>  SetDropoffTime(time)} minuteStep={15} format="h:mm a"/> */}
                      </Form.Item>
                      </div>
                    </div>
                    <div className="flex-form-options">
                      <div className="banner-form-footer">
                        <Form.Item name={"DifferentDropoffLocation"}>
                          <Checkbox
                            checked={IsDropoffSelected}
                            onClick={handleDropoff}
                          >
                            {getLocaleMessages("Drop off at different city")}
                          </Checkbox>
                        </Form.Item>
                        <Form.Item name={"WithDriver"}>
                          <Checkbox
                            checked={WithDriver}
                            onClick={handleWithDriver}
                          >
                            {getLocaleMessages("Private Chauffeur")}
                          </Checkbox>
                        </Form.Item>
                      </div>

                      <Button
                        type="primary"
                        htmlType="submit"
                        className="save-btn"
                        icon={<ArrowRightOutlined />}
                      >
                        {getLocaleMessages("Search")}
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </section>
          {/*Baner End*/}
          {/*Categories*/}
          <section className="categories">
            <div className="container">
              <Typography className="subText-container">
                <Title level={2} className="heading-2">
                  {getLocaleMessages("All luxury rental agencies in one place")}
                </Title>

                <Paragraph>
                  {getLocaleMessages(
                    "Find a broad range of luxury cars around the world, only a few clicks away!"
                  )}
                </Paragraph>
              </Typography>

              <Carousel {...settings}>
                {brandList &&
                  brandList.map((brand, index) => (
                    <div key={index}>
                      <div className="pad-10">
                        <div>
                          <img
                            alt="example"
                            src={`https://api.drivelounge.com/${brand.carbrandimage}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </Carousel>
            </div>
          </section>
          {/*Categories End*/}
          {/*How it Works */}


<section className="how-booking">
    <div className="container">
        <div className="how-booking-left">
            <h2>{getLocaleMessages("How it Works")}</h2>
            <ul>
                <li>
                    <div className="icons">
                        <img src={require("./../../../assets/images/car.png").default} alt="Seclect Your Car" />
                    </div>
                    <h3>{getLocaleMessages("01. Select")}</h3>
                    <p>
                        {getLocaleMessages( `Explore available luxury car experiences, refine your choices like chauffeur availability or different drop-off location.` )}
                    </p>
                </li>
                <li>
                    <div className="icons">
                        <img src={require("./../../../assets/images/booking.png").default} alt="Seclect Your Car" />
                    </div>
                    <h3>{getLocaleMessages("02. Booking")}{" "}</h3>
                    <p>
                      {getLocaleMessages(
                        `Once you have found what you are looking for, get your booking details like insurance, smoking policy and cancellation and refine your pick-up and drop-off locations, and proceed with your booking.`
                      )}
                    </p>
                </li>
                <li>
                    <div className="icons">
                        <img src={require("./../../../assets/images/payment.png").default} alt="Seclect Your Car" />
                    </div>
                    <h3>{getLocaleMessages("03. Go")}</h3>
                    <p>
                      {getLocaleMessages(
                        `You are good to go now. Your car agency will connect with you to arrange for booking arrangement, questions or advices.`
                      )}
                    </p>
                </li>
            </ul>
        </div>
    </div>
<img src={require("./../../../assets/images/how-booking.jpg").default} alt="Seclect Your Car" className="car-flying" />

</section>



{/*

          <section className="how-it-works">
            <div className="container">
              <Typography className="subText-container">
                <Title level={2} className="heading-2">
                  {getLocaleMessages("How it Works")}
                </Title>
              </Typography>
              <Row gutter={{ xs: 8, sm: 16, md: 60, lg: 60 }}>
                <Col sm={8} md={8} className="text-center">
                  <div className="icons">
                    <img
                      src={require("./../../../assets/images/car.png").default}
                      alt="Seclect Your Car"
                    />
                  </div>
                  <Typography className="hw-box">
                    <Title level={3}> {getLocaleMessages("01. Select")} </Title>
                    <Paragraph>
                      {getLocaleMessages(
                        `Explore available luxury car experiences, refine your choices like chauffeur availability or different drop-off location.`
                      )}
                    </Paragraph>
                  </Typography>
                </Col>
                <Col sm={8} md={8} className="text-center">
                  <div className="icons mt-60">
                    <img
                      src={
                        require("./../../../assets/images/booking.png").default
                      }
                      alt="Booking"
                    />
                  </div>
                  <Typography className="hw-box">
                    <Title level={3}>
                      {" "}
                      {getLocaleMessages("02. Booking")}{" "}
                    </Title>
                    <Paragraph>
                      {getLocaleMessages(
                        `Once you have found what you are looking for, get your booking details like insurance, smoking policy and cancellation and refine your pick-up and drop-off locations, and proceed with your booking.`
                      )}
                    </Paragraph>
                  </Typography>
                </Col>
                <Col sm={8} md={8} className="text-center">
                  <div className="icons mt-30">
                    <img
                      src={
                        require("./../../../assets/images/payment.png").default
                      }
                      alt="Payment"
                    />
                  </div>
                  <Typography className="hw-box">
                    <Title level={3}> {getLocaleMessages("03. Go")} </Title>
                    <Paragraph>
                      {getLocaleMessages(
                        `You are good to go now. Your car agency will connect with you to arrange for booking arrangement, questions or advices.`
                      )}
                    </Paragraph>
                  </Typography>
                </Col>
              </Row>
            </div>
          </section>
*/}



          {/*How it Works End*/}
          <section className="choose-your-cars">
            <div className="container">
              {Platinum && (
                <Typography className="subText-container">
                  <Title level={2} className="heading-2">
                    {getLocaleMessages("Platinum")}
                  </Title>
                </Typography>
              )}
              <Row gutter={30}>
                {Platinum &&
                  Platinum.map((car, index) => {
                    if (car.showdashboard)
                      return (
                        <CarCardItem
                          {...props}
                          key={index}
                          showModalDetail={showModalDetail}
                          showLModal={showLModal}
                          {...car}
                        />
                      );
                  })}
              </Row>
              {Gold && (
                <Typography className="subText-container">
                  <Title level={2} className="heading-2">
                    {getLocaleMessages("Gold")}
                  </Title>
                </Typography>
              )}

              <Row gutter={30}>
                {Gold &&
                  Gold.map((car, index) => {
                    if (car.showdashboard)
                      return (
                        <CarCardItem
                          {...props}
                          key={index}
                          showModalDetail={showModalDetail}
                          showLModal={showLModal}
                          {...car}
                        />
                      );
                  })}
              </Row>
              {Silver && (
                <Typography className="subText-container">
                  <Title level={2} className="heading-2">
                    {getLocaleMessages("Silver")}
                  </Title>
                </Typography>
              )}
              <Row gutter={30}>
                {Silver &&
                  Silver.map((car, index) => {
                    if (car.showdashboard)
                      return (
                        <CarCardItem
                          {...props}
                          key={index}
                          showModalDetail={showModalDetail}
                          showLModal={showLModal}
                          {...car}
                        />
                      );
                  })}
              </Row>
            </div>
          </section>
          <section className="whypeople-like">
            <div className="container">
              <Typography className="subText-container">
                <Title level={2} className="heading-2">
                  {getLocaleMessages("Why us")}
                </Title>

                {/* <Paragraph>
                  Lorem Lipsum is simply dummy text of the printing and
                  typesetting industry.
                </Paragraph> */}
              </Typography>
              <Row gutter={40}>
                <Col xs={24} sm={12} md={6}>
                  <Typography className="box">
                    <div>
                      <img
                        src={require("./../../../assets/images/01.png").default}
                        alt="Best Price Guarantee"
                      />
                    </div>
                    <Title level={4}>
                      {" "}
                      {getLocaleMessages("Experience real images")}{" "}
                    </Title>
                    <Paragraph>
                      {getLocaleMessages(
                        "Experience real images of the car you are about to book."
                      )}
                    </Paragraph>
                  </Typography>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Typography className="box">
                    <Title level={4}>
                      {" "}
                      {getLocaleMessages("Hassle-free experience")}{" "}
                    </Title>
                    <Paragraph>
                      {getLocaleMessages(
                        "when you want to be chauffeured around."
                      )}
                    </Paragraph>
                    <div>
                      <img
                        src={require("./../../../assets/images/02.png").default}
                        alt="Best Price Guarantee"
                      />
                    </div>
                  </Typography>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Typography className="box">
                    <div>
                      <img
                        src={require("./../../../assets/images/03.png").default}
                        alt="Best Price Guarantee"
                      />
                    </div>
                    <Title level={4}>
                      {" "}
                      {getLocaleMessages(
                        "Your convenience is our priority"
                      )}{" "}
                    </Title>
                    <Paragraph>
                      {getLocaleMessages(
                        "select your pick-up and drop-off date, time and pick-up location for some cites."
                      )}
                    </Paragraph>
                  </Typography>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Typography className="box">
                    <Title level={4}>
                      {" "}
                      {getLocaleMessages("Peace of mind")}{" "}
                    </Title>
                    <Paragraph>
                      {getLocaleMessages(
                        "Find peace of mind with our guaranteed bookings"
                      )}
                    </Paragraph>

                    <div>
                      <img
                        src={require("./../../../assets/images/04.png").default}
                        alt="Best Price Guarantee"
                      />
                    </div>
                  </Typography>
                </Col>
              </Row>

              <div className="container_inner_small">
                <Row gutter={40}>
                  <Col xs={24} sm={12} md={8}>
                    <Typography className="box">
                      <div>
                        <img
                          src={
                            require("./../../../assets/images/05.png").default
                          }
                          alt="Best Price Guarantee"
                        />
                      </div>
                      <Title level={4}>
                        {" "}
                        {getLocaleMessages("Competitive rates")}{" "}
                      </Title>
                      <Paragraph>
                        {getLocaleMessages(
                          "Find competitive rates at your destination"
                        )}
                      </Paragraph>
                    </Typography>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Typography className="box">
                      <Title level={4}>{getLocaleMessages("Save money")}</Title>
                      <Paragraph>
                        {getLocaleMessages(
                          "Save money with special and season offers"
                        )}
                      </Paragraph>
                      <div>
                        <img
                          src={
                            require("./../../../assets/images/06.png").default
                          }
                          alt="Best Price Guarantee"
                        />
                      </div>
                    </Typography>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Typography className="box">
                      <div>
                        <img
                          src={
                            require("./../../../assets/images/07.png").default
                          }
                          alt="Best Price Guarantee"
                        />
                      </div>
                      <Title level={4}>
                        {" "}
                        {getLocaleMessages("24 / 7 Customer Support")}{" "}
                      </Title>
                      <Paragraph>
                        {getLocaleMessages(
                          "if you run into an issue, we will fix it quickly."
                        )}
                      </Paragraph>
                    </Typography>
                  </Col>
                </Row>
              </div>
            </div>
          </section>
          {/*How it Works End*/}
          {/*About us Start*/}
          <section className="about-us">
            <div className="container">
              <Row gutter={30}>
                <Col xs={24} sm={12} md={12}>
                  <img
                    src={require("./../../../assets/images/about.png").default}
                    alt="About us"
                  />
                </Col>
                <Col xs={24} sm={12} md={12}>
                  <Typography>
                    <Title level={4}> {getLocaleMessages("About Us")} </Title>

                    <Paragraph>
                      {getLocaleMessages(
                        `Arranging car hire in many countries, Drive Lounge is the professional online car rental service which provide luxury cars to the people who want to have them favorite luxury cars to around GCC, the user can rent and pickup their car in Airports, and other locations after his booked the car.`
                      )}
                    </Paragraph>
                  </Typography>
                </Col>
              </Row>
            </div>
          </section>
          {/*About us End*/}
          <section className="our-destination">
            <div className="container">
              <Typography className="subText-container">
                <Title level={2} className="heading-2">
                  {getLocaleMessages("Our Destinations")}
                </Title>

                {/* <Paragraph>
                  Lorem Lipsum is simply dummy text of the printing and
                  typesetting industry.
                </Paragraph> */}
              </Typography>
              <div className="box-padding">
                {filteredCityList?.length > 0 &&
                  filteredCityList.map((city, index) => (
                    <div key={index}>
                      <div className="locations-prop">
                        <div className="backdrop">
                          <img
                            src={`https://api.drivelounge.com/${city.cityimage}`}
                          />
                          {!city.showdashboard && (
                            <div className="soon-text">
                              <h1>{getLocaleMessages("Soon")}</h1>
                            </div>
                          )}
                        </div>
                      </div>
                      <Typography className="article-box">
                        <Title level={4}> {city.cityname} </Title>
                        <Paragraph> {city.countryname} </Paragraph>
                      </Typography>
                    </div>
                  ))}
              </div>
            </div>
          </section>
          {/*How it Works End*/}
        </Content>
        <CurrencyModel modelControl={isCurrency} modelSubmitFun={onChangeCurrency} modelClose={()=>setIsCurrency(false)}modelTitle={getLocaleMessages("Select Currency")}/>
        <Footer />
      </Layout>
    </>
  );
};

export default Home;
