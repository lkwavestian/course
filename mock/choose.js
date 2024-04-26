const chooseCourseDetails = {
    "code": 0,
    "content": {
        "administratorList": [
            {
                "chooseCoursePlanId": 1,
                "enName": "管89",
                "id": 1,
                "name": "管理员哈哈111"
            }
        ],
        "ccaAdministrator": [],
        "checkTimeConflict": 1,
        "choosePayType": 0,
        "classDate": [
            1,
            2,
            3,
            4,
            5,
            6
        ],
        "classFeeShow": true,
        "classTime": [
            {
                "endTime": "16:55",
                "id": 8267021,
                "startTime": "15:45"
            },
            {
                "endTime": "16:30",
                "id": 56744754,
                "startTime": "15:40"
            },
            {
                "endTime": "11:00",
                "id": 16784430,
                "startTime": "10:00"
            }
        ],
        'choosePayProjectSettingModelList': [
            {
              "accountId": 20,
              "accountName": "4月新账号测试01",
              "chargeItemEnName": "23",
              "chargeItemId": 75,
              "chargeItemName": "mzd",
              "defaultPaySetting": true,
              "itemCategoryEnName": "newtype2",
              "itemCategoryId": 17,
              "itemCategoryName": "新类型",
              "payType": 0
            },
            {
              "accountId": 20,
              "accountName": "4月新账号测试01",
              "chargeItemEnName": "mzd-002",
              "chargeItemId": 77,
              "chargeItemName": "材料费mzd-002",
              "defaultPaySetting": true,
              "itemCategoryEnName": "cca manager",
              "itemCategoryId": 16,
              "itemCategoryName": "材料费",
              "payType": 1
            }
          ],
        "courseIntroductionType": 0,
        "declareEndTime": "2023-08-27 23:59:59",
        "declareStartTime": "2023-08-14 00:00:00",
        "effectiveType": 1,
        "ename": "2023choose",
        "endTime": "2023-09-10 00:00:00",
        "feeAdministratorList": [
            {
                "chooseCoursePlanId": 248,
                "enName": "管89",
                "id": 1,
                "name": "管理员哈哈111"
            }
        ],
        "freePlateContent": "",
        "groupGroupingNumJsonDTOList": [],
        "id": 248,
        "materialFeeShow": true,
        "mergeOrder": 1,
        "name": "2023学年第一学期小学校队",
        "numberOfStudents": 0,
        "prefaceChooseCoursePlanModels": [
            {
                "adminUserIds": [
                    1
                ],
                "campusIds": [
                    1
                ],
                "checkTimeConflict": 0,
                "choosePayType": 0,
                "classDate": [
                    1,
                    2,
                    3,
                    4,
                    5
                ],
                "classFeeShow": true,
                "classTime": [
                    {
                        "endTime": "16:55",
                        "id": 12473415,
                        "startTime": "15:45"
                    },
                    {
                        "endTime": "17:15",
                        "id": 41971067,
                        "startTime": "15:45"
                    }
                ],
                "courseIntroductionType": 0,
                "createTime": "2023-08-24 14:59:43",
                "deleted": 0,
                "eduGroupCompanyId": 1,
                "effectiveType": 0,
                "ename": "2023S1选课前序选课计划",
                "endTime": "2023-08-27 00:00:00",
                "feeAdminUserIds": [
                    1
                ],
                "freePlateContent": "",
                "groupGroupingNumJsonDTOList": [],
                "id": 251,
                "materialFeeShow": true,
                "mergeOrder": 1,
                "modifyTime": "2023-08-24 14:59:43",
                "name": "2023S1选课前序选课计划",
                "prefaceChooseCoursePlanIds": [],
                "repeatableCourseFirst": false,
                "schoolId": 1,
                "schoolYearId": 117,
                "semesterId": 125,
                "stageIds": [
                    2
                ],
                "startTime": "2023-08-21 00:00:00",
                "syncSchedule": false,
                "tuitionPlanId": 1146,
                "type": 2,
                "versionId": -1
            }
        ],
        "repeatableCourseFirst": true,
        "schoolList": [
            {
                "chooseCoursePlanId": 248,
                "enName": "Hangzhou Yungu School",
                "id": 1,
                "name": "杭州云谷学校"
            }
        ],
        "schoolSectionList": [
            {
                "chooseCoursePlanId": 248,
                "enName": "primary school",
                "id": 2,
                "name": "小学",
                "stage": 2
            }
        ],
        "schoolYearId": 117,
        "schoolYearName": "2023学年",
        "semesterModel": {
            "eName": "Semester 1",
            "id": 125,
            "name": "第一学期",
            "officialEnName": "Year 2023 Semester 1",
            "officialSemesterName": "2023-2024学年 第1学期"
        },
        "startTime": "2023-08-21 00:00:00",
        "stintSubjectNumModelList": [
            {
                "number": 0,
                "subjectIdList": []
            }
        ],
        "syncSchedule": false,
        "type": 2
    },
    "ifAdmin": false,
    "ifLogin": true,
    "message": "成功!",
    "status": true
};

