import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Button, Radio } from "antd";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/admin/settings/actions";
import { getLocaleMessages } from "redux/helper";

const AdminProfileModal = (props) => {
  const [formPass] = Form.useForm();
  const dispatch = useDispatch();
  const { visible, onCancel, admin_profile } = props;
  const [Status, setStatus] = useState(false);
  const handleOnFinish = (values) => {
    let data = {
      id: admin_profile.id,
      roleid: admin_profile.roleid,
      firstname: values.firstname,
      lastname: values.lastname,
      username: values.username,
      email: values.email,
      contactnumber: values.contactnumber,
      status: Status,
    };
    dispatch({
      type: actions.UPDATE_ADMIN_PROFILE,
      payload: { ...data },
    });
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    formPass.setFieldsValue({ status: e.target.value });
  };
  useEffect(() => {
    if (admin_profile !== undefined && admin_profile.id > 0) {
      formPass.setFieldsValue({
        firstname: admin_profile.firstname,
        lastname: admin_profile.lastname,
        username: admin_profile.username,
        email: admin_profile.email,
        contactnumber: admin_profile.contactnumber,
        roleid: admin_profile.roleid,
        status: admin_profile.status,
      });
    }
  }, [admin_profile]);
  return (
    <Modal
      footer={false}
      title={getLocaleMessages("Update Profile")}
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
          form={formPass}
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
                )} ${getLocaleMessages("Last Name")}`,
              },
            ]}
          >
            <Input placeholder={getLocaleMessages("Last Name")} />
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
          >
            <Input placeholder={getLocaleMessages("User Name")} />
          </Form.Item>
          {/* <Form.Item
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password type="password" placeholder="Password" />
          </Form.Item> */}
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
                message: `${getLocaleMessages("Invalid email")}`,
              },
            ]}
          >
            <Input placeholder={getLocaleMessages("Email")} />
          </Form.Item>
          <Form.Item
            name="contactnumber"
            rules={[
              {
                required: true,
                message: getLocaleMessages("Contact number is required"),
              },
              {
                min: 10,
                message: getLocaleMessages(
                  "Contact number should be minimum 6 digits."
                ),
              },
              {
                max: 10,
                message: getLocaleMessages(
                  "Contact number should be maximum 15 digits."
                ),
              },
            ]}
          >
            <Input placeholder={getLocaleMessages("Contact Number")} />
          </Form.Item>

          <Form.Item label={getLocaleMessages("Status")} name={"status"}>
            <Radio.Group
              onChange={handleStatus}
              defaultValue={Status}
              value={Status}
            >
              <Radio value={1}>{getLocaleMessages("Active")}</Radio>
              <Radio value={2}>{getLocaleMessages("InActive")}</Radio>
            </Radio.Group>
          </Form.Item>
          <div className="button-center">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {getLocaleMessages("Update")}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AdminProfileModal;
