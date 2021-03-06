#import "FeedbackReporter.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

#import <AssetsLibrary/AssetsLibrary.h>
#import <Foundation/Foundation.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <UIKit/UIKit.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>

#define PATH @"feedback-reporter"

@implementation FeedbackReporter
RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
  return @{
    @"TemporaryDirectoryPath": NSTemporaryDirectory(),
  };
}

@synthesize bridge = _bridge;

- (NSArray<NSString *> *)supportedEvents {
    return @[@"ScreenshotTaken"];
}

RCT_EXPORT_METHOD(startListener){
  [self addScreenShotObserver];
}

- (void)addScreenShotObserver{
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getScreenShot:) name:UIApplicationUserDidTakeScreenshotNotification object:nil];
}

- (void)removeScreenShotObserver{
  [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationUserDidTakeScreenshotNotification object:nil];
}

- (void)getScreenShot:(NSNotification *)notification{
  [self sendEventWithName:@"ScreenshotTaken" body:[self screenImage]];
}

- (NSDictionary *)screenImage{
  @try{
    NSData *data = [self imageDataScreenShot];
    return @{@"code": @200, @"uri": [data base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed]};
  }@catch(NSException *ex) {
    NSLog(@"Unable to get image", ex.description);
    return @{@"code": @500, @"errMsg": @"Unable to get image"};
  }
}

- (NSData *)imageDataScreenShot{
  CGSize imageSize = [UIScreen mainScreen].bounds.size;

  UIGraphicsBeginImageContextWithOptions(imageSize, NO, 0);
  CGContextRef context = UIGraphicsGetCurrentContext();
  for(UIWindow *window in [[UIApplication sharedApplication] windows]){
    CGContextSaveGState(context);
    CGContextTranslateCTM(context, window.center.x, window.center.y);
    CGContextConcatCTM(context, window.transform);
    CGContextTranslateCTM(context, -window.bounds.size.width*window.layer.anchorPoint.x, -window.bounds.size.height * window.layer.anchorPoint.y);
    if ([window respondsToSelector:@selector(drawViewHierarchyInRect:afterScreenUpdates:)]){
      NSLog(@"agan_app 使用drawViewHierarchyInRect:afterScreenUpdates:");
      [window drawViewHierarchyInRect:window.bounds afterScreenUpdates:YES];
    }else{
      NSLog(@"agan_app 使用renderInContext:");
      [window.layer renderInContext:context];
    }
    CGContextRestoreGState(context);
  }
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();

  return UIImagePNGRepresentation(image);
}

RCT_EXPORT_METHOD(writeFile:(NSString *)filepath
                  contents:(NSString *)base64Content
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSData *data = [[NSData alloc] initWithBase64EncodedString:base64Content options:NSDataBase64DecodingIgnoreUnknownCharacters];

  NSMutableDictionary *attributes = [[NSMutableDictionary alloc] init];

  if ([options objectForKey:@"NSFileProtectionKey"]) {
    [attributes setValue:[options objectForKey:@"NSFileProtectionKey"] forKey:@"NSFileProtectionKey"];
  }

  BOOL success = [[NSFileManager defaultManager] createFileAtPath:filepath contents:data attributes:attributes];

  if (!success) {
    return reject(@"ENOENT", [NSString stringWithFormat:@"ENOENT: no such file or directory, open '%@'", filepath], nil);
  }

  return resolve(nil);
}

@end
