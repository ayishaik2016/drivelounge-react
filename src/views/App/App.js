import React, {useState} from "react";
import { Layout } from "antd";
import AppRouter from "./../../routes/AppRouter";
import Sidebar from "./../Common/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import HeaderC from "./../Common/Header/Header";
import Header from "./../Admin/Header/Header";
import { getLocalDataType } from "./../../redux/helper";
import "./../../assets/css/style.scss";
const { Content } = Layout;

function App(props) {
  const { location } = props;
const [responsiveMenu, setResponsiveMenu] = useState(false);

const handleResponsiveMenu = () => {
  setResponsiveMenu(!responsiveMenu);
}


const handleResponsiveMenuHide = () => {
  setResponsiveMenu(false);
}

  return (
    <div>
      {getLocalDataType() !== "user" &&
        getLocalDataType() !== "admin" &&
        getLocalDataType() !== "agency" && (
          <Layout>
            <HeaderC />
            <Content>
              <div className={"layout-content"}>
                <AppRouter />
              </div>
            </Content>
          </Layout>
        )}
      {getLocalDataType() === "admin" && (
        <Layout  className="admin-layout-main-1">
          {location.pathname.startsWith("/admin/") &&
            getLocalDataType() === "admin" && <Sidebar handleResponsiveMenuHide={handleResponsiveMenuHide}  responsiveMenu={responsiveMenu} />}
          <Layout>
            {location.pathname.startsWith("/admin/") &&
              getLocalDataType() === "admin" && <Header handleResponsiveMenu={handleResponsiveMenu} responsiveMenu={responsiveMenu} />}
            <Content>
              <div className={"layout-content"}>
                <AppRouter />
              </div>
            </Content>
          </Layout>
        </Layout>
      )}
      {getLocalDataType() === "agency" && (
        <Layout  className="admin-layout-main-1">
          {location.pathname.startsWith("/agency/") &&
            getLocalDataType() === "agency" && <Sidebar handleResponsiveMenuHide={handleResponsiveMenuHide}  responsiveMenu={responsiveMenu} />}
          <Layout>
            {location.pathname.startsWith("/agency/") &&
              getLocalDataType() === "agency" && <Header handleResponsiveMenu={handleResponsiveMenu} responsiveMenu={responsiveMenu} />}
            <Content style={{ minHeight: "900px" }}>
              <div className={"layout-content"}>
                <AppRouter />
              </div>
            </Content>
          </Layout>
        </Layout>
      )}
      {getLocalDataType() === "user" && (
        <Layout>
          {/* <HeaderC /> */}

          <Content>
            <div className={"layout-content"}>
              <AppRouter />
            </div>
          </Content>
          {/* <FooterC /> */}
        </Layout>
      )}
    </div>
  );
}

export default App;
