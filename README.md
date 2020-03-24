# react-native-notifier

[![npm](https://img.shields.io/npm/v/react-native-notifier)](https://www.npmjs.com/package/react-native-notifier)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-notifier)](https://bundlephobia.com/result?p=react-native-notifier)
[![license MIT](https://img.shields.io/badge/license-MIT-brightgreen)](https://github.com/seniv/react-native-notifier/blob/master/LICENSE)

Fast and simple in-app notifications for React Native

![license MIT](demo.gif)

## Requirements

This library uses [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler), perfect library for swipes and other gesture events.

If you are using [react-navigation](https://reactnavigation.org/) then you already have it. If you don't, check Getting Stated guide: https://software-mansion.github.io/react-native-gesture-handler/docs/getting-started.html

## Installation
```sh
yarn add react-native-notifier
```
Or
```sh
npm install --save react-native-notifier
```

## Usage

Wrap your app with `NotifierWrapper`
```js
import { NotifierWrapper } from 'react-native-notifier';

const App = () => (
  <NotifierWrapper>
    <Navigation />
  </NotifierWrapper>
);
```
Or add `NotifierRoot` at end of your App.js component. Note that `NotifierRoot` should the last component to display notifications correctly
```js
import { NotifierRoot } from 'react-native-notifier';

const App = () => (
  <>
    <Navigation />
    <NotifierRoot />
  </>
);
```
Then call `Notifier.showNotification()` anywhere in code
```js
import { Notifier, Easing } from 'react-native-notifier';

Notifier.showNotification({
  title: 'John Doe',
  description: 'Hello! Can you help me with notifications?',
  duration: 0,
  showAnimationDuration: 800,
  showEasing: Easing.bounce,
  onHide: () => console.log('onHide'),
  onPress: () => console.log('Press'),
  hideOnPress: false,
});
```


## `Notifier.showNotification` params

Name                  | Type     | Default                    | Description
----------------------|----------|----------------------------|-------------
title                 | String   | null                       | Title of notification. __Passed to `Component`.__
description           | String   | null                       | Description of notification. __Passed to `Component`.__
swipeEnabled          | Boolean  | true                       | Can notification be hidden by swiping it out
duration              | Number   | 3000                       | Time after notification will disappear. Set to `0` to not hide notification automatically
Component             | Component| MainComponent              | Your custom component of notification body
componentProps        | Object   | {}                         | Additional props that will be passed to `Component`. Use it for customization or if using custom `Component`.
imageSource           | Object   | null                       | Passed to `<Image />` as `source` param. __Passed to `Component`.__
animationDuration     | Number   | 300                        | How fast notification will appear/disappear
showAnimationDuration | Number   | animationDuration \|\| 300 | How fast notification will appear.
hideAnimationDuration | Number   | animationDuration \|\| 300 | How fast notification will disappear.
easing                | Easing   | null                       | Animation easing. Details: https://reactnative.dev/docs/easing
showEasing            | Easing   | easing \|\| null           | Show Animation easing.
hideEasing            | Easing   | easing \|\| null           | Hide Animation easing.
onHide                | Function | null                       | Function called when notification started hiding
onPress               | Function | null                       | Function called when user press on notification
hideOnPress           | Boolean  | true                       | Should notification hide when user press on it
swipePixelsToClose    | Number   | 20                         | How many pixels user should swipe-up notification to dismiss it
swipeEasing           | Easing   | null                       | Animation easing after user finished swiping
swipeAnimationDuration| Number   | 200                        | How fast should be animation after user finished swiping



## License

MIT
