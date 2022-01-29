import createDataContext from "./createDataContext";

const filterReducer = (state, action) => {
    switch(action.type) {
        case "start_recording":
            return {...state, recording: true};
        case "stop_recording":
            return {...state, recording: false};
        case "add_current_location" :
            return  { ...state, currentLocation: action.payload }
        case "add_location" :
            let locations = [...state.locations, action.payload];
            return  { ...state, locations: locations };
        case "change_name" :
            return { ...state, name: action.payload };
        case 'reset' :
            return { ...state, name: '', locations: [ ] };
        default:
            return state;
    }
}

const changeName = dispatch => (name) => {
    dispatch({type: 'change_name', payload: name});
}

const startRecording = (dispatch) => () => {
    dispatch( {type: 'start_recording' } );
};

const stopRecording = (dispatch) => () => {
    dispatch( {type: 'stop_recording'});
};

const addLocation = (dispatch) => (location, recording) => { 
    dispatch( {type: 'add_current_location', payload: location});
    if (recording) {
        dispatch( {type: 'add_location', payload: location});
    }
};

const reset = (dispatch) => () => {
    dispatch({type: 'reset'});
}

export const { Provider, Context } = createDataContext (
    filterReducer,
    {changeName, addLocation, startRecording, stopRecording , reset }, // actions
    { recording: false , locations: [] , currentLocation: null, name: ''}  // initial value of state 

);