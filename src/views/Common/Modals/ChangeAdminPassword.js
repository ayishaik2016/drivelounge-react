import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Button, Radio, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/admin/settings/actions";
import authactions from "./../../../redux/auth/actions";
import { getLocalDataType, getLocaleMessages } from "redux/helper";

const ChangeAdminModal = (props) => {
  const [formPass] = Form.useForm();
  const dispatch = useDispatch();
  const { visible, setChangePassword, onCancel, admin_profile } = props;

  const handleOnFinish = (values) => {
    if (values.newpassword == values.confirmpassword) {
      let data = {
        id: admin_profile.id,
        usertypeid: 1,
        oldpassword: values.oldpassword,
        newpassword: values.newpassword,
        confirmpassword: values.confirmpassword,
      };
      dispatch({
        type:
          getLocalDataType() == "admin"
            ? actions.UPDATE_ADMIN_PASSWORD
            : actions.UPDATE_AGENT_PASSWORD,
        payload: { ...data },
      });
      dispatch({
        type: authactions.LOGOUT_USER,
      });
      setChangePassword(!visible);
    } else {
      message.error(getLocaleMessages("Password mismatch"));
      return;
    }
  };

  useEffect(() => {
    formPass.resetFields();
  }, []);
  return (
    <Modal
      footer={false}
      title={getLocaleMessages("Change Password")}
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
            name="oldpassword"
            rules={[
              {
                required: true,
                whitespace: true,
                message: getLocaleMessages("Please input your old password"),
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder={getLocaleMessages("Old Password")}
            />
          </Form.Item>
          <Form.Item
            name="newpassword"
            rules={[
              {
                required: true,
                whitespace: true,
                message: getLocaleMessages("Please input your password"),
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
              placeholder={getLocaleMessages("New Password")}
            />
          </Form.Item>
          <Form.Item
            name="confirmpassword"
            rules={[
              {
                required: true,
                whitespace: true,
                message: getLocaleMessages("Please input your password"),
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
              placeholder={getLocaleMessages("Confirm Password")}
            />
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

export default ChangeAdminModal;
