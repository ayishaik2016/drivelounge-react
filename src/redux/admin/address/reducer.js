import actions from "./actions";

const initState = {
  isLoading: false,
  area_data: [],
  city_data: [],
  city_selected: {},
  addresstype_data: [],
  address_typebyid: [],
  country_data: [],
  currency_data: [],
  currency_conversion_data: [],
  initialDataLoader: true,
};

export default function carInformationReducer(state = initState, action) {
  switch (action.type) {
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
        country_data: action.payload,
      };
    }
    case actions.GET_COUNTRY_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_CURRENCY_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CURRENCY_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currency_data: action.payload,
      };
    }
    case actions.GET_CURRENCY_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_CURRENCY_CONVERSION_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CURRENCY_CONVERSION_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currency_conversion_data: action.payload,
      };
    }
    case actions.GET_CURRENCY_CONVERSION_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CREATE_NEW_COUNTRY: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CREATE_NEW_COUNTRY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        country_data: action.payload,
      };
    }
    case actions.CREATE_NEW_COUNTRY_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPDATE_CURRENCY:
    case actions.CREATE_NEW_CURRENCY: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CREATE_NEW_CURRENCY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currency_data: action.payload,
      };
    }
    case actions.UPDATE_CURRENCY_FAILURE:
    case actions.CREATE_NEW_CURRENCY_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPDATE_CURRENCY_CONVERSION:
    case actions.CREATE_NEW_CURRENCY_CONVERSION: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CREATE_NEW_CURRENCY_CONVERSION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currency_conversion_data: action.payload,
      };
    }
    case actions.UPDATE_CURRENCY_CONVERSION_FAILURE:
    case actions.CREATE_NEW_CURRENCY_CONVERSION_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPDATE_CURRENCY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currency_data: state.currency_data.map((data) => {
          if (data.id === action.payload.data[0].id) {
            return action.payload.data[0];
          } else {
            return data;
          }
        }),
      };
    }

    case actions.UPDATE_CURRENCY_CONVERSION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currency_conversion_data: state.currency_conversion_data.map((data) => {
          if (data.id === action.payload.data[0].id) {
            return action.payload.data[0];
          } else {
            return data;
          }
        }),
      };
    }

    case actions.GET_AREA_MANAGEMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_AREA_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        area_data: action.payload,
      };
    }
    case actions.GET_AREA_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.AREA_MANAGEMENT_IUD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.AREA_MANAGEMENT_IUD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        area_data: action.payload,
      };
    }
    case actions.AREA_MANAGEMENT_IUD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CHANGE_AREA_MANAGEMEN: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_AREA_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        area_data: action.payload,
      };
    }
    case actions.CHANGE_AREA_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.REMOVE_AREA_MANAGEMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_AREA_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        area_data: action.payload,
      };
    }
    case actions.REMOVE_AREA_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_CITY_MANAGEMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CITY_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        city_data: action.payload,
      };
    }
    case actions.GET_CITY_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CITY_MANAGEMENT_IUD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CITY_MANAGEMENT_IUD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        city_data: action.payload,
      };
    }
    case actions.CITY_MANAGEMENT_IUD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CHANGE_CITY_MANAGEMENT_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_CITY_MANAGEMENT_STATUS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        city_data: action.payload,
      };
    }
    case actions.CHANGE_CITY_MANAGEMENT_STATUS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CHANGE_CURRENCY_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_CURRENCY_STATUS_FAILURE:
    case actions.CHANGE_CURRENCY_STATUS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CHANGE_CITY_MANAGEMENT_DASHBOARD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_CITY_MANAGEMENT_DASHBOARD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        city_data: action.payload,
      };
    }
    case actions.CHANGE_CITY_MANAGEMENT_DASHBOARD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.REMOVE_CITY_MANAGEMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_CITY_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        city_data: action.payload,
      };
    }
    case actions.REMOVE_CITY_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    // Address Type

    case actions.GET_ADDRESSTYPE_MANAGEMENT_BYTYPEID: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_ADDRESSTYPE_MANAGEMENT_BYTYPEID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        address_typebyid: action.payload,
      };
    }
    case actions.GET_ADDRESSTYPE_MANAGEMENT_BYTYPEID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.ADDRESSTYPE_MANAGEMENT_IUD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.ADDRESSTYPE_MANAGEMENT_IUD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        addresstype_data: action.payload,
      };
    }
    case actions.ADDRESSTYPE_MANAGEMENT_IUD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_ADDRESSTYPE_MANAGEMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_ADDRESSTYPE_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        addresstype_data: action.payload,
      };
    }
    case actions.GET_ADDRESSTYPE_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.CHANGE_ADDRESSTYPE_MANAGEMENT_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_ADDRESSTYPE_MANAGEMENT_STATUS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        addresstype_data: action.payload,
      };
    }
    case actions.CHANGE_ADDRESSTYPE_MANAGEMENT_STATUS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.REMOVE_ADDRESSTYPE_MANAGEMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_ADDRESSTYPE_MANAGEMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        addresstype_data: action.payload,
      };
    }
    case actions.REMOVE_ADDRESSTYPE_MANAGEMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // ADDRESSTYPE

    default:
      return state;
  }
}
