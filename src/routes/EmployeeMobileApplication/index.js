//移动端更新
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import { Radio, Form, message, Upload, Icon } from 'antd';
import { Modal, List, Picker, InputItem, DatePicker, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import logoImg from '../../assets/scss.png';
import { isEmpty } from 'lodash';
const alert = Modal.alert;
const Item = List.Item;
const RadioGroup = Radio.Group;

const parentCerType = [
    { label: trans('student.idCard', '身份证'), key: 1, value: 1 },
    { label: trans('student.studentCard', '学生证'), key: 2, value: 2 },
    { label: trans('student.certificate', '军官证'), key: 3, value: 3 },
    { label: trans('student.passport', '护照'), key: 4, value: 4 },
    { label: trans('student.passCheck', '港澳通行证'), key: 5, value: 5 },
    { label: trans('student.resident', '台湾居民来往大陆通行证'), key: 6, value: 6 },
];

const identityTypeList = [
    { label: trans('student.idCard', '身份证'), key: 'ID_CARD', value: 'ID_CARD' },
    { label: trans('student.passport', '护照'), key: 'PASSPORT', value: 'PASSPORT' },
    {
        label: trans('student.passCheck', '港澳通行证'),
        key: 'HK_MACAO_PASS',
        value: 'HK_MACAO_PASS',
    },
    { label: trans('global.other', '其他'), key: 'UNKNOWN', value: 'UNKNOWN' },
];

@Form.create()
@connect((state) => ({
    checkStudentInfo: state.student.checkStudentInfo, //是否有权限
    upDateStudentInfo: state.student.upDateStudentInfo, //学生详情
    countryInfoData: state.student.countryInfoData, //国籍累表
    nationInfoData: state.student.nationInfoData, //民族
    streetList: state.student.streetList, //户籍地址街道
    streetBornList: state.student.streetBornList, //出生地址街道
    streetAddressList: state.student.streetAddressList, //居住地址街道
    streetContactList: state.student.streetContactList, //联系地址街道
    approveExternalDetail: state.teacher.approveExternalDetail,
}))
export default class EmployeeMobileApplication extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            ename: '',
            sex: 0,
            certType: 0,
            certNo: '',
            mobile: '',
            nation: [],
            nationId: '',
            teachingPlan: '',
            identityCode: '', //身份信息code
            identityInfo: {}, //身份信息图片
            countryName: '',
            countryId: [],
            submitFlag: false,
            connectif: false,
            associateOrNot: undefined,
            syncDingTalk: undefined,
        };
    }

    componentWillMount() {
        this.getCountryList();
        if (this.props.match.params && this.props.match.params.edit == 'true') {
            this.props
                .dispatch({
                    type: 'teacher/getApproveExternalDetailInfo',
                    payload: {
                        userTemplateUnionId: this.props.match.params.userTemplateUnionId,
                    },
                })
                .then(() => {
                    const { approveExternalDetail, countryInfoData } = this.props;
                    console.log('countryInfoData: ', countryInfoData);
                    let tempCountryId = undefined;
                    countryInfoData &&
                        countryInfoData.map((item, index) => {
                            if (approveExternalDetail.countryName == item.name) {
                                return (tempCountryId = item.id);
                            }
                        });

                    console.log('tempCountryId: ', tempCountryId);

                    this.setState({
                        name: approveExternalDetail?.name || '',
                        eName: approveExternalDetail?.eName || '',
                        mobile: approveExternalDetail?.mobile || '',
                        sex: approveExternalDetail?.sex || '',
                        certType: approveExternalDetail?.certType || '',
                        certType: approveExternalDetail?.certType || '',
                        certNo: approveExternalDetail?.certNo || '',
                        agencyName: approveExternalDetail?.agencyName || '',
                        agencyContactName: approveExternalDetail?.agencyContactName || '',
                        agencyContactNameMobile:
                            approveExternalDetail?.agencyContactNameMobile || '',
                        teachingPlan: approveExternalDetail?.teachingPlan || '',
                        carNumber: approveExternalDetail?.carNumber || '',
                        identityInfo: approveExternalDetail?.workCardImageModel || '',
                        countryId: [tempCountryId],
                    });
                });
        }
    }

    //获取国籍
    getCountryList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getCountryList',
            payload: {},
        });
    };

    //改变国籍
    changeCountry = (value) => {
        console.log('value: ', value);
        const { countryInfoData } = this.props;
        let list = [];
        countryInfoData &&
            countryInfoData.map((item) => {
                value.map((i) => {
                    if (item.id === i) {
                        list.push(item.name);
                    }
                });
            });
        console.log(value, list);
        this.setState({
            countryId: value,
            countryName: list[0],
        });
    };

    changeBankPlace = (value) => {
        let list = '';
        let listchildren = '';
        district &&
            district.map((item) => {
                if (item.code == value[0]) {
                    list = item.label;
                    item.children.map((item2) => {
                        if (item2.code == value[1]) {
                            listchildren = item2.label;
                        }
                        /* item2.children.map((item3) => {
                            if (item3.code == value[2]) {
                                listchildrenlabel = item3.label;
                            }
                        }); */
                    });
                }
            });

        this.setState({
            bankRegisterInfo: list + listchildren,
            bankRegisterId: value,
        });
    };

    changeIdentity = (value) => {
        this.setState({
            identityCode: value,
        });
    };

    //不修改
    oldSubmit = () => {
        var searchURL = this.props.location.search;
        searchURL = searchURL.substring(1, searchURL.length);
        var targetPageId = searchURL && searchURL.split('&')[0].split('=')[1];
        const { dispatch } = this.props;
        alert('确认无需修改继续提交', '', [
            { text: '放弃', onPress: () => console.log('cancel') },
            {
                text: '提交',
                onPress: () => {
                    dispatch({
                        type: 'student/confirmStudentInfo',
                        payload: {
                            recordId: targetPageId,
                        },
                        onSuccess: () => {
                            this.setState({
                                connectOf: false,
                                connectif: true,
                            });
                        },
                    });
                },
            },
        ]);
    };

    examination = (flag) => {
        const {
            match: { params },
            dispatch,
        } = this.props;
        const { associateOrNot, syncDingTalk } = this.state;
        dispatch({
            type: 'teacher/approveExternalInfo',
            payload: {
                userTemplateUnionId: params.userTemplateUnionId,
                auditStatus: flag ? 2 : 3,
                ifRelationClass: associateOrNot,
                ifSynDing: syncDingTalk,
            },
            onSuccess: () => {
                this.setState({
                    connectif: true,
                });
            },
        });
    };

    //确认提交
    onTwoSubmit = () => {
        const {
            upDateStudentInfo,
            dispatch,
            match: { params },
        } = this.props;
        console.log('params: ', params);
        const {
            name,
            eName,
            mobile,
            sex,
            countryName,
            certType,
            certNo,
            agencyName,
            agencyContactName,
            agencyContactNameMobile,
            carNumber,
            teachingPlan,
            identityInfo,
        } = this.state;

        if (!name) {
            message.info('姓名为必填项');
            return;
        }
        if (!mobile) {
            message.info('手机号为必填项');
            return;
        }
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile)) {
            message.error(trans('student.pleaseCheckPhone', '请填写正确的手机号码'));
            return false;
        }
        if (!sex) {
            message.info('性别为必选项');
            return;
        }
        if (!countryName) {
            message.info('国籍为必选项');
            return;
        }
        if (!certType) {
            message.info('证件类型为必选项');
            return;
        }
        if (!certNo) {
            message.info('证件号码为必填项');
            return;
        }
        if (certType == '1') {
            //身份证号码验证
            if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(certNo)) {
                message.error(trans('student.pleaseCheckId', '请输入正确的身份证号码'));
                return false;
            }
        }
        if (!agencyName) {
            message.info('所属机构为必填项');
            return;
        }
        if (!agencyContactName) {
            message.info('机构联系人为必填项');
            return;
        }
        if (!agencyContactNameMobile) {
            message.info('机构联系人电话为必填项');
            return;
        }
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(agencyContactNameMobile)) {
            message.error('请填写正确的机构联系人号码');
            return false;
        }

        this.props.form.validateFields((err, values) => {
            console.log('values ==>', values);
            if (!err) {
                dispatch({
                    type: 'teacher/submitExternalInfo',
                    payload: {
                        eduGroupCompanyId: params.eduGroupcompanyId,
                        schoolId: params.schoolId,
                        name,
                        eName,
                        mobile,
                        sex,
                        countryName,
                        certType,
                        certNo,
                        agencyName,
                        agencyContactName,
                        agencyContactNameMobile,
                        carNumber,
                        teachingPlan,
                        workCardImageModel: !isEmpty(identityInfo) ? identityInfo : undefined,
                    },
                    onSuccess: () => {
                        this.setState({
                            submitFlag: true,
                            connectif: true,
                        });
                    },
                });
            } else {
                console.log('err :>> ', err);
            }
        });
    };

    uploadIdentity = (info) => {
        let file = info.file;
        if (file && file.status === 'done') {
            const response = file.response?.content ? file.response.content[0] : [];
            let resFile = {
                ...response,
                uid: file.uid,
            };
            this.setState({
                identityInfo: resFile,
            });
        }
    };

    removeInfo = () => {
        this.setState({
            identityInfo: {},
        });
    };

    render() {
        const {
            countryInfoData,
            nationInfoData,
            match: { params },
        } = this.props;
        console.log('params: ', params);
        const {
            name,
            eName,
            mobile,
            sex,
            countryName,
            countryId,
            certType,
            certNo,
            agencyName,
            agencyContactName,
            agencyContactNameMobile,
            carNumber,
            teachingPlan,
            identityInfo,
            connectif,
            associateOrNot,
            syncDingTalk,
        } = this.state;

        console.log('identityInfo: ', identityInfo);

        let editFlag = params.edit == 'true'; // 判断是提交申请(false)还是审批(true)

        countryInfoData.map((item) => {
            item.label = item.name;
            item.value = item.id;
        });
        nationInfoData.map((item) => {
            item.label = item.name;
            item.value = item.id;
        });

        const uploadButton = (
            <div>
                <Icon type="plus" />
            </div>
        );

        return (
            <div className={styles.studentInfoPage}>
                {connectif && (
                    <div style={{ paddingTop: '244px', textAlign: 'center' }}>
                        <img
                            style={{ margin: '14px auto', display: 'block' }}
                            src={logoImg}
                            alt=""
                        />
                        提交成功!
                    </div>
                )}
                <div className={styles.Lister} style={{ display: connectif ? 'none' : 'block' }}>
                    <List>
                        <InputItem
                            placeholder={trans('global.pleaseEnte', '请输入')}
                            value={name}
                            onChange={(val) => {
                                this.setState({
                                    name: val,
                                });
                            }}
                            disabled={editFlag}
                        >
                            <span>
                                <em className={styles.redIcon}>*</em>
                                <span className={styles.labelStyle}>姓名</span>
                            </span>
                        </InputItem>
                        <InputItem
                            placeholder="请输入（选填）"
                            value={eName}
                            onChange={(val) => {
                                this.setState({
                                    eName: val,
                                });
                            }}
                            disabled={editFlag}
                        >
                            <span>
                                <em className={styles.redIcon}>*</em>
                                <span className={styles.labelStyle}>英文名</span>
                            </span>
                        </InputItem>

                        <InputItem
                            placeholder={trans('global.pleaseEnte', '请输入')}
                            value={mobile}
                            onChange={(value) => {
                                this.setState({
                                    mobile: value,
                                });
                            }}
                            disabled={editFlag}
                        >
                            <span>
                                <em className={styles.redIcon}>*</em>
                                <span className={styles.labelStyle}>手机号码</span>
                            </span>
                        </InputItem>

                        <Item>
                            <span className={styles.repeatList}>
                                <em className={styles.redIcon}>*</em>
                                <span className={styles.labelStyle}>性别</span>
                            </span>
                            <div className={styles.repeatRadio}>
                                <RadioGroup
                                    onChange={(e) => {
                                        this.setState({
                                            sex: e.target.value,
                                        });
                                    }}
                                    value={sex}
                                    disabled={editFlag}
                                >
                                    <Radio value={'1'}>{trans('global.noRepeat', '男')}</Radio>
                                    <Radio value={'2'}>{trans('global.yesRepeat', '女')}</Radio>
                                </RadioGroup>
                            </div>
                        </Item>

                        <Picker
                            data={countryInfoData}
                            cols={1}
                            onChange={this.changeCountry}
                            okText={trans('global.determine', '确定')}
                            dismissText={trans('global.cancel', '取消')}
                            value={countryId}
                            extra={'请选择国籍'}
                            disabled={editFlag}
                        >
                            <Item arrow="horizontal">
                                <span className={styles.itemTitle}>
                                    <em className={styles.redIcon}>*</em>
                                    <span className={styles.labelStyle}>国籍</span>
                                </span>
                            </Item>
                        </Picker>
                        <Fragment>
                            <Picker
                                data={parentCerType}
                                cols={1}
                                onChange={(value) => this.setState({ certType: value[0] })}
                                value={certType ? [Number(certType)] : []}
                                okText={trans('global.determine', '确定')}
                                dismissText={trans('global.cancel', '取消')}
                                disabled={editFlag}
                            >
                                <Item arrow="horizontal">
                                    <span className={styles.itemTitle}>
                                        <em className={styles.redIcon}>*</em>
                                        <span className={styles.labelStyle}>证件类型</span>
                                    </span>
                                </Item>
                            </Picker>
                            <InputItem
                                placeholder={trans('global.pleaseEnte', '请输入')}
                                value={certNo}
                                onChange={(value) => {
                                    this.setState({
                                        certNo: value,
                                    });
                                }}
                                disabled={editFlag}
                            >
                                <span>
                                    <em className={styles.redIcon}>*</em>
                                    <span className={styles.labelStyle}>证件号码</span>
                                </span>
                            </InputItem>
                        </Fragment>

                        <InputItem
                            placeholder={trans('global.pleaseEnte', '请输入')}
                            value={agencyName}
                            onChange={(val) => {
                                this.setState({
                                    agencyName: val,
                                });
                            }}
                            disabled={editFlag}
                        >
                            <span>
                                <em className={styles.redIcon}>*</em>
                                <span className={styles.labelStyle}>所属机构</span>
                            </span>
                        </InputItem>

                        <InputItem
                            placeholder="请输入负责对接校内课程等事宜的联系人"
                            value={agencyContactName}
                            onChange={(val) => {
                                this.setState({
                                    agencyContactName: val,
                                });
                            }}
                            disabled={editFlag}
                        >
                            <span>
                                <em className={styles.redIcon}>*</em>
                                <span className={styles.labelStyle}>机构联系人</span>
                            </span>
                        </InputItem>

                        <InputItem
                            placeholder={trans('global.pleaseEnte', '请输入')}
                            value={agencyContactNameMobile}
                            onChange={(val) => {
                                this.setState({
                                    agencyContactNameMobile: val,
                                });
                            }}
                            disabled={editFlag}
                        >
                            <span>
                                <em className={styles.redIcon}>*</em>
                                <span className={styles.labelStyle}>机构联系人电话</span>
                            </span>
                        </InputItem>

                        <InputItem
                            placeholder="请填写计划授课的课程名称"
                            value={teachingPlan}
                            onChange={(val) => {
                                this.setState({
                                    teachingPlan: val,
                                });
                            }}
                            disabled={editFlag}
                        >
                            <span>
                                <em className={styles.redIcon}></em>
                                <span className={styles.labelStyle}>计划授课课程</span>
                            </span>
                        </InputItem>

                        <InputItem
                            placeholder="如果有车辆需要进校请填写"
                            value={carNumber}
                            onChange={(val) => {
                                this.setState({
                                    carNumber: val,
                                });
                            }}
                            disabled={editFlag}
                        >
                            <span>
                                <em className={styles.redIcon}></em>
                                <span className={styles.labelStyle}>车牌号码</span>
                            </span>
                        </InputItem>

                        <Form.Item>
                            <span className={styles.uploadStyle}>
                                <em className={styles.redIcon}></em>
                                <span className={styles.labelStyle} style={{ width: '110px' }}>
                                    上传工牌照片
                                </span>
                                <span style={{ color: '#B4B3B4' }}>
                                    如果需要申请工牌，请上传照片
                                </span>
                            </span>
                            <div className={styles.imgStyle}>
                                {params.edit == 'true' ? (
                                    <img
                                        style={{ display: 'inline-block', width: '100px' }}
                                        src={ window.location.origin + identityInfo.url }
                                    />
                                ) : (
                                    <Upload
                                        action="/api/upload_file"
                                        listType="picture-card"
                                        onChange={this.uploadIdentity}
                                        disabled={editFlag}
                                        onRemove={this.removeInfo}
                                    >
                                        {/* {identityInfo ? (
                                    <img
                                        style={{ display: 'inline-block', width: '100px' }}
                                        src={window.location.origin + identityInfo.url}
                                    />
                                ) : (
                                    uploadButton
                                )} */}
                                        {!isEmpty(identityInfo) ? null : uploadButton}
                                    </Upload>
                                )}
                                {/* <img
                                        style={{ display: 'inline-block', width: '100px' }}
                                        src={window.location.origin + identityInfo.url}
                                    /> */}
                            </div>
                        </Form.Item>
                    </List>
                    {/* {params.edit == 'true' && (
                        <>
                            <div>审核信息</div>
                            <List>
                                <Item>
                                    <span className={styles.repeatList}>
                                        <em className={styles.redIcon}>*</em>
                                        <span className={styles.labelStyle}>关联授课班级</span>
                                    </span>
                                    <div className={styles.repeatRadio}>
                                        <RadioGroup
                                            onChange={(e) => {
                                                this.setState({
                                                    associateOrNot: e.target.value,
                                                });
                                            }}
                                            value={associateOrNot}
                                        >
                                            <Radio value={true}>关联授课班级</Radio>
                                            <Radio value={false}>暂不关联</Radio>
                                        </RadioGroup>
                                    </div>
                                </Item>
                                <Item>
                                    <span className={styles.repeatList}>
                                        <em className={styles.redIcon}>*</em>
                                        <span className={styles.labelStyle}>同步钉钉</span>
                                    </span>
                                    <div className={styles.repeatRadio}>
                                        <RadioGroup
                                            onChange={(e) => {
                                                this.setState({
                                                    syncDingTalk: e.target.value,
                                                });
                                            }}
                                            value={syncDingTalk}
                                        >
                                            <Radio value={true}>同步钉钉</Radio>
                                            <Radio value={false}>暂不同步</Radio>
                                        </RadioGroup>
                                    </div>
                                </Item>
                            </List>
                        </>
                    )} */}
                    {params.edit == 'true' ? (
                        <div style={{ margin: '0 auto', display: 'table' }}>
                            <Button
                                shape="circle"
                                inline
                                className={styles.buttonBottom}
                                style={{
                                    marginRight: '4px',
                                    border: '1px solid #4d7fff',
                                    color: '#4d7fff',
                                }}
                                onClick={() => this.examination(false)}
                            >
                                拒绝
                            </Button>
                            <Button
                                type="primary"
                                inline
                                className={styles.buttonBottom}
                                style={{ marginRight: '4px' }}
                                onClick={() => this.examination(true)}
                            >
                                入校审核通过
                            </Button>
                        </div>
                    ) : (
                        <div style={{ margin: '0 auto', display: 'table' }}>
                            <Button
                                type="primary"
                                inline
                                className={styles.buttonBottom}
                                style={{ marginRight: '4px' }}
                                onClick={this.onTwoSubmit}
                                disabled={this.state.submitFlag}
                            >
                                确认提交
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
