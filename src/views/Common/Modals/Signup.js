import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/common/actions";
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
  DatePicker
} from "antd";
import dayjs from 'dayjs';
import { UploadOutlined } from "@ant-design/icons";
import Agency from "./../../Admin/Application/ApplicationDetails";
import { uploadRequest } from "./../../../helpers/axiosClient";
import "react-phone-number-input/style.css";
import PhoneInput, {
  parsePhoneNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";
import { getLocaleMessages } from "redux/helper";
import { eachMonthOfInterval } from "date-fns";
import { PatternFormat } from "react-number-format";
import commonactions from "./../../../redux/common/actions";

const { Option } = Select;

const SignupModal = (props) => {
  const { visible, onFinish, onCancel, LoginSignup, loader, onChange } = props;
  const { countryList, cityList } = useSelector((state) => state.Common);
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const [UserType, setUserType] = useState(3);
  const [DLicense, setDrivingLicense] = useState({ name: "" });
  const [VatDocs, setVatDocs] = useState({ name: "" });
  const [CRDocs, setCRDocs] = useState({ name: "" });
  const [searchNationality, setSearchNationality] = useState('');  

  const tenYearsFromNow = dayjs().add(10, 'year').endOf('day');

  const disableDates = (current) => {
    return current && current.isAfter(tenYearsFromNow);
  };

  const nationalities = [
    { value: '', label: 'Select' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'in', label: 'India' },
    // Add more nationalities as needed
  ];

  const handleSearchNationality = (value) => {
    setSearchNationality(value);
  };

  const filteredCountryList = countryList.filter(country =>
    country.countryname.toLowerCase().includes(searchNationality.toLowerCase())
  );
  
  const handleOnFinish = (event) => {
    if (UserType == 2 && event.vatnumber == event.crnumber) {
      message.error("VAT Number and CR Number should not be equal");
      return;
    }
    onFinish({
      ...event,
      username: event.email,
      usertypeid: UserType,
      panel: UserType == 3 ? "User" : "Agency",
    });
  };

  const onLogoChange = ({ file, onSuccess, onError }, doctype) => {
    let form = new FormData();
    form.append("file", file);
    uploadRequest("public/upload/", form)
      .then((res) => {
        let image = res.data[0].data;
        let imageName = image.filePath.split("__uploads/")[1];
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

  const clearFields = () => {
    usedForm.resetFields();
    setDrivingLicense({ name: "" });
    setCRDocs({ name: "" });
    setVatDocs({ name: "" });
  };

  useEffect(() => {
    dispatch({
      type: commonactions.GET_COUNTRY_LIST,
      payload: false,
    });

    clearFields();
  }, []);

  function normalizePhoneNumber1(input, defaultCountry = null) {
    const parsedPhone = parsePhoneNumber(input, defaultCountry);
    if (parsedPhone) {
      return parsedPhone.number;
    } else {
      return input;
    }
  }
  let initialValue = "+966 55 677 6887";
  let phoneNumber = normalizePhoneNumber1(initialValue);

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
        forceRender={visible}
      >
        <div className="modal-body-ui">
          <h2>{getLocaleMessages("Signup")}</h2>
          {true && (
            <div>
              <Form
                name="normal_login"
                className="login-form"
                onFinish={handleOnFinish}
                form={usedForm}
              >
                <Form.Item
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: getLocaleMessages("Please input your name"),
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
                      message: getLocaleMessages("Please input your name"),
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("Last Name")} />
                </Form.Item>
                {UserType == 2 && (
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
                )}
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("Email")}`,
                    },
                    {
                      type: "email",
                      whitespace: true,
                      message: getLocaleMessages("Invalid email"),
                    },
                  ]}
                >
                  <Input placeholder={getLocaleMessages("Email")} />
                </Form.Item>

                
                <Form.Item
                    name="passportnumber"
                    rules={[
                      {
                        required: true,
                        whitespace: false,
                        message: `${getLocaleMessages(
                          "Please input"
                        )} ${getLocaleMessages("ID/Passport Number")}`,
                      },
                      {
                        max: 10,
                        message: getLocaleMessages("ID/Passport Number must be at 10"),
                      },
                    ]}
                  >
                    <Input placeholder={getLocaleMessages("ID/Passport Number")} />
                  </Form.Item>

                  <Form.Item
                    name="dateofbirth"
                    rules={[
                      {
                        required: true,
                        message: `${getLocaleMessages(
                          "Please input"
                        )} ${getLocaleMessages("DOB")}`,
                      }
                    ]}
                  >
                    <DatePicker 
                      format="DD-MM-YYYY" 
                      disabledDate={(current) => current && current > dayjs().endOf('day')} // Disable future dates
                      placeholder={getLocaleMessages("DOB")}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name={"nationalityid"}
                    rules={[{ required: true, message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Nationality")}`, }]}
                  >
                    <Select
                      showSearch
                      allowClear
                      autoComplete={'off'}
                      placeholder={getLocaleMessages("Select your nationality")}
                      dropdownStyle={{ minWidth: '200px' }}
                      onSearch={handleSearchNationality}
                      filterOption={false} 
                    >

                    {filteredCountryList.map((country) => (
                      <Option key={country.id} value={country.id}>
                        {country.countryname}
                      </Option>
                    ))}
                    
                    </Select>
                  </Form.Item>
                  

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("Password")}`,
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
                  />
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

                {/* <Form.Item
                name={'areaid'}
                rules={[{ required: true, message: 'Country is required' }]}
              >
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  autoComplete={'off'}
                  placeholder={'City'}
                  dropdownStyle={{ minWidth: '200px' }}
                >
                  {cityList && cityList.map(value => {                     
                    return (
                      <Option key={value.id} value={value.id}>
                        {value.cityname}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                    name={'countryid'}
                    rules={[{ required: true, message: 'Select country name' }]}
                  >
                    <Select
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      autoComplete={'off'}
                      placeholder={'country'}
                      dropdownStyle={{ minWidth: '200px' }}
                    >
                      {countryList && countryList.map(value => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.countryname}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item> */}

                {UserType == 2 && (
                  <>
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
                      name="vatdocument"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: `${getLocaleMessages(
                            "Please input"
                          )} ${getLocaleMessages("VAT Documents")}`,
                        },
                      ]}
                    >
                      <div className="form-uploads">
                        <Input
                          value={VatDocs.name}
                          disabled
                          placeholder={getLocaleMessages("VAT Documents")}
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
                          )} ${getLocaleMessages("CR Documents")}`,
                        },
                      ]}
                    >
                      <div className="form-uploads">
                        <Input
                          value={CRDocs.name}
                          disabled
                          placeholder={getLocaleMessages("CR Documents")}
                        />
                        <Upload
                          customRequest={(e) => onLogoChange(e, 2)}
                          icon={<UploadOutlined />}
                        >
                          <Button icon={<UploadOutlined />}></Button>
                        </Upload>
                      </div>
                    </Form.Item>
                  </>
                )}
                {/* {UserType == 3 && (
                  <Form.Item
                    name="drivinglicense"
                  >
                    <div className="form-uploads">
                      <Input
                        value={DLicense.name}
                        disabled
                        placeholder={getLocaleMessages("Driver License")}
                      />
                      <Upload
                        customRequest={onLogoChange}
                        icon={<UploadOutlined />}
                      >
                        <Button icon={<UploadOutlined />}></Button>
                      </Upload>
                    </div>
                  </Form.Item>
                )} */}
                <Form.Item
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
                    <a href="/termsofuse/user" target="_blank">
                      {getLocaleMessages("Terms and Conditions")}
                    </a>
                  </Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={loader}
                  >
                    {getLocaleMessages("Signup")}
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
          <p className="new">
            {getLocaleMessages("Already have an account")}?{" "}
            <span
              onClick={() =>
                loader ? "" : LoginSignup({ signup: false, login: true })
              }
            >
              {getLocaleMessages("Sign In")}
            </span>{" "}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default SignupModal;
