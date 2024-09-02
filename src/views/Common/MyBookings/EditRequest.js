import React from "react";
import { useDispatch } from "react-redux";
import { Modal, Input, Form, Button } from "antd";
import actions from "./../../../redux/user/actions";
import { getLocaleMessages } from "redux/helper";

const EditRequest = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();

  const {
    visible,
    SelectedBooking,
    setShowRequestDialog,
    setSelectedBooking,
  } = props;
  const onFinish = (values) => {
    dispatch({
      type: actions.EDIT_BOOKING_REQUEST,
      payload: { ...SelectedBooking, request: values.request },
    });
    setShowRequestDialog(!visible);
    setSelectedBooking({});
    usedForm.resetFields();
  };

  const onCancel = () => {
    setShowRequestDialog(!visible);
    setSelectedBooking({});
    usedForm.resetFields();
  };
  return (
    <Modal
      title={getLocaleMessages("Change Request")}
      visible={visible}
      onCancel={onCancel}
      centered
      footer={false}
      className="modal-ui-1"
      width="100%"
      destroyOnClose
    >
      <div className="modal-body-ui">
        <Form
          form={usedForm}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="request"
            rules={[
              {
                required: true,
                message: getLocaleMessages("Please input your request"),
              },
            ]}
          >
            <Input.TextArea
              rows={"3"}
              placeholder={getLocaleMessages("Type Here")}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {getLocaleMessages("SEND")}
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default EditRequest;
