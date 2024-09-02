import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Button } from "antd";
import { getLocaleMessages } from "redux/helper";

const ForgotModal = (props) => {
  const { visible, onCancel, onLoginForgot, onFinish, loader } = props;
  const [UserType, setUserType] = useState(3);
  const handleUserType = (type) => {
    setUserType(type);
  };
  const handleOnForgot = (values) => {
    onFinish({
      ...values,
      usertypeid: UserType,
      panel: UserType == 3 ? "User" : "Agency",
    });
  };

  return (
    <Modal
      title={false}
      visible={visible}
      onCancel={onCancel}
      centered
      footer={false}
      width="100%"
      destroyOnClose
      className="modal-ui-1"
    >
      <div className="modal-body-ui">
        {/* <div className="flex-buttons-1">
            <Button className={UserType == 3 ? 'active' : 'none'} onClick={()=>handleUserType(3)}>USER</Button>
            <Button className={UserType == 2 ? 'active' : 'none'} onClick={()=>handleUserType(2)}>AGENCY</Button>
        </div> */}
        <h2>{getLocaleMessages("Forgot Password?")}</h2>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={handleOnForgot}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: getLocaleMessages("Please input your email"),
              },
              {
                type: "email",
                message: getLocaleMessages("Invalid email"),
              },
            ]}
          >
            <Input
              autoComplete="new-password"
              placeholder={getLocaleMessages("Email")}
            />
          </Form.Item>
          <div className="text-right forgotLink">
            <div onClick={() => onLoginForgot({ login: true, forgot: false })}>
              {getLocaleMessages("Back to login")}
            </div>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loader}
              disabled={loader}
            >
              {getLocaleMessages("Submit")}
            </Button>
          </Form.Item>
        </Form>

        {/* 
                <span className="or">(OR)</span>
                <div className="contactsocial">
                    <span className="btns"><FacebookFilled /></span>
                    <span className="btns"><GoogleOutlined /></span>
                </div>
                */}
      </div>
      <div className="modal-ui-right">
        //{" "}
        <img
          src={require("./../../../assets/images/forgotpassword.png").default}
          alt="login"
        />
        //{" "}
      </div>
    </Modal>

    //     <Modal
    //         title={false}
    //         visible={visible}
    //         onCancel={onCancel}
    //         centered
    //         footer={false}
    //         className="modal-ui-1"
    //         width="100%"
    //         destroyOnClose
    //     >
    //      <div className="modal-body-ui">
    //         <h2>Forgot Password</h2>

    //     </div>

    //     <div className="modal-ui-right">
    //         <img src={require("./../../../assets/images/forgotpassword.png").default} alt="login" />
    //     </div>

    // </Modal>
  );
};

export default ForgotModal;
