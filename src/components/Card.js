import React from 'react';

import {View, StyleSheet} from 'react-native';

const Card = ( {children, style} ) => {
    return ( 
        <View style={ {...styles.card , ...style} }>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({

    card : {
       
        // shadow properties only work on ios. not on android
        shadowColor: 'black',
        shadowRadius: 2 ,
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        backgroundColor: 'white',

        // this works only on android. not on ios
        // default material style
        elevation:  5,  
        borderRadius: 10

    },
    
});

export default Card;

