import React from 'react';

import {View, Text, StyleSheet, Image, Button, TouchableOpacity, Platform, TouchableNativeFeedback} from 'react-native';
import colors from '../constants/colors';
import Card from './Card';
import CartItemAddSub from './CartItemAddSub';

const ProductSummary = ( {product, numItemsInCart, updateCart, moreDetails,  children} ) => {

    // <Button color={colors.primary} title="Add to Cart" onPress={add2Cart} />

    // console.log("ProductSummary", product);

    let TouchableCompoment = TouchableOpacity;
    // if (Platform.OS === 'android' && Platform.Version >= 21) {
    //     TouchableCompoment = TouchableNativeFeedback;
    // }

    // useForeground below is only used by TouchableNativeFeedback. TouchableOpacity will ignore it.

    return ( 
        
        <Card style={styles.product}>

                
            <TouchableCompoment onPress={moreDetails} useForeground >


                    <View style={styles.imageContainer}> 
                        <Image source={ {uri: product.imageUrl } }  style={styles.image} />
                    </View>
                

                    <View style={styles.labelContainer}>
                        
                        <Text style={styles.title}>{product.title}</Text>
                        
                        <Text style={styles.price}>${product.price}</Text>

                        {/* {numItemsInCart > 0? <Text style={styles.cart}>{numItemsInCart}</Text> : null} */}

                    </View>

            </TouchableCompoment>
            <View style={styles.buttonContainer} >
                {children}
            </View>

            

            
        </Card>
    );
}

/*
    <View style={styles.buttonContainer} >
        <Button color={colors.primary} title="More Details" onPress={moreDetails} />
        <CartItemAddSub numItems={numItemsInCart} updateNumItems={(newNumItems) => updateCart(newNumItems)} />
    </View>
            
*/

const styles = StyleSheet.create({
    product: {
        margin: 20,
        height: 300
    }, 
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    imageContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        height: '60%',
        overflow: 'hidden'
        
    },
    image: {
        height: '100%',
        width: '100%'
    },
    labelContainer:  {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        height: '20%',
        // marginVertical: 10,
        padding: 10
        
    },
    buttonContainer:  {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  
        height: '20%',
        paddingHorizontal: 20
    },
   
    title: {
        fontFamily: 'open-sans',
        fontSize: 18,
        // marginVertical: 10
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    }
    
});

export default ProductSummary;

