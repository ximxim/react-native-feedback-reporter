package com.reactnativefeedbackreporter

import android.R
import android.app.Activity
import android.graphics.*
import android.graphics.Bitmap.CompressFormat
import android.net.Uri
import android.os.Build
import android.util.Log
import android.view.TextureView
import android.view.View
import android.view.View.VISIBLE
import android.view.ViewGroup
import androidx.annotation.NonNull
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.NativeViewHierarchyManager
import com.facebook.react.uimanager.UIBlock
import java.io.*
import java.nio.ByteBuffer
import java.util.*
import kotlin.collections.ArrayList

class ViewShot: UIBlock {
  private val TAG = ViewShot::class.java.simpleName
  private var tapPoint: Point = Point()
  private val PREALLOCATE_SIZE = 64 * 1024
  private val ARGB_SIZE = 4
  private var outputBuffer = ByteArray(PREALLOCATE_SIZE)
  private var tag = 0
  private var output: File? = null
  private var promise: Promise? = null
  private var reactContext: ReactApplicationContext? = null
  private var currentActivity: Activity? = null
  private var breadcrumbs: ArrayList<String> = ArrayList<String>()


  companion object {
    val ERROR_UNABLE_TO_SNAPSHOT = "E_UNABLE_TO_SNAPSHOT"
  }

  constructor(
    tag: Int,
    breadcrumbs: ArrayList<String>,
    tapPoint: Point,
    output: File,
    reactContext: ReactApplicationContext,
    currentActivity: Activity?,
    promise: Promise) {
    this.tag = tag
    this.breadcrumbs = breadcrumbs
    this.tapPoint = tapPoint
    this.output = output
    this.reactContext = reactContext
    this.currentActivity = currentActivity
    this.promise = promise
  }

  @RequiresApi(Build.VERSION_CODES.O)
  override fun execute(nativeViewHierarchyManager: NativeViewHierarchyManager?) {
    val view: View?

    view = if (tag == -1) {
      currentActivity?.getWindow()?.decorView?.findViewById(R.id.content)
    } else {
      nativeViewHierarchyManager!!.resolveView(tag)
    }

    if (view == null) {
      Log.e(TAG, "No view found with reactTag: " + tag, AssertionError())
      promise?.reject(ERROR_UNABLE_TO_SNAPSHOT, "No view found with reactTag: " + tag)
      return
    }

    try {
      val stream = ReusableByteArrayOutputStream(outputBuffer)
      stream.setSize(proposeSize(view))
      outputBuffer = stream.innerBuffer()
      saveToTempFileOnDevice(view)
    } catch (ex: Throwable) {
      Log.e(TAG, "Failed to capture view snapshot", ex)
      promise?.reject(ERROR_UNABLE_TO_SNAPSHOT, "Failed to capture view snapshot")
    }
  }

  @RequiresApi(Build.VERSION_CODES.O)
  @Throws(IOException::class)
  private fun saveToTempFileOnDevice(view: View) {
    val fos = FileOutputStream(output)
    captureView(view, fos)
    breadcrumbs.add(Uri.fromFile(output).path.toString())
    promise?.resolve(Uri.fromFile(output).toString())
  }

  @RequiresApi(Build.VERSION_CODES.O)
  @Throws(IOException::class)
  private fun captureView(view: View, os: OutputStream): Point? {
    return try {
      captureViewImpl(view, os)
    } finally {
      os.close()
    }
  }

  @RequiresApi(Build.VERSION_CODES.O)
  private fun captureViewImpl(view: View, os: OutputStream): Point? {
    val w = view.width
    var h = view.height
    if (w <= 0 || h <= 0) {
      throw RuntimeException("Impossible to snapshot the view: view is invalid")
    }

    val resolution = Point(w, h)
    var bitmap: Bitmap = getBitmapForScreenshot(w, h)
    val paint = Paint()
    paint.isAntiAlias = true
    paint.isFilterBitmap = true
    paint.isDither = true

    val c = Canvas(bitmap)
    view.draw(c)

    //after view is drawn, go through children
    val childrenList: List<View> = getAllChildren(view)
    for (child in childrenList) {
      // skip any child that we don't know how to process
      if (child !is TextureView) continue

      // skip all invisible to user child views
      if (child.getVisibility() != VISIBLE) continue
      val tvChild = child
      tvChild.isOpaque = false // <-- switch off background fill

      val childBitmapBuffer = tvChild.getBitmap(getExactBitmapForScreenshot(child.getWidth(), child.getHeight()))
      val countCanvasSave: Int = c.save()
      applyTransformations(c, view, child)

      c.drawBitmap(childBitmapBuffer, 0.0f, 0.0f, paint)
      c.restoreToCount(countCanvasSave)
      recycleBitmap(childBitmapBuffer)
    }

    val circleRadius = 20f
    val paintCircle = Paint().apply {
      color = Color.argb(0.5f, 0.69f, 0.69f, 0.69f)
      style = Paint.Style.FILL
      setShadowLayer(5f, 0f, 0f, Color.argb(0.5f, 0.69f, 0.69f, 0.69f))
    }
    val x = tapPoint.x.toFloat()
    val y = tapPoint.y.toFloat()
    c.drawCircle(x , y, circleRadius * 2, paintCircle)

    bitmap.compress(CompressFormat.PNG, 100, os)
    recycleBitmap(bitmap)
    return resolution // return image width and height
  }

