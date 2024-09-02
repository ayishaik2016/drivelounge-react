import { DEFAULT_CURRENCY } from "../../helpers/constant";
import actions from "./actions";

const initState = {
  isCurrencyLoading: false,
  currencyList: [],
  currencies:[],
  preferredCurrency: DEFAULT_CURRENCY,
  currencyConversion: 1,
  currencyChnLoader: false,
};
export default function carrencyInformationReducer(state = initState, action) {
  switch (action.type) {
    case actions.CHANGE_CURRENCY: {
      return {
        ...state,
        preferredCurrency: action.payload,
        currencyChnLoader: true,
      };
    }
    case actions.CHANGE_CURRENCY_SUCCESS: {
      return {
        ...state,
        currencyChnLoader: false,
      };
    }
    case actions.CHANGE_CURRENCY_FAILURE: {
      return {
        ...state,
        currencyChnLoader: false,
      };
    }
    case actions.GET_CURRENCY: {
      return {
        ...state,
        currencyList: action.payload,
        isCurrencyLoading: true,
      };
    }
    case actions.GET_CURRENCY_SUCCESS: {
      return {
        ...state,
        isCurrencyLoading: false,
      };
    }
    case actions.GET_CURRENCY_FAILURE: {
      return {
        ...state,
        isCurrencyLoading: false,
      };
    }
    case actions.GET_CURRENCIES_LIST: {
      return {
        ...state,
        isCurrencyLoading: true,
      };
    }
    case actions.GET_CURRENCIES_LIST_SUCCESS: {
      return {
        ...state,
        currencies: action.payload,
        isCurrencyLoading: false,
      };
    }
    case actions.GET_CURRENCIES_LIST_FAILURE: {
      return {
        ...state,
        isCurrencyLoading: false,
      };
    }
    case actions.GET_CURRENCY_CONVERSION: {
      return {
        ...state,
      };
    }
    case actions.GET_CURRENCY_CONVERSION_SUCCESS: {
      return {
        ...state,
        currencyConversion: action.payload,
      };
    }
    case actions.GET_CURRENCY_CONVERSION_FAILURE: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
}
