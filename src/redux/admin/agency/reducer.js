import actions from "./actions";

const initState = {
  isLoading: false,
  agency_data: [],
  agencydata_byid: [],
  initialDataLoader: true,
};

export default function AgencyReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_AGENCY_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_AGENCY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agency_data: action.payload,
      };
    }
    case actions.GET_AGENCY_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_AGENCY_BYLANG: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_AGENCY_BYLANG_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agency_data: action.payload,
      };
    }
    case actions.GET_AGENCY_BYLANG_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_AGENCY_INFO_BYID: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_AGENCY_INFO_BYID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agencydata_byid: action.payload,
      };
    }
    case actions.GET_AGENCY_INFO_BYID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.AGENCY_INFORMATION_IUD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.AGENCY_INFORMATION_IUD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.AGENCY_INFORMATION_IUD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.CHANGE_AGENCY_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_AGENCY_STATUS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        //agency_data: action.payload,
      };
    }
    case actions.CHANGE_AGENCY_STATUS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.CHANGE_AGENCYFILTER_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_AGENCYFILTER_STATUS: {
      return {
        ...state,
        isLoading: false,
        agency_data: action.payload,
      };
    }
    case actions.CHANGE_AGENCYFILTER_STATUS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.REMOVE_ADMIN_DETAILS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_ADMIN_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agency_data: action.payload,
      };
    }
    case actions.REMOVE_ADMIN_DETAILS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.REMOVE_ADMIN_DETAILS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_ADMIN_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agency_data: action.payload,
      };
    }
    case actions.REMOVE_ADMIN_DETAILS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
