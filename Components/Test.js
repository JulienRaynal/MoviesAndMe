import React from 'react'
import { StyleSheet, View, Animated, Easing, PanResponder, Dimensions } from 'react-native'

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            topPosition: 0,
            leftPosition: 0,
        };

        let {height, width} = Dimensions.get('window');
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true, //needed or the pan responder would never detect anything
            onPanResponderMove: (evt, gestureState) => {
                let touches = evt.nativeEvent.touches; //number of fingers on the screen, is an array
                if (touches.length == 1) {
                    this.setState({ //0,0 is our center but if a finger touches the center it may be 200/400 for a screen of 400/800 pixels so we need to divide it by 2
                        topPosition: touches[0].pageY - height/2,
                        leftPosition: touches[0].pageX - width/2,
                    })
                }
            }
        })
    }





    componentDidMount() {
        /*
        Animated.parallel([
            Animated.spring(
                this.state.topPosition,
                {
                    toValue: 100,
                    tension: 8,
                    friction: 3,
                }
            ),
            Animated.timing(
                this.state.leftPosition,
                {
                    toValue: 100,
                    duration: 1000,
                    easing: Easing.elastic(2)
                }
            )
            ]
        ).start() //launch the animation*/
    }

    render() {
        return (
            <View style={styles.main_container}>
                <View
                    {...this.panResponder.panHandlers}
                    style={[styles.animation_view, { top: this.state.topPosition, left: this.state.leftPosition }]}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    animation_view: {
        backgroundColor: 'red',
        width: 100,
        height: 100
    },
    //Another way to write the subview container to check for the platform
    /*subview_container: {
        backgroundColor: Platform.OS === 'ios' ? 'red' : 'blue',
        height: Platform.OS === 'ios' ? 100 : 50,
        widht: Platform.OS === 'ios' ? 50 : 100,
    }*/
});


export default Test