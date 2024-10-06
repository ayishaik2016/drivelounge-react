import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Card,
  Input,
  Form,
  Menu,
  Tabs,
  Select,
  Image,
} from "antd";

import { history, store } from "./../../../redux/store";
import caractions from "./../../../redux/Listing/actions";
import actions from "./../../../redux/user/actions";
import "../../../assets/css/userStyle.css";
import { format } from "date-fns";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { getLocaleMessages } from "redux/helper";
import Map from "./../../Admin/Agency/MapDisplay";
import { Formatcurrency } from "helpers/constant";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Payment = (props) => {
  const [form] = Form.useForm();
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

  const handleMyAccount = () => {
    history.push("/booking");
  };

  return (
    <>
    
    </>
  );
};

export default Payment;