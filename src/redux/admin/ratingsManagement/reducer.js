import actions from './actions';

const initState = {
    ratingList: [],
    agencyList: [],
    carList: [],
    ratingLoader: false,
    totalRating: 0,
    currentPage: 1,
    pageSize: 10,
    ratingFilter: {},
};

export default function adminRatingReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_RATING_LIST:
            {
                return {
                    ...state,
                    ratingLoader: true,
                };
            }
        case actions.GET_RATING_LIST_SUCCESS:
            {
                return {
                    ...state,
                    ratingLoader: false,
                    ratingList: action.payload
                };
            }
        case actions.GET_RATING_LIST_FAILURE:
            {
                return {
                    ...state,
                    ratingLoader: false,
                };
            }
        case actions.CREATE_RATING_LIST:
            {
                return {
                    ...state,
                    ratingLoader: true,
                };
            }
        case actions.CREATE_RATING_LIST_SUCCESS:
            {
                return {
                    ...state,
                    ratingLoader: false,
                    ratingList: action.payload
                };
            }
        case actions.CREATE_RATING_LIST_FAILURE:
            {
                return {
                    ...state,
                    ratingLoader: false,
                };
            }
        case actions.REMOVE_RATING_LIST:
            {
                return {
                    ...state,
                    ratingLoader: true,
                };
            }
        case actions.REMOVE_RATING_LIST_SUCCESS:
            {
                return {
                    ...state,
                    ratingLoader: false,
                    ratingList: action.payload
                };
            }
        case actions.REMOVE_RATING_LIST_FAILURE:
            {
                return {
                    ...state,
                    ratingLoader: false,
                };
            }
        case actions.STATUS_RATING_LIST:
            {
                return {
                    ...state,
                    ratingLoader: true,
                };
            }
        case actions.STATUS_RATING_LIST_SUCCESS:
            {
                return {
                    ...state,
                    ratingLoader: false,
                    ratingList: action.payload
                };
            }
        case actions.STATUS_RATING_LIST_FAILURE:
            {
                return {
                    ...state,
                    ratingLoader: false,
                };
            }
        case actions.SET_RATING_CURRENT_PAGE:
            {
                return {
                    ...state,
                    currentPage: action.payload,
                }
            }
        case actions.SET_RATING_PAGE_SIZE:
            {
                return {
                    ...state,
                    pageSize: action.payload,
                }
            }
        case actions.SET_RATING_FILTERS:
            {
                return {
                    ...state,
                    ratingFilter: {...state.ratingFilter, ...action.payload },
                }
            }
        default:
            return state;
    }
}