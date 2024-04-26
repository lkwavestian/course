//学校采购模块添加动态菜单配置
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import {
    Modal,
    Select,
    Form,
    Input,
    Checkbox,
    Row,
    Col,
    Button,
    message,
    Cascader,
    TimePicker,
    Icon,
    Spin,
    Radio,
    DatePicker,
    Switch,
} from 'antd';
import { trans } from '../../utils/i18n';
import lodash, { isEmpty, map } from 'lodash';
import OssButton from '../../components/UploadByOSS/ossButton';
import { getUrlSearch, delayDateList, eduBrainList } from '../../utils/utils';
import TimeSchedule from '../../components/Time/Schedule';
import ActiveMenu from '../../components/ActiveMenu/index';
import icon from '../../icon.less';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
@Form.create()
@connect((state) => ({
    // saveApplication: state.application.saveApplication,
    studentDetailInfo: state.student.studentDetailInfo,
    moduleList: state.application.moduleList,
    editDataList: state.application.editDataList,
    configCenterList: state.application.configCenterList,
    templateMenuList: state.application.templateMenuList,
    attendanceList: state.application.attendanceList,
}))
export default class Application extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            previewImage: '',
            uploadStatus: '',
            loading: false,
            defaultValue: 1,

            favicon: '',
            loginBackground: '',
            loginLogo: '',
            ccaIcon: '',
            workBackPic: '',
            chatGPTList: [], //chatGpt集合
            settingsModal: false,

            stageAttendace: '',
            carouselValue: 1,
            openStageIdList: [],
            attendanceList: [],
            lessonAuthorityList: [], //备课设置 [{stage:"" code:""}]
            currentLessonStage: 1, //备课设置当前学段
            currentLanaguage: '', //语言配置
            faceStage: '', //人脸设置中的年级
            localFaceSettings: [], //人脸设置
            stageLate: 1, // 迟到学段配置
            delayDateList: delayDateList,
            eduBrainSlideSetting: { 1: [], 2: [], 3: [], 4: [] },
            tutorEnable: false,
            leaveOutArrangement: '', // 请假配置
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'application/moduleList',
            // payload: {},
        }).then(() => {
            if (getUrlSearch('schoolId')) {
                dispatch({
                    type: 'application/editDataList',
                    payload: {
                        schoolId: getUrlSearch('schoolId'),
                    },
                }).then(() => {
                    let {
                        editDataList: {
                            registerUserName,
                            registerPhone,
                            registerQQ,
                            registerSchoolName,
                            provinceId,
                            cityId,
                            areaId,
                            studentGroupNum,
                            teacherNum,
                            stageList,
                            headUserName,
                            headUserPosition,
                            headUserPhone,
                            domainName,
                            schoolWebTitle,
                            openStageList,
                            passwordRule,
                            purchaseModuleList,
                            // configModuleGroupName,
                            logoUrl,
                            workSchoolShortName,
                            workSchoolShortEName,
                            workBackPic,

                            configCenterList,
                            informTypeList,
                            payTypeList,
                            externalSchool,

                            style,
                            favicon,
                            loginBackground,
                            loginLogo,
                            ccaIcon,

                            loginTitle,
                            schoolWebEnTitle,
                            loginEnTitle,
                            registerSchoolEnName,
                            publicBucketName,
                            privateBucketName,
                            publicBucketNameAmount,
                            privateBucketNameAmount,
                            chatGPTAmount,
                            chatGPTApiKey,
                            chatGPTList,
                            ifTopSendDingMessage,

                            topStageSetting,
                            lessonAuthorityList,
                            languageConfigCode,
                            faceSettingList,
                            lateSettingList,
                            eduBrainSlideSetting,
                            tutorEnable,
                            leaveOutArrangement,
                        },
                    } = this.props;

                    // state 取值
                    let tempEduBrainSettingList = JSON.parse(
                        JSON.stringify(this.state.eduBrainSlideSetting)
                    );

                    console.log(eduBrainSlideSetting, '11');
                    // 将服务端返回的json字符串转译
                    eduBrainSlideSetting = eduBrainSlideSetting
                        ? eval('(' + eduBrainSlideSetting + ')')
                        : [];
                    console.log(eduBrainSlideSetting, 'eduBrainSlideSetting');

                    // 将服务端返回的数据替换初始数据，没有则不执行
                    for (const index in tempEduBrainSettingList) {
                        for (const key in eduBrainSlideSetting) {
                            if (key == index) {
                                tempEduBrainSettingList[index] = eduBrainSlideSetting[key];
                            }
                        }
                    }

                    console.log(tempEduBrainSettingList, 'tempEduBrainSettingList');

                    let tempDelayList = JSON.parse(JSON.stringify(this.state.delayDateList));
                    tempDelayList.map((item, index) => {
                        item.map((element, secIndex) => {
                            lateSettingList.map((el, idx) => {
                                if (
                                    element.stage == el.stage &&
                                    element.gradeList[0] == el.gradeList[0]
                                ) {
                                    return (tempDelayList[index][secIndex] = {
                                        ...element,
                                        time: el.time,
                                    });
                                }
                            });
                        });
                    });

                    let tempChatgptList = [
                        {
                            modelCode: 'PrepareLessons',
                            modelName: 'AI备课',
                            identityType: 1,
                            usageAmount: undefined,
                            enable: 0,
                        },
                        {
                            modelCode: 'PrepareLessons',
                            modelName: 'AI备课',
                            identityType: 2,
                            usageAmount: undefined,
                            enable: 0,
                        },
                        {
                            modelCode: 'Drawing',
                            modelName: '生成图片',
                            identityType: 1,
                            usageAmount: undefined,
                            enable: 0,
                        },
                        {
                            modelCode: 'Drawing',
                            modelName: '生成图片',
                            identityType: 2,
                            usageAmount: undefined,
                            enable: 0,
                        },
                    ];
                    if (chatGPTList && chatGPTList.length && chatGPTList.length == 0) {
                        chatGPTList = tempChatgptList;
                    }

                    if (!isEmpty(openStageList)) {
                        this.setState({
                            stageAttendace: openStageList.split(',')[0],
                        });
                    }

                    this.setState({
                        previewImage: logoUrl,
                        workBackPic,
                        favicon,
                        loginBackground,
                        loginLogo,
                        ccaIcon,
                        chatGPTList,
                        lessonAuthorityList: lessonAuthorityList || [],
                        currentLanaguage: languageConfigCode || '',
                        localFaceSettings: faceSettingList || [],
                        faceStage: faceSettingList[0]?.stage || '',
                        delayDateList: tempDelayList,
                        eduBrainSlideSetting: tempEduBrainSettingList,
                        tutorEnable: tutorEnable || false,
                        leaveOutArrangement: leaveOutArrangement || '',
                    });

                    this.props.form.setFieldsValue({
                        registerUserName,
                        registerPhone,
                        registerQQ,
                        registerSchoolName,
                        schoolCampus: [String(provinceId), String(cityId), String(areaId)], //校区回显
                        studentGroupNum,
                        teacherNum,
                        stageList: stageList ? stageList.split(',') : [], //学校学段
                        headUserName,
                        headUserPosition,
                        headUserPhone,
                        logoUrl: logoUrl,
                        domainName,
                        schoolWebTitle,
                        openStageList: openStageList ? openStageList.split(',') : [],
                        passwordRule,
                        purchaseModuleList: purchaseModuleList ? purchaseModuleList.split(',') : [],
                        // configModuleGroupName: configModuleGroupName ? configModuleGroupName : '',

                        configCenterList,
                        payTypeList,
                        informTypeList,

                        style,
                        favicon,
                        loginBackground,
                        loginLogo,
                        ccaIcon,

                        loginTitle,
                        schoolWebEnTitle,
                        loginEnTitle,
                        registerSchoolEnName,
                        publicBucketName,
                        privateBucketName,
                        publicBucketNameAmount,
                        privateBucketNameAmount,

                        workSchoolShortName,
                        workSchoolShortEName,
                        workBackPic,

                        chatGPTAmount,
                        chatGPTApiKey,
                        ifTopSendDingMessage: ifTopSendDingMessage || 0,
                        topStageSetting: topStageSetting || 1,
                    });
                });
            } else {
                let tempChatgptList = [
                    {
                        modelCode: 'PrepareLessons',
                        modelName: 'AI备课',
                        identityType: 1,
                        usageAmount: undefined,
                        enable: 0,
                    },
                    {
                        modelCode: 'PrepareLessons',
                        modelName: 'AI备课',
                        identityType: 2,
                        usageAmount: undefined,
                        enable: 0,
                    },
                    {
                        modelCode: 'Drawing',
                        modelName: '生成图片',
                        identityType: 1,
                        usageAmount: undefined,
                        enable: 0,
                    },
                    {
                        modelCode: 'Drawing',
                        modelName: '生成图片',
                        identityType: 2,
                        usageAmount: undefined,
                        enable: 0,
                    },
                ];
                this.setState({
                    chatGPTList: tempChatgptList,
                });
                this.props.form.setFieldsValue({
                    chatGPTApiKey: 0,
                });
            }
        });
        this.getTemplateMenuList();
        this.getAttendanceList();
    }

    getAttendanceList = () => {
        this.props
            .dispatch({
                type: 'application/getAttendanceList',
                payload: {
                    schoolId: getUrlSearch('schoolId') || '',
                },
            })
            .then(() => {
                const { attendanceList } = this.props;
                let tempModelList = JSON.parse(JSON.stringify(attendanceList));
                tempModelList.forEach((item) => {
                    item.attendanceDTOList.forEach((el) => {
                        el.msgSendTime = el?.msgSendTime || moment().format('HH:mm:ss');
                    });
                });

                this.setState({
                    attendanceList: tempModelList,
                });
            });
    };

    //获取动态菜单
    getTemplateMenuList = () => {
        this.props.dispatch({
            type: 'application/getTemplateMenuList',
            payload: {
                schoolId: getUrlSearch('schoolId'),
            },
        });
    };

    onSubmit = (e) => {
        // e.preventDefault();
        const { form, dispatch } = this.props;
        const {
            loading,
            favicon,
            loginBackground,
            loginLogo,
            ccaIcon,
            chatGPTList,
            attendanceList,
            currentLanaguage,
            tutorEnable,
            leaveOutArrangement,
            localFaceSettings,
            delayDateList,
            eduBrainSlideSetting,
        } = this.state;

        form.validateFields((err, values) => {
            if (
                // !this.state.previewImage ||
                !this.state.workBackPic
                // !this.state.favicon ||
                // !this.state.loginBackground ||
                // !this.state.loginLogo ||
                // !this.state.ccaIcon
            ) {
                message.info('请上传图片，再提交哦~');
                return false;
            } else if (this.state.uploadStatus == 'uploading') {
                message.info('图片正在上传中，请稍等');
                return false;
            } else if (!currentLanaguage) {
                message.info('请选择双语化配置，再提交哦~');
                return false;
            }

            let tempStageList = values.openStageList;
            let tempAttList = JSON.parse(JSON.stringify(attendanceList));

            // 取消勾选学段，将取消的学段里openFlag属性全部置成false
            tempAttList.forEach((item) => {
                tempStageList.forEach((el) => {
                    if (item.stage != el) {
                        item.attendanceDTOList.forEach((element) => {
                            return {
                                ...element,
                                openFlag: false,
                            };
                        });
                    }
                });
            });

            let delayTimeList = [];
            console.log(delayDateList, '111');
            delayDateList.map((item, index) => {
                item.map((el) => {
                    if (!isEmpty(el.time)) {
                        delayTimeList.push({
                            ...el,
                        });
                    }
                });
            });

            if (!err) {
                this.setState({
                    loading: true,
                });
                dispatch({
                    type: getUrlSearch('schoolId')
                        ? 'application/updateApplication'
                        : 'application/saveApplication',
                    payload: {
                        schoolId: getUrlSearch('schoolId'),
                        registerUserName: values.registerUserName,
                        registerPhone: values.registerPhone,
                        registerQQ: values.registerQQ,
                        registerSchoolName: values.registerSchoolName,
                        provinceId:
                            values.schoolCampus &&
                            values.schoolCampus.length &&
                            values.schoolCampus[0], //省ID schoolCampus
                        cityId:
                            values.schoolCampus &&
                            values.schoolCampus.length > 1 &&
                            values.schoolCampus[1],
                        areaId:
                            values.schoolCampus &&
                            values.schoolCampus.length > 2 &&
                            values.schoolCampus[2],
                        studentGroupNum: values.studentGroupNum,
                        teacherNum: values.teacherNum,
                        stageList: values.stageList.join(), //学校学段
                        headUserName: values.headUserName,
                        headUserPosition: values.headUserPosition,
                        headUserPhone: values.headUserPhone,

                        logoUrl: this.state.previewImage,
                        workSchoolShortName: values.workSchoolShortName,
                        workSchoolShortEName: values.workSchoolShortEName,
                        workBackPic: this.state.workBackPic,
                        domainName: values.domainName,
                        schoolWebTitle: values.schoolWebTitle,
                        openStageList: values.openStageList.join(),
                        passwordRule: values.passwordRule,
                        purchaseModuleList: values.purchaseModuleList.toString(),
                        // configModuleGroupName: values.configModuleGroupName.toString(),

                        configCenterList: values.configCenterList,
                        payTypeList: values.payTypeList,
                        informTypeList: values.informTypeList,
                        externalSchool: this.props.editDataList.externalSchool,

                        style: values.style,
                        favicon,
                        loginBackground,
                        loginLogo,
                        ccaIcon,

                        loginTitle: values.loginTitle,
                        schoolWebEnTitle: values.schoolWebEnTitle,
                        loginEnTitle: values.loginEnTitle,
                        registerSchoolEnName: values.registerSchoolEnName,
                        publicBucketName: values.publicBucketName,
                        privateBucketName: values.privateBucketName,
                        publicBucketNameAmount: values.publicBucketNameAmount,
                        privateBucketNameAmount: values.privateBucketNameAmount,

                        chatGPTAmount: values.chatGPTAmount,
                        chatGPTApiKey: values.chatGPTApiKey,
                        chatGPTList,
                        ifTopSendDingMessage: values.ifTopSendDingMessage,
                        menuList: this.props.templateMenuList,

                        attendanceDTOList: tempAttList,

                        topStageSetting: values.topStageSetting,
                        lessonAuthorityList: this.state.lessonAuthorityList,
                        languageConfigCode: currentLanaguage,
                        faceSettingList: localFaceSettings,

                        lateSettingList: delayTimeList,
                        eduBrainSlideSetting,
                        tutorEnable,
                        leaveOutArrangement,
                    },
                }).then(() => {
                    message.success('提交成功');
                    this.setState({
                        loading: false,
                    });
                });
            }
        });
    };

    //文件上传
    upload = (file, key) => {
        switch (key) {
            case 1:
                this.setState({
                    previewImage: file.previewImage,
                    uploadStatus: file.status,
                });
                break;
            case 2:
                this.setState({
                    favicon: file.favicon,
                    uploadStatus: file.status,
                });
                break;
            case 3:
                this.setState({
                    loginBackground: file.loginBackground,
                    uploadStatus: file.status,
                });
                break;
            case 4:
                this.setState({
                    loginLogo: file.loginLogo,
                    uploadStatus: file.status,
                });
                break;
            case 5:
                this.setState({
                    ccaIcon: file.ccaIcon,
                    uploadStatus: file.status,
                });
            case 6:
                this.setState({
                    workBackPic: file.fileUrl,
                    uploadStatus: file.status,
                });
                break;
        }
        /**
         *file.status == "uploading",上传中逻辑判断可用此状态写
         *file.status == "done",上传成功逻辑判断可用此状态写
         *file.fileSize, 文件大小
         *file.fileName, 文件名称
         *file.uuid, 动态创建的文件唯一id
         *file.percent, 文件上传的进度
         *file.fileType, 文件类型
         *file.previewImage, 文件预览图片
         */
        console.log('file', file);
    };

    //文件上传的判断条件，如果做大小限制等操作，可用此方法
    beforeUpload = (file) => {
        if (file.size / 1024 / 1024 > 5) {
            message.info('文件大小不能超过5M哦');
            return false;
        } else {
            return true;
        }
    };

    onChange = (e) => {
        this.setState({
            defaultValue: e.target.value,
        });
    };

    changeEnable = (e, index) => {
        let tempChatgptList = JSON.parse(JSON.stringify(this.state.chatGPTList));
        tempChatgptList[index].enable = e.target.value;
        this.setState({
            chatGPTList: tempChatgptList,
        });
    };

    changeUsage = (e, index) => {
        let tempChatgptList = JSON.parse(JSON.stringify(this.state.chatGPTList));
        tempChatgptList[index].usageAmount = e.target.value;
        this.setState({
            chatGPTList: tempChatgptList,
        });
    };

    //菜单管理
    setttingMenu = (type) => {
        let formData = this.props.form.getFieldsValue();
        if (!formData.openStageList || formData.openStageList.length == 0) {
            message.info('请先选择要开通的学段哦~');
            return false;
        } else {
            this.setState({
                settingsModal: true,
                settingType: type,
            });
        }
    };

    changeAttendaceSet = (e) => {
        this.setState({
            stageAttendace: e.target.value,
        });
    };

    changeCarouse = (e) => {
        this.setState({
            carouselValue: e.target.value,
        });
    };

    //关闭菜单
    closeModal = () => {
        this.setState({
            settingsModal: false,
            settingType: '',
        });
    };

    changeSendTime = (time, name) => {
        console.log('time: ', time, time.format('HH:mm:ss'));

        const { stageAttendace, attendanceList } = this.state;
        let tempModelList = JSON.parse(JSON.stringify(attendanceList));
        let currentStageInfo = tempModelList.find((obj) => obj.stage == stageAttendace);
        let tempList = (currentStageInfo && currentStageInfo.attendanceDTOList) || [];
        let currentDetail = tempList.find((obj) => obj.attendanceName == name);

        currentDetail['msgSendTime'] = time.format('HH:mm:ss');

        // currentDetail['msgSendTime'] = time.format('HH:mm:ss');
        this.setState({
            attendanceList: tempModelList,
        });
    };

    findValueByStage = (name, type) => {
        const { stageAttendace, attendanceList } = this.state;
        let currentStageInfo = attendanceList.find((obj) => obj.stage == stageAttendace);
        let tempList = (currentStageInfo && currentStageInfo.attendanceDTOList) || [];
        let currentDetail = tempList.find((obj) => obj.attendanceName == name);

        if (type == 'msgSendTime') {
            return currentDetail?.msgSendTime || moment().format('HH:mm:ss');
        } else {
            return currentDetail[type];
        }
    };

    changeOpenOrNot = (e, name) => {
        const { stageAttendace, attendanceList } = this.state;
        let tempModelList = JSON.parse(JSON.stringify(attendanceList));
        let currentStageInfo = tempModelList.find((obj) => obj.stage == stageAttendace);
        let tempList = (currentStageInfo && currentStageInfo.attendanceDTOList) || [];
        let currentDetail = tempList.find((obj) => obj.attendanceName == name);
        currentDetail['openFlag'] = e.target.value;
        this.setState({
            attendanceList: tempModelList,
        });
    };

    renderAttendanceDetail = () => {
        const { stageAttendace } = this.state;
        return (
            <div>
                {stageAttendace && (
                    <Row>
                        {
                            <div>
                                <Col span={4} className={styles.titleStyle}>
                                    早操考勤:
                                </Col>
                                <Col span={20} className={styles.radioGroupStyle}>
                                    <>
                                        <Radio.Group
                                            onChange={(e) => this.changeOpenOrNot(e, '早操考勤')}
                                            value={this.findValueByStage('早操考勤', 'openFlag')}
                                            className={styles.radioStyle}
                                        >
                                            <Radio value={true}>开启</Radio>
                                            <Radio value={false}>不开启</Radio>
                                        </Radio.Group>
                                        <TimePicker
                                            onChange={(time) =>
                                                this.changeSendTime(time, '早操考勤')
                                            }
                                            value={moment(
                                                this.findValueByStage('早操考勤', 'msgSendTime'),
                                                'HH:mm:ss'
                                            )}
                                        />
                                    </>
                                </Col>
                            </div>
                        }

                        <div>
                            <Col span={4} className={styles.titleStyle}>
                                入校考勤:
                            </Col>
                            <Col span={20} className={styles.radioGroupStyle}>
                                <>
                                    <Radio.Group
                                        onChange={(e) => this.changeOpenOrNot(e, '入校考勤')}
                                        value={this.findValueByStage('入校考勤', 'openFlag')}
                                        className={styles.radioStyle}
                                    >
                                        <Radio value={true}>开启</Radio>
                                        <Radio value={false}>不开启</Radio>
                                    </Radio.Group>
                                    <TimePicker
                                        onChange={(time) => this.changeSendTime(time, '入校考勤')}
                                        value={moment(
                                            this.findValueByStage('入校考勤', 'msgSendTime'),
                                            'HH:mm:ss'
                                        )}
                                    />
                                </>
                            </Col>
                        </div>

                        {
                            <div>
                                <Col span={4} className={styles.titleStyle}>
                                    午休考勤:
                                </Col>
                                <Col span={20} className={styles.radioGroupStyle}>
                                    <>
                                        <Radio.Group
                                            onChange={(e) => this.changeOpenOrNot(e, '午休考勤')}
                                            value={this.findValueByStage('午休考勤', 'openFlag')}
                                            className={styles.radioStyle}
                                        >
                                            <Radio value={true}>开启</Radio>
                                            <Radio value={false}>不开启</Radio>
                                        </Radio.Group>
                                        <TimePicker
                                            onChange={(time) =>
                                                this.changeSendTime(time, '午休考勤')
                                            }
                                            value={moment(
                                                this.findValueByStage('午休考勤', 'msgSendTime'),
                                                'HH:mm:ss'
                                            )}
                                        />
                                    </>
                                </Col>
                            </div>
                        }
                        <div>
                            <Col span={4} className={styles.titleStyle}>
                                离校考勤:
                            </Col>
                            <Col span={20} className={styles.radioGroupStyle}>
                                <>
                                    <Radio.Group
                                        onChange={(e) => this.changeOpenOrNot(e, '离校考勤')}
                                        value={this.findValueByStage('离校考勤', 'openFlag')}
                                        // value={1}
                                        className={styles.radioStyle}
                                    >
                                        <Radio value={true}>开启</Radio>
                                        <Radio value={false}>不开启</Radio>
                                    </Radio.Group>
                                    <TimePicker
                                        onChange={(time) => this.changeSendTime(time, '离校考勤')}
                                        value={moment(
                                            this.findValueByStage('离校考勤', 'msgSendTime'),
                                            'HH:mm:ss'
                                        )}
                                    />
                                </>
                            </Col>
                        </div>

                        {
                            <div>
                                <Col span={4} className={styles.titleStyle}>
                                    晚自习考勤:
                                </Col>
                                <Col span={20} className={styles.radioGroupStyle}>
                                    <>
                                        <Radio.Group
                                            onChange={(e) => this.changeOpenOrNot(e, '晚自习考勤')}
                                            value={this.findValueByStage('晚自习考勤', 'openFlag')}
                                            // value={1}
                                            className={styles.radioStyle}
                                        >
                                            <Radio value={true}>开启</Radio>
                                            <Radio value={false}>不开启</Radio>
                                        </Radio.Group>
                                        <TimePicker
                                            onChange={(time) =>
                                                this.changeSendTime(time, '晚自习考勤')
                                            }
                                            value={moment(
                                                this.findValueByStage('晚自习考勤', 'msgSendTime'),
                                                'HH:mm:ss'
                                            )}
                                        />
                                    </>
                                </Col>
                            </div>
                        }

                        {
                            <div>
                                <Col span={4} className={styles.titleStyle}>
                                    宿舍考勤:
                                </Col>
                                <Col span={20} className={styles.radioGroupStyle}>
                                    <>
                                        <Radio.Group
                                            onChange={(e) => this.changeOpenOrNot(e, '宿舍考勤')}
                                            value={this.findValueByStage('宿舍考勤', 'openFlag')}
                                            // value={1}
                                            className={styles.radioStyle}
                                        >
                                            <Radio value={true}>开启</Radio>
                                            <Radio value={false}>不开启</Radio>
                                        </Radio.Group>
                                        <TimePicker
                                            onChange={(time) =>
                                                this.changeSendTime(time, '宿舍考勤')
                                            }
                                            value={moment(
                                                this.findValueByStage('宿舍考勤', 'msgSendTime'),
                                                'HH:mm:ss'
                                            )}
                                        />
                                    </>
                                </Col>
                            </div>
                        }
                    </Row>
                )}
            </div>
        );
    };

    findHaveCurrentIdentifyMenu(list, identify) {
        let result = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].menuTemplateName?.indexOf(identify) > -1) {
                result.push(list[i]);
            }
        }
        console.log(result, 'result');
        return result;
    }

    //修改一级菜单状态
    /**
     * ifChecked： 是否选中
     * item: 单项菜单的内容
     * index： 下标
     * stage: 学段
     * identify: 身份
     */
    checkFirstMenuStatus = (ifChecked, item, index, stage, identify) => {
        let templateMenuList = JSON.parse(JSON.stringify(this.props.templateMenuList));
        let allTemplateModuleList =
            templateMenuList?.length > 0
                ? templateMenuList.find((item) => item.groupControlType == this.state.settingType)
                : {};
        let menuGroupModelDTOList = allTemplateModuleList.menuGroupModelDTOList || [];
        let operationItem = menuGroupModelDTOList[index] || {}; //当前操作对象
        let subMenuModelDTOList = this.findHaveCurrentIdentifyMenu(operationItem.menuModelDTOList || [], identify); //当前操作的二级菜单
        let menuStageDTOList = operationItem.menuStageDTOList || []; //当前操作学段和身份
        let ifHaveStage = menuStageDTOList.findIndex((item) => item.stage == stage); //当前操作学段
        if (ifChecked) {
            //选中
            if (ifHaveStage > -1) {
                //存在当前学段
                let current =
                    (menuStageDTOList[ifHaveStage] && menuStageDTOList[ifHaveStage].identityList) ||
                    [];
                if (current.indexOf(identify) == -1) {
                    current.push(identify);
                }
            } else {
                //不存在学段
                menuStageDTOList.push({ stage: stage, identityList: [identify] });
            }
            //一级菜单勾选，二级菜单全部勾选
            for (let i = 0; i < subMenuModelDTOList.length; i++) {
                if (subMenuModelDTOList[i]) {
                    let subDTOList = subMenuModelDTOList[i].menuStageDTOList || [];
                    let stageIndex = subDTOList.findIndex((item) => item.stage == stage);
                    if (stageIndex > -1) {
                        //二级菜单存在当前学段
                        let subCurrent =
                            (subDTOList[stageIndex] && subDTOList[stageIndex].identityList) || [];
                        let ifSubHaveIndentify = subCurrent.indexOf(identify) == -1 ? false : true;
                        if (!ifSubHaveIndentify) {
                            subCurrent.push(identify);
                        }
                    } else {
                        //二级菜单不存在当前学段
                        subDTOList.push({ stage: stage, identityList: [identify] });
                    }
                }
            }
        } else {
            //取消选中
            if (ifHaveStage > -1) {
                //存在当前学段
                let current =
                    (menuStageDTOList[ifHaveStage] && menuStageDTOList[ifHaveStage].identityList) ||
                    [];
                if (current.indexOf(identify) > -1) {
                    current.splice(current.indexOf(identify), 1);
                }
                for (let i = 0; i < subMenuModelDTOList.length; i++) {
                    //二级菜单全部取消勾选
                    if (subMenuModelDTOList[i]) {
                        if (
                            subMenuModelDTOList[i].menuStageDTOList &&
                            subMenuModelDTOList[i].menuStageDTOList.length > 0
                        ) {
                            let stageIndex = subMenuModelDTOList[i].menuStageDTOList.findIndex(
                                (item) => item.stage == stage
                            );
                            subMenuModelDTOList[i].menuStageDTOList.splice(stageIndex, 1);
                        }
                    }
                }
            }
        }
        this.props.dispatch({
            type: 'application/saveTemplateMenuList',
            payload: templateMenuList,
        });
    };

    //修改二级菜单状态
    /**
     * ifChecked： 是否选中
     * index： 一级菜单下标
     * subIndex: 二级菜单下标
     * stage: 学段
     * identify: 身份
     */
    checkSecondMenuStatus = (ifChecked, index, subIndex, stage, identify) => {
        let templateMenuList = JSON.parse(JSON.stringify(this.props.templateMenuList));
        let allTemplateModuleList =
            templateMenuList?.length > 0
                ? templateMenuList.find((item) => item.groupControlType == this.state.settingType)
                : {};
        let menuGroupModelDTOList = allTemplateModuleList.menuGroupModelDTOList || [];
        let firstOperationItem = menuGroupModelDTOList[index] || {}; //当前一级菜单对象
        let firstMenuStageDTOList = firstOperationItem.menuStageDTOList || []; //当前一级菜单的学段和身份权限
        let secondMenuModelDTOList =
            (firstOperationItem.menuModelDTOList &&
                firstOperationItem.menuModelDTOList[subIndex]) ||
            {}; //当前二级菜单对象
        let secondMenuStageDTOList = secondMenuModelDTOList.menuStageDTOList || []; //当前二级菜单的学段和身份权限
        let ifFirstHaveStage = firstMenuStageDTOList.findIndex((item) => item.stage == stage); //当前操作一级菜单的学段
        let ifHaveStage = secondMenuStageDTOList.findIndex((item) => item.stage == stage); //当前操作的二级菜单的学段
        if (ifChecked) {
            //选中
            //一级菜单的处理
            if (ifFirstHaveStage > -1) {
                //一级菜单是否存在当前学段
                let current =
                    (firstMenuStageDTOList[ifFirstHaveStage] &&
                        firstMenuStageDTOList[ifFirstHaveStage].identityList) ||
                    [];
                if (current.indexOf(identify) == -1) {
                    current.push(identify);
                }
            } else if (ifFirstHaveStage == -1) {
                //不存在学段
                firstMenuStageDTOList.push({ stage: stage, identityList: [identify] });
            }

            //二级菜单的处理
            if (ifHaveStage > -1) {
                //存在当前学段
                let current =
                    (secondMenuStageDTOList[ifHaveStage] &&
                        secondMenuStageDTOList[ifHaveStage].identityList) ||
                    [];
                if (current.indexOf(identify) == -1) {
                    current.push(identify);
                }
            } else if (ifHaveStage == -1) {
                //不存在学段
                secondMenuStageDTOList.push({ stage: stage, identityList: [identify] });
            }
        } else {
            //取消选中
            if (ifHaveStage > -1) {
                //存在当前学段
                let current =
                    (secondMenuStageDTOList[ifHaveStage] &&
                        secondMenuStageDTOList[ifHaveStage].identityList) ||
                    [];
                if (current.indexOf(identify) > -1) {
                    current.splice(current.indexOf(identify), 1);
                }
            }
        }
        this.props.dispatch({
            type: 'application/saveTemplateMenuList',
            payload: templateMenuList,
        });
    };

    changeOpenStageList = (checkedValues) => {
        if (!this.state.stageAttendace && !isEmpty(checkedValues)) {
            this.setState({
                stageAttendace: checkedValues[0],
            });
        }
        this.setState({
            openStageIdList: checkedValues,
        });
    };

    //切换备课设置学段
    changeLessonPrepareStage = (e) => {
        let value = e.target.value;
        let lessonAuthorityList = JSON.parse(JSON.stringify(this.state.lessonAuthorityList));
        let index = lessonAuthorityList.findIndex((item) => item.stage == value);
        if (index == -1) {
            lessonAuthorityList.push({ stage: value, code: '' });
        }
        this.setState({
            lessonAuthorityList,
            currentLessonStage: value,
        });
    };

    //切换备课配置码
    changeLessonCode = (e) => {
        let value = e.target.value;
        let lessonAuthorityList = JSON.parse(JSON.stringify(this.state.lessonAuthorityList));
        if (!this.state.currentLessonStage) {
            message.info('请先选择学段，再进行配置哦~~');
            return false;
        } else {
            let index = lessonAuthorityList.findIndex(
                (item) => item.stage == this.state.currentLessonStage
            );
            if (index > -1 && lessonAuthorityList[index]) {
                lessonAuthorityList[index].code = value;
            }
        }
        this.setState({
            lessonAuthorityList,
        });
    };

    //是否开启下载水印
    changeWaterMark = (e) => {
        let lessonAuthorityList = JSON.parse(JSON.stringify(this.state.lessonAuthorityList));
        if (!this.state.currentLessonStage) {
            message.info('请先选择学段，再进行配置哦~~');
            return false;
        } else {
            let index = lessonAuthorityList.findIndex(
                (item) => item.stage == this.state.currentLessonStage
            );
            if (index > -1 && lessonAuthorityList[index]) {
                lessonAuthorityList[index].waterMark = e.target.checked;
            }
        }
        this.setState({
            lessonAuthorityList,
        });
    };

    //是否开启下载权限
    changeDowloadPermissions = (e) => {
        let lessonAuthorityList = JSON.parse(JSON.stringify(this.state.lessonAuthorityList));
        if (!this.state.currentLessonStage) {
            message.info('请先选择学段，再进行配置哦~~');
            return false;
        } else {
            let index = lessonAuthorityList.findIndex(
                (item) => item.stage == this.state.currentLessonStage
            );
            if (index > -1 && lessonAuthorityList[index]) {
                lessonAuthorityList[index].downloadPermissions = e.target.checked;
            }
        }
        this.setState({
            lessonAuthorityList,
        });
    };

    //渲染备课权限配置
    renderLessonPrepareSetting = () => {
        const { lessonAuthorityList, currentLessonStage } = this.state;
        let currentIndex = lessonAuthorityList.findIndex(
            (item) => item.stage == currentLessonStage
        );
        let currentCode = lessonAuthorityList[currentIndex]?.code || '';
        return (
            <div className={styles.lessonSetting}>
                <Radio.Group onChange={this.changeLessonCode} value={currentCode}>
                    <p className={styles.settingRow}>
                        <Radio value="Public_With_Groupcompany">
                            <span className={styles.radioText}>集团内公开</span>
                        </Radio>
                    </p>
                    <p className={styles.settingRow}>
                        <Radio value="Public_With_School">
                            <span className={styles.radioText}>校内公开</span>
                        </Radio>
                    </p>
                    <p className={styles.settingRow}>
                        <Radio value="Public_With_Stage">
                            <span className={styles.radioText}>学段内公开</span>
                        </Radio>
                    </p>
                    <p className={styles.settingRow}>
                        <Radio value="Public_Within_SchoolAndSubject">
                            <span className={styles.radioText}>校内学科公开</span>
                        </Radio>
                    </p>
                    <p className={styles.settingRow}>
                        <Radio value="Public_With_StageAndSubject">
                            <span className={styles.radioText}>学段内学科公开</span>
                        </Radio>
                    </p>
                    <p className={styles.settingRow}>
                        <Radio value="Public_With_Course">
                            <span className={styles.radioText}>备课组（课程级别）公开</span>
                        </Radio>
                    </p>
                </Radio.Group>
                <p>
                    <Checkbox
                        checked={lessonAuthorityList[currentIndex]?.waterMark || false}
                        onChange={this.changeWaterMark}
                    >
                        <span className={styles.radioText}>开启下载添加水印</span>
                    </Checkbox>
                </p>
                <p>
                    <Checkbox
                        checked={lessonAuthorityList[currentIndex]?.downloadPermissions || false}
                        onChange={this.changeDowloadPermissions}
                    >
                        <span className={styles.radioText}>开启下载权限</span>
                    </Checkbox>
                </p>
            </div>
        );
    };

    //切换语言配置
    changeLanguageSetting = (e) => {
        this.setState({
            currentLanaguage: e.target.value,
        });
    };

    // 迟到学段配置
    changeLateSet = (e) => {
        this.setState({
            stageLate: e.target.value,
        });
    };

    // 迟到学段配置
    changeTutorEnable = (e) => {
        this.setState({
            tutorEnable: e.target.value,
        });
    };

    // 请假配置
    changeLeaveArrangement = (e) => {
        this.setState({
            leaveOutArrangement: e.target.value,
        });
    };

    //切换人脸设置学段
    changeFaceStage = (e) => {
        this.setState({
            faceStage: e.target.value,
        });
    };

    //选择人脸设置的开启状态 & 家长联系人状态
    changeFaceOpenStatus = (parentIndex, childrenIndex, property, value) => {
        let localFaceSettings = JSON.parse(JSON.stringify(this.state.localFaceSettings));
        let gradeList = localFaceSettings[parentIndex].gradeList || [];
        let currentGrade = gradeList[childrenIndex] || {};
        currentGrade[property] = value;
        this.setState({
            localFaceSettings,
        });
    };

    //选择人脸开始结束时间
    changeFaceTime = (parentIndex, childrenIndex, date, dateString) => {
        let startTime = dateString[0],
            endTime = dateString[1];
        let localFaceSettings = JSON.parse(JSON.stringify(this.state.localFaceSettings));
        let gradeList = localFaceSettings[parentIndex].gradeList || [];
        let currentGrade = gradeList[childrenIndex] || {};
        currentGrade['startTime'] = startTime;
        currentGrade['endTime'] = endTime;
        this.setState({
            localFaceSettings,
        });
    };

    //人脸模板配置
    renderFaceSettings = () => {
        const { localFaceSettings, faceStage } = this.state;
        let list = localFaceSettings || [];
        let currentStageIndex = list.findIndex((item) => item.stage == faceStage);
        let gradeList = list[currentStageIndex]?.gradeList || [];
        return (
            <>
                <div style={{ marginLeft: 117 }}>
                    <Radio.Group onChange={this.changeFaceStage} value={faceStage}>
                        {list.map((item) => {
                            return (
                                <Radio value={item.stage} key={item.stage}>
                                    <span className={styles.radioText}>{item.stageName}</span>
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </div>
                {gradeList.length > 0
                    ? gradeList.map((item, index) => {
                        return (
                            <Row key={index} style={{ marginTop: 12 }}>
                                <Col span={4} className={styles.titleStyle}>
                                    {item.gradeName}：
                                </Col>
                                <Col span={20} className={styles.radioGroupStyle}>
                                    <Radio.Group
                                        onChange={(e) =>
                                            this.changeFaceOpenStatus(
                                                currentStageIndex,
                                                index,
                                                'openFlag',
                                                e.target.value
                                            )
                                        }
                                        value={item.openFlag}
                                        className={styles.radioStyle}
                                    >
                                        <Radio value={true}>开启</Radio>
                                        <Radio value={false}>不开启</Radio>
                                    </Radio.Group>
                                    <RangePicker
                                        style={{ width: 400 }}
                                        showTime={{ format: 'HH:mm:ss' }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        onChange={(date, dateString) =>
                                            this.changeFaceTime(
                                                currentStageIndex,
                                                index,
                                                date,
                                                dateString
                                            )
                                        }
                                        value={[
                                            item.startTime
                                                ? moment(item.startTime, 'YYYY-MM-DD HH:mm:ss')
                                                : null,
                                            item.endTime
                                                ? moment(item.endTime, 'YYYY-MM-DD HH:mm:ss')
                                                : null,
                                        ]}
                                    />
                                    <span
                                        className={styles.radioText}
                                        style={{ margin: '0 5px 0 12px' }}
                                    >
                                        【关联家长联系方式:
                                    </span>
                                    <Switch
                                        checked={item.parentsAddContactsFlag}
                                        onChange={(checked) =>
                                            this.changeFaceOpenStatus(
                                                currentStageIndex,
                                                index,
                                                'parentsAddContactsFlag',
                                                checked
                                            )
                                        }
                                        style={{ marginLeft: 15, marginRight: 2 }}
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                    />
                                    】
                                </Col>
                            </Row>
                        );
                    })
                    : null}
            </>
        );
    };

    //考勤迟到配置
    renderDelayDetail = () => {
        const { stageLate } = this.state;
        return this.state.delayDateList[stageLate - 1].map((item, index) => {
            return (
                <Row>
                    <Col span={4} className={styles.titleStyle}>
                        {item.name}：
                    </Col>
                    <Col span={20} className={styles.radioGroupStyle}>
                        {/* <Radio.Group>
                            <Radio value={true}>开启</Radio>
                            <Radio value={false}>不开启</Radio>
                        </Radio.Group> */}
                        <TimePicker
                            onChange={(time, timeString) =>
                                this.changeDelayTime(stageLate - 1, index, time, timeString)
                            }
                            value={item.time ? moment(item.time, 'HH:mm') : null}
                            format="HH:mm"
                        />
                    </Col>
                </Row>
            );
        });
    };

    // 教育大脑轮播设置
    renderCarouseSettingDetail = () => {
        const { eduBrainSlideSetting, carouselValue } = this.state;
        return (
            <Checkbox.Group
                value={eduBrainSlideSetting[carouselValue]}
                style={{ width: '600px', marginLeft: '117px' }}
                onChange={(value) => this.changeCarouseList(value, carouselValue)}
            >
                <Row>
                    {eduBrainList.map((item, index) => {
                        return (
                            <Col span={6}>
                                <Checkbox value={item.key} key={item.key}>
                                    {item.label}
                                </Checkbox>
                            </Col>
                        );
                    })}
                </Row>
            </Checkbox.Group>
        );
    };

    // 更改考勤迟到时间
    changeDelayTime = (index, idx, time, timeString) => {
        let tempDelayList = JSON.parse(JSON.stringify(this.state.delayDateList));
        tempDelayList[index][idx] = {
            ...tempDelayList[index][idx],
            time: timeString,
        };
        this.setState({
            delayDateList: tempDelayList,
        });
    };

    // 根据学段更改教育大脑轮播设置
    changeCarouseList = (list, index) => {
        let tempList = JSON.parse(JSON.stringify(this.state.eduBrainSlideSetting));
        tempList[index] = list;
        this.setState({
            eduBrainSlideSetting: tempList,
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
            studentDetailInfo,
            moduleList,
            configCenterList,
            templateMenuList, //动态菜单
        } = this.props;
        const { loading, defaultValue, chatGPTList } = this.state;
        let formData = this.props.form.getFieldsValue();
        let openStage = formData.openStageList || []; //开通学段
        let allTemplateModuleList =
            templateMenuList?.length > 0
                ? templateMenuList.find((item) => item.groupControlType == this.state.settingType)
                : {};
        let frontMenu =
            templateMenuList.find((item) => item.groupControlType == 1)?.menuGroupModelDTOList ||
            [];
        let backMenu =
            templateMenuList.find((item) => item.groupControlType == 2)?.menuGroupModelDTOList ||
            [];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        let info = studentDetailInfo || {};
        //处理省市区数据
        const handleProvinceData = (arr) => {
            if (!arr || arr.length == 0) return;
            arr.map((item) => {
                item.value = `${item.code}`;
                item.children = handleProvinceData(item.children);
            });
            return arr;
        };
        const provinceList = district;
        const province = handleProvinceData(provinceList) || [];
        return (
            <Spin tip="正在提交中..." spinning={loading}>
                <div className={styles.content}>
                    <p className={styles.header}>
                        <span>
                            {trans('global.Applicant related information', '申请人相关信息')}
                        </span>
                        <span style={{ color: 'red' }}>
                            {trans(
                                'global.titInformation',
                                '（请确保信息的真实有效，否则申请无效）'
                            )}
                        </span>
                    </p>
                    <Form {...formItemLayout}>
                        <Form.Item label={trans('global.registerUserName', '申请人姓名:')}>
                            {getFieldDecorator('registerUserName', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseRegisterUserName',
                                            '请输入姓名'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseRegisterUserName',
                                        '请输入姓名'
                                    )}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*学生申请无效</span>
                        </Form.Item>
                        <Form.Item label={trans('global.registerPhone', '联系手机：')}>
                            {getFieldDecorator('registerPhone', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseRegisterPhone',
                                            '请输入手机号'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseRegisterPhone',
                                        '请输入手机号'
                                    )}
                                    maxLength={11}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*建议填写您的手机，便于我方联系确认</span>
                        </Form.Item>
                        <Form.Item label={trans('global.registerQQ', '申请人QQ：')}>
                            {getFieldDecorator('registerQQ', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans('global.pleaseRegisterQQ', '请输入QQ号'),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans('global.pleaseRegisterQQ', '请输入QQ号')}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*必填通信工具，更方便解决问题</span>
                        </Form.Item>
                    </Form>
                    <p className={styles.header}>
                        <span>学校相关信息</span>
                        <span style={{ color: 'red' }}>（请确保信息的真实有效，否则申请无效）</span>
                    </p>
                    <Form {...formItemLayout}>
                        <Form.Item label={trans('global.registerSchoolName', '学校名称：')}>
                            {getFieldDecorator('registerSchoolName', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseRegisterSchoolName',
                                            '请输入学校名称'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseRegisterSchoolName',
                                        '请输入学校名称'
                                    )}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*贵校的名称，请勿缩写</span>
                        </Form.Item>

                        <Form.Item label={trans('global.registerSchoolEnName', '学校英文名称：')}>
                            {getFieldDecorator('registerSchoolEnName', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseRegisterSchoolEnName',
                                            '请输入学校英文名称'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseRegisterSchoolEnName',
                                        '请输入学校英文名称'
                                    )}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*贵校的英文名称，请勿缩写</span>
                        </Form.Item>

                        <Form.Item label={trans('global.schoolCampus', '学校所在校区：')}>
                            {getFieldDecorator('schoolCampus', {
                                // initialValue: info.birthdayAddressId
                                //     ? info.birthdayAddressId.split('-')
                                //     : [],
                                rules: [
                                    {
                                        required: false,
                                        message: trans(
                                            'global.pleaseSchoolCampus',
                                            '请选择学校所在校区'
                                        ),
                                    },
                                ],
                            })(
                                <Cascader
                                    options={province}
                                    placeholder={trans(
                                        'global.pleaseSchoolCampus',
                                        '请选择学校所在校区'
                                    )}
                                    className={styles.provinceStyle}
                                    showSearch={true}
                                    // onChange={onChangeBorn}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*需选择到”区或县“</span>
                        </Form.Item>
                        <Form.Item label={trans('global.studentGroupNum', '学校班级数目：')}>
                            {getFieldDecorator('studentGroupNum', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseStudentGroupNum',
                                            '请输入贵校班级数目'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseStudentGroupNum',
                                        '请输入贵校班级数目'
                                    )}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*贵校班级数目，只能填数字</span>
                        </Form.Item>
                        <Form.Item label={trans('global.teacherNum', '学校老师人数：')}>
                            {getFieldDecorator('teacherNum', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseTeacherNum',
                                            '请输入贵校老师人数'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseTeacherNum',
                                        '请输入贵校老师人数'
                                    )}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*贵校老师数目，只能填数字</span>
                        </Form.Item>
                        <Form.Item label={trans('global.stageList', '学校学段：')}>
                            {getFieldDecorator('stageList', {
                                // initialValue: ['1', '3'],
                                rules: [
                                    {
                                        required: true,
                                        message: trans('global.pleaseStageList', '请选择学校学段'),
                                    },
                                ],
                            })(
                                <Checkbox.Group style={{ width: '100%' }}>
                                    <Row>
                                        <Col span={4}>
                                            <Checkbox value="1">幼儿园</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="2">小学</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="3">初中</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="4">高中</Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            )}
                        </Form.Item>
                        <Form.Item label={trans('global.headUserName', '负责人姓名：')}>
                            {getFieldDecorator('headUserName', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseHeadUserName',
                                            '请输入贵校负责人姓名'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseHeadUserName',
                                        '请输入贵校负责人姓名'
                                    )}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*负责学校教务的主人或者校长</span>
                        </Form.Item>
                        <Form.Item label={trans('global.headUserPosition', '负责人职务：')}>
                            {getFieldDecorator('headUserPosition', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseHeadUserPosition',
                                            '请输入贵校负责人职务'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseHeadUserPosition',
                                        '请输入贵校负责人职务'
                                    )}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*如教务主任、校长</span>
                        </Form.Item>
                        <Form.Item label={trans('global.headUserPhone', '负责人电话：')}>
                            {getFieldDecorator('headUserPhone', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseHeadUserPhone',
                                            '请输入贵校负责人电话'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseHeadUserPhone',
                                        '请输入贵校负责人电话'
                                    )}
                                    maxLength={11}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*请填写手机或固定电话（注明区号，分机）</span>
                        </Form.Item>
                        <Form.Item label={trans('global.loginTitle', '登录标题：')}>
                            {getFieldDecorator('loginTitle', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans('global.pleaseLoginTitle', '请输入登录标题'),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans('global.pleaseLoginTitle', '请输入登录标题')}
                                    // maxLength={11}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*请填写登录标题</span>
                        </Form.Item>

                        <Form.Item label={trans('global.loginEnTitle', '英文登录标题：')}>
                            {getFieldDecorator('loginEnTitle', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'global.pleaseLoginEnTitle',
                                            '请输入英文登录标题'
                                        ),
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={trans(
                                        'global.pleaseLoginEnTitle',
                                        '请输入英文登录标题'
                                    )}
                                    // maxLength={11}
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*请填写英文登录标题</span>
                        </Form.Item>
                    </Form>

                    <Form {...formItemLayout}>
                        <Form.Item
                            label={
                                <span>
                                    {/* <em className={styles.requiredIcon}>*</em> */}
                                    {trans('global.Logo', '学校Logo：')}
                                </span>
                            }
                        >
                            {getFieldDecorator('Logo')(
                                <div className={styles.customUpload}>
                                    <OssButton
                                        onChange={(file) => this.upload(file, 1)}
                                        acceptType=".jpg, .png"
                                        singleUpload={true}
                                    >
                                        {this.state.previewImage ? (
                                            <img
                                                src={this.state.previewImage}
                                                className={styles.logo}
                                            />
                                        ) : (
                                            <span className={styles.button}>
                                                <Icon type="plus" />
                                            </span>
                                        )}
                                    </OssButton>
                                </div>
                            )}
                            <span>*50px*50px，png,jpg格式，不超过5M</span>
                        </Form.Item>
                        <Form.Item
                            label={
                                <span>
                                    {/* <em className={styles.requiredIcon}>*</em> */}
                                    {trans('global.favicon', '网站图标：')}
                                </span>
                            }
                        >
                            {getFieldDecorator('favicon')(
                                <div className={styles.customUpload}>
                                    <OssButton
                                        onChange={(file) => this.upload(file, 2)}
                                        acceptType=".jpg, .png"
                                        singleUpload={true}
                                    >
                                        {this.state.favicon ? (
                                            <img src={this.state.favicon} className={styles.logo} />
                                        ) : (
                                            <span className={styles.button}>
                                                <Icon type="plus" />
                                            </span>
                                        )}
                                    </OssButton>
                                </div>
                            )}
                            <span>*50px*50px，png,jpg格式，不超过5M</span>
                        </Form.Item>
                        <Form.Item
                            label={
                                <span>
                                    {/* <em className={styles.requiredIcon}>*</em> */}
                                    {trans('global.loginBackground', '登录背景：')}
                                </span>
                            }
                        >
                            {getFieldDecorator('loginBackground')(
                                <div className={styles.customUpload}>
                                    <OssButton
                                        onChange={(file) => this.upload(file, 3)}
                                        acceptType=".jpg, .png"
                                        singleUpload={true}
                                    >
                                        {this.state.loginBackground ? (
                                            <img
                                                src={this.state.loginBackground}
                                                className={styles.logo}
                                            />
                                        ) : (
                                            <span className={styles.button}>
                                                <Icon type="plus" />
                                            </span>
                                        )}
                                    </OssButton>
                                </div>
                            )}
                            <span>*50px*50px，png,jpg格式，不超过5M</span>
                        </Form.Item>
                        <Form.Item
                            label={
                                <span>
                                    {/* <em className={styles.requiredIcon}>*</em> */}
                                    {trans('global.loginLogo', '登录Logo：')}
                                </span>
                            }
                        >
                            {getFieldDecorator('loginLogo')(
                                <div className={styles.customUpload}>
                                    <OssButton
                                        onChange={(file) => this.upload(file, 4)}
                                        acceptType=".jpg, .png"
                                        singleUpload={true}
                                    >
                                        {this.state.loginLogo ? (
                                            <img
                                                src={this.state.loginLogo}
                                                className={styles.logo}
                                            />
                                        ) : (
                                            <span className={styles.button}>
                                                <Icon type="plus" />
                                            </span>
                                        )}
                                    </OssButton>
                                </div>
                            )}
                            <span>*50px*50px，png,jpg格式，不超过5M</span>
                        </Form.Item>
                        <Form.Item
                            label={
                                <span>
                                    {/* <em className={styles.requiredIcon}>*</em> */}
                                    {trans('global.customUpload', '选课Logo：')}
                                </span>
                            }
                        >
                            {getFieldDecorator('ccaIcon')(
                                <div className={styles.customUpload}>
                                    <OssButton
                                        onChange={(file) => this.upload(file, 5)}
                                        acceptType=".jpg, .png"
                                        singleUpload={true}
                                    >
                                        {this.state.ccaIcon ? (
                                            <img src={this.state.ccaIcon} className={styles.logo} />
                                        ) : (
                                            <span className={styles.button}>
                                                <Icon type="plus" />
                                            </span>
                                        )}
                                    </OssButton>
                                </div>
                            )}
                            <span>*50px*50px，png,jpg格式，不超过5M</span>
                        </Form.Item>
                        <Form.Item label={trans('global.style', '网站CSS样式定制：')}>
                            {getFieldDecorator('style', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请填写网站CSS样式定制',
                                    },
                                ],
                            })(
                                <TextArea
                                    placeholder="请填写网站CSS样式定制(<style>.nav { color: 'red' }</style>)"
                                    autoSize
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*网站CSS样式定制</span>
                        </Form.Item>
                        <Form.Item label={trans('global.domainName', '学校域名：')}>
                            {getFieldDecorator('domainName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入学校域名',
                                    },
                                ],
                            })(
                                <Input
                                    placeholder="请输入学校域名"
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*学校域名</span>
                        </Form.Item>
                        <Form.Item label={trans('global.schoolWebTitle', '学校网页Title：')}>
                            {getFieldDecorator('schoolWebTitle', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入学校网页Title',
                                    },
                                ],
                            })(
                                <Input
                                    placeholder="请输入学校网页Title"
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*学校网页Title</span>
                        </Form.Item>

                        <Form.Item label={trans('global.schoolWebEnTitle', '英文学校网页Title：')}>
                            {getFieldDecorator('schoolWebEnTitle', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入英文学校网页Title',
                                    },
                                ],
                            })(
                                <Input
                                    placeholder="请输入英文学校网页Title"
                                    style={{ width: '400px', marginRight: '20px' }}
                                />
                            )}
                            <span>*英文学校网页Title</span>
                        </Form.Item>

                        <Form.Item label={trans('global.openStageList', '开通学段：')}>
                            {getFieldDecorator('openStageList', {
                                // initialValue: ['1', '3'],
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择开通学段',
                                    },
                                ],
                            })(
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                    onChange={this.changeOpenStageList}
                                >
                                    <Row>
                                        <Col span={4}>
                                            <Checkbox value="1">幼儿园</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="2">小学</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="3">初中</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="4">高中</Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            )}
                        </Form.Item>
                        <Form.Item label={trans('global.passwordRule', '密码生成规则：')}>
                            {getFieldDecorator('passwordRule', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择密码生成规则',
                                    },
                                ],
                            })(
                                <Radio.Group>
                                    <Radio value="last6IdentityCard">身份证后六位</Radio>
                                    <Radio value="last6PhoneNum">手机号后六位</Radio>
                                    <Radio value="emailPrefix">邮箱前缀</Radio>
                                    <Radio value="excelInit">初始化指定</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item label={trans('global.informTypeList', '通知方式：')}>
                            {getFieldDecorator('informTypeList', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择通知方式',
                                    },
                                ],
                            })(
                                // <Radio.Group>
                                //     <Radio value="INFORM_SHORT_MESSAGE">短信</Radio>
                                //     <Radio value="INFORM_WE_CHAT">微信</Radio>
                                //     <Radio value="INFORM_EMAIL">邮件</Radio>
                                //     <Radio value="INFORM_DING_DING">钉钉</Radio>
                                // </Radio.Group>
                                <Checkbox.Group style={{ width: '100%' }}>
                                    <Row>
                                        <Col span={4}>
                                            <Checkbox value="INFORM_SHORT_MESSAGE">短信</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="INFORM_WE_CHAT">微信</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="INFORM_EMAIL">邮件</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="INFORM_DING_DING">钉钉</Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            )}
                        </Form.Item>
                        <Form.Item label={trans('global.payTypeList', '支付方式：')}>
                            {getFieldDecorator('payTypeList', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择支付方式',
                                    },
                                ],
                            })(
                                <Checkbox.Group style={{ width: '100%' }}>
                                    <Row>
                                        <Col span={4}>
                                            <Checkbox value="PAY_ALIPAY">支付宝</Checkbox>
                                        </Col>
                                        <Col span={4}>
                                            <Checkbox value="PAY_WE_CHAT">微信</Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            )}
                        </Form.Item>

                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            容量管理:
                        </p>
                        <Form {...formItemLayout}>
                            <Form.Item
                                label={trans('global.publicBucketName', '文件上传公读BucketID')}
                            >
                                {getFieldDecorator('publicBucketName', {
                                    rules: [
                                        {
                                            required: false,
                                            // message: '请输入学校域名',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入文件上传私读BucketID"
                                        style={{ width: '400px', marginRight: '20px' }}
                                    />
                                )}
                                <span>创建</span>
                            </Form.Item>
                            <Form.Item
                                label={trans('global.privateBucketName', '文件上传私读BucketID')}
                            >
                                {getFieldDecorator('privateBucketName', {
                                    rules: [
                                        {
                                            required: false,
                                            // message: '请输入学校域名',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入文件上传私读BucketID"
                                        style={{ width: '400px', marginRight: '20px' }}
                                    />
                                )}
                                <span>创建</span>
                            </Form.Item>
                            <Form.Item label={trans('global.publicBucketNameAmount', '校级总容量')}>
                                {getFieldDecorator('publicBucketNameAmount', {
                                    rules: [
                                        {
                                            required: false,
                                            // message: '请输入学校域名',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入校级总容量"
                                        style={{ width: '400px', marginRight: '20px' }}
                                    />
                                )}
                                <span>GB</span>
                            </Form.Item>
                            <Form.Item
                                label={trans('global.privateBucketNameAmount', '老师备课个人容量')}
                            >
                                {getFieldDecorator('privateBucketNameAmount', {
                                    rules: [
                                        {
                                            required: false,
                                            // message: '请输入学校域名',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入老师备课个人容量"
                                        style={{ width: '400px', marginRight: '20px' }}
                                    />
                                )}
                                <span>GB</span>
                            </Form.Item>
                        </Form>

                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            教师工作台:
                        </p>
                        <Form {...formItemLayout}>
                            <Form.Item
                                label={trans('global.registerSchoolCnName', '学校中文简称：')}
                            >
                                {getFieldDecorator('workSchoolShortName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans(
                                                'global.pleaseRegisterSchoolName',
                                                '请输入学校名称'
                                            ),
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder={trans(
                                            'global.pleaseRegisterSchoolName',
                                            '请输入学校名称'
                                        )}
                                        style={{ width: '400px', marginRight: '20px' }}
                                    />
                                )}
                                <span>*贵校的名称，请勿缩写</span>
                            </Form.Item>

                            <Form.Item
                                label={trans('global.schoolEnAbbreviation', '学校英文简称：')}
                            >
                                {getFieldDecorator('workSchoolShortEName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans(
                                                'global.pleaseRegisterSchoolEnName',
                                                '请输入学校英文名称'
                                            ),
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder={trans(
                                            'global.pleaseRegisterSchoolEnName',
                                            '请输入学校英文名称'
                                        )}
                                        style={{ width: '400px', marginRight: '20px' }}
                                    />
                                )}
                                <span>*贵校的英文名称，请勿缩写</span>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <span>
                                        <em className={styles.requiredIcon}>*</em>
                                        {trans('global.workLogo', '工作台Logo：')}
                                    </span>
                                }
                            >
                                {getFieldDecorator('workBackPic')(
                                    <div className={styles.customUpload}>
                                        <OssButton
                                            onChange={(file) => this.upload(file, 6)}
                                            acceptType=".jpg, .png"
                                            singleUpload={true}
                                        >
                                            {this.state.workBackPic ? (
                                                <img
                                                    src={this.state.workBackPic}
                                                    className={styles.logo}
                                                />
                                            ) : (
                                                <span className={styles.button}>
                                                    <Icon type="plus" />
                                                </span>
                                            )}
                                        </OssButton>
                                    </div>
                                )}
                                <span>*50px*50px，png,jpg格式，不超过5M</span>
                            </Form.Item>
                            <Form.Item label="头条消息定时推送:">
                                {getFieldDecorator('ifTopSendDingMessage', {
                                    rules: [
                                        {
                                            required: false,
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value={1}>已开启</Radio>
                                        <Radio value={0}>未开启</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                            <Form.Item label="头条分学段展示:">
                                {getFieldDecorator('topStageSetting', {
                                    rules: [
                                        {
                                            required: false,
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value={1}>全学段</Radio>
                                        <Radio value={2}>分学段</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Form>

                        {moduleList &&
                            moduleList.length > 0 &&
                            moduleList.map((item, index) => {
                                if (item.sysGroupName == '配置中心') {
                                    //去掉配置中心
                                    return null;
                                } else {
                                    return (
                                        <div>
                                            <p
                                                className={styles.header}
                                                style={{ color: '#0445FC' }}
                                            >
                                                <span>
                                                    <em className={styles.requiredIcon}>*</em>
                                                </span>
                                                {item.sysGroupName}:
                                            </p>
                                            <Form.Item className={styles.moduleContent}>
                                                {getFieldDecorator(
                                                    item.sysGroupName == '配置中心'
                                                        ? 'configCenterList'
                                                        : item.sysGroupName == '学校采购的模块'
                                                            ? 'purchaseModuleList'
                                                            : '',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    item.sysGroupName == '配置中心'
                                                                        ? '请选择配置中心内容'
                                                                        : item.sysGroupName ==
                                                                            '学校采购的模块'
                                                                            ? '请选择学校采购的模块内容'
                                                                            : /* item.sysGroupName ==
                                                                          '校级权限配置'
                                                                        ? '请选择校级配置权限'
                                                                        :  */ '',
                                                            },
                                                        ],
                                                    }

                                                )(
                                                    <Checkbox.Group style={{ width: '100%' }}>
                                                        {item.schoolConfigModuleGroupVOList &&
                                                            item.schoolConfigModuleGroupVOList
                                                                .length > 0 &&
                                                            item.schoolConfigModuleGroupVOList.map(
                                                                (el, order) => {
                                                                    if (
                                                                        el.configModuleGroupName ==
                                                                        '教育大脑' ||
                                                                        el.configModuleGroupName ==
                                                                        '在线备课权限配置' ||
                                                                        el.configModuleGroupName ==
                                                                        '智能硬件'
                                                                    ) {
                                                                        return (
                                                                            <div
                                                                                className={
                                                                                    styles.moduleList
                                                                                }
                                                                            >
                                                                                <span
                                                                                    style={{
                                                                                        display:
                                                                                            'block',
                                                                                        width:
                                                                                            el.metaDataConfigModuleDOList &&
                                                                                                el
                                                                                                    .metaDataConfigModuleDOList
                                                                                                    .length >
                                                                                                4
                                                                                                ? 170
                                                                                                : 'auto',
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        el.configModuleGroupName
                                                                                    }
                                                                                    ：
                                                                                </span>
                                                                                <Row type="flex">
                                                                                    {el.metaDataConfigModuleDOList.map(
                                                                                        (list) => (
                                                                                            <Col
                                                                                                style={{
                                                                                                    marginRight:
                                                                                                        '39px',
                                                                                                }}
                                                                                            >
                                                                                                <Checkbox
                                                                                                    value={
                                                                                                        list.moduleCode
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        list.moduleName
                                                                                                    }
                                                                                                </Checkbox>
                                                                                            </Col>
                                                                                        )
                                                                                    )}
                                                                                </Row>
                                                                            </div>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                    </Checkbox.Group>
                                                )}
                                            </Form.Item>
                                        </div>
                                    );
                                }
                            })}

                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            教育大脑轮播设置:
                        </p>
                        <div>
                            <p style={{ marginLeft: 117 }}>
                                <Radio.Group
                                    onChange={this.changeCarouse}
                                    value={this.state.carouselValue}
                                >
                                    <Radio value={1} key={1}>
                                        幼儿园
                                    </Radio>
                                    <Radio value={2} key={2}>
                                        小学
                                    </Radio>
                                    <Radio value={3} key={3}>
                                        初中
                                    </Radio>
                                    <Radio value={4} key={4}>
                                        高中
                                    </Radio>
                                </Radio.Group>
                            </p>
                            <p>{this.renderCarouseSettingDetail()}</p>
                        </div>

                        <p
                            className={styles.header}
                            style={{
                                color: '#0445FC',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            前台动态菜单配置：
                            <span className={styles.settings} onClick={() => this.setttingMenu(1)}>
                                <i className={icon.iconfont}>&#xe6d5;</i>管理菜单
                            </span>
                        </p>
                        <ActiveMenu isEdit={false} menuData={frontMenu} openStage={openStage} />
                        <p
                            className={styles.header}
                            style={{
                                color: '#0445FC',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            后台动态菜单配置：
                            <span className={styles.settings} onClick={() => this.setttingMenu(2)}>
                                <i className={icon.iconfont}>&#xe6d5;</i>管理菜单
                            </span>
                        </p>
                        <ActiveMenu isEdit={false} menuData={backMenu} openStage={openStage} />
                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            ChatGpt配置:
                        </p>
                        <Form {...formItemLayout}>
                            <Form.Item label="学校调用总次数:">
                                {getFieldDecorator('chatGPTAmount', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请输入学校调用总次数',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder="学校调用总次数"
                                        style={{ width: '400px', marginRight: '20px' }}
                                    />
                                )}
                                <span>创建</span>
                            </Form.Item>
                            <Form.Item label="学校账户配置Key:">
                                {getFieldDecorator('chatGPTApiKey', {
                                    rules: [
                                        {
                                            required: false,
                                        },
                                    ],
                                })(<Input style={{ width: '400px', marginRight: '20px' }} />)}
                                <span>GB</span>
                            </Form.Item>

                            {chatGPTList && chatGPTList.length && chatGPTList.length > 0
                                ? chatGPTList.map((el, idx) => {
                                    return (
                                        <div style={{ margin: '20px 0' }}>
                                            <div className={styles.itemStyle}>
                                                <span className={styles.labelStyle}>
                                                    {el.modelCode == 'PrepareLessons'
                                                        ? el.identityType == 1
                                                            ? '每个老师调用备课助手次数:'
                                                            : el.identityType == 2
                                                                ? '每个学生调用备课助手次数:'
                                                                : ''
                                                        : el.modelCode == 'Drawing'
                                                            ? el.identityType == 1
                                                                ? '每个老师调用生成图片次数:'
                                                                : el.identityType == 2
                                                                    ? '每个学生调用生成图片次数:'
                                                                    : ''
                                                            : ''}
                                                </span>
                                                <span>
                                                    <Input
                                                        placeholder={
                                                            el.modelCode == 'PrepareLessons'
                                                                ? el.identityType == 1
                                                                    ? '每个老师调用备课助手次数'
                                                                    : el.identityType == 2
                                                                        ? '每个学生调用备课助手次数'
                                                                        : ''
                                                                : el.modelCode == 'Drawing'
                                                                    ? el.identityType == 1
                                                                        ? '每个老师调用生成图片次数'
                                                                        : el.identityType == 2
                                                                            ? '每个学生调用生成图片次数'
                                                                            : ''
                                                                    : ''
                                                        }
                                                        style={{
                                                            width: '400px',
                                                        }}
                                                        value={el.usageAmount}
                                                        onChange={(e) => this.changeUsage(e, idx)}
                                                    />
                                                </span>
                                                <span style={{ marginLeft: 20 }}>创建</span>
                                            </div>
                                            <div style={{ display: 'inline-block' }}>
                                                <span className={styles.radioLable}>
                                                    {el.modelCode == 'PrepareLessons'
                                                        ? '是否开启"ChatGpt备课助手":'
                                                        : el.modelCode == 'Drawing'
                                                            ? '是否开启"AI绘画":'
                                                            : ''}
                                                </span>
                                                <span>
                                                    <Radio.Group
                                                        onChange={(e) =>
                                                            this.changeEnable(e, idx)
                                                        }
                                                        value={el.enable}
                                                    >
                                                        <Radio value={0}>不开启</Radio>
                                                        <Radio value={1}>开启</Radio>
                                                    </Radio.Group>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                                : ''}
                        </Form>
                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            考勤配置:
                        </p>
                        <div>
                            <p style={{ marginLeft: 117 }}>
                                <Radio.Group
                                    onChange={this.changeAttendaceSet}
                                    value={this.state.stageAttendace}
                                >
                                    {!isEmpty(openStage) &&
                                        openStage.sort().map((el) => {
                                            return (
                                                <Radio value={el}>
                                                    {el === '1'
                                                        ? '幼儿园'
                                                        : el === '2'
                                                            ? '小学'
                                                            : el === '3'
                                                                ? '初中'
                                                                : '高中'}
                                                </Radio>
                                            );
                                        })}
                                </Radio.Group>
                            </p>
                            <p>{this.renderAttendanceDetail()}</p>
                        </div>
                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            备课权限配置:
                        </p>
                        <div>
                            <p style={{ marginLeft: 117 }}>
                                <Radio.Group
                                    onChange={this.changeLessonPrepareStage}
                                    value={this.state.currentLessonStage}
                                >
                                    <Radio value={1}>
                                        <span className={styles.radioText}>幼儿园</span>
                                    </Radio>
                                    <Radio value={2}>
                                        <span className={styles.radioText}>小学</span>
                                    </Radio>
                                    <Radio value={3}>
                                        <span className={styles.radioText}>初中</span>
                                    </Radio>
                                    <Radio value={4}>
                                        <span className={styles.radioText}>高中</span>
                                    </Radio>
                                </Radio.Group>
                            </p>
                            {this.renderLessonPrepareSetting()}
                        </div>
                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            双语化配置:
                        </p>
                        <div>
                            <p style={{ marginLeft: 117 }}>
                                <Radio.Group
                                    onChange={this.changeLanguageSetting}
                                    value={this.state.currentLanaguage}
                                >
                                    <Radio value={'Chinese'}>
                                        <span className={styles.radioText}>中文</span>
                                    </Radio>
                                    <Radio value={'English'}>
                                        <span className={styles.radioText}>英文</span>
                                    </Radio>
                                    <Radio value={'Chinese Witch English'}>
                                        <span className={styles.radioText}>双语（中文+英语）</span>
                                    </Radio>
                                </Radio.Group>
                                <em className={styles.requiredIcon}>*语言配置项必填哦~</em>
                            </p>
                        </div>
                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            是否启用导师制:
                        </p>
                        <div>
                            <p style={{ marginLeft: 117 }}>
                                <Radio.Group
                                    onChange={this.changeTutorEnable}
                                    value={this.state.tutorEnable}
                                >
                                    <Radio value={true}>开启</Radio>
                                    <Radio value={false}>不开启</Radio>
                                </Radio.Group>
                            </p>
                        </div>
                        {getUrlSearch('schoolId') ? (
                            <p className={styles.header} style={{ color: '#0445FC' }}>
                                人脸模板配置:
                            </p>
                        ) : null}
                        {getUrlSearch('schoolId') ? this.renderFaceSettings() : null}
                        <p className={styles.header} style={{ color: '#0445FC' }}>
                            迟到配置:
                        </p>
                        <div>
                            <p style={{ marginLeft: 117 }}>
                                <Radio.Group
                                    onChange={this.changeLateSet}
                                    value={this.state.stageLate}
                                >
                                    <Radio value={1} key={1}>
                                        幼儿园
                                    </Radio>
                                    <Radio value={2} key={2}>
                                        小学
                                    </Radio>
                                    <Radio value={3} key={3}>
                                        初中
                                    </Radio>
                                    <Radio value={4} key={4}>
                                        高中
                                    </Radio>
                                </Radio.Group>
                            </p>
                            <p>{this.renderDelayDetail()}</p>
                        </div>
                        <p
                            className={styles.header}
                            style={{
                                color: '#0445FC',
                                display: 'inline-block',
                                verticalAlign: 'top',
                            }}
                        >
                            请假配置:
                        </p>
                        <div style={{ display: 'inline-block', marginLeft: '45px' }}>
                            <TextArea
                                rows={4}
                                placeholder="请输入配置"
                                style={{ width: '400px' }}
                                value={this.state.leaveOutArrangement}
                                onChange={this.changeLeaveArrangement}
                            />
                        </div>
                    </Form>
                    <Button type="primary" onClick={this.onSubmit}>
                        提交
                    </Button>
                </div>

                {this.state.settingsModal === true ? (
                    <Modal
                        visible={this.state.settingsModal}
                        footer={null}
                        title={null}
                        getContainer={false}
                        className={styles.modalStyle}
                        closable={false}
                    >
                        <ActiveMenu
                            openStage={openStage}
                            isEdit={true}
                            menuData={allTemplateModuleList?.menuGroupModelDTOList || []}
                            settingType={this.state.settingType}
                            checkFirstMenuStatus={this.checkFirstMenuStatus}
                            checkSecondMenuStatus={this.checkSecondMenuStatus}
                            closeModal={this.closeModal}
                        />
                    </Modal>
                ) : null}
            </Spin>
        );
    }
}
