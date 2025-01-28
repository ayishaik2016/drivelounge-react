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
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Formatcurrency, formProps, DEFAULT_CURRENCY } from "../../../helpers/constant";
import actions from "./../../../redux/admin/report/actions";
import settingsAction from "../../../redux/admin/agency/actions";
import "./../../../assets/css/adminStyle.css";
import format from "date-fns/format";
import { getLocaleMessages } from "redux/helper";
import moment from "moment";
LoadingOverlay.propTypes = undefined;
const { Option } = Select;
const { Title } = Typography;

const ReportManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { admin_report, isLoading } = useSelector((State) => State.Reports);
  const { agency_data } = useSelector((State) => State.Agency);
  const [showFilter, setshowFilter] = useState(false);

  const [reports, setReports] = useState([]);
  const [ExportData, setExportData] = useState([]);

  const columns = [
    {
      title: getLocaleMessages("SN"),
      dataIndex: "row",
      key: "row",

      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    // {
    //   title: 'Date',
    //   dataIndex: 'bookingdate',
    //   key: 'bookingdate',

    //   render: (bookingdate) => (
    //     <span>{format(new Date(bookingdate), 'dd/MM/yyyy hh:mm:ss')}</span>
    //   ),
    // },
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
      title: getLocaleMessages("Pickup Date"),
      dataIndex: "pickupdate",
      key: "pickupdate",
      render: (pickupdate) => (
        <span>{format(new Date(pickupdate), "dd/MM/yyyy hh:mm:ss")}</span>
      ),
    },
    {
      title: getLocaleMessages("Drop-off Date"),
      dataIndex: "dropoffdate",
      key: "dropoffdate",
      render: (dropoffdate) => (
        <span>{format(new Date(dropoffdate), "dd/MM/yyyy hh:mm:ss")}</span>
      ),
    },
    {
      title: getLocaleMessages("Car No"),
      dataIndex: "carno",
      key: "carno",
    },
    {
      title: getLocaleMessages("Customer Name"),
      dataIndex: "customername",
      key: "customername",
    },
    {
      title: getLocaleMessages("Agent Name"),
      dataIndex: "agentname",
      key: "agentname",
    },
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
      title: getLocaleMessages("Agency Rent Price"),
      dataIndex: "carpriceperday",
      key: "carpriceperday",
      render: (carpriceperday, record) => (
        <span>{`${Formatcurrency(
          record.carpriceperday * record.totalrentaldays
        )} ${getLocaleMessages(DEFAULT_CURRENCY)}`}</span>
      ),
    },
    {
      title: getLocaleMessages("Agency VAT"),
      dataIndex: "deposit",
      key: "deposit",
      render: (carpriceperday, record) => (
        <span>
          {`${Formatcurrency(
            record.carpriceperday *
              record.totalrentaldays *
              (record.vatpercent / 100)
          )} ${getLocaleMessages(DEFAULT_CURRENCY)}`}
        </span>
      ),
    },

    {
      title: getLocaleMessages("Coupon Value"),
      dataIndex: "couponvalue",
      key: "couponvalue",
      render: (couponvalue) => (
        <span>{`${Formatcurrency(couponvalue)} ${getLocaleMessages(
          DEFAULT_CURRENCY
        )}`}</span>
      ),
    },

    /*{
      title: getLocaleMessages("Rental Total Price"),
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal) => (
        <span>{`${Formatcurrency(subtotal)} ${getLocaleMessages(DEFAULT_CURRENCY)}`}</span>
      ),
    },*/
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
        <span>{`${Formatcurrency(adminvat)} ${getLocaleMessages(
          DEFAULT_CURRENCY
        )}`}</span>
      ),
    },
    {
      title: getLocaleMessages("Payment Transaction"),
      dataIndex: "paymenttransactionid",
      key: "paymenttransactionid"
    },
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
    //             ? `${Formatcurrency(
    //                 record.carpriceperday *
    //                   record.totalrentaldays *
    //                   (record.commvalue / 100)
    //               )} ${getLocaleMessages("SAR")}`
    //             : `${Formatcurrency(
    //                 record.totalrentaldays * record.commvalue
    //               )} ${getLocaleMessages("SAR")}`}
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
    //             ? `${Formatcurrency(
    //                 record.carpriceperday *
    //                   record.totalrentaldays *
    //                   (record.commvalue / 100) *
    //                   (record.vatpercent / 100)
    //               )} ${getLocaleMessages("SAR")}`
    //             : `${Formatcurrency(
    //                 record.totalrentaldays *
    //                   record.commvalue *
    //                   (record.vatpercent / 100)
    //               )} ${getLocaleMessages("SAR")}`}
    //         </span>
    //       ),
    //     };
    //   },
    // },
    // {
    //   title: 'Payment Method',
    //   dataIndex: 'totalcost',
    //   key: 'totalcost',
    //   fixed: 'right',
    //   render: () => <span>{'COD'}</span>
    // },
  ];

  const onFormFilterLayoutChange = () => {
    const { agency, fromdate, todate } = usedForm.getFieldsValue();
    var id = agency !== undefined ? agency : 0;
    if (fromdate !== undefined && todate !== undefined) {
      dispatch({
        type: actions.GET_ADMIN_REPORT,
        payload: {
          agency: id,
          fdate:
            fromdate !== undefined
              ? format(new Date(fromdate), "yyyy-MM-dd")
              : format(new Date(), "yyyy-MM-dd"),
          ldate:
            todate !== undefined
              ? format(new Date(todate), "yyyy-MM-dd")
              : format(new Date(), "yyyy-MM-dd"),
        },
      });
    }
  };

  useEffect(() => {
    if (admin_report !== undefined && admin_report.length > 0) {
      setReports(admin_report);
    } else {
      setReports([]);
    }
  }, [admin_report]);

  useEffect(() => {
    if (reports.length > 0) {
      var arr = [];
      for (var i = 0; i < reports.length; i++) {
        arr.push({
          "SN": i + 1,
          "Booking Date": format( new Date(reports[i].bookingdate), "dd/MM/yyyy hh:mm:ss" ),
          "Booking No": reports[i].bookingcode,
          "Pickup Date": format( new Date(reports[i].pickupdate), "dd/MM/yyyy hh:mm:ss" ),
          "Dropoff Date": format( new Date(reports[i].dropoffdate), "dd/MM/yyyy hh:mm:ss" ),
          "Car No": reports[i].carno,
          "Customer Name": reports[i].customername,
          "Agent Name": reports[i].agentname,
          "Total Rental Days": reports[i].totalrentaldays,
          "Deposit": reports[i].deposit,
          "Agency Rent Price": reports[i].carpriceperday * reports[i].totalrentaldays,
          "Agency VAT": reports[i].carpriceperday * reports[i].totalrentaldays * (reports[i].vatpercent / 100),
          //"Admin Commission": reports[i].admincomission,
          //reports[i].commtype == 2
          //  ? reports[i].carpriceperday *
          //    reports[i].totalrentaldays *
          //    (reports[i].commvalue / 100)
          //  : reports[i].totalrentaldays * reports[i].commvalue,
          //"Admin VAT": reports[i].adminvat,
          //reports[i].commtype == 2
          //  ? reports[i].carpriceperday *
          //    reports[i].totalrentaldays *
          //    (reports[i].commvalue / 100) *
          //    (reports[i].vatpercent / 100)
          //  : reports[i].totalrentaldays *
          //    reports[i].commvalue *
          //    (reports[i].vatpercent / 100),
          "Coupon Value": reports[i].couponvalue,
          "Total VAT": reports[i].vatamount,
          "Total Amount": reports[i].totalcost,
          "Admin Commission": reports[i].admincomission,
          "Admin VAT": reports[i].adminvat,
          "Payment Transaction": (reports[i].paymenttransactionid != 1) ? reports[i].paymenttransactionid : '',
        });
      }
      setExportData(arr);
    }
  }, [reports]);

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_AGENCY_INFO,
      payload: { status: 1 },
    });

    const from_date = moment().add(-60, "days");
    const to_date = moment(new Date(), "DD-MM-YYYY");
    usedForm.setFieldsValue({ fromdate: from_date, todate: to_date });
    dispatch({
      type: actions.GET_ADMIN_REPORT,
      payload: {
        agency: 0,
        fdate: format(new Date(from_date), "yyyy-MM-dd"),
        ldate: format(new Date(to_date), "yyyy-MM-dd"),
      },
    });
  }, []);
  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Row className="head-filter" justify="space-between" align="middle">
          <Col>
            <Title level={2}>{getLocaleMessages("Sales Report")}</Title>
          </Col>
        </Row>

        <Form
          {...formProps}
          layout="horizontal"
          form={usedForm}
          onValuesChange={onFormFilterLayoutChange}
        >
          <Row gutter={20}>
            <Col span={6} className="inner-content">
              <Form.Item label={getLocaleMessages("Agency")} name="agency">
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={false}
                  placeholder={""}
                  dropdownStyle={{ minWidth: "200px" }}
                >
                  {agency_data &&
                    agency_data.map((value) => {
                      return (
                        <Option key={value.id} value={value.id}>
                          {value.agencyname}
                        </Option>
                      );
                    })}
                </Select>
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
            <Col span={6} className="inner-content"></Col>
            <Col span={4} className="inner-content">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "45px",
                }}
              >
                {ExportData.length > 0 && (
                  <MyCsvLink csvData={ExportData} filename="Admin Report" />
                )}
              </div>
            </Col>
          </Row>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={reports}
          scroll={{ x: 700 }}
        />
      </div>
    </LoadingOverlay>
  );
};

export default ReportManagement;
