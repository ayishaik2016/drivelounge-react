import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Button } from "antd";
import { getLocaleMessages } from "redux/helper";

const SigninModal = (props) => {
  const {
    visible,
    onOk,
    onCancel,
    onLoginForgot,
    onFinish,
    LoginSignup,
    loader,
  } = props;
  const [UserType, setUserType] = useState(3);
  const [usedForm] = Form.useForm();
  const handleOnFinish = (values) => {
    onFinish({
      ...values,
      usertypeid: UserType,
      panel: UserType == 3 ? "User" : "Agency",
    });
  };
  const handleUserType = (type) => {
    setUserType(type);
  };

  useEffect(() => {
    usedForm.resetFields();
  }, []);
  return (
    <Modal
      title={false}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      centered
      footer={false}
      width="100%"
      destroyOnClose
      className="modal-ui-1"
    >
      <div className="modal-body-ui">
        {/* <div className="flex-buttons-1">
            <Button className={UserType == 3 ? 'active' : 'none'} onClick={()=>{handleUserType(3); usedForm.resetFields();}}>USER</Button>
            <Button className={UserType == 2 ? 'active' : 'none'} onClick={()=>{handleUserType(2); usedForm.resetFields();}}>AGENCY</Button>
        </div> */}
        <h2>{getLocaleMessages("Sign In")}</h2>
        <Form
          form={usedForm}
          name="normal_login"
          className="login-form"
          onFinish={handleOnFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                whitespace: true,
                message: getLocaleMessages(
                  "Please input your email / mobile no!"
                ),
              },
            ]}
          >
            <Input placeholder={getLocaleMessages("Email")} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: getLocaleMessages("Please input your Password!"),
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
              autoComplete="new-password"
              placeholder={getLocaleMessages("Password")}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loader}
            >
              {getLocaleMessages("Sign In")}
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center forgotLink">
          <div
            onClick={() =>
              loader ? "" : onLoginForgot({ login: false, forgot: true })
            }
          >
            {getLocaleMessages("Forgot Password?")}
          </div>
        </div>
        <div className="text-center newlinkbottom">
          <p className="new">
            {getLocaleMessages("New around here?")}{" "}
            <span
              style={{ color: "#ac9766" }}
              onClick={() =>
                loader ? "" : LoginSignup({ login: false, signup: true })
              }
            >
              {getLocaleMessages("Signup")}
            </span>{" "}
          </p>
        </div>
      </div>
      <div className="modal-ui-right">
        <img
          src={require("./../../../assets/images/login.png").default}
          alt="login"
        />
        {/* <p className="new">New around here? <span onClick={()=>loader? '':LoginSignup({login:false,signup:true})}>Sign up</span> </p> */}
      </div>
    </Modal>
  );
};

export default SigninModal;
