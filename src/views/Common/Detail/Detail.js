import React, { useEffect, useState } from "react";
import Geocode from "react-geocode";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Button,
  Collapse,
  Typography,
  Input,
  Modal,
  InputNumber,
  message,
  Radio,
  Image,
} from "antd";
import { FormOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { getRequest, postRequest } from "./../../../helpers/axiosClient";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { store, history } from "./../../../redux/store";
import "../../../assets/css/userStyle.css";
import actions from "./../../../redux/car/actions";
import authactions from "./../../../redux/auth/actions";
import bookingAction from "./../../../redux/user/actions";
//import SearchModal from './../../Common/Modals/SearchInformation';
import SearchModal from "./../../Common/Modals/EditDates";
import ChangePlaces from "./../../Common/Modals/EditPlaces";
import Places from "./../../Admin/Agency/address1";
import SignupModal from "./../../Common/Modals/Signup";
import SigninModal from "./../../Common/Modals/Signin";
import ForgotModal from "./../../Common/Modals/Forgot";
import OTP from "./../../Common/Modals/OneTimePassword";
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css';
import {
  compareDesc,
  addDays,
  format,
  intervalToDuration,
  differenceInCalendarDays,
} from "date-fns";
import StickyBox from "react-sticky-box";

import { filter } from "lodash";
import { getLocaleMessages } from "redux/helper";
import moment from "moment";
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Panel } = Collapse;
const Home = (props) => {
  const dispatch = useDispatch();
  const { carFullInformationList, carInterriorImagesList } = useSelector(
    (state) => state.CarListing
  );
  let localValue = JSON.parse(localStorage.getItem("searchCriteria"));
  const localLang = localStorage.getItem("language");
  //modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLVisible, setIsModalLVisible] = useState(false);
  const [isForgotVisible, setIsForgotVisible] = useState(false);
  const [isOtpVisible, SetIsOtpVisible] = useState(false);
  const [OTPdata, setOTPdata] = useState("");
  const [loadedImages, setLoadedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { subLang, loader, isLoggedIn, isOtp, isemail } = useSelector(
    (state) => state.Auth
  );
  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )
  const { filterCarElements } = useSelector((state) => state.Listing);
  const [isSideForm, setisSideForm] = useState(false);
  const [ShowPickupPlace, setShowPickupPlace] = useState(false);
  const [PickupDate, setPickupDate] = useState(new Date());
  const [PickupPlace, setPickupPlace] = useState("");
  const [DropPlace, setDropPlace] = useState("");
  const [IsDifferentDropoffPlace, setIsDifferentDropoffPlace] = useState(false);
  const [DropoffDate, setDropoffDate] = useState(new Date());
  const [CoverImage, setCoverImage] = useState("");
  const [SelectedCar, setSelectedCar] = useState();
  const [SubTotal, setSubTotal] = useState(0);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [VatAmount, setVatAmount] = useState(0);
  const [VatPercent, setVatPercent] = useState(0);
  const [CouponValue, setCouponValue] = useState(0);
  const [CouponCode, setCouponCode] = useState("");
  const [BookingDays, setBookingDays] = useState(0);
  const [CourselImages, setCourselImages] = useState([]);
  const [DriverCharge, setDriverCharge] = useState(0);
  const [Type, setType] = useState(1);
  const [changeState, setchangeState] = useState(false);
  const [PickupCors, setPickupCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });
  const [DropCors, setDropCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });

  const handleHourConverstion = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = ((hours + 11) % 12 + 1); // Convert to 12-hour format
    const minutesFormatted = minutes.toString().padStart(2, '0');

    return `${hours12}:${minutesFormatted} ${period}`;
  }

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
      let vat = (subtotal - CouponValue) * (VatPercent / 100);
      setVatAmount(vat);
      let total = subtotal + vat - CouponValue;
      setTotalPrice(total);
    }
  };

  const handleReservation = async () => {
    if (BookingDays <= 0) {
      message.error(
        getLocaleMessages("Please Provide valid travel days to proceed")
      );
      return;
    }
    if (
      parseInt(SelectedCar[0].minbookingdays) > 0 &&
      BookingDays < parseInt(SelectedCar[0].minbookingdays)
    ) {
      message.error(
        "Minimum booking days not met, please choose some other car"
      );
      return;
    }
    if (
      filterCarElements.PickupCors == undefined &&
      filterCarElements.PickupCors.address == ""
    ) {
      message.error(
        getLocaleMessages("Please select pickup address before proceed")
      );
      return;
    }
    if (
      filterCarElements.DropCors == undefined &&
      filterCarElements.DropCors.address == ""
    ) {
      message.error(
        getLocaleMessages("Please select drop off address before proceed")
      );
      return;
    }
    if (filterCarElements.PickupDate == "") {
      message.error(getLocaleMessages("Please select pickup date"));
      return;
    }
    if (filterCarElements.DropoffDate == "") {
      message.error(getLocaleMessages("Please select dropoff date"));
      return;
    }

    localStorage.setItem("showmap", changeState ? 1 : 0);
    // if (localStorage.getItem('user_data') == null) {
    //   setIsModalLVisible(true);
    // } else {
    //   let data = {
    //     agentid: SelectedCar !== undefined ? SelectedCar[0].agentid : 0,
    //     carid: filterCarElements.carid,
    //     pickupplace: filterCarElements.PickupPlace,
    //     pickupdate: filterCarElements.PickupDate,
    //     dropplace: filterCarElements.DifferentDropoffLocation
    //       ? filterCarElements.DropPlace
    //       : filterCarElements.PickupPlace,
    //     dropoffdate: filterCarElements.DropoffDate,
    //     withdriver: 1,
    //     driveramount: 0,
    //     deposit: SelectedCar !== undefined ? SelectedCar[0].deposite : 0,
    //     priceperday:
    //       SelectedCar !== undefined ? SelectedCar[0].carpriceperday : 0,
    //     totalrentaldays: BookingDays,
    //     couponcode: CouponCode,
    //     couponvalue: CouponValue,
    //     vatpercent: VatPercent,
    //     vatamount: VatAmount,
    //     subtotal: SubTotal,
    //     totalcost: TotalPrice,
    //     otheramount: 0,
    //     pickupaddress: filterCarElements.PickupCors.address,
    //     dropoffaddress: filterCarElements.DropCors.address,
    //     pickuplat: JSON.stringify(filterCarElements.PickupCors.lat),
    //     pickuplng:  JSON.stringify(filterCarElements.PickupCors.lng),
    //     droplat:  JSON.stringify(filterCarElements.DropCors.lat),
    //     droplng:  JSON.stringify(filterCarElements.DropCors.lng),
    //   };
    //   dispatch({
    //     type: bookingAction.CREATE_CAR_RESERVATION,
    //     payload: data,
    //   });
    //   history.push('/checkout');
    // }
    history.push("/checkout");
  };

  const handleFormOk = () => {
    setisSideForm(!isSideForm);
  };

  const handleFormCancel = () => {
    setisSideForm(!isSideForm);
  };

  const handleApplyCouponCode = async (value) => {
    if (value !== "") {
      setCouponCode(value);
      await getRequest(`user/coupon/getcouponvalue?code=${value}`).then(
        (res) => {
          if (res.data.data !== undefined) {
            const { couponvalue, expirydate, minvalue } = res.data.data;
            if (SubTotal < minvalue) {
              message.error("Minimum cart value not met.");
              return;
            } else if (compareDesc(new Date(), expirydate)) {
              message.error("Coupon code expired, Please try another.");
            } else {
              setCouponValue(couponvalue);
              message.success("Coupon Code applied.");
            }
          } else {
            setCouponValue(0);
            setCouponCode("");
            message.error("Please enter a valid coupon");
          }
        }
      );
    } else {
      setCouponValue(0);
      setCouponCode("");
      message.error("Please enter the valid coupon");
    }
  };
  useEffect(() => {
    dispatch({
      type: actions.GET_CAR_FULL_LIST,
      payload: false,
    });
  }, []);

  useEffect(() => {
    let carid =
      (props.location.state !== undefined && props.location.state.carid) ||
      JSON.parse(localStorage.getItem("searchCriteria"))["carid"];
    dispatch({
      type: actions.GET_CAR_INTERIOR_LIST,
      payload: carid,
    });
    if (carid > 0 && carFullInformationList.length > 0) {
      let findCar = carFullInformationList.filter((car) => car.carid == carid);
      setSelectedCar(findCar);
      if (findCar[0] !== undefined) {
        setVatPercent(findCar[0].vat);
      }
      handleCalculation();
    }
  }, [carFullInformationList]);

  useEffect(() => {
    // if (carInterriorImagesList[0] !== undefined) {
    //   setCoverImage(
    //     carInterriorImagesList &&
    //       carInterriorImagesList[0].carinterriorimagename
    //   );
    // }
    if (carInterriorImagesList.length > 0) {
      let images = [];
      carInterriorImagesList.map((inter) => {
        const timestamp = new Date().getTime();
        images.push({
          original: `https://api.drivelounge.com/${inter.carinterriorimagename}?v=${timestamp}`,
          thumbnail: `https://api.drivelounge.com/${inter.carinterriorimagename}?v=${timestamp}`,
        });
      });
      setCourselImages(images);
    }
  }, [carInterriorImagesList]);
  
  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Load all images in the background
      const loadImages = async () => {
        setLoading(true);
        try {
          const promises = carInterriorImagesList.map((image) => {
            const timestamp = new Date().getTime();
            return `https://api.drivelounge.com/${image.carinterriorimagename}`;
          });
          const loaded = await Promise.all(promises);
          setLoadedImages(loaded.filter(src => src !== null));
        } catch (error) {
          console.error('Error loading images:', error);
        } finally {
          setLoading(false);
        }
      };

      loadImages();
    }, 500);
  }, [carInterriorImagesList]);

  const galleryImages = carInterriorImagesList.map((image) => ({
    original: loadedImages.includes(`https://api.drivelounge.com/${image.carinterriorimagename}`) ? `https://api.drivelounge.com/${image.carinterriorimagename}` : '',
    thumbnail: `https://api.drivelounge.com/${image.carinterriorimagename}`,
    // description: image.carinterriorimagename,
  }));

  const handleImageLoad = (event) => {
    console.log('Image loaded:', event.target.src);
  };

  const thumbnailStyles = () => {
    return {
      border: "5px solid red",
      objectFit: "cover",
    };
  };

  const handleBookingDays = (days) => {
    if (days > 0 && days < 100) {
      setBookingDays(days);
      setDropoffDate(addDays(new Date(filterCarElements.PickupDate), days));
      handleCalculation();
    } else {
      message.warn("Maximum 100 day's allowed.");
      setBookingDays(100);
      return;
    }
  };

  useEffect(() => {
    handleCalculation();
  }, [SelectedCar, BookingDays, CouponValue]);

  const success = (pos) => {
    Geocode.fromLatLng(pos.coords.latitude, pos.coords.longitude).then(
      (response) => {
        if (changeState === true) {
          if (
            PickupCors?.address === SelectedCar[0].address ||
            PickupCors?.address === ""
          ) {
            setPickupCors({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              address: response.results[0].formatted_address,
            });
            setPickupPlace(response.results[0].formatted_address);
            let local = {
              ...localValue,
              PickupCors: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                address: response.results[0].formatted_address,
              },
            };
            localStorage.setItem("searchCriteria", JSON.stringify(local));
          } else {
            setPickupCors(localValue?.PickupCors);
            setPickupPlace(localValue?.PickupCors?.address);
            // let local = {
            //   ...localValue,
            //   PickupCors: {
            //     lat: SelectedCar[0].latitude,
            //     lng: SelectedCar[0].longitude,
            //     address: SelectedCar[0].address,
            //   },
            // };
            // localStorage.setItem("searchCriteria", JSON.stringify(local));
          }
        }
      }
    );
  };
  const error = (err) => {
    setPickupCors(filterCarElements.PickupCors);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "denied") {
            alert("Please allow location access.");
            window.location.href = "app-settings:location";
          } else {
            navigator.geolocation.getCurrentPosition(success, error);
          }
        });
    } else {
      alert("Geolocation is not supported in your browser.");
    }
  };

  useEffect(() => {
    if (changeState) {
      getCurrentLocation();
    }
    setPickupPlace(filterCarElements.PickupPlace);
    setDropPlace(filterCarElements.DropPlace);
    setPickupDate(filterCarElements.PickupDate);
    setDropoffDate(filterCarElements.DropoffDate);
    setDropCors(filterCarElements.DropCors);
    setIsDifferentDropoffPlace(filterCarElements.DifferentDropoffLocation);

    const diffInMs =
      new Date(filterCarElements.DropoffDate) -
      new Date(filterCarElements.PickupDate);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const days = Math.floor(diffInDays);
    setBookingDays(days < diffInDays ? days + 1 : days);
  }, [filterCarElements, changeState]);

  const settings = {
    infinite: true,
    speed: 600,
    dots: true,
    arrows: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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

  const showLModal = ({ loginModalVisible }) => {
    setIsModalLVisible(loginModalVisible);
  };

  const showModal = ({ signupModalVisible }) => {
    setIsModalVisible(signupModalVisible);
  };

  const changeLocation = (e) => {
    setchangeState(e.target.value);
  };

  useEffect(() => {
    if (changeState === false && SelectedCar && SelectedCar.length > 0) {
      if (
        localValue !== null &&
        localValue !== undefined &&
        Object.keys(localValue)?.length > 0
      ) {
        setPickupCors({
          lat: SelectedCar[0].latitude,
          lng: SelectedCar[0].longitude,
          address: SelectedCar[0].address,
        });
        setPickupPlace(localValue?.PickupPlace);
        setDropCors(localValue?.DropCors);
        let local = {
          ...localValue,
          PickupCors: {
            lat: SelectedCar[0].latitude,
            lng: SelectedCar[0].longitude,
            address: SelectedCar[0].address,
          },
        };
        localStorage.setItem("searchCriteria", JSON.stringify(local));
      } else {
        setPickupCors({
          lat: SelectedCar[0].latitude,
          lng: SelectedCar[0].longitude,
          address: SelectedCar[0].address,
        });
        setPickupPlace(SelectedCar[0].pickup);
        setDropCors({
          lat: SelectedCar[0].latitude,
          lng: SelectedCar[0].longitude,
          address: SelectedCar[0].address,
        });
        if (localValue) {
          let local = {
            ...localValue,
            PickupCors: {
              lat: SelectedCar[0].latitude,
              lng: SelectedCar[0].longitude,
              address: SelectedCar[0].address,
            },
            PickupPlace: SelectedCar[0].pickup,
          };
          localStorage.setItem("searchCriteria", JSON.stringify(local));
        }
      }
    }
  }, [changeState, SelectedCar]);

  useEffect(() => {
    // if (!changeState) {
    //   return Modal.info({
    //     icon: <ExclamationCircleOutlined />,
    //     title: "Information",
    //     content: (
    //       <span>
    //         {"If you select no, you should pick up the car from the office"}
    //       </span>
    //     ),
    //     onOk() {},
    //   });
    // }
  }, [changeState]);

  const Curencyval = (curencyval) => {
    console.log('currency val ---', curencyval, SubTotal, VatAmount);
    return (
      // SelectedCar[0].symbol ? ( `SAR ${curencyval.toFixed(SelectedCar[0].decimal)}`):(`${curencyval.toFixed(SelectedCar[0].decimal)} SAR`)
      SelectedCar[0].symbol
        ? `${getLocaleMessages(preferredCurrency)} ${curencyval * parseFloat(currencyConversion).toFixed(2)}`
        : curencyval !== undefined && curencyval.toString()?.includes(".")
        ? `${parseFloat(parseFloat(curencyval) * parseFloat(currencyConversion)).toFixed(2)} ${getLocaleMessages(preferredCurrency)}`
        : `${curencyval * parseFloat(currencyConversion).toFixed(2)} ${getLocaleMessages(preferredCurrency)}`
    );
  };

  const Decimalval = (decimalval) => {
    if (SelectedCar !== undefined)
      return decimalval.toFixed(SelectedCar[0].decimal);
  };

  // const fOk = () => {
  //   setIsForgotVisible(false);
  // };

  // const resendOTP = () => {
  //   message.success('OTP Resent successfully.');
  // };

  // const onFinish = (values) => {
  //   if (values.usertypeid == 3) {
  //     dispatch({
  //       type: authactions.CREATE_AUTHENTICATE_USER,
  //       payload: values,
  //       callBackAction: () => {
  //         showLModal({ loginModalVisible: true });
  //       },
  //     });
  //   } else {
  //     dispatch({
  //       type: authactions.CREATE_AUTHENTICATE_VENDOR,
  //       payload: values,
  //       callBackAction: () => {
  //         showLModal({ loginModalVisible: true });
  //       },
  //     });
  //   }
  // };

  // const onFinishForgot = (values) => {
  //   dispatch({
  //     type: authactions.SEND_PASSWORD_RESET_LINK,
  //     payload: values,
  //     callBackAction: () => {
  //       LoginForgot({
  //         login: true,
  //         forgot: false,
  //       });
  //     },
  //   });
  // };

  // const onFinishOTP = () => {
  //   if (OTPdata.length === 4) {
  //     dispatch({
  //       type: authactions.VERIFY_OTP,
  //       payload: {
  //         otp: OTPdata,
  //         email: isemail,
  //       },
  //       callBackAction: () => {
  //         SetIsOtpVisible(false);
  //         setOTPdata('');
  //         showLModal({ loginModalVisible: true });
  //       },
  //     });
  //   } else {
  //     message.error('please enter valid OTP');
  //   }
  // };

  // const otpOk = () => {
  //   Modal.confirm({
  //     title: 'Warning',
  //     icon: <ExclamationCircleOutlined />,
  //     content: 'Are you sure to close this modal and the otp modal never open',
  //     okText: 'ok',
  //     cancelText: 'cancel',
  //     maskClosable: true,
  //     mask: true,
  //     onOk: () => {
  //       dispatch({
  //         type: authactions.VERIFY_OTP_SUCCESS,
  //       });
  //     },
  //   });
  // };

  // const onChangeOTP = (value) => {
  //   setOTPdata(value);
  // };

  // const LoginSignup = ({ login, signup }) => {
  //   if (login) {
  //     setIsModalVisible(signup);
  //     setIsModalLVisible(login);
  //   } else if (signup) {
  //     setIsModalLVisible(login);
  //     setIsModalVisible(signup);
  //   }
  // };

  // const onFinishLogin = (values) => {
  //   dispatch({
  //     type: authactions.AUTHENTICATE_USER,
  //     payload: values,
  //     callBackAction: () => {
  //       showLModal({ loginModalVisible: false });
  //     },
  //   });
  // };

  // const LoginForgot = ({ login, forgot }) => {
  //   if (forgot) {
  //     setIsModalLVisible(login);
  //     setIsForgotVisible(forgot);
  //   } else if (login) {
  //     setIsForgotVisible(forgot);
  //     setIsModalLVisible(login);
  //   }
  // };

  useEffect(() => {
    // setTimeout(() => {
    //   setShowPickupPlace(!ShowPickupPlace);
    // }, 100);
  }, []);

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
      {/* <SignupModal
          visible={isModalVisible}
          onCancel={() => showModal({ signupModalVisible: false })}
          onFinish={onFinish}
          LoginSignup={LoginSignup}
          loader={loader}
    />
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
            <h2> OTP Verification </h2>
            <p className="sub">
              Enter the OTP you received to <br /> {isemail}
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
                Verify
              </Button>
            </div>
            <p className="resend">
              <span onClick={resendOTP}> Resend OTP </span>
            </p>
          </div>
          <div className="modal-ui-right">
            <img
              src={require('./../../../assets/images/otp.png').default}
              alt="otp"
            />
          </div>
        </Modal>
      <SigninModal
        visible={isModalLVisible}
        onCancel={() => showLModal({ loginModalVisible: false })}
        onLoginForgot={LoginForgot}
        onFinish={onFinishLogin}
        LoginSignup={LoginSignup}
        loader={loader}
      /> */}

      <SearchModal
        title={getLocaleMessages("Select the pickup location")}
        visible={isSideForm}
        onOk={handleFormOk}
        onCancel={handleFormCancel}
        footer={false}
        width="100%"
      />

      {ShowPickupPlace && (
        <ChangePlaces
          title={getLocaleMessages("Choose your pickup places")}
          visible={ShowPickupPlace}
          onOk={() => setShowPickupPlace(false)}
          onCancel={() => setShowPickupPlace(false)}
          placetype={Type}
          footer={false}
          width="100%"
          livelocation={PickupCors}
          setPickupLocation={setPickupCors}
          setchangeState={setchangeState}
          setVisible={setShowPickupPlace}
          setPickupPlaceLocation={setPickupPlace}
        />
      )}
      <Layout className={"on-boarding"}>
        <Header />
        <Content className="content_mt">
          <section className="car-listing">
            <div className="container">
              <Row gutter={30}>
                <Col span={17}>
                  <div className="box-image-coursel">
                    {(galleryImages.length > 0 && !loading) ? (
                      <ImageGallery
                        autoPlay={true}
                        showPlayButton={false}
                        items={galleryImages}
                        thumbnailClass={thumbnailStyles}
                        showBullets={true} 
                        onImageLoad={handleImageLoad}
                      />
                    ) : null}
                  </div>

                  {/* <div className="cover_image">
                    <img
                      alt="example"
                      src={`https://api.drivelounge.com/${CoverImage}`}
                    />
                  </div> */}

                  {/* <Carousel {...settings}> */}
                  {/* <div className="thumnail__image">
                    {carInterriorImagesList.map((item) => (
                      <div className="single_image" key={item.id}>
                        <img
                          alt="example"
                          onClick={() =>
                            setCoverImage(item.carinterriorimagename)
                          }
                          src={`https://api.drivelounge.com/${item.carinterriorimagename}`}
                        />
                      </div>
                    ))}
                  </div> */}
                  {/* </Carousel> */}
                  <div className="detail-description">
                    <Title level={3}>
                      {SelectedCar !== undefined && SelectedCar[0].brandname}
                    </Title>
                    <Paragraph className="price">
                      <span>
                        {`${getLocaleMessages(preferredCurrency)} ${
                          SelectedCar !== undefined &&
                          SelectedCar[0].carpriceperday * parseFloat(currencyConversion).toFixed(2)
                        }`}
                      </span>
                      &nbsp; {getLocaleMessages("for 1 Day's")}
                    </Paragraph>
                    {/* <Paragraph>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et.Excepteur
                      sint occaecat cupidatat
                    </Paragraph> */}
                  </div>
                  {SelectedCar && SelectedCar[0].isspecificlocation && (
                    <div className="detail-description">
                      {" "}
                      <div>
                        <Paragraph>
                          {getLocaleMessages(
                            "Do you want to pick your car at a specific location?"
                          )}
                          <span style={{ marginLeft: "20px" }}>
                            <Radio.Group
                              onChange={changeLocation}
                              value={changeState}
                            >
                              <Radio value={true}>
                                {getLocaleMessages("Yes")}
                              </Radio>
                              <Radio value={false}>
                                {getLocaleMessages("No")}
                              </Radio>
                            </Radio.Group>{" "}
                          </span>
                        </Paragraph>
                      </div>
                      <div>
                        {" "}
                        <Paragraph>
                          {getLocaleMessages(
                            "Note If you select no, you should pick up the car from the agency address"
                          )}
                        </Paragraph>
                      </div>
                    </div>
                  )}

                  {/* <Collapse accordion>
                    <Panel header={`Pickup address`} key="1"> */}
                  {changeState && (
                    <div className="receiving_location">
                      <Paragraph>
                        {getLocaleMessages("Receiving location")} :
                        <span>
                          {/* {PickupCors !== undefined
                            ? changeState
                              ? PickupPlace
                              : PickupCors.address
                            : PickupPlace} */}
                          {PickupPlace}
                        </span>
                      </Paragraph>
                      <Button
                        type="primary"
                        onClick={() => {
                          setType(1);
                          setShowPickupPlace(true);
                          setTimeout(() => {
                            setType(1);
                            setShowPickupPlace(false);
                          }, 100);
                          setTimeout(() => {
                            setType(1);
                            setShowPickupPlace(true);
                          }, 300);
                        }}
                      >
                        {getLocaleMessages("Select Location")}
                      </Button>
                    </div>
                  )}
                  {/* </Panel>                           
                  </Collapse>       */}

                  {/* <Collapse accordion>
                    <Panel header={`Dropoff address`} key="1">                       */}
                  {/* {IsDifferentDropoffPlace &&  <div className="detail-description">
                       
                        <Paragraph className="price">
                          <span>
                          Drop-off Location :  {DropPlace !== undefined && DropPlace}
                          </span>
                        </Paragraph>
                        <Button type="primary" onClick={()=>{
                          setType(2);
                          setShowPickupPlace(!ShowPickupPlace);
                        }}>View map</Button>   
                      </div>   
                    }                  */}
                  {/* </Panel>                           
                  </Collapse>       */}

                  <div className="car-info">
                    <Title level={3} className="he-1">
                      {getLocaleMessages("Features")}
                    </Title>
                    <Row gutter={20}>
                      <Col span={12}>
                        <div className="fullSpecification">
                          <div className="box">
                            <div>
                              <img
                                src={
                                  require("../../../assets/images/full-Coverage.png")
                                    .default
                                }
                                alt="Car"
                              />
                            </div>
                            <span>
                              {SelectedCar !== undefined
                                ? getLocaleMessages(SelectedCar[0].insurance)
                                : ""}
                            </span>
                          </div>
                          <div className="box">
                            <div>
                              <img
                                src={
                                  require("../../../assets/images/Automatic-gear.png")
                                    .default
                                }
                                alt="Car"
                              />
                            </div>
                            <span>
                              {SelectedCar !== undefined
                                ? getLocaleMessages(SelectedCar[0].transmission)
                                : ""}
                            </span>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="fullSpecification">
                          <div className="box">
                            <div>
                              <img
                                src={
                                  require("../../../assets/images/UnLimited.png")
                                    .default
                                }
                                alt="Car"
                              />
                            </div>
                            <span>
                              {SelectedCar !== undefined
                                ? getLocaleMessages(SelectedCar[0].speed)
                                : ""}{" "}
                              {SelectedCar !== undefined &&
                                SelectedCar[0].carspeedlimit > 0 &&
                                `(${SelectedCar[0].carspeedlimit})`}
                            </span>
                          </div>
                          <div className="box">
                            <div>
                              <img
                                src={
                                  require("../../../assets/images/5-Persons.png")
                                    .default
                                }
                                alt="Car"
                              />
                            </div>
                            <span>
                              {" "}
                              {SelectedCar !== undefined
                                ? getLocaleMessages(SelectedCar[0].cartype)
                                : ""}{" "}
                            </span>
                          </div>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div className="fullSpecification">
                          <div className="box">
                            <div>
                              <img
                                src={
                                  require("../../../assets/images/mode-car.png")
                                    .default
                                }
                                alt="Car"
                              />
                            </div>
                            <span style={{ color: "#188942" }}>
                              {SelectedCar !== undefined
                                ? getLocaleMessages('No cancellation fee if cancelled at least 24 hours before the scheduled time')
                                : ""}
                            </span>
                          </div>
                        </div>
                      </Col>

                      <div style={{ marginLeft: 10, marginTop: 20 }}>
                        {" "}
                        <Paragraph><b>{`${getLocaleMessages("Note Text")}`}:</b>{getLocaleMessages("Note")}</Paragraph>
                      </div>
                    </Row>
                  </div>
                  {/* <div className="included-price">
                    <Title level={3} className="he-1">
                      Included in the price
                    </Title>
                    <Paragraph>
                      This amount will be used for the following purposes( if
                      applicable) and it should be paid for the agency before
                      you get your rental car to avoid any cancellation
                    </Paragraph>
                  </div> */}
                </Col>
                <Col span={7}>
                  <StickyBox offsetTop={95}>
                    <div className="box-information-sidebar">
                      <Title level={4}>
                        {" "}
                        {getLocaleMessages("Agency Information")}{" "}
                      </Title>
                      <div className="box-information-agencyinfo">
                        {SelectedCar !== undefined && (
                          <img
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            width={50}
                            src={`https://api.drivelounge.com/${SelectedCar[0].agencyurl}`}
                          />
                        )}
                        <p>
                          {SelectedCar !== undefined && SelectedCar[0].agent
                            ? SelectedCar[0].agent
                            : "Drive Lounge"}
                        </p>
                      </div>
                      <Title level={4}>
                        {" "}
                        {getLocaleMessages("Delivery Timing")}{" "}
                      </Title>
                      <div className="box-information-agencyinfo">
                        <p>
                          {SelectedCar !== undefined && SelectedCar[0].openinghours
                            ? handleHourConverstion(SelectedCar[0].openinghours)
                            : "10 AM"}
                        </p>
                         To
                        <p>
                          {SelectedCar !== undefined && SelectedCar[0].closinghours
                            ? handleHourConverstion(SelectedCar[0].closinghours)
                            : "5 PM"}
                        </p>
                      </div>
                    </div>

                    <div className="box-information-sidebar">
                      <Title level={4}>
                        {" "}
                        {getLocaleMessages("Booking Information")}{" "}
                      </Title>
                      <div className="bx_info_values">
                        <label>{getLocaleMessages("Pickup city")}</label>
                        {/* <p>{PickupPlace !== undefined && PickupPlace}</p> */}
                        <p>
                          {localValue?.PickupPlace !== undefined &&
                          localValue?.PickupPlace !== null
                            ? localValue?.PickupPlace
                            : ""}
                        </p>
                      </div>
                      <div className="bx_info_values">
                        <label>{getLocaleMessages("Pickup Date & Time")}</label>
                        <p>
                          {PickupDate &&
                            PickupDate !== undefined &&
                            moment(PickupDate).format("DD/MM/YYYY hh:mm A")}
                        </p>
                      </div>

                      {/* <Paragraph>Drop-off Location:</Paragraph> */}
                      {/* <Paragraph>{DropCors !== undefined ? DropCors.address : (PickupCors !== undefined ? PickupCors.address : PickupPlace)}</Paragraph> */}
                      {IsDifferentDropoffPlace && (
                        <div className="bx_info_values">
                          <label>Dropoff City</label>
                          <p>{DropPlace !== undefined && DropPlace}</p>
                        </div>
                      )}
                      <div className="bx_info_values">
                        <label>
                          {getLocaleMessages("Dropoff Date & Time")}
                        </label>
                        <p>
                          {DropoffDate &&
                            DropoffDate !== undefined &&
                            moment(DropoffDate).format("DD/MM/YYYY hh:mm A")}
                        </p>
                      </div>
                      <div className="bx_info_values_btn">
                        <Button onClick={handleFormOk}>
                          {getLocaleMessages("Change")}
                        </Button>
                      </div>
                    </div>

                    {/* <Button
                      type="primary"
                      className="bookNow_btn"
                      onClick={handleReservation}
                    >
                      Book Now
                    </Button> */}

                    <div className="total-rental-day">
                      {/* <Title level={4}> Total Rental Days </Title>
                    <InputNumber
                      max={100}
                      value={BookingDays}
                      onChange={handleBookingDays}
                    /> */}
                      <Paragraph className="tot-days">
                        {getLocaleMessages("Total Rental Days")}
                        (
                        {localLang === "ar"
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
                      <Paragraph className="split">
                        {`+ ${getLocaleMessages("VAT")} ${
                          SelectedCar !== undefined && SelectedCar[0].vat
                        }%`}
                        <span>
                          {" "}
                          {SelectedCar !== undefined &&
                            Curencyval(VatAmount)}
                        </span>
                      </Paragraph>

                      {CouponValue > 0 && (
                        <Paragraph className="split">
                          {`- Coupon Value `}
                          <span>
                            {/*SelectedCar !== undefined && (SelectedCar[0].symbol ? (`SAR ${CouponValue.toFixed(SelectedCar[0].decimal)}`) : (`${CouponValue.toFixed(SelectedCar[0].decimal)} SAR`))*/}
                            {SelectedCar !== undefined &&
                              Curencyval(CouponValue)}
                          </span>
                        </Paragraph>
                      )}

                      <Paragraph className="split total">
                        {getLocaleMessages("Total Amount")}
                        <span>
                          {SelectedCar !== undefined &&
                            Curencyval(TotalPrice)}
                        </span>
                      </Paragraph>
                      <Paragraph className="split">
                        <Button
                          type="primary"
                          className="checkout-btn"
                          onClick={handleReservation}
                        >
                          {getLocaleMessages("Booking Confirmation")}
                        </Button>
                      </Paragraph>

                      {(filterCarElements.WithDriver || (SelectedCar !== undefined && SelectedCar[0].driver == "With Chauffeur")) && (
                        <>
                          <Paragraph className="split">
                            <b>{`${getLocaleMessages("Chauffeur Charge")}`}</b>
                            <span>
                              {" "}
                              {SelectedCar !== undefined &&
                                Curencyval(DriverCharge)}
                            </span>
                          </Paragraph>
                          <span><b>{`${getLocaleMessages("Note Text")}`}:</b>{`[${getLocaleMessages("Note Driver")}]`}</span>
                        </>
                      )}
                      {SelectedCar !== undefined &&
                        SelectedCar[0].deposite > 0 && (
                          <Paragraph className="split">
                            {getLocaleMessages("Deposit")}
                            <span>
                              {/*SelectedCar !== undefined && (SelectedCar[0].symbol ? (`SAR ${SelectedCar !== undefined && SelectedCar[0].deposite.toFixed(SelectedCar[0].decimal)}`) : (`${SelectedCar !== undefined && SelectedCar[0].deposite.toFixed(SelectedCar[0].decimal)} SAR`))*/}
                              {SelectedCar !== undefined &&
                                Curencyval(Decimalval(SelectedCar[0].deposite))}
                            </span>
                          </Paragraph>
                        )}
                      <span><b>{`${getLocaleMessages("Note Text")}`}:</b>{`[${getLocaleMessages("Note Deposit")}]`}</span>
                    </div>
                  </StickyBox>

                  {/* <div className="do-you-have">
                    <Title level={4}> Do You Have Your Coupon Code </Title>
                    <Search
                      allowClear
                      enterButton="Apply"
                      size="large"
                      onSearch={handleApplyCouponCode}
                    />
                  </div> */}

                  {/* <Title level={4}> Total Rental Days </Title>
                    <InputNumber
                      type="number"
                      max={100}
                      value={BookingDays}
                      onChange={handleBookingDays}
                    />
                    <Paragraph className="tot-days">
                      Total Rental Days({BookingDays} x{' '}
                      {SelectedCar !== undefined &&
                        SelectedCar[0].carpriceperday}
                      )
                    </Paragraph>
                    <Paragraph className="split">
                      Price
                      <span>
                        {`SAR ${
                          SelectedCar !== undefined &&
                          SelectedCar[0].carpriceperday * BookingDays
                        }`}
                      </span>
                    </Paragraph>
                    <Paragraph className="split">
                      {`+ VAT ${
                        SelectedCar !== undefined && SelectedCar[0].vat
                      }%`}
                      <span> {`SAR ${VatAmount}`} </span>
                    </Paragraph>
                    {CouponValue > 0 && (
                      <Paragraph className="split">
                        {`- Coupon Value `}
                        <span> {`SAR ${CouponValue}`} </span>
                      </Paragraph>
                    )}
                    <Paragraph className="split">
                      Deposit
                      <span>
                        {`SAR ${
                          SelectedCar !== undefined && SelectedCar[0].deposite
                        }`}
                      </span>
                    </Paragraph>
                    <Paragraph className="split total">
                      Total Amount <span> {`SAR ${TotalPrice}`} </span>
                    </Paragraph> */}
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
