---
id: link
title: Manual linking
sidebar_label: Manual linking
---


## iOS

#### Project linking
1. Open your project `.xcodeproj` on xcode.

2. Right click on the Libraries folder and select `Add files to "yourProjectName"`.

3. Add `FeedbackReporter.xcodeproj` (located at `node_modules/react-native-feedback-reporter/ios`) to your project Libraries.

3. Go to `Build Phases -> Link Binary with Libraries` and add:  `libFeedbackReporter.a`.

#### Using 'Pods'
1. Enter into iOS Folder `cd ios/` (on your project's root folder).

2. Add this line to your `Podfile` just below the last pod (if you don't have one, you can create it by running `pod init`):

```diff
+ pod 'FeedbackReporter', :path => '../node_modules/react-native-feedback-reporter'
```

3. Run `pod install`

## Android
1. Add project to `android/settings.gradle`:
```diff
rootProject.name = 'MyApp'

include ':app'

+ include ':react-native-feedback-reporter'
+ project(':react-native-feedback-reporter').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-feedback-reporter/android')
  ```

2. In `android/app/build.gradle` add to dependencies:
```diff
dependencies {
  ...
+ implementation project(':react-native-feedback-reporter')
}
  ```

3. Then, in `android/app/src/main/java/your/package/MainApplication.java`:
```diff
package com.myapp;

+ import com.reactnativefeedbackreporter.FeedbackReporterPackage;

...

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
+       new FeedbackReporterPackage()
    );
}
```
