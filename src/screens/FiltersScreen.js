import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';

const FilterScreen = ( {} ) => {
    return ( 
        <View style={styles.screen}>
            <Text>FilterScreen</Text>
        </View>
    );
}

FilterScreen.navigationOptions = ( {navigation }) => { 
    // console.log("nav igationOptions navigation", navigation);
    return ( {
        headerTitle: 'Filters',
        
        headerLeft: () => {
            return (
                <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
                    <Item title="Filters" iconName='ios-menu' 
                        onPress={() => navigation.toggleDrawer() } 
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
    
});

export default FilterScreen;

