import React, { useCallback, useContext, useEffect, useState } from 'react';

import {View, Text, StyleSheet, Button, FlatList} from 'react-native';
// import { FlatList } from 'react-native-gesture-handler';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/CustomHeaderButton';
import CartItemAddSub from '../../components/CartItemAddSub';

import ProductSummary from '../../components/ProductSummary';

import {Context as ProductContext } from '../../context/ProductContext';
import {Context as CartContext} from '../../context/CartContext';
import colors from '../../constants/colors';
import { NavigationEvents } from 'react-navigation';
import { ActivityIndicator } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const ProductOverviewScreen = ( {navigation} ) => {

    const {state: productState, fetchProducts} = useContext(ProductContext);

    const {state: cartState, changeCartQuantity} = useContext(CartContext);

    const userId = 'u1'; // TODO 

    [testNumItems, setTestNumItems] = useState(1);

    [testNumItems2, setTestNumItems2] = useState(0);

    [isLoading, setIsLoading] = useState(false);
    [isRefreshing, setIsRefreshing] = useState(false);

    [err, setErr] = useState(null);



    // console.log("availableProducts", productState.availableProducts);
    /* 
     <View style={styles.test} >
                <CartItemAddSub numItems={testNumItems} updateNumItems={ (newNumItems) => setTestNumItems(newNumItems)} />
                <Text> First = {testNumItems} </Text>
            </View>

            <View style={styles.test} >
                <CartItemAddSub numItems={testNumItems2} updateNumItems={ (newNumItems) => setTestNumItems2(newNumItems)} />
                <Text> Second = {testNumItems2} </Text>
            </View>
    */
    
    // this will only load the products from Firebase once. 
    // but if products are changed by a different entity, then what?
    // NavigationEvents used in render will fetch everytime the screen is onWillFocus -- not optimal either.

    const callFetch = useCallback(async () => {
        console.log("in callFetch");
        try {
            setIsRefreshing(true);
            setErr(null);
            await fetchProducts();
        } catch (error) {
            setErr(error);
            // console.log("error=", error);
        }

        setIsRefreshing(false);

         // for testing spinner, this delay is added. but it should be removed in a real app
        // setTimeout(() => {
        //     setIsLoading(false);
        // }, 1000);
    }, [setIsRefreshing, setErr] ) ;
   
    
    useEffect(() => {
       

        // const callFetchInner =   async () => {
        //     try {
        //         setIsLoading(true);
        //         setErr(null);
        //         await fetchProducts();
        //     } catch (error) {
        //         setErr(error);
        //         // console.log("error=", error);
        //     }

        //      // for testing spinner, this delay is added. but it should be removed in a real app
        //     setTimeout(() => {
        //         setIsLoading(false);
        //     }, 1000);
        // } ;

        setIsLoading(true);
        callFetch().then( () => setIsLoading(false) );

       

    }, []);

    const findNumItemsInCart = (product) => {
        // console.log("findNumItemsInCart: cartState and product:", cartState, product);
        const cartProduct = cartState.cart.find(elem => elem.product.id === product.id);
        // console.log("cartProduct found:", cartProduct);
        // if (cartProduct) {
        //     console.log("cartProduct:", cartProduct);
        // }
        return cartProduct? cartProduct.quantity : 0;
    }

    /*

    this works as well:
        
        <NavigationEvents onWillFocus={fetchProducts} />

        other props for NavigationEvents below:

            onDidFocus={ () => { console.log('onDidFocus'); }} 
            onWillBlur={ () => { console.log('onWillBlur'); }} 
            onDidBlur={ () => { console.log('onDidBlur'); }} 
    */
    
    // [Error: Request failed with status code 404]
    if (err) {

        return <View style={styles.centered}>
            <Text>{err} </Text>
        </View>

    }
    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={colors.primary} />
        </View>
    };

    if (!isLoading && (! productState.availableProducts || productState.availableProducts.length === 0) ) {
        return <View style={styles.centered}>
            <Text>No products found. Maybe start adding some!</Text>
        </View>
    };

    /*
        <View style={styles.screen}>
            <NavigationEvents onWillFocus={fetchProducts} />
        </View>
    */
    return ( 
       
           

            <FlatList
                onRefresh={callFetch}
                refreshing={isRefreshing}
                keyExtractor={item => item.id}
                data={productState.availableProducts}
                renderItem={( {item }) => {
                    return (
                        <ProductSummary 
                            product={item}  
                            moreDetails={() => navigation.navigate('ProductDetail', {
                                product: item
                            })}
                            
                        >
                            <Button color={colors.primary} title="More Details"
                                onPress={() => navigation.navigate('ProductDetail', {
                                    product: item
                                })} />
                                
                            <CartItemAddSub numItems={findNumItemsInCart(item)}
                                updateNumItems={(newNumItems) => changeCartQuantity(item, newNumItems)} />
                            
                        </ProductSummary>
                    )
                    
                }}
            />
       
    );
}

/*

    numItemsInCart={findNumItemsInCart (item)}
    updateCart={(newNumItems) => changeCartQuantity(item, newNumItems)}
*/

ProductOverviewScreen.navigationOptions = ( {navigation }) => { 
    // console.log("nav igationOptions navigation", navigation);
    return ( {
        headerTitle: 'All Products',
        
        headerLeft: () => {
            return (
                <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
                    <Item title="Filters" iconName='ios-menu' 
                        onPress={() => navigation.toggleDrawer() } 
                    />
                </HeaderButtons>
            ); 
        },

        headerRight: () => {
            return (
                <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
                    <Item title="Favorite" 
                        iconName='cart'
                        onPress={() => navigation.navigate('Cart')} 
                    
                    />
                 </HeaderButtons>
            );     
        } 
    } )
    
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    test: {
        marginVertical: 20
    },
    buttonContainer:  {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  
        height: 150,
        paddingHorizontal: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
    
});

export default ProductOverviewScreen;

