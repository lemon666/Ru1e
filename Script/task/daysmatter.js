/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
    您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = $task !== undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient !== undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            $task.fetch(url).then(response => {
                cb(errorInfo, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            url.method = 'POST';
            $task.fetch(url).then(response => {
                cb(errorInfo, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
// #endregion


/*
倒数日

使用:
#每天 8点通知, 也可以自定义其他时间, 详情:https://community.nssurge.com/d/33-scripting

[Script]
cron "0 8 * * *" script-path=https://github.com/congcong0806/surge-list/raw/master/Script/daysmatter.js
 
作者:聪聪
聪聪 https://t.me/congcongx_bot
群组 https://t.me/YinxiangBiji
频道 https://t.me/YinxiangBiji_News
*/

Date.prototype.format = function(fmt) {
    var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return fmt;
};

//倒数日计算
function dateDiff(startDate, endDate) {
    //2002-12-18格式  
    var sdate, edate, days
    sdate = new Date(startDate)
    edate = new Date(endDate)
    //把相差的毫秒数转换为天数
    days = parseInt((sdate - edate) / 1000 / 60 / 60 / 24)
    return days;
}

const dayarr = [ 
    [ "今年", "2021-01-01" ],
    [ "生日", "2020-12-24" ],
    [ "相识日", "2021-06-03" ], 
    [ "纪念日", "2021-06-19" ], 
    [ "结婚纪念日", "2021-05-20" ],  
]

day();

function day() {
    var now = new Date()
    var nowStr = now.format("yyyy-MM-dd")
    var content = "Good Day,就是今天\n";
    for ( var i in dayarr) {
        var d = dateDiff(dayarr[i][1], nowStr)
        if(isNaN(d))
            continue
        var u = valcal(d)
        content += dayarr[i][0] + "," + u + "\n"
    }
    console.log(content);
    $notification.post('倒数日', "", content)
    $done()
}

function valcal(days) {
    if (days == 0)
        return "就是今天"
    else if (days > 0)
        return "剩余:" + days + "天"
    else
        return "已过:" + Math.abs(days) + "天"
}