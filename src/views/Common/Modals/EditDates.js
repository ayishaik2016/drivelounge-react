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
  Space,
  message,
} from "antd";
import TimePicker from "rc-time-picker";
import actions from "./../../../redux/Listing/actions";
import {
  format,
  endOfDay,
  differenceInCalendarDays,
  compareDesc,
} from "date-fns";
import moment from "moment";
import "rc-time-picker/assets/index.css";
import "./../../../assets/css/userStyle.css";
import { getLocaleMessages } from "redux/helper";
import styled from "styled-components";

const EdidDatesModal = (props) => {
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
  const [PickupDate, setPickupDate] = useState();
  const [DropoffDate, setDropoffDate] = useState();

  const { visible, onCancel, onOk } = props;

  const disabledDate = (current) => {
    let date = new Date(current);
    return new Date() > endOfDay(date);
  };

  const disabledDropDate = (current) => {
    const PickupDate = usedForm.getFieldValue("PickupDate");
    let date = new Date(PickupDate);
    const days = differenceInCalendarDays(date, new Date());
    return current && current < moment(date).endOf("day");
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

  const handleChangeLocation = (values) => {
    let _pickupdate = new Date();
    let _dropoffdate = new Date();
    let changePickupdate = new Date();
    let changeDropoffdate = new Date();

    if (values.PickupDate !== undefined && values.PickupTime) {
      const date = format(new Date(values.PickupDate), "yyyy-MM-dd");
      const time = format(new Date(values.PickupTime), "hh:mm a");
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
      PickupDate: _pickupdate,
      DropoffDate: _dropoffdate,
    };
    let localValue = JSON.parse(localStorage.getItem("searchCriteria")) || [];
    if (localValue) {
      localValue["PickupPlace"] =
        localValue.PickupPlace !== undefined ? localValue.PickupPlace : "";
      localValue["PickupCors"] =
        localValue.PickupCors !== undefined ? localValue.PickupCors : "";
      localValue["PickupDate"] = _pickupdate;
      localValue["DropPlace"] =
        localValue.DropPlace !== undefined ? localValue.DropPlace : "";
      localValue["DropCors"] =
        localValue.DropCors !== undefined ? localValue.DropCors : "";
      localValue["DropoffDate"] = _dropoffdate;
      localValue["DifferentDropoffLocation"] =
        localValue.IsDropoffSelected !== undefined
          ? localValue.IsDropoffSelected
          : "";
      localValue["WithDriver"] =
        localValue.WithDriver !== undefined ? localValue.WithDriver : "";
      localStorage.removeItem("searchCriteria");
      localStorage.setItem("searchCriteria", JSON.stringify(localValue));
    } else {
      localStorage.removeItem("searchCriteria");
      localStorage.setItem("searchCriteria", JSON.stringify(data));
    }
    dispatch({
      type: actions.SET_DATE_CHANGES,
      ...data,
    });
    onOk(!visible);
  };

  useEffect(() => {
    setPickupDate(filterCarElements.PickupDate);
    setDropoffDate(filterCarElements.DropoffDate);
  }, [filterCarElements]);
  return (
    <>
      <Modal
        title={getLocaleMessages("Plan for some other dates")}
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
          onFinish={handleChangeLocation}
          initialValues={{
            PickupLocation: filterCarElements.PickupPlace,
            DropoffLocation: filterCarElements.DropPlace,
            PickupPlace: filterCarElements.PickupPlace,
            DropPlace: filterCarElements.DropPlace,
            WithDriver: filterCarElements.WithDriver,
            DifferentDropoffLocation:
              filterCarElements.DifferentDropoffLocation,
            PickupDate:
              filterCarElements.PickupDate &&
              moment(filterCarElements.PickupDate, "hh:mm A"),
            PickupTime:
              filterCarElements.PickupDate &&
              moment(filterCarElements.PickupDate, "hh:mm A"),
            DropoffDate:
              filterCarElements.DropoffDate &&
              moment(filterCarElements.DropoffDate, "YYYY-MM-DD"),
            DropoffTime:
              filterCarElements.DropoffDate &&
              moment(filterCarElements.DropoffDate, "hh:mm A"),
          }}
        >
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

          <Button type="primary" htmlType="submit" className="save-btn">
            {getLocaleMessages("Change")}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EdidDatesModal;
