import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierRoot } from 'react-native-notifier';
import { isAndroid, notifierRef } from './constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabScreen } from './screens/HomeTabScreen';
import { CustomAnimationsTabScreen } from './screens/CustomAnimationsTabScreen';
import { ModalsTabScreen } from './screens/ModalsTabScreen';
import { ModalScreen } from './screens/ModalScreen';
import { useAppStore } from './store';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="HomeTab"
        options={{ title: 'Home' }}
        component={HomeTabScreen}
      />
      <BottomTab.Screen
        name="CustomAnimationsTab"
        options={{ title: 'Custom Animations' }}
        component={CustomAnimationsTabScreen}
      />
      <BottomTab.Screen
        name="ModalsTab"
        options={{ title: 'Modals' }}
        component={ModalsTabScreen}
      />
    </BottomTab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Tabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Modal"
        options={{ presentation: 'modal' }}
        component={ModalScreen}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  const statusBar = useAppStore((state) => state.statusBar);
  const statusBarTranslucent = useAppStore(
    (state) => state.statusBarTranslucent
  );

  useEffect(() => {
    if (isAndroid) {
      StatusBar.setHidden(!statusBar);
      StatusBar.setTranslucent(statusBarTranslucent);
    }
  }, [statusBar, statusBarTranslucent]);

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
      <NotifierRoot
        ref={notifierRef}
        translucentStatusBar={statusBarTranslucent}
      />
    </GestureHandlerRootView>
  );
}
