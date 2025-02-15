import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/user/actions";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Card,
  Layout,
  Select,
  Switch,
  Form,
  Divider,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formProps } from "./../../../helpers/constant";
import { UploadOutlined } from "@ant-design/icons";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import "./../../../assets/css/userStyle.css";
import { getLocaleMessages } from "redux/helper";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const TransactionComponet = (props) => {
  const {
    handleClick,
    visible,
    onFinish,
    onCancel,
    LoginSignup,
    loader,
    onChange,
  } = props;
  const [usedForm] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const state = props.location.state;
    const params = new URLSearchParams(props.location.search);
    const myParam = params.get('id');
    dispatch({
      type: actions.GET_PAYMENT_CONFIRMATION,
      payload: { id: params.get('id'), paymentId: params.get('PaymentId'), tranId: params.get('TranId'), result: params.get('Result') },
    });
  }, []);

  return (
    <>
      <div className="payment-div">
        <h1>Payment Processing...</h1>
        <p>Please don't refresh or close the page</p>
      </div>
    </>
  );
};

export default TransactionComponet;
