import { format, delay } from 'roadhog-api-doc';
import {
    fetchStudentTableData,
    fetchGroupList,
    updateStudentTutorOrNumber,
    importStudentTutorAndNumber,
    showConfig,
} from './mock/studentTabulation.js';
import {
    divisionList,
    CardMsgs,
    allGrade,
    getDetail,
    getResult,
    addClasses,
    importStudentColunteer,
    importStudentExcel,
    importStudentScoreList,
    importStudentScoreExcel,
    classProgram,
    adjustAdmin,
    adjustLayer,
    allClass,
    allCourse,
    getAllPos,
    importStudentClassList,
    importStudentClassExcel,
    adjustPos,
    importStudentResultExcel,
    importStudentResultList,
    allGrades,
    adminClassView,
    exportDivideResultAdminClassView,
    exportDivideResultAdminClassScoreView,
    exportDivideResultTeachingClassView,
    exportDivideResultStudentView,
    divideResultStudentView,
    studentCourseCombinationView,
    divideResultCombinationView,
    showCombinationDetail,
    updateCombination,
    choiceSelectList,
    studentConfirm,
    studentCombinationImport,
    confirmSync,
    confirmSyncText,
    dividePlanDetail,
    weekVersionList,
    saveDividePlanSyncSchduleResult,
    importStudentClassSettingExcel,
    editClassPlan,
    checkDivideResultClass,
} from './mock/division.js';

import {
    getSemesterList,
    selectAllSchoolYear,
    getCourseLists,
    listChooseCourse,
    getGradeList,
    allGradeList,
    getDateList,
    getCalendarList,
    deleteCalendarDetail,
    addScheduleSuccess,
    editScheduleList,
    copyScheduleList,
    addScheduleText,
    lookCalendarDetail,
    modifScheduleWork,
    deleteBaseListText,
    fetchWorkingHours,
    changeSchedulelist,
    changeDay,
    changeDifference,
    changeSchedule,
    versionScheduleChange,
    addScheduleList,
    getClassList,
    allStudent,
    allStage,
    allStageGrade,
    copyLatestVersion,
    invalidInfo,
    confirmInvalid,
    getRangeTimeVersionList,
    getSemesterListByTime,
    getScheduleList,
} from './mock/time.js';
import {
    getSubjectList,
    listSubject,
    newGetSubjectList,
    getCourseList,
    getCoursePlan,
    getTeacherList,
    newGetTeacherList,
    getCoursePlanning,
    getCoursePlanningNew,
    getStudentGroup,
    getStudentGroup1,
    getPublishResult,
    getCheckPayTuitionPlan,
    getReCreatePayTuitionPlan,
    getCreatePayTuitionPlan,
    createPayTuitionPlanResult,
    deleteSublist,
    importSuccess,
    confirmImportSub,
    updateCoursePlanning,
    deleteCoursePlanning,
    saveDefaultSuccess,
    onlyHaveClass,
    fetchPlanById,
    allAddress,
    schoolList,
    chooseCourseDelete,
    choosePlanList,
    addedOrEditChoosePlan,
    listCourse,
    listKeywordSubject,
    addedCourse,
    updateCourse,
    addedSubject,
    updateSubject,
    deleteSubject,
    courseEnableAndDisable,
    getIsDisableNum,
    gradeByCoursePlanning,
    coursePlanningGroup,
    schoolIdAllSemester,
    couserPlanningSchoolList,
    checkSemesterClass,
    selectContactCourse,
    getByConditionTeacher,
    saveCoursePlanning,
    getAllClass,
    newlistCourse,
    showDetail,
    editCourseFee,
    listDomainSubjectTree,
    insertDomainSubject,
    updateDomainSubject,
    listKeywordSubjects,
    searchXlsxTeacherPlan,
} from './mock/course.js';
import {
    createSchedule,
    saveVersion,
    searchImportCourse,
    confirmImportSuccess,
    fetchCourseList,
    fetchArrangeDetail,
    copyCard,
    deleteCard,
    findWeekCoursePlanning,
    haveScheduleNum,
    getVersionList,
    currentVersion,
    scheduleData,
    deleteCourseSuccess,
    changeArrangeSuccess,
    lookCourseDetail,
    copyResult,
    saveCardTeacher,
    getScheduelList,
    saveChangeTime,
    continueArrangeSuccess,
    deleteWeekCoursePlanning,
    deleteWeekCoursePlanningByCourse,
    updateWeekCoursePlanning,
    gradeListByVersion,
    getClickKeySchedule,
    fetScheduleSuccess,
    saveFreeScheduleTime,
    departmentList,
    studentList,
    createFreeCourseSuccess,
    lookFreeCourseDetail,
    deleteFreeCourseSuccess,
    getAreaList,
    publishScheduleSuccess,
    showAcCourseList,
    lockUtilLesson,
    unLockUtilLesson,
    confirmLock, //确认锁定
    confirmUpdate, //确认调整节次
    canChangeCourse,
    checkExchange,
    exchangeDetail,
    lastPublicContent,
    confirmExchange,
    editSystemCourse,
    editFreeCourse,
    relatedAmount,
    courseBySubject,
    fetProgress,
    fetStop,
    statisticCourse,
    getGradeByType,
    searchNoAddressResult,
    manualScheduleCheck,
    acArrangeSuccess,
    scheduleResultNumber,
    confirmDeleteResult,
    fetchAddressResult,
    fetchTeacherResult,
    compareVersionList,
    compareVersionTeacherList,
    versionGrade,
    editVersion, // 编辑版本名称
    findStudent,
    findGroup,
    findGrade,
    newCanSelect,
    newCanScheduleList,
    conflictCard, // 冲突卡片
    manualSchedule,
    willGroupList,
    confirmCreate, // 确认新建活动
    exportGroupList,
    importByCourse,
    compareVersion,
    compareVersionResult,
    checkVersionData,
    unStudentList,
    teacherCareList,
    publishVersionType,
    copyByDayScheduleResult,
    checkEditResultSchedule,
    coursePlanSubject,
    exportExcelResult,
    importExcelresult,
    operationRecordList,
    revokeOperationRecord,
    courseScheduleImport,
    roomConflict,
    taskWeekVersionList,
} from './mock/timeTable.js';
import {
    newRuleManagement,
    weeklyRuleChanges,
    hasRulesList,
    ruleCount,
    ruleListOfTypes,
    rulesEnable,
    rulesDisables,
    teacherRulesList,
    scheduleDetail,
    scheduleRuleDetail,
    allTeacherList,
    classGroupList,
    newClassGroupList,
    courseAllList,
    courseAcList,
    accordingVersion,
    courseAcquisition,
    ruleToDelete,
    classTypeList,
    oneRuleInformation,
    courseAddressList,
    roleTag,
    filterGrade,
    filterSubject,
    updatedClassInfo,
    updatedSubjectInfo,
    ruleImport,
    getBatchSetSiteRule,
    compareGroupList,
    compareGroupGroupingExcelImport,
    coursePackageMessageList,
    coursePackageMergeGroupList,
    listCourseGroup,
} from './mock/rules.js';

import {
    clubDataSource,
    clubCourseList,
    createClubList,
    generateSeat,
    activeImportCheck,
    activeImport,
    activeStudentSeatNumberDownloadCheck,
    batchPublishActive,
    batchDeleteFreeScheduleResult,
} from './mock/club.js';

import { getLotsDetail, generateBillOfPayment } from './mock/courseBaseDetail';

import {
    studentOrgData,
    studentManagementList,
    addStudentFetchGrade,
    addStudentFetchStudent,
    notAdminStudentList,
    lookApplyGrade,
    orgRoleStudentList,
    nonAdministrationClass,
    getStudentDetails,
    nationList,
    countryData,
    gradeData,
    exportSourceSuccess,
    resetPasswordSuccess,
    addStudentParentSuccess,
    updateStudentParentSuccess,
    deleteStudentParentSuccess,
    confirmUpdateStudentProfile,
    confirmBatchEditInfo,
    batchSetTutorSuccess,
    batchSetStudentSpecialtyTutor,
    batchSetStudentNotice,
    getEndClassNumber,
    confirmEndClassSuccess,
    uploadTransferAnnex,
    submitTransferSchool,
    submitSuspensionSchool,
    submitResumptionSchool,
    submitGiveUpSchool,
    recoveryStudentList,
    recordList,
    subupdateStudentInfo,
    parentUpdateStudentInfo,
    leftSchoolReason,
    graduationDestination,
    checkUpgrade,
    upgradeInfo,
    confirmUpgrade,
    listSuspendStudyOrgTree,
    listGraduationOrgTree,
    listGraduationStudent,
    updateSuspendStudy,
    suspendStudyInfo,
    studentStatusRecord,
    previewFile,
    onClickUrged,
    downloadExcel,
    checkStudentInfo,
    parentChildList,
    upDateStudentInfo,
    confirmStudentInfo,
    checkNewYearInit,
    upgradeConfiguration,
    upGradeForSure,
    listSchoolForStudent,
    listSchoolYearForStudent,
    importUserList,
    streetList,
    endStudentTutor,
    listDormInfo,
    schoolBusList,
    getTutorList,
    GradeGroupList,
    downloadList,
} from './mock/student.js';
import {
    teacherOrgData,
    departmentalStaff,
    orgInfoById,
    createOrgSuccess,
    deleteOrgSuccess,
    addTeacherList,
    getPathByTreeId,
    addStaffSuccess,
    deleteStaffSuccess,
    fetchOrgDetailSuccess,
    updateOrgTreeNode,
    setOrgRoleSuccess,
    getOrgRoleList,
    getConfigureRoleList,
    deleteUserForRoleSuccess,
    deleteOrgNodeRoleSuccess,
    adminGrade,
    transferStaffSuccess,
    addExternalUser,
    batchSetControllerSuccess,
    lookStaffDetail,
    dingNodeInfo,
    getEmployeeList,
    listSpecialtyTutor,
    checkAddExternalEmployee,
    updateExternalEmployee,
    employeeQuitSuccess,
    roleList,
    roleUserInfo,
    systemBuiltRole,
    listGradeGroup,
    getTableData,
    batchQuitExternalEmployee,
    deletedExternalEmployee,
    getExternalDetailInfo,
    reinstatementExternalEmployee,
    approveExternalInfo,
    updateApproveExternalInfo,
    getApproveExternalDetailInfo,
    submitExternalInfo,
} from './mock/teacher.js';
import {
    employeeJoinIn,
    teacheSyncOrg,
    asyncEmployeeQuit,
    teachingRecord,
    organizeTreeList,
    cogradientParentSuccess,
    schoolYearList,
    listSchool,
    createSemester,
    editSchoolYear,
    startSemester,
    startSchoolYear,
    createSchoolYear,
    addressList,
    semesterWeekDetailList,
} from './mock/organize.js';

import {
    delMsg,
    accountList,
    busiAndChannelList,
    addOrUpdPayAccount,
    addMerChant,
    paymentMethodJudgment,
    queryMerchantAccountList,
    delPayBusiness,
    queryPayBusinessById,
    balanceList,
    getBalanceList,
    getScreeningItems,
} from './mock/account.js';

import {
    payItemDelMsg, // 删除
    queryPayItemList, // 列表
    queryPayItemCategory, // 收费项目类型
    addOrUpdPayChargeItem, // 新建修改项目
    addOrUpdPayItemCategory, // 新建修改项目类型
    delPayItemCategory, // 删除项目类型
} from './mock/chargePro.js';

import {
    selectStudentGroup, // 查询学生组件
    selectTeachingOrgStage, // 查询校区学段
    queryPayChargeItem, // 查询收费项目
    addPayTuitionPlan, // 新建缴费通知
    importChargeItem, // 上传
    selectTuitionPlan, // 查询缴费通知列表
    updateTuitionPlan, // 修改截止日期
    template, // 模板下载
    selectTuitionPlanDetails, // 查询单个缴费计划详情
    geteditDetail,
    selectTuitionOrderStatus, // 详情状态
    tuitionOrderDetailsPreview, // 预览
    isPromptSendTuitionPlan, // 一键催缴按钮判断以及统计催缴数据
    promptSendTuitionPlan, // 一键催缴
    delTuitionOrder, // 删除缴费订单
    delTuitionPlan, // 删除通知
    sendTuitionPlanCount, // 一键发送缴费通知相关的统计
    sendTuitionPlan, // 一键发送缴费通知
    addPayCloseOrderInfo, // 关闭订单
    exportTuitionOrderDetail, // 导出
    getUpdatePayTuitionPlanDetail, // 编辑
    updatePayTuitionPlan, // 修改缴费计划
    selectTuitionPlanListStatus, // 统计缴费通知列表发送状态总数
    upload_file, // 关闭表单上传文件
    getAccountOderDetail, // 账单详情
    getStudentTuitionPlan, // 编辑回显
    getSendPayTuitionToPersonal,
    refundTuitionOrderDone,
} from './mock/pay.js';

import {
    billList,
    getOrderInfoByOrderId,
    getPayWay,
    submitPay,
    fastPaymentLimit,
    getBankInfo,
    useBalanceWallet,
} from './mock/mobilePay.js';

import {
    batchOrderQuery,
    getTransactionsDetail,
    personalArrangements,
    disciplineManagement,
    subjectChief,
    gradeDetails,
    sectionList,
    currentSemesterSubject,
    personSemesterSubject,
    createStageSubject,
    stageSubject,
    updateStageSubject,
    getAttendanceList,
    getTemplateMenuList,
    changeViewConfig,
} from './mock/order.js';

import {
    studentDetailCourse,
    submittedCourse,
    schedule,
    courseStartPeriod,
    getChooseSubjectList,
    getChooseSubjectListNew,
    templateForPc,
    selectionQuarter, // 查看学生选课结果-时间分段
    studentListCourse, // 学生端--选课计划列表
    deleteSelectedCourses, // 删除已选课程
    submitSelectedCourse, // 提交已选课程
    submitResult, // 已选课程删除，报名，取消报名
    studentCourseDetails, // 学生端选课计划课程详情
    courseIntroduction, // 课程介绍
    grabSignUp, // 课程报名
    optionalMargin, // 先到先得选课余量接口
    schoolTime, // 上课时间
    grabSignUpMobile,
    studentDetailCourseNew,
    getAllCourseList,
    optionalMarginNe,
    getInformation,
    getUserAccountBindInformation,
    selectParentChildList,
} from './mock/courseStudentDetail.js';

import {
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
    getStudentsByClass,
    getPayChargeItemList,
} from './mock/choose.js';

import {
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
    addStudentClass,
    classStudentsBatchRemoval,
    studentsClassTransfer,
    studentCourseResultsManagement,
    uncheckAndCheck,
    sameCourseRepeat,
    chooseAddNewClasses,
    checkCoursePlanAddPermission,
    checkClassPermission,
    cancelFee,
    selectGroupingByChoosePlan,
} from './mock/courseBaseDetail.js';

import {
    listBatchStudentInfo,
    selectChooseStudentList,
    addStudent,
    studentBatchRemoval,
    openChooseCourse,
    batchTransferStudent,
    sendNoticeForParents,
    previewEmail,
    allGradeOfAS,
    allGradeAndGroup,
    chooseResultEffective,
    cancelCoursePlan,
    syncToScheduleTemplate,
} from './mock/courseTeacherDetail';

import {
    findTeacherSchedule, // 自定义教师查询结果
    findFieldSchedule, // 自定义场地查询结果
    findStudentSchedule, // 自定义学生查询结果
    findClassSchedule, // 自定义班级查询结果
    findGradeSchedule, //自定义年级查询结果
} from './mock/custom';
import {
    listAllOrgTeachers,
    listAllTeachersWithDept,
    commonResponse,
    listRolePermission,
} from './mock/global';

import { findClassScheduleAc } from './mock/lessonView';

import {
    workFlowRuleList,
    changeRequest,
    importSupplementUrlList,
    actingTeacherList,
    totalLessonList,
    copySendRuleList,
    activeRelatedList,
    submitChangeRequest,
    applicationList,
    replaceList,
    checkWorkFlowNodePermission,
    selectSupportVersion,
    approveCheck,
    listVersionChangeCourseRequest,
    publishChangeCourseRequestList,
    selectScheduleCourseMessage,
    teacherCalendarList,
    personalChangeCourseCount,
} from './mock/replace';

import { isBorder, removableCourse, updateACToBuffer } from './mock/exchangeCourse';
// import { getAllCourse } from './src/services/courseStudentDetail.js';

//是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

//代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
    //支持 Object 和 Array

    // 收费用户信息接口，已使用教务提供的接口
    // 'GET /api/current/user': {
    //     "ifLogin": true,
    //     "status": true,
    //     "message": "获取成功",
    //     "code": 0,
    //     "content": {
    //         "name": "蔡武娟",
    //         "identityShowName": "宁无忧 爸爸",
    //         "avatar": "https://static.dingtalk.com/media/lADOysn4mc0CgM0Cfg_638_640.jpg",
    //         "userId": 75,
    //         currentChildId:22,
    //         currentChildName: "宁无忧",
    //         currentIdentity: "employee",
    //         "notifyCount": 12,
    //         "identifies": [
    //             "employee",
    //             //"student",
    //             //  "parent",
    //             //  "externalUser"
    //         ],
    //         "studentNo":172010023,
    //         "phoneNumber":13988212211
    //     }
    // },

    //获取公钥
    'GET /cas/getPublicKey': (req, res) => {
        res.send({
            ifLogin: true,
            status: true,
            message: '成功',
            code: 0,
            content:
                'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnT45gLCdvYP9/OvRi9neEQENC0tJJohpl8AVGms/c0t+YqmMqwHKXYSh7IP4wQt7ekmFOb5tbNbtv3kSmIQuuvWsDOR6E6MagSvaBiNII9+sq6dqtYM1p4F2xBHDbsjQfc0NTKUJQ9NiMDrsi3xhy+spKgsxlw3SOEQbIXRvoi/hv5k2aKnQnBm0Zy1DlBlu6rtYGcTp93ozEEOK4IeWWKdVrL6iFC7Ogz6YGwWR+q6WjyEzIXZTB9sRWTtyxTfjv+V75FR8TLUxmuzJ9nbGnFafKvyFXeeYhp538zzQQTjHJAf+kpY8eMH0euomIbIIUBqip0pS4xapKrU6HW38dwIDAQAB',
            ifAdmin: false,
        });
    },

    //批量导入学生
    'POST /api/teaching/student/importUserList': importUserList,
    'POST /api/teaching/student/addStudent': importUserList,
    'POST /api/teaching/student/endStudentTutor': endStudentTutor,
    'GET /api/teaching/student/listDormInfo': listDormInfo,
    'GET /api/teaching/student/listSchoolBus': schoolBusList,
    'GET /api/student/getTutorList': getTutorList,
    'GET /api/teaching/history/export/historyExportFile': downloadList,
    'GET /api/teaching/student/listGradeGroup': GradeGroupList,

    'POST /api/choose/batchStudent/generateBillOfPayment': generateBillOfPayment,

    'GET /api/course/selection/listCoursePlanningDetail': getLotsDetail,

    'GET /api/current/user': {
        code: 0,
        content: {
            avatar: 'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/record/image_file/20180830092735-aaef765c830f44449c64aa229c7d622c.jpeg?x-oss-process=image/crop,x_696,y_472,w_1290,h_1293',
            baseExternalSchool: false,
            createTuitionFeePermission: true,
            currentIdentity: 'employee',
            downloadStudentDetailPermission: true,
            eduGroupcompanyId: 1,
            externalSchool: false,
            identify: ['employee'],
            identityShowName: '管理员哈哈111 管8933',
            name: '管理员哈哈111',
            schoolName: '杭州云谷学校',
            tags: [
                'LEADER',
                'CHIEF_TUTOR',
                'HZYGXX0016',
                'HZYGXX0016',
                'SUBJECT_CHIEF',
                'SUBJECT_CHIEF',
                'SUBJECT_CHIEF',
                'TEACH_STAGE_LEADER',
                'SUBJECT_CHIEF',
                'RESEARCH_LEADER',
                'CHIEF_TUTOR',
                'GRADE_PRINCIPAL',
                'GRADE_PRINCIPAL',
                'GRADE_PRINCIPAL',
                'GRADE_PRINCIPAL',
                'DIRECTOR_OF_TEACHING',
                'TUTOR',
                'SPECIALTY_TUTOR',
            ],
            userId: 1,
            eduGroupcompanyId: 110,
            schoolId: 1,
            schoolName: '测试',
            createTuitionFeePermission: true, //创建学费计划权限
            downloadStudentDetailPermission: true, //下载学生名单权限
            tags: ['CLASS_MENTOR', 'CLASS_MENTOR', 'TUTOR'], //是否是首席导师
            currentChildClassInfo: {
                absoluteEnName: 'G12 G11 Trinity',
                absoluteName: '十二年级三好',
                chiefTutorList: [18],
                gradeEnName: 'G12',
                gradeId: 22,
                gradeName: '十二年级',
                groupEName: 'G12 G11 Trinity',
                groupId: 395,
                groupName: '十二年级三好',
                stageNumber: 4,
                gradeNum: 1,
                tutorList: [3272],
            },
        },
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },
    //上传组件-最新
    'POST /api/upload_file': {
        ifLogin: true,
        status: true,
        message: '请求成功',
        code: 0,
        ifAdmin: false,
        content: [
            {
                fileId: 1000,
                fileName: '最新上传的文件名称.jpg',
                url: 'https://img1.baidu.com/it/u=746671979,899885343&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1082',
                previewImage:
                    'http://userservice.api.yungu-inc.org/api/user/avatarUrl/2d98809d-8a5f-40d8-9e5c-1d5bba87fa2d',
                type: 'file',
                // "type": "audio"
            },
        ],
        /* ifLogin: true,
        status: true,
        message: '上传文件成功',
        code: 3007,
        content: [
            {
                fileId: 318159,
                fileName: 'image_15.png',
                url: '/api/preview_file?id=318159',
                previewImage: '/api/file/preview?previewId=318159',
                type: 'image',
                storeMeta: null,
                downloadUrl: null,
            },
        ],
        ifAdmin: false, */
    },
    'GET /api/upload_file/new': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            fileName: 'mac快捷键大全.jpeg',
            previewImage:
                'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3816980860,302722167&fm=26&gp=0.jpg',
            fileId: 12,
            fileSize: '3.88M',
            url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3816980860,302722167&fm=26&gp=0.jpg',
        },
    },
    'POST /course/api/choose/cancelSignUp': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            fileName: 'mac快捷键大全.jpeg',
            previewImage:
                'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3816980860,302722167&fm=26&gp=0.jpg',
            fileId: 12,
            fileSize: '3.88M',
            url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3816980860,302722167&fm=26&gp=0.jpg',
        },
    },
    'GET /api/stratify/getStudentList': {
        code: 0,
        content: {
            classList: [
                {
                    classEname: 'G10 C14',
                    classId: 1946,
                    className: '高一14班',
                },
                {
                    classEname: 'G10 C15',
                    classId: 1947,
                    className: '高一15班',
                },
                {
                    classEname: 'G10 C16',
                    classId: 1948,
                    className: '高一16班',
                },
                {
                    classEname: 'G11 C1',
                    classId: 1949,
                    className: '高二1班',
                },
                {
                    classEname: 'G11 C2',
                    classId: 1950,
                    className: '高二2班',
                },
                {
                    classEname: 'G11 C3',
                    classId: 1951,
                    className: '高二3班',
                },
                {
                    classEname: 'G11 C4',
                    classId: 1952,
                    className: '高二4班',
                },
                {
                    classEname: 'G11 C5',
                    classId: 1953,
                    className: '高二5班',
                },
                {
                    classEname: 'G11 C6',
                    classId: 1954,
                    className: '高二6班',
                },
                {
                    classEname: 'G11 C7',
                    classId: 1955,
                    className: '高二7班',
                },
                {
                    classEname: 'G11 C8',
                    classId: 1956,
                    className: '高二8班',
                },
                {
                    classEname: 'G11 C9',
                    classId: 1957,
                    className: '高二9班',
                },
                {
                    classEname: 'G11 C10',
                    classId: 1958,
                    className: '高二10班',
                },
                {
                    classEname: 'G11 C11',
                    classId: 1959,
                    className: '高二11班',
                },
                {
                    classEname: 'G11 C12',
                    classId: 1960,
                    className: '高二12班',
                },
                {
                    classEname: 'G11 C13',
                    classId: 1961,
                    className: '高二13班',
                },
                {
                    classEname: 'G11 C14',
                    classId: 1962,
                    className: '高二14班',
                },
                {
                    classEname: 'G11 C15',
                    classId: 1963,
                    className: '高二15班',
                },
                {
                    classEname: 'G12 C1',
                    classId: 1964,
                    className: '高三1班',
                },
                {
                    classEname: 'G12 C2',
                    classId: 1965,
                    className: '高三2班',
                },
                {
                    classEname: 'G12 C3',
                    classId: 1966,
                    className: '高三3班',
                },
                {
                    classEname: 'G12 C4',
                    classId: 1967,
                    className: '高三4班',
                },
                {
                    classEname: 'G12 C5',
                    classId: 1968,
                    className: '高三5班',
                },
                {
                    classEname: 'G12 C6',
                    classId: 1969,
                    className: '高三6班',
                },
                {
                    classEname: 'G12 C7',
                    classId: 1970,
                    className: '高三7班',
                },
                {
                    classEname: 'G12 C8',
                    classId: 1971,
                    className: '高三8班',
                },
                {
                    classEname: 'G12 C9',
                    classId: 1972,
                    className: '高三9班',
                },
                {
                    classEname: 'G12 C10',
                    classId: 1973,
                    className: '高三10班',
                },
                {
                    classEname: 'G12 C11',
                    classId: 1974,
                    className: '高三11班',
                },
                {
                    classEname: 'G12 C12',
                    classId: 1975,
                    className: '高三12班',
                },
                {
                    classEname: 'G12 C13',
                    classId: 1976,
                    className: '高三13班',
                },
                {
                    classEname: 'G12 C14',
                    classId: 1977,
                    className: '高三14班',
                },
            ],
            gradeList: [
                {
                    grade: 1,
                    id: 84,
                    orgEname: 'G1',
                    orgName: '一年级',
                },
                {
                    grade: 2,
                    id: 85,
                    orgEname: 'G2',
                    orgName: '二年级',
                },
                {
                    grade: 3,
                    id: 86,
                    orgEname: 'G3',
                    orgName: '三年级',
                },
                {
                    grade: 4,
                    id: 87,
                    orgEname: 'G4',
                    orgName: '四年级',
                },
                {
                    grade: 5,
                    id: 88,
                    orgEname: 'G5',
                    orgName: '五年级',
                },
                {
                    grade: 6,
                    id: 89,
                    orgEname: 'G6',
                    orgName: '六年级',
                },
                {
                    grade: 7,
                    id: 91,
                    orgEname: 'G7',
                    orgName: '七年级',
                },
                {
                    grade: 8,
                    id: 92,
                    orgEname: 'G8',
                    orgName: '八年级',
                },
                {
                    grade: 9,
                    id: 93,
                    orgEname: 'G9',
                    orgName: '九年级',
                },
                {
                    grade: 10,
                    id: 95,
                    orgEname: 'G10',
                    orgName: '高一',
                },
                {
                    grade: 11,
                    id: 96,
                    orgEname: 'G11',
                    orgName: '高二',
                },
                {
                    grade: 12,
                    id: 97,
                    orgEname: 'G12',
                    orgName: '高三',
                },
            ],
            studentList: [
                {
                    classId: 1949,
                    studentId: 8456,
                    studentName: '卞若熙',
                },
                {
                    classId: 1949,
                    studentId: 8457,
                    studentName: '陈杭楠',
                },
                {
                    classId: 1949,
                    studentId: 8458,
                    studentName: '陈元书',
                },
                {
                    classId: 1949,
                    studentId: 8459,
                    studentName: '陈子杰',
                },
                {
                    classId: 1949,
                    studentId: 8460,
                    studentName: '褚心妍',
                },
                {
                    classId: 1949,
                    studentId: 8461,
                    studentName: '戴江河',
                },
                {
                    classId: 1949,
                    studentId: 8462,
                    studentName: '董睿',
                },
                {
                    classId: 1949,
                    studentId: 8463,
                    studentName: '方浩庭',
                },
                {
                    classId: 1949,
                    studentId: 8464,
                    studentName: '方易',
                },
                {
                    classId: 1949,
                    studentId: 8465,
                    studentName: '冯润杰',
                },
                {
                    classId: 1949,
                    studentId: 8466,
                    studentName: '郭陈骋',
                },
                {
                    classId: 1949,
                    studentId: 8467,
                    studentName: '郭思捷',
                },
                {
                    classId: 1949,
                    studentId: 8468,
                    studentName: '韩昕辰',
                },
                {
                    classId: 1949,
                    studentId: 8469,
                    studentName: '胡睿恺',
                },
                {
                    classId: 1949,
                    studentId: 8470,
                    studentName: '计嘉越',
                },
                {
                    classId: 1949,
                    studentId: 8471,
                    studentName: '季博承',
                },
                {
                    classId: 1949,
                    studentId: 8472,
                    studentName: '金宇博',
                },
                {
                    classId: 1949,
                    studentId: 8473,
                    studentName: '来诗敏',
                },
                {
                    classId: 1949,
                    studentId: 8474,
                    studentName: '李雅裕',
                },
                {
                    classId: 1949,
                    studentId: 8475,
                    studentName: '李亦可',
                },
                {
                    classId: 1949,
                    studentId: 8476,
                    studentName: '李子琦',
                },
                {
                    classId: 1949,
                    studentId: 8477,
                    studentName: '李宗燃',
                },
                {
                    classId: 1949,
                    studentId: 8478,
                    studentName: '厉璋儒',
                },
                {
                    classId: 1949,
                    studentId: 8479,
                    studentName: '刘济豪',
                },
                {
                    classId: 1949,
                    studentId: 8480,
                    studentName: '卢昊',
                },
                {
                    classId: 1949,
                    studentId: 8481,
                    studentName: '潘书鸿',
                },
                {
                    classId: 1949,
                    studentId: 8482,
                    studentName: '潘正杰',
                },
                {
                    classId: 1949,
                    studentId: 8483,
                    studentName: '邱天',
                },
                {
                    classId: 1949,
                    studentId: 8484,
                    studentName: '沈震韬',
                },
                {
                    classId: 1949,
                    studentId: 8485,
                    studentName: '施淇瀚',
                },
                {
                    classId: 1949,
                    studentId: 8486,
                    studentName: '汤舒啸',
                },
                {
                    classId: 1949,
                    studentId: 8487,
                    studentName: '万余迪',
                },
                {
                    classId: 1949,
                    studentId: 8488,
                    studentName: '王豪',
                },
                {
                    classId: 1949,
                    studentId: 8489,
                    studentName: '王好01',
                },
                {
                    classId: 1949,
                    studentId: 8490,
                    studentName: '王好05',
                },
                {
                    classId: 1949,
                    studentId: 8491,
                    studentName: '王佳未',
                },
                {
                    classId: 1949,
                    studentId: 8492,
                    studentName: '王军扬',
                },
                {
                    classId: 1949,
                    studentId: 8493,
                    studentName: '王浚泽',
                },
                {
                    classId: 1949,
                    studentId: 8494,
                    studentName: '王睿彬',
                },
                {
                    classId: 1949,
                    studentId: 8495,
                    studentName: '王易知',
                },
                {
                    classId: 1949,
                    studentId: 8496,
                    studentName: '吴少卿',
                },
                {
                    classId: 1949,
                    studentId: 8497,
                    studentName: '吴宇航',
                },
                {
                    classId: 1949,
                    studentId: 8498,
                    studentName: '夏澎乐',
                },
                {
                    classId: 1949,
                    studentId: 8499,
                    studentName: '徐世恩',
                },
                {
                    classId: 1949,
                    studentId: 8500,
                    studentName: '杨楚晗',
                },
                {
                    classId: 1949,
                    studentId: 8501,
                    studentName: '余湜',
                },
                {
                    classId: 1949,
                    studentId: 8502,
                    studentName: '曾旻',
                },
                {
                    classId: 1949,
                    studentId: 8503,
                    studentName: '张远浩',
                },
                {
                    classId: 1949,
                    studentId: 8504,
                    studentName: '张子元',
                },
                {
                    classId: 1949,
                    studentId: 8505,
                    studentName: '周淇',
                },
                {
                    classId: 1949,
                    studentId: 8506,
                    studentName: '庄炫宇',
                },
                {
                    classId: 1950,
                    studentId: 8507,
                    studentName: '陈昊天',
                },
                {
                    classId: 1950,
                    studentId: 8508,
                    studentName: '陈睿捷',
                },
                {
                    classId: 1950,
                    studentId: 8509,
                    studentName: '陈宣亦',
                },
                {
                    classId: 1950,
                    studentId: 8510,
                    studentName: '陈奕嘉',
                },
                {
                    classId: 1950,
                    studentId: 8511,
                    studentName: '陈奕宁',
                },
                {
                    classId: 1950,
                    studentId: 8512,
                    studentName: '陈子昂',
                },
                {
                    classId: 1950,
                    studentId: 8513,
                    studentName: '池宇皓',
                },
                {
                    classId: 1950,
                    studentId: 8514,
                    studentName: '仇馨',
                },
                {
                    classId: 1950,
                    studentId: 8515,
                    studentName: '邓盛之',
                },
                {
                    classId: 1950,
                    studentId: 8516,
                    studentName: '方海翔',
                },
                {
                    classId: 1950,
                    studentId: 8517,
                    studentName: '傅宇轩',
                },
                {
                    classId: 1950,
                    studentId: 8518,
                    studentName: '高清云',
                },
                {
                    classId: 1950,
                    studentId: 8519,
                    studentName: '顾函菁',
                },
                {
                    classId: 1950,
                    studentId: 8520,
                    studentName: '郭政和',
                },
                {
                    classId: 1950,
                    studentId: 8521,
                    studentName: '杭敬涵',
                },
                {
                    classId: 1950,
                    studentId: 8522,
                    studentName: '何雨轩',
                },
                {
                    classId: 1950,
                    studentId: 8523,
                    studentName: '黑天行',
                },
                {
                    classId: 1950,
                    studentId: 8524,
                    studentName: '洪黄琰',
                },
                {
                    classId: 1950,
                    studentId: 8525,
                    studentName: '胡嘉煦',
                },
                {
                    classId: 1950,
                    studentId: 8526,
                    studentName: '黄诚',
                },
                {
                    classId: 1950,
                    studentId: 8527,
                    studentName: '蒋子轩',
                },
                {
                    classId: 1950,
                    studentId: 8528,
                    studentName: '金琪',
                },
                {
                    classId: 1950,
                    studentId: 8529,
                    studentName: '金一鸣',
                },
                {
                    classId: 1950,
                    studentId: 8530,
                    studentName: '赖淇玮',
                },
                {
                    classId: 1950,
                    studentId: 8531,
                    studentName: '林晨阳',
                },
                {
                    classId: 1950,
                    studentId: 8532,
                    studentName: '林书语',
                },
                {
                    classId: 1950,
                    studentId: 8533,
                    studentName: '林旭齐',
                },
                {
                    classId: 1950,
                    studentId: 8534,
                    studentName: '刘子慷',
                },
                {
                    classId: 1950,
                    studentId: 8535,
                    studentName: '陆柯嘉',
                },
                {
                    classId: 1950,
                    studentId: 8536,
                    studentName: '骆立辰',
                },
                {
                    classId: 1950,
                    studentId: 8537,
                    studentName: '申子慕',
                },
                {
                    classId: 1950,
                    studentId: 8538,
                    studentName: '沈皓然',
                },
                {
                    classId: 1950,
                    studentId: 8539,
                    studentName: '沈可涵',
                },
                {
                    classId: 1950,
                    studentId: 8540,
                    studentName: '沈宇睿',
                },
                {
                    classId: 1950,
                    studentId: 8541,
                    studentName: '石若妍',
                },
                {
                    classId: 1950,
                    studentId: 8542,
                    studentName: '汪奕舟',
                },
                {
                    classId: 1950,
                    studentId: 8543,
                    studentName: '王嘉轩',
                },
                {
                    classId: 1950,
                    studentId: 8544,
                    studentName: '王依然',
                },
                {
                    classId: 1950,
                    studentId: 8545,
                    studentName: '翁竟成',
                },
                {
                    classId: 1950,
                    studentId: 8546,
                    studentName: '吴浩文',
                },
                {
                    classId: 1950,
                    studentId: 8547,
                    studentName: '徐欣然',
                },
                {
                    classId: 1950,
                    studentId: 8548,
                    studentName: '杨晓路',
                },
                {
                    classId: 1950,
                    studentId: 8549,
                    studentName: '叶锦航',
                },
                {
                    classId: 1950,
                    studentId: 8550,
                    studentName: '俞孟言',
                },
                {
                    classId: 1950,
                    studentId: 8551,
                    studentName: '张皓天2班',
                },
                {
                    classId: 1950,
                    studentId: 8552,
                    studentName: '张晓天',
                },
            ],
        },
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },
    'GET /api/course/selection/listSyncRecord': {
        code: 0,
        content: [
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                current: true,
                id: 160,
                success: false,
                syncTime: '2022-08-19 15:48',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2071,
                versionName: '初中课表初始版本01',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                current: true,
                id: 159,
                success: false,
                syncTime: '2022-08-19 14:31',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2071,
                versionName: '初中课表初始版本01',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 155,
                success: false,
                syncTime: '2022-08-19 13:27',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2062,
                versionName: '9.15 初中课表',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 149,
                success: false,
                syncTime: '2022-08-19 09:15',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2063,
                versionName: '初中课表初始版本-测试',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 148,
                success: true,
                syncTime: '2022-08-18 14:31',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 147,
                success: false,
                syncTime: '2022-08-18 14:28',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 146,
                success: false,
                syncTime: '2022-08-16 17:34',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 145,
                success: false,
                syncTime: '2022-08-16 17:16',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 144,
                success: false,
                syncTime: '2022-08-16 16:26',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 143,
                success: false,
                syncTime: '2022-08-16 16:20',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 142,
                success: false,
                syncTime: '2022-08-16 16:03',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 141,
                success: false,
                syncTime: '2022-08-16 15:55',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 140,
                success: false,
                syncTime: '2022-08-16 15:46',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 139,
                success: false,
                syncTime: '2022-08-16 15:15',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 138,
                success: false,
                syncTime: '2022-08-16 13:52',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 137,
                success: false,
                syncTime: '2022-08-16 13:46',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
            {
                chooseCoursePlanId: 175,
                createUserId: 2214,
                id: 136,
                success: false,
                syncTime: '2022-08-15 15:39',
                userEnName: 'yanghuanhuan',
                userName: '杨欢欢',
                versionId: 2060,
                versionName: '初中课表初始版本',
            },
        ],
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },
    'POST /api/stratify/insertGroup': {
        code: 0,
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },
    'POST /api/stratify/addStudentClass': {
        code: 0,
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },
    'GET /api/set_language': {
        ifLogin: true,
        status: true,
        message: '请求成功',
        code: 1,
        content: null,
        ifAdmin: false,
    },

    'GET /course/api/set_language': {
        ifLogin: true,
        status: true,
        message: '请求成功',
        code: 1,
        content: null,
        ifAdmin: false,
    },

    'GET /api/messageCenter/page': {
        ifLogin: true,
        status: true,
        message: '请求成功',
        code: 1,
        content: {
            pageSize: 10,
            pageNum: 1,
            total: 16,
            data: [
                {
                    content: '测试评论艾特',
                    messageId: 386,
                    messageSendTime: 1556530532000,
                    messageUrl: 'https://my.daily.yungu-inc.org/#/RecordDetail/1365',
                    senderAvatar:
                        'http://userservice.api.yungu-inc.org/api/user/avatarUrl/f1793f24-a324-40dd-a987-96281ae278ed',
                    senderName: '蔡武娟 Wujuan Cai',
                    title: '云谷课堂：您收到了新记录',
                },
                {
                    content: '测试评论艾特',
                    messageId: 387,
                    messageSendTime: 1556530532000,
                    messageUrl: 'https://my.daily.yungu-inc.org/#/RecordDetail/1365',
                    senderAvatar:
                        'http://userservice.api.yungu-inc.org/api/user/avatarUrl/f1793f24-a324-40dd-a987-96281ae278ed',
                    senderName: '蔡武娟 Wujuan Cai',
                    title: '云谷课堂：您收到了新记录',
                },
                {
                    content: '测试评论艾特',
                    messageId: 388,
                    messageSendTime: 1556530532000,
                    messageUrl: 'https://my.daily.yungu-inc.org/#/RecordDetail/1365',
                    senderAvatar:
                        'http://userservice.api.yungu-inc.org/api/user/avatarUrl/f1793f24-a324-40dd-a987-96281ae278ed',
                    senderName: '蔡武娟 Wujuan Cai',
                    title: '云谷课堂：您收到了新记录',
                },
            ],
        },
        ifAdmin: false,
    },

    'GET /api/messageCenter/count': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            totalRead: 12,
            unreadTotal: 13,
        },
        ifAdmin: false,
    },

    'POST /api/messageCenter/read': (req, res) => {
        res.send({
            ifLogin: true,
            status: true,
            message: '请求成功',
            code: 1,
            content: null,
            ifAdmin: false,
        });
    },

    'POST /api/selectAllSemester': (req, res) => {
        res.send(getSemesterList);
    },

    'GET /api/selectAllSchoolYear': selectAllSchoolYear,

    'POST /api/defaultCoursePlan/import/course': (req, res) => {
        res.send(getCourseLists);
    },

    'POST /api/choose/choosePlan/listChooseCourse': (req, res) => {
        res.send(listChooseCourse);
    },
    'GET /api/allGrade': getGradeList,
    'GET /api/teaching/allGrade': allGradeList,
    'GET /api/scheduleList': getDateList,

    'GET /api/selectBaseScheduleAndDetail': getCalendarList,

    'GET /api/deleteBaseScheduleDetailById': deleteCalendarDetail,

    'GET /api/deleteBaseScheduleById': deleteBaseListText,

    'POST /api/insertBaseSchedule': (req, res) => {
        res.send(addScheduleList);
    },
    'POST /api/updateBaseSchedule': (req, res) => {
        res.send(editScheduleList);
    },
    'POST /api/copyBaseScheduleById': (req, res) => {
        res.send(copyScheduleList);
    },
    'POST /api/insertBaseScheduleDetail': (req, res) => {
        res.send(addScheduleText);
    },
    'POST /api/updateBaseScheduleDetail': (req, res) => {
        res.send(modifScheduleWork);
    },

    'GET /api/selectBaseScheduleDetail': lookCalendarDetail,
    'GET /api/selectBaseSchedule': fetchWorkingHours,
    'GET /api/mapping/schedule': changeSchedulelist,
    'POST /api/change/day': (req, res) => {
        res.send(changeDay);
    },
    // 'GET /api/change/schedule': changeSchedule,
    'POST /api/checkChangeSchedule': changeSchedule,
    'POST /api/versionScheduleChange': versionScheduleChange,
    'GET /api//show/schedule/difference': changeDifference,
    //课程计划接口
    'GET /api/course/subject': getSubjectList,
    'GET /api/course/selection/listSubject': listSubject,
    'GET /api/course/selection/listCourse': newlistCourse,
    // 课时计划新课程接口
    'GET /api/course/findAllSubject': newGetSubjectList,
    'GET /api/course': getCourseList,
    'POST /api/defaultCoursePlan/pageCourse': (req, res) => {
        res.send(getCoursePlan);
    },
    'POST /api/activeImportCheck': activeImportCheck,
    'POST /api/activeImport': activeImport,
    'GET /api/user/searchTeacher': getTeacherList,
    'GET /api/student/roster/showConfig': showConfig,
    'GET /api/user/searchUsersWithEduOrSchool': newGetTeacherList,
    'POST /api/course/manager/courseImport': {
        code: -1,
        content: {
            checkErrorMessageList: [
                {
                    errorMessage: '课程中文名重复!,课程英文名重复!',
                    lineNumber: 1,
                },
            ],
            checkOrImport: false,
            failureNumber: 1,
        },
        ifAdmin: false,
        ifLogin: true,
        message: '失败',
        status: false,
    },
    'POST /api/pay/wallet/importUserWalletDetailTemplateExcel': {
        code: -1,
        content: {
            // checkErrorMessageList: [
            //     {
            //         errorMessage: '课程中文名重复!,课程英文名重复!',
            //         lineNumber: 1,
            //     },
            // ],
            // checkOrImport: false,
            // failureNumber: 1,
        },
        ifAdmin: false,
        ifLogin: true,
        message: '失败',
        status: false,
    },

    'GET /api/course/selection/showCoursePlanningDetail': getCoursePlanning,
    'POST /api/choose/choosePlan/getPayChargeItemList': getPayChargeItemList,
    'GET /course/api/goods/showCoursePlanningDetail': getCoursePlanningNew,
    'GET /api/studentGroup/gradeByOther': getStudentGroup1,
    'GET /api/studentGroup/gradeByType': getStudentGroup,
    'GET /api/check/publish/result': getPublishResult,
    'GET /api/pay/checkPayTuitionPlanByCoursePlanId': getCheckPayTuitionPlan,
    'GET /api/pay/reCreatePayTuitionPlanByCoursePlanId': getReCreatePayTuitionPlan,
    'GET /api/pay/createPayTuitionPlanByCourseSelection': getCreatePayTuitionPlan,
    'GET /api/pay/get/CreatePayTuitionPlan/result': createPayTuitionPlanResult,
    'GET /api/defaultCoursePlan/delete': deleteSublist,
    'GET /api/defaultCoursePlan/copy': importSuccess,
    'POST /api/defaultCoursePlan/import': (req, res) => {
        res.send(confirmImportSub);
    },
    /* 'POST /api/defaultCoursePlan/updateCoursePlanning': (req, res) => {
        res.send(updateCoursePlanning);
    }, */
    'POST /api/course/selection/editCoursePlanningDetail': (req, res) => {
        res.send(updateCoursePlanning);
    },
    'POST /api/defaultCoursePlan/deleteCoursePlanning': (req, res) => {
        res.send(deleteCoursePlanning);
    },

    'POST /api/defaultCoursePlan/save': (req, res) => {
        res.send(saveDefaultSuccess);
    },
    'GET /api/studentGroup/grade': onlyHaveClass,
    'GET /api/deletePlanSon': deleteSublist,
    'POST /api/defaultCoursePlan/select/course': (req, res) => {
        res.send(fetchPlanById);
    },

    //时间管理--课程表
    'POST /api/weekVersion/createVersion': createSchedule,
    'POST /api/weekVersion/saveVersion': (req, res) => {
        res.send(saveVersion);
    },
    'POST /api/weekCoursePlanning/listCourse': (req, res) => {
        res.send(searchImportCourse);
    },
    'POST /api/weekCoursePlanning/import': (req, res) => {
        res.send(confirmImportSuccess);
    },

    'POST /api/detail/select/course': fetchCourseList,
    'POST /api/detail/list': fetchArrangeDetail,
    'GET /api/detail/copy': copyCard,
    'GET /api/detail/delete': deleteCard,
    'POST /api/weekCoursePlanning/findWeekCoursePlanningByCourse': (req, res) => {
        res.send(findWeekCoursePlanning);
    },
    'POST /api/weekVersion/countBaseScheduleByGradeList': (req, res) => {
        res.send(haveScheduleNum);
    },
    'POST /api/weekVersion/findVersion': (req, res) => {
        res.send(getVersionList);
    },
    'GET /api/weekVersion/currentVersion': currentVersion,
    'POST /api/weekVersion/schedule': scheduleData,
    'GET /api/scheduleResult/delete': deleteCourseSuccess,
    'GET /api/scheduleResult/update/arrange': changeArrangeSuccess,
    'GET /api/scheduleResult/select/result': lookCourseDetail,
    'POST /api/weekVersion/copyVersion': (req, res) => {
        res.send(copyResult);
    },
    'POST /api/detail/change': (req, res) => {
        res.send(saveCardTeacher);
    },
    'GET /api/detail/scheduleDetailList': getScheduelList,
    'POST /api/detail/checkScheduleDetail': (req, res) => {
        res.send(saveChangeTime);
    },
    'POST /api/detail/manualSchedule': (req, res) => {
        res.send(continueArrangeSuccess);
    },
    'POST /api/weekCoursePlanning/deleteWeekCoursePlanning': (req, res) => {
        res.send(deleteWeekCoursePlanning);
    },
    'POST /api/weekCoursePlanning/deleteWeekCoursePlanningByCourse': (req, res) => {
        res.send(deleteWeekCoursePlanningByCourse);
    },
    'POST /api/weekCoursePlanning/updateWeekCoursePlanning': (req, res) => {
        res.send(updateWeekCoursePlanning);
    },
    'GET /api/weekVersion/gradeList': gradeListByVersion,
    'GET /api/version/schedules': getClickKeySchedule,
    'POST /api/fet/schedule': (req, res) => {
        res.send(fetScheduleSuccess);
    },
    'POST /api/detail/free/schedule/activity': (req, res) => {
        res.send(saveFreeScheduleTime);
    },
    'GET /api/departments': departmentList,
    'GET /api/searchStudent': studentList,

    'POST /api/free/schedule': (req, res) => {
        res.send(createFreeCourseSuccess);
    },
    'GET /api/free/schedule/detail': lookFreeCourseDetail,
    'POST /api/delete/free/schedule': (req, res) => {
        res.send(deleteFreeCourseSuccess);
    },
    'GET /api/address/listAllAddress': getAreaList,
    'POST /api/scheduleResult/published/new': publishScheduleSuccess,
    'POST /api/course/list/version': showAcCourseList,

    // 规则管理
    'POST /api/weekRule/save': (req, res) => {
        res.send(newRuleManagement);
    },
    'POST /api/weekRule/update': (req, res) => {
        res.send(weeklyRuleChanges);
    },
    'POST /api/weekRule/addedList': hasRulesList,
    'GET /api/weekRule/ruleAmountStatistics': ruleCount,
    'POST /api/site/getBatchSetSiteRule': getBatchSetSiteRule,
    'POST /api/weekRule/ruleList': ruleListOfTypes,
    'GET /api/weekRule/enable': rulesEnable,
    'GET /api/weekRule/disable': rulesDisables,
    'POST /api/weekRule/scheduleForTeacherList': teacherRulesList,
    // 'GET /api/weekRule/scheduleDetail': scheduleDetail,
    'GET /api/weekRule/listScheduleDetail': scheduleDetail,
    'GET /api/weekRule/notAvailableRuleCommonSchedule': scheduleRuleDetail,
    'GET /api/weekVersion/teacherList': allTeacherList,
    'GET /api/weekVersion/studentGroupList': classGroupList,
    'GET /api/weekVersion/newStudentGroupList': newClassGroupList,
    'GET /api/weekVersion/courseList': courseAllList,
    'POST /api/weekRule/activityList': courseAcList,
    'POST /api/weekRule/scheduleForClassList': accordingVersion,
    'POST /api/weekRule/scheduleForCourseList': courseAcquisition,
    'GET /api/weekRule/delete': ruleToDelete,
    'GET /api/addressRule/classTypeList': classTypeList,
    'GET /api/weekRule/getOne': oneRuleInformation,
    'POST /api/addressRule/classAddressList': courseAddressList,

    //club
    'POST /api/free/pageResult': (req, res) => {
        res.send(clubDataSource);
    },

    //锁定课程
    'GET /api/weekRule/lock': lockUtilLesson,
    'GET /api/weekRule/unlock': unLockUtilLesson,
    'POST /api/weekRule/batchLock': confirmLock,

    //调整课程
    'POST /api/weekRule/batchUpdate': confirmUpdate,

    //调课换课
    'GET /api/scheduleResult/listExchange': canChangeCourse,
    'POST /api/scheduleResult/checkExchange': checkExchange,
    'POST /api/scheduleResult/exchangeDetail': exchangeDetail,
    'POST /api/scheduleResult/exchange': confirmExchange,

    //判断是否是最新发布版本
    'GET /api/weekVersion/lastPublic': lastPublicContent,

    //新建club--获取课程列表
    'GET /api/defaultCoursePlan/club/course': clubCourseList,
    //批量创建club
    'POST /api/free/club/schedule': createClubList,

    //编辑
    'POST /api/scheduleResult/editResult': editSystemCourse,
    'POST /api/free/schedule/update': editFreeCourse,
    'GET /api/free/schedule/relatedAmount': relatedAmount,

    //科目-课程级联
    'GET /api/course/subject/course': courseBySubject,

    //fet进程查询
    'GET /api/weekVersion/fetProgress': fetProgress,
    'GET /api/weekVersion/fetStop': fetStop,
    'POST /api/detail/list/outline': statisticCourse,

    //自由排课--班级下拉展示（行政班、一年级、班级）
    'GET /api/studentGroup/free/gradeByType': getGradeByType,
    //公布课表--查询没有场地的课节
    'POST /api/scheduleResult/publish/check': searchNoAddressResult,
    //人工预排-按节-规则校验
    'POST /api/detail/manualScheduleCheck': manualScheduleCheck,
    //AC自由排课-转为待排
    'GET /api/change/free/ac/arrange': acArrangeSuccess,

    //清空某天的结果统计
    'POST /api/scheduleResult/empty/day/check': scheduleResultNumber,
    //确认清空某天的结果
    'POST /api/scheduleResult/empty/day': confirmDeleteResult,
    //根据场地进行查询
    'POST /api/weekVersion/schedule/playground': fetchAddressResult,

    'GET /api/sts/token': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            accessKeyId: 'STS.NV4TiaAouq52QwWfyGLExVUwK',
            accessSecret: '3H5d1BWVAZHunwhXhNpTUn9V1Z3ZLZ62hf5DrdYDKpaJ',
            bucketName: 'yungu-photo-daily',
            endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
            stsToken:
                'CAIS+wF1q6Ft5B2yfSjIr5WBH9PVrLBUxvfZU1HmgnkSQMpUuZDcqTz2IH9KdHVpA+Adtf8wmGhR7/4ZlqVoRoReREvCKM1565kPNqhgulGZ6aKP9rUhpMCPOwr6UmzWvqL7Z+H+U6muGJOEYEzFkSle2KbzcS7YMXWuLZyOj+wMDL1VJH7aCwBLH9BLPABvhdYHPH/KT5aXPwXtn3DbATgD2GM+qxsms//jnZXGtkGB0QOqmrFOnemrfMj4NfsLFYxkTtK40NZxcqf8yyNK43BIjvwp0vwYoG2X5YrGXAUJukzeaPCs9cZ0aRVwYKQ9HutYq/vxk+3PcEM6NjIHoRqAAXmwsBdR0fEpiTPxSEHNSSNoELCZvnn52pIggH0J7Rx2ux/Q8cfVrVm2TKcAxFYEFtJgoXLpAUMYsLlbTMl7WkMnMwxDjU9FMli+0pBnfwrenJ3xdGFG0Xawf54jw5e6b2LfsNMgf5PK7RAqbpLGSEosg6dgCXJp9PW0kNZxJH7A',
            ossPath: 'learn/list/picture/',
            region: 'oss-cn-hangzhou',
        },
        ifAdmin: false,
    },

    //员工管理
    'GET /api/teaching/listOrgTree': teacherOrgData,
    'POST /api/teaching/listUser': departmentalStaff,
    'GET /api/teaching/getOrgDetail': orgInfoById,
    'GET /api/teaching/getOrgCompletePath': getPathByTreeId,
    'POST /api/teaching/addOrgTreeNode': createOrgSuccess,
    'GET /api/teaching/deleteOrgTreeNode': deleteOrgSuccess,
    'GET /api/teaching/getUsers': addTeacherList,
    'POST /api/teaching/addUserToNode': addStaffSuccess,
    'POST /api/teaching/deletedUserFromNode': deleteStaffSuccess,
    'GET /api/teaching/select/org': fetchOrgDetailSuccess,
    'POST /api/teaching/updateOrgTreeNode': updateOrgTreeNode,
    'POST /api/teaching/setOrgNodeRole': setOrgRoleSuccess,
    'GET /api/getOrgRoleList': getOrgRoleList,
    'GET /api/teaching/listTreeNodeUseTag': getConfigureRoleList,
    'GET /api/teaching/deleteUserForRole': deleteUserForRoleSuccess,
    'GET /api/teaching/deleteOrgNodeRole': deleteOrgNodeRoleSuccess,
    'GET /api/teaching/select/admin/grade': adminGrade,
    'POST /api/teaching/transferUser': transferStaffSuccess,
    'POST /api/teaching/addExternalEmployee': addExternalUser,
    'POST /api/teaching/checkAddExternalEmployee': checkAddExternalEmployee,
    'POST /api/teaching/batchUpdateLeader': batchSetControllerSuccess,
    'GET /api/teaching/userDetail': lookStaffDetail,
    'GET /test/test': dingNodeInfo,
    'POST /api/teaching/updateExternalEmployee': updateExternalEmployee,
    //学生管理
    'GET /api/teaching/student/listOrgTree': studentOrgData,
    'GET /api/teaching/studentStatus/manager/listSuspendStudyOrgTree': listSuspendStudyOrgTree,
    'GET /api/teaching/studentStatus/manager/listGraduationOrgTree': listGraduationOrgTree,
    'POST /api/teaching/student/listUser': studentManagementList,
    'POST /api/teaching/studentStatus/manager/listGraduationStudent': listGraduationStudent,
    'GET /api/teaching/student/grade/class': addStudentFetchGrade,
    'GET /api/teaching/student/added/list': addStudentFetchStudent,
    'GET /api/teaching/student/not/admin/list': notAdminStudentList,
    'GET /api/teaching/select/apply/grade': lookApplyGrade,
    'GET /api/teaching/student/orgRoleUserList': orgRoleStudentList,
    'GET /api/teaching/student/grade/nonAdministrationClass': nonAdministrationClass,

    //根据教师进行查询
    'POST /api/weekVersion/free/teachers': fetchTeacherResult,
    //版本差异对比
    'POST /api/weekVersion/compare/version': compareVersion,
    //适用年级
    'GET /api/weekVersion/version/grade': versionGrade,

    //同步钉人员到教务中心
    'POST /api/teaching/syncEmployee/joinIn': employeeJoinIn,
    //同步组织以及人的关系
    'POST /api/teaching/syncOrg': teacheSyncOrg,
    //同步钉钉离职员工
    'POST /api/teaching/syncEmployee/quit': asyncEmployeeQuit,
    //查看钉钉同步日志
    'GET /api/teaching/record': teachingRecord,
    //获取直线主管列表 、在职员工列表
    'GET /api/teaching/getEmployee': getEmployeeList,
    'GET /api/teaching/student/listSpecialtyTutor': listSpecialtyTutor,
    //机构管理--获取组织树结构
    'GET /api/teaching/listAgencyTree': organizeTreeList,
    //获取学生个人档案详情
    'GET /api/teaching/student/studentProfile': getStudentDetails,
    //获取民族
    'GET /api/teaching/common/allNation': nationList,
    //获取国家
    'GET /api/teaching/common/allCountry': countryData,
    //获取所有年级--学生档案
    'GET /api/teaching/allGrade': gradeData,
    //批量导出学生档案
    'POST /api/teaching/excel/export': exportSourceSuccess,
    //重置学生账号密码
    'GET /api/teaching/userAccount/resetPassword': resetPasswordSuccess,
    //添加学生家长
    'POST /api/teaching/student/addStudentParent': addStudentParentSuccess,
    //编辑学生家长
    'POST /api/teaching/student/updateStudentParent': updateStudentParentSuccess,
    //删除学生家长
    'POST /api/teaching/student/deleteStudentParent': deleteStudentParentSuccess,
    //编辑学生档案
    'POST /api/teaching/student/updateStudentProfile': confirmUpdateStudentProfile,
    //批量修改学生档案
    'POST /api/teaching/excel/import': confirmBatchEditInfo,
    //批量设置学生导师
    'POST /api/teaching/student/batchSetStudentTutor': batchSetTutorSuccess,
    'POST /api/teaching/student/batchSetStudentSpecialtyTutor': batchSetStudentSpecialtyTutor,
    //批量通知
    'POST /api/teaching/parentUpdateStudentInfo/invitation': batchSetStudentNotice,
    //同步学生家长
    'POST /api/sync/family/dingtalk': cogradientParentSuccess,
    //判断权限
    'GET /api/teaching/listUserAclConfig': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: [
            'smart:scheduling:lessonTemplate', //备课模板
            'smart:scheduling:courseManagement', //查看课程管理的课时计划
            'smart:teaching:agency:tree', // 查看机构组织树 /api/teaching/listAgencyTree
            'smart:teaching:org:detail', // 查看组织详情  /api/teaching/getOrgDetail
            'smart:teaching:org:listUser', //  查看组织员工列表  /api/teaching/listUser
            'smart:teaching:user:detail', // 查看员工详情 /api/teaching/userDetail
            'smart:teaching:sync:employee', // 同步员工 /api/teaching/syncEmployee/joinIn
            'smart:teaching:sync:employeeOrg', // 同步员工组织 /api/teaching/syncOrg
            'smart:scheduling:timetable', // 查看课表  /api/weekVersion/schedule

            'smart:teaching:employee:structure:look', //员工管理 组织架构树、人员列表、组织角色列表
            'smart:teaching:employee:structure:edit', //员工管理  新建、编辑、删除组织、设置组织角色
            'smart:teaching:employee:relation:site', //员工管理  从组织移除、转移员工、往组织中添加员工
            'smart:teaching:employee:info:edit', //员工管理  编辑员工、批量设置直线主管
            'smart:teaching:employee:add', //员工管理  新建员工
            'smart:teaching:student:structure:look', //学生管理  组织架构查看
            'smart:teaching:studentInfo:export', // 导出学生信息
            'smart:teaching:student:relation:site', //学生管理  添加学生、转移、批量转移、移除、批量移除
            'smart:teaching:student:info:look', //学生管理  查看学生信息详情
            'smart:teaching:student:info:edit', //学生管理  编辑学生、新建、编辑、删除联系人、批量设置导师、批量导出、批量修改学生

            'smart:teaching:studentInfo:all:operation:manager', //学生管理-全部学生-详情/编辑/导入导出
            'smart:teaching:studentInfo:all:operation:tutor', //学生管理-我作为班主任的学生-详情/编辑/导入导出

            'smart:teaching:dingding:sync:parent', //机构管理  同步学生家长入口
            'smart:external:permission', //外聘教师入口权限
            'smart:scheduling:schedule:manage', // 作息表-管理
            'smart:teaching:student:structure:edit', //学生管理  新建、编辑、删除组织、设置组织角色
            'smart:scheduling:course:manage', // 课程管理
            'smart:teaching:agency:manage', // 机构管理
            'smart:teaching:student:graduation:list',
            'smart:teaching:student:suspend:list',
            'smart:teaching:student:stutas:manage',
            'pay:user:charge:manage',
            'smart:scheduling:courseSelectionSetting', // ---选课设置
            'smart:scheduling:courseSetting', // ---课程设置
            'smart:scheduling:courseSelectionCreate',
            'smart:teacher:worksheet:show', //看板管理权限
        ],
        ifAdmin: false,
        total: null,
    },

    //外聘员工离职
    'GET /api/teaching/quitExternalEmployee': employeeQuitSuccess,
    //获取结班数量
    'GET /api/teaching/student/checkCompleteClass': getEndClassNumber,
    //确认该节点下结班
    'GET /api/teaching/student/completeClass': confirmEndClassSuccess,

    // 账号管理
    // 删除
    'GET /api/delPayAccount': delMsg,
    //商户删除
    'GET /api/business/delPayBusiness': delPayBusiness,

    'GET /api/selectBySchoolIdAllSemester': divisionList,
    'GET /api/divide/planList': CardMsgs,
    'GET /api/allGrade': allGrade,
    'GET /api/course/getDetailById': getDetail,
    'GET /api/divide/student/studentCourseCombinationView': importStudentColunteer, //导入学生选课志愿列表
    'POST /api/divide/studentChooseImport': importStudentExcel, //学生选课志愿excel导入
    'GET /api/divide/student/studentScoreView': importStudentScoreList, //导入学生成绩列表
    'POST /api/divide/student/importDivideStudentScore': importStudentScoreExcel, //学生成绩excel导入
    'GET /api/divideGroup/studentClassList': importStudentClassList, //导入学生班级列表
    'POST /api/divideGroup/importExcelClass': importStudentClassExcel, //班级excel导入
    'POST /api/divide/result/importDivideStudentClassResult': importStudentResultExcel, //学生分班结果excel导入
    'POST /api/divide/studentCombinationImport': studentCombinationImport, //学生分班结果excel导入
    'GET /api/divideGroup/studentResultList': importStudentResultList, //学生分班结果列表
    'GET /api/course/getResult': getResult,
    'POST /api/divide/planCreate': addClasses,
    'GET /api/divide/result/divideResultTeachingClassView': classProgram,
    'POST /api/divideGroup/adjustToAdmin': adjustAdmin,
    'POST /api/divideGroup/adjustToLayer': adjustLayer,
    'GET /api/divideGroup/allClass': allClass,
    'GET /api/divideGroup/allCourse': allCourse,
    'GET /api/divideGroup/getAllAdjustPos': getAllPos,
    'POST /api/divide/result/updateGroup': adjustPos,
    'GET /api/divide/result/divideResultAdminClassScoreView': allGrades,
    'GET /api/divide/result/divideResultAdminClassView': adminClassView,
    'POST /api/divide/result/exportDivideResultAdminClassView': exportDivideResultAdminClassView,
    'POST /api/divide/result/exportDivideResultAdminClassScoreView':
        exportDivideResultAdminClassScoreView,
    'GET /api/divide/result/exportDivideResultTeachingClassView':
        exportDivideResultTeachingClassView,
    'GET /api/divide/result/exportDivideResultStudentView': exportDivideResultStudentView,
    'GET /api/divide/result/divideResultStudentView': divideResultStudentView,
    // 'GET /api/divide/student/studentCourseCombinationView': studentCourseCombinationView,
    'GET /api/divide/result/divideResultCombinationView': divideResultCombinationView,
    'GET /api/divide/result/showCombinationDetail': showCombinationDetail,
    'POST /api/divide/result/updateCombination': updateCombination,
    'GET /api/divide/result/showStuCombinationDetail': choiceSelectList, //编辑选课组合回显-学生视角页面
    'POST /api/divide/result/updateStuCombination': studentConfirm, //选课组合-学生视角确认

    'GET /api/divide/sync/schedule/studentToGroup': confirmSync, //同步教学班分班结果——确定同步
    'POST /api/divide/sync/schedule/automaticScheduleResult': confirmSyncText, //同步课表——确定同步
    'GET /api/divide/sync/schedule/dividePlanDetail': dividePlanDetail, // 分班方案详情
    'POST /api/divide/sync/schedule/weekVersionList': weekVersionList, //课表版本接口
    'POST /api/divide/sync/schedule/saveDividePlanSyncScheduleResult':
        saveDividePlanSyncSchduleResult, //同步课表——保存设置
    'POST /api/divide/studentClassSettingImport': importStudentClassSettingExcel, //学生班级设置excel导入
    'POST /api/divide/editClassPlan': editClassPlan, //编辑分班方案
    'POST /api/divide/result/importDivideStudentClass': importStudentClassSettingExcel, //学生班级设置excel导入
    'GET /api/divide/result/checkDivideResultClass': checkDivideResultClass, //分班结果-教学班视角检查冲突

    // 账户列表
    'GET /api/queryPayAccount': accountList,
    // 余额列表
    'GET /api/pay/wallet/getUserWalletList': balanceList,
    // 余额明细变动列表
    'GET /api/pay/wallet/getUserWalletDetailList': getBalanceList,
    'GET /api/pay/wallet/getScreeningItems': getScreeningItems,
    //商户列表
    'GET /api/business/queryPayBusiness': queryMerchantAccountList,
    // 查询商户和收款渠道
    'GET /api/queryBusiAndChannel': busiAndChannelList,
    'GET /api/business/queryPayBusinessById': queryPayBusinessById,
    // 新建修改
    'POST /api/addOrUpdPayAccount': addOrUpdPayAccount,
    'POST /api/business/addOrUpdateBusiness': addMerChant,
    //支付方式类型判断
    'GET /api/business/querySchoolPayType': paymentMethodJudgment,

    // 收费管理
    'GET /api/delPayChargeItem': payItemDelMsg, // 删除
    'GET /api/queryPayChargeItem': queryPayItemList, // 列表
    'GET /api/queryPayItemCategory': queryPayItemCategory, // 收费项目类型
    'POST /api/addOrUpdPayItemCategory': addOrUpdPayItemCategory, // 新建修改项目类型
    'POST /api/addOrUpdPayChargeItem': addOrUpdPayChargeItem, // 新建修改项目类型
    'GET /api/delPayItemCategory': delPayItemCategory, // 删除收费项目类型
    'POST /api/pay/selectStudentGroup': selectStudentGroup, // 查询学生组件
    'GET /api/pay/selectTeachingOrgStage': selectTeachingOrgStage, // 查询校区学段
    'GET /api/pay/getChargeItem': queryPayChargeItem, // 查询收费项目

    // 缴费管理
    'POST /api/pay/addPayTuitionPlan': addPayTuitionPlan, // 新建缴费通知
    'POST /api/pay/importChargeItem': importChargeItem, // 上传
    'POST /api/pay/selectTuitionPlan': selectTuitionPlan, // 查询缴费通知列表
    'GET /api/pay/updateTuitionPlan': updateTuitionPlan, // 修改通知截至日期
    'GET /download/chargeItem/template': template, // 收费项目下载模版
    'POST /api/pay/selectTuitionPlanDetails': selectTuitionPlanDetails, // 查询单个缴费计划详情
    'POST /api/pay/updateTuitionFee': geteditDetail, //详情页编辑按钮请求
    'GET /api/pay/selectTuitionOrderStatus': selectTuitionOrderStatus, // 查询缴费单详情状态总数
    'POST /api/pay/tuitionOrderDetailsPreview': tuitionOrderDetailsPreview, // 预览
    'POST /api/pay/promptSendTuitionPlan': promptSendTuitionPlan, // 一键催缴
    'POST /api/pay/isPromptSendTuitionPlan': isPromptSendTuitionPlan, // 一键催缴按钮判断以及统计催缴数据
    'GET /api/pay/delTuitionOrder': delTuitionOrder, // 删除缴费订单
    'GET /api/pay/delTuitionPlan': delTuitionPlan, // 删除缴费通知
    'GET /api/pay/sendTuitionPlanCount': sendTuitionPlanCount, // 一键发送缴费通知相关的统计
    'GET /api/pay/sendTuitionPlan': sendTuitionPlan, // 一键发送缴费通知
    'POST /api/addPayCloseOrderInfo': addPayCloseOrderInfo, // 关闭订单
    'GET /api/pay/exportTuitionOrderDetail': exportTuitionOrderDetail, // 导出
    'GET /api/pay/getUpdatePayTuitionPlanDetail': getUpdatePayTuitionPlanDetail, // 编辑
    'POST /api/pay/updatePayTuitionPlan': updatePayTuitionPlan, // 修改缴费计划
    'GET /api/pay/selectTuitionPlanListStatus': selectTuitionPlanListStatus, // 统计缴费通知列表发送状态总数
    'POST /api/upload_file': upload_file, // 关闭表单上传文件
    'GET /api/pay/getAccountOderDetail': getAccountOderDetail, // 账单详情
    'GET /api/payTuition/createStudentTuitionPlan': getStudentTuitionPlan, // 账单详情
    'GET /api/pay/sendPayTuitionToPersonal': getSendPayTuitionToPersonal, //一键催缴
    'GET /api/pay/refundTuitionOrderDone': refundTuitionOrderDone,

    // 家长缴费
    'GET /api/pay/order/billList': billList, // 缴费订单列表
    'GET /course/api/pay/order/billList': billList, // 缴费订单列表
    'GET /api/pay/order/getOrderInfoByOrderId': getOrderInfoByOrderId, // 查询订单缴费详情
    'GET /course/api/pay/order/getOrderInfoByOrderId': getOrderInfoByOrderId, // 查询订单缴费详情
    'GET /api/pay/order/getPayWay': getPayWay, // 查询支付方式
    'GET /course/api/pay/order/getPayWay': getPayWay, // 查询支付方式
    'GET /course/api/pay/wallet/useWalletByDeductionAmount': useBalanceWallet, // 查询支付方式
    'POST /api/pay/order/submitPay': submitPay, // 添加支付订单，支付
    'POST /course/api/pay/order/submitPay': submitPay, // 添加支付订单，支付
    'GET /api/pay/fastPaymentLimit': fastPaymentLimit, // 银行限额
    'POST /api/pay/order/getBankInfo': getBankInfo, // 获取网商银行信息

    // 收支明细&交易流水
    'POST /api/batchOrder/batchOrderQuery': batchOrderQuery, // 账户收入明细查询
    'POST /api/pay/getTransactionsDetail': getTransactionsDetail, // 查询交易流水

    //学科首席列表
    'POST /api/worksheet/subjectChief': subjectChief,
    //学段管理岗位列表
    'GET /api/worksheet/stageRole': disciplineManagement,
    //年级明细
    'POST /api/worksheet/gradeTeacherWorkSheet': gradeDetails,
    //学段列表
    'POST /api/pay/sectionList': sectionList,
    //报表设置
    'GET /api/worksheet/currentSemesterSubject': currentSemesterSubject,
    //保存报表设置
    'POST /api/worksheet/createStageSubject': createStageSubject,
    //回显列表
    'GET /api/worksheet/stageSubject': stageSubject,
    'GET /api/worksheet/personalSubjectTemplate': personSemesterSubject,
    //更新设置
    'POST /api/worksheet/updateStageSubject': updateStageSubject,
    'POST /api/worksheet/changeViewConfig': changeViewConfig,

    //个人工作安排
    'POST /api/worksheet/teacherView': personalArrangements,

    // 上传转学附件
    'POST /api/teaching/excel/uploadFile': importSupplementUrlList,
    // 提交转学信息
    'POST /api/teaching/studentStatus/manager/transfer': submitTransferSchool,
    // 提交休学信息
    'POST /api/teaching/studentStatus/manager/suspendStudy': submitSuspensionSchool,
    //提交放弃信息
    'POST /api/teaching/giveUpStudent': submitGiveUpSchool,
    // 提交调整修改
    'POST /api/teaching/studentStatus/manager/updateSuspendStudy': updateSuspendStudy,
    // 获取休学详细信息
    'GET /api/teaching/studentStatus/manager/suspendStudyInfo': suspendStudyInfo,
    // 提交复学信息
    'POST /api/teaching/studentStatus/manager/recoveryStudy': submitResumptionSchool,
    // 复学记录列表
    'GET /api/teaching/studentStatus/manager/recoveryStudentList': recoveryStudentList,
    // 更新记录列表
    'POST /api/teaching/parentUpdateStudentInfo/recordList': recordList,
    // 提交更新记录列表
    'POST /api/teaching/parentUpdateStudentInfo/updateStudentInfo': subupdateStudentInfo,
    // 主动更新记录列表
    'POST /api/teaching/parentUpdateStudentInfo/parentUpdateStudentInfo': parentUpdateStudentInfo,
    // 设置离校去向
    'POST /api/teaching/studentStatus/manager/updateStudentTransfer': leftSchoolReason,
    // 设置毕业去向
    'POST /api/teaching/studentStatus/manager/importGraduationStudent': graduationDestination,
    // 判断是否可以升年级
    'GET /api/teaching/studentStatus/manager/checkUpgrade': checkUpgrade,
    // 升年级详情
    'GET /api/teaching/studentStatus/manager/upgradeInfo': upgradeInfo,
    // 确认升年级
    'POST /api/teaching/studentStatus/manager/upgrade': confirmUpgrade,
    // 学籍变更记录
    'GET /api/teaching/studentStatus/manager/studentStatusRecord': studentStatusRecord,
    // 预览文件
    'GET /api/teaching/excel/preview_file': previewFile,
    // 下载文件
    'GET /api/teaching/studentStatus/manager/download/template': downloadExcel,
    // 是否能更新
    'GET /api/teaching/parentUpdateStudentInfo/checkStudentInfo': checkStudentInfo,
    // 几个孩子
    'GET /api/teaching/parentUpdateStudentInfo/parentChildList': parentChildList,
    // 学生详情
    'GET /api/teaching/parentUpdateStudentInfo/studentInfo': upDateStudentInfo,
    // 催促更新
    'POST /api/teaching/parentUpdateStudentInfo/urgeParentUpdateStudentInfo': onClickUrged,
    //不更新学生信息
    'POST /api/teaching/parentUpdateStudentInfo/confirmStudentInfo': confirmStudentInfo,
    //判断权限
    'GET /api/pay/listUserAclConfig': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: ['pay:user:charge:manage'],
        ifAdmin: false,
        total: null,
    },
    'GET /api/pay/sendPayTuitionToPersonal': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: '',
        ifAdmin: false,
        total: null,
    },
    //
    'GET /api/teaching/common/allAddress': allAddress,
    // 获取所有校区
    'GET /api/teaching/common/allSchool': schoolList,
    'GET /api/choose/choosePlan/chooseCourseDelete': chooseCourseDelete,

    // 课程管理--课程列表
    'POST /api/course/manager/listCourse': listCourse,
    //kechangguanli
    'POST /api/choose/choosePlan/choosePlanList': choosePlanList,

    'POST /api/choose/choosePlan/addedOrEditChoosePlan': addedOrEditChoosePlan,

    // 课程管理--新建课程
    'POST /api/course/manager/addedCourse': addedCourse,
    // 课程管理--编辑课程
    'POST /api/course/manager/updateCourse': updateCourse,
    // 课程管理--禁用课程
    'POST /api/course/manager/courseEnableAndDisable': courseEnableAndDisable,
    // 课程管理--学科列表--新增学科
    'POST /api/course/manager/addedSubject': addedSubject,
    // 课程管理--学科列表--编辑学科
    'POST /api/course/manager/updateSubject': updateSubject,
    // 课程管理--学科列表--删除学科
    'GET /api/course/manager/deleteSubject': deleteSubject,
    // 课程管理--学科列表--获取课程启用禁用数量
    'GET /api/course/manager/getIsDisableNum': getIsDisableNum,
    // 选课详情
    'GET /api/choose/choosePlan/chooseCourseDetails': chooseCourseDetails,
    // 管理选课课程班级-导入班课计划
    'POST /api/choose/choosePlan/import/coursePlanning': coursePlanning,

    // 选课计划--批次--列表
    'GET /api/choose/batchChooseCoursePlan/chooseCoursePlanBatchList': chooseCoursePlanBatchList,
    'GET /api/goods/newGoodOpenChooseCourse': newGoodOpenChooseCourse,
    'GET /api/goods/goodCloseChooseCourse': goodCloseChooseCourse,
    'GET /api/choose/batchChooseCoursePlan/getCourseSchedule': getCourseSchedule,
    'GET /api/choose/batchChooseCoursePlan/getSchedule': getSchedule,
    'GET /api/choose/batchStudent/listAllChooseCourseGroup': getStudentsByClass,
    // 选课计划--批次--编辑
    'POST /api/choose/batchChooseCoursePlan/addedOrEditChooseCoursePlanBatch':
        addedOrEditChooseCoursePlanBatch,
    // 选课计划--批次--删除
    'POST /api/choose/batchChooseCoursePlan/batchChooseCourseDelete': batchChooseCourseDelete,
    'GET /api/course/selection/syncToScheduleTemplate': syncToScheduleTemplate,

    // 选课学生端
    'GET /api/choose/courseStartPeriod': courseStartPeriod, // 已选课程列表
    'GET /api/choose/subjectList': getChooseSubjectList, // 学科类型列表
    'GET /course/api/goods/subjectList': getChooseSubjectListNew,
    // "POST /api/choose/course/list": studentDetailCourse, // 可选课程列表
    'POST /api/choose/courseList': studentDetailCourse, // 可选课程列表
    'GET /course/api/goods/studentListCourse': studentDetailCourseNew,
    'GET /course/api/goods/getAllCourse': getAllCourseList,
    'POST /course/api/goods/grabSignUp': grabSignUpMobile,
    'POST /api/choose/selectedCoursesList': submittedCourse, // 已选课程列表
    'GET /api/choose/course/schedule': schedule, // 小课表

    'POST /api/selection/result': templateForPc, // 完整课表
    'POST /api/selection/quarter': selectionQuarter, // 查看学生选课结果-时间分段

    'POST /api/choose/studentListCourse': studentListCourse, // 学生端--选课计划列表
    'POST /course/api/choose/studentListCourse': studentListCourse,

    'POST /api/choose/deleteSelectedCourses': deleteSelectedCourses, // 删除已选课程
    'POST /api/choose/submitSelectedCourses': submitSelectedCourse, // 提交已选课程
    'POST /api/choose/cancelAndSignUp': submitResult, // 已选课程删除，报名，取消报名
    'POST /api/choose/studentSideCourseDetails': studentCourseDetails, // 学生端选课计划课程详情
    'GET /api/choose/course/message': courseIntroduction, // 课程介绍
    'GET /api/choose/weekDayList': schoolTime,

    // 课程选课结果详情
    'POST /api/choose/choosePlan/courseResultList': courseResultDetails, // 班级列表
    'POST /api/choose/choosePlan/classStudentList': classStudentList, // 班级学生详情列表
    'POST /api/choose/choosePlan/courseClassDetails': courseClassDetails, // 班级详情
    'POST /api/choose/choosePlan/chooseCourseInfo': chooseCourseBasicInfo, // 基本信息

    // 课程列表
    'GET /api/course/selection/message': selectionMessage, // 课程计划信息
    'GET /api/course/selection/checkCoursePlanAddPermission': checkCoursePlanAddPermission, // 添加课程权限
    'GET /api/course/selection/checkClassPermission': checkClassPermission, // 添加课程权限
    'GET /api/choose/choosePlan/selectGroupingByChoosePlan': selectGroupingByChoosePlan, // 添加课程权限
    'POST /api/course/selection/selectionCourseList': selectionList, // 课程列表
    // "POST /api/course/selection/list": selectionList, // 课程列表
    'POST /api/choose/batchStudent/listBatchStudentInfo': listBatchStudentInfo, // 学生信息列表
    'POST /api/course/selection/deleteCourseChoose': deleteCourseChoose, // 选课计划中移除班课
    'POST /api/course/selection/group/select': groupSelect, // 课程列表-班级详情回显
    'POST /api/course/selection/coursePlanning/editClass': groupUpdate, // 课程列表-班级更新
    'POST /api/course/selection/batchUpdateCourseSignUp': {
        ifLogin: true,
        status: true,
        message: '更新成功',
        code: 0,
        content: null,
        ifAdmin: false,
        total: null,
    },

    // 添加学生--搜索的学生列表
    'POST /api/choose/batchStudent/selectChooseStudentList': selectChooseStudentList,
    'POST /api/courseFee/edit': editCourseFee,

    // 所有班级
    'POST /api/choose/batchStudent/playGradeIdQueryClass': getClassList,

    // 所有学生
    'POST /api/choose/batchStudent/allStudent': allStudent,

    // 添加学生到批次
    'POST /api/choose/batchStudent/addStudent': addStudent,

    // 批次学生批量移除
    'POST /api/choose/batchStudent/studentBatchRemoval': studentBatchRemoval,

    // 开放选课
    'GET /api/choose/batchStudent/openChooseCourse': openChooseCourse,
    'GET /api/goods/openChooseCourse': openChooseCourse,
    'GET /api/goods/newGoodOpenChooseCourse': openChooseCourse,
    // 调整时间
    'POST /api/choose/batchStudent/batchTransferStudent': batchTransferStudent,
    'POST /api/choose/student/sendMessage': sendNoticeForParents,
    'GET /api/choose/getTemplateContent': previewEmail,

    // 学生列表接口--年级接口
    'POST /api/choose/batchStudent/allGrade': allGradeOfAS,

    // 学生列表接口--年级接口
    'GET /api/choose/batchStudent/getGradeAndGroupModelList': allGradeAndGroup,

    // 添加学生到班级--学生展示列表
    'POST /api/choose/batchStudent/studentList': studentListOfClass,

    // 添加学生到班级
    'POST /api/choose/batchStudent/addStudentClass': addStudentClass,

    // 班级下学生管理-学生批量移除
    'POST /api/choose/batchStudent/classStudentsBatchRemoval': classStudentsBatchRemoval,

    // 班级下学生管理-学生转移班级
    'POST /api/choose/batchStudent/studentsClassTransfer': studentsClassTransfer,

    // 学生选课结果管理
    'POST /api/choose/batchStudent/studentCourseResultsManagement': studentCourseResultsManagement,

    // 获取学段列表
    'GET /api/teaching/allStage': allStage,
    'GET /api/gradeAndVersionMappingSchedule': getScheduleList,

    // 班级列表选中与取消选中
    'POST /api/choose/batchStudent/uncheckAndCheck': uncheckAndCheck,

    // 课程报名
    'POST /api/choose/grabSignUp': grabSignUp,

    // 先到先得选课余量接口
    'POST /api/choose/optionalMargin': optionalMargin,
    'POST /course/api/goods/optionalMargin': optionalMarginNe,
    // 按年级给课表排序
    'POST /api/weekVersion/findGradeSchedule': findGradeSchedule,

    // 选课结果生效
    'GET /api/choose/chooseResultManage/chooseResultEffective': chooseResultEffective,

    // 取消开课
    'POST /api/course/selection/cancelCoursePlan': cancelCoursePlan,

    // 编辑版本名称
    'GET /api/weekVersion/updateVersion': editVersion,

    // 排课自定义获取学生list
    'POST /api/weekVersion/findStudent': findStudent,

    // 排课自定义获取班级list
    'POST /api/weekVersion/findGroup': findGroup,

    // 排课自定义获取年级list
    'GET /api/weekVersion/findGrade': findGrade,

    // 自定义教师查询结果
    'POST /api/weekVersion/findTeacherSchedule': findTeacherSchedule,

    // 自定义场地查询结果
    'POST /api/weekVersion/findFieldSchedule': findFieldSchedule,

    // 自定义学生查询结果
    'POST /api/weekVersion/findStudentSchedule': findStudentSchedule,

    // 自定义班级查询结果
    'POST /api/weekVersion/findClassSchedule': findClassSchedule,

    // 可以调换课的有边框
    // 'GET /api/scheduleResult/newListExchange':isBorder,

    // 可移动与不可移动课的颜色
    'GET /api/scheduleResult/mobileListExchange': removableCourse,

    // 新 可选课程结果
    'GET /api/scheduleResult/newListExchange': newCanSelect,

    // 待排课节可选课节列表
    'GET /api/scheduleResult/ac/move/list': newCanScheduleList,

    // 冲突原因卡片
    'POST /api/scheduleResult/conflictInformation': conflictCard,

    // 学段年级接口
    'GET /api/teaching/allStageGrade': allStageGrade,

    // 调换课自动创建版本
    'POST /api/weekVersion/copyLatestVersion': copyLatestVersion,

    // 待排确认换课
    'POST /api/detail/manualSchedule': manualSchedule,

    // 课程班级联动
    'GET /api/weekVersion/groupList': willGroupList,

    // ac缓冲区移动
    'POST /api/detail/updateACToBuffer': updateACToBuffer,

    // 确认创建活动
    'POST /api/free/confirmCreate': confirmCreate,
    // 导入班级课时计划班级列表
    'GET /api/weekCoursePlanning/groupList': exportGroupList,

    // 导入某个课程的课时计划
    'POST /api/weekCoursePlanning/importByCourse': importByCourse,
    // 批量更新同课程是否可重复报名
    'POST /api/course/selection/batchUpdateCourseRepeatApply': sameCourseRepeat,

    'POST /api/download/fet/schedule': (req, res) => {
        res.send({
            code: 0,
            content: {
                versionId: 1,
                userId: 123,
                fileId: 121212,
                fetFileUrl: 'xxxxx',
                fileDownloadUrl: '这是下载链接',
            },
            ifAdmin: false,
            ifLogin: true,
            message: '成功',
            status: true,
        });
    },

    // 作废作息表
    'GET /api/schedule/invalid': invalidInfo,
    // 确认作废
    'GET /api/schedule/invalid/confirm': confirmInvalid,

    // 对比版本
    'GET /api/weekVersion/compare/version': compareVersionList,

    // 确认作废
    'GET /api/weekVersion/compare/version/result/v2': compareVersionResult,

    // 确认作废
    'GET /api/weekVersion/compareVersionTeacherView': compareVersionTeacherList,

    // 增开新班级
    'POST /api/course/selection/coursePlanning/addClass': chooseAddNewClasses,

    // 课表检查结果
    'GET /api/scheduleResult/schedule/check': checkVersionData,

    //未排学生列表
    'GET /api/weekVersion/getGradeStudent': unStudentList,

    //教师关怀
    'GET /api/weekVersion/findTeacherScheduleCount': teacherCareList,

    // 复制排课结果周期列表
    'GET /api/weekVersion/getByRangeTimeWeeklyCurrentVersion': getRangeTimeVersionList,

    // 查询版本公布状态
    'GET /api/scheduleResult/publish/version/type': publishVersionType,
    // 按天复制排课结果
    'POST /api/weekVersion/copyByDayScheduleResult': copyByDayScheduleResult,

    // 系统排课结果的编辑检查老师场地是否冲突
    'POST /api/scheduleResult/checkEditResultSchedule': checkEditResultSchedule,

    //科目课程联动筛选接口
    'POST /api/defaultCoursePlan/subject/course': coursePlanSubject,

    // 开课计划班级筛选
    'POST /api/stratify/allGroup': gradeByCoursePlanning,
    'POST /api/stratify/transfer/groupList': getAllClass,
    'POST /api/studentGroup/coursePlanningGroup': coursePlanningGroup,
    // 获取学期接口
    'GET /api/selectBySchoolIdAllSemester': schoolIdAllSemester,

    // 学年学期列表
    'GET /api/schoolYear/listSchoolYearAndSemester': schoolYearList,

    // 学校下拉
    'GET /api/schoolYear/listSchool': listSchool,

    // 根剧机构获取学校信息
    'GET /api/teaching/common/getSchoolList': couserPlanningSchoolList,

    // 新建学期
    'POST /api/schoolYear/createSemester': createSemester,

    // 历史学期导入--校验学期班级是否符合条件
    'POST /api/defaultCoursePlan/historySemester/checkSemesterClass': checkSemesterClass,

    // 编辑学年
    'POST /api/schoolYear/EditSchoolYear': editSchoolYear,

    // 开启学期
    'GET /api/schoolYear/startSemester': startSemester,

    // 开启学年
    'GET /api/schoolYear/startSchoolYear': startSchoolYear,

    //是否展示初始页
    'GET /api/schoolYear/checkNewYearInit': checkNewYearInit,

    // 升年级配置回显
    'GET /api/schoolYear/upgradeConfiguration': upgradeConfiguration,

    // 确定升年级
    'POST /api/schoolYear/confirmUpgradeConfiguration': upGradeForSure,

    // 从历史学期导入列表
    'POST /api/defaultCoursePlan/historySemester/selectContactCourse': selectContactCourse,

    //按角色部门查老师
    'POST /api/defaultCoursePlan/getByConditionTeacher': getByConditionTeacher,

    // 历史学期导入--保存接口
    'POST /api/defaultCoursePlan/historySemester/saveCoursePlanning': saveCoursePlanning,

    // 学校下拉-学生管理
    'GET /api/schoolYear/listSchool': listSchoolForStudent,

    // 学年下拉-学生管理
    'GET /api/schoolYear/listSchoolYear': listSchoolYearForStudent,

    // 新建学年
    'POST /api/schoolYear/createSchoolYear': createSchoolYear,

    // 根据时间查询学期
    'GET /api/semester/time': getSemesterListByTime,

    // 选课-从Excel导入
    'POST /api/choose/choosePlan/importDefaultCoursePlanning': excelImport,
    'POST /api/choose/choosePlan/updateDefaultCoursePlanning': excelImport,

    //搜索人
    'GET /api/selectPersonName': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: {
            teacherNameList: [
                {
                    name: '张四',
                    id: '2',
                },
                {
                    name: '张紫徽',
                    id: '33',
                },
                {
                    name: '徐泽楷',
                    id: '76',
                },
                {
                    name: '李尚洋',
                    id: '96',
                },
                {
                    name: '王灏羽',
                    id: '122',
                },
            ],
        },
        ifAdmin: false,
    },

    // 课表结果 Excel 导出
    'GET /api/scheduleResult/exportExcelResult': exportExcelResult,

    //从Excel导入排课
    'POST /api/scheduleResult/ImportExcelResult': importExcelresult,

    //获取操作记录列表
    'GET /api/operation/operationRecordList': operationRecordList,

    //撤销操作记录
    'GET /api/operation/revokeOperationRecord': revokeOperationRecord,

    //导入课时计划检查
    'POST /api/defaultCoursePlan/checkExcelImportCoursePlanning': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: true,
            /* checkErrorMessageList: [
        {
          lineNumber: 2,
          errorMessage: `xxx 老师不存在xxx 老师不存在,xxx 老师不存在,xxx 老师不存在\n  xxx 老师不存在,xxx 老师不存在`
        },

        {
          lineNumber: 7,
          errorMessage: "班级 xxx 不存在"
        }
      ] */
            checkErrorMessageList: [],
        },
        ifAdmin: false,
        total: null,
    },
    'POST /api/course/manager/batchUpdateCourse': /* {
        code: 0,
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    } */ {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: true,
            checkErrorMessageList: [
                {
                    lineNumber: 2,
                    errorMessage: `xxx 老师不存在xxx 老师不存在,xxx 老师不存在,xxx 老师不存在\n  xxx 老师不存在,xxx 老师不存在`,
                },

                {
                    lineNumber: 7,
                    errorMessage: '班级 xxx 不存在',
                },
            ],
        },
        ifAdmin: false,
        total: null,
    },

    //导入课时计划
    'POST /api/defaultCoursePlan/excelImportCoursePlanning': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        /* content: {
      successNumber: "200",
      failureNumber: "10",
      checkOrImport: false,
      checkErrorMessageList: [
        {
          lineNumber: 2,
          errorMessage: "xxx 老师不存在"
        },

        {
          lineNumber: 7,
          errorMessage: "班级 xxx 不存在"
        }
      ],
    }, */
        content: null,
        ifAdmin: false,
        total: null,
    },

    //导入老师检查
    'POST /api/role/baseTag/checkExcelImport': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: true,
            /* checkErrorMessageList: [
        {
          lineNumber: 2,
          errorMessage: `xxx 老师不存在xxx 老师不存在,xxx 老师不存在,xxx 老师不存在\n  xxx 老师不存在,xxx 老师不存在`
        },

        {
          lineNumber: 7,
          errorMessage: "班级 xxx 不存在"
        }
      ] */
            checkErrorMessageList: [],
        },
        ifAdmin: false,
        total: null,
    },

    //导入老师
    'POST /api/role/baseTag/excelImport': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        /* content: {
      successNumber: "200",
      failureNumber: "10",
      checkOrImport: false,
      checkErrorMessageList: [
        {
          lineNumber: 2,
          errorMessage: "xxx 老师不存在"
        },

        {
          lineNumber: 7,
          errorMessage: "班级 xxx 不存在"
        }
      ],
    }, */
        content: null,
        ifAdmin: false,
        total: null,
    },

    //导入分层班检查
    'POST /api/stratify/check/stratifiedClass/excel/import': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: true,
            /* checkErrorMessageList: [
        {
          lineNumber: 2,
          errorMessage: `xxx 老师不存在xxx 老师不存在,xxx 老师不存在,xxx 老师不存在\n  xxx 老师不存在,xxx 老师不存在`
        },

        {
          lineNumber: 7,
          errorMessage: "班级 xxx 不存在"
        }
      ] */
            checkErrorMessageList: [],
        },
        ifAdmin: false,
        total: null,
    },

    //导入分层班
    'POST /api/stratify/stratifiedClass/excel/import': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: false,
            /* checkErrorMessageList: [
        {
          lineNumber: 2,
          errorMessage: "xxx 老师不存在"
        },

        {
          lineNumber: 7,
          errorMessage: "班级 xxx 不存在"
        }
      ], */
            checkErrorMessageList: [],
        },
        // content: null,
        ifAdmin: false,
        total: null,
    },

    //导入学生检查
    'POST /api/stratify/checkExcelImportCourseStudentRelation': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: true,
            /* checkErrorMessageList: [
        {
          lineNumber: 2,
          errorMessage: `xxx 老师不存在xxx 老师不存在,xxx 老师不存在,xxx 老师不存在\n  xxx 老师不存在,xxx 老师不存在`
        },

        {
          lineNumber: 7,
          errorMessage: "班级 xxx 不存在"
        }
      ] */
            checkErrorMessageList: [],
        },
        ifAdmin: false,
        total: null,
    },

    //导入学生
    'POST /api/stratify/excel/import': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: false,
            checkErrorMessageList: [
                {
                    lineNumber: 2,
                    errorMessage: 'xxx 老师不存在',
                },

                {
                    lineNumber: 7,
                    errorMessage: '班级 xxx 不存在',
                },
            ],
            /* checkErrorMessageList: [
      ], */
        },
        // content: null,
        ifAdmin: false,
        total: null,
    },

    //查询学生列表
    'POST /api/stratify/student/list': {
        code: 0,
        content: {
            classStudentDTOList: [
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '女',
                    studentEnName: '方915',
                    studentId: 1270,
                    studentIsOutStratifiedClass: false,
                    studentName: '张三李四',
                    studentNumber: '180104020',
                    currentGroupEName: 'four class',
                    currentGroupId: 111,
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '女',
                    studentEnName: '胡634',
                    studentId: 1304,
                    studentIsOutStratifiedClass: false,
                    studentName: '胡634',
                    studentNumber: '180104021',
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '女',
                    studentEnName: '佘573',
                    studentId: 1302,
                    studentIsOutStratifiedClass: false,
                    studentName: '佘573',
                    studentNumber: '180104024',
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '女',
                    studentEnName: '杨970',
                    studentId: 1278,
                    studentIsOutStratifiedClass: false,
                    studentName: '杨970',
                    studentNumber: '180104031',
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '女',
                    studentEnName: '钟41',
                    studentId: 1253,
                    studentIsOutStratifiedClass: false,
                    studentName: '钟41',
                    studentNumber: '180104038',
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '女',
                    studentEnName: '张660',
                    studentId: 1290,
                    studentIsOutStratifiedClass: false,
                    studentName: '张660',
                    studentNumber: '180104034',
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '女',
                    studentEnName: '章712',
                    studentId: 1283,
                    studentIsOutStratifiedClass: false,
                    studentName: '章712',
                    studentNumber: '180104037',
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '男',
                    studentEnName: '邢224',
                    studentId: 1258,
                    studentIsOutStratifiedClass: false,
                    studentName: '邢224',
                    studentNumber: '180104029',
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '男',
                    studentEnName: '姚525',
                    studentId: 1297,
                    studentIsOutStratifiedClass: false,
                    studentName: '姚525',
                    studentNumber: '180104032',
                },
                {
                    adminGroupId: 99,
                    adminGroupName: '四年级（2）班',
                    currentGroupName: '四年级（2）班',
                    joinTime: '2018-08-21',
                    sex: '男',
                    studentEnName: '钱202',
                    studentId: 1284,
                    studentIsOutStratifiedClass: false,
                    studentName: '钱202',
                    studentNumber: '180104023',
                },
            ],
            leaveNumber: 0,
            readingNumber: 20,
            total: 20,
        },
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },

    //根据id获取班级详情
    'GET /api/stratify/groupDetail': {
        code: 0,
        content: {
            associatedGroupList: [
                {
                    absoluteEnName: 'K2C1',
                    absoluteName: '中班1班',
                    deleted: false,
                    eduGroupCompanyId: 1,
                    enName: 'K2C1',
                    grade: -2,
                    groupId: 4352,
                    groupStatus: 2,
                    maxStudent: 0,
                    minStudent: 0,
                    name: '中班1班',
                    relativeEnName: 'C1',
                    relativeName: '1班',
                    schoolId: 1,
                    schoolYearDTO: {
                        current: true,
                        eduGroupCompanyId: 1,
                        ename: 'Year 2023',
                        endTime: 1722441599000,
                        id: 117,
                        name: '2023学年',
                        schoolId: 1,
                        schoolYearEndTime: '2024-07-31 23:59:59',
                        schoolYearId: '2023',
                        schoolYearStartTime: '2023-08-01 00:00:00',
                        startTime: 1690819200000,
                    },
                    schoolYearId: 117,
                    stageNumber: 1,
                    status: 1,
                    studySection: 4,
                    suitGradeIdList: [6],
                    suitGradeList: [
                        {
                            eduGroupCompanyId: 1,
                            enName: 'K2',
                            grade: -1,
                            gradeId: 0,
                            highest: false,
                            id: 6,
                            name: '中班',
                            parentId: 1,
                            schoolId: 1,
                            stage: 1,
                            stageEnum: 'KINDERGARTEN',
                            studyPhase: 'KINDERGARTEN',
                        },
                    ],
                    teachingOrg: {
                        $ref: '$.content.associatedGroupList[0].suitGradeList[0]',
                    },
                    type: 1,
                },
                {
                    absoluteEnName: 'G2C1',
                    absoluteName: '二年级(1)班',
                    deleted: false,
                    eduGroupCompanyId: 1,
                    enName: 'G2C1',
                    grade: 1,
                    groupAbbreviation: '11',
                    groupId: 5522,
                    groupStatus: 2,
                    maxStudent: 0,
                    minStudent: 0,
                    name: '二年级(1)班',
                    relativeEnName: 'G2C1',
                    relativeName: '二年级(1)班',
                    schoolId: 1,
                    schoolYearDTO: {
                        current: true,
                        eduGroupCompanyId: 1,
                        ename: 'Year 2023',
                        endTime: 1722441599000,
                        id: 117,
                        name: '2023学年',
                        schoolId: 1,
                        schoolYearEndTime: '2024-07-31 23:59:59',
                        schoolYearId: '2023',
                        schoolYearStartTime: '2023-08-01 00:00:00',
                        startTime: 1690819200000,
                    },
                    schoolYearId: 117,
                    stageNumber: 2,
                    status: 1,
                    studySection: 1,
                    suitGradeIdList: [9],
                    suitGradeList: [
                        {
                            eduGroupCompanyId: 1,
                            enName: 'G2',
                            grade: 2,
                            gradeId: 0,
                            highest: false,
                            id: 9,
                            name: '二年级',
                            parentId: 2,
                            schoolId: 1,
                            stage: 2,
                            stageEnum: 'PRIMARYSCHOOL',
                            studyPhase: 'PRIMARY',
                        },
                    ],
                    teachingOrg: {
                        $ref: '$.content.associatedGroupList[1].suitGradeList[0]',
                    },
                    type: 1,
                },
                {
                    absoluteEnName: 'G3C7',
                    absoluteName: '三年级（7）班',
                    deleted: false,
                    eduGroupCompanyId: 1,
                    enName: 'G3C7',
                    grade: 1,
                    groupAbbreviation: '234',
                    groupId: 940,
                    groupStatus: 2,
                    maxStudent: 0,
                    minStudent: 0,
                    name: '三年级（7）班',
                    relativeEnName: 'G3C7',
                    relativeName: '三年级（7）班',
                    schoolId: 1,
                    schoolYearDTO: {
                        current: true,
                        eduGroupCompanyId: 1,
                        ename: 'Year 2023',
                        endTime: 1722441599000,
                        id: 117,
                        name: '2023学年',
                        schoolId: 1,
                        schoolYearEndTime: '2024-07-31 23:59:59',
                        schoolYearId: '2023',
                        schoolYearStartTime: '2023-08-01 00:00:00',
                        startTime: 1690819200000,
                    },
                    schoolYearId: 117,
                    stageNumber: 2,
                    status: 1,
                    studySection: 1,
                    suitGradeIdList: [10],
                    suitGradeList: [
                        {
                            eduGroupCompanyId: 1,
                            enName: 'G3',
                            grade: 3,
                            gradeId: 0,
                            highest: false,
                            id: 10,
                            name: '三年级',
                            parentId: 2,
                            schoolId: 1,
                            stage: 2,
                            stageEnum: 'PRIMARYSCHOOL',
                            studyPhase: 'PRIMARY',
                        },
                    ],
                    teachingOrg: {
                        $ref: '$.content.associatedGroupList[2].suitGradeList[0]',
                    },
                    type: 1,
                },
            ],
            groupEnglishName: 'yunguBI -A',
            groupId: 5618,
            groupName: '云谷课程B进阶I A班',
            groupStatus: 2,
            groupStatusDesc: '在读',
            suitAddressList: [
                {
                    cName: 'B108',
                    eName: 'B108',
                    id: 374,
                },
            ],
            suitGradeList: [
                {
                    eduGroupCompanyId: 1,
                    enName: 'G1',
                    grade: 1,
                    gradeId: 0,
                    highest: false,
                    id: 8,
                    name: '一年级',
                    parentId: 2,
                    schoolId: 1,
                    stage: 2,
                    stageEnum: 'PRIMARYSCHOOL',
                    studyPhase: 'PRIMARY',
                },
                {
                    eduGroupCompanyId: 1,
                    enName: 'G2',
                    grade: 2,
                    gradeId: 0,
                    highest: false,
                    id: 9,
                    name: '二年级',
                    parentId: 2,
                    schoolId: 1,
                    stage: 2,
                    stageEnum: 'PRIMARYSCHOOL',
                    studyPhase: 'PRIMARY',
                },
                {
                    eduGroupCompanyId: 1,
                    enName: 'G3',
                    grade: 3,
                    gradeId: 0,
                    highest: false,
                    id: 10,
                    name: '三年级',
                    parentId: 2,
                    schoolId: 1,
                    stage: 2,
                    stageEnum: 'PRIMARYSCHOOL',
                    studyPhase: 'PRIMARY',
                },
            ],
            suitSemester: {
                current: true,
                eduGroupCompanyId: 1,
                ename: 'Semester 1',
                endTime: 1707062399000,
                id: 125,
                name: '第一学期',
                officialSemesterName: '2023-2024学年 第1学期',
                schoolId: 1,
                schoolYearId: 117,
                semesterEndTime: '2024-02-04 23:59:59',
                semesterId: '2023S1',
                semesterStartTime: '2023-08-01 00:00:00',
                startTime: 1690819200000,
            },
            type: 2,
        },
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },

    //导入教师
    'POST /api/teaching/student/simpleImportTeacherList': {
        code: -1,
        content: {
            checkErrorMessageList: [
                {
                    errorMessage: '课程中文名重复!,课程英文名重复!',
                    lineNumber: 1,
                },
            ],
            checkOrImport: false,
            failureNumber: 1,
        },
        ifAdmin: false,
        ifLogin: true,
        message: '失败',
        status: false,
    },

    //导入外聘教师
    'POST /api/teaching/addExternalEmployeeExcel': {
        /* ifLogin: true,
    status: true,
    message: "成功",
    code: 0,
    content: {
      successNumber: "200",
      failureNumber: "10",
      checkOrImport: false,
      checkErrorMessageList: [
        {
          lineNumber: 2,
          errorMessage: "xxx 老师不存在"
        },

        {
          lineNumber: 7,
          errorMessage: "班级 xxx 不存在"
        }
      ],
      // checkErrorMessageList: [],
    },
    // content: null,
    ifAdmin: false,
    total: null, */

        code: 0,
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },

    //获取角色标签列表
    'GET /api/weekRule/roleTag': roleTag,
    //一键冲突
    'GET /api/stratify/system/createCompareGroup': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: null,
        ifAdmin: false,
    },
    //一键冲突
    'POST /api/addressRule/classAddressList': filterGrade,
    'POST /api/addressRule/courseAddressList': filterSubject,
    'GET /api/addressRule/classTypeList': classTypeList,
    'POST /api/addressRule/saveAddressRule': updatedClassInfo,
    'POST /api/weekRule/updatedSubjectInfo': updatedSubjectInfo,
    'POST /api/addressRule/addressRuleExcelImport': ruleImport,

    //批量删除开课计划
    'POST /api/weekCoursePlanning/deleteWeekCoursePlanningByCourseId': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: null,
        ifAdmin: false,
    },

    //获取关联班级
    'POST /api/stratify/associate': {
        code: 0,
        content: [
            {
                absoluteEnName: 'G2C1',
                absoluteName: '二年级（1）班',
                eduGroupCompanyId: 1,
                enName: 'C1',
                groupId: 358,
                groupStatus: 2,
                name: '（1）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [9],
                type: 1,
            },
            {
                absoluteEnName: 'G2C2',
                absoluteName: '二年级（2）班',
                eduGroupCompanyId: 1,
                enName: 'C2',
                groupId: 359,
                groupStatus: 2,
                name: '（2）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [9],
                type: 1,
            },
            {
                absoluteEnName: 'G2C3',
                absoluteName: '二年级（3）班',
                eduGroupCompanyId: 1,
                enName: 'C3',
                groupId: 360,
                groupStatus: 2,
                name: '（3）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [9],
                type: 1,
            },
            {
                absoluteEnName: 'G2C4',
                absoluteName: '二年级（4）班',
                eduGroupCompanyId: 1,
                enName: 'C4',
                groupId: 362,
                groupStatus: 2,
                name: '（4）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [9],
                type: 1,
            },
            {
                absoluteEnName: 'G3C1',
                absoluteName: '三年级（1）班',
                eduGroupCompanyId: 1,
                enName: 'C1',
                groupId: 196,
                groupStatus: 2,
                name: '（1）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [10],
                type: 1,
            },
            {
                absoluteEnName: 'G3C2',
                absoluteName: '三年级（2）班',
                eduGroupCompanyId: 1,
                enName: 'C2',
                groupId: 197,
                groupStatus: 2,
                name: '（2）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [10],
                type: 1,
            },
            {
                absoluteEnName: 'G3C4',
                absoluteName: '三年级（4）班',
                eduGroupCompanyId: 1,
                enName: 'C4',
                groupId: 357,
                groupStatus: 2,
                name: '（4）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [10],
                type: 1,
            },
            {
                absoluteEnName: 'G4C1',
                absoluteName: '四年级（1）班',
                eduGroupCompanyId: 1,
                enName: 'C1',
                groupId: 97,
                groupStatus: 2,
                name: '（1）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [11],
                type: 1,
            },
            {
                absoluteEnName: 'G4C2',
                absoluteName: '四年级（2）班',
                eduGroupCompanyId: 1,
                enName: 'C2',
                groupId: 99,
                groupStatus: 2,
                name: '（2）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [11],
                type: 1,
            },
            {
                absoluteEnName: 'G4C3',
                absoluteName: '四年级（3）班',
                eduGroupCompanyId: 1,
                enName: 'C3',
                groupId: 100,
                groupStatus: 2,
                name: '（3）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [11],
                type: 1,
            },
            {
                absoluteEnName: 'G4C4',
                absoluteName: '四年级（4）班',
                eduGroupCompanyId: 1,
                enName: 'C4',
                groupId: 361,
                groupStatus: 2,
                name: '（4）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [11],
                type: 1,
            },
            {
                absoluteEnName: 'G5C2',
                absoluteName: '五年级（2）班',
                eduGroupCompanyId: 1,
                enName: 'C2',
                groupId: 80,
                groupStatus: 2,
                name: '（2）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [12],
                type: 1,
            },
            {
                absoluteEnName: 'G5C3',
                absoluteName: '五年级（3）班',
                eduGroupCompanyId: 1,
                enName: 'C3',
                groupId: 81,
                groupStatus: 2,
                name: '（3）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [12],
                type: 1,
            },
            {
                absoluteEnName: 'G5C4',
                absoluteName: '五年级（4）班',
                eduGroupCompanyId: 1,
                enName: 'C4',
                groupId: 355,
                groupStatus: 2,
                name: '（4）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [12],
                type: 1,
            },
            {
                absoluteEnName: 'G6 C1',
                absoluteName: '六年级（1）班',
                eduGroupCompanyId: 1,
                enName: ' C1',
                groupId: 356,
                groupStatus: 2,
                name: '（1）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [13],
                type: 1,
            },
            {
                absoluteEnName: 'ZT G3C2',
                absoluteName: '转塘 三年级（2）班',
                eduGroupCompanyId: 1,
                enName: 'ZT G3 C2',
                groupId: 198,
                groupStatus: 2,
                name: '转塘 三年级（2）班',
                schoolId: 1,
                schoolYearId: 5,
                status: 0,
                studySection: 0,
                suitGradeIdList: [10],
                type: 1,
            },
        ],
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },

    //批量转待排
    'POST /api/scheduleResult/update/batchArrange': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: null,
        ifAdmin: false,
    },

    //换课
    'POST /api/weekCoursePlanning/changeWeekTeachingPlanGroup': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: null,
        ifAdmin: false,
    },

    //一键冲突
    'POST /api/uploadFetResult': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: null,
        ifAdmin: false,
    },

    // 导入排课结果
    'POST /api/import/courseScheduleImport': courseScheduleImport,

    //导入场地
    'POST /api/address/import': {
        ifLogin: true,
        status: true,
        message: '导入成功',
        code: 11,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: false,
            checkErrorMessageList: [
                {
                    lineNumber: 2,
                    errorMessage: 'xxx 老师不存在',
                },

                {
                    lineNumber: 7,
                    errorMessage: '班级 xxx 不存在',
                },
            ],
            // checkErrorMessageList: [],
        },
        // content: null,
        ifAdmin: false,
    },

    //转移成功
    'POST /api/stratify/transfer/student': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: null,
        ifAdmin: false,
    },

    //移除成功
    'POST /api/stratify/remove/student': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: null,
        ifAdmin: false,
    },

    //导出课时计划
    'GET /api/defaultCoursePlan/exportCoursePlanning': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: null,
        ifAdmin: false,
    },
    //导出课时计划
    'GET /api/defaultCoursePlan/getLinkCourse': {
        ifLogin: true,
        status: true,
        content: [
            {
                id: 1,
                courseName: '语文G1',
            },
            {
                id: 2,
                courseName: '语文G2',
            },
            {
                id: 3,
                courseName: '语文G3',
            },
            {
                id: 4,
                courseName: '语文G4',
            },
            {
                id: 5,
                courseName: '语文G5',
            },
        ],
        message: '切换成功！',
        code: 11,
        ifAdmin: false,
    },

    'GET /api/course/selection/setCurrent': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: null,
        ifAdmin: false,
    },
    'GET /api/course/selection/syncToSchedule': {
        code: -1,
        content: [
            /* '开课计划:CCA-编程积木（L1L2）在课表版本:小学课表初始版本未找到相应年级作息!',
            '开课计划:CCA-编程积木（L1L2）在课表版本:小学课表初始版本未找到相应年级作息!',
            '开课计划:CCA-谷粒工程师G1G2（L1L2）在课表版本:小学课表初始版本未找到相应年级作息!',
            '开课计划:CCA-谷粒工程师G1G2（L1L2）在课表版本:小学课表初始版本未找到相应年级作息!',
            '开课计划:魔方世界G1G2在课表版本:小学课表初始版本未找到相应年级作息!',
            '开课计划:CCA-谷粒工程师G1G2（L1L2）在课表版本:小学课表初始版本未找到相应年级作息!',
            '开课计划:CCA-五感打开新世界(L1)在课表版本:小学课表初始版本未找到相应年级作息!', */
        ],
        ifAdmin: false,
        ifLogin: true,
        message: '失败',
        status: false,
    },

    'POST /api/courseFee/showDetail': showDetail,

    'POST /api/courseFee/import': {
        code: -1,
        content: {
            checkErrorMessageList: [
                {
                    errorMessage:
                        '课程(魔方世界G1G21111)不存在,课程(魔方世界G1G21111)对应的开课计划不存在,课程(魔方世界G1G21111)班级(魔方世界G1G2 H班)对应的班课关系不存在',
                    lineNumber: 2,
                },
            ],
            checkOrImport: false,
            failureNumber: 1,
        },
        ifAdmin: false,
        ifLogin: true,
        message: '失败',
        status: false,
    },
    // 具体范围
    'GET /acl/api/getClassOrGradeByParamType': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: [
            {
                id: 1,
                name: '幼儿园 幼儿园幼儿园幼儿园',
                eName: 'kindergarten',
            },
            {
                id: 2,
                name: '小学',
                eName: 'primary school',
            },
            {
                id: 3,
                name: '初中',
                eName: 'junior high school',
            },
            {
                id: 4,
                name: '托班',
                eName: 'PreK',
            },
            {
                id: 5,
                name: '小班',
                eName: 'K1',
            },
            {
                id: 6,
                name: '中班',
                eName: 'K2',
            },
            {
                id: 7,
                name: '大班',
                eName: 'K3',
            },
            {
                id: 8,
                name: '一年级',
                eName: 'G1',
            },
            {
                id: 9,
                name: '二年级',
                eName: 'G2',
            },
            {
                id: 10,
                name: '三年级',
                eName: 'G3',
            },
            {
                id: 11,
                name: '四年级',
                eName: 'G4',
            },
            {
                id: 12,
                name: '五年级',
                eName: 'G5',
            },
            {
                id: 13,
                name: '六年级',
                eName: 'G6',
            },
            {
                id: 14,
                name: '七年级',
                eName: 'G7',
            },
            {
                id: 15,
                name: '八年级',
                eName: 'G8',
            },
            {
                id: 16,
                name: '九年级',
                eName: 'G9',
            },
        ],
        ifAdmin: false,
    },
    // 选择范围
    'GET /acl/api/selectRuleByPermissionId': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: [
            {
                id: 4,
                ruleName: '幼儿园所有',
                ruleCode: 'kindergarten:person',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 5,
                ruleName: '中小学所有',
                ruleCode: 'middle:primary:school:person',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 6,
                ruleName: '所导的学生(普通导师)',
                ruleCode: 'my:student:person',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 7,
                ruleName: '白名单',
                ruleCode: 'white:student',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 19,
                ruleName: '一年级一班',
                ruleCode: 'grade:one:class:one:student',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 20,
                ruleName: '一年级二班',
                ruleCode: 'grade:one:class:two:student',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 21,
                ruleName: '一年级三班',
                ruleCode: 'grade:one:class:three:student',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 22,
                ruleName: '二年级一班',
                ruleCode: 'grade:two:class:one:student',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 23,
                ruleName: '班级学生',
                ruleCode: 'class:student',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
            {
                id: 24,
                ruleName: '年级学生',
                ruleCode: 'grade:student',
                eName: null,
                ruleType: 0,
                ifReversed: 0,
                dataType: 1,
                remark: null,
                paramType: 1,
            },
        ],
        ifAdmin: false,
    },
    // 权限点规则删除
    'POST /acl/api/deletePermissionPackageRuleRelation': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: 'SUCCESS_CODE',
            ifAdmin: true,
        });
    },
    // 编辑权限点删除     配置权限点-完成（编辑保存 ）
    'POST /acl/api/updatePermissionPackageRuleRelation': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: 'SUCCESS_CODE',
            ifAdmin: true,
        });
    },
    'POST /acl/api/insertPackage': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: {
                roleId: 1116,
                appCode: null,
                appName: null,
                roleName: '1024测试创建权限包',
                roleDesc: '',
                type: 1,
                typeStr: null,
                eName: 'test',
                deleted: null,
                remarks: null,
                createTime: null,
                modifyTime: null,
                eduGroupCompanyId: 1,
                schoolId: 1,
            },
            ifAdmin: true,
        });
    },
    'POST /acl/api/insertPackage': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: 'SUCCESS_CODE',
            ifAdmin: true,
        });
    },
    'POST /api/teaching/delRolePermissionRelations': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: {
                totalNum: 1,
                successNum: 1,
                failNum: 0,
                failName: [],
            },
            ifAdmin: true,
        });
    },
    'POST /api/teaching/insertSysRolePermission': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: null,
            ifAdmin: true,
        });
    },
    'POST /api/teaching/batchAccountPackage': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: null,
            ifAdmin: true,
        });
    },
    // 权限点列表搜索/ 配置权限点/ 设置权限点规则
    'POST /acl/api/getPermissionListById': (req, res) => {
        res.send(
            // {
            //     "ifLogin": false,
            //     "status": true,
            //     "message": "成功",
            //     "code": 0,
            //     "content": [
            //         {
            //             "sysPermissionId": 32,
            //             "roleId": 1103,
            //             "appCode": "6",
            //             "appName": "学生主页",
            //             "roleName": "临时权限包202307181119053Zk0uA8F",
            //             "englishName": "",
            //             "permissionName": "学生主页-档案馆-违规-新增/修改/删除",
            //             "permissionCode": "studentProfile:violation:record:updateViolationRecord",
            //             "typeStr": "功能权限和数据权限",
            //             "type": 3,
            //             "permissionStatusStr": "生效",
            //             "eName": null,
            //             "haveRules": true,
            //             "remark": "-1",
            //             "ruleAndParameterModels": null,
            //             "rolePackageRelations": null,
            //             "accountCount": null,
            //             "paramDesc": null
            //         }
            //     ],
            //     "ifAdmin": true
            // }
            {
                ifLogin: false,
                status: true,
                message: '成功',
                code: 0,
                content: {
                    pageSize: 10,
                    pageNum: 1,
                    total: 18,
                    data: [
                        {
                            sysPermissionId: 32,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-档案馆-违规-新增/修改/删除',
                            permissionCode: 'studentProfile:violation:record:updateViolationRecord',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: '-1',
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 35,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-档案馆-违规-查看',
                            permissionCode: 'studentProfile:violation:record:list',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: '-1',
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 37,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-档案馆-基础信息-附件资料-修改',
                            permissionCode: 'studentProfile:updateUserFileClassificationInfo',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: '-1',
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 31,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-档案馆-荣誉-查看',
                            permissionCode: 'studentProfile:honor:record:list',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: '-1',
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 28,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-档案馆-荣誉-新增/修改/删除',
                            permissionCode: 'studentProfile:honor:record:updateHonorRecord',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: '-1',
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 25,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-记录-查询热词',
                            permissionCode: 'studentProfile:record:searchHotword',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: null,
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 27,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-成长画像-列表',
                            permissionCode: 'studentProfile:evaluation_plan:list',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: '-1',
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 21,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-档案馆-基础信息-家庭信息查看',
                            permissionCode: 'studentProfile:basicInfo:familyInfo',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: null,
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 22,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-档案馆-基础信息-附件资料查看',
                            permissionCode: 'studentProfile:basicInfo:attachmentView',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: null,
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                        {
                            sysPermissionId: 20,
                            roleId: 1103,
                            appCode: '6',
                            appName: '学生主页',
                            roleName: '临时权限包202307181119053Zk0uA8F',
                            englishName: '',
                            permissionName: '学生主页-档案馆-基础信息-个人档案查看',
                            permissionCode: 'studentProfile:basicInfo:personalArchive',
                            typeStr: '功能权限和数据权限',
                            type: 3,
                            permissionStatusStr: '生效',
                            eName: null,
                            haveRules: true,
                            remark: null,
                            ruleAndParameterModels: null,
                            rolePackageRelations: null,
                            accountCount: null,
                            paramDesc: null,
                        },
                    ],
                },
                ifAdmin: true,
            }
        );
    },
    // 配置权限点-完成（编辑保存 ） 新结构
    'POST /acl/api/updatePermissionPackageRuleRelationNew': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: 'SUCCESS_CODE',
            ifAdmin: true,
        });
    },
    'GET /acl/api/listGradeGroup': listGradeGroup,
    // 配置权限点-完成（编辑保存 ） 新结构
    'POST /acl/api/updatePermissionPackageRuleRelationNew': (req, res) => {
        res.send({
            ifLogin: false,
            status: true,
            message: '成功',
            code: 0,
            content: 'SUCCESS_CODE',
            ifAdmin: true,
        });
    },
    'GET /acl/api/listGradeGroup': listGradeGroup,
    'POST /api/teacher/external/listExternalUser': getTableData,
    'POST /api/teacher/external/option/batchQuitExternalEmployee': batchQuitExternalEmployee,
    'POST /api/teacher/external/approveExternalInfo': approveExternalInfo,
    'POST /api/teacher/external/updateApproveExternalInfo': updateApproveExternalInfo,
    'POST /api/teacher/external/submitExternalInfo': submitExternalInfo,
    'GET /api/teacher/external/option/deletedExternalEmployee': deletedExternalEmployee,
    'GET /api/teacher/external/getExternalDetailInfo': getExternalDetailInfo,
    'GET /api/teacher/external/option/reinstatementExternalEmployee': reinstatementExternalEmployee,
    'GET /api/teacher/external/getApproveExternalDetailInfo': getApproveExternalDetailInfo,
    'POST /api/address/batchUpdateField': {
        code: -1,
        content: {
            // checkErrorMessageList: [
            //     {
            //         errorMessage:
            //             '课程(魔方世界G1G21111)不存在,课程(魔方世界G1G21111)对应的开课计划不存在,课程(魔方世界G1G21111)班级(魔方世界G1G2 H班)对应的班课关系不存在',
            //         lineNumber: 2,
            //     },
            // ],
            // checkOrImport: false,
            // failureNumber: 1,
        },
        ifAdmin: false,
        ifLogin: true,
        message: '失败',
        status: false,
    },

    'GET /api/defaultCoursePlan/getCourseDetail': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: {
            cTitle: '初中2021学年第2学期选修课选课纳新',
            eTitle: 'ansfjkasnfjcksafnkanvc akfbjanc',
            semester: '2021学年第一学期',
            schoolArea: '云谷校区',
            stage: '初中',
            peroid: '2022-02-15 至 2022-05-30',
            application: '2022-02-15 至 2022-05-30',
            declareSet: '已开启 前序选课计划:2021S2小学课后服务--CCA报名',
            introStyle: '固定板式',
            feeShow: '不展示课时费，展示材料费',
            classTime: '周一 周二 周三 周五',
            classStage: '16:45-17:45',
            seleceRule: '志愿填报',
            manager: '张三丰，李明',
            feeManage: '谷雨',
            publish: '无',
            stuAddress:
                '选课PC端直达链接：https://smart-scheduling.yungu.org/?hash=course/student/list#/course/student/list',
        },
        ifAdmin: false,
    },

    //选课导出课程
    'GET /api/course/selection/chooseExportCourse': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: null,
        ifAdmin: false,
    },

    //开放/关闭选课
    'GET /api/course/selection/toggleSelCourse': {
        ifLogin: true,
        status: true,
        message: '切换成功！',
        code: 11,
        content: null,
        ifAdmin: false,
    },

    'GET /api/course/selection/getFeeData': {
        ifLogin: true,
        status: true,
        content: {},
        code: 11,
        content: null,
        ifAdmin: false,
    },

    'GET /api/course/selection/getCatagory': {
        ifLogin: true,
        status: true,
        content: {
            allCatagory: [
                {
                    id: '1',
                    name: '语文分层班',
                },
                {
                    id: '2',
                    name: '体育行政班',
                },
            ],
        },
        code: 0,
        ifAdmin: false,
    },
    // 'GET /api/course/selection/getAllCourse': {
    'GET /api/course/manager/listCourse': {
        ifLogin: true,
        status: true,
        content: [
            {
                id: 1,
                name: 'CCA-创玩科学G3',
            },
            {
                id: 2,
                name: 'CCA-创玩科学G4',
            },
            {
                id: 3,
                name: 'CCA-创玩科学G5',
            },
            {
                id: 4,
                name: 'CCA-创玩科学G6',
            },
            {
                id: 5,
                name: 'CCA-创玩科学G7',
            },
        ],
        code: 0,
        ifAdmin: false,
    },
    /* 'POST /api/course/selection/addCoursePlan': {
        ifLogin: true,
        status: true,
        content: '添加成功',
        code: 0,
        ifAdmin: false,
    }, */
    'GET /api/course/selection/addCoursePlan': {
        ifLogin: true,
        status: false,
        content: '添加失败',
        code: 0,
        ifAdmin: false,
    },

    //初始化课程上传
    'POST /api/init/initializeCourseId': {
        ifLogin: true,
        status: true,
        code: 0,
        content: null,
        ifAdmin: false,
    },
    'GET /api/listAllOrgTeachers': listAllOrgTeachers,
    'GET /course/api/listAllTeachersWithDept': listAllTeachersWithDept,
    'GET /api/address/management/addressList': addressList,

    //导入场地
    'POST /api/init/divideGroup': {
        ifLogin: true,
        status: true,
        message: '导入成功',
        code: 11,
        content: {
            successNumber: '200',
            failureNumber: '10',
            checkOrImport: false,
            checkErrorMessageList: [
                {
                    lineNumber: 2,
                    errorMessage: 'xxx 老师不存在',
                },

                {
                    lineNumber: 7,
                    errorMessage: '班级 xxx 不存在',
                },
            ],
            // checkErrorMessageList: [],
        },
        // content: null,
        ifAdmin: false,
    },

    'POST /api/address/insert': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: null,
        ifAdmin: false,
    },
    'POST /api/address/update': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: null,
        ifAdmin: false,
    },

    'POST /api/school/getSchool/all/module': {
        code: 0,
        content: [
            {
                schoolConfigModuleGroupVOList: [
                    {
                        configModuleGroupName: '基础数据',
                        getConfigModuleGroupCode: 'CourseSetting',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 5,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'SUBJECT_MANAGEMENT',
                                moduleDesc: '学科管理',
                                moduleEnName: 'Subject Management',
                                moduleGroupCode: 'CourseSetting',
                                moduleGroupEnName: 'Course Setting',
                                moduleGroupName: '基础数据',
                                moduleName: '学科管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 6,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'COURSE_MANAGEMENT',
                                moduleDesc: '课程管理',
                                moduleEnName: 'Course Management',
                                moduleGroupCode: 'CourseSetting',
                                moduleGroupEnName: 'Course Setting',
                                moduleGroupName: '基础数据',
                                moduleName: '课程管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 7,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'CHOISE_MANAGEMENT',
                                moduleDesc: '选课管理',
                                moduleEnName: 'ChoiseCourse Management',
                                moduleGroupCode: 'CourseSetting',
                                moduleGroupEnName: 'Course Setting',
                                moduleGroupName: '基础数据',
                                moduleName: '选课管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 8,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'DOMAIN_MANAGEMENT',
                                moduleDesc: '领域管理',
                                moduleEnName: 'Domain Management',
                                moduleGroupCode: 'CourseSetting',
                                moduleGroupEnName: 'Course Setting',
                                moduleGroupName: '基础数据',
                                moduleName: '领域管理',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '课表管理',
                        getConfigModuleGroupCode: 'TimetableSetting',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 14,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'TIMETABLE_MANAGEMENT',
                                moduleDesc: '课表管理',
                                moduleEnName: 'Timetable Management',
                                moduleGroupCode: 'TimetableSetting',
                                moduleGroupEnName: 'Timetable Setting',
                                moduleGroupName: '课表管理',
                                moduleName: '课表管理',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '教师管理',
                        getConfigModuleGroupCode: 'TeacherSetting',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 9,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'TEACHER_MANAGEMENT',
                                moduleDesc: '教师管理',
                                moduleEnName: 'Teacher Management',
                                moduleGroupCode: 'TeacherSetting',
                                moduleGroupEnName: 'Teacher Setting',
                                moduleGroupName: '教师管理',
                                moduleName: '教师管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 10,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'TEACHER_RECORD',
                                moduleDesc: '教师档案',
                                moduleEnName: 'Teacher Record',
                                moduleGroupCode: 'TeacherSetting',
                                moduleGroupEnName: 'Teacher Setting',
                                moduleGroupName: '教师管理',
                                moduleName: '教师档案',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '基础数据',
                        getConfigModuleGroupCode: 'BaseSetting',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 1,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'ORG_MANAGEMENT',
                                moduleDesc: '机构管理',
                                moduleEnName: 'Org Management',
                                moduleGroupCode: 'BaseSetting',
                                moduleGroupEnName: 'Basic Setting',
                                moduleGroupName: '基础数据',
                                moduleName: '机构管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 2,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'PLACEMENT_MANAGEMENT',
                                moduleDesc: '场地管理',
                                moduleEnName: 'Placement Management',
                                moduleGroupCode: 'BaseSetting',
                                moduleGroupEnName: 'Basic Setting',
                                moduleGroupName: '基础数据',
                                moduleName: '场地管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 3,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'SCHOOL_YEAR_MANAGEMENT',
                                moduleDesc: '学年管理',
                                moduleEnName: 'SchoolYear Management',
                                moduleGroupCode: 'BaseSetting',
                                moduleGroupEnName: 'Basic Setting',
                                moduleGroupName: '基础数据',
                                moduleName: '学年管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 4,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'ROLE_MANAGEMENT',
                                moduleDesc: '角色管理',
                                moduleEnName: 'Role Management',
                                moduleGroupCode: 'BaseSetting',
                                moduleGroupEnName: 'Basic Setting',
                                moduleGroupName: '基础数据',
                                moduleName: '角色管理',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '缴费管理',
                        getConfigModuleGroupCode: 'FeeSetting',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 15,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'CHARGE_ITEM_MANAGEMENT',
                                moduleDesc: 'ChargeItemManament',
                                moduleEnName: 'Charge Item Management',
                                moduleGroupCode: 'FeeSetting',
                                moduleGroupEnName: 'Fee Setting',
                                moduleGroupName: '缴费管理',
                                moduleName: '缴费项管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 16,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'MERCHANT_MANAGEMENT',
                                moduleDesc: '商户管理',
                                moduleEnName: 'Merchant Management',
                                moduleGroupCode: 'FeeSetting',
                                moduleGroupEnName: 'Fee Setting',
                                moduleGroupName: '缴费管理',
                                moduleName: '商户管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 17,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'FEE_LIST',
                                moduleDesc: '缴费通知',
                                moduleEnName: 'Fee List',
                                moduleGroupCode: 'FeeSetting',
                                moduleGroupEnName: 'Fee Setting',
                                moduleGroupName: '缴费管理',
                                moduleName: '缴费通知管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 18,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'CHECK',
                                moduleDesc: '缴费对账',
                                moduleEnName: 'Check',
                                moduleGroupCode: 'FeeSetting',
                                moduleGroupEnName: 'Fee Setting',
                                moduleGroupName: '缴费管理',
                                moduleName: '对账',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '学生管理',
                        getConfigModuleGroupCode: 'StudentSetting',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 11,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'STUDENT_MANAGEMENT',
                                moduleDesc: '学生管理',
                                moduleEnName: 'Student Management',
                                moduleGroupCode: 'StudentSetting',
                                moduleGroupEnName: 'Student Setting',
                                moduleGroupName: '学生管理',
                                moduleName: '学生管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 12,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'OFFSTUDENT_MANAGEMENT',
                                moduleDesc: '休学管理',
                                moduleEnName: 'OffStudent Management',
                                moduleGroupCode: 'StudentSetting',
                                moduleGroupEnName: 'Student Setting',
                                moduleGroupName: '学生管理',
                                moduleName: '休学管理',
                            },
                            {
                                createTime: '2022-08-07 12:00:00',
                                deleted: false,
                                id: 13,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-07 12:00:00',
                                moduleBiggroupName: '配置中心',
                                moduleCode: 'STUDENT_PROFILE',
                                moduleDesc: '学生主页管理',
                                moduleEnName: 'Student Profile',
                                moduleGroupCode: 'StudentSetting',
                                moduleGroupEnName: 'Student Setting',
                                moduleGroupName: '学生管理',
                                moduleName: '学生主页',
                            },
                        ],
                    },
                ],
                sysGroupName: '配置中心',
            },
            {
                schoolConfigModuleGroupVOList: [
                    {
                        configModuleGroupName: '云端课程',
                        getConfigModuleGroupCode: 'CLOUD_COURSES',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 24,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '5',
                                moduleDesc: '在线备课',
                                moduleEnName: 'Online Lesson',
                                moduleGroupCode: 'CLOUD_COURSES',
                                moduleGroupEnName: 'Cloud Courses',
                                moduleGroupName: '云端课程',
                                moduleName: '在线备课',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 25,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '6',
                                moduleDesc: '画板',
                                moduleEnName: 'Draw Board',
                                moduleGroupCode: 'CLOUD_COURSES',
                                moduleGroupEnName: 'Cloud Courses',
                                moduleGroupName: '云端课程',
                                moduleName: '画板',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 26,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '7',
                                moduleDesc: '作业',
                                moduleEnName: 'Homework',
                                moduleGroupCode: 'CLOUD_COURSES',
                                moduleGroupEnName: 'Cloud Courses',
                                moduleGroupName: '云端课程',
                                moduleName: '作业',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '智能硬件',
                        getConfigModuleGroupCode: 'Learning_Products',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2023-11-10 10:12:27',
                                deleted: false,
                                id: 121,
                                modifierName: '胡尊利',
                                modifyTime: '2023-11-10 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'LearningProducts_Wristband',
                                moduleDesc: '佩戴手环',
                                moduleEnName: 'Wristband',
                                moduleGroupCode: 'Learning_Products',
                                moduleGroupEnName: 'LearningProducts',
                                moduleGroupName: '智能硬件',
                                moduleName: '手环',
                            },
                            {
                                createTime: '2023-11-10 10:12:27',
                                deleted: false,
                                id: 122,
                                modifierName: '胡尊利',
                                modifyTime: '2023-11-10 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'LearningProducts_SmartCamera',
                                moduleDesc: '智能抓拍仪器',
                                moduleEnName: 'SmartCamera',
                                moduleGroupCode: 'Learning_Products',
                                moduleGroupEnName: 'LearningProducts',
                                moduleGroupName: '智能硬件',
                                moduleName: '智能抓拍仪',
                            },
                            {
                                createTime: '2023-11-10 10:12:27',
                                deleted: false,
                                id: 123,
                                modifierName: '胡尊利',
                                modifyTime: '2023-11-10 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'LearningProducts_HeightWeightMeter',
                                moduleDesc: '测量学生身高体重',
                                moduleEnName: 'HeightWeightMeter',
                                moduleGroupCode: 'Learning_Products',
                                moduleGroupEnName: 'LearningProducts',
                                moduleGroupName: '智能硬件',
                                moduleName: '身高体重仪',
                            },
                            {
                                createTime: '2023-11-10 10:12:27',
                                deleted: false,
                                id: 124,
                                modifierName: '胡尊利',
                                modifyTime: '2023-11-10 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'LearningProducts_SmartFrontalTemperatureGun',
                                moduleDesc: '额头测温',
                                moduleEnName: 'SmartFrontalTemperatureGun',
                                moduleGroupCode: 'Learning_Products',
                                moduleGroupEnName: 'LearningProducts',
                                moduleGroupName: '智能硬件',
                                moduleName: '智能额温枪',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '校务平台',
                        getConfigModuleGroupCode: 'SCHOOL_AFFAIRS_PLATFORM',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 34,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '15',
                                moduleDesc: '考勤',
                                moduleEnName: 'Official Website',
                                moduleGroupCode: 'SCHOOL_AFFAIRS_PLATFORM',
                                moduleGroupEnName: 'School Affairs Platform',
                                moduleGroupName: '校务平台',
                                moduleName: '考勤',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 35,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '16',
                                moduleDesc: '招生',
                                moduleEnName: 'Recurit Student',
                                moduleGroupCode: 'SCHOOL_AFFAIRS_PLATFORM',
                                moduleGroupEnName: 'School Affairs Platform',
                                moduleGroupName: '校务平台',
                                moduleName: '招生',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 36,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '17',
                                moduleDesc: '缴费',
                                moduleEnName: 'Pay Cost',
                                moduleGroupCode: 'SCHOOL_AFFAIRS_PLATFORM',
                                moduleGroupEnName: 'School Affairs Platform',
                                moduleGroupName: '校务平台',
                                moduleName: '缴费',
                            },
                            {
                                createTime: '2023-06-14 10:18:14',
                                deleted: false,
                                id: 113,
                                modifierName: '胡尊利',
                                modifyTime: '2023-06-14 10:18:14',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'HEALTH',
                                moduleDesc: '大健康',
                                moduleEnName: 'health',
                                moduleGroupCode: 'SCHOOL_AFFAIRS_PLATFORM',
                                moduleGroupEnName: 'School Affairs Platform',
                                moduleGroupName: '校务平台',
                                moduleName: '大健康',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '在线备课权限配置',
                        getConfigModuleGroupCode: 'OnlineLessonPreparationPermissionConfiguration',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 115,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'Public_With_Groupcompany',
                                moduleDesc: '集团内公开',
                                moduleEnName: 'Public With Groupcompany',
                                moduleGroupCode: 'OnlineLessonPreparationPermissionConfiguration',
                                moduleGroupEnName:
                                    'Online lesson preparation permission configuration',
                                moduleGroupName: '在线备课权限配置',
                                moduleName: '集团内公开',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 116,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'Public_With_School',
                                moduleDesc: '校内公开',
                                moduleEnName: 'Public With School',
                                moduleGroupCode: 'OnlineLessonPreparationPermissionConfiguration',
                                moduleGroupEnName:
                                    'Online lesson preparation permission configuration',
                                moduleGroupName: '在线备课权限配置',
                                moduleName: '校内公开',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 117,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'Public_With_Stage',
                                moduleDesc: '学段内公开',
                                moduleEnName: 'Public With Stage',
                                moduleGroupCode: 'OnlineLessonPreparationPermissionConfiguration',
                                moduleGroupEnName:
                                    'Online lesson preparation permission configuration',
                                moduleGroupName: '在线备课权限配置',
                                moduleName: '学段内公开',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 118,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'Public_Within_SchoolAndSubject',
                                moduleDesc: '校内学科公开',
                                moduleEnName: 'Public With SchoolAndSubject',
                                moduleGroupCode: 'OnlineLessonPreparationPermissionConfiguration',
                                moduleGroupEnName:
                                    'Online lesson preparation permission configuration',
                                moduleGroupName: '在线备课权限配置',
                                moduleName: '校内学科公开',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 119,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'Public_With_StageAndSubject',
                                moduleDesc: ' 学段内学科公开',
                                moduleEnName: 'Public With StageAndSubject',
                                moduleGroupCode: 'OnlineLessonPreparationPermissionConfiguration',
                                moduleGroupEnName:
                                    'Online lesson preparation permission configuration',
                                moduleGroupName: '在线备课权限配置',
                                moduleName: '学段内学科公开',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 120,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'Public_With_Course',
                                moduleDesc: '备课组（课程级别）公开',
                                moduleEnName: 'Public With Course',
                                moduleGroupCode: 'OnlineLessonPreparationPermissionConfiguration',
                                moduleGroupEnName:
                                    'Online lesson preparation permission configuration',
                                moduleGroupName: '在线备课权限配置',
                                moduleName: '备课组（课程级别）公开',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '精准教学',
                        getConfigModuleGroupCode: 'PRECISION_TEACHING',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 20,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '1',
                                moduleDesc: '测验系统',
                                moduleEnName: 'Accurate Teaching',
                                moduleGroupCode: 'PRECISION_TEACHING',
                                moduleGroupEnName: 'Precision Teaching',
                                moduleGroupName: '精准教学',
                                moduleName: '测验系统',
                            },
                            {
                                createTime: '2023-07-05 14:47:15',
                                deleted: false,
                                id: 114,
                                modifierName: '胡尊利',
                                modifyTime: '2023-07-05 14:47:15',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'XueKeWang',
                                moduleDesc: '学科网',
                                moduleEnName: 'xk.com',
                                moduleGroupCode: 'PRECISION_TEACHING',
                                moduleGroupEnName: 'Precision Teaching',
                                moduleGroupName: '精准教学',
                                moduleName: '学科网',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '多元评价',
                        getConfigModuleGroupCode: 'MULTIPLE_EVALUATION',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 27,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '8',
                                moduleDesc: '成长目标',
                                moduleEnName: 'Growth Target',
                                moduleGroupCode: 'MULTIPLE_EVALUATION',
                                moduleGroupEnName: 'Multiple Evaluation',
                                moduleGroupName: '多元评价',
                                moduleName: '成长目标',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 28,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '9',
                                moduleDesc: '行为记录',
                                moduleEnName: 'Behavior Record',
                                moduleGroupCode: 'MULTIPLE_EVALUATION',
                                moduleGroupEnName: 'Multiple Evaluation',
                                moduleGroupName: '多元评价',
                                moduleName: '行为记录',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 29,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '10',
                                moduleDesc: '过程评价',
                                moduleEnName: 'Evaluation',
                                moduleGroupCode: 'MULTIPLE_EVALUATION',
                                moduleGroupEnName: 'Multiple Evaluation',
                                moduleGroupName: '多元评价',
                                moduleName: '过程评价',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 30,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '11',
                                moduleDesc: '成长画像',
                                moduleEnName: 'Growth Portrait',
                                moduleGroupCode: 'MULTIPLE_EVALUATION',
                                moduleGroupEnName: 'Multiple Evaluation',
                                moduleGroupName: '多元评价',
                                moduleName: '成长画像',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '家校共育',
                        getConfigModuleGroupCode: 'HOME_SCHOOL_EDUCATION',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 21,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '2',
                                moduleDesc: '成长记录',
                                moduleEnName: 'Portfolio',
                                moduleGroupCode: 'HOME_SCHOOL_EDUCATION',
                                moduleGroupEnName: 'Home-School Education',
                                moduleGroupName: '家校共育',
                                moduleName: '成长记录',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 22,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '3',
                                moduleDesc: '校园相册',
                                moduleEnName: 'Photo',
                                moduleGroupCode: 'HOME_SCHOOL_EDUCATION',
                                moduleGroupEnName: 'Home-School Education',
                                moduleGroupName: '家校共育',
                                moduleName: '校园相册',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 23,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '4',
                                moduleDesc: '学生主页',
                                moduleEnName: 'Student Page',
                                moduleGroupCode: 'HOME_SCHOOL_EDUCATION',
                                moduleGroupEnName: 'Home-School Education',
                                moduleGroupName: '家校共育',
                                moduleName: '学生主页',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '教务模块',
                        getConfigModuleGroupCode: 'ACADEMIC_AFFAIRS_MODULE',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 31,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '12',
                                moduleDesc: '选课',
                                moduleEnName: 'Course Selection',
                                moduleGroupCode: 'ACADEMIC_AFFAIRS_MODULE',
                                moduleGroupEnName: 'Academic Affairs Module',
                                moduleGroupName: '教务模块',
                                moduleName: '选课',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 32,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '13',
                                moduleDesc: '排课',
                                moduleEnName: 'Course Scheduling',
                                moduleGroupCode: 'ACADEMIC_AFFAIRS_MODULE',
                                moduleGroupEnName: 'Academic Affairs Module',
                                moduleGroupName: '教务模块',
                                moduleName: '排课',
                            },
                            {
                                createTime: '2022-08-11 10:12:27',
                                deleted: false,
                                id: 33,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: '14',
                                moduleDesc: '日程',
                                moduleEnName: 'Schedule',
                                moduleGroupCode: 'ACADEMIC_AFFAIRS_MODULE',
                                moduleGroupEnName: 'Academic Affairs Module',
                                moduleGroupName: '教务模块',
                                moduleName: '日程',
                            },
                        ],
                    },
                    {
                        configModuleGroupName: '教育大脑',
                        getConfigModuleGroupCode: 'EduBrain',
                        metaDataConfigModuleDOList: [
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 100,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_SchoolStatus',
                                moduleDesc: '学校当天的动态变化数据',
                                moduleEnName: 'School Status',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '学校动态',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 101,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_TeacherOverview',
                                moduleDesc: '老师的统计概况',
                                moduleEnName: 'Teacher Overview',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '教师概况',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 102,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_TaskOverview',
                                moduleDesc: '作业情况',
                                moduleEnName: 'Task Overview',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '教学常规',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 103,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_ParentClass',
                                moduleDesc: '家长的学习情况',
                                moduleEnName: 'Parent Class',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '家长学堂',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 104,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_SchoolResources',
                                moduleDesc: '学校的校本资源建设情况',
                                moduleEnName: 'School Resources',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '校本资源',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 105,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_ReadingOverview',
                                moduleDesc: 'Reading Overview',
                                moduleEnName: 'School Resources',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '阅读画像',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 108,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_Literacy growth',
                                moduleDesc: '素养成长',
                                moduleEnName: 'Literacy Growth',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '素养成长',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 109,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_HonorAwards',
                                moduleDesc: '学生的荣誉及获奖情况',
                                moduleEnName: 'HonorAwards',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '荣誉活动',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 110,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_HealthFitness',
                                moduleDesc: '健康体能',
                                moduleEnName: 'Health Fitness',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '健康体能',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 111,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_RecruitStudent',
                                moduleDesc: '招生活动情况',
                                moduleEnName: 'Recruit Student',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '招生进展',
                            },
                            {
                                createTime: '2023-05-06 10:12:27',
                                deleted: false,
                                id: 112,
                                modifierName: '胡尊利',
                                modifyTime: '2022-08-11 10:12:27',
                                moduleBiggroupName: '学校采购的模块',
                                moduleCode: 'EduBrain_PartyBuildingActivities',
                                moduleDesc: '党建活动情况',
                                moduleEnName: 'PartyBuildingActivities',
                                moduleGroupCode: 'EduBrain',
                                moduleGroupEnName: 'Edu Brain',
                                moduleGroupName: '教育大脑',
                                moduleName: '党建活动',
                            },
                        ],
                    },
                ],
                sysGroupName: '学校采购的模块',
            },
        ],
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },
    'POST /api/school/getSchool/all/config': {
        code: 0,
        content: [
            {
                categoryName: '精准教学',
                purchaseModuleModelList: [
                    {
                        category: '精准教学',
                        code: 1,
                        name: '测验系统',
                    },
                ],
            },
            {
                categoryName: '校务平台',
                purchaseModuleModelList: [
                    {
                        category: '校务平台',
                        code: 15,
                        name: '考勤',
                    },
                    {
                        category: '校务平台',
                        code: 16,
                        name: '招生',
                    },
                    {
                        category: '校务平台',
                        code: 17,
                        name: '缴费',
                    },
                ],
            },
            {
                categoryName: '教务模块',
                purchaseModuleModelList: [
                    {
                        category: '教务模块',
                        code: 12,
                        name: '选课',
                    },
                    {
                        category: '教务模块',
                        code: 13,
                        name: '排课',
                    },
                    {
                        category: '教务模块',
                        code: 14,
                        name: '日程',
                    },
                ],
            },
            {
                categoryName: '家校共育',
                purchaseModuleModelList: [
                    {
                        category: '家校共育',
                        code: 2,
                        name: '成长记录',
                    },
                    {
                        category: '家校共育',
                        code: 3,
                        name: '校园相册',
                    },
                    {
                        category: '家校共育',
                        code: 4,
                        name: '学生主页',
                    },
                ],
            },
            {
                categoryName: '云端课程',
                purchaseModuleModelList: [
                    {
                        category: '云端课程',
                        code: 5,
                        name: '在线备课',
                    },
                    {
                        category: '云端课程',
                        code: 6,
                        name: '画板',
                    },
                    {
                        category: '云端课程',
                        code: 7,
                        name: '作业',
                    },
                ],
            },
            {
                categoryName: '多元评价',
                purchaseModuleModelList: [
                    {
                        category: '多元评价',
                        code: 8,
                        name: '成长目标',
                    },
                    {
                        category: '多元评价',
                        code: 9,
                        name: '行为记录',
                    },
                    {
                        category: '多元评价',
                        code: 10,
                        name: '过程评价',
                    },
                    {
                        category: '多元评价',
                        code: 11,
                        name: '成长画像',
                    },
                ],
            },
        ],
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },

    'GET /api/school/getList': {
        code: 0,
        content: [
            {
                domainName: '',
                headUserName: '黄樱',
                headUserPhone: '15005815152',
                openStageNameList: ['幼儿园', '小学', '初中', '高中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '画板',
                    '作业',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolEnName: 'Hangzhou Yungu School',
                schoolId: 1,
                schoolName: '杭州云谷学校',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'XIHU XUESHU School',
                schoolId: 2,
                schoolName: '西湖学术小学',
            },
            {
                domainName: 'wisdomeg.yungu.org',
                headUserName: '吕老师',
                headUserPhone: '15005815152',
                openStageNameList: ['幼儿园', '小学', '初中', '高中'],
                purchaseModuleList: [
                    '成长记录',
                    '在线备课',
                    '行为记录',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                ],
                registerPhone: '15005815152',
                registerUserName: '吕强',
                schoolEnName: 'MSB',
                schoolId: 1000001000,
                schoolName: '北京蒙台梭利国际学校 MSB',
            },
            {
                domainName: 'wisdomeg.yungu.org',
                headUserName: '吕强',
                headUserPhone: '15005815152',
                openStageNameList: ['幼儿园', '小学', '初中', '高中'],
                purchaseModuleList: ['成长记录', '在线备课', '选课', '日程', '考勤', '缴费'],
                registerPhone: '15005815152',
                registerUserName: '吕强',
                schoolEnName: 'NIME',
                schoolId: 1000001001,
                schoolName: '蒙台梭利教育分院',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '画板',
                    '作业',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                ],
                schoolEnName: 'XUE JUN',
                schoolId: 3300002000,
                schoolName: '杭州学军小学',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'XUE JUN Yanxue',
                schoolId: 3300002001,
                schoolName: '杭州学军研学',
            },
            {
                domainName: 'xuejun.yungu.org',
                headUserName: '张啸林',
                headUserPhone: '15005815152',
                openStageNameList: ['小学'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '在线备课',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolEnName: 'Qiuzhi Dist',
                schoolId: 3300002002,
                schoolName: '杭州学军小学_求智校区',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'Qiuzhi Dist',
                schoolId: 3300002003,
                schoolName: '杭州学军小学_求智',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'Zijingang',
                schoolId: 3300002004,
                schoolName: '杭州学军小学_紫金港校区',
            },
            {
                domainName: 'aliedu.yungu.org',
                headUserName: '阿里教育',
                headUserPhone: '1234567890',
                openStageNameList: ['幼儿园', '小学'],
                purchaseModuleList: ['选课', '排课', '日程'],
                registerPhone: '1234567890',
                registerUserName: '阿里教育',
                schoolEnName: 'Aliyun Edu Demo',
                schoolId: 3300002005,
                schoolName: '阿里教育学校',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'AliEduSchool2',
                schoolId: 3300002006,
                schoolName: '阿里教育学校2',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'Xixi Campus',
                schoolId: 3300002008,
                schoolName: '西溪校区',
            },
            {
                domainName: 'piagetacademy.yungu.org',
                headUserName: '洪校长',
                headUserPhone: '15005815152',
                openStageNameList: ['小学', '初中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '在线备课',
                    '成长目标',
                    '选课',
                    '考勤',
                ],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolEnName: 'NJS',
                schoolId: 3300002009,
                schoolName: 'Jakarta School',
            },
            {
                domainName: 'piagetacademy',
                headUserName: '洪校长',
                headUserPhone: '15005815152',
                openStageNameList: ['小学', '初中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '在线备课',
                    '成长目标',
                    '选课',
                    '考勤',
                ],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolId: 3300002010,
                schoolName: '学校',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'testCampus',
                schoolId: 3300002011,
                schoolName: '测试小区',
            },
            {
                domainName: 'test.yungu.org',
                headUserName: '胡尊利',
                headUserPhone: '15005815152',
                openStageNameList: ['幼儿园', '小学', '初中', '高中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '画板',
                    '作业',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolEnName: 'Yungu Future School',
                schoolId: 3300002012,
                schoolName: '云谷教育科技-测试环境',
            },
            {
                domainName: 'huaai.yungu.org',
                headUserName: '马一鸣',
                headUserPhone: '15005815152',
                openStageNameList: ['幼儿园', '小学', '初中', '高中'],
                purchaseModuleList: [
                    '成长记录',
                    '在线备课',
                    '画板',
                    '过程评价',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolEnName: 'HUA AI SCHOOL',
                schoolId: 3300002014,
                schoolName: '华爱学校小学',
            },
            {
                domainName: 'wems.yungu.org',
                headUserName: '黄慧',
                headUserPhone: '15005815152',
                openStageNameList: ['初中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '陈胜',
                schoolEnName: '温州实验中学本部',
                schoolId: 3300002016,
                schoolName: '温州实验中学本部',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'FutureYunguSchool_Chendou',
                schoolId: 3300002017,
                schoolName: '云谷未来学校_成都分校',
            },
            {
                domainName: 'jinghui.yungu.org',
                headUserName: '姜彦',
                headUserPhone: '15906633778',
                openStageNameList: ['小学'],
                purchaseModuleList: ['在线备课', '画板', '作业'],
                registerPhone: '15906633778',
                registerUserName: '杭州市嘉绿苑小学-景汇校区',
                schoolEnName: 'JiaLvYuan School',
                schoolId: 3300002018,
                schoolName: '杭州市嘉绿苑小学-景汇校区',
            },
            {
                domainName: 'demo.yungu.org',
                headUserName: '胡尊利',
                headUserPhone: '15005815152',
                openStageNameList: ['小学', '初中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '画板',
                    '作业',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolEnName: 'WiseSchoolDemo',
                schoolId: 3300002019,
                schoolName: '智慧校园Demo版',
            },
            {
                domainName: 'wenhua.yungu.org',
                headUserName: '郭宪勇',
                headUserPhone: '15005815152',
                openStageNameList: ['小学', '初中', '高中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '在线备课',
                    '画板',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '丁磊',
                schoolEnName: 'WenHua Primary School',
                schoolId: 3300002020,
                schoolName: '潍坊文华小学',
            },
            {
                domainName: 'k-demo.yungu.org',
                headUserName: '胡尊利',
                headUserPhone: '15005815152',
                openStageNameList: ['幼儿园'],
                purchaseModuleList: ['校园相册', '在线备课', '成长画像', '选课', '排课', '日程'],
                registerPhone: '15005815152',
                registerUserName: '智慧幼儿园Demo版',
                schoolEnName: 'Yungu Kindergarten',
                schoolId: 3300002021,
                schoolName: '云谷未来幼儿园',
            },
            {
                domainName: 'wems-fudong.yungu.org',
                headUserName: '陈胜',
                headUserPhone: '15005815152',
                openStageNameList: ['初中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '作业',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '陈胜',
                schoolEnName: 'WenshiSchool',
                schoolId: 3300002022,
                schoolName: '温实府东',
            },
            {
                domainName: 'test.yungu.org',
                headUserName: '胡尊利',
                headUserPhone: '15005815152',
                openStageNameList: ['小学', '初中', '高中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '在线备课',
                    '画板',
                    '作业',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolEnName: 'FutureWeekR&Study',
                schoolId: 3300002024,
                schoolName: '云谷未来研学',
            },
            {
                domainName: 'zdqzjy.yungu.org',
                headUserName: '郑潇',
                headUserPhone: '13505714135',
                openStageNameList: ['幼儿园'],
                purchaseModuleList: [
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '画板',
                    '行为记录',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '郑潇',
                schoolEnName: 'Qizhen',
                schoolId: 3300002025,
                schoolName: '启桢教育',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'Qizhen ba Kindergarten',
                schoolId: 3300002026,
                schoolName: '巴巴幼儿园',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'Qizhen BaiMa Kindergarten',
                schoolId: 3300002027,
                schoolName: '白马幼儿园',
            },
            {
                domainName: 'lcyhfccs.yungu.org',
                headUserName: '莫校长',
                headUserPhone: '15005815152',
                openStageNameList: ['小学', '初中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '画板',
                    '作业',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '李听涛',
                schoolEnName: 'Fei Cui Cheng School',
                schoolId: 3300002028,
                schoolName: '杭州绿城育华翡翠城学校',
            },
            {
                domainName: 'mtc-model.yungu.org',
                headUserName: '王成毅',
                headUserPhone: '15005815152',
                openStageNameList: ['高中'],
                purchaseModuleList: ['在线备课', '过程评价', '成长画像'],
                registerPhone: '15005815152',
                registerUserName: '胡尊利',
                schoolEnName: 'MTC-Model High School',
                schoolId: 3300002029,
                schoolName: 'MTC示范高中',
            },
            {
                domainName: 'bssn.yungu.org',
                headUserName: '柳老师',
                headUserPhone: '15005815152',
                openStageNameList: ['幼儿园', '小学', '初中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '学生主页',
                    '在线备课',
                    '画板',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '选课',
                    '排课',
                    '日程',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '柳老师',
                schoolEnName: 'BONA SONARITY SCHOOL',
                schoolId: 3300002030,
                schoolName: '南京博颂学校',
            },
            {
                domainName: 'bashucct.yungu.org',
                headUserName: '廖伟',
                headUserPhone: '15005815152',
                openStageNameList: ['幼儿园', '小学', '初中', '高中'],
                purchaseModuleList: [
                    '测验系统',
                    '成长记录',
                    '校园相册',
                    '在线备课',
                    '画板',
                    '作业',
                    '成长目标',
                    '行为记录',
                    '过程评价',
                    '成长画像',
                    '考勤',
                    '招生',
                    '缴费',
                ],
                registerPhone: '15005815152',
                registerUserName: '廖伟校长',
                schoolEnName: 'BASHU SECONDARY SCHOOL',
                schoolId: 3300002031,
                schoolName: '重庆巴蜀常春藤中学',
            },
            {
                openStageNameList: [],
                purchaseModuleList: [],
                schoolEnName: 'wang',
                schoolId: 3300002032,
                schoolName: 'wang',
            },
        ],
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },

    'GET /api/school/getInformationById':
        //  {
        //     code: 0,
        //     content: {
        //         areaId: 370701,
        //         ccaIcon:
        //             'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1669629409431_文化.png',
        //         chatGPTAmount: 0,
        //         chatGPTList: [
        //             {
        //                 createTime: '2023-05-04 14:42:30',
        //                 deleted: 0,
        //                 enable: 0,
        //                 id: 89,
        //                 identityType: 1,
        //                 modelCode: 'Drawing',
        //                 modifyTime: '2023-11-01 10:01:47',
        //                 schoolId: 3300002020,
        //             },
        //             {
        //                 createTime: '2023-05-04 14:42:30',
        //                 deleted: 0,
        //                 enable: 0,
        //                 id: 90,
        //                 identityType: 2,
        //                 modelCode: 'Drawing',
        //                 modifyTime: '2023-11-01 10:01:47',
        //                 schoolId: 3300002020,
        //             },
        //             {
        //                 createTime: '2023-05-04 14:42:30',
        //                 deleted: 0,
        //                 enable: 0,
        //                 id: 87,
        //                 identityType: 1,
        //                 modelCode: 'PrepareLessons',
        //                 modifyTime: '2023-11-01 10:01:47',
        //                 schoolId: 3300002020,
        //             },
        //             {
        //                 createTime: '2023-05-04 14:42:30',
        //                 deleted: 0,
        //                 enable: 0,
        //                 id: 88,
        //                 identityType: 2,
        //                 modelCode: 'PrepareLessons',
        //                 modifyTime: '2023-11-01 10:01:47',
        //                 schoolId: 3300002020,
        //             },
        //         ],
        //         cityId: 370700,
        //         configCenterList: [
        //             'SUBJECT_MANAGEMENT',
        //             'COURSE_MANAGEMENT',
        //             'CHOISE_MANAGEMENT',
        //             'DOMAIN_MANAGEMENT',
        //             'TIMETABLE_MANAGEMENT',
        //             'TEACHER_MANAGEMENT',
        //             'TEACHER_RECORD',
        //             'ORG_MANAGEMENT',
        //             'PLACEMENT_MANAGEMENT',
        //             'SCHOOL_YEAR_MANAGEMENT',
        //             'ROLE_MANAGEMENT',
        //             'CHARGE_ITEM_MANAGEMENT',
        //             'MERCHANT_MANAGEMENT',
        //             'FEE_LIST',
        //             'CHECK',
        //             'STUDENT_MANAGEMENT',
        //             'OFFSTUDENT_MANAGEMENT',
        //             'STUDENT_PROFILE',
        //         ],
        //         domainName: 'wenhua.yungu.org',
        //         eduBrainSlideSetting:
        //             '{2:["EduBrain_SchoolStatus","EduBrain_TeacherOverview","EduBrain_SchoolResources","EduBrain_PartyBuildingActivities","EduBrain_HonorAwards","EduBrain_HealthFitness"]}',
        //         externalSchool: false,
        //         externalSchoolId: 1000001001,
        //         favicon:
        //             'https://yungu-photo-daily.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1661328529763_DSC020871.jpg',
        //         headUserName: '李欣',
        //         headUserPhone: '13758930838',
        //         headUserPosition: '校长',
        //         informTypeList: ['INFORM_SHORT_MESSAGE', 'INFORM_WE_CHAT'],
        //         loginBackground:
        //             'https://yungu-public.oss-accelerate.aliyuncs.com/config/Resources/login/loginBackgroundYG.jpg',
        //         loginEnTitle: '111',
        //         loginLogo:
        //             'https://yungu-public.oss-accelerate.aliyuncs.com/config/Resources/login/loginLogoYG.png',
        //         loginTitle: '111',
        //         logoUrl:
        //             'https://yungu-public.oss-accelerate.aliyuncs.com/config/Resources/login/loginLogoYG.png',
        //         openStageList: '1,2,3,4',
        //         lateSettingList: [
        //             {
        //                 stage: 1,
        //                 gradeList: [-3],
        //                 time: '10:00',
        //             },
        //             {
        //                 stage: 1,
        //                 gradeList: [-1],
        //                 time: '11:00',
        //             },
        //             {
        //                 stage: 2,
        //                 gradeList: [1],
        //                 time: '11:00',
        //             },
        //             {
        //                 stage: 2,
        //                 gradeList: [3],
        //                 time: '11:50',
        //             },
        //             {
        //                 stage: 3,
        //                 gradeList: [7],
        //                 time: '10:02',
        //             },
        //             {
        //                 stage: 4,
        //                 gradeList: [11],
        //                 time: '11:30',
        //             },
        //         ],
        //         passwordRule: 'last6IdentityCard',
        //         payTypeList: ['PAY_ALIPAY', 'PAY_WE_CHAT'],
        //         privateBucketName: 'yungu-task-file',
        //         privateBucketNameAmount: 1,
        //         provinceId: 330000,
        //         publicBucketName: 'yungu-photo-daily',
        //         publicBucketNameAmount: 1,
        //         purchaseModuleList: '1,15,16,17,5,6,7,8,9,EduBrain_HonorAwards,EduBrain_ParentClass',
        //         registerPhone: '13758930838',
        //         registerQQ: '12345',
        //         registerSchoolEnName: 'Hangzhou Yungu School',
        //         registerSchoolName: '杭州云谷学校',
        //         registerUserName: '李欣',
        //         schoolId: 1,
        //         schoolWebEnTitle: '网站title',
        //         schoolWebTitle: '网站title',
        //         stageList: '1,2,3,4',
        //         studentGroupNum: 1,
        //         style: '1234',
        //         teacherNum: 12,
        //         workBackPic:
        //             'https://yungu-record-public2.oss-cn-hangzhou.aliyuncs.com/yungu-record/image_file/6910da0a-9b61-40d0-86c3-f9a3f4121b3f.png',
        //         workSchoolShortEName: 'yungu1',
        //         workSchoolShortName: '云谷1',
        //         faceSettingList: [
        //             {
        //                 gradeList: [
        //                     {
        //                         endTime: '2023-10-14 00:43:16',
        //                         grade: -3,
        //                         gradeName: '托班',
        //                         openFlag: true,
        //                         parentsAddContactsFlag: false,
        //                         startTime: '2023-09-06 00:43:16',
        //                     },
        //                     {
        //                         endTime: '2023-10-10 00:43:16',
        //                         grade: -2,
        //                         gradeName: '小班',
        //                         openFlag: true,
        //                         parentsAddContactsFlag: false,
        //                         startTime: '2023-09-05 00:43:16',
        //                     },
        //                     {
        //                         grade: -1,
        //                         gradeName: '中班',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 0,
        //                         gradeName: '大班',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                 ],
        //                 stage: 1,
        //                 stageName: '幼儿园',
        //             },
        //             {
        //                 gradeList: [
        //                     {
        //                         endTime: '2023-10-05 00:43:16',
        //                         grade: 1,
        //                         gradeName: '一年级',
        //                         openFlag: true,
        //                         parentsAddContactsFlag: true,
        //                         startTime: '2023-09-01 00:43:16',
        //                     },
        //                     {
        //                         grade: 2,
        //                         gradeName: '二年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 3,
        //                         gradeName: '三年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 4,
        //                         gradeName: '四年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 5,
        //                         gradeName: '五年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 6,
        //                         gradeName: '六年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                 ],
        //                 stage: 2,
        //                 stageName: '小学',
        //             },
        //             {
        //                 gradeList: [
        //                     {
        //                         grade: 7,
        //                         gradeName: '七年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 8,
        //                         gradeName: '八年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 9,
        //                         gradeName: '九年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                 ],
        //                 stage: 3,
        //                 stageName: '初中',
        //             },
        //             {
        //                 gradeList: [
        //                     {
        //                         grade: 10,
        //                         gradeName: '十年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 11,
        //                         gradeName: '十一年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                     {
        //                         grade: 12,
        //                         gradeName: '十二年级',
        //                         openFlag: false,
        //                         parentsAddContactsFlag: false,
        //                     },
        //                 ],
        //                 stage: 4,
        //                 stageName: '高中',
        //             },
        //         ],
        //         favicon:
        //             'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1676877643513_文华.png',
        //         headUserName: '郭宪勇',
        //         headUserPhone: '15005815152',
        //         headUserPosition: '校董',
        //         ifTopSendDingMessage: 0,
        //         informTypeList: ['INFORM_DING_DING', 'INFORM_SHORT_MESSAGE'],
        //         languageConfigCode: 'Chinese Witch English',
        //         lateSettingList: [],
        //         lessonAuthorityList: [
        //             {
        //                 code: 'Public_With_School',
        //                 downloadPermissions: false,
        //                 stage: 1,
        //                 waterMark: false,
        //             },
        //             {
        //                 code: 'Public_With_StageAndSubject',
        //                 downloadPermissions: false,
        //                 stage: 2,
        //                 waterMark: false,
        //             },
        //             {
        //                 code: 'Public_With_Course',
        //                 downloadPermissions: true,
        //                 stage: 3,
        //                 waterMark: true,
        //             },
        //             {
        //                 code: 'Public_With_School',
        //                 downloadPermissions: false,
        //                 stage: 4,
        //                 waterMark: false,
        //             },
        //         ],
        //         loginBackground:
        //             'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1694427808634_文华logo.png',
        //         loginEnTitle: 'WenHua Edu Group',
        //         loginTitle: '文华教育',
        //         logoUrl:
        //             'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1676877645881_文华.png',
        //         openStageList: '1,2,4',
        //         passwordRule: 'emailPrefix',
        //         payTypeList: ['PAY_ALIPAY'],
        //         privateBucketName: 'saas-wenhua',
        //         privateBucketNameAmount: 2,
        //         provinceId: 370000,
        //         publicBucketName: '',
        //         publicBucketNameAmount: 500,
        //         purchaseModuleList:
        //             'EduBrain_HealthFitness,EduBrain_HonorAwards,EduBrain_Literacy growth,EduBrain_PartyBuildingActivities,EduBrain_ReadingOverview,EduBrain_SchoolResources,EduBrain_SchoolStatus,EduBrain_TaskOverview,EduBrain_TeacherOverview',
        //         registerPhone: '15005815152',
        //         registerQQ: '14292149',
        //         registerSchoolEnName: 'WenHua Primary School',
        //         registerSchoolName: '潍坊文华学校',
        //         registerUserName: '丁磊',
        //         schoolId: 3300002020,
        //         schoolWebEnTitle: 'WenHua School',
        //         schoolWebTitle: '文华教育',
        //         stageList: '2,4,1,3',
        //         studentGroupNum: 50,
        //         style: '/* 定制校外注册账号隐藏 */\n.password___9-cXQ{ visibility: hidden; }\n\n/* 定义背景图片数组 */\n.coverSize___zXaPm, .background-images {\n    background-image: url(https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1694427808634_文华logo.png), url(https://saas-wenhua.oss-cn-hangzhou.aliyuncs.com/public/wenhua2.png);\n    /*background-size: cover;*/\n    background-position: center;\n    background-repeat: no-repeat;\n    animation: backgroundAnimation 15s infinite;\n}\n\n/* 创建轮换动画，可添加多张 */\n@keyframes backgroundAnimation {\n    0% {\n        opacity: 1;\n    }\n    25% {\n        opacity: .8;\n    }\n    50% {\n        background-image: url(https://saas-wenhua.oss-cn-hangzhou.aliyuncs.com/public/wenhua2.png);\n    }\n    75% {\n        opacity: 1;\n    }\n    100% {\n        opacity: 1;\n    }\n}\n\n/* 设置容器大小 \n.coverSize___zXaPm, .background-container {\n    width: 100%;\n    height: 100vh; \n    overflow: hidden;\n}*/',
        //         teacherNum: 500,
        //         topStageSetting: 2,
        //         workBackPic:
        //             'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1676869778246_文华.jpg',
        //         workSchoolShortEName: 'Wenhua Education Group',
        //         workSchoolShortName: '文华学校',
        //     },
        //     ifAdmin: false,
        //     ifLogin: true,
        //     message: '成功',
        //     status: true,
        // },
        {
            code: 0,
            content: {
                areaId: 330102,
                ccaIcon:
                    'https://yungu-photo-daily.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1686796196069_studentCourse.007b05d5.png',
                chatGPTAmount: 99,
                chatGPTApiKey: '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',
                chatGPTList: [
                    {
                        createTime: '2023-03-29 17:59:59',
                        deleted: 0,
                        enable: 1,
                        id: 2,
                        identityType: 1,
                        modelCode: 'Drawing',
                        modifyTime: '2023-11-23 09:13:40',
                        schoolId: 1,
                        usageAmount: 10,
                    },
                    {
                        createTime: '2023-03-30 17:55:27',
                        deleted: 0,
                        enable: 1,
                        id: 4,
                        identityType: 2,
                        modelCode: 'Drawing',
                        modifyTime: '2023-11-23 09:13:40',
                        schoolId: 1,
                        usageAmount: 2,
                    },
                    {
                        createTime: '2023-03-29 17:59:32',
                        deleted: 0,
                        enable: 1,
                        id: 1,
                        identityType: 1,
                        modelCode: 'PrepareLessons',
                        modifyTime: '2023-11-23 09:13:40',
                        schoolId: 1,
                        usageAmount: 10,
                    },
                    {
                        createTime: '2023-03-30 17:55:09',
                        deleted: 0,
                        enable: 1,
                        id: 3,
                        identityType: 2,
                        modelCode: 'PrepareLessons',
                        modifyTime: '2023-11-23 09:13:40',
                        schoolId: 1,
                        usageAmount: 2,
                    },
                ],
                cityId: 330100,
                configCenterList: [
                    'SUBJECT_MANAGEMENT',
                    'COURSE_MANAGEMENT',
                    'CHOISE_MANAGEMENT',
                    'TEACHER_MANAGEMENT',
                    'PLACEMENT_MANAGEMENT',
                    'CHARGE_ITEM_MANAGEMENT',
                    'OFFSTUDENT_MANAGEMENT',
                    'STUDENT_PROFILE',
                ],
                domainName: 'wenhua.daily.yungu-inc.org',
                eduBrainSlideSetting:
                    '{"1":["EduBrain_HonorAwards","EduBrain_ParentClass","EduBrain_PartyBuildingActivities"],"2":["EduBrain_TeacherOverview","EduBrain_ReadingOverview","EduBrain_PartyBuildingActivities","EduBrain_Literacy growth","EduBrain_TaskOverview","EduBrain_ParentClass","EduBrain_HealthFitness"],"3":[],"4":[]}',
                externalSchool: false,
                externalSchoolId: 26,
                faceSettingList: [
                    {
                        gradeList: [
                            {
                                grade: -3,
                                gradeName: '托班',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: -2,
                                gradeName: '小班',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: -1,
                                gradeName: '中班',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 0,
                                gradeName: '大班',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                        ],
                        stage: 1,
                        stageName: '幼儿园',
                    },
                    {
                        gradeList: [
                            {
                                grade: 1,
                                gradeName: '一年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 2,
                                gradeName: '二年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 3,
                                gradeName: '三年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 4,
                                gradeName: '四年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 5,
                                gradeName: '五年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 6,
                                gradeName: '六年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                        ],
                        stage: 2,
                        stageName: '小学',
                    },
                    {
                        gradeList: [
                            {
                                grade: 7,
                                gradeName: '七年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 8,
                                gradeName: '八年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 9,
                                gradeName: '九年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                        ],
                        stage: 3,
                        stageName: '初中',
                    },
                    {
                        gradeList: [
                            {
                                grade: 10,
                                gradeName: '十年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 11,
                                gradeName: '十一年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                            {
                                grade: 12,
                                gradeName: '十二年级',
                                openFlag: false,
                                parentsAddContactsFlag: false,
                            },
                        ],
                        stage: 4,
                        stageName: '高中',
                    },
                ],
                favicon:
                    'https://yungu-photo-daily.oss-cn-hangzhou.aliyuncs.com/learn/list/picture/1686796180345_1664509702544_logo组合-蓝色.png',
                headUserName: '李欣',
                headUserPhone: '13758930838',
                headUserPosition: '校长',
                ifTopSendDingMessage: 1,
                informTypeList: ['INFORM_SHORT_MESSAGE', 'INFORM_WE_CHAT'],
                languageConfigCode: 'Chinese Witch English',
                lateSettingList: [
                    {
                        gradeList: [-2],
                        stage: 1,
                        time: '06:45',
                    },
                    {
                        gradeList: [2],
                        stage: 2,
                        time: '07:46',
                    },
                    {
                        gradeList: [8],
                        stage: 3,
                        time: '08:45',
                    },
                    {
                        gradeList: [10],
                        stage: 4,
                        time: '09:47',
                    },
                ],
                learningProductModelList: [
                    {
                        productId: 1,
                        productName: '手环',
                        purchased: true,
                    },
                    {
                        productId: 2,
                        productName: '智能抓拍仪',
                        purchased: true,
                    },
                    {
                        productId: 3,
                        productName: '身高体重仪',
                        purchased: true,
                    },
                    {
                        productId: 4,
                        productName: '智能额温枪',
                        purchased: true,
                    },
                ],
                learningProducts:
                    '[{"productId":1,"productName":"手环","purchased":true},{"productId":2,"productName":"智能抓拍仪","purchased":true},{"productId":3,"productName":"身高体重仪","purchased":true},{"productId":4,"productName":"智能额温枪","purchased":true}]',
                lessonAuthorityList: [
                    {
                        code: 'Public_With_Groupcompany',
                        downloadPermissions: false,
                        stage: 1,
                        waterMark: false,
                    },
                    {
                        code: 'Public_With_Groupcompany',
                        downloadPermissions: false,
                        stage: 2,
                        waterMark: false,
                    },
                    {
                        code: 'Public_With_Groupcompany',
                        downloadPermissions: false,
                        stage: 3,
                        waterMark: false,
                    },
                    {
                        code: 'Public_With_Groupcompany',
                        downloadPermissions: false,
                        stage: 4,
                        waterMark: false,
                    },
                ],
                loginBackground:
                    'https://yungu-public.oss-accelerate.aliyuncs.com/config/Resources/login/loginBackgroundYG.jpg',
                loginEnTitle: '111',
                loginLogo:
                    'https://yungu-public.oss-accelerate.aliyuncs.com/config/Resources/login/loginLogoYG.png',
                loginTitle: '111',
                logoUrl:
                    'https://yungu-public.oss-accelerate.aliyuncs.com/config/Resources/login/loginLogoYG.png',
                openStageList: '1,2,3,4',
                passwordRule: 'last6PhoneNum',
                payTypeList: ['PAY_ALIPAY', 'PAY_WE_CHAT'],
                privateBucketName: 'yungu-task-file',
                privateBucketNameAmount: 1,
                provinceId: 330000,
                publicBucketName: 'yungu-photo-daily',
                publicBucketNameAmount: 2,
                // "purchaseModuleList": "EduBrain_HealthFitness,EduBrain_ParentClass,EduBrain_SchoolStatus,EduBrain_TaskOverview,Public_With_Groupcompany",
                purchaseModuleList:
                    'EduBrain_HealthFitness,EduBrain_ParentClass,EduBrain_SchoolStatus,EduBrain_TaskOverview,Public_With_Groupcompany,LearningProducts_Wristband,LearningProducts_SmartCamera,LearningProducts_HeightWeightMeter',
                registerPhone: '13758930838',
                registerQQ: '12345',
                registerSchoolEnName: 'Hangzhou Yungu School',
                registerSchoolName: '杭州云谷学校',
                registerUserName: '李欣',
                schoolId: 1,
                schoolWebEnTitle: '网站title',
                schoolWebTitle: '网站title',
                stageList: '1,2,3,4',
                studentGroupNum: 1,
                style: '1234',
                teacherNum: 12,
                topStageSetting: 2,
                tutorEnable: false,
                workBackPic:
                    'https://yungu-public.oss-cn-hangzhou.aliyuncs.com/67635EE6-D327-418D-84DC-26B528945FA8.png',
                workSchoolShortEName: 'yungu1',
                workSchoolShortName: '云谷1',
            },
            ifAdmin: false,
            ifLogin: true,
            message: '成功',
            status: true,
        },
    'GET /api/school/getAdminUserBySchoolId': {
        code: 0,
        content: {
            // account: 'gmm',
            // // password: 123,
            // // schoolId: 1,
            // phone: 12345678,
            // schoolCode: 'ygxx',
        },
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },

    // 'GET /api/teaching/student/getDefaultDistrict': provinceList, //地区列表
    'GET /api/getStreetListByAreaCode': streetList, //街道列表

    'POST /api/weekRule/ruleCopy': commonResponse,
    'POST /api/detail/batchDeletedAC': commonResponse,

    'GET /api/role/baseTag/roleList': roleList, //角色列表
    'POST /api/role/baseTag/insertRole': commonResponse, //新建角色
    'POST /api/role/baseTag/editRole': commonResponse, //编辑角色
    'POST /api/role/baseTag/editUserRole': commonResponse, //修改角色详情
    'GET /api/role/baseTag/listBuiltInRole': systemBuiltRole, //创建内置角色
    'GET /api/role/baseTag/roleUserInfoList': roleUserInfo, //角色人员详情列表
    'POST /api/school/register': commonResponse,
    'POST /api/school/update': commonResponse,
    'GET /api/schoolYear/setCurrentYearOrSemester': {
        //设为当前学期、学年
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: null,
        ifAdmin: false,
    },
    'GET /api/schoolYear/deleteYearOrSemester': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: null,
        ifAdmin: false,
    },
    'GET /api/school/generateBasicSchoolData': commonResponse,

    'POST /course/api/goods/saveInformation': commonResponse,
    'GET /course/api/goods/getInformation': getInformation,
    'GET /course/api/goods/getUserAccountBindInformation': getUserAccountBindInformation,
    'GET /course/api/goods/sendMessageCode': commonResponse,
    'GET /course/api/goods/checkMessageCode': commonResponse,
    'GET /course/api/goods/updatePassword': commonResponse,
    'GET /course/api/goods/unbindOtherAccount': commonResponse,
    'GET /course/api/goods/unbindWeChat': commonResponse,
    'GET /course/api/current/user': {
        code: 0,
        content: {
            avatar: 'http://userservice.api.yungu-inc.org/api/user/avatarUrl/31eddd80-7867-4559-92aa-f557a1af053c',
            currentChildId: 2390,
            currentChildName: '朱504',
            currentIdentity: 'guest',
            identify: ['employee', 'parent'],
            identityShowName: '朱504 爸爸',
            name: '朱力',
            userId: 1121,
            schoolName: '威德11',
            baseExternalSchool: true,
            eduGroupcompanyId: 110,
            schoolId: 1000001001,
            createTuitionFeePermission: true, //创建学费计划权限
            downloadStudentDetailPermission: true, //下载学生名单权限
        },
        ifAdmin: false,
        ifLogin: true,
        message: '成功',
        status: true,
    },
    'POST /api/school/generateBasicSchoolData': commonResponse,
    'GET /api/choose/selectParentChildList': selectParentChildList,
    'POST /api/course/selection/import/chooseCourseGroupToStudent': commonResponse,
    'GET /api/school/deleteSchool': commonResponse,
    'GET /api/teaching/deletedUser': commonResponse,
    'GET /api/choose/choosePlan/chooseExportCourseStudent': commonResponse,
    'GET /api/choose/flushChooseCache': commonResponse,
    'POST /api/choose/batchStudent/cancelChooseSignUp': commonResponse,
    'GET /api/choose/batchStudent/showFeePaid': cancelFee,
    'POST /api/choose/batchStudent/batchNewOrOldStudent': commonResponse,
    'GET /api/domainSubject/listDomainSubjectTree': listDomainSubjectTree,
    'POST /api/domainSubject/insertDomainSubject': insertDomainSubject,
    'POST /api/domainSubject/updateDomainSubject': updateDomainSubject,
    'POST /api/course/manager/listKeywordSubject': listKeywordSubjects,
    'POST /api/searchXlsxTeacherPlan': searchXlsxTeacherPlan,
    'GET /api/course/manager/listSuitStage': {
        ifLogin: true,
        status: true,
        message: '成功',
        code: 0,
        content: [1, 2, 3, 4],
        ifAdmin: false,
    },
    'POST /api/student/roster/list': fetchStudentTableData,
    'POST /api/student/roster/updateStudentTutorOrNumber': updateStudentTutorOrNumber,
    'POST /api/student/roster/importStudentTutorAndNumber': importStudentTutorAndNumber,
    'GET /api/student/roster/listGroup': fetchGroupList,
    'GET /api/role/baseTag/listRolePermission': listRolePermission,

    'GET /api/weekVersion/findClassScheduleAC': findClassScheduleAc,
    'GET /api/activeStudentSeatNumberDownloadCheck': activeStudentSeatNumberDownloadCheck,
    'POST /api/createActiveStudentSeatNumber': generateSeat,

    'POST /api/batchDeleteFreeScheduleResult': batchDeleteFreeScheduleResult,
    'POST /api/batchPublishActive': batchPublishActive,

    //调代课相关
    'GET /api/workFlowRule': workFlowRuleList,
    'POST /api/saveWorkFlowRule': commonResponse,
    'POST /api/submitChangeRequest': submitChangeRequest,
    'POST /api/updateChangeRequest': commonResponse,
    'GET /api/changeRequestDetail': changeRequest,
    'POST /api/changeRequestActingTeacherList': actingTeacherList,
    'GET /api/changeRequestResultList': totalLessonList,
    'GET /api/selectCopySendRule': copySendRuleList,
    'GET /api/getActiveRelatedList': activeRelatedList,
    'POST /api/listChangeCourseRequest': applicationList,
    'POST /api/listActingChangeCourseRequest': replaceList,
    'GET /api/checkWorkFlowNodePermission': checkWorkFlowNodePermission,
    'GET /api/selectSupportVersion': selectSupportVersion,
    'POST /api/changeCourseRequestApproveCheck': approveCheck,
    'GET /api/changeCourseRequestApprove': commonResponse,
    'GET /api/revokeRequest': commonResponse,
    'POST /api/exportActingRequestList': commonResponse,
    'GET /api/listVersionChangeCourseRequest': listVersionChangeCourseRequest,
    'POST /api/publishChangeCourseRequestList': publishChangeCourseRequestList,
    'GET /api/deleteWorkFlowRule': commonResponse,
    'GET /api/selectScheduleCourseMessage': selectScheduleCourseMessage,
    'GET /calendar/api/search/teachers/list/pc': teacherCalendarList,
    'GET /api/personalChangeCourseCount': personalChangeCourseCount,
    'GET /api/checkChangeCoursePermissionEduInBisUsing': commonResponse,
    'GET /api/selfArrangeReady': commonResponse,

    //关联班级相关
    'POST /api/stratify/selectCompareGroupGrouping': compareGroupList,
    'POST /api/stratify/compareGroupGroupingExcelImport': compareGroupGroupingExcelImport,
    'GET /api/stratify/deleteCompareGroupGrouping': commonResponse,

    'POST /api/scheduleResult/splitContinuousResult': commonResponse,
    'GET /api/school/getAttendanceList': getAttendanceList,
    'GET /api/school/getTemplateMenuList': getTemplateMenuList,

    'GET /api/scheduleDetailWeedDayCopy': commonResponse,
    'GET /api/scheduleDetailWeedDayDelete': commonResponse,

    'POST /api/freeScheduleResultRoomConflictCheck': roomConflict,
    'GET /api/address/syncDingRoom': commonResponse,

    //课包规则
    'POST /api/weekRule/getCoursePackageMessage': coursePackageMessageList,
    'GET /api/weekRule/getCoursePackageMergeGroupList': coursePackageMergeGroupList,
    'GET /api/weekRule/listCourseGroup': listCourseGroup,

    //从历史学期复制课表
    'GET /api/weekVersion/checkVersionGroup': commonResponse,
    'POST /api/weekVersion/acrossSemesterCopyVersion': commonResponse,

    //task版本列表
    'POST /api/weekVersion/weekVersionList': taskWeekVersionList,

    //单双周
    'POST /api/saveSemesterWeekDetail': commonResponse,
    'GET /api/semesterWeekDetailList': semesterWeekDetailList,
};

export default noProxy ? {} : delay(proxy, 1000);
