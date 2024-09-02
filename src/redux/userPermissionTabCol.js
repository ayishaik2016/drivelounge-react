import { useSelector } from 'react-redux';

const Permission = (permission, module) => {
    const { userpermission } = useSelector((state) => state.Auth);
    const Filter = userpermission.filter(el => el.module == module);    
    const spreadFilter = Filter[0]
    var couldShow = false;
    for (const [key, value] of Object.entries(spreadFilter)) {
        if(key == permission && value == "true"){
            couldShow = true
        }
    }    
    return couldShow;
}

export default Permission;