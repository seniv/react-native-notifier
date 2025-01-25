# react-native-notifier

[![npm](https://img.shields.io/npm/v/react-native-notifier)](https://www.npmjs.com/package/react-native-notifier)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-notifier?color=yellow)](https://bundlephobia.com/result?p=react-native-notifier)
![platforms: ios, android, web](https://img.shields.io/badge/platform-ios%2C%20android%2C%20web%2C%20expo-orange)
[![license MIT](https://img.shields.io/badge/license-MIT-brightgreen)](https://github.com/seniv/react-native-notifier/blob/master/LICENSE)

Performant, simple to use, and **highly customizable** in-app notifications for React Native.

![Demo of package](https://raw.githubusercontent.com/seniv/react-native-notifier/master/demo.gif)

## Features

- ⚙️ [**Highly customizable**](#shownotification): All default animations, styles and behaviors can be changed.
- 📍 **Flexible Positioning**: Place notifications at `top`, `bottom`, or any other corner.
- 🧩 [**4 UI Components out-of-the-box**](#components): Includes `Notification`, `Alert`, `Toast`, `SimpleToast`.
- 🔄 **Duplicate Handling**: Configure how to handle notifications with the same ID.
- 📚 [**Queue Management**](#queue-mode): Choose how notifications queue up.
- 🖐️ **Swipe Control**: Customize swipe directions or disable it.
- 🫨 **Shaking**: Don't show same error twice, just shake it!
- 🎨 [**Custom Animation**](#custom-animations): Customize animation config, or completely change the animation.
- 🦄 **Always on top of native iOS modals**: Works the same as with JS based navigators.
- ⌨️ **Keyboard-aware**: Notification is always visible, even when keyboard is open.
- 🕸️ **Web Support**: Works as good as on iOS and Android.

> 📢 You are viewing the documentation for **v3** of react-native-notifier. If you're currently using **v2** or earlier, we highly recommend [migrating to v3](https://github.com/seniv/react-native-notifier/blob/main/MIGRATION.md) to take advantage of the latest features and improvements. Alternatively, you can access the [v2 documentation here](https://github.com/seniv/react-native-notifier/blob/v2.0.0/README.md).

## Requirements

1. **[react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation)**  
   Required for handling swipes and other gesture events.

2. **[react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context?tab=readme-ov-file#getting-started)**  
   Used internally for safe area insets.

Please follow each library’s official installation guide.

## Installation

```bash
yarn add react-native-notifier
```

**or**

```bash
npm install --save react-native-notifier
```

## Usage

Wrap your app with `NotifierWrapper` at the top level, but inside `GestureHandlerRootView` and `SafeAreaProvider`:

```tsx
import { NotifierWrapper } from 'react-native-notifier';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => (
  <GestureHandlerRootView> {/* <-- or use "gestureHandlerRootHOC" */}
    <SafeAreaProvider> {/* <-- required for correct work */}
      <NotifierWrapper>
        <Navigation />
      </NotifierWrapper>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
```

Then call `Notifier.showNotification()` anywhere in your code:

```ts
import { Notifier } from 'react-native-notifier';

Notifier.showNotification({
  title: 'Congratulations!',
  description: 'react-native-notifier successfully installed!',
  componentProps: {
    type: 'success',
  },
});
```

![Screenshot of the notification opened by the code above](/demo/installed.png)

> **ℹ️ Note:** If you want to see all available parameters of the `showNotification` method or other available methods, please refer to the [API section](#api).

---

Alternatively, add `NotifierRoot` at the end of your `App.tsx` or any root component:

```tsx
import { NotifierRoot } from 'react-native-notifier';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => (
  <GestureHandlerRootView>
    <SafeAreaProvider>
      <Navigation />
      <NotifierRoot /> {/* <-- It must be at the very bottom to be displayed above other components */}
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
```

## Queue Mode

Queue mode is used to define the order in which the notification appears in case other notifications are being displayed at the moment.

For example, if you have some important information like chat messages and you want the user to see all the notifications, then you can use `standby` mode. Or if you want to display something like an error message, then you can use `reset` mode.

By default, `reset` mode is used, which means every new notification clears the queue and gets displayed immediately.

In most cases, you will probably use only `reset` or `standby` modes.

All possible modes:
Mode       | Effect
-----------|---------
reset      | Clear notification queue and immediately display the new notification. Used by default.
standby    | Add notification to the end of the queue.
next       | Put notification in the first place in the queue. Will be shown right after the current notification disappears.
immediate  | Similar to `next`, but also it will hide currently displayed notification.

## Components

Currently, there are 4 components available out of the box. If none of them fits your needs, then you can easily create your [Custom Component](#custom-component).

## NotifierComponents.Notification

![Demo of Notification component](/demo/notification.png)

The `NotifierComponents.Notification` component is highly versatile—use it for success/error alerts, chat message notifications, or internet-connection warnings. By design, it stretches to the full width of the screen, providing ample space for your content while maintaining a clean layout.

All elements receive custom styles via props (passed through `componentProps`), so you can easily customize them:

### Props

Name                               | Type                    | Default      | Description
-----------------------------------|-------------------------|--------------|-------------
`title`                            | `string`                | `null`       | The title text of the notification.
`description`                      | `string`                | `null`       | The description text of the notification.
`componentProps.type`              | `string`                | `null`       | Defines the notification type (`info`, `success`, `error`, `warn`, `classic`). Determines icon and border color.
`componentProps.useTypeColorForTitle` | `boolean`            | `false`      | If `true`, the title color is derived from the `type` prop.
`componentProps.useTypeColorForDescription` | `boolean`      | `false`      | If `true`, the description color is derived from the `type` prop.
`componentProps.maxTitleLines`     | `number`                | `null`       | Maximum number of lines for the title text.
`componentProps.maxDescriptionLines` | `number`              | `null`       | Maximum number of lines for the description text.
`componentProps.imageSource`       | `ImageSourcePropType`   | `null`       | An image to display, such as an avatar or icon. Passed to the `<Image />` component as the `source` prop.
`componentProps.iconSource`        | `ImageSourcePropType`   | Depends on `type` | Icon image source. If not specified, a default icon based on `type` is used.
`componentProps.ContainerComponent` | `React.ElementType`    | `ViewWithOffsets` | Custom container component replacing the default `ViewWithOffsets`.
`componentProps.safeAreaStyle`     | `StyleProp<ViewStyle>`  | `null`       | Style for the outermost container of the notification.
`componentProps.containerStyle`    | `StyleProp<ViewStyle>`  | `null`       | Style for the notification content container, such as background color, shadows, padding, or margin.
`componentProps.iconContainerStyle` | `StyleProp<TextStyle>` | `null`       | Style for the icon container, useful for adjusting background color or size.
`componentProps.iconStyle`         | `StyleProp<ImageStyle>` | `null`       | Style for the icon `<Image />`, useful for adjusting icon color or size.
`componentProps.textContainerStyle` | `StyleProp<TextStyle>` | `null`       | Style for the text container wrapping both title and description.
`componentProps.titleStyle`        | `StyleProp<TextStyle>`  | `null`       | Style for the title text.
`componentProps.descriptionStyle`  | `StyleProp<TextStyle>`  | `null`       | Style for the description text.
`componentProps.imageStyle`        | `StyleProp<ImageStyle>` | `null`       | Style for rendering the image.

### Example Usage

```tsx
import React from 'react';
import { Notifier, NotifierComponents } from 'react-native-notifier';

Notifier.showNotification({
  title: 'Success!',
  description: 'Your operation was completed successfully.',
  Component: NotifierComponents.Notification,
  componentProps: {
    type: 'success', // Use 'success', 'error', 'info', 'warn', or 'classic'
    // more props like imageSource, titleStyle, etc. go here
  },
});
```

### `NotifierComponents.Alert`

![Demo of Alert component](https://raw.githubusercontent.com/seniv/react-native-notifier/master/alert-component.png)

Perfect to use as a system alerts, like "Something went wrong" or "Operation was succeed".

```js
import { Notifier, NotifierComponents } from 'react-native-notifier';

Notifier.showNotification({
  title: 'The request was failed',
  description: 'Check your internet connection, please',
  Component: NotifierComponents.Alert,
  componentProps: {
    alertType: 'error',
  },
});
```
Available params:
Name                               | Type      | Default      | Description
-----------------------------------|-----------|--------------|-------------
title                              | String    | null         | Title of notification.
description                        | String    | null         | Description of notification.
componentProps.titleStyle          | TextStyle | null         | The style to use for rendering title.
componentProps.descriptionStyle    | TextStyle | null         | The style to use for rendering description.
componentProps.alertType           | String    | 'success'    | Background color will be changed depending on the type. Available values: `error`(red), `success`(green), `warn`(orange) and `info`(blue).
componentProps.backgroundColor     | String    | null         | While the background of the alert depends on `alertType`, you can also set the other color you want.
componentProps.textColor           | String    | 'white'      | Color of `title` and `description`.
componentProps.ContainerComponent  | Component | SafeAreaView | A container of the component. Set it in case you use different SafeAreaView than the standard
componentProps.maxTitleLines       | number    | null         | The maximum number of lines to use for rendering title.
componentProps.maxDescriptionLines | number    | null         | The maximum number of lines to use for rendering description.

## Custom Component

To customize the appearance of notifications, you can pass your own `Component` to the [`showNotification`](#shownotification) function.

This approach simplifies customization compared to adjusting multiple "style" parameters. With custom components, you can design notifications that perfectly match your application's design and functionality requirements.

### Props Received by the Custom Component

Your custom component will receive the following props:

- **`title`** (`string`): The title text of the notification.
- **`description`** (`string`): The description text of the notification.
- **`ViewWithOffsets`** (`Component`): Utilizes the `useSafeAreaInsets` hook and custom keyboard handling based on the notification's `position` to ensure proper layout and positioning. Use this component instead of a standard `SafeAreaView` for optimal notification rendering.
- **`hide`** (`Function`): A function to hide the notification programmatically.
- **`animationFunctionParams`** (`Object`): Parameters for additional animations.
- **`offsets`** (`Object`): An object used internally by `ViewWithOffsets` for managing offsets.
- **Additional Props:** Any additional properties you pass within the `componentProps` object when calling [`showNotification`](#shownotification) are passed directly as individual props to your custom component.

> **🔍 Tip:** Utilize the `NotifierComponentProps` TypeScript type for convenient and accurate typing of your custom component's props.

### Example

Below is an example of how to create a custom notification component:

```tsx
import { StyleSheet, View, Text } from 'react-native';
import type { NotifierComponentProps } from 'react-native-notifier'; // Import the NotifierComponentProps type for accurate TypeScript typing of custom components

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'orange',
  },
  container: {
    padding: 20,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});

// Define an interface for the custom component's props, extending NotifierComponentProps
interface CustomComponentProps extends NotifierComponentProps {
  extraInfo?: string; // Additional property from "componentProps"
}

export const CustomComponent = ({
  title,
  description,
  ViewWithOffsets,
  // Additional props passed via componentProps are received here
  extraInfo,
}: CustomComponentProps) => (
  <ViewWithOffsets style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {!!extraInfo && <Text style={{ color: 'white' }}>{extraInfo}</Text>}
    </View>
  </ViewWithOffsets>
);
```

### How to Use the Custom Component

To use your custom component with `showNotification`, pass it via the `Component` property and provide any additional props through the `componentProps` object:

```tsx
import React from 'react';
import { Notifier } from 'react-native-notifier';
import { CustomComponent } from './CustomComponent';

Notifier.showNotification({
  title: 'Custom Notification',
  description: 'This is a custom-styled notification.',
  Component: CustomComponent,
  componentProps: {
    extraInfo: 'Additional information here',
  },
});
```

![Demo of custom component](/demo/custom-component.png)

### Benefits of Using Custom Components

- **🎨 Full Control Over Design:** Tailor the notification's appearance to align with your app's theme and design language.
- **🔧 Enhanced Functionality:** Incorporate additional features or interactive elements as needed.
- **🔁 Reusability:** Create standardized notification components that can be reused across different parts of your application.

---

By leveraging custom components, you ensure that your in-app notifications not only convey the necessary information but also seamlessly integrate with the overall user experience of your application.

## Custom Animations

![Demo of Custom Animations](https://raw.githubusercontent.com/seniv/react-native-notifier/master/custom-animations.gif)

It is easy to create your own animation using `containerStyle` param.

When you pass a function as `containerStyle` param, it will receive a `translateY` Animated Value as first parameter.
This Animated Value is a Driver of all Animations in this library and varies between `-1000`(notification completely hidden) and `0` (notification is shown). By default this value is used as a `Y` position of the Notification.

So when you call `showNotification` — this value starts changing from `-1000` to `0` and when the notification is starts hiding — the value is changing from `0` to `-"height of the component"+50` (or `-200`, depending what is bigger) and when animation is finished, the values will be set to `-1000` (just to make sure that the notification is completely hidden).

You need to remember three points of the animated value:
1. `-1000` - Notification completely hidden;
2. `-200` - Most likely notification is still hidden, but will be visible soon (depending on height of the notification);
3. `0` - Notification is shown.

I know, this all is complicated, so here is a Code Example with combination of scaling and transition:
```ts
const getContainerStyleWithTranslateAndScale = (translateY: Animated.Value) => ({
  transform: [
    {
      // this interpolation is used just to "clamp" the value and didn't allow to drag the notification below "0"
      translateY: translateY.interpolate({
        inputRange: [-1000, 0],
        outputRange: [-1000, 0],
        extrapolate: 'clamp',
      }),
    },
    {
      // scaling from 0 to 0.5 when value is in range of -1000 and -200 because mostly it is still invisible,
      // and from 0.5 to 1 in last 200 pixels to make the scaling effect more noticeable.
      scale: translateY.interpolate({
        inputRange: [-1000, -200, 0],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
      }),
    },
  ],
});

Notifier.showNotification({
  title: 'Custom animations',
  description: 'This notification is moved and scaled',
  containerStyle: getContainerStyleWithTranslateAndScale,
})
```

Code from example above should work great on both Android and iOS.

But if you will animate `opacity` style with component that have shadows (such as `NotifierComponents.Notification`)
you may notice that on Android shadows doesn't animate properly. To fix this problem, you need to use `containerProps` parameter and pass `needsOffscreenAlphaCompositing: true` to it. Details: [RN's Repository Issue](https://github.com/facebook/react-native/issues/23090#issuecomment-669157170)

```ts
const animatedContainerProps = isAndroid ? { needsOffscreenAlphaCompositing: true } : undefined;
// ...
Notifier.showNotification({
  title: 'Custom animations',
  description: 'This notification is moved and scaled',
  containerStyle: getContainerStyleWithTranslateAndScale,
  containerProps: animatedContainerProps,
})
```

Keep in mind that this library uses [React Native's Animated library](https://reactnative.dev/docs/animated) with [Native Driver](https://reactnative.dev/docs/animations#using-the-native-driver) turned on, and the current version of React Native has a limited list of style properties that can be animated. Here you can [view list of styles that can be animated](https://github.com/facebook/react-native/blob/main/Libraries/Animated/NativeAnimatedHelper.js#L234).

Also you can see the code of all [Animations from Example GIF](https://github.com/seniv/react-native-notifier/blob/master/example/src/customAnimations.ts). Feel free to copy those animations to your codebase and play with them.

### Troubleshooting
You might notice that some animations such as zoom in/out(using `scale` param) might work incorrectly on iOS and instead of just "scaling" component also moves up and down.
That is because of padding that was added by SafeAreaView.
This behavior can be fixed by moving safe area inset from component to container, like this:

```ts
Notifier.showNotification({
  title: 'Zoom In/Out Animation',
  containerStyle: (translateY: Animated.Value) => ({
    // add safe area inset to the container
    marginTop: safeTopMargin,
    // ...
  }),
  // replace SafeAreaView with View
  componentProps: {
    ContainerComponent: View,
  },
})
```
This behavior will be fixed in feature releases.

## Props

Both `NotifierWrapper` and `NotifierRoot` receive the same props.

Name                  | Type             | Default                       | Description
----------------------|------------------|-------------------------------|-------------
omitGlobalMethodsHookup| Boolean         | false                         | If set to `true`, global `Notifier` methods will not control this component. It's useful in case you have more than one `NotifierWrapper` or `NotifierRoot` rendered. If enabled, the only way to display notifications is using refs.

All parameters of the [`showNotification`](#showNotification) function can be passed as props to `NotifierWrapper` or `NotifierRoot`. In this case, they will be used as default parameters when calling the [`showNotification`](#showNotification) function. This can be useful for setting default [`Component`](#custom-component) parameter.

## API

### `showNotification`

```ts
Notifier.showNotification(params: object);
```

Displays a new notification. Available parameters:

Name                  | Type             | Default                       | Description
----------------------|------------------|-------------------------------|-------------
title                 | String           | null                          | Title text, passed to the notification component.
description           | String           | null                          | Description text, passed to the notification component.
duration              | Number           | 3000                          | Time (in ms) after which the notification hides automatically. Set `0` to keep it visible until manually hidden.
Component             | Component        | NotifierComponents.Notification | Component of the notification body. You can use one of the [built-in components](#components), or your [custom component](#custom-component).
componentProps        | Object           | {}                            | Additional props that are passed to `Component`. See all available props of built-in components in the [components section](#components).
queueMode             | String           | 'reset'                       | Determines how this notification is queued relative to others. (See [Queue Mode](#queue-mode).) 
duplicateBehavior     | String           | 'shakeAndResetTimer'          | Controls what happens if another notification with the same ID is already visible.
idStrategy            | String           | 'hash'                        | `'hash'` or `'random'` for auto-generated IDs, if no `id` is provided.
id                    | Number/String    | auto-generated                | Manually specify an ID. If a matching ID is currently visible, `duplicateBehavior` decides what to do.
onShown               | () => void       | null                          | Called when the entering animation finishes.
onStartHiding         | () => void       | null                          | Called when the notification starts hiding.
onHidden              | () => void       | null                          | Called when the notification has completely hidden.
onPress               | () => void       | null                          | Called when the user presses the notification.
hideOnPress           | Boolean          | true                          | Should the notification hide when user press on it.
position              | String           | 'top'                         | Place the notification at `top`, `bottom`, or any corner (`topLeft`, `topRight`, etc.).
enterFrom             | String           | 'top' (based on `position`)   | Direction from which the notification animates in.
exitTo                | String           | (same as `enterFrom`)         | Direction to which the notification slides out.
swipeDirection        | String           | (same as `enterFrom`)         | Which direction(s) the notification can be swiped. E.g., `'none'`, `'horizontal'`, `'bottom'`, etc.
swipePixelsToClose    | Number           | 20                            | How many pixels the user must swipe the notification to trigger a dismissal.
ignoreSafeAreaInsets  | Boolean          | false                         | If true, doesn't apply safe area offsets (top/bottom notches).
ignoreKeyboard        | Boolean          | false (true on web)           | Treat the keyboard as always closed.
ignoreKeyboardHeight  | Boolean          | false (true on Android)       | If `true`, ignore the actual keyboard height offset for bottom positions.
additionalOffsets     | Object           | null                          | Extra offsets to apply in addition to safe area.
additionalKeyboardOffset | Number        | 0                             | Additional bottom offset when keyboard is visible. Works only when `ignoreKeyboard != true`.
containerProps        | Object           | {}                            | Props of Animated Container
containerStyle        | Object           | null                          | Styles Object that will be used in container.
animationFunction     | Function         | animationFunctions.slide      | A function that returns animated styles using various `Animated.Value` provided as parameters. Overrides the default animation. [Read More](#custom-animations).
showAnimationConfig   | Object           | animationConfigs.spring or animationConfigs.timing300 for **Alert** component | Config for the **show** animation (timing or spring).
hideAnimationConfig   | Object           | animationConfigs.timing300    | Config for the **hide** animation.
swipeOutAnimationConfig | Object         | animationConfigs.timing200    | Config for the **swipe-out** animation.
resetSwipeAnimationConfig | Object       | animationConfigs.timing200    | Animation config for returning the notification to its position if the user partially swipes and releases.
shakingConfig         | Object           | shakingConfigs.horizontal or shakingConfigs.onlyUp for **Alert** component | Config of the shaking animation. Moves the notification from `minValue` to `maxValue` `numberOfRepeats` times in horizontal or vertical direction.
useRNScreensOverlay   | Boolean          | false                         | use `FullWindowOverlay` component from `react-native-screens` library. If `true`, Notifier will be rendered above NativeStackNavigation modals and RN Modal on iOS. This Option will work only if `react-native-screens` library is installed. iOS Only.
rnScreensOverlayViewStyle| ViewStyle     | null                          | Style that will be used for RN View that is inside of FullWindowOverlay. iOS Only.

Returns an object that allows you to control the displayed notification programmatically. This object includes the following properties and methods:

| Property | Type       | Description                                                                                    |
|----------|------------|------------------------------------------------------------------------------------------------|
| `id`     | `string/number`| A unique identifier for the notification instance. Useful for targeting specific notifications.|
| `hide`   | `Function` | Hides the notification programmatically before its `duration` expires.                         |
| `update` | `Function` | Updates the notification's content and properties dynamically.                                 |
| `shake`  | `Function` | Triggers a shake animation to attract the user's attention. Can optionally reset the timer.    |

### Other Global Methods

- **hideNotification**  
  Hide notification and run callback function when notification completely hidden.
  ```ts
  Notifier.hideNotification(onHiddenCallback?: (result: Animated.EndResult) => void);
  ```

- **clearQueue**  
  Clear [notifications queue](#queue-mode) and optionally hide currently displayed notification. Might be useful to run after logout, after which queued notifications should not be displayed.
  ```ts
  Notifier.clearQueue(hideDisplayedNotification?: boolean);
  ```

- **updateNotification**  
  Updates the currently visible notification’s params (e.g., change `title`):  
  ```ts
  Notifier.updateNotification({ title: 'Updated Title' });
  ```

- **shakeNotification**  
  Shakes the currently visible notification. If you pass `true`, it also resets the `duration` timer:  
  ```ts
  Notifier.shakeNotification(/* resetTimer?: boolean */);
  ```

- **isNotificationVisible**  
  Returns `true` if **any** notification is currently displayed:  
  ```ts
  const visible = Notifier.isNotificationVisible();
  ```

- **updateById**  
  Updates a queued or currently visible notification **only if** it has the specified ID:  
  ```ts
  Notifier.updateById('my-id', { description: 'Hello again' });
  ```

- **shakeById**  
  Shakes a notification **only if** its ID matches:  
  ```ts
  Notifier.shakeById('my-id', true /* optional resetTimer */);
  ```

- **isVisibleById**  
  Checks if a notification with a specific ID is currently visible:  
  ```ts
  const isMyToastVisible = Notifier.isVisibleById('my-id');
  ```

- **hideById**  
  Hides a notification if its ID matches the currently visible one:  
  ```ts
  Notifier.hideById('my-id', onHiddenCallback?);
  ```

> **📢 Note:** All `Notifier.*` methods are also available as `Notifier.broadcast.*` methods. The `Notifier.broadcast.*` methods broadcast commands to **all** currently mounted instances of `Notifier` where `omitGlobalMethodsHookup` is not equal `true`. This allows you to manage notifications globally across multiple notifiers in your application.
>
> **Available `Notifier.broadcast.*` Methods:**
>
> - `Notifier.broadcast.showNotification(params)`
> - `Notifier.broadcast.updateNotification(params)`
> - `Notifier.broadcast.shakeNotification(resetTimer)`
> - `Notifier.broadcast.isNotificationVisible()`
> - `Notifier.broadcast.hideNotification(onHidden)`
> - `Notifier.broadcast.clearQueue(hideDisplayedNotification)`
> - `Notifier.broadcast.hideById(id, onHidden)`
> - `Notifier.broadcast.isVisibleById(id)`
> - `Notifier.broadcast.shakeById(id, resetTimer)`
> - `Notifier.broadcast.updateById(id, params)`

## Using with `react-native-navigation`
If you are using `react-native-navigation`, this issue might be helpful to use notifier with native-navigation: https://github.com/seniv/react-native-notifier/issues/16

If you have any solutions or improvements in how to use notifier with native-navigation, then feel free to write comments in that thread!

## Troubleshooting

### PanGestureHandler must be used as a descendant of GestureHandlerRootView
Check this comment: https://github.com/seniv/react-native-notifier/issues/85#issuecomment-1603741147

## License

MIT
