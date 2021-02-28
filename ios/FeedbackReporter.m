#import "FeedbackReporter.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

#define PATH @"feedback-reporter"

@implementation FeedbackReporter
RCT_EXPORT_MODULE()

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

    // NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    // NSFileManager *fileManager = [NSFileManager defaultManager];
    // NSString *path =[[paths objectAtIndex:0]stringByAppendingPathComponent:PATH];
    // if (![fileManager fileExistsAtPath:path]) {
    //   [fileManager createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:nil];
    // }
    // long time = (long)[[NSDate new] timeIntervalSince1970];
    // NSString *filePath = [path stringByAppendingPathComponent: [NSString stringWithFormat:@"screen-capture-%ld.png", time]];

    // @try{
    //   BOOL result = [UIImagePNGRepresentation(image) writeToFile:filePath atomically:YES]; // 保存成功会返回YES
    //   if (result == YES) {
    //     NSLog(@"agan_app 保存成功。filePath：%@", filePath);
    //     [[[UIApplication sharedApplication] keyWindow] endEditing:YES]; // 获取截屏后关闭键盘
    //     return @{@"code": @200, @"uri": filePath};
    //   }
    // }@catch(NSException *ex) {
    //   NSLog(@"agan_app 保存图片失败：%@", ex.description);
    //   filePath = @"";
    //   return @{@"code": @500, @"errMsg": @"保存图片失败"};
    // }
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

@end
