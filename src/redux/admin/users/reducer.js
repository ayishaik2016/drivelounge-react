import actions from './actions';

const initState = {
    isLoading: false,
    admin_list: [],
    role_list: [],
    initialDataLoader: true,
};

export default function adminReducer(state = initState, action) {
    switch (action.type) {

        case actions.GET_USERS_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_USERS_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    admin_list: action.payload
                };
            }
        case actions.GET_USERS_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.UPDATE_USER_PROFILE:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.UPDATE_USER_PROFILE_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    admin_list: action.payload
                };
            }
        case actions.UPDATE_USER_PROFILE_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }

        case actions.GET_USEROLES_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_USEROLES_LIST_SUCCESS:
            {
                return {
                    ...state,
                    role_list: action.payload,
                    isLoading: false
                };
            }
        case actions.GET_USEROLES_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        default:
            return state;
    }
}