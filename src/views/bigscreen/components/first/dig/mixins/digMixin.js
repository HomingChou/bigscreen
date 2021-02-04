/**
 * Vue 报表注册混入对象
 * 数据对象在内部会进行递归合并，在和组件的数据发生冲突时以【组件】数据优先。
 */

export default {
    data() {
        return {
            digMapMixin: {
                'dig_esb': {
                    id: 'dig_esb',
                    name: '接口安全'
                },
                'dig_new_online_card': {
                    id: 'dig_new_online_card',
                    name: '渠道养卡'
                },
                'dig_reward_card': {
                    id: 'dig_reward_card',
                    name: '养卡套酬'
                },
                'dig_authentication_missing': {
                    id: 'dig_authentication_missinng',
                    name: '认证鉴权缺失'
                },
                'dig_cert_phony': {
                    id: 'dig_cert_phony',
                    name: '疑似证件造假'
                },
                'dig_opencard_bind_data': {
                    id: 'dig_opencard_bind_data',
                    name: '开卡绑定数据业务'
                },
                'dig_out_time_handle_business': {
                    id: 'dig_out_time_handle_business',
                    name: '非工作时间办理业务'
                },
                'dig_batch_handle_business': {
                    id: 'dig_batch_handle_business',
                    name: '批量办理业务'
                },
                'dig_high_frequency_handle_business': {
                    id: 'dig_high_frequency_handle_business',
                    name: '高频办理业务'
                },
                'dig_fund_collection': {
                    id: 'dig_fund_collection',
                    name: '资金归集'
                },
                'dig_group_accounting': {
                    id: 'dig_group_accounting',
                    name: '集团划账'
                },
                'dig_internet_arbitrage': {
                    id: 'dig_internet_arbitrage',
                    name: '互联网套利'
                },
                'dig_llgx': {
                    id: 'dig_llgx',
                    name: '疑似流量售卖', //原流量共享
                },
                'dig_bzqdz': {
                    id: 'dig_bzqdz',
                    name: '疑似不知情定制',
                },
                'dig_ywslaq': {
                    id: 'dig_ywslaq',
                    name: '业务受理安全',
                }
            }
        };
    },
    methods: {
        //格式化蜂窝图数据
        formatTopicHoneycomb(topicList, carouselItemsTmp) {
            let carourseDigsLength = Math.ceil(topicList.length / carouselItemsTmp.length);
            let carourseitemsLength = topicList.length % carouselItemsTmp.length;
            let carourseDigs = [];
            let topicIndex = 0;
            if (carourseDigsLength > 0) {
                $.each(new Array(carourseDigsLength), (index) => {
                    let carouselItems = JSON.parse(JSON.stringify(carouselItemsTmp));
                    let digObj = {
                        carouselItems: carouselItems,
                        carouseMap: {}
                    };
                    //最后一个
                    if (index === carourseDigsLength - 1) {
                        digObj.carouselItems = carouselItems.slice(0, carourseitemsLength)
                    }
                    $.each(digObj.carouselItems, (cIdx, cItem) => {
                        let topicMap = topicList[topicIndex] || {};
                        let themeIndex = cIdx % 5;
                        let carouseMap = {};
                        if (carouselItemsTmp.length === 10) {
                            switch (themeIndex) {
                                case 0:
                                    carouseMap = {
                                        style: 'blue',
                                        arrow: 'arrow-rotate0'
                                    };
                                    break;
                                case 1:
                                    carouseMap = {
                                        style: 'yellow',
                                        arrow: 'arrow-rotate60'
                                    };
                                    break;
                                case 2:
                                    carouseMap = {
                                        style: 'red',
                                        arrow: 'arrow-rotate180'
                                    };
                                    break;
                                case 3:
                                    carouseMap = {
                                        style: 'purple',
                                        arrow: 'arrow-rotate180'
                                    };
                                    break;
                                case 4:
                                    carouseMap = {
                                        style: 'green',
                                        arrow: 'arrow-rotate60'
                                    };
                                    break;

                            }
                        }
                        else if (carouselItemsTmp.length === 5) {
                            switch (themeIndex) {
                                case 0:
                                    carouseMap = {
                                        style: 'blue',
                                        arrow: 'arrow-rotate300'
                                    };
                                    break;
                                case 1:
                                    carouseMap = {
                                        style: 'yellow',
                                        arrow: 'arrow-rotate60'
                                    };
                                    break;
                                case 2:
                                    carouseMap = {
                                        style: 'red',
                                        arrow: 'arrow-rotate300'
                                    };
                                    break;
                                case 3:
                                    carouseMap = {
                                        style: 'purple',
                                        arrow: 'arrow-rotate60'
                                    };
                                    break;
                                case 4:
                                    carouseMap = {
                                        style: 'green',
                                        //arrow: 'arrow-rotate60'
                                    };
                                    break;

                            }
                        }

                        carouseMap.index = cIdx;
                        carouseMap.id = topicMap.topicId || '';
                        carouseMap.name = topicMap.titleName || '';
                        digObj.carouseMap['dig' + cItem] = carouseMap;
                        topicIndex++;
                    });
                    carourseDigs.push(digObj)
                })
            }
            return carourseDigs
        },
        //获取名称
        getDigNameById(id) {
            let name = '';
            if (id && this.digMapMixin[id]) {
                name = this.digMapMixin[id].name;
            }
            return name
        }

    }
};