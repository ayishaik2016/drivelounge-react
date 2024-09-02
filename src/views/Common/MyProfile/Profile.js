import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Input,
  Form,
  Modal,
  message,
  Divider,
  Space,
} from "antd";
import "../../../assets/css/userStyle.css";
import actions from "./../../../redux/user/actions";
import authactions from "./../../../redux/auth/actions";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import ProfileHead from "./ProfileHeader";
import { getLocaleMessages } from "redux/helper";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import OTP from "./../../Common/Modals/OneTimePassword";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;

const Profile = () => {
  const { subLang, loader, isLoggedIn, isOtp, isemail } = useSelector(
    (state) => state.Auth
  );
  const [form] = Form.useForm();
  const [formPass] = Form.useForm();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.CarReservation);
  const [UserId, setUserId] = useState(
    JSON.parse(localStorage.getItem("user_data"))["id"]
  );
  const [visible, setvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOtpVisible, SetIsOtpVisible] = useState(false);
  const [OTPdata, setOTPdata] = useState("");

  const onFinishUpdateProfile = (values) => {
    let data = {
      id: UserId,
      usertypeid: 3,
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      contactnumber: values.contactnumber,
      address: values.address,
      otp: OTPdata,
    };
    setLoading(true);
    dispatch({
      type: actions.UPDATE_USER_PROFILE,
      payload: { ...data },
      callBackAction: (resp) => {
        window.location.reload();
        if (resp?.status < 400) {
          setOTPdata("");
          dispatch({
            type: actions.GET_USER_PROFILE,
            payload: UserId,
          });
          if (resp?.data?.data?.length > 0) {
            localStorage.setItem(
              "user_data",
              JSON.stringify(resp?.data?.data[0])
            );
          }
          message.success(resp.data.name);
          setLoading(false);
        } else {
          setOTPdata("");
          setLoading(false);
        }
      },
    });
  };

  const onFinishChangePassword = (values) => {
    if (values.newpassword == values.confirmpassword) {
      let data = {
        id: UserId,
        usertypeid: 3,
        newpassword: values.newpassword,
        confirmpassword: values.confirmpassword,
      };
      dispatch({
        type: actions.UPDATE_USER_PASSWORD,
        payload: { ...data },
      });
      dispatch({
        type: authactions.LOGOUT_USER,
      });
      formPass.resetFields();
      setvisible(!visible);
    } else {
      message.error(getLocaleMessages("Password mismatch"));
    }
  };

  const onFinishOTP = () => {
    if (OTPdata.length === 4) {
      SetIsOtpVisible(false);
      message.info(
        getLocaleMessages("Please click update to save the changes")
      );
      // dispatch({
      //   type: authactions.VERIFY_OTP,
      //   payload: {
      //     otp: OTPdata,
      //     email: isemail,
      //   },
      //   callBackAction: () => {
      //     SetIsOtpVisible(false);
      //     setOTPdata("");
      //     setIsModalVisible(false);
      //     showLModal({ loginModalVisible: true });
      //   },
      // });
    } else {
      message.error(getLocaleMessages("Please enter valid OTP"));
    }
  };

  const onChangeOTP = (value) => {
    setOTPdata(value);
  };

  const senEmail = async () => {
    const body = {
      email: form.getFieldValue("email"),
      id: UserId,
      contactnumber: form.getFieldValue("contactnumber"),
    };
    console.log("body", body);
    dispatch({
      type: actions.UPDATE_USER_EMAIL,
      payload: { ...body },
      callBackAction: (resp) => {
        if (resp?.status < 400) {
          console.log("SUCCESS RESPONSE", resp);
          message.success(resp.data.name);
          SetIsOtpVisible(true);
        } else {
          message.error("Error please check your email");
        }
      },
    });
  };

  useEffect(() => {
    const { firstname, lastname, email, contactnumber, address } = {
      ...profile,
    };
    form.setFieldsValue({ firstname, lastname, email, contactnumber, address });
  }, [profile]);

  useEffect(() => {
    dispatch({
      type: actions.GET_USER_PROFILE,
      payload: UserId,
    });
  }, []);
  console.log("FORM", form.getFieldsValue());
  return (
    <>
      <Layout className={"on-boarding"}>
        <Header />
        <Content className="content_mt">
          <ProfileHead {...profile} selectionKey="profile" />
          <section className="my-account">
            <Modal
              title={getLocaleMessages("Change Password")}
              visible={visible}
              onCancel={() => setvisible(!visible)}
              centered
              footer={false}
              className="card-body"
              width="40%"
              destroyOnClose
            >
              <Row gutter={20}>
                <Col span={24} className="modal-ui-2">
                  <div className="container">
                    <Form
                      layout="vertical"
                      form={formPass}
                      onFinish={onFinishChangePassword}
                    >
                      <Form.Item
                        label={getLocaleMessages("New Password")}
                        name="newpassword"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: `${getLocaleMessages(
                              "Please input"
                            )} ${getLocaleMessages("New Password")}`,
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                        label={getLocaleMessages("Confirm Password")}
                        name="confirmpassword"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: `${getLocaleMessages(
                              "Please input"
                            )} ${getLocaleMessages("Confirm Password")}`,
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="btn-save"
                      >
                        {getLocaleMessages("Update Password")}
                      </Button>
                    </Form>
                  </div>
                </Col>
              </Row>
            </Modal>
            <div className="container smallsize">
              <Title level={3} className="profile-header">
                {getLocaleMessages("Profile Information")}
              </Title>
              <Form
                form={form}
                name="basic"
                layout="vertical"
                className="form-input-1"
                onFinish={onFinishUpdateProfile}
              >
                <Row gutter={30}>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("First Name")}
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: getLocaleMessages(
                            "Please input your firstname"
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("Last Name")}
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: getLocaleMessages(
                            "Please input your lastname"
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={30}>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("Email")}
                      name="email"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: getLocaleMessages("Please input your email"),
                        },
                        {
                          type: "email",
                          whitespace: true,
                          message: getLocaleMessages("Invalid email"),
                        },
                      ]}
                    >
                      <Input
                        addonAfter={
                          <Button
                            style={{
                              border: "none",
                              background: "#bcab83",
                              color: "white",
                            }}
                            onClick={() => {
                              senEmail();
                            }}
                          >
                            {getLocaleMessages("Send OTP")}
                          </Button>
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="contactnumber"
                      label={getLocaleMessages("Contact Number")}
                      rules={[
                        {
                          required: true,
                          message: getLocaleMessages(
                            "Contact number is required"
                          ),
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
                  </Col>
                  <Col span={12}>
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
                                  ? value
                                      .substring(5, 17)
                                      .replace(/[^0-9]/g, "").length === 9
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
                          formPass.setFieldsValue(
                            e.target.value.substring(7, 17)
                          );
                        }}
                      />
                    </Form.Item> */}
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={getLocaleMessages("Address")}
                      name="address"
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
                {/* <div className="text-right">
								
							</div> */}
                <div className="text-right">
                  <Space>
                    <Button
                      type="primary"
                      className="cs-antd-btn"
                      onClick={() => setvisible(!visible)}
                    >
                      {getLocaleMessages("Change Password")}
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="cs-antd-btn"
                      loading={loading}
                    >
                      {getLocaleMessages("Update")}
                    </Button>
                  </Space>
                </div>
              </Form>

              {/* <Title level={3} className="profile-header">
							Change Password
						</Title>

						<Form
							form={formPass}
							name="basic"
							layout="vertical"
							className="form-input-1"
							onFinish={onFinishChangePassword}
						>
							<Row gutter={30}>
								<Col span={12}>
									<Form.Item
										label="Old Password"
										name="oldpassword"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={12}></Col>
							</Row>
							<Row gutter={30}>
								<Col span={12}>
									<Form.Item
										label="New Password"
										name="newpassword"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Confirm Password"
										name="confirmpassword"
									>
										<Input />
									</Form.Item>
								</Col>
							</Row>
							<div className="text-right">
								<Button
									type="primary"
									htmlType="submit"
									className="cs-antd-btn"
								>
									Update Password
								</Button>
							</div>
						</Form> */}
            </div>
          </section>
          <Modal
            title={false}
            visible={isOtpVisible}
            onCancel={() => {
              SetIsOtpVisible(false);
              setOTPdata("");
            }}
            centered
            footer={false}
            className="modal-ui-1 modal-otp"
            width="100%"
            destroyOnClose
          >
            <div className="modal-body-ui">
              <h2> {getLocaleMessages("OTP Verification")} </h2>
              <p className="sub">
                {getLocaleMessages("Enter the OTP you received to")} <br />{" "}
                {form.getFieldValue("email")}
              </p>
              <div className="ant-form-item-four">
                <OTP OTPdata={OTPdata} onChangeOTP={onChangeOTP} />
              </div>
              <div className="ant-form-item">
                <Button
                  type="primary"
                  disabled={loader}
                  loading={loader}
                  onClick={onFinishOTP}
                >
                  {getLocaleMessages("Submit")}
                </Button>
              </div>
              {/* <p className="resend">
                <span onClick={resendOTP}>
                  {" "}
                  {getLocaleMessages("Resend OTP")}{" "}
                </span>
              </p> */}
            </div>
            <div className="modal-ui-right">
              <img
                src={require("./../../../assets/images/otp.png").default}
                alt="otp"
              />
            </div>
          </Modal>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};
export default Profile;