const getStudentsByClass = {
    code: 0,
    content: [
        {
            enName: 'yuncoursejjA A',
            id: 5352,
            name: '云谷课程A进阶 A班1',
        },
        {
            enName: 'yuncoursejjB1 A',
            id: 5355,
            name: '云谷课程B进阶I A班',
        },
        {
            enName: 'yuncoursejjB1 B',
            id: 5356,
            name: '云谷课程B进阶I B班hfuohcifocac',
        },
        {
            enName: 'yuncoursejjB2 A',
            id: 5357,
            name: '云谷课程B进阶II A班',
        },
        {
            enName: 'yuncoursejjB2 B',
            id: 5358,
            name: '云谷课程B进阶II B班',
        },
        {
            enName: 'yuncourseC A',
            id: 5360,
            name: '云谷课程C A班',
        },
        {
            enName: 'yuncoursejjC A',
            id: 5353,
            name: '云谷课程C进阶 A班',
        },
        {
            enName: 'yuncoursejjC B',
            id: 5354,
            name: '云谷课程C进阶 B班',
        },
        {
            enName: 'yungu-1',
            id: 5362,
            name: '云谷课程D-1',
        },
        {
            enName: 'course A',
            id: 5396,
            name: '云谷课程E A班',
        },
        {
            enName: '云谷课程F A班',
            id: 5389,
            name: '云谷课程F A班',
        },
        {
            enName: '云谷课程F B班',
            id: 5390,
            name: '云谷课程F B班',
        },
        {
            enName: 'yung-G A',
            id: 5397,
            name: '云谷课程G A班',
        },
    ],
    ifAdmin: false,
    ifLogin: true,
    message: '成功',
    status: true,
};

const chooseCoursePlanBatchList = {
    "code": 0,
    "content": [
        {
            "chooseCoursePlanId": 246,
            "closingTime": "2023-07-05 10:00:00",
            "endTime": "2023-07-05 09:59:00",
            "id": 209,
            "num": 11,
            "startTime": "2023-07-05 09:47:00",
            "status": 2,
            "type": 1
        },
        {
            "chooseCoursePlanId": 246,
            "closingTime": "2023-07-08 13:46:00",
            "endTime": "2023-07-07 13:46:00",
            "id": 210,
            "num": 1,
            "startTime": "2023-07-05 10:02:00",
            "status": 1,
            "type": 0
        }
    ],
    "ifAdmin": false,
    "ifLogin": true,
    "message": "成功!",
    "status": true
};
const newGoodOpenChooseCourse = {
    code: 0,
    content: [
        {
            chooseCoursePlanId: 107,
            closingTime: '2022-06-20 13:49:00',
            endTime: '2022-06-16 13:49:00',
            id: 101,
            num: 3,
            startTime: '2022-06-08 13:49:00',
            status: 1,
            type: 0,
        },
    ],
    ifAdmin: false,
    ifLogin: true,
    message: '成功',
    status: true,
};
const getPayChargeItemList = {
    "code": 0,
    "content": [
        {
            "accountId": 13,
            "accountName": "demo账户",
            "chargeItemEnName": "123123123",
            "chargeItemId": 278,
            "chargeItemName": "demo课时费",
            "itemCategoryEnName": "123",
            "itemCategoryId": 24,
            "itemCategoryName": "课时费"
        },
        {
            "accountId": 13,
            "accountName": "demo账户",
            "chargeItemEnName": "22323",
            "chargeItemId": 279,
            "chargeItemName": "demo材料费",
            "itemCategoryEnName": "02",
            "itemCategoryId": 25,
            "itemCategoryName": "材料费"
        },
        {
            "accountId": 13,
            "accountName": "demo账户",
            "chargeItemEnName": "tuoban",
            "chargeItemId": 280,
            "chargeItemName": "托班",
            "itemCategoryEnName": "123",
            "itemCategoryId": 24,
            "itemCategoryName": "课时费"
        }
    ],
    "ifAdmin": false,
    "ifLogin": true,
    "message": "成功!",
    "status": true
};
const goodCloseChooseCourse = {
    code: 0,
    content: [
        {
            chooseCoursePlanId: 107,
            closingTime: '2022-06-20 13:49:00',
            endTime: '2022-06-16 13:49:00',
            id: 101,
            num: 3,
            startTime: '2022-06-08 13:49:00',
            status: 1,
            type: 0,
        },
    ],
    ifAdmin: false,
    ifLogin: true,
    message: '成功',
    status: true,
};

const getCourseSchedule = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
    content: [
        {
            id: 1,
            name: '第一学期',
        },
        {
            id: 2,
            name: '第二学期',
        },
    ],
};

const getSchedule = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
    content: [
        {
            id: 1,
            toggleTime: '2022-05-06',
            schedule: '2022-05-01 小学选课课表',
            operator: 'CCA小助手',
        },
        {
            id: 2,
            toggleTime: '2022-05-06',
            schedule: '2022-05-01 小学选课课表',
            operator: 'CCA小助手',
        },
    ],
};

const addedOrEditChooseCoursePlanBatch = {
    ifLogin: true,
    status: true,
    message: '更新成功~~',
    code: 0,
    content: null,
    ifAdmin: false,
};

const batchChooseCourseDelete = {
    ifLogin: true,
    status: true,
    message: '删除成功~~',
    code: 0,
    content: null,
    ifAdmin: false,
};

const coursePlanning = {
    ifLogin: true,
    status: true,
    message: '提交成功~~',
    code: 0,
    content: null,
    ifAdmin: false,
};

const excelImport = {
    code: -1,
    content: {
        /* checkErrorMessageList: [
            {
                errorMessage:
                    '课程(魔方世界G1G21111)不存在,课程(魔方世界G1G21111)对应的开课计划不存在,课程(魔方世界G1G21111)班级(魔方世界G1G2 H班)对应的班课关系不存在',
                lineNumber: 2,
            },
        ],
        checkOrImport: false,
        failureNumber: 1, */
    },
    ifAdmin: false,
    ifLogin: true,
    message: '失败',
    status: false,
};

export {
    chooseCourseDetails,
    chooseCoursePlanBatchList,
    newGoodOpenChooseCourse,
    goodCloseChooseCourse,
    addedOrEditChooseCoursePlanBatch,
    batchChooseCourseDelete,
    coursePlanning,
    excelImport,
    getCourseSchedule,
    getSchedule,
    getPayChargeItemList,
    getStudentsByClass,
};
