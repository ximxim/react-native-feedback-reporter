#import "FeedbackReporter.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

#import <AssetsLibrary/AssetsLibrary.h>
#import <Foundation/Foundation.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <UIKit/UIKit.h>
#import <React/RCTLog.h>

#import "Uploader.h"
#import "RNFRStorage.h"

#import <React/RCTUtils.h>
#import <React/RCTScrollView.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTViewManager.h>


#if __has_include(<React/RCTImageLoader.h>)
#import <React/RCTImageLoader.h>
#else
#import <React/RCTImageLoaderProtocol.h>
#endif

#import <CommonCrypto/CommonDigest.h>
#import <Photos/Photos.h>

#define PATH @"feedback-reporter"

@interface FeedbackReporter()

@property (retain) NSMutableDictionary* uploaders;
@property (retain) NSMutableArray* breadcrumbs;

@end

@implementation FeedbackReporter
RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
  return @{
    @"TemporaryDirectoryPath": NSTemporaryDirectory(),
  };
}

- (dispatch_queue_t)methodQueue
{
  return RCTGetUIManagerQueue();
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"ScreenshotTaken",@"UploadBegin",@"UploadProgress"];
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

RCT_EXPORT_METHOD(uploadFiles:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    FRUploadParams* params = [FRUploadParams alloc];

  NSNumber* jobId = options[@"jobId"];
  params.toUrl = options[@"toUrl"];
  params.files = options[@"files"];
  params.binaryStreamOnly = [[options objectForKey:@"binaryStreamOnly"] boolValue];
  NSDictionary* headers = options[@"headers"];
  NSDictionary* fields = options[@"fields"];
  NSString* method = options[@"method"];
  params.headers = headers;
  params.fields = fields;
  params.method = method;
  bool hasBeginCallback = [options[@"hasBeginCallback"] boolValue];
  bool hasProgressCallback = [options[@"hasProgressCallback"] boolValue];

  params.completeCallback = ^(NSString* body, NSURLResponse *resp) {
    [self.uploaders removeObjectForKey:[jobId stringValue]];

    NSMutableDictionary* result = [[NSMutableDictionary alloc] initWithDictionary: @{@"jobId": jobId,
                                                                                     @"body": body}];
    if ([resp isKindOfClass:[NSHTTPURLResponse class]]) {
      [result setValue:((NSHTTPURLResponse *)resp).allHeaderFields forKey:@"headers"];
      [result setValue:[NSNumber numberWithUnsignedInteger:((NSHTTPURLResponse *)resp).statusCode] forKey:@"statusCode"];
    }
    return resolve(result);
  };

  params.errorCallback = ^(NSError* error) {
    [self.uploaders removeObjectForKey:[jobId stringValue]];
    return;
  };

  if (hasBeginCallback) {
    params.beginCallback = ^() {
        if (self.bridge != nil)
          [self sendEventWithName:@"UploadBegin"
                                                  body:@{@"jobId": jobId}];
    };
  }

  if (hasProgressCallback) {
    params.progressCallback = ^(NSNumber* totalBytesExpectedToSend, NSNumber* totalBytesSent) {
        if (self.bridge != nil)
            [self sendEventWithName:@"UploadProgress"
                                                  body:@{@"jobId": jobId,
                                                          @"totalBytesExpectedToSend": totalBytesExpectedToSend,
                                                          @"totalBytesSent": totalBytesSent}];
    };
  }

  if (!self.uploaders) self.uploaders = [[NSMutableDictionary alloc] init];

  FRUploader* uploader = [FRUploader alloc];

  [uploader uploadFiles:params];

  [self.uploaders setValue:uploader forKey:[jobId stringValue]];
}

RCT_EXPORT_METHOD(getThumbnail:(NSString *)filepath resolve:(RCTPromiseResolveBlock)resolve
                               reject:(RCTPromiseRejectBlock)reject)
{
    @try {
        filepath = [filepath stringByReplacingOccurrencesOfString:@"file://"
                                                  withString:@""];
        NSURL *vidURL = [NSURL fileURLWithPath:filepath];

        AVURLAsset *asset = [[AVURLAsset alloc] initWithURL:vidURL options:nil];
        AVAssetImageGenerator *generator = [[AVAssetImageGenerator alloc] initWithAsset:asset];
        generator.appliesPreferredTrackTransform = YES;

        NSError *err = NULL;
        CMTime time = CMTimeMake(1, 60);

        CGImageRef imgRef = [generator copyCGImageAtTime:time actualTime:NULL error:&err];
        UIImage *thumbnail = [UIImage imageWithCGImage:imgRef];
        // save to temp directory
        NSString* tempDirectory = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory,
                                                                       NSUserDomainMask,
                                                                       YES) lastObject];

        NSData *data = UIImageJPEGRepresentation(thumbnail, 1.0);
        NSFileManager *fileManager = [NSFileManager defaultManager];
        NSString *fullPath = [tempDirectory stringByAppendingPathComponent: [NSString stringWithFormat:@"thumb-%@.jpg", [[NSProcessInfo processInfo] globallyUniqueString]]];
        [fileManager createFileAtPath:fullPath contents:data attributes:nil];
        CGImageRelease(imgRef);
        if (resolve)
            resolve(@{ @"path" : fullPath,
                       @"width" : [NSNumber numberWithFloat: thumbnail.size.width],
                       @"height" : [NSNumber numberWithFloat: thumbnail.size.height] });
    } @catch(NSException *e) {
        reject(e.reason, nil, nil);
    }
}

RCT_EXPORT_METHOD(captureRef:(nonnull NSNumber *)target
                  withOptions:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    if (!self.breadcrumbs) self.breadcrumbs = [[NSMutableArray alloc] init];
    // Get view
    UIView *view;

    if ([target intValue] == -1) {
      UIWindow *window = [[UIApplication sharedApplication] keyWindow];
      view = window.rootViewController.view;
    } else {
      view = viewRegistry[target];
    }

    if (!view) {
      reject(RCTErrorUnspecified, [NSString stringWithFormat:@"No view found with reactTag: %@", target], nil);
      return;
    }

    CGPoint tapPoint = [RCTConvert CGPoint:options];

    // Capture image
    BOOL success;

    UIView* rendered = view;

    UIGraphicsBeginImageContextWithOptions(view.bounds.size, NO, 0);

    success = [rendered drawViewHierarchyInRect:(CGRect){CGPointZero, view.bounds.size} afterScreenUpdates:YES];
    UIImage *orgimage = UIGraphicsGetImageFromCurrentImageContext();
    UIImage *image = [self imageByDrawingCircleOnImage:orgimage tapPoint:tapPoint];
    UIGraphicsEndImageContext();

    if (!success) {
      reject(RCTErrorUnspecified, @"The view cannot be captured. drawViewHierarchyInRect was not successful. This is a potential technical or security limitation.", nil);
      return;
    }

    if (!image) {
      reject(RCTErrorUnspecified, @"Failed to capture view snapshot. UIGraphicsGetImageFromCurrentImageContext() returned nil!", nil);
      return;
    }

    // Convert image to data (on a background thread)
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

      NSData *data = UIImagePNGRepresentation(image);

      NSError *error = nil;
      NSString *res = nil;

      NSString *path = RCTTempFilePath(@"png", &error);

      if (path && !error) {
        if ([data writeToFile:path options:(NSDataWritingOptions)0 error:&error]) {
          [self.breadcrumbs addObject:path];
          res = path;
        }
      }

      if (res && !error) {
        resolve(self.breadcrumbs);
        return;
      }

      // If we reached here, something went wrong
      if (error) reject(RCTErrorUnspecified, error.localizedDescription, error);
      else reject(RCTErrorUnspecified, @"viewshot unknown error", nil);
    });
  }];
}

RCT_EXPORT_METHOD(zipBreadcrumbs:(NSString *)destinationPath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSMutableArray *newPaths = [[NSMutableArray alloc] init];
    for (id path in self.breadcrumbs) {
        NSUInteger index = [self.breadcrumbs indexOfObject:path];
        NSString *dir = [path stringByDeletingLastPathComponent];
        NSString *toPath = [dir stringByAppendingString:[NSString stringWithFormat:@"/%lu.png", index + 1]];
        BOOL success = [[NSFileManager defaultManager] moveItemAtPath:path toPath:toPath error:nil];
        if (success) {
            [newPaths addObject:toPath];
        }
    }
    
    if ([newPaths count] == 0) {
        reject(@"400", @"nothing to zip", nil);
        return;
    }

    BOOL success = [SSZipArchive createZipFileAtPath:destinationPath withFilesAtPaths:newPaths];
    if (success) {
        NSMutableDictionary* result = [[NSMutableDictionary alloc] initWithDictionary: @{@"path": destinationPath,
                                                                                     @"content": newPaths}];
        resolve(result);
    } else {
        NSError *error = nil;
        reject(@"zip_error", @"unable to zip", error);
    }
}

- (UIImage *)imageByDrawingCircleOnImage:(UIImage *)image
                                tapPoint:(CGPoint) tapPoint
{
    int radius = 20;
    // begin a graphics context of sufficient size
    UIGraphicsBeginImageContext(image.size);

    // draw original image into the context
    [image drawAtPoint:CGPointZero];

    // get the context for CoreGraphics
    CGContextRef ctx = UIGraphicsGetCurrentContext();

    // set stroking color and draw circle
    [[UIColor colorWithRed: 0.69 green: 0.69 blue: 0.69 alpha: 1.00] setStroke];
    [[UIColor colorWithRed: 0.69 green: 0.69 blue: 0.69 alpha: 0.50] setFill];

    CGContextSetShadowWithColor(ctx, CGSizeMake(-0.0f,  0.0f), 5.0f, [UIColor lightGrayColor].CGColor);

    // make circle rect 5 px from border
    CGRect circleRect = CGRectMake(
               tapPoint.x - radius,
               tapPoint.y - radius,
                radius * 2,
                radius * 2);

    // draw circle
    CGContextFillEllipseInRect(ctx, circleRect);

    // make image out of bitmap context
    UIImage *retImage = UIGraphicsGetImageFromCurrentImageContext();

    // free the context
    UIGraphicsEndImageContext();

    return retImage;
}

RCT_EXPORT_METHOD(clearTmpDirectory) {
    NSString *rnTempPath = RCTTempFilePath(@"png", nil);
    NSString *rctTempDir = [rnTempPath stringByDeletingLastPathComponent];
    self.breadcrumbs = [[NSMutableArray alloc] init];
    NSArray* tmpDirectory = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:NSTemporaryDirectory() error:NULL];
    for (NSString *file in tmpDirectory) {
        NSString *fullPath = [NSTemporaryDirectory() stringByAppendingString:file];
        if (![fullPath isEqualToString:rctTempDir]) {
            [[NSFileManager defaultManager] removeItemAtPath:[NSString stringWithFormat:@"%@%@", NSTemporaryDirectory(), file] error:NULL];
        }
    }

    NSArray* rnTempDirectory = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:rctTempDir error:NULL];
    for (NSString *file in rnTempDirectory) {
        NSString *filePath = [[rctTempDir stringByAppendingString:@"/"] stringByAppendingString:file];
        [[NSFileManager defaultManager] removeItemAtPath:filePath error:NULL];
    }
}

RCT_EXPORT_METHOD(setValue: (NSString *)key
                  value:(NSString *)value
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    RNFRStorage *storage = [RNFRStorage alloc];
    NSDictionary *result = [storage setValue:key value:value];
    NSNumber *code = [result valueForKey:@"code"];
    NSString *error = [result valueForKey:@"error"];

    if ([code intValue] == [@200 intValue]) {
        resolve(result);
    } else {
        reject(@"ENOENT", error, nil);
    }
}

RCT_EXPORT_METHOD(getValue: (NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    RNFRStorage *storage = [RNFRStorage alloc];
    NSDictionary *result = [storage getValue:key];
    NSNumber *code = [result valueForKey:@"code"];
    NSString *error = [result valueForKey:@"error"];

    if ([code intValue] == [@200 intValue]) {
        resolve(result);
    } else {
        reject(@"ENOENT", error, nil);
    }
}

@end
