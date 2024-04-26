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
    exportButtonList,
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
    batchSetStudentNotice,
    getEndClassNumber,
    confirmEndClassSuccess,
    uploadTransferAnnex,
    submitTransferSchool,
    submitGiveUpSchool,
    submitSuspensionSchool,
    submitResumptionSchool,
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
    // provinceList,
    streetList,
} from './mock/student.js';

export default {
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
    //获取学生个人档案详情
    'GET /api/teaching/student/studentProfile': getStudentDetails,
    //导出其他信息
    'POST /api/teaching/excel/export': exportButtonList,
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
    //批量通知
    'POST /api/teaching/parentUpdateStudentInfo/invitation': batchSetStudentNotice,

    // 上传转学附件
    'POST /api/teaching/excel/uploadFile': uploadTransferAnnex,
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
    //获取结班数量
    'GET /api/teaching/student/checkCompleteClass': getEndClassNumber,
    //确认该节点下结班
    'GET /api/teaching/student/completeClass': confirmEndClassSuccess,
    //不更新学生信息
    'POST /api/teaching/parentUpdateStudentInfo/confirmStudentInfo': confirmStudentInfo,
    // 'GET /api/area/provinceList': provinceList, //地区列表
    'GET /api/getStreetListByAreaCode': streetList, //街道列表
};
