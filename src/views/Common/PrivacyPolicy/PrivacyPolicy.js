import React, { useEffect, useState } from 'react';
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
} from 'antd';
import Header from './../Header/Header';
import Footer from './../Footer/Footer';
import LoadingOverlay from 'react-loading-overlay';
import './../../../assets/css/userStyle.css';
import { getLocaleMessages } from 'redux/helper';
const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const PrivacyPolicyComponet = (props) => {
  const [isLoading, setisLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setisLoading(false)
    }, 1000);
  }, [])
  return (
    <>
    <LoadingOverlay
		  active={isLoading}
		  spinner
		  text={getLocaleMessages('Loading your content...')}
		  >
      <Layout>
        <Header />
        <Content className="content_mt">
          <section className="search-result title_zero">
            <div className="container">
              <Title level={4}>{getLocaleMessages("PRIVACY AND POLICY")}</Title>
            </div>
          </section>

          <div className="page-container">
            <div className="container">
              <p>
                recognize the importance of protecting the personal information
                collected from users in the operation of its services and taking
                reasonable steps to maintain the security, integrity and privacy
                of any information in accordance with this Privacy Policy. By
                submitting your information to Wiley you consent to the
                practices described in this policy.
              </p>
              <p>
                This Privacy Policy describes how Wiley collects and uses the
                personal information you provide to Wiley. It also describes the
                choices available to you regarding our use of your personal
                information and how you can access and update this information.
              </p>
            </div>
          </div>
        </Content>
        <Footer />
      </Layout>
      </LoadingOverlay>
    </>
  );
};

export default PrivacyPolicyComponet;
