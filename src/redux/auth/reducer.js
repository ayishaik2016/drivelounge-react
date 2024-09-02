import actions from "./actions";
import { history } from "redux/store";
import { channelLanguage } from "Auth";

const initState = {
  isLoggedIn: false,
  validatingAuthToken: false,
  loader: false,
  lang: "en",
  subLang: "en",
  isAdminForgot: false,
  isAgencyForgot: false,
  isurl: "/user",
  profileLoader: false,
  passwordLoader: false,
  isOtp: false,
  isemail: null,
  userpermission: [],
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.AUTHENTICATE_USER: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.AUTHENTICATE_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        isLoggedIn: true,
        validatingAuthToken: false,
        isurl: "/user",
      };
    }
    case actions.AUTHENTICATE_USER_FAILURE: {
      return {
        ...state,
        loader: false,
        isLoggedIn: false,
        validatingAuthToken: false,
        email: null,
        companyId: null,
        userId: null,
        name: null,
      };
    }
    case actions.VALIDATE_AUTH_TOKEN: {
      return {
        ...state,
        validatingAuthToken: true,
      };
    }
    case actions.SEND_PASSWORD_RESET_LINK: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.SEND_PASSWORD_RESET_LINK_SUCCESS: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.SEND_PASSWORD_RESET_LINK_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.CHANGE_LANGUAGE: {
      if (localStorage.getItem("language") !== undefined) {
        localStorage.removeItem("language");
        localStorage.setItem("language", action.payload);
      } else {
        localStorage.setItem("language", action.payload);
      }
      window.location.reload();
      channelLanguage();
      return {
        ...state,
        subLang: action.payload,
      };
    }

    case actions.SET_SHOW_ADMIN_FORGOT: {
      return {
        ...state,
        isAdminForgot: action.payload,
      };
    }
    case actions.SET_SHOW_VENDOR_FORGOT: {
      return {
        ...state,
        isAgencyForgot: action.payload,
      };
    }
    case actions.ADMIN_AUTHENTICATE_USER_PRE_OTP: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_SUCCESS: {
      return {
        ...state,
        loader: false,
        isLoggedIn: false,
        validatingAuthToken: false,
        showOTP: true,
        isurl: "/admin",
      };
    }

    case actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_FAILURE: {
      return {
        ...state,
        loader: false,
        isLoggedIn: false,
        validatingAuthToken: false,
        showOTP: false,
        isurl: "/user",
      };
    }

    case actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND_SUCCESS: {
      return {
        ...state,
        loader: false,
        isLoggedIn: false,
        validatingAuthToken: false,
        showOTP: true,
        isurl: "/admin",
      };
    }

    case actions.ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND_FAILURE: {
      return {
        ...state,
        loader: false,
        isLoggedIn: false,
        validatingAuthToken: false,
        showOTP: false,
        isurl: "/user",
      };
    }

    case actions.ADMIN_AUTHENTICATE_USER: {
	  return {
		...state,
		loader: true,
	  };
	}
	case actions.ADMIN_AUTHENTICATE_USER_SUCCESS: {
	  return {
		...state,
		loader: false,
		isLoggedIn: true,
		validatingAuthToken: false,
		isurl: "/admin",
	  };
	}

	case actions.ADMIN_AUTHENTICATE_USER_FAILURE: {
	  return {
		...state,
		loader: false,
		isLoggedIn: false,
		validatingAuthToken: false,
		isurl: "/user",
	  };
    }

    case actions.VENDOR_AUTHENTICATE_USER: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.VENDOR_AUTHENTICATE_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        isLoggedIn: true,
        validatingAuthToken: false,
        isurl: "/agency",
      };
    }
    case actions.VENDOR_AUTHENTICATE_USER_FAILURE: {
      return {
        ...state,
        loader: false,
        isLoggedIn: false,
        validatingAuthToken: false,
        isurl: "/user",
      };
    }
    case actions.VENDOR_RESET_PASSWORD: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.VENDOR_RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.USER_RESET_PASSWORD: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.USER_RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        loader: false,
        validatingAuthToken: false,
        isurl: "/user",
      };
    }
    case actions.ADMIN_SEND_PASSWORD_RESET_LINK: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.ADMIN_SEND_PASSWORD_RESET_LINK_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.ADMIN_SEND_PASSWORD_RESET_LINK_SUCCESS: {
      return {
        ...state,
        loader: false,
        isAdminForgot: false,
      };
    }
    case actions.VENDOR_SEND_PASSWORD_RESET_LINK: {
      return {
        ...state,
        loader: true,
      };
    }
    case actions.VENDOR_SEND_PASSWORD_RESET_LINK_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.VENDOR_SEND_PASSWORD_RESET_LINK_SUCCESS: {
      return {
        ...state,
        loader: false,
        isAgencyForgot: false,
      };
    }
    case actions.LOGOUT_USER: {
      return {
        ...state,
        loader: true,
      };
    }

    case actions.LOGOUT_USER_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.ADMIN_EDIT_PROFILE: {
      return {
        ...state,
        profileLoader: true,
      };
    }

    case actions.ADMIN_EDIT_PROFILE_SUCCESS: {
      return {
        ...state,
        profileLoader: false,
      };
    }

    case actions.ADMIN_EDIT_PROFILE_FAILURE: {
      return {
        ...state,
        profileLoader: false,
      };
    }
    case actions.ADMIN_CHANGE_PASSWORD: {
      return {
        ...state,
        passwordLoader: true,
      };
    }

    case actions.ADMIN_CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        passwordLoader: false,
      };
    }

    case actions.ADMIN_CHANGE_PASSWORD_FAILURE: {
      return {
        ...state,
        passwordLoader: false,
      };
    }

    case actions.CREATE_AUTHENTICATE_USER: {
      return {
        ...state,
        loader: true,
      };
    }

    case actions.CREATE_AUTHENTICATE_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        isOtp: true,
        isemail: action.payload,
      };
    }

    case actions.CREATE_AUTHENTICATE_USER_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.CREATE_AUTHENTICATE_VENDOR: {
      return {
        ...state,
        loader: true,
      };
    }

    case actions.CREATE_AUTHENTICATE_VENDOR_SUCCESS: {
      return {
        ...state,
        loader: false,
        isOtp: false,
        isemail: "",
      };
    }

    case actions.CREATE_AUTHENTICATE_VENDOR_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.VERIFY_OTP: {
      return {
        ...state,
        loader: true,
      };
    }

    case actions.VERIFY_OTP_SUCCESS: {
      return {
        ...state,
        loader: false,
        isOtp: false,
        isemail: "",
      };
    }

    case actions.VERIFY_OTP_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }
    case actions.SET_USER_PERMISSION: {
      return {
        ...state,
        userpermission: action.payload,
      };
    }

    case actions.GET_USER_ROLERIGHTS: {
      return {
        ...state,
        loader: true,
      };
    }

    case actions.GET_USER_ROLERIGHTS_SUCCESS: {
      return {
        ...state,
        loader: false,
        userpermission: action.payload,
      };
    }

    case actions.GET_USER_ROLERIGHTS_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }

    case actions.ADMIN_USER_IUD: {
      return {
        ...state,
        loader: true,
      };
    }

    case actions.ADMIN_USER_IUD_SUCCESS: {
      return {
        ...state,
        loader: false,
      };
    }

    case actions.ADMIN_USER_IUD_FAILURE: {
      return {
        ...state,
        loader: false,
      };
    }

    default:
      return state;
  }
}
