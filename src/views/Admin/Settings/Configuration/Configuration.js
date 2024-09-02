import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Input,
  Button,
  Card,
  Form,
  Switch,
  Upload,
  InputNumber,
  Radio,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formProps } from "../../../../helpers/constant";
import settingsAction from "./../../../../redux/admin/settings/actions";
import { uploadRequest } from "./../../../../helpers/axiosClient";
import "../../../../assets/css/adminStyle.css";
import format from "date-fns/format";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";

const { TextArea } = Input;

const WebSettings = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { isLoading, webconfig_data } = useSelector(
    (state) => state.WebSettings
  );
  const [curTime, setcurTime] = useState(new Date());
  const [SiteLogo, setSiteLogo] = useState();
  const [FavLogo, setFavLogo] = useState();
  const [Commission, setCommission] = useState(1);

  const onFavChange = ({ file, onSuccess, onError }) => {
    let form = new FormData();
    form.append("file", file);
    uploadRequest("public/upload", form)
      .then((res) => {
        let image = res.data[0].data;
        let imageName = image.filePath.split("__uploads/")[1];
        setFavLogo({
          name: imageName,
          status: "done",
          url: `https://api.drivelounge.com/${imageName}`,
          thumbUrl: `https://api.drivelounge.com/${imageName}`,
        });
        usedForm.setFieldsValue({ fav_logo: imageName });
        onSuccess("ok");
      })
      .catch((err) => {
        onError({ err });
      });
  };

  useEffect(() => {
    if (webconfig_data) {
      usedForm.setFieldsValue({ ...webconfig_data });
      setSiteLogo({
        name: webconfig_data.site_logo,
        status: "done",
        url: `https://api.drivelounge.com/${webconfig_data.site_logo}`,
        thumbUrl: `https://api.drivelounge.com/${webconfig_data.site_logo}`,
      });
      setFavLogo({
        name: webconfig_data.fav_logo,
        status: "done",
        url: `https://api.drivelounge.com/${webconfig_data.fav_logo}`,
        thumbUrl: `https://api.drivelounge.com/${webconfig_data.fav_logo}`,
      });
    }
  }, [webconfig_data]);

  const onLogoChange = ({ file, onSuccess, onError }) => {
    let form = new FormData();
    form.append("file", file);
    uploadRequest("public/upload", form)
      .then((res) => {
        let image = res.data[0].data;
        let imageName = image.filePath.split("__uploads/")[1];
        setSiteLogo({
          name: imageName,
          status: "done",
          url: `https://api.drivelounge.com/${imageName}`,
          thumbUrl: `https://api.drivelounge.com/${imageName}`,
        });
        usedForm.setFieldsValue({ site_logo: imageName });
        onSuccess("ok");
      })
      .catch((err) => {
        onError({ err });
      });
  };

  const onFinishDetails = (values) => {
    dispatch({
      type: settingsAction.UPDATE_WEB_SETTINGS_CONFIG,
      payload: values,
    });
  };
  useEffect(() => {
    dispatch({
      type: settingsAction.GET_WEB_SETTINGS_CONFIG,
      payload: false,
    });
  }, []);

  const handleCommissionChange = (e) => {
    setCommission(e.target.value);
    usedForm.setFieldsValue({ commissiontype: e.target.value });
  };

  useEffect(() => {
    const timer = setInterval(() => setcurTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Card
          title={getLocaleMessages("Web Settings")}
          extra={`${curTime.toLocaleString()}`}
        >
          <div className="dashboard-form">
            <Form
              form={usedForm}
              onFinish={onFinishDetails}
              {...formProps}
              initialValues={{ currency_symbol: false }}
            >
              <Row gutter={40}>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Web Name")}
                    name="appname"
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Description")}
                    name={"appdescription"}
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <TextArea
                      placeholder=""
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                    {/* <Input placeholder="" /> */}
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Meta Keyword")}
                    name={"metakeyword"}
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Meta Description")}
                    name={"metadescription"}
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <TextArea
                      placeholder=""
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                    {/* <Input placeholder="" /> */}
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Email")}
                    name={"email"}
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col>

                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Contact No")}
                    name={"contactnumber"}
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
                    <Input placeholder="" type="number" />
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Contact Address")}
                    name={"contactaddress"}
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <TextArea
                      placeholder=""
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Map Key")}
                    name={"mapkey"}
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Commission Type")}
                    name={"commissiontype"}
                  >
                    <Radio.Group
                      onChange={handleCommissionChange}
                      value={Commission}
                    >
                      <Radio value={1} style={{ fontSize: "14px" }}>
                        {getLocaleMessages("Value based")}
                      </Radio>
                      <Radio value={2} style={{ fontSize: "14px" }}>
                        {getLocaleMessages("Percentage based")}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Commission Value")}
                    name={"commissionvalue"}
                  >
                    <Input placeholder="" type="number" />
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Site Copyright")}
                    name={"site_copyright"}
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col>

                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Currency Decimal Place")}
                    name={"currency_decimalplace"}
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <InputNumber
                      max={10}
                      min={0}
                      placeholder=""
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Currency Symbol Left")}
                    name={"currency_symbol"}
                    valuePropName="checked"
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12} className="inner-content"></Col>
                <Col span={12} className="inner-content">
                  <div className="upload_position">
                    <Form.Item
                      label={getLocaleMessages("Site Logo")}
                      name={"site_logo"}
                      rules={[
                        {
                          required: true,
                          message: getLocaleMessages("Fields are required"),
                        },
                      ]}
                    >
                      <Input disabled placeholder="" />
                    </Form.Item>

                    <Upload
                      customRequest={onLogoChange}
                      icon={<UploadOutlined />}
                      listType="picture"
                      fileList={
                        SiteLogo !== undefined && SiteLogo.name !== undefined
                          ? [SiteLogo]
                          : []
                      }
                    >
                      <Button icon={<UploadOutlined />} />
                    </Upload>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="upload_position">
                    <Form.Item
                      label={getLocaleMessages("Fav Icon")}
                      name={"fav_logo"}
                      rules={[
                        {
                          required: true,
                          message: getLocaleMessages("Fields are required"),
                        },
                      ]}
                    >
                      <Input disabled placeholder="" />
                    </Form.Item>
                    <Upload
                      customRequest={onFavChange}
                      icon={<UploadOutlined />}
                      listType="picture"
                      fileList={
                        FavLogo !== undefined && FavLogo.name !== undefined
                          ? [FavLogo]
                          : []
                      }
                    >
                      <Button icon={<UploadOutlined />} />
                    </Upload>
                  </div>
                </Col>
              </Row>
              <div className="button-center">
                <ShowForPermission permission="update" module="config">
                  <Button type="primary" htmlType="submit" className="save-btn">
                    {getLocaleMessages("Save")}
                  </Button>
                </ShowForPermission>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default WebSettings;
