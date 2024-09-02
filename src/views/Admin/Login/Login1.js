import React, { useEffect, useState } from "react";
import { Layout, Button, Row, Col, Input, Form, Typography, Modal } from "antd";
import { InputOTP } from 'antd-input-otp';
import { useSelector, useDispatch } from "react-redux";
import actions from "../../../redux/auth/actions";
import "./../../../assets/css/adminStyle.css";
import { formProps } from "../../../helpers/constant";
import { history } from "../../../redux/store";
import authAction from "../../../redux/auth/actions";
import { getLocaleMessages } from "redux/helper";

const { Content } = Layout;
const { Title } = Typography;
const LoginForm = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { loader, isAdminForgot } = useSelector((state) => state.Auth);
  const [otpDialog, setOtpDialog] = useState(false);
  const [otp, setOtp] = useState(); 

 const [otpreference,setOtpreference] =useState();
  const onLogin = (values) => {
    if (history.location.pathname === "/admin/login") {
      dispatch({
        type: actions.ADMIN_AUTHENTICATE_USER,
        payload: values,
        callBackAction: (res) =>{
          if(res.status === 200){
            setOtpDialog(true);
            setOtpreference(res.data.user_data.otpreference);
          }
        }
      });
    }
    // else if(history.location.pathname === '/vendor/login'){
    //   dispatch({
    //     type: actions.VENDOR_AUTHENTICATE_USER,
    //     payload: values,
    //   });
    // }
  };

  const handleResendOtp = () => {
    let data = {
      username:usedForm.getFieldsValue().username,
      otpreference: otpreference,
    };
    dispatch({
      type: actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND,
      payload: data,
      callBackAction: (res) =>{
        if(res.status === 200){
          setOtpreference(res.data.user_data.otpreference);
        }
      }
    });
  };

  const handleFinish = (input) => {
    const payload = input.join("") || otp.join("") ; 
    let data = {
      otp: payload,
      username:usedForm.getFieldsValue().username,
      otpreference: otpreference,
    };
    dispatch({
      type: actions.ADMIN_AUTHENTICATE_USER_PRE_OTP,
      payload: data,
      callBackAction: (res) =>{
        if(res.status === 200){
          // dispatch({
          //   type: actions.ADMIN_AUTHENTICATE_USER_PRE_OTP,
          //   payload: true,
          // });
        }
      }
    });
  };

  const onForgot = (values) => {
    if (history.location.pathname === "/admin/login") {
      dispatch({
        type: actions.ADMIN_SEND_PASSWORD_RESET_LINK,
        payload: values,
      });
    }
    // else if(history.location.pathname === '/vendor/login'){
    //   dispatch({
    //     type: actions.VENDOR_SEND_PASSWORD_RESET_LINK,
    //     payload: values,
    //   });
    // }
  };

  const onChangeForgot = () => {
    dispatch({
      type: authAction.SET_SHOW_ADMIN_FORGOT,
      payload: true,
    });
  };

  const onChangeLogin = () => {
    dispatch({
      type: authAction.SET_SHOW_ADMIN_FORGOT,
      payload: false,
    });
  };

  useEffect(() => {
    usedForm.resetFields();
  }, [isAdminForgot, usedForm]);

  const handleCancel = () => {
    setOtpDialog(false);
  };

  return (
    <>
      <Layout className={"on-boarding login-full"}>
        <Content>
          {/*Admin-login*/}
          <section className="login-dashboard">
            <div className="container">
              <div className="login-box">
                <div className="logo">
                  {/* <img
                                        src={
                                            require('../../../assets/images/logo1.png')
                                                .default
                                        }
                                        alt="logo"
                                    /> */}
                  <Title level={4}> {getLocaleMessages("Login")}</Title>
                </div>
                <Form
                  form={usedForm}
                  onFinish={isAdminForgot ? onForgot : onLogin}
                  {...formProps}
                >
                  <Form.Item
                    name={isAdminForgot ? "email" : "username"}
                    validateTrigger={"onBlur"}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: getLocaleMessages("Please input your name"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={getLocaleMessages("Email or Username")}
                      autoComplete={"off"}
                    />
                  </Form.Item>
                  {!isAdminForgot && (
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: getLocaleMessages("Password can't be blank"),
                        },
                      ]}
                    >
                      <Input.Password
                        style={{
                          "& .ant-input-affix-wrapper > input.ant-input": {
                            padding: "2px",
                          },
                        }}
                        placeholder={getLocaleMessages("Password")}
                      />
                    </Form.Item>
                  )}
                  <div
                    style={{
                      textAlign: "right",
                      marginBottom: "20px",
                    }}
                  >
                    <span
                      onClick={() =>
                        isAdminForgot ? onChangeLogin() : onChangeForgot()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {isAdminForgot
                        ? `< ${getLocaleMessages("Back to Login")}`
                        : getLocaleMessages("Forgot Password?")}
                    </span>
                  </div>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loader}
                      disabled={loader}
                    >
                      {getLocaleMessages("Submit")}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </section>
          {/*Admin Login*/}
        </Content>
      </Layout>
      {
        <Modal title={getLocaleMessages("Enter the OTP")}
        visible={otpDialog}
        centered
        footer={false}
        className="modal-ui-1"
        width="30%"
        destroyOnClose
        onCancel={handleCancel}
         >
        <div width="30%">
          <div style={{direction: 'ltr'}}>
            <InputOTP length={4} onChange={setOtp} value={otp} />
          </div>
          <div style={{textAlign:"right"}} >
            <Button type="link" style={{ marginTop: 4 }} onClick={(e) => handleResendOtp()}>
            {getLocaleMessages("Resend OTP")}
            </Button>
          </div>
          <div style={{textAlign:"center"}} >
          <Button type="primary" onClick={(e) => handleFinish(otp)}>Submit</Button>
          </div>
        </div>
        </Modal>
      }
    </>
  );
};

export default LoginForm;
