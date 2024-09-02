import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Modal,
  Input,
  Form,
  Button,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Typography,
} from "antd";
import TimePicker from "rc-time-picker";
import actions from "./../../../redux/Listing/actions";
import filteractions from "./../../../redux/filters/actions";
import { EditOutlined, GoogleOutlined } from "@ant-design/icons";
import { format, endOfDay } from "date-fns";
import moment from "moment";
import "rc-time-picker/assets/index.css";
import "./../../../assets/css/userStyle.css";
import GoogleMaps from "./../../Admin/Agency/Map";
// import AutoComplete from './../../Admin/Agency/AutoCompleteAddress';
import AutoComplete from "./../../Admin/Agency/address1";
import { getLocaleMessages } from "redux/helper";

const { Title, Paragraph } = Typography;
const ForgotModal = (props) => {
  const [usedForm] = Form.useForm();
  const dispatch = useDispatch();
  const { filterCarElements } = useSelector((state) => state.Listing);
  const [PickupDate, setPickupDate] = useState();
  const [DropoffDate, setDropoffDate] = useState();
  const [PickupPlace, setPickupPlace] = useState("");
  const [DropPlace, setDropPlace] = useState("");
  const [IsDropoffSelected, setIsDropoffSelected] = useState(false);
  const [ChangePickupPlace, setChangePickupPlace] = useState("");
  const [ChangeDropPlace, setChangeDropPlace] = useState("");
  const { visible, onCancel, onOk } = props;
  const [ShowMap, setShowMap] = useState();
  const [placetype, setplacetype] = useState(1);
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
  const [WithDriver, setWithDriver] = useState("");
  const disabledDate = (current) => {
    let date = new Date(current);
    return new Date() > endOfDay(date);
  };

  const handleChangeLocation = (values) => {
    let _pickupdate = new Date();
    let _dropoffdate = new Date();
    if (values.PickupDate !== undefined && values.PickupTime) {
      const date = format(new Date(values.PickupDate), "yyyy-MM-dd");
      const time = format(new Date(values.PickupTime), "hh:mm a");
      _pickupdate = new Date(date + " " + time);
    }

    if (values.DropoffDate !== undefined && values.DropoffTime) {
      const date = format(new Date(values.DropoffDate), "yyyy-MM-dd");
      const time = format(new Date(values.DropoffTime), "hh:mm a");
      _dropoffdate = new Date(date + " " + time);
    }

    let data = {
      PickupPlace: PickupPlace,
      PickupDate: _pickupdate,
      DropPlace: DropPlace,
      DropoffDate: _dropoffdate,
      WithDriver: WithDriver,
      PickupCors: PickupCors,
      DropCors: DropCors,
      DifferentDropoffLocation: IsDropoffSelected,
    };
    let localValue = JSON.parse(localStorage.getItem("searchCriteria")) || [];
    if (localValue.length) {
      localValue["PickupPlace"] = PickupPlace;
      localValue["PickupCors"] = PickupCors;
      localValue["PickupDate"] = _pickupdate;
      localValue["DropPlace"] = DropPlace;
      localValue["DropCors"] = DropCors;
      localValue["DropoffDate"] = _dropoffdate;
      localValue["DifferentDropoffLocation"] = IsDropoffSelected;
      localStorage.removeItem("searchCriteria");
      localStorage.setItem("searchCriteria", JSON.stringify(localValue));
    } else {
      localStorage.removeItem("searchCriteria");
      localStorage.setItem("searchCriteria", JSON.stringify(data));
    }
    dispatch({
      type: actions.SET_CHANGE_SEARCH_CAR_DETAIL,
      ...data,
    });
    onOk(!visible);
  };
  useEffect(() => {
    setDropPlace(DropCors.address);
  }, [DropCors]);

  useEffect(() => {
    setPickupPlace(filterCarElements.PickupPlace);
    setPickupDate(filterCarElements.PickupDate);
    setDropPlace(filterCarElements.DropPlace);
    setDropoffDate(filterCarElements.DropoffDate);
  }, [filterCarElements]);

  return (
    <>
      <Modal
        title={getLocaleMessages("Change Booking Information")}
        visible={visible}
        onCancel={onCancel}
        centered
        footer={false}
        className="card-body"
        width="100%"
        destroyOnClose
      >
        <Row gutter={20}>
          <Col span={5} className="modal-ui-2">
            <div className="container">
              <Form
                layout="vertical"
                form={usedForm}
                initialValues={{
                  PickupDate:
                    filterCarElements.PickupDate &&
                    moment(filterCarElements.PickupDate, "DD-MM-YYYY"),
                  PickupTime:
                    filterCarElements.PickupDate &&
                    moment(filterCarElements.PickupDate, "HH:mm A"),
                  DropoffDate:
                    filterCarElements.DropoffDate &&
                    moment(filterCarElements.DropoffDate, "DD-MM-YYYY"),
                  DropoffTime:
                    filterCarElements.DropoffDate &&
                    moment(filterCarElements.DropoffDate, "HH:mm A"),
                }}
                onFinish={handleChangeLocation}
              >
                <Title level={5}>{PickupPlace}</Title>
                <Form.Item
                  label={getLocaleMessages("Pick-up Address")}
                  name="pickuplocation"
                >
                  <AutoComplete
                    address={PickupCors.address}
                    cors={(e) => setPickupCors(e)}
                    height="0px"
                  />
                  <EditOutlined
                    onClick={() => {
                      setplacetype(1);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={getLocaleMessages("Pickup Date")}
                  name="PickupDate"
                >
                  <DatePicker
                    disabledDate={disabledDate}
                    format="DD-MM-YYYY"
                    placeholder={getLocaleMessages("Pickup Date")}
                  />
                </Form.Item>
                <Form.Item
                  label={getLocaleMessages("Pickup Time")}
                  name="PickupTime"
                >
                  <TimePicker
                    showSecond={false}
                    minuteStep={15}
                    format="h:mm a"
                    use12Hours
                    inputReadOnly
                  />
                </Form.Item>
                <Title level={5}>{DropPlace ? DropPlace : PickupPlace}</Title>
                <Form.Item
                  label={getLocaleMessages("Drop-off Address")}
                  name="droplocation"
                >
                  <AutoComplete
                    address={DropCors.address}
                    cors={(e) => setDropCors(e)}
                    height="0px"
                  />
                  <EditOutlined
                    onClick={() => {
                      setplacetype(2);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={getLocaleMessages("Dropoff Date")}
                  name="DropoffDate"
                >
                  <DatePicker
                    disabledDate={disabledDate}
                    format="DD-MM-YYYY"
                    placeholder={getLocaleMessages("Dropoff Date")}
                  />
                </Form.Item>
                <Form.Item
                  label={getLocaleMessages("Dropoff Time")}
                  name="DropoffTime"
                >
                  <TimePicker
                    showSecond={false}
                    minuteStep={15}
                    format="h:mm a"
                    use12Hours
                    inputReadOnly
                  />
                </Form.Item>
                <Form.Item name={"DifferentDropoffLocation"}>
                  {/* <Checkbox
              checked={IsDropoffSelected}
              onClick={(e)=>setIsDropoffSelected(e.target.checked)}
            >
              Drop-off at Different Location?
            </Checkbox> */}
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  {getLocaleMessages("Change")}
                </Button>
              </Form>
            </div>
          </Col>
          <Col span={17}>
            <GoogleMaps
              // google={this.props.google}
              setAddress={placetype == 1 ? setPickupCors : setDropCors}
              setPlaces={placetype == 1 ? setPickupPlace : setDropPlace}
              center={placetype == 1 ? PickupCors : DropCors}
              height="900px"
              zoom={15}
            />
            {/* <GoogleMaps ShowMap={ShowMap} setShowMap={setShowMap} Address={placetype == 1 ? PickupPlace : DropPlace} setAddress={placetype == 1 ? setPickupPlace : setDropPlace} destroyOnClose/> */}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ForgotModal;
