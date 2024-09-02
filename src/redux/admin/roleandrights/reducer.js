import actions from './actions';

const initState = {
    isLoading: false,
    modulelist: [],
    rolelist: [],
    rolerights: [],
    permissionlist: [],
    initialDataLoader: true,
};

export default function RoleRightsReducer(state = initState, action) {
    switch (action.type) {

        case actions.GET_ACCESS_MODULES:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_ACCESS_MODULES_SUCCESS:
            {
                let data = action.payload;
                let module_action = [
                    {name: "Create", shortname: "c"},
                    {name: "Update", shortname: "u"},
                    {name: "Delete", shortname: "d"},
                    {name: "Status", shortname: "s"}
                ]
                let module = [];
                if(data){
                    data.map(mod => {
                        let access_mod = {
                            id: mod.id,
                            title: mod.modulename,
                            key: mod.moduleshortname
                        }
                        let children = [];
                        module_action.forEach(el => {
                            children.push({id: mod.id, title: el.name, key: `${mod.moduleshortname}-${el.shortname}`})
                        });
                        access_mod.children = children;
                        module.push(access_mod);
                    })
                }
                return {
                    ...state,
                    isLoading: false,
                    modulelist: module
                };
            }
        case actions.GET_ACCESS_MODULES_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        
        case actions.GET_ROLE_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_ROLE_LIST_SUCCESS:
            {
                return {
                    ...state,
                    rolelist: action.payload,
                    isLoading: false,
                };
            }
        case actions.GET_ROLE_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false,
                };
            }
        case actions.GET_ROLE_RIGHTS:
                {
                    return {
                        ...state,
                        isLoading: true,
                    };
                }
        case actions.GET_ROLE_RIGHTS_SUCCESS:
                {
                    return {
                        ...state,
                        rolerights: action.payload,
                        isLoading: false,
                    };
                }
        case actions.GET_ROLE_RIGHTS_FAILURE:
        {
            return {
                ...state,
                isLoading: false,
            };
        }

        case actions.ROLE_RIGHTS_IUD: {
            return {
                ...state,
                isLoading: true,
            }; 
        }
        case actions.ROLE_RIGHTS_IUD_SUCCESS: {
            return {
                ...state,
                isLoading: true,
            }; 
        }
        case actions.ROLE_RIGHTS_IUD_FAILURE: {
            return {
                ...state,
                isLoading: true,
            }; 
        }

        case actions.GET_PERMISSION_BYID:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_PERMISSION_BYID_SUCCESS:
            {
                let data = action.payload;                
                let checkedKeys = [];
                let expandedKeys = [];
                if(data){
                    data.map(mod => {                        
                        mod.access == 1 && expandedKeys.push(mod.moduleshortname);
                        checkedKeys.push(mod.moduleshortname);
                        mod['p_create'] == 1 && checkedKeys.push(`${mod.moduleshortname}-c`)
                        mod['p_update'] == 1 && checkedKeys.push(`${mod.moduleshortname}-u`)
                        mod['p_delete'] == 1 && checkedKeys.push(`${mod.moduleshortname}-d`)
                        mod['p_status'] == 1 && checkedKeys.push(`${mod.moduleshortname}-s`)                        
                    })
                }
                return {
                    ...state,
                    isLoading: false,
                    permissionlist: {checkedKeys, expandedKeys}
                };
            }
        case actions.GET_PERMISSION_BYID_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
            case actions.REMOVE_USER_ROLE:
                {
                    return {
                        ...state,
                        isLoading: true,
                    };
                }
            case actions.REMOVE_USER_ROLE_SUCCESS:
                {
                    return {
                        ...state,
                        rolelist: action.payload,
                        isLoading: false,
                    };
                }
            case actions.REMOVE_USER_ROLE_FAILURE:
                {
                    return {
                        ...state,
                        isLoading: false,
                    };
                }
        default:
            return state;
    }
}