import { locale } from './i18n';
import md5 from 'js-md5';
import JSEncrypt from 'jsencrypt';

//生成随机数
function generateMixed() {
    let char = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
    ];
    let res = '';
    for (let i = 0; i < 6; i++) {
        let id = Math.floor(Math.random() * 36);
        res += char[id] + '-' + (new Date().getTime() + i);
    }
    console.log('res :>> ', res);
    return res;
}

//头像处理
export function getAvatarUrl(url) {
    // let currentUrl = window.location.href.indexOf ('localhost') > -1 ? window.location.href : StaticHost || window.location.href;
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');

    let host =
        currentUrl.indexOf('yungu.org') > -1
            ? `http://node.api.yungu.org/photo/avatar?user_union_id=${url}&type=2`
            : `http://userservice.api.yungu-inc.org/api/user/avatarUrl/${url}`;
    // : `http://userservice.api.yungu-inc.org/photo/avatar?user_union_id=${url}`;

    return host;
}

export function formatterTime(value) {
    if (!value) return;
    var newVal = value;
    if (typeof value === 'string') {
        newVal = newVal.replace(RegExp('-', 'g'), '/');
        if (value && value.indexOf('T') != -1 && value.indexOf('GMT') === -1) {
            newVal = newVal.replace('T', ' ');
            newVal = newVal.split('.')[0];
        }
    }
    let time = new Date(newVal);
    let y, m, day, hour, min, second;
    y = time.getFullYear();
    m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    second = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    return y + '-' + m + '-' + day + ' ' + hour + ':' + min + ':' + second;
}

//加密密码
/**
 * publicKey: 公钥 --通过接口获取
 * password: 用户输入的密码
 */
export function encryptPassword(publicKey, password) {
    let jsencrypt = new JSEncrypt();
    jsencrypt.setPublicKey(publicKey);
    let pwd = {
        password: md5(password),
        timestamp: new Date().getTime(),
        nonce: generateMixed(),
    };
    console.log(jsencrypt.encrypt(JSON.stringify(pwd)), 'pwd');
    return jsencrypt.encrypt(JSON.stringify(pwd));
}

//重定向
export function loginRedirect() {
    // let currentUrl = window.location.href;
    // currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/ig, '');
    let hash =
        window.location.hash &&
        window.location.hash.split('#/') &&
        window.location.hash.split('#/')[1];
    let currentUrl = `${window.location.origin}?hash=${hash}`;
    let host =
        currentUrl.indexOf('daily') > -1
            ? 'https://login.daily.yungu-inc.org'
            : 'https://login.yungu.org';
    let userIdentity = localStorage.getItem('userIdentity');
    window.location.href =
        host + '/cas/login?loginTab=' + userIdentity + '&service=' + encodeURIComponent(currentUrl);
}
export function loginRedirectWeide() {
    // let currentUrl = window.location.href;
    // currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/ig, '');
    let hash =
        window.location.hash &&
        window.location.hash.split('#/') &&
        window.location.hash.split('#/')[1];
    let currentUrl = `${window.location.origin}/myCourse?path=${hash}`;
    let host =
        currentUrl.indexOf('daily') > -1
            ? 'https://login.daily.yungu-inc.org'
            : 'https://login.yungu.org';
    let userIdentity = localStorage.getItem('userIdentity');
    window.location.href = host + '/cas/login?service=' + encodeURIComponent(currentUrl);
}

export function applyDrag(arr, dragResult) {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
}

export function generateItems(count, creator) {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(creator(i));
    }
    return result;
}

