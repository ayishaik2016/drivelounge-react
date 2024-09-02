import React, { useEffect } from "react";
import { Layout, Button, Row, Col, Input, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/auth/actions";
import "./../../../assets/css/style.scss";
import "./login-dashboard.scss";
import { formProps } from "./../../../helpers/constant";
import { history } from "./../../../redux/store";
import authAction from "./../../../redux/auth/actions";
import { getLocalData, getLocaleMessages } from "redux/helper";

const { Content } = Layout;

const LoginForm = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { loader, isAdminForgot, showOTP } = useSelector((state) => state.Auth);
  const onLogin = (values) => {
    if (history.location.pathname === "/admin/login") {
      dispatch({
        type: actions.ADMIN_AUTHENTICATE_USER,
        payload: values,
      });
    }
    // else if(history.location.pathname === '/vendor/login'){
    //   dispatch({
    //     type: actions.VENDOR_AUTHENTICATE_USER,
    //     payload: values,
    //   });
    // }
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
                        message: getLocaleMessages(`Please input your name`),
                      },
                      {
                        type: "email",
                        whitespace: true,
                        message: getLocaleMessages("Invalid email"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={getLocaleMessages(
                        "Enter Your Email or Username...."
                      )}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  {!isAdminForgot && (
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: getLocaleMessages(
                            "Please input your password"
                          ),
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
                        autoComplete="new-password"
                        placeholder={getLocaleMessages("enter your password")}
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



                {/* OTP Dialog */}
				      {showOTP && (
				        <div>
				          <h2>Enter OTP</h2>
				          {/* Your OTP input field and submit button */}
				          <input type="text" placeholder="Enter OTP" />
				          <button>Submit OTP</button>
				        </div>
      				)}

              </div>
            </div>
          </section>
          {/*Admin Login*/}
        </Content>
      </Layout>
    </>
  );
};

export default LoginForm;
