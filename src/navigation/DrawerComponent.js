import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';
import { DrawerItems } from 'react-navigation-drawer';

const DrawerComponent = (props) => (
    <View style={styles.screen}>
        <ScrollView>
            <SafeAreaView
            style={styles.AndroidSafeArea}
            forceInset={{ top: 'always', horizontal: 'never' }}
            >
            <DrawerItems {...props} />
            </SafeAreaView>
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginVertical: 30
    },
    container: {
        flex: 1,
    },
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
});

export default DrawerComponent;