function getRelation(str1, str2) {
    if (str1 === str2) {
        console.warn('Two path are equal!'); // eslint-disable-line
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    } else if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}
const config = {
    // loginUrl:"https://oslogin.daily.yungu-inc.org/cas/loginMsg#/login",
    // loginUrl: "https://oslogin.daily.yungu-inc.org/api/os/cas/osLogin#/login",
    // loginUrl:"http://192.168.0.101:8000/#/login",
    loginUrl: 'https://login.yungu.org/api/os/cas/loginMsg#/login',

    // userInfoUrl: "https://oslogin.daily.yungu-inc.org/cas/loginMsg#/userInfo",
    // userInfoUrl:"//192.168.0.101:8000/#/userInfo",
    userInfoUrl:
        'https://task.daily.yungu-inc.org/?ticket=B28EDECB90104213AEF577EE47DCB4EC#/course',
    // redirectUri: "http://oslogin.daily.yungu-inc.org/api/os/osWeChatCallBack",
    //typeof isYungu != "undefined" && isYungu === false
    // redirectUri: `https://login.yungu.org/api/os/osWeChatCallBack?domain=${encodeURIComponent(new URLSearchParams(location.search).get('service'))}&schoolId=${encodeURIComponent(schoolDO && schoolDO.schoolId)}`,
    // redirectUri: `https://login.daily.yungu-inc.org/api/os/osWeChatCallBack?domain=${encodeURIComponent(query[1])}&schoolId=${encodeURIComponent(schoolDO && schoolDO.schoolId)}`,
    weixinAppid: 'wx51056d19280a8ac9',
    // weixinAppid: 'wxe28ed9658e13b5b3',
    pcAppid: 'wx59fe5c79c700b31c',

    // weixincss: "https://assets.daily.yungu-inc.org/usercenter/0.0.1/index.css",
    weixincss:
        'data:text/css;base64,LmltcG93ZXJCb3ggLmluZm8ge2Rpc3BsYXk6bm9uZTt9DQouaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMjUwcHg7fQ0KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30NCi5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZX0NCi5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246IGNlbnRlcjt9DQouaW1wb3dlckJveCAubGlnaHRCb3JkZXIge2JvcmRlcjogbm9uZSAhaW1wb3J0YW50O30=',
    parentImgBaes64:
        'data:image/png;base64,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',
    // logoUrl: "https://w.daily.yungu-inc.org/",
    logoUrl: 'https://www.yungu.org',

    // cookieDomain: "yungu-inc.org",
    cookieDomain: 'yungu.org',

    // collectionId: {// 聚全信息
    //     parent: [14],// 家长
    //     teacher: [7],// 老师
    //     cooperation: [6],// 合作
    // },

    // recruitStudent: "https://w.daily.yungu-inc.org/apply/admission/list",
    recruitStudent: 'https://career.yungu.org/apply/admission/list',

    taskUrl: 'https://task.yungu.org/',
};
function getRenderArr(routes) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
        // 去重
        renderArr = renderArr.filter((item) => getRelation(item, routes[i]) !== 1);
        // 是否包含
        const isAdd = renderArr.every((item) => getRelation(item, routes[i]) === 3);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(
        (routePath) => routePath.indexOf(path) === 0 && routePath !== path
    );
    // Replace path to '' eg. path='user' /user/name => name
    routes = routes.map((item) => item.replace(path, ''));
    // Get the route to be rendered to remove the deep rendering
    const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters
    const renderRoutes = renderArr.map((item) => {
        const exact = !routes.some((route) => route !== item && getRelation(route, item) === 1);
        return {
            exact,
            ...routerData[`${path}${item}`],
            key: `${path}${item}`,
            path: `${path}${item}`,
        };
    });
    return renderRoutes;
}

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function formatTime(val) {
    if (!val) return;
    let date = new Date(formatTimeSafari(val));
    let y, m, day;
    y = date.getFullYear();
    m = fixedZero(date.getMonth() + 1);
    day = fixedZero(date.getDate());
    return y + '/' + m + '/' + day;
}

export function formatDate(val) {
    if (!val) return;
    let date = new Date(formatTimeSafari(val));
    let y, m, day;
    y = date.getFullYear();
    m = fixedZero(date.getMonth() + 1);
    day = fixedZero(date.getDate());
    return y + '-' + m + '-' + day;
}

export function formatDateBasic() {
    let date = new Date(formatTimeSafari(val));
    let y, m, day;
    y = date.getFullYear();

    m = fixedZero(date.getMonth() + 1);

    day = fixedZero(date.getDate());

    return y + '' + m + '' + day;
}

