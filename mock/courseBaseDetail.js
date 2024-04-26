// 课程列表--班级详情
const courseResultDetails = {
    ifLogin: true,
    status: true,
    message: '请求成功',
    code: 0,
    content: {
        courseName: '',
        chooseCoursePlanName: '',
        chooseCoursePlanId: '',
        coursePlanningId: '',
        classList: [
            {
                id: 1111,
                name: '班级名称1',
                englishName: 'Fencing（Primary）1th',
            },
            {
                id: 2222,
                name: '班级名称2',
                englishName: 'Fencing（Primary）1th',
            },
            {
                id: 3333,
                name: '班级名称3',
                englishName: 'Fencing（Primary）1th',
            },
            {
                id: 4444,
                name: '班级名称4',
                englishName: 'Fencing（Primary）1th',
            },
        ],
    },
};

const classStudentList = {
    code: 0,
    content: {
        applyCount: 0,
        pageNum: 1,
        pageSize: 50,
        selectedCount: 1,
        submitStatus: 1,
        studentList: [
            {
                classId: 2231,
                className: '01班',
                ename: 'Hay cloud',
                id: 7416,
                joinTime: '2022-08-16 16:43:12',
                joinType: 1,
                name: '牟云',
                payStatus: 1,
                sex: 1,
                status: 1,
                studentID: '170100000',
                userId: 100000100447,
                cancelTime: '2022-08-16 16:43:12',
                studentType: 0,
            },
            {
                classId: 2231,
                className: '01班',
                ename: 'Hay cloud',
                id: 7416,
                joinTime: '2022-08-16 16:43:12',
                joinType: 1,
                name: '牟云',
                payStatus: 2,
                sex: 1,
                status: 1,
                studentID: '170100000',
                userId: 100000100447,
                cancelTime: '2022-08-16 16:43:12',
            },
            {
                classId: 2231,
                className: '01班',
                ename: 'Hay cloud',
                id: 7416,
                joinTime: '2022-08-16 16:43:12',
                joinType: 1,
                name: '牟云',
                payStatus: 3,
                sex: 1,
                status: 1,
                studentID: '170100000',
                userId: 100000100447,
            },
            {
                classId: 2231,
                className: '01班',
                ename: 'Hay cloud',
                id: 7416,
                joinTime: '2022-08-16 16:43:12',
                joinType: 1,
                name: '牟云',
                // payStatus: 1,
                sex: 1,
                status: 1,
                studentID: '170100000',
                userId: 100000100447,
                messageStatus: 2,
            },
            {
                classId: 2231,
                className: '01班',
                ename: 'Hay cloud',
                id: 7416,
                joinTime: '2022-08-16 16:43:12',
                joinType: 1,
                name: '牟云',
                payStatus: 4,
                sex: 1,
                status: 1,
                studentID: '170100000',
                userId: 100000100447,
            },
            {
                classId: 2231,
                className: '01班',
                ename: 'Hay cloud',
                id: 7416,
                joinTime: '2022-08-16 16:43:12',
                joinType: 1,
                name: '牟云',
                payStatus: 5,
                sex: 1,
                status: 1,
                studentID: '170100000',
                userId: 100000100447,
            },
        ],
        total: 1,
        type: 1,
    },
    ifAdmin: false,
    ifLogin: true,
    message: '成功',
    status: true,
};

const courseClassDetails = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    content: {
        id: 645,
        type: 2,
        maxStudent: null,
        minStudent: null,
        classStart: 1,
        startTime: '2020-08-24',
        endTime: '2021-08-23',
        teacherList: [
            {
                id: 73,
                name: '裴桐',
                ename: 'Periny',
                teacherType: 0,
            },
        ],
        siteList: [
            {
                name: '大禹路501',
                id: 73,
            },
            {
                name: '大禹路502',
                id: 74,
            },
            {
                name: '大禹路503',
                id: 75,
            },
            {
                name: '大禹路504',
                id: 76,
            },
        ],
        studentList: null,
    },
    ifAdmin: false,
};

const chooseCourseBasicInfo = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    content: {
        coursesId: 63,
        name: '道法G1',
        ename: 'Moral and Legal Education G1',
        disableStatus: 0,
        courseCode: 'fd5645',
        gradeList: [
            {
                gradeName: '一年级',
                gradeId: 4,
            },
            {
                gradeName: '二年级',
                gradeId: 5,
            },
        ],
        teacher: ['李思思'],
        externalTeachers: ['张庆峰', '李西溪', '张默秦'],
        courseIntroduction: '十里桃花',
        creditSubjectList: [
            {
                credit: '1.0',
                subjectId: 8,
                subjectName: '体育',
            },
            {
                credit: '2.0',
                subjectId: 7,
                subjectName: '道法',
            },
        ],
        siteList: [
            {
                name: '体育馆',
                id: 39,
            },
            {
                name: '梦工厂 4-3-3',
                id: 41,
            },
            {
                name: '大操场',
                id: 44,
            },
        ],
        schoolList: [
            {
                name: '杭州云谷学校',
                id: 2,
            },
        ],
        chooseCourseName: '测试第二步返回第一步',
    },
    ifAdmin: false,
};

const generateBillOfPayment = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    content: null,
    ifAdmin: false,
};

// 课程列表
const selectionMessage = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    content: {
        chooseCoursePlanId: 5,
        name: '青鸟',
        englishName: 'Jade Bird',
        schoolId: 2,
        schoolName: '杭州云谷学校',
        schoolEnglishName: 'Hangzhou Yungu School Campus',
        teachingOrgOutputModels: [
            {
                id: 2,
                orgName: '小学',
                orgEname: 'primary school',
                stage: null,
                grade: null,
            },
        ],
        schoolYearId: 4,
        schoolYearName: '2019学年',
        schoolYearEnglishName: '2019 Academic Year ',
        startTime: 1590979275000,
        endTime: 1592448075000,
        startTimeString: '2020-06-01',
        endTimeString: '2020-06-18',
        admins: [
            {
                userId: 4,
                name: '张阳',
                enName: 'Kate Zhang',
                identity: null,
                avatar: '',
            },
            {
                userId: 5,
                name: '赵娓',
                enName: 'Daisy Zhao',
                identity: null,
                avatar: null,
            },
        ],
        semesterModel: {
            id: 1,
            name: '第二学期',
            eName: 'sier',
            officialSemesterName: '2020学年 第二学期',
        },
    },
    ifAdmin: false,
};

const checkCoursePlanAddPermission = {
    ifLogin: true,
    status: true,
    message: '成功',
    content: true,
    code: 0,
    ifAdmin: false,
};
const checkClassPermission = {
    ifLogin: true,
    status: true,
    message: '成功',
    content: true,
    code: 0,
    ifAdmin: false,
};
const selectGroupingByChoosePlan = {
    "code": 0,
    "content": [
        {
            "groupingKey": "f6c6506c-5bb2-4fa8-ac9b-09dd4eccfd13",
            "groupingName": "分组1",
            "number": 1,
            "totalNumber": 1
        },
        {
            "groupingKey": "6f62ae61-cc8a-4541-9b3f-77e325152944",
            "groupingName": "分组2",
            "number": 1,
            "totalNumber": 1
        }
    ],
    "ifAdmin": false,
    "ifLogin": true,
    "message": "成功!",
    "status": true
};

