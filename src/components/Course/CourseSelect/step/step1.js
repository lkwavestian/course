import React, { PureComponent } from 'react';
import styles from './step.less';
import { connect } from 'dva';
import moment from 'moment';
import {
    Input,
    Checkbox,
    DatePicker,
    Select,
    TreeSelect,
    Switch,
    Tooltip,
    Icon,
    Radio,
    TimePicker,
    message,
    InputNumber,
    Modal
} from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { trans, locale } from '../../../../utils/i18n';
import { getUrlSearch, getLength } from '../../../../utils/utils';
import { flattenDeep, uniqBy } from 'lodash';
import RichEditor from '@yungu-fed/static-richeditor';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const cutOffFormat = 'YYYY-MM-DD HH:mm';

@connect((state) => ({
    teacherList: state.course.teacherList,
    planningSchoolListInfo: state.course.planningSchoolListInfo,
    allStage: state.time.allStage,
    choosePlanList: state.course.choosePlanList,
    allchoosePlanLists: state.course.allchoosePlanLists,
    selectionList: state.courseBaseDetail.selectionList,
    getLotSubjects: state.course.getLotSubjects,
    getPayChargeItemList: state.course.getPayChargeItemList,
    userSchoolId: state.global.userSchoolId,
    ossAssumeResult: state.global.ossAssumeResult,
}))
class Step1 extends PureComponent {
    constructor(props) {
        super(props);
        let { planningSchoolListInfo, currentUser, allStage } = props;
        planningSchoolListInfo =
            planningSchoolListInfo &&
            planningSchoolListInfo.map((el) => {
                return {
                    label: locale() != 'en' ? el.name : el.enName,
                    value: el.schoolId,
                };
            });
        allStage =
            allStage &&
            allStage.map((el) => {
                return {
                    label: locale() != 'en' ? el.orgName : el.orgEname,
                    value: el.id,
                };
            });

        let { createSchoolYearId, defaultStartTime, defaultEndTime } = this.initPropsData(props);

        this.state = {
            allStage,
            planningSchoolListInfo,
            name: '',
            ename: '',
            schoolIdList: [],
            schoolYearId: createSchoolYearId,
            administratorIds: [],
            feeAdminIds: [],
            schoolSectionIds: [],
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            courseStartTime: '10:00',
            courseEndTime: '11:00',
            announcement: null,
            freePlateContent: null,
            map: null,
            isChangeStep1: false,
            declare: false,
            continuated: false,
            infoStyle: 0,
            showFee: [],
            weekDay: [],
            timeData: [],
            seleceRule: 2,
            choosePayType: undefined,
            firstReport: false,
            declareSemester: [],
            deletedTimeIds: [],
            weekOptions: [
                { label: locale() !== 'en' ? '周一' : 'Monday', value: 1 },
                { label: locale() !== 'en' ? '周二' : 'Tuesday', value: 2 },
                { label: locale() !== 'en' ? '周三' : 'Wednesday', value: 3 },
                { label: locale() !== 'en' ? '周四' : 'Thursday', value: 4 },
                { label: locale() !== 'en' ? '周五' : 'Friday', value: 5 },
                { label: locale() !== 'en' ? '周六' : 'Saturday', value: 6 },
                { label: locale() !== 'en' ? '周日' : 'Sunday', value: 7 },
            ],
            availableCourseNum: 0, //每个学生最多可报课程数量
            stintSubjectNumModelList: [],
            planId: getUrlSearch('planId'),
            filterLotSubjects: [],
            payloadClassObj: undefined,
            payloadMaterialObj: undefined,
            newSchoolSection: [],
            newSchoolId: [],
            switchLanguage: 'en',

            subjectLen: undefined,
            subjectList: undefined,
            specialChecked: false,

            mergeOrder: 1, //订单模式：1是合并 2是拆分
            useWallet: 1, //支付设置：1允许使用余额 2不允许使用余额
            limitCon: 1, //学生家长取消限制： 1报名期间取消 2自定义取消时间
            timeValue: null, //截止时间

            defaultShowTime: null,
            classTime: 1, //上课时间设置
            checkTimeConflict: 0, //冲突校验
            addShow: false,
            groupName: '',
            groupDTOList: [],
            setType: 1,
            deleteGroupGroupingNumJsonDTOList: [],

            templateVisible: false, //设置自由板式模版visible
        };
    }

    componentWillReceiveProps(nextProps) {
        let { isEdit, createStep, chooseCourseDetails, selectionList, semesterList, isTimePicker } =
            nextProps;
        let map = new Map();
        semesterList &&
            semesterList.forEach((el) => {
                map.set(String(el.id), el);
            });
        this.setState({
            map,
        });
        if (isEdit) {
            let elt = chooseCourseDetails;
            let schoolIdList = [];
            let administratorIds = [];
            let feeAdminIds = [];
            let schoolSectionIds = [];
            let weekDay = [];
            let showFee = [];
            let timeData = [];

            if (elt.classTime) {
                elt.classTime.forEach((el) => {
                    timeData.push({ startTime: el.startTime, endTime: el.endTime, id: el.id });
                });
            }
            if (elt.schoolList) {
                elt.schoolList.forEach((el) => {
                    schoolIdList.push(el.id);
                });
            }
            if (elt.administratorList) {
                elt.administratorList.forEach((el) => {
                    administratorIds.push(el.id);
                });
            }
            if (elt.feeAdministratorList) {
                elt.feeAdministratorList.forEach((el) => {
                    feeAdminIds.push(el.id);
                });
            }
            if (elt.schoolSectionList) {
                elt.schoolSectionList.forEach((el) => {
                    schoolSectionIds.push(el.id);
                });
            }

            if (elt.classDate) {
                elt.classDate.forEach((el) => {
                    weekDay.push(el);
                });
            }
            if (elt.classFeeShow) {
                showFee.push(1);
            }
            if (elt.materialFeeShow) {
                showFee.push(2);
            }

            let weekDays = [];
            selectionList &&
                selectionList.coursePlanOutputModels &&
                selectionList.coursePlanOutputModels.map((item, index) => {
                    item.courseGroupPlanOutputModels &&
                        item.courseGroupPlanOutputModels.map((el, ind) => {
                            el.classTimeModels &&
                                el.classTimeModels.map((ee, ii) => {
                                    weekDays.push(ee.weekday);
                                });
                        });
                });

            weekDays = [...new Set(weekDays)];

            let weekOptions = JSON.parse(JSON.stringify(this.state.weekOptions));
            weekOptions.map((item, index) => {
                weekDays.map((item2, index2) => {
                    if (item.value == item2) {
                        weekOptions[index].disabled = true;
                    }
                });
            });

            let commonPaySetting = [
                {
                    defaultPaySetting: false,
                    chargeItemEnName: '',
                    chargeItemId: undefined,
                    chargeItemName: '',
                    itemCategoryEnName: '',
                    itemCategoryId: undefined,
                    itemCategoryName: '',
                    subjectIdList: [],
                    payType: 0,
                },
                {
                    defaultPaySetting: false,
                    chargeItemEnName: '',
                    chargeItemId: undefined,
                    chargeItemName: '',
                    itemCategoryEnName: '',
                    itemCategoryId: undefined,
                    itemCategoryName: '',
                    subjectIdList: [],
                    payType: 1,
                },
            ];

            this.setState(
                {
                    subjectLen:
                        this.dealSubject(elt.choosePayProjectSettingModelList) ||
                        elt.choosePayProjectSettingModelList,
                    name: elt.name,
                    ename: elt.ename,
                    schoolIdList: schoolIdList,
                    schoolYearId: elt.schoolYearId,
                    administratorIds,
                    feeAdminIds,
                    schoolSectionIds: schoolSectionIds,
                    weekDay,
                    infoStyle: elt.courseIntroductionType,
                    showFee,
                    continuated:
                        elt.repeatableCourseFirst ||
                        (elt.prefaceChooseCoursePlanModels?.length > 0
                            ? elt.prefaceChooseCoursePlanModels[0].id
                            : undefined)
                            ? true
                            : false,
                    firstReport: elt.repeatableCourseFirst,
                    startTime: elt.startTime,
                    endTime: elt.endTime,
                    courseStartTime: elt.declareStartTime,
                    courseEndTime: elt.declareEndTime,
                    announcement: elt.announcement,
                    freePlateContent: elt.freePlateContent,
                    timeData: timeData,
                    seleceRule: elt.type,
                    payloadClassObj:
                        elt?.choosePayProjectSettingModelList &&
                        elt.choosePayProjectSettingModelList.length &&
                        elt.choosePayProjectSettingModelList[0],
                    payloadMaterialObj:
                        elt?.choosePayProjectSettingModelList &&
                        elt.choosePayProjectSettingModelList.length &&
                        elt.choosePayProjectSettingModelList[1],
                    subjectList:
                        elt?.choosePayProjectSettingModelList &&
                        elt.choosePayProjectSettingModelList.length >= 2 &&
                        elt.choosePayProjectSettingModelList.slice(2),
                    choosePayType: elt.choosePayType,
                    mergeOrder: elt.mergeOrder || 1,
                    useWallet: elt.useWallet || 1,
                    specialChecked:
                        elt?.choosePayProjectSettingModelList &&
                        elt.choosePayProjectSettingModelList.length > 2,
                    weekOptions,
                    declareSemester:
                        elt.prefaceChooseCoursePlanModels?.length > 0
                            ? elt.prefaceChooseCoursePlanModels[0].id
                            : undefined,
                    declare: elt.declareStartTime && elt.declareEndTime ? true : false,
                    stintSubjectNumModelList: elt.stintSubjectNumModelList
                        ? elt.stintSubjectNumModelList
                        : [
                              {
                                  subjectIdList: [],
                                  number: 0,
                              },
                          ],
                    filterLotSubjects: elt.stintSubjectNumModelList
                        ? elt.stintSubjectNumModelList.map((item) => item.subjectIdList)
                        : [],
                    limitCon: elt.cancelSignUpTime ? 2 : 1,
                    timeValue: (elt.cancelSignUpTime && moment(elt.cancelSignUpTime)) || null,
                    checkTimeConflict: elt.checkTimeConflict || 0,
                    classTime: elt.classDate && elt.classDate.length > 0 ? 1 : 2,
                    groupDTOList: elt.groupGroupingNumJsonDTOList || [],
                    setType:
                        elt.groupGroupingNumJsonDTOList &&
                        elt.groupGroupingNumJsonDTOList.length > 0
                            ? 1
                            : 2,
                },
                () => {
                    if (this.state.subjectList && this.state.subjectList.length == 0) {
                        this.setState({
                            subjectList: commonPaySetting,
                        });
                    }
                }
            );
        } else if (isTimePicker) {
            return;
        } else {
            let { createSchoolYearId, defaultStartTime, defaultEndTime } =
                this.initPropsData(nextProps);
            let { currentUser } = this.props;
            let administratorIds =
                (currentUser && currentUser.userId && [currentUser.userId]) || [];
            let feeAdminIds = (currentUser && currentUser.userId && [currentUser.userId]) || [];
            let timeData = [{ startTime: '10:00', endTime: '11:00' }];

            this.setState({
                // name: '',
                // ename: '',
                // schoolIdList: [],
                schoolYearId: createSchoolYearId,
                // schoolSectionIds: [],
                courseStartTime: defaultStartTime,
                courseEndTime: defaultEndTime,
                declare: false,
                startTime: defaultStartTime,
                endTime: defaultEndTime,
                seleceRule: 2,
                choosePayType: undefined,
                mergeOrder: 1,
                useWallet: 1,
                infoStyle: 0,
                continuated: false,
                // declareSemester: [],
                firstReport: false,
                timeData,
                // reportedMax: 2,
                availableCourseNum: 0,
                // weekDay: [],
                // showFee: [],
                administratorIds,
                feeAdminIds,
                announcement: null,
                stintSubjectNumModelList: [],
                limitCon: 1,
                freePlateContent: null
            });
        }
    }

