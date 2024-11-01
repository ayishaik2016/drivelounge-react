import React, { useEffect } from "react";
import { Button, Result } from "antd";
import { NavLink } from "react-router-dom";
import { getLocalDataType, getLocaleMessages } from "redux/helper";
import privateRoutes from "../routes/privateRoutes";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const NotFound = () => {
  const location = useLocation();
  const logInType = getLocalDataType();

  let loginText = getLocaleMessages(
    "Sorry you need to login to access this page"
  );
  let pageNotFoundText = getLocaleMessages(
    "Sorry, the page you visited does not exist"
  );
  const getErrorText = () => {
    if (logInType === null) {
      return privateRoutes?.user
        ?.map((ite) => ite?.path)
        ?.includes(location.pathname.slice(1))
        ? loginText
        : pageNotFoundText;
    } else {
      if (logInType === "user") {
        return privateRoutes?.user
          ?.map((ite) => ite?.path)
          ?.includes(location.pathname.slice(1))
          ? loginText
          : pageNotFoundText;
      } else if (logInType === "admin") {
        return privateRoutes?.admin
          ?.map((ite) => ite?.path)
          ?.includes(location.pathname.slice(1))
          ? loginText
          : pageNotFoundText;
      } else if (logInType === "agency") {
        return privateRoutes?.agency
          ?.map((ite) => ite?.path)
          ?.includes(location.pathname.slice(1))
          ? loginText
          : pageNotFoundText;
      }
    }
  };

  const getErrorStatus = () => {
    if (logInType === null) {
      return privateRoutes?.user
        ?.map((ite) => ite?.path)
        ?.includes(location.pathname.slice(1))
        ? "403"
        : "404";
    } else {
      if (logInType === "user") {
        return privateRoutes?.user
          ?.map((ite) => ite?.path)
          ?.includes(location.pathname.slice(1))
          ? "403"
          : "404";
      } else if (logInType === "admin") {
        return privateRoutes?.admin
          ?.map((ite) => ite?.path)
          ?.includes(location.pathname.slice(1))
          ? "403"
          : "404";
      } else if (logInType === "agency") {
        return privateRoutes?.agency
          ?.map((ite) => ite?.path)
          ?.includes(location.pathname.slice(1))
          ? "403"
          : "404";
      }
    }
  };
  useEffect(() => {
    setTimeout(() => {
      if (getLocalDataType() === "admin") {
        window.open("/admin/dashboard", "_self");
      } else if (getLocalDataType() === "agency") {
        window.open("/agency/dashboard", "_self");
      } else {
        window.open("/", "_self");
      }
    }, 500);
  }, []);

  return (
    <Result
      status={getErrorStatus()}
      title={getErrorStatus()}
      subTitle={getErrorText()}
      extra={
        <Button>
          <NavLink
            to={
              getLocalDataType() === "admin"
                ? "/admin/dashboard"
                : getLocalDataType() === "agency"
                ? "/agency/dashboard"
                : "/"
            }
          >
            {getLocaleMessages("Back")}
          </NavLink>
        </Button>
      }
    />
  );
};

export default NotFound;
