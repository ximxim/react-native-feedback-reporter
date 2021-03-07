package com.reactnativefeedbackreporter

import android.os.AsyncTask
import android.webkit.MimeTypeMap
import com.facebook.react.bridge.*
import java.io.*
import java.net.HttpURLConnection
import java.nio.channels.Channels
import java.util.concurrent.atomic.AtomicBoolean


class Uploader : AsyncTask<UploadParams?, IntArray?, UploadResult?>() {
  private var mParams: UploadParams? = null
  private var res: UploadResult? = null
  private val mAbort = AtomicBoolean(false)

  @Throws(Exception::class)
  private fun upload(params: UploadParams?, result: UploadResult?) {
    var connection: HttpURLConnection? = null
    var request: DataOutputStream? = null
    val crlf = "\r\n"
    val twoHyphens = "--"
    val boundary = "*****"
    val tail = crlf + twoHyphens + boundary + twoHyphens + crlf
    var metaData = ""
    var stringData = ""
    val fileHeader: Array<String?>
    val statusCode: Int
    var byteSentTotal: Int
    var fileCount = 0
    var totalFileLength: Long = 0
    var responseStream: BufferedInputStream? = null
    var responseStreamReader: BufferedReader? = null
    var name: String
    var filename: String
    var filetype: String
    try {
      val files: Array<Any> = params?.files!!.toArray()
      val binaryStreamOnly: Boolean = params.binaryStreamOnly
      connection = params?.src!!.openConnection() as HttpURLConnection?
      connection!!.doOutput = true
      val headerIterator: ReadableMapKeySetIterator = params.headers!!.keySetIterator()
      connection.requestMethod = params.method
      if (!binaryStreamOnly) {
        connection.setRequestProperty("Content-Type", "multipart/form-data;boundary=$boundary")
      }
      while (headerIterator.hasNextKey()) {
        val key = headerIterator.nextKey()
        val value: String = params.headers!!.getString(key)!!
        connection.setRequestProperty(key, value)
      }
      if (params.fields !== null) {
        val fieldsIterator: ReadableMapKeySetIterator = params.fields!!.keySetIterator()
        while (fieldsIterator.hasNextKey()) {
          val key = fieldsIterator.nextKey()
          val value: String = params.fields!!.getString(key)!!
          metaData += twoHyphens + boundary + crlf + "Content-Disposition: form-data; name=\"" + key + "\"" + crlf + crlf + value + crlf
        }
      }
      stringData += metaData
      fileHeader = arrayOfNulls(files.size)
      for (map in params.files!!) {
        try {
          name = map.getString("name")!!
          filename = map.getString("filename")!!
          filetype = map.getString("filetype")!!
        } catch (e: NoSuchKeyException) {
          name = map.getString("name")!!
          filename = map.getString("filename")!!
          filetype = getMimeType(map.getString("filepath"))
        }
        val file = File(map.getString("filepath"))
        val fileLength = file.length()
        totalFileLength += fileLength
        if (!binaryStreamOnly) {
          val fileHeaderType = twoHyphens + boundary + crlf +
            "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"" + crlf +
            "Content-Type: " + filetype + crlf
          if (files.size - 1 == fileCount) {
            totalFileLength += tail.length.toLong()
          }
          val fileLengthHeader = "Content-length: $fileLength$crlf"
          fileHeader[fileCount] = fileHeaderType + fileLengthHeader + crlf
          stringData += fileHeaderType + fileLengthHeader + crlf
        }
        fileCount++
      }
      fileCount = 0
      if (mParams!!.onUploadBegin != null) {
        mParams!!.onUploadBegin!!.onUploadBegin()
      }
      if (!binaryStreamOnly) {
        var requestLength = totalFileLength
        requestLength += (stringData.length + files.size * crlf.length).toLong()
        connection.setRequestProperty("Content-length", "" + requestLength.toInt())
        connection.setFixedLengthStreamingMode(requestLength.toInt())
      }
      connection.connect()
      request = DataOutputStream(connection.outputStream)
      val requestChannel = Channels.newChannel(request)
      if (!binaryStreamOnly) {
        request.writeBytes(metaData)
      }
      byteSentTotal = 0
      for (map in params.files!!) {
        if (!binaryStreamOnly) {
          request.writeBytes(fileHeader[fileCount])
        }
        val file = File(map.getString("filepath"))
        val fileLength = file.length()
        val bufferSize = Math.ceil((fileLength / 100f).toDouble()).toLong()
        var bytesRead: Long = 0
        val fileStream = FileInputStream(file)
        val fileChannel = fileStream.channel
        while (bytesRead < fileLength) {
          val transferredBytes = fileChannel.transferTo(bytesRead, bufferSize, requestChannel)
          bytesRead += transferredBytes
          if (mParams!!.onUploadProgress != null) {
            byteSentTotal += transferredBytes.toInt()
            mParams!!.onUploadProgress!!.onUploadProgress(totalFileLength.toInt(), byteSentTotal)
          }
        }
        if (!binaryStreamOnly) {
          request.writeBytes(crlf)
        }
        fileCount++
        fileStream.close()
      }
      if (!binaryStreamOnly) {
        request.writeBytes(tail)
      }
      request.flush()
      request.close()
      responseStream = BufferedInputStream(connection.inputStream)
      responseStreamReader = BufferedReader(InputStreamReader(responseStream))
      val responseHeaders = Arguments.createMap()
      val map = connection.headerFields
      for ((key, value) in map) {
        val count = 0
        responseHeaders.putString(key, value[count])
      }
      val stringBuilder = StringBuilder()
      var line: String? = ""
      while (responseStreamReader.readLine().also { line = it } != null) {
        stringBuilder.append(line).append("\n")
      }
      val response = stringBuilder.toString()
      statusCode = connection.responseCode
      res!!.headers = responseHeaders
      res!!.body = response
      res!!.statusCode = statusCode
    } catch (ex: java.lang.Exception)  {
      ex.printStackTrace()
    } finally {
      connection?.disconnect()
      request?.close()
      responseStream?.close()
      responseStreamReader?.close()
    }
  }

  protected fun getMimeType(path: String?): String {
    var type: String? = null
    val extension = MimeTypeMap.getFileExtensionFromUrl(path)
    if (extension != null) {
      type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.toLowerCase())
    }
    if (type == null) {
      type = "*/*"
    }
    return type
  }

  protected fun stop() {
    mAbort.set(true)
  }

  override fun doInBackground(vararg uploadParams: UploadParams?): UploadResult? {
    mParams = uploadParams[0]
    res = UploadResult()
    Thread {
      try {
        upload(mParams, res)
        mParams!!.onUploadComplete!!.onUploadComplete(res)
      } catch (e: Exception) {
        res!!.exception = e
        mParams!!.onUploadComplete!!.onUploadComplete(res)
      }
    }.start()
    return res
  }
}
