import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Col,
  Row,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadRequest } from "./../../../helpers/axiosClient";
import "react-phone-number-input/style.css";
import PhoneInput, {
  parsePhoneNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import "./../../../assets/css/userStyle.css";
import { getLocaleMessages } from "redux/helper";
import Map from "./../../Admin/Agency/Map";
import AutoCompleteAddress from "./../../Admin/Agency/AutoCompleteAddress";
import LogoImageUpload from "../../../components/shared/LogoImageUpload";
import { PatternFormat } from "react-number-format";
var Path = require("path");

const { Option } = Select;

const SignupModal = (props) => {
  const { visible, onCancel, LoginSignup } = props;
  const { countryList, cityList } = useSelector((state) => state.Common);
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const [UserType, setUserType] = useState(2);
  const [DLicense, setDrivingLicense] = useState({ name: "" });
  const [VatDocs, setVatDocs] = useState({ name: "" });
  const [CRDocs, setCRDocs] = useState({ name: "" });
  const [Places, setPlaces] = useState("");
  const [CoverImagePath, setCoverImagePath] = useState({ name: "" });
  const [AgencyImage, setAgencyImage] = useState({ name: "" });
  const [Cors, setCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });
  const handleOnFinish = (event) => {
    if (event.vatnumber == event.crnumber) {
      message.error("VAT Number and CR Number should not be equal");
      return;
    }
    LoginSignup({
      ...event,
      ...Cors,
      servicelocation: Places,
      usertypeid: UserType,
      panel: "Agency",
    });
  };

  const onLogoChange = ({ file, onSuccess, onError }, doctype) => {
    let form = new FormData();
    form.append("file", file);
    uploadRequest("public/upload", form)
      .then((res) => {
        let image = res.data[0].data;
        let imageName = image.filePath.split("__uploads/")[1];
        if (!imageName) {
          var filename = Path.resolve(image.filePath)
            .split(Path.sep)[1]
            .split("__uploads");
          imageName = filename[1].replace(Path.delimiter, "").slice(1);
        }
        switch (UserType) {
          case 2:
            if (doctype == 1) {
              setVatDocs({
                name: imageName,
                status: "done",
                url: `https://api.drivelounge.com/${imageName}`,
                thumbUrl: `https://api.drivelounge.com/${imageName}`,
              });
              usedForm.setFieldsValue({ vatdocument: imageName });
            } else {
              setCRDocs({
                name: imageName,
                status: "done",
                url: `https://api.drivelounge.com/${imageName}`,
                thumbUrl: `https://api.drivelounge.com/${imageName}`,
              });
              usedForm.setFieldsValue({ crdocument: imageName });
            }
            break;

          default:
            setDrivingLicense({
              name: imageName,
              status: "done",
              url: `https://api.drivelounge.com/${imageName}`,
              thumbUrl: `https://api.drivelounge.com/${imageName}`,
            });
            usedForm.setFieldsValue({ drivinglicense: imageName });
            break;
        }
        onSuccess("ok");
      })
      .catch((err) => {
        onError({ err });
      });
  };

  useEffect(() => {
    usedForm.setFieldsValue({
      photopath: AgencyImage.name,
    });
  }, [AgencyImage]);

  const clearFields = () => {
    usedForm.resetFields();
    setDrivingLicense({ name: "" });
    setCRDocs({ name: "" });
    setVatDocs({ name: "" });
  };

  useEffect(() => {
    usedForm.setFieldsValue({
      servicelocation: Cors.address,
      agentaddress: Cors.address,
    });
  }, [Cors]);

  useEffect(() => {
    clearFields();
  }, []);

  return (
    <>
      <Modal
        footer={false}
        title={false}
        width="100%"
        visible={visible}
        onCancel={onCancel}
        destroyOnClose
        className="modal-ui-1"
        maskClosable={false}
      >
        <div className="modal-body-ui">
          <h2>{getLocaleMessages("Agency Sign up")} </h2>
          {true && (
            <div>
              <Form
                name="normal_login"
                className="login-form"
                onFinish={handleOnFinish}
                form={usedForm}
                autoComplete
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Form.Item
                    name="photopath"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: getLocaleMessages("Please upload logo!"),
                      },
                    ]}
                  >
                    <LogoImageUpload
                      setCoverImage={setAgencyImage}
                      ImagePath={CoverImagePath}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: getLocaleMessages("Please input your firstname"),
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("First Name")} />
                </Form.Item>
                <Form.Item
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: getLocaleMessages("Please input your lastname"),
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("Last Name")} />
                </Form.Item>

                <Form.Item
                  name="agencyname"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("Agency Name")}`,
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("Agency Name")} />
                </Form.Item>

                <Form.Item
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
                    placeholder={getLocaleMessages("Email")}
                    autoComplete="new-password"
                  />
                </Form.Item>
                {/* <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: getLocaleMessages("Please input your name"),
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("User Name")} />
                </Form.Item> */}
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
                  <Input.Password
                    type="password"
                    placeholder={getLocaleMessages("Password")}
                    autoComplete="new-password"
                  />
                </Form.Item>
                {/* <Form.Item
                  name={"contactnumber"}
                  validateTrigger={["onSubmit", "onChange"]}
                  rules={[
                    {
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("Contact Number Length")}`,
                      validator: (_, value) => {
                        if (value !== 0 && value !== undefined) {
                          if (
                            value.includes("+")
                              ? value.substring(5, 17).replace(/[^0-9]/g, "")
                                  .length === 9
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
                      height: "47px",
                      borderRadius: "5px",
                    }}
                    placeholder={getLocaleMessages("Contact Number")}
                    format="+966-#########"
                    allowEmptyFormatting
                    mask="_"
                    name={"contactnumber"}
                    onChange={(e) => {
                      usedForm.setFieldsValue(e.target.value.substring(7, 17));
                    }}
                  />
                </Form.Item> */}
                <Form.Item
                  name="contactnumber"
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Contact number is required"),
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
                <Form.Item
                  name="vatnumber"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("VAT Number")}`,
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("VAT Number")} />
                </Form.Item>
                <Form.Item
                  name="vat"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("VAT %")}`,
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("VAT %")} />
                </Form.Item>
                <Form.Item
                  name="vatdocument"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("VAT Document")}`,
                    },
                  ]}
                >
                  <div className="form-uploads">
                    <Input
                      value={VatDocs.name}
                      disabled
                      placeholder={getLocaleMessages("VAT Document")}
                    />
                    <Upload
                      customRequest={(e) => onLogoChange(e, 1)}
                      icon={<UploadOutlined />}
                    >
                      <Button icon={<UploadOutlined />}></Button>
                    </Upload>
                  </div>
                </Form.Item>
                <Form.Item
                  name="crnumber"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("CR Number")}`,
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("CR Number")} />
                </Form.Item>
                <Form.Item
                  name="crdocument"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("CR Document")}`,
                    },
                  ]}
                >
                  <div className="form-uploads">
                    <Input
                      value={CRDocs.name}
                      disabled
                      placeholder={getLocaleMessages("CR Document")}
                    />
                    <Upload
                      customRequest={(e) => onLogoChange(e, 2)}
                      icon={<UploadOutlined />}
                    >
                      <Button icon={<UploadOutlined />}></Button>
                    </Upload>
                  </div>
                </Form.Item>
                <Form.Item
                  name={"servicelocation"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: getLocaleMessages(
                        "Please input service location!"
                      ),
                    },
                  ]}
                >
                  <AutoCompleteAddress
                    location=""
                    address={Cors.address}
                    cors={(e) => setCors(e)}
                  />

                  {Cors.lat && Cors.lng && (
                    <Map
                      // google={this.props.google}
                      setAddress={setCors}
                      setPlaces={setPlaces}
                      center={{
                        lat: Cors.lat,
                        lng: Cors.lng,
                        address: Cors.address,
                      }}
                      height="350px"
                      zoom={15}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  name={"agentaddress"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: getLocaleMessages("Please input address!"),
                    },
                  ]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item
                  shouldUpdate={true}
                  name="remember"
                  valuePropName="checked"
                  validateTrigger={["onChange"]}
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              getLocaleMessages("Accept the condition")
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    {" "}
                    <>{getLocaleMessages("I Agree")}</>{" "}
                    <a href="/termsofuse/agency" target="_blank">
                      {getLocaleMessages("Terms and Conditions")}
                    </a>
                  </Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    {getLocaleMessages("Sign up")}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
        <div className="modal-ui-right">
          <img
            src={require("./../../../assets/images/login.png").default}
            alt="login"
          />
          {/* <p className="new">
            Already have an account?{' '}
            <span
              onClick={() =>
                loader ? '' : LoginSignup({ signup: false, login: true })
              }
            >
              Sign in
            </span>{' '}
          </p> */}
        </div>
      </Modal>
    </>
  );
};

export default SignupModal;
