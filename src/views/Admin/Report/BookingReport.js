import react, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import {
  Row,
  Col,
  Select,
  Button,
  Table,
  DatePicker,
  Form,
  Typography,
  Space,
  Input,
} from "antd";
import { format } from "date-fns";
import "./../../../assets/css/adminStyle.css";
import { FilterOutlined } from "@ant-design/icons";
import actions from "./../../../redux/admin/report/actions";
import settingsAction from "../../../redux/admin/agency/actions";
import { formProps } from "../../../helpers/constant";
import MyCsvLink from "../../../components/shared/ExportCsv";
import { getLocaleMessages } from "redux/helper";
const { Option } = Select;
const { Title } = Typography;

const BookingReportComponent = () => {
  const dispatch = useDispatch();
  const [filterForm] = Form.useForm();
  const [showFilter, setshowFilter] = useState(false);
  const [reports, setReports] = useState([]);
  const [ExportData, setExportData] = useState([]);
  const { bookingrept_list, isLoading } = useSelector((State) => State.Reports);
  const { agency_data } = useSelector((State) => State.Agency);
  const columns = [
    {
      title: "#",
      dataIndex: "row",
      key: "row",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Customer Name"),
      dataIndex: "customername",
      key: "customername",
    },
    {
      title: getLocaleMessages("Confirmed Booking No"),
      dataIndex: "bookingnumber",
      key: "bookingnumber",
    },
    {
      title: getLocaleMessages(
        "Date of Confirmation of the Booking from Platform"
      ),
      dataIndex: "bookingdate",
      key: "bookingdate",
      render: (bookingdate) => (
        <span>{format(new Date(bookingdate), "dd/MM/yyyy hh:mm a")}</span>
      ),
    },
    {
      title: getLocaleMessages(
        "Date of Confirmation of the Booking from Agency"
      ),
      dataIndex: "confirmeddate",
      key: "confirmeddate",
      render: (confirmeddate) => (
        <span>{format(new Date(confirmeddate), "dd/MM/yyyy hh:mm a")}</span>
      ),
    },
    {
      title: getLocaleMessages("Car Model"),
      dataIndex: "carmodel",
      key: "carmodel",
    },
    {
      title: getLocaleMessages("Rent From"),
      dataIndex: "pickupdate",
      key: "pickupdate",
      render: (pickupdate) => (
        <span>{format(new Date(pickupdate), "dd/MM/yyyy hh:mm a")}</span>
      ),
    },
    {
      title: getLocaleMessages("Rent To"),
      dataIndex: "dropoffdate",
      key: "dropoffdate",
      render: (dropoffdate) => (
        <span>{format(new Date(dropoffdate), "dd/MM/yyyy hh:mm a")}</span>
      ),
    },
    {
      title: getLocaleMessages("Confirmed Booking Value"),
      dataIndex: "totalcost",
      key: "totalcost",
    },
    {
      title: getLocaleMessages("Platform service fees"),
      dataIndex: "platformfee",
      key: "platformfee",
    },
    {
      title: getLocaleMessages("VAT platform = service fees %15 *"),
      dataIndex: "vat",
      key: "vat",
    },
    {
      title: getLocaleMessages(
        "Amount due to pay platform service(Fees + VAT)"
      ),
      dataIndex: "pay",
      key: "pay",
    },
  ];
  useEffect(() => {
    dispatch({
      type: settingsAction.GET_AGENCY_INFO,
      payload: { status: 1 },
    });
  }, []);
  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };
  const onFormFilterLayoutChange = () => {
    const { agency, fromdate, todate } = filterForm.getFieldsValue();
    if (agency !== undefined && agency !== "") {
      dispatch({
        type: actions.GET_BOOKINGREPT_LIST,
        payload: {
          agency: agency,
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
    bookingrept_list.length > 0 && setReports(bookingrept_list);
  }, [bookingrept_list]);

  useEffect(() => {
    if (reports.length > 0) {
      var arr = [];
      for (var i = 0; i < reports.length; i++) {
        arr.push({
          "Customer Name": reports[i].customername,
          "Confirmed Booking No": reports[i].bookingnumber,
          "Date of Confirmation of the Booking from Platform": format(
            new Date(reports[i].bookingdate),
            "dd/MM/yyyy hh:mm a"
          ),
          "Date of Confirmation of the Booking from Agency": format(
            new Date(reports[i].confirmeddate),
            "dd/MM/yyyy hh:mm a"
          ),
          "Car Model": reports[i].carmodel,
          "Rent FROM": format(
            new Date(reports[i].pickupdate),
            "dd/MM/yyyy hh:mm a"
          ),
          "Rent To": format(
            new Date(reports[i].dropoffdate),
            "dd/MM/yyyy hh:mm a"
          ),
          "Confirmed Booking Value": reports[i].totalcost,
          "Platform service fees": reports[i].platformfee,
          "VAT platform = service fees %15 *": reports[i].vat,
          "Amount due to pay platform service(Fees + VAT)": reports[i].pay,
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
          <Col>
            <Title level={2}>{getLocaleMessages("Booking Report")}</Title>
          </Col>
          <Col>
            <Space>
              {ExportData.length > 0 && (
                <MyCsvLink csvData={ExportData} filename="Booking_Report" />
              )}

              <Button
                onClick={handleFilterShow}
                type="primary"
                icon={<FilterOutlined />}
              >
                {getLocaleMessages("Filter")}
              </Button>
            </Space>
          </Col>
        </Row>
        {showFilter && (
          <Form
            {...formProps}
            layout="horizontal"
            form={filterForm}
            onValuesChange={onFormFilterLayoutChange}
          >
            <Row gutter={20}>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Agency")}
                  name="agency"
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
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder={""}
                    dropdownStyle={{ minWidth: "200px" }}
                  >
                    {agency_data &&
                      agency_data.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.username}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
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
              <Col span={6} className="inner-content">
                <Form.Item name="todate" label={getLocaleMessages("To Date")}>
                  <DatePicker
                    format="DD-MM-YYYY"
                    inputReadOnly
                    placeholder={getLocaleMessages("To Date")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
        <Table columns={columns} dataSource={reports} />
      </div>
    </LoadingOverlay>
  );
};

export default BookingReportComponent;
