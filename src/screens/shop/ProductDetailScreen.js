import React, { useContext, useState } from 'react';

import {View, Text, StyleSheet, Image, Button} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../constants/colors';

import {Context as ProductContext } from '../../context/ProductContext';
import {Context as CartContext} from '../../context/CartContext';

import CartItemAddSub from '../../components/CartItemAddSub';

const ProductDetailScreen = ( {navigation} ) => {
    const product = navigation.getParam('product');

    const {state: productState} = useContext(ProductContext);
    const {state: cartState, changeCartQuantity} = useContext(CartContext);

    [testNumItems, setTestNumItems] = useState(0);

    const findNumItemsInCart = () => {
        const cartProduct = cartState.cart.find(elem => elem.product.id === product.id);
        return cartProduct? cartProduct.quantity : 0;
    }

    return ( 
        <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.imageContainer}> 
                <Image source={ {uri: product.imageUrl } }  style={styles.image} />
            </View>

            <View style={styles.buttonContainer} >
            <CartItemAddSub 
                numItems={findNumItemsInCart()} 
                updateNumItems={ (newNumItems) => changeCartQuantity(product, newNumItems)} />
            </View>

            <View style={styles.labelContainer}>
                {/* <Text style={styles.title}>{product.title}</Text> */}
                
                <Text style={styles.price}>${product.price}</Text>

                <Text style={styles.description}>{product.description}</Text>

            </View>

            
        </ScrollView>
       
    );
};

ProductDetailScreen.navigationOptions = (navData) => {
    return (
       { headerTitle: navData.navigation.getParam("product").title } 
    );

}


const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    imageContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        height: '50%',
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
        height: '30%',
        paddingHorizontal: 10,
        marginTop: -50
        
    },
    buttonContainer:  {
        marginTop: 20,
        alignSelf: 'center',  
        height: '20%',
        paddingHorizontal: 20
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 20
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 18,
        marginVertical: 20
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 16,
        color: '#888'
    }
    
});

export default ProductDetailScreen;

