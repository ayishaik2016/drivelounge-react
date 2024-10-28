import React, { useEffect } from "react";
import { Router, useLocation } from "react-router";
import { Route, Redirect, Switch } from "react-router-dom";
import asyncComponent from "./components/asyncComponents";
import App from "./views/App/App";
import { InitialLoader } from "./components/InitialLoader";
import { useSelector } from "react-redux";
import publicRoutes from "./routes/publicRoutes";
import { getLocalDataType } from "./redux/helper";

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <>
            <Component {...props} {...rest} />
          </>
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const PreventedRoute = ({
  component: Component,
  isLoggedIn,
  key,
  path,
  component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        let { from } = props.location || {
          from: {
            pathname: isLoggedIn
              ? ["admin", "agency"].includes(getLocalDataType())
                ? `/${getLocalDataType()}`
                : "/"
              : "/user",
          },
        };
        return isLoggedIn && from !== undefined ? (
          <Redirect to={from} />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};

const PublicRoutes = ({ history }) => {
  const { isLoggedIn, validatingAuthToken, isurl } = useSelector(
    (state) => state.Auth
  );
  if (validatingAuthToken) {
    return <InitialLoader />;
  }

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }

  return (
    <Router history={history}>
      <ScrollToTop />
      <Switch>
        <PrivateRoute
          path={
            isLoggedIn
              ? [
                  "/",
                  "/cms",
                  "/contactus",
                  "/faq",
                  "/listing",
                  "/checkout",
                  "/profile",
                  "/booking",
                  "/reviews",
                  "/favorites",
                  "/bookingdetails",
                  "/paymenttransaction"
                ].includes(history.location.pathname)
                ? "/"
                : isurl
              : "/user"
          }
          component={App}
          isLoggedIn={isLoggedIn}
          isuser={isurl === "/"}
        />
        {publicRoutes.map((routes) => (
          <PreventedRoute
            exact
            key={routes.path}
            path={routes.path}
            component={routes.component}
            isLoggedIn={isLoggedIn}
            isuser={!isLoggedIn}
          />
        ))}
        <Route
          component={asyncComponent(() => import("./components/NotFound"))}
        />
      </Switch>
    </Router>
  );
};

export default PublicRoutes;
