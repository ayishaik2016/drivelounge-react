import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Select,
  Typography,
  Form,
  Modal,
  Radio,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import settingsAction from "../../../redux/admin/users/actions";
import settings from "../../../redux/admin/agency/actions";
import "./../../../assets/css/adminStyle.css";
import actions from "redux/auth/actions";
import { getLocaleMessages } from "redux/helper";
import { PatternFormat } from "react-number-format";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
LoadingOverlay.propTypes = undefined;
const { Option } = Select;
const { Title } = Typography;

const AdminManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { admin_list, role_list, isLoading } = useSelector(
    (state) => state.AdminInfo
  );
  const [Status, setStatus] = useState(false);
  const [SelectedID, setSelectedID] = useState(0);
  const [visible, setvisible] = useState(false);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Name"),
      dataIndex: "username",
      key: "username",
    },

    {
      title: getLocaleMessages("Email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "userstatus",
      key: "userstatus",
      render: (userstatus, data, idx) => (
        <span>
          {userstatus == 1
            ? getLocaleMessages("Active")
            : getLocaleMessages("InActive")}
        </span>
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "status",
      key: "status",
      render: (status, data, idx) => (
        <span>
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleUserEdit(data.id)}
            type="edit"
          ></Button>{" "}
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleUserDelete(data.id)}
            type="remove"
          ></Button>
        </span>
      ),
    },
  ];

  const handleUserEdit = (id) => {
    setvisible(!visible);
    setSelectedID(id);
    var filter = admin_list.filter((admin) => admin.id === id);
    if (filter.length > 0) {
      usedForm.setFieldsValue({
        firstname: filter[0].firstname,
        lastname: filter[0].lastname,
        username: filter[0].username,
        email: filter[0].email,
        contactnumber: filter[0].contactnumber,
        roleid: filter[0].roleid,
      });
      setStatus(filter[0].status);
    }
  };

  const handleUserDelete = (userid) => {
    dispatch({
      type: settings.REMOVE_ADMIN_DETAILS,
      payload: { id: userid },
    });
    dispatch({
      type: settingsAction.GET_USERS_LIST,
      payload: false,
    });
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    usedForm.setFieldsValue({ status: e.target.value });
  };

  const handleCreateRole = () => {
    setvisible(!visible);
    usedForm.resetFields();
    setSelectedID(0);
  };

  const onCancel = () => {
    setvisible(!visible);
    setSelectedID(0);
    usedForm.resetFields();
    //history.push('agency/create');
  };

  const handleOnFinish = (values) => {
    let user = {
      id: SelectedID > 0 ? SelectedID : -1,
      firstname: values.firstname,
      lastname: values.lastname,
      username: values.username,
      password: values.password,
      email: values.email,
      contactnumber: values.contactnumber,
      roleid: values.roleid,
      status: Status,
    };
    dispatch({
      type: actions.ADMIN_USER_IUD,
      payload: { action: SelectedID > 0 ? "U" : "I", data: user },
    });
    usedForm.resetFields();
    setSelectedID(0);
    setvisible(!visible);
  };
  useEffect(() => {
    dispatch({
      type: settingsAction.GET_USERS_LIST,
      payload: false,
    });
    dispatch({
      type: settingsAction.GET_USEROLES_LIST,
      payload: false,
    });
  }, []);

  return (
    <>
      <LoadingOverlay
        active={isLoading}
        spinner
        text={getLocaleMessages("Loading your content...")}
      >
        <Modal
          footer={false}
          title={
            SelectedID == 0
              ? getLocaleMessages("Create Profile")
              : getLocaleMessages("Update Profile")
          }
          width={480}
          visible={visible}
          onCancel={onCancel}
          destroyOnClose
          className="ant_modal_car"
        >
          <div>
            <Form
              name="normal_login"
              className="login-form"
              onFinish={handleOnFinish}
              form={usedForm}
            >
              <Form.Item
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
                label={getLocaleMessages("First Name")}
              >
                <Input placeholder={getLocaleMessages("First Name")} />
              </Form.Item>
              <Form.Item
                name="lastname"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Lastname")}`,
                  },
                ]}
                label={getLocaleMessages("Lastname")}
              >
                <Input placeholder={getLocaleMessages("Lastname")} />
              </Form.Item>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("User Name")}`,
                  },
                ]}
                label={getLocaleMessages("User Name")}
              >
                <Input placeholder={getLocaleMessages("User Name")} />
              </Form.Item>
              <Form.Item
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
                label={getLocaleMessages("Password")}
              >
                <Input.Password
                  type="password"
                  placeholder={getLocaleMessages("Password")}
                />
              </Form.Item>
              <Form.Item
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
                label={getLocaleMessages("Email")}
              >
                <Input placeholder={getLocaleMessages("Email")} />
              </Form.Item>
              <Form.Item
                label={getLocaleMessages("Contact Number")}
                name="contactnumber"
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

              <Form.Item
                name={"roleid"}
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Select user role"),
                  },
                ]}
                label={getLocaleMessages("User Role")}
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
                  placeholder={getLocaleMessages("User Role")}
                  dropdownStyle={{ minWidth: "200px" }}
                >
                  {role_list &&
                    role_list.map((value) => {
                      return (
                        <Option key={value.id} value={value.id}>
                          {value.rolename}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Form.Item label={getLocaleMessages("Status")} name={"status"}>
                <Radio.Group
                  onChange={handleStatus}
                  defaultValue={Status}
                  value={Status}
                >
                  <Radio value={1} style={{ fontSize: "14px" }}>
                    {getLocaleMessages("Active")}
                  </Radio>
                  <Radio value={2} style={{ fontSize: "14px" }}>
                    {getLocaleMessages("InActive")}
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <div className="button-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  {SelectedID == 0
                    ? getLocaleMessages("Create")
                    : getLocaleMessages("Update")}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <div className="page-container">
          <Row className="head-filter" justify="space-between" align="middle">
            <Col span={8}>
              <Title level={2}>{getLocaleMessages("Administrator")}</Title>
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={handleCreateRole}>
                {getLocaleMessages("Create")}
              </Button>
            </Col>
          </Row>

          <Table rowKey="id" columns={columns} dataSource={admin_list} />
        </div>
      </LoadingOverlay>
    </>
  );
};

export default AdminManagement;
