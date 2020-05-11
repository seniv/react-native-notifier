import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Platform,
  ScaledSize,
  ViewProps,
} from 'react-native';

const isIOS10 = Platform.OS === 'ios' && Platform.Version?.toString()?.split('.')?.[0] === '10';

const s = StyleSheet.create({
  statusBarPadding: {
    paddingTop: 20,
  },
});

interface StatusBarSpacerState {
  displayPadding: boolean;
}

// This component used instead of SafeAreaView on iOS 10 because of bug
// Details: https://github.com/seniv/react-native-notifier/issues/3
class StatusBarSpacer extends React.Component<ViewProps, StatusBarSpacerState> {
  constructor(props: ViewProps) {
    super(props);

    const { height, width } = Dimensions.get('window');
    this.state = {
      displayPadding: height > width,
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
      displayPadding: window.height > window.width,
    });
  }

  render() {
    const { style, ...props } = this.props;
    const { displayPadding } = this.state;
    return <View style={[displayPadding && s.statusBarPadding, style]} {...props} />;
  }
}

export default isIOS10 ? StatusBarSpacer : SafeAreaView;
