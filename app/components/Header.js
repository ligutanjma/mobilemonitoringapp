import React, { useState} from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
    TouchableNativeFeedback,
    Platform,
    Alert,
    TouchableHighlight,
    Modal
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"


function Header({navigation, headerStyle}){
    const [rippleColor, setRippleColor] = useState("#FFFFFF");
    const [rippleOverflow, setRippleOverflow] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={headerStyle}>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView,]}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.modalText}>14.7psia---</Text><Text style={styles.modalText}>100°C</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.modalText}>15.0psia---</Text><Text style={styles.modalText}>101°C</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.modalText}>16.0psia---</Text><Text style={styles.modalText}>102°C</Text>
            </View>

            <TouchableNativeFeedback
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.openButton}>Close</Text>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal>
            <TouchableNativeFeedback 
                onPress={()=> navigation.navigate('Live Session')}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >

                <Image
                    source={require("../assets/NMFICLOGO.png")}
                    style={styles.headerLogo}
                />
            </TouchableNativeFeedback>
                <Text style={styles.headerTitle}>
                    Water Retort
                </Text>
                <TouchableNativeFeedback
                    onPress={() => {
                    setModalVisible(prevState=> !prevState);
                    }}
                >
                   <FontAwesome5 name="temperature-low" style={styles.more} size={25}/>
                </TouchableNativeFeedback>
        </View>
    )
}
export default Header;

const styles = StyleSheet.create({
    container: {
    },
    headerLogo: {
        position:"absolute",
        width: 50, 
        height: 50,
        left:15,
        top: 18,
        borderRadius: 50,
        backgroundColor: "#FFFFFF"
    },
    headerTitle: {
        position: 'absolute',
        top: 18,
        fontStyle:"normal",
        fontSize: "bold",
        fontSize: 30,

        lineHeight:41,
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: {width: 0, height: 1.83333},
        textShadowRadius: 1.83333,
        alignSelf: 'center'
    },
    more: {
        position: 'absolute',
        width: 30,
        height: 30,
        right: 15,
        top:24,
        color:"white"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3
      },
      openButton: {
        backgroundColor: "rgba(247, 112, 53, 0.822601)",
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        color:"#FFFFFF"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      textStyle:{
          bottom:50,
          zIndex : 2
      }
});