import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Modal,
  Radio,
  Select,
  Space,
  Form,
  Typography,
  message,
  Card,
  DatePicker
} from "antd";
import dayjs from 'dayjs';
import {
  FilterOutlined,
  EyeOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { formProps } from "./../../../helpers/constant";
import settingsAction from "./../../../redux/admin/customer/actions";
import commonactions from "./../../../redux/common/actions";
import "./../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";
import { PatternFormat } from "react-number-format";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
} from "react-phone-number-input";
LoadingOverlay.propTypes = undefined;

const { Option } = Select;
const { Title, Paragraph } = Typography;

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const [cardForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const { customer_list, card_list, isLoading } = useSelector(
    (state) => state.CustomerDetails
  );
  const [Selected_customer, setSelected_customer] = useState([]);
  const [showFilter, setshowFilter] = useState(false);
  const [SelectedID, setSelectedID] = useState(0);
  const [visible, setvisible] = useState(false);
  const [Status, setStatus] = useState(1);
  const [IsEdited, setIsEdited] = useState(false);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Name"),
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: getLocaleMessages("Contact Number"),
      dataIndex: "contactnumber",
      key: "contactnumber",
      render: (id, data, idx) => {
        return (
          <p className="number_ltr">
            {data?.contactnumber !== undefined && data?.contactnumber !== null
              ? formatPhoneNumberIntl(data?.contactnumber)
              : ""}
          </p>
        );
      },
    },
    {
      title: getLocaleMessages("Email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "status",
      key: "status",
      render: (id, data) => (
        <Select
          showSearch
          onChange={(e) => handleChangeStatus(data.id, e)}
          value={data.userstatus}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          autoComplete={"off"}
          placeholder={"Status"}
          dropdownStyle={{ minWidth: "200px" }}
        >
          <Option key={1} value={1}>
            {getLocaleMessages("Active")}
          </Option>
          <Option key={2} value={2}>
            {getLocaleMessages("Inactive")}
          </Option>
        </Select>
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "status",
      key: "status",
      render: (id, record) => (
        <div>
          <ShowForPermission permission="update" module="cus">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleCustomerEdit(record)}
              type="edit"
            ></Button>
          </ShowForPermission>
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => handleCustomerView(record)}
            type="view"
          />
          <ShowForPermission permission="remove" module="cus">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleCustomerDelete(record.id)}
              type="remove"
            ></Button>
          </ShowForPermission>
        </div>
      ),
    },
  ];
  const { countryList, cityList } = useSelector((state) => state.Common);
  const handleCustomerEdit = (values) => {
    var filter =
      customer_list && customer_list.filter((user) => user.id === values.id);
    setStatus(filter[0].userstatus);
    usedForm.setFieldsValue({
      firstname: filter[0].firstname,
      lastname: filter[0].lastname,
      username: filter[0].username,
      email: filter[0].email,
      password: filter[0].password,
      contactnumber: filter[0].contactnumber,
      status: filter[0].userstatus,
    });
    setvisible(!visible);
    setSelectedID(values.id);
    setIsEdited(true);
  };

  const handleCustomerDelete = (id) => {
    dispatch({
      type: settingsAction.REMOVE_CUSTOMER_DETAILS,
      payload: { id: id, type: 3 },
      callBackAction: () => {
        dispatch({
          type: settingsAction.GET_CUSTOMER_LIST,
          payload: 0,
        });
      },
    });
  };

  const handleCustomerView = ({ id }) => {
    if (id > 0) {
      dispatch({
        type: settingsAction.GET_CARD_LIST,
        payload: id,
      });
    }
    var filter =
      customer_list && customer_list.filter((user) => user.id === id);
    if (filter.length > 0) {
      setSelectedID(id);
      setStatus(filter[0].userstatus);
      setIsEdited(false);
      usedForm.setFieldsValue({
        firstname: filter[0].firstname,
        lastname: filter[0].lastname,
        username: filter[0].username,
        email: filter[0].email,
        password: filter[0].password,
        contactnumber: filter[0].contactnumber,
        nationalityid: filter[0].nationalityid,
        dateofbirth: "13-09-2023",
        passportnumber: filter[0].passportnumber,
        status: filter[0].userstatus,
      });
      // cardForm.setFieldsValue({
      //   carnumber: filter[0].carnumber,
      //   expirydate: filter[0].expirydate,
      //   cvv: filter[0].cvv,
      //   cardholdername: filter[0].cardholdername,
      // })
      setvisible(!visible);
    }
  };
  const handleChangeStatus = (id, e) => {
    dispatch({
      type: settingsAction.SET_CUSTOMER_STATUS,
      payload: { id: id, type: 3, status: e },
    });
  };

  const onFormFilterLayoutChange = () => {
    const { name, email, contactnumber, status } = filterForm.getFieldsValue();
    const filter = {};
    if (name !== undefined && name !== "") {
      filter["name"] = name;
    }
    if (email !== undefined && email !== "") {
      filter["email"] = email;
    }
    if (contactnumber !== undefined && contactnumber !== "") {
      filter["contactnumber"] = contactnumber;
    }
    if (status !== undefined && status !== "") {
      filter["userstatus"] = status;
    }
    let filters = customer_list.filter((props) =>
      Object.entries(filter).every(
        ([key, val]) =>
          !val.length ||
          props[key].toLowerCase()?.trim().includes(val.toLowerCase()?.trim())
      )
    );

    if (filters.length > 0) {
      setSelected_customer(filters);
    }

    if (filters.length == 0) {
      setSelected_customer([]);
    }
    if (
      filter &&
      Object.keys(filter).length === 0 &&
      filter.constructor === Object
    ) {
      setSelected_customer(customer_list);
    }
    // if(filters.length > 0)
    //   setSelected_customer(filters)
    // else
    // setSelected_customer(customer_list)
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  const onCancel = () => {
    setvisible(!visible);
    usedForm.resetFields();
    cardForm.resetFields();
    setSelectedID(0);
  };

  const handleOnFinish = (values) => {
    var data = {
      action: SelectedID == 0 ? "I" : "U",
      id: SelectedID,
      areaid: 1,
      firstname: values.firstname,
      lastname: values.lastname,
      contactnumber: values.contactnumber,
      countryid: 1,
      drivinglicense: "",
      email: values.email,
      panel: "User",
      password: values.password,
      remember: true,
      username: values.username,
      usertypeid: 3,
      status: Status,
    };
    if (data.email) {
      setvisible(!visible);
      setIsEdited(true);
      setSelectedID(0);
      dispatch({
        type: settingsAction.SETUP_NEW_CUSTOMER,
        payload: data,
        callBackAction: () => {
          dispatch({
            type: settingsAction.GET_CUSTOMER_LIST,
            payload: 0,
          });
        },
      });
    }
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    usedForm.setFieldsValue({ status: e.target.value });
  };

  useEffect(() => {
    if (customer_list?.length) {
      setSelected_customer(customer_list);
    }
  }, [customer_list]);

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_CUSTOMER_LIST,
      payload: 0,
    });

    dispatch({
      type: commonactions.GET_COUNTRY_LIST,
      payload: false,
    });
  }, []);
  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Modal
          footer={false}
          title={getLocaleMessages("Customer Information")}
          width="40%"
          visible={visible}
          onCancel={onCancel}
          destroyOnClose
          className="ant_modal_car"
        >
          <div>
            <Form
              name="normal_login"
              className="login-form"
              form={usedForm}
              onFinish={handleOnFinish}
              layout="vertical"
            >
              <Form.Item
                label={getLocaleMessages("First Name")}
                name="firstname"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("First Name")}`,
                  },
                ]}
              >
                <Input
                  readOnly={!IsEdited}
                  placeholder={getLocaleMessages("First Name")}
                />
              </Form.Item>
              <Form.Item
                label={getLocaleMessages("Last Name")}
                name="lastname"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Last Name")}`,
                  },
                ]}
              >
                <Input
                  readOnly={!IsEdited}
                  placeholder={getLocaleMessages("Last Name")}
                />
              </Form.Item>
              {/* <Form.Item
                label={getLocaleMessages("User Name")}
                name="username"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please input your Name!',
                  },
                ]}
              >
                <Input readOnly={!IsEdited} placeholder={getLocaleMessages("User Name")} />
              </Form.Item> */}

              <Form.Item
                label={getLocaleMessages("Email")}
                name="email"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Email")}`,
                  },
                  {
                    type: "email",
                    whitespace: true,
                    message: getLocaleMessages("Invalid email"),
                  },
                ]}
              >
                <Input
                  readOnly={!IsEdited}
                  placeholder={getLocaleMessages("Email")}
                />
              </Form.Item>
              {SelectedID == 0 && (
                <Form.Item
                  label={getLocaleMessages("Password")}
                  name="password"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("Password")}`,
                    },
                    {
                      min: 6,
                      message: getLocaleMessages(
                        "Password must be minimum 6 characters"
                      ),
                    },
                    {
                      max: 16,
                      message: getLocaleMessages(
                        "Password can be maximum 16 characters"
                      ),
                    },
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder={getLocaleMessages("Password")}
                  />
                </Form.Item>
              )}

               <Form.Item
                label={getLocaleMessages("ID/Passport Number")}
                    name="passportnumber"
                    rules={[
                      {
                        required: true,
                        whitespace: false,
                        message: `${getLocaleMessages(
                          "Please input"
                        )} ${getLocaleMessages("ID/Passport Number")}`,
                      },
                      {
                        max: 10,
                        message: getLocaleMessages("ID/Passport Number must be at 10"),
                      },
                    ]}
                  >
                    <Input readOnly={!IsEdited} placeholder={getLocaleMessages("ID/Passport Number")} />
                  </Form.Item>

                  <Form.Item
                    label={getLocaleMessages("DOB")}
                    name="dob"
                    rules={[
                      {
                        required: true,
                        message: `${getLocaleMessages(
                          "Please input"
                        )} ${getLocaleMessages("DOB")}`,
                      }
                    ]}
                  >
                    <DatePicker 
                      readOnly={!IsEdited} 
                      format="DD-MM-YYYY" 
                      disabledDate={(current) => current && current > dayjs().endOf('day')} // Disable future dates
                      placeholder={getLocaleMessages("DOB")}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label={getLocaleMessages("Nationality")}
                    name={"nationalityid"}
                    // rules={[{ required: true, message: `${getLocaleMessages(
                    //   "Please input"
                    // )} ${getLocaleMessages("Nationality")}`, }]}
                  >
                    <Select
                      showSearch
                      allowClear
                      autoComplete={'off'}
                      placeholder={getLocaleMessages("Select your nationality")}
                      dropdownStyle={{ minWidth: '200px' }}
                    >
                      {countryList && countryList.map(value => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.countryname}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  

              <Form.Item
                name="contactnumber"
                label={getLocaleMessages("Contact Number")}
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Contact number is required"),
                  },
                  {
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Contact Number Length")}`,
                    validator: (_, value) => {
                      if (isValidPhoneNumber(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject();
                      }
                    },
                  },
                ]}
              >
                <PhoneInput
                  flagUrl="https://institute.duceapps.com/{XX}.svg"
                  international
                  placeholder={getLocaleMessages("Contact Number")}
                  countryCallingCodeEditable={false}
                  defaultCountry={"SA"}
                />
              </Form.Item>
              {/* <Form.Item
                label={getLocaleMessages("Contact Number")}
                name={"contactnumber"}
                rules={[
                  {
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Contact Number Length")}`,
                    validator: (_, value) => {
                      if (value !== 0 && value !== undefined) {
                        if (
                          value.includes("+")
                            ? value.substring(5, 17).replace(/[^0-9]/g, "")
                                .length === 9
                            : value.length === 9
                        ) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject();
                        }
                      } else {
                        return Promise.reject();
                      }
                    },
                  },
                ]}
              >
                <PatternFormat
                  style={{
                    width: "100%",
                    border: "2px solid rgb(237, 237, 237)",
                    height: "35px",
                    borderRadius: "5px",
                  }}
                  format="+966-#########"
                  allowEmptyFormatting
                  mask="_"
                  name={"contactnumber"}
                  onChange={(e) => {
                    usedForm.setFieldsValue(e.target.value.substring(7, 17));
                  }}
                />
              </Form.Item> */}

              <Form.Item label={getLocaleMessages("Status")} name={"status"}>
                <Radio.Group
                  onChange={handleStatus}
                  value={Status}
                  disabled={!IsEdited}
                >
                  <Radio
                    value={1}
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {getLocaleMessages("Active")}
                  </Radio>
                  <Radio
                    value={2}
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {getLocaleMessages("Inactive")}
                  </Radio>
                </Radio.Group>
              </Form.Item>

              {visible && (
                <div className="button-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  />
                </div>
              )}
              {IsEdited && (
                <div className="button-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    {SelectedID <= 0 && visible
                      ? getLocaleMessages("Create")
                      : getLocaleMessages("Update")}
                  </Button>
                </div>
              )}
            </Form>
          </div>
          {!IsEdited &&
            SelectedID > 0 &&
            card_list &&
            card_list.map((card, idx) => (
              <Card
                size="small"
                className="credid_card_info"
                key={idx}
                title={`${getLocaleMessages("Credit Card")}  - ${idx + 1}`}
              >
                <Paragraph
                  level={4}
                  label={getLocaleMessages("Card Holder Name")}
                >
                  <span> {`${getLocaleMessages("Card Holder Name")}:`} </span>{" "}
                  <span> {card.cardholdername}</span>
                </Paragraph>
                <Paragraph>
                  <span>{`${getLocaleMessages("Car Number")}:`}</span>{" "}
                  <span> {card.cardnumber} </span>
                </Paragraph>
                <Paragraph>
                  <span>{`${getLocaleMessages("Expiry Date")}:`}</span>{" "}
                  <span>{card.expirydate}</span>
                </Paragraph>
                <Paragraph>
                  <span>{`${getLocaleMessages("CVV Number")}:`}</span>{" "}
                  <span> {card.cvv}</span>
                </Paragraph>
              </Card>
            ))}
        </Modal>
        <Row className="head-filter" justify="space-between" align="middle">
          <Col>
            <Title level={2}>{getLocaleMessages("Customer Management")}</Title>
          </Col>
          <Col span={7}>
            <Button
              onClick={handleFilterShow}
              type="primary"
              icon={<FilterOutlined />}
            >
              {getLocaleMessages("Filter")}
            </Button>
            <ShowForPermission permission="create" module="cus">
              <Button
                onClick={() => {
                  usedForm.resetFields();
                  setvisible(!visible);
                  setIsEdited(true);
                }}
                icon={<UserOutlined />}
              >
                {getLocaleMessages("Create")}
              </Button>
            </ShowForPermission>
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
                <Form.Item name="name">
                  <Input placeholder={getLocaleMessages("Name")} allowClear />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item name="email">
                  <Input placeholder={getLocaleMessages("Email")} allowClear />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item
                  name="contactnumber"
                  label={getLocaleMessages("Contact Number")}
                >
                  <Input
                    placeholder={getLocaleMessages("Contact Number")}
                    type="number"
                    allowClear
                  />
                </Form.Item>
              </Col>
              {/* <Col span={6} className="inner-content">
                <Form.Item name={'status'}>
                  <Select
                    showSearch
                    allowClear
                    defaultValue={[Status]}
                    onChange={handleFilterStatus}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    autoComplete={'off'}
                    placeholder={'Status'}
                    dropdownStyle={{ minWidth: '200px' }}
                  >
                    <Option key={0} value={0}>
                      All
                    </Option>
                    <Option key={1} value={1}>
                      Active
                    </Option>
                    <Option key={2} value={2}>
                      InActive
                    </Option>
                  </Select>
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        )}

        <Table rowKey="id" columns={columns} dataSource={Selected_customer} />
      </div>
    </LoadingOverlay>
  );
};

export default CustomerManagement;
