import actions from "./actions";
var localValue = JSON.parse(localStorage.getItem("searchCriteria")) || [];
const initState = {
  filterCarElements: {
    carid: localValue["carid"] || "",
    PickupPlace: localValue["PickupPlace"] || "",
    PickupPlaceId: localValue["PickupPlaceId"] || "",
    PickupCors: localValue["PickupCors"] || {
      lat: 24.6877,
      lng: 46.7219,
      address: "",
    },
    PickupDate:
      localValue["PickupDate"] !== undefined
        ? new Date(localValue["PickupDate"])
        : new Date(),
    DropPlace: localValue["DropPlace"] || "",
    DropPlaceId: localValue["DropPlaceId"] || "",
    DropCors: localValue["DropCors"] || {
      lat: 24.6877,
      lng: 46.7219,
      address: "",
    },
    DropoffDate:
      localValue["DropoffDate"] !== undefined
        ? new Date(localValue["DropoffDate"])
        : new Date(),
    WithDriver: localValue["WithDriver"] || false,
    DifferentDropoffLocation: localValue["DifferentDropoffLocation"] || false,
  },
  agencylist: [],
  initialListingLoader: false,
  isLoading: false,
  favoriteList: [],
};

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.SET_SEARCH_CAR_DEFAULT: {
      return {
        ...state,
        filterCarElements: {
          ...state.filterCarElements,
          PickupPlace: action.PickupPlace,
          PickupPlaceId: action.PickupPlaceId,
          PickupCors: action.PickupCors,
          PickupDate: action.PickupDate,
          DropPlace: action.DropPlace,
          DropPlaceId: action.DropPlaceId,
          DropCors: action.DropCors,
          DropoffDate: action.DropoffDate,
          WithDriver: action.WithDriver,
          DifferentDropoffLocation: action.DifferentDropoffLocation,
        },
      };
    }
    case actions.SET_CHANGE_SEARCH_CAR_DETAIL: {
      return {
        ...state,
        filterCarElements: {
          ...state.filterCarElements,
          PickupPlace: action.PickupPlace,
          PickupCors: action.PickupCors,
          PickupDate: action.PickupDate,
          DropCors: action.DropCors,
          DropoffDate: action.DropoffDate,
          DifferentDropoffLocation: action.DifferentDropoffLocation,
        },
      };
    }
    case actions.SET_DATE_CHANGES: {
      return {
        ...state,
        filterCarElements: {
          ...state.filterCarElements,
          PickupDate: action.PickupDate,
          DropoffDate: action.DropoffDate,
        },
      };
    }
    case actions.SET_PICKUP_PLACE_CHANGES: {
      return {
        ...state,
        filterCarElements: {
          ...state.filterCarElements,
          PickupPlace: action.PickupPlace,
          PickupCors: action.PickupCors,
        },
      };
    }
    case actions.SET_DROPOFF_PLACE_CHANGES: {
      return {
        ...state,
        filterCarElements: {
          ...state.filterCarElements,
          DropPlace: action.DropPlace,
          DropCors: action.DropCors,
        },
      };
    }
    case actions.SET_SEARCH_CAR_FILTER: {
      return {
        ...state,
        filterCarElements: {
          PickupPlace: action.PickupPlace,
          PickupLocationId: action.PickupLocationId,
          PickupDate: action.PickupDate,
          DropoffLocationId: action.DropoffLocationId,
          DropoffDate: action.DropoffDate,
        },
      };
    }
    case actions.SET_SELECTED_CAR_ID: {
      return {
        ...state,
        filterCarElements: {
          ...state.filterCarElements,
          carid: action.carid,
        },
      };
    }
    case actions.CLEAR_SELECTED_CAR_FILTER: {
      localStorage.removeItem("searchCriteria");
      return {
        ...state,
        filterCarElements: {
          carid: "",
          PickupPlace: "",
          PickupCors: { lat: 24.6877, lng: 46.7219, address: "" },
          PickupDate: new Date(),
          DropPlace: "",
          DropCors: { lat: 24.6877, lng: 46.7219, address: "" },
          DropoffDate: new Date(),
          WithDriver: false,
          DifferentDropoffLocation: false,
        },
      };
    }
    case actions.GET_AGENCY_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_AGENCY_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        agencylist: action.payload,
      };
    }
    case actions.GET_AGENCY_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.SET_FAVORITE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.SET_FAVORITE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        favoriteList: action.payload,
      };
    }
    case actions.SET_FAVORITE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        favoriteList: [],
      };
    }

    case actions.REMOVE_FAVORITE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_FAVORITE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        favoriteList: action.payload,
      };
    }
    case actions.REMOVE_FAVORITE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_FAVORITE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_FAVORITE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        favoriteList: action.payload,
      };
    }
    case actions.GET_FAVORITE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
