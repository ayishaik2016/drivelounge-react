import React, { useEffect, useState } from "react";
import { Layout, Button, Row, Col, Input, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import actions from "../../../redux/auth/actions";
import "./../../../assets/css/adminStyle.css";
import { formProps } from "../../../helpers/constant";
import { getLocaleMessages } from "redux/helper";

const { Content } = Layout;

const LoginForm = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { loader, isAgencyForgot } = useSelector((state) => state.Auth);
  const onLogin = (values) => {
    let data = {
      ...values,
      usertypeid: 2,
      panel: "Agency",
    };
    dispatch({
      type: actions.USER_RESET_PASSWORD,
      payload: data,
    });
  };

  useEffect(() => {
    usedForm.resetFields();
  }, [isAgencyForgot, usedForm]);

  return (
    <Layout className={"on-boarding"}>
      <Content>
        <section className="login-dashboard agency_lo_sign">
          <div
            style={{
              position: "absolute",
              top: "20px",
              bottom: "0px",
              right: "100px",
            }}
          >
            <NavLink
              to="/"
              style={{
                width: "45px",
                height: "45px",
                position: "fixed",
                top: "20px",
                right: "35px",
                background: "#00000070",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "25px",
                color: "#fff",
                borderRadius: "35px",
              }}
            >
              {" "}
              <span role="img" aria-label="close" class="anticon anticon-close">
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="close"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                </svg>
              </span>{" "}
            </NavLink>
          </div>
          <div className="container">
            <div className="login-box">
              <div className="logo"></div>
              <h4>{getLocaleMessages("Change Password")}</h4>

              <Form form={usedForm} onFinish={onLogin} {...formProps}>
                <Form.Item
                  name="password"
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
                  <Input.Password placeholder={getLocaleMessages("Password")} />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages(
                        "Please confirm your password!"
                      ),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            getLocaleMessages(
                              "The two passwords that you entered do not match!"
                            )
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder={getLocaleMessages("Confirm Password")}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loader}
                    disabled={loader}
                  >
                    {getLocaleMessages("Reset")}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </section>
      </Content>
    </Layout>
  );
};

export default LoginForm;
