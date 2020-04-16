import React from 'react';
import {Animated, Dimensions} from 'react-native';

class FadeIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      positionLeft: new Animated.Value(Dimensions.get('window').width),
    };
  }

  componentDidMount() {
    Animated.spring(this.state.positionLeft, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }

  render() {
    return (
      //{this.props.children} are the children component of fadeIn in FilmItem.js
      <Animated.View style={{left: this.state.positionLeft}}>
        {this.props.children}
      </Animated.View>
    );
  }
}

export default FadeIn;
