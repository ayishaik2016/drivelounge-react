import actions from './actions';

const initState = {
    categoryLoader: false,
    categoryData: [],
    saloonLoader: false,
    saloonData: [],
    topRatingLoader: false,
    topRatingData: [],
};

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_LAYOUT_CATEGORIES: {
      return {
        ...state,
        categoryLoader: true,
      };
    }
    case actions.GET_LAYOUT_CATEGORIES_SUCCESS: {
        return {
          ...state,
          categoryLoader: false,
          categoryData: action.payload
        };
    }
    case actions.GET_LAYOUT_CATEGORIES_FAILURE: {
        return {
            ...state,
            categoryLoader: false,
        };
    }
    case actions.GET_LAYOUT_SALOON: {
        return {
          ...state,
          saloonLoader: true,
        };
    }
    case actions.GET_LAYOUT_SALOON_SUCCESS: {
        return {
            ...state,
            saloonLoader: false,
            saloonData: action.payload
        };
    }
    case actions.GET_LAYOUT_SALOON_FAILURE: {
        return {
            ...state,
            saloonLoader: false,
        };
    }
    case actions.GET_LAYOUT_TOP_RATING: {
        return {
            ...state,
            topRatingLoader: true,
        };
    }
    case actions.GET_LAYOUT_TOP_RATING_SUCCESS: {
        return {
            ...state,
            topRatingLoader: false,
            topRatingData: action.payload
        };
    }
    case actions.GET_LAYOUT_TOP_RATING_FAILURE: {
        return {
            ...state,
            topRatingLoader: false,
        };
    }
    default:
      return state;
  }
}
