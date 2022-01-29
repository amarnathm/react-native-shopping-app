import React, { useEffect, useReducer } from 'react';

import {View, Text, TextInput, StyleSheet} from 'react-native';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import colors from '../constants/colors';

/*
    props other than TextInput props:

    label
    initialValue
    onValueChange
    errorMessage

*/

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'value_change':
            return { ...state, value: action.payload.value, valid: action.payload.valid };
        
        case 'input_blur':
            // console.log("input_blur");
            return { ...state, touched: true}
        default:
            return state;
        
    }
   
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Input = (props) => {


    const [inputState, dispatch] = useReducer(inputReducer,
        {
            value: props.initialValue || '',
            touched: false,
            valid: props.initiallyValid // if not supplied, false
        });

    const textChangeHandler = (text) => {
        
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            // console.log("email test: isValid is false");
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }

        // console.log("textChangeHandler: text=", text);

        dispatch({type: 'value_change', payload: {value: text, valid: isValid}})
    }

    const lostFocusHandler = () => {
        dispatch({ type: 'input_blur' });
    }

    const { onValueChange, id } = props; // extract this to prevent rerendering if other things in props change
    useEffect(() => { 
        if (inputState.touched) {
            // props.onValueChange(id, inputState.value, inputState.valid);
            // doesn't look like we need the id the way we are using it 
            props.onValueChange(inputState.value, inputState.valid);
        }
       
    },[inputState, onValueChange])

    return (
        <View style={styles.formControl}>
            {props.label && <Text style={styles.label}> {props.label} </Text> }
            <TextInput {...props} style={{ ...styles.input, ...props.style }}
                value={inputState.value}
                onChangeText={textChangeHandler}
                onBlur={lostFocusHandler}
            />

            {inputState.touched && !inputState.valid && props.errorText && <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{props.errorText}</Text>
            </View>
            }
                
        </View>
        
    );
};

const styles = StyleSheet.create({
    formControl: {
        width: '100%'
    },
    input: {
        borderBottomColor: colors.borderBottomColor,
        borderBottomWidth: 1,
        height: 30,
        marginVertical: 10
    },
    errorText: {
        fontFamily: 'open-sans',
        color: 'red',
        fontSize: 13
    },
    errorContainer: {
        marginVertical: 5
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    }
    
});

export default Input;

