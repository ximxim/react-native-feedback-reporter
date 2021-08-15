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

static NSString *serviceName = @"RNFRStorage";

- (NSDictionary *)setValue: (NSString *)key value:(NSString *)value {
    @try {
        BOOL status = [self createKeychainValue: value forIdentifier: key];
           if (status) {
               return @{
                   @"code": @200,
                   @"message": @"key stored successfully",
               };
           } else {
               BOOL status = [self updateKeychainValue: value forIdentifier: key];
               if (status) {
                   return @{
                       @"code": @200,
                       @"message": @"key updated successfully",
                   };
               } else {
                   NSString* errorMessage = @"{\"message\":\"error saving key\"}";
                   return @{
                       @"code": @9,
                       @"message": errorMessage,
                   };
               }
           }
       }
       @catch (NSException *exception) {
           NSString* errorMessage = [NSString stringWithFormat:@"{\"message\":\"error saving key, please try to un-install and re-install app again\",\"actual-error\":%@}", exception];
           return @{
               @"code": @9,
               @"message": errorMessage,
       };
   }
}

- (NSDictionary *)getValue: (NSString *)key {
    @try {
        NSString *value = [self searchKeychainCopyMatching:key];
        if (value == nil) {
            NSString* errorMessage = @"{\"message\":\"key does not present\"}";
            return @{
                @"code": @404,
                @"message": errorMessage,
            };
        } else {
            return @{
                @"code": @200,
                @"value": value,
            };
        }
    }
    @catch (NSException *exception) {
        NSString* errorMessage = [NSString stringWithFormat:@"{\"message\":\"key does not present\",\"actual-error\":%@}", exception];
        return @{
            @"code": @1,
            @"error": errorMessage,
        };
    }
}

- (BOOL)createKeychainValue:(NSString *)value forIdentifier:(NSString *)identifier {
    NSMutableDictionary *dictionary = [self newSearchDictionary:identifier];
    
    NSData *valueData = [value dataUsingEncoding:NSUTF8StringEncoding];
    [dictionary setObject:valueData forKey:(id)kSecValueData];
    dictionary[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)(__bridge CFStringRef)(__bridge NSString *)kSecAttrAccessibleAlwaysThisDeviceOnly;
    
    OSStatus status = SecItemAdd((CFDictionaryRef)dictionary, NULL);
    
    if (status == errSecSuccess) {
        return YES;
    }
    return NO;
}

- (NSMutableDictionary *)newSearchDictionary:(NSString *)identifier {
    NSMutableDictionary *searchDictionary = [[NSMutableDictionary alloc] init];
    
    [searchDictionary setObject:(id)kSecClassGenericPassword forKey:(id)kSecClass];
    
    NSData *encodedIdentifier = [identifier dataUsingEncoding:NSUTF8StringEncoding];
    [searchDictionary setObject:encodedIdentifier forKey:(id)kSecAttrGeneric];
    [searchDictionary setObject:encodedIdentifier forKey:(id)kSecAttrAccount];
    [searchDictionary setObject:serviceName forKey:(id)kSecAttrService];
    
    return searchDictionary;
}

- (BOOL)updateKeychainValue:(NSString *)password forIdentifier:(NSString *)identifier {
    
    NSMutableDictionary *searchDictionary = [self newSearchDictionary:identifier];
    NSMutableDictionary *updateDictionary = [[NSMutableDictionary alloc] init];
    NSData *passwordData = [password dataUsingEncoding:NSUTF8StringEncoding];
    [updateDictionary setObject:passwordData forKey:(id)kSecValueData];
    updateDictionary[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)(__bridge CFStringRef)(__bridge NSString *)kSecAttrAccessibleAlwaysThisDeviceOnly;
    OSStatus status = SecItemUpdate((CFDictionaryRef)searchDictionary,
                                    (CFDictionaryRef)updateDictionary);
    
    if (status == errSecSuccess) {
        return YES;
    }
    return NO;
}

- (NSString *)searchKeychainCopyMatching:(NSString *)identifier {
    NSMutableDictionary *searchDictionary = [self newSearchDictionary:identifier];
    
    // Add search attributes
    [searchDictionary setObject:(id)kSecMatchLimitOne forKey:(id)kSecMatchLimit];
    
    // Add search return types
    [searchDictionary setObject:(id)kCFBooleanTrue forKey:(id)kSecReturnData];
    
    NSDictionary *found = nil;
    CFTypeRef result = NULL;
    SecItemCopyMatching((CFDictionaryRef)searchDictionary,
                                          (CFTypeRef *)&result);
    
    NSString *value = nil;
    found = (__bridge NSDictionary*)(result);
    if (found) {
        value = [[NSString alloc] initWithData:found encoding:NSUTF8StringEncoding];
    }
    return value;
}

@end