    dealSubject = (arr) => {
        if (!arr) {
            return undefined;
        }
        let temp = arr.slice(2);
        let half = Math.ceil(temp.length / 2);
        let firstHalf = arr.slice(0, half);
        if (firstHalf.length == 0) {
            return arr.slice(1);
        } else {
            return firstHalf;
        }
    };

    // 初始化新建时的默认值
    initPropsData(props) {
        let { planningSemesterInfo } = props;
        let createSchoolYearId = '';
        let defaultStartTime = null;
        let defaultEndTime = null;
        if (planningSemesterInfo && planningSemesterInfo.length > 0) {
            planningSemesterInfo.forEach((el, i) => {
                if (el.current) {
                    createSchoolYearId = el.id;
                    defaultStartTime = this.ymd(el.startTime);
                    defaultEndTime = this.ymd(el.endTime);
                    return;
                }
            });
        }
        return {
            createSchoolYearId,
            // defaultStartTime,
            // defaultEndTime,
            undefined,
            undefined,
        };
    }

    ymd(time) {
        let t = new Date(time);
        return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
    }

    componentDidMount() {
        this.props.onNewRef(this);
        this.getTeacher();
        this.allchoosePlanList();
        typeof this.props.onRef === 'function' && this.props.onRef(this);
        this.setState({
            switchLanguage: locale(),
        });
    }

