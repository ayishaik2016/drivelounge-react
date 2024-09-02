import React, { useEffect } from "react";
import { Row, Col, Typography, BackTop, Button } from "antd";
import { NavLink, Link } from "react-router-dom";
import commonactions from "./../../../redux/common/actions";
import settingsAction from "./../../../redux/admin/settings/actions";
import { useSelector, useDispatch } from "react-redux";
import { lastDayOfMonth } from "date-fns";
import { OmitProps } from "antd/lib/transfer/ListBody";
import { getLocaleMessages } from "redux/helper";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const { Title, Paragraph } = Typography;

const CommonFooter = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const localLang =
    localStorage.getItem("language") !== undefined
      ? localStorage.getItem("language")
      : "en";
  const { cmsList } = useSelector((state) => state.Common);
  const { subLang } = useSelector((state) => state.Auth);
  const { isLoading, socialmedia_data } = useSelector(
    (state) => state.WebSettings
  );
  useEffect(() => {
    dispatch({
      type: commonactions.GET_CMS_LIST,
      payload: localLang === "en" ? 1 : 2,
    });
    dispatch({
      type: settingsAction.GET_SOCIAL_MEDIA,
      payload: false,
    });
  }, []);

  const handleSetCMSData = ({ id, languageid, cmsid, title }) => {
    localStorage.setItem(
      "cms",
      JSON.stringify({
        id,
        cmsid,
        url: title,
        lang: localLang === "en" ? 1 : 2,
      })
    );
    window.open("/cms", "_blank");
  };

  const handleLink = (link) => {
    const win = window.open(link);
    win.focus();
  };

  const handleSetFAQData = (languageid) => {
    if (languageid == "en") {
      var id = 1;
    } else {
      var id = 2;
    }
    localStorage.setItem("faq", JSON.stringify({ lang: id }));
    const win = window.open("/faq", "_blank");
    win.focus();
  };
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <BackTop />
          <div className="footer-top">
                <div className="logo">
                  <img
                    src={require("./../../../assets/images/logo1.png").default}
                    alt="logo"
                  />
                </div>


                    <ul>
                      <li>
                        <NavLink to={{ pathname: "/" }}>
                          {getLocaleMessages("Home")}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={{ pathname: "/contactus" }}
                          target="_blank"
                        >
                          {getLocaleMessages("Contact us")}
                        </NavLink>
                      </li>
                      <li>
                        <Link onClick={(e) => handleSetFAQData(subLang)}>
                          {getLocaleMessages("FAQ")}
                        </Link>
                      </li>
                      {console.log("cmsList", cmsList)}
                      {/**.filter((it) => it?.id === 5) */}
                      {cmsList.filter((cms) => cms.relatedpage === (pathname === "/agency" ? "AGENCY" : "USER")).map((value) => {
                        return (
                          <li>
                            <Link
                              key={value.id}
                              to="/#"
                              onClick={(e) => handleSetCMSData(value)}
                            >
                              { /*{getLocaleMessages(value?.name)} */ }
                              {getLocaleMessages("Terms and Conditions")}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>


                  <div className="social-footer-links">
                    <a href={socialmedia_data.facebook} target="_blank">
                      <FacebookOutlined
                      />
                    </a>
                    <a href={socialmedia_data.twitter} target="_blank">
                      <TwitterOutlined
                      />
                    </a>

                    <a href={socialmedia_data.instagram} target="_blank">
                      <InstagramOutlined
                      />
                    </a>
                    </div>

                  </div>


                <div className="copy-rights">
                  <p>
                    © {getLocaleMessages("Copyright Drive Lounge")} |{" "}
                    {getLocaleMessages("All rights reserved")}.
                  </p>
                  <p>{getLocaleMessages("Commercial Registration No")}: 10486637</p>
                </div>


        </div>


        { /*<img
          src={require("./../../../assets/images/car1.png").default}
          className="car-logo-footer"
          alt="footer Car"
        />




                    <Typography>
                      <Title level={3}>
                        {" "}
                        {getLocaleMessages("Quick Links")}{" "}
                      </Title>
                    </Typography>
                    <Typography>
                      {" "}
                      <Title level={3}>
                        {getLocaleMessages("Social Networks")}
                      </Title>
                    </Typography>


        */}
      </footer>
    </>
  );
};

export default CommonFooter;
