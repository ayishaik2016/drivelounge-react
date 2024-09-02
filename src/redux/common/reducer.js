import actions from "./actions";

const initState = {
  isLoading: false,
  cityList: [],
  filteredCityList: [],
  countryList: [],
  brandList: [],
  cmsList: [],
  cmsData: [],
  faqData: [],
  initialDataLoader: true,
};

export default function carInformationReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_CITY_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CITY_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        cityList: action.payload,
        filteredCityList: action.payload?.filter((item) => item.showdashboard),
      };
    }
    case actions.GET_CITY_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_COUNTRY_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_COUNTRY_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        countryList: action.payload,
      };
    }
    case actions.GET_COUNTRY_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_BRAND_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_BRAND_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        brandList: action.payload,
      };
    }
    case actions.GET_BRAND_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_CMS_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CMS_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        cmsList: action.payload,
      };
    }
    case actions.GET_CMS_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_CMS_DATA_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CMS_DATA_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        cmsData: action.payload,
      };
    }
    case actions.GET_CMS_DATA_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_FAQ_DATA_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_FAQ_DATA_LIST_SUCCESS: {
      return {
        ...state,
        faqData: action.payload,
        isLoading: false,
      };
    }
    case action.GET_FAQ_DATA_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
