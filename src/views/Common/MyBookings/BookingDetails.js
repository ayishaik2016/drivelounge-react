import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Input,
  Button,
  Divider,
  Form,
  Card,
  Typography,
  DatePicker,
  message,
  Collapse,
  Upload,
  Alert,
  Space,
  Modal,
} from "antd";
import {
  EditOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import actions from "../../../redux/user/actions";
import { getLocalDataType, getLocaleMessages } from "redux/helper";
import {
  format,
  endOfDay,
  differenceInCalendarDays,
  addDays,
  compareAsc,
  parseISO,
} from "date-fns";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import ReactToPrint from "react-to-print";
import _ from "lodash";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { uploadRequest } from "../../../helpers/axiosClient";
import settingsAction from "../../../redux/admin/booking/actions";
import ProfileHead from "../MyProfile/ProfileHeader";
import { Link } from "react-router-dom";
import "../../../assets/css/userStyle.css";
import "./../../../assets/css/adminStyle.css";
import { history, store } from "redux/store";
import LoadingOverlay from "react-loading-overlay";
import Map from "./../../Admin/Agency/MapDisplay";
import CancelReason from "./CancelReason";
import EditRequest from "./EditRequest";
import ComponentToPrint from "./bookingPreview";
import { Formatcurrency } from "helpers/constant";
const { Title } = Typography;
const { Panel } = Collapse;
const { Content } = Layout;

const BookingDetails = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  let componentRef = useRef();
  const [PickupDate, setPickupDate] = useState();
  const [PickupTime, setPickupTime] = useState();
  const [DropoffDate, setDropoffDate] = useState();
  const [DropoffTime, setDropoffTime] = useState();
  const [SubTotal, setSubTotal] = useState(0);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [VatAmount, setVatAmount] = useState(0);
  const [VatPercent, setVatPercent] = useState(0);
  const [CouponValue, setCouponValue] = useState(0);
  const [BookingDays, setBookingDays] = useState(0);
  const [DriverCharge, setDriverCharge] = useState(0);
  const {
    SelectedBookingInfo,
    PickupList,
    DropoffList,
    isLoading,
  } = useSelector((state) => state.CarReservation);
  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )
  const [PickupImageList, setPickupImageList] = useState([]);
  const [DropImageList, setDropImageList] = useState([]);
  const [TripStarted, setTripStarted] = useState(false);
  const [TripEnded, setTripEnded] = useState(false);
  const [ImageURL, setImageURL] = useState("");
  const { profile } = useSelector((state) => state.CarReservation);
  const [ShowCancelDialog, setShowCancelDialog] = useState(false);
  const [SelectedBooking, setSelectedBooking] = useState({});
  const [IsEnabled, setIsEnabled] = useState(true);
  const [DateEditable, setDateEditable] = useState(true);

  const checkCancel = ({ bookingdate, bookingstatus }) => {
    let addedDate = addDays(parseISO(bookingdate), 2);
    if (compareAsc(addedDate, new Date()) > 0 && bookingstatus !== 0)
      return true;
    else return false;
  };

  const handleBookingStatus = (status, bookingid, userid) => {
    const id = SelectedBookingInfo.id || props.location.state;
    if (status == 0) {
      return Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        title: getLocaleMessages("Bookings"),
        content: (
          <span>
            {getLocaleMessages("Are you sure to cancel this booking")}?
          </span>
        ),
        okText: getLocaleMessages("Yes"),
        cancelText: getLocaleMessages("No"),
        onOk() {
          if (getLocalDataType("login_type") === "agency") {
            setShowCancelDialog(!ShowCancelDialog);
            setSelectedBooking({
              id: id || bookingid,
              userid: userid,
              status: status,
              userid,
            });
          } else {
            dispatch({
              type: settingsAction.CHANGE_BOOKING_STATUS,
              payload: { id: id || bookingid, status: status },
            });
            return;
          }
        },
        onCancel() {
          return;
        },
      });
    }
    if (id > 0) {
      dispatch({
        type: settingsAction.CHANGE_BOOKING_STATUS,
        payload: { id: id, status: status },
      });
    }
  };

  const handleCancel = (id, userid) => {
    return Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: getLocaleMessages("Bookings"),
      content: (
        <span>{getLocaleMessages("Are you sure to cancel this booking")}?</span>
      ),
      okText: getLocaleMessages("Yes"),
      cancelText: getLocaleMessages("No"),
      onOk() {
        setShowCancelDialog(!ShowCancelDialog);
        setSelectedBooking({ id: id, userid: userid, userid });
        // dispatch({
        //     type: settingsAction.CHANGE_BOOKING_STATUS,
        //     payload: {id: id, status: status},
        // });
        return;
      },
      onCancel() {
        return;
      },
    });
  };

  const onPickupChange = ({ file }) => {
    if (file.status !== "uploading" && file.status !== "removed") {
      let form = new FormData();
      form.append("file", file.originFileObj);
      uploadRequest("admin/upload", form)
        .then((res) => {
          let image = res.data;
          let imageName = image[0].data.filePath.split("__uploads/")[1];
          setPickupImageList((PickupImageList) => [
            ...PickupImageList,
            {
              imageurl: imageName,
              name: imageName,
              status: "done",
              url: `https://api.drivelounge.com/${imageName}`,
            },
          ]);
        })
        .catch((err) => {
          message.error(
            getLocaleMessages("Please upload valid file type like jpg, png")
          );
        });
    }
    if (file.status == "removed") {
      // var filter = PickupImageList;
      // const index = filter.findIndex((e) => e.name === file.name);
      // filter.splice(index, 1);
      // setPickupImageList(filter);
    }
  };

  const onDropoffChange = ({ file }) => {
    if (file.status !== "uploading" && file.status !== "removed") {
      let form = new FormData();
      form.append("file", file.originFileObj);
      uploadRequest("admin/upload", form)
        .then((res) => {
          let image = res.data;
          let imageName = image[0].data.filePath.split("__uploads/")[1];
          setDropImageList((DropImageList) => [
            ...DropImageList,
            {
              imageurl: imageName,
              name: imageName,
              status: "done",
              url: `https://api.drivelounge.com/${imageName}`,
            },
          ]);
        })
        .catch((err) => {
          message.error(
            getLocaleMessages("Please upload valid file type like jpg, png")
          );
        });
    }
    if (file.status == "removed") {
    }
  };

  const removeEndTripImage = (file) => {
    const filter = DropImageList?.filter((item) => item?.name !== file.name);
    if (filter?.length > 0) {
      setDropImageList(filter);
    } else {
      setDropImageList([]);
    }
    // var filter = DropImageList;
    // const index = filter.findIndex((e) => e.name == file.name);
    // filter.splice(index, 1);
    // setDropImageList(filter);
  };

  const removeStartTripImage = (file) => {
    const filter = PickupImageList?.filter((item) => item?.name !== file.name);
    if (filter?.length > 0) {
      setPickupImageList(filter);
    } else {
      setPickupImageList([]);
    }
    // var filter = PickupImageList;
    // const index = filter.findIndex((e) => e.name == file.name);
    // const filteredArray = filter.splice(index, 1);
    // setPickupImageList(filteredArray);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const uploadPikcupList = () => {
    Modal.confirm({
      title: getLocaleMessages("Warning"),
      icon: <ExclamationCircleOutlined />,
      content: getLocaleMessages(
        "Make sure all images are uploaded correctly, otherwise you cannot modify in future."
      ),
      okText: getLocaleMessages("Ok"),
      cancelText: getLocaleMessages("Cancel"),
      maskClosable: true,
      mask: true,
      onOk: () => {
        if (PickupImageList.length) {
          dispatch({
            type: actions.UPLOAD_PICKUP_IMAGES,
            payload: {
              id: SelectedBookingInfo.id,
              file: PickupImageList,
              carid: SelectedBookingInfo.carid,
            },
          });
        } else {
          message.error(getLocaleMessages("Please add some images"));
        }
      },
    });
  };

  const uploadDropoffList = () => {
    Modal.confirm({
      title: getLocaleMessages("Warning"),
      icon: <ExclamationCircleOutlined />,
      content: getLocaleMessages(
        "Make sure all images are uploaded correctly, otherwise you cannot modify in future."
      ),
      okText: getLocaleMessages("Ok"),
      cancelText: getLocaleMessages("Cancel"),
      maskClosable: true,
      mask: true,
      onOk: () => {
        if (DropImageList.length) {
          dispatch({
            type: actions.UPLOAD_DROPOFF_IMAGES,
            payload: {
              id: SelectedBookingInfo.id,
              file: DropImageList,
              carid: SelectedBookingInfo.carid,
            },
          });
        } else {
          message.error(getLocaleMessages("Please add some images"));
        }
      },
    });
  };

  const onFinishChange = () => {
    const {
      pickupdate,
      pickuptime,
      dropoffdate,
      dropofftime,
    } = usedForm.getFieldValue();
    let _pickupdate = new Date();
    let _dropoffdate = new Date();
    if (pickupdate !== undefined && pickuptime !== undefined) {
      const date = format(new Date(pickupdate), "yyyy-MM-dd");
      const time = format(new Date(pickuptime), "hh:mm a");
      _pickupdate = new Date(date + " " + time);
      setPickupDate(_pickupdate);
    }

    if (dropoffdate !== undefined && dropofftime !== undefined) {
      const date = format(new Date(dropoffdate), "yyyy-MM-dd");
      const time = format(new Date(dropofftime), "hh:mm a");
      _dropoffdate = new Date(date + " " + time);
      setDropoffDate(_dropoffdate);
    }
    setBookingDays(CalculateBookingDays(_pickupdate, _dropoffdate));
  };

  useEffect(() => {
    handleCalculation();
  }, [BookingDays]);

  const handleUpdateRequest = () => {
    return Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: getLocaleMessages("Bookings"),
      content: (
        <span>
          {getLocaleMessages("Are you sure you want to update this booking")}?
        </span>
      ),
      okText: getLocaleMessages("Yes"),
      cancelText: getLocaleMessages("No"),
      onOk() {
        onFinishDetails();
        return;
      },
      onCancel() {
        return;
      },
    });
  };

  const { pickuptime, dropofftime } = usedForm.getFieldValue();

  const onFinishDetails = async () => {
    let _pickupdate = new Date();
    let _dropoffdate = new Date();
    const date = format(
      new Date(usedForm.getFieldValue("pickupdate")),
      "yyyy-MM-dd"
    );
    const time = format(new Date(pickuptime), "hh:mm a");
    _pickupdate = new Date(date + " " + time);
    const dropDate = format(
      new Date(usedForm.getFieldValue("dropoffdate")),
      "yyyy-MM-dd"
    );
    const dropTime = format(new Date(dropofftime), "hh:mm a");
    _dropoffdate = new Date(dropDate + " " + dropTime);

    let data = {
      id: SelectedBookingInfo.id,
      pickupdate: _pickupdate,
      dropoffdate: _dropoffdate,
      totalrentaldays: BookingDays,
      driveramount: DriverCharge,
      vatamount: VatAmount,
      subtotal: SubTotal,
      totalcost: TotalPrice,
      agentid: SelectedBookingInfo.agentid,
    };
    console.log("DATA", data);
    dispatch({
      type: actions.UPDATE_BOOKING_INFORMATION,
      payload: data,
    });
  };
  const disabledDate = (current) => {
    let date = new Date(current);
    return new Date() > endOfDay(date);
  };

  const CalculateBookingDays = (d1, d2) => {
    usedForm.setFieldsValue({
      totalrentaldays: differenceInCalendarDays(new Date(d2), new Date(d1)),
    });
    return differenceInCalendarDays(new Date(d2), new Date(d1));
  };

  const genExtraStart = () =>
    SelectedBookingInfo.bookingstatus !== 0 &&
    SelectedBookingInfo.bookingstatus !== 3 && (
      <Button
        onClick={(event) => {
          setTripStarted(true);
          dispatch({
            type: actions.SET_BOOKING_START,
            payload: { id: SelectedBookingInfo.id },
          });
          event.stopPropagation();
        }}
      >
        {getLocaleMessages("Start")}
      </Button>
    );
  const genExtraStop = () =>
    SelectedBookingInfo.bookingstatus !== 0 &&
    SelectedBookingInfo.bookingstatus !== 3 && (
      <Button
        onClick={(event) => {
          setTripEnded(true);
          dispatch({
            type: actions.SET_BOOKING_STOP,
            payload: { id: SelectedBookingInfo.id },
          });
          event.stopPropagation();
        }}
      >
        {getLocaleMessages("Stop")}
      </Button>
    );

  const handleCalculation = async () => {
    let subtotal =
      (SelectedBookingInfo !== undefined
        ? SelectedBookingInfo.priceperday
        : 0) * BookingDays;
    setSubTotal(subtotal);
    let drivercharge =
      (SelectedBookingInfo !== undefined && SelectedBookingInfo.withdriver !== 0
        ? SelectedBookingInfo.drivercharge
        : 0) * BookingDays;
    setDriverCharge(drivercharge);
    let vat = (subtotal + drivercharge) * (VatPercent / 100);
    setVatAmount(vat);
    let total = subtotal + drivercharge + vat - CouponValue;
    setTotalPrice(total);
    usedForm.setFieldsValue({ totalcost: Formatcurrency(total) });
  };

  const [showTripStatus, setshowTripStatus] = useState(false);

  useEffect(() => {
    if (SelectedBookingInfo.id !== undefined) {
      usedForm.setFieldsValue({
        ...SelectedBookingInfo,
        priceperday: Formatcurrency(SelectedBookingInfo.priceperday * parseFloat(currencyConversion).toFixed(2)),
        vatamount: Formatcurrency(SelectedBookingInfo.vatamount * parseFloat(currencyConversion).toFixed(2)),
        totalcost: Formatcurrency(SelectedBookingInfo.totalcost * parseFloat(currencyConversion).toFixed(2)),
        deposit: Formatcurrency(SelectedBookingInfo.deposit * parseFloat(currencyConversion).toFixed(2)),
        couponvalue: Formatcurrency(SelectedBookingInfo.couponvalue * parseFloat(currencyConversion).toFixed(2)),
        bookingcode:
          SelectedBookingInfo.bookingcode.length > 8
            ? SelectedBookingInfo.bookingcode.substr(
                SelectedBookingInfo.bookingcode.length - 8
              )
            : SelectedBookingInfo.bookingcode,
        bookingdate: format(
          new Date(SelectedBookingInfo.bookingdate),
          "dd/MM/yyyy hh:mm a"
        ),
        cancelledon: format(
          new Date(SelectedBookingInfo.cancelledon),
          "dd/MM/yyyy hh:mm a"
        ),
        pickupdate: moment(
          new Date(SelectedBookingInfo.pickupdate),
          "DD-MM-YYYY"
        ),
        pickuptime: moment(new Date(SelectedBookingInfo.pickupdate), "HH:mm a"),
        dropoffdate: moment(
          new Date(SelectedBookingInfo.dropoffdate),
          "DD-MM-YYYY"
        ),
        dropofftime: moment(
          new Date(SelectedBookingInfo.dropoffdate),
          "HH:mm a"
        ),
      });
      setVatPercent(SelectedBookingInfo.vatpercent);
      setCouponValue(SelectedBookingInfo.couponvalue);
      setBookingDays(SelectedBookingInfo.totalrentaldays);
      setTripStarted(SelectedBookingInfo.tripstart);
      setTripEnded(SelectedBookingInfo.tripend);
      setImageURL(SelectedBookingInfo.imageurl);
      setPickupImageList(PickupList);
      //setDropImageList(DropoffList);
      if (
        getLocalDataType() !== "user" &&
        (SelectedBookingInfo.bookingstatus == 1 ||
          SelectedBookingInfo.bookingstatus == 3)
      ) {
        setshowTripStatus(true);
      }
    }
  }, [SelectedBookingInfo]);

  useEffect(() => {
    dispatch({
      type: actions.GET_BOOKING_INFOBYID,
      payload: props.location.state,
    });
  }, []);

  const [ShowRequestDialog, setShowRequestDialog] = useState(false);

  const handleEditClick = (type) => {
    if (type == 3) {
      return Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        title: getLocaleMessages("Bookings"),
        content: (
          <span>
            {getLocaleMessages("Do you want to make a change in your booking")}?
          </span>
        ),
        okText: getLocaleMessages("Yes"),
        cancelText: getLocaleMessages("No"),
        onOk() {
          setShowRequestDialog(!ShowRequestDialog);
          setSelectedBooking({
            id: SelectedBookingInfo.id,
            userid: SelectedBookingInfo.userid,
          });
        },
        onCancel() {
          return;
        },
      });
    }
    if (type == 1) setIsEnabled(!IsEnabled);
  };

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const RenderPrintComponent = () => {
    usedForm.setFieldsValue({
      driveramount: DriverCharge
    });
    return (
      <ComponentToPrint
        ref={componentRef}
        usedForm={usedForm}
        onFinishDetails={onFinishDetails}
        IsEnabled={IsEnabled}
        SelectedBookingInfo={SelectedBookingInfo}
        onFinishChange={onFinishChange}
        handleBookingStatus={handleBookingStatus}
        BookingDays={BookingDays}
        showTripStatus={showTripStatus}
        TripStarted={TripStarted}
        genExtraStart={genExtraStart}
        PickupImageList={PickupImageList}
        onPickupChange={onPickupChange}
        onPreview={onPreview}
        removeStartTripImage={removeStartTripImage}
        PickupList={PickupList}
        uploadPikcupList={uploadPikcupList}
        TripEnded={TripEnded}
        genExtraStop={genExtraStop}
        DropImageList={DropImageList}
        onDropoffChange={onDropoffChange}
        removeEndTripImage={removeEndTripImage}
        DropoffList={DropoffList}
        uploadDropoffList={uploadDropoffList}
        ImageURL={ImageURL}
        checkCancel={checkCancel}
        handleCancel={handleCancel}
        handleEditClick={handleEditClick}
        handleUpdateRequest={handleUpdateRequest}
        tabLocation={props.location.tabkey}
        reactToPrintContent={reactToPrintContent}
        DateEditable={DateEditable}
        setDateEditable={setDateEditable}
      />
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    RenderPrintComponent();
  }, [PickupImageList]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <Layout
        className={
          getLocalDataType() == "user"
            ? "booking-detail-page"
            : "booking-detail-page-admin"
        }
      >
        {getLocalDataType() == "user" && (
          <>
            <Header />{" "}
            <Content className="content_mt">
              <ProfileHead {...profile} selectionKey="booking" />{" "}
            </Content>
          </>
        )}

        <CancelReason
          visible={ShowCancelDialog}
          setSelectedBooking={setSelectedBooking}
          SelectedBooking={SelectedBooking}
          setShowCancelDialog={setShowCancelDialog}
        ></CancelReason>

        <EditRequest
          visible={ShowRequestDialog}
          setSelectedBooking={setSelectedBooking}
          SelectedBooking={SelectedBooking}
          setShowRequestDialog={setShowRequestDialog}
        ></EditRequest>

        {RenderPrintComponent()}
        {getLocalDataType() == "user" && <Footer />}
      </Layout>
    </LoadingOverlay>
  );
};

export default BookingDetails;
