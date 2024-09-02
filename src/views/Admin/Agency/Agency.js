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
} from "antd";
import { formProps } from "../../../helpers/constant";
import settingsAction from "../../../redux/admin/agency/actions";
import Map from "./Map";
import AutoCompleteAddress from "./AutoCompleteAddress";
import "./../../../assets/css/adminStyle.css";
import { uploadRequest } from "../../../helpers/axiosClient";
import AddressAutoComplete from "./../../Common/AutoCompleteSearch/AutoComplete";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;

const CreateAgency = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { agency_data, agencydata_byid } = useSelector((state) => state.Agency);
  const [Language, setLanguage] = useState(1);
  const [Commission, setCommission] = useState(1);
  const [Status, setStatus] = useState(1);
  const [PayOption, setPayOption] = useState(3);
  const [ServiceLocation, setServiceLocation] = useState("");
  const [Cors, setCors] = useState({
    lat: 24.6877,
    lng: 46.7219,    
    address: "",
  });

  const handleAgencyImage = ({ file }) => {
    let form = new FormData();
    form.append("file", file);
    // if(file.status == "done"){}
    uploadRequest("admin/upload", form).then((res) => {
      let image = res.data[0].data;
      let imageName = image.filePath.split("__uploads/")[1];
      usedForm.setFieldsValue({ photopath: imageName });
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

  const handleLicenseImage = ({ file }) => {
    let form = new FormData();
    form.append("file", file);
    uploadRequest("admin/upload", form).then((res) => {
      let image = res.data[0].data;
      let imageName = image.filePath.split("__uploads/")[1];
      usedForm.setFieldsValue({ licensepath: imageName });
    });
  };

  useEffect(() => {
    usedForm.setFieldsValue({
      latitude: Cors.lat,
      longitude: Cors.lng,
      address: Cors.address,
    });
  }, [Cors]);

  const handleSubmit = async (values) => {
    var data = {
      action: props.location.state !== undefined ? "U" : "I",
      id: agencydata_byid.id !== undefined ? agencydata_byid.id : -1,
      languageid: Language,
      agentname: Language == 1 ? values.enname : values.arname,
      agentdescription:
        Language == 1 ? values.endescription : values.ardescription,
      agentaddress: Cors.address,
      firstname: values.firstname,
      lastname: values.lastname,
      username: values.username,
      password: values.password,
      email: values.email,
      latitude: Cors.lat,
      longitude: Cors.lng,
      crnumber: values.crnumber,
      commissiontype: Commission,
      commissionvalue: values.commissionvalue,
      contactnumber: values.contactnumber,
      sortorder: values.sortorder,
      vat: values.vat,
      servicelocation: ServiceLocation,
      paymentoption: PayOption,
      photopath: values.photopath,
      licensepath: values.licensepath,
      status: Status,
    };
    if (props.location.state !== undefined) {
      dispatch({
        type: settingsAction.AGENCY_INFORMATION_IUD,
        payload: data,
      });
    } else {
      dispatch({
        type: settingsAction.AGENCY_INFORMATION_IUD,
        payload: data,
      });
    }
  };

  useEffect(() => {
    if (props.location.state !== undefined) {
      dispatch({
        type: settingsAction.GET_AGENCY_INFO_BYID,
        payload: props.location.state.agentid,
      });

      return;
    } else {
      usedForm.resetFields();
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
        enname:
          agencydata_byid.languageid === 1 ? agencydata_byid.agentname : "",
        endescription:
          agencydata_byid.languageid === 1 ? agencydata_byid.agentaddress : "",
        arname:
          agencydata_byid.languageid === 2 ? agencydata_byid.agentname : "",
        ardescription:
          agencydata_byid.languageid === 2 ? agencydata_byid.agentaddress : "",
      });
      setCors({
        lat: agencydata_byid.latitude,
        lng: agencydata_byid.longitude,
        address: agencydata_byid.agentaddress,
      });
      setLanguage(agencydata_byid.languageid);
      setCommission(agencydata_byid.commissiontype);
      setPayOption(agencydata_byid.paymentoption);
    }
  }, [agencydata_byid]);

  return (
    <div className="page-container">
      <Title level={2}>
        {agencydata_byid.id !== undefined ? "Update Agency" : "Create Agency"}
      </Title>
      <Form
        form={usedForm}
        layout="vertical"
        onFinish={handleSubmit}
        {...formProps}
      >
        <Row gutter={30}>
          <Col span={12}>
            <div className="tab-card-body">
              <Tabs defaultActiveKey="1" onChange={handleLanguageTab}>
                <TabPane tab="English" key="1">
                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
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
                      <div className="form-uploads">
                        <Upload
                          customRequest={handleAgencyImage}
                          icon={<UploadOutlined />}
                        >
                          <Button icon={<UploadOutlined />}></Button>
                        </Upload>
                      </div>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={"Agent Name"} name={"enname"}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={24}>
                      <Form.Item label={"Description"} name={"endescription"}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="Arabic" key="2">
                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
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
                      <div className="form-uploads">
                        {" "}
                        <Upload
                          customRequest={handleAgencyImage}
                          icon={<UploadOutlined />}
                        >
                          <Button icon={<UploadOutlined />}></Button>
                        </Upload>{" "}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={"Agent Name"} name={"arname"}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={24}>
                      <Form.Item label={"Description"} name={"ardescription"}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>

            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"First Name"} name={"firstname"}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Last Name"} name={"lastname"}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Agent Email"} name={"email"}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Agent Address"} name={"address"}>
                  <AutoCompleteAddress cors={(e) => setCors(e)} height="0px" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Username"} name={"username"}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Password"} name={"password"}>
                  <Input type="password" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label={"Latitude"}
                  name={"latitude"}
                  initialValue={Cors.lat}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Longitude"}
                  name={"longitude"}
                  initialValue={Cors.lng}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"CR Number"} name={"crnumber"}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Contact Nunber"}
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
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Sort Order"} name={"sortorder"}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Vat"} name={"vat"}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Commission Type"} name={"commissiontype"}>
                  <Radio.Group
                    onChange={handleCommissionChange}
                    defaultValue={Commission}
                    value={Commission}
                  >
                    <Radio value={1}>Value based</Radio>
                    <Radio value={2}>Percentage based</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Commission Value"} name={"commissionvalue"}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="licensepath"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please upload driving license!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <div className="form-uploads">
                  {" "}
                  <Upload
                    customRequest={handleLicenseImage}
                    icon={<UploadOutlined />}
                  >
                    <Button icon={<UploadOutlined />}></Button>
                  </Upload>{" "}
                </div>
              </Col>
              <Col span={12}>
                <Form.Item label={"Service Location"} name={"servicelocation"}>
                  <AddressAutoComplete
                    className="ant-input"
                    setLocation={setServiceLocation}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Agent Status"} name={"status"}>
                  <Radio.Group
                    onChange={handleAgentStatus}
                    defaultValue={Status}
                    value={Status}
                  >
                    <Radio value={1}>Active</Radio>
                    <Radio value={2}>Inactive</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Payment Option"} name={"paymentoption"}>
                  {/* payment 1- cod 2 - online 3 - both */}
                  <Radio.Group
                    onChange={handlePaymentChange}
                    defaultValue={PayOption}
                    value={PayOption}
                  >
                    <Radio value={1}>COD</Radio>
                    <Radio value={2}>Online</Radio>
                    <Radio value={3}>Both</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            {Cors.lat && Cors.lng && (
              <Map
                // google={this.props.google}
                center={{ lat: Cors.lat, lng: Cors.lng, address: Cors.address }}
                height="900px"
                zoom={15}
              />
            )}
          </Col>
        </Row>
        <div className="button-center">
          <Button htmlType="submit" className="save-btn">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="save-btn">
            {agencydata_byid.id !== undefined ? "UPDATE" : "Create"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateAgency;
