import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "antd";
import { formProps } from "../../../helpers/constant";
import settingsAction from "../../../redux/admin/agency/actions";
import Map from "./../Agency/Map";
import AutoCompleteAddress from "./../Agency/AutoCompleteAddress";
import { history, store } from "redux/store";
import LoadingOverlay from "react-loading-overlay";
import { uploadRequest } from "../../../helpers/axiosClient";
import { UploadOutlined } from "@ant-design/icons";
import { getLocaleMessages, getLocalDataType } from "redux/helper";
const { TabPane } = Tabs;
const { Title } = Typography;

const ApplicationDetails = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { agencydata_byid, isLoading } = useSelector((state) => state.Agency);
  const { subLang } = useSelector((state) => state.Auth);
  const [Language, setLanguage] = useState(1);
  const [Commission, setCommission] = useState(1);
  const [Status, setStatus] = useState(1);
  const [PayOption, setPayOption] = useState(3);
  const [AgencyId, setAgencyId] = useState(
    props.location.state !== undefined ? props.location.state : 0
  );
  const [Cors, setCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });
  const [AgencyImage, setAgencyImage] = useState({ name: "" });
  const [AgencyLicense, setAgencyLicense] = useState({ name: "" });
  const [Places, setPlaces] = useState("");
  const [AgencyVatDocs, setAgencyVatDocs] = useState({ name: "" });
  const handleAgencyImage = (options) => {
    const { file, onSuccess, onError } = options;
    let form = new FormData();
    form.append("file", file);
    uploadRequest("admin/upload", form)
      .then((res) => {
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
      sortorder: values.sortorder,
      vat: values.vat,
      vatnumber: values.vatnumber,
      vatdocument: values.vatdocument,
      servicelocation: Places,
      paymentoption: PayOption,
      photopath: values.photopath,
      status: Status,
    };
    dispatch({
      type: settingsAction.AGENCY_INFORMATION_IUD,
      payload: data,
    });
  };

  const handleCancel = () => {
    usedForm.resetFields();
    getLocalDataType() == "admin"
      ? history.push("/admin/application")
      : props.history.goBack();
  };

  useEffect(() => {
    if (AgencyId > 0) {
      dispatch({
        type: settingsAction.GET_AGENCY_INFO_BYID,
        payload: props.location.state,
      });
      return;
    } else {
      usedForm.resetFields();
      setCors({ lat: 24.6877, lng: 46.7219, address: "" });
      setStatus(1);
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
        agentaddress: agencydata_byid.agentaddress,
        crdocument: agencydata_byid.crdocs,
        vatdocument: agencydata_byid.vatdocs,
        vat: JSON.stringify(agencydata_byid.vat),
      });
      setCors({
        lat: agencydata_byid.latitude,
        lng: agencydata_byid.longitude,
        address: agencydata_byid.agentaddress,
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
    } else {
      usedForm.resetFields();
      setCors({ lat: 24.6877, lng: 46.7219, address: "" });
      setStatus(1);
      setAgencyImage({ name: "" });
      setAgencyLicense({ name: "" });
      setAgencyVatDocs({ name: "" });
    }
  }, [agencydata_byid]);

  useEffect(() => {
    usedForm.setFieldsValue({ paymentoption: PayOption });
  }, []);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Card
          title={
            agencydata_byid.id !== undefined
              ? getLocaleMessages("Update Agency")
              : getLocaleMessages("Create Agency")
          }
        >
          <Form
            className="login-form"
            form={usedForm}
            layout="vertical"
            onFinish={handleSubmit}
            {...formProps}
          >
            <div>
              <Row gutter={30}>
                <Col span={12}>
                  <Tabs
                    defaultActiveKey={subLang == "en" ? "1" : "2"}
                    onChange={handleLanguageTab}
                  >
                    <TabPane tab={getLocaleMessages("English")} key="1">
                      <div className="upload_position">
                        <Form.Item
                          label={getLocaleMessages("Agency Logo")}
                          name="photopath"
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please upload image!",
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
                          fileList={
                            AgencyImage.name !== "" ? [AgencyImage] : []
                          }
                        >
                          <Button icon={<UploadOutlined />}></Button>
                        </Upload>
                      </div>

                      <Form.Item
                        label={getLocaleMessages("Agent Name")}
                        name={"enname"}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please input Agency Name!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={getLocaleMessages("Description")}
                        name={"endescription"}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please input the description!",
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
                              message: "Please upload image!",
                            },
                          ]}
                        >
                          <Input disabled />
                        </Form.Item>
                        <Upload
                          fileList={
                            AgencyImage.name !== "" ? [AgencyImage] : []
                          }
                          customRequest={handleAgencyImage}
                          onRemove={handleRemoveAgencyImage}
                          icon={<UploadOutlined />}
                        >
                          <Button icon={<UploadOutlined />}></Button>
                        </Upload>{" "}
                      </div>

                      <Form.Item
                        label={getLocaleMessages("Agent Name")}
                        name={"arname"}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please input Agency Name!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={getLocaleMessages("Description")}
                        name={"ardescription"}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please input description!",
                          },
                        ]}
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </TabPane>
                  </Tabs>
                </Col>
                <Col span={12}>
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
                      height="560px"
                      zoom={15}
                    />
                  )}
                </Col>
              </Row>
            </div>

            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Service Location")}
                  name={"servicelocation"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input service location!",
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
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Agent Address")}
                  name={"agentaddress"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input address!",
                    },
                  ]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("First Name")}
                  name={"firstname"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input firstname!",
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
                      message: "Please input lastname!",
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
                      message: "Please input username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {props.location.state == undefined && (
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("Password")}
                    name={"password"}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please input your Password!",
                      },
                      {
                        min: 6,
                        message: "Password must be minimum 6 characters.",
                      },
                      {
                        max: 16,
                        message: "Password can be maximum 16 characters.",
                      },
                    ]}
                  >
                    <Input.Password type="password" />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Contact Number")}
                  name={"contactnumber"}
                  rules={[
                    {
                      required: true,
                      message: "Contact number is required",
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
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Agent Email")}
                  name={"email"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input email!",
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
                  label={getLocaleMessages("Sort Order")}
                  name={"sortorder"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input sortorder!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("VAT %")}
                  name={"vat"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input vat!",
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
                  label={getLocaleMessages("CR Number")}
                  name={"crnumber"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input CR number!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("VAT Number")}
                  name={"vatnumber"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input vatnumber!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
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
                  label={getLocaleMessages("CR Document")}
                  name="crdocument"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please upload image!",
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
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("VAT Document")}
                  name={"vatdocument"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please upload image!",
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
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label={getLocaleMessages("Agent Status")}
                  name={"status"}
                >
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
                  label={getLocaleMessages("Payment Option")}
                  name={"paymentoption"}
                  rules={[
                    {
                      required: true,
                      message: "Please input payment method!",
                    },
                  ]}
                >
                  {/* payment 1- cod 2 - online 3 - both */}
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
            </Row>

            <div className="button-center">
              <Button onClick={handleCancel} className="save-btn">
                {getLocaleMessages("Cancel")}
              </Button>
              {AgencyId >= 0 && (
                <Button type="primary" htmlType="submit" className="save-btn">
                  {props.location.state !== undefined && agencydata_byid.id > 0
                    ? getLocaleMessages("Update")
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
