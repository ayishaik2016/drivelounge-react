import React, { useEffect, useState } from "react";
import { Layout, Button, Row, Col, Input, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import actions from "../../../redux/auth/actions";
import "./../../../assets/css/adminStyle.css";
import { formProps } from "../../../helpers/constant";
import authAction from "../../../redux/auth/actions";
import Signup from "./Signup";
import { getLocaleMessages } from "redux/helper";

const { Content } = Layout;

const LoginForm = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { loader, isAgencyForgot } = useSelector((state) => state.Auth);
  const [IsModelVisible, setIsModelVisible] = useState(false);
  const onLogin = (values) => {
    let data = {
      ...values,
      usertypeid: 2,
      panel: "Agency",
    };
    dispatch({
      type: actions.VENDOR_AUTHENTICATE_USER,
      payload: data,
    });
  };

  const onForgot = (values) => {
    let data = {
      ...values,
      usertypeid: 2,
      panel: "Agency",
    };
    dispatch({
      type: actions.SEND_PASSWORD_RESET_LINK,
      payload: values,
      callBackAction: () => {
        dispatch({
          type: authAction.SET_SHOW_VENDOR_FORGOT,
          payload: false,
        });
      },
    });
  };

  const onChangeForgot = () => {
    dispatch({
      type: authAction.SET_SHOW_VENDOR_FORGOT,
      payload: true,
    });
  };

  const onChangeLogin = () => {
    dispatch({
      type: authAction.SET_SHOW_VENDOR_FORGOT,
      payload: false,
    });
  };

  const LoginSignup = (values) => {
    const data = {
      ...values,
      username: values.email,
      contactnumber: values.contactnumber,
    };
    dispatch({
      type: authAction.CREATE_AUTHENTICATE_VENDOR,
      payload: data,
      callBackAction: (res) => {
        if (res.status < 400) {
          setIsModelVisible(!IsModelVisible);
        }
      },
    });
  };

  useEffect(() => {
    // usedForm.resetFields();
  }, [isAgencyForgot, usedForm]);

  return (
    <>
      <Layout className={"on-boarding"}>
        {IsModelVisible && (
          <Signup
            visible={IsModelVisible}
            onCancel={() => setIsModelVisible(!IsModelVisible)}
            LoginSignup={LoginSignup}
            loader={loader}
            destroyOnClose
          />
        )}

        <Content>
          {/*Admin-login*/}

          <section className="login-dashboard agency_lo_sign">
            <div className="container">
              <div className="login-box">
                <div className="logo">
                  <img
                    src={require("../../../assets/images/logo1.png").default}
                    alt="logo"
                  />
                </div>
                <h4>{getLocaleMessages("Agency Login")}</h4>

                <Form
                  form={usedForm}
                  onFinish={isAgencyForgot ? onForgot : onLogin}
                  {...formProps}
                >
                  <Form.Item
                    name={"email"}
                    validateTrigger={"onBlur"}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: getLocaleMessages(`Please input your name`),
                      },
                      {
                        message: getLocaleMessages("Email is Invalid"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={getLocaleMessages("Email or Username")}
                      autoComplete={"off"}
                    />
                  </Form.Item>
                  {!isAgencyForgot && (
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: (
                            <>{getLocaleMessages("Password can't be blank")}</>
                          ),
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        placeholder={getLocaleMessages("Password")}
                        style={{
                          "& .ant-input": {
                            paddingLeft: "20xpx",
                          },
                        }}
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
                        isAgencyForgot ? onChangeLogin() : onChangeForgot()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {isAgencyForgot
                        ? `< ${getLocaleMessages("Back to login")}`
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

                <div className="text-center">
                  <NavLink to="/" className="btn-text">
                    {getLocaleMessages("Back to Home")}
                  </NavLink>
                </div>

                <p className="new-agency">
                  {getLocaleMessages("New around here?")}
                  <span onClick={() => setIsModelVisible(!IsModelVisible)}>
                    {getLocaleMessages("Sign up")}{" "}
                  </span>
                </p>
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
