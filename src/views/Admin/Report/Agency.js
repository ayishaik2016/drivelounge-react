import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import MyCsvLink from "../../../components/shared/ExportCsv";
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
  Statistic,
} from "antd";
import {
  DeleteOutlined,
  PayCircleOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Formatcurrency, formProps, DEFAULT_CURRENCY } from "../../../helpers/constant";
import actions from "./../../../redux/admin/report/actions";
import "./../../../assets/css/adminStyle.css";
import format from "date-fns/format";
import { getLocalData, getLocaleMessages, getLocalDataType } from "redux/helper";
import moment from "moment";
import Payment from "./../../Common/MyBookings/Payment";
const { Option } = Select;
const { Title } = Typography;
var comm = 0;
var commvat = 0;
var balance = 0;
const ReportManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { agency_report, isLoading } = useSelector((State) => State.Reports);
  const [showFilter, setshowFilter] = useState(false);
  const [ShowPaymentDialog, setShowPaymentDialog] = useState(false);
  const [ShowPayConfirmationDlg, setShowPayConfirmationDlg] = useState(false);
  const [SelectedBooking, setSelectedBooking] = useState({});
  const [reports, setReports] = useState([]);
  const [ExportData, setExportData] = useState([]);
  const columns = [
    {
      title: getLocaleMessages("SN"),
      dataIndex: "row",
      key: "row",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Date"),
      dataIndex: "bookingdate",
      key: "bookingdate",
      render: (bookingdate) => (
        <span>{format(new Date(bookingdate), "dd/MM/yyyy hh:mm:ss")}</span>
      ),
    },
    {
      title: getLocaleMessages("Booking No"),
      dataIndex: "bookingcode",
      key: "bookingcode",
      render: (bookingcode) => (
        <span>
          {bookingcode.length > 8
            ? bookingcode.substr(bookingcode.length - 8)
            : bookingcode}
        </span>
      ),
    },
    {
      title: 'Pickup Date',
      dataIndex: 'pickupdate',
      key: 'pickupdate',
      render: (pickupdate) => (
        <span>{format(new Date(pickupdate), 'dd/MM/yyyy hh:mm')}</span>
      ),
    },
    {
      title: 'Drop-off Date',
      dataIndex: 'dropoffdate',
      key: 'dropoffdate',
      render: (dropoffdate) => (
        <span>{format(new Date(dropoffdate), 'dd/MM/yyyy hh:mm')}</span>
      ),
    },
    {
      title: getLocaleMessages("Car No"),
      dataIndex: "carno",
      key: "carno",
    },
    // {
    //   title: 'Customer Name',
    //   dataIndex: 'customername',
    //   key: 'customername',
    // },
    {
      title: getLocaleMessages("Total Rental Days"),
      dataIndex: "totalrentaldays",
      key: "totalrentaldays",
    },
    {
      title: getLocaleMessages("Deposit"),
      dataIndex: "deposit",
      key: "deposit",
      render: (deposit) => (
        <span>{`${Formatcurrency(deposit)} ${getLocaleMessages(DEFAULT_CURRENCY)}`}</span>
      ),
    },
    {
      title: getLocaleMessages("Rental Total Price"),
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal) => (
        <span>{`${Formatcurrency(subtotal)} ${getLocaleMessages(DEFAULT_CURRENCY)}`}</span>
      ),
    },
    {
      title: getLocaleMessages("Total VAT"),
      dataIndex: "vatamount",
      key: "vatamount",
      render: (vatamount) => (
        <span>{`${Formatcurrency(vatamount)} ${getLocaleMessages(
          DEFAULT_CURRENCY
        )}`}</span>
      ),
    },
    // {
    //   title: getLocaleMessages("Agency VAT"),
    //   dataIndex: "deposit",
    //   key: "deposit",
    //   render: (carpriceperday, record) => (
    //     <span>
    //       {`${Formatcurrency(
    //         (
    //           record.carpriceperday *
    //           record.totalrentaldays *
    //           (record.vatpercent / 100)
    //         ).toFixed(2)
    //       )} ${getLocaleMessages(DEFAULT_CURRENCY)}`}
    //     </span>
    //   ),
    // },
    {
      title: getLocaleMessages("Coupon Code"),
      dataIndex: "couponcode",
      key: "couponcode",
    },
    {
      title: getLocaleMessages("Coupon Value"),
      dataIndex: "couponvalue",
      key: "couponvalue",
    },

    {
      title: getLocaleMessages("Total Amount"),
      dataIndex: "totalcost",
      key: "totalcost",
      render: (totalcost) => (
        <span>{`${Formatcurrency(totalcost)} ${getLocaleMessages(
          DEFAULT_CURRENCY
        )}`}</span>
      ),
    },
    {
      title: getLocaleMessages("Admin Commission"),
      dataIndex: "admincomission",
      key: "admincomission  ",
      render: (totalcost) => (
        <span>{`${Formatcurrency(totalcost)} ${getLocaleMessages(
          DEFAULT_CURRENCY
        )}`}</span>
      ),
    },
    {
      title: getLocaleMessages("Admin VAT"),
      dataIndex: "adminvat",
      key: "adminvat",
      render: (totalcost) => (
        <span>{`${Formatcurrency(totalcost)} ${getLocaleMessages(
          DEFAULT_CURRENCY
        )}`}</span>
      ),
    },
    {
      title: getLocaleMessages("Payment Transaction"),
      dataIndex: "paymenttransactionid",
      key: "paymenttransactionid"
    },
    /*{
      title: getLocaleMessages("Admin Commission"),
      dataIndex: "admincomission",
      key: "admincomission",
      render: (admincomission) => (
        <span>{`${Formatcurrency(admincomission)} ${getLocaleMessages(
          DEFAULT_CURRENCY
        )}`}</span>
      ),
    },
    {
      title: getLocaleMessages("Admin VAT"),
      dataIndex: "adminvat",
      key: "adminvat",
      render: (adminvat) => (
        <span>{`${Formatcurrency(adminvat)} ${getLocaleMessages(DEFAULT_CURRENCY)}`}</span>
      ),
    },*/
    // {
    //   title: getLocaleMessages("Admin Commission"),
    //   dataIndex: "deposit",
    //   key: "deposit",
    //   render(carpriceperday, record) {
    //     return {
    //       props: {
    //         style: { backgroundColor: "#b7a57b", color: "white" },
    //       },
    //       children: (
    //         <span>
    //           {record.commtype == 2
    //             ? (
    //                 record.carpriceperday *
    //                 record.totalrentaldays *
    //                 (record.commvalue / 100)
    //               ).toFixed(2)
    //             : (record.totalrentaldays * record.commvalue).toFixed(2)}
    //         </span>
    //       ),
    //     };
    //   },
    // },
    // {
    //   title: getLocaleMessages("Admin VAT"),
    //   dataIndex: "deposit",
    //   key: "deposit",
    //   render(carpriceperday, record) {
    //     return {
    //       props: {
    //         style: { backgroundColor: "#b7a57b", color: "white" },
    //       },
    //       children: (
    //         <span>
    //           {record.commtype == 2
    //             ? (
    //                 record.carpriceperday *
    //                 record.totalrentaldays *
    //                 (record.commvalue / 100) *
    //                 (record.vatpercent / 100)
    //               ).toFixed(2)
    //             : (
    //                 record.totalrentaldays *
    //                 record.commvalue *
    //                 (record.vatpercent / 100)
    //               ).toFixed(2)}
    //         </span>
    //       ),
    //     };
    //   },
    // },

    // {
    //   title: 'To Pay',
    //   dataIndex: 'vatamount',
    //   key: 'vatamount',
    // },

    // {
    //   title: 'Action',
    //   dataIndex: 'totalcost',
    //   key: 'totalcost',
    //   render: (status, record) =>    record.balance >= record.vatamount ?
    //         <Button shape="circle" icon={<SendOutlined />} onClick={()=>{
    //           setShowPaymentDialog(!ShowPaymentDialog)
    //           setSelectedBooking(record)
    //         }} type="remove"/> : <></>
    // },
  ];

  if (getLocalDataType("login_type") === "admin") {
    columns.push(
      {
        title: getLocaleMessages("Admin Commission"),
        dataIndex: "admincomission",
        key: "admincomission",
        render: (admincomission) => (
          <span>{`${Formatcurrency(admincomission)} ${getLocaleMessages(
            DEFAULT_CURRENCY
          )}`}</span>
        ),
      },
      {
        title: getLocaleMessages("Admin VAT"),
        dataIndex: "adminvat",
        key: "adminvat",
        render: (adminvat) => (
          <span>{`${Formatcurrency(adminvat)} ${getLocaleMessages(DEFAULT_CURRENCY)}`}</span>
        ),
      }
    );
  }

  useEffect(() => {
    comm = 0;
    agency_report &&
      agency_report.map((record) => {
        balance += record.balance !== null ? record.balance : 0;
        // comm +=  record.vatamount !== null ? record.vatamount :  0
        if (record.commtype == 2) {
          commvat =
            record.carpriceperday *
            record.totalrentaldays *
            (record.commvalue / 100) *
            (record.vatpercent / 100);
          comm +=
            record.carpriceperday *
              record.totalrentaldays *
              (record.commvalue / 100) +
            commvat;
        } else {
          commvat =
            record.totalrentaldays *
            record.commvalue *
            (record.vatpercent / 100);
          comm += record.totalrentaldays * record.commvalue + commvat;
        }
      });
  }, [agency_report]);

  const onFormFilterLayoutChange = () => {
    const { fromdate, todate, bookingno, carno } = usedForm.getFieldsValue();
    dispatch({
      type: actions.GET_AGENCY_REPORT,
      payload: {
        fdate:
          fromdate !== undefined
            ? format(new Date(fromdate), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
        ldate:
          todate !== undefined
            ? format(new Date(todate), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
        bookingno: bookingno !== undefined ? bookingno : 0,
        carno: carno !== undefined ? carno : 0,
      },
    });
  };

  useEffect(() => {
    const from_date = moment().add(-60, "days");
    const to_date = moment(new Date(), "DD-MM-YYYY");
    usedForm.setFieldsValue({ fromdate: from_date, todate: to_date });
    dispatch({
      type: actions.GET_AGENCY_REPORT,
      payload: {
        fdate: format(new Date(from_date), "yyyy-MM-dd"),
        ldate: format(new Date(to_date), "yyyy-MM-dd"),
        bookingno: 0,
        carno: 0,
      },
    });
  }, []);

  useEffect(() => {
    if (agency_report !== undefined && agency_report.length > 0) {
      setReports(agency_report);
    } else {
      setReports([]);
    }
  }, [agency_report]);

  useEffect(() => {
    if (reports.length > 0) {
      var arr = [];
      for (var i = 0; i < reports.length; i++) {
        arr.push({
          "SN": i + 1,
          "Booking Date": format(new Date(reports[i].bookingdate), "dd/MM/yyyy hh:mm:ss"),
          "Booking No": reports[i].bookingcode,
          "Pickup Date": format(new Date(reports[i].pickupdate), "dd/MM/yyyy hh:mm:ss"),
          "Dropoff Date": format(new Date(reports[i].dropoffdate), "dd/MM/yyyy hh:mm:ss"),
          "Car No": reports[i].carno,
          "Customer Name": reports[i].customername,
          "Total Rental Days": reports[i].totalrentaldays,
          "Deposit": reports[i].deposit,
          "Rental Total Price": reports[i].subtotal,
          "Total VAT": reports[i].vatamount,
          "Coupon Code": reports[i].couponcode,
          "Coupon Value": reports[i].couponvalue,
          "Total Amount": reports[i].totalcost,
          //"Admin Commission": reports[i].commtype == 2 ? (reports[i].carpriceperday * reports[i].totalrentaldays * (reports[i].commvalue / 100)) : (reports[i].totalrentaldays * reports[i].commvalue),
          //"Admin VAT": reports[i].commtype == 2 ? (reports[i].carpriceperday * reports[i].totalrentaldays * (reports[i].commvalue / 100) * (reports[i].vatpercent / 100)) : (reports[i].totalrentaldays * reports[i].commvalue * (reports[i].vatpercent / 100)),
          "Admin Commission": reports[i].admincomission,
          "Admin VAT": reports[i].adminvat,
          "Payment Transaction": (reports[i].paymenttransactionid != 1) ? reports[i].paymenttransactionid : '',
        });
      }
      setExportData(arr);
    }
  }, [reports]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Row className="head-filter" justify="space-between" align="middle">
          <Col span={12}>
            <Title level={2}>{getLocaleMessages("Agency Report")}</Title>
          </Col>

          <Col span={12}>
        <div className="head-filter-flxend">
          {ExportData.length > 0 && (
            <MyCsvLink csvData={ExportData} filename="Agency Report" />
          )}
        </div>
        </Col>

        </Row>

        <Form
          {...formProps}
          layout="horizontal"
          form={usedForm}
          onValuesChange={onFormFilterLayoutChange}
        >
          <Row gutter={20}>
            <Col span={3} className="inner-content">
              <Form.Item
                label={getLocaleMessages("Booking No")}
                name="bookingno"
              >
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
            <Col span={3} className="inner-content">
              <Form.Item label={getLocaleMessages("Car No")} name="carno">
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
            <Col span={4} className="inner-content">
              <Form.Item name="fromdate" label={getLocaleMessages("From Date")}>
                <DatePicker
                  format="DD-MM-YYYY"
                  inputReadOnly
                  placeholder={getLocaleMessages("From Date")}
                />
              </Form.Item>
            </Col>
            <Col span={4} className="inner-content">
              <Form.Item name="todate" label={getLocaleMessages("To Date")}>
                <DatePicker
                  format="DD-MM-YYYY"
                  inputReadOnly
                  placeholder={getLocaleMessages("To Date")}
                />
              </Form.Item>
            </Col>
            {/* <Col span={5}></Col>
            <Col span={5}>
              <Card className="customer-count">
                <Statistic
                  title={getLocaleMessages("Admin Commission")}
                  value={`${comm.toFixed(2)} SAR`}
                />
                <UserOutlined />
              </Card>
            </Col> */}
            {/* <Col span={5}>
                    <Card className="customer-count">
                      <Statistic title={("Payment Balance")} value={`${balance > 0 ? balance : comm} SAR`}/>
                    </Card>
                </Col> */}
          </Row>
        </Form>

        <Table
          columns={columns}
          dataSource={reports}
          scroll={{ x: 800 }}
          rowKey={"id"}
        />
      </div>
    </LoadingOverlay>
  );
};

export default ReportManagement;
