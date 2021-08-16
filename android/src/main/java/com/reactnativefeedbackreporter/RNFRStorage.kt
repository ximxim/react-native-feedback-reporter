package com.reactnativefeedbackreporter

import android.content.SharedPreferences
import android.os.Build
import android.util.Log
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import java.io.FileNotFoundException
import java.io.IOException
import java.security.GeneralSecurityException


class RNFRStorage {
  private val TAG = RNFRStorage::class.java.simpleName
  private var reactContext: ReactApplicationContext? = null

  constructor(reactContext: ReactApplicationContext) {
    this.reactContext = reactContext
  }

  public fun setValue(key: String, value: String): WritableMap {
    val result = Arguments.createMap()

    try {
      getSecureSharedPreferences().edit().putString(key, value).commit()
      result.putInt("code", 200);
      result.putString("message", "stored ciphertext in app storage");
      return result;
    } catch (e: Exception) {
      e.printStackTrace()
      Log.e(TAG, "Exception: " + e.message)
      result.putInt("code", 9);
      result.putString("error", e.message);
      return result;
    }
  }

  public fun getValue(key: String): WritableMap {
    val result = Arguments.createMap()

    try {
      val value = getSecureSharedPreferences().getString(key, null)
      if (value == null) {
        //throw FileNotFoundException to keep match old behaviour when a value is missing
        throw FileNotFoundException(key + " has not been set")
      } else {
        result.putInt("code", 200);
        result.putString("value", value);
        return result;
      }
    } catch (fnfe: FileNotFoundException) {
      fnfe.printStackTrace()
      result.putInt("code", 404);
      result.putString("error", fnfe.message);
      return result;
    } catch (e: java.lang.Exception) {
      e.printStackTrace()
      Log.e(TAG, "Exception: " + e.message)
      result.putInt("code", 1);
      result.putString("error", e.message);
      return result;
    }
  }

  @Throws(GeneralSecurityException::class, IOException::class)
  private fun getSecureSharedPreferences(): SharedPreferences {
    return EncryptedSharedPreferences.create(
      "secret_shared_prefs",
      MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC),
      this.reactContext!!,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
  }
}