export function formatDateIOS(val) {
    if (!val) return;
    val = typeof val == 'string' && val.replace(/-/g, '/');
    let date = new Date(val);
    let y, m, day;
    y = date.getFullYear();
    m = fixedZero(date.getMonth() + 1);
    day = fixedZero(date.getDate());
    return y + '-' + m + '-' + day;
}

export function preciseTime(val) {
    if (!val) return;
    let date = new Date(formatTimeSafari(val));
    let y, m, day, hour, minute;
    y = date.getFullYear();
    m = fixedZero(date.getMonth() + 1);
    day = fixedZero(date.getDate());
    hour = fixedZero(date.getHours());
    minute = fixedZero(date.getMinutes());
    return y + '/' + m + '/' + day + ' ' + hour + ':' + minute;
}

export function preciseDate(val) {
    if (!val) return;
    val = val.replace(/-/g, '/');
    let date = new Date(formatTimeSafari(val));
    let y, m, day, hour, minute;
    y = date.getFullYear();
    m = fixedZero(date.getMonth() + 1);
    day = fixedZero(date.getDate());
    hour = fixedZero(date.getHours());
    minute = fixedZero(date.getMinutes());
    return y + '-' + m + '-' + day + ' ' + hour + ':' + minute;
}

export function formatAllTime(val) {
    if (!val) return;
    let date = new Date(formatTimeSafari(val));
    let y, m, day, hour, minute, seconds;
    y = date.getFullYear();
    m = fixedZero(date.getMonth() + 1);
    day = fixedZero(date.getDate());
    hour = fixedZero(date.getHours());
    minute = fixedZero(date.getMinutes());
    seconds = fixedZero(date.getSeconds());
    return y + '-' + m + '-' + day + '  ' + hour + ':' + minute + ':' + seconds;
}

export function formatUsualTime(val) {
    if (!val) return;
    let date = new Date(formatTimeSafari(val));
    let y, m, day, hour, min, seconds;
    y = date.getFullYear();
    m = fixedZero(date.getMonth() + 1);
    day = fixedZero(date.getDate());
    hour = fixedZero(date.getHours());
    min = fixedZero(date.getMinutes());
    seconds = fixedZero(date.getSeconds());

    return hour + ':' + min;
}

export function saveCurrent(name, cur) {
    window.sessionStorage.clear();
    return window.sessionStorage.setItem(name, cur);
}

