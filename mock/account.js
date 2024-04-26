const accountList = {
    ifLogin: true,
    status: true,
    message: '请求成功',
    code: 0,
    content: {
        data: [
            {
                id: 1, //主键ID
                accountName: '张三', //账户名称
                orgId: '1', //机构id
                orgName: '机构', //机构名称
                channelIds: '1', //收款渠道ID，多个逗号分割
                accountStatus: 0, //账户状态,是否禁用(0未禁用,1禁用)
                businessesId: '123', //商户id
                businessesName: '测试', //商户名字
                channelNames: '支付宝', //收款渠道名称，多个逗号分割
                gmtCreateTime: '',
                gmtModifyTime: '',
            },
            {
                id: 2, //主键ID
                accountName: '李四', //账户名称
                orgId: '2', //机构id
                orgName: '机构名称', //机构名称
                channelIds: '1,2', //收款渠道ID，多个逗号分割
                accountStatus: 0, //账户状态,是否禁用(0未禁用,1禁用)
                businessesId: '123', //商户id
                businessesName: '测试', //商户名字
                channelNames: '支付宝,网商', //收款渠道名称，多个逗号分割
                gmtCreateTime: '',
                gmtModifyTime: '',
            },
        ],
        total: 20,
    },
    ifAdmin: false,
};

const balanceList = {
    code: 1001,
    content: {
        data: {
            payWalletModelList: [
                {
                    balance: '2.00',
                    groupEnName: 'G9Yun',
                    groupId: 363,
                    groupName: '九年级（云）',
                    studentNo: '200110001',
                    userEnName: '鲍673',
                    userId: 3192,
                    userName: '鲍673',
                },
                {
                    balance: '2.00',
                    groupEnName: 'G6 G5C4',
                    groupId: 355,
                    groupName: '六年级（4）班',
                    studentNo: '870104007122',
                    userEnName: 'child1',
                    userId: 3628,
                    userName: '2021.3.2孩子1',
                },
            ],
            totalWalletBalance: '2.00',
        },
        pageNum: 1,
        pageSize: 10,
        total: 2,
    },
    ifLogin: true,
    message: '成功',
    status: true,
};

const getBalanceList = {
    code: 1001,
    content: {
        data: {
            allChangeAmount: '13.01',
            increaseChangeAmount: '12.01',
            payWalletDetailModelList: [
                {
                    changeAmount: '1.00',
                    changeMannerName: '财务结算',
                    changeTime: '2023-02-02 10:00:00',
                    changeType: 2,
                    changeTypeName: '支出',
                    createUserId: 73,
                    createUserName: '裴桐',
                    groupId: 2,
                    groupName: '1',
                    remark: '收入-1',
                    studentNo: '200110001',
                    userEnName: '鲍673',
                    userName: '鲍673',
                    orderNo: 1,
                    canUseWallet: false,
                },
                {
                    changeAmount: '1.00',
                    changeMannerName: '财务结算',
                    changeTime: '2023-02-02 10:00:00',
                    changeType: 1,
                    changeTypeName: '收入',
                    createUserId: 73,
                    createUserName: '裴桐',
                    groupId: 2,
                    groupName: '1',
                    remark: '收入-1',
                    studentNo: '200110001',
                    userEnName: '鲍673',
                    userName: '鲍673',
                    canUseWallet: true,
                },
                {
                    changeAmount: '10.01',
                    changeMannerName: '财务结算',
                    changeTime: '2023-02-02 10:00:00',
                    changeType: 1,
                    changeTypeName: '收入',
                    createUserId: 73,
                    createUserName: '裴桐',
                    groupId: 2,
                    groupName: '1',
                    remark: '收入-1',
                    studentNo: '200110001',
                    userEnName: '鲍673',
                    userName: '鲍673',
                    orderNo: 0,
                    canUseWallet: false,
                },
                {
                    changeAmount: '1.00',
                    changeMannerName: '财务结算',
                    changeTime: '2023-02-02 10:00:00',
                    changeType: 1,
                    changeTypeName: '收入',
                    createUserId: 73,
                    createUserName: '裴桐',
                    groupId: 2,
                    groupName: '1',
                    remark: '收入-1',
                    studentNo: '200110001',
                    userEnName: '鲍673',
                    userName: '鲍673',
                    orderNo: 2,
                    canUseWallet: true,
                },
            ],
            reduceChangeAmount: '1.00',
        },
        pageNum: 1,
        pageSize: 10,
        total: 4,
    },
    ifLogin: true,
    message: '成功',
    status: true,
};

