//
//  Storage.m
//  DoubleConversion
//
//  Created by Azim Ahmed on 2021-08-15.
//

#import <Foundation/Foundation.h>
#import "RNFRStorage.h"

@interface RNFRStorage()

@end

@implementation RNFRStorage

- (NSDictionary *)setValue: (NSString *)key value:(NSString *)value {
    return @{
        @"code": @200,
        @"key": key,
        @"value": value,
    };
}

@end