let colorSelect = [
    //小学优化
    { name: '语文', color: '#cc996d', bgColor: 'rgba(204,153,109,0.1)' },
    { name: '数学', color: '#1FB295', bgColor: 'rgba(31,178,149,0.1)' },
    { name: '英语', color: '#f05a8f', bgColor: 'rgba(240,90,143,0.1)' },
    { name: '体育', color: '#1EA5FC', bgColor: 'rgba(30,165,252,0.1)' },
    { name: '科学', color: '#466D1B', bgColor: 'rgba(70,109,27,0.1)' },
    { name: '音乐', color: '#EB7D37', bgColor: 'rgba(235,125,55,0.1)' },
    { name: '美术', color: '#FFA200', bgColor: 'rgba(255,162,0,0.1)' },
    { name: '字课', color: '#A28873', bgColor: 'rgba(162,136,115,0.1)' },

    //初中优化
    { name: '历史', color: '#A28873', bgColor: 'rgba(162,136,115,0.1)' },
    { name: 'Literature', color: '#f05a8f', bgColor: 'rgba(240,90,143,0.1)' },
    { name: 'Math', color: '#1FB295', bgColor: 'rgba(31,178,149,0.1)' },
    { name: 'DT', color: '#0F6D8E', bgColor: 'rgba(15,109,142,0.1)' },
    { name: '留白', color: '#757397', bgColor: 'rgba(117,115,151,0.1)' },

    //高中
    { name: '物理', color: '#466D1B', bgColor: 'rgba(70,109,27,0.1)' },
    { name: '化学', color: '#DA45BB', bgColor: 'rgba(218,69,187,0.1)' },
    { name: '生物', color: '#52C41A', bgColor: 'rgba(82,196,26,0.1)' },
    { name: '政治', color: '#8b5161', bgColor: 'rgba(139,81,97,0.1)' },
    { name: '地理', color: '#0F6D8E', bgColor: 'rgba(15,109,142,0.1)' },
    { name: '艺术', color: '#FFA200', bgColor: 'rgba(255,162,0,0.1)' },
    { name: '信息', color: '#0F6D8E', bgColor: 'rgba(15,109,142,0.1)' },
    { name: '乐理', color: '#EB7D37', bgColor: 'rgba(235,125,55,0.1)' },
    { name: '经济', color: '#8b5161', bgColor: 'rgba(139,81,97,0.1)' },
    { name: '心理', color: '#FFA200', bgColor: 'rgba(255,162,0,0.1)' },
    { name: '编程', color: '#0F6D8E', bgColor: 'rgba(15,109,142,0.1)' },

    //其他
    { name: '陶艺', color: '#FFA200', bgColor: 'rgba(255,162,0,0.1)' },
    { name: '戏剧', color: '#EB7D37', bgColor: 'rgba(235,125,55,0.1)' },
    { name: '合唱', color: '#EB7D37', bgColor: 'rgba(235,125,55,0.1)' },
    { name: '动画', color: '#FFA200', bgColor: 'rgba(255,162,0,0.1)' },
    { name: '画', color: '#FFA200', bgColor: 'rgba(255,162,0,0.1)' },
    { name: '书法', color: '#BDAC34', bgColor: 'rgba(189,172,52,0.1)' },

    { name: 'GP', color: '#f05a8f', bgColor: 'rgba(240,90,143,0.1)' },
    { name: 'ESL', color: '#bf3138', bgColor: 'rgba(191,49,56,0.1)' },
    { name: '道法', color: '#8b5161', bgColor: 'rgba(139,81,97,0.1)' },
    { name: '图书馆', color: '#788991', bgColor: 'rgba(120,137,145,0.1)' },

    { name: '乐高', color: '#466D1B', bgColor: 'rgba(70,109,27,0.1)' },
    { name: '工程师', color: '#466D1B', bgColor: 'rgba(70,109,27,0.1)' },
    { name: '节气山林', color: '#52C41A', bgColor: 'rgba(82,196,26,0.1)' },
    { name: '创新力课程', color: '#0F6D8E', bgColor: 'rgba(15,109,142,0.1)' },

    { name: 'Art', color: '#FFA200', bgColor: 'rgba(255,162,0,0.1)' },

    { name: '太极', color: '#EB7D37', bgColor: 'rgba(235,125,55,0.1)' },
    { name: '管弦', color: '#EB7D37', bgColor: 'rgba(235,125,55,0.1)' },
    //融合类
    { name: '融合', color: '#8962F8', bgColor: 'rgba(137,98,248,0.1)' },
    { name: '超学科课程', color: '#8962F8', bgColor: 'rgba(137,98,248,0.1)' },
    { name: '项目制学习', color: '#8962F8', bgColor: 'rgba(137,98,248,0.1)' },
    { name: 'PBL', color: '#8962F8', bgColor: 'rgba(137,98,248,0.1)' },
    { name: '博物馆', color: '#8962F8', bgColor: 'rgba(137,98,248,0.1)' },
    { name: '幼儿园课程', color: '#8962F8', bgColor: 'rgba(137,98,248,0.1)' },

    { name: '社会服务', color: '#757397', bgColor: 'rgba(117,115,151,0.1)' },
    { name: '学科支持', color: '#757397', bgColor: 'rgba(117,115,151,0.1)' },
    { name: '生涯规划', color: '#757397', bgColor: 'rgba(117,115,151,0.1)' },

    { name: '快乐运动', color: '#1EA5FC', bgColor: 'rgba(30,165,252,0.1)' },
    { name: '趣味语言', color: '#f05a8f', bgColor: 'rgba(240,90,143,0.1)' },
    { name: '计算机', color: '#0F6D8E', bgColor: 'rgba(15,109,142,0.1)' },
    { name: '哲学', color: '#A28873', bgColor: 'rgba(162,136,115,0.1)' },
    { name: '统计', color: '#466D1B', bgColor: 'rgba(70,109,27,0.1)' },
    { name: '微积分', color: '#52C41A', bgColor: 'rgba(82,196,26,0.1)' },

    { name: 'Cross Content-Economics', color: '#bf3138', bgColor: 'rgba(191,49,56,0.1)' },
    { name: '高中Co-curricular', color: '#8962F8', bgColor: 'rgba(137,98,248,0.1)' },

    { name: '语言与文化Club', color: '#cc996d', bgColor: 'rgba(204,153,109,0.1)' },
    { name: '社会与服务Club', color: '#8b5161', bgColor: 'rgba(139,81,97,0.1)' },
    { name: '方案活动', color: '#8962F8', bgColor: 'rgba(137,98,248,0.1)' },
    { name: '活动', color: '#3798FF', bgColor: 'rgba(55,152,255,0.1)' },
    { name: '作息', color: '#ddd', bgColor: '#fbfbff' },
];

