import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history, store } from "redux/store";
import {
  Row,
  Col,
  Input,
  Table,
  Statistic,
  Card,
  Select,
  Form,
  Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { formProps } from "../../../helpers/constant";
import settingsAction from "../../../redux/admin/car/actions";
import dashboardActions from "./../../../redux/admin/dashboard/actions";
import "./../../../assets/css/adminStyle.css";
import format from "date-fns/format";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";

const { Option } = Select;
const { Title } = Typography;

const PaymentManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { carinformation, carmanagement_data } = useSelector(
    (state) => state.CarInfo
  );
  const { admin_dashboard_bookings, isLoading } = useSelector(
    (state) => state.Dashboard
  );
  const [carStatus, setcarStatus] = useState(true);
  const [cardata, setcardata] = useState([]);
  const [showFilter, setshowFilter] = useState(false);
  const bookingHeader = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Booking No"),
      dataIndex: "bookingno",
      key: "bookingno",
    },
    {
      title: getLocaleMessages("Booking Date"),
      dataIndex: "bookingdate",
      key: "bookingdate",
      render: (bookingdate) => (
        <span>{format(new Date(bookingdate), "dd/MM/yyyy hh:mm:ss")}</span>
      ),
    },
    {
      title: getLocaleMessages("Deposit"),
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: getLocaleMessages("Price per day"),
      dataIndex: "priceperday",
      key: "priceperday",
    },
    {
      title: getLocaleMessages("Total rental days"),
      dataIndex: "totalrentaldays",
      key: "totalrentaldays",
    },
    {
      title: getLocaleMessages("Total Amount"),
      dataIndex: "totalcost",
      key: "totalcost",
    },

    {
      title: getLocaleMessages("Status"),
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <a>
          {status == 1
            ? getLocaleMessages("Completed")
            : status == 2
            ? getLocaleMessages("Booked")
            : getLocaleMessages("Cancelled")}
        </a>
      ),
    },
  ];

  const inbookingHeader = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Booking No"),
      dataIndex: "bookingno",
      key: "bookingno",
    },
    {
      title: getLocaleMessages("Booking Date"),
      dataIndex: "bookingdate",
      key: "bookingdate",
      render: (bookingdate) => (
        <span>{format(new Date(bookingdate), "dd/MM/yyyy hh:mm:ss")}</span>
      ),
    },
    {
      title: getLocaleMessages("Deposit"),
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: getLocaleMessages("Price per day"),
      dataIndex: "priceperday",
      key: "priceperday",
    },
    {
      title: getLocaleMessages("Total rental days"),
      dataIndex: "totalrentaldays",
      key: "totalrentaldays",
    },
    {
      title: getLocaleMessages("Total Amount"),
      dataIndex: "totalcost",
      key: "totalcost",
    },

    {
      title: getLocaleMessages("Status"),
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <a>
          {status == 1
            ? getLocaleMessages("Completed")
            : status == 2
            ? getLocaleMessages("Booked")
            : getLocaleMessages("Cancelled")}
        </a>
      ),
    },
  ];
  const onFormLayoutChange = (values) => {
    // setComponentSize(size);
    const {
      carno,
      carbrandid,
      carmodelid,
      caryearid,
    } = usedForm.getFieldsValue();
    const payload = {
      carno: carno !== undefined ? carno : "",
      carbrand: carbrandid !== undefined ? carbrandid : -1,
      // carmodel: carmodelid !== undefined ? carmodelid : -1,
      caryear: caryearid !== undefined ? caryearid : 0,
      carstatus: carStatus,
    };
    dispatch({
      type: settingsAction.GET_CAR_FILTER_MANAGEMENT_INFO,
      payload: payload,
    });
  };

  const onCarStatusChange = (status) => {
    setcarStatus(status == 0 ? 2 : status);
    // dispatch({
    //   type: settingsAction.GET_CAR_MANAGEMENT_INFO,
    //   payload: ,
    // });
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  const handleSearchInput = () => {
    setcardata(carmanagement_data.filter);
  };
  const handleCreateNewCar = () => {
    history.replace("cars/create");
  };
  useEffect(() => {
    dispatch({
      type: settingsAction.GET_CAR_MANAGEMENT_INFO,
      payload: carStatus,
    });
    setcardata(carmanagement_data);
  }, [carStatus]);

  useEffect(() => {
    let initialValue = {
      bookingno: "",
      status: "",
    };
    dispatch({
      type: dashboardActions.GET_DASHBOARD_BOOKINGS,
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
        <Title level={2} className="mb_30">
          {getLocaleMessages("Payment Details")}
        </Title>

        <Row gutter={20} className="dashboard-boxes">
          <Col span={6}>
            <Card className="customer-count">
              <Statistic
                title={getLocaleMessages("Total Income")}
                value="25000 SAR"
              />
              <UserOutlined />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="customer-count">
              <Statistic
                title={getLocaleMessages("Website Income")}
                value="12300 SAR"
              />
              <UserOutlined />
            </Card>
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
                  label={getLocaleMessages("Car No")}
                  name="carno"
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
                <Form.Item
                  label={"Brand"}
                  name={"carbrandid"}
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Select brand of the car"),
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
                    {carinformation.brand &&
                      carinformation.brand.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.carbrandname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={"Model"}
                  name={"carmodelid"}
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Select car model"),
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
                    autoComplete={"off"}
                    placeholder={""}
                    dropdownStyle={{ minWidth: "200px" }}
                  >
                    {carinformation.model &&
                      carinformation.model.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.carmodelname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={"Year"}
                  name={"caryearid"}
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Select year of the car"),
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
                    autoComplete={"off"}
                    placeholder={""}
                    dropdownStyle={{ minWidth: "200px" }}
                  >
                    {carinformation.year &&
                      carinformation.year.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.caryearname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}

        <Title level={2} className="mb_30">
          {getLocaleMessages("Completed Payment")}
        </Title>

        <Table columns={bookingHeader} dataSource={admin_dashboard_bookings} />
        <Title level={2} className="mb_30">
          {getLocaleMessages("Incompleted Payment")}
        </Title>

        <Table
          columns={inbookingHeader}
          dataSource={admin_dashboard_bookings}
        />
      </div>
    </LoadingOverlay>
  );
};

export default PaymentManagement;
