import actions from './actions';

const initState = {
    isLoading: false,
    cmsinfo_data: [],
    selected_cms: [],
    faqinfo_data: [],
    selected_faq: [],
    initialDataLoader: true,
};

export default function carInformationReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_CMS_INFO:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_CMS_INFO_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    cmsinfo_data: action.payload
                };
            }
        case actions.GET_CMS_INFO_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.GET_CMS_INFOBYID:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_CMS_INFO_BYID_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    selected_cms: action.payload
                };
            }
        case actions.GET_CMS_INFO_BYID_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.CMSIUD_STATUS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.CMSIUD_STATUS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    cmsinfo_data: action.payload
                };
            }
        case actions.CMSIUD_STATUS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.CHANGE_CMS_STATUS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.CHANGE_CMS_STATUS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.CHANGE_CMS_STATUS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.REMOVE_CMS_DETAILS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.REMOVE_CMS_DETAILS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    cmsinfo_data: action.payload
                };
            }
        case actions.REMOVE_CMS_DETAILS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
            // FAQ
        case actions.GET_FAQ_INFO:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_FAQ_INFO_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    faqinfo_data: action.payload
                };
            }
        case actions.GET_FAQ_INFO_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.GET_FAQ_INFOBYID:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_FAQ_INFO_BYID_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    selected_faq: action.payload
                };
            }
        case actions.GET_FAQ_INFO_BYID_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.FAQIUD_STATUS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.FAQIUD_STATUS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                };
            }
        case actions.FAQIUD_STATUS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.CHANGE_FAQ_STATUS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.CHANGE_FAQ_STATUS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    faqinfo_data: action.payload
                };
            }
        case actions.CHANGE_FAQ_STATUS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.REMOVE_FAQ_DETAILS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.REMOVE_FAQ_DETAILS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    faqinfo_data: action.payload
                };
            }
        case actions.REMOVE_FAQ_DETAILS_FAILURE:
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