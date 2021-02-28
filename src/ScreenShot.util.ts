import { NativeModules, NativeEventEmitter, EventEmitter } from 'react-native';

let screenCaptureEmitter: EventEmitter | undefined;
const EVENT = 'ScreenshotTaken';

export default class ScreenShotShareUtil {
  static startListener(callback: Function) {
    const FeedbackReporter = NativeModules.FeedbackReporter;

    screenCaptureEmitter && screenCaptureEmitter.removeAllListeners(EVENT);

    screenCaptureEmitter = new NativeEventEmitter(FeedbackReporter);

    screenCaptureEmitter.addListener(EVENT, (data) => callback?.(data));

    FeedbackReporter.startListener();

    return screenCaptureEmitter;
  }
  static stopListener() {
    // @ts-ignore
    screenCaptureEmitter && screenCaptureEmitter.removeAllListeners(EVENT);

    return NativeModules.ScreenShotShare.screenCaptureEmitter.stopListener();
  }
}
