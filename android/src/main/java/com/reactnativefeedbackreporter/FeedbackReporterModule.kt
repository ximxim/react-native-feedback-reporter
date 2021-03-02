package com.reactnativefeedbackreporter

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class FeedbackReporterModule(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ScreenshotDetectionListener {
  private val screenshotDetectionDelegate = ScreenshotDetectionDelegate(reactContext, this)
  private val EVENT_NAME = "ScreenshotTaken"

  override fun getName(): String {
    return "FeedbackReporter"
  }

  @ReactMethod
  fun startListener() {
    screenshotDetectionDelegate.startScreenshotDetection()
  }

  @ReactMethod
  fun stopListener() {
    screenshotDetectionDelegate.stopScreenshotDetection()
  }

  override fun onScreenCaptured(path: String) {
    val map = Arguments.createMap()
    map.putInt("code", 200)
    map.putString("uri", "something")
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(EVENT_NAME, map)
  }

  override fun onScreenCapturedWithDeniedPermission() {
    // Todo: send user notification.
  }
}
