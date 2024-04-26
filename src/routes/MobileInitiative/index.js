//移动端更新
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import { saveCurrent } from '../../utils/utils';
import { Radio, Form } from 'antd';
import { NavBar, Icon, Modal, List, Picker, InputItem, DatePicker, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import * as dd from 'dingtalk-jsapi';
import moment from 'moment';
import { provinceList } from '../../common/menu';
// import { district, provinceLite } from 'antd-mobile-demo-data';
const alert = Modal.alert;
const Item = List.Item;
import logoImg from '../../assets/scss.png';
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
    parentChildList: state.student.parentChildList, //几个孩子
    studentDetailInfo: state.student.studentDetailInfo, //学生详情
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
            householdInfoId: '',
            birthdayAddressInfo: '',
            birthdayAddressInfoId: '',
            residentialInfo: '',
            residentialInfoId: '',
            contactAddressInfo: '',
            contactAddressInfoId: '',
            parentInfoList: [],
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
        };
    }

    componentWillMount() {
        var searchURL = this.props.location.search;
        searchURL = searchURL.substring(1, searchURL.length);
        var targetPageId = searchURL && searchURL.split('&')[0].split('=')[1];
        const { dispatch } = this.props;
        this.getCountryList();
        this.getNationList();
        // this.getAreaList();
        dispatch({
            type: 'student/parentChildList',
            payload: {},
        }).then(() => {
            const { parentChildList } = this.props;
            if (parentChildList && parentChildList.length > 1) {
                this.setState({
                    parentChildIf: true,
                });
            } else if (parentChildList && parentChildList.length == 1) {
                this.detailedInformation(parentChildList[0].childId);
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
        console.log('value :>> ', value);
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
        console.log('district :>> ', district);
        district &&
            district.map((item) => {
                if (item.code == value[0]) {
                    list = item.label;
                    item.children.map((item2) => {
                        if (item2.code == value[1]) {
                            listchildren = item2.label;
                        }
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
    //籍贯显示
    changeprovince = (value) => {
        this.province(value, 1);
        this.setState({
            butout: true,
        });
    };

    changeaddress = (value) => {
        this.province(value, 2);
        this.setState({
            butout: true,
        });
        this.getHouseholdStreet(value);
    };
    onChangebirthdayAddressInfo = (value) => {
        this.province(value, 3);
        this.setState({
            butout: true,
        });
        this.getBirthdayStreet(value);
    };
    onChangeresidentialInfo = (value) => {
        this.province(value, 4);
        this.setState({
            butout: true,
        });
        this.getResidentStreet(value);
    };
    onChangecontactAddressInfo = (value) => {
        this.province(value, 5);
        this.setState({
            butout: true,
        });
        this.getContactStreet(value);
    };
    //详细信息
    detailedInformation(value) {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getStudentDetails',
            payload: {
                userId: value,
            },
        }).then(() => {
            const { studentDetailInfo } = this.props;
            console.log('studentDetailInfo :>> ', studentDetailInfo);
            this.setState(
                {
                    connectOf: true,
                    name: studentDetailInfo.name,
                    ename: studentDetailInfo.ename,
                    enFirstName: studentDetailInfo.enFirstName,
                    enLastName: studentDetailInfo.enLastName,
                    idName: studentDetailInfo.IDName,
                    sex: studentDetailInfo.sex,
                    birthday: studentDetailInfo.birthday,
                    nationalityId: studentDetailInfo.nationalityId,
                    nationality: studentDetailInfo.nationality,
                    nation: studentDetailInfo.nation,
                    nationId: studentDetailInfo.nationId,
                    certType: studentDetailInfo.certType,
                    certNo: studentDetailInfo.certNo,
                    mobile: studentDetailInfo.mobile,
                    nativePlace: studentDetailInfo.nativePlace,
                    householdType: studentDetailInfo.householdType,
                    householdInfo: studentDetailInfo.householdInfo,
                    birthdayAddressInfo: studentDetailInfo.birthdayAddressInfo,
                    residentialInfo: studentDetailInfo.residentialInfo,
                    contactAddressInfo: studentDetailInfo.contactAddressInfo,

                    householdIdStreetId: studentDetailInfo.householdIdStreetId,
                    connectIdStreetId: studentDetailInfo.connectIdStreetId,
                    residentialIdStreetId: studentDetailInfo.residentialIdStreetId,
                    birthdayIdStreetId: studentDetailInfo.birthdayIdStreetId,

                    nativePlaceId: studentDetailInfo.nativePlaceId
                        ? studentDetailInfo.nativePlaceId.split('-')
                        : [],
                    householdInfoId: studentDetailInfo.householdId
                        ? studentDetailInfo.householdId.split('-')
                        : [],
                    birthdayAddressInfoId: studentDetailInfo.birthdayAddressId
                        ? studentDetailInfo.birthdayAddressId.split('-')
                        : [],
                    residentialInfoId: studentDetailInfo.residentialId
                        ? studentDetailInfo.residentialId.split('-')
                        : [],
                    contactAddressInfoId: studentDetailInfo.contactAddressId
                        ? studentDetailInfo.contactAddressId.split('-')
                        : [],

                    parentInfoList: studentDetailInfo.parentInfoList,
                },
                () => {
                    const {
                        householdInfoId,
                        birthdayAddressInfoId,
                        residentialInfoId,
                        contactAddressInfoId,
                    } = this.state;
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
    //二次提交
    onTwoSubmit = () => {
        const { certNo, certType } = this.state;
        var idcardReg =
            /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!idcardReg.test(certNo) && certType == 1) {
            alert('请正确填写证件号码');
            return;
        }
        let self = this;
        alert('修改完成确认继续提交', '', [
            { text: '放弃', onPress: () => console.log('cancel') },
            {
                text: '提交',
                onPress: () => {
                    self.submit();
                },
            },
        ]);
    };

    submit = () => {
        const { studentDetailInfo, dispatch } = this.props;
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
            onChangeAddressInfo,
            contactAddressInfoText,
            onChangebirthdayAddressInfoText,
            householdIdStreetId,
            connectIdStreetId,
            residentialIdStreetId,
            birthdayIdStreetId,
        } = this.state;
        console.log('this.state', this.state);
        console.log('this.props', this.props);
        const nub = studentDetailInfo.parentInfoList.length;
        var searchURL = this.props.location.search;
        searchURL = searchURL.substring(1, searchURL.length);
        var targetPageId = searchURL && searchURL.split('&')[0].split('=')[1];
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let sublist = [];
                for (let i = 0; i < nub; i++) {
                    let obj = {};
                    obj.name = values[`name${i}`];
                    obj.certType = values[`certType${i}`] && values[`certType${i}`][0];
                    obj.relationType = values[`relationType${i}`] && values[`relationType${i}`][0];
                    obj.nationality = this.getNameById(
                        values[`nationality${i}`] && values[`nationality${i}`][0],
                        this.props.countryInfoData
                    );
                    obj.certNo = values[`certNo${i}`];
                    obj.mobile = values[`mobile${i}`];
                    obj.workUnit = values[`workUnit${i}`];
                    obj.jobPosition = values[`jobPosition${i}`];
                    obj.education = values[`educationTo${i}`] && values[`educationTo${i}`][0];
                    obj.studentUserId = studentDetailInfo.userId;
                    obj.parentUserId = studentDetailInfo.parentInfoList[i].userId;
                    obj.email = values[`email${i}`];
                    obj.mainRelation = values[`mainRelation${i}`][0];
                    sublist.push(obj);
                }
                dispatch({
                    type: 'student/parentUpdateStudentInfo',
                    payload: {
                        enFirstName,
                        enLastName,
                        IDName: idName,
                        userId: studentDetailInfo.userId,
                        name,
                        ename,
                        sex,
                        certNo,
                        birthday: birthday?.valueOf(),
                        nationality,
                        nation,
                        certType,
                        mobile,
                        householdType,
                        parentInfoList: sublist,
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

                        householdInfo: this.state.householdInfotextTo
                            ? householdInfotext
                            : householdInfo && householdInfo.split('&')[1],
                        residentialInfo: this.state.onChangeresidentialInfoTextTo
                            ? onChangeresidentialInfoText
                            : residentialInfo && residentialInfo.split('&')[1],
                        birthdayAddressInfo: this.state.onChangebirthdayAddressInfoTextTo
                            ? onChangebirthdayAddressInfoText
                            : birthdayAddressInfo && birthdayAddressInfo.split('&')[1],
                        contactAddressInfo: this.state.contactAddressInfoTextTo
                            ? contactAddressInfoText
                            : contactAddressInfo && contactAddressInfo.split('&')[1],
                    },
                    onSuccess: () => {
                        this.setState({
                            connectOf: false,
                            connectif: true,
                        });
                    },
                });
            }
        });
    };

    changeaddressText = (value) => {
        this.setState({
            householdInfotext: value,
            householdInfotextTo: 1,
            butout: true,
        });
    };
    onChangeAddressInfo = (value) => {
        this.setState({
            onChangeAddressInfo: value,
            onChangeAddressInfoTo: 1,
            butout: true,
        });
    };
    onChangeresidentialInfoText = (value) => {
        this.setState({
            onChangeresidentialInfoText: value,
            onChangeresidentialInfoTextTo: 1,
            butout: true,
        });
    };
    onChangebirthdayAddressInfoText = (value) => {
        this.setState({
            onChangebirthdayAddressInfoText: value,
            onChangebirthdayAddressInfoTextTo: 1,
            butout: true,
        });
    };

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
    //选孩子
    buttonChildcont = (e) => {
        this.detailedInformation(e.target.id);
        this.setState({
            parentChildIf: false,
        });
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

    render() {
        const {
            powerStatus,
            parentChildList,
            form: { getFieldDecorator },
            nationInfoData,
            countryInfoData,
            streetList,
            streetBornList,
            streetAddressList,
            streetContactList,
            studentDetailInfo: { studentNo },
        } = this.props;
        const {
            enFirstName,
            enLastName,
            idName,
            connectOf,
            parentChildIf,
            name,
            ename,
            nationality,
            nation,
            certType,
            certNo,
            mobile,
            nativePlace,
            householdType,
            householdInfo,
            birthdayAddressInfo,
            residentialInfo,
            contactAddressInfo,
            parentInfoList,
            birthday,
            householdInfotext,
            butout,
            connectif,
            onChangeAddressInfo,
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
            nationId,
            householdIdStreetId,
            connectIdStreetId,
            residentialIdStreetId,
            birthdayIdStreetId,
        } = this.state;
        console.log('this.state :>> ', this.state);
        console.log('this.props :>> ', this.props);

        // dd.biz.navigation.setTitle({
        //     title: '完善学生信息', //控制标题文本，空字符串表示显示默认文本
        //     onSuccess: function (result) {},
        //     onFail: function (err) {},
        // });

        //更改数组对象以适应picker格式要求
        countryInfoData.map((item) => {
            item.label = item.name;
            item.value = item.id;
        });
        nationInfoData.map((item) => {
            item.label = item.name;
            item.value = item.id;
        });

        const province = this.handleProvinceData(district) || [];
        return (
            <div>
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
                        <List>
                            <InputItem disabled placeholder="学号不可修改" value={studentNo}>
                                <span style={{ color: '#000' }}>
                                    <em className={styles.redIcon}></em>
                                    {trans('student.studentNo', '学号')}
                                </span>
                            </InputItem>
                            <InputItem
                                placeholder="请与身份证件信息一致"
                                value={idName}
                                onChange={(val) => {
                                    this.setState({
                                        idName: val,
                                        butout: true,
                                    });
                                }}
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                    {trans('student.name', '姓名')}
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
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                </span>
                            </InputItem>
                            <Item>
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
                                        defaultValue={sex}
                                    >
                                        <Radio value={'1'}>{trans('global.noRepeat', '男')}</Radio>
                                        <Radio value={'2'}>{trans('global.yesRepeat', '女')}</Radio>
                                    </RadioGroup>
                                </div>
                            </Item>
                            <DatePicker
                                mode="date"
                                title="选择日期"
                                okText="确定"
                                dismissText="取消"
                                value={birthday ? new Date(birthday) : ''}
                                extra={
                                    birthday
                                        ? moment(birthday).format('YYYY-MM-DD')
                                        : '请选择出生日期'
                                }
                                onChange={(value) =>
                                    this.setState({ birthday: value, butout: true })
                                }
                            >
                                <List.Item arrow="horizontal">出生日期</List.Item>
                            </DatePicker>
                            <Picker
                                data={countryInfoData}
                                cols={1}
                                value={nationalityId !== undefined ? [nationalityId] : []}
                                extra={nationality ? nationality : '请选择国籍'}
                                onChange={this.changeCountry}
                                okText={trans('global.determine', '确定')}
                                dismissText={trans('global.cancel', '取消')}
                            >
                                <Item arrow="horizontal">
                                    <span className={styles.itemTitle}>
                                        {trans('global.type', '国籍')}
                                    </span>
                                </Item>
                            </Picker>
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
                            <Picker
                                data={parentCerType}
                                cols={1}
                                value={certType ? [Number(certType)] : []}
                                onChange={(value) =>
                                    this.setState({ certType: value[0], butout: true })
                                }
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
                            <InputItem
                                placeholder={trans('global.pleaseEnte', '请输入')}
                                value={mobile}
                                onChange={(value) => {
                                    this.setState({
                                        mobile: value,
                                        butout: true,
                                    });
                                }}
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                    {trans('global.enTheme', '手机')}
                                </span>
                            </InputItem>
                            <Picker
                                data={province}
                                title="请选择"
                                extra={nativePlace}
                                value={nativePlaceId}
                                onChange={this.changeprovince}
                            >
                                <List.Item arrow="horizontal">籍贯</List.Item>
                            </Picker>
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
                            <Picker
                                data={province}
                                title="请选择"
                                value={householdInfoId}
                                onChange={this.changeaddress}
                                extra={householdInfo && householdInfo.split('&')[0]}
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
                                placeholder={trans('global.pleaseEnte', '请输入')}
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
                            <Picker
                                data={province}
                                title="请选择"
                                value={birthdayAddressInfoId}
                                extra={birthdayAddressInfo && birthdayAddressInfo.split('&')[0]}
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
                            <InputItem
                                value={
                                    this.state.onChangebirthdayAddressInfoTextTo
                                        ? onChangebirthdayAddressInfoText
                                        : birthdayAddressInfo && birthdayAddressInfo.split('&')[1]
                                }
                                placeholder={trans('global.pleaseEnte', '请输入')}
                                onChange={this.onChangebirthdayAddressInfoText.bind(this)}
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                </span>
                            </InputItem>
                            <Picker
                                data={province}
                                title="请选择"
                                value={residentialInfoId}
                                onChange={this.onChangeresidentialInfo}
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
                                placeholder={trans('global.pleaseEnte', '请输入')}
                                onChange={this.onChangeresidentialInfoText.bind(this)}
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                </span>
                            </InputItem>
                            <Picker
                                data={province}
                                title="请选择"
                                onChange={this.onChangecontactAddressInfo}
                                extra={contactAddressInfo && contactAddressInfo.split('&')[0]}
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
                                        : contactAddressInfo && contactAddressInfo.split('&')[1]
                                }
                                placeholder={trans('global.pleaseEnte', '请输入')}
                                onChange={this.contactAddressInfoText.bind(this)}
                            >
                                <span>
                                    <em className={styles.redIcon}></em>
                                </span>
                            </InputItem>

                            {parentInfoList && parentInfoList.length > 0 && (
                                <div>
                                    <div className={styles.headline}>家庭信息</div>
                                    {parentInfoList.map((item, index) => {
                                        return (
                                            <Form>
                                                <Form.Item style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator(`name${index}`, {
                                                        initialValue: item.name,
                                                    })(
                                                        <InputItem
                                                            disabled
                                                            placeholder={trans(
                                                                'global.pleaseEnte',
                                                                '请输入'
                                                            )}
                                                        >
                                                            <span>
                                                                <em className={styles.redIcon}></em>
                                                                {trans('global.theme', '姓名')}
                                                            </span>
                                                        </InputItem>
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator(`relationType${index}`, {
                                                        initialValue: [Number(item.relationType)],
                                                    })(
                                                        <Picker
                                                            disabled
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
                                                                <span className={styles.itemTitle}>
                                                                    {trans('global.theme', '关系')}
                                                                </span>
                                                            </Item>
                                                        </Picker>
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator(`nationality${index}`, {
                                                        initialValue:
                                                            item.nationalityId !== undefined
                                                                ? [item.nationalityId]
                                                                : [],
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
                                                                <span className={styles.itemTitle}>
                                                                    {trans('global.type', '国籍')}
                                                                </span>
                                                            </Item>
                                                        </Picker>
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator(`certType${index}`, {
                                                        initialValue:
                                                            item.certType !== undefined
                                                                ? [Number(item.certType)]
                                                                : [],
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
                                                                <span className={styles.itemTitle}>
                                                                    {trans(
                                                                        'global.type',
                                                                        '证件类型'
                                                                    )}
                                                                </span>
                                                            </Item>
                                                        </Picker>
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator(`certNo${index}`, {
                                                        initialValue: item.certNo,
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
                                                                <em className={styles.redIcon}></em>
                                                                {trans(
                                                                    'global.enTheme',
                                                                    '证件号码'
                                                                )}
                                                            </span>
                                                        </InputItem>
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator(`mobile${index}`, {
                                                        initialValue: item.mobile,
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
                                                                <em className={styles.redIcon}></em>
                                                                {trans('global.enTheme', '手机')}
                                                            </span>
                                                        </InputItem>
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ marginBottom: '0px' }}>
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
                                                                <em className={styles.redIcon}></em>
                                                                {trans(
                                                                    'global.enTheme',
                                                                    '工作单位'
                                                                )}
                                                            </span>
                                                        </InputItem>
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ marginBottom: '0px' }}>
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
                                                                <em className={styles.redIcon}></em>
                                                                {trans('global.enTheme', '职位')}
                                                            </span>
                                                        </InputItem>
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ marginBottom: '0px' }}>
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
                                                                <span className={styles.itemTitle}>
                                                                    学历
                                                                </span>
                                                            </Item>
                                                        </Picker>
                                                    )}
                                                </Form.Item>
                                                <Form.Item
                                                    style={{
                                                        marginBottom: '0px',
                                                    }}
                                                >
                                                    {getFieldDecorator(`email${index}`, {
                                                        initialValue: item.email,
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
                                                                <em className={styles.redIcon}></em>
                                                                {trans('global.email', '邮箱')}
                                                            </span>
                                                        </InputItem>
                                                    )}
                                                </Form.Item>

                                                <Form.Item
                                                    style={{
                                                        marginBottom: '0px',
                                                    }}
                                                >
                                                    {getFieldDecorator(`mainRelation${index}`, {
                                                        initialValue:
                                                            item.mainRelation !== undefined
                                                                ? [item.mainRelation]
                                                                : [],
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
                                                                <span className={styles.itemTitle}>
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
                            )}
                        </List>

                        <Button
                            type="primary"
                            disabled={!butout}
                            inline
                            style={{ margin: '8px auto', borderRadius: '24px', display: 'table' }}
                            onClick={this.onTwoSubmit}
                        >
                            变更完成并提交
                        </Button>
                    </div>
                )}
                {parentChildIf && (
                    <div className={styles.buttonChildList}>
                        <div style={{ margin: '244px auto' }}>
                            {parentChildList &&
                                parentChildList.map((item) => {
                                    return (
                                        <div
                                            onClick={this.buttonChildcont}
                                            id={item.childId}
                                            className={styles.buttonChildcont}
                                        >
                                            {item.name}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
