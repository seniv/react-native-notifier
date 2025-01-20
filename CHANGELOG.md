# Changelog

## v3.0.0-rc

### Breaking Changes
- The library now internally uses `react-native-safe-area-context`. Make sure you have `react-native-safe-area-context` installed, and that `NotifierRoot/Wrapper` is wrapped by `SafeAreaProvider`.
- `Component` is unmounted while the notification is not visible.
- `containerStyle` now only accepts a simple style object and cannot be used to change animation. Use `animationFunction` instead.
- The "Hide Timer" (`duration` param) now starts after the “appearing” animation finishes, rather than when it starts. If you use a long “appearing” animation, you may want to reduce the `duration` (3 seconds by default).
- The `swipeEnabled` parameter has been removed. To disable swipes, set `swipeDirection: 'none'`.
- The parameters `animationDuration`, `showAnimationDuration`, `hideAnimationDuration`, `swipeAnimationDuration`, `easing`, `showEasing`, `hideEasing`, `swipeEasing` have been removed. Use `showAnimationConfig`, `hideAnimationConfig`, `swipeOutAnimationConfig`, `resetSwipeAnimationConfig` instead.
- The default `showAnimationConfig` is now set to a spring animation when `Component != NotifierComponents.Alert`.

### Features
- Support for different positions. A notification can be placed at `top`, `bottom`, or any edge of the screen using the `position` parameter.
- Introduced new params: `enterFrom`, `exitTo`, and `swipeDirection`. These control the direction of entering/exiting animations and allow swiping not only to the top but also left, right, and down.
- New `animationFunction` parameter for creating custom animations.
- Each notification now has its own ID. The default ID depends on the `idStrategy` parameter, and you can also assign one manually. If a notification with the same ID is already shown, the result of `showNotification` depends on `duplicateBehavior`.
- New `duplicateBehavior` parameter describing how the Notifier should behave if a notification with the same ID is already shown.
- New `idStrategy` parameter, which defines how a default ID is generated if none is provided.
- New `updateNotification` method that updates a _currently visible_ notification.
- New `shakeNotification` method that shakes a _currently visible_ notification to attract the user's attention and optionally resets the `duration` timer.
- New `isNotificationVisible` method: Returns a boolean indicating if any notification is currently visible.
- New methods: `updateById`, `shakeById`, `isVisibleById`, and `hideById`. These methods only affect a notification if the provided ID matches the one of the currently visible notification.
- Calling `showNotification` returns `update`, `hide`, `shake`, and `isVisible` functions for manipulating the notification.
- You can mount multiple instances of `NotifierWrapper`/`NotifierRoot` and still control them using global `Notifier.*` methods. The most recently mounted instance is controlled first; if it unmounts, control reverts to the previously mounted instance.
- It's possible to broadcast commands to all mounted instances of Notifier via `Notifier.broadcast.*`. This can be used, for example, to hide all notifications or clear the queue and hide them using `Notifier.broadcast.hideNotification()`.
- Custom handling for safe area insets (based on `react-native-safe-area-context`'s `useSafeAreaInsets` hook) in all built-in components, plus a simple API for using the same insets in custom components. It also handles keyboard offset when a notification is displayed at a bottom `position`. All components receive an `offsets` object and a `ViewWithOffsets` component as props. Related parameters: `ignoreSafeAreaInsets`, `ignoreKeyboard`, `ignoreKeyboardHeight`, `additionalKeyboardOffset`, `additionalOffsets`.
- Using new `*AnimationConfig` parameters, it is now possible to run **Spring** animations with fully customizable configurations.
- Additional TypeScript types have been exported, such as `NotifierComponentProps` (for base props in custom components), `AnimationFunction`, `AnimationFunctionParams`, `Position`, `Offsets`, `ViewWithOffsetsComponent`, `Direction`, `DuplicateBehavior`, and `SwipeDirection`.
- New built-in components: `Toast` and `SimpleToast`.
- All components receive a `hide` function and an `animationFunctionParams` object as props.

### Changed
- **Alert component:** Renamed `alertType` prop to `type` for consistency with other components. The `alertType` prop remains available but will be deprecated, so please migrate to `type`.
- **Notification component:** Changed default `borderRadius` from `5` to `8` and "description" `fontSize` from `14` to `15`.
- **Notification component:** Introduced a `type` prop. When set to anything other than `'classic'`, an icon and left border will be displayed.

### Bug Fixes
- When you mount `NotifierWrapper`/`NotifierRoot` with `omitGlobalMethodsHookup={true}` and then switch it to `false`, global methods now hook up correctly.
- Fixed a jump in the appearing animation when very large notifications appear.

### Known Issues
- When `useRNScreensOverlay` is `true`, the bottom `position` will not work. If you need a bottom position with `useRNScreensOverlay`, you can adjust the container style using the `rnScreensOverlayViewStyle` parameter, for example:

```typescript
rnScreensOverlayViewStyle={{
  width: '100%',
  position: 'absolute',
  bottom: 0,
}}
```
- When `useRNScreensOverlay` is `true`, `SafeAreaView` might not work correctly. Use `ViewWithOffsets` component that is coming though props into all **Custom Components**.
