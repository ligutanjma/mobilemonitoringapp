import React, { useState, useEffect} from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    ScrollView, 
    StatusBar, SafeAreaView
} from 'react-native';

import {
    LineChart,
  } from "react-native-chart-kit";

import { LinearGradient } from 'expo-linear-gradient';
import { useWindowDimensions } from 'react-native';
import { Circle, Path, G, Line, Rect, Svg, Text as TextSVG } from 'react-native-svg'

import Header from '../components/Header'
import axios from 'axios'
// import {scaleTime, scaleLinear}from 'd3-scale';
// import * as shape from 'd3-shape';
// import * as format from 'd3-format';
// import * as axis from 'd3-axis';

// const d3 = {
//   scale,
//   shape,
//   format,
//   axis,
// };

const LiveSession = ({route, navigation}) => {
    console.log({route})
    const { product_name } = route.params || ''
    const { required_temp } = route.params || ''

    const [reconTime, setReconTime] = useState(250)
    const [xAxisLength, setxAxisLength] = useState(1)
    const [WSclose, setWSclose] = useState(false)
    const [ws, setWS] = useState()
    const [session, setSession] = useState({
        product_name: "",
        required_temp: 0,
        holding_time: "",
        current: false
    })
    const [readings, setReadings] = useState({
        temperature:[session.required_temp,0],
        time: [0, 0]
        })

    const window = useWindowDimensions()
    // const onChange = ({ window, screen }) => {
    //     setDimensions({ window, screen });
    // };
    let [tooltipPos,setTooltipPos] = useState(
        { x:0, y:0, visible:true, value:0 })
    const URL = "192.168.1.9:8000"

    useEffect(()=>{
        
        axios.get(`http://${URL}/api/sessions/current/`)
        .then(res=>{
            console.log({res})
            navigation.navigate('Live Session', res.data.results[0])

        })
        .catch(err=>{
        console.log(err.message)
        })

    },[])

    useEffect(()=>{
        const websocket = new WebSocket(`ws://${URL}/ws/clients/`)
        websocket.onopen = () => {
            setWS(websocket)
        }
        websocket.onmessage = (response) => {
            console.log(response.data)
            var data = JSON.parse(response.data)
            // var reading = Object.assign({
            //   'time': Number(data.time),
            //   'reading': Number(data.reading)
            // })
            if(data.type==="sensor_readings"){
                var dt = data.time
                dt = dt.replace(" ", "T")
                var date = new Date(dt)
        
                var readingsCopy = Object.assign({}, readings);
                readingsCopy.temperature.push(parseFloat(data.reading))
                readingsCopy.time.push(date.getTime())
                setxAxisLength(prevState=> prevState+2)
                setReadings(readingsCopy)
            }
        }
        websocket.onclose = e => {
          console.log('clossing in ')
          console.log('clossing')
          setReconTime((prevState) =>  prevState + prevState)
          setTimeout(() => check(), Math.min(10000, reconTime))
        };
    
        // websocket onerror event listener
        websocket.onerror = err => {
          console.log(
            "Socket encountered error: ",
            err.message,
            "Closing socket"
        );
        };
        return ()=> {
            websocket.close()
          }
          
      }, [WSclose])
      const check = () => {
        if (!ws || ws.readyState === WebSocket.CLOSED){
          setWSclose(!WSclose)
        //   setReconTime(250)
        }; //check if websocket instance is closed, if so call `connect` function.
      }
        
    // const scaleX = scaleTime().domain([readings.time[0], readings.time[readings.length-1]].range([0,window.width]))
    // const scaleY = scaleLinear().domain([0,300]).range([2,0])
    // const line =  d3.shape.line()
    //     .x(d=> scaleX(d.x))
        // .y(d=> scaleY(d.y))
    //     .curve(d3.shape.curveNatural)(readings)
    return ( 
        <SafeAreaView>
        <View>
            <LinearGradient
                // Background Linear Gradient
                colors={['#F26122', 'rgba(247, 112, 53, 0.822601)', 'rgba(246, 148, 106, 0.9)','rgba(246, 148, 106, 0.7)','#FFFFFF','transparent' ]}
                style={{
                    position: 'relative',
                    width: window.width,
                    height: window.height,
                }}>

                    <Header navigation={navigation}/>
                    <ScrollView style={styles.lineChart} key={Math.random()} >

                    {/* { readings.temperature.length > 2 ?  */}
                    <LineChart
                        data={{
                        // labels: readings.time,
                        labels: ["04:29:56", "04:29:57", "04:29:58", "04:29:59", "04:30:00", "04:30:01","04:29:56", "04:29:57", "04:29:58", "04:29:59", "04:30:00", "04:30:01"],
                        datasets: [
                            {
                            // data: readings.temperature,
                            data: [
                                34,36,36,37,38,39,40,41,42,43,44,45
                            ],
                            color: (opacity = 1) => '#F6DA6A',
                            },
                            // {
                            //     data: [0,session.required_temp],
                            //     color: ()=> '#A2380A'
                            // }
                        ],
                        }}
                        bezier
                        width={window.width - 20}
                        height={315}
                        yAxisSuffix="°C"
                        withScrollableDot={true}
                        withDots={false}
                        withVerticalLines={false}
                        xLabelsOffset={-15}
                        // withVerticalLabels={false}
                        yAxisInterval={1} // optional, defaults to 1
                        verticalLabelRotation={70}
                        chartConfig={{
                        backgroundGradientFromOpacity: 0,
                        backgroundGradientToOpacity: 0,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: () => `rgba(255,255,255,1)`,
                        style: {
                            fontSize: 2
                        },
                        propsForDots: {
                            r: "3",
                            stroke: "#FFFFFF"
                        },
                        strokeWidth: 2,
                        propsForLabels: {
                            fontSize: "10"
                        },
                        scrollableDotFill: "#fff",
                  scrollableDotRadius: 6,
                  scrollableDotStrokeColor: "#FF5500",
                  scrollableDotStrokeWidth: 3,
                  strokeWidth: 1,

                  scrollableInfoViewStyle: {
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor: "#FAFAFA",
                    borderRadius: 2,
                    shadowColor: "#000",
                    shadowOffset: {
                    width: 0,
                    height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.00,
                    elevation: 6,
                  },
                  scrollableInfoTextStyle: {
                    color: "#000",
                    marginHorizontal: 5,
                    flex: 1,
                    textAlign: "center"
                  },
                  scrollableInfoSize: { width: 40, height: 20 },
                  scrollableInfoOffset: -30
                        }}
                        
                        // withDots={false}
                        // onDataPointClick={ (data) => {
                        //         // check if we have clicked on the same point again
                        //         let isSamePoint = (tooltipPos.x === data.x 
                        //                             && tooltipPos.y ===  data.y)
                            
                        //         // if clicked on the same point again toggle visibility
                        //         // else,render tooltip to new position and update its value
                        //         isSamePoint ? setTooltipPos((previousState)=> {
                        //             return {
                        //                                 ...previousState, 
                        //                                 value: data.value,
                        //                                 visible: !previousState.visible}
                        //                             })
                        //                     : 
                        //                     setTooltipPos({x: data.x, 
                        //                     value: data.value, y: data.y,
                        //                     visible: true
                        //                     });
                        //     } // end function
                        // }
                        // style={styles.lineChart}
                    >
                    </LineChart>
                    {/* : null} */}
                    {/* <LineChart
                    bezier
                    yAxisSuffix="°C"
                data={{
                  labels: readings.time,
                // labels: [
                //     "January",
                //     "February",
                //     "March",
                //     "April",
                //     "May",
                //     "June"
                //   ],
                  datasets: [
                    {
                      data: readings.temperature,
                    // data: [
                    //     1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,24,25,26,27,28,29,30
                    //   ],
                      color: (opacity = 1) => '#F6DA6A',

                    },
                    
                  ]
                }}
                width={window.width } // from react-native
                height={300}
                withDots={false}
                withShadow={false}
                withVerticalLabels={false}
                withScrollableDot={true}
                withVerticalLines={false}
                verticalLabelRotation={75}
                xLabelsOffset={-20}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundGradientFrom: "#1F1F1F",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => "#FFFFFF",
                  labelColor: (opacity = 1) => "#FFFFFF",
                  linejoinType: "round",
                  backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                  scrollableDotFill: "#fff",
                  scrollableDotRadius: 6,
                  scrollableDotStrokeColor: "#FF5500",
                  scrollableDotStrokeWidth: 3,
                  strokeWidth: 1,

                  scrollableInfoViewStyle: {
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor: "#FAFAFA",
                    borderRadius: 2,
                    shadowColor: "#000",
                    shadowOffset: {
                    width: 0,
                    height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.00,
                    elevation: 6,
                  },
                  scrollableInfoTextStyle: {
                    color: "#C4C4C4",
                    marginHorizontal: 5,
                    flex: 1,
                    textAlign: "center"
                  },
                  scrollableInfoSize: { width: 50, height: 20 },
                  scrollableInfoOffset: 15
                }}
              /> */}
                    </ScrollView>
                    {/* <Svg>
                        <Path d={line} />
                    </Svg> */}
                    <View style={styles.notifications}>
                    
                        <Text style={styles.notifType}>NOTIFICATIONS</Text>  
                        <ScrollView horizontal={true} style={{transform:[{rotateY:'180deg'}]}}>
                            
                            <View style={styles.notification}>
                            <View style={styles.NotifCard}>
                                    <Text style={styles.notifType}>Session6</Text>
                                    <Text style={styles.notifStatement}>The temperature is approaching the required temperature</Text>
                                    <Text style={styles.notifStatus}>75C At 7:30:10 10/12/2020</Text>
                            </View>
                            <View style={styles.NotifCard}>
                                    <Text style={styles.notifType}>Session1</Text>
                                    <Text style={styles.notifStatement}>The temperature is approaching the required temperature</Text>
                                    <Text style={styles.notifStatus}>75C At 7:30:10 10/12/2020</Text>
                                </View>
                            <View style={styles.NotifCard}>
                                    <Text style={styles.notifType}>Session2</Text>
                                    <Text style={styles.notifStatement}>The temperature is approaching the required temperature</Text>
                                    <Text style={styles.notifStatus}>75C At 7:30:10 10/12/2020</Text>
                                </View>
                                <View style={styles.NotifCard}>
                                    <Text style={styles.notifType}>Sessionista</Text>
                                    <Text style={styles.notifStatement}>The temperature is approaching the required temperature</Text>
                                    <Text style={styles.notifStatus}>75C At 7:30:10 10/12/2020</Text>
                                </View>
                                <View style={styles.NotifCard}>
                                    <Text style={styles.notifType}>Session</Text>
                                    <Text style={styles.notifStatement}>The temperature is approaching the required temperature</Text>
                                    <Text style={styles.notifStatus}>75C At 7:30:10 10/12/2020</Text>
                                </View>
                                <View style={styles.NotifCard}>
                                    <Text style={styles.notifType}>Session5</Text>
                                    <Text style={styles.notifStatement}>The temperature is approaching the required temperature</Text>
                                    <Text style={styles.notifStatus}>75C At 7:30:10 10/12/2020</Text>
                                </View>
                                
                            </View>
                        </ScrollView>
                            
                    </View>
            </LinearGradient>
                    <StatusBar barStyle="light-content" backgroundColor="#F26122" />
                    <View style={styles.legendContainer}>
                        <Text  style={styles.ReqLine}>{required_temp? `${required_temp}°C`: '- - -' }</Text>
                        <Text style={styles.CurrLine}>____</Text>

                        <Text style={styles.legendText1}>
                            Required Temperature
                        </Text>
                        <Text style={styles.legendText2}>
                            Current Reading
                        </Text>
                    </View>
                    <View style={styles.productNameContainer}>
                        <Text style={styles.productName}>
                            Product Name
                        </Text>
                        <Text style={{top: 3, fontSize:22, color: '#FFFFFF'}}>
                            {product_name ? product_name: '-------------'}
                        </Text>
                    </View>
                    
        </View>
</SafeAreaView>
     );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 360,
        height:  640,
        // backgroundImage: "linear-gradient(180deg, #F26122 -3.61%, rgba(247, 112, 53, 0.722601) 21.72%, rgba(246, 148, 106, 0.67602) 34.12%, #FFFFFF 71.87%)"
    },
    background: {
        
        position:'absolute',
        left:'0%',
        right: '0%',
        top: '0%',
        bottom: '0%',
    },
    bottomNavigator: {
        position: 'absolute',
        width: '100%',
        height: '50px',
        left: '0px',
        top: '590px',
    },
    productNameContainer: {
        position: 'absolute',
        height: 50,
        left: '4.17%',
        right: '50.68%',
        top: 84,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'rgba(249, 165, 129, 1)',
        elevation: 6
    },
    productName: {
        position:'relative',
        fontSize: 10,
        top: 7,
        color: "rgba(255,255,255, 0.7)"
    },
    legendContainer: {
        position: 'absolute',
        height: 50,
        left: '50.4%',
        right: '4.17%',
        top: 84,
        borderRadius: 8,
        backgroundColor: 'rgba(249, 165, 129, 1)',
        elevation: 6,

    },
    legendText1: {
        position: 'absolute',
        top: 7,
        left: '30%',
        right: '6%',
        fontSize: 10,
        color: "rgba(255,255,255, 0.7)",
        display: 'flex',
        alignItems: 'center'

    },
    legendText2: {
        position: 'absolute',
        top: 28,
        left: '30%',
        right: '13.23%',
        fontSize: 10,
        color: "rgba(255,255,255, .7)",
        display: 'flex',
        alignItems: 'center'

    },
    ReqLine: {
        position: 'absolute',
        top: 8,
        left: '10%',
        color: "rgba(255,255,255, 1)",
        right: '75%',
        fontSize: 10,
        fontWeight: 'bold'
    },
    CurrLine: {
        position: 'absolute',
        top: 20,
        left: '8%',
        right: '75%',
        color: '#F6DA6A',
        fontSize: 15
    },
    notifications:{
        position:'absolute',
        height: 150,
        right:0,
        bottom: 100        
    },
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        transform:[{rotateY:'180deg'}],
        marginRight: 15,
        marginLeft: 7.5,

    },
    NotifCard: {
        borderRadius: 10,
        marginRight: 7.5,
        height: 95,
        width: 108,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 2,
    },
    notifType: {
        top: '12%', 
        left: '5%',
        fontSize: 10,
        color: 'rgba(0, 0, 0, 0.5)'
    },
    notifStatement: {
        left: '5%',
        top:'14%',
        bottom: '37.78%',
        fontSize: 10,
        color: 'rgba(0, 0, 0, 0.8)'
    },
    notifStatus: {
        left: '5%',
        top:'18%',
        fontSize: 8,
        color: 'rgba(0, 0, 0, 1)'
    },
    lineChart: {
        position: 'relative',
        marginTop: 15,
        left: '0%',
        right: '4.17%',
        top: '20.0%',
        bottom: '35.38%',
    },
    tooltipBase: {
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        width: 43,
        right: 15, 
        top: '21.23%',
        bottom: '74.22%',
        borderRadius: 5,
        backgroundColor: 'black'
    },
    tooltipArrow: {
        position:'absolute',
        width: 12,
        height: 12, 
        bottom: -2,
        left: '66%',
        transform:[{rotate:'45deg'}],
        backgroundColor: 'black'
    }
    
})
export default LiveSession;