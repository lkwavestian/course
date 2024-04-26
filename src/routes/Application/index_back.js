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
    Upload,
    Icon,
    Spin,
    Radio,
} from 'antd';
import { trans } from '../../utils/i18n';
import lodash, { map } from 'lodash';
import OssButton from '../../components/UploadByOSS/ossButton';
import { getUrlSearch } from '../../utils/utils';
import TimeSchedule from '../../components/Time/Schedule';

const { TextArea } = Input;
@Form.create()
@connect((state) => ({
    // saveApplication: state.application.saveApplication,
    studentDetailInfo: state.student.studentDetailInfo,
    moduleList: state.application.moduleList,
    editDataList: state.application.editDataList,
    configCenterList: state.application.configCenterList,
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
                        },
                    } = this.props;
                    const { editDataList } = this.props;
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
                    if(chatGPTList && chatGPTList.length && chatGPTList.length == 0){
                        chatGPTList = tempChatgptList
                    }
                    this.setState({
                        previewImage: logoUrl,
                        workBackPic,
                        favicon,
                        loginBackground,
                        loginLogo,
                        ccaIcon,
                        chatGPTList,
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
                        topStageSetting:topStageSetting||1,
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
    }

    onSubmit = (e) => {
        // e.preventDefault();
        const { form, dispatch } = this.props;
        const { loading, favicon, loginBackground, loginLogo, ccaIcon, chatGPTList } = this.state;

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
            }
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
                        topStageSetting:values.topStageSetting,
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
        // console.log(file, '接收文件上传成功的内容');
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

    render() {
        // return <div>qqqdwc</div>;
        const {
            form: { getFieldDecorator },
            studentDetailInfo,
            moduleList,
            configCenterList,
        } = this.props;
        const { loading, defaultValue, chatGPTList } = this.state;
        console.log('chatGPTList', chatGPTList);

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
            // console.log('arr', arr);
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
                                        required: false,
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

                        <p className={styles.header} style={{ color: 'cornflowerblue' }}>
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

                        <p className={styles.header} style={{ color: 'cornflowerblue' }}>
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
                                return (
                                    <div>
                                        <p
                                            className={styles.header}
                                            style={{ color: 'cornflowerblue' }}
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
                                                                    : '请选择学校采购的模块内容',
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Checkbox.Group style={{ width: '100%' }}>
                                                    {item.schoolConfigModuleGroupVOList &&
                                                        item.schoolConfigModuleGroupVOList.length >
                                                            0 &&
                                                        item.schoolConfigModuleGroupVOList.map(
                                                            (el, order) => {
                                                                return (
                                                                    <div
                                                                        className={
                                                                            styles.moduleList
                                                                        }
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                display: 'block',
                                                                                width:
                                                                                    el.metaDataConfigModuleDOList &&
                                                                                    el
                                                                                        .metaDataConfigModuleDOList
                                                                                        .length > 4
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
                                                        )}
                                                </Checkbox.Group>
                                            )}
                                        </Form.Item>
                                    </div>
                                );
                            })}

                        <p className={styles.header} style={{ color: 'cornflowerblue' }}>
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

                            {chatGPTList &&
                                chatGPTList.length &&
                                chatGPTList.length > 0 &&
                                chatGPTList.map((el, idx) => {
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
                                                        onChange={(e) => this.changeEnable(e, idx)}
                                                        value={el.enable}
                                                    >
                                                        <Radio value={0}>不开启</Radio>
                                                        <Radio value={1}>开启</Radio>
                                                    </Radio.Group>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </Form>
                    </Form>
                    <Button type="primary" onClick={this.onSubmit}>
                        提交
                    </Button>
                </div>
            </Spin>
        );
    }
}
