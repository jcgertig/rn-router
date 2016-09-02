import React, { Component, PropTypes } from 'react';
import { Animated, Dimensions } from 'react-native';

import Transitions from './Transitions';

const START = 0;
const STOP = 1;

const _clone = (data) => JSON.parse(JSON.stringify(data));

const deviceScreen = Dimensions.get('window');

class SlideInView extends Component {

  static displayName = 'SlideInView';

  static propTypes = {
    transition: PropTypes.any.isRequired,
    onEnd: PropTypes.any,
    reverse: PropTypes.any.isRequired
  };

  static defaultProps = {
    transition: Transitions.None,
    reverse: false,
  };

  state = {
    anim: new Animated.Value(START),
  };

  componentDidMount() {
    this._startAnim();
  }

  componentDidUpdate() {
    const {onEnd} = this.props;
    if (this.state.anim._value === STOP && onEnd !== null) {
      this.setState({ anim: new Animated.Value(START) }, this._startAnim);
    } else if (this.state.anim._value === START && onEnd !== null) {
      this._startAnim();
    }
  }

  _startAnim = () => {
    const {transition, onEnd} = this.props;
    if (transition.attr !== 'none') {
      this.state.anim.addListener(({value}) => {
        if (value === STOP && onEnd !== null) {
          onEnd();
        }
      });
      Animated.spring(
        this.state.anim,
        Object.assign({}, transition, {toValue: STOP})
      ).start();
    } else if (onEnd !== null) {
      onEnd();
    }
  };

  _buildStyle = () => {
    const {style, transition, onEnd, reverse} = this.props;
    const base = {
      height: deviceScreen.height,
      width: deviceScreen.width,
    };
    if (transition.attr !== 'none') {
      const inputRange = [START, STOP];
      let outputRange = transition.outputRange;
      if (onEnd !== null && reverse === true) {
        outputRange = _clone(transition.outputRange).reverse();
        console.log('rev', outputRange);
      }
      if (transition.trans === true) {
        base.transform = [{
          [transition.attr]: this.state.anim.interpolate({
            inputRange, outputRange,
          })
        }];
      } else {
        base[transition.attr] = this.state.anim.interpolate({
          inputRange, outputRange
        });
      }
    }
    return [style, base];
  };

  render() {
    const {children, onEnd} = this.props;
    const key = 'a-'+(new Date()).valueOf();
    return (
      <Animated.View
        key={key}
        style={this._buildStyle()}
      >
        {children}
      </Animated.View>
    );
  }
}

export default SlideInView;
