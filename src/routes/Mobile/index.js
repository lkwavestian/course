//移动端更新
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import { Radio, Form, message, Upload, Icon } from 'antd';
import { Modal, List, Picker, InputItem, DatePicker, Button } from 'antd-mobile';
import * as dd from 'dingtalk-jsapi';
import 'antd-mobile/dist/antd-mobile.css';
import moment from 'moment';
import logoImg from '../../assets/scss.png';
import OssButton from '../../components/UploadByOSS/ossButton';
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

const relationTypeList = [
    { label: trans('global.unknown', '未知'), key: 0, value: 0 },
    { label: trans('global.father', '父亲'), key: 1, value: 1 },
    { label: trans('global.mother', '母亲'), key: 2, value: 2 },
    { label: trans('global.grandfather', '爷爷'), key: 3, value: 3 },
    { label: trans('global.grandmother', '奶奶'), key: 4, value: 4 },
    { label: trans('global.grandpa', '姥爷'), key: 5, value: 5 },
    { label: trans('global.grandma', '姥姥'), key: 6, value: 6 },
    { label: trans('global.uncle', '叔叔'), key: 7, value: 7 },
    { label: trans('global.aunt', '阿姨'), key: 8, value: 8 },
    { label: trans('global.nanny', '保姆'), key: 9, value: 9 },
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

const residenceTypeList = [
    {
        label: trans('global.Household', '户口本'),
        key: 'HOUSEHOLD_REGISTER',
        value: 'HOUSEHOLD_REGISTER',
    },
    {
        label: trans('global.residenceCertificate', '户籍证明'),
        key: 'HOUSEHOLD_REGISTRATION_CERTIFICATE',
        value: 'HOUSEHOLD_REGISTRATION_CERTIFICATE',
    },
    {
        label: trans('global.rentHouse', '租赁合同'),
        key: 'RENTAL_CONTRACT',
        value: 'RENTAL_CONTRACT',
    },
    { label: trans('global.other', '其他'), key: 'OTHER', value: 'OTHER' },
];

const educationList = [
    { label: trans('global.primarySchool', '小学'), key: 1, value: 1 },
    { label: trans('global.middleSchool', '初中'), key: 2, value: 2 },
    { label: trans('global.highSchool', '高中'), key: 3, value: 3 },
    { label: trans('global.specialty', '专科'), key: 4, value: 4 },
    { label: trans('global.undergraduate', '本科'), key: 5, value: 5 },
    { label: trans('global.master', '硕士'), key: 6, value: 6 },
    { label: trans('global.doctor', '博士'), key: 7, value: 7 },
    { label: trans('global.other', '其他'), key: 8, value: 8 },
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
}))
export default class OrganizationMobile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            connectOf: false, //是否显示
            connectif: false,
            name: '',
            ename: '',
            sex: 0,
            birthday: '',
            certType: 0,
            certNo: '',
            mobile: '',
            nativePlace: '',
            nativePlaceId: '',
            householdType: 0,
            householdInfo: '',
            bankRegisterInfo: '',
            householdInfoId: '',
            bankRegisterId: [],
            birthdayAddressInfo: '',
            birthdayAddressInfoId: '',
            residentialInfo: '',
            residentialInfoId: '',
            contactAddressInfo: '',
            contactAddressInfoId: '',
            parentInfoList: [],
            bankPayInfo: {},
            nationality: [],
            nationalityId: '',
            nation: [],
            nationId: '',
            householdInfotext: '',
            onChangeAddressInfo: '',
            onChangeresidentialInfoText: '',
            onChangebirthdayAddressInfoText: '',
            contactAddressInfoText: '',
            householdInfotextTo: '',
            onChangeAddressInfoTo: '',
            onChangeresidentialInfoTextTo: '',
            onChangebirthdayAddressInfoTextTo: '',
            contactAddressInfoTextTo: '',
            parentChildIf: false,
            butout: false,
            idName: '',
            enFirstName: '',
            enLastName: '',
            householdIdStreetId: '',
            connectIdStreetId: '',
            residentialIdStreetId: '',
            birthdayIdStreetId: '',
            identityCode: '', //身份信息code
            identityInfoList: [], //身份信息图片
            householdCode: '', //户籍信息code
            householdInfoList: [], //户籍信息图片
            bankNo: '', //银行卡号
            accountName: '', //账户名
            bankName: '', //开户行
        };
    }

    componentWillMount() {
        var searchURL = this.props.location.search;
        searchURL = searchURL.substring(1, searchURL.length);
        var targetPageId = searchURL && searchURL.split('&')[0].split('=')[1];
        const { dispatch } = this.props;
        this.detailedInformation();
        this.getCountryList();
        this.getNationList();
        dispatch({
            type: 'student/checkStudentInfo',
            payload: {
                recordId: targetPageId,
                num: 1,
            },
        }).then(() => {
            const { checkStudentInfo } = this.props;
            if (checkStudentInfo.success) {
                if (checkStudentInfo.showMessage) {
                    alert(
                        '信息正在被编辑',
                        checkStudentInfo.operationUserName +
                            '于' +
                            checkStudentInfo.operationDate +
                            '进入系统并仍在编辑中，您是否要继续进入编辑？若继续，您编辑的内容有可能会被覆盖哦！',
                        [
                            { text: '放弃', onPress: () => console.log('cancel') },
                            {
                                text: '继续编辑',
                                onPress: () => {
                                    this.setState({
                                        connectOf: true,
                                    });
                                },
                            },
                        ]
                    );
                } else {
                    this.setState({
                        connectOf: true,
                    });
                }
            } else {
                if (checkStudentInfo.failType == 1) {
                    alert('不是本学生家长无法编辑');
                } else {
                    alert(
                        '信息已提交完成',
                        checkStudentInfo.operationUserName +
                            '于' +
                            checkStudentInfo.operationDate +
                            '进入系统并提交完成，无法再次修改！',
                        [{ text: '确定', onPress: () => {} }]
                    );
                }
            }
        });
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
            nationalityId: value[0],
            nationality: list[0],
            butout: true,
        });
    };

    //获取民族
    getNationList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getNationList',
            payload: {},
        });
    };

    //改变民族
    changeEthnic = (value) => {
        const { nationInfoData } = this.props;
        let list = [];
        nationInfoData &&
            nationInfoData.map((item) => {
                value.map((i) => {
                    if (item.id === i) {
                        list.push(item.name);
                    }
                });
            });
        this.setState({
            nationId: value[0],
            nation: list[0],
            butout: true,
        });
    };

    province = (value, i) => {
        let list = '';
        let listchildren = '';
        let listchildrenlabel = '';
        district &&
            district.map((item) => {
                if (item.code == value[0]) {
                    list = item.label;
                    item.children &&
                        item.children.length &&
                        item.children.map((item2) => {
                            if (item2.code == value[1]) {
                                listchildren = item2.label;
                            }
                            item2.children &&
                                item2.children.length &&
                                item2.children.map((item3) => {
                                    if (item3.code == value[2]) {
                                        listchildrenlabel = item3.label;
                                    }
                                });
                        });
                }
            });
        switch (i) {
            case 1:
                this.setState({
                    nativePlace: list + listchildren + listchildrenlabel,
                    nativePlaceId: value,
                });
                break;
            case 2:
                this.setState({
                    householdInfo: list + listchildren + listchildrenlabel,
                    householdInfoId: value,
                });
                break;
            case 3:
                this.setState({
                    birthdayAddressInfo: list + listchildren + listchildrenlabel,
                    birthdayAddressInfoId: value,
                });
                break;
            case 4:
                this.setState({
                    residentialInfo: list + listchildren + listchildrenlabel,
                    residentialInfoId: value,
                });
                break;
            case 5:
                this.setState({
                    contactAddressInfo: list + listchildren + listchildrenlabel,
                    contactAddressInfoId: value,
                });
                break;
        }
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

    //更改籍贯
    changeprovince = (value) => {
        this.province(value, 1);
        this.setState({
            butout: true,
        });
    };

    //更改户籍地址
    changeaddress = (value) => {
        this.province(value, 2);
        this.setState({
            butout: true,
        });
        this.getHouseholdStreet(value);
    };

    //更改开户地
    changeBank = (value) => {
        this.changeBankPlace(value);
        this.setState({
            butout: true,
        });
        // this.getHouseholdStreet(value);
    };

    //更改出生地址
    onChangebirthdayAddressInfo = (value) => {
        this.province(value, 3);
        this.setState({
            butout: true,
        });
        this.getBirthdayStreet(value);
    };

    //更改居住地址
    onChangeresidentialInfo = (value) => {
        this.province(value, 4);
        this.setState({
            butout: true,
        });
        this.getResidentStreet(value);
    };

    //更改联系地址
    onChangecontactAddressInfo = (value) => {
        const { dispatch } = this.props;
        this.province(value, 5);
        this.setState({
            butout: true,
        });
        this.getContactStreet(value);
    };

    changeIdentity = (value) => {
        this.setState({
            identityCode: value,
        });
    };
    changeHouseHold = (value) => {
        this.setState({
            householdCode: value,
        });
    };

    //获取详细信息
    detailedInformation() {
        var searchURL = this.props.location.search;
        searchURL = searchURL.substring(1, searchURL.length);
        var targetPageId = searchURL && searchURL.split('&')[0].split('=')[1];
        const { dispatch } = this.props;
        dispatch({
            type: 'student/upDateStudentInfo',
            payload: {
                recordId: targetPageId,
            },
        }).then(() => {
            const { upDateStudentInfo } = this.props;
            this.setState(
                {
                    idName: upDateStudentInfo.IDName,
                    name: upDateStudentInfo.name,
                    ename: upDateStudentInfo.ename,
                    enFirstName: upDateStudentInfo.enFirstName,
                    enLastName: upDateStudentInfo.enLastName,
                    sex: upDateStudentInfo.sex,
                    birthday: upDateStudentInfo.birthday,
                    nationality: upDateStudentInfo.nationality,
                    nationalityId: upDateStudentInfo.nationalityId,
                    nation: upDateStudentInfo.nation,
                    nationId: upDateStudentInfo.nationId,
                    certType: upDateStudentInfo.certType,
                    certNo: upDateStudentInfo.certNo,
                    mobile: upDateStudentInfo.mobile,
                    nativePlace: upDateStudentInfo.nativePlace,
                    householdType: upDateStudentInfo.householdType,
                    householdInfo: upDateStudentInfo.householdInfo,
                    bankRegisterInfo: upDateStudentInfo.bankRegisterInfo,
                    birthdayAddressInfo: upDateStudentInfo.birthdayAddressInfo,
                    residentialInfo: upDateStudentInfo.residentialInfo,
                    contactAddressInfo: upDateStudentInfo.contactAddressInfo,

                    householdIdStreetId: upDateStudentInfo.householdIdStreetId,
                    connectIdStreetId: upDateStudentInfo.connectIdStreetId,
                    residentialIdStreetId: upDateStudentInfo.residentialIdStreetId,
                    birthdayIdStreetId: upDateStudentInfo.birthdayIdStreetId,

                    nativePlaceId: upDateStudentInfo.nativePlaceId
                        ? upDateStudentInfo.nativePlaceId.split('-')
                        : [],
                    householdInfoId: upDateStudentInfo.householdId
                        ? upDateStudentInfo.householdId.split('-')
                        : [],
                    birthdayAddressInfoId: upDateStudentInfo.birthdayAddressId
                        ? upDateStudentInfo.birthdayAddressId.split('-')
                        : [],
                    residentialInfoId: upDateStudentInfo.residentialId
                        ? upDateStudentInfo.residentialId.split('-')
                        : [],
                    contactAddressInfoId: upDateStudentInfo.contactAddressId
                        ? upDateStudentInfo.contactAddressId.split('-')
                        : [],

                    parentInfoList: upDateStudentInfo.parentInfoList,
                    bankPayInfo: upDateStudentInfo.bankPayInfo,
                    identityCode: upDateStudentInfo?.identityInfo?.code || '',
                    identityInfoList: upDateStudentInfo?.identityInfo?.fileList || [],
                    householdCode: upDateStudentInfo?.householdRegisterInfo?.code || '',
                    householdInfoList: upDateStudentInfo?.householdRegisterInfo?.fileList || [],
                    bankNo: upDateStudentInfo?.bankPayInfo?.bankNo || '',
                    accountName: upDateStudentInfo?.bankPayInfo?.accountName || '',
                    bankName: upDateStudentInfo?.bankPayInfo?.bankName || '',
                    bankRegisterId:
                        (upDateStudentInfo.bankPayInfo &&
                            upDateStudentInfo.bankPayInfo.bankFullRegisterId &&
                            upDateStudentInfo.bankPayInfo.bankFullRegisterId.split('-')) ||
                        [],
                },
                () => {
                    const {
                        householdInfoId,
                        birthdayAddressInfoId,
                        residentialInfoId,
                        contactAddressInfoId,
                        bankNo,
                        accountName,
                        bankName,
                        bankRegisterId,
                    } = this.state;
                    if (!bankNo || !accountName || !bankName || bankRegisterId.length == 0) {
                        this.setState({
                            butout: true,
                        });
                    }
                    this.getHouseholdStreet(householdInfoId);
                    this.getBirthdayStreet(birthdayAddressInfoId);
                    this.getResidentStreet(residentialInfoId);
                    this.getContactStreet(contactAddressInfoId);
                }
            );
        });
    }

    //根据民族id查询民族名称或者根据国籍id查询国籍名称
    getNameById = (id, arr) => {
        let name;
        arr &&
            arr.length > 0 &&
            arr.map((item) => {
                if (item.id == id) {
                    name = item.name;
                }
            });
        return name;
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

    hasWhiteSpace = (s) => {
        return /\s/g.test(s);
    };

    //二次提交
    onTwoSubmit = () => {
        const {
            upDateStudentInfo: { propertyInfoInputModel },
            dispatch,
        } = this.props;
        const { certNo, certType, bankNo, accountName, bankName, bankRegisterId } = this.state;
        let userPropertyList = propertyInfoInputModel
            ? propertyInfoInputModel.userPropertyList
            : [];
        var searchURL = this.props.location.search;
        searchURL = searchURL.substring(1, searchURL.length);
        var targetPageId = searchURL && searchURL.split('&')[0].split('=')[1];
        var idcardReg =
            /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (
            !idcardReg.test(certNo) &&
            certType == 1 &&
            userPropertyList.includes('certNo') &&
            certNo
        ) {
            alert('请正确填写证件号码');
            return;
        }
        if (!bankNo) {
            message.warn('银行卡号为必填项');
            return;
        }
        if (this.hasWhiteSpace(bankNo)) {
            message.warn('银行卡号不允许含有空格');
            return;
        }
        if (!accountName) {
            message.warn('账户名为必填项');
            return;
        }
        if (!bankName) {
            message.warn('开户行为必填项');
            return;
        }
        if (bankRegisterId.length == 0) {
            message.warn('开户地为必选项');
            return;
        }
        dispatch({
            type: 'student/checkStudentInfo',
            payload: {
                recordId: targetPageId,
                num: 2,
            },
        }).then(() => {
            const { checkStudentInfo } = this.props;
            if (checkStudentInfo.success) {
                alert('修改完成确认继续提交', '', [
                    { text: '放弃', onPress: () => console.log('cancel') },
                    {
                        text: '提交',
                        onPress: () => {
                            this.submit();
                        },
                    },
                ]);
            } else {
                alert(
                    '已有人提交信息 ...',
                    checkStudentInfo.operationUserName +
                        '于' +
                        checkStudentInfo.operationDate +
                        '更新了信息，您是否要继续提交？若继续提交，对方更新的内容会被覆盖哦！',
                    [
                        { text: '放弃', onPress: () => console.log('cancel') },
                        {
                            text: '继续提交',
                            onPress: () => {
                                this.submit();
                            },
                        },
                    ]
                );
            }
        });
    };

    //确认提交
    submit = () => {
        const { upDateStudentInfo, dispatch, checkStudentInfo } = this.props;
        const {
            enFirstName,
            enLastName,
            idName,
            name,
            ename,
            sex,
            birthday,
            nationality,
            nation,
            certType,
            mobile,
            nativePlace,
            householdType,
            householdInfo,
            bankRegisterInfo,
            birthdayAddressInfo,
            residentialInfo,
            contactAddressInfo,
            householdInfotextTo,
            certNo,
            nativePlaceId,
            householdInfoId,
            birthdayAddressInfoId,
            residentialInfoId,
            contactAddressInfoId,
            householdInfotext,
            onChangeresidentialInfoText,
            contactAddressInfoText,
            onChangebirthdayAddressInfoText,
            onChangeresidentialInfoTextTo,
            onChangebirthdayAddressInfoTextTo,
            contactAddressInfoTextTo,
            householdIdStreetId,
            connectIdStreetId,
            residentialIdStreetId,
            birthdayIdStreetId,
            identityCode,
            identityInfoList,
            householdCode,
            householdInfoList,
            bankNo,
            accountName,
            bankName,
            bankRegisterId,
        } = this.state;
        const nub = upDateStudentInfo.parentInfoList.length;
        var searchURL = this.props.location.search;
        searchURL = searchURL.substring(1, searchURL.length);
        var targetPageId = searchURL && searchURL.split('&')[0].split('=')[1];
        let propertyInfoInputModel = upDateStudentInfo.propertyInfoInputModel;
        let userPropertyList = propertyInfoInputModel
            ? propertyInfoInputModel.userPropertyList
            : [];
        if (userPropertyList.includes('userName') && (idName === undefined || idName === null)) {
            message.info('姓名为必填项');
            return;
        }
        if (userPropertyList.includes('name') && (name === undefined || name === null)) {
            message.info('中文名为必填项');
            return;
        }
        if (
            userPropertyList.includes('ename') &&
            (enFirstName === undefined || enFirstName === null)
        ) {
            message.info('英文名为必填项');
            return;
        }
        if (
            userPropertyList.includes('ename') &&
            (enFirstName === undefined || enLastName === null)
        ) {
            message.info('英文名为必填项');
            return;
        }
        if (userPropertyList.includes('sex') && (sex === undefined || sex === null)) {
            message.info('性别为必填项');
            return;
        }
        if (
            userPropertyList.includes('birthday') &&
            (birthday === undefined || birthday === null)
        ) {
            message.info('出生日期为必填项');
            return;
        }
        if (
            userPropertyList.includes('nationality') &&
            (nationality === undefined || nationality === null)
        ) {
            message.info('国籍为必填项');
            return;
        }
        if (userPropertyList.includes('nation') && (nation === undefined || nation === null)) {
            message.info('民族为必填项');
            return;
        }
        if (userPropertyList.includes('certNo') && (certType === undefined || certType === null)) {
            message.info('证件类型为必填项');
            return;
        }
        if (userPropertyList.includes('certNo') && (certNo === undefined || certNo === null)) {
            message.info('证件号码为必填项');
            return;
        }
        if (userPropertyList.includes('mobile') && (mobile === undefined || mobile === null)) {
            message.info('手机为必填项');
            return;
        }
        /* if (
            userPropertyList.includes('nativePlaceId') &&
            (!nativePlace || nativePlaceId.length === 0)
        ) {
            message.info('籍贯为必填项');
            return;
        }
        if (
            userPropertyList.includes('householdType') &&
            (householdType === undefined || householdType === null)
        ) {
            message.info('户籍类别为必填项');
            return;
        }
        if (
            userPropertyList.includes('householdInfo') &&
            (!householdInfoId || householdInfoId.length === 0)
        ) {
            message.info('户籍地址为必填项');
            return;
        }
        if (
            userPropertyList.includes('birthdayAddressInfo') &&
            (!birthdayAddressInfoId || birthdayAddressInfoId.length === 0)
        ) {
            message.info('出生地址为必填项');
            return;
        }
        if (
            userPropertyList.includes('residentialInfo') &&
            (!residentialInfoId || residentialInfoId.length === 0)
        ) {
            message.info('居住地址为必填项');
            return;
        }
        if (
            userPropertyList.includes('contactAddressInfo') &&
            (!contactAddressInfoId || contactAddressInfoId.length === 0)
        ) {
            message.info('联系地址为必填项');
            return;
        }

        if (
            annexPropertyList.includes('identity') &&
            (!identityCode ||
                identityCode.length == 0 ||
                !identityInfoList ||
                identityInfoList.length == 0)
        ) {
            message.info('身份信息及附件必填');
            return;
        }
        if (
            annexPropertyList.includes('household') &&
            (!householdCode ||
                householdCode.length == 0 ||
                !householdInfoList ||
                householdInfoList.length == 0)
        ) {
            message.info('户籍信息及附件必填');
            return;
        } */
        this.props.form.validateFields((err, values) => {
            console.log('values ==>', values);
            if (!err) {
                let sublist = [];
                for (let i = 0; i < nub; i++) {
                    let obj = {};
                    obj.name = values[`name${i}`];
                    obj.relationType = values[`relationType${i}`] && values[`relationType${i}`][0];
                    obj.nationality = this.getNameById(
                        values[`nationality${i}`] && values[`nationality${i}`][0],
                        this.props.countryInfoData
                    );
                    obj.certType = values[`certType${i}`] && values[`certType${i}`][0];
                    obj.certNo = values[`certNo${i}`];
                    obj.mobile = values[`mobile${i}`];
                    obj.workUnit = values[`workUnit${i}`];
                    obj.jobPosition = values[`jobPosition${i}`];
                    obj.education = values[`educationTo${i}`] && values[`educationTo${i}`][0];
                    obj.studentUserId = upDateStudentInfo.userId;
                    obj.parentUserId = upDateStudentInfo.parentInfoList[i].userId;
                    obj.email = values[`email${i}`];
                    obj.mainRelation = values[`mainRelation${i}`] && values[`mainRelation${i}`][0];
                    sublist.push(obj);
                }

                dispatch({
                    type: 'student/subupdateStudentInfo',
                    payload: {
                        IDName: idName,
                        name,
                        ename,
                        enFirstName,
                        enLastName,
                        sex,
                        birthday: birthday && birthday.valueOf(),
                        nationality,
                        nation,
                        certType,
                        certNo,
                        mobile,
                        householdType,
                        nativePlaceId: nativePlaceId[nativePlaceId.length - 1],

                        householdId: householdIdStreetId
                            ? householdIdStreetId
                            : householdInfoId[householdInfoId.length - 1],
                        birthdayAddressId: birthdayIdStreetId
                            ? birthdayIdStreetId
                            : birthdayAddressInfoId[birthdayAddressInfoId.length - 1],
                        residentialId: residentialIdStreetId
                            ? residentialIdStreetId
                            : residentialInfoId[residentialInfoId.length - 1],
                        contactAddressId: connectIdStreetId
                            ? connectIdStreetId
                            : contactAddressInfoId[contactAddressInfoId.length - 1],

                        householdInfo: householdInfotextTo
                            ? householdInfotext
                            : householdInfo && householdInfo.split('&')[1],
                        residentialInfo: onChangeresidentialInfoTextTo
                            ? onChangeresidentialInfoText
                            : residentialInfo && residentialInfo.split('&')[1],
                        birthdayAddressInfo: onChangebirthdayAddressInfoTextTo
                            ? onChangebirthdayAddressInfoText
                            : birthdayAddressInfo && birthdayAddressInfo.split('&')[1],
                        contactAddressInfo: contactAddressInfoTextTo
                            ? contactAddressInfoText
                            : contactAddressInfo && contactAddressInfo.split('&')[1],

                        userId: upDateStudentInfo.userId,
                        currentDate: checkStudentInfo.currentDate,
                        recordId: targetPageId,
                        parentInfoList: sublist,
                        identityInfo: {
                            code: values?.identityCode ? values.identityCode : '',
                            fileList: identityInfoList,
                        },
                        householdRegisterInfo: {
                            code: values?.householdCode ? values.householdCode : '',
                            fileList: householdInfoList,
                        },
                        bankPayInfo: {
                            bankNo,
                            accountName,
                            bankName,
                            bankRegisterId: bankRegisterId[1] || '',
                        },
                    },
                    onSuccess: () => {
                        this.setState({
                            connectOf: false,
                            connectif: true,
                        });
                    },
                });
            } else {
                // message.error(err);
                console.log('err :>> ', err);
            }
        });
    };

    //改变户籍详细地址
    changeaddressText = (value) => {
        this.setState({
            householdInfotext: value,
            householdInfotextTo: 1,
            butout: true,
        });
    };

    //改变居住地详细地址
    onChangeresidentialInfoText = (value) => {
        this.setState({
            onChangeresidentialInfoText: value,
            onChangeresidentialInfoTextTo: 1,
            butout: true,
        });
    };

    //改变出生地址详细地址
    onChangebirthdayAddressInfoText = (value) => {
        this.setState({
            onChangebirthdayAddressInfoText: value,
            onChangebirthdayAddressInfoTextTo: 1,
            butout: true,
        });
    };

    //改变联系地址详细地址
    contactAddressInfoText = (value) => {
        this.setState({
            contactAddressInfoText: value,
            contactAddressInfoTextTo: 1,
            butout: true,
        });
    };

    //处理省市区数据
    handleProvinceData = (arr) => {
        if (!arr || arr.length == 0) return;
        arr.map((item) => {
            item.value = `${item.code}`;
            item.children = this.handleProvinceData(item.children);
        });
        return arr;
    };

    //处理省市数据
    handleCityData = (arr) => {
        if (!arr || arr.length == 0) return;
        arr.map((item) => {
            item.value = `${item.code}`;
            item.children = this.getCityList(item.children);
        });
        return arr;
    };

    getCityList = (arr) => {
        if (!arr || arr.length == 0) return;
        arr.map((item) => {
            item.value = `${item.code}`;
            item.children = undefined;
        });
        return arr;
    };

    //户籍地址街道列表
    getHouseholdStreet = (value) => {
        const { dispatch } = this.props;
        if (!value || value.length === 0) {
            dispatch({
                type: 'student/emptyStreetList',
            });
            return;
        }
        dispatch({
            type: 'student/streetList',
            payload: {
                code: value[value.length - 1],
            },
        });
    };

    //出生地址街道列表
    getBirthdayStreet = (value) => {
        const { dispatch } = this.props;
        if (!value || value.length === 0) {
            dispatch({
                type: 'student/emptyStreetBornList',
            });
            return;
        }
        dispatch({
            type: 'student/streetBornList',
            payload: {
                code: value[value.length - 1],
            },
        });
    };

    //居住地址街道列表
    getResidentStreet = (value) => {
        const { dispatch } = this.props;
        if (!value || value.length === 0) {
            dispatch({
                type: 'student/emptyStreetAddressList',
            });
            return;
        }
        dispatch({
            type: 'student/streetAddressList',
            payload: {
                code: value[value.length - 1],
            },
        });
    };

    //联系地址街道列表
    getContactStreet = (value) => {
        const { dispatch } = this.props;
        if (!value || value.length === 0) {
            dispatch({
                type: 'student/emptyStreetContactList',
            });
            return;
        }

        dispatch({
            type: 'student/streetContactList',
            payload: {
                code: value[value.length - 1],
            },
        });
    };

    //文件上传
    /* upload = (file) => {
        this.setState({
            identityImgs: file.previewImage,
            uploadStatus: file.status,
        });
    }; */
    uploadIdentity = (info) => {
        let file = info.file;
        // let fileList = JSON.parse(JSON.stringify(this.state.fileList));
        // if (!this.ifHaveUid(file.uid)) {
        //     // fileList.push(file);
        //     fileList[index] = file;
        // }
        // this.setState({
        //     fileList,
        // });
        if (file && file.status === 'done') {
            const response = file.response?.content ? file.response.content[0] : [];
            let resFile = {
                url: response.url,
                uid: file.uid,
                name: response.fileName,
            };
            let identityInfoList = JSON.parse(JSON.stringify(this.state.identityInfoList));
            identityInfoList.push(resFile);
            this.setState({
                identityInfoList,
                butout: true,
            });
            /* if ((type = 'identityInfoList')) {
                let identityInfoList = JSON.parse(JSON.stringify(this.state.identityInfoList));
                identityInfoList.push(resFile);
                this.setState({
                    identityInfoList,
                });
            } else if ((type = 'householdInfoList')) {
                let householdInfoList = JSON.parse(JSON.stringify(this.state.householdInfoList));
                householdInfoList.push(resFile);
                this.setState(
                    {
                        householdInfoList,
                    },
                    () => {
                        console.log('householdInfoList', this.state.householdInfoList);
                    }
                );
            } */
        }
    };
    uploadHouseInfo = (info) => {
        let file = info.file;
        if (file && file.status === 'done') {
            const response = file.response?.content ? file.response.content[0] : [];
            let resFile = {
                url: response.url,
                uid: file.uid,
                name: response.fileName,
            };

            let householdInfoList = JSON.parse(JSON.stringify(this.state.householdInfoList));
            householdInfoList.push(resFile);
            this.setState({
                householdInfoList,
                butout: true,
            });
        }
    };

    delImg = (index) => {
        let newIdentityImgs = JSON.parse(JSON.stringify(this.state.identityInfoList));
        newIdentityImgs.splice(index, 1);
        this.setState({
            identityInfoList: newIdentityImgs,
        });
    };

    delHouseHold = (index) => {
        let newHouseholdInfoList = JSON.parse(JSON.stringify(this.state.householdInfoList));
        newHouseholdInfoList.splice(index, 1);
        this.setState({
            householdInfoList: newHouseholdInfoList,
        });
    };

    render() {
        const {
            upDateStudentInfo: { propertyInfoInputModel },
            form: { getFieldDecorator },
            countryInfoData,
            nationInfoData,
            streetList,
            streetBornList,
            streetAddressList,
            streetContactList,
            upDateStudentInfo: { studentNo },
        } = this.props;
        const {
            enFirstName,
            enLastName,
            idName,
            connectOf,
            name,
            nationality,
            nation,
            certType,
            certNo,
            mobile,
            nativePlace,
            householdType,
            householdInfo,
            bankRegisterInfo,
            birthdayAddressInfo,
            residentialInfo,
            contactAddressInfo,
            parentInfoList,
            bankPayInfo,
            birthday,
            householdInfotext,
            butout,
            connectif,
            onChangeresidentialInfoText,
            contactAddressInfoText,
            onChangebirthdayAddressInfoText,
            nationalityId,
            sex,
            nativePlaceId,
            householdInfoId,
            birthdayAddressInfoId,
            residentialInfoId,
            contactAddressInfoId,
            bankRegisterId,
            nationId,
            householdIdStreetId,
            connectIdStreetId,
            residentialIdStreetId,
            birthdayIdStreetId,
            identityCode,
            identityInfoList,
            householdCode,
            householdInfoList,
            bankNo,
            accountName,
            bankName,
        } = this.state;
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
                <div className="ant-upload-text" style={{ width: 'auto' }}>
                    Upload
                </div>
            </div>
        );

        const province = this.handleProvinceData(district) || [];
        let newDistrict = JSON.parse(JSON.stringify(district));
        const provinceCity = this.handleCityData(newDistrict) || [];

        let userPropertyList = propertyInfoInputModel
            ? propertyInfoInputModel.userPropertyList
            : [];
        let parentPropertyList = propertyInfoInputModel
            ? propertyInfoInputModel.parentPropertyList
            : [];

        let payPropertyList = propertyInfoInputModel ? propertyInfoInputModel.payPropertyList : [];
        let annexPropertyList = propertyInfoInputModel
            ? propertyInfoInputModel.annexPropertyList
            : [];
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
                {connectOf && (
                    <div className={styles.Lister}>
                        <div className={styles.headline}>基本信息</div>
                        <InputItem disabled placeholder="学号不可修改" value={studentNo}>
                            <span style={{ color: '#000' }}>
                                <em className={styles.redIcon}></em>
                                {trans('student.studentNo', '学号')}
                            </span>
                        </InputItem>
                        <List>
                            <InputItem
                                placeholder="请与身份证件信息一致"
                                value={idName}
                                onChange={(val) => {
                                    this.setState({
                                        idName: val,
                                        butout: true,
                                    });
                                }}
                                disabled={!userPropertyList.includes('userName')}
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                    {trans('global.theme', '姓名')}
                                </span>
                            </InputItem>
                            <InputItem
                                placeholder={trans('global.pleaseEnte', '请输入')}
                                value={name}
                                onChange={(val) => {
                                    this.setState({
                                        name: val,
                                        butout: true,
                                    });
                                }}
                                className={userPropertyList.includes('name') ? '' : styles.hideItem}
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                    {trans('global.cnName', '中文名')}
                                </span>
                            </InputItem>
                            <InputItem
                                placeholder={trans('global.pleaseEnte', '请输英文名/First Name')}
                                value={enFirstName}
                                onChange={(val) => {
                                    this.setState({
                                        enFirstName: val,
                                        butout: true,
                                    });
                                }}
                                className={
                                    userPropertyList.includes('ename') ? '' : styles.hideItem
                                }
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                    {trans('global.enTheme', '英文名')}
                                </span>
                            </InputItem>
                            <InputItem
                                placeholder={trans('global.pleaseEnte', '请输姓的拼音/Last Name')}
                                value={enLastName}
                                onChange={(val) => {
                                    this.setState({
                                        enLastName: val,
                                        butout: true,
                                    });
                                }}
                                className={
                                    userPropertyList.includes('ename') ? '' : styles.hideItem
                                }
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                </span>
                            </InputItem>
                            <Item
                                className={userPropertyList.includes('sex') ? '' : styles.hideItem}
                            >
                                <span className={styles.repeatList}>
                                    <em className={styles.redIcon}></em>
                                    {trans('global.repeat', '性别')}
                                </span>
                                <div className={styles.repeatRadio}>
                                    <RadioGroup
                                        onChange={(e) => {
                                            this.setState({
                                                sex: e.target.value,
                                                butout: true,
                                            });
                                        }}
                                        value={sex}
                                    >
                                        <Radio value={'1'}>{trans('global.noRepeat', '男')}</Radio>
                                        <Radio value={'2'}>{trans('global.yesRepeat', '女')}</Radio>
                                    </RadioGroup>
                                </div>
                            </Item>
                            {userPropertyList.includes('birthday') && (
                                <DatePicker
                                    mode="date"
                                    title="选择日期"
                                    okText="确定"
                                    dismissText="取消"
                                    onChange={(value) =>
                                        this.setState({ birthday: value, butout: true })
                                    }
                                    value={birthday ? new Date(birthday) : ''}
                                    extra={
                                        birthday
                                            ? moment(birthday).format('YYYY-MM-DD')
                                            : '请选择出生日期'
                                    }
                                >
                                    <List.Item arrow="horizontal">出生日期</List.Item>
                                </DatePicker>
                            )}
                            {userPropertyList.includes('nationality') && (
                                <Picker
                                    data={countryInfoData}
                                    cols={1}
                                    onChange={this.changeCountry}
                                    okText={trans('global.determine', '确定')}
                                    dismissText={trans('global.cancel', '取消')}
                                    value={nationalityId !== undefined ? [nationalityId] : []}
                                    extra={nationality ? nationality : '请选择国籍'}
                                >
                                    <Item arrow="horizontal">
                                        <span className={styles.itemTitle}>
                                            {trans('global.type', '国籍')}
                                        </span>
                                    </Item>
                                </Picker>
                            )}
                            {userPropertyList.includes('nation') && (
                                <Picker
                                    data={nationInfoData}
                                    cols={1}
                                    value={nationId !== undefined ? [nationId] : []}
                                    extra={nation ? nation : '请选择民族'}
                                    onChange={this.changeEthnic}
                                    okText={trans('global.determine', '确定')}
                                    dismissText={trans('global.cancel', '取消')}
                                >
                                    <Item arrow="horizontal">
                                        <span className={styles.itemTitle}>
                                            {trans('global.type', '民族')}
                                        </span>
                                    </Item>
                                </Picker>
                            )}
                            {userPropertyList.includes('certNo') && (
                                <Fragment>
                                    <Picker
                                        data={parentCerType}
                                        cols={1}
                                        onChange={(value) =>
                                            this.setState({ certType: value[0], butout: true })
                                        }
                                        value={certType ? [Number(certType)] : []}
                                        okText={trans('global.determine', '确定')}
                                        dismissText={trans('global.cancel', '取消')}
                                    >
                                        <Item arrow="horizontal">
                                            <span className={styles.itemTitle}>
                                                {trans('global.type', '证件类型')}
                                            </span>
                                        </Item>
                                    </Picker>
                                    <InputItem
                                        placeholder={trans('global.pleaseEnte', '请输入')}
                                        value={certNo}
                                        onChange={(value) => {
                                            this.setState({
                                                certNo: value,
                                                butout: true,
                                            });
                                        }}
                                    >
                                        <span>
                                            <em className={styles.redIcon}></em>
                                            {trans('global.enTheme', '证件号码')}
                                        </span>
                                    </InputItem>
                                </Fragment>
                            )}
                            {userPropertyList.includes('mobile') && (
                                <InputItem
                                    placeholder={trans('global.pleaseEnte', '请输入')}
                                    value={mobile}
                                    onChange={(value) => {
                                        this.setState({
                                            mobile: value,
                                            butout: true,
                                        });
                                    }}
                                    className={
                                        userPropertyList.includes('mobile') ? '' : styles.hideItem
                                    }
                                >
                                    <span>
                                        <em className={styles.redIcon}></em>
                                        {trans('global.enTheme', '手机')}
                                    </span>
                                </InputItem>
                            )}
                            {userPropertyList.includes('nativePlaceId') && (
                                <Picker
                                    data={province}
                                    title="请选择"
                                    extra={nativePlace}
                                    value={nativePlaceId}
                                    onChange={this.changeprovince}
                                >
                                    <List.Item arrow="horizontal">籍贯</List.Item>
                                </Picker>
                            )}
                            {userPropertyList.includes('householdType') && (
                                <Fragment>
                                    <Picker
                                        data={[
                                            { label: '未知', value: 0 },
                                            { label: '农业户口', value: 1 },
                                            { label: '非农业户口', value: 2 },
                                        ]}
                                        cols={1}
                                        value={householdType !== undefined ? [householdType] : []}
                                        okText={trans('global.determine', '确定')}
                                        onOk={(e) => {
                                            this.setState({
                                                householdType: e[0],
                                                butout: true,
                                            });
                                        }}
                                        dismissText={trans('global.cancel', '取消')}
                                    >
                                        <Item arrow="horizontal">
                                            <span className={styles.itemTitle}>户籍类别</span>
                                        </Item>
                                    </Picker>
                                </Fragment>
                            )}
                            {userPropertyList.includes('householdInfo') && (
                                <Fragment>
                                    <Picker
                                        data={province}
                                        title="请选择"
                                        onChange={this.changeaddress}
                                        extra={householdInfo && householdInfo.split('&')[0]}
                                        value={householdInfoId}
                                    >
                                        <List.Item arrow="horizontal">户籍地址</List.Item>
                                    </Picker>
                                    <Picker
                                        data={streetList.map((item) => ({
                                            value: String(item.code),
                                            label: item.label,
                                        }))}
                                        title="请选择户籍地址街道"
                                        onChange={(value) => {
                                            this.setState({
                                                householdIdStreetId: value[0],
                                                butout: true,
                                            });
                                        }}
                                        value={[householdIdStreetId]}
                                    >
                                        <List.Item arrow="horizontal">户籍地址街道</List.Item>
                                    </Picker>
                                    <InputItem
                                        placeholder={trans(
                                            'global.pleaseEnte',
                                            '请输入详细户籍地址'
                                        )}
                                        value={
                                            this.state.householdInfotextTo
                                                ? householdInfotext
                                                : householdInfo && householdInfo.split('&')[1]
                                        }
                                        onChange={this.changeaddressText.bind(this)}
                                    >
                                        <span>
                                            <em className={styles.redIcon}></em>
                                        </span>
                                    </InputItem>
                                </Fragment>
                            )}
                            {userPropertyList.includes('birthdayAddressInfo') && (
                                <Fragment>
                                    <Picker
                                        data={province}
                                        title="请选择"
                                        value={birthdayAddressInfoId}
                                        extra={
                                            birthdayAddressInfo && birthdayAddressInfo.split('&')[0]
                                        }
                                        onChange={this.onChangebirthdayAddressInfo}
                                    >
                                        <List.Item arrow="horizontal">出生地址</List.Item>
                                    </Picker>
                                    <Picker
                                        data={streetBornList.map((item) => ({
                                            value: String(item.code),
                                            label: item.label,
                                        }))}
                                        title="请选择出生地址街道"
                                        onChange={(value) => {
                                            this.setState({
                                                birthdayIdStreetId: value[0],
                                                butout: true,
                                            });
                                        }}
                                        value={[birthdayIdStreetId]}
                                    >
                                        <List.Item arrow="horizontal">出生地址街道</List.Item>
                                    </Picker>
                                    {/* <InputItem
                                        value={
                                            this.state.onChangebirthdayAddressInfoTextTo
                                                ? onChangebirthdayAddressInfoText
                                                : birthdayAddressInfo &&
                                                  birthdayAddressInfo.split('&')[1]
                                        }
                                        placeholder={trans(
                                            'global.pleaseEnte',
                                            '请输入详细出生地址'
                                        )}
                                        onChange={this.onChangebirthdayAddressInfoText.bind(this)}
                                    >
                                        <span>
                                            <em className={styles.redIcon}></em>
                                        </span>
                                    </InputItem> */}
                                </Fragment>
                            )}
                            {userPropertyList.includes('residentialInfo') && (
                                <Fragment>
                                    <Picker
                                        data={province}
                                        title="请选择"
                                        onChange={this.onChangeresidentialInfo}
                                        value={residentialInfoId}
                                        extra={residentialInfo && residentialInfo.split('&')[0]}
                                    >
                                        <List.Item arrow="horizontal">居住地址</List.Item>
                                    </Picker>
                                    <Picker
                                        data={streetAddressList.map((item) => ({
                                            value: String(item.code),
                                            label: item.label,
                                        }))}
                                        title="请选择居住地址街道"
                                        onChange={(value) => {
                                            this.setState({
                                                residentialIdStreetId: value[0],
                                                butout: true,
                                            });
                                        }}
                                        value={[residentialIdStreetId]}
                                    >
                                        <List.Item arrow="horizontal">居住地址街道</List.Item>
                                    </Picker>
                                    <InputItem
                                        value={
                                            this.state.onChangeresidentialInfoTextTo
                                                ? onChangeresidentialInfoText
                                                : residentialInfo && residentialInfo.split('&')[1]
                                        }
                                        placeholder={trans(
                                            'global.pleaseEnte',
                                            '请输入详细居住地址'
                                        )}
                                        onChange={this.onChangeresidentialInfoText.bind(this)}
                                    >
                                        <span>
                                            <em className={styles.redIcon}></em>
                                        </span>
                                    </InputItem>
                                </Fragment>
                            )}
                            {userPropertyList.includes('contactAddressInfo') && (
                                <Fragment>
                                    <Picker
                                        data={province}
                                        title="请选择"
                                        onChange={this.onChangecontactAddressInfo}
                                        value={contactAddressInfoId}
                                    >
                                        <List.Item arrow="horizontal">联系地址</List.Item>
                                    </Picker>
                                    <Picker
                                        data={streetContactList.map((item) => ({
                                            value: String(item.code),
                                            label: item.label,
                                        }))}
                                        title="请选择联系地址街道"
                                        onChange={(value) => {
                                            console.log('value', value);
                                            this.setState({
                                                connectIdStreetId: value[0],
                                                butout: true,
                                            });
                                        }}
                                        value={[connectIdStreetId]}
                                    >
                                        <List.Item arrow="horizontal">联系地址街道</List.Item>
                                    </Picker>
                                    <InputItem
                                        value={
                                            this.state.contactAddressInfoTextTo
                                                ? contactAddressInfoText
                                                : contactAddressInfo &&
                                                  contactAddressInfo.split('&')[1]
                                        }
                                        placeholder={trans(
                                            'global.pleaseEnte',
                                            '请输入详细联系地址'
                                        )}
                                        onChange={this.contactAddressInfoText.bind(this)}
                                    >
                                        <span>
                                            <em className={styles.redIcon}></em>
                                        </span>
                                    </InputItem>
                                </Fragment>
                            )}
                            {parentPropertyList && parentPropertyList.length > 0 ? (
                                parentInfoList && parentInfoList.length > 0 ? (
                                    <div>
                                        <div className={styles.headline}>家庭信息</div>
                                        {parentInfoList.map((item, index) => {
                                            return (
                                                <Form>
                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`name${index}`, {
                                                            initialValue: item.name,
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: '姓名为必填项',
                                                                },
                                                            ],
                                                        })(
                                                            <InputItem
                                                                placeholder={trans(
                                                                    'global.pleaseEnte',
                                                                    '请输入'
                                                                )}
                                                                disabled={
                                                                    !parentPropertyList.includes(
                                                                        'name'
                                                                    )
                                                                }
                                                            >
                                                                <span>
                                                                    <em
                                                                        className={styles.redIcon}
                                                                    ></em>
                                                                    {trans('global.theme', '姓名')}
                                                                </span>
                                                            </InputItem>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`relationType${index}`, {
                                                            initialValue: [
                                                                Number(item.relationType),
                                                            ],
                                                        })(
                                                            <Picker
                                                                disabled={
                                                                    parentPropertyList.length > 0
                                                                }
                                                                data={relationTypeList}
                                                                cols={1}
                                                                okText={trans(
                                                                    'global.determine',
                                                                    '确定'
                                                                )}
                                                                dismissText={trans(
                                                                    'global.cancel',
                                                                    '取消'
                                                                )}
                                                            >
                                                                <Item arrow="horizontal">
                                                                    <span
                                                                        className={styles.itemTitle}
                                                                    >
                                                                        {trans(
                                                                            'global.theme',
                                                                            '关系'
                                                                        )}
                                                                    </span>
                                                                </Item>
                                                            </Picker>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'nationality'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`nationality${index}`, {
                                                            initialValue:
                                                                item.nationalityId !== undefined
                                                                    ? [item.nationalityId]
                                                                    : [],

                                                            rules: [
                                                                {
                                                                    required:
                                                                        parentPropertyList.includes(
                                                                            'nationality'
                                                                        )
                                                                            ? true
                                                                            : false,
                                                                    message: '国籍为必填项',
                                                                },
                                                            ],
                                                        })(
                                                            <Picker
                                                                data={countryInfoData}
                                                                cols={1}
                                                                onOk={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                                //value={["5"]}
                                                                okText={trans(
                                                                    'global.determine',
                                                                    '确定'
                                                                )}
                                                                dismissText={trans(
                                                                    'global.cancel',
                                                                    '取消'
                                                                )}
                                                            >
                                                                <Item arrow="horizontal">
                                                                    <span
                                                                        className={styles.itemTitle}
                                                                    >
                                                                        {trans(
                                                                            'global.type',
                                                                            '国籍'
                                                                        )}
                                                                    </span>
                                                                </Item>
                                                            </Picker>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'certNo'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`certType${index}`, {
                                                            initialValue: item.certType
                                                                ? [Number(item.certType)]
                                                                : [],
                                                            rules: [
                                                                {
                                                                    required:
                                                                        parentPropertyList.includes(
                                                                            'certNo'
                                                                        )
                                                                            ? true
                                                                            : false,
                                                                    message: '证件类型为必填项',
                                                                },
                                                            ],
                                                        })(
                                                            <Picker
                                                                data={parentCerType}
                                                                cols={1}
                                                                onOk={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                                okText={trans(
                                                                    'global.determine',
                                                                    '确定'
                                                                )}
                                                                dismissText={trans(
                                                                    'global.cancel',
                                                                    '取消'
                                                                )}
                                                            >
                                                                <Item arrow="horizontal">
                                                                    <span
                                                                        className={styles.itemTitle}
                                                                    >
                                                                        {trans(
                                                                            'global.type',
                                                                            '证件类型'
                                                                        )}
                                                                    </span>
                                                                </Item>
                                                            </Picker>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'certNo'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`certNo${index}`, {
                                                            initialValue: item.certNo,
                                                            rules: [
                                                                {
                                                                    required:
                                                                        parentPropertyList.includes(
                                                                            'certNo'
                                                                        )
                                                                            ? true
                                                                            : false,
                                                                    message: '证件号码为必填项',
                                                                },
                                                            ],
                                                        })(
                                                            <InputItem
                                                                placeholder={trans(
                                                                    'global.pleaseEnte',
                                                                    '请输入'
                                                                )}
                                                                onChange={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                            >
                                                                <span>
                                                                    <em
                                                                        className={styles.redIcon}
                                                                    ></em>
                                                                    {trans(
                                                                        'global.enTheme',
                                                                        '证件号码'
                                                                    )}
                                                                </span>
                                                            </InputItem>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'mobile'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`mobile${index}`, {
                                                            initialValue: item.mobile,
                                                            rules: [
                                                                {
                                                                    required:
                                                                        parentPropertyList.includes(
                                                                            'mobile'
                                                                        )
                                                                            ? true
                                                                            : false,
                                                                    message: '手机为必填项',
                                                                },
                                                            ],
                                                        })(
                                                            <InputItem
                                                                placeholder={trans(
                                                                    'global.pleaseEnte',
                                                                    '请输入'
                                                                )}
                                                                onChange={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                            >
                                                                <span>
                                                                    <em
                                                                        className={styles.redIcon}
                                                                    ></em>
                                                                    {trans(
                                                                        'global.enTheme',
                                                                        '手机'
                                                                    )}
                                                                </span>
                                                            </InputItem>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'workUnit'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`workUnit${index}`, {
                                                            initialValue: item.workUnit,
                                                        })(
                                                            <InputItem
                                                                placeholder={trans(
                                                                    'global.pleaseEnte',
                                                                    '请输入'
                                                                )}
                                                                onChange={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                            >
                                                                <span>
                                                                    <em
                                                                        className={styles.redIcon}
                                                                    ></em>
                                                                    {trans(
                                                                        'global.enTheme',
                                                                        '工作单位'
                                                                    )}
                                                                </span>
                                                            </InputItem>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'jobPosition'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`jobPosition${index}`, {
                                                            initialValue: item.jobPosition,
                                                        })(
                                                            <InputItem
                                                                placeholder={trans(
                                                                    'global.pleaseEnte',
                                                                    '请输入'
                                                                )}
                                                                onChange={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                            >
                                                                <span>
                                                                    <em
                                                                        className={styles.redIcon}
                                                                    ></em>
                                                                    {trans(
                                                                        'global.enTheme',
                                                                        '职位'
                                                                    )}
                                                                </span>
                                                            </InputItem>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'education'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`educationTo${index}`, {
                                                            initialValue:
                                                                item.education !== undefined
                                                                    ? [Number(item.education)]
                                                                    : [],
                                                        })(
                                                            <Picker
                                                                data={educationList}
                                                                cols={1}
                                                                onOk={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                                okText={trans(
                                                                    'global.determine',
                                                                    '确定'
                                                                )}
                                                                dismissText={trans(
                                                                    'global.cancel',
                                                                    '取消'
                                                                )}
                                                            >
                                                                <Item arrow="horizontal">
                                                                    <span
                                                                        className={styles.itemTitle}
                                                                    >
                                                                        学历
                                                                    </span>
                                                                </Item>
                                                            </Picker>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'email'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`email${index}`, {
                                                            initialValue: item.email,
                                                            rules: [
                                                                {
                                                                    required:
                                                                        parentPropertyList.includes(
                                                                            'email'
                                                                        )
                                                                            ? true
                                                                            : false,
                                                                    message: '邮箱为必填项',
                                                                },
                                                            ],
                                                        })(
                                                            <InputItem
                                                                placeholder={trans(
                                                                    'global.pleaseEnte',
                                                                    '请输入'
                                                                )}
                                                                onChange={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                            >
                                                                <span>
                                                                    <em
                                                                        className={styles.redIcon}
                                                                    ></em>
                                                                    {trans('global.email', '邮箱')}
                                                                </span>
                                                            </InputItem>
                                                        )}
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: '0px',
                                                            display: parentPropertyList.includes(
                                                                'mainRelation'
                                                            )
                                                                ? 'block'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {getFieldDecorator(`mainRelation${index}`, {
                                                            initialValue:
                                                                item.mainRelation !== undefined &&
                                                                item.mainRelation !== null
                                                                    ? [item.mainRelation]
                                                                    : [],
                                                            rules: [
                                                                {
                                                                    required:
                                                                        parentPropertyList.includes(
                                                                            'mainRelation'
                                                                        )
                                                                            ? true
                                                                            : false,
                                                                    message: '是否主联系人为必填项',
                                                                },
                                                            ],
                                                        })(
                                                            <Picker
                                                                data={[
                                                                    {
                                                                        label: trans(
                                                                            'student.yes',
                                                                            '是'
                                                                        ),
                                                                        key: 1,
                                                                        value: true,
                                                                    },
                                                                    {
                                                                        label: trans(
                                                                            'student.no',
                                                                            '否'
                                                                        ),
                                                                        key: 0,
                                                                        value: false,
                                                                    },
                                                                ]}
                                                                cols={1}
                                                                extra={item.mainRelation}
                                                                okText={trans(
                                                                    'global.determine',
                                                                    '确定'
                                                                )}
                                                                dismissText={trans(
                                                                    'global.cancel',
                                                                    '取消'
                                                                )}
                                                                onChange={(e, event) => {
                                                                    console.log(e);
                                                                    this.setState({
                                                                        butout: true,
                                                                    });
                                                                }}
                                                            >
                                                                <Item arrow="horizontal">
                                                                    <span
                                                                        className={styles.itemTitle}
                                                                    >
                                                                        {trans(
                                                                            'global.mainRelation',
                                                                            '是否主联系人'
                                                                        )}
                                                                    </span>
                                                                </Item>
                                                            </Picker>
                                                        )}
                                                    </Form.Item>

                                                    <div
                                                        style={{
                                                            height: '28px',
                                                            background: '#f5f5f9',
                                                        }}
                                                    ></div>
                                                </Form>
                                            );
                                        })}
                                    </div>
                                ) : null
                            ) : null}

                            {payPropertyList && (
                                <div>
                                    <div className={styles.headline}>支付信息</div>
                                    <Form
                                        style={{
                                            display: payPropertyList.includes('bank')
                                                ? 'block'
                                                : 'none',
                                        }}
                                    >
                                        <Form.Item
                                            style={{
                                                marginBottom: '0px',
                                            }}
                                        >
                                            {getFieldDecorator('bankNo', {
                                                initialValue: bankNo,
                                            })(
                                                <InputItem
                                                    placeholder={trans(
                                                        'global.pleaseEnte',
                                                        '请输入'
                                                    )}
                                                    onChange={(value) => {
                                                        this.setState({
                                                            bankNo: value,
                                                            butout: true,
                                                        });
                                                    }}
                                                >
                                                    <span>
                                                        <em className={styles.redIcon}></em>
                                                        {trans('global.bankCardNumber', '银行卡号')}
                                                        <span style={{ color: 'red' }}>*</span>
                                                    </span>
                                                </InputItem>
                                            )}
                                        </Form.Item>
                                        <Form.Item
                                            style={{
                                                marginBottom: '0px',
                                            }}
                                        >
                                            {getFieldDecorator('accountName', {
                                                initialValue: accountName,
                                            })(
                                                <InputItem
                                                    placeholder={trans(
                                                        'global.pleaseEnte',
                                                        '请输入'
                                                    )}
                                                    onChange={(value) => {
                                                        this.setState({
                                                            accountName: value,
                                                            butout: true,
                                                        });
                                                    }}
                                                >
                                                    <span>
                                                        <em className={styles.redIcon}></em>
                                                        {trans('global.accountName', '账户名')}
                                                        <span style={{ color: 'red' }}>*</span>
                                                    </span>
                                                </InputItem>
                                            )}
                                        </Form.Item>
                                        <Form.Item
                                            style={{
                                                marginBottom: '0px',
                                            }}
                                        >
                                            {getFieldDecorator('bankName', {
                                                initialValue: bankName,
                                            })(
                                                <InputItem
                                                    placeholder={trans(
                                                        'global.pleaseEnte',
                                                        '请输入'
                                                    )}
                                                    onChange={(value) => {
                                                        this.setState({
                                                            bankName: value,
                                                            butout: true,
                                                        });
                                                    }}
                                                >
                                                    <span>
                                                        <em className={styles.redIcon}></em>
                                                        {trans('global.bankDeposit', '开户行')}
                                                        <span style={{ color: 'red' }}>*</span>
                                                    </span>
                                                </InputItem>
                                            )}
                                        </Form.Item>
                                        <Fragment>
                                            <Picker
                                                data={provinceCity}
                                                title="请选择"
                                                onChange={this.changeBank}
                                                value={bankRegisterId}
                                            >
                                                <List.Item arrow="horizontal">
                                                    开户地<span style={{ color: 'red' }}>*</span>
                                                </List.Item>
                                            </Picker>
                                        </Fragment>
                                    </Form>
                                </div>
                            )}
                            {annexPropertyList && annexPropertyList.length > 0 && (
                                <div>
                                    <div className={styles.headline}>附件资料</div>

                                    <Form>
                                        <Form.Item
                                            style={{
                                                marginBottom: '0px',
                                                display: annexPropertyList.includes('identity')
                                                    ? 'block'
                                                    : 'none',
                                            }}
                                        >
                                            {getFieldDecorator('identityCode', {
                                                initialValue: [identityCode],
                                            })(
                                                <Picker
                                                    /* disabled={
                                                                    enclosurePropertyList.length > 0
                                                                } */
                                                    data={identityTypeList}
                                                    cols={1}
                                                    okText={trans('global.determine', '确定')}
                                                    dismissText={trans('global.cancel', '取消')}
                                                    onChange={this.changeIdentity}
                                                    // value={identityCode}
                                                >
                                                    <Item arrow="horizontal">
                                                        <span className={styles.itemTitle}>
                                                            {trans(
                                                                'global.IdentityInformation',
                                                                '身份信息'
                                                            )}
                                                        </span>
                                                    </Item>
                                                </Picker>
                                            )}
                                            <div className={styles.houseHold}>
                                                {identityInfoList &&
                                                    identityInfoList.length > 0 &&
                                                    identityInfoList.map((item, index) => {
                                                        return (
                                                            <span
                                                                style={{
                                                                    position: 'relative',
                                                                    margin: '5px',
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        item != ''
                                                                            ? window.location
                                                                                  .origin + item.url
                                                                            : ''
                                                                    }
                                                                    style={{
                                                                        width: '100px',
                                                                    }}
                                                                />
                                                                <Icon
                                                                    type="close-circle"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '-7px',
                                                                        right: '-7px',
                                                                    }}
                                                                    onClick={() =>
                                                                        this.delImg(index)
                                                                    }
                                                                />
                                                            </span>
                                                        );
                                                    })}
                                                <Upload
                                                    action="/api/upload_file"
                                                    listType="picture-card"
                                                    onChange={this.uploadIdentity}
                                                    // fileList={identityInfoList}
                                                >
                                                    {uploadButton}
                                                </Upload>
                                            </div>
                                        </Form.Item>
                                        <Form.Item
                                            style={{
                                                marginBottom: '0px',
                                                display: annexPropertyList.includes('household')
                                                    ? 'block'
                                                    : 'none',
                                            }}
                                        >
                                            {getFieldDecorator('householdCode', {
                                                initialValue: [householdCode],
                                            })(
                                                <Picker
                                                    data={residenceTypeList}
                                                    cols={1}
                                                    okText={trans('global.determine', '确定')}
                                                    dismissText={trans('global.cancel', '取消')}
                                                    onChange={this.changeHouseHold}
                                                >
                                                    <Item arrow="horizontal">
                                                        <span className={styles.itemTitle}>
                                                            {trans(
                                                                'global.residenceInformation',
                                                                '户籍信息'
                                                            )}
                                                        </span>
                                                    </Item>
                                                </Picker>
                                            )}
                                            <div className={styles.houseHold}>
                                                {householdInfoList &&
                                                    householdInfoList.length > 0 &&
                                                    householdInfoList.map((item, index) => {
                                                        return (
                                                            <span
                                                                style={{
                                                                    position: 'relative',
                                                                    margin: '5px',
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        item != ''
                                                                            ? window.location
                                                                                  .origin + item.url
                                                                            : ''
                                                                    }
                                                                    style={{
                                                                        width: '100px',
                                                                    }}
                                                                />
                                                                <Icon
                                                                    type="close-circle"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '-7px',
                                                                        right: '-7px',
                                                                    }}
                                                                    onClick={() =>
                                                                        this.delHouseHold(index)
                                                                    }
                                                                />
                                                            </span>
                                                        );
                                                    })}
                                                <Upload
                                                    action="/api/upload_file"
                                                    listType="picture-card"
                                                    onChange={this.uploadHouseInfo}
                                                >
                                                    {uploadButton}
                                                </Upload>
                                            </div>
                                        </Form.Item>
                                    </Form>
                                </div>
                            )}
                        </List>
                        <div style={{ margin: '0 auto', display: 'table' }}>
                            <Button
                                shape="circle"
                                disabled={butout}
                                inline
                                className={styles.buttonBottom}
                                style={{
                                    marginRight: '4px',
                                    borderRadius: '24px',
                                    border: '1px solid #4d7fff',
                                    color: '#4d7fff',
                                }}
                                onClick={this.oldSubmit}
                            >
                                确认无需更新
                            </Button>
                            <Button
                                type="primary"
                                disabled={!butout}
                                inline
                                className={styles.buttonBottom}
                                style={{ marginRight: '4px', borderRadius: '24px' }}
                                onClick={this.onTwoSubmit}
                            >
                                变更完成并提交
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
