import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Avatar,
  Menu,
  Modal,
  Dropdown,
  message,
  Breadcrumb,
  Typography,
} from "antd";
import {
  HashRouter as Router,
  Route,
  Switch,
  Link,
  withRouter,
  NavLink,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/auth/actions";
// import InjectMessage from "components/utility/intlMessages";
import {
  ExclamationCircleOutlined,
  UserAddOutlined,
  GlobalOutlined,
  CaretDownOutlined,
  UserOutlined,
  ProfileOutlined,
  FieldTimeOutlined,
  CommentOutlined,
  LogoutOutlined,
  HeartOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import SignupModal from "./../Modals/Signup";
import SigninModal from "./../Modals/Signin";
import ForgotModal from "./../Modals/Forgot";
import OTP from "./../Modals/OneTimePassword";
import {
  getLocalDataType,
  getLocalData,
  getLocaleMessages,
} from "./../../../redux/helper";
const { Title, Paragraph } = Typography;
const { Content } = Layout;
const breadcrumbNameMap = {
  "/listing": "Choose a car",
  "/detail": "Reservation",
  "/checkout": "Checkout",
  "/confirmation": "Confirmation",
};
const Header = withRouter((props) => {
  const { subLang, loader, isLoggedIn, isOtp, isemail } = useSelector(
    (state) => state.Auth
  );
  const dispatch = useDispatch();
  const localLang = localStorage.getItem("language");
  //modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLVisible, setIsModalLVisible] = useState(false);
  const [isForgotVisible, setIsForgotVisible] = useState(false);
  const [isOtpVisible, SetIsOtpVisible] = useState(false);
  const [OTPdata, setOTPdata] = useState("");
  const [LoggedUsername, setLoggedUsername] = useState("");
  const [ResponsiveMenu, setResponsiveMenu] = useState(false);

  useEffect(() => {
    if (isOtpVisible) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = () => undefined;
    }
  }, [isOtpVisible]);

  useEffect(() => {
    if (isOtp) {
      setIsModalVisible(false);
      SetIsOtpVisible(isOtp);
    } else {
      SetIsOtpVisible(false);
      setOTPdata("");
    }
  }, [isOtp]);

  const showModal = ({ signupModalVisible }) => {
    setIsModalVisible(signupModalVisible);
  };

  const showLModal = ({ loginModalVisible }) => {
    setIsModalLVisible(loginModalVisible);
  };

  const fOk = () => {
    setIsForgotVisible(false);
  };

  useEffect(() => {
    const name = getLocalData("username");
    const fistname = getLocalData("firstname");
    const lastname = getLocalData("lastname");
    if (name !== null) {
      setLoggedUsername(name);
    } else {
      setLoggedUsername(fistname + " " + lastname);
    }
  }, [isLoggedIn]);

  const LoginForgot = ({ login, forgot }) => {
    if (forgot) {
      setIsModalLVisible(login);
      setIsForgotVisible(forgot);
    } else if (login) {
      setIsForgotVisible(forgot);
      setIsModalLVisible(login);
    }
  };

  const LoginSignup = ({ login, signup }) => {
    if (login) {
      setIsModalVisible(signup);
      setIsModalLVisible(login);
    } else if (signup) {
      setIsModalLVisible(login);
      setIsModalVisible(signup);
    }
  };

  const otpOk = () => {
    Modal.confirm({
      title: getLocaleMessages("Warning"),
      icon: <ExclamationCircleOutlined />,
      content: getLocaleMessages(
        "Are you sure to close this modal and the OTP modal never open"
      ),
      okText: "ok",
      cancelText: getLocaleMessages("Cancel"),
      maskClosable: true,
      mask: true,
      onOk: () => {
        dispatch({
          type: actions.VERIFY_OTP_SUCCESS,
        });
      },
    });
  };

  const [SignupData, setSignupData] = useState({});
  const onFinish = (values) => {
    const data = {
      ...values,
      contactnumber: values.contactnumber,
    };
    if (values.usertypeid == 3 && values.agencyname !== "") {
      setSignupData(values);
      dispatch({
        type: actions.CREATE_AUTHENTICATE_USER,
        payload: data,
        callBackAction: () => {
          showModal({ signupModalVisible: false });
          showLModal({ loginModalVisible: true });
        },
      });
    } else {
      dispatch({
        type: actions.CREATE_AUTHENTICATE_VENDOR,
        payload: data,
        callBackAction: () => {
          showModal({ signupModalVisible: false });
          setIsModalVisible(false);
        },
      });
      showModal({ signupModalVisible: false });
    }
  };

  const onFinishLogin = (values) => {
    if (values.usertypeid == 3) {
      dispatch({
        type: actions.AUTHENTICATE_USER,
        payload: values,
        callBackAction: () => {
          showLModal({ loginModalVisible: false });
        },
      });
    } else {
      dispatch({
        type: actions.VENDOR_AUTHENTICATE_USER,
        payload: values,
        callBackAction: () => {
          showLModal({ loginModalVisible: false });
        },
      });
    }
  };
  const onFinishForgot = (values) => {
    dispatch({
      type: actions.SEND_PASSWORD_RESET_LINK,
      payload: values,
      callBackAction: () => {
        LoginForgot({
          login: true,
          forgot: false,
        });
      },
    });
  };

  const onFinishOTP = () => {
    if (OTPdata.length === 4) {
      dispatch({
        type: actions.VERIFY_OTP,
        payload: {
          otp: OTPdata,
          email: isemail,
        },
        callBackAction: () => {
          SetIsOtpVisible(false);
          setOTPdata("");
          showModal({ signupModalVisible: false });
          showLModal({ loginModalVisible: true });
        },
      });
    } else {
      message.error("please enter valid OTP");
    }
  };
  const onChangeOTP = (value) => {
    setOTPdata(value);
  };

  const loginMenu = (
    <Menu>
      <Menu.Item>
        <NavLink to="/profile">
          <ProfileOutlined /> {getLocaleMessages("My Profile")}
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to="/booking">
          <FieldTimeOutlined /> {getLocaleMessages("Bookings")}
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to="/favorites">
          <HeartOutlined /> {getLocaleMessages("Favorites")}
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to="/reviews">
          <CommentOutlined /> {getLocaleMessages("Rate & Reviews")}
        </NavLink>
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => {
          dispatch({
            type: actions.LOGOUT_USER,
          });
        }}
      >
        <LogoutOutlined /> {getLocaleMessages("Logout")}
      </Menu.Item>
    </Menu>
  );

  const menuLanguage = (
    <Menu>
      <Menu.Item
        key="en"
        onClick={(e) => {
          dispatch({
            type: actions.CHANGE_LANGUAGE,
            payload: "en",
          });
        }}
      >
        {localLang === "en" ? "English (EN)" : "الإنجليزية (EN)"}
      </Menu.Item>
      <Menu.Item
        key="ar"
        onClick={(e) => {
          dispatch({
            type: actions.CHANGE_LANGUAGE,
            payload: "ar",
          });
        }}
      >
        {localLang === "en" ? "Arabic (عربي )" : "العربية (ع)"}{" "}
      </Menu.Item>
    </Menu>
  );
  const { location } = props;
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Search</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  const handleContactus = () => {
    const win = window.open("/contactus", "_blank");
    win.focus();
  };

  const handleClickResponsiveMenu = () => {
    setResponsiveMenu(!ResponsiveMenu);
  };

  return (
    <>
      <Layout.Header
        className={ResponsiveMenu ? "site-header shown_mobile" : "site-header"}
      >
        <div className="container">
          <div className="logo">
            {" "}
            <NavLink
              to={{
                pathname: ["admin", "agency"].includes(getLocalDataType())
                  ? `/${getLocalDataType()}/dashboard`
                  : "/",
              }}
              className="logo-link"
            >
              <img
                src={require("./../../../assets/images/logo-icon.png").default}
                alt=""
                className="img-fluid"
              />
            </NavLink>
            <div className="bottom-navigation">
              <ul>
                <li>
                  <NavLink to="/">{getLocaleMessages("Home")}</NavLink>
                </li>
                <li>
                  <NavLink to="/listing">
                    {getLocaleMessages("Explore Vehicles")}
                  </NavLink>
                </li>
                <li>
                  <a onClick={handleContactus}>
                    {getLocaleMessages("Contact us")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="right-navigation">
            {!isLoggedIn && (
              <div className="d-flex">
                <Button
                  type="text"
                  onClick={() => showLModal({ loginModalVisible: true })}
                  icon={<UserOutlined />}
                >
                  {getLocaleMessages("Login")}
                </Button>
                <div className="or"></div>
                <Button
                  type="text"
                  onClick={() => showModal({ signupModalVisible: true })}
                  icon={<UserAddOutlined />}
                >
                  {getLocaleMessages("Register")}
                </Button>
              </div>
            )}

            {isLoggedIn && (
              <div className="d-flex">
                <Dropdown
                  overlay={loginMenu}
                  overlayClassName="extra-menu"
                  trigger={["click"]}
                >
                  <a
                    className="antd-icons-cs"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Avatar size={26} icon={<UserOutlined />} />
                    {`Hi, ${
                      getLocalData("username") !== undefined &&
                      getLocalData("username") !== null
                        ? getLocalData("username").toLocaleLowerCase()
                        : ""
                    }`}
                    <CaretDownOutlined size={2} />
                  </a>
                </Dropdown>
              </div>
            )}

            <Dropdown overlay={menuLanguage} trigger={["click"]}>
              <a
                className="ant-language-link"
                onClick={(e) => e.preventDefault()}
              >
                <GlobalOutlined />
              </a>
            </Dropdown>

            {/* {!isLoggedIn && (
              <Dropdown overlay={loginMenu} trigger={["click"]}>
                <a
                  className="ant-a-menu"
                  onClick={(e) => e.preventDefault()}
                ></a>
              </Dropdown>
            )} */}
          </div>
        </div>
      </Layout.Header>

      {/* <Layout className={"on-boarding"}>
        <Content>
          <section className="search-result">
          <div className="container">
          <div>
            <Title level={4}>Search Result</Title>
            <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            </div>
            </div>
          </section>
        </Content>
      </Layout> */}

      {/*Modal*/}

      <div className="lh_menu">
        <NavLink
          to={{
            pathname: ["admin", "agent"].includes(getLocalDataType())
              ? `/${getLocalDataType()}/dashboard`
              : "/",
          }}
          className="logo-link"
        >
          <img
            src={require("./../../../assets/images/logo-icon.png").default}
            alt=""
            className="img-fluid"
          />
        </NavLink>

        <Button
          type="primary"
          shape="circle"
          icon={ResponsiveMenu ? <CloseOutlined /> : <MenuOutlined />}
          onClick={handleClickResponsiveMenu}
        />
      </div>

      {/*Modal*/}

      {/*Modal*/}

      <SignupModal
        visible={isModalVisible}
        onCancel={() => showModal({ signupModalVisible: false })}
        onFinish={onFinish}
        LoginSignup={LoginSignup}
        loader={loader}
      />
      {isModalLVisible && (
        <SigninModal
          visible={isModalLVisible}
          onCancel={() => {
            showModal({ signupModalVisible: false });
            showLModal({ loginModalVisible: false });
          }}
          onLoginForgot={LoginForgot}
          onFinish={onFinishLogin}
          LoginSignup={LoginSignup}
          loader={loader}
        />
      )}
      {isForgotVisible && (
        <ForgotModal
          visible={isForgotVisible}
          onCancel={fOk}
          onFinish={onFinishForgot}
          onLoginForgot={LoginForgot}
          loader={loader}
        />
      )}

      <Modal
        title={false}
        visible={isOtpVisible}
        onCancel={otpOk}
        centered
        footer={false}
        className="modal-ui-1 modal-otp"
        width="100%"
        destroyOnClose
      >
        <div className="modal-body-ui">
          <h2>{getLocaleMessages("OTP Verification")}</h2>
          <p className="sub">
            {getLocaleMessages("Enter the OTP you received to")} <br />{" "}
            {isemail}{" "}
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
        </div>
      </Modal>
    </>
  );
});
export default Header;