  private val guardBitmaps = Any()
  private val weakBitmaps = Collections.newSetFromMap(WeakHashMap<Bitmap, Boolean>())

  private fun getBitmapForScreenshot(width: Int, height: Int): Bitmap {
    synchronized(guardBitmaps) {
      for (bmp in weakBitmaps) {
        if (bmp.width == width && bmp.height == height) {
          weakBitmaps.remove(bmp)
          bmp.eraseColor(Color.TRANSPARENT)
          return bmp
        }
      }
    }
    return Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
  }

  private fun getAllChildren(v: View): List<View> {
    if (v !is ViewGroup) {
      val viewArrayList: ArrayList<View> = ArrayList()
      viewArrayList.add(v)
      return viewArrayList
    }
    val result: ArrayList<View> = ArrayList()
    val viewGroup = v
    for (i in 0 until viewGroup.childCount) {
      val child = viewGroup.getChildAt(i)

      //Do not add any parents, just add child elements
      result.addAll(getAllChildren(child))
    }
    return result
  }

  private fun getExactBitmapForScreenshot(width: Int, height: Int): Bitmap {
    synchronized(guardBitmaps) {
      for (bmp in weakBitmaps) {
        if (bmp.width == width && bmp.height == height) {
          weakBitmaps.remove(bmp)
          bmp.eraseColor(Color.TRANSPARENT)
          return bmp
        }
      }
    }
    return Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
  }

  private fun applyTransformations(c: Canvas, root: View, child: View): Matrix {
    val transform = Matrix()
    val ms: LinkedList<View?> = LinkedList()

    // find all parents of the child view
    var iterator = child
    do {
      ms.add(iterator)
      iterator = iterator.parent as View
    } while (iterator !== root)

    // apply transformations from parent --> child order
    Collections.reverse(ms)
    for (v in ms) {
      c.save()

      // apply each view transformations, so each child will be affected by them
      val dx = v!!.left + (if (v !== child) v.paddingLeft else 0) + v.translationX
      val dy = v.top + (if (v !== child) v.paddingTop else 0) + v.translationY
      c.translate(dx, dy)
      c.rotate(v.rotation, v.pivotX, v.pivotY)
      c.scale(v.scaleX, v.scaleY)

      // compute the matrix just for any future use
      transform.postTranslate(dx, dy)
      transform.postRotate(v.rotation, v.pivotX, v.pivotY)
      transform.postScale(v.scaleX, v.scaleY)
    }
    return transform
  }

  private fun recycleBitmap(bitmap: Bitmap){
    synchronized(guardBitmaps) { weakBitmaps.add(bitmap) }
  }

  private fun proposeSize(view: View): Int {
    val w = view.width
    val h = view.height
    return Math.min(w * h * ARGB_SIZE, 32)
  }

  class ReusableByteArrayOutputStream(@NonNull buffer: ByteArray) : ByteArrayOutputStream(0) {
    fun innerBuffer(): ByteArray {
      return this.buf
    }

    @NonNull
    fun asBuffer(size: Int): ByteBuffer {
      if (this.buf.size < size) {
        grow(size)
      }
      return ByteBuffer.wrap(this.buf)
    }

    fun setSize(size: Int) {
      this.count = size
    }

    protected fun grow(minCapacity: Int) {
      val oldCapacity: Int = buf.size
      var newCapacity = oldCapacity shl 1
      if (newCapacity - minCapacity < 0) newCapacity = minCapacity
      if (newCapacity - MAX_ARRAY_SIZE > 0) newCapacity = hugeCapacity(minCapacity)
      buf = Arrays.copyOf(buf, newCapacity)
    }

    companion object {
      private const val MAX_ARRAY_SIZE = Int.MAX_VALUE - 8
      protected fun hugeCapacity(minCapacity: Int): Int {
        if (minCapacity < 0) throw OutOfMemoryError()
        return if (minCapacity > MAX_ARRAY_SIZE) Int.MAX_VALUE else MAX_ARRAY_SIZE
      }
    }

    init {
      this.buf = buffer
    }
  }
}
