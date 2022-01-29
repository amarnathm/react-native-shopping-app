import React, { useContext, useState, useEffect } from 'react';

import { View, Text, TextInput, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/CustomHeaderButton';

import { Context as ProductContext } from '../../context/ProductContext';
import { Context as AuthContext } from '../../context/AuthContext';

import Input from '../../components/Input';
import SimpleInput from '../../components/SimpleInput';
import Product from '../../models/product';

const getOwnerIdAsync = async () => {
    const authStr = await AsyncStorage.getItem("auth");
    if (authStr) {
        const auth = JSON.parse(authStr);
        console.log("ownerId:", auth.localId);
        return auth.localId;
    }
    else {
        return null;
    }
}

const EditProductScreen =  ({ navigation }) => {
    
    
    const productId = navigation.getParam("productId");
    // product fields: id, ownerId, title, imageUrl, description, price
    // not editable: id, ownerId, price

    // since the state will keep changing, let's get it from ProductCotext
    const { state: productState, addProduct, editProduct } = useContext(ProductContext);

    const { state: authState } = useContext(AuthContext);

    // console.log("authState.auth.localId=", authState.auth.localId);

    const productTmp = productId ? productState.userProducts.find(elem => elem.id === productId)
        : 
            // id, ownerId, title, imageUrl, description, price,
        // populating with initial values for testing purposes
        new Product(
            {
                id: null, // String(new Date().getTime()), // id
                ownerId: authState.auth.localId, // ownerId
                title: 'Blue Shirt', // title
                imageUrl: 'https://thumbs.dreamstime.com/b/blue-shirt-button-down-collar-12774988.jpg', // imageUrl
                description: 'Description of Blue Shirt', // description
                price: '24.99'  //price
            }
               
            )
        


    // make changes locally? or change global state? undo/cancel is easier if we update a local state
    // here we make changes locally

    const [product, setProduct] = useState(productTmp);

    useEffect(() => {
        navigation.setParams({ "product": product });
        // console.log("in useEffect: product");
        
    }, [product]);

    useEffect(() => {
        navigation.setParams({ "addProduct": addProduct , "editProduct" : editProduct});

        // console.log("in useEffect: addOrEditProduct");
        
    }, []);

    /*

    new format:
                        <Input
                            label="Email"
                            id="email"
                            keyboardType='email-address'
                            required email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address"
                            onValueChange={( val, valid) => {
                                if (valid) {
                                    // console.log("valid email onValueChange:", val);
                                    setEmail(val);
                                }
                            } }
                            initialValue=''
                        />

    old:
                        <Input 
                            style={styles.input}
                            placeholder="Enter Title"
                            value={product.title}
                            multiline
                            onChangeText={(newVal) => setProduct({ ...product, title: newVal })}
                            autoCorrect={false}
                        />

    when changed, gives the following error:
    Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
at node_modules/expo/build/logs/LogSerialization.js:155:14 in _captureConsoleStackTrace
at node_modules/expo/build/logs/LogSerialization.js:41:26 in serializeLogDataAsync
- ... 9 more stack frames from framework internals

    they were changed as follows.

                        <Input 
                            style={styles.input}
                            label="Title"
                            id="title"
                            keyboardType='default'
                            required
                            initialValue={product.title}
                            multiline
                            errorText="Please enter a valid title"
                            onValueChange={(newVal) => setProduct({ ...product, title: newVal })}
                            autoCorrect={false}
                        />

                        <Input 
                            style={styles.input}
                            label="Description"
                            id="description"
                            keyboardType='default'
                            required
                            initialValue={product.description}
                            multiline
                            errorText="Please enter a valid description"
                            onValueChange={(newVal) => setProduct({ ...product, description: newVal })}
                            autoCorrect={false}
                        />

                        <Input 
                            style={styles.url}
                            label="Image Url"
                            id="imageUrl"
                            keyboardType='default'
                            required
                            multiline
                            initialValue={product.imageUrl}
                            onValueChange={(newVal) => setProduct({ ...product, imageUrl: newVal })}
                            autoCorrect={false}
                            autoCapitalize="none"
                            returnKeyType='next'
                        />

                        <Input 
                            style={styles.input}
                            label="Price"
                            id="price"
                            keyboardType='decimal-pad'
                            initialValue={String(product.price)}
                            editable={!productId}
                            onValueChange={(newVal) => setProduct({ ...product, price: newVal })}
                            autoCorrect={false}
                            autoCapitalize="none"
                            returnKeyType='next'             
                        />


    */

    return (
        <View style={styles.screen}>
           
            <View style={styles.form} >

                <View style={styles.formControl} >
                    <Text style={styles.label}>Title</Text>
                        <SimpleInput style={styles.input}
                            placeholder="Enter Title"
                            value={product.title}
                            multiline
                            onChangeText={(newVal) => setProduct({ ...product, title: newVal })}
                            autoCorrect={false}
                            />
                    {/* <Input 
                            style={styles.input}
                            label="Title"
                            id="title"
                            keyboardType='default'
                            required
                            initialValue={product.title}
                            multiline
                            errorText="Please enter a valid title"
                            onValueChange={(newVal) => setProduct({ ...product, title: newVal })}
                            autoCorrect={false}
                        /> */}
                    </View>

                <View style={styles.formControl} >
                    <Text style={styles.label}>Description</Text>
                    <SimpleInput style={styles.input}
                        placeholder="Enter Description"
                        value={product.description}
                        multiline
                        onChangeText={(newVal) => setProduct({ ...product, description: newVal })}
                        autoCorrect={false}
                    />
                    {/* <Input 
                            style={styles.input}
                            label="Description"
                            id="description"
                            keyboardType='default'
                            required
                            initialValue={product.description}
                            multiline
                            errorText="Please enter a valid description"
                            onValueChange={(newVal) => setProduct({ ...product, description: newVal })}
                            autoCorrect={false}
                        /> */}
                </View>

                <View style={styles.formControl} >
                    <Text style={styles.label}>Image URL</Text>
                    <SimpleInput style={styles.url}
                        placeholder="Enter ImageUrl"
                        multiline
                        value={product.imageUrl}
                        onChangeText={(newVal) => setProduct({ ...product, imageUrl: newVal })}
                        autoCorrect={false}
                        autoCapitalize="none"
                        returnKeyType='next'
                        />
                    
                    {/* <Input 
                            style={styles.url}
                            label="Image Url"
                            id="imageUrl"
                            keyboardType='default'
                            required
                            multiline
                            initialValue={product.imageUrl}
                            onValueChange={(newVal) => setProduct({ ...product, imageUrl: newVal })}
                            autoCorrect={false}
                            autoCapitalize="none"
                            returnKeyType='next'
                        /> */}
                </View>

                <View style={styles.formControl} >
                    <Text style={styles.label}>Price</Text>

                    <SimpleInput style={styles.input}
                        value={String(product.price)}
                        editable={!productId}
                        onChangeText={(newVal) => setProduct({ ...product, price: newVal })}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        
                    />

                    {/* <Input 
                        style={styles.input}
                        label="Price"
                        id="price"
                        keyboardType='decimal-pad'
                        initialValue={String(product.price)}
                        editable={!productId}
                        onValueChange={(newVal) => setProduct({ ...product, price: newVal })}
                        autoCorrect={false}
                        autoCapitalize="none"
                        returnKeyType='next'             
                    /> */}

                </View>


            </View>
            
        </View>
    );
};

EditProductScreen.navigationOptions = ({ navigation }) => {
    
    // console.log("xEditProductScreen.navigationOptions, navigation=", navigation);

    // this param came from prev screen. so it implies new or edit prod
    const pid = navigation.getParam("productId");

    const product = navigation.getParam("product");

    const addProduct = navigation.getParam("addProduct");
    const editProduct = navigation.getParam("editProduct");

    // console.log("in EditProductScreen.nagivationOptions");

    // console.log("pid", pid);
    // console.log("product", product);
    // console.log("addOrEditProduct", addOrEditProduct);

    return (
        {
            headerTitle: pid ? 'Edit Product' : 'Add Product',
    

            // headerLeft: () => {
            //     return (
            //         <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            //             <Item title="Filters" iconName='ios-menu'
            //                 onPress={() => {
            //                     addOrEditProduct(product);
            //                     navigation.navigate('UserProduct');
            //                     // 
                                
            //                 }}
            //             />
            //         </HeaderButtons>
            //     );
            // },

            headerRight: () => {
                return (
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                        <Item title="Save"
                            iconName='save'
                            onPress={() => {
                                pid ? editProduct(product) : addProduct(product);
                                // addOrEditProduct(product);
                                // navigation.navigate('UserProduct');
                                navigation.goBack();
                            }}
                        
                        />
                    </HeaderButtons>
                );
            }
        }
    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    form: {
        margin: 20,
        minWidth: 300,
        maxWidth: '80%',
        alignItems: 'center',

    },
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8

    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        marginVertical: 0
    },

    url: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        marginVertical: 0
        // width: '100%',
        // alignSelf: 'flex-start',
        // fontSize: 18,
        // paddingHorizontal: 10
    },
    
});

export default EditProductScreen;

