package com.reactnativefeedbackreporter

import android.graphics.Bitmap
import android.util.Base64
import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.ByteArrayOutputStream


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
//    val view: View = currentActivity?.getWindow()?.getDecorView()!!.findViewById(android.R.id.content)

    val encoded = takeScreenshot()

    val map = Arguments.createMap()
    var code = 500
    if (!encoded.isNullOrEmpty()) {
      code = 200
    }
    map.putInt("code", code)
    map.putString("uri", encoded)

    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(EVENT_NAME, map)
  }

  override fun onScreenCapturedWithDeniedPermission() {
    // Todo: send user notification.
  }

  private fun takeScreenshot(): String? {
    try {
      val v1: View = currentActivity?.getWindow()?.getDecorView()!!.findViewById(android.R.id.content)
      v1.isDrawingCacheEnabled = true
      val bitmap = Bitmap.createBitmap(v1.drawingCache)
      v1.isDrawingCacheEnabled = false
      val byteArrayOutputStream = ByteArrayOutputStream()
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
      val byteArray: ByteArray = byteArrayOutputStream.toByteArray()
      return Base64.encodeToString(byteArray, Base64.DEFAULT);
    } catch (e: Throwable) {
      // Several error may come out with file handling or DOM
      e.printStackTrace()
      return ""
    }
  }
}
