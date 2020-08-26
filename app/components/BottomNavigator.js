import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

const BottomNavigator = (props) => (
    <View style={styles.container}>
        <Text>BottomNavigator</Text>
    </View>
    )
export default BottomNavigator;

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        left:'0%',
        right: '0%',
        top: '0%',
        bottom: '0%'

    }
});