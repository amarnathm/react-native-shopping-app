import React, { useState } from 'react';

import {View, Text, StyleSheet, Button, Dimensions} from 'react-native';
import colors from '../constants/colors';

import {FontAwesome5} from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

// a widget to add or subtract the number ordered in a cart

const CartItemAddSub = ( { numItems, updateNumItems} ) => {

    if (numItems > 0) {
        return ( 
            <View style={styles.cartItemContainer}>
                <TouchableOpacity onPress={() => updateNumItems(numItems-1)}>
                    <View style={styles.buttonContainer}>
                        <FontAwesome5 name="minus" size={18} color='black' />
                    </View>
                </TouchableOpacity>
                <Text style={styles.text}>{numItems}</Text>
                <TouchableOpacity onPress={() => updateNumItems(numItems+1)}>
                <View style={styles.buttonContainer}>
                        <FontAwesome5 name="plus" size={18} color='black' />
                    </View>
                </TouchableOpacity>
                
            </View>
        );
    } 
    else {
        return (
            <View style={styles.add2CartContainer}>
                <Button color={colors.primary} title="Add to Cart" onPress={() => updateNumItems(1)} />  
            </View>
                   
        )
    }
    
}

const styles = StyleSheet.create({
    cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 150,
        height: 40,
        borderWidth: 1,
        borderColor: colors.accent,
        overflow: 'hidden'
    },
    buttonContainer :{
        backgroundColor: colors.accent,
        width: 50,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',

    },
    text: {
        padding: 10,
        alignSelf: 'center',
        fontFamily: 'open-sans-bold'
    },
    add2CartContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 150,
        height: 40
    },
    
});

export default CartItemAddSub;