const getScreeningItems = {
    code: 1001,
    content: {
        payChangeMannerVOList: [
            {
                type: 1,
                typeName: '财务结算',
            },
            {
                type: 2,
                typeName: '财务退款',
            },
            {
                type: 3,
                typeName: '余额抵扣',
            },
        ],
        payChangeTypeVOList: [
            {
                type: 1,
                typeName: '收入',
            },
            {
                type: 2,
                typeName: '支出',
            },
        ],
    },
    ifLogin: true,
    message: '成功',
    status: true,
};

const queryMerchantAccountList = {
    ifLogin: true,
    status: true,
    message: '请求成功',
    code: 0,
    content: [
        {
            alipayKey: '1212',
            appId: '2',
            appKey: '22',
            appPublicKey: '21',
            id: 27,
            name: '231',
            payType: 2,
        },
        {
            alipayKey: '22',
            appId: '232',
            appKey: '12',
            appPublicKey: '1212',
            id: 26,
            name: '12',
            payType: 1,
        },
        {
            alipayKey: '2121',
            appId: '121',
            appKey: '323',
            appPublicKey: '3223',
            id: 25,
            name: '123',
            payType: 2,
        },
        {
            alipayKey: '21312',
            appId: '323',
            appKey: '1212',
            appPublicKey: '213',
            id: 24,
            name: '2232',
            payType: 2,
        },
        {
            alipayKey: 'aoiak',
            appId: 'appid',
            appKey: 'ak',
            appPublicKey: 'sk',
            id: 23,
            name: 'test',
            payType: 2,
        },
        {
            alipayKey: '1',
            appId: '1',
            appKey: '1',
            appPublicKey: '11',
            id: 22,
            name: '1',
            payType: 2,
        },
        {
            alipayKey: '1',
            appId: '1',
            appKey: '1',
            appPublicKey: '11',
            id: 21,
            name: '1',
            payType: 2,
        },
        {
            alipayKey: '1',
            appId: '11',
            appKey: '11',
            appPublicKey: '1',
            id: 20,
            name: '1',
            payType: 1,
        },
        {
            alipayKey: '123123',
            appId: '3232',
            appKey: '1231',
            appPublicKey: '213123',
            id: 19,
            name: '21212',
            payType: 1,
        },
        {
            alipayKey: 'aliak',
            appId: 'appid',
            appKey: 'ak',
            appPublicKey: 'sk',
            id: 18,
            name: '微信支付yunlong',
            payType: 1,
        },
        {
            alipayKey: '1',
            appId: '11',
            appKey: '1',
            appPublicKey: '1',
            id: 17,
            name: '1',
            payType: 1,
        },
        {
            alipayKey: '1',
            appId: '1',
            appKey: '1',
            appPublicKey: '1',
            id: 16,
            name: '1',
            payType: 2,
        },
        {
            alipayKey: '1',
            appId: '1',
            appKey: '1',
            appPublicKey: '1',
            id: 15,
            name: '1',
            payType: 1,
        },
        {
            alipayKey: 'rf',
            appId: 'cfv',
            appKey: 'fe',
            appPublicKey: 'fe',
            id: 14,
            name: 'wed',
            payType: 2,
        },
        {
            alipayKey: 'alikey',
            appId: 'apiiid',
            appKey: 'publickey',
            id: 9,
            name: '测试新增',
            payType: 1,
        },
        {
            id: 1,
            name: '杭州云谷幼儿园',
            payType: 1,
        },
        {
            id: 2,
            name: '杭州云谷学校',
            payType: 1,
        },
        {
            id: 3,
            name: '云谷星球',
            payType: 1,
        },
        {
            alipayKey:
                'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA09PsmucF866eyka5Qb3qcbUSw4Cy9NpF99kqqjWHAk2LvR2zNENESoHFZkTqsuKwXx3PwWfFQNwJPCVsAHDkU+ocVW455sp3hNNGZi5KJJU56AIxqJZCjR9wsUwxvmczQX9hzerTEI9PWBEdOlzVGRrMH2/W8ww8FQkgWEM3n7ZZ9t37It9m3/iRpLJq0hlb8SpFn5RBvAfa1XdmTmtSFJya56zG4HkaQde9p0t697orjSA+T4FwC8cz8RQiCkTF0BiBUj5DuG8heILkNsFYpgTs0Rjk8JJJ87T9W566oNYPSRMUdD71cx+QkPua2a9eezwROd4gTN3riJgPS4BelQIDAQAB',
            appId: '2021002150666991',
            appKey: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDT0+ya5wXzrp7KRrlBvepxtRLDgLL02kX32SqqNYcCTYu9HbM0Q0RKgcVmROqy4rBfHc/BZ8VA3Ak8JWwAcORT6hxVbjnmyneE00ZmLkoklTnoAjGolkKNH3CxTDG+ZzNBf2HN6tMQj09YER06XNUZGswfb9bzDDwVCSBYQzeftln23fsi32bf+JGksmrSGVvxKkWflEG8B9rVd2ZOa1IUnJrnrMbgeRpB172nS3r3uiuNID5PgXALxzPxFCIKRMXQGIFSPkO4byF4guQ2wVimBOzRGOTwkknztP1bnrqg1g9JExR0PvVzH5CQ+5rZr157PBE53iBM3euImA9LgF6VAgMBAAECggEAFn4nXp9va1u8csAlxcxTy7Utg+LznbpbuaCuvhom9uCjGPbBY6hM5Rh4jI5+2XXmwoLY37GUKXnz5RYYLMfQBvUSAyRMM6yGGm2QySLbLp1F49Pvz/X8pR2Uis8LbStqLudGzGXF+bkt9K0EjID1A9Brol7u1SoUaytn6tdgXa3+t0y7t3kGl1b/4pw54tiO2VhqGcojD2fr4K/57ix4vkErsFfVJNUzAJHbQXyRCk+CkSr3Uekwwxms0G1aIMZgMB7Ne/nJSqXzFDVVGbWPRmwAHy1GW3/7i07/ban4rIj+ply1CiLFqp5+KXRJyXVL1vN6sJGk4xneImqJoWfkIQKBgQD5acGqJc+OjXJ6BT1pKOrtcEzy408isJu009t+eIGDsua1mWin2I8zPSGeq+x5NhjPhJq/tql1/qRN+crpPkRsnv30vu14u5kgEg8cEl0w1HAFA+A3AlBMKAeSpT5+4/jZWdsG0HgPiUtOMIARKRc11glvUDyFVG1zc80HjwMgKQKBgQDZbA84OS5gMx9y1PpXOXri07xYgOMgYsFWI0+pElbh44je4srai8g2MTqPbUUW6dFxyUPist64',
            id: 12,
            name: '云谷公司缴费（非教育缴费）',
            payType: 1,
        },
    ],
    ifAdmin: false,
};

