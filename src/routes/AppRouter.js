import React from "react";
import { Route, Switch } from "react-router-dom";
import privateRoutes from "./privateRoutes";
import { getLocalDataType } from "./../redux/helper";

const AppRouter = (props) => {
  return (
    <Switch>
      {" "}
      {privateRoutes[
        ["admin", "agency"].includes(getLocalDataType())
          ? `${getLocalDataType()}`
          : "user"
      ].map((singleRoute) => (
        <Route
          exact={true}
          key={singleRoute.path}
          path={`${
            ["admin", "agency"].includes(getLocalDataType())
              ? `/${getLocalDataType()}`
              : ""
          }/${singleRoute.path}`}
          component={singleRoute.component}
        />
      ))}
      {["agency", "admin"].includes(getLocalDataType()) &&
        privateRoutes["common"].map((singleRoute) => (
          <Route
            exact={true}
            key={singleRoute.path}
            path={`/${singleRoute.path}`}
            component={singleRoute.component}
          />
        ))}
    </Switch>
  );
};

export default AppRouter;
