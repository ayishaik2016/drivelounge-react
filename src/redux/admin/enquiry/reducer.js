import actions from './actions';

const initState = {
    isLoading: false,
    enquiry_data: [],
    initialDataLoader: true,
};

export default function customerInformationReducer(state = initState, action) {
    switch (action.type) {

        case actions.GET_ENQUIRY_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_ENQUIRY_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    enquiry_data: action.payload
                };
            }
        case actions.GET_ENQUIRY_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.CHANGE_ENQUIRY_STATUS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.CHANGE_ENQUIRY_STATUS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    enquiry_data: action.payload
                };
            }
        case actions.CHANGE_ENQUIRY_STATUS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }

        case actions.CREATE_ENQUIRY:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.CREATE_ENQUIRY_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.CREATE_ENQUIRY_FAILURE:
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