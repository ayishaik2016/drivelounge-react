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
} from "antd";
import { formProps } from "./../../../../helpers/constant";
import settingsAction from "./../../../../redux/admin/pageManagement/actions";
import "./../../../../assets/css/adminStyle.css";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { history } from "redux/store";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";

const { TabPane } = Tabs;
const { TextArea } = Input;

const FAQComponent = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { selected_faq, isLoading } = useSelector(
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

  const handleFAQStatus = (e) => {
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
      action: props.location.state == undefined ? "I" : "U",
      languageid: Language,
      subLang: subLang == "en" ? "1" : "2",
      faqen: {
        id:
          selected_faq !== undefined &&
          selected_faq.length > 0 &&
          selected_faq[0].id !== undefined
            ? selected_faq[0].id
            : 0,
        faqid:
          selected_faq !== undefined &&
          selected_faq.length > 0 &&
          selected_faq[0].faqid !== undefined
            ? selected_faq[0].faqid
            : 0,
        languageid: 1,
        languageshortname: "en",
        question: values.enquestion,
        answer: values.answer,
        //answer: draftToHtml(convertToRaw(richEditENValue.getCurrentContent())),
      },
      faqar: {
        id:
          selected_faq !== undefined &&
          selected_faq.length > 0 &&
          selected_faq[0].id !== undefined
            ? selected_faq[0].id
            : 0,
        faqid:
          selected_faq !== undefined &&
          selected_faq.length > 0 &&
          selected_faq[0].faqid !== undefined
            ? selected_faq[0].faqid
            : 0,
        languageid: 2,
        languageshortname: "ar",
        question: values.arquestion,
        answer: values.answer,
        //answer: draftToHtml(convertToRaw(richEditARValue.getCurrentContent())),
      },
      status: Status,
      sortorder: values.sortorder,
    };
    dispatch({
      type: settingsAction.FAQIUD_STATUS,
      payload: data,
    });
  };

  const handleCancel = () => {
    history.push("/admin/faq");
  };

  useEffect(() => {
    if (props.location.state !== undefined) {
      dispatch({
        type: settingsAction.GET_FAQ_INFO_BYID,
        payload: props.location.state.faqid,
      });
      return;
    } else {
      usedForm.resetFields();
    }
  }, []);

  useEffect(() => {
    if (
      selected_faq !== undefined &&
      props.location.state !== undefined &&
      selected_faq.length > 0 &&
      selected_faq[0].question !== undefined
    ) {
      selected_faq.map((faq) => {
        if (faq.languageid == 1) {
          usedForm.setFieldsValue({
            enquestion: faq.question,
          });
          setStatus(faq.faqstatus);
          usedForm.setFieldsValue({
            sortorder: faq.sortorder,
            answer: faq.answer,
          });
          setRichEditENValue(
            EditorState.createWithContent(
              ContentState.createFromText(faq.answer)
            )
          );
        }
        if (faq.languageid == 2) {
          usedForm.setFieldsValue({
            aruestion: faq.question,
          });
          setStatus(faq.faqstatus);
          usedForm.setFieldsValue({
            sortorder: faq.sortorder,
            answer: faq.answer,
          });
          setRichEditARValue(
            EditorState.createWithContent(
              ContentState.createFromText(faq.answer)
            )
          );
        }
      });
    }
  }, [selected_faq]);

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
                <Row>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label={getLocaleMessages("Question")}
                      name={"enquestion"}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item
                      label={getLocaleMessages("Answer")}
                      name={"answer"}
                    >
                      <TextArea
                        placeholder=""
                        autoSize={{ minRows: 3, maxRows: 8 }}
                      />
                      {/* <Editor
                        editorState={richEditENValue}
                        onEditorStateChange={onChangeEN}
                      />{' '} */}
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={getLocaleMessages("Arabic")} key="2">
                <Row gutter={5}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label={getLocaleMessages("Question")}
                      name={"arquestion"}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item
                      label={getLocaleMessages("Answer")}
                      name={"answer"}
                    >
                      <TextArea
                        placeholder=""
                        autoSize={{ minRows: 3, maxRows: 8 }}
                      />
                      {/* <Editor
                        editorState={richEditARValue}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onChangeAR}
                        style={{ minHeight: 410 }}
                      />{' '} */}
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
            <Row gutter={30}>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label={getLocaleMessages("Sort Order")}
                  name={"sortorder"}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label={getLocaleMessages("FAQ Status")}
                  name={"status"}
                >
                  <Radio.Group
                    onChange={handleFAQStatus}
                    defaultValue={Status}
                    initialValue={Status}
                    value={Status}
                  >
                    <Radio key={1} value={1} style={{ fontSize: "14px" }}>
                      {getLocaleMessages("Active")}
                    </Radio>
                    <Radio key={2} value={2} style={{ fontSize: "14px" }}>
                      {getLocaleMessages("InActive")}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <div className="button-center">
              <Button type="primary" htmlType="submit" className="save-btn">
                {props.location.state == undefined
                  ? getLocaleMessages("Create")
                  : getLocaleMessages("Update")}
              </Button>
              <Button onClick={handleCancel} className="save-btn">
                {getLocaleMessages("Cancel")}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default FAQComponent;
