/**
 * Vue 报表注册混入对象
 * 数据对象在内部会进行递归合并，在和组件的数据发生冲突时以【组件】数据优先。
 */

export default {
    data() {
        return {
            regionList_mixin: [
                { 'name': '杭州市', code: 571 },
                { 'name': '衢州市', code: 570 },
                { 'name': '湖州市', code: 572 },
                { 'name': '嘉兴市', code: 573 },
                { 'name': '宁波市', code: 574 },
                { 'name': '绍兴市', code: 575 },
                { 'name': '台州市', code: 576 },
                { 'name': '温州市', code: 577 },
                { 'name': '丽水市', code: 578 },
                { 'name': '金华市', code: 579 },
                { 'name': '舟山市', code: 580 }
            ]
        };
    },
    methods: {
        //message提示
        message(opts) {
            var optiions = {
                type: 'error',
                message: '系统出错了！',
                showClose: true
            };
            this.$message($.extend(optiions, opts));
        },
        /**
         * 数字转换
         * @param value 输入值
         * @param unitCode 强制格式返回
         * @param frac 保留小数
         */
        numberFormat(value, unitCode, frac) {
            var param = {};
            var k = 10000, i;
            var sizes = {
                '0': {
                    unitCode: 0,
                    unit: 0,
                    unitName: ''
                },
                '1': {
                    unitCode: 1,
                    unit: 10000,
                    unitName: '万'
                },
                '2': {
                    unitCode: 2,
                    unit: 100000000,
                    unitName: '亿'
                },
                '3': {
                    unitCode: 3,
                    unit: 1000000000000,
                    unitName: '万亿'
                }
            };
            if (unitCode === null || unitCode === undefined) {
                if (value < k) {
                    param.value = value;
                    param = param = $.extend(param, sizes[0]);
                } else {
                    i = Math.floor(Math.log(value) / Math.log(k));
                    param.value = ((value / Math.pow(k, i))).toFixed(frac || 0);
                    param = $.extend(param, sizes[i]);
                }
            }
            else {
                param.value = ((value / Math.pow(k, unitCode))).toFixed(frac || 0);
                param = $.extend(param, sizes[unitCode]);
            }
            param.value = param.value || 0;
            return param;

        },
        /**
         * 页面适配，计算字体实际大小等
         * @param pixel 设计稿上实际像素
         */
        calcPagePixel(pixel, frac) {
            var result = pixel;
            var width = window.document.documentElement.getBoundingClientRect().width;
            var basePixel = width / 2880 * 28;
            //设计稿宽度为2880
            result = (pixel / 28) * basePixel;
            return result.toFixed(frac || 0) - 0;
        },
        /**
         * list转map
         * @param list
         * @param fkey
         */
        list2Map(list, fkey) {
            var map = {};
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var key = (typeof fkey == 'function') ? fkey(obj)
                        : obj[fkey];
                    map[key] = obj;
                }
            }
            return map;
        },
        /**
         * 数组元素交换位置
         * @param {array} arr 数组
         * @param {number} index1 添加项目的位置
         * @param {number} index2 删除项目的位置
         * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
         */
        swapArray(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        /**
         * 根据字符长度截取字符串
         * @param str 需要截取的字符串
         * @param length 截取的字符长度，中文长度为2
         * @returns {[]}
         */
        splitStrBylength(str, length) {
            var arr = [];
            var len = 0;
            var lastI = 0;
            for (var i = 0; i < str.length; i++) {
                len += (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) ? 2 : 1;
                if (len >= length) {
                    arr.push(str.substring(lastI, i + 1));
                    len = 0;
                    lastI = i + 1;
                }
            }
            if (lastI < str.length) {
                arr.push(str.substr(lastI))
            }
            return arr
        },
        //格式化备注-实现换行展示
        dataFormatterRemark(value) {
            if (value === undefined || value === '' || value === null) return ''
            value = value.replace(/\n|\r\n/g, '<br/>')
            return value;
        },
        //获取饼图配置
        getchartPieOpts(opts) {
            var dOpts = {
                mainColor: '#F6D016',
                borderColor: '#245299',
                data: []
            };
            dOpts = $.extend(dOpts, opts);
            var options = {
                series: [
                    {
                        type: 'pie',
                        zlevel: 5,
                        silent: true,
                        radius: ['50%', '42%'],
                        color: dOpts.mainColor,
                        startAngle: 50,
                        hoverAnimation: false,
                        avoidLabelOverlap: true,
                        minAngle: 5,
                        label: {
                            verticalAlign: 'middle',
                            alignTo: 'labelLine',
                            formatter: [
                                '{a|{b}}',
                                '{b|{d}%}'
                            ].join(' '),
                            rich: {
                                a: {
                                    color: "#99CCFF",
                                    fontSize: this.calcPagePixel(14)
                                },
                                b: {
                                    color: dOpts.mainColor,
                                    fontFamily: 'Digital',
                                    fontSize: this.calcPagePixel(24)
                                }
                            }
                        },
                        labelLine: {
                            //length: 1,
                            length2: 1,
                        },
                        itemStyle: { // 此配置
                            normal: {
                                borderWidth: 2,
                                borderColor: dOpts.borderColor,
                            }
                        },
                        data: dOpts.data
                    },
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: ['38%', '34%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false
                            },
                        },
                        data: [
                            {
                                value: 25,
                                itemStyle: {
                                    color: dOpts.mainColor
                                }
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            }, {
                                value: 25,
                                itemStyle: {
                                    color: dOpts.mainColor
                                },
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            }
                        ]
                    },
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: ['36%', '35%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false
                            },
                        },
                        data: [
                            {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: dOpts.mainColor
                                },
                            }, {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: dOpts.mainColor
                                },
                            }
                        ]
                    },
                    {
                        name: '统计',
                        type: 'gauge',
                        splitNumber: 12, //刻度数量
                        min: 0,
                        max: 100,
                        radius: '25%', //图表尺寸
                        center: ['50%', '50%'],
                        startAngle: 90,
                        endAngle: -269.9999,
                        axisLine: {
                            show: false,
                            lineStyle: {
                                width: 0,
                                shadowBlur: 0,
                                color: dOpts.mainColor
                            }
                        },
                        axisTick: {
                            show: true,
                            lineStyle: {
                                color: dOpts.mainColor,
                                width: 1
                            },
                            length: '8%',
                            splitNumber: 5
                        },
                        splitLine: {
                            show: true,
                            length: '8%',
                            lineStyle: {
                                width: 1,
                                color: dOpts.mainColor
                            }
                        },
                        axisLabel: {
                            show: false
                        },
                        pointer: { //仪表盘指针
                            show: 0,
                        },
                        detail: {
                            show: false
                        }
                    },
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: ['20%', '18%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {
                                value: 75,
                                itemStyle: {
                                    color: dOpts.mainColor
                                },
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            }
                        ]
                    }
                ]
            }
            return options;
        },
        //获取饼图配置
        getchartPieOneOpts(opts) {
            var dOpts = {
                mainColor: '#2290FA',
                borderColor: '#245299',
                data: [],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)" // {a}：系列名。{b}：数据名。{c}：数据值。{d}：百分比。
                },
            };
            dOpts = $.extend(dOpts, opts);
            var options = {
                color: ['#05479C', '#2290FA', '#47A5FF', '#7ABEFF', '#BCE0F8'],
                tooltip: dOpts.tooltip,
                series: [
                    {
                        name: '线',
                        type: 'pie',
                        zlevel: 7,
                        radius: ['70%', '69%'],
                        avoidLabelOverlap: false,
                        startAngle: 280,
                        color: dOpts.mainColor,
                        hoverAnimation: false,
                        legendHoverLink: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                            value: 20,
                            name: '1',
                            itemStyle: {
                                normal: {
                                    color: 'transparent'
                                }
                            }
                        }, {
                            value: 60,
                            name: '2',
                            itemStyle: {
                                normal: {
                                    color: dOpts.mainColor,
                                }
                            }
                        }]
                    },

                    {
                        name: '异常用户',
                        type: 'pie',
                        zlevel: 6,
                        radius: ['55%', '60%'],
                        labelLine: {
                            normal: {
                                length: 0,
                                length2: this.calcPagePixel(100),
                                lineStyle: {
                                    color: '#2290FA'
                                }
                            }
                        },
                        label: {
                            normal: {
                                formatter: '{b|{b}}\n',
                                borderWidth: 0,
                                borderRadius: 4,
                                padding: [0, - this.calcPagePixel(80)],
                                rich: {
                                    a: {
                                        color: '#99CCFF',
                                        fontSize: this.calcPagePixel(14),
                                        lineHeight: this.calcPagePixel(20),
                                    },
                                    hr: {
                                        borderColor: '#99CCFF',
                                        width: '100%',
                                        borderWidth: 0.5,
                                        height: 0
                                    },
                                    b: {
                                        fontSize: this.calcPagePixel(14),
                                        lineHeight: this.calcPagePixel(20),
                                        color: '#99CCFF'
                                    }
                                }
                            }
                        },
                        itemStyle: { // 此配置
                            normal: {
                                borderWidth: 2,
                                borderColor: dOpts.borderColor,
                            }
                        },
                        data: dOpts.data
                    },


                    {
                        type: 'pie',
                        zlevel: 5,
                        silent: true,
                        radius: ['50%', '42%'],
                        color: dOpts.mainColor,
                        startAngle: 50,
                        hoverAnimation: false,
                        avoidLabelOverlap: true,
                        minAngle: 5,
                        label: {
                            normal: {
                                show: false
                            },
                        },
                        itemStyle: { // 此配置
                            normal: {
                                borderWidth: 2,
                                borderColor: dOpts.borderColor,
                            }
                        },
                        data: [
                            { name: '1', value: 1 },
                            { name: '2', value: 1 },
                            { name: '3', value: 1 },
                            { name: '4', value: 1 },
                            { name: '5', value: 1 },
                            { name: '6', value: 1 },
                            { name: '7', value: 1 },
                            { name: '8', value: 1 }
                        ]
                    },
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: ['38%', '34%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false
                            },
                        },
                        data: [
                            {
                                value: 25,
                                itemStyle: {
                                    color: dOpts.mainColor
                                }
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            }, {
                                value: 25,
                                itemStyle: {
                                    color: dOpts.mainColor
                                },
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            }
                        ]
                    },
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: ['36%', '35%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false
                            },
                        },
                        data: [
                            {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: dOpts.mainColor
                                },
                            }, {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: dOpts.mainColor
                                },
                            }
                        ]
                    },
                    {
                        name: '统计',
                        type: 'gauge',
                        splitNumber: 12, //刻度数量
                        min: 0,
                        max: 100,
                        radius: '25%', //图表尺寸
                        center: ['50%', '50%'],
                        startAngle: 90,
                        endAngle: -269.9999,
                        axisLine: {
                            show: false,
                            lineStyle: {
                                width: 0,
                                shadowBlur: 0,
                                color: dOpts.mainColor
                            }
                        },
                        axisTick: {
                            show: true,
                            lineStyle: {
                                color: dOpts.mainColor,
                                width: 1
                            },
                            length: '8%',
                            splitNumber: 5
                        },
                        splitLine: {
                            show: true,
                            length: '8%',
                            lineStyle: {
                                width: 1,
                                color: dOpts.mainColor
                            }
                        },
                        axisLabel: {
                            show: false
                        },
                        pointer: { //仪表盘指针
                            show: 0,
                        },
                        detail: {
                            show: false
                        }
                    },
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: ['20%', '18%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {
                                value: 75,
                                itemStyle: {
                                    color: dOpts.mainColor
                                },
                            },
                            {
                                value: 25,
                                itemStyle: {
                                    color: "transparent"
                                }
                            }
                        ]
                    }
                ]
            }
            return options;
        },
        //获取饼图基础配置
        getChartPieBase(opts) {
            var dOpts = {
                colors: ['#084391', '#2081E1', '#4093E5', '#6BA8E5', '#A3C5E0'],
                series_data: [],
                radius: ['35%', '50%'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)" // {a}：系列名。{b}：数据名。{c}：数据值。{d}：百分比。
                },
            };
            dOpts = $.extend(dOpts, opts);
            return {

                tooltip: {
                    trigger: 'item',
                    showContent: true,
                    formatter: function (params) {
                        debugger;
                        var tipString = "";
                        tipString += '<div><span style="color:#99CCFF">' + params.name + ':</span><span style="color:#F6D016"> ' + params.data.unitValue + '</span><span style="color:#99CCFF"> ' + params.data.unitName + '</span></div>';
                        return tipString;
                    },
                    borderColor: "#ccc",
                    padding: 5,
                },

                tooltip: dOpts.tooltip,
                color: dOpts.colors,
                labelLine: {
                    normal: {
                        length: 0,
                        length2: 1,
                    }
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: dOpts.radius,
                    //avoidLabelOverlap: true,
                    startAngle: 180,
                    label: {
                        show: true,
                        normal: {
                            //formatter: '{b}:{d}%',
                            formatter: function (params) {
                                var percent = params.percent.toFixed();
                                return params.name + ":" + percent + '%';
                            },
                            show: true,
                            color: '#99CCFF',
                            //alignTo: 'labelLine',
                            fontSize: this.calcPagePixel(14)
                        },
                    },
                    data: opts.series_data
                }]
            }
        },
        //获取象形分隔X轴柱状图
        getCahrtSplitBarOpts(opts) {
            var that = this;
            var dOpts = {
                main_color: '#F6D016',
                grid: {
                    top: '5%',
                    left: '20%',
                    right: '5%',
                    bottom: '5%'
                },
                xAxis_max: 200,
                yAxis_data: [], //名称
                series_data: [],
                series_label_show: true,
                axisLabel_max_num: 5
            }
            dOpts = $.extend(dOpts, opts);
            var options = {
                tooltip: {
                    trigger: 'item',
                    showContent: true,
                    formatter: function (params) {
                        var tipString = "";
                        tipString += '<div><span>' + params.name + ':</span><span style="color:' + dOpts.main_color + '"> ' + params.value + '</span></div>';
                        return tipString;
                    },
                    borderColor: "#ccc",
                    padding: 5,
                },
                xAxis: {
                    splitLine: {
                        show: false
                    },
                    //offset: that.calcPagePixel(10),
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                yAxis: {
                    data: dOpts.yAxis_data,
                    inverse: true,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        margin: that.calcPagePixel(10),
                        formatter: function (value) {
                            var max = dOpts.axisLabel_max_num;
                            if (value.length > max) {
                                return value.substring(0, max) + "...";
                            } else {
                                return value;
                            }
                        },
                        textStyle: {
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(12)
                        }
                    }
                },
                grid: dOpts.grid,
                series: [
                    {
                        // current data
                        type: 'pictorialBar',
                        symbol: 'rect',
                        itemStyle: {
                            normal: {
                                barBorderRadius: that.calcPagePixel(5),
                                color: dOpts.main_color

                            }
                        },
                        symbolRepeat: 'fixed',
                        symbolMargin: that.calcPagePixel(5),
                        symbolClip: true,
                        symbolSize: [that.calcPagePixel(10), that.calcPagePixel(20)],
                        symbolOffset: [0, 0],
                        //symbolBoundingData: dOpts.xAxis_max,
                        data: dOpts.series_data,
                        z: 10,
                        animationEasing: 'elasticOut',
                        animationDelay: function (dataIndex, params) {
                            return params ? params.index * 30 : 30;
                        }
                    }, {
                        // full data
                        type: 'pictorialBar',
                        itemStyle: {
                            normal: {
                                color: '#1D1F3E'
                            }
                        },
                        label: {
                            normal: {
                                show: !!dOpts.series_label_show,
                                formatter: function (params) {
                                    return (params.value);
                                },
                                position: 'right',
                                offset: [2, 0],
                                textStyle: {
                                    color: dOpts.main_color,
                                    fontSize: that.calcPagePixel(14),
                                }
                            }
                        },
                        animationDuration: 0,
                        symbolRepeat: 'fixed',
                        symbolMargin: that.calcPagePixel(5),
                        symbol: 'rect',
                        symbolSize: [that.calcPagePixel(10), that.calcPagePixel(20)],
                        //symbolBoundingData: [0, dOpts.xAxis_max],
                        data: dOpts.series_data,
                        z: 9,
                        animationEasing: 'elasticOut',
                        animationDelay: function (dataIndex, params) {
                            return params ? params.index * 30 : 30;
                        }
                    }
                ]
            };

            return options;
        },
        //获取圆环图配置
        getchartRingOpts(opts) {
            var that = this;
            var dOpts = {
                main_color: '#FF2267',
                label_color: '#F6D016',
                bg_color: '#223661',
                value: 60, //百分比
            }
            dOpts = $.extend(dOpts, opts);
            return {
                series: [{
                    name: '养卡套酬',
                    type: 'pie',
                    clockWise: false,
                    radius: [47, 55],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            color: dOpts.main_color, //#F6D016
                            shadowColor: dOpts.main_color, //#F6D016
                            shadowBlur: 0,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            },
                        }
                    },
                    hoverAnimation: false,
                    data: [{
                        value: 100 - dOpts.value > 0 ? 100 - dOpts.value : 0,
                        name: 'invisible',
                        itemStyle: {
                            normal: {
                                color: dOpts.bg_color,
                            }
                        }
                    }, {
                        value: dOpts.value,
                        label: {
                            normal: {
                                formatter: function (params) {
                                    return params.value + '%';
                                },
                                position: 'center',
                                show: true,
                                textStyle: {
                                    fontFamily: 'DigitalB',
                                    fontSize: this.calcPagePixel(60),
                                    //fontWeight: 'bold',
                                    color: dOpts.label_color
                                }
                            }
                        }
                    }]
                }]
            }
        },
        //获取折线配置
        getCahrtLineOpts(opts) {
            var that = this;
            var dOpts = {
                main_color: '#F6D016',
                xAxis_data: [],
                series_data: [],
                name: '',
            }
            dOpts = $.extend(dOpts, opts);
            return {
                grid: {
                    left: '10%',
                    top: '20%',
                    bottom: '15%',
                    right: '5%',
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params, ticket, callback) {
                        var htmlStr = '';
                        for (var i = 0; i < params.length; i++) {
                            var param = params[i];
                            var xName = param.name;//x轴的名称
                            var seriesName = param.seriesName;//图例名称
                            var numValue = that.numberFormat(param.value, null, 2);
                            var color = param.color;//图例颜色
                            if (i === 0) {
                                htmlStr += xName + '<br/>';//x轴的名称
                            }
                            htmlStr += '<div>';
                            //为了保证和原来的效果一样，这里自己实现了一个点的效果
                            htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
                            //圆点后面显示的文本
                            htmlStr += seriesName + '：' + numValue.value + ' ' + numValue.unitName;
                            htmlStr += '</div>';
                        }
                        return htmlStr;
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        position: 'right',
                        splitLine: {
                            show: false
                        }
                        ,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        position: 'left',
                        nameTextStyle: {
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(10)
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color: 'rgba(135,140,147,0.8)'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(10)
                        }
                    },
                ],
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#6A989E',
                            }
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: '#99CCFF',// x轴颜色
                                fontWeight: 'normal',
                                fontSize: that.calcPagePixel(10),
                                lineHeight: that.calcPagePixel(22)
                            }

                        },
                        data: dOpts.xAxis_data,
                    },
                    {
                        type: 'category',
                        nameTextStyle: {
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(10)
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                    },
                ],
                series: [
                    {
                        name: dOpts.name,
                        type: "line",
                        stack: '总量',
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                borderWidth: this.calcPagePixel(5),
                                color: dOpts.main_color,
                            }
                        },
                        data: dOpts.series_data
                    },

                ]
            }
        },
        //多条折线配置
        getCahrtLineMultiOpts() {
            var that = this;
            return {
                color: ['#F6D016', '#FF2267', '#873CEE', '#8ED9DE', '#F5319F'],
                grid: {
                    left: '8%',
                    top: '20%',
                    bottom: '15%',
                    right: '8%',
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params, ticket, callback) {
                        var htmlStr = '';
                        for (var i = 0; i < params.length; i++) {
                            var param = params[i];
                            var xName = param.name;//x轴的名称
                            var seriesName = param.seriesName;//图例名称
                            var numValue = that.numberFormat(param.value, null, 2);
                            var color = param.color;//图例颜色
                            if (i === 0) {
                                htmlStr += xName + '<br/>';//x轴的名称
                            }
                            htmlStr += '<div>';
                            //为了保证和原来的效果一样，这里自己实现了一个点的效果
                            htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
                            //圆点后面显示的文本
                            htmlStr += seriesName + '：' + numValue.value + ' ' + numValue.unitName;
                            htmlStr += '</div>';
                        }
                        return htmlStr;
                    }
                },
                legend: {
                    data: [],
                    left: 'center',
                    textStyle: {
                        color: '#99CCFF',
                        fontSize: that.calcPagePixel(16)
                    },
                },
                yAxis: [
                    {
                        show: false,
                        type: 'value',
                        position: 'left',
                        nameTextStyle: {
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(10)
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color: 'rgba(135,140,147,0.8)'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(10)
                        }
                    },
                    {
                        show: false,
                        type: 'value',
                        position: 'right',
                        nameTextStyle: {
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(10)
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                type: 'dashed',
                                color: 'rgba(135,140,147,0.8)'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(10)
                        }
                    },
                ],
                xAxis: [
                    {
                        type: 'category',
                        nameTextStyle: {
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(10)
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#6A989E',
                            }
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: '#99CCFF',// x轴颜色
                                fontWeight: 'normal',
                                fontSize: that.calcPagePixel(10),
                                lineHeight: that.calcPagePixel(22)
                            }

                        },
                        data: [],
                    }
                ],
                series: [
                    //{
                    //    name: dOpts.name,
                    //    type: "line",
                    //    stack: '总量',
                    //    yAxisIndex: 1,
                    //    itemStyle: {
                    //        normal: {
                    //            borderWidth: this.calcPagePixel(5),
                    //            color: dOpts.main_color,
                    //        }
                    //    },
                    //    data: dOpts.series_data
                    //},

                ]
            }
        },
        //地市风险用户排名
        getChartRankingOpts(opts) {
            var that = this;
            var dOpts = {
                main_color: '#8E4AEB',
                xAxis_data: [],
                series_data: [],
                max_data: '',
                first_data: '',
                second_data: '',
                thrid_data: '',
                unitCode: '0',
                unitName: '',
                frac: 0,

            }
            var dataStyle = {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    shadowBlur: 0,
                    shadowColor: '#FFF'
                }
            };
            var textStyle = {
                fontSize: that.calcPagePixel(20),
                fontWeight: 'normal',
                color: '#fff'
            };
            var itemStyle = {
                normal: {
                    color: '#E8A010',
                    shadowBlur: 0
                }
            };
            var rich = {
                a: {
                    color: '#99CCFF',
                    align: 'center',
                    fontSize: that.calcPagePixel(14),
                    fontWeight: "bold"
                },
                b: {
                    color: '#F6D016',
                    align: 'center',
                    fontSize: that.calcPagePixel(24)
                }
            },
                dOpts = $.extend(dOpts, opts);
            return {
                grid: [{ x: '20%', y: '30%', width: '70%', height: '70%' }],
                color: dOpts.main_color,
                yAxis: {
                    data: dOpts.xAxis_data,
                    axisTick: { show: false }, axisLabel: { interval: 0, show: true, color: "#99CCFF", fontSize: that.calcPagePixel(14) }, splitLine: { show: false },
                    axisLine: { show: false }
                },
                xAxis: [{
                    axisTick: { show: false }, axisLabel: { show: false }, splitLine: { show: false }, axisLine: { show: false }, type: 'value',
                    max: dOpts.max_data,
                }],
                series: [
                    {
                        type: 'bar',
                        barWidth: '34%',
                        label: { normal: { show: true, position: 'right', formatter: '{c}' + dOpts.unitName, textStyle: { color: '#99CCFF', fontSize: that.calcPagePixel(14) } } },
                        data: dOpts.series_data
                    },

                    //-------第一------------
                    {
                        name: '第一',
                        type: 'pie',
                        radius: '7%',
                        hoverAnimation: false,
                        center: ['5%', '5%'],
                        data: [{ value: 1, label: { normal: { formatter: '1', position: 'center', show: true, textStyle: textStyle } }, itemStyle: itemStyle, },]
                    },

                    {
                        name: '第一环比',
                        type: 'pie',
                        radius: ['28%', '23%'],
                        itemStyle: dataStyle,
                        hoverAnimation: false,
                        center: ['18%', '15%'],
                        data: [{
                            value: dOpts.first_data.value,
                            label: {
                                normal: {
                                    rich: rich,
                                    formatter: function (params) {
                                        var mydata = that.numberFormat(dOpts.first_data.value || 0, dOpts.unitCode, dOpts.frac);
                                        return "{a|" + dOpts.first_data.name + "}" + "\n{b|" + mydata.value + mydata.unitName + "}";
                                    },
                                    position: 'center',
                                    show: true,
                                }
                            }
                        }, {
                            value: dOpts.first_data.value - dOpts.first_data.value,
                            name: 'invisible',
                            itemStyle: { normal: { color: '#223661' } }
                        }]
                    },
                    //--------第二--------
                    {
                        name: '第二名',
                        type: 'pie',
                        radius: '7%',
                        hoverAnimation: false,
                        center: ['38%', '5%'],
                        data: [{ value: 1, label: { normal: { formatter: '2', position: 'center', show: true, textStyle: textStyle } }, itemStyle: itemStyle, },]
                    },

                    {
                        name: '第二名',
                        type: 'pie',
                        radius: ['28%', '23%'],
                        itemStyle: dataStyle,
                        hoverAnimation: false,
                        center: ['51%', '15%'],
                        data: [{
                            value: dOpts.second_data.value,
                            label: {
                                normal: {
                                    rich: rich,
                                    formatter: function (params) {
                                        var mydata = that.numberFormat(dOpts.second_data.value || 0, dOpts.unitCode, dOpts.frac);
                                        return "{a|" + dOpts.second_data.name + "}" + "\n{b|" + mydata.value + mydata.unitName + "}";
                                    },
                                    position: 'center',
                                    show: true,
                                }
                            }
                        }, {
                            value: dOpts.first_data.value - dOpts.second_data.value,
                            name: 'invisible',
                            itemStyle: { normal: { color: '#223661' } }
                        }]
                    },
                    //--------第二--------
                    {
                        name: '第三',
                        type: 'pie',
                        radius: '7%',
                        hoverAnimation: false,
                        center: ['71%', '5%'],
                        data: [{ value: 1, label: { normal: { formatter: '3', position: 'center', show: true, textStyle: textStyle } }, itemStyle: itemStyle, },]
                    },

                    {
                        name: '第三名',
                        type: 'pie',
                        radius: ['28%', '23%'],
                        itemStyle: dataStyle,
                        hoverAnimation: false,
                        center: ['84%', '15%'],
                        data: [{
                            value: dOpts.thrid_data.value,
                            label: {
                                normal: {
                                    rich: rich,
                                    formatter: function (params) {
                                        var mydata = that.numberFormat(dOpts.thrid_data.value || 0, dOpts.unitCode, dOpts.frac);
                                        return "{a|" + dOpts.thrid_data.name + "}" + "\n{b|" + mydata.value + mydata.unitName + "}";
                                    },
                                    position: 'center',
                                    show: true,
                                }
                            }
                        }, {
                            value: dOpts.first_data.value - dOpts.thrid_data.value,
                            name: 'invisible',
                            itemStyle: { normal: { color: '#223661' } }
                        }]
                    },
                ]

            }
        },
        //获取雷达配置
        getCahrRadarOpts(opts) {
            var that = this;
            var dOpts = {
                main_color: '#55B2BA',
                radar_Data: [],
                series_data: [],
                image: '/risk/bigscreen/img/radar-green.png',
                radius: '68%',
            }
            dOpts = $.extend(dOpts, opts);

            return {
                graphic: {
                    elements: [{
                        type: 'image',
                        style: {

                            image: dOpts.image,
                            width: that.calcPagePixel(45),
                            height: that.calcPagePixel(45)
                        },
                        left: 'center',
                        top: 'center'
                    }]
                },

                radar: {
                    name: {
                        textStyle: {
                            color: '#99CCFF',
                            fontSize: that.calcPagePixel(14),
                        },
                    },
                    radius: dOpts.radius,
                    center: ['50%', '50%'],
                    indicator: dOpts.radar_Data,
                    nameGap: that.calcPagePixel(5), // 指示器名称和指示器轴的距离
                    splitArea: {
                        show: false,
                    },
                    axisLine: {
                        show: true, // 指向外圈文本的分隔线不显示
                        lineStyle: {
                            color: dOpts.main_color,
                            width: 1,
                        }
                    },
                    splitNumber: 4, // 配合 splitLine=>color控制只显示几个边框线
                    splitLine: {
                        lineStyle: {
                            color: dOpts.main_color,
                            width: 1,
                        }
                    }
                },
                color: [], // 去除统计图形块边框线
                series: [{
                    name: '新入网养卡策略命中',
                    type: 'radar',
                    symbolSize: 0, // 去掉小圆点
                    data: [{
                        value: dOpts.series_data,
                        name: '',
                        areaStyle: {
                            normal: {
                                color: dOpts.main_color,
                            }
                        }
                    }
                    ]
                }]
            }

        },
        // //获取象形分隔Y轴柱状图
        getCahrtSplitBarYOpts(opts) {
            var that = this;
            var dOpts = {
                main_color: '#F6D016',
                grid: {
                    top: '20%',
                    bottom: '1%',
                    containLabel: true
                },
                yAxis_max: 200,
                yAxis_data: [],
                series_data: [],
                series_label_show: true,
            }
            dOpts = $.extend(dOpts, opts);

            var rich = {
                white: {
                    color: "#fff",
                    align: 'left',
                    fontSize: that.calcPagePixel(18),
                    padding: [0, 0]
                },
            };
            return {
                tooltip: {
                    trigger: 'item',
                    showContent: true,
                    formatter: function (params) {
                        var tipString = "";
                        tipString += '<div><span>' + params.name + ':</span><span style="color:#F6D016"> ' + params.value + '</span></div>';
                        return tipString;
                    },
                    borderColor: "#ccc",
                },
                grid: dOpts.grid,
                xAxis: [{
                    type: 'category',
                    data: (function (data) {
                        var arr = [];
                        data.forEach(function (items) {
                            arr.push(items.name);
                        });
                        return arr;
                    })(dOpts.series_data),
                    boundaryGap: ['20%', '20%'],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        textStyle: {
                            fontSize: that.calcPagePixel(16),
                            color: '#3fdaff'
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false,
                        inside: false,
                        length: that.calcPagePixel(10),
                        lineStyle: {
                            color: '#0b5263'
                        }
                    },
                    axisLabel: {
                        show: false,
                        textStyle: {
                            color: '#0b5263',
                            fontSize: that.calcPagePixel(14)
                        }
                    },
                }],
                series: [
                    //背景
                    {
                        name: 'bg',
                        type: 'pictorialBar',
                        barWidth: '40%',
                        silent: true,
                        label: {
                            normal: {
                                show: true,
                                position: "top",
                                distance: that.calcPagePixel(5),
                                formatter: function (params) {
                                    var stuNum = 0;
                                    dOpts.series_data.forEach(function (value, index, array) {
                                        if (params.name == value.name) {
                                            stuNum = value.name;
                                        }
                                    })
                                    return stuNum;
                                },
                                textStyle: {
                                    color: "#99CCFF",
                                    fontSize: that.calcPagePixel(10)
                                },
                                rich: rich
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgba(256,256,256,0.2)',
                                backgroundColor: 'rgba(256,256,256,0.2)',
                            },
                        },
                        symbolRepeat: 'fixed',

                        symbolRepeat: 'fixed',
                        symbolSize: [that.calcPagePixel(28), that.calcPagePixel(5)],
                        symbolClip: false,
                        symbol: 'rect',
                        symbolBoundingData: dOpts.yAxis_max,
                        data: dOpts.yAxis_data
                    },
                    {
                        name: '数据',
                        type: 'pictorialBar',
                        itemStyle: {
                            normal: {
                                color: dOpts.main_color,
                            }
                        },
                        animationDuration: 0,
                        symbolRepeat: 'fixed',

                        symbol: 'rect',
                        symbolSize: [that.calcPagePixel(28), that.calcPagePixel(5)],
                        barWidth: '40%',
                        barGap: '-100%',
                        data: dOpts.series_data,
                        z: 3,
                        symbolClip: true,
                        symbolBoundingData: dOpts.yAxis_max,
                    },
                ]

            }
        },

        //获取柱状图
        getCahrtBarOpts(opts) {
            var that = this;
            var dOpts = {
                dataTitle: [],
                dataName: [],
                data1: [],
                data2: [],
            }
            dOpts = $.extend(dOpts, opts);

            return {
                color: ['#FF2267'],
                legend: {
                    data: [
                        // {
                        //     name: '正常业务量',
                        // },
                        {
                            name: '风险业务量',
                        }

                    ],
                    top: 20,
                    right: that.calcPagePixel(42),
                    textStyle: {
                        color: '#99CCFF',
                        fontSize: that.calcPagePixel(10)
                    },
                    itemGap: 40,
                    itemWidth: 10,
                    itemHeight: 10
                },

                tooltip: {
                    trigger: 'axis',
                    // backgroundColor: '#FFF',
                    padding: [0, 0, 0, 0],
                    axisPointer: {
                        type: 'line',
                        animation: true,
                        lineStyle: {
                            color: 'transparent'
                        }
                    },
                    formatter: (params) => {
                        let htmls = '',
                            xaxisName = '';
                        if (params.length > 0) {
                            xaxisName = params[0].axisValue;
                            htmls += '<div style="font-size:16px;height:32px;color:#99CCFF;border-radius:4px;line-height:36px;padding-left:15px;text-align: left;">' + xaxisName + '</div><div>';
                            for (let j = 0; j < params.length; j++) {
                                htmls += '<p style="font-size:14px;padding:4px 23px 6px 15px;color:#F6D016;text-align: left;">' + params[j].seriesName + ' : ' + params[j].data + '</p>';
                            }
                            htmls += '</div>';
                            return htmls;
                        }
                    }
                },

                xAxis: {
                    name: '',
                    nameTextStyle: {
                        color: '#99CCFF',
                        fontSize: that.calcPagePixel(10)
                    },
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#6A989E',
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        inside: false,
                        textStyle: {
                            color: '#99CCFF',// x轴颜色
                            fontWeight: 'normal',
                            fontSize: that.calcPagePixel(10),
                            lineHeight: that.calcPagePixel(22)
                        }
                    },
                    data: dOpts.dataName,
                },
                yAxis: {
                    name: '',
                    type: 'value',
                    position: 'left',
                    nameTextStyle: {
                        color: '#99CCFF',
                        fontSize: that.calcPagePixel(10)
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgba(135,140,147,0.8)'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value}',
                        color: '#99CCFF',
                        fontSize: 10
                    }
                },
                series: [
                    // {
                    //     name: '正常业务量',
                    //     type: 'bar',
                    //     stack: 'a',
                    //     barWidth: '30%',
                    //     data:dOpts.data1,
                    // },
                    {
                        name: '风险业务量',
                        type: 'bar',
                        stack: 'a',
                        barWidth: '30%',
                        data: dOpts.data2,

                    }
                ]
            }
        },
        //获取热力图
        getCahrtTreemapOpts(opts) {
            var that = this;
            var dOpts = {
                main_color: ['#002766', '#003A8C', '#0050B3', '#096DD9', '#1890FF', '#40A9FF', '#69C0FF', '#91D5FF', '#BAE7FF', '#E6F7FF', '#F6FCFF'],
                series_data: [],

            }
            dOpts = $.extend(dOpts, opts);

            for (var n in dOpts.series_data) {
                dOpts.series_data[n]['name'] = dOpts.series_data[n]['name'] + '\n ' + dOpts.series_data[n]['value']
            }
            return {
                color: dOpts.main_color,
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}",
                    textStyle: {
                        color: '#F6D016',
                        fontFamily: 'DigitalB',
                        fontSize: that.calcPagePixel(24),
                    },
                },
                series: [{
                    type: 'treemap',
                    width: '100%',
                    height: '100%',
                    top: '1%',
                    roam: false, //是否开启拖拽漫游（移动和缩放）
                    nodeClick: false, //点击节点后的行为,false无反应
                    breadcrumb: {
                        show: false
                    },
                    label: { //描述了每个矩形中，文本标签的样式。
                        normal: {
                            show: true,
                            position: ['5%', '5%'],
                            textStyle: {
                                color: '#F6D016',
                                fontFamily: 'DigitalB',
                                fontSize: that.calcPagePixel(24),
                            }
                        }
                    },
                    data: dOpts.series_data
                }]
            }
        },


        //获取关系图
        getCahrtGraphOpts(opts) {

            var dOpts = {
                series_data: [],
                series_links: [],
                categories: [],

            }
            dOpts = $.extend(dOpts, opts);

            return {
                tooltip: {
                    trigger: 'item',
                    showContent: true,
                    formatter: function (params) {
                        var tipString = "";
                        tipString += '<div style="background:' + params.color + ';padding: 5px"><span>' + params.name + '</span></div>';
                        return tipString;
                    },
                },

                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        symbolSize: 45,
                        focusNodeAdjacency: true,
                        roam: true,
                        categories: dOpts.categories,
                        label: {
                            normal: {
                                show: false,
                                textStyle: {
                                    fontSize: 12
                                },
                            }
                        },
                        // force: {
                        //     repulsion: 100
                        // },
                        edgeSymbolSize: [4, 50],
                        data: dOpts.series_data,
                        links: dOpts.series_links,
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 1,
                                curveness: 0
                            }
                        }
                    }
                ]
            }
        }

    }
};