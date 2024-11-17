import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history, store } from "redux/store";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Card,
  Select,
  DatePicker,
  Form,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Formatcurrency, formProps } from "../../../helpers/constant";
import settingsAction from "../../../redux/admin/booking/actions";
import agencyAction from "../../../redux/admin/agency/actions";
import "./../../../assets/css/adminStyle.css";
import { format } from "date-fns";
import { getLocalDataType, getLocaleMessages } from "redux/helper";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import moment from "moment";
import MyCsvLink from "../../../components/shared/ExportCsv";
import { includes } from "lodash";
LoadingOverlay.propTypes = undefined;

// import ComponentToPrint from "./../../Common/MyBookings/BookingDetails";

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { Title } = Typography;

const BookingManagement = () => {
  const dispatch = useDispatch();
  let componentRef = useRef();
  const [selectedBookingId, setSelectedBookingId] = useState(0);
  const [usedForm] = Form.useForm();
  const { bookings, isLoading } = useSelector((state) => state.BookingInfo);
  const { agency_data } = useSelector((state) => state.Agency);
  const [showFilter, setshowFilter] = useState(false);
  const [FilteredBooking, setFilteredBooking] = useState();
  const [ExportData, setExportData] = useState([]);
  const [showAgencyFilter, setShowAgencyFilter] = useState(false);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Booking No"),
      dataIndex: "bookingcode",
      key: "bookingcode",
      // render: (bookingno) => (
      //   <span>
      //     {bookingno.length > 8
      //       ? bookingno.substr(bookingno.length - 8)
      //       : bookingno}
      //   </span>
      // ),
    },
    {
      title: getLocaleMessages("Booking Date"),
      dataIndex: "bookingdate",
      key: "bookingdate",
      render: (bookingdate) => (
        <span>
          {bookingdate !== undefined &&
            format(new Date(bookingdate), "dd/MM/yyyy hh:mm a")}
        </span>
      ),
    },
    {
      title: getLocaleMessages("Pickup Date"),
      dataIndex: "pickupdate",
      key: "pickupdate",
      render: (pickupdate) => (
        <span>
          {pickupdate !== undefined &&
            format(new Date(pickupdate), "dd/MM/yyyy hh:mm a")}
        </span>
      ),
    },
    {
      title: getLocaleMessages("Dropoff Date"),
      dataIndex: "dropoffdate",
      key: "dropoffdate",
      render: (dropoffdate) => (
        <span>
          {dropoffdate !== undefined &&
            format(new Date(dropoffdate), "dd/MM/yyyy hh:mm a")}
        </span>
      ),
    },

    {
      title: getLocaleMessages("Total rental days"),
      dataIndex: "totalrentaldays",
      key: "totalrentaldays",
    },
    {
      title: getLocaleMessages("Price per day"),
      dataIndex: "priceperday",
      key: "priceperday",
      render: (priceperday) => <span>{Formatcurrency(priceperday)}</span>,
    },
    {
      title: getLocaleMessages("Coupon Amount"),
      dataIndex: "couponvalue",
      key: "couponvalue",
      render: (couponvalue) => <span>{Formatcurrency(couponvalue)}</span>,
    },
    {
      title: getLocaleMessages("Total Amount"),
      dataIndex: "totalcost",
      key: "totalcost",
      render: (totalcost) => <span>{Formatcurrency(totalcost)}</span>,
    },

    {
      title: getLocaleMessages("Deposit"),
      dataIndex: "deposit",
      key: "deposit",
      render: (deposit) => <span>{Formatcurrency(deposit)}</span>,
    },
    /*{
      title: getLocaleMessages("Request"),
      dataIndex: "changerequest",
      key: "changerequest",
    },*/
    {
      title: getLocaleMessages("Booking Status"),
      dataIndex: "status",
      key: "status",
      render: (id, status) => {
        if (status.status == 1)
          return <span>{getLocaleMessages("Confirmed")}</span>;
        else if (status.status == 2)
          return <span>{getLocaleMessages("Pending")}</span>;
        else if (status.status == 3)
          return <span>{getLocaleMessages("Completed")}</span>;
        else if (status.status <= 0)
          return (
            <span>{`${
              status.usertype == 3
                ? `${getLocaleMessages("Cancelled by the user")} ${
                    status.cancellationreason.length > 0
                      ? `(reason: ${status.cancellationreason})`
                      : ""
                  }`
                : ` ${
                    status.usertype == 2
                        ? `${getLocaleMessages("Cancelled by Agency")}`
                        : `${getLocaleMessages("Cancelled by Admin")}`
                  }`
            }`}</span>
          );
      },
      //   render: (id, status) => status.status == 0 ? <span>Cancelled</span> :
      //   <Select
      //   showSearch
      //   onChange={(e)=>handleChangeStatus(status.id, e)}
      //   value={status.status}
      //   allowClear
      //   optionFilterProp="children"
      //   filterOption={(input, option) =>
      //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      //   }
      //   autoComplete={'off'}
      //   placeholder={'Status'}
      //   dropdownStyle={{ minWidth: '200px' }}
      // >
      //   <Option key={2} value={2}>Pending</Option>
      //   <Option key={1} value={1}>Confirmed</Option>
      //   <Option key={3} value={3}>Completed</Option>
      //   <Option key={0} value={0}>Canceled</Option>
      // </Select>
    },
    /*{
      title: getLocaleMessages("Payment Transaction Id"),
      dataIndex: "paymenttransactionid",
      key: "paymenttransactionid",
    },*/
    {
      title: getLocaleMessages("Payment Status"),
      dataIndex: "paymentstatus",
      key: "paymentstatus",
      render: (id, paymentstatus) => {
        if (paymentstatus.paymentstatus == 0)
          return <span>{getLocaleMessages("Pending")}</span>;
        else if (paymentstatus.paymentstatus == 1)
          return <span>{getLocaleMessages("Success")}</span>;
        else if (paymentstatus.paymentstatus == 2)
          return <span>{getLocaleMessages("Failed")}</span>;
        else if (paymentstatus.paymentstatus == 3)
          return <span>{getLocaleMessages("Cancelled")}</span>;
        else if (paymentstatus.paymentstatus == 4)
          return <span>{getLocaleMessages("Refund")}</span>;
      },
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <ShowForPermission permission="update" module="bok">
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => viewBooking(record.id)}
            type="edit"
          />
        </ShowForPermission>
      ),
    },
  ];

  const viewBooking = (id) => {
    setSelectedBookingId(id);
    history.push({
      pathname: "bookingdetails",
      state: id,
    });
  };

  const handleChangeStatus = (id, event) => {
    dispatch({
      type: settingsAction.CHANGE_BOOKING_STATUS,
      payload: { id: id, status: event },
    });
    loadBookingInformation();
  };

  // const onFormLayoutChange = () => {
  //   const { bookingno, status} = usedForm.getFieldsValue();
  //   const filter = {};
  //   if(bookingno !== undefined && bookingno !== ''){
  //     filter['id'] = bookingno;
  //   }
  //   if(status !== undefined && status !== ''){
  //     filter['status'] = status;
  //   }

  //   let filterBookings= bookings.filter(function(item) {
  //     for (var key in filter) {
  //       if (item[key] === undefined || item[key] != filter[key])
  //         return false;
  //     }
  //     return true;
  //   });
  // if(filterBookings.length > 0)
  //   setFilteredBooking(filterBookings)
  // else
  // setFilteredBooking(bookings)
  // };

  useEffect(() => {
    if (bookings?.length > 0) {
      var arr = [];

      for (var i = 0; i < bookings.length; i++) {
        var Status = "Cancelled";
        switch (bookings[i].status) {
          case 1:
            Status = "Confirmed";
            break;
          case 2:
            Status = "Pending";
            break;
          case 3:
            Status = "Completed";
            break;
          default:
            break;
        }
        if (bookings[i]?.bookingcode !== undefined) {
          const pickup = format(
            new Date(bookings[i].pickupdate),
            "dd/MM/yyyy hh:mm a"
          );
          const dropoff = format(
            new Date(bookings[i].dropoffdate),
            "dd/MM/yyyy hh:mm a"
          );

          let paymentStatus = 'Pending';
          if(bookings[i].paymentstatus == 1) {
            paymentStatus = 'Success'
          } else if (bookings[i].paymentstatus == 2) {
            paymentStatus = 'Failed'
          } else if (bookings[i].paymentstatus == 3) {
            paymentStatus = 'Cancelled'
          } else if (bookings[i].paymentstatus == 4) {
            paymentStatus = 'Refund'
          }
          arr.push({
            "Booking No": bookings[i].bookingcode,
            "Pickup Date": pickup,
            "Dropoff Date": dropoff,
            "Price Per Day": bookings[i].priceperday,
            "Rental Days": bookings[i].totalrentaldays,
            "Total Amount": bookings[i].totalcost,
            Deposit: bookings[i].deposit,
            Request: bookings[i].changerequest,
            "Payment Transaction": bookings[i].paymenttransactionid,
            "Payment Status": paymentStatus,
            Request: bookings[i].changerequest,
            Status: Status,
          });
        }
      }
      setTimeout(() => {
        setExportData(arr);
      }, 1000);
    }
  }, [bookings]);

  const FilterDates = (fromdate, todate, data) => {
    const _fromdate =
      fromdate !== undefined && fromdate !== null
        ? new Date(fromdate).toISOString().slice(0, 10)
        : new Date(
            new Date(todate).getFullYear(),
            new Date(todate).getMonth(),
            1
          )
            .toISOString()
            .slice(0, 10);
    const _todate =
      todate !== undefined && todate !== null
        ? new Date(todate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
    var result = data
      .filter((it) => it?.bookingcode !== undefined)
      .filter(
        (book) =>
          new Date(book.pickupdate).toISOString().slice(0, 10) >= _fromdate &&
          new Date(book.pickupdate).toISOString().slice(0, 10) <= _todate
      );

    return result;
  };

  const filterArray = (allRequests, filters) => {
    return allRequests.filter((item) => {
      if (Object.keys(filters).length > 0) {
        for (let key in filters) {
          if (item[key] === undefined || !filters[key].includes(item[key])) {
            return false;
          }
        }
      }
      return true;
    });
  };

  const onFormLayoutChange = () => {
    const {
      bookingno,
      status,
      fromdate,
      todate,
      agnecyid,
    } = usedForm.getFieldsValue();
    const filter = {};
    if (bookingno !== undefined && bookingno !== "") {
      filter["bookingcode"] = bookingno;
    }
    if (status !== undefined && status !== "") {
      setShowAgencyFilter(false);
      if (status == -99) {
        setShowAgencyFilter(true);
      }
      filter["status"] = status;
    }
    if (agnecyid !== undefined && agnecyid !== "") {
      filter["agentid"] = agnecyid;
    }
    let filterBookings = bookings.filter(function (item) {
      for (var key in filter) {
        if (
          item[key] === undefined ||
          !JSON.stringify(item[key])?.includes(filter[key])
        )
          return false;
        else if (JSON.stringify(item[key])?.includes(filter[key])) return true;
      }
      return true;
    });
    // bookings.filter(function (item) {
    //   if (Object.keys(filter).length > 0) {
    //     for (var key in filter) {
    //       if (
    //         item[key] !== undefined &&
    //         item[key] !== null &&
    //         JSON.stringify(item[key]).includes(filter[key])
    //       )
    //         return item;
    //     }
    //   } else {
    //     return bookings;
    //   }
    // });

    filterBookings?.length > 0
      ? setFilteredBooking(filterBookings)
      : setFilteredBooking([]);

    if (
      filter &&
      Object.keys(filter).length > 0 &&
      filter.constructor === Object &&
      !fromdate &&
      !todate
    ) {
      setFilteredBooking(filterBookings);
    }
    if (fromdate || todate) {
      let data = FilterDates(
        fromdate,
        todate,
        filterBookings.length > 0 ? filterBookings : bookings
      );
      setFilteredBooking(data);
    }
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  useEffect(() => {
    setFilteredBooking(bookings);
  }, [bookings]);

  const loadBookingInformation = () => {
    let initialValue = {
      id:
        getLocalDataType() == "agency"
          ? JSON.parse(localStorage.getItem("user_data"))["id"]
          : 0,
      bookingno: "",
      status: "",
    };
    dispatch({
      type: settingsAction.GET_CARBOOKING_INFO,
      payload: initialValue,
    });
    dispatch({
      type: agencyAction.GET_AGENCY_BYLANG,
      payload: { status: 1 },
    });
  };
  useEffect(() => {
    loadBookingInformation();
  }, []);

  return (
    <>
      <LoadingOverlay
        active={isLoading}
        spinner
        text={getLocaleMessages("Loading your content...")}
      >
        <div className="page-container">
          <Row className="head-filter">
            <Col span={12}>
              <Title level={2}>{getLocaleMessages("Bookings")}</Title>
            </Col>
            <Col span={12}>
              <div className="head-filter-flxend">
              <Button
                onClick={handleFilterShow}
                type="primary"
                icon={<FilterOutlined />}
              >
                {getLocaleMessages("Filter")}
              </Button>
              {ExportData.length > 0 && (
                <MyCsvLink csvData={ExportData} filename="Bookings" />
              )}
              </div>
            </Col>
          </Row>

          {showFilter && (
            <Row>
              <Col span={24}>
                <div className="dashboard-form">
                  <Form
                    {...formProps}
                    layout="horizontal"
                    form={usedForm}
                    onValuesChange={onFormLayoutChange}
                  >
                    <Row gutter={20}>
                      <Col span={3} className="inner-content">
                        <Form.Item
                          label={getLocaleMessages("Booking No")}
                          name="bookingno"
                        >
                          <Input placeholder="" type="number" allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={4} className="inner-content">
                        <Form.Item
                          label={getLocaleMessages("Status")}
                          name={"status"}
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
                            placeholder={""}
                            dropdownStyle={{ minWidth: "200px" }}
                          >
                            <Option value={1}>
                              {getLocaleMessages("Booked")}
                            </Option>
                            <Option value={2}>
                              {getLocaleMessages("Pending")}
                            </Option>
                            <Option value={3}>
                              {getLocaleMessages("Completed")}
                            </Option>
                            <Option value={0}>
                              {getLocaleMessages("Cancelled by admin")}
                            </Option>
                            <Option value={-1}>
                              {getLocaleMessages("Cancelled by user")}
                            </Option>
                            <Option value={-99}>
                              {getLocaleMessages("Cancelled by Agency")}
                            </Option>
                            {/* {carinformation.brand && carinformation.brand.map(value => {
                            return (
                              <Option key={value.id} value={value.id}>
                                {value.carbrandname}
                              </Option>
                            );
                          })} */}
                          </Select>
                        </Form.Item>
                      </Col>
                      {getLocalDataType() === "admin" && showAgencyFilter && (
                        <Col span={6} className="inner-content">
                          <Form.Item label={"Agency"} name={"agnecyid"}>
                            <Select
                              allowClear
                              style={{ width: "100%" }}
                              placeholder=""
                              onChange={{}}
                            >
                              {agency_data &&
                                agency_data.map((agency) => {
                                  return (
                                    <Option key={agency.id} value={agency.id}>
                                      {`${agency.agentname}`}
                                    </Option>
                                  );
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                      <Col span={2}></Col>
                      <Col span={4} className="inner-content">
                        <Form.Item
                          name="fromdate"
                          label={getLocaleMessages("From Date")}
                        >
                          <DatePicker
                            format="DD-MM-YYYY"
                            inputReadOnly
                            placeholder={getLocaleMessages("From Date")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} className="inner-content">
                        <Form.Item
                          name="todate"
                          label={getLocaleMessages("To Date")}
                        >
                          <DatePicker
                            format="DD-MM-YYYY"
                            inputReadOnly
                            placeholder={getLocaleMessages("To Date")}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Col>
            </Row>
          )}
          <Table
            rowKey="id"
            rowClassName={(record, index) => {
              switch (record.status) {
                case 1:
                  return "table-row-dark"; 
                case 2:
                  return "table-row-pending"; 
                default:
                  return "table-row-light"; 
              }
              // ((record.status == 1) ? "table-row-dark" : (record.status == 0) ? "table-row-dark" : 'table-row-light')
            }}
            columns={columns}
            dataSource={FilteredBooking}
          />
        </div>
      </LoadingOverlay>
    </>
  );
};

export default BookingManagement;
