import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Input, Form, Button, Typography } from "antd";
import actions from "./../../../redux/user/actions";
import payActions from "./../../../redux/admin/report/actions";
import { getLocalData, getLocaleMessages } from "redux/helper";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { message } from "antd";
const { Title, Paragraph } = Typography;
const Payment = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )

  const {
    visible,
    SelectedBooking,
    setShowPaymentDialog,
    setSelectedBooking,
  } = props;
  const onFinish = (values) => {
    confirmationRequest(values);
  };

  const onCancel = () => {
    setShowPaymentDialog(!visible);
    setSelectedBooking({});
    usedForm.resetFields();
  };

  const confirmationRequest = (values) => {
    if (
      values.payment >
      (SelectedBooking.pay +
        SelectedBooking.pay * (SelectedBooking.vat / 100) -
        SelectedBooking.balance >
      0
        ? SelectedBooking.pay +
          SelectedBooking.pay * (SelectedBooking.vat / 100) -
          SelectedBooking.balance
        : 0)
    ) {
      message.error(
        getLocaleMessages("Payment not exceed than balance amount")
      );
      return;
    }
    const data = {
      agencyid: SelectedBooking.id,
      bookingid: 0,
      payment: values.payment,
      status:
        values.payment <
        (SelectedBooking.pay +
          SelectedBooking.pay * (SelectedBooking.vat / 100) -
          SelectedBooking.balance >
        0
          ? SelectedBooking.pay +
            SelectedBooking.pay * (SelectedBooking.vat / 100) -
            SelectedBooking.balance
          : 0)
          ? 0
          : 1,
    };
    return Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: getLocaleMessages("Payment"),
      content: <span>{getLocaleMessages("Are you sure to pay")}?</span>,
      okText: getLocaleMessages("Yes"),
      cancelText: getLocaleMessages("No"),
      onOk() {
        dispatch({
          type: actions.MAKE_ADMIN_PAYMENT,
          payload: data,
        });
        setShowPaymentDialog(!visible);
        usedForm.resetFields();
        return;
      },
      onCancel() {
        return;
      },
    });
  };

  useEffect(() => {
    if (!visible) {
      dispatch({
        type: payActions.GET_BOOKINGREPT_LIST,
        payload: {
          agency: 0,
          fdate: format(new Date(), "yyyy-MM-dd"),
          ldate: format(new Date(), "yyyy-MM-dd"),
        },
      });
    }
  }, [visible]);

  return (
    <Modal
      title={getLocaleMessages("Admin Payment")}
      visible={visible}
      onCancel={onCancel}
      centered
      footer={false}
      className="modal-ui-1"
      width="30%"
      destroyOnClose
    >
      <div className="modal-body-ui">
        <Form
          form={usedForm}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Paragraph className="split">
            {getLocaleMessages("Total Payment:")}
            <span>
              {" "}
              {getLocaleMessages(preferredCurrency)}{" "}
              {(SelectedBooking.pay +
                SelectedBooking.pay * (SelectedBooking.vat / 100)) * parseFloat(currencyConversion).toFixed(2)}
            </span>
          </Paragraph>
          <Paragraph className="split">
            {getLocaleMessages("Balance Payment:")}
            <span>
              {" "}
              {getLocaleMessages(preferredCurrency)}{" "}
              {SelectedBooking.pay +
                SelectedBooking.pay * (SelectedBooking.vat / 100) -
                SelectedBooking.balance >
              0
                ? (SelectedBooking.pay +
                  SelectedBooking.pay * (SelectedBooking.vat / 100) -
                  SelectedBooking.balance) * parseFloat(currencyConversion).toFixed(2)
                : 0}
            </span>
          </Paragraph>
          <Form.Item
            label={getLocaleMessages("Amount to pay:")}
            name="payment"
            rules={[
              {
                required: true,
                message: getLocaleMessages("Please input the payment you wish"),
              },
            ]}
          >
            <Input
              rows={"3"}
              placeholder={getLocaleMessages("Enter amount Here")}
            />
          </Form.Item>
          <div className="button-center">
            <Button type="primary" htmlType="submit" className="save-btn">
              {getLocaleMessages("Pay")}
            </Button>
            <Button onClick={onCancel} type="primary" className="save-btn">
              {getLocaleMessages("Cancel")}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default Payment;
