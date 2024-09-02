import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Menu,
  Modal,
  Dropdown,
  message,
  Select,
  Avatar,
  Image,
  Col,
  Input,
  Row,
  Form,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/admin/settings/actions";
import AdminProfileModal from "views/Common/Modals/AdminProfile";
import appActions from "./../../../redux/app/actions";
import ChangeAdminModal from "views/Common/Modals/ChangeAdminPassword";
import { history, store } from "redux/store";
import {
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  KeyOutlined,
  LogoutOutlined,
  ProfileOutlined,
  MenuOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { getLocalDataType, getLocaleMessages } from "./../../../redux/helper";
import authactions from "./../../../redux/auth/actions";
const Header = ({ handleResponsiveMenu,  responsiveMenu}) => {
  const [form] = Form.useForm();
  const { subLang, loader, isLoggedIn, isOtp, isemail } = useSelector(
    (state) => state.Auth
  );
  const { userpermission } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [ShowProfile, setShowProfile] = useState(false);
  const [ChangePassword, setChangePassword] = useState(false);
  const [AccountSSetting, setAccountSSetting] = useState(false);
  const { Option } = Select;
  const [UserId, setUserId] = useState(
    JSON.parse(localStorage.getItem("user_data"))["id"]
  );
  const { admin_profile, agency_profile } = useSelector(
    (state) => state.WebSettings
  );
  const [searchstring, setSearchstring] = useState("");
  const [search, setSearch] = useState(false);
  const [Title, setTitle] = useState("");
  const [Number, setNumber] = useState("");
  const [visible, setvisible] = useState(false);
  const findString = () => {
    window.find(searchstring);
    setSearch(!search);
    setSearchstring("");
  };

  const loginMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleAccountSetting()}>
        <UserOutlined />
        {getLocaleMessages("Profile")}
      </Menu.Item>
      {/* <Menu.Item key="1" onClick={() => handleShowProfile()}>
        <UserOutlined />
        {getLocaleMessages("Profile")}
      </Menu.Item> */}
      <Menu.Item key="2" onClick={() => handleChangePassword()}>
        <KeyOutlined />
        {getLocaleMessages("Change Password")}
      </Menu.Item>
      {/* <Menu.Item key="3" onClick={() => handleAccountSetting()}>
        <SettingOutlined />
       {getLocaleMessages("Account Settings")}
      </Menu.Item> */}

      <Menu.Item
        key="4"
        onClick={() => {
          dispatch({
            type: authactions.LOGOUT_USER,
          });
        }}
      >
        <LogoutOutlined /> {getLocaleMessages("Logout")}
      </Menu.Item>
    </Menu>
  );

  const handleShowProfile = () => {
    getLocalDataType() == "admin" ? loadProfile() : loadAgencyProfile();
    setShowProfile(!ShowProfile);
  };

  const handleAccountSetting = () => {
    if (getLocalDataType() == "admin") {
      loadProfile();
      setAccountSSetting(!AccountSSetting);
    } else {
      if (history.location.pathname !== "/agency/profile/update") {
        history.push({
          pathname: "profile/update",
          state: UserId,
        });
      }
    }
  };

  const handleChangePassword = () => {
    getLocalDataType() == "admin" ? loadProfile() : loadAgencyProfile();
    setChangePassword(!ChangePassword);
  };

  const loadProfile = (_) => {
    dispatch({
      type: actions.GET_ADMIN_PROFILE,
      payload: UserId,
    });
  };

  const loadAgencyProfile = (_) => {
    dispatch({
      type: actions.GET_AGENT_PROFILE,
      payload: UserId,
    });
  };

  useEffect(() => {
    if (admin_profile !== undefined) {
      const { firstname, lastname, username, email, contactnumber } = {
        ...admin_profile,
      };
      form.setFieldsValue({
        firstname,
        lastname,
        username,
        email,
        contactnumber,
      });
    }
  }, [admin_profile]);

  useEffect(() => {
    if (agency_profile !== undefined) {
      const {
        firstname,
        lastname,
        username,
        password,
        email,
        contactnumber,
        vatnumber,
        vatdocs,
        crnumber,
        crdocs,
      } = {
        ...agency_profile,
      };
      form.setFieldsValue({
        firstname,
        lastname,
        username,
        email,
        password,
        contactnumber,
        vatnumber,
        vatdocs,
        crnumber,
        crdocs,
      });
    }
  }, [agency_profile]);
  const localLang = localStorage.getItem("language");
  const selectedLang =
    localLang !== undefined && localLang !== null ? localLang : subLang;
  return (
    <>
      {visible && (
        <Modal
          title={Title}
          visible={visible}
          centered
          footer={false}
          width={800}
          className="ant_modal_car"
          destroyOnClose
          onCancel={() => setvisible(!visible)}
        >
          <div>
            <iframe
              width="100%"
              height="600px"
              alt="example"
              src={`https://api.drivelounge.com/${Number}`}
            />
          </div>
        </Modal>
      )}
      {ShowProfile && (
        <Modal
          title={getLocaleMessages("My Profile")}
          visible={ShowProfile}
          centered
          footer={false}
          className="ant_modal_car"
          width={600}
          destroyOnClose
          onCancel={() => setShowProfile(!ShowProfile)}
        >
          <div>
            <Form
              form={form}
              name="basic"
              layout="vertical"
              className="form-input-1"
            >
              {getLocalDataType() == "admin" && (
                <Row gutter={30}>
                  <Col span={24}>
                    <Form.Item
                      label={getLocaleMessages("First Name")}
                      name="firstname"
                    >
                      <Input disabled />
                    </Form.Item>

                    <Form.Item
                      label={getLocaleMessages("Last Name")}
                      name="lastname"
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      label={getLocaleMessages("User Name")}
                      name="username"
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item label={getLocaleMessages("Email")} name="email">
                      <Input disabled />
                    </Form.Item>

                    <Form.Item
                      label={getLocaleMessages("Contact Number")}
                      name="contactnumber"
                      rules={[
                        {
                          required: true,
                          message: getLocaleMessages(
                            "Contact number is required"
                          ),
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
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {getLocalDataType() == "agency" && (
                <Row gutter={30}>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("First Name")}
                      name="firstname"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("Last Name")}
                      name="lastname"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("User Name")}
                      name="username"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("Password")}
                      name="password"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={getLocaleMessages("Email")} name="email">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("Contact Number")}
                      name="contactnumber"
                      rules={[
                        {
                          required: true,
                          message: getLocaleMessages(
                            "Contact number is required"
                          ),
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
                      <Input disabled />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("VAT Number")}
                      name="vatnumber"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("VAT Document")}
                      name="vatdocs"
                    >
                      <Input
                        disabled
                        suffix={
                          agency_profile.vatdocs !== null ? (
                            <EyeOutlined
                              onClick={() => {
                                setvisible(!visible);
                                setTitle("VAT Document");
                                setNumber(agency_profile.vatdocs);
                              }}
                            />
                          ) : (
                            <></>
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("CR Number")}
                      name="crnumber"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={getLocaleMessages("CR Document")}
                      name="crdocs"
                    >
                      <Input
                        disabled
                        suffix={
                          agency_profile.vatdocs !== null ? (
                            <EyeOutlined
                              onClick={() => {
                                setvisible(!visible);
                                setTitle("CR Document");
                                setNumber(agency_profile.crdocs);
                              }}
                            />
                          ) : (
                            <></>
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row gutter={30}></Row>
            </Form>
          </div>
        </Modal>
      )}
      {AccountSSetting && (
        <AdminProfileModal
          title={getLocaleMessages("Account Settings")}
          visible={AccountSSetting}
          centered
          footer={false}
          width={600}
          destroyOnClose
          setShowProfile={setShowProfile}
          admin_profile={
            getLocalDataType() === "admin" ? admin_profile : agency_profile
          }
          onCancel={() => setAccountSSetting(!AccountSSetting)}
        />
      )}
      {ChangePassword && (
        <ChangeAdminModal
          title={getLocaleMessages("Change Password")}
          visible={ChangePassword}
          centered
          footer={false}
          width={600}
          destroyOnClose
          setChangePassword={setChangePassword}
          admin_profile={
            getLocalDataType() === "admin" ? admin_profile : agency_profile
          }
          onCancel={() => setChangePassword(!ChangePassword)}
        />
      )}
      <Layout.Header className="admin-header">
        <div className="container">

      <Button onClick={handleResponsiveMenu} className="floating-mobile-menu">
        {responsiveMenu ? <CloseOutlined /> : <MenuOutlined />}
      </Button>

          <div className="logo">
            {" "}
            <NavLink
              to={{
                pathname: ["admin", "agency"].includes(getLocalDataType())
                  ? `/${getLocalDataType()}/dashboard`
                  : "/",
              }}
              onClick={() => {
                let dashboard = userpermission?.filter(
                  (item) => item?.name === "Dashboard"
                );
                dispatch({
                  type: appActions.CHANGE_CURRENT_MENU,
                  payload: [dashboard[0]?.id?.toString()],
                });
              }}
            >
              <img
                src={require("./../../../assets/images/logo1.png").default}
                alt=""
                className="img-fluid"
              />
            </NavLink>
          </div>

          <div className="nav_flexes">
            {isLoggedIn && (
              <>
                <Select
                  className="border-right"
                  labelInValue
                  defaultValue={
                    selectedLang === "en"
                      ? { value: "english" }
                      : { value: "arabic" }
                  }
                  onChange={() => {
                    dispatch({
                      type: authactions.CHANGE_LANGUAGE,
                      payload: selectedLang === "en" ? "ar" : "en",
                    });
                  }}
                >
                  <Option value="english">
                    {localLang === "en" ? "English (EN)" : "الإنجليزية (EN)"}
                  </Option>
                  <Option value="arabic">
                    {localLang === "en" ? "Arabic (عربي )" : "العربية (ع)"}{" "}
                  </Option>
                </Select>

                {search && (
                  <Input
                    className="border-right"
                    value={searchstring}
                    onChange={(e) => setSearchstring(e.target.value)}
                    placeholder={getLocaleMessages("Search")}
                    style={{ width: 120, left: 5 }}
                  />
                )}
                {/* <SearchOutlined
                  className="antd-icons-cs"
                  onClick={findString}
                />

                <BellOutlined className="antd-icons-cs" /> */}

                {/* <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">
             <Dropdown
                overlay={loginMenu}
                overlayClassName="extra-menu"
                trigger={["click"]}
              >
                <a
                  className="ant-dropdown-link user-loggin"
                  onClick={(e) => e.preventDefault()}
                >
                <img src={require("./../../../assets/images/user.png")} />
                </a>
              </Dropdown>
          </Avatar> */}

                <Dropdown
                  overlay={loginMenu}
                  overlayClassName="extra-menu"
                  trigger={["click"]}
                >
                  <a
                    className="antd-icons-cs"
                    onClick={(e) => e.preventDefault()}
                  >
                    <UserOutlined />
                  </a>
                </Dropdown>
              </>
            )}
          </div>
        </div>
      </Layout.Header>
    </>
  );
};
export default Header;
