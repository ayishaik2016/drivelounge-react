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
import { formProps } from "../../../helpers/constant";
import actions from "./../../../redux/admin/report/actions";
import "./../../../assets/css/adminStyle.css";
import format from "date-fns/format";
import { getLocaleMessages } from "redux/helper";
import moment from "moment";
const { Option } = Select;
const { Title } = Typography;

const ReportManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { user_report, isLoading } = useSelector((State) => State.Reports);
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
      title: getLocaleMessages("Total Rental Days"),
      dataIndex: "totalrentaldays",
      key: "totalrentaldays",
    },
    {
      title: getLocaleMessages("Deposit"),
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: getLocaleMessages("Rent Price"),
      dataIndex: "subtotal",
      key: "subtotal",
    },
    {
      title: getLocaleMessages("VAT"),
      dataIndex: "vatamount",
      key: "vatamount",
    },
    {
      title: getLocaleMessages("Total Amount"),
      dataIndex: "totalcost",
      key: "totalcost",
    },

    {
      title: getLocaleMessages("Payment Method"),
      dataIndex: "totalcost",
      key: "totalcost",
      render: () => <span>{getLocaleMessages("COD")}</span>,
    },
  ];

  const onFormFilterLayoutChange = () => {
    const { fromdate, todate } = usedForm.getFieldsValue();
    if (fromdate !== undefined && todate !== undefined) {
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
        },
      });
    }
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
            <Title level={2}>{getLocaleMessages("Agency Sales Report")}</Title>
          </Col>
        </Row>

        <Form
          {...formProps}
          layout="horizontal"
          form={usedForm}
          onValuesChange={onFormFilterLayoutChange}
        >
          <Row gutter={20}>
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
          </Row>
          <Space>
            {ExportData.length > 0 && (
              <MyCsvLink csvData={ExportData} filename="Bill_Report" />
            )}
          </Space>
        </Form>

        <Table columns={columns} dataSource={user_report} />
      </div>
    </LoadingOverlay>
  );
};

export default ReportManagement;
