//查看员工详情
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './lookStaffDetail.less';
import { Drawer, Select, DatePicker, Input, TreeSelect, message, Popconfirm, Radio } from 'antd';
import moment, { locale } from 'moment';
import { formatTime, formatDate } from '../../../../utils/utils';
import powerUrl from '../../../../assets/power.png';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';

@connect((state) => ({
    staffDetail: state.teacher.staffDetail, //员工信息详情
    employeeList: state.teacher.employeeList, //直线主管列表
    countryInfoData: state.teacher.countryInfoData, //国家列表
    employeeInfo: state.teacher.employeeInfo, //外聘信息详情
    currentUser: state.global.currentUser,
}))
export default class LookStaffDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false, //是否编辑,
            leaderId: undefined, //直线主管
            loginId: undefined, //系统账号
            birthday: '', //员工出生日期
            certificateType: undefined, //证件类型,
            userSex: undefined, //用户性别,
            nationality: undefined, //国籍,
            workNo: undefined, //工号,
            userEmail: undefined, //邮箱,
            certNo: undefined, //证件号码
            name: undefined, //用户姓名
            ename: undefined, //英文名
            nickName: undefined, //昵称
            mobile: undefined, //手机号
            unionUserId: undefined, //用户unionUserId
            nationalName: undefined,
            agencyName: undefined, // 机构信息
            carNumber: undefined, //车牌号
            radioValue: '12345678'
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.staffDrawerVisible != this.props.staffDrawerVisible) {
            if (nextProps.staffDrawerVisible) {
                this.fetchStaffDetail();
                this.getStaffList();
            }
        }

        const { staffDetail, countryInfoData, employeeInfo, identity } = nextProps;
        let personalInfo =
            identity == 'staff' ? staffDetail.content || {} : employeeInfo.content || {}; //员工信息

        let tempNationality = personalInfo && personalInfo.nationalityId;

        let nationalName = '';
        countryInfoData &&
            countryInfoData.length &&
            countryInfoData.length > 0 &&
            countryInfoData.map((item, index) => {
                if (item.id == tempNationality) {
                    return (nationalName = item.name);
                }
            });

        this.setState({
            nationalName,
        });
    }
    //获取员工信息详情
    fetchStaffDetail() {
        const { dispatch, record, identity, seletedIdx } = this.props;
        if (identity == 'staff') {
            dispatch({
                type: 'teacher/lookStaffDetail',
                payload: {
                    userId: record.userId,
                },
            });
        } else if (identity == 'employee') {
            let payload = {
                userId: record.userId,
                userTemplateUnionId: record.userTemplateUnionId,
                tabType: seletedIdx + 1,
            };
            dispatch({
                type: 'teacher/getExternalDetailInfo',
                payload,
            });
        }
    }

    //获取直线主管列表
    getStaffList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getEmployee',
            payload: {},
        });
    }


    onClose = () => {
        const { closeDrawer } = this.props;
        typeof closeDrawer == 'function' && closeDrawer.call(this);
        this.setState({
            isEdit: false, //是否编辑,
            leaderId: undefined, //直线主管
            loginId: undefined, //系统账号
            birthday: '', //员工出生日期
            certificateType: undefined, //证件类型,
            userSex: undefined, //证件类型,
            nationality: undefined, //国籍,
            nationalName: undefined,
            workNo: undefined, //工号,
            userEmail: undefined, //邮箱,
            certNo: undefined, //证件号码
            name: undefined, //用户姓名
            ename: undefined, //英文名
            nickName: undefined, //昵称
            mobile: undefined, //手机号
            unionUserId: undefined, //用户unionUserId
        });
    };

    //输入用户名字
    changeName = (e) => {
        this.setState({
            name: e.target.value,
        });
    };

    //输入用户英文名字
    changeEname = (e) => {
        this.setState({
            ename: e.target.value,
        });
    };

    //输入用户昵称
    changeNickname = (e) => {
        this.setState({
            nickName: e.target.value,
        });
    };

    //选择直线主管
    selectLeader = (value) => {
        this.setState({
            leaderId: value,
        });
    };

    //修改手机号
    changeMobile = (e) => {
        this.setState({
            mobile: e.target.value,
        });
    };

    //修改工号
    changeWorkNo = (e) => {
        this.setState({
            workNo: e.target.value,
        });
    };

    //修改系统账号
    changeLoginId = (e) => {
        this.setState({
            loginId: e.target.value,
        });
    };

    //修改机构信息
    changeAgency = (e) => {
        this.setState({
            agencyName: e.target.value,
        });
    };

    //修改车牌号
    changeCarNumber = (e) => {
        this.setState({
            carNumber: e.target.value,
        });
    };

    //修改工作邮箱
    changeWorkEmail = (e) => {
        this.setState({
            userEmail: e.target.value,
        });
    };

    //修改用户unionId
    changeUnionId = (e) => {
        this.setState({
            unionUserId: e.target.value,
        });
    };

    //选择出生日期
    changeBirthday = (date, dateString) => {
        this.setState({
            birthday: dateString,
        });
    };
    getCountryList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getCountryList',
            payload: {},
        });
    };

    //进入员工编辑
    editStaffInfo = () => {
        const { staffDetail, employeeInfo, identity } = this.props;
        let personalInfo =
            identity == 'staff' ? staffDetail.content || {} : employeeInfo.content || {}; //员工信息

        this.setState({
            isEdit: true,
            name: personalInfo.name,
            ename: personalInfo.ename,
            nickName: personalInfo.nickName,
            mobile: personalInfo.mobile,
            unionUserId: personalInfo.unionUserId, //用户unionUserId
            certificateType: this.findCertType(personalInfo.certType),
            certNo: personalInfo.certNo,
            userSex: personalInfo.sex,
            nationality: personalInfo.nationalityId,
            workNo: personalInfo.workNo,
            userEmail: personalInfo.email,
            birthday: formatTime(personalInfo.birthday || new Date().getTime()),
            leaderId: personalInfo.leaderId,
            loginId: personalInfo.loginId,
            agencyName: personalInfo.agencyName,
            carNumber: personalInfo.carNumber,
        });
    };

    //选择证件类型
    selectCertifyType = (value) => {
        this.setState({
            certificateType: value,
        });
    };

    //选择用户性别
    sexSelect = (value) => {
        this.setState({
            userSex: value,
        });
    };

    //选择国籍
    nationalitySelect = (value) => {
        this.setState({
            nationality: value,
        });
    };

    //匹配证件类型
    findCertType(type) {
        let arr = [
            { id: '0', type: trans('global.unknown', '未知') },
            { id: '1', type: trans('student.idCard', '身份证') },
            { id: '2', type: trans('student.studentCard', '学生证') },
            { id: '3', type: trans('student.certificate', '军官证') },
            { id: '4', type: trans('student.passport', '护照') },
            { id: '5', type: trans('student.passCheck', '港澳通行证') },
        ];
        let id;
        arr.map((item) => {
            if (type == item.type) {
                id = item.id;
            }
        });
        return id;
    }

    //证件号编辑
    changeCertNo = (e) => {
        this.setState({
            certNo: e.target.value,
        });
    };
    clickParentResetPwd = (userId) => {
        const { dispatch, } = this.props;
        const { radioValue } = this.state
        dispatch({
            type: 'student/resetPassword',
            payload: {
                userId,
                value: radioValue
            },
            onSuccess: () => {
                //重新获取员工详情
                this.fetchStaffDetail();
            },
        });
    };
    changeRadio = e => {
        this.setState({
            radioValue: e.target.value,
        });
    };
    //编辑完成
    confirmEdit = (staffType) => {
        const { dispatch, treeId, record, staffDetail, employeeInfo, identity } = this.props;
        const {
            leaderId,
            certificateType,
            userSex,
            nationality,
            certNo,
            birthday,
            name,
            ename,
            nickName,
            mobile,
            unionUserId,
            workNo,
            userEmail,
            loginId,
            agencyName,
            carNumber,
        } = this.state;
        let personalInfo =
            identity == 'staff' ? staffDetail.content || {} : employeeInfo.content || {};
        //校验必填项
        if (staffType == 'externalUser') {
            //外部员工校验
            if (
                !name ||
                /* !ename ||
                !nickName ||
                !userSex ||
                !nationality ||
                !certificateType ||
                !certNo || */
                !mobile /* ||
                !workNo ||
                !userEmail */ ||
                !loginId
            ) {
                message.info(trans('teacher.completeBeforeUpload', '请完善信息再提交哦~'));
                return false;
            }
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile)) {
                message.error(trans('student.pleaseCheckPhone', '请填写正确的手机号码'));
                return false;
            }
            if (certificateType == '1') {
                //身份证号码验证
                if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(certNo)) {
                    message.error(trans('student.pleaseCheckId', '请输入正确的身份证号码'));
                    return false;
                }
            }
            // if(certificateType == "4") {
            //     //护照号码验证
            //     if(!/^((1[45]\d{7})|(G\d{8})|(P\d{7})|(S\d{7,8}))?$/.test(certNo)) {
            //         message.error("请输入正确的护照号码");
            //         return false;
            //     }
            // }
        }
        /* if (staffType == 'employee') {
            //员工校验
            if (!leaderId || !birthday) {
                message.info(trans('teacher.completeBeforeUpload', '请完善信息再提交哦~'));
                return false;
            }
        } */
        let tempNationalityName = '';
        const { countryInfoData } = this.props;
        countryInfoData &&
            countryInfoData.length &&
            countryInfoData.length > 0 &&
            countryInfoData.map((item, index) => {
                if (item.id == nationality) {
                    return (tempNationalityName = item.name);
                }
            });
        dispatch({
            type: 'teacher/updateExternalEmployee',
            payload: {
                userId: record.userId, //用户id
                identity: personalInfo.identity, //员工身份
                name: name, //名字
                ename: ename, //英文名字
                nickName: nickName, //昵称
                sex: userSex == '男' ? 1 : userSex == '女' ? 2 : userSex, //性别
                // nationality: nationality, //国籍
                nationality: tempNationalityName, //国籍
                birthday: birthday && birthday.replace('/', '-').replace('/', '-'), //生日
                certType: certificateType, //证件类型
                certNo: certNo, //证件号码
                mobile: mobile, //手机号
                // unionUserId: unionUserId,
                workNo: workNo,
                email: userEmail,
                employeeType: personalInfo.employeeType, //人员类型
                leaderId: leaderId, //主管id
                loginId: loginId, //主管id
                agencyName, //机构信息
                carNumber, //车牌号
            },
            onSuccess: () => {
                const { getTeacherList, getTreeOrg, getTableData } = this.props;
                typeof getTeacherList == 'function' && getTeacherList.call(this);
                typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                typeof getTableData == 'function' && getTableData.call(this);
                this.onClose();
            },
        });
    };

    //外聘员工的离职
    confirmQuit = () => {
        const { dispatch, record, seletedIdx, identity } = this.props;
        if (identity == 'staff') {
            dispatch({
                type: 'teacher/employeeQuit',
                payload: {
                    userId: record.userId,
                },
                onSuccess: () => {
                    const { getTeacherList, getTreeOrg } = this.props;
                    typeof getTeacherList == 'function' && getTeacherList.call(this);
                    typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                    this.onClose();
                },
            });
        } else {
            let transferStr =
                seletedIdx == 0
                    ? 'teacher/batchQuitExternalEmployee'
                    : seletedIdx == 1
                        ? 'teacher/reinstatementExternalEmployee'
                        : 'teacher/approveExternalInfo';
            let payload =
                seletedIdx == 0
                    ? { userIds: [record.userId] }
                    : seletedIdx == 1
                        ? { userId: record.userId }
                        : {};

            dispatch({
                type: transferStr,
                payload,
                onSuccess: () => {
                    const { getTableData } = this.props;
                    typeof getTableData == 'function' && getTableData.call(this);
                    this.onClose();
                },
            });
        }
    };

    render() {
        const {
            staffDrawerVisible,
            staffDetail,
            employeeInfo,
            identity,
            record,
            employeeList,
            havePowerEditInfo,
            countryInfoData,
            seletedIdx,
            currentUser,
        } = this.props;
        const {
            isEdit,
            leaderId,
            birthday,
            certificateType,
            userSex,
            nationality,
            nationalName,
            workNo,
            userEmail,
            certNo,
            name,
            ename,
            nickName,
            mobile,
            unionUserId,
            loginId,
            carNumber,
            agencyName,
        } = this.state;
        let havePower = identity == 'staff' ? staffDetail.unauthorized : employeeInfo.unauthorized; //判断用户是否有权限
        let personalInformation =
            identity == 'staff' ? staffDetail.content || {} : employeeInfo.content || {};
        let staffType = personalInformation.identity; //员工类型 employee:正式员工  externalUser:外部员工
        if (havePower === true) {
            //用户暂无权限
            return (
                <div>
                    <Drawer
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={staffDrawerVisible}
                        width="600px"
                        className={styles.drawerStyle}
                    >
                        <div className={styles.detailPage}>
                            <p className={styles.haveNoPowerPage}>
                                <img src={powerUrl} />
                                <span>{trans('global.noPower', '您暂时没有权限查看哦~')}</span>
                            </p>
                        </div>
                    </Drawer>
                </div>
            );
        }
        let confirmText = trans('teacher.confirmQuitStaff', '确认离职该员工吗？');
        return (
            <div>
                <Drawer
                    title={personalInformation.nickName || personalInformation.name}
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={staffDrawerVisible}
                    width="600px"
                    className={styles.drawerStyle}
                >
                    <div className={styles.detailPage}>
                        <div className={styles.personalInformation}>
                            <p className={styles.infoTitle}>个人信息</p>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('student.name', '姓名')}：
                                    {/* {isEdit && staffType == 'externalUser' ? ( */}
                                    {isEdit ? (
                                        <Input
                                            placeholder={trans(
                                                'teacher.inputYourName',
                                                '请输入姓名'
                                            )}
                                            className={styles.inputStyle}
                                            onChange={this.changeName}
                                            value={name}
                                        />
                                    ) : (
                                        <em>{personalInformation.name}</em>
                                    )}
                                </span>
                                <span>
                                    {trans('student.englishName', '英文名')}：
                                    {/* {isEdit && staffType == 'externalUser' ? ( */}
                                    {isEdit ? (
                                        <Input
                                            placeholder={
                                                ('student.pleaseInputEnglishName', '请输入英文名称')
                                            }
                                            className={styles.inputStyle}
                                            onChange={this.changeEname}
                                            value={ename}
                                        />
                                    ) : (
                                        <em>{personalInformation.ename}</em>
                                    )}
                                </span>
                            </div>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('student.nickName', '显示名')}：{' '}
                                    {isEdit ? (
                                        <Input
                                            placeholder={
                                                ('student.pleaseInputNickName', '请输入昵称')
                                            }
                                            className={styles.inputStyle}
                                            onChange={this.changeNickname}
                                            value={nickName}
                                        />
                                    ) : (
                                        <em>{personalInformation.nickName}</em>
                                    )}
                                </span>
                                <span>
                                    {trans('student.sex', '性别')}：{' '}
                                    {isEdit ? (
                                        <Select
                                            defaultValue=""
                                            placeholder={trans('student.pleaseSelect', '请选择')}
                                            style={{ width: 150 }}
                                            className={styles.selectStyle}
                                            value={userSex}
                                            onChange={this.sexSelect}
                                        >
                                            <Option value="1" key="1">
                                                {trans('global.man', '男')}
                                            </Option>
                                            <Option value="2" key="2">
                                                {trans('global.woman', '女')}
                                            </Option>
                                        </Select>
                                    ) : (
                                        <em>{personalInformation.sex}</em>
                                    )}
                                </span>
                            </div>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('student.country', '国籍')}：{' '}
                                    {isEdit ? (
                                        <Select
                                            defaultValue=""
                                            placeholder={trans('student.pleaseSelect', '请选择')}
                                            style={{ width: 150 }}
                                            className={styles.selectStyle}
                                            value={nationality ? Number(nationality) : undefined}
                                            // value={personalInformation.nationality}
                                            onChange={this.nationalitySelect}
                                        >
                                            {countryInfoData &&
                                                countryInfoData.length > 0 &&
                                                countryInfoData.map((item, index) => {
                                                    return (
                                                        <Option value={item.id} key={item.id}>
                                                            {locale() == 'en'
                                                                ? item.ename
                                                                : item.name}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    ) : (
                                        // <em>{personalInformation.nationality}</em>
                                        <em>{nationalName}</em>
                                    )}
                                </span>
                                <span>
                                    {trans('global.birthday', '出生日期')}：
                                    {/* {isEdit && staffType == 'employee' ? ( */}
                                    {isEdit ? (
                                        <DatePicker
                                            className={styles.datePickerStyle}
                                            style={{ width: 150, display: 'inline-block' }}
                                            placeholder={trans('student.pleaseSelect', '请选择')}
                                            onChange={this.changeBirthday}
                                            format={dateFormat}
                                            value={moment(birthday, dateFormat)}
                                            allowClear={false}
                                        />
                                    ) : (
                                        <em>{formatTime(personalInformation.birthday)}</em>
                                    )}
                                </span>
                            </div>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('student.certType', '证件类型')}：
                                    {/* {isEdit && staffType == 'externalUser' ? ( */}
                                    {isEdit ? (
                                        <Select
                                            placeholder={trans('student.pleaseSelect', '请选择')}
                                            style={{ width: 150 }}
                                            className={styles.selectStyle}
                                            value={certificateType}
                                            onChange={this.selectCertifyType}
                                        >
                                            <Option value="0">
                                                {trans('global.unknown', '未知')}
                                            </Option>
                                            <Option value="1">
                                                {trans('student.idCard', '身份证')}
                                            </Option>
                                            <Option value="2">
                                                {trans('student.studentCard', '学生证')}
                                            </Option>
                                            <Option value="3">
                                                {trans('student.certificate', '军官证')}
                                            </Option>
                                            <Option value="4">
                                                {trans('student.passport', '护照')}
                                            </Option>
                                            <Option value="5">
                                                {trans('student.passCheck', '港澳通行证')}
                                            </Option>
                                        </Select>
                                    ) : (
                                        <em>{personalInformation.certType}</em>
                                    )}
                                </span>
                                <span>
                                    {trans('student.certNumber', '证件号')}：
                                    {/* {isEdit && staffType == 'externalUser' ? ( */}
                                    {isEdit ? (
                                        <Input
                                            placeholder={trans(
                                                'teacher.inputYourCertificateNum',
                                                '请输入证件号码'
                                            )}
                                            className={styles.inputStyle}
                                            onChange={this.changeCertNo}
                                            value={certNo}
                                        />
                                    ) : (
                                        <em>{personalInformation.certNo}</em>
                                    )}
                                </span>
                            </div>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('student.telephone', '手机号')}：
                                    {/* {isEdit && staffType == 'externalUser' ? ( */}
                                    {isEdit ? (
                                        <Input
                                            placeholder={trans(
                                                'teacher.inputYourPhone',
                                                '请输入手机号'
                                            )}
                                            className={styles.inputStyle}
                                            onChange={this.changeMobile}
                                            value={mobile}
                                        />
                                    ) : (
                                        <em>{personalInformation.mobile}</em>
                                    )}
                                </span>
                                {/* <span>
                                    {trans('student.unionId', '用户unionId')}：
                                    {isEdit && staffType == 'externalUser' ? (
                                        <Input
                                            placeholder={trans('student.pleaseInput', '请输入')}
                                            className={styles.inputStyle}
                                            onChange={this.changeUnionId}
                                            value={unionUserId}
                                        />
                                    ) : (
                                        <em>{personalInformation.unionUserId}</em>
                                    )}
                                </span> */}
                            </div>
                        </div>
                        <div className={styles.personalInformation}>
                            <p className={styles.infoTitle}>工作信息</p>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('teacher.workNo', '工号')}：{' '}
                                    {isEdit ? (
                                        <Input
                                            placeholder={trans('teacher.inputWorkNo', '请输入工号')}
                                            onChange={this.changeWorkNo}
                                            className={styles.inputStyle}
                                            value={workNo}
                                        />
                                    ) : (
                                        <em>{personalInformation.workNo}</em>
                                    )}
                                </span>
                                <span>
                                    {trans('teacher.workEmail', '工作邮箱')}：{' '}
                                    {isEdit ? (
                                        <Input
                                            placeholder={trans(
                                                'teacher.inputWorkEmail',
                                                '请输入工作邮箱'
                                            )}
                                            onChange={this.changeWorkEmail}
                                            className={styles.inputStyle}
                                            value={userEmail}
                                        />
                                    ) : (
                                        <em>{personalInformation.email}</em>
                                    )}
                                </span>
                            </div>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('teacher.teacherType', '员工类型')}：{' '}
                                    <em>{personalInformation.employeeType}</em>
                                </span>
                                <span>
                                    {trans('teacher.employeeRole', '所属类别')}：{' '}
                                    <em>{personalInformation.employeeRole}</em>
                                </span>
                            </div>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('teacher.department', '部门')}：{' '}
                                    <em>
                                        {personalInformation.orgNameList &&
                                            personalInformation.orgNameList.length > 0
                                            ? personalInformation.orgNameList.map((item, index) => {
                                                if (index == 0) {
                                                    return (
                                                        <a
                                                            className={styles.orgNameStyle}
                                                            style={{ display: 'inline-block' }}
                                                            key={index}
                                                        >
                                                            {item}
                                                        </a>
                                                    );
                                                } else {
                                                    return (
                                                        <a
                                                            className={styles.orgNameStyle}
                                                            key={index}
                                                        >
                                                            {item}
                                                        </a>
                                                    );
                                                }
                                            })
                                            : '---'}
                                    </em>
                                </span>
                            </div>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('teacher.leaderName', '直线主管')}：
                                    {/* {isEdit && staffType == 'employee' ? ( */}
                                    {isEdit ? (
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            placeholder={trans('student.pleaseSelect', '请选择')}
                                            style={{ width: 150 }}
                                            className={styles.selectStyle}
                                            value={leaderId}
                                            onChange={this.selectLeader}
                                        >
                                            {employeeList &&
                                                employeeList.length > 0 &&
                                                employeeList.map((item) => {
                                                    return (
                                                        <Option value={item.id} key={item.id}>
                                                            {item.name} {item.ename}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    ) : (
                                        <em>{personalInformation.leaderName}</em>
                                    )}
                                </span>
                                <span>
                                    {trans('teacher.joinTime', '入职日期')}：{' '}
                                    <em>
                                        {personalInformation.joinTime &&
                                            formatTime(personalInformation.joinTime)}
                                    </em>
                                </span>
                            </div>
                            {/* <div className={styles.infoUtil}>
                                <span>
                                    {trans('teacher.formalTime', '转正日期')}：{' '}
                                    <em>
                                        {personalInformation.formalTime &&
                                            formatTime(personalInformation.formalTime)}
                                    </em>
                                </span>
                            </div> */}
                        </div>
                        <div className={styles.personalInformation}>
                            <p className={styles.infoTitle}>
                                {trans('teacher.accountInfo', '账号信息')}
                            </p>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('student.systemAccount', '系统账号')}：{' '}
                                    {isEdit ? (
                                        <Input
                                            placeholder="请输入系统账号（必填）"
                                            onChange={this.changeLoginId}
                                            className={styles.inputStyle}
                                            value={loginId}
                                            style={{ width: 180 }}
                                        />
                                    ) : (
                                        <>
                                            <em>{personalInformation.loginId}</em>
                                            {currentUser.schoolId != 1 ? <Popconfirm
                                                placement="top"
                                                icon={null}
                                                title={(
                                                    <div>
                                                        <span >重置后密码选项</span>

                                                        <Radio.Group
                                                            style={{ display: 'flex', flexDirection: 'column' }}
                                                            direction="vertical" defaultValue={this.state.radioValue}
                                                            onChange={this.changeRadio}
                                                        >
                                                            <Radio style={{ margin: '6px 0px' }} value="12345678">12345678</Radio>

                                                            {personalInformation.certNo && (
                                                                <Radio style={{ margin: '6px 0px' }} value={personalInformation.certNo.slice(-6)}>
                                                                    {`${personalInformation.certNo.slice(-6)}(身份证后6位)`}
                                                                </Radio>
                                                            )}
                                                            {personalInformation.mobile && (
                                                                <Radio style={{ margin: '6px 0px' }} value={personalInformation.mobile.slice(-6)}>
                                                                    {`${personalInformation.mobile.slice(-6)}(手机号后6位)`}
                                                                </Radio>
                                                            )}
                                                        </Radio.Group>
                                                    </div>
                                                )}
                                                onConfirm={() => this.clickParentResetPwd(personalInformation.userId)}
                                                okText={trans('global.confirm', '确定')}
                                                cancelText={trans('global.cancel', '取消')}
                                                okButtonProps={{ shape: "round", style: { borderRadius: '8px', padding: '0 15px', height: '30px' } }} // 设置确定按钮样式为圆润
                                                cancelButtonProps={{ shape: "round", style: { borderRadius: '8px', padding: '0 15px', height: '30px' } }} // 设置取消按钮样式为圆润
                                            >
                                                <em className={styles.resetPwd}>
                                                    {trans('student.resetPwd', '重置密码')}
                                                </em>
                                            </Popconfirm> : null
                                            }

                                        </>

                                    )}
                                </span>
                            </div>
                            <div className={styles.infoUtil}>
                                <span>
                                    {trans('student.dingdingNumber', '钉钉账号')}：{' '}
                                    <em>{personalInformation.dingUserId}</em>
                                </span>
                            </div>
                        </div>
                        {identity == 'employee' && (
                            <div className={styles.personalInformation}>
                                <p className={styles.infoTitle}>外部人员其他信息</p>
                                <div className={styles.infoUtil}>
                                    <span>
                                        所属机构：{' '}
                                        {isEdit ? (
                                            <Input
                                                placeholder="请输入所属机构信息"
                                                onChange={this.changeAgency}
                                                className={styles.inputStyle}
                                                value={agencyName}
                                                style={{ width: 180 }}
                                            />
                                        ) : (
                                            <em>{personalInformation.agencyName}</em>
                                        )}
                                    </span>
                                </div>
                                <div className={styles.infoUtil}>
                                    <span>
                                        车牌号：{' '}
                                        {isEdit ? (
                                            <Input
                                                placeholder="请输入车牌号"
                                                onChange={this.changeCarNumber}
                                                className={styles.inputStyle}
                                                value={carNumber}
                                                style={{ width: 180 }}
                                            />
                                        ) : (
                                            <em>{personalInformation.carNumber}</em>
                                        )}
                                    </span>
                                </div>
                                <div className={styles.infoUtil}>
                                    <span>
                                        外部人员入职申请链接：
                                        {window.location.origin +
                                            '/externalSubmitPage#/employee/application/false/' +
                                            `${currentUser.schoolId}/${currentUser.eduGroupcompanyId}`}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    {identity == 'staff' ? (
                        havePowerEditInfo ? (
                            <div className={styles.operationList}>
                                {isEdit ? (
                                    <span
                                        className={styles.editBtn}
                                        onClick={() => this.confirmEdit(staffType)}
                                    >
                                        {trans('global.finish', '完成')}
                                    </span>
                                ) : (
                                    <span className={styles.editBtn} onClick={this.editStaffInfo}>
                                        {trans('global.edit', '编辑')}
                                    </span>
                                )}
                                {staffType == 'externalUser' && (
                                    <Popconfirm
                                        placement="top"
                                        title={confirmText}
                                        onConfirm={this.confirmQuit}
                                        okText={trans('global.confirm', '确定')}
                                        cancelText={trans('global.cancel', '取消')}
                                    >
                                        <span className={styles.editBtn}>
                                            {trans('teacher.quitDirectly', '直接离职')}
                                        </span>
                                    </Popconfirm>
                                )}
                                <span className={styles.cancelBtn} onClick={this.onClose}>
                                    {trans('global.cancel', '取消')}
                                </span>
                            </div>
                        ) : (
                            ''
                        )
                    ) : (
                        <div className={styles.operationList}>
                            {seletedIdx != 3 && (
                                <Popconfirm
                                    placement="top"
                                    title={
                                        seletedIdx == 0
                                            ? '确定将此人设为离职状态吗？'
                                            : seletedIdx == 1
                                                ? '确定将此人复职吗？'
                                                : seletedIdx == 2
                                                    ? '确定将此人状态设为审核通过吗？'
                                                    : ''
                                    }
                                    onConfirm={this.confirmQuit}
                                    okText={trans('global.confirm', '确定')}
                                    cancelText={trans('global.cancel', '取消')}
                                >
                                    <span className={styles.editBtn}>
                                        {seletedIdx == 0
                                            ? '直接离职'
                                            : seletedIdx == 1
                                                ? '恢复在职'
                                                : seletedIdx == 2
                                                    ? '审核'
                                                    : ''}
                                    </span>
                                </Popconfirm>
                            )}

                            {isEdit ? (
                                <span
                                    className={styles.editBtn}
                                    onClick={() => this.confirmEdit(staffType)}
                                >
                                    {trans('global.finish', '完成')}
                                </span>
                            ) : (!seletedIdx == 1 &&
                                <span className={styles.editBtn} onClick={this.editStaffInfo}>
                                    {trans('global.edit', '编辑')}
                                </span>
                            )}
                            <span className={styles.cancelBtn} onClick={this.onClose}>
                                {trans('global.cancel', '取消')}
                            </span>
                        </div>
                    )}
                </Drawer>
            </div>
        );
    }
}
