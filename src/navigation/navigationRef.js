import { NavigationActions} from 'react-navigation';

let navigator;

export const setNavigator = (nav) => {
    navigator = nav;
};

// this tells react navigation to change its state. 
// dispatch is the same useReducer stuff. The first arg is the action
// react nav will change its state and that will render a different screen
export const navigate = (routeName, params) => {
    navigator.dispatch(
        NavigationActions.navigate( {
            routeName: routeName, params: params
        })
    );
}