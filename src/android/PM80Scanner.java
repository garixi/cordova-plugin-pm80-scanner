package com.shineum;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import device.common.DecodeResult;
import device.common.ScanConst;
import device.sdk.ScanManager;

// import android.widget.Toast;

public class PM80Scanner extends CordovaPlugin {

  private static ScanManager mScanner = new ScanManager();
  private static DecodeResult mDecodeResult = new DecodeResult();
  private static CallbackContext callbackContext = null;

  static {
    mScanner.aDecodeSetResultType(ScanConst.ResultType.DCD_RESULT_COPYPASTE);
    mScanner.aDecodeSetTriggerMode(ScanConst.TriggerMode.DCD_TRIGGER_MODE_ONESHOT);
    // mScanner.aDecodeSetBeepEnable(0);   // 1 : on, 0 : off
  }

  public static class ScanResultReceiver extends BroadcastReceiver {
		@Override
		public void onReceive(Context context, Intent intent) {
      // Toast.makeText(context, "Intent Detected.", Toast.LENGTH_LONG).show();
			if (mScanner != null) {
				mScanner.aDecodeGetResult(mDecodeResult.recycle());
        if (callbackContext != null) {
          if (mDecodeResult.symName.equals("READ_FAIL")) {
              callbackContext.error("READ_FAIL");
          } else {
            JSONObject json = new JSONObject();
            try {
              json.put("result", mDecodeResult.toString());
              json.put("type", mDecodeResult.symName);
            } catch (Exception e) {}
            callbackContext.success(json);
          }
        }
			} else {
          if (callbackContext != null) {
              callbackContext.error("SCANNER_ERROR");
          }
      }
		}
	}

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
      if (action.equals("scan")) {
        this.callbackContext = callbackContext;
        mScanner.aDecodeSetTriggerOn(1);
      } else if (action.equals("cancel")) {
        if (this.callbackContext != null) {
          this.callbackContext.error("USER_CANCEL");
          this.callbackContext = null;
        }
        mScanner.aDecodeSetTriggerOn(0);
      } else if (action.equals("beep")) {
        mScanner.aDecodeSetBeepEnable(args.getInt(0));
      } else if (action.equals("set")) {
        this.callbackContext = callbackContext;
      } else if (action.equals("triggerMode")) {
        mScanner.aDecodeSetTriggerMode(args.getInt(0));
      }
      else if (action.equals("scanMode")) {
          mScanner.aDecodeSetResultType(args.getInt(0));
      }else if (action.equals("scan2")) {
        mScanner.aDecodeSetTriggerOn(1);
      } else {
        return false;
      }
      return true;
  }
}
