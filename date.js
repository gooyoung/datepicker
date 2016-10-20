    (function ($) {
        var lunarInfo = [
           0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
           0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
           0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
           0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
           0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
           0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
           0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
           0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
           0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
           0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
           0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
           0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
           0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
           0x05aa0, 0x076a3, 0x096d0, 0x04bdb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
           0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
           0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
           0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
           0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
           0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
           0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
           0x0d520];//2100;
        var Stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        var Branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        var solarMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        var solarDays = function (y, m) {
            if (m == 1)
                return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
            else
                return (solarMonth[m]);
        }
        /**
        * 返回农历y年闰月
        * @param lunar Year
        * @return Number
        * @eg:var leap = leapMonth(1991) ;//leap=0 leapMonth(1990) 为5
        */
        function leapMonth(y) {
            return (lunarInfo[y - 1900] & 0xf);
        }
        /**
        * 返回农历y年m月的天数
        * @param lunar Year，lunar month
        * @return Number (0 , 29 , 30)
        */
        function lMonthDays(y, m) {
            var leap = leapMonth(y);
            if (leap > 0) {
                if (m <= leap) {
                    return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
                } else if (m == leap + 1) {
                    return ((lunarInfo[y - 1900] & (0x10000 >> 0)) ? 30 : 29);
                } else {
                    return ((lunarInfo[y - 1900] & (0x10000 >> m - 1)) ? 30 : 29);
                }
            } else {
                return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
            }
        }
        /**
        * 返回农历y年一整年的总天数
        * @param lunar Year
        * @return Number
        * @eg:var count = lYearDays(1987) ;//count=387
        */
        function lYearDays(y) {
            var i, sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1) { sum += (lunarInfo[y - 1900] & i) ? 1 : 0; }
            return (sum + leapDays(y));
        };
        /**
        * 返回农历y年闰月的天数 若该年没有闰月则返回0
        * @param lunar Year
        * @return Number (0、29、30)
        * @eg:var leapMonthDay = leapDays(1987) ;//leapMonthDay=29
        */
        function leapDays(y) {
            if (leapMonth(y)) {
                return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
            }
            return (0);
        };
        /**
        * 返回农历y年m月d日对应的公历，有农历闰月的话为 1-13，没有为1-12
        * @param 
        * @return Datetime 
        * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
        */
        var lunar2Solar = function (y, m, d) {
            var offsetdays = 0;
            for (var i = 0; i + 1900 < y; i++) {
                offsetdays += lYearDays(i + 1900)
            }
            for (var i = 1; i < m; i++) {
                offsetdays += lMonthDays(y, i);
            }
            offsetdays += d;
            //return offsetdays;
            var stmap = Date.UTC(1900, 0, 30, 0, 0, 0);
            return new Date(offsetdays * 86400000 + stmap);
            //return new Date(stmap);
        }
        // 公历1900年1月31日起
        var solar2lunar = function (y, m, d) {
            var stmap = Date.UTC(1900, 0, 30, 0, 0, 0);
            var stmap1 = Date.UTC(y, m, d, 0, 0, 0);
            var offsetdays = (stmap1 - stmap) / 86400000;
            var ly, lm, ld, i;
            for (i = 0; offsetdays > 0; i++) {
                offsetdays -= lYearDays(i + 1900);
            }
            if (i > 0) {
                ly = (--i) + 1900;
                offsetdays += lYearDays(ly);
            } else {
                ly = 1900;
            }
            for (i = 1; offsetdays > 0; i++) {
                offsetdays -= lMonthDays(ly, i);
            }
            lm = --i;
            offsetdays += lMonthDays(ly, lm);
            ld = offsetdays;
            return { ly: ly, lm: lm, ld: ld };
        }

        $.fn.date = function (options, Ycallback, Ncallback) {
            var that = $(this);
            var docType = $(this).is('input');
            var nowdate = new Date();
            var indexY = 61, indexM = 6, indexD = 15;
            var selectedY = 61, selectedM = 6, selectedD = 15;
            var yearScroll = null, monthScroll = null, dayScroll = null;
            var isLunar = false;
            var lunar = solar2lunar(nowdate.getFullYear(), nowdate.getMonth(),nowdate.getDate());
            that.attr("lunardate", "农历" + FormatLunarMonth(lunar.lm)+"月" + FormatLunarDay(lunar.ld));
            
            $.fn.date.defaultOptions = {
                beginyear: 1930,                 //日期--年--份开始
                endyear: 2016,                   //日期--年--份结束
                beginmonth: 1,                   //日期--月--份开始
                endmonth: 12,                    //日期--月--份结束
                beginday: 1,                     //日期--日--份开始
                endday: 31,                      //日期--日--份结束
                event: "click",                   //打开日期插件默认方式为点击后后弹出日期 
                show: true
            }
            //用户选项覆盖插件默认选项   
            var opts = $.extend(true, {}, $.fn.date.defaultOptions, options);
            if (!opts.show) {
                that.unbind('click');
            }
            else {
                //绑定事件（默认事件为获取焦点）
                that.bind(opts.event, function () {
                    createUL();      //动态生成控件显示的日期
                    changeType();     //农历阳历切换
                    init_iscroll();   //初始化iscorll 
                    extendOptions();  //显示控件
                    resetInitDate();
                    refreshDate();     //刷新日期
                    bindButton();      //确认或取消选择
                })
            };
            //start="2016" end="2016" showcurrent="true"
            //动态生成控件显示的日期
            function createUL() {
                if ($("#yearwrapper").attr("start") != null) {
                    opts.beginyear = parseInt($("#yearwrapper").attr("start"));
                }
                if ($("#yearwrapper").attr("end") != null) {
                    opts.endyear = parseInt($("#yearwrapper").attr("end"));
                }
                if ($("#yearwrapper").attr("showcurrent") != null) {
                    indexY = selectedY = nowdate.getFullYear() - opts.beginyear + 1;
                    indexM = selectedM = nowdate.getMonth() + 1;
                    indexD = selectedD = nowdate.getDate();
                }
                $("#yearwrapper ul").html(createYEAR_UL());
                $("#monthwrapper ul").html(createMONTH_UL());
                $("#daywrapper ul").html(createDAY_UL());
            }
            // 公历农历切换
            function changeType() {
                $('#solarRadio').unbind('click').click(function () {
                    //unbind() 方法移除被选元素的事件处理程序
                    if (isLunar == false) { return }
                    isLunar = false;
                    var date = lunar2Solar(opts.beginyear - 1 + indexY, indexM, indexD);
                    indexY = date.getFullYear() - opts.beginyear + 1;
                    indexM = date.getMonth() + 1;
                    indexD = date.getDate();
                    $("#yearwrapper ul").html(createYEAR_UL());
                    $("#monthwrapper ul").html(createMONTH_UL());
                    $("#daywrapper ul").html(createDAY_UL());
                    refreshDate();
                });
                $('#lunarRadio').unbind('click').click(function () {
                    if (isLunar == true) { return }
                    isLunar = true;
                    var date = solar2lunar(opts.beginyear - 1 + indexY, indexM - 1, indexD);
                    indexY = date.ly - opts.beginyear + 1;;
                    indexM = date.lm;
                    indexD = date.ld;
                    $("#yearwrapper ul").html(createYEAR_UL());
                    $("#monthwrapper ul").html(createMONTH_UL());
                    $("#daywrapper ul").html(createDAY_UL());
                    refreshDate();
                });
            }
            // 日期滑动
            function init_iscroll() {
                var userAgentInfo = navigator.userAgent;
                var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "MQQBrowser"];
                var flag = true;
                // 判断是否在手机端
                for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag == true) {
                    //pc日期滑动
                    function init_iScroll_pc() {
                        yearScroll = new IScroll('#yearwrapper', {
                            // snap: "li",
                            mouseWheel: true,
                            momentum: false,
                            // startY: 400
                            // keyBindings:true
                        });
                        yearScroll.on('scrollEnd', function () {
                            indexY = (this.y / 40) * (-1) + 1;
                            $("#monthwrapper ul").html(createMONTH_UL());
                            $("#daywrapper ul").html(createDAY_UL());
                            monthScroll.refresh();
                            dayScroll.refresh();
                        });
                        monthScroll = new IScroll("#monthwrapper", {
                            // snap: "li", 
                            mouseWheel: true,
                            momentum: false,
                            // keyBindings:true
                        });
                        monthScroll.on('scrollEnd', function () {
                            indexM = (this.y / 40) * (-1) + 1;
                            $("#daywrapper ul").html(createDAY_UL());
                            dayScroll.refresh();
                        });
                        dayScroll = new IScroll("#daywrapper", {
                            // snap: "li", 
                            mouseWheel: true,
                            momentum: false,
                            // keyBindings:true
                        });
                        dayScroll.on('scrollEnd', function () {
                            indexD = (this.y / 40) * (-1) + 1;
                        });
                    }
                    init_iScroll_pc();
                } else {
                    //mb日期滑动
                    function init_iScroll_mb() {
                        yearScroll = new iScroll("yearwrapper", {
                            snap: "li", vScrollbar: false,    //隐藏滚动条
                            onScrollEnd: function () {
                                indexY = (this.y / 40) * (-1) + 1;
                                if (isLunar) {
                                    $("#monthwrapper ul").html(createMONTH_UL());
                                } else {
                                    $("#monthwrapper ul").html(createMONTH_UL());
                                }
                                $("#daywrapper ul").html(createDAY_UL());
                                monthScroll.refresh();
                                dayScroll.refresh();
                            }
                        });
                        monthScroll = new iScroll("monthwrapper", {
                            snap: "li", vScrollbar: false,
                            onScrollEnd: function () {
                                indexM = (this.y / 40) * (-1) + 1;
                                $("#daywrapper ul").html(createDAY_UL());
                                dayScroll.refresh();
                            }
                        });
                        dayScroll = new iScroll("daywrapper", {
                            snap: "li", vScrollbar: false,
                            onScrollEnd: function () {
                                indexD = (this.y / 40) * (-1) + 1;
                                dayScroll.refresh();
                            }
                        });
                    }
                    init_iScroll_mb();
                }
            }
            // 显示控件
            function extendOptions() {
                $("#datePage").show();
                $("#dateshadow").show();
            }
            function resetInitDate() {
                indexY = selectedY;
                indexM = selectedM;
                indexD = selectedD;
            }
            // 刷新日期
            function refreshDate() {
                yearScroll.refresh();
                monthScroll.refresh();
                dayScroll.refresh();
                yearScroll.scrollToElement('li:nth-child(' + indexY + ')', 0);
                monthScroll.scrollToElement('li:nth-child(' + indexM + ')', 0);
                dayScroll.scrollToElement('li:nth-child(' + indexD + ')', 0);
            }
            // 确认日期，按确认按钮取数据
            function bindButton() {
                // 确定按钮   li:eq(indexY)匹配第indexY+1个元素
                $("#dateconfirm").unbind('click').click(function () {
                    var datestr = $("#yearwrapper ul li:eq(" + indexY + ")").text() +
                        $("#monthwrapper ul li:eq(" + indexM + ")").text() +
                        $("#daywrapper ul li:eq(" + indexD + ")").text();
                    selectedY = indexY;
                    selectedM = indexM;
                    selectedD = indexD;
                    if (Ycallback === undefined) {
                        if (docType) { that.val(datestr); } else { that.html(datestr); }
                    } else {
                        Ycallback(datestr);
                    }
                    //始终转换为公历用于获取数据
                    var sdate;
                    if (isLunar == true) {
                        var date = lunar2Solar(opts.beginyear - 1 + indexY, indexM, indexD);
                        sdate = date.getFullYear() + "-";
                        if ((date.getMonth() + 1)<10) {
                            sdate = sdate + "0" + [date.getMonth() + 1] + "-";
                        }
                        else {
                            sdate = sdate +  [date.getMonth() + 1] + "-";
                        }
                        if (date.getDate() < 10) {
                            sdate = sdate + "0" + date.getDate();
                        }
                        else {
                            sdate = sdate + date.getDate();
                        }
                    }
                    else {
                        sdate = $("#yearwrapper ul li:eq(" + indexY + ")").text().substr(0, 4) + "-" ;
                        if (indexM < 10) {
                            sdate = sdate + "0" + indexM + "-";
                        }
                        else {
                            sdate = sdate + indexM + "-";
                        }
                        if (indexD < 10) {
                            sdate = sdate + "0" + indexD;
                        }
                        else {
                            sdate = sdate + indexD;
                        }
                    }                                   
                    that.attr("solardate", sdate);
                    var lunar = solar2lunar(parseInt(sdate.substr(0, 4)), parseInt(sdate.substr(5, 2))-1, parseInt(sdate.substr(8, 2)));
                    that.attr("lunardate", "农历" + FormatLunarMonth(lunar.lm) +"月"+ FormatLunarDay(lunar.ld));
                    $("#datePage").hide();
                    $("#dateshadow").hide();
                });
                // 取消按钮
                $("#datecancle").click(function () {
                    $("#datePage").hide();
                    $("#dateshadow").hide();
                });
            }
            // 创建 --年-- 列表
            function createYEAR_UL() {
                var str = "<li>&nbsp;</li>";
                for (var i = opts.beginyear; i <= opts.endyear; i++) {
                    if (isLunar) {
                        // 天干
                        var stem = Stems[(i - 1924) % 10];
                        // 地支
                        var branch = Branches[(i - 1924) % 12];
                        str += '<li id=' + i + stem + branch + ' v=' + i + '>' + stem + branch + '年' + '(' + i + ')</li>'
                    } else {
                        str += '<li id=' + i + ' v=' + i + '>' + i + '年</li>'
                    }
                }
                return str + "<li>&nbsp;</li>";;
            }
            // 创建 --月-- 列表
            function createMONTH_UL() {
                var str = "<li>&nbsp;</li>";
                for (var i = opts.beginmonth; i <= opts.endmonth; i++) {
                    if (i < 10) {
                        i = "0" + i
                    }
                    if (isLunar) {
                        var leap = leapMonth(indexY + opts.beginyear - 1);
                        if (leap > 0) {
                            for (var i = 0; i < 13; i++) {
                                if (i < leap) {
                                    str += '<li v=' + i + '>' + FormatLunarMonth(i + 1) + '月</li>';
                                } else if (i == leap) {
                                    str += '<li v=' + i + '> 闰' + FormatLunarMonth(i) + '月</li>';
                                } else {
                                    str += '<li v=' + i + '>' + FormatLunarMonth(i) + '月</li>';
                                }
                            }
                        } else {
                            for (var i = 0; i < 12; i++) {
                                str += '<li v=' + i + '>' + FormatLunarMonth(i + 1) + '月</li>';
                            }
                        }
                    }
                    else {
                        str += '<li v=' + i + '>' + i + '月</li>';
                    }
                }
                return str + "<li>&nbsp;</li>";;
            }
            // 创建 --日-- 列表       
            function createDAY_UL() {;
                $("#daywrapper ul").html("");
                var str = "<li>&nbsp;</li>";
                if (isLunar) {
                    opts.endday = lMonthDays(opts.beginyear + indexY - 1, indexM);
                    for (var i = opts.beginday; i <= opts.endday; i++) {
                        str += '<li v=' + i + '>' + FormatLunarDay(i) + '</li>';
                    }
                } else {
                    opts.endday = solarDays(opts.beginyear + indexY - 1, indexM - 1);
                    for (var i = opts.beginday; i <= opts.endday; i++) {
                        if (i < 10) {
                            i = "0" + i
                        }
                        str += '<li v=' + i + '>' + i + '日</li>';
                    }
                }
                return str + "<li>&nbsp;</li>";;
            }
            // 将农历iLunarMonth月格式化成农历表示的字符串
            function FormatLunarMonth(iLunarMonth) {
                var szText = new String("正二三四五六七八九十");
                var strMonth;
                if (iLunarMonth <= 10) {
                    strMonth = szText.substr(iLunarMonth - 1, 1);
                }
                else if (iLunarMonth == 11) strMonth = "冬";
                else strMonth = "腊";
                return strMonth;
            }
            // 将农历iLunarDay日格式化成农历表示的字符串
            function FormatLunarDay(iLunarDay) {
                var szText1 = new String("初十廿三");
                var szText2 = new String("一二三四五六七八九十");
                var strDay;
                if ((iLunarDay != 20) && (iLunarDay != 30)) {
                    strDay = szText1.substr((iLunarDay - 1) / 10, 1) + szText2.substr((iLunarDay - 1) % 10, 1);
                }
                else if (iLunarDay != 20) {
                    strDay = szText1.substr(iLunarDay / 10, 1) + "十";
                }
                else {
                    strDay = "二十";
                }
                return strDay;
            }
        }
    })(jQuery);

