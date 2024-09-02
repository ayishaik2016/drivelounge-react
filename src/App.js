import React, { useEffect, useRef, useState } from "react";
import { store, history } from "./redux/store";
import PublicRoutes from "router";
import { Provider, useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "./components/ErrorBoundary";
import I18nProvider from "./helpers/I18nProvider";
import { ConfigProvider } from "antd";
import Boot from "boot";
import "antd/dist/antd.css";
import { loginAllTabs, logoutAllTabs } from "./Auth";
import { IdleTimerProvider, useIdleTimer } from "react-idle-timer";
import authactions from "./redux/auth/actions";

function App() {
  useEffect(() => {
    logoutAllTabs();
    loginAllTabs();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <I18nProvider>
          <ConfigProviderComponent />
        </I18nProvider>
      </Provider>
    </ErrorBoundary>
  );
}

const ConfigProviderComponent = () => {
  const dispatch = useDispatch();
  const lang = useSelector(({ Auth }) => Auth.subLang);
  const [language, setLanguage] = useState("en");
  const localLang = localStorage.getItem("language");
  const locale =
    localLang !== undefined && localLang !== null ? localLang : lang;
  useEffect(() => {
    if (locale !== undefined) {
      setLanguage(locale);
    }
  }, [locale]);

  const onIdle = () => {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (userData !== null && userData !== undefined) {
      dispatch({
        type: authactions.LOGOUT_USER,
      });
    }
  };

  const RenderAppComponent = () => {
    return (
      <ConfigProvider direction={language === "en" ? "ltr" : "rtl"}>
        <PublicRoutes history={history} />
      </ConfigProvider>
    );
  };
  useEffect(() => {
    return <RenderAppComponent />;
  }, [language]);

  return (
    <IdleTimerProvider timeout={3600000} onIdle={onIdle}>
      <RenderAppComponent />
    </IdleTimerProvider>
  );
};

Boot()
  .then(() => App())
  .catch((error) => console.error(error));

export default App;