export function getCourseColor(name, type) {
    /* if (name === '英语G3-I') {
        debugger;
    } */

    if (name == null) {
        if (type == '1') {
            return '#3798ff';
        }
        if (type == '2') {
            // getColor = "rgba(251,251,255,1)"; // 非课程的格子背景颜色
            return '#fbfbff'; // 非课程的格子背景颜色
        }
    } else {
        for (let i = 0; i < colorSelect.length; i++) {
            if (name.indexOf(colorSelect[i].name) != -1) {
                if (type == '1') {
                    return colorSelect[i].color;
                }
                if (type == '2') {
                    return colorSelect[i].bgColor;
                }
            }
        }
    }
}

export function intoNumber(num) {
    var chineseArr = ['零', '一', '二', '三', '四', '五', '六', '日'];
    return chineseArr.indexOf(num);
}

export function intoChinese(n) {
    var chineseArr =
        locale() !== 'en'
            ? ['零', '一', '二', '三', '四', '五', '六', '日']
            : ['0', '1', '2', '3', '4', '5', '6', '7'];
    return chineseArr[n];
}

export function intoChineseLang(n) {
    var chineseArr = ['零', '一', '二', '三', '四', '五', '六', '日'];
    var enArr = [
        '零',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];
    if (locale() == 'en') {
        return enArr[n];
    } else {
        return chineseArr[n];
    }
}

export function intoChineseNumber(n) {
    var chineseArr = [
        '零',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十',
        '十一',
        '十二',
    ];
    return chineseArr[n];
}

//数组对象相减， 获取差值 ---不排课规则使用
export function subObj(arr1, arr2) {
    let result = [];
    for (let i = 0; i < arr1.length; i++) {
        let iArr = arr1[i];
        let iArrDay = iArr['day'];
        let iArrLesson = iArr['lesson'];
        let isExist = false;
        for (let j = 0; j < arr2.length; j++) {
            let jArr = arr2[j];
            let jArrDay = jArr['day'];
            let jArrLesson = jArr['lesson'];
            if (jArrDay == iArrDay && jArrLesson == iArrLesson) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            if (iArr.lesson && iArr.day) {
                result.push(iArr);
            }
        }
    }
    return result;
}

//处理成目标对象
function getTargetArr(arr) {
    let newArr = [];
    arr.map((el) => {
        let obj = {
            day: el.day,
            lessonsIndex: [],
        };
        let lessonArr = el.sort;
        obj.lessonsIndex.push(lessonArr);
        newArr.push(obj);
    });
    return newArr;
}

//将数组对象[{day: 1,lessonIndex: 1,},{day: 1, lessonIndex: 2}]处理成[{day:1, lessonIndex: [1,2]}]
export function getWeekDayLesson(arr) {
    let resultArr = [];
    let saveObj = {};
    let targetArr = getTargetArr(arr);
    targetArr.map((el) => {
        if (!saveObj[el.weekDay]) {
            resultArr.push(el);
            saveObj[el.weekDay] = true;
        } else {
            resultArr.map((item) => {
                if (item.weekDay == el.weekDay) {
                    item.ort = item.lessonsIndex.concat(el.sort);
                }
            });
        }
    });
    return resultArr;
}