    allchoosePlanList = (callback) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/allChoosePlanList',
            payload: {
                pageNum: 1,
                pageSize: 1000,
            },
        });
    };

    changeValue = (name, type, e) => {
        if (type === 1) {
            this.setState({
                [name]: e.target.value,
            });
        } else if (type === 2) {
            this.setState(
                {
                    [name]: e,
                },
                () => {
                    if (
                        this.state.schoolSectionIds.length == 0 ||
                        this.state.schoolIdList.length == 0
                    ) {
                        return false;
                    }
                    if (name == 'schoolIdList' || name == 'schoolSectionIds') {
                        const { allStage } = this.props;
                        let newStageIdList = [];
                        allStage.map((item, index) => {
                            this.state.schoolSectionIds.map((item2, index2) => {
                                if (item.id == item2) {
                                    newStageIdList.push(item.stage);
                                }
                            });
                        });
                        this.props.dispatch({
                            type: 'course/getPayChargeItemList',
                            payload: {
                                stageIdList: newStageIdList,
                                schoolId: this.state.schoolIdList,
                            },
                        });
                    }
                }
            );

            // 同步更新时间
            if (name === 'schoolYearId') {
                let { map } = this.state;
                let elt = map.get(String(e));
                this.setState({
                    startTime: this.ymd(elt.startTime),
                    endTime: this.ymd(elt.endTime),
                });
            }
        } else if (type == 3) {
            this.setState({
                [name]: e,
            });
        }
    };

    declareChange = (checked) => {
        this.setState({
            declare: checked,
        });
    };

    continuatedChange = (checked) => {
        this.setState({
            continuated: checked,
        });
    };

    //处理教师数据
    formatTeacherData = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return;
        let teacherData = [];
        teacherList.map((item, index) => {
            let obj = {};
            // obj.title = locale() !== 'en' ? item.name : item.englishName;
            obj.title = item.name + ' ' + `${item.englishName ? item.englishName : ' '}`;
            obj.key = item.teacherId;
            obj.value = item.teacherId;
            obj.ename = item.englishName;
            teacherData.push(obj);
        });
        return teacherData;
    };

    //获取教师列表
    getTeacher() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getTeacherList',
            payload: {},
        });
    }

    changeInfo = (e) => {
        this.setState({
            infoStyle: e.target.value,
        });
    };

    changeRule = (e) => {
        this.setState({
            seleceRule: e.target.value,
        });
    };

    changeClassFee = (e) => {
        const { getPayChargeItemList } = this.props;
        let payloadClassObj = {};
        let newGetPayChargeItemList = uniqBy(getPayChargeItemList, 'chargeItemId');
        newGetPayChargeItemList.map((item, index) => {
            if (item.chargeItemId == e) {
                payloadClassObj = {
                    payType: 0,
                    ...item,
                };
            }
        });
        this.setState({
            payloadClassObj,
        });
    };

    changeMaterialFee = (e) => {
        const { getPayChargeItemList } = this.props;
        let payloadMaterialObj = {};
        let newGetPayChargeItemList = uniqBy(getPayChargeItemList, 'chargeItemId');
        newGetPayChargeItemList.map((item, index) => {
            if (item.chargeItemId == e) {
                payloadMaterialObj = {
                    payType: 1,
                    ...item,
                };
            }
        });
        this.setState({
            payloadMaterialObj,
        });
    };

    changePayType = (e) => {
        this.setState({
            choosePayType: e.target.value,
        });
    };

    changeFee = (checkedValues) => {
        this.setState({
            showFee: checkedValues,
        });
    };
    changeWeek = (checkedValues) => {
        this.setState({
            weekDay: checkedValues,
        });
    };

    changeStart = (time, timeString, index) => {
        let timeData = JSON.parse(JSON.stringify(this.state.timeData));
        timeData[index].startTime = timeString;
        this.setState({
            timeData,
        });
    };
    changeEnd = (time, timeString, index) => {
        let timeData = JSON.parse(JSON.stringify(this.state.timeData));
        timeData[index].endTime = timeString;
        this.setState({
            timeData,
        });
    };

    delData = (index) => {
        let timeData = JSON.parse(JSON.stringify(this.state.timeData));
        let aa = timeData.splice(index, 1);
        if (aa[0].id) {
            let deleteTimeId = this.state.deletedTimeIds;
            console.log('111', 111);
            deleteTimeId.push(aa[0].id);
            console.log('aa', aa);
            this.setState({
                deletedTimeIds: deleteTimeId,
            });
        }

        // timeData.splice(index, 1);
        this.setState({
            timeData,
        });
    };

    addData = () => {
        let timeData = JSON.parse(
            JSON.stringify(
                this.state.timeData
                    ? this.state.timeData
                    : [{ startTime: '10:00', endTime: '11:00' }]
            )
        );
        timeData.push({
            startTime: '10:00',
            endTime: '11:00',
        });
        this.setState({
            timeData,
        });
    };

    handlePicker = (date, dateString) => {
        this.setState(
            {
                startTime: dateString[0],
                endTime: dateString[1],
                isChangeStep1: true,
            },
            () => {
                this.props.handlePickerState(this.state.startTime, this.state.endTime);
            }
        );
    };
    handleDeclare = (date, dateString) => {
        this.setState({
            courseStartTime: dateString[0],
            courseEndTime: dateString[1],
        });
    };

    /* changeMax = (value) => {
        this.setState({
            reportedMax: value,
        });
    }; */

    isFirstReport = (e) => {
        this.setState({
            firstReport: e.target.checked,
        });
    };

    changeDeclareSem = (value) => {
        this.setState({
            declareSemester: [value],
        });
    };

    changeAvailable = (e) => {
        this.setState({
            availableCourseNum: e,
        });
    };

    limitCourseChange = (value, key) => {
        const { stintSubjectNumModelList, filterLotSubjects } = this.state;
        let limitCourseListCopy = [...stintSubjectNumModelList];
        let filterLotSubjectsCopy = [...filterLotSubjects];
        limitCourseListCopy[key].subjectIdList = value;
        filterLotSubjectsCopy[key] = value;
        this.setState({
            stintSubjectNumModelList: limitCourseListCopy,
            filterLotSubjects: filterLotSubjectsCopy,
        });
    };

    limitNumberChange = (value, key) => {
        const { stintSubjectNumModelList } = this.state;
        let limitCourseListCopy = [...stintSubjectNumModelList];
        limitCourseListCopy[key].number = value;
        this.setState({
            stintSubjectNumModelList: limitCourseListCopy,
        });
    };

    limitCourseListChange = (action, deleteKey) => {
        let { stintSubjectNumModelList, filterLotSubjects } = this.state;
        let limitCourseListCopy = [...stintSubjectNumModelList];
        let filterLotSubjectsCopy = [...filterLotSubjects];
        if (action === 'add') {
            limitCourseListCopy.push({
                subjectIdList: [],
                number: 0,
            });
        }
        if (action === 'delete') {
            limitCourseListCopy = stintSubjectNumModelList.filter((item, key) => key !== deleteKey);
            filterLotSubjectsCopy = filterLotSubjects.filter((item, key) => key !== deleteKey);
        }
        this.setState({
            stintSubjectNumModelList:
                limitCourseListCopy.length > 0
                    ? limitCourseListCopy
                    : [
                          {
                              subjectIdList: [],
                              number: 0,
                          },
                      ],
            filterLotSubjects: filterLotSubjectsCopy,
        });
    };

    uploadImage = (files, callback) => {
        for (let i = 0; i < files.length; i++) {
            files[i]['uuid'] = new Date().getTime() + i;
            this.readFile(files[i], (responseFile) => {
                if (responseFile['uuid'] == files[i]['uuid']) {
                    let imageList = [{ url: `${window.location.origin}${responseFile.url}` }];
                    typeof callback == 'function' && callback.call(this, imageList);
                }
            });
        }
    };

    readFile = (file, callback) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let self = this;
        reader.onloadend = function () {
            let data = new FormData();
            data.append('fileList', file);
            self.props.dispatch({
                type: '/course/uploadImages',
                payload: data,
                onSuccess: (response) => {
                    response.uuid = file.uuid;
                    callback && callback(response);
                },
            });
            self.uploadToOss(file, (res) => {
                typeof callback == 'function' && callback(res);
            });
        };
    };

    getOssAssume() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'global/getOssAssume',
            payload: {
                type: '',
            },
        });
    }

    uploadToOss = (files, callback) => {
        this.getOssAssume().then(() => {
            const { ossAssumeResult, dispatch } = this.props;
            let OSS = require('ali-oss');
            let client = new OSS({
                region: ossAssumeResult.region,
                accessKeyId: ossAssumeResult.accessKeyId,
                accessKeySecret: ossAssumeResult.accessSecret,
                bucket: ossAssumeResult.bucketName,
                endpoint: ossAssumeResult.endpoint,
                stsToken: ossAssumeResult.stsToken,
                ossPath: ossAssumeResult.ossPath,
            });
            client
                .multipartUpload(`${ossAssumeResult.ossPath}${files.uuid}_${files.name}`, files, {})
                .then((response) => {
                    if (response.res && response.res.status == '200') {
                        let fileUrl = `${ossAssumeResult.ossPath}${files.uuid}_${files.name}`;
                        dispatch({
                            type: 'global/payloadUploadFile',
                            payload: {
                                fileName: files.name,
                                bucketName: ossAssumeResult.bucketName,
                                fileSize: files.size || 0,
                                fileType: files.type || '',
                                fileUrl: fileUrl,
                                percent: 100,
                                uuid: files.uuid,
                            },
                            onSuccess: () => {
                                const { uploadFileResponse } = this.props;
                                typeof callback == 'function' && callback(uploadFileResponse);
                            },
                        });
                    } else {
                        message.error('上传失败');
                    }
                })
                .catch((err) => {
                    message.error('哎呀，oss出错了');
                });
        });
    };

    handleEditorChange = (content) => {
        this.setState({
            content,
        });
    };

    handleFreeEditorChange = (content) => {
        this.setState({
            freeContent: content,
        });
    };
    addSpeRules = (e) => {
        let { subjectLen, subjectList } = this.state;
        const { chooseCourseDetails } = this.props;

        // let tempSubjectLen = JSON.parse(JSON.stringify(subjectLen)) || [];

        let commonPaySetting = [
            {
                defaultPaySetting: false,
                chargeItemEnName: '',
                chargeItemId: undefined,
                chargeItemName: '',
                itemCategoryEnName: '',
                itemCategoryId: undefined,
                itemCategoryName: '',
                subjectIdList: [],
                payType: 0,
            },
            {
                defaultPaySetting: false,
                chargeItemEnName: '',
                chargeItemId: undefined,
                chargeItemName: '',
                itemCategoryEnName: '',
                itemCategoryId: undefined,
                itemCategoryName: '',
                subjectIdList: [],
                payType: 1,
            },
        ];

        let tempArr =
            this.dealSubject(chooseCourseDetails.choosePayProjectSettingModelList) ||
            commonPaySetting.slice(0, 1);

        this.setState({
            specialChecked: e.target.checked,
            subjectList: commonPaySetting,
            subjectLen: tempArr,
        });
    };

    addRow = () => {
        let { subjectLen, subjectList } = this.state;
        let tempSubjectLen = JSON.parse(JSON.stringify(subjectLen));
        tempSubjectLen = [...tempSubjectLen, subjectList[0]];
        let commonPaySetting = [
            {
                defaultPaySetting: false,
                chargeItemEnName: '',
                chargeItemId: undefined,
                chargeItemName: '',
                itemCategoryEnName: '',
                itemCategoryId: undefined,
                itemCategoryName: '',
                subjectIdList: [],
                payType: 0,
            },
            {
                defaultPaySetting: false,
                chargeItemEnName: '',
                chargeItemId: undefined,
                chargeItemName: '',
                itemCategoryEnName: '',
                itemCategoryId: undefined,
                itemCategoryName: '',
                subjectIdList: [],
                payType: 1,
            },
        ];
        this.setState({
            subjectLen: tempSubjectLen,
            subjectList: [...subjectList, ...commonPaySetting],
        });
    };

    delRow = (index) => {
        if (index == 0) {
            return;
        }

        let { subjectLen, subjectList } = this.state;
        let tempSubjectLen = JSON.parse(JSON.stringify(subjectLen));
        let tempSubjectList = JSON.parse(JSON.stringify(subjectList));
        tempSubjectLen.pop();
        tempSubjectList.splice(-2);
        this.setState({
            subjectLen: tempSubjectLen,
            subjectList: tempSubjectList,
        });
    };

    changeSubject = (index, value) => {
        let tempSubjectList = JSON.parse(JSON.stringify(this.state.subjectList));
        tempSubjectList[2 * index] = {
            ...tempSubjectList[2 * index],
            subjectIdList: value,
        };
        tempSubjectList[2 * index + 1] = {
            ...tempSubjectList[2 * index + 1],
            subjectIdList: value,
        };
        this.setState({
            subjectList: tempSubjectList,
        });
    };

    changeClassPay = (index, value) => {
        const { getPayChargeItemList } = this.props;
        let newGetPayChargeItemList = uniqBy(getPayChargeItemList, 'chargeItemId');
        let tempSubjectList = JSON.parse(JSON.stringify(this.state.subjectList));
        newGetPayChargeItemList &&
            newGetPayChargeItemList.length &&
            newGetPayChargeItemList.forEach((el, ind) => {
                if (el.chargeItemId == value) {
                    tempSubjectList[2 * index] = {
                        ...tempSubjectList[2 * index],
                        ...el,
                    };
                }
            });
        console.log('tempSubjectList', tempSubjectList);
        this.setState({
            subjectList: tempSubjectList,
        });
    };

    changeMaterialPay = (index, value) => {
        const { getPayChargeItemList } = this.props;
        let newGetPayChargeItemList = uniqBy(getPayChargeItemList, 'chargeItemId');
        let tempSubjectList = JSON.parse(JSON.stringify(this.state.subjectList));
        newGetPayChargeItemList &&
            newGetPayChargeItemList.length &&
            newGetPayChargeItemList.forEach((el, ind) => {
                if (el.chargeItemId == value) {
                    tempSubjectList[2 * index + 1] = {
                        ...tempSubjectList[2 * index + 1],
                        ...el,
                    };
                }
            });
        console.log('tempSubjectList', tempSubjectList);
        this.setState({
            subjectList: tempSubjectList,
        });
    };

    changeOrderModo = (e) => {
        this.setState({
            mergeOrder: e.target.value,
        });
    };

    changeuseWallet = (e) => {
        this.setState({
            useWallet: e.target.value,
        });
    };

    changeLimitCon = (e) => {
        this.setState({
            limitCon: e.target.value,
        });
    };

    timeChange = (data, dataString) => {
        let aa = data.format('YYYY-MM-DD HH:mm');
        console.log(aa, '111');
        console.log(dataString, '222');
        this.setState({
            timeValue: moment(aa),
        });
    };

    changeClassTime = (e) => {
        this.setState({
            classTime: e.target.value,
        });
    };

    changeCheck = (e) => {
        this.setState({
            checkTimeConflict: e.target.value,
        });
    };

    addGroup = () => {
        this.setState({
            addShow: true,
        });
    };

    changeGroupName = (e) => {
        // let len = this.useCallback(e && e.target.value);
        // console.log(len, 'len')
        // if(len > 8){
        //     return
        // }else{
        //     this.setState({
        //     groupName: e.target.value,
        //     });
        // }
        this.setState({
            groupName: e.target.value,
        });
    };

    // 自定义方法判断字符是否超过八个
    useCallback = (value) => {
        console.log(value, 'value');
        let len = 0;
        for (let i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) > 127 || value.charCodeAt(i) === 94) {
                len += 2;
            } else {
                len++;
            }
        }
        return len;
    };

    submitGroup = () => {
        let tempObj = {
            groupingName: this.state.groupName,
            totalNumber: 0,
            number: 0,
        };
        this.setState(
            {
                groupDTOList: [...this.state.groupDTOList, tempObj],
            },
            () => {
                this.setState({
                    addShow: false,
                    groupName: '',
                });
            }
        );
    };

    cancelSubmit = () => {
        this.setState({
            addShow: false,
            groupName: '',
        });
    };

    changeType = (e) => {
        this.setState({
            setType: e.target.value,
        });
    };

    changeTotal = (e) => {
        let tempArr = JSON.parse(JSON.stringify(this.state.groupDTOList));
        console.log(tempArr, 'tempArr');
        tempArr &&
            tempArr.map((el, idx) => {
                console.log(el, 'el');
                el.totalNumber = e.target.value;
            });
        this.setState({
            groupDTOList: tempArr,
        });
    };

    changeGroupInfo = (e, index) => {
        let tempArr = JSON.parse(JSON.stringify(this.state.groupDTOList));
        tempArr[index].number = e.target.value;
        console.log(tempArr, 'tempArr');
        this.setState({
            groupDTOList: tempArr,
        });
    };

    delGroup = (name) => {
        let tempArr = JSON.parse(JSON.stringify(this.state.groupDTOList));
        let tempIndex = undefined;
        tempArr && tempArr.length > 0
            ? (tempIndex = tempArr.findIndex((el) => el.groupingName == name))
            : null;
        if (JSON.stringify(tempIndex) == 'undefined') {
            return false;
        }
        let tempDelObj = {};
        tempDelObj = tempArr[tempIndex];
        tempArr.splice(tempIndex, 1);
        console.log(tempArr, 'tempArr');
        this.setState({
            groupDTOList: tempArr,
            deleteGroupGroupingNumJsonDTOList: [
                ...this.state.deleteGroupGroupingNumJsonDTOList,
                tempDelObj,
            ],
        });
    };

    setTemplate = () => {
        this.setState({
            templateVisible: true,
        });
    };

    //支持复制粘贴word文档中的图片
    uploadPasteWordImg = (blobInfo, callback) => {
        let uuid = new Date().getTime();
        this.getOssAssume().then(() => {
            const { ossAssumeResult, dispatch } = this.props;
            let OSS = require('ali-oss');
            let newBinary = blobInfo.blob();
            let client = new OSS({
                region: ossAssumeResult.region,
                accessKeyId: ossAssumeResult.accessKeyId,
                accessKeySecret: ossAssumeResult.accessSecret,
                bucket: ossAssumeResult.bucketName,
                endpoint: ossAssumeResult.endpoint,
                stsToken: ossAssumeResult.stsToken,
                ossPath: ossAssumeResult.ossPath,
            });
            let newDataUrl = this.dataURLtoFile(blobInfo.base64(), newBinary.type, '');
            console.log('newDataUrl', newDataUrl);
            client
                .multipartUpload(
                    `${ossAssumeResult.ossPath}${uuid}_${blobInfo.filename()}`,
                    // newBinary,
                    newDataUrl,
                    {}
                )
                .then((response) => {
                    if (response.res && response.res.status == '200') {
                        let origin = ossAssumeResult.endpoint.split('//')[1];
                        let fileUrl = `https://${ossAssumeResult.bucketName}.${origin}/${
                            ossAssumeResult.ossPath
                        }${uuid}_${blobInfo.filename()}?x-oss-process=image/resize,w_800`;
                        typeof callback == 'function' && callback(fileUrl);
                    } else {
                        message.error('上传失败');
                    }
                })
                .catch((err) => {
                    console.log('catch_error:', err.message);
                    message.error('哎呀，oss出错了');
                });
        });
    };

    uploadMedia = (files, callback) => {
        for (let i = 0; i < files.length; i++) {
            files[i]['uuid'] = new Date().getTime() + i;
            this.readFile(files[i], (responseFile) => {
                if (responseFile['uuid'] == files[i]['uuid']) {
                    console.log('responseFile', responseFile);
                    let videoList = [
                        {
                            url: `${window.location.origin}${responseFile.url}`,
                            attr: {
                                poster: `${window.location.origin}${responseFile.previewImage}`,
                            },
                        },
                    ];
                    typeof callback == 'function' && callback.call(this, videoList);
                }
            });
        }
    };

    render() {
        const {
            allchoosePlanLists,
            teacherList,
            planningSemesterInfo,
            semesterValue,
            getLotSubjects,
            getPayChargeItemList,
            currentUser,
        } = this.props;

        let newGetPayChargeItemList = uniqBy(getPayChargeItemList, 'chargeItemId');

        let {
            name,
            ename,
            planningSchoolListInfo,
            limitCon,
            administratorIds,
            feeAdminIds,
            schoolIdList,
            schoolSectionIds,
            weekDay,
            announcement,
            startTime,
            endTime,
            allStage,
            infoStyle,
            showFee,
            timeData,
            courseStartTime,
            courseEndTime,
            declare,
            continuated,
            seleceRule,
            choosePayType,
            firstReport,
            declareSemester,
            weekOptions,
            stintSubjectNumModelList,
            filterLotSubjects,
            payloadClassObj,
            payloadMaterialObj,
            specialChecked,
            subjectList,
            subjectLen,
            mergeOrder,
            groupDTOList,
            addShow,
        } = this.state;

        const showOptions = [
            { label: trans('global.Display course fee', '展示课时费'), value: 1 },
            { label: trans('global.Display material fee', '展示材料费'), value: 2 },
        ];

        const format = 'HH:mm';

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        let { isEdit, userSchoolId } = this.props;
        const treeProps = {
            treeNodeFilterProp: 'title',
            treeCheckable: true,
        };
        const teacherProps = {
            treeData: this.formatTeacherData(teacherList),
            value: administratorIds,
            placeholder: '',
            onChange: this.changeValue.bind(this, 'administratorIds', 2),
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            ...treeProps,
        };
        const feeManageProps = {
            treeData: this.formatTeacherData(teacherList),
            value: feeAdminIds,
            placeholder: '',
            onChange: this.changeValue.bind(this, 'feeAdminIds', 3),
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            ...treeProps,
        };
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div className={styles.Step1}>
                <div className={styles.NewCreate}>
                    <div className={`${styles.item} ${styles.itemTop}`} style={{ height: '52px' }}>
                        <div className={styles.title}>
                            {trans('course.step1.stepchinese.title', '中文标题')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <Input
                            placeholder={trans(
                                'global.enter.a.title.(required)',
                                '请输入标题(必填)'
                            )}
                            value={name}
                            onChange={this.changeValue.bind(this, 'name', 1)}
                        />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('course.step1.english.title', '英文标题')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <Input
                            placeholder="Please enter the title in Englist(required)"
                            value={ename}
                            onChange={this.changeValue.bind(this, 'ename', 1)}
                        />
                    </div>
                    <div className={styles.item} style={{ height: '40px' }}>
                        <div
                            className={styles.title}
                            style={{ height: '36px', lineHeight: '36px' }}
                        >
                            {trans('course.step1.semester', '所属学期')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <Select
                            disabled={isEdit}
                            value={semesterValue}
                            style={{
                                maxWidth: 320,
                                paddingTop: 0,
                                marginTop: 0,
                            }}
                            onChange={this.props.changeSemester}
                            className={styles.box}
                            placeholder="请选择"
                        >
                            {planningSemesterInfo &&
                                planningSemesterInfo.length > 0 &&
                                planningSemesterInfo.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={item.id}>
                                            {locale() != 'en' ? (
                                                <span>
                                                    {item.schoolYearName} {item.name}
                                                </span>
                                            ) : (
                                                <span>
                                                    {item.schoolYearEname} {item.ename}
                                                </span>
                                            )}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>

                    <div className={styles.itemBox}>
                        <div
                            className={styles.title}
                            style={{ height: '45px', lineHeight: '45px' }}
                        >
                            {trans('course.step1.school.area', '所属校区')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <Checkbox.Group
                            style={{ marginTop: 0 }}
                            disabled={isEdit}
                            className={styles.box}
                            options={planningSchoolListInfo || []}
                            value={schoolIdList}
                            onChange={this.changeValue.bind(this, 'schoolIdList', 2)}
                        />
                    </div>

                    <div
                        className={`${styles.itemBox} ${styles.itemBottom}`}
                        style={{ marginBottom: 0 }}
                    >
                        <div
                            className={styles.title}
                            style={{ height: '40px', lineHeight: '40px', marginTop: '-5px' }}
                        >
                            {trans('course.step1.applicable.section', '适用学段')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <Checkbox.Group
                            style={{ paddingTop: '4px', marginTop: 0 }}
                            disabled={isEdit}
                            className={styles.box}
                            options={allStage}
                            value={schoolSectionIds}
                            onChange={this.changeValue.bind(this, 'schoolSectionIds', 2)}
                        />
                    </div>

                    <div
                        className={`${styles.itemBox} ${styles.itemBottom}`}
                        style={{ marginBottom: 0 }}
                    >
                        <div className={styles.title}>
                            {trans('course.step1.plan.administrator', '选课计划管理员')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <TreeSelect
                            className={styles.selectPlan}
                            style={{
                                width: '70%',
                                alignItems: 'center',
                                display: 'grid',
                                border: '0px',
                            }}
                            {...teacherProps}
                        />
                    </div>

                    <div className={`${styles.itemBox} ${styles.itemBottom}`}>
                        <div className={styles.title}>
                            {trans('course.step1.plan.feeManager', '费用管理员')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <TreeSelect
                            className={styles.selectPlan}
                            style={{
                                width: '70%',
                                alignItems: 'center',
                                display: 'grid',
                                border: '0px',
                            }}
                            {...feeManageProps}
                        />
                    </div>
                </div>

                <div className={styles.NewCreate}>
                    <div className={`${styles.itemBox} ${styles.itemTop}`}>
                        <div className={styles.title}>
                            {trans('course.step1.selection.declare', '课程申报')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <div className={styles.declare}>
                            <Switch
                                checked={declare}
                                onChange={this.declareChange}
                                style={{ alignSelf: 'center' }}
                            />
                            &nbsp;&nbsp;
                            {declare == true ? (
                                <RangePicker
                                    style={{ marginTop: '-3px' }}
                                    value={
                                        courseStartTime === undefined ||
                                        courseEndTime === undefined ||
                                        courseStartTime === '' ||
                                        courseEndTime === ''
                                            ? null
                                            : [
                                                  moment(courseStartTime, dateFormat),
                                                  moment(courseEndTime, dateFormat),
                                              ]
                                    }
                                    placeholder={[
                                        trans('course.step1.select.start.date', '请选择开始日期'),
                                        trans('course.step1.select.end.date', '请选择结束日期'),
                                    ]}
                                    className={`${styles.changePicker} ${styles.changePickerStep1}`}
                                    onChange={this.handleDeclare}
                                />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.NewCreate} style={{ marginTop: '-9px' }}>
                    <div
                        className={`${styles.itemBox} ${styles.itemTop}`}
                        style={{ paddingTop: '10px' }}
                    >
                        <div className={styles.title}>
                            {trans('course.step1.selection.infoStyle', '课程介绍版式')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <div>
                            <Radio.Group onChange={this.changeInfo} value={infoStyle}>
                                <Radio style={radioStyle} value={0} className={styles.infoStyle}>
                                    <span>{trans('global.Fixed Layout', '固定版式')}</span>
                                    <span style={{ margin: '0 10px', color: '#ccc' }}>
                                        {trans(
                                            'global.FixedTitle',
                                            '可分别填写招生条件、课程目标、课程内容、课前准备、师资介绍、上传图片。'
                                        )}
                                    </span>
                                    {/* <span style={{ color: 'blue' }}>版式预览</span> */}
                                </Radio>
                                <Radio style={radioStyle} value={1} className={styles.infoStyle}>
                                    <span>{trans('global.Free Layout', '自由版式')}</span>
                                    <span style={{ margin: '0 10px', color: '#ccc' }}>
                                        {trans(
                                            'global.FreeTitle',
                                            '提供富文本编辑框，自由填写课程内容，支持上传图片。'
                                        )}
                                        <span onClick={this.setTemplate} style={{ color: 'blue' }}>
                                            设置模版
                                        </span>
                                    </span>
                                    {/* <span style={{ color: 'blue' }}>版式预览</span> */}
                                </Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </div>
                <div className={styles.NewCreate}>
                    <div
                        className={`${styles.itemBox} ${styles.itemTop} ${styles.itemBottom}`}
                        style={{ marginBottom: 0 }}
                    >
                        <div className={styles.title}>
                            {trans('course.step1.selection.period', '开课周期')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <RangePicker
                            value={
                                startTime === undefined ||
                                endTime === undefined ||
                                startTime === '' ||
                                endTime === ''
                                    ? null
                                    : [moment(startTime, dateFormat), moment(endTime, dateFormat)]
                            }
                            placeholder={[
                                trans('course.step1.select.start.date', '请选择开始日期'),
                                trans('course.step1.select.end.date', '请选择结束日期'),
                            ]}
                            className={`${styles.changePicker} ${styles.changePickerStep1}`}
                            onChange={this.handlePicker}
                        />
                    </div>

                    <div
                        className={`${styles.itemBox} ${styles.itemTop}`}
                        style={{ marginTop: '-7px' }}
                    >
                        <div className={styles.title}>
                            {trans('course.step1.selection.classTime', '上课时间')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <div style={{ paddingTop: '15px' }}>
                            <Radio.Group
                                onChange={this.changeClassTime}
                                value={this.state.classTime}
                                disabled={this.props.isEdit}
                            >
                                <Radio value={1}>
                                    {trans('selCourse.setClassTime', '设置上课时间')}
                                </Radio>
                                <Radio value={2}>
                                    {trans('selCourse.noNeedToSetUp', '无需设置')}
                                </Radio>
                            </Radio.Group>
                            {this.state.classTime == 1 ? (
                                <div>
                                    <Checkbox.Group
                                        style={{ margin: '12px 0' }}
                                        value={weekDay}
                                        onChange={this.changeWeek}
                                    >
                                        {weekOptions &&
                                            weekOptions.map((item, index) => {
                                                return (
                                                    <Checkbox
                                                        value={item.value}
                                                        key={item.value}
                                                        disabled={
                                                            item.disabled ? item.disabled : false
                                                        }
                                                    >
                                                        {item.label}
                                                    </Checkbox>
                                                );
                                            })}
                                    </Checkbox.Group>
                                    <div className={styles.delPeriod}>
                                        {timeData &&
                                            timeData.map((item, index) => {
                                                return (
                                                    <p style={{ marginTop: '5px' }}>
                                                        <TimePicker
                                                            value={moment(item.startTime, format)}
                                                            onChange={(time, timeString) =>
                                                                this.changeStart(
                                                                    time,
                                                                    timeString,
                                                                    index
                                                                )
                                                            }
                                                            format={format}
                                                            allowClear={false}
                                                            minuteStep={5}
                                                        />
                                                        -
                                                        <TimePicker
                                                            format={format}
                                                            value={moment(item.endTime, format)}
                                                            onChange={(time, timeString) =>
                                                                this.changeEnd(
                                                                    time,
                                                                    timeString,
                                                                    index
                                                                )
                                                            }
                                                            allowClear={false}
                                                            minuteStep={5}
                                                        />
                                                        <Icon
                                                            style={{ marginLeft: '10px' }}
                                                            type="delete"
                                                            onClick={() => this.delData(index)}
                                                        />
                                                        {/* <Button
                                                style={{ marginLeft: '5px' }}
                                                size="small"
                                                type="danger"
                                                
                                            >
                                                删除
                                            </Button> */}
                                                    </p>
                                                );
                                            })}
                                        <span
                                            style={{ color: 'blue' }}
                                            onClick={() => this.addData()}
                                        >
                                            <Icon type="plus-circle" />
                                            <span style={{ marginLeft: '8px' }}>
                                                {trans('course.plan.addPeriod', '添加时段')}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div
                        className={`${styles.itemBox} ${styles.itemTop}`}
                        style={{ paddingBottom: 0, marginBottom: '12px' }}
                    >
                        <div className={styles.title}>
                            {trans('selCourse.classGroups', '班级分组')}
                        </div>
                        <div className={styles.classGroup}>
                            {groupDTOList &&
                                groupDTOList.map((item, index) => {
                                    return (
                                        <div className={styles.groupStyle}>
                                            <span key={index}>{item.groupingName}</span>
                                            <Icon
                                                type="close-circle"
                                                className={styles.delStyle}
                                                onClick={() => this.delGroup(item.groupingName)}
                                            />
                                        </div>
                                    );
                                })}
                            {addShow ? (
                                <>
                                    <Input
                                        maxLength={locale() != 'en' ? 4 : 8}
                                        placeholder="请输入分组名称"
                                        value={this.state.groupName}
                                        onChange={this.changeGroupName.bind(this)}
                                        style={{ width: '125px' }}
                                    />
                                    <Icon
                                        type="check-circle"
                                        onClick={this.submitGroup}
                                        style={{ fontSize: 17, color: 'blue', margin: '0 5px' }}
                                    />
                                    <Icon
                                        type="close-circle"
                                        onClick={this.cancelSubmit}
                                        style={{ fontSize: 17 }}
                                    />
                                </>
                            ) : (
                                <span style={{ color: 'blue' }} onClick={() => this.addGroup()}>
                                    <span style={{ marginLeft: '8px', cursor: 'pointer' }}>
                                        {trans('selCourse.addGroups', '添加分组')}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.NewCreate}>
                    <div
                        className={`${styles.itemBox} ${styles.itemTop}`}
                        style={{ paddingBottom: 0 }}
                    >
                        <div className={styles.title} style={{ lineHeight: '44px' }}>
                            {trans('global.Student selection rules', '选课规则')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <div>
                            <p style={{ display: 'flex', marginBottom: 0 }}>
                                <span style={{ padding: '12px' }}>
                                    {trans('global.ways of registration', '报名方式')}
                                </span>
                                <div className={styles.selectRule}>
                                    <Radio.Group onChange={this.changeRule} value={seleceRule}>
                                        <Radio value={1} className={styles.radioNo1}>
                                            <div style={{ display: 'inline-block' }}>
                                                <span>
                                                    {trans(
                                                        'global.Multiple Intentions Apply',
                                                        '志愿申报'
                                                    )}
                                                </span>
                                                <span
                                                    style={{ margin: '0 10px' }}
                                                    className={styles.detailStyle}
                                                >
                                                    {trans(
                                                        'global.MultipleTitle',
                                                        '学生可填多个志愿，后台进行志愿分配后再公布结果'
                                                    )}
                                                </span>
                                                {/* {seleceRule == 1 ? (
                                                    <span className={styles.maxReported}>
                                                        <span>每个时段最大可报志愿数量</span>
                                                        <InputNumber
                                                            min={0}
                                                            // max={2}
                                                            value={reportedMax}
                                                            onChange={this.changeMax}
                                                        />
                                                    </span>
                                                ) : (
                                                    ''
                                                )} */}
                                            </div>
                                        </Radio>

                                        <Radio
                                            style={radioStyle}
                                            value={2}
                                            className={styles.infoStyle}
                                        >
                                            <span>
                                                {trans('global.First Select First Got', '先到先得')}
                                            </span>
                                            <span
                                                style={{ margin: '0 10px' }}
                                                className={styles.detailStyle}
                                            >
                                                {trans(
                                                    'global.First SelectTit',
                                                    '当报名人数达到人数上限时，无法继续报名'
                                                )}
                                            </span>
                                        </Radio>
                                    </Radio.Group>
                                </div>
                            </p>

                            <p style={{ display: 'flex', marginBottom: 0 }}>
                                <span style={{ padding: '12px' }}>
                                    {trans('selCourse.timeConflict', '时间冲突')}
                                </span>
                                <div className={styles.selectRule}>
                                    <Radio.Group
                                        onChange={this.changeCheck}
                                        value={this.state.checkTimeConflict}
                                    >
                                        <Radio value={0} className={styles.radioNo1}>
                                            <div style={{ display: 'inline-block' }}>
                                                <span>
                                                    {trans('selCourse.notVerify', '不校验')}
                                                </span>
                                                <span
                                                    style={{ margin: '0 10px' }}
                                                    className={styles.detailStyle}
                                                >
                                                    学生家长报名时不校验时间，允许报名时间相同的课程
                                                </span>
                                            </div>
                                        </Radio>

                                        <Radio
                                            style={radioStyle}
                                            value={1}
                                            className={styles.infoStyle}
                                            disabled={this.state.classTime == 2 ? true : false}
                                        >
                                            <span>
                                                {trans(
                                                    'selCourse.checkByRelatedCourses',
                                                    '按关联课表校验'
                                                )}
                                            </span>
                                            <span
                                                style={{ margin: '0 10px' }}
                                                className={styles.detailStyle}
                                            >
                                                通过关联课表，可以实现跨选课计划、必修课和选修课联动进行时间冲突校验
                                            </span>
                                        </Radio>
                                    </Radio.Group>
                                </div>
                            </p>

                            {seleceRule === 2 ? (
                                <p className={styles.limitNumber}>
                                    <span style={{ padding: '12px' }}>
                                        {trans('global.Limited number of reports', '限报数量')}
                                    </span>
                                    <div className={styles.limitNumberItemWrapper}>
                                        {
                                            <Radio.Group
                                                onChange={this.changeType}
                                                value={this.state.setType}
                                            >
                                                <Radio value={1}>
                                                    {trans('selCourse.setUpByPacket', '按分组设置')}
                                                </Radio>
                                                <Radio value={2}>
                                                    {trans(
                                                        'selCourse.setUpBySubject',
                                                        '按学科设置'
                                                    )}
                                                </Radio>
                                            </Radio.Group>
                                        }
                                        {this.state.setType == 1 ? (
                                            <>
                                                {groupDTOList && groupDTOList.length > 0 ? (
                                                    <div>
                                                        <span className={styles.perGroupStyle}>
                                                            总数量 限报
                                                            <Input
                                                                value={
                                                                    groupDTOList &&
                                                                    groupDTOList.length > 0 &&
                                                                    groupDTOList[0].totalNumber
                                                                }
                                                                className={styles.perInputStyle}
                                                                onChange={this.changeTotal}
                                                            />
                                                            个班级
                                                        </span>
                                                        {groupDTOList.map((item, index) => {
                                                            return (
                                                                <span
                                                                    key={index}
                                                                    className={styles.perGroupStyle}
                                                                >
                                                                    {item.groupingName} 限报
                                                                    <Input
                                                                        value={item.number}
                                                                        className={
                                                                            styles.perInputStyle
                                                                        }
                                                                        onChange={(e) =>
                                                                            this.changeGroupInfo(
                                                                                e,
                                                                                index
                                                                            )
                                                                        }
                                                                    />
                                                                    个班级
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                ) : null}
                                            </>
                                        ) : (
                                            <>
                                                {stintSubjectNumModelList.map((item, key) => (
                                                    <div className={styles.limitNumberItem}>
                                                        <span>
                                                            {trans(
                                                                'global.For the following courses',
                                                                '针对以下课程'
                                                            )}
                                                        </span>
                                                        <Select
                                                            mode="multiple"
                                                            allowClear
                                                            style={{
                                                                width: '280px',
                                                            }}
                                                            placeholder="请选择"
                                                            value={item.subjectIdList}
                                                            onChange={(value) =>
                                                                this.limitCourseChange(value, key)
                                                            }
                                                        >
                                                            {getLotSubjects.map((item) => (
                                                                <Option
                                                                    key={item.id}
                                                                    value={item.id}
                                                                    disabled={flattenDeep(
                                                                        filterLotSubjects.filter(
                                                                            (_, index) =>
                                                                                index !== key
                                                                        )
                                                                    ).includes(item.id)}
                                                                >
                                                                    {locale() !== 'en'
                                                                        ? item.name
                                                                        : item.enName}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                        <span>
                                                            {trans(
                                                                'global.Maximum number',
                                                                '每个学生最多限报'
                                                            )}
                                                        </span>
                                                        <InputNumber
                                                            min={0}
                                                            value={item.number}
                                                            onChange={(value) =>
                                                                this.limitNumberChange(value, key)
                                                            }
                                                        />
                                                        {trans('global.indivual', '个')}
                                                        <PlusCircleOutlined
                                                            onClick={() =>
                                                                this.limitCourseListChange('add')
                                                            }
                                                            className={styles.limitCourseIcon}
                                                        />
                                                        <CloseCircleOutlined
                                                            onClick={() =>
                                                                this.limitCourseListChange(
                                                                    'delete',
                                                                    key
                                                                )
                                                            }
                                                            className={styles.limitCourseIcon}
                                                        />
                                                    </div>
                                                ))}
                                                <span className={styles.limitText}>
                                                    {trans(
                                                        'global.limitText',
                                                        '未设置的学科，在学生报名时无可报课程数量限制'
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </p>
                            ) : null}

                            <div>
                                <p style={{ display: 'flex', marginBottom: 0 }}>
                                    <div style={{ width: '11%', padding: '15px 12px' }}>
                                        学生家长取消限制
                                    </div>
                                    <div className={styles.selectRule}>
                                        <Radio.Group
                                            onChange={this.changeLimitCon}
                                            value={limitCon}
                                        >
                                            <Radio value={1}>仅限选课报名期间允许家长取消</Radio>

                                            <Radio value={2}>
                                                自定义家长取消的截止时间
                                                <DatePicker
                                                    disabled={limitCon != 2}
                                                    value={this.state.timeValue}
                                                    style={{ marginLeft: 10 }}
                                                    onChange={this.timeChange}
                                                    format={cutOffFormat}
                                                    showTime={{ format: 'HH:mm' }}
                                                />
                                            </Radio>
                                        </Radio.Group>
                                        <p style={{ marginTop: 2, fontSize: '8px', color: 'grey' }}>
                                            学生和家长只能取消未支付的订单，已支付的订单只能通过后台取消
                                        </p>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`${styles.itemBox} ${styles.itemTop}`}
                        style={{ paddingBottom: 0 }}
                    >
                        <div className={styles.title} style={{ lineHeight: '44px' }}>
                            {trans('tc.base.cost.setup', '收费设置')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <p style={{ display: 'flex', marginBottom: 0 }}>
                                    <span style={{ padding: '12px' }}>
                                        {trans('global.chargingMethod', '收费方式')}
                                    </span>
                                    <div className={styles.selectRule}>
                                        <Radio.Group
                                            onChange={this.changePayType}
                                            value={choosePayType}
                                        >
                                            <Radio value={0} className={styles.radioNo1}>
                                                <div style={{ display: 'inline-block' }}>
                                                    <span>
                                                        {trans('global.No charge', '不收费')}
                                                    </span>
                                                    <span
                                                        style={{ margin: '0 10px' }}
                                                        className={styles.detailStyle}
                                                    >
                                                        {trans(
                                                            'global.additional charges',
                                                            '本次选课不涉及额外收费'
                                                        )}
                                                    </span>
                                                </div>
                                            </Radio>

                                            <Radio
                                                style={radioStyle}
                                                value={1}
                                                className={styles.infoStyle}
                                            >
                                                <span>
                                                    {trans('global.unified charge', '统一收取')}
                                                </span>
                                                <span
                                                    style={{ margin: '0 10px' }}
                                                    className={styles.detailStyle}
                                                >
                                                    {trans(
                                                        'global.unified chargeTit',
                                                        '家长先提交报名，待最终选课结果确定后，在同一发起在线缴费或者线下缴费'
                                                    )}
                                                </span>
                                            </Radio>
                                            <Radio
                                                style={radioStyle}
                                                value={2}
                                                className={styles.infoStyle}
                                                disabled={seleceRule == 1 ? true : false}
                                            >
                                                <span>
                                                    {trans('global.Instant payment', '即时缴费')}
                                                </span>
                                                <span
                                                    style={{ margin: '0 10px' }}
                                                    className={styles.detailStyle}
                                                >
                                                    {trans(
                                                        'global.Instant paymentTit',
                                                        '家长先提交报名立即进行在线缴费，若在限定时间内未完成支付报名名额将释放，志愿申报不支持即时缴费'
                                                    )}
                                                </span>
                                            </Radio>
                                        </Radio.Group>
                                    </div>
                                </p>
                            </div>

                            {choosePayType == 1 ? (
                                <div>
                                    <p style={{ display: 'flex', marginBottom: 0 }}>
                                        <span style={{ padding: '12px' }}>订单模式</span>
                                        <div className={styles.selectRule}>
                                            <Radio.Group
                                                onChange={this.changeOrderModo}
                                                value={mergeOrder}
                                            >
                                                <Radio value={1} className={styles.radioNo1}>
                                                    <div style={{ display: 'inline-block' }}>
                                                        <span>合并订单</span>
                                                        <span
                                                            style={{ margin: '0 10px' }}
                                                            className={styles.detailStyle}
                                                        >
                                                            每个学生报名的所有课程合并成一个订单，家长付款时一次性合并付款
                                                        </span>
                                                    </div>
                                                </Radio>

                                                <Radio
                                                    style={radioStyle}
                                                    value={2}
                                                    className={styles.infoStyle}
                                                >
                                                    <span>分拆订单</span>
                                                    <span
                                                        style={{ margin: '0 10px' }}
                                                        className={styles.detailStyle}
                                                    >
                                                        每个课程一个订单，家长可以按订单分别付款
                                                    </span>
                                                </Radio>
                                            </Radio.Group>
                                        </div>
                                    </p>
                                </div>
                            ) : null}
                            {/* {
                                choosePayType == 2 ? <div>
                                <p style={{ display: 'flex', marginBottom: 0 }}>
                                    <span style={{ padding: '12px' }}>支付设置</span>
                                    <div className={styles.selectRule}>
                                        <Radio.Group
                                            onChange={this.changeuseWallet}
                                            value={useWallet}
                                        >
                                            <Radio value={1} className={styles.radioNo1}>
                                                <div style={{ display: 'inline-block' }}>
                                                    允许使用学生账户余额抵扣
                                                </div>
                                            </Radio>

                                            <Radio
                                                style={radioStyle}
                                                value={2}
                                                className={styles.infoStyle}
                                            >
                                                <div style={{ display: 'inline-block' }}>
                                                    不允许使用学生账户余额抵扣
                                                </div>
                                            </Radio>
                                        </Radio.Group>
                                    </div>
                                </p>
                            </div> : null
                            } */}
                            {choosePayType == 0 ? (
                                ''
                            ) : (
                                <div>
                                    <p style={{ display: 'flex', marginBottom: 0 }}>
                                        <span style={{ padding: '12px' }}>
                                            {trans('charge.items', '收费项目')}
                                        </span>
                                        <div style={{ display: 'inline-block' }}>
                                            <div
                                                className={styles.selectRule}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <div>
                                                    <Checkbox disabled={true} checked={true}>
                                                        默认规则
                                                    </Checkbox>
                                                    <div style={{ display: 'inline-block' }}>
                                                        <span>
                                                            {trans(
                                                                'global.correspond to charging',
                                                                '课时费'
                                                            )}
                                                        </span>
                                                        <Select
                                                            style={{
                                                                width: '300px',
                                                                margin: '0 10px',
                                                            }}
                                                            placeholder={trans(
                                                                'global.After school service',
                                                                '请选择'
                                                            )}
                                                            value={payloadClassObj?.chargeItemId}
                                                            onChange={this.changeClassFee}
                                                        >
                                                            {newGetPayChargeItemList.map((item) => (
                                                                <Option
                                                                    key={item.chargeItemId}
                                                                    value={item.chargeItemId}
                                                                >
                                                                    {`${
                                                                        locale() !== 'en'
                                                                            ? item.chargeItemName
                                                                            : item.chargeItemEnName
                                                                    } / ${
                                                                        locale() !== 'en'
                                                                            ? item.itemCategoryName
                                                                            : item.itemCategoryEnName
                                                                    }/${item.accountName}`}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>

                                                    <div style={{ display: 'inline-block' }}>
                                                        <span>
                                                            {trans(
                                                                'global.Material cost',
                                                                '材料费'
                                                            )}
                                                        </span>
                                                        <Select
                                                            style={{
                                                                width: '300px',
                                                                margin: '0 10px',
                                                            }}
                                                            placeholder={trans(
                                                                'global.Material service',
                                                                '请选择'
                                                            )}
                                                            value={payloadMaterialObj?.chargeItemId}
                                                            onChange={this.changeMaterialFee}
                                                        >
                                                            {newGetPayChargeItemList.map((item) => (
                                                                <Option
                                                                    key={item.chargeItemId}
                                                                    value={item.chargeItemId}
                                                                >
                                                                    {`${
                                                                        locale() !== 'en'
                                                                            ? item.chargeItemName
                                                                            : item.chargeItemEnName
                                                                    } / ${
                                                                        locale() !== 'en'
                                                                            ? item.itemCategoryName
                                                                            : item.itemCategoryEnName
                                                                    }/${item.accountName}`}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display:
                                                        currentUser.schoolId == 1 ||
                                                        currentUser.schoolId == 3300002012
                                                            ? 'inline-block'
                                                            : 'none',
                                                }}
                                            >
                                                <div style={{ margin: '10px 0 12px' }}>
                                                    <Checkbox
                                                        checked={specialChecked}
                                                        onChange={this.addSpeRules}
                                                    >
                                                        例外规则
                                                    </Checkbox>
                                                    <span>
                                                        若有个别学科需要关联到不同的收费项目，可打开进行设置，未设置的学科仍然按照默认规则走
                                                    </span>
                                                </div>
                                                {subjectLen &&
                                                    subjectLen.length &&
                                                    subjectLen.map((item, index) => {
                                                        return (
                                                            <p
                                                                style={{
                                                                    display: specialChecked
                                                                        ? 'block'
                                                                        : 'none',
                                                                }}
                                                                className={styles.specialStyle}
                                                            >
                                                                <span>学科</span>
                                                                <Select
                                                                    mode="multiple"
                                                                    allowClear
                                                                    style={{
                                                                        width: '150px',
                                                                    }}
                                                                    placeholder="请选择"
                                                                    value={
                                                                        subjectList[2 * index]
                                                                            ?.subjectIdList
                                                                    }
                                                                    onChange={(value) => {
                                                                        this.changeSubject(
                                                                            index,
                                                                            value
                                                                        );
                                                                    }}
                                                                >
                                                                    {getLotSubjects.map((item) => (
                                                                        <Option
                                                                            key={item.id}
                                                                            value={item.id}
                                                                            // disabled={flattenDeep(
                                                                            //     filterLotSubjects.filter(
                                                                            //         (_, ind) =>
                                                                            //             ind !==
                                                                            //             index
                                                                            //     )
                                                                            // ).includes(item.id)}
                                                                        >
                                                                            {locale() !== 'en'
                                                                                ? item.name
                                                                                : item.enName}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                                <div
                                                                    style={{
                                                                        display: 'inline-block',
                                                                    }}
                                                                >
                                                                    <span>
                                                                        {trans(
                                                                            'global.correspond to charging',
                                                                            '课时费'
                                                                        )}
                                                                    </span>
                                                                    <Select
                                                                        style={{
                                                                            width: '300px',
                                                                            margin: '0 10px',
                                                                        }}
                                                                        placeholder={trans(
                                                                            'global.After school service',
                                                                            '请选择'
                                                                        )}
                                                                        value={
                                                                            subjectList[2 * index]
                                                                                ?.chargeItemId
                                                                        }
                                                                        onChange={(value) => {
                                                                            this.changeClassPay(
                                                                                index,
                                                                                value
                                                                            );
                                                                        }}
                                                                    >
                                                                        {newGetPayChargeItemList.map(
                                                                            (item) => (
                                                                                <Option
                                                                                    key={
                                                                                        item.chargeItemId
                                                                                    }
                                                                                    value={
                                                                                        item.chargeItemId
                                                                                    }
                                                                                >
                                                                                    {`${
                                                                                        locale() !==
                                                                                        'en'
                                                                                            ? item.chargeItemName
                                                                                            : item.chargeItemEnName
                                                                                    } / ${
                                                                                        locale() !==
                                                                                        'en'
                                                                                            ? item.itemCategoryName
                                                                                            : item.itemCategoryEnName
                                                                                    } / ${
                                                                                        item.accountName
                                                                                    }`}
                                                                                </Option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </div>

                                                                <div
                                                                    style={{
                                                                        display: 'inline-block',
                                                                    }}
                                                                >
                                                                    <span>
                                                                        {trans(
                                                                            'global.Material cost',
                                                                            '材料费'
                                                                        )}
                                                                    </span>
                                                                    <Select
                                                                        style={{
                                                                            width: '300px',
                                                                            margin: '0 10px',
                                                                        }}
                                                                        placeholder={trans(
                                                                            'global.Material service',
                                                                            '请选择'
                                                                        )}
                                                                        value={
                                                                            subjectList[
                                                                                2 * index + 1
                                                                            ]?.chargeItemId
                                                                        }
                                                                        onChange={(value) => {
                                                                            this.changeMaterialPay(
                                                                                index,
                                                                                value
                                                                            );
                                                                        }}
                                                                    >
                                                                        {newGetPayChargeItemList.map(
                                                                            (item) => (
                                                                                <Option
                                                                                    key={
                                                                                        item.chargeItemId
                                                                                    }
                                                                                    value={
                                                                                        item.chargeItemId
                                                                                    }
                                                                                >
                                                                                    {`${
                                                                                        locale() !==
                                                                                        'en'
                                                                                            ? item.chargeItemName
                                                                                            : item.chargeItemEnName
                                                                                    } / ${
                                                                                        locale() !==
                                                                                        'en'
                                                                                            ? item.itemCategoryName
                                                                                            : item.itemCategoryEnName
                                                                                    } / ${
                                                                                        item.accountName
                                                                                    }`}
                                                                                </Option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </div>

                                                                <span
                                                                    style={{
                                                                        display:
                                                                            index ==
                                                                            subjectLen.length - 1
                                                                                ? 'inline-block'
                                                                                : 'none',
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        type="plus-circle"
                                                                        onClick={this.addRow}
                                                                        className={
                                                                            styles.limitCourseIcon
                                                                        }
                                                                    />
                                                                    <Icon
                                                                        type="close-circle"
                                                                        onClick={() =>
                                                                            this.delRow(index)
                                                                        }
                                                                        style={{
                                                                            marginLeft: '10px',
                                                                        }}
                                                                        className={
                                                                            styles.limitCourseIcon
                                                                        }
                                                                    />
                                                                </span>
                                                            </p>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`${styles.itemBox} ${styles.itemTop}`}>
                        <div
                            className={styles.title}
                            style={{ height: '45px', lineHeight: '45px' }}
                        >
                            {trans('course.step1.selection.continuation', '续课设置')}
                            <i style={{ color: 'red' }}>*</i>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className={styles.setDeclare}>
                                <Switch
                                    // defaultChecked
                                    checked={continuated}
                                    onChange={this.continuatedChange}
                                    style={{ alignSelf: 'center' }}
                                />
                                &nbsp;&nbsp;
                                {continuated == true ? (
                                    <>
                                        <Select
                                            placeholder="选择前序选课计划"
                                            // disabled={isEdit}
                                            value={declareSemester}
                                            style={{ width: 400, marginTop: '0' }}
                                            onChange={this.changeDeclareSem}
                                            className={styles.box}
                                        >
                                            {allchoosePlanLists?.choosePlanList &&
                                                allchoosePlanLists.choosePlanList.length > 0 &&
                                                allchoosePlanLists.choosePlanList.map(
                                                    (item, index) => {
                                                        return (
                                                            <Option value={item.id} key={item.id}>
                                                                {locale() != 'en' ? (
                                                                    <span>
                                                                        {item.schoolYearName}
                                                                        {item.name}
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        {item.schoolYearEname}
                                                                        {item.ename}
                                                                    </span>
                                                                )}
                                                            </Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                        &nbsp;&nbsp;
                                        <Tooltip
                                            style={{ marginTop: '10px' }}
                                            title={trans(
                                                'global.Course SetDeclareTit',
                                                '开启续课后，您可以创建续课批次，在续课批次中允许已上过前序课程的学生优先报名进阶课程，或已上过支持重复报名的课程的学生优先续课'
                                            )}
                                        >
                                            <Icon
                                                style={{ alignSelf: 'center' }}
                                                type="exclamation-circle"
                                            />
                                        </Tooltip>
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                            {continuated == true ? (
                                <div className={styles.firstDeclare}>
                                    <Checkbox defaultChecked disabled />
                                    {trans(
                                        'global.firstDeclareTit1',
                                        '允许已上过的前序课程的学生优先进阶'
                                    )}
                                    <br />
                                    <Checkbox checked={firstReport} onChange={this.isFirstReport} />
                                    {trans(
                                        'global.firstDeclareTit2',
                                        '允许已上过可重复报名的课程的学生优先续课'
                                    )}
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>

                    <div
                        className={`${styles.itemBox} ${styles.itemTop}`}
                        // style={{ paddingBottom: 0, margin: '-7px 0' }}
                        style={{ paddingBottom: 0 }}
                    >
                        <div
                            className={styles.title}
                            style={{ height: '45px', lineHeight: '45px' }}
                        >
                            {trans('course.step1.selection.showFee', '选课端费用展示')}
                        </div>
                        <div style={{ marginTop: '-5px' }}>
                            <Checkbox.Group
                                style={{ marginTop: '17px' }}
                                options={showOptions}
                                value={showFee}
                                onChange={this.changeFee}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.Announcement}>
                    <div
                        className={`${styles.itemBox} ${styles.itemTop}`}
                        style={{ paddingBottom: '12px' }}
                    >
                        <div className={styles.title}>
                            {/* {trans('course.step1.selection.announcement', '选课公告')} */}
                            报名及退费须知
                        </div>
                        <RichEditor
                            height={200}
                            placeholder={trans('global.placeholder', '请输入')}
                            language={locale() == 'en' ? 'en' : 'zh_CN'}
                            initContent={announcement}
                            uploadImage={this.uploadImage}
                            handleEditorChange={this.handleEditorChange}
                            statusbar={false}
                        />
                    </div>
                </div>

                <Modal visible={this.state.templateVisible} title='设置课程介绍模版' footer={null} onCancel={() => {
                                            this.setState({
                                                templateVisible: false,
                                            });
                                        }}>
                    <RichEditor
                        height={500}
                        placeholder="在这里请输入"
                        language={locale() == 'en' ? 'en' : 'zh_CN'}
                        initContent={this.state.freePlateContent}
                        uploadImage={this.uploadImage}
                        uploadMedia={this.uploadMedia}
                        handleEditorChange={this.handleFreeEditorChange}
                        statusbar={false}
                        uploadPasteWordImg={this.uploadPasteWordImg}
                    />
                </Modal>
            </div>
        );
    }
}

export default Step1;
