import React from "react";
import { Layout, Button, Typography } from "antd";
import { history } from "./../../../redux/store";
import "../../../assets/css/userStyle.css";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { getLocaleMessages } from "redux/helper";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Registerconfirmation = (props) => {
  const handleMyAccount = () => {
    history.push("/");
  };

  return (
    <>
      <Layout className={"on-boarding"}>
        <Header />
        <React.StrictMode>
          <Content className="content_mt">
            <section className="confirm-page">
              <div className="container">
                <div className="box" style={{ padding: "20px" }}>
                  <div className="sucessImage" style={{ textAlign: "center" }}>
                    <img
                      src={
                        require("../../../../src/assets/images/handshake.png")
                          .default
                      }
                      alt=""
                    />
                  </div>

                  <Title level={3} style={{ textAlign: "center" }}>
                    {getLocaleMessages("Welcome")} {getLocaleMessages("Agency")}
                    !
                  </Title>
                  <Paragraph
                    className="fs-large"
                    style={{ textAlign: "center" }}
                  >
                    {" "}
                    {getLocaleMessages(
                      "Agency application submitted successfully"
                    )}{" "}
                  </Paragraph>
                  <div className="sucessImage" style={{ textAlign: "center" }}>
                    <img
                      src={
                        require("../../../../src/assets/images/confirm.gif")
                          .default
                      }
                      alt=""
                      style={{ maxWidth: "300px" }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Button type="primary" onClick={handleMyAccount}>
                      {getLocaleMessages("Back to login")}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </Content>
        </React.StrictMode>
        <Footer />
      </Layout>
    </>
  );
};

export default Registerconfirmation;