//将数组对象[{id: 1, value: [1]}, {id: 2, value: [2]}]处理成[{id: 1, value: [1,2]}, {id: 2, value: [1,2]}]
export function getIdValueArr(arr) {
    let resultArr = [];
    let saveObj = {};
    arr.map((el) => {
        if (!saveObj[el.id]) {
            resultArr.push(el);
            saveObj[el.id] = true;
        } else {
            resultArr.map((item) => {
                if (item.id == el.id) {
                    item.value = Array.from(new Set(item.value.concat(el.value)));
                }
            });
        }
    });
    return resultArr;
}

// 获取url参数
export function getUrlSearch(name) {
    // 未传参，返回空
    if (!name) return null;
    // 查询参数：先通过search取值，如果取不到就通过hash来取
    var after = window.location.search;
    after = window.location.hash.split('?')[1] || after.substr(1);
    // 地址栏URL没有查询参数，返回空
    if (!after) return null;
    // 如果查询参数中没有"name"，返回空
    if (after.indexOf(name) === -1) return null;

    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    // 当地址栏参数存在中文时，需要解码，不然会乱码
    var r = decodeURI(after).match(reg);
    // 如果url中"name"没有值，返回空
    if (!r) return null;

    return r[2];
}

// 乘法精度处理
export function numMulti(num1, num2) {
    var baseNum = 0;
    try {
        baseNum += num1.toString().split('.')[1].length;
    } catch (e) {}
    try {
        baseNum += num2.toString().split('.')[1].length;
    } catch (e) {}
    return (
        (Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', ''))) /
        Math.pow(10, baseNum)
    );
}

// 计算时间差
export function calculateTime(startTime, endTime) {
    var start1 = (startTime && startTime.split(':')) || [];
    var startAll = parseInt(start1[0] * 60) + parseInt(start1[1]);

    var end1 = (endTime && endTime.split(':')) || [];
    var endAll = parseInt(end1[0] * 60) + parseInt(end1[1]);

    let result = endAll - startAll + 'min';
    return result;
}

export function calculateDetailTime(time) {
    time = time.replace(/-/g, '/');
    let calculate = new Date(time);
    let preTime = new Date();
    let differ = Math.abs(preTime.getTime() - calculate.getTime());
    let days = Math.floor(differ / (24 * 3600 * 1000));
    //计算出小时数
    let leave1 = differ % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000));
    let result = days + '天' + hours + '小时' + minutes + '分钟';
    return result;
}

//防抖
export function debounce(fn, delay = 500) {
    let timer = null; //timer是闭包中的. 别人是无法修改的
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.call(this, ...arguments);
        }, delay);
    };
}

//导出ExcelPOST表单公共方法
export function mockForm(url, query) {
    const form = document.createElement('form');
    form.id = 'form-file-download';
    form.name = 'form-file-download';
    document.body.appendChild(form);
    for (const key in query) {
        if (query[key] !== undefined && Object.hasOwnProperty.call(query, key)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = query[key];
            form.appendChild(input);
        }
    }
    form.method = 'POST';
    form.target = '_blank';
    form.action = url;
    form.submit();
    document.body.removeChild(form);
}

export function formatTimeSafari(val) {
    if (!val) return;
    if (typeof val === 'number' || typeof val === 'object') return val;
    if (typeof val === 'string') return val.replace(/\-/g, '/');
}
//各个年级
export let gradeValues = [
    { label: '小班', value: '1-2' },
    { label: '中班', value: '1-1' },
    { label: '大班', value: '1-0' },
    { label: '一年级', value: '2-1' },
    { label: '二年级', value: '2-2' },
    { label: '三年级', value: '2-3' },
    { label: '四年级', value: '2-4' },
    { label: '五年级', value: '2-5' },
    { label: '六年级', value: '2-6' },
    { label: '七年级', value: '3-7' },
    { label: '八年级', value: '3-8' },
    { label: '九年级', value: '3-9' },
    { label: '十年级', value: '4-10' },
    { label: '十一年级', value: '4-11' },
    { label: '十二年级', value: '4-12' },
];
export { config };

