import React from 'react';

import {View, TextInput, StyleSheet} from 'react-native';
import colors from '../constants/colors';

const SimpleInput = ( props ) => {
    return ( 
        <TextInput {...props} style={ {...styles.input , ...props.style} } />
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomColor: colors.borderBottomColor,
        borderBottomWidth: 1,
        height: 30,
        marginVertical: 20
    }
    
});

export default SimpleInput;

