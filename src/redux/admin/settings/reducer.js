import actions from "./actions";

const initState = {
  isLoading: false,
  webconfig_data: [],
  socialmedia_data: [],
  sms_data: [],
  smtp_data: [],
  profile: [],
  admin_profile: [],
  agency_profile: [],
  initialDataLoader: true,
};

export default function webSettingsReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_WEB_SETTINGS_CONFIG: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_WEB_SETTINGS_CONFIG_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        webconfig_data: action.payload,
      };
    }
    case actions.GET_WEB_SETTINGS_CONFIG_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_WEB_SETTINGS_CONFIG: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_WEB_SETTINGS_CONFIG_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        webconfig_data: action.payload,
      };
    }
    case actions.UPDATE_WEB_SETTINGS_CONFIG_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    // Social Media
    case actions.GET_SOCIAL_MEDIA: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_SOCIAL_MEDIA_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        socialmedia_data: action.payload,
      };
    }
    case actions.GET_SOCIAL_MEDIA_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_SOCIAL_MEDIA: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_SOCIAL_MEDIA_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        socialmedia_data: action.payload,
      };
    }
    case actions.UPDATE_SOCIAL_MEDIA_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // SMS
    case actions.GET_SMS_SETTINGS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_SMS_SETTINGS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        sms_data: action.payload,
      };
    }
    case actions.GET_SMS_SETTINGS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_SMS_SETTINGS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_SMS_SETTINGS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        sms_data: action.payload,
      };
    }
    case actions.UPDATE_SMS_SETTINGS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // SMTP
    case actions.GET_SMTP_SETTINGS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_SMTP_SETTINGS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        smtp_data: action.payload,
      };
    }
    case actions.GET_SMTP_SETTINGS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_SMTP_SETTINGS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_SMTP_SETTINGS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        sms_data: action.payload,
      };
    }
    case actions.UPDATE_SMTP_SETTINGS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // user profile
    case actions.GET_USER_PROFILE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_USER_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
      };
    }
    case actions.GET_USER_PROFILE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_USER_PROFILE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_USER_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
      };
    }
    case actions.UPDATE_USER_PROFILE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_USER_PASSWORD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_USER_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_USER_PASSWORD_FALIURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_ADMIN_PROFILE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_ADMIN_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        admin_profile: action.payload,
      };
    }
    case actions.GET_ADMIN_PROFILE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_ADMIN_PROFILE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_ADMIN_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        admin_profile: action.payload,
      };
    }
    case actions.UPDATE_ADMIN_PROFILE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_ADMIN_PASSWORD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_ADMIN_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        admin_profile: action.payload,
      };
    }
    case actions.UPDATE_ADMIN_PASSWORD_FALIURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_AGENT_PROFILE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_AGENT_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agency_profile: action.payload,
      };
    }
    case actions.GET_AGENT_PROFILE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_AGENT_PASSWORD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_AGENT_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agency_profile: action.payload,
      };
    }
    case actions.UPDATE_AGENT_PASSWORD_FALIURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
