package com.reactnativefeedbackreporter

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Point
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.os.Build
import android.util.Base64
import android.util.Log
import android.util.SparseArray
import android.view.View
import androidx.annotation.NonNull
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import com.facebook.react.modules.core.RCTNativeAppEventEmitter
import com.facebook.react.uimanager.UIManagerModule
import net.lingala.zip4j.ZipFile
import net.lingala.zip4j.model.ZipParameters
import net.lingala.zip4j.model.enums.CompressionLevel
import net.lingala.zip4j.model.enums.CompressionMethod
import java.io.*
import java.net.URL
import java.util.*
import java.util.concurrent.Callable
import kotlin.collections.ArrayList
import kotlin.collections.HashMap


class FeedbackReporterModule(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ScreenshotDetectionListener {
  val RNFeedback_Reporter = "RNFeedbackReporter"
  private val TemporaryDirectoryPath = "TemporaryDirectoryPath"
  private val screenshotDetectionDelegate = ScreenshotDetectionDelegate(reactContext, this)
  private val EVENT_NAME = "ScreenshotTaken"
  private val uploaders = SparseArray<Uploader>()
  private val cacheDir: File = reactApplicationContext.cacheDir.resolveSibling("RNFR")
  private val breadcrumbs: ArrayList<String> = ArrayList<String>()

  override fun getName(): String {
    cacheDir.mkdir()
    clearTmpDirectory()
    return "FeedbackReporter"
  }

  override fun getConstants(): Map<String, Any> {
    val constants = HashMap<String, Any>()

    constants.put(TemporaryDirectoryPath, cacheDir.absolutePath)

    return constants
  }

  @ReactMethod
  fun startListener() {
    screenshotDetectionDelegate.startScreenshotDetection()
  }

  @ReactMethod
  fun stopListener() {
    screenshotDetectionDelegate.stopScreenshotDetection()
  }

  @ReactMethod
  fun captureRef(tag: Int, options: ReadableMap, promise: Promise) {
    val x = if (options.hasKey("x")) (options.getInt("x")) else 0
    val y = if (options.hasKey("y")) (options.getInt("y")) else 0
    val tapPoint = Point(x, y)


    val context: ReactApplicationContext = getReactApplicationContext();
    try {
      var outputFile: File = createTempFile(context)
      val activity = currentActivity
      val uiManager = reactContext.getNativeModule(UIManagerModule::class.java)
      uiManager?.addUIBlock(ViewShot(
        tag, breadcrumbs, tapPoint, outputFile, reactContext, activity, promise)
      )
    } catch (ex: Throwable) {
      Log.e(RNFeedback_Reporter, "Failed to snapshot view tag $tag", ex)
      promise.reject(ViewShot.ERROR_UNABLE_TO_SNAPSHOT, "Failed to snapshot view tag $tag")
    }
  }


  override fun onScreenCaptured(path: String) {
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
    permissionsCheck(currentActivity!!, Arrays.asList(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE), Callable<Void?> {
      null
    })
  }

  private fun takeScreenshot(): String? {
    try {
      val v1: View = currentActivity?.window?.decorView!!.findViewById(android.R.id.content)
      v1.isDrawingCacheEnabled = true
      val bitmap = Bitmap.createBitmap(v1.drawingCache)
      v1.isDrawingCacheEnabled = false
      val byteArrayOutputStream = ByteArrayOutputStream()
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
      val byteArray: ByteArray = byteArrayOutputStream.toByteArray()
      return Base64.encodeToString(byteArray, Base64.DEFAULT);
    } catch (e: Throwable) {
      e.printStackTrace()
      return ""
    }
  }

  @ReactMethod
  fun writeFile(filepath: String, base64Content: String?, options: ReadableMap?, promise: Promise) {
    try {
      val bytes = Base64.decode(base64Content, Base64.DEFAULT)
      val outputStream: OutputStream = getOutputStream(filepath, false)
      outputStream.write(bytes)
      outputStream.close()
      promise.resolve(null)
    } catch (ex: Exception) {
      ex.printStackTrace()
      reject(promise, filepath, ex)
    }
  }

  @ReactMethod
  fun uploadFiles(options: ReadableMap, promise: Promise) {
    try {
      val files = options.getArray("files")
      val url = URL(options.getString("toUrl"))
      val jobId = options.getInt("jobId")
      val headers = options.getMap("headers")
      val fields = options.getMap("fields")
      val method = options.getString("method")
      val binaryStreamOnly = if (options.hasKey("binaryStreamOnly")) options.getBoolean("binaryStreamOnly") else false
      val hasBeginCallback = if (options.hasKey("hasBeginCallback")) options.getBoolean("hasBeginCallback") else false
      val hasProgressCallback = if (options.hasKey("hasProgressCallback")) options.getBoolean("hasProgressCallback") else false
      val fileList: ArrayList<ReadableMap> = ArrayList()
      val params = UploadParams()
      for (i in 0 until files!!.size()) {
        fileList.add(files.getMap(i)!!)
      }
      params.src = url
      params.files = fileList
      params.headers = headers
      params.method = method
      params.fields = fields
      params.binaryStreamOnly = binaryStreamOnly
      params.onUploadComplete = object : UploadParams.IOnUploadComplete {
        override fun onUploadComplete(res: UploadResult?) {
          if (res!!.exception == null) {
            val infoMap = Arguments.createMap()
            infoMap.putInt("jobId", jobId)
            infoMap.putInt("statusCode", res.statusCode)
            infoMap.putMap("headers", res.headers)
            infoMap.putString("body", res.body)
            promise.resolve(infoMap)
          } else {
            reject(promise, options.getString("toUrl")!!, res.exception!!)
          }
        }
      }
      if (hasBeginCallback) {
        params.onUploadBegin = object : UploadParams.IOnUploadBegin {
          override fun onUploadBegin() {
            val data = Arguments.createMap()
            data.putInt("jobId", jobId)
            sendEvent(reactApplicationContext, "UploadBegin", data)
          }
        }
      }
      if (hasProgressCallback) {
        params.onUploadProgress = object : UploadParams.IOnUploadProgress {
          override fun onUploadProgress(totalBytesExpectedToSend: Int, totalBytesSent: Int) {
            val data = Arguments.createMap()
            data.putInt("jobId", jobId)
            data.putInt("totalBytesExpectedToSend", totalBytesExpectedToSend)
            data.putInt("totalBytesSent", totalBytesSent)
            sendEvent(reactApplicationContext, "UploadProgress", data)
          }
        }
      }
      val uploader = Uploader()
      uploader.execute(params)
      this.uploaders.put(jobId, uploader)
    } catch (ex: java.lang.Exception) {
      ex.printStackTrace()
      reject(promise, options.getString("toUrl")!!, ex)
    }
  }

  @Throws(IORejectionException::class)
  private fun getOutputStream(filepath: String, append: Boolean): OutputStream {
    val uri: Uri = getFileUri(filepath, false)
    val stream: OutputStream?
    stream = try {
      reactContext.contentResolver.openOutputStream(uri, if (append) "wa" else "w")
    } catch (ex: FileNotFoundException) {
      throw IORejectionException("ENOENT", "ENOENT: " + ex.message + ", open '" + filepath + "'")
    }
    if (stream == null) {
      throw IORejectionException("ENOENT", "ENOENT: could not open an output stream for '$filepath'")
    }
    return stream
  }

  @Throws(IORejectionException::class)
  private fun getFileUri(filepath: String, isDirectoryAllowed: Boolean): Uri {
    var uri: Uri = Uri.parse(filepath)
    if (uri.getScheme() == null) {
      // No prefix, assuming that provided path is absolute path to file
      val file = File(filepath)
      if (!isDirectoryAllowed && file.isDirectory()) {
        throw IORejectionException("EISDIR", "EISDIR: illegal operation on a directory, read '$filepath'")
      }
      uri = Uri.parse("file://$filepath")
    }
    return uri
  }

  private fun reject(promise: Promise, filepath: String, ex: java.lang.Exception) {
    if (ex is FileNotFoundException) {
      rejectFileNotFound(promise, filepath)
      return
    }
    if (ex is IORejectionException) {
      val ioRejectionException = ex
      promise.reject(ioRejectionException.code, ioRejectionException.message)
      return
    }
    promise.reject(null, ex.message)
  }

  private fun rejectFileNotFound(promise: Promise, filepath: String) {
    promise.reject("ENOENT", "ENOENT: no such file or directory, open '$filepath'")
  }

  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap) {
    reactContext
      .getJSModule(RCTNativeAppEventEmitter::class.java)
      .emit(eventName, params)
  }

  private fun permissionsCheck(activity: Activity, requiredPermissions: List<String>, callback: Callable<Void?>) {
    val missingPermissions: MutableList<String> = ArrayList()
    for (permission in requiredPermissions) {
      val status: Int = ActivityCompat.checkSelfPermission(activity, permission)
      if (status != PackageManager.PERMISSION_GRANTED) {
        missingPermissions.add(permission)
      }
    }
    if (!missingPermissions.isEmpty()) {
      (activity as PermissionAwareActivity).requestPermissions(missingPermissions.toTypedArray(), 1, PermissionListener { requestCode, permissions, grantResults ->
        if (requestCode == 1) {
          for (permissionIndex in permissions.indices) {
            val permission = permissions[permissionIndex]
            val grantResult = grantResults[permissionIndex]
            if (grantResult == PackageManager.PERMISSION_DENIED) {
              return@PermissionListener true
            }
          }
          try {
            callback.call()
          } catch (e: java.lang.Exception) {
            e.printStackTrace()
          }
        }
        true
      })
      return
    }

    try {
      callback.call()
    } catch (e: java.lang.Exception) {
      e.printStackTrace()
    }
  }

  @ReactMethod
  fun getThumbnail(filePath: String, promise: Promise) {
    var filePath = filePath
    filePath = filePath.replace("file://", "")
    val retriever = MediaMetadataRetriever()
    retriever.setDataSource(filePath)
    val image = retriever.getFrameAtTime(1000000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC)
    val fullPath: String = this.getReactApplicationContext().getCacheDir().getAbsolutePath()
//    val fullPath: String = Environment.getExternalStorageDirectory().getAbsolutePath().toString() + "/thumb"
    try {
      val dir = File(fullPath)
      if (!dir.exists()) {
        dir.mkdirs()
      }
      var fOut: OutputStream? = null
      // String fileName = "thumb-" + UUID.randomUUID().toString() + ".jpeg";
      val fileName = "thumb-" + UUID.randomUUID().toString() + ".jpeg"
      val file = File(fullPath, fileName)
      file.createNewFile()
      fOut = FileOutputStream(file)

      // 100 means no compression, the lower you go, the stronger the compression
      image.compress(Bitmap.CompressFormat.JPEG, 100, fOut)
      fOut!!.flush()
      fOut.close()

      // MediaStore.Images.Media.insertImage(reactContext.getContentResolver(), file.getAbsolutePath(), file.getName(), file.getName());
      val map = Arguments.createMap()
      map.putString("path", "file://$fullPath/$fileName")
      map.putDouble("width", image.width.toDouble())
      map.putDouble("height", image.height.toDouble())
      promise.resolve(map)
    } catch (e: java.lang.Exception) {
      Log.e("E_RNThumnail_ERROR", e.message)
      promise.reject("E_RNThumnail_ERROR", e)
    }
  }

  @ReactMethod
  fun clearTmpDirectory() {
    val children = cacheDir.list()
    for (i in children.indices) {
      val childPath = cacheDir.absolutePath.plus("/").plus(children[i])
      File(childPath).delete()
    }
  }

  @ReactMethod
  fun zipBreadcrumbs(destinationPath: String, promise: Promise) {
    try {
      val parameters = ZipParameters()
      parameters.compressionMethod = CompressionMethod.DEFLATE
      parameters.compressionLevel = CompressionLevel.NORMAL
      processZip(breadcrumbs, destinationPath, parameters, promise)
    } catch (ex: java.lang.Exception) {
      promise.reject(null, ex.message)
      return
    }
  }

  @ReactMethod
  fun setValue(key: String, value: String, promise: Promise) {
    if (Build.VERSION.SDK_INT >= 23) {
      val storage = RNFRStorage(reactContext);
      val result = storage.setValue(key, value);
      val code = result.getInt("code");
      val error = result.getString("error");

      if (code == 200) {
        promise.resolve(result);
      } else {
        promise.reject(null, error);
      }
    } else {
      promise.reject(null, "unsupported function below SDK 23");
    }
  }

  @ReactMethod
  fun getValue(key: String, promise: Promise) {
    if (Build.VERSION.SDK_INT >= 23) {
      val storage = RNFRStorage(reactContext);
      val result = storage.getValue(key);
      val code = result.getInt("code");
      val error = result.getString("error");

      if (code == 200) {
        promise.resolve(result);
      } else {
        promise.reject(null, error);
      }
    } else {
      promise.reject(null, "unsupported function below SDK 23");
    }
  }


  private fun processZip(entries: ArrayList<String>, destFile: String, parameters: ZipParameters, promise: Promise) {
    if (entries.size == 0) {
      promise.reject("400", "nothing to zip")
    }
    Thread(Runnable {
      try {
        val zipFile = ZipFile(destFile)
        val files: WritableArray = Arguments.createArray()

        for (i in 0 until entries.size) {
          val f = File(entries[i])
          if (f.exists()) {
            val newFile = File(cacheDir.absolutePath.plus("/").plus((i + 1).toString()).plus(".png"))
            f.renameTo(newFile)
            files.pushString("file://${newFile.absolutePath}")
            zipFile.addFile(newFile, parameters)
          } else {
            promise.reject(null, "File or folder does not exist")
          }
        }
        val result = Arguments.createMap()
        result.putString("path", destFile)
        result.putArray("content", files)
        promise.resolve(result)
      } catch (ex: java.lang.Exception) {
        promise.reject(null, ex.message)
        return@Runnable
      }
    }).start()
  }

  private val TEMP_FILE_PREFIX = "ReactNative-snapshot-image"

  @NonNull
  @Throws(IOException::class)
  private fun createTempFile(@NonNull context: Context): File {
    val suffix = ".png"
    return File.createTempFile(TEMP_FILE_PREFIX, suffix, cacheDir)
  }
}
