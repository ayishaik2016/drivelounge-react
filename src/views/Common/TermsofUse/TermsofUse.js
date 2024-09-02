import React, { useEffect } from "react";
import {
  Typography,
  Layout,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";

import "./../../../assets/css/userStyle.css";
import { getLocaleMessages } from "redux/helper";
import commonactions from "./../../../redux/common/actions";
import { useLocation } from "react-router-dom";
const { Content } = Layout;
const { Title } = Typography;

const TermOfUseComponet = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { cmsData } = useSelector((state) => state.Common);
  const lang = useSelector(({ Auth }) => Auth.subLang);
  const localLang = localStorage.getItem("language");
  const locale =
    localLang !== undefined && localLang !== null ? localLang : lang;
  useEffect(() => {
    dispatch({
      type: commonactions.GET_CMS_DATA_LIST,
      payload: { relatedpage: pathname === "/termsofuse/agency" ? "AGENCY" : "USER", lng: locale === "en" ? 1 : 2 },
    });
  }, []);
  return (
    <>
      <Layout>
        <Header />
        <Content className="content_mt">
          <section className="search-result title_zero">
            <div className="container">
              <Title level={4}>
                {getLocaleMessages("Terms and Conditions")}
              </Title>
            </div>
          </section>

          <div className="page-container">
            <div className="container">
              {<div
                dangerouslySetInnerHTML={{ __html: cmsData.filter(data => data.name === "Terms And Conditions")[0]?.content }}
              />}
              {/* <p>
                Eu eu proident velit qui qui esse sit officia. Reprehenderit ex
                ad eu ipsum. Adipisicing excepteur tempor aliqua cupidatat quis
                nulla sint ut amet elit do culpa nisi culpa. Tempor duis
                consectetur cillum elit.
              </p>
              <p>
                Amet est consequat et ad magna est nostrud nulla Lorem laboris
                non elit consectetur ullamco. Reprehenderit minim occaecat
                commodo ipsum Lorem minim labore. Aliquip velit nostrud deserunt
                exercitation qui proident.
              </p>
              <p>
                Officia in anim deserunt non nisi minim dolore deserunt pariatur
                sunt qui. Culpa est dolor ut nostrud laboris ex nostrud elit
                minim id labore reprehenderit. Culpa sit dolore nostrud est. Qui
                qui ut do ad irure in et esse nostrud pariatur ut occaecat.
                Mollit minim dolor cupidatat ea quis officia incididunt tempor
                proident excepteur non ut nostrud.
              </p> */}
            </div>
          </div>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default TermOfUseComponet;