export function getSchoolId() {
    let planMsg = localStorage.getItem('planMsg');
    let schoolId =
        planMsg &&
        planMsg.administratorList &&
        planMsg.administratorList.length > 0 &&
        planMsg.administratorList[0].id;
    return schoolId;
}

export function getLength(str) {
    var len = str.length;
    var reLen = 0;
    for (var i = 0; i < len; i++) {
        if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
            // 全角
            reLen += 2;
        } else {
            reLen++;
        }
    }
    return reLen;
}

export function judgeTimeIsSame(arr) {
    if (arr && arr.length == 1) {
        return false;
    }
    let sameOrNot = true;
    arr.some((cur, idx, array) =>
        array
            .slice(idx + 1)
            .find(
                (item) =>
                    cur.startTimeString == item.startTimeString &&
                    cur.endTimeString == item.endTimeString
            )
    )
        ? (sameOrNot = false)
        : (sameOrNot = true);
    return sameOrNot;
}

//POST请求下载文件流
export function downloadFileByPost(url, params, excelName) {
    let xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(params));
    xhr.responseType = 'blob';
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function (ev) {
            if (xhr.readyState == 4) {
                let blob = ev.target.response;
                console.log(ev, 'ev');
                if (blob) {
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = function (e) {
                        let aEle = document.createElement('a');
                        aEle.download = `${excelName}.xls`;
                        aEle.href = e.target.result;
                        aEle.target = '_blank';
                        aEle.click();
                    };
                    resolve(reader.onload);
                }
            }
        };
    });
}
//禁止滚动条滚动
export const stopScroll = () => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = '0px';
    document.body.style.width = '100%';
};

//允许滚动条滚动
export const openScroll = () => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.position = 'static';
};

export const delayDateList = [
    [
        { name: '托班', stage: 1, gradeList: [-3], time: null },
        { name: '小班', stage: 1, gradeList: [-2], time: null },
        { name: '中班', stage: 1, gradeList: [-1], time: null },
        { name: '大班', stage: 1, gradeList: [0], time: null },
    ],
    [
        { name: '一年级', stage: 2, gradeList: [1], time: null },
        { name: '二年级', stage: 2, gradeList: [2], time: null },
        { name: '三年级', stage: 2, gradeList: [3], time: null },
        { name: '四年级', stage: 2, gradeList: [4], time: null },
        { name: '五年级', stage: 2, gradeList: [5], time: null },
        { name: '六年级', stage: 2, gradeList: [6], time: null },
    ],
    [
        { name: '七年级', stage: 3, gradeList: [7], time: null },
        { name: '八年级', stage: 3, gradeList: [8], time: null },
        { name: '九年级', stage: 3, gradeList: [9], time: null },
    ],
    [
        { name: '十年级', stage: 4, gradeList: [10], time: null },
        { name: '十一年级', stage: 4, gradeList: [11], time: null },
        { name: '十二年级', stage: 4, gradeList: [12], time: null },
    ],
];

export const eduBrainList = [
    { label: '学校动态', key: 'EduBrain_SchoolStatus' },
    { label: '教师概况', key: 'EduBrain_TeacherOverview' },
    { label: '教学常规', key: 'EduBrain_TaskOverview' },
    { label: '家长学堂', key: 'EduBrain_ParentClass' },
    { label: '校本资源', key: 'EduBrain_SchoolResources' },
    { label: '阅读画像', key: 'EduBrain_ReadingOverview' },
    { label: '素养成长', key: 'EduBrain_Literacy growth' },
    { label: '荣誉活动', key: 'EduBrain_HonorAwards' },
    { label: '健康体能', key: 'EduBrain_HealthFitness' },
    { label: '招生进展', key: 'EduBrain_RecruitStudent' },
    { label: '党建活动', key: 'EduBrain_PartyBuildingActivities' },
];

export function weekDayAbbreviationEn(weekDay) {
    var enArr = ['零', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return enArr[weekDay];
}
