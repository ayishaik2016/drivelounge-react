import React from "react";
import { useDispatch } from "react-redux";
import { Modal, Input, Form, Button } from "antd";
import actions from "./../../../redux/user/actions";
import { getLocaleMessages, getLocalDataType } from "redux/helper";
import settingsAction from "../../../redux/admin/booking/actions";

const ForgotModal = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();

  const {
    visible,
    SelectedBooking,
    setShowCancelDialog,
    setSelectedBooking,
  } = props;
  const onFinish = (values) => {
    if (getLocalDataType("login_type") === "admin" || getLocalDataType("login_type") === "agency") {
      dispatch({
        type: settingsAction.CHANGE_BOOKING_STATUS,
        payload: { ...SelectedBooking, reason: values.reason },
      });
    } else {
      dispatch({
        type: actions.CANCEL_BOOKING,
        payload: { ...SelectedBooking, reason: values.reason },
      });
      return;
    }

    setShowCancelDialog(!visible);
    setSelectedBooking({});
    usedForm.resetFields();
  };

  const onCancel = () => {
    setShowCancelDialog(!visible);
    setSelectedBooking({});
    usedForm.resetFields();
  };
  return (
    <Modal
      title={getLocaleMessages("Cancellation Reason")}
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
            name="reason"
            rules={[
              {
                required: true,
                message: getLocaleMessages("Please input your reason"),
              },
            ]}
          >
            <Input.TextArea
              rows={"3"}
              placeholder={getLocaleMessages("Please input your reason")}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {getLocaleMessages("Confirm")}
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default ForgotModal;
