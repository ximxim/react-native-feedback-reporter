package com.reactnativefeedbackreporter

import com.facebook.react.bridge.WritableMap

class UploadResult {
  var statusCode = 0
  var headers: WritableMap? = null
  var exception: Exception? = null
  var body: String? = null
}
