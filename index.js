//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#deleteEndpoint-property

var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: '',			//add accessKeyId
  secretAccessKey: '',		//add secretAccessKey
  region: ''				//add region
});

var sns = new AWS.SNS();

var platform_arn = '';
var device_token = '';
var user_data = '';

//ceate ARN  
sns.createPlatformEndpoint({
    PlatformApplicationArn: platform_arn,
    Token: device_token,
    CustomUserData: user_data
}, function(err, data) {
  if (err) {
    console.log(err.stack);
    return;
  }
  else{
	  console.log(data.EndpointArn);    
	  }
});


//delete ARN
var device_arn = '';
sns.deleteEndpoint({
    EndpointArn: device_arn 
}, function(err, data) {
  if (err) {
    console.log(err.stack);
    return;
  }
  else{
      console.log(data.ResponseMetadata.RequestId);  
  }
});


//send push
var device_arn = '';
var params = {
   Attributes: {
       Enabled: 'true',
   },
   EndpointArn: device_arn
};
sns.setEndpointAttributes(params, function (err, data) {
   if (err) {
       console.log(err.stack);
       return;
   }
   else {
       console.log(data.ResponseMetadata.RequestId);
       console.log('push enable ');


       var payload = {
           default: 'Hello World',
           APNS: {
               aps: {
                   alert: 'Hello World',
                   sound: 'default',
                   badge: 1
               }
           }
       };

       payload.APNS = JSON.stringify(payload.APNS);
       payload = JSON.stringify(payload);

       sns.publish({
           Message: payload,
           MessageStructure: 'json',
           TargetArn: device_arn
       }, function (err, data) {
           if (err) {
               console.log(err.stack);
               return;
           }
           else {
               console.log(data.ResponseMetadata.RequestId);
               console.log('push sent');
           }
       });
   }
});