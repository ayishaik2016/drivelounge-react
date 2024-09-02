import actions from "./actions";

const initState = {
  isLoading: false,
  carinformation: [],
  carinfo_supportdocs: [],
  carinfo_carareas: [],
  agencyinfo: [],
  carinfo_carid: [],
  carinfo_interriorimage: [],
  carinformation_data: [],
  carmanagement_data: [],
  brand_data: [],
  type_data: [],
  initialDataLoader: true,
};

export default function carInformationReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_CAR_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CAR_INFO_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        carinformation: action.payload,
      };
    }
    case actions.GET_CAR_INFO_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_AGENCY_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_AGENCY_INFO_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agencyinfo: action.payload,
      };
    }
    case actions.GET_AGENCY_INFO_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_CAR_INFO_BYCARID: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CAR_INFO_BYCARID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        carinfo_carid: action.payload.data[0],
        carinfo_interriorimage: action.payload.data.filter((obj) =>
          Object.keys(obj).includes("carinterriorimagename")
        ),
        carinfo_supportdocs: action.payload.data.filter((obj) =>
          Object.keys(obj).includes("supportdocumentname")
        ),
        carinfo_carareas: action.payload.data.filter((obj) =>
          Object.keys(obj).includes("carareakey")
        ),
      };
    }
    case actions.GET_CAR_INFO_BYCARID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_CAR_MANAGEMENT_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CAR_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        carmanagement_data: action.payload,
      };
    }
    case actions.GET_CAR_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_CAR_FILTER_MANAGEMENT_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CAR_FILTER_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        carmanagement_data: action.payload,
      };
    }
    case actions.GET_CAR_FILTER_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CAR_INFORMATION_IUD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CAR_INFORMATION_IUD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        carinformation_data: action.payload,
      };
    }
    case actions.CAR_INFORMATION_IUD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.REMOVE_CAR_BYID: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_CAR_BYID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.SET_PUBLISH_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.SET_PUBLISH_STATUS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        carmanagement_data: action.payload,
      };
    }
    case actions.SET_PUBLISH_STATUS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.BRAND_MANAGEMENT_IUD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.BRAND_MANAGEMENT_IUD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        brand_data: action.payload,
      };
    }
    case actions.BRAND_MANAGEMENT_IUD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_BRAND_MANAGEMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_BRAND_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        brand_data: action.payload,
      };
    }
    case actions.GET_BRAND_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.REMOVE_CAR_BRAND: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_CAR_BRAND_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        brand_data: action.payload,
      };
    }
    case actions.REMOVE_CAR_BRAND_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    // CAR TYPE MANGEMENT
    case actions.CARTYPE_MANAGEMENT_IUD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CARTYPE_MANAGEMENT_IUD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        type_data: action.payload,
      };
    }
    case actions.CARTYPE_MANAGEMENT_IUD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_CARTYPE_MANAGEMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CARTYPE_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        type_data: action.payload,
      };
    }
    case actions.GET_CARTYPE_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.REMOVE_CAR_TYPE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_CAR_TYPE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        type_data: action.payload,
      };
    }
    case actions.REMOVE_CAR_TYPE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