const selectionList = {
    code: 0,
    content: {
        allGroupCount: 18,
        courseCount: 10,
        coursePlanOutputModels: [
            {
                courseEnglishName: 'Band',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 5,
                        addressList: [
                            {
                                enName: 'C417',
                                id: 336,
                                name: 'C417',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 5,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 29560625,
                                weekday: 1,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 4407477,
                                weekday: 2,
                            },
                        ],
                        courseGroupPlanIds: [22772],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5507,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/5d614d42-e3af-4a48-b7a7-0e5fa015b6ce',
                                enName: 'Chad Gregory Allen',
                                name: 'Chad Gregory Allen',
                                unionUserId: '5d614d42-e3af-4a48-b7a7-0e5fa015b6ce',
                                userId: 6116,
                            },
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/874b247f-429a-4dce-b6bf-b67cb7455945',
                                enName: 'Guan Guanlu',
                                name: '管观路',
                                unionUserId: '874b247f-429a-4dce-b6bf-b67cb7455945',
                                userId: 100000100506,
                            },
                        ],
                        maxSignUpCount: 10,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Band ',
                            id: 5507,
                            maxStudentCount: 10,
                            minStudentCount: 1,
                            name: '乐队',
                            studentCount: 0,
                        },
                        weekDayLesson: '周一、周二 12:15-13:35',
                    },
                ],
                materialCost: 100,
                newMaterialCost: 200,
                oldMaterialCost: 300,
                courseId: 852,
                courseName: '乐队',
                coursePlanId: 6296,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'Entrepreneurship',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 4,
                        addressList: [
                            {
                                enName: 'D412',
                                id: 433,
                                name: 'D412',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 4,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 94303788,
                                weekday: 3,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 84358004,
                                weekday: 4,
                            },
                        ],
                        courseGroupPlanIds: [22775],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5498,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/51a2c9bc-3499-4490-bf2a-e5a78b479d0a',
                                enName: 'Benny',
                                name: 'Qiushi Zhu',
                                unionUserId: '51a2c9bc-3499-4490-bf2a-e5a78b479d0a',
                                userId: 4856,
                            },
                        ],
                        maxSignUpCount: 8,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Entrepreneurship ',
                            id: 5498,
                            maxStudentCount: 8,
                            minStudentCount: 1,
                            name: '企业家精神',
                            studentCount: 0,
                        },
                        weekDayLesson: '周三、周四 12:15-13:35',
                    },
                ],
                courseId: 3310,
                courseName: '企业家精神',
                coursePlanId: 6305,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'Media Club',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 14,
                        addressList: [
                            {
                                enName: 'D408-409',
                                id: 298,
                                name: 'D408-409',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 14,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 97321066,
                                weekday: 3,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 50970079,
                                weekday: 4,
                            },
                        ],
                        courseGroupPlanIds: [22781],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5508,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/acd09750-12c6-4f06-8c4a-1aa8daff3542',
                                enName: 'Eva',
                                name: '束晨燕',
                                unionUserId: 'acd09750-12c6-4f06-8c4a-1aa8daff3542',
                                userId: 4549,
                            },
                        ],
                        maxSignUpCount: 16,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Media Club ',
                            id: 5508,
                            maxStudentCount: 16,
                            minStudentCount: 1,
                            name: '传媒 ',
                            studentCount: 0,
                        },
                        weekDayLesson: '周三、周四 12:15-13:35',
                    },
                ],
                courseId: 848,
                courseName: '传媒',
                coursePlanId: 6299,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'Service',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 10,
                        addressList: [
                            {
                                enName: 'D420',
                                id: 291,
                                name: 'D420',
                            },
                        ],
                        assistTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/1ebb803b-5dc5-4528-98f8-448bbcd7b835',
                                enName: 'April',
                                name: '姚韦华',
                                unionUserId: '1ebb803b-5dc5-4528-98f8-448bbcd7b835',
                                userId: 4548,
                            },
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/2bab65ca-6b3f-4127-af2d-f05d43beca48',
                                enName: 'Robert Bu',
                                name: '卜聪',
                                unionUserId: '2bab65ca-6b3f-4127-af2d-f05d43beca48',
                                userId: 100000100518,
                            },
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/9b8ec49b-7d66-4b1a-b70e-a91853b2f0b8',
                                enName: 'Ella',
                                name: '钱凌波',
                                unionUserId: '9b8ec49b-7d66-4b1a-b70e-a91853b2f0b8',
                                userId: 100000113537,
                            },
                        ],
                        chooseCount: 10,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 64942648,
                                weekday: 1,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 86453392,
                                weekday: 2,
                            },
                        ],
                        courseGroupPlanIds: [22814],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5511,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/2f95492e-447d-4f9d-a536-8469e1b1a766',
                                enName: 'Jaye',
                                name: '杨晓晶',
                                unionUserId: '2f95492e-447d-4f9d-a536-8469e1b1a766',
                                userId: 4577,
                            },
                        ],
                        maxSignUpCount: 10,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Service',
                            id: 5511,
                            maxStudentCount: 10,
                            minStudentCount: 1,
                            name: '公益服务',
                            studentCount: 0,
                        },
                        weekDayLesson: '周一、周二 12:15-13:35',
                    },
                ],
                courseId: 3312,
                courseName: '公益服务',
                coursePlanId: 6293,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'Chamber Music',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 4,
                        addressList: [
                            {
                                enName: 'C417',
                                id: 336,
                                name: 'C417',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 4,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 22763896,
                                weekday: 1,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 3054501,
                                weekday: 2,
                            },
                        ],
                        courseGroupPlanIds: [22785],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5501,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/5d614d42-e3af-4a48-b7a7-0e5fa015b6ce',
                                enName: 'Chad Gregory Allen',
                                name: 'Chad Gregory Allen',
                                unionUserId: '5d614d42-e3af-4a48-b7a7-0e5fa015b6ce',
                                userId: 6116,
                            },
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/874b247f-429a-4dce-b6bf-b67cb7455945',
                                enName: 'Guan Guanlu',
                                name: '管观路',
                                unionUserId: '874b247f-429a-4dce-b6bf-b67cb7455945',
                                userId: 100000100506,
                            },
                        ],
                        maxSignUpCount: 6,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Chamber Music',
                            id: 5501,
                            maxStudentCount: 6,
                            minStudentCount: 1,
                            name: '室内音乐',
                            studentCount: 0,
                        },
                        weekDayLesson: '周一、周二 12:15-13:35',
                    },
                ],
                courseId: 3301,
                courseName: '室内音乐',
                coursePlanId: 6289,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'Drama Club',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 6,
                        addressList: [
                            {
                                enName: 'the black box',
                                id: 463,
                                name: '黑盒剧场',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 6,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 81324719,
                                weekday: 3,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 84516782,
                                weekday: 4,
                            },
                        ],
                        courseGroupPlanIds: [22779],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5504,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/a32743a0-ae24-44e7-9b7c-df03899c5654',
                                enName: 'Cecilia',
                                name: '孙艳伟',
                                unionUserId: 'a32743a0-ae24-44e7-9b7c-df03899c5654',
                                userId: 2340,
                            },
                        ],
                        maxSignUpCount: 16,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Drama Club',
                            id: 5504,
                            maxStudentCount: 16,
                            minStudentCount: 1,
                            name: '戏剧社',
                            studentCount: 0,
                        },
                        weekDayLesson: '周三、周四 12:15-13:35',
                    },
                ],
                courseId: 859,
                courseName: '戏剧社',
                coursePlanId: 6301,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'Board Game R&D',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 10,
                        addressList: [
                            {
                                enName: 'D418',
                                id: 293,
                                name: 'D418',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 10,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 17064536,
                                weekday: 1,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 91476063,
                                weekday: 2,
                            },
                        ],
                        courseGroupPlanIds: [22771],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5512,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/ed25e98b-2149-451a-a61d-70c71ce1d0c2',
                                enName: 'Lia',
                                name: '李思锦',
                                unionUserId: 'ed25e98b-2149-451a-a61d-70c71ce1d0c2',
                                userId: 2349,
                            },
                        ],
                        maxSignUpCount: 10,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Board Game R&D',
                            id: 5512,
                            maxStudentCount: 10,
                            minStudentCount: 1,
                            name: '桌游研究与设计',
                            studentCount: 0,
                        },
                        weekDayLesson: '周一、周二 12:15-13:35',
                    },
                ],
                courseId: 3307,
                courseName: '桌游研究与设计',
                coursePlanId: 6294,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'Eco Club',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 11,
                        addressList: [
                            {
                                enName: 'D406',
                                id: 384,
                                name: 'D406',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 11,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 43497712,
                                weekday: 1,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 41183307,
                                weekday: 2,
                            },
                        ],
                        courseGroupPlanIds: [22786],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5505,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/d8907711-772b-45f2-b7f6-4722e3eedac9',
                                enName: 'Tatiana',
                                name: '何婷婷',
                                unionUserId: 'd8907711-772b-45f2-b7f6-4722e3eedac9',
                                userId: 4567,
                            },
                        ],
                        maxSignUpCount: 16,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Eco Club ',
                            id: 5505,
                            maxStudentCount: 16,
                            minStudentCount: 1,
                            name: '环保社',
                            studentCount: 0,
                        },
                        weekDayLesson: '周一、周二 12:15-13:35',
                    },
                ],
                courseId: 1468,
                courseName: '环保社',
                coursePlanId: 6291,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'STEM contests',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 8,
                        addressList: [
                            {
                                enName: 'D421',
                                id: 292,
                                name: 'D421',
                            },
                            {
                                enName: 'D404',
                                id: 481,
                                name: 'D404',
                            },
                            {
                                enName: 'D405',
                                id: 655,
                                name: 'D405',
                            },
                            {
                                enName: 'D406',
                                id: 384,
                                name: 'D406',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 8,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 87111111,
                                weekday: 3,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 3519631,
                                weekday: 4,
                            },
                        ],
                        courseGroupPlanIds: [22811],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5509,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/bab3d660-0dcc-4e83-b2e4-804813306bed',
                                enName: 'Yinyin',
                                name: '朱银银',
                                unionUserId: 'bab3d660-0dcc-4e83-b2e4-804813306bed',
                                userId: 100000100501,
                            },
                        ],
                        maxSignUpCount: 20,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'STEM contests ',
                            id: 5509,
                            maxStudentCount: 20,
                            minStudentCount: 1,
                            name: '理综竞赛 ',
                            studentCount: 0,
                        },
                        weekDayLesson: '周三、周四 12:15-13:35',
                    },
                ],
                courseId: 3308,
                courseName: '理综竞赛',
                coursePlanId: 6298,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
            {
                courseEnglishName: 'Social Science Club',
                courseGroupPlanOutputModels: [
                    {
                        actualSignUpCount: 4,
                        addressList: [
                            {
                                enName: 'D419',
                                id: 290,
                                name: 'D419',
                            },
                        ],
                        assistTeachers: [],
                        chooseCount: 4,
                        classTimeModels: [
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 58885619,
                                weekday: 3,
                            },
                            {
                                endTime: '13:35',
                                id: 13314783,
                                startTime: '12:15',
                                timeId: 39587813,
                                weekday: 4,
                            },
                        ],
                        courseGroupPlanIds: [22778],
                        endTime: 1706630400000,
                        endTimeString: '2024-01-31',
                        groupGroupingNumJsonDTO: {},
                        groupId: 5503,
                        groupSuitGradeList: [
                            {
                                enName: 'G10',
                                id: 20,
                                name: '十年级',
                            },
                            {
                                enName: 'G11',
                                id: 21,
                                name: '十一年级',
                            },
                            {
                                enName: 'G12',
                                id: 22,
                                name: '十二年级',
                            },
                        ],
                        mainTeachers: [
                            {
                                avatar: 'https://userservice.api.yungu.org/api/user/avatarUrl/eea1e9c6-9213-4299-9d94-feac1cc40a2f',
                                enName: 'Yao',
                                name: '雷瑶',
                                unionUserId: 'eea1e9c6-9213-4299-9d94-feac1cc40a2f',
                                userId: 4552,
                            },
                        ],
                        maxSignUpCount: 12,
                        minSignUpCount: 1,
                        rainyDayLocation: '',
                        startTime: 1693756800000,
                        startTimeString: '2023-09-04',
                        status: 1,
                        studentGroupModel: {
                            ename: 'Social Science Club ',
                            id: 5503,
                            maxStudentCount: 12,
                            minStudentCount: 1,
                            name: '社科社 ',
                            studentCount: 0,
                        },
                        weekDayLesson: '周三、周四 12:15-13:35',
                    },
                ],
                courseId: 854,
                courseName: '社科社',
                coursePlanId: 6302,
                courseRepeatApply: true,
                courseSuitGradeList: [
                    {
                        enName: 'G10',
                        id: 20,
                        name: '十年级',
                    },
                    {
                        enName: 'G11',
                        id: 21,
                        name: '十一年级',
                    },
                    {
                        enName: 'G12',
                        id: 22,
                        name: '十二年级',
                    },
                ],
                courseVisible: 0,
                groupPermission: true,
                subjectSort: 50,
            },
        ],
        fullGroupCount: 3,
        inRangeGroupCount: 14,
        lessMinGroupCount: 1,
        totalCount: 18,
    },
    ifAdmin: false,
    ifLogin: true,
    message: '成功',
    status: true,
};

const deleteCourseChoose = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
};

const groupSelect = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    content: {
        id: 79, // 班级id
        name: '三（1）班', // 班级名称
        englishName: 'G3 Class 1', // 班级英文名称
        minStudentCount: 1, // 最小人数
        maxStudentCount: 10, // 最大人数
        addressModels: [
            // 适用场地集合
            {
                id: 2, // 场地id
                name: '5-3-8', // 场地名称
                englishName: '5-3-8', // 场地英文名称~~~~
                remark: '',
                schoolId: 2,
                capacity: 2147483647,
                createTime: '2018-09-18 16:53:56',
                modifyTime: '2018-12-03 10:33:46',
                deleted: false,
            },
        ],
        classTime: [
            {
                weekDay: 1,
                id: 1,
                startTime: '10:00',
                endTime: '11:00',
            },
            {
                weekDay: 2,
                id: 2,
                startTime: '11:00',
                endTime: '12:00',
            },
        ],
        mainTeachersId: [3],
        secTeachersId: [7],
        rainAddressModels: '漏天羽毛球场地',
    },
    ifAdmin: false,
};

const groupUpdate = {
    ifLogin: true,
    status: true,
    message: '成功',
    code: 0,
    ifAdmin: false,
};

// 添加学生到班级--学生展示列表
const studentListOfClass = {
    code: 0,
    ifAdmin: false,
    ifLogin: true,
    message: '成功',
    status: true,
    content: {
        gradeList: [
            {
                id: -2,
                orgName: '托班',
                orgEname: 'PreK',
                stage: 1,
                grade: -3,
            },
            {
                id: -1,
                orgName: '小班',
                orgEname: 'K1',
                stage: 1,
                grade: -2,
            },
            {
                id: 0,
                orgName: '中班',
                orgEname: 'K2',
                stage: 1,
                grade: -1,
            },
            {
                id: 1,
                orgName: '一年级',
                orgEname: 'G1',
                stage: 2,
                grade: 1,
            },
            {
                id: 2,
                orgName: '二年级',
                orgEname: 'G2',
                stage: 2,
                grade: 2,
            },
            {
                id: 3,
                orgName: '三年级',
                orgEname: 'G3',
                stage: 2,
                grade: 3,
            },
            {
                id: 4,
                orgName: '四年级',
                orgEname: 'G4',
                stage: 2,
                grade: 4,
            },
            {
                id: 5,
                orgName: '五年级',
                orgEname: 'G5',
                stage: 2,
                grade: 5,
            },
            {
                id: 6,
                orgName: '六年级',
                orgEname: 'G6',
                stage: 2,
                grade: 6,
            },
            {
                id: 7,
                orgName: '七年级',
                orgEname: 'G7',
                stage: 3,
                grade: 7,
            },
            {
                id: 8,
                orgName: '八年级',
                orgEname: 'G8',
                stage: 3,
                grade: 8,
            },
            {
                id: 9,
                orgName: '九年级',
                orgEname: 'G9',
                stage: 3,
                grade: 9,
            },
        ],
        classList: [
            {
                classId: -21,
                className: '托班101',
                classEname: 'yungu 101',
                gradeId: -2,
            },
            {
                classId: -22,
                className: '托班102',
                classEname: 'yungu 102',
                gradeId: -2,
            },
            {
                classId: -23,
                className: '托班103',
                classEname: 'yungu 103',
                gradeId: -2,
            },
            {
                classId: -11,
                className: '中班101',
                classEname: 'yungu 101',
                gradeId: -1,
            },
            {
                classId: -12,
                className: '中班102',
                classEname: 'yungu 102',
                gradeId: -1,
            },
            {
                classId: -13,
                className: '中班103',
                classEname: 'yungu 103',
                gradeId: -1,
            },
            {
                classId: 11,
                className: '一年级101',
                classEname: 'yungu 101',
                gradeId: 1,
            },
            {
                classId: 12,
                className: '一年级102',
                classEname: 'yungu 102',
                gradeId: 1,
            },
            {
                classId: 13,
                className: '一年级103',
                classEname: 'yungu 103',
                gradeId: 1,
            },
            {
                classId: 14,
                className: '一年级104',
                classEname: 'yungu 104',
                gradeId: 1,
            },
            {
                classId: 15,
                className: '一年级105',
                classEname: 'yungu 105',
                gradeId: 1,
            },
            {
                classId: 16,
                className: '一年级105',
                classEname: 'yungu 106',
                gradeId: 1,
            },
            {
                classId: 21,
                className: '二年级101',
                classEname: 'yungu 101',
                gradeId: 2,
            },
            {
                classId: 22,
                className: '二年级102',
                classEname: 'yungu 102',
                gradeId: 2,
            },
            {
                classId: 23,
                className: '二年级103',
                classEname: 'yungu 103',
                gradeId: 2,
            },
            {
                classId: 24,
                className: '二年级104',
                classEname: 'yungu 104',
                gradeId: 2,
            },
            {
                classId: 25,
                className: '二年级105',
                classEname: 'yungu 105',
                gradeId: 2,
            },
            {
                classId: 26,
                className: '二年级105',
                classEname: 'yungu 106',
                gradeId: 2,
            },
            {
                classId: 31,
                className: '三年级101',
                classEname: 'yungu 101',
                gradeId: 3,
            },
            {
                classId: 32,
                className: '三年级102',
                classEname: 'yungu 102',
                gradeId: 3,
            },
            {
                classId: 33,
                className: '三年级103',
                classEname: 'yungu 103',
                gradeId: 3,
            },
            {
                classId: 34,
                className: '三年级104',
                classEname: 'yungu 104',
                gradeId: 3,
            },
            {
                classId: 35,
                className: '三年级105',
                classEname: 'yungu 105',
                gradeId: 3,
            },
            {
                classId: 36,
                className: '三年级105',
                classEname: 'yungu 106',
                gradeId: 3,
            },
            {
                classId: 41,
                className: '四年级101',
                classEname: 'yungu 101',
                gradeId: 4,
            },
            {
                classId: 42,
                className: '四年级102',
                classEname: 'yungu 102',
                gradeId: 4,
            },
            {
                classId: 43,
                className: '四年级103',
                classEname: 'yungu 103',
                gradeId: 4,
            },
            {
                classId: 44,
                className: '四年级104',
                classEname: 'yungu 104',
                gradeId: 4,
            },
            {
                classId: 45,
                className: '四年级105',
                classEname: 'yungu 105',
                gradeId: 4,
            },
            {
                classId: 46,
                className: '四年级105',
                classEname: 'yungu 106',
                gradeId: 4,
            },
            {
                classId: 51,
                className: '五年级101',
                classEname: 'yungu 101',
                gradeId: 5,
            },
            {
                classId: 52,
                className: '五年级102',
                classEname: 'yungu 102',
                gradeId: 5,
            },
            {
                classId: 53,
                className: '五年级103',
                classEname: 'yungu 103',
                gradeId: 5,
            },
            {
                classId: 54,
                className: '五年级104',
                classEname: 'yungu 104',
                gradeId: 5,
            },
            {
                classId: 55,
                className: '五年级105',
                classEname: 'yungu 105',
                gradeId: 5,
            },
            {
                classId: 56,
                className: '五年级105',
                classEname: 'yungu 106',
                gradeId: 5,
            },
            {
                classId: 61,
                className: '六年级101',
                classEname: 'yungu 101',
                gradeId: 6,
            },
            {
                classId: 62,
                className: '五年级102',
                classEname: 'yungu 102',
                gradeId: 6,
            },
            {
                classId: 63,
                className: '六年级103',
                classEname: 'yungu 103',
                gradeId: 6,
            },
            {
                classId: 64,
                className: '六年级104',
                classEname: 'yungu 104',
                gradeId: 6,
            },
            {
                classId: 65,
                className: '六年级105',
                classEname: 'yungu 105',
                gradeId: 6,
            },
            {
                classId: 66,
                className: '六年级105',
                classEname: 'yungu 106',
                gradeId: 6,
            },
        ],
        studentList: [
            {
                studentId: 1,
                studentName: '小张-21-1新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -21,
                addedFlag: 0,
            },
            {
                studentId: 1232,
                studentName: '小张-21-1新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -21,
                addedFlag: 0,
            },
            {
                studentId: 2,
                studentName: '小张-21-2新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -21,
                addedFlag: 0,
            },
            {
                studentId: 3,
                studentName: '小张-21-3新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -21,
                addedFlag: 0,
            },
            {
                studentId: 4,
                studentName: 'a小张-21-4新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -21,
                addedFlag: 1,
            },
            {
                studentId: 5,
                studentName: '小张-22-5新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -22,
                addedFlag: 0,
            },
            {
                studentId: 6,
                studentName: '小张-22-6新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -22,
                addedFlag: 0,
            },
            {
                studentId: 7,
                studentName: '小张-22-7新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -22,
                addedFlag: 1,
            },
            {
                studentId: 8,
                studentName: '小张-22-8新',
                studentEname: 'PreK',
                gradeId: -2,
                classId: -22,
                addedFlag: 0,
            },
            // 一年级一班
            {
                studentId: 9,
                studentName: '小张11-9新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 11,
                addedFlag: 0,
            },
            {
                studentId: 10,
                studentName: '小张11-10新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 11,
                addedFlag: 1,
            },
            {
                studentId: 11,
                studentName: '小张11-11新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 11,
                addedFlag: 1,
            },
            {
                studentId: 12,
                studentName: '小张11-12新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 11,
                addedFlag: 0,
            },
            // 一年级二班
            {
                studentId: 13,
                studentName: '小张11-13新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 12,
                addedFlag: 1,
            },
            {
                studentId: 14,
                studentName: '小张11-14新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 12,
                addedFlag: 0,
            },
            {
                studentId: 15,
                studentName: '小张11-15新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 12,
                addedFlag: 1,
            },
            {
                studentId: 16,
                studentName: '小张11-16新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 12,
                addedFlag: 0,
            },
            // 一年级三年
            {
                studentId: 17,
                studentName: '小张11-17新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 13,
                addedFlag: 1,
            },
            {
                studentId: 18,
                studentName: '小张11-18新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 13,
                addedFlag: 0,
            },
            {
                studentId: 19,
                studentName: '小张11-19新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 13,
                addedFlag: 1,
            },
            {
                studentId: 20,
                studentName: '小张11-20新',
                studentEname: 'PreK',
                gradeId: 1,
                classId: 13,
                addedFlag: 0,
            },
        ],
    },
};

const addStudentClass = {
    ifLogin: true,
    status: true,
    message: '成功~~~~',
    code: 0,
    ifAdmin: false,
};

const classStudentsBatchRemoval = {
    ifLogin: true,
    status: true,
    message: '移除成功~~~~',
    code: 0,
    ifAdmin: false,
};

const studentsClassTransfer = {
    ifLogin: true,
    status: true,
    message: '转移成功~~~~',
    code: 0,
    ifAdmin: false,
};

const studentCourseResultsManagement = {
    ifLogin: true,
    status: true,
    message: '设置成功~~~~',
    code: 0,
    ifAdmin: false,
};

const uncheckAndCheck = {
    ifLogin: true,
    status: true,
    message: '设置成功~!!~',
    code: 0,
    ifAdmin: false,
};

const sameCourseRepeat = {
    ifLogin: true,
    status: true,
    message: '设置成功',
    code: 1,
    content: null,
    ifAdmin: false,
};

const chooseAddNewClasses = {
    ifLogin: true,
    status: false,
    message: '设置失败',
    code: 1,
    content: null,
    ifAdmin: false,
};

const getLotsDetail = {
    code: 0,
    content: [
        {
            classFee: 9600,
            classFeeModelList: [
                {
                    classFee: 9600,
                    groupEnName: 'MPO-Cello (once a week) ',
                    groupId: 4214,
                    groupName: 'MPO大提琴 (一周一次) ',
                    materialCost: 0,
                },
            ],
            classFeeType: 1,
            courseCover:
                'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1677814621403_大提琴.jpeg',
            courseEnName: 'MPO-Cello (once a week)',
            courseId: 2238,
            courseName: 'MPO大提琴 (一周一次)',
            createUserId: 100000101043,
            enFreePlateContent:
                '<p>Course Introduction:</p>\n<p>The Montessori Philharmonic Orchestra was established in 2021. It was established by the International Montessori School of Beijing (MSB) in cooperation with the musicians of the China Philharmonic Orchestra, enrolling 6-18-year-old international children. At present, Professor Xiaotang Xia, the permanent conductor of the China Philharmonic Orchestra, and famous performers of the China Philharmonic Orchestra serve as the orchestra tutors.</p>\n<p>&nbsp;</p>\n<p>Course Features</p>\n<p>China&rsquo;s topflight musicians guide the children face-to-face. Under the guidance of the musicians, the children will develop a love for art, laying a solid foundation for musical instrument performance in a short period, and have the opportunity to appreciate the performance of the renowned Chinese musicians. At the end of the course, the children will pull together a concert to showcase their love and confidence in music.</p>\n<p>&nbsp;</p>\n<p>Objectives</p>\n<p>Through this course, students will understand:(1) The basic structure, pronunciation principle, history, and application of the cello, broaden their musical and artistic vision;(2) Master the correct posture of playing the cello, the method of holding the cello, and develop good habits;(3) have a better sense of appreciating musical works.</p>\n<p>&nbsp;</p>\n<p>Mission</p>\n<p>At the Montessori Philharmonic, we aim to foster a lifelong love of music in our students. We aim to provide students with a solid foundation in music appreciation, encourage students to play and create music together, and foster collaboration, creativity, and collective awareness.</p>\n<p>&nbsp;</p>\n<p>The Montessori Philharmonic follows the Montessori educational philosophy, takes "passion, cooperation, communication, and self-confidence" as its training philosophy, and aims to cultivate students\' lifelong love for music, aiming to lay a solid foundation for students to appreciate music. Provides opportunities to express emotions and creative ideas. Dr. Maria Montessori recognized the value of musical experience in children\'s development, giving the music the same respect as any other curriculum. The Montessori Philharmonic encourages students to play and create music together, fostering a spirit of collaboration, creativity, and a sense of collective that will empower them to become future innovators and leaders with a global perspective.</p>\n<p>&nbsp;</p>\n<p>Teacher\'s Introduction:</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3055441" width="308" height="447" /></p>\n<p>Guan Zhengyue</p>\n<p>National Grade I Instrumentalist</p>\n<p>China Philharmonic Orchestra Cello Associate Principal</p>\n<p>China Philharmonic Orchestra Cello Ensemble Initiator</p>\n<p>China Musicians Association Chamber Music Council Member</p>\n<p>Former Cello Principal of the Orchestra of Changchun Film Studio, Liaoning Symphony Orchestra and Beijing Symphony Orchestra</p>\n<p>In his nearly forty years of classical music performance, he has performed many music pieces of various styles, including music from the European Classicism Ages and the Romantic Period, modern music and Chinese music across all periods.</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3055444" width="299" height="195" /></p>\n<p>Yang ChangYing</p>\n<p>Cellist of China Philharmonic Orchestra</p>\n<p>Master\'s Degree and Performer\'s Diploma from Manhattan School of Music</p>\n<p>She has been engaged in cello performance for nearly 20 years.</p>\n<p>She has performed cello performances in well-known domestic and foreign institutions such as the Dicapo Opera House, Asian Artist, and Concerts Orchestra, Chamber Orchestra of New York, China Philharmonic Orchestra, etc. She has held many solo concerts and enjoys a high reputation at home and abroad.</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3055446" width="305" height="381" /></p>\n<p>Lin Chuyun</p>\n<p>Cellist of the Central Conservatory of Music Symphony Orchestra</p>\n<p>Cello Teacher, Violin Making Department, Central Conservatory of Music</p>\n<p>One of the representative figures of Chinese youth cello performance, she has won a series of important awards in internationally renowned music competitions, and she has performed in world-renowned concert halls.</p>\n<p>Her playing timbre is sweet and rich, with excellent control over timbre changes. Her solid basic skills and dexterous left-hand enable her to interpret complex and difficult tunes flawlessly, and touch people\'s chords. She has won unanimous praise from international professionals.</p>\n<p>&nbsp;</p>',
            freePlateContent:
                '<p>课程介绍：</p>\n<p>蒙台梭利爱乐乐团于2021年成立，由北京蒙台梭利国际学校（MSB）携手中国爱乐乐团的音乐家们合作建立，是首家以蒙台梭利教育理念为核心的面向6-18岁的国际儿童和青少年的乐团。目前，中国爱乐乐团常任指挥家夏小汤教授及中国爱乐乐团著名的演奏家们担任乐团导师。招生数量：最低5&nbsp;&nbsp;&nbsp; 最高20</p>\n<p>&nbsp;</p>\n<p>课程特色</p>\n<p>国内天花板级别的音乐家对孩子面对面指导，在音乐家们的教导下，让孩子对艺术产生热爱，短期内打下乐器演奏的坚实基础, 更有机会感受&ldquo;国乐手&rdquo;老师们的优雅演奏。课程结束时，孩子们将呈现一场小型音乐会，从而更加提升他们对音乐的热爱及自信心。</p>\n<p>&nbsp;</p>\n<p>课程学习体系</p>\n<p>通过本课程的学习，使学生了解：</p>\n<p>（1）大提琴基本构造、发音原理，发展历史及应用，提高学生自身的艺术修养，开阔学生的音乐艺术视野；</p>\n<p>（2）掌握正确的拉琴姿势，持琴方法，培育良好的行为习惯；</p>\n<p>（3）通过大量的大提琴作品的练习，切实提高演奏及音乐作品的能力和鉴赏水平。</p>\n<p>&nbsp;</p>\n<p>学习目标</p>\n<p>在蒙台梭利爱乐乐团，我们以培养学生对音乐的终身热爱为目标，旨在为学生打下坚实的音乐欣赏基础，鼓励学生一起演奏并创作音乐，培养协作精神、创造力和集体意识。</p>\n<p>&nbsp;</p>\n<p>输出成果方向</p>\n<p>蒙台梭利爱乐乐团遵循蒙台梭利教育理念，以&ldquo;热情、合作、沟通、自信&rdquo;为培养理念，培养学生对音乐的终身热爱为目标，旨在为学生打下坚实的音乐欣赏基础，提供表达情感和创造性想法的机会。玛丽亚&middot;蒙台梭利博士认识到了音乐体验在儿童发展中的价值，给予音乐和其他课程同等尊重。蒙台梭利爱乐乐团鼓励学生一起演奏并创作音乐，培养协作精神、创造力和集体意识, 将助力他们成为具有全球视野的未来创新者和领导者。</p>\n<p>&nbsp;</p>\n<p>老师简介：</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057016" width="315" height="458" /></p>\n<p>关正跃</p>\n<p>国家一级演奏员</p>\n<p>中国爱乐乐团大提声部副首席</p>\n<p>中国爱乐乐团大提琴重奏团发起人</p>\n<p>中国音乐家协会室内乐会理事</p>\n<p>曾任长影乐团、辽宁交响乐团和北京交响乐团大提琴首席</p>\n<p>从事古典音乐近四十年来，他演奏过大量欧洲古典时期、浪漫时期到现代时期不同风格的音乐作品及中国各时期的音乐作品。他的演出足迹遍布世界各地，是中国古典音乐舞台上最具实力的大提琴演奏家之一。</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057017" width="318" height="207" /></p>\n<p>杨长缨</p>\n<p>中国爱乐乐团大提琴演奏家</p>\n<p>曼哈顿音乐学院硕士学位和演奏家文凭</p>\n<p>从事大提琴演奏近20年，先后在Dicapo歌剧院、Asian Artist and Concerts Orchestra、纽约室内乐团、中国爱乐乐团等国内外知名机构从事大提琴演奏，曾举行过多场个人音乐会，在国内外享有盛誉。</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057018" width="310" height="387" /></p>\n<p>林楚芸</p>\n<p>中央音乐学院交响乐团大提琴演奏家</p>\n<p>中央音乐学院提琴制作系大提琴演奏教师</p>\n<p>中国青年大提琴演奏的代表性人物之一，曾斩获一系列国际知名音乐比赛的重要奖项，演出足迹遍布世界著名音乐厅。其演奏音色甜美而又浑厚，对音色的变化有着出色的控制力，扎实的基本功以及灵活的左手技巧可以将复杂且高难度的乐曲诠释得完美无瑕，打动人心，获得国际专业人士的一致好评。</p>\n<p>&nbsp;</p>',
            gradeList: [
                {
                    enName: 'G1',
                    id: 25,
                    name: '一年级',
                },
                {
                    enName: 'G2',
                    id: 26,
                    name: '二年级',
                },
                {
                    enName: 'G3',
                    id: 27,
                    name: '三年级',
                },
                {
                    enName: 'G4',
                    id: 28,
                    name: '四年级',
                },
                {
                    enName: 'G5',
                    id: 29,
                    name: '五年级',
                },
                {
                    enName: 'G6',
                    id: 30,
                    name: '六年级',
                },
                {
                    enName: 'G7',
                    id: 31,
                    name: '七年级',
                },
                {
                    enName: 'G8',
                    id: 32,
                    name: '八年级',
                },
                {
                    enName: 'G9',
                    id: 33,
                    name: '九年级',
                },
                {
                    enName: 'G10',
                    id: 35,
                    name: '十年级',
                },
                {
                    enName: 'G11',
                    id: 36,
                    name: '十一年级',
                },
                {
                    enName: 'G12',
                    id: 37,
                    name: '十二年级',
                },
                {
                    enName: 'K3',
                    id: 82,
                    name: '大班',
                },
            ],
            id: 4850,
            materialCost: 0,
            materialFeeType: 0,
            newMaterialCost: 0,
            oldMaterialCost: 0,
            planningClassModels: [
                {
                    assistTeachers: [],
                    classFee: 9600,
                    classTimeModels: [
                        {
                            endTime: '12:00',
                            id: 24562804,
                            startTime: '10:00',
                            timeId: 38553489,
                            weekday: 6,
                        },
                        {
                            endTime: '18:00',
                            id: 17884014,
                            startTime: '16:00',
                            timeId: 45628316,
                            weekday: 1,
                        },
                        {
                            endTime: '18:00',
                            id: 17884014,
                            startTime: '16:00',
                            timeId: 51825213,
                            weekday: 2,
                        },
                        {
                            endTime: '18:00',
                            id: 17884014,
                            startTime: '16:00',
                            timeId: 56103114,
                            weekday: 3,
                        },
                    ],
                    enName: 'MPO-Cello (once a week) ',
                    groupId: 4214,
                    id: 3504,
                    masterTeachers: [
                        {
                            enName: 'Susan Chen',
                            id: 100000101043,
                            name: 'Susan Chen',
                        },
                    ],
                    materialCost: 0,
                    maxStudentNum: 8,
                    minStudentNum: 4,
                    name: 'MPO大提琴 (一周一次) ',
                    rainyDayLocation: '',
                    suitGradeList: [
                        {
                            enName: 'G1',
                            id: 25,
                            name: '一年级',
                        },
                        {
                            enName: 'G2',
                            id: 26,
                            name: '二年级',
                        },
                        {
                            enName: 'G3',
                            id: 27,
                            name: '三年级',
                        },
                        {
                            enName: 'G4',
                            id: 28,
                            name: '四年级',
                        },
                        {
                            enName: 'G5',
                            id: 29,
                            name: '五年级',
                        },
                        {
                            enName: 'G6',
                            id: 30,
                            name: '六年级',
                        },
                        {
                            enName: 'G7',
                            id: 31,
                            name: '七年级',
                        },
                        {
                            enName: 'G9',
                            id: 33,
                            name: '九年级',
                        },
                        {
                            enName: 'G8',
                            id: 32,
                            name: '八年级',
                        },
                        {
                            enName: 'G10',
                            id: 35,
                            name: '十年级',
                        },
                        {
                            enName: 'G11',
                            id: 36,
                            name: '十一年级',
                        },
                        {
                            enName: 'G12',
                            id: 37,
                            name: '十二年级',
                        },
                        {
                            enName: 'K3',
                            id: 82,
                            name: '大班',
                        },
                    ],
                },
            ],
            repeatRegistration: true,
            subjectList: [
                {
                    color: '#FC592A',
                    enName: 'MPO',
                    id: 120,
                    name: '蒙台梭利爱乐乐团',
                },
            ],
            subjectSortNum: 0,
            teachingLanguage: 'CHINESE_LESSONS',
        },
        {
            classFee: 16500,
            classFeeModelList: [
                {
                    classFee: 16500,
                    groupEnName: 'MPO-Cello (one on one) ',
                    groupId: 4215,
                    groupName: 'MPO大提琴 一对一 ',
                    materialCost: 0,
                },
            ],
            classFeeType: 1,
            courseCover:
                'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1677815068061_大提琴.jpeg',
            courseEnName: 'MPO-Cello (one on one)',
            courseId: 2240,
            courseName: 'MPO大提琴 一对一',
            createUserId: 100000101043,
            enFreePlateContent:
                '<p>Course Introduction:</p>\n<p>The Montessori Philharmonic Orchestra was established in 2021. It was established by the International Montessori School of Beijing (MSB) in cooperation with the musicians of the China Philharmonic Orchestra, enrolling 6-18-year-old international children. At present, Professor Xiaotang Xia, the permanent conductor of the China Philharmonic Orchestra, and famous performers of the China Philharmonic Orchestra serve as the orchestra tutors.</p>\n<p>&nbsp;</p>\n<p>Course Features</p>\n<p>China&rsquo;s topflight musicians guide the children face-to-face. Under the guidance of the musicians, the children will develop a love for art, laying a solid foundation for musical instrument performance in a short period, and have the opportunity to appreciate the performance of the renowned Chinese musicians. At the end of the course, the children will pull together a concert to showcase their love and confidence in music.</p>\n<p>&nbsp;</p>\n<p>Objectives</p>\n<p>Through this course, students will understand:(1) The basic structure, pronunciation principle, history, and application of the cello, broaden their musical and artistic vision;(2) Master the correct posture of playing the cello, the method of holding the cello, and develop good habits;(3) have a better sense of appreciating musical works.</p>\n<p>&nbsp;</p>\n<p>Mission</p>\n<p>At the Montessori Philharmonic, we aim to foster a lifelong love of music in our students. We aim to provide students with a solid foundation in music appreciation, encourage students to play and create music together, and foster collaboration, creativity, and collective awareness.</p>\n<p>&nbsp;</p>\n<p>The Montessori Philharmonic follows the Montessori educational philosophy, takes "passion, cooperation, communication, and self-confidence" as its training philosophy, and aims to cultivate students\' lifelong love for music, aiming to lay a solid foundation for students to appreciate music. Provides opportunities to express emotions and creative ideas. Dr. Maria Montessori recognized the value of musical experience in children\'s development, giving the music the same respect as any other curriculum. The Montessori Philharmonic encourages students to play and create music together, fostering a spirit of collaboration, creativity, and a sense of collective that will empower them to become future innovators and leaders with a global perspective.</p>\n<p>&nbsp;</p>\n<p>Teacher\'s Introduction:</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3055441" width="308" height="447" /></p>\n<p>Guan Zhengyue</p>\n<p>National Grade I Instrumentalist</p>\n<p>China Philharmonic Orchestra Cello Associate Principal</p>\n<p>China Philharmonic Orchestra Cello Ensemble Initiator</p>\n<p>China Musicians Association Chamber Music Council Member</p>\n<p>Former Cello Principal of the Orchestra of Changchun Film Studio, Liaoning Symphony Orchestra and Beijing Symphony Orchestra</p>\n<p>In his nearly forty years of classical music performance, he has performed many music pieces of various styles, including music from the European Classicism Ages and the Romantic Period, modern music and Chinese music across all periods.</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3055444" width="299" height="195" /></p>\n<p>Yang ChangYing</p>\n<p>Cellist of China Philharmonic Orchestra</p>\n<p>Master\'s Degree and Performer\'s Diploma from Manhattan School of Music</p>\n<p>She has been engaged in cello performance for nearly 20 years.</p>\n<p>She has performed cello performances in well-known domestic and foreign institutions such as the Dicapo Opera House, Asian Artist, and Concerts Orchestra, Chamber Orchestra of New York, China Philharmonic Orchestra, etc. She has held many solo concerts and enjoys a high reputation at home and abroad.</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3055446" width="305" height="381" /></p>\n<p>Lin Chuyun</p>\n<p>Cellist of the Central Conservatory of Music Symphony Orchestra</p>\n<p>Cello Teacher, Violin Making Department, Central Conservatory of Music</p>\n<p>One of the representative figures of Chinese youth cello performance, she has won a series of important awards in internationally renowned music competitions, and she has performed in world-renowned concert halls.</p>\n<p>Her playing timbre is sweet and rich, with excellent control over timbre changes. Her solid basic skills and dexterous left-hand enable her to interpret complex and difficult tunes flawlessly, and touch people\'s chords. She has won unanimous praise from international professionals.</p>',
            freePlateContent:
                '<p>课程介绍：</p>\n<p>蒙台梭利爱乐乐团于2021年成立，由北京蒙台梭利国际学校（MSB）携手中国爱乐乐团的音乐家们合作建立，是首家以蒙台梭利教育理念为核心的面向6-18岁的国际儿童和青少年的乐团。目前，中国爱乐乐团常任指挥家夏小汤教授及中国爱乐乐团著名的演奏家们担任乐团导师。招生数量：最低5&nbsp;&nbsp;&nbsp; 最高20</p>\n<p>&nbsp;</p>\n<p>课程特色</p>\n<p>国内天花板级别的音乐家对孩子面对面指导，在音乐家们的教导下，让孩子对艺术产生热爱，短期内打下乐器演奏的坚实基础, 更有机会感受&ldquo;国乐手&rdquo;老师们的优雅演奏。课程结束时，孩子们将呈现一场小型音乐会，从而更加提升他们对音乐的热爱及自信心。</p>\n<p>&nbsp;</p>\n<p>课程学习体系</p>\n<p>通过本课程的学习，使学生了解：</p>\n<p>（1）大提琴基本构造、发音原理，发展历史及应用，提高学生自身的艺术修养，开阔学生的音乐艺术视野；</p>\n<p>（2）掌握正确的拉琴姿势，持琴方法，培育良好的行为习惯；</p>\n<p>（3）通过大量的大提琴作品的练习，切实提高演奏及音乐作品的能力和鉴赏水平。</p>\n<p>&nbsp;</p>\n<p>学习目标</p>\n<p>在蒙台梭利爱乐乐团，我们以培养学生对音乐的终身热爱为目标，旨在为学生打下坚实的音乐欣赏基础，鼓励学生一起演奏并创作音乐，培养协作精神、创造力和集体意识。</p>\n<p>&nbsp;</p>\n<p>输出成果方向</p>\n<p>蒙台梭利爱乐乐团遵循蒙台梭利教育理念，以&ldquo;热情、合作、沟通、自信&rdquo;为培养理念，培养学生对音乐的终身热爱为目标，旨在为学生打下坚实的音乐欣赏基础，提供表达情感和创造性想法的机会。玛丽亚&middot;蒙台梭利博士认识到了音乐体验在儿童发展中的价值，给予音乐和其他课程同等尊重。蒙台梭利爱乐乐团鼓励学生一起演奏并创作音乐，培养协作精神、创造力和集体意识, 将助力他们成为具有全球视野的未来创新者和领导者。</p>\n<p>&nbsp;</p>\n<p>老师简介：</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057020" width="324" height="471" /></p>\n<p>关正跃</p>\n<p>国家一级演奏员</p>\n<p>中国爱乐乐团大提声部副首席</p>\n<p>中国爱乐乐团大提琴重奏团发起人</p>\n<p>中国音乐家协会室内乐会理事</p>\n<p>曾任长影乐团、辽宁交响乐团和北京交响乐团大提琴首席</p>\n<p>从事古典音乐近四十年来，他演奏过大量欧洲古典时期、浪漫时期到现代时期不同风格的音乐作品及中国各时期的音乐作品。他的演出足迹遍布世界各地，是中国古典音乐舞台上最具实力的大提琴演奏家之一。</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057021" width="356" height="232" /></p>\n<p>杨长缨</p>\n<p>中国爱乐乐团大提琴演奏家</p>\n<p>曼哈顿音乐学院硕士学位和演奏家文凭</p>\n<p>从事大提琴演奏近20年，先后在Dicapo歌剧院、Asian Artist and Concerts Orchestra、纽约室内乐团、中国爱乐乐团等国内外知名机构从事大提琴演奏，曾举行过多场个人音乐会，在国内外享有盛誉。</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057022" width="352" height="440" /></p>\n<p>林楚芸</p>\n<p>中央音乐学院交响乐团大提琴演奏家</p>\n<p>中央音乐学院提琴制作系大提琴演奏教师</p>\n<p>中国青年大提琴演奏的代表性人物之一，曾斩获一系列国际知名音乐比赛的重要奖项，演出足迹遍布世界著名音乐厅。其演奏音色甜美而又浑厚，对音色的变化有着出色的控制力，扎实的基本功以及灵活的左手技巧可以将复杂且高难度的乐曲诠释得完美无瑕，打动人心，获得国际专业人士的一致好评。</p>\n<p>&nbsp;</p>',
            gradeList: [
                {
                    enName: 'G1',
                    id: 25,
                    name: '一年级',
                },
                {
                    enName: 'G2',
                    id: 26,
                    name: '二年级',
                },
                {
                    enName: 'G3',
                    id: 27,
                    name: '三年级',
                },
                {
                    enName: 'G4',
                    id: 28,
                    name: '四年级',
                },
                {
                    enName: 'G5',
                    id: 29,
                    name: '五年级',
                },
                {
                    enName: 'G6',
                    id: 30,
                    name: '六年级',
                },
                {
                    enName: 'G7',
                    id: 31,
                    name: '七年级',
                },
                {
                    enName: 'G8',
                    id: 32,
                    name: '八年级',
                },
                {
                    enName: 'G9',
                    id: 33,
                    name: '九年级',
                },
                {
                    enName: 'G10',
                    id: 35,
                    name: '十年级',
                },
                {
                    enName: 'G11',
                    id: 36,
                    name: '十一年级',
                },
                {
                    enName: 'G12',
                    id: 37,
                    name: '十二年级',
                },
                {
                    enName: 'K3',
                    id: 82,
                    name: '大班',
                },
            ],
            id: 4851,
            materialCost: 0,
            materialFeeType: 0,
            newMaterialCost: 0,
            oldMaterialCost: 0,
            planningClassModels: [
                {
                    assistTeachers: [],
                    classFee: 16500,
                    classTimeModels: [
                        {
                            endTime: '11:00',
                            id: 24979921,
                            startTime: '10:00',
                            timeId: 42465394,
                            weekday: 6,
                        },
                    ],
                    enName: 'MPO-Cello (one on one) ',
                    groupId: 4215,
                    id: 3505,
                    masterTeachers: [
                        {
                            enName: 'Susan Chen',
                            id: 100000101043,
                            name: 'Susan Chen',
                        },
                    ],
                    materialCost: 0,
                    maxStudentNum: 10,
                    minStudentNum: 1,
                    name: 'MPO大提琴 一对一 ',
                    rainyDayLocation: '',
                    suitGradeList: [
                        {
                            enName: 'G1',
                            id: 25,
                            name: '一年级',
                        },
                        {
                            enName: 'G2',
                            id: 26,
                            name: '二年级',
                        },
                        {
                            enName: 'G3',
                            id: 27,
                            name: '三年级',
                        },
                        {
                            enName: 'G4',
                            id: 28,
                            name: '四年级',
                        },
                        {
                            enName: 'G5',
                            id: 29,
                            name: '五年级',
                        },
                        {
                            enName: 'G6',
                            id: 30,
                            name: '六年级',
                        },
                        {
                            enName: 'G7',
                            id: 31,
                            name: '七年级',
                        },
                        {
                            enName: 'G8',
                            id: 32,
                            name: '八年级',
                        },
                        {
                            enName: 'G9',
                            id: 33,
                            name: '九年级',
                        },
                        {
                            enName: 'G10',
                            id: 35,
                            name: '十年级',
                        },
                        {
                            enName: 'G11',
                            id: 36,
                            name: '十一年级',
                        },
                        {
                            enName: 'G12',
                            id: 37,
                            name: '十二年级',
                        },
                        {
                            enName: 'K3',
                            id: 82,
                            name: '大班',
                        },
                    ],
                },
            ],
            repeatRegistration: true,
            subjectList: [
                {
                    color: '#FC592A',
                    enName: 'MPO',
                    id: 120,
                    name: '蒙台梭利爱乐乐团',
                },
            ],
            subjectSortNum: 0,
            teachingLanguage: 'CHINESE_LESSONS',
        },
        {
            classFee: 16500,
            classFeeModelList: [
                {
                    classFee: 16500,
                    groupEnName: 'MPO-Violin (one on one) ',
                    groupId: 4216,
                    groupName: 'MPO小提琴 一对一 ',
                    materialCost: 0,
                },
            ],
            classFeeType: 1,
            courseCover:
                'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1677816401898_小提琴.jpeg',
            courseEnName: 'MPO-Violin (one on one)',
            courseId: 2242,
            courseName: 'MPO小提琴 一对一',
            createUserId: 100000101043,
            enFreePlateContent:
                '<p>Course Introduction:</p>\n<p>Course Introduction：Founded in 2021, the Montessori Philharmonic Orchestra was jointly established by Beijing Montessori International School (MSB) and musicians of the Chinese Philharmonic Orchestra. It is the first orchestra targeting international children and teenagers aged 6-18 with Montessori education concept as the core. At present, Professor Xia Xiaotang, the permanent conductor of the Chinese Philharmonic Orchestra, and famous performers of the Chinese Philharmonic Orchestra serve as instructors of the orchestra.</p>\n<p>&nbsp;</p>\n<p>Course Features：</p>\n<p>Domestic master level musicians provide face-to-face teaching experience to students. Under the guidance of musicians, students are able to present the love for art, lay a solid foundation for musical instrument performance in the short term, and have more opportunities to experience the elegant performance with national level musicians. At the end of the course, the students will present a small concert to further enhance their love and confidence in music.</p>\n<p>&nbsp;</p>\n<p>Course Learning System：</p>\n<p>Through the study of this course, students can understand:</p>\n<p>(1) The basic structure, principle, and development history and application of violin, which can improve students\' artistic accomplishment and broaden their musical and artistic vision;</p>\n<p>(2) Master the correct posture of playing the violin, the method of holding the violin, and cultivate good behavior habits;</p>\n<p>(3) Through the practice of a large number of violin works, the ability and appreciation level of performance and music works are effectively improved.</p>\n<p>&nbsp;</p>\n<p>Studying Objectives:</p>\n<p>At the Montessori Philharmonic Orchestra, we aim to cultivate students\' lifelong love for music, aim to lay a solid foundation for music appreciation for students, encourage students to play and create music together, and cultivate collaborative spirit, creativity and sense of team play .</p>\n<p>&nbsp;</p>\n<p>Learning outcome:</p>\n<p>The Montessori Philharmonic Orchestra follows the Montessori education philosophy, takes "enthusiasm, cooperation, communication and self-confidence" as the training concept, and trains students\' lifelong love for music as the goal, aiming to lay a solid foundation for music appreciation and provide opportunities for students to express their emotions and creative ideas. Dr. Maria Montessori recognized the value of music experience in children\'s development and gave equal respect to music and other courses. Montessori Philharmonic encourages students to play and create music together, and cultivates the spirit of collaboration, creativity and collective consciousness, which will help them become future innovators and leaders with a global vision.</p>\n<p>&nbsp;</p>\n<p>Teacher\'s Introduction:</p>\n<p>The mentors of Montessori Philharmonic Orchestra are well-known performers of China Philharmonic Orchestra. These musicians have been active on the world stage for many years and have excellent solo and orchestra performance skills and a lot of teaching experience.</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3054925" width="286" height="358" /></p>\n<p>Yue Fan</p>\n<p>Deputy principal of violin team of the orchestra of the National Grand Theatre</p>\n<p>&ldquo;Fan music&rdquo; brand manager</p>\n<p>An outstanding young violinist in China, she graduated from the University of Michigan with a master\'s degree in music - violin performance and chamber music.</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3054926" /></p>\n<p>Wei&nbsp;Li</p>\n<p>Violinist of China Philharmonic Orchestra</p>\n<p>China Philharmonic Youth Symphony Orchestra instructor</p>\n<p>One of the most outstanding young violinists in China, she has toured all over the world during her violin playing career of more than 10 years, and has traveled all over the world. She has also cooperated with internationally renowned musicians such as Lang Lang, Li Yundi, Wang Jian and Vengerov</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3054927" /></p>\n<p>Peng&nbsp;Luo</p>\n<p>Violin player of China Symphony Orchestra</p>\n<p>He has been engaged in violin performance for more than 10 years, and has successively joined the Central Ballet Orchestra, the Chinese Symphony Orchestra and other well-known institutions. He has been invited to attend a series of well-known foreign art festivals and major state events</p>\n<p>&nbsp;</p>',
            freePlateContent:
                '<p>课程简介：蒙台梭利爱乐乐团于2021年成立，由北京蒙台梭利国际学校（MSB）携手中国爱乐乐团的音乐家们合作建立，是首家以蒙台梭利教育理念为核心的面向6-18岁的国际儿童和青少年的乐团。目前，中国爱乐乐团常任指挥家夏小汤教授及中国爱乐乐团著名的演奏家们担任乐团导师。</p>\n<p>&nbsp;</p>\n<p>课程特色</p>\n<p>国内天花板级别的音乐家对孩子面对面指导，在音乐家们的教导下，让孩子对艺术产生热爱，短期内打下乐器演奏的坚实基础, 更有机会感受&ldquo;国乐手&rdquo;老师们的优雅演奏。课程结束时，孩子们将呈现一场小型音乐会，从而更加提升他们对音乐的热爱及自信心。</p>\n<p>&nbsp;</p>\n<p>课程学习体系</p>\n<p>通过本课程的学习，使学生了解：</p>\n<p>（1）大提琴基本构造、发音原理，发展历史及应用，提高学生自身的艺术修养，开阔学生的音乐艺术视野；</p>\n<p>（2）掌握正确的拉琴姿势，持琴方法，培育良好的行为习惯；</p>\n<p>（3）通过大量的小提琴作品的练习，切实提高演奏及音乐作品的能力和鉴赏水平。</p>\n<p>&nbsp;</p>\n<p>学习目标</p>\n<p>在蒙台梭利爱乐乐团，我们以培养学生对音乐的终身热爱为目标，旨在为学生打下坚实的音乐欣赏基础，鼓励学生一起演奏并创作音乐，培养协作精神、创造力和集体意识。</p>\n<p>&nbsp;</p>\n<p>输出成果方向</p>\n<p>蒙台梭利爱乐乐团遵循蒙台梭利教育理念，以&ldquo;热情、合作、沟通、自信&rdquo;为培养理念，培养学生对音乐的终身热爱为目标，旨在为学生打下坚实的音乐欣赏基础，提供表达情感和创造性想法的机会。玛丽亚&middot;蒙台梭利博士认识到了音乐体验在儿童发展中的价值，给予音乐和其他课程同等尊重。蒙台梭利爱乐乐团鼓励学生一起演奏并创作音乐，培养协作精神、创造力和集体意识, 将助力他们成为具有全球视野的未来创新者和领导者。</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>老师简介：</p>\n<p>蒙台梭利爱乐乐团导师由中国爱乐乐团的知名演奏家们担任。这些音乐家们常年活跃于世界舞台，拥有精湛的独奏、乐团演奏能力和丰富的教学经验。</p>\n<p>中国爱乐乐团导师团队</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057048" /></p>\n<p>樊悦</p>\n<p>国家大剧院管弦乐团第二小提琴副首席</p>\n<p>Fan Music音乐品牌主理人</p>\n<p>中国杰出的青年小提琴演奏家，毕业于美国密歇根大学音乐硕士&mdash;&mdash;小提琴演奏与室内乐双学位。</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057049" /></p>\n<p>李维</p>\n<p>中国爱乐乐团小提琴演奏家</p>\n<p>中国爱乐-青少年交响乐团导师</p>\n<p>中国最优秀的青年小提琴演奏家之一，在10余年的小提琴演奏生涯中，出访世界各地巡演，足迹遍布世界，并与郎朗、李云迪、王健、文格洛夫等国际知名演奏家同台合作。</p>\n<p>&nbsp;</p>\n<p><img src="https://smart-scheduling.yungu.org/api/preview_file?id=3057053" /></p>\n<p>罗鹏</p>\n<p>中国交响乐团小提琴演奏家</p>\n<p>从事小提琴演奏10余年，先后加入中央芭蕾舞团交响乐团、中国交响乐团等知名机构，受邀出席一系列国外知名艺术节及重大国事活动演出。</p>\n<p>&nbsp;</p>',
            gradeList: [
                {
                    enName: 'G1',
                    id: 25,
                    name: '一年级',
                },
                {
                    enName: 'G2',
                    id: 26,
                    name: '二年级',
                },
                {
                    enName: 'G3',
                    id: 27,
                    name: '三年级',
                },
                {
                    enName: 'G4',
                    id: 28,
                    name: '四年级',
                },
                {
                    enName: 'G5',
                    id: 29,
                    name: '五年级',
                },
                {
                    enName: 'G6',
                    id: 30,
                    name: '六年级',
                },
                {
                    enName: 'G7',
                    id: 31,
                    name: '七年级',
                },
                {
                    enName: 'G8',
                    id: 32,
                    name: '八年级',
                },
                {
                    enName: 'G9',
                    id: 33,
                    name: '九年级',
                },
                {
                    enName: 'G10',
                    id: 35,
                    name: '十年级',
                },
                {
                    enName: 'G11',
                    id: 36,
                    name: '十一年级',
                },
                {
                    enName: 'G12',
                    id: 37,
                    name: '十二年级',
                },
                {
                    enName: 'K3',
                    id: 82,
                    name: '大班',
                },
            ],
            id: 4853,
            materialCost: 0,
            materialFeeType: 0,
            newMaterialCost: 0,
            oldMaterialCost: 0,
            planningClassModels: [
                {
                    assistTeachers: [],
                    classFee: 16500,
                    classTimeModels: [
                        {
                            endTime: '11:00',
                            id: 24979921,
                            startTime: '10:00',
                            timeId: 64639710,
                            weekday: 6,
                        },
                    ],
                    enName: 'MPO-Violin (one on one) ',
                    groupId: 4216,
                    id: 3506,
                    masterTeachers: [
                        {
                            enName: 'Susan Chen',
                            id: 100000101043,
                            name: 'Susan Chen',
                        },
                    ],
                    materialCost: 0,
                    maxStudentNum: 10,
                    minStudentNum: 1,
                    name: 'MPO小提琴 一对一 ',
                    rainyDayLocation: '',
                    suitGradeList: [
                        {
                            enName: 'G1',
                            id: 25,
                            name: '一年级',
                        },
                        {
                            enName: 'G2',
                            id: 26,
                            name: '二年级',
                        },
                        {
                            enName: 'G3',
                            id: 27,
                            name: '三年级',
                        },
                        {
                            enName: 'G4',
                            id: 28,
                            name: '四年级',
                        },
                        {
                            enName: 'G5',
                            id: 29,
                            name: '五年级',
                        },
                        {
                            enName: 'G6',
                            id: 30,
                            name: '六年级',
                        },
                        {
                            enName: 'G7',
                            id: 31,
                            name: '七年级',
                        },
                        {
                            enName: 'G8',
                            id: 32,
                            name: '八年级',
                        },
                        {
                            enName: 'G9',
                            id: 33,
                            name: '九年级',
                        },
                        {
                            enName: 'G10',
                            id: 35,
                            name: '十年级',
                        },
                        {
                            enName: 'G11',
                            id: 36,
                            name: '十一年级',
                        },
                        {
                            enName: 'G12',
                            id: 37,
                            name: '十二年级',
                        },
                        {
                            enName: 'K3',
                            id: 82,
                            name: '大班',
                        },
                    ],
                },
            ],
            repeatRegistration: true,
            subjectList: [
                {
                    color: '#FC592A',
                    enName: 'MPO',
                    id: 120,
                    name: '蒙台梭利爱乐乐团',
                },
            ],
            subjectSortNum: 0,
            teachingLanguage: 'CHINESE_LESSONS',
        },
    ],
    ifAdmin: false,
    ifLogin: true,
    message: '成功',
    status: true,
};

const cancelFee = {
    code: 0,
    content: {
        // "amount": "5.00",
        // "batchAccumulatedAmount": "0.00",
        // "messageStatus": 1,
        // "payPlanName": "",
        // "payStatus": 1,
        // "showFeePaidModelList": [
        //     {
        //         "amount": "1.00",
        //         "discount": "0.5",
        //         "discountType": "",
        //         "ename": "keshi- Mondayweide",
        //         "payAmount": "0.00",
        //         "payChargeItemId": 20965,
        //         "payChargeItemName": "课时费1-周一韦德测试",
        //         "price": "1.00",
        //         "quantity": 2,
        //         "studentChooseRelationId": 7416
        //     },
        //     {
        //         "amount": "2.00",
        //         "discount": "1.7",
        //         "discountType": "",
        //         "ename": "cailiao- Mondayweide",
        //         "payAmount": "0.00",
        //         "payChargeItemId": 20966,
        //         "payChargeItemName": "材料费1-周一韦德测试",
        //         "price": "10.00",
        //         "quantity": 3,
        //         "studentChooseRelationId": 7416
        //     },
        //     {
        //         "amount": "1.00",
        //         "discount": "1.0",
        //         "discountType": "",
        //         "ename": "keshi- MondayKids TEDTALK 英文演讲提高",
        //         "payAmount": "0.00",
        //         "payChargeItemId": 20967,
        //         "payChargeItemName": "课时费1-周一Kids TEDTALK 英文演讲提高",
        //         "price": "1.00",
        //         "quantity": 1,
        //         "studentChooseRelationId": 8197
        //     },
        //     {
        //         "amount": "1.00",
        //         "discount": "1.0",
        //         "discountType": "",
        //         "ename": "cailiao- MondayKids TEDTALK 英文演讲提高",
        //         "payAmount": "0.00",
        //         "payChargeItemId": 20968,
        //         "payChargeItemName": "材料费1-周一Kids TEDTALK 英文演讲提高",
        //         "price": "1.00",
        //         "quantity": 1,
        //         "studentChooseRelationId": 8197
        //     }
        // ]
    },
    ifAdmin: false,
    ifLogin: true,
    message: '成功',
    status: true,
};

export default {
    courseResultDetails, // 班级列表
    classStudentList, // 班级学生详情列表
    courseClassDetails, // 班级详情
    chooseCourseBasicInfo, // 基本信息
    selectionMessage, // 课程计划信息
    selectionList, // 课程列表
    deleteCourseChoose, // 选课计划中移除班课
    groupSelect, // 课程列表-班级详情回显
    groupUpdate, // 课程列表-班级更新
    studentListOfClass, // 添加学生到班级--学生展示列表
    addStudentClass, // 添加学生到班级
    classStudentsBatchRemoval, // 班级下学生管理-学生批量移除,
    studentsClassTransfer, // 班级下学生管理-学生转移班级
    studentCourseResultsManagement, // 学生选课结果管理
    uncheckAndCheck, // 班级列表选中与取消选中
    sameCourseRepeat, // 批量更新同课程是否可重复报名
    chooseAddNewClasses, // 增开新班级
    checkCoursePlanAddPermission,
    checkClassPermission,
    getLotsDetail,
    generateBillOfPayment,
    cancelFee,
    selectGroupingByChoosePlan,
};
