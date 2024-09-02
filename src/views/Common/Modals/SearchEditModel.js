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
  Select,
  message,
} from "antd";
import TimePicker from "rc-time-picker";
import actions from "./../../../redux/Listing/actions";
import cityactions from "./../../../redux/common/actions";
import filteractions from "./../../../redux/filters/actions";
import {
  EditOutlined,
  GoogleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  format,
  endOfDay,
  differenceInCalendarDays,
  compareDesc,
} from "date-fns";
import moment from "moment";
import "rc-time-picker/assets/index.css";
import "./../../../assets/css/userStyle.css";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { getLocaleMessages } from "redux/helper";
import styled from "styled-components";
const { Title, Paragraph } = Typography;
const { Option } = Select;

const SearchEditModal = (props) => {
  var localValue = JSON.parse(localStorage.getItem("searchCriteria")) || [];
  const { visible, onCancel, onOk, setDrop } = props;
  const localLang = localStorage.getItem("language");
  const StyledTimePicker = styled(TimePicker)`
    & .rc-time-picker-panel-select-option-selected {
      background-color: #edeffe;
      font-weight: normal;
    }

    & .rc-time-picker-clear {
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
      font-family: "Consolas", sans-serif;
      font-size: 18px;

      ::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  `;
  const [usedForm] = Form.useForm();
  const dispatch = useDispatch();
  const { filterCarElements } = useSelector((state) => state.Listing);
  const { cityList, brandList } = useSelector((state) => state.Common);
  const [PickupDate, setPickupDate] = useState();
  const [DropoffDate, setDropoffDate] = useState();
  const [PickupPlace, setPickupPlace] = useState("");
  const [PickupPlaceId, setPickupPlaceId] = useState("");
  const [DropPlace, setDropPlace] = useState("");
  const [DropPlaceId, setDropPlaceId] = useState("");
  const [IsDropoffSelected, setIsDropoffSelected] = useState(false);
  const [ChangePickupPlace, setChangePickupPlace] = useState("");
  const [ChangeDropPlace, setChangeDropPlace] = useState("");

  const [ShowMap, setShowMap] = useState();
  const [placetype, setplacetype] = useState(1);
  const [PickupCors, setPickupCors] = useState(
    localValue?.PickupCors !== null
      ? localValue?.PickupCors
      : {
          lat: 24.6877,
          lng: 46.7219,
          address: "",
        }
  );
  const [DropCors, setDropCors] = useState(
    localValue?.DropCors !== null
      ? localValue?.DropCors
      : {
          lat: 24.6877,
          lng: 46.7219,
          address: "",
        }
  );
  const [WithDriver, setWithDriver] = useState("");
  const disabledDate = (current) => {
    let date = new Date(current);
    return new Date() > endOfDay(date);
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
    let _pickupdate = new Date();
    let _dropoffdate = new Date();
    let changePickupdate = new Date();
    let changeDropoffdate = new Date();

    if (values.PickupDate !== undefined && values.PickupTime) {
      const date = format(new Date(values.PickupDate), "yyyy-MM-dd");
      const time = format(new Date(values.PickupTime), "hh:mm:ss");
      _pickupdate = getCombinedDateObject(values.PickupDate, values.PickupTime);
      changePickupdate = getCombinedDateObject(
        values.PickupDate,
        values.PickupTime
      );
    }

    if (values.DropoffDate !== undefined && values.DropoffTime) {
      const date = format(new Date(values.DropoffDate), "yyyy-MM-dd");
      const time = format(new Date(values.DropoffTime), "hh:mm a");
      _dropoffdate = getCombinedDateObject(
        values.DropoffDate,
        values.DropoffTime
      );
      changeDropoffdate = getCombinedDateObject(
        values.DropoffDate,
        values.DropoffTime
      );
    }
    if (compareDesc(changePickupdate, changeDropoffdate) <= 0) {
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
    if (compareDesc(changePickupdate, new Date()) >= 0) {
      message.error(
        getLocaleMessages("Please select the time greater than current time")
      );
      return;
    }
    let data = {
      PickupPlace: PickupPlace,
      PickupPlaceId: PickupPlaceId,
      PickupDate: _pickupdate,
      DropPlace: DropPlace,
      DropPlaceId: DropPlaceId,
      DropoffDate: _dropoffdate,
      WithDriver: WithDriver,
      PickupCors: PickupCors,
      DropCors: DropCors,
      DifferentDropoffLocation: IsDropoffSelected,
    };
    let localValue = JSON.parse(localStorage.getItem("searchCriteria")) || {};
    if (Object.keys(localValue).length > 0) {
      localValue["PickupPlace"] = PickupPlace;
      localValue["PickupPlaceId"] = PickupPlaceId;
      localValue["PickupCors"] = PickupCors;
      localValue["PickupDate"] = _pickupdate;
      localValue["DropPlace"] = DropPlace;
      localValue["DropPlaceId"] = DropPlaceId;
      localValue["DropCors"] = DropCors;
      localValue["DropoffDate"] = _dropoffdate;
      localValue["DifferentDropoffLocation"] = IsDropoffSelected;
      localValue["WithDriver"] = WithDriver;
      localStorage.removeItem("searchCriteria");
      localStorage.setItem("searchCriteria", JSON.stringify(localValue));
    } else {
      localStorage.setItem("searchCriteria", JSON.stringify(data));
    }
    dispatch({
      type: actions.SET_SEARCH_CAR_DEFAULT,
      ...data,
    });

    onOk(!visible);
  };

  const handleDropoff = (e) => {
    setIsDropoffSelected(e.target.checked);
  };
  const handleWithDriver = (e) => {
    // if(ShowAlert == true){
    //   message.warn("Please accept or decline before proceed");
    //   return;
    // }
    setWithDriver(e.target.checked);
    // if(e.target.checked == true) {
    //   setCheckSelected(2);
    // }else{
    //   setCheckSelected(0);
    // }
  };

  const setCorsDetails = (address, type) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        let data = { lat: latLng.lat, lng: latLng.lng, address: address };
        type == 1 ? setPickupCors(data) : setDropCors(data);
      })
      .catch((error) => console.error("Error", error));
  };

  const handlePickCityChange = (e, v) => {
    if (v !== undefined) {
      if (v.children !== undefined) {
        setPickupPlace(v.children);
        setPickupPlaceId(v.value);
        setPickupCors(setCorsDetails(v.children, 1));
      }
    }
  };

  const disabledDropDate = (current) => {
    const PickupDate = usedForm.getFieldValue("PickupDate");
    let date = new Date(PickupDate);
    const days = differenceInCalendarDays(date, new Date());
    return current && current < moment(date).endOf("day");
  };

  const handleDropCityChange = (e, v) => {
    if (v !== undefined) {
      if (v.children !== undefined) {
        setDropPlace(v.children);
        setDrop(v.children);
        setDropPlaceId(v.value);
        setDropCors(setCorsDetails(v.children, 2));
      }
    }
  };
  // useEffect(() => {
  //   dispatch({
  //     type: filteractions.REMOVE_FILTER,
  //     payload: {name: 'pickup', value: PickupPlace}
  //   })
  //   if(PickupCors.address){
  //     dispatch({
  //       type: filteractions.ADD_FILTER,
  //       payload: {name: 'pickup', value: PickupCors.address}
  //     })
  //   }

  //   setPickupPlace(PickupCors.address)
  // }, [PickupPlace])

  //   useEffect(() => {
  //     setDropPlace(DropCors.address)
  //   }, [DropCors])

  useEffect(() => {
    setPickupPlace(localValue !== null ? localValue?.PickupPlace : "");
    setPickupDate(filterCarElements.PickupDate);
    setDropPlace(localValue !== null ? localValue?.DropPlace : "");
    setDropoffDate(filterCarElements.DropoffDate);
    setWithDriver(filterCarElements.WithDriver);
    setIsDropoffSelected(filterCarElements.DifferentDropoffLocation);
    setPickupPlaceId(filterCarElements.PickupPlaceId);
    setDropPlaceId(filterCarElements.DropPlaceId);
  }, [filterCarElements]);

  useEffect(() => {
    dispatch({
      type: cityactions.GET_CITY_LIST,
      payload: false,
    });
  }, []);

  return (
    <>
      <Modal
        title={getLocaleMessages("Change Booking Information")}
        visible={visible}
        onCancel={onCancel}
        centered
        className="modal_plan_some"
        footer={false}
        width={500}
        destroyOnClose
      >
        <Form
          form={usedForm}
          name="horizontal_login"
          layout="vertical"
          onFinish={onFinishSearch}
          initialValues={{
            PickupLocation: localValue !== null ? localValue?.PickupPlace : "",
            DropoffLocation: filterCarElements.DropPlace,
            PickupPlace: localValue !== null ? localValue?.PickupPlace : "",
            DropPlace: filterCarElements.DropPlace,
            WithDriver: filterCarElements.WithDriver,
            DifferentDropoffLocation:
              filterCarElements.DifferentDropoffLocation,
            PickupDate:
              filterCarElements.PickupDate &&
              !isNaN(Date.parse(filterCarElements.PickupDate))
                ? moment(filterCarElements.PickupDate)
                : moment(),
            PickupTime:
              filterCarElements.PickupDate &&
              !isNaN(Date.parse(filterCarElements.PickupDate))
                ? moment(filterCarElements.PickupDate, "hh:mm A")
                : moment(),
            DropoffDate:
              filterCarElements.DropoffDate &&
              !isNaN(Date.parse(filterCarElements.PickupDate))
                ? moment(filterCarElements.DropoffDate)
                : moment(),
            DropoffTime:
              filterCarElements.DropoffDate &&
              !isNaN(Date.parse(filterCarElements.PickupDate))
                ? moment(filterCarElements.DropoffDate, "hh:mm A")
                : moment(),
          }}
        >
          <Form.Item
            label={getLocaleMessages("Pickup city")}
            name="PickupLocation"
            rules={[
              {
                required: true,
                message: getLocaleMessages("Fields are required"),
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              autoComplete={"off"}
              placeholder={""}
              value={PickupPlaceId}
              dropdownStyle={{ minWidth: "200px" }}
              onChange={(value, option) => handlePickCityChange(value, option)}
            >
              {cityList &&
                cityList.map((value) => {
                  return (
                    value.showdashboard && (
                      <Option key={value.id} value={value.id}>
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

          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label={getLocaleMessages("Pickup Date")}
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
                  placeholder={getLocaleMessages("Pickup Date")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={getLocaleMessages("Pickup Time")}
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
                />
                {/* <TimePicker use12Hours value={SelectedPickupTime ?? undefined} onBlur={(time) => SetPickupTime(time)}  minuteStep={15} format="h:mm a"/> */}
              </Form.Item>
            </Col>
          </Row>

          {/* {IsDropoffSelected && ( */}
          {
            <Form.Item
              label={getLocaleMessages("Dropoff city")}
              name="DropoffLocation"
              rules={[
                {
                  required: true,
                  message: getLocaleMessages("Fields are required"),
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                defaultValue={DropPlace}
                autoComplete={"off"}
                placeholder={""}
                dropdownStyle={{ minWidth: "200px" }}
                onChange={(value, option) =>
                  handleDropCityChange(value, option)
                }
              >
                {cityList &&
                  cityList.map((value) => {
                    return (
                      value.showdashboard && (
                        <Option key={value.id} value={value.id}>
                          {value.cityname}
                        </Option>
                      )
                    );
                  })}
              </Select>
              {/* <AddressAutoComplete setLocation={setDropPlace} /> */}
            </Form.Item>
          }

          <Row gutter={30}>
            <Col span={12}>
              {" "}
              <Form.Item
                label={getLocaleMessages("Dropoff Date")}
                name={"DropoffDate"}
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Select drop off date"),
                  },
                ]}
              >
                <DatePicker
                  disabledDate={disabledDropDate}
                  format="DD-MM-YYYY"
                  inputReadOnly
                  placeholder={getLocaleMessages("Dropoff Date")}
                />
              </Form.Item>{" "}
            </Col>
            <Col span={12}>
              <Form.Item
                label={getLocaleMessages("Dropoff Time")}
                name={"DropoffTime"}
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Select drop off time"),
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
                {/* <TimePicker use12Hours value={SelectedDropoffTime ?? undefined} onSelect={(time) =>  SetDropoffTime(time)} minuteStep={15} format="h:mm a"/> */}
              </Form.Item>
            </Col>
          </Row>

          <div className="flex__plansame">
            <Form.Item name={"DifferentDropoffLocation"}>
              <Checkbox checked={IsDropoffSelected} onClick={handleDropoff}>
                {getLocaleMessages("Drop off at different city")}
              </Checkbox>
            </Form.Item>

            <Form.Item name={"WithDriver"}>
              <Checkbox checked={WithDriver} onClick={handleWithDriver}>
                {getLocaleMessages("Private Chauffeur")}
              </Checkbox>
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" className="save-btn">
            {getLocaleMessages("Change")}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default SearchEditModal;
