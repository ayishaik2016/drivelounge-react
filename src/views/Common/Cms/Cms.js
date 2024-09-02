import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Select, Typography, Layout } from "antd";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import "./../../../assets/css/userStyle.css";
import commonactions from "./../../../redux/common/actions";
import dompurify from "dompurify";
import "./../../../assets/css/userStyle.css";
import { getLocaleMessages } from "redux/helper";
const sanitizer = dompurify.sanitize;

const { Content } = Layout;
const { Title } = Typography;

const CmsComponet = (props) => {
  const dispatch = useDispatch();
  const { cmsData } = useSelector((state) => state.Common);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cms")) || {};
    if (data && data.id !== undefined && data.id > 0) {
      dispatch({
        type: commonactions.GET_CMS_DATA_LIST,
        payload: { id: data.id, lng: data.lang },
      });
    }
  }, []);

  return (
    <>
      <Layout>
        <Header />
        <Content className="content_mt">
          {cmsData.length !== 0 ? (
            <>
              <section className="search-result title_zero">
                <div className="container">
                  <Title level={4}>
                    {getLocaleMessages("Terms & Conditions")}
                  </Title>
                </div>
              </section>
              <div className="page-container">
                <div className="container">
                  {
                    <div
                      dangerouslySetInnerHTML={{ __html: cmsData[0].content }}
                    />
                  }
                </div>
              </div>
            </>
          ) : (
            <>
              <section className="search-result title_zero">
                <div className="container">
                  <Title level={4}></Title>
                </div>
              </section>
              <div className="page-container">
                <div className="container"></div>
              </div>
            </>
          )}
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default CmsComponet;
