webpackJsonp([47],{"/CU6":function(e,i,n){"use strict";function r(e){var i=t();return function(){var n,r=(0,d.default)(e);if(i){var t=(0,d.default)(this).constructor;n=Reflect.construct(r,arguments,t)}else n=r.apply(this,arguments);return(0,l.default)(this,n)}}function t(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var o=n("mhuh"),a=n("ouCL");Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var s=a(n("Q9dM")),u=a(n("wm7F")),c=a(n("QwVp")),l=a(n("F6AD")),d=a(n("fghW")),b=o(n("GiK3")),f=n("oAV5"),w=n("7tnA"),m=function(e){function i(){return(0,s.default)(this,i),n.apply(this,arguments)}(0,c.default)(i,e);var n=r(i);return(0,u.default)(i,[{key:"componentDidMount",value:function(){var e=this.props.history,i=(0,f.getUrlSearch)("requestId");console.log("requestId :>> ",i),console.log("isMobile :>> ",w.isMobile),w.isMobile?i?e.push("/replace/mobile/application/index?requestId=".concat(i)):e.push("/replace/mobile/index"):i?e.push("/replace/index/application?requestId=".concat(i)):e.push("/replace/index")}},{key:"render",value:function(){return b.default.createElement("div",{style:{width:"100%",height:"100%",backgroundColor:"#fff"}})}}]),i}(b.PureComponent);i.default=m},"1cEi":function(e,i,n){var r;!function(t,o){"use strict";var a="model",s="name",u="type",c="vendor",l="version",d="mobile",b="tablet",f="smarttv",w=function(e,i){var n={};for(var r in e)i[r]&&i[r].length%2==0?n[r]=i[r].concat(e[r]):n[r]=e[r];return n},m=function(e){for(var i={},n=0;n<e.length;n++)i[e[n].toUpperCase()]=e[n];return i},p=function(e,i){return"string"==typeof e&&-1!==h(i).indexOf(h(e))},h=function(e){return e.toLowerCase()},v=function(e){return"string"==typeof e?e.replace(/[^\d\.]/g,"").split(".")[0]:void 0},g=function(e,i){if("string"==typeof e)return e=e.replace(/^\s\s*/,""),void 0===i?e:e.substring(0,350)},y=function(e,i){for(var n,r,t,o,a,s,u=0;u<i.length&&!a;){var c=i[u],l=i[u+1];for(n=r=0;n<c.length&&!a&&c[n];)if(a=c[n++].exec(e))for(t=0;t<l.length;t++)s=a[++r],o=l[t],"object"==typeof o&&o.length>0?2===o.length?"function"==typeof o[1]?this[o[0]]=o[1].call(this,s):this[o[0]]=o[1]:3===o.length?"function"!=typeof o[1]||o[1].exec&&o[1].test?this[o[0]]=s?s.replace(o[1],o[2]):void 0:this[o[0]]=s?o[1].call(this,s,o[2]):void 0:4===o.length&&(this[o[0]]=s?o[3].call(this,s.replace(o[1],o[2])):void 0):this[o]=s||void 0;u+=2}},x=function(e,i){for(var n in i)if("object"==typeof i[n]&&i[n].length>0){for(var r=0;r<i[n].length;r++)if(p(i[n][r],e))return"?"===n?void 0:n}else if(p(i[n],e))return"?"===n?void 0:n;return e},O={"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"},S={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},k={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[l,[s,"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[l,[s,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[s,l],[/opios[\/ ]+([\w\.]+)/i],[l,[s,"Opera Mini"]],[/\bopr\/([\w\.]+)/i],[l,[s,"Opera"]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,/(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,/(ba?idubrowser)[\/ ]?([\w\.]+)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,/(heytap|ovi)browser\/([\d\.]+)/i,/(weibo)__([\d\.]+)/i],[s,l],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[l,[s,"UCBrowser"]],[/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i],[l,[s,"WeChat(Win) Desktop"]],[/micromessenger\/([\w\.]+)/i],[l,[s,"WeChat"]],[/konqueror\/([\w\.]+)/i],[l,[s,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[l,[s,"IE"]],[/ya(?:search)?browser\/([\w\.]+)/i],[l,[s,"Yandex"]],[/(avast|avg)\/([\w\.]+)/i],[[s,/(.+)/,"$1 Secure Browser"],l],[/\bfocus\/([\w\.]+)/i],[l,[s,"Firefox Focus"]],[/\bopt\/([\w\.]+)/i],[l,[s,"Opera Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[l,[s,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[l,[s,"Dolphin"]],[/coast\/([\w\.]+)/i],[l,[s,"Opera Coast"]],[/miuibrowser\/([\w\.]+)/i],[l,[s,"MIUI Browser"]],[/fxios\/([-\w\.]+)/i],[l,[s,"Firefox"]],[/\bqihu|(qi?ho?o?|360)browser/i],[[s,"360 Browser"]],[/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i],[[s,/(.+)/,"$1 Browser"],l],[/(comodo_dragon)\/([\w\.]+)/i],[[s,/_/g," "],l],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i],[s,l],[/(metasr)[\/ ]?([\w\.]+)/i,/(lbbrowser)/i,/\[(linkedin)app\]/i],[s],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[s,"Facebook"],l],[/(kakao(?:talk|story))[\/ ]([\w\.]+)/i,/(naver)\(.*?(\d+\.[\w\.]+).*\)/i,/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i],[s,l],[/\bgsa\/([\w\.]+) .*safari\//i],[l,[s,"GSA"]],[/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],[l,[s,"TikTok"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[l,[s,"Chrome Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[s,"Chrome WebView"],l],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[l,[s,"Android Browser"]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[s,l],[/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],[l,[s,"Mobile Safari"]],[/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],[l,s],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[s,[l,x,O]],[/(webkit|khtml)\/([\w\.]+)/i],[s,l],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[s,"Netscape"],l],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[l,[s,"Firefox Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i,/panasonic;(viera)/i],[s,l],[/(cobalt)\/([\w\.]+)/i],[s,[l,/master.|lts./,""]]],cpu:[[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],[["architecture","amd64"]],[/(ia32(?=;))/i],[["architecture",h]],[/((?:i[346]|x)86)[;\)]/i],[["architecture","ia32"]],[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],[["architecture","arm64"]],[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],[["architecture","armhf"]],[/windows (ce|mobile); ppc;/i],[["architecture","arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],[["architecture",/ower/,"",h]],[/(sun4\w)[;\)]/i],[["architecture","sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],[["architecture",h]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[a,[c,"Samsung"],[u,b]],[/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,/samsung[- ]([-\w]+)/i,/sec-(sgh\w+)/i],[a,[c,"Samsung"],[u,d]],[/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],[a,[c,"Apple"],[u,d]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[a,[c,"Apple"],[u,b]],[/(macintosh);/i],[a,[c,"Apple"]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[a,[c,"Sharp"],[u,d]],[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],[a,[c,"Huawei"],[u,b]],[/(?:huawei|honor)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i],[a,[c,"Huawei"],[u,d]],[/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],[[a,/_/g," "],[c,"Xiaomi"],[u,d]],[/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],[[a,/_/g," "],[c,"Xiaomi"],[u,b]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[a,[c,"OPPO"],[u,d]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[a,[c,"Vivo"],[u,d]],[/\b(rmx[12]\d{3})(?: bui|;|\))/i],[a,[c,"Realme"],[u,d]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[a,[c,"Motorola"],[u,d]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[a,[c,"Motorola"],[u,b]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[a,[c,"LG"],[u,b]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,/\blg-?([\d\w]+) bui/i],[a,[c,"LG"],[u,d]],[/(ideatab[-\w ]+)/i,/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],[a,[c,"Lenovo"],[u,b]],[/(?:maemo|nokia).*(n900|lumia \d+)/i,/nokia[-_ ]?([-\w\.]*)/i],[[a,/_/g," "],[c,"Nokia"],[u,d]],[/(pixel c)\b/i],[a,[c,"Google"],[u,b]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[a,[c,"Google"],[u,d]],[/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[a,[c,"Sony"],[u,d]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[a,"Xperia Tablet"],[c,"Sony"],[u,b]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[a,[c,"OnePlus"],[u,d]],[/(alexa)webm/i,/(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[a,[c,"Amazon"],[u,b]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[a,/(.+)/g,"Fire Phone $1"],[c,"Amazon"],[u,d]],[/(playbook);[-\w\),; ]+(rim)/i],[a,c,[u,b]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[a,[c,"BlackBerry"],[u,d]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[a,[c,"ASUS"],[u,b]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[a,[c,"ASUS"],[u,d]],[/(nexus 9)/i],[a,[c,"HTC"],[u,b]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i],[c,[a,/_/g," "],[u,d]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[a,[c,"Acer"],[u,b]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[a,[c,"Meizu"],[u,d]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,/(hp) ([\w ]+\w)/i,/(asus)-?(\w+)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w]+)/i,/(jolla)/i,/(oppo) ?([\w ]+) bui/i],[c,a,[u,d]],[/(kobo)\s(ereader|touch)/i,/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i,/(nook)[\w ]+build\/(\w+)/i,/(dell) (strea[kpr\d ]*[\dko])/i,/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,/(trinity)[- ]*(t\d{3}) bui/i,/(gigaset)[- ]+(q\w{1,9}) bui/i,/(vodafone) ([\w ]+)(?:\)| bui)/i],[c,a,[u,b]],[/(surface duo)/i],[a,[c,"Microsoft"],[u,b]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[a,[c,"Fairphone"],[u,d]],[/(u304aa)/i],[a,[c,"AT&T"],[u,d]],[/\bsie-(\w*)/i],[a,[c,"Siemens"],[u,d]],[/\b(rct\w+) b/i],[a,[c,"RCA"],[u,b]],[/\b(venue[\d ]{2,7}) b/i],[a,[c,"Dell"],[u,b]],[/\b(q(?:mv|ta)\w+) b/i],[a,[c,"Verizon"],[u,b]],[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],[a,[c,"Barnes & Noble"],[u,b]],[/\b(tm\d{3}\w+) b/i],[a,[c,"NuVision"],[u,b]],[/\b(k88) b/i],[a,[c,"ZTE"],[u,b]],[/\b(nx\d{3}j) b/i],[a,[c,"ZTE"],[u,d]],[/\b(gen\d{3}) b.+49h/i],[a,[c,"Swiss"],[u,d]],[/\b(zur\d{3}) b/i],[a,[c,"Swiss"],[u,b]],[/\b((zeki)?tb.*\b) b/i],[a,[c,"Zeki"],[u,b]],[/\b([yr]\d{2}) b/i,/\b(dragon[- ]+touch |dt)(\w{5}) b/i],[[c,"Dragon Touch"],a,[u,b]],[/\b(ns-?\w{0,9}) b/i],[a,[c,"Insignia"],[u,b]],[/\b((nxa|next)-?\w{0,9}) b/i],[a,[c,"NextBook"],[u,b]],[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[c,"Voice"],a,[u,d]],[/\b(lvtel\-)?(v1[12]) b/i],[[c,"LvTel"],a,[u,d]],[/\b(ph-1) /i],[a,[c,"Essential"],[u,d]],[/\b(v(100md|700na|7011|917g).*\b) b/i],[a,[c,"Envizen"],[u,b]],[/\b(trio[-\w\. ]+) b/i],[a,[c,"MachSpeed"],[u,b]],[/\btu_(1491) b/i],[a,[c,"Rotor"],[u,b]],[/(shield[\w ]+) b/i],[a,[c,"Nvidia"],[u,b]],[/(sprint) (\w+)/i],[c,a,[u,d]],[/(kin\.[onetw]{3})/i],[[a,/\./g," "],[c,"Microsoft"],[u,d]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[a,[c,"Zebra"],[u,b]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[a,[c,"Zebra"],[u,d]],[/smart-tv.+(samsung)/i],[c,[u,f]],[/hbbtv.+maple;(\d+)/i],[[a,/^/,"SmartTV"],[c,"Samsung"],[u,f]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[c,"LG"],[u,f]],[/(apple) ?tv/i],[c,[a,"Apple TV"],[u,f]],[/crkey/i],[[a,"Chromecast"],[c,"Google"],[u,f]],[/droid.+aft(\w+)( bui|\))/i],[a,[c,"Amazon"],[u,f]],[/\(dtv[\);].+(aquos)/i,/(aquos-tv[\w ]+)\)/i],[a,[c,"Sharp"],[u,f]],[/(bravia[\w ]+)( bui|\))/i],[a,[c,"Sony"],[u,f]],[/(mitv-\w{5}) bui/i],[a,[c,"Xiaomi"],[u,f]],[/Hbbtv.*(technisat) (.*);/i],[c,a,[u,f]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i],[[c,g],[a,g],[u,f]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[u,f]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[c,a,[u,"console"]],[/droid.+; (shield) bui/i],[a,[c,"Nvidia"],[u,"console"]],[/(playstation [345portablevi]+)/i],[a,[c,"Sony"],[u,"console"]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[a,[c,"Microsoft"],[u,"console"]],[/((pebble))app/i],[c,a,[u,"wearable"]],[/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],[a,[c,"Apple"],[u,"wearable"]],[/droid.+; (glass) \d/i],[a,[c,"Google"],[u,"wearable"]],[/droid.+; (wt63?0{2,3})\)/i],[a,[c,"Zebra"],[u,"wearable"]],[/(quest( 2| pro)?)/i],[a,[c,"Facebook"],[u,"wearable"]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[c,[u,"embedded"]],[/(aeobc)\b/i],[a,[c,"Amazon"],[u,"embedded"]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],[a,[u,d]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[a,[u,b]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[u,b]],[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],[[u,d]],[/(android[-\w\. ]{0,9});.+buil/i],[a,[c,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[l,[s,"EdgeHTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[l,[s,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i,/\b(libweb)/i],[s,l],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[l,s]],os:[[/microsoft (windows) (vista|xp)/i],[s,l],[/(windows) nt 6\.2; (arm)/i,/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,/(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i],[s,[l,x,S]],[/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[s,"Windows"],[l,x,S]],[/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,/(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,/cfnetwork\/.+darwin/i],[[l,/_/g,"."],[s,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[s,"Mac OS"],[l,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],[l,s],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,/(blackberry)\w*\/([\w\.]*)/i,/(tizen|kaios)[\/ ]([\w\.]+)/i,/\((series40);/i],[s,l],[/\(bb(10);/i],[l,[s,"BlackBerry"]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],[l,[s,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[l,[s,"Firefox OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[l,[s,"webOS"]],[/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],[l,[s,"watchOS"]],[/crkey\/([\d\.]+)/i],[l,[s,"Chromecast"]],[/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],[[s,"Chromium OS"],l],[/panasonic;(viera)/i,/(netrange)mmh/i,/(nettv)\/(\d+\.[\w\.]+)/i,/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux) ?([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[s,l],[/(sunos) ?([\w\.\d]*)/i],[[s,"Solaris"],l],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,/(unix) ?([\w\.]*)/i],[s,l]]},E=function(e,i){if("object"==typeof e&&(i=e,e=void 0),!(this instanceof E))return new E(e,i).getResult();var n=void 0!==t&&t.navigator?t.navigator:void 0,r=e||(n&&n.userAgent?n.userAgent:""),o=n&&n.userAgentData?n.userAgentData:void 0,f=i?w(k,i):k,m=n&&n.userAgent==r;return this.getBrowser=function(){var e={};return e[s]=void 0,e[l]=void 0,y.call(e,r,f.browser),e.major=v(e[l]),m&&n&&n.brave&&"function"==typeof n.brave.isBrave&&(e[s]="Brave"),e},this.getCPU=function(){var e={};return e.architecture=void 0,y.call(e,r,f.cpu),e},this.getDevice=function(){var e={};return e[c]=void 0,e[a]=void 0,e[u]=void 0,y.call(e,r,f.device),m&&!e[u]&&o&&o.mobile&&(e[u]=d),m&&"Macintosh"==e[a]&&n&&void 0!==n.standalone&&n.maxTouchPoints&&n.maxTouchPoints>2&&(e[a]="iPad",e[u]=b),e},this.getEngine=function(){var e={};return e[s]=void 0,e[l]=void 0,y.call(e,r,f.engine),e},this.getOS=function(){var e={};return e[s]=void 0,e[l]=void 0,y.call(e,r,f.os),m&&!e[s]&&o&&"Unknown"!=o.platform&&(e[s]=o.platform.replace(/chrome os/i,"Chromium OS").replace(/macos/i,"Mac OS")),e},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return r},this.setUA=function(e){return r="string"==typeof e&&e.length>350?g(e,350):e,this},this.setUA(r),this};E.VERSION="1.0.36",E.BROWSER=m([s,l,"major"]),E.CPU=m(["architecture"]),E.DEVICE=m([a,c,u,"console",d,f,b,"wearable","embedded"]),E.ENGINE=E.OS=m([s,l]),void 0!==i?(void 0!==e&&e.exports&&(i=e.exports=E),i.UAParser=E):n("nErl")?void 0!==(r=function(){return E}.call(i,n,i,e))&&(e.exports=r):void 0!==t&&(t.UAParser=E);var C=void 0!==t&&(t.jQuery||t.Zepto);if(C&&!C.ua){var A=new E;C.ua=A.getResult(),C.ua.get=function(){return A.getUA()},C.ua.set=function(e){A.setUA(e);var i=A.getResult();for(var n in i)C.ua[n]=i[n]}}}("object"==typeof window?window:this)},"5lke":function(e,i){function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(i){return"function"==typeof Symbol&&"symbol"===n(Symbol.iterator)?e.exports=r=function(e){return n(e)}:e.exports=r=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":n(e)},r(i)}e.exports=r},"7tnA":function(e,i,n){"use strict";function r(e,i){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);i&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),n.push.apply(n,r)}return n}function t(e){for(var i=1;i<arguments.length;i++){var n=null!=arguments[i]?arguments[i]:{};i%2?r(Object(n),!0).forEach(function(i){c(e,i,n[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach(function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(n,i))})}return e}function o(e){"@babel/helpers - typeof";return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}function s(e,i){for(var n=0;n<i.length;n++){var r=i[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,i,n){return i&&s(e.prototype,i),n&&s(e,n),e}function c(e,i,n){return i in e?Object.defineProperty(e,i,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[i]=n,e}function l(){return l=Object.assign||function(e){for(var i=1;i<arguments.length;i++){var n=arguments[i];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}function d(e,i){if("function"!=typeof i&&null!==i)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(i&&i.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),i&&f(e,i)}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e,i){return(f=Object.setPrototypeOf||function(e,i){return e.__proto__=i,e})(e,i)}function w(e,i){if(null==e)return{};var n,r,t={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],i.indexOf(n)>=0||(t[n]=e[n]);return t}function m(e,i){if(null==e)return{};var n,r,t=w(e,i);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],i.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(t[n]=e[n])}return t}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(e,i){if(i&&("object"==typeof i||"function"==typeof i))return i;if(void 0!==i)throw new TypeError("Derived constructors may only return object or undefined");return p(e)}function v(e,i){return g(e)||y(e,i)||x(e,i)||S()}function g(e){if(Array.isArray(e))return e}function y(e,i){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,t,o=[],a=!0,s=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(o.push(r.value),!i||o.length!==i);a=!0);}catch(e){s=!0,t=e}finally{try{a||null==n.return||n.return()}finally{if(s)throw t}}return o}}function x(e,i){if(e){if("string"==typeof e)return O(e,i);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?O(e,i):void 0}}function O(e,i){(null==i||i>e.length)&&(i=e.length);for(var n=0,r=new Array(i);n<i;n++)r[n]=e[n];return r}function S(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function k(e){var i=e?z(e):q,n=i.device,r=i.browser,t=i.engine,o=i.os,a=i.ua,s=Z(n.type),u=s.isBrowser,c=s.isMobile,l=s.isTablet,d=s.isSmartTV,b=s.isConsole,f=s.isWearable,w=s.isEmbedded;return u?K(u,r,t,o,a):d?ee(d,t,o,a):b?ie(b,t,o,a):c?J(s,n,o,a):l?J(s,n,o,a):f?ne(f,t,o,a):w?re(w,n,t,o,a):void 0}function E(e){var i=e||q,n=i.device,r=i.browser,t=i.os,o=i.engine,a=i.ua;return{isSmartTV:se(n),isConsole:le(n),isWearable:ce(n),isEmbedded:de(n),isMobileSafari:Pe(r)||ze(),isChromium:ke(r),isMobile:ae(n)||ze(),isMobileOnly:te(n),isTablet:oe(n)||ze(),isBrowser:ue(n),isDesktop:ue(n),isAndroid:me(t),isWinPhone:ve(t),isIOS:ge(t)||ze(),isChrome:Oe(r),isFirefox:Se(r),isSafari:Ae(r),isOpera:Me(r),isIE:je(r),osVersion:ye(t),osName:xe(t),fullBrowserVersion:We(r),browserVersion:Fe(r),browserName:Ve(r),mobileVendor:be(n),mobileModel:fe(n),engineName:Ie(o),engineVersion:Ne(o),getUA:Re(a),isEdge:Ee(r)||Be(a),isYandex:Ce(r),deviceType:we(n),isIOS13:Le(),isIPad13:ze(),isIPhone13:qe(),isIPod13:De(),isElectron:Ue(),isEdgeChromium:Be(a),isLegacyEdge:Ee(r)&&!Be(a),isWindows:pe(t),isMacOs:he(t),isMIUI:Te(r),isSamsungBrowser:_e(r)}}function C(e){return function(i){function n(e){var i;return a(this,n),i=h(this,b(n).call(this,e)),i.isEventListenerAdded=!1,i.handleOrientationChange=i.handleOrientationChange.bind(p(i)),i.onOrientationChange=i.onOrientationChange.bind(p(i)),i.onPageLoad=i.onPageLoad.bind(p(i)),i.state={isLandscape:!1,isPortrait:!1},i}return d(n,i),u(n,[{key:"handleOrientationChange",value:function(){this.isEventListenerAdded||(this.isEventListenerAdded=!0);var e=window.innerWidth>window.innerHeight?90:0;this.setState({isPortrait:0===e,isLandscape:90===e})}},{key:"onOrientationChange",value:function(){this.handleOrientationChange()}},{key:"onPageLoad",value:function(){this.handleOrientationChange()}},{key:"componentDidMount",value:function(){void 0!==("undefined"==typeof window?"undefined":o(window))&&$e&&(this.isEventListenerAdded?window.removeEventListener("load",this.onPageLoad,!1):(this.handleOrientationChange(),window.addEventListener("load",this.onPageLoad,!1)),window.addEventListener("resize",this.onOrientationChange,!1))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.onOrientationChange,!1)}},{key:"render",value:function(){return T.createElement(e,l({},this.props,{isLandscape:this.state.isLandscape,isPortrait:this.state.isPortrait}))}}]),n}(T.Component)}function A(){var e=j.useState(function(){var e=window.innerWidth>window.innerHeight?90:0;return{isPortrait:0===e,isLandscape:90===e,orientation:0===e?"portrait":"landscape"}}),i=v(e,2),n=i[0],r=i[1],t=j.useCallback(function(){var e=window.innerWidth>window.innerHeight?90:0,i={isPortrait:0===e,isLandscape:90===e,orientation:0===e?"portrait":"landscape"};n.orientation!==i.orientation&&r(i)},[n.orientation]);return j.useEffect(function(){return void 0!==("undefined"==typeof window?"undefined":o(window))&&$e&&(t(),window.addEventListener("load",t,!1),window.addEventListener("resize",t,!1)),function(){window.removeEventListener("resize",t,!1),window.removeEventListener("load",t,!1)}},[t]),n}function P(e){var i=e||window.navigator.userAgent;return z(i)}function M(e){var i=e||window.navigator.userAgent,n=P(i);return[E(n),n]}Object.defineProperty(i,"__esModule",{value:!0});var j=n("GiK3"),T=function(e){return e&&"object"==typeof e&&"default"in e?e.default:e}(j),_=n("1cEi"),W=new _,F=W.getBrowser(),V=W.getCPU(),I=W.getDevice(),N=W.getEngine(),U=W.getOS(),B=W.getUA(),L=function(e){return W.setUA(e)},z=function(e){if(!e)return void console.error("No userAgent string was provided");var i=new _(e);return{UA:i,browser:i.getBrowser(),cpu:i.getCPU(),device:i.getDevice(),engine:i.getEngine(),os:i.getOS(),ua:i.getUA(),setUserAgent:function(e){return i.setUA(e)}}},q=Object.freeze({ClientUAInstance:W,browser:F,cpu:V,device:I,engine:N,os:U,ua:B,setUa:L,parseUserAgent:z}),D={Mobile:"mobile",Tablet:"tablet",SmartTv:"smarttv",Console:"console",Wearable:"wearable",Embedded:"embedded",Browser:void 0},R={Chrome:"Chrome",Firefox:"Firefox",Opera:"Opera",Yandex:"Yandex",Safari:"Safari",InternetExplorer:"Internet Explorer",Edge:"Edge",Chromium:"Chromium",Ie:"IE",MobileSafari:"Mobile Safari",EdgeChromium:"Edge Chromium",MIUI:"MIUI Browser",SamsungBrowser:"Samsung Browser"},G={IOS:"iOS",Android:"Android",WindowsPhone:"Windows Phone",Windows:"Windows",MAC_OS:"Mac OS"},H={isMobile:!1,isTablet:!1,isBrowser:!1,isSmartTV:!1,isConsole:!1,isWearable:!1},Z=function(e){switch(e){case D.Mobile:return{isMobile:!0};case D.Tablet:return{isTablet:!0};case D.SmartTv:return{isSmartTV:!0};case D.Console:return{isConsole:!0};case D.Wearable:return{isWearable:!0};case D.Browser:return{isBrowser:!0};case D.Embedded:return{isEmbedded:!0};default:return H}},Y=function(e){return L(e)},Q=function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"none";return e||i},X=function(){return!("undefined"==typeof window||!window.navigator&&!navigator)&&(window.navigator||navigator)},$=function(e){var i=X();return i&&i.platform&&(-1!==i.platform.indexOf(e)||"MacIntel"===i.platform&&i.maxTouchPoints>1&&!window.MSStream)},K=function(e,i,n,r,t){return{isBrowser:e,browserMajorVersion:Q(i.major),browserFullVersion:Q(i.version),browserName:Q(i.name),engineName:Q(n.name),engineVersion:Q(n.version),osName:Q(r.name),osVersion:Q(r.version),userAgent:Q(t)}},J=function(e,i,n,r){return t({},e,{vendor:Q(i.vendor),model:Q(i.model),os:Q(n.name),osVersion:Q(n.version),ua:Q(r)})},ee=function(e,i,n,r){return{isSmartTV:e,engineName:Q(i.name),engineVersion:Q(i.version),osName:Q(n.name),osVersion:Q(n.version),userAgent:Q(r)}},ie=function(e,i,n,r){return{isConsole:e,engineName:Q(i.name),engineVersion:Q(i.version),osName:Q(n.name),osVersion:Q(n.version),userAgent:Q(r)}},ne=function(e,i,n,r){return{isWearable:e,engineName:Q(i.name),engineVersion:Q(i.version),osName:Q(n.name),osVersion:Q(n.version),userAgent:Q(r)}},re=function(e,i,n,r,t){return{isEmbedded:e,vendor:Q(i.vendor),model:Q(i.model),engineName:Q(n.name),engineVersion:Q(n.version),osName:Q(r.name),osVersion:Q(r.version),userAgent:Q(t)}},te=function(e){return e.type===D.Mobile},oe=function(e){return e.type===D.Tablet},ae=function(e){var i=e.type;return i===D.Mobile||i===D.Tablet},se=function(e){return e.type===D.SmartTv},ue=function(e){return e.type===D.Browser},ce=function(e){return e.type===D.Wearable},le=function(e){return e.type===D.Console},de=function(e){return e.type===D.Embedded},be=function(e){var i=e.vendor;return Q(i)},fe=function(e){var i=e.model;return Q(i)},we=function(e){var i=e.type;return Q(i,"browser")},me=function(e){return e.name===G.Android},pe=function(e){return e.name===G.Windows},he=function(e){return e.name===G.MAC_OS},ve=function(e){return e.name===G.WindowsPhone},ge=function(e){return e.name===G.IOS},ye=function(e){var i=e.version;return Q(i)},xe=function(e){var i=e.name;return Q(i)},Oe=function(e){return e.name===R.Chrome},Se=function(e){return e.name===R.Firefox},ke=function(e){return e.name===R.Chromium},Ee=function(e){return e.name===R.Edge},Ce=function(e){return e.name===R.Yandex},Ae=function(e){var i=e.name;return i===R.Safari||i===R.MobileSafari},Pe=function(e){return e.name===R.MobileSafari},Me=function(e){return e.name===R.Opera},je=function(e){var i=e.name;return i===R.InternetExplorer||i===R.Ie},Te=function(e){return e.name===R.MIUI},_e=function(e){return e.name===R.SamsungBrowser},We=function(e){var i=e.version;return Q(i)},Fe=function(e){var i=e.major;return Q(i)},Ve=function(e){var i=e.name;return Q(i)},Ie=function(e){var i=e.name;return Q(i)},Ne=function(e){var i=e.version;return Q(i)},Ue=function(){var e=X(),i=e&&e.userAgent&&e.userAgent.toLowerCase();return"string"==typeof i&&/electron/.test(i)},Be=function(e){return"string"==typeof e&&-1!==e.indexOf("Edg/")},Le=function(){var e=X();return e&&(/iPad|iPhone|iPod/.test(e.platform)||"MacIntel"===e.platform&&e.maxTouchPoints>1)&&!window.MSStream},ze=function(){return $("iPad")},qe=function(){return $("iPhone")},De=function(){return $("iPod")},Re=function(e){return Q(e)},Ge=se(I),He=le(I),Ze=ce(I),Ye=de(I),Qe=Pe(F)||ze(),Xe=ke(F),$e=ae(I)||ze(),Ke=te(I),Je=oe(I)||ze(),ei=ue(I),ii=ue(I),ni=me(U),ri=ve(U),ti=ge(U)||ze(),oi=Oe(F),ai=Se(F),si=Ae(F),ui=Me(F),ci=je(F),li=ye(U),di=xe(U),bi=We(F),fi=Fe(F),wi=Ve(F),mi=be(I),pi=fe(I),hi=Ie(N),vi=Ne(N),gi=Re(B),yi=Ee(F)||Be(B),xi=Ce(F),Oi=we(I),Si=Le(),ki=ze(),Ei=qe(),Ci=De(),Ai=Ue(),Pi=Be(B),Mi=Ee(F)&&!Be(B),ji=pe(U),Ti=he(U),_i=Te(F),Wi=_e(F),Fi=function(e){if(!e||"string"!=typeof e)return void console.error("No valid user agent string was provided");var i=z(e);return E({device:i.device,browser:i.browser,os:i.os,engine:i.engine,ua:i.ua})},Vi=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return ni?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Ii=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return ei?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Ni=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return ci?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Ui=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return ti?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Bi=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return $e?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Li=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return Je?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},zi=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return ri?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},qi=function(e){var i=e.renderWithFragment,n=e.children,r=(e.viewClassName,e.style,m(e,["renderWithFragment","children","viewClassName","style"]));return Ke?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Di=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return Ge?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Ri=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return He?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Gi=function(e){var i=e.renderWithFragment,n=e.children,r=m(e,["renderWithFragment","children"]);return Ze?i?T.createElement(j.Fragment,null,n):T.createElement("div",r,n):null},Hi=function(e){var i=e.renderWithFragment,n=e.children,r=(e.viewClassName,e.style,e.condition),t=m(e,["renderWithFragment","children","viewClassName","style","condition"]);return r?i?T.createElement(j.Fragment,null,n):T.createElement("div",t,n):null};i.AndroidView=Vi,i.BrowserTypes=R,i.BrowserView=Ii,i.ConsoleView=Ri,i.CustomView=Hi,i.IEView=Ni,i.IOSView=Ui,i.MobileOnlyView=qi,i.MobileView=Bi,i.OsTypes=G,i.SmartTVView=Di,i.TabletView=Li,i.WearableView=Gi,i.WinPhoneView=zi,i.browserName=wi,i.browserVersion=fi,i.deviceDetect=k,i.deviceType=Oi,i.engineName=hi,i.engineVersion=vi,i.fullBrowserVersion=bi,i.getSelectorsByUserAgent=Fi,i.getUA=gi,i.isAndroid=ni,i.isBrowser=ei,i.isChrome=oi,i.isChromium=Xe,i.isConsole=He,i.isDesktop=ii,i.isEdge=yi,i.isEdgeChromium=Pi,i.isElectron=Ai,i.isEmbedded=Ye,i.isFirefox=ai,i.isIE=ci,i.isIOS=ti,i.isIOS13=Si,i.isIPad13=ki,i.isIPhone13=Ei,i.isIPod13=Ci,i.isLegacyEdge=Mi,i.isMIUI=_i,i.isMacOs=Ti,i.isMobile=$e,i.isMobileOnly=Ke,i.isMobileSafari=Qe,i.isOpera=ui,i.isSafari=si,i.isSamsungBrowser=Wi,i.isSmartTV=Ge,i.isTablet=Je,i.isWearable=Ze,i.isWinPhone=ri,i.isWindows=ji,i.isYandex=xi,i.mobileModel=pi,i.mobileVendor=mi,i.osName=di,i.osVersion=li,i.parseUserAgent=z,i.setUserAgent=Y,i.useDeviceData=P,i.useDeviceSelectors=M,i.useMobileOrientation=A,i.withOrientationChange=C},"95ke":function(e,i){function n(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}e.exports=n},F6AD:function(e,i,n){function r(e,i){return!i||"object"!==t(i)&&"function"!=typeof i?o(e):i}var t=n("5lke"),o=n("95ke");e.exports=r},Q9dM:function(e,i){function n(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}e.exports=n},QwVp:function(e,i,n){function r(e,i){if("function"!=typeof i&&null!==i)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(i&&i.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),i&&t(e,i)}var t=n("j76U");e.exports=r},fghW:function(e,i){function n(i){return e.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},n(i)}e.exports=n},j76U:function(e,i){function n(i,r){return e.exports=n=Object.setPrototypeOf||function(e,i){return e.__proto__=i,e},n(i,r)}e.exports=n},wm7F:function(e,i){function n(e,i){for(var n=0;n<i.length;n++){var r=i[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function r(e,i,r){return i&&n(e.prototype,i),r&&n(e,r),e}e.exports=r}});