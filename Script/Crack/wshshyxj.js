/*
微商水印相机
QX:
https:\/\/user\.edujia.com\/\/user\/ws\/vip\/(query\/info.do|main\/query\/info.do) url script-response-body wshshyxj.js


Surge4:
http-response https:\/\/user\.edujia.com\/\/user\/ws\/vip\/(query\/info.do|main\/query\/info.do) requires-body=1,max-size=0,script-path= https://raw.githubusercontent.com/shaGuar-svg/Ru1e/master/Script/Unlock/wshshyxj.js




hostname = user.edujia.com
*/



var obj = JSON.parse($response.body);
if ($request.url.indexOf("//user/ws/vip/query/info.do") != -1){
    obj.data.object.isVip = 1;
    obj.data.object.buyType = 3;
    obj.data.object.expireTime = 3043035497;
}
if ($request.url.indexOf("//user/ws/vip/main/query/info.do") != -1){
   obj.data.object.isVip = 1;
   obj.data.object.buyType = 3;
}
$done({body: JSON.stringify(obj)});
