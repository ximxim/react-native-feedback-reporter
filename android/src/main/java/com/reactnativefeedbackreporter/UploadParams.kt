package com.reactnativefeedbackreporter

import com.facebook.react.bridge.ReadableMap
import java.net.URL
import java.util.*

class UploadParams {
  interface IOnUploadComplete {
    fun onUploadComplete(res: UploadResult?)
  }

  interface IOnUploadProgress {
    fun onUploadProgress(totalBytesExpectedToSend: Int, totalBytesSent: Int)
  }

  interface IOnUploadBegin {
    fun onUploadBegin()
  }

  var src: URL? = null
  var files: ArrayList<ReadableMap>? = null
  var binaryStreamOnly = false
  var name: String? = null
  var headers: ReadableMap? = null
  var fields: ReadableMap? = null
  var method: String? = null
  var onUploadComplete: IOnUploadComplete? = null
  var onUploadProgress: IOnUploadProgress? = null
  var onUploadBegin: IOnUploadBegin? = null
}
