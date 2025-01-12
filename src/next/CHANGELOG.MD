# BREAKING CHANGES
- Animations will work correctly only with New Architecture (Fabric renderer) enabled.
- `Component` gets unmounted while notification is not visible.
- `containerStyle` now receives simple style object and can't be used to change animation. Use `animationFunction` instead.
- now `react-native-safe-area-context` library is internally used, so make sure you have `react-native-safe-area-context` installed and `NotifierRoot/Wrapper` is wrapped by `SafeAreaProvider`.
- "Hide Timer" (`duration` param) now starts after the "appearing" animation is finished, instead of starting when "appearing" animation is just started. If you had long appearing animation, you can reduce the `duration` param (3 seconds by default)
- `swipeEnabled` parameter was removed. To disable swipes, set `swipeDirection: 'none'`
- Parameters `animationDuration`, `showAnimationDuration`, `hideAnimationDuration`, `swipeAnimationDuration`, `easing`, `showEasing`, `hideEasing`, `swipeEasing` was removed. Use `showAnimationConfig`, `hideAnimationConfig`, `swipeOutAnimationConfig`, `resetSwipeAnimationConfig` instead.
- Default `showAnimationConfig` set to spring animation when `Component != NotifierComponents.Alert`

# Features
- Support for different positions. Notification can be placed at `top`, `bottom`, or at any edge of the screen using `position` parameter.
- Introduced new params: `enterFrom`, `exitTo`, and `swipeDirection`. These params change the direction of the entering/exiting animation and allow you to swipe notifications not only to the top but also left, right, and down.
- New `animationFunction` parameter that allows to create custom animations.
- Now each notification has it's own ID, be default it's random number, and can be assigned to something specific. If notification with the same ID already shown, result of the `showNotification` will depend on `ifAlreadyShown` parameter.
- New `ifAlreadyShown` parameter which describes how Notifier should behave if notification __with the same ID__ already shown.
- New `updateNotification` method which updates _currently visible_ notification.
- New `shakeNotification` method which shakes _currently visible_ notification to attract the user's attention and (optionally) reset the `duration` timer.
- Call of `showNotification` function returns `update`, `hide`, `shake` and `isVisible` functions which allows to manipulate with the notification.
- You can mount multiple instances of `NotifierWrapper`/`NotifierRoot`, and still can control them using global `Notifier.*` methods. Component that was mounted the last will be controlled by the methods, but if you unmount it, control will go to the previously mounted one. The most common use case is to have one Notifier at root level (App.tsx), and also mount some more Notifiers somewhere in the modals.
- It's possible to broadcast commands to all currently mounted instances of Notifier via `Notifier.broadcast.*`. Can be useful to hide all notifications (or clear queue + hide) using `Notifier.broadcast.hideNotification()`.
- Custom handling for safe area insets (based on `react-native-safe-area-context`'s `useSafeAreaInsets` hook) in all built-in components + simple API to use the same insets in custom components. It also handles keyboard offset when notification displayed at bottom `position`. All components receives `offsets` object and `ViewWithOffsets` component as props. Related params: `ignoreSafeAreaInsets`, `ignoreKeyboard`, `additionalKeyboardOffset`, `additionalOffsets`.
- Using new `*AnimationConfig` parameters, now it's possible to run __Spring__ animations with fully-customizable config.
- Export additional TypeScript types, such as `NotifierComponentProps` which contain all base props for custom components, `AnimationFunction` for custom animations, `AnimationFunctionParam`, `Position`, `Offsets` and `ViewWithOffsetsComponent`.
- New built-in component: `SimpleToast`

# Bug Fixes
- When you mount `NotifierWrapper`/`NotifierRoot` with `omitGlobalMethodsHookup={true}`, and then set it `false`, global methods will be hooked up correctly.
- Fixed appearing animation that can slightly jump when very big notification appears.