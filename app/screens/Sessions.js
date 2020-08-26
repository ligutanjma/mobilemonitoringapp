import React, { useState, useEffect } from "react";
import { 
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    useWindowDimensions,
    Platform,
    TouchableHighlight
} from "react-native";
import Header from '../components/Header'
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios'

const URL = 'http://192.168.1.9:8000/'

const Sessions = ({navigation}) => {
  const window = useWindowDimensions()
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  


  useEffect(()=>{
    axios.get(`${URL}api/sessions/`)
    .then(res=>{
      setData(res.data.results)
    })
    .catch(err=>{
      console.log({err})
    })
  }, [])
  return(
    <View style={styles.container}>
        <LinearGradient colors={['#F26122', 'rgba(247, 112, 53, 0.722601)', ]} style={styles.headerStyle}>
            <Header  navigation={navigation} />
        </LinearGradient>
        <Text style={styles.sessionsText}>
            SESSIONS
        </Text>
        <SafeAreaView style={styles.sessionsList}>
            <FlatList
                  ItemSeparatorComponent={
                  Platform.OS !== 'android' &&
                  (({ highlighted }) => (
                    <View
                      style={[
                        style.separator,
                        highlighted && { marginLeft: 0 }
                      ]}
                    />
                  ))
                }
                data={data}
                keyExtractor={item=> item.pk}
                refreshing={refreshing}
                onRefresh={()=> {
                    setRefreshing(true)
                    axios.get(`${URL}api/sessions/`)
                    .then(res=>{
                      console.log(res.data)
                      setData(res.data.results)
                    })
                    .catch(err=>{
                      console.log({err})
                    })
                    setRefreshing(false)
                }}
                renderItem={({ item, index, separators }) => (
                  <TouchableHighlight
                    activeOpacity={1}
                    underlayColor="#DDDDDD"
                    key={item.pk}
                    onPress={() => navigation.navigate('Live Session', item)}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <View style={styles.item}>
                      <View style={styles.titleContainer}>

                        <Text style={styles.title}>{item.product_name}</Text>
                        <Text style={styles.subtitle}>operator: {item.operator}</Text>
                      </View>
                      <Text style={styles.date}>{item.date}</Text>
                    </View>
                  </TouchableHighlight>
                )}
            />
        </SafeAreaView>

    </View>
    )
}
export default Sessions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    headerStyle: {
        position:'absolute',
        height: 77,
        left: 0,
        right: 0,
        top: 0,
    },
    sessionsText: {
        position: 'absolute',
        left: '4.17%',
        right: '84.44%',
        top: 87,
        fontSize: 8,
        display: 'flex',
        alignItems: 'center',
        color: 'rgba(0,0,0, 0.54)',
        textAlign: 'center',
        alignItems: 'center',

    },
    sessionsList: {
        position: 'absolute',
        left: 0,
        right:0,
        top: 100,
        bottom: 0,
        borderTopWidth: .5,
        borderTopColor: 'rgba(0,0,0,0.1)',
        borderTopEndRadius: 15,
        borderTopStartRadius: 15,
    },
    item: {
        flexDirection: 'row',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        borderBottomEndRadius: 60,
        borderBottomStartRadius: 60,

    },
    titleContainer:{
      flexDirection:'column'
    },
    title: {
        top:10,
        left: 15,
        fontSize: 20,
        color: 'rgba(0,0,0,0.6)',
        fontWeight:'bold',
        letterSpacing: 1
    },
    subtitle:{
      top: 10,
      left: 16,
      color: 'rgba(0,0,0,0.5)',

    },
    date: {
      bottom:10,
      position:'absolute',
      right:'5%', 
      color: 'rgba(0,0,0,0.5)',
      alignSelf:'center',
    }
});