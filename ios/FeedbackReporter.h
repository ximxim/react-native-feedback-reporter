#import <SSZipArchive/SSZipArchive.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@interface FeedbackReporter : RCTEventEmitter <RCTBridgeModule, SSZipArchiveDelegate>

@end
