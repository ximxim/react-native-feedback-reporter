package com.reactnativefeedbackreporter

import android.app.Activity
import android.database.ContentObserver
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.Base64
import android.view.View
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import java.io.ByteArrayOutputStream


class FeedbackReporterModule(reContext: ReactApplicationContext) : ReactContextBaseJavaModule(reContext) {
  private val EVENT_NAME = "ScreenshotTaken"
  private val TAG = "screenshotTaken"
  private val NAVIGATION = "navigationBarBackground"
  private val KEYWORDS = arrayOf(
    "screenshot", "screen_shot", "screen-shot", "screen shot",
    "screencapture", "screen_capture", "screen-capture", "screen capture",
    "screencap", "screen_cap", "screen-cap", "screen cap"
  )

  private var ma: Activity? = null
  private var reactContext: ReactContext = reContext
  private var contentObserver: ContentObserver? = null

//  fun FeedbackReporterModule(reContext: ReactApplicationContext?) {}

  override fun getName(): String {
    return "FeedbackReporter"
  }

  fun initScreenShotShareSDK(activity: Activity?) {
    ma = activity
  }


  @ReactMethod
  fun startListener() {
    contentObserver = object : ContentObserver(Handler(Looper.getMainLooper())) {
      override fun onChange(selfChange: Boolean, uri: Uri) {
        super.onChange(selfChange, uri)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          queryRelativeDataColumn(uri)
        } else {
          queryDataColumn(uri)
        }
      }
    }
    reactContext.contentResolver.registerContentObserver(
      MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
      true,
      contentObserver as ContentObserver
    )
  }

  @ReactMethod
  fun stopListener() {
    reactContext!!.contentResolver.unregisterContentObserver(contentObserver!!)
  }

  private fun queryDataColumn(uri: Uri) {
    val projection = arrayOf(
      MediaStore.Images.Media.DATA
    )
    reactContext.contentResolver.query(
      uri,
      projection,
      null,
      null,
      null
    )?.use { cursor ->
      val dataColumn = cursor.getColumnIndex(MediaStore.Images.Media.DATA)
      while (cursor.moveToNext()) {
        val path = cursor.getString(dataColumn)
        if (path.contains("screenshot", true)) {
          // do something
        }
      }
    }
  }

  private fun queryRelativeDataColumn(uri: Uri) {
    val projection = arrayOf(
      MediaStore.Images.Media.DISPLAY_NAME,
      MediaStore.Images.Media.RELATIVE_PATH
    )
    reactContext.contentResolver.query(
      uri,
      projection,
      null,
      null,
      null
    )?.use { cursor ->
      val relativePathColumn =
        cursor.getColumnIndex(MediaStore.Images.Media.RELATIVE_PATH)
      val displayNameColumn =
        cursor.getColumnIndex(MediaStore.Images.Media.DISPLAY_NAME)

      try {
        while (cursor.moveToNext()) {
          val name = cursor.getString(displayNameColumn)
          val relativePath = cursor.getString(relativePathColumn)
          if (name.contains("screenshot", true) or
            relativePath.contains("screenshot", true)
          ) {
            val activity = currentActivity ?: return

            val rootView: View = activity.getWindow().getDecorView()
            val bm = getScreenShot(rootView)

            val byteArrayOutputStream = ByteArrayOutputStream()
            bm.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
            val byteArray = byteArrayOutputStream.toByteArray()
            val encoded: String = Base64.encodeToString(byteArray, Base64.DEFAULT)

            val map = Arguments.createMap()
            map.putInt("code", 200)
            map.putString("uri", encoded)
            sendEvent(reactContext, EVENT_NAME, map)
          }
        }
      } catch (e: Exception) {
        val map = Arguments.createMap()
        map.putInt("code", 500)
        sendEvent(reactContext, EVENT_NAME, map)
        e.printStackTrace();
      }
    }
  }

  private fun getScreenShot(view: View): Bitmap {
    val width = view.width;
    val height = view.height;
    val returnedBitmap = Bitmap.createBitmap(300, 500, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(returnedBitmap)
    val bgDrawable = view.background
    if (bgDrawable != null) bgDrawable.draw(canvas)
    else canvas.drawColor(Color.WHITE)
    view.draw(canvas)
    return returnedBitmap
  }
  fun sendEvent(reactContext: ReactContext?, eventName: String?, params: WritableMap?) {
    reactContext!!.getJSModule(RCTDeviceEventEmitter::class.java).emit(eventName!!, params)
  }
}
