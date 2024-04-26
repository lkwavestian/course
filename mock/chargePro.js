const payItemDelMsg = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
};

const queryPayItemList = {
    ifLogin: true,
    code: 1001,
    content: {
        total: 20,
        data: [
            {
                accountName: '威德学校账户',
                remark: '',
                categoryName: '课时费',
                orgId: 1,
                tags: 0,
                accountId: 7,
                ename: 'Class Fee',
                chargeItemNo: 'F0258',
                price: '1.00',
                name: '课时费',
                categoryNo: '1015',
                id: 258,
                itemDiscountRatio: 0.7,
                itemDiscountType: 2,
                suitStage: [
                    {
                        ename: 'primary school',
                        name: '小学',
                        stage: 2,
                    },
                ],
            },
            {
                accountName: '威德学校账户',
                remark: '',
                categoryName: '材料费',
                orgId: 1,
                tags: 0,
                accountId: 7,
                ename: 'Material Cost',
                chargeItemNo: 'F0257',
                price: '1.00',
                name: '中小学材料费',
                categoryNo: '1016',
                id: 257,
                itemDiscountRatio: 0.8,
                itemDiscountType: 1,
                suitStage: [
                    {
                        ename: 'primary school',
                        name: '小学',
                        stage: 2,
                    },
                    {
                        ename: 'junior high school',
                        name: '初中',
                        stage: 3,
                    },
                ],
            },
        ],
    },
    message: '成功',
    status: true,
};

const queryPayItemCategory = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
    content: [
        {
            id: 1,
            name: '测试',
            ename: 'en',
            status: '1',
            deleted: false,
            categoryNo: '1234',
            gmtCreateTime: '',
            gmtModifyTime: '',
        },
        {
            id: 2,
            name: '分类',
            ename: 'een',
            status: '1',
            deleted: false,
            categoryNo: '123',
            gmtCreateTime: '',
            gmtModifyTime: '',
        },
    ],
};

const addOrUpdPayItemCategory = {
    ifLogin: true,
    status: true,
    message: '成功dddd',
    code: 2015,
    ifAdmin: false,
};

const addOrUpdPayChargeItem = {
    ifLogin: true,
    status: true,
    message: '收费项目中文名称不允许重复',
    code: 2013,
    ifAdmin: false,
};

const delPayItemCategory = {
    code: 1001,
    ifLogin: true,
    message: '成功',
    status: true,
    ifAdmin: false,
};

export default {
    payItemDelMsg, // 删除
    queryPayItemList, // 列表
    queryPayItemCategory, // 收费项目类型
    addOrUpdPayChargeItem, // 新建修改项目
    addOrUpdPayItemCategory, // 新建修改项目类型
    delPayItemCategory, // 删除项目类型
};
