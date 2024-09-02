import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Card,
  Select,
  Switch,
  Form,
  Typography,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { formProps } from "../../../helpers/constant";
import settingsAction from "../../../redux/admin/booking/actions";
import "./../../../assets/css/adminStyle.css";
import format from "date-fns/format";
import { getLocaleMessages } from "redux/helper";

const { Option } = Select;
const { Title } = Typography;

const ReportManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { bookings, isLoading } = useSelector((state) => state.BookingInfo);
  const [showFilter, setshowFilter] = useState(false);
  const columns = [
    {
      title: getLocaleMessages("SN"),
      dataIndex: "row",
      key: "row",
    },
    {
      title: getLocaleMessages("Username"),
      dataIndex: "bookingno",
      key: "bookingno",
    },
    {
      title: getLocaleMessages("Log"),
      dataIndex: "bookingdate",
      key: "bookingdate",
      render: (bookingdate) => (
        <span>{format(new Date(bookingdate), "dd/MM/yyyy hh:mm:ss")}</span>
      ),
    },
    {
      title: getLocaleMessages("Client IP"),
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: getLocaleMessages("Client Platform"),
      dataIndex: "priceperday",
      key: "priceperday",
    },
    {
      title: getLocaleMessages("Client Agent"),
      dataIndex: "totalrentaldays",
      key: "totalrentaldays",
    },
    {
      title: getLocaleMessages("Created Date"),
      dataIndex: "totalcost",
      key: "totalcost",
    },

    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveLog(record)}
          type="edit"
        ></Button>
      ),
    },
  ];

  const handleRemoveLog = (log) => {};
  const onFormLayoutChange = (values) => {
    // setComponentSize(size);
    const { bookingno, status } = usedForm.getFieldsValue();
    const payload = {
      bookingno: bookingno !== undefined ? bookingno : "",
      status: status !== undefined ? status : "",
    };
    dispatch({
      type: settingsAction.GET_CARBOOKING_INFO,
      payload: payload,
    });
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  useEffect(() => {
    let initialValue = {
      bookingno: "",
      status: "",
    };
    dispatch({
      type: settingsAction.GET_CARBOOKING_INFO,
      payload: initialValue,
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
            <Title level={2}>{getLocaleMessages("Report")}</Title>
          </Col>
          <Col>
            <Button onClick={handleFilterShow} type="primary">
              {getLocaleMessages("Create")}
            </Button>
          </Col>
        </Row>
        {showFilter && (
          <Form
            {...formProps}
            layout="horizontal"
            form={usedForm}
            onValuesChange={() => onFormLayoutChange()}
          >
            <Row gutter={20}>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Booking No")}
                  name="bookingno"
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Fields are required"),
                    },
                  ]}
                >
                  <Input placeholder="" />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item label={getLocaleMessages("Status")} name={"status"}>
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
                    <Option value={1}>{getLocaleMessages("Booked")}</Option>
                    <Option value={2}>{getLocaleMessages("Completed")}</Option>
                    <Option value={3}>{getLocaleMessages("Cancelled")}</Option>
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
            </Row>
          </Form>
        )}
        <Table columns={columns} dataSource={bookings} />
      </div>
    </LoadingOverlay>
  );
};

export default ReportManagement;
