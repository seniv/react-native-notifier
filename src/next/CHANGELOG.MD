# BREAKING CHANGES
- Animations will work correctly only with New Architecture (Fabric renderer) enabled.
- `Component` gets unmounted while notification is not visible.
- `containerStyle` now receives simple style object and can't be used to change animation. Use `animationFunction` instead.
- now `react-native-safe-area-context` library is used in built-in Components, if you're using them, make sure you have `react-native-safe-area-context` installed.
- "Hide Timer" (`duration` param) now starts after the "appearing" animation is finished, instead of starting when "appearing" animation is just started. If you had long appearing animation, you can reduce the `duration` param (3 seconds by default)
- `swipeEnabled` parameter was removed. To disable swipes, set `swipeDirection: 'none'`

# Features
- Introduced new params: `enterFrom`, `exitTo`, and `swipeDirection`. These params change the direction of the entering/exiting animation and allow you to swipe notifications not only to the top but also left, right, and down.
- New `animationFunction` parameter that allows to create custom animations.
- Thanks to New Architecture, now component dimensions can be calculated synchronously, which makes overall animations way smoother and reduces number of glitches.
- You can mount multiple instances of `NotifierWrapper`/`NotifierRoot`, and still can control them using global `Notifier.*` methods. Component that was mounted the last will be controlled by the methods, but if you unmount it, control will go to the previously mounted one. The most common use case is to have one Notifier at root level (App.tsx), and also mount some more Notifiers somewhere in the modals.
- It's possible to broadcast commands to all currently mounted instances of Notifier via `Notifier.broadcast.*`. Can be useful to hide all notifications (or clear queue + hide) using `Notifier.broadcast.hideNotification()`.

# Bug Fixes
- When you mount `NotifierWrapper`/`NotifierRoot` with `omitGlobalMethodsHookup={true}`, and then set it `false`, global methods will be hooked up correctly.
- Fixed appearing animation that can slightly jump when very big notification appears.