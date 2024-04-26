//课程表规则model
import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    newRuleManagement,
    addWeeklyRule,
    gethasRulesList,
    getruleCount,
    getRulesListOfTypes,
    getRulesOpen,
    getRulesDisabled,
    getTeacherRestList,
    getDetailsBasedSchedule,
    getDetailsRuleBasedSchedule,
    getTeacherAllLists,
    getClassAllList,
    getNewClassAllList,
    getCourseAllList,
    getCourseAcList,
    getAccordingVersion,
    getCourseAcquisitionSchedule,
    getRuleToDelete,
    getWeeklyRuleInformation,
    getRoleTag,
    createCompareGroup,
    getFilterGrade,
    saveSites,
    filterSubject,
    saveSubjects,
    ruleImport,
    getBatchSetSiteRule,
    classTypeList,
    getVersionList,
    ruleCopy,
    getCompareGroupListSync,
    compareGroupGroupingExcelImportSync,
    deleteCompareGroupGroupingSync,
    getCoursePackageMessageSync,
    getCoursePackageMergeGroupListSync,
    getListCourseGroupSync,
} from '../services/rules';
export default {
    namespace: 'rules',
    state: {
        newRuleManagement: [], //新增规则
        hasRulesList: [], // 已添加规则列表
        ruleCount: [], // 规则数量统计
        ruleListOfTypes: [], // 规则类型下规则对象的规则列表
        teacherRulesList: [], // 根据版本，获取老师的作息列表
        scheduleDetail: [], // 根据作息获取明细
        allTeacherList: [], // 老师列表
        classGroupList: [], // 班级列表
        newClassGroupList: [], //新班级列表
        courseAllList: [], //课程列表
        courseAcList: [], //根据课程获取AC列表
        saveCheckCourseList: [], //间隔上课节--选中课程列表
        accordingVersion: [], //根据版本，班级获取作息
        courseAcquisition: [], // 根据版本，课程获取作息
        oneRuleInformation: {}, // 获取一个周内规则信息
        firstAcList: [], //全部课程下的AC列表
        ruleImport: [],
        togetherStatisticsChecked: [], //统计选中的课程和AC--同时上
        sequenceStatisticsChecked: [], //统计选中的课程和AC--顺序上
        sameDayStatisticsChecked: [], //统计选中的课程和AC--同天上
        staggerStatisticsChecked: [], //统计选中的课程和AC--错开上
        intervalStatisticsChecked: [], //统计选中的课程和AC--间隔上
        grades: [], //根据筛选条件获取到的班级
        subjects: [], //根据筛选条件获取到的课程
        updatedSites: [], //更新班级信息
        updatedSubjects: [], //更新学科信息
        roleTag: [], //角色标签列表
        acRuleFilterParamInputModelList: [],
        batchSetSiteRule: [], //批量设置课位
        classTypeListInfo: [], //班级类型下拉列表
        versionList: [], //复制版本列表
        compareGroupList: [],
        teacherConstraintsLoading: false,
        coursePackageEditItem: {
            title: '',
            selectCourse: [],
            remark: '',
            courseGroupDTOList: [],
            courseGroupAdminGroupIdList: [],
        },
        coursePackageList: [],
        coursePackageMergeGroupList: [],
        listCourseGroup: [],
    },
    effects: {
        *getListCourseGroup({ payload, onSuccess }, { call, put }) {
            const response = yield call(getListCourseGroupSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setListCourseGroup',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCoursePackageMergeGroupList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCoursePackageMergeGroupListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCoursePackageMergeGroupList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCoursePackageMessage({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCoursePackageMessageSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCoursePackageList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteCompareGroupGrouping({ payload, onSuccess }, { call, put }) {
            const response = yield call(deleteCompareGroupGroupingSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *compareGroupGroupingExcelImport({ payload, onSuccess, onError }, { call, put }) {
            const response = yield call(compareGroupGroupingExcelImportSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    onError && onError(response.content, response);
                }
            } else {
                loginRedirect();
            }
        },
        *getCompareGroupList({ payload }, { call, put }) {
            const response = yield call(getCompareGroupListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCompareGroupList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *ruleCopy({ payload }, { call, put }) {
            //获取周版本列表
            const response = yield call(ruleCopy, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *setAcRuleFilterParamInputModelList({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'saveAcRuleFilterParamInputModelList',
                payload,
            });
        },

        *getVersionList({ payload }, { call, put }) {
            //获取周版本列表
            const response = yield call(getVersionList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateVersionList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *createCompareGroup({ payload, onSuccess }, { call, put }) {
            const response = yield call(createCompareGroup, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('成功');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getRoleTag({ payload, onSuccess }, { call, put }) {
            const response = yield call(getRoleTag, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setRoleTag',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *newRuleManagement({ payload, onSuccess }, { call, put }) {
            //  规则新增
            const response = yield call(newRuleManagement, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success('创建成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *weeklyRuleChanges({ payload, onSuccess }, { call, put }) {
            //修改满足条件--必须满足和尽量满足(lbx)---同编辑规则接口
            const response = yield call(addWeeklyRule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *hasRulesList({ payload }, { call, put }) {
            //  已添加规则列表
            const response = yield call(gethasRulesList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatehasRulesList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *ruleCount({ payload }, { call, put }) {
            //  规则数量统计
            const response = yield call(getruleCount, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateruleCount',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *ruleListOfTypes({ payload }, { call, put }) {
            //  规则类型下规则对象的规则列表
            const response = yield call(getRulesListOfTypes, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateruleListOfTypes',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *batchSetSiteRule({ payload }, { call, put }) {
            //  规则类型下规则对象的规则列表
            const response = yield call(getBatchSetSiteRule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateRuleOfSite',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *rulesDisables({ payload, onSuccess }, { call, put }) {
            //  规则禁用
            const response = yield call(getRulesOpen, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *rulesEnable({ payload, onSuccess }, { call, put }) {
            //  规则启用
            const response = yield call(getRulesDisabled, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *teacherRulesList({ payload }, { call, put }) {
            //  根据版本，获取老师的作息列表
            const response = yield call(getTeacherRestList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateteacherRulesList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                    yield put({
                        type: 'updateteacherRulesList',
                        payload: response.content,
                    });
                }
            } else {
                loginRedirect();
            }
        },
        *scheduleDetail({ payload }, { call, put }) {
            //  根据作息获取明细
            const response = yield call(getDetailsBasedSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatescheduleDetail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *scheduleRuleDetail({ payload }, { call, put }) {
            //  根据作息获取明细
            const response = yield call(getDetailsRuleBasedSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatescheduleDetail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *allTeacherList({ payload }, { call, put }) {
            //  老师列表
            const response = yield call(getTeacherAllLists, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateallTeacherList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *classGroupList({ payload }, { call, put }) {
            //  班级列表
            const response = yield call(getClassAllList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateclassGroupList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *newClassGroupList({ payload }, { call, put }) {
            //  班级列表
            const response = yield call(getNewClassAllList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateNewClassGroupList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *courseAllList({ payload }, { call, put }) {
            //  课程列表
            const response = yield call(getCourseAllList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatecourseAllList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *ruleImport({ payload, onSuccess }, { call, put }) {
            const response = yield call(ruleImport, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setRuleImport',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *courseAcList({ payload }, { call, put }) {
            //  根据课程获取AC列表
            const response = yield call(getCourseAcList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatecourseAcList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *accordingVersion({ payload, onSuccess }, { call, put }) {
            //  根据版本，班级获取作息
            const response = yield call(getAccordingVersion, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateaccordingVersion',
                        payload: response.content,
                    });
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *courseAcquisition({ payload, onSuccess }, { call, put }) {
            console.log('onSuccess', onSuccess);
            //  根据版本，课程获取作息
            const response = yield call(getCourseAcquisitionSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatecourseAcquisition',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *ruleToDelete({ payload, onSuccess }, { call, put }) {
            //  规则删除
            const response = yield call(getRuleToDelete, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess();
                    message.success('删除成功~');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *oneRuleInformation({ payload }, { call, put }) {
            //  获取一个周内规则信息
            const response = yield call(getWeeklyRuleInformation, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateoneRuleInformation',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *filterGrade({ payload }, { call, put }) {
            //  获取一个周内规则信息
            const response = yield call(getFilterGrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'filterGrades',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *filterSubject({ payload }, { call, put }) {
            //  获取一个周内规则信息
            const response = yield call(filterSubject, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'filterSubjects',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *classTypeList({ payload }, { call, put }) {
            //  获取一个周内规则信息
            const response = yield call(classTypeList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'classTypeLists',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *saveSites({ payload }, { call, put }) {
            //  获取一个周内规则信息
            const response = yield call(saveSites, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveSite',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *saveSubjects({ payload }, { call, put }) {
            //  获取一个周内规则信息
            const response = yield call(saveSubjects, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveSubject',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *togetherStatistics({ payload }, { call, put }) {
            //统计同时上的规则列表
            yield put({
                type: 'updateTogetherStatistics',
                payload: payload,
            });
        },
        *sequenceStatistics({ payload }, { call, put }) {
            //统计顺序上的规则列表
            yield put({
                type: 'updateSequenceStatistics',
                payload: payload,
            });
        },
        *sameDayStatistics({ payload }, { call, put }) {
            //统计同天上的规则列表
            yield put({
                type: 'updateSameDayStatistics',
                payload: payload,
            });
        },
        *staggerStatistics({ payload }, { call, put }) {
            //统计错开上的规则列表
            yield put({
                type: 'updateStaggerStatistics',
                payload: payload,
            });
        },
        *intervalStatistics({ payload }, { call, put }) {
            //统计间隔上的规则列表
            yield put({
                type: 'updateIntervalStatistics',
                payload: payload,
            });
        },
    },
    reducers: {
        setListCourseGroup(state, action) {
            return {
                ...state,
                listCourseGroup: action.payload,
            };
        },
        setCoursePackageMergeGroupList(state, action) {
            return {
                ...state,
                coursePackageMergeGroupList: action.payload,
            };
        },
        setCoursePackageList(state, action) {
            return {
                ...state,
                coursePackageList: action.payload,
            };
        },
        setCoursePackageEditItem(state, action) {
            return {
                ...state,
                coursePackageEditItem: action.payload,
            };
        },
        setTeacherConstraintsLoading(state, action) {
            return {
                ...state,
                teacherConstraintsLoading: action.payload,
            };
        },
        setCompareGroupList(state, action) {
            return {
                ...state,
                compareGroupList: action.payload,
            };
        },

        saveAcRuleFilterParamInputModelList(state, action) {
            return {
                ...state,
                acRuleFilterParamInputModelList: action.payload,
            };
        },

        setRoleTag(state, action) {
            return {
                ...state,
                roleTag: action.payload,
            };
        },
        updatehasRulesList(state, action) {
            return {
                ...state,
                hasRulesList: action.payload,
            };
        },
        updateruleCount(state, action) {
            return {
                ...state,
                ruleCount: action.payload,
            };
        },
        updateruleListOfTypes(state, action) {
            return {
                ...state,
                ruleListOfTypes: action.payload,
            };
        },
        updateRuleOfSite(state, action) {
            return {
                ...state,
                batchSetSiteRule: action.payload,
            };
        },
        updateteacherRulesList(state, action) {
            return {
                ...state,
                teacherRulesList: action.payload,
            };
        },
        updatescheduleDetail(state, action) {
            return {
                ...state,
                scheduleDetail: action.payload,
            };
        },
        updateallTeacherList(state, action) {
            return {
                ...state,
                allTeacherList: action.payload,
            };
        },
        updateclassGroupList(state, action) {
            return {
                ...state,
                classGroupList: action.payload,
            };
        },
        updateNewClassGroupList(state, action) {
            return {
                ...state,
                newClassGroupList: action.payload,
            };
        },
        updatecourseAllList(state, action) {
            return {
                ...state,
                courseAllList: action.payload,
            };
        },
        updatecourseAcList(state, action) {
            return {
                ...state,
                courseAcList: action.payload,
            };
        },
        saveCheckCourse(state, action) {
            return {
                ...state,
                saveCheckCourseList: action.payload.courseList,
            };
        },
        updateaccordingVersion(state, action) {
            return {
                ...state,
                accordingVersion: action.payload,
            };
        },
        updatecourseAcquisition(state, action) {
            return {
                ...state,
                courseAcquisition: action.payload,
            };
        },
        updateoneRuleInformation(state, action) {
            return {
                ...state,
                oneRuleInformation: action.payload,
            };
        },
        filterGrades(state, action) {
            return {
                ...state,
                grades: action.payload,
            };
        },
        filterSubjects(state, action) {
            return {
                ...state,
                subjects: action.payload,
            };
        },
        classTypeLists(state, action) {
            return {
                ...state,
                classTypeListInfo: action.payload,
            };
        },
        saveSite(state, action) {
            return {
                ...state,
                updatedSites: action.payload,
            };
        },
        saveSubject(state, action) {
            return {
                ...state,
                updatedSubjects: action.payload,
            };
        },
        setRuleImport(state, action) {
            return {
                ...state,
                ruleImport: action.payload,
            };
        },
        saveFirstAcList(state, action) {
            return {
                ...state,
                firstAcList: action.payload.firstAcList,
            };
        },

        updateTogetherStatistics(state, action) {
            //记录已经选中的ac列表
            let newStatisticsChecked = JSON.parse(JSON.stringify(state.togetherStatisticsChecked));
            let checkedUtil = action.payload.checkedUtil;
            let isDeleteSource = action.payload.clearStatistics; //删除props标志
            let flag = true;
            for (let i = 0; i < newStatisticsChecked.length; i++) {
                if (checkedUtil && newStatisticsChecked[i].activityId == checkedUtil.activityId) {
                    newStatisticsChecked[i].value = checkedUtil.value;
                    flag = false;
                }
            }
            if (flag) {
                newStatisticsChecked.push(checkedUtil);
            }
            return {
                ...state,
                togetherStatisticsChecked: isDeleteSource == 'all' ? [] : newStatisticsChecked,
            };
        },

        updateSameDayStatistics(state, action) {
            //记录已经选中的ac列表
            let newStatisticsChecked = JSON.parse(JSON.stringify(state.sameDayStatisticsChecked));
            let checkedUtil = action.payload.checkedUtil;
            let isDeleteSource = action.payload.clearStatistics; //删除props标志
            let flag = true;
            for (let i = 0; i < newStatisticsChecked.length; i++) {
                if (checkedUtil && newStatisticsChecked[i].activityId == checkedUtil.activityId) {
                    newStatisticsChecked[i].value = checkedUtil.value;
                    flag = false;
                }
            }
            if (flag) {
                newStatisticsChecked.push(checkedUtil);
            }
            return {
                ...state,
                sameDayStatisticsChecked: isDeleteSource == 'all' ? [] : newStatisticsChecked,
            };
        },

        updateSequenceStatistics(state, action) {
            //记录已经选中的ac列表
            let newStatisticsChecked = JSON.parse(JSON.stringify(state.sequenceStatisticsChecked));
            let checkedUtil = action.payload.checkedUtil;
            let isDeleteSource = action.payload.clearStatistics; //删除props标志
            let flag = true;
            for (let i = 0; i < newStatisticsChecked.length; i++) {
                if (checkedUtil && newStatisticsChecked[i].activityId == checkedUtil.activityId) {
                    newStatisticsChecked[i].value = checkedUtil.value;
                    flag = false;
                }
            }
            if (flag) {
                newStatisticsChecked.push(checkedUtil);
            }
            return {
                ...state,
                sequenceStatisticsChecked: isDeleteSource == 'all' ? [] : newStatisticsChecked,
            };
        },

        updateStaggerStatistics(state, action) {
            //记录已经选中的课程和AC列表 ---错开上
            let newStatisticsChecked = JSON.parse(JSON.stringify(state.staggerStatisticsChecked));
            let checkedUtil = action.payload.checkedUtil;
            let isDeleteSource = action.payload.clearStatistics; //删除props标志
            let flag = true;
            for (let i = 0; i < newStatisticsChecked.length; i++) {
                if (checkedUtil && newStatisticsChecked[i].activityId == checkedUtil.activityId) {
                    newStatisticsChecked[i].value = checkedUtil.value;
                    flag = false;
                }
            }
            if (flag) {
                newStatisticsChecked.push(checkedUtil);
            }
            return {
                ...state,
                staggerStatisticsChecked: isDeleteSource == 'all' ? [] : newStatisticsChecked,
            };
        },

        updateIntervalStatistics(state, action) {
            //记录已经选中的课程和AC列表 ---间隔上
            let newStatisticsChecked = JSON.parse(JSON.stringify(state.intervalStatisticsChecked));
            let checkedUtil = action.payload.checkedUtil;
            let isDeleteSource = action.payload.clearStatistics; //删除props标志
            let flag = true;
            for (let i = 0; i < newStatisticsChecked.length; i++) {
                if (checkedUtil && newStatisticsChecked[i].activityId == checkedUtil.activityId) {
                    newStatisticsChecked[i].value = checkedUtil.value;
                    flag = false;
                }
            }
            if (flag) {
                newStatisticsChecked.push(checkedUtil);
            }
            return {
                ...state,
                intervalStatisticsChecked: isDeleteSource == 'all' ? [] : newStatisticsChecked,
            };
        },

        updateVersionList(state, action) {
            return {
                ...state,
                versionList: action.payload,
            };
        },
    },
};
