import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLocalDataType } from "./helper";

const ShowForPermissionComponent = (props) => {
  var couldShow = false;
  const Filter = props.userPermissions.filter(
    (el) => el.module == props.module
  );
  if (Filter.length) {
    const spreadFilter = Filter[0];
    if (Object.entries(spreadFilter).length) {
      for (const [key, value] of Object.entries(spreadFilter)) {
        if (key == props.permission && value == "true") {
          couldShow = true;
        }
      }
    }
  }
  if (getLocalDataType() == "agency") {
    return props.children;
  }
  return couldShow ? props.children : null;
};

ShowForPermissionComponent.propTypes = {
  module: PropTypes.string.isRequired,
  permission: PropTypes.string.isRequired,
  userPermissions: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  userPermissions: state.Auth.userpermission,
});

export const ShowForPermission = connect(mapStateToProps)(
  ShowForPermissionComponent
);
