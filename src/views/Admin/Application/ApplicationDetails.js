import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "./../../../redux/user/actions";
import authactions from "./../../../redux/auth/actions";
import {
  Row,
  Col,
  Input,
  Button,
  Divider,
  Form,
  DatePicker,
  Select,
  Card,
  Tabs,
  Radio,
  AutoComplete,
  Upload,
  Typography,
  message,
  Modal
} from "antd";
import { formProps } from "../../../helpers/constant";
import settingsAction from "../../../redux/admin/agency/actions";
import Map from "./../Agency/Map";
import AutoCompleteAddress from "./../Agency/AutoCompleteAddress";
import { history, store } from "redux/store";
import LoadingOverlay from "react-loading-overlay";
import { uploadRequest } from "../../../helpers/axiosClient";
import CoverImageUpload from "../../../components/shared/CoverImageUpload";
import "./../../../assets/css/adminStyle.css";
import {
  UploadOutlined,
  UserOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { getLocaleMessages, getLocalDataType } from "redux/helper";
import { NumericFormat, PatternFormat } from "react-number-format";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;

const ApplicationDetails = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const [formPass] = Form.useForm();
  const [UserId, setUserId] = useState(
    JSON.parse(localStorage.getItem("user_data"))["id"]
  );
  const { agencydata_byid, isLoading } = useSelector((state) => state.Agency);
  const { subLang } = useSelector((state) => state.Auth);
  const [Language, setLanguage] = useState(1);
  const [Commission, setCommission] = useState(1);
  const [Status, setStatus] = useState(1);
  const [VATStatus, setVATStatus] = useState(1);
  const [showVAT, toggleVATShow] = useState(true);
  const [PayOption, setPayOption] = useState(3);
  const [visible, setvisible] = useState(false);
  const [AgencyId, setAgencyId] = useState(
    props.location.state !== undefined ? props.location.state : 0
  );
  const [Cors, setCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });
  const [CoverImagePath, setCoverImagePath] = useState({ name: "" });
  const [AgencyImage, setAgencyImage] = useState({ name: "" });
  const [AgencyLicense, setAgencyLicense] = useState({ name: "" });
  const [Places, setPlaces] = useState("");
  const [AgencyVatDocs, setAgencyVatDocs] = useState({ name: "" });
  const [loading, setloading] = useState(false);

  const hours = [
    { value: '', label: 'Select' },
    { value: '00:00', label: '12 AM' },
    { value: '01:00', label: '1 AM' },
    { value: '02:00', label: '2 AM' },
    { value: '03:00', label: '3 AM' },
    { value: '04:00', label: '4 AM' },
    { value: '05:00', label: '5 AM' },
    { value: '06:00', label: '6 AM' },
    { value: '07:00', label: '7 AM' },
    { value: '08:00', label: '8 AM' },
    { value: '09:00', label: '9 AM' },
    { value: '10:00', label: '10 AM' },
    { value: '11:00', label: '11 AM' },
    { value: '12:00', label: '12 PM' },
    { value: '13:00', label: '1 PM' },
    { value: '14:00', label: '2 PM' },
    { value: '15:00', label: '3 PM' },
    { value: '16:00', label: '4 PM' },
    { value: '17:00', label: '5 PM' },
    { value: '18:00', label: '6 PM' },
    { value: '19:00', label: '7 PM' },
    { value: '20:00', label: '8 PM' },
    { value: '21:00', label: '9 PM' },
    { value: '22:00', label: '10 PM' },
    { value: '23:00', label: '11 PM' }
  ];

  const handleAgencyImage = (options) => {
    const { file, onSuccess, onError } = options;
    let form = new FormData();
    form.append("file", file);
    setloading(true);
    uploadRequest("admin/upload", form)
      .then((res) => {
        setloading(true);
        let image = res.data[0].data;
        let imageName = image.filePath.split("__uploads/")[1];
        usedForm.setFieldsValue({ photopath: imageName });
        setAgencyImage({
          name: imageName,
          status: "done",
          url: `https://api.drivelounge.com/${imageName}`,
        });
        onSuccess("ok");
      })
      .catch((err) => onError({ err }));
  };

  const handleRemoveAgencyImage = () => {
    usedForm.setFieldsValue({ photopath: "" });
    setAgencyImage({
      name: "",
      status: "done",
    });
  };

  const handleCommissionChange = (e) => {
    setCommission(e.target.value);
    usedForm.setFieldsValue({ commissiontype: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayOption(e.target.value);
    usedForm.setFieldsValue({ paymentoption: e.target.value });
  };

  const handleAgentStatus = (e) => {
    setStatus(e.target.value);
    usedForm.setFieldsValue({ status: e.target.value });
  };

  const handleVATStatus = (e) => {
    toggleVATShow(e.target.value == 1);
    setVATStatus(e.target.value);
    usedForm.setFieldsValue({ vatstatus: e.target.value });
  };

  const handleLanguageTab = (e) => {
    setLanguage(e);
  };

  const handleLicenseImage = ({ file, onSuccess, onError }, type) => {
    let form = new FormData();
    form.append("file", file);
    uploadRequest("admin/upload", form)
      .then((res) => {
        let image = res.data[0].data;
        let imageName = image.filePath.split("__uploads/")[1];
        if (type == 1) {
          usedForm.setFieldsValue({ crdocument: imageName });
          setAgencyLicense({
            name: imageName,
            status: "done",
            url: `https://api.drivelounge.com/${imageName}`,
          });
        } else {
          usedForm.setFieldsValue({ vatdocument: imageName });
          setAgencyVatDocs({
            name: imageName,
            status: "done",
            url: `https://api.drivelounge.com/${imageName}`,
          });
        }
        onSuccess("ok");
      })
      .catch((err) => onError({ err }));
  };

  const handleRemove = (type) => {
    if (type == 1) {
      usedForm.setFieldsValue({ crdocument: "" });
      setAgencyLicense({
        name: "",
        status: "done",
      });
    } else {
      usedForm.setFieldsValue({ vatdocument: "" });
      setAgencyVatDocs({
        name: "",
        status: "done",
      });
    }
  };

  useEffect(() => {
    usedForm.setFieldsValue({
      latitude: Cors.lat,
      longitude: Cors.lng,
      servicelocation: Cors.address,
      agentaddress: Cors.address,
    });
  }, [Cors]);

  const handleSubmit = async (values) => {
    if (values.vat.vatnumber == values.crnumber) {
      message.error("VAT Number and CR Number should not be equal");
      return;
    }
    var data = {
      action: AgencyId > 0 ? "U" : "I",
      id: agencydata_byid.id !== undefined ? agencydata_byid.id : -1,
      languageid: Language,
      agentname: Language == 1 ? values.enname : values.arname,
      agentdescription:
        Language == 1 ? values.endescription : values.ardescription,
      agentaddress: values.agentaddress,
      // 'address':values.agentaddress,
      firstname: values.firstname,
      lastname: values.lastname,
      username: values.username,
      password: values.password,
      email: values.email,
      latitude: Cors.lat,
      longitude: Cors.lng,
      crnumber: values.crnumber,
      crdocument: values.crdocument,
      commissiontype: 1, //Commission,
      commissionvalue: 0, //values.commissionvalue,
      contactnumber: values.contactnumber,
      sortorder: 1, //values.sortorder,
      vat: values.vat,
      vatstatus: VATStatus,
      vatnumber: values.vatnumber,
      vatdocument: values.vatdocument,
      servicelocation: Places,
      paymentoption: 2, ///PayOption,
      photopath: AgencyImage.name, //values.photopath,
      status: Status,
      openinghours: values.openinghours,
      closinghours: values.closinghours,
    };
    dispatch({
      type: settingsAction.AGENCY_INFORMATION_IUD,
      payload: data,
    });
  };

  const onFinishChangePassword = (values) => {
    if (values.newpassword == values.confirmpassword) {
      let data = {
        id: UserId,
        usertypeid: 2, // agent 3 - user
        // oldpassword: values.oldpassword,
        newpassword: values.newpassword,
        confirmpassword: values.confirmpassword,
      };
      dispatch({
        type: actions.UPDATE_AGENCY_PASSWORD,
        payload: { ...data },
      });
      /*dispatch({
				type: authactions.LOGOUT_USER,
			  });*/
      formPass.resetFields();
      setvisible(!visible);
    } else {
      message.error(getLocaleMessages("Password mismatch"));
    }
  };

  const handleCancel = () => {
    usedForm.resetFields();
    getLocalDataType() == "admin"
      ? history.push("/admin/application")
      : props.history.goBack();
  };

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("user_data"))["id"];
    if (AgencyId > 0 || (id && getLocalDataType() == "agency")) {
      getLocalDataType() == "agency" && setAgencyId(id);
      dispatch({
        type: settingsAction.GET_AGENCY_INFO_BYID,
        payload: props.location.state || id,
      });
      return;
    } else {
      usedForm.resetFields();
      setCors({ lat: 24.6877, lng: 46.7219, address: "" });
      setStatus(1);
      setVATStatus(1);
      setAgencyImage({ name: "" });
      setAgencyLicense({ name: "" });
      setAgencyVatDocs({ name: "" });
      setPlaces("");
    }

    // dispatch({
    //   type: settingsAction.GET_AGENCY_INFO,
    //   payload: false,
    // });
  }, []);

  useEffect(() => {
    if (
      props.location.state !== undefined &&
      agencydata_byid.username !== undefined
    ) {
      usedForm.setFieldsValue({
        ...agencydata_byid,
        paymentoption: parseInt(agencydata_byid.paymentoption),
        password: "",
        enname:
          agencydata_byid.languageid === 1 ? agencydata_byid.agentname : "",
        endescription:
          agencydata_byid.languageid === 1
            ? agencydata_byid.agentdescription
            : "",
        arname:
          agencydata_byid.languageid === 2 ? agencydata_byid.agentname : "",
        ardescription:
          agencydata_byid.languageid === 2
            ? agencydata_byid.agentdescription
            : "",
        commissiontype: parseInt(agencydata_byid.commissiontype),
        agentaddress: agencydata_byid.address,
        crdocument: agencydata_byid.crdocs,
        vatdocument: agencydata_byid.vatdocs,
        vat: JSON.stringify(agencydata_byid.vat),
        status: agencydata_byid.status,
        vatstatus:
          agencydata_byid.vatstatus !== undefined
            ? agencydata_byid.vatstatus
            : 1,
        contactnumber: agencydata_byid.contactnumber,
        openinghours: agencydata_byid.openinghours,
        closinghours: agencydata_byid.closinghours,
      });
      setCors({
        lat: agencydata_byid.latitude,
        lng: agencydata_byid.longitude,
        address: agencydata_byid.address,
      });
      setPlaces(agencydata_byid.servicelocation);
      setLanguage(agencydata_byid.languageid);
      setCommission(parseInt(agencydata_byid.commissiontype));
      setPayOption(agencydata_byid.paymentoption);
      setAgencyImage({
        name: agencydata_byid.photopath,
        status: "done",
        url: `https://api.drivelounge.com/${agencydata_byid.photopath}`,
      });
      setCoverImagePath({
        name: agencydata_byid.photopath,
        status: "done",
        url: `https://api.drivelounge.com/${agencydata_byid.photopath}`,
      });
      setAgencyLicense({
        name: agencydata_byid.crdocs,
        status: "done",
        url: `https://api.drivelounge.com/${agencydata_byid.crdocs}`,
      });
      setAgencyVatDocs({
        name: agencydata_byid.vatdocs,
        status: "done",
        url: `https://api.drivelounge.com/${agencydata_byid.vatdocs}`,
      });
      setVATStatus(
        agencydata_byid?.vatstatus !== undefined
          ? agencydata_byid?.vatstatus
          : 1
      );
    } else {
      usedForm.resetFields();
      setCors({ lat: 24.6877, lng: 46.7219, address: "" });
      setStatus(1);
      setVATStatus(1);
      setAgencyImage({ name: "" });
      setAgencyLicense({ name: "" });
      setAgencyVatDocs({ name: "" });
    }
  }, [agencydata_byid]);

  useEffect(() => {
    usedForm.setFieldsValue({ paymentoption: PayOption });
    window.scrollTo(0, 0);
  }, []);

  const formatPhoneNumber = (e) => {
    let formattedNumber;
    const { name, value } = e.target;
    const { length } = value;
    // Filter non numbers
    const regex = () => value.replace(/[^0-9\.]+/g, "");
    // Set area code with parenthesis around it
    const areaCode = () => `(${regex().slice(0, 3)})`;

    // Set formatting for first six digits
    const firstSix = () => `${areaCode()} ${regex().slice(3, 6)}`;

    // Dynamic trail as user types
    const trailer = (start) => `${regex().slice(start, regex().length)}`;
    if (length < 3) {
      // First 3 digits
      formattedNumber = regex();
    } else if (length === 4) {
      // After area code
      formattedNumber = `+966  ${trailer(3)}`;
    } else if (length === 5) {
      // When deleting digits inside parenthesis
      formattedNumber = `${"+966".replace(")", "")}`;
    } else if (length > 5 && length <= 8) {
      // Before dash
      formattedNumber = `+966  ${trailer(3)}`;
    }
    const formattedObject = {
      target: { name: name, value: formattedNumber },
    };
    return formattedObject;
  };
  console.log("agencydata_byid", VATStatus);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
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
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label={getLocaleMessages("Confirm Password")}
                  name="confirmpassword"
                >
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="btn-save">
                  {getLocaleMessages("Update Password")}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Modal>
      <div className="page-container medium">
        <Card
        // title={
        //   agencydata_byid.id !== undefined ? getLocaleMessages('Update Agency') : getLocaleMessages('Create Agency')
        // }
        >
          
          <Form
            className="login-form"
            form={usedForm}
            layout="vertical"
            onFinish={handleSubmit}
            {...formProps}
            initialValues={{
              vatstatus: VATStatus,
            }}
          >
            <div>
              <Row gutter={30}>
                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <CoverImageUpload
                      setCoverImage={setAgencyImage}
                      ImagePath={CoverImagePath}
                    />
                  </div>
                  {}
                  {/* <Tabs defaultActiveKey={subLang == 'en' ? "1" : "2"} onChange={handleLanguageTab}>
                    <TabPane tab={getLocaleMessages("English")} key="1">
                      <div className="upload_position">
                        <Form.Item
                          label={getLocaleMessages("Agency Logo")}
                          name="photopath"
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: 'Please upload image!',
                            },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                        <Upload
                          listType="picture"
                          customRequest={handleAgencyImage}
                          onRemove={handleRemoveAgencyImage}
                          icon={<UploadOutlined />}
                          fileList={AgencyImage.name !== "" ? [AgencyImage] : []}
                        >
                          <Button icon={<UploadOutlined />}></Button>
                        </Upload>
                      </div>

                      <Form.Item
                        label={getLocaleMessages('Agent Name')}
                        name={'enname'}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please input Agency Name!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={getLocaleMessages('Description')}
                        name={'endescription'}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please input the description!',
                          },
                        ]}
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </TabPane>
                    <TabPane tab={getLocaleMessages("Arabic")} key="2">
                      <div className="upload_position">
                        <Form.Item
                          name="photopath"
                          label={getLocaleMessages("Agency Logo")}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: 'Please upload image!',
                            },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                        <Upload
                          fileList={AgencyImage.name !== "" ? [AgencyImage] : []}
                          customRequest={handleAgencyImage}
                          onRemove={handleRemoveAgencyImage}
                          icon={<UploadOutlined />}
                        >
                          <Button icon={<UploadOutlined />}></Button>
                        </Upload>{' '}
                      </div>

                      <Form.Item
                        label={getLocaleMessages('Agent Name')}
                        name={'arname'}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please input Agency Name!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={getLocaleMessages('Description')}
                        name={'ardescription'}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please input description!',
                          },
                        ]}
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </TabPane>
                  </Tabs> */}
                </Col>
              </Row>
            </div>
            <Title level={2}>{getLocaleMessages("Agency Details")}</Title>
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Agency Name")}
                  name={"enname"}
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
                  <Input
                  //disabled={AgencyId > 0 || agencydata_byid.id !== undefined ? true: false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              {/* <Col span={12}>
                <Form.Item
                  label={getLocaleMessages('Service Location')}
                  name={'servicelocation'}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input service location!',
                    },
                  ]}
                >
                  <AutoCompleteAddress
                    location={ agencydata_byid.id !== undefined ?  agencydata_byid.servicelocation : ''}
                    address={Cors.address}
                    cors={(e) => setCors(e)}
                  />
                </Form.Item>
              </Col> */}
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Description")}
                  name={"endescription"}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Title level={2}>{getLocaleMessages("Address")}</Title>
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Agency City")}
                  name={"servicelocation"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("Location")}`,
                    },
                  ]}
                >
                  <AutoCompleteAddress
                    location={
                      agencydata_byid.id !== undefined
                        ? agencydata_byid.servicelocation
                        : ""
                    }
                    address={Cors.address}
                    cors={(e) => setCors(e)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={24}>
                {Cors.lat && Cors.lng && Cors.address !== "" && (
                  <Map
                    // google={this.props.google}
                    setAddress={setCors}
                    setPlaces={setPlaces}
                    center={{
                      lat: Cors.lat,
                      lng: Cors.lng,
                      address: Cors.address,
                    }}
                    height="450px"
                    zoom={15}
                  />
                )}
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={24}>
                <Form.Item
                  label={getLocaleMessages("Agent Address")}
                  name={"agentaddress"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("Agent Address")}`,
                    },
                  ]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Title level={2}>{getLocaleMessages("User Details")}</Title>
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("First Name")}
                  name={"firstname"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("First Name")}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Last Name")}
                  name={"lastname"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("Last Name")}`,
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
                  label={getLocaleMessages("User Name")}
                  name={"username"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("User Name")}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Title level={2}>{getLocaleMessages("Contact Details")}</Title>
            <Row gutter={30}>
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
                      height: "35px",
                      borderRadius: "5px",
                    }}
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
                  label={getLocaleMessages("Contact Number")}
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
              </Col>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Email")}
                  name={"email"}
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
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Opening Hour")}
                  name="openingHours"
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Opening hour is required"),
                    }
                  ]}
                >
                 <Select
                    showSearch
                    allowClear
                    name='openinghours'
                    autoComplete={'off'}
                    placeholder={getLocaleMessages("Opening Hours")}
                    dropdownStyle={{ minWidth: '200px' }}
                    value='16:00'
                  >

                    {hours.map((hour) => (
                      <Option key={hour.value} value={hour.label}>
                        {hour.label}
                      </Option>
                    ))}
                  
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Closing Hour")}
                  name="closingHours"
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Closing hour is required"),
                    }
                  ]}
                >
                 <Select
                    showSearch
                    allowClear
                    name="{closinghours}"
                    autoComplete={'off'}
                    placeholder={getLocaleMessages("Closing Hours")}
                    dropdownStyle={{ minWidth: '200px' }}
                    value="18:00"
                  >

                    {hours.map((hour) => (
                      <Option key={hour.value} value={hour.value}>
                        {hour.label}
                      </Option>
                    ))}
                  
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Title level={2}>{getLocaleMessages("Document")}</Title>
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("VAT Authorised")}
                  name={"vatstatus"}
                >
                  <Radio.Group onChange={handleVATStatus} value={VATStatus}>
                    <Radio value={1} style={{ fontSize: "14px" }}>
                      {getLocaleMessages("Yes")}
                    </Radio>
                    <Radio value={2} style={{ fontSize: "14px" }}>
                      {getLocaleMessages("No")}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {/* <Col span={12}>
                <Form.Item
                  label={getLocaleMessages('Sort Order')}
                  name={'sortorder'}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input sortorder!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col> */}
              {showVAT && (
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("VAT %")}
                    name={"vat"}
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
                    <Input type="number" />
                  </Form.Item>
                </Col>
              )}
            </Row>
            {showVAT && (
              <Row gutter={30}>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("VAT Number")}
                    name={"vatnumber"}
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
                    <Input type="number" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("CR Number")}
                    name={"crnumber"}
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
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
            )}
            {/* <Row gutter={20}>
                      <Col  span={12}>
                        <Form.Item label={"Commission Type"} name={"commissiontype"}>
                          <Radio.Group onChange={handleCommissionChange} value={Commission}>
                            <Radio value={1}>
                              Value based
                            </Radio>
                            <Radio value={2}>
                              Percentage based
                            </Radio>
                            
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col  span={12}>
                        <Form.Item label={"Commission Value"} name={"commissionvalue"}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row> */}

            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("VAT Document")}
                  name={"vatdocument"}
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
                    <Input value={AgencyVatDocs.name} disabled />
                    <Upload
                      fileList={
                        AgencyVatDocs.name !== "" ? [AgencyVatDocs] : []
                      }
                      listType="picture"
                      onRemove={() => handleRemove(2)}
                      customRequest={(e) => handleLicenseImage(e, 2)}
                      icon={<UploadOutlined />}
                    >
                      <Button icon={<UploadOutlined />} />
                    </Upload>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("CR Document")}
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
                    <Input value={AgencyLicense.name} disabled />
                    <Upload
                      fileList={
                        AgencyLicense.name !== "" ? [AgencyLicense] : []
                      }
                      listType="picture"
                      onRemove={() => handleRemove(1)}
                      customRequest={(e) => handleLicenseImage(e, 1)}
                      icon={<UploadOutlined />}
                    >
                      <Button icon={<UploadOutlined />} />
                    </Upload>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={20}>
                      <Col  span={12}>
                        <Form.Item label={"Latitude"} name={"latitude"} initialValue={Cors.lat}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col  span={12}>
                        <Form.Item label={"Longitude"} name={"longitude"} initialValue={Cors.lng}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row> */}
            {/* <Row gutter={30}>
              <Col span={12}>
                <Form.Item label={getLocaleMessages('Agent Status')} name={'status'}>
                  <Radio.Group
                    onChange={handleAgentStatus}
                    defaultValue={Status}
                    value={Status}
                  >
                    <Radio value={1}>{getLocaleMessages("Active")}</Radio>
                    <Radio value={2}>{getLocaleMessages("InActive")}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages('Payment Option')}
                  name={'paymentoption'}
                  rules={[
                    {
                      required: true,
                      message: 'Please input payment method!',
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={handlePaymentChange}
                    defaultValue={PayOption}
                    value={PayOption}
                  >
                    <Radio value={1}>{getLocaleMessages("COD")}</Radio>
                    <Radio value={2}>{getLocaleMessages("Online")}</Radio>
                    <Radio value={3}>{getLocaleMessages("Both")}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row> */}

            <div className="button-center">
              <Button onClick={handleCancel} className="save-btn">
                {getLocaleMessages("Cancel")}
              </Button>
              {AgencyId >= 0 && visible && (
                <Button
                  type="primary"
                  className="cs-antd-btn"
                  onClick={() => setvisible(!visible)}
                >
                  {getLocaleMessages("Change Password")}
                </Button>
              )}
              {AgencyId >= 0 && (
                <Button type="primary" htmlType="submit" className="save-btn">
                  {props.location.state !== undefined && agencydata_byid.id > 0
                    ? getLocaleMessages("Save")
                    : getLocaleMessages("Create")}
                </Button>
              )}
              {AgencyId < 0 && (
                <Button type="primary" htmlType="submit" className="save-btn">
                  {getLocaleMessages("Singup")}
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default ApplicationDetails;
