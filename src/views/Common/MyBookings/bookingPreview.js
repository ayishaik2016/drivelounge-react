import React, { useState, useEffect } from "react";
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
  Spin,
} from "antd";
import {
  EditOutlined,
  CloseOutlined,
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
import _, { isArray } from "lodash";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { uploadRequest } from "../../../helpers/axiosClient";
import settingsAction from "../../../redux/admin/booking/actions";
import ProfileHead from "../MyProfile/ProfileHeader";
import { Link } from "react-router-dom";
import "../../../assets/css/userStyle.css";
import Map from "./../../Admin/Agency/MapDisplay";

const { Title } = Typography;
const { Panel } = Collapse;
const { Content } = Layout;
const { TextArea } = Input;

const BookingPreview = React.forwardRef((props, ref) => {
  const {
    IsEnabled,
    usedForm,
    onFinishDetails,
    SelectedBookingInfo = {},
    onFinishChange,
    handleBookingStatus,
    BookingDays,
    showTripStatus,
    TripStarted,
    genExtraStart,
    onPickupChange,
    onPreview,
    removeStartTripImage,
    PickupImageList,
    PickupList,
    uploadPikcupList,
    TripEnded,
    genExtraStop,
    DropImageList,
    onDropoffChange,
    removeEndTripImage,
    DropoffList,
    uploadDropoffList,
    ImageURL,
    checkCancel,
    handleCancel,
    handleEditClick,
    handleUpdateRequest,
    tabLocation,
    reactToPrintContent,
    DateEditable,
    setDateEditable,
  } = props;

  const { preferredCurrency } = useSelector(state => state.Currency)

  const RenderMap = ({ lat, lng, address }) => {
    return (
      <Map
        center={{
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          address: address || "",
        }}
        height="250px"
        zoom={15}
      />
    );
  };

  const RenderUploadFiles = () => {
    return (
      <Upload
        listType="picture-card"
        fileList={PickupImageList}
        onChange={onPickupChange}
        onPreview={onPreview}
        onRemove={(e) => {
          if (
            SelectedBookingInfo.bookingstatus !== 0 &&
            PickupList.length <= 0
          ) {
            removeStartTripImage(e);
          }
        }}
      >
        {`+ ${getLocaleMessages("Upload")}`}
      </Upload>
    );
  };

  const disabledDate = (current) => {
    let date = new Date(current);
    return new Date() > endOfDay(date);
  };

  const disabledDropDate = (current) => {
    const PickupDate = usedForm.getFieldValue("pickupdate");
    let date = new Date(PickupDate);
    const days = differenceInCalendarDays(date, new Date());
    return current && current < moment(date).endOf("day");
  };

  useEffect(() => {
    <RenderUploadFiles />;
  }, [PickupImageList]);
  console.log("UsedForm", usedForm.getFieldsValue(), SelectedBookingInfo);
  return (
    <div
      ref={ref}
      className={
        getLocalDataType() == "user"
          ? "page-container bs"
          : "page-container admin_page_container"
      }
    >
      <Card className="main_card_border_removed">
        <Spin spinning={false} size="large">
          <Form
            form={usedForm}
            onFinish={onFinishDetails}
            layout="vertical"
            className="ant-advanced-search-form"
            onFieldsChange={onFinishChange}
          >
            <div className="flex_content_booking">
              <div></div>
              <div className="flex_content_booking_flex">
                <ReactToPrint
                  trigger={() => (
                    <Button icon={<PrinterOutlined />}>
                      {getLocaleMessages("Print")}{" "}
                    </Button>
                  )}
                  content={reactToPrintContent}
                />
                {getLocalDataType() == "admin" && (
                  <Button>
                    <Link
                      to={{
                        pathname:
                          getLocalDataType() === "admin"
                            ? `/admin/bookings`
                            : "/agency/bookings",
                      }}
                      className="backtoBook"
                    >
                      <ArrowLeftOutlined />{" "}
                      {getLocaleMessages("Back to Booking")}
                    </Link>
                  </Button>
                )}

                {getLocalDataType() == "user" && (
                  <Button>
                    <Link
                      to={{
                        pathname: `/booking`,
                        query: {
                          tabkey: tabLocation !== undefined && tabLocation,
                        },
                      }}
                      className="backtoBook"
                    >
                      <ArrowLeftOutlined />{" "}
                      {getLocaleMessages("Back to Booking")}
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <Card type="inner" title={getLocaleMessages("Booking Information")}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    name="bookingcode"
                    label={getLocaleMessages("Booking No")}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="bookingdate"
                    label={getLocaleMessages("Booking Date")}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("Pickup city")}
                    name="pickupplace"
                  >
                    <Input.TextArea rows={"3"} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dropoffplace"
                    label={getLocaleMessages("Dropoff city")}
                  >
                    <Input.TextArea rows={"3"} disabled />
                  </Form.Item>
                </Col>{" "}
                {SelectedBookingInfo.bookingstatus == 1 &&
                  //SelectedBookingInfo.bookingstatus == 2 && //client asked us to hide this button
                  SelectedBookingInfo.changerequeststatus && (
                    <>
                      <Col span={12}></Col>
                      <Col
                        span={12}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                        }}
                      >
                        <Button
                          onClick={() => {
                            if (DateEditable) {
                              setDateEditable(false);
                            } else {
                              usedForm.setFieldsValue({
                                pickupdate: moment(
                                  new Date(SelectedBookingInfo.pickupdate),
                                  "DD-MM-YYYY"
                                ),
                                dropoffdate: moment(
                                  new Date(SelectedBookingInfo.dropoffdate),
                                  "DD-MM-YYYY"
                                ),
                              });
                              setDateEditable(true);
                            }
                          }}
                        >
                          {DateEditable ? <EditOutlined /> : <CloseOutlined />}
                          {DateEditable
                            ? getLocaleMessages("Edit")
                            : getLocaleMessages("Cancel")}
                        </Button>
                      </Col>
                    </>
                  )}
                <Col span={12}>
                  <Form.Item
                    name="pickupdate"
                    label={getLocaleMessages("Pickup Date")}
                  >
                    <DatePicker
                      disabledDate={disabledDate}
                      disabled={DateEditable}
                      format="DD-MM-YYYY"
                      placeholder={getLocaleMessages("Pickup Date")}
                      onChange={(date) => {
                        usedForm.setFieldsValue({
                          pickupdate: moment(new Date(date), "DD-MM-YYYY"),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dropoffdate"
                    label={getLocaleMessages("Dropoff Date")}
                  >
                    <DatePicker
                      disabledDate={disabledDropDate}
                      disabled={DateEditable}
                      format="DD-MM-YYYY"
                      placeholder={getLocaleMessages("Dropoff Date")}
                      onChange={(date) => {
                        usedForm.setFieldsValue({
                          dropoffdate: moment(new Date(date), "DD-MM-YYYY"),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="pickuptime"
                    label={getLocaleMessages("Pickup Time")}
                  >
                    <TimePicker
                      showSecond={false}
                      minuteStep={15}
                      format="h:mm a"
                      use12Hours
                      disabled={IsEnabled}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dropofftime"
                    label={getLocaleMessages("Dropoff Time")}
                  >
                    <TimePicker
                      showSecond={false}
                      minuteStep={15}
                      format="h:mm a"
                      use12Hours
                      disabled={IsEnabled}
                    />
                  </Form.Item>
                </Col>
                {SelectedBookingInfo !== undefined &&
                  SelectedBookingInfo.showmap !== 0 && (
                    <Col span={24}>
                      <Form.Item
                        name="pickupaddress"
                        label={getLocaleMessages("Receiving Address")}
                      >
                        <Input.TextArea rows={"3"} disabled />
                      </Form.Item>
                      {SelectedBookingInfo?.showmap && (
                        <Col
                          style={{
                            marginTop: "-5px",
                            marginBottom: "25px",
                          }}
                          span={24}
                        >
                          <RenderMap
                            lat={SelectedBookingInfo?.pickuplat}
                            lng={SelectedBookingInfo?.pickuplang}
                            address={SelectedBookingInfo?.pickupaddress}
                          />
                        </Col>
                      )}
                    </Col>
                  )}
              </Row>
            </Card>
            <Card type="inner" title={getLocaleMessages("Payment Information")}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    name="priceperday"
                    label={getLocaleMessages("Price per day")+"("+ preferredCurrency +")"}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="totalrentaldays"
                    label={getLocaleMessages("Total Rental Days")}
                  >
                    <Input disabled value={BookingDays} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item name="vatamount" label={getLocaleMessages("VAT")+"("+ preferredCurrency +")"}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="totalcost"
                    label={getLocaleMessages("Total Cost")+"("+ preferredCurrency +")"}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    name="deposit"
                    label={getLocaleMessages(
                      "Deposit [ Not: Deposit amount not included in total amount ]"
                    )+"("+ preferredCurrency +")"}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="couponvalue"
                    label={getLocaleMessages("Coupon Value")+"("+ preferredCurrency +")"}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                {SelectedBookingInfo.withdriver !== 0 && (
                  <Col span={12}>
                    <Form.Item
                      name="driveramount"
                      label={getLocaleMessages("Driver Charges")+"("+ preferredCurrency +")"}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Card>
            {getLocalDataType() == "admin" && showTripStatus && (
              <Collapse accordion>
                <Panel
                  header={getLocaleMessages("Upload car image trip starts")}
                  key="1"
                  extra={
                    TripStarted
                      ? getLocaleMessages("Trip Started")
                      : genExtraStart()
                  }
                >
                  <div className={{ textAlign: "center" }}>
                    {SelectedBookingInfo.bookingstatus !== 0 &&
                    SelectedBookingInfo.bookingstatus !== 3 ? (
                      <RenderUploadFiles />
                    ) : (
                      <Upload
                        listType="picture-card"
                        fileList={PickupImageList}
                        onPreview={onPreview}
                      ></Upload>
                    )}
                  </div>
                  {SelectedBookingInfo.bookingstatus !== 0 &&
                    SelectedBookingInfo.bookingstatus !== 3 &&
                    PickupList.length <= 0 && (
                      <Button type="primary" onClick={uploadPikcupList}>
                        {getLocaleMessages("Update")}
                      </Button>
                    )}
                </Panel>
                <Panel
                  header={getLocaleMessages("Upload car image after trip")}
                  key="2"
                  extra={
                    TripEnded ? getLocaleMessages("Trip Ended") : genExtraStop()
                  }
                >
                  <div className={{ textAlign: "center" }}>
                    {SelectedBookingInfo.bookingstatus !== 0 &&
                    SelectedBookingInfo.bookingstatus !== 3 ? (
                      <Upload
                        listType="picture-card"
                        fileList={
                          DropImageList?.length !== undefined
                            ? DropImageList
                            : []
                        }
                        onChange={onDropoffChange}
                        onPreview={onPreview}
                        onRemove={(e) => {
                          if (
                            SelectedBookingInfo.bookingstatus !== 0 &&
                            DropoffList.length <= 0
                          ) {
                            removeEndTripImage(e);
                          }
                        }}
                      >
                        {`+ ${getLocaleMessages("Upload")}`}
                      </Upload>
                    ) : (
                      <Upload
                        listType="picture-card"
                        fileList={
                          DropImageList?.length !== undefined
                            ? DropImageList
                            : []
                        }
                        onPreview={onPreview}
                      ></Upload>
                    )}
                  </div>
                  {SelectedBookingInfo.bookingstatus !== 0 &&
                    SelectedBookingInfo.bookingstatus !== 3 &&
                    DropoffList.length <= 0 && (
                      <Button type="primary" onClick={uploadDropoffList}>
                        {getLocaleMessages("Update")}
                      </Button>
                    )}
                </Panel>
              </Collapse>
            )}

            <Card
              style={{ marginTop: 16 }}
              type="inner"
              title={getLocaleMessages("Car Information")}
            >
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    name="carno"
                    label={getLocaleMessages("Car Number")}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="carbrand" label={getLocaleMessages("Make")}>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("Car Year")}
                    name="caryear"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("Car Model")}
                    name="carmodel"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ textAlign: "center" }} gutter={20}>
                <Col style={{ textAlign: "center" }} span={24}>
                  <img
                    src={`https://api.drivelounge.com/${ImageURL}`}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  ></img>
                </Col>
              </Row>
            </Card>
            {getLocalDataType() !== "user" && (
              <Card
                style={{ marginTop: 16 }}
                type="inner"
                title={getLocaleMessages("Customer Information")}
              >
                <Row gutter={20}>
                  <Col span={12}>
                    <Form.Item
                      name="fullname"
                      label={getLocaleMessages("Name")}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="contactnumber"
                      label={getLocaleMessages("Contact Number")}
                    >
                      <Input disabled className="number_ltr" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={12}>
                    <Form.Item label={getLocaleMessages("Email")} name="email">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  {/* <Col span={12}>
                  <Form.Item
                    name="address"
                    label={getLocaleMessages("Address")}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col> */}
                </Row>
              </Card>
            )}
            {getLocalDataType() !== "agency" && (
              <Card
                style={{ marginTop: 16 }}
                type="inner"
                title={getLocaleMessages("Agency Information")}
              >
                <Row gutter={20}>
                  <Col span={12}>
                    <Form.Item
                      name="agencyname"
                      label={getLocaleMessages("Agent Name")}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="agencycontact"
                      label={getLocaleMessages("Contact Number")}
                    >
                      <Input disabled className="number_ltr" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      name="agencyaddress"
                      label={getLocaleMessages("Address")}
                    >
                      <Input.TextArea rows={3} disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col
                    style={{
                      marginTop: "-5px",
                      marginBottom: "25px",
                    }}
                    span={24}
                  >
                    <RenderMap
                      lat={SelectedBookingInfo?.agentlat}
                      lng={SelectedBookingInfo?.agentlang}
                      address={SelectedBookingInfo?.agentaddress}
                    />
                    {/* <Map
                      center={{
                        lat: parseFloat(SelectedBookingInfo.agentlat),
                        lng: parseFloat(SelectedBookingInfo.agentlang),
                        address: SelectedBookingInfo.agentaddress,
                      }}
                      height="250px"
                      zoom={15}
                    /> */}
                  </Col>
                </Row>
              </Card>
            )}
            {SelectedBookingInfo.bookingstatus == 0 && (
              <Card
                style={{ marginTop: 16 }}
                type="inner"
                title={getLocaleMessages("Cancellation Information")}
              >
                <Row
                  gutter={10}
                  style={{
                    marginRight: "0px",
                  }}
                >
                  <Row gutter={20}>
                    <Col span={10}>
                      <Form.Item
                        name="reason"
                        label={getLocaleMessages("Reason")}
                      >
                        <TextArea
                          style={{ border: "none" }}
                          rows={5}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        name="cancelledby"
                        label={getLocaleMessages("Cancelled By")}
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        name="cancelledon"
                        label={getLocaleMessages("Cancelled Date")}
                      >
                        <Input
                          disabled
                          style={{
                            fontWeight: "200px",
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Row>
              </Card>
            )}

            {SelectedBookingInfo.bookingstatus == 2 &&
              (getLocalDataType() == "admin" ||
                getLocalDataType() == "agency") && (
                <Row gutter={4}>
                  <Col span={24}>
                    <Form.Item>
                      <div className="button-center">
                        <Button
                          type="primary"
                          className="save-btn"
                          onClick={() =>
                            handleBookingStatus(
                              1,
                              SelectedBookingInfo.id,
                              SelectedBookingInfo.userid
                            )
                          }
                        >
                          {getLocaleMessages("Confirm")}
                        </Button>
                        <Button
                          type="primary"
                          className="save-btn"
                          onClick={() =>
                            handleBookingStatus(
                              0,
                              SelectedBookingInfo.id,
                              SelectedBookingInfo.userid
                            )
                          }
                          style={{ background: "#bd3d3d" }}
                        >
                          {getLocaleMessages("Cancel Booking")}
                        </Button>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              )}
            {console.log("SelectedBookingInfo", SelectedBookingInfo)}

            <Row gutter={4} style={{ justifyContent: "center" }}>
              {SelectedBookingInfo.bookingstatus == 1 &&
                (getLocalDataType() == "admin" ||
                  getLocalDataType() == "agency") && (
                  <Col span={6}>
                    <Form.Item>
                      <div className="button-center">
                        <div style={{ marginRight: "10px" }}>
                          <Button
                            type="primary"
                            style={{ width: "fixed-content" }}
                            onClick={() =>
                              handleBookingStatus(
                                3,
                                SelectedBookingInfo.id,
                                SelectedBookingInfo.userid
                              )
                            }
                          >
                            {getLocaleMessages("Completed")}
                          </Button>
                        </div>
                        <div style={{ marginRight: "10px" }}>
                          <Button
                            type="primary"
                            style={{
                              width: "fixed-content",
                              background: "#bd3d3d",
                            }}
                            onClick={() =>
                              handleBookingStatus(
                                0,
                                SelectedBookingInfo.id,
                                SelectedBookingInfo.userid
                              )
                            }
                          >
                            {getLocaleMessages("Cancel Booking")}
                          </Button>
                        </div>
                        {SelectedBookingInfo.bookingstatus == 1 &&
                          SelectedBookingInfo.changerequeststatus &&
                          getLocalDataType() == "admin" && (
                            <div style={{ marginRight: "10px" }}>
                              <Button
                                type="primary"
                                style={{ width: "fixed-content" }}
                                onClick={handleUpdateRequest}
                              >
                                {getLocaleMessages("Update Request")}
                              </Button>
                            </div>
                          )}
                        {/* {(getLocalDataType() == "user" ||
                        (getLocalDataType() == "admin" &&
                          !SelectedBookingInfo.changerequeststatus)) &&
                        ((SelectedBookingInfo !== undefined &&
                          SelectedBookingInfo.bookingstatus == 1) ||
                          SelectedBookingInfo.bookingstatus == 2) && (
                          <div style={{ marginRight: "10px" }}>
                            <Button
                              type="primary"
                              style={{ width: "fixed-content" }}
                              onClick={() => handleEditClick(1)}
                            >
                              {"Edit"}
                            </Button>
                          </div>
                        )} */}
                        {getLocalDataType() == "user" &&
                          checkCancel(SelectedBookingInfo) &&
                          (SelectedBookingInfo.bookingstatus == 1 ||
                            SelectedBookingInfo.bookingstatus == 2) && (
                            <div style={{ marginRight: "10px" }}>
                              <Button
                                type="primary"
                                style={{
                                  width: "fixed-content",
                                  background: "#bd3d3d",
                                }}
                                onClick={() =>
                                  handleCancel(
                                    SelectedBookingInfo.id,
                                    SelectedBookingInfo.userid
                                  )
                                }
                              >
                                {getLocaleMessages("Cancel Booking")}
                              </Button>
                            </div>
                          )}
                      </div>
                    </Form.Item>
                  </Col>
                )}
            </Row>

            {/* <div className="mybook-detail">
              {getLocalDataType() == "admin" &&
                ((SelectedBookingInfo !== undefined &&
                  SelectedBookingInfo.bookingstatus == 1) ||
                  SelectedBookingInfo.bookingstatus == 2) && (
                  <div className="gold">
                    <Button
                      type="primary"
                      className=""
                      onClick={() => handleEditClick(1)}
                    >
                      {"Edit"}
                    </Button>{" "}
                  </div>
                )}
            </div> */}
            {SelectedBookingInfo.bookingstatus == 3 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "auto",
                  width: "fit-content",
                  alignItems: "center",
                  padding: "10px",
                  textAlign: "center",
                  fontSize: "18px",
                  border: "2px solid green",
                  color: "green",
                }}
              >
                {getLocaleMessages("Completed")}
              </div>
            )}
          </Form>
        </Spin>
      </Card>{" "}
    </div>
  );
});

export default BookingPreview;
