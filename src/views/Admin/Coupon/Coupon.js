import React, { useState, useEffect } from "react";
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
  Switch,
  Form,
  DatePicker,
  Modal,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formProps } from "./../../../helpers/constant";
import UploadImages from "./../../../components/shared/uploadImages";
import settingsAction from "./../../../redux/admin/booking/actions";
import "./../../../assets/css/adminStyle.css";
// import { getLocaleMessages } from "./../../../redux/helper";

import format from "date-fns/format";
import { getLocaleMessages } from "redux/helper";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Column, ColumnGroup } = Table;
const { Title } = Typography;
LoadingOverlay.propTypes = undefined;

const CouponManagement = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { bookings } = useSelector((state) => state.BookingInfo);
  const [showFilter, setshowFilter] = useState(false);
  const columns = [
    {
      title: "#",
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

  const { modalVisible, setModalVisible } = props;
  const [setLocalImage, setLocalImageFunc] = useState([]);
  // const { getVendorCouponLanguage } = useSelector((state)=> state.VendorCoupon);

  const onFinish = (values) => {};
  const onChange = (checked) => {};

  const rangeConfig = {
    rules: [
      {
        type: "array",
        required: true,
        message: getLocaleMessages("Please select time"),
      },
    ],
  };

  const onDropImage = (pictureFiles) => {
    setLocalImageFunc(pictureFiles);
  };
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
    <div>
      <Modal
        className="add-vocher"
        title={getLocaleMessages("Create a Vocher Type")}
        sub={getLocaleMessages("Step 1 of 2: Add Your Coupon Type Info")}
        centered
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={1000}
      >
        <Row className="modal-content">
          <Col span={10} className="inner-content modal-content bg-gray">
            <h2>{getLocaleMessages("Vocher Info")}</h2>
            <Form {...formProps} onFinish={onFinish}>
              <Form.Item label={getLocaleMessages("CouponName")}>
                <Input />
              </Form.Item>
              <Form.Item label={getLocaleMessages("CouponDescription")}>
                <Input />
              </Form.Item>
              <Form.Item label={getLocaleMessages("CouponValue")}>
                <Input />
              </Form.Item>
              <Form.Item label={getLocaleMessages("CouponMinimumValue")}>
                <Input />
              </Form.Item>
              <Form.Item label={getLocaleMessages("CouponMaximumValue")}>
                <Input />
              </Form.Item>
              <Form.Item
                label={getLocaleMessages("Valid Date")}
                name="range-picker"
                {...rangeConfig}
              >
                <RangePicker />
              </Form.Item>
              <label>{getLocaleMessages("Limit Amount of Sales")}</label>
              <br />
              <Switch defaultChecked onChange={onChange} /> <br />
              <label>{getLocaleMessages("No of Sales")} </label>
              <Form.Item>
                <Select placeholder="10">
                  <Option value="1">1</Option>
                  <Option value="10">10</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <label>{getLocaleMessages("Service Include")}</label>
                <Input />
              </Form.Item>
            </Form>
          </Col>
          <Col span={12} className="inner-content">
            <Card
              className="mg-auto Coupon-full"
              bordered={false}
              justify={"space-around"}
              align="center"
            >
              <div className="box">
                <div className="Coupon-title">
                  <h2>{getLocaleMessages("Coupon Preview")} </h2>
                  <p>{getLocaleMessages("You have a no active type")}</p>1
                </div>
                <div className="v-box-full">
                  <div className="Coupon-box">
                    <h2>Demo@gmail.com</h2>
                    <p>
                      {getLocaleMessages("Your Location and Address Here")}{" "}
                    </p>
                  </div>
                  <div className="Coupon-box">
                    <h2>{getLocaleMessages("Coupon Value")} </h2>
                    <p>100.00 SAR </p>
                  </div>
                  <div className="Coupon-box">
                    <h2>{`${getLocaleMessages("Coupon Code")}:xxxxxxx`}</h2>
                    <p>
                      {getLocaleMessages(
                        "Reedom all service valid for 3months for multiple use"
                      )}{" "}
                    </p>
                  </div>
                  <div className="Coupon-box">
                    <h2>{getLocaleMessages("Image Upload")} </h2>
                    <UploadImages
                      ploader
                      isSingleImage={true}
                      images={[]}
                      onDropImage={onDropImage}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Modal>
      <Row>
        <Col
          offset={3}
          xs={22}
          md={22}
          lg={22}
          className="dashboard-content mg-auto"
        >
          <Row>
            <Col span={8}>
              {" "}
              <Space>
                <h2>{getLocaleMessages("Activity Log")} </h2>
              </Space>
            </Col>
            <Col span={8} offset={8}>
              <Space style={{ marginBottom: 16 }}>
                <Button onClick={handleFilterShow} type="primary">
                  {getLocaleMessages("Create")}
                </Button>
              </Space>
            </Col>
          </Row>
          {showFilter && (
            <Row>
              <Col offset={20} className="dashboard-content mg-auto">
                <div className="dashboard-form">
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
                              {getLocaleMessages("Completed")}
                            </Option>
                            <Option value={3}>
                              {getLocaleMessages("Cancelled")}
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
                    </Row>
                  </Form>
                </div>
              </Col>
            </Row>
          )}

          <Table columns={columns} dataSource={bookings} />
        </Col>
      </Row>
    </div>
  );
};

export default CouponManagement;
