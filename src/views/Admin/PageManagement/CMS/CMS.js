import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history, store } from "redux/store";
import LoadingOverlay from "react-loading-overlay";
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
} from "antd";
import { formProps } from "./../../../../helpers/constant";
import settingsAction from "./../../../../redux/admin/pageManagement/actions";
import "./../../../../assets/css/adminStyle.css";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { getLocaleMessages } from "redux/helper";

const { TabPane } = Tabs;

const CMSComponent = (props) => {
  const dispatch = useDispatch();
  // const history = useHistory()
  const [usedForm] = Form.useForm();
  const { selected_cms, isLoading } = useSelector(
    (state) => state.PageManagament
  );
  const { subLang } = useSelector((state) => state.Auth);
  const [Language, setLanguage] = useState(1);
  const [richEditENValue, setRichEditENValue] = useState(
    EditorState.createEmpty()
  );
  const [richEditARValue, setRichEditARValue] = useState(
    EditorState.createEmpty()
  );
  const [Status, setStatus] = useState(1);

  const handleCMSStatus = (e) => {
    setStatus(e.target.value);
  };

  const onChangeEN = (value) => {
    setRichEditENValue(value);
  };

  const onChangeAR = (value) => {
    setRichEditARValue(value);
  };

  const handleLanguageTab = (e) => {
    setLanguage(e);
  };

  const handleSubmit = async (values) => {
    let data = {
      id: selected_cms[0] !== undefined ? selected_cms[0].id : 0,
      action: props.location.state == undefined ? "I" : "U",
      languageid: Language,
      subLang: subLang == "en" ? "1" : "2",
      cmsen: {
        cmsid: selected_cms[0] !== undefined ? selected_cms[0].cmsid : 0,
        languageid: 1,
        languageshortname: "en",
        name: values.enname,
        title: "enpagetitle",
        keywords: "enkeywords",
        description: "endescription",
        content: draftToHtml(convertToRaw(richEditENValue.getCurrentContent())),
        slug: "enslug",
        sortorder: values.ensortorder,
      },
      cmsar: {
        cmsid: selected_cms[0] !== undefined ? selected_cms[0].cmsid : 0,
        languageid: 2,
        languageshortname: "ar",
        name: values.arname,
        title: "title",
        keywords: "arkeywords",
        description: "ardescription",
        content: draftToHtml(convertToRaw(richEditARValue.getCurrentContent())),
        slug: "arslug",
        sortorder: values.arsortorder,
      },
      status: Status,
      relatedpage: values.relatedpage.toUpperCase()
    };
    dispatch({
      type: settingsAction.CMSIUD_STATUS,
      payload: data,
    });
  };

  useEffect(() => {
    if (props.location.state !== undefined) {
      dispatch({
        type: settingsAction.GET_CMS_INFO_BYID,
        payload: props.location.state.cmsid,
      });
    } else {
      usedForm.resetFields();
    }
  }, []);

  useEffect(() => {
    if (
      props.location.state !== undefined &&
      selected_cms &&
      selected_cms[0] !== undefined
    ) {
		var engPos = 0;
		var arPos = 1;
		if (selected_cms[1].languageid == 1) {
			engPos = 1;
			arPos = 0;
		}
      if (selected_cms[engPos].languageid == 1) {
        usedForm.setFieldsValue({
          enname: selected_cms[engPos].name,
          ensortorder: selected_cms[engPos].sortorder,
        });
        setRichEditENValue(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(selected_cms[engPos].content)
            )
          )
          // EditorState.createWithContent(
          //   ContentState.createFromText(
          //     convertFromHTML(selected_cms[0].content)
          //   )
          // )
        );
      }
      if (selected_cms[arPos].languageid == 2) {
        usedForm.setFieldsValue({
          arname: selected_cms[arPos].name,
          arsortorder: selected_cms[arPos].sortorder,
        });
        setRichEditARValue(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(selected_cms[arPos].content)
            )
          )
          // EditorState.createWithContent(
          //   ContentState.createFromText(selected_cms[0].content)
          // )
        );
      }

      usedForm.setFieldsValue({ status: selected_cms[0].cmsstatus });
      usedForm.setFieldsValue({ relatedpage: selected_cms[0].relatedpage });
      setStatus(selected_cms[0].cmsstatus);
    }
  }, [selected_cms]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Card>
          <Form form={usedForm} onFinish={handleSubmit} {...formProps}>
            <Tabs
              defaultActiveKey={subLang == "en" ? "1" : "2"}
              onChange={handleLanguageTab}
            >
              <TabPane tab={getLocaleMessages("English")} key="1">
                <Row gutter={24}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label={getLocaleMessages("Page Title")}
                      name={"enname"}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row
                  style={{
                    border: "solid 2px #bdbdc3",
                  }}
                >
                  <Col span={24}>
                    <Editor
                      editorState={richEditENValue}
                      onEditorStateChange={onChangeEN}
                    />
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label={getLocaleMessages("Sort Order")}
                      name={"ensortorder"}
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={getLocaleMessages("Arabic")} key="2">
                <Row gutter={24}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label={getLocaleMessages("Page Title")}
                      name={"arname"}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row
                  style={{
                    border: "solid 2px #bdbdc3",
                  }}
                >
                  <Col span={24}>
                    <Editor
                      editorState={richEditARValue}
                      onEditorStateChange={onChangeAR}
                    />
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label={getLocaleMessages("Sort Order")}
                      name={"arsortorder"}
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
            <Row gutter={20}>
              <Col className="gutter-row" span={24}>
                <Form.Item
                  label={getLocaleMessages("Related Page")}
                  name={"relatedpage"}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label={getLocaleMessages("CMS Status")}
                  name={"status"}
                >
                  <Radio.Group
                    onChange={handleCMSStatus}
                    defaultValue={Status}
                    value={Status}
                  >
                    <Radio value={1} style={{ fontSize: "14px" }}>
                      {getLocaleMessages("Active")}
                    </Radio>
                    <Radio value={2} style={{ fontSize: "14px" }}>
                      {getLocaleMessages("InActive")}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <div className="button-center">
              <Button
                onClick={() => {
                  history.push("/admin/cms");
                }}
                className="save-btn"
              >
                {getLocaleMessages("Cancel")}
              </Button>
              <Button type="primary" htmlType="submit" className="save-btn">
                {props.location.state === undefined
                  ? getLocaleMessages("Create")
                  : getLocaleMessages("Update")}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default CMSComponent;
