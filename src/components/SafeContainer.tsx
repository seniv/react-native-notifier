import React from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, Platform, ScaledSize } from 'react-native';

const isIOS10 = Platform.OS === 'ios' && Platform.Version?.toString()?.split('.')?.[0] === '10';

const s = StyleSheet.create({
  statusBarMargin: {
    marginTop: 20,
  },
});

interface StatusBarSpacerState {
  displayMargin: boolean;
}

// This component used instead of SafeAreaView on iOS 10 because of bug
// Details: https://github.com/seniv/react-native-notifier/issues/3
class StatusBarSpacer extends React.Component<{}, StatusBarSpacerState> {
  constructor(props: {}) {
    super(props);

    const { height, width } = Dimensions.get('window');
    this.state = {
      displayMargin: height > width,
    };
    this.onSizeChange = this.onSizeChange.bind(this);
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onSizeChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onSizeChange);
  }

  onSizeChange({ window }: { window: ScaledSize }) {
    this.setState({
      displayMargin: window.height > window.width,
    });
  }

  render() {
    const { children } = this.props;
    const { displayMargin } = this.state;
    return <View style={displayMargin && s.statusBarMargin}>{children}</View>;
  }
}

export default isIOS10 ? StatusBarSpacer : SafeAreaView;
