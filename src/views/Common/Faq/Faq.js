import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import actions from "./../../../redux/admin/enquiry/actions";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Card,
  Select,
  Switch,
  Form,
  Divider,
  Typography,
  Layout,
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
//import Layout from 'antd/lib/layout/layout';
import "./../../../assets/css/userStyle.css";
import commonactions from "./../../../redux/common/actions";
import dompurify from "dompurify";
import "./../../../assets/css/userStyle.css";
import { getLocaleMessages } from "redux/helper";
const sanitizer = dompurify.sanitize;

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const FaqComponet = (props) => {
  const dispatch = useDispatch();
  const { faqData } = useSelector((state) => state.Common);
  const [HData, setHData] = useState(" ");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("faq")) || {};

    if (data && data.lang !== undefined && data.lang > 0) {
      dispatch({
        type: commonactions.GET_FAQ_DATA_LIST,
        payload: { id: data.lang },
      });
    }
  }, []);

  return (
    <>
      <Layout>
        <Header />
        <Content className="content_mt">
          <section className="search-result title_zero">
            <div className="container">
              <Title level={4}>{getLocaleMessages("FAQ")} </Title>
            </div>
          </section>
          <div className="page-container">
            <div className="container">
              {faqData.length > 0 &&
                faqData.map((value) => {
                  return (
                    <>
                      <h2>{value.question} </h2>
                      <div dangerouslySetInnerHTML={{ __html: value.answer }} />
                    </>
                  );
                })}
            </div>
          </div>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default FaqComponet;