const delMsg = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
};

const delPayBusiness = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
};

const busiAndChannelList = {
    ifLogin: true,
    status: true,
    message: '请求成功',
    code: 0,
    content: {
        payFundChannelsList: [
            {
                channelName: '支付宝',
                id: 1,
            },
            {
                channelName: '微信支付',
                id: 11,
            },
        ],
        payBusinessesList: [
            {
                businessesNo: 'YG-0001',
                businessesName: '杭州云谷幼儿园',
                id: 1,
            },
            {
                businessesNo: 'YG-0003',
                businessesName: '云谷星球',
                id: 3,
            },
            {
                businessesNo: 'e55cafdf-3ed2-4df3-a897-14cb2aafc74c',
                businessesName: '微信支付yunlong',
                id: 18,
            },
            {
                businessesNo: '4849fd4d-74d1-47c6-8a9f-c35df9bfaecf',
                businessesName: 'wechat',
                id: 32,
            },
        ],
    },
    ifAdmin: false,
};

const queryPayBusinessById = {
    ifLogin: true,
    status: true,
    message: '请求成功',
    code: 0,
    content: {
        alipayKey: '1',
        alipayType: '2',
        appId: '1',
        appKey: '2',
        appPublicKey: '1',
        name: '1',
        payType: 2,
    },
    ifAdmin: false,
};

const addOrUpdPayAccount = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
};
//addMerChant
const addMerChant = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
};
const paymentMethodJudgment = {
    content: [1],
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
};
export default {
    delMsg, // 删除
    accountList, // 列表
    busiAndChannelList, // 商户和渠道
    addOrUpdPayAccount, // 新建编辑
    addMerChant,
    paymentMethodJudgment,
    queryMerchantAccountList,
    delPayBusiness,
    queryPayBusinessById,
    balanceList, //余额列表
    getBalanceList, //余额变动明细列表
    getScreeningItems,
};
