import React, { useState, useEffect, Fragment } from 'react';
import styles from './lookStudentDetail.less';
import {
    Drawer,
    Select,
    Input,
    Form,
    Row,
    Col,
    Radio,
    Cascader,
    DatePicker,
    Checkbox,
    Popconfirm,
    message,
    Modal,
    Spin,
    Timeline,
    Icon,
    Tooltip,
} from 'antd';
import { connect } from 'dva';
import PreviewFile from './previewFile';
import moment from 'moment';
import icon from '../../../../icon.less';
import { formatDate, formatTime } from '../../../../utils/utils';
import PowerPage from '../../../PowerPage/index';
import { trans, locale } from '../../../../utils/i18n';
import { log } from 'lodash-decorators/utils';

const { Option } = Select;
const { confirm } = Modal;
const dateFormat = 'YYYY/MM/DD';
let ids = 1;

function LookStudentDetail(props) {
    const [initLoad, setInitLoad] = useState(false);
    const [editPersonalInfo, setEditPersonalInfo] = useState(false);
    const [cardList, setCardList] = useState([]);
    const [cardStatus, setCardStatus] = useState({});
    const [relationType, setRelationType] = useState({});
    const [studentName, setStudentName] = useState('');
    const [studentEname, setStudentEname] = useState('');
    const [studentFirstName, setStudentFirstName] = useState('');
    const [studentLastName, setStudentLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [ssRecord, setSsRecord] = useState([]);
    const [previewFileVisible, setPreviewFileVisible] = useState(false);
    const [previewFileList, setPreviewFileList] = useState([]);
    const [tempMobile, setTempMobile] = useState('');

    const [streetListShow, setStreetListShow] = useState('none');

    const [streetHouseholdIdStreetIdListValue, setHouseholdIdStreetListValue] = useState('');
    // const [infoObj, setInfoObj] = useState({});
    const [streetResidentialIdStreetIIdListValue, setResidentialIdStreetIIdListValue] =
        useState('');
    const [streetBirthdayIdStreetIdIdListValue, setBirthdayIdStreetIdIdListValue] = useState('');
    const [streetContactIdStreetIdListValue, setContactIdStreetIdListValue] = useState('');

    const [codeHouseholdId, setCodeHouseholdId] = useState('');
    const [codeBornId, setCodeBornId] = useState('');
    const [codeLiveId, setCodeLiveId] = useState('');
    const [codeContactId, setCodeContactId] = useState('');
    const [resetMethod, setResetMethod] = useState('12345678');
    const [resetparMethod, setparResetMethod] = useState('12345678');
    //联系人证件类型
    const parentCerType = [
        { key: 1, value: trans('student.idCard', '身份证') },
        { key: 4, value: trans('student.passport', '护照') },
        { key: 5, value: trans('student.passCheck', '港澳通行证') },
        { key: 6, value: trans('student.resident', '台湾居民来往大陆通行证') },
    ];

    useEffect(() => {
        if (props.lookStudentVisible === true) {
            getDetails();
            getNationList();
            getCountryList();
            getAllGrade();
            getSsRecord();
            // getAreaList();
        } else if (props.lookStudentVisible === false) {
            setEditPersonalInfo(false);
            setCardList([]);
            setCardStatus({});
            setRelationType({});
            setStudentName('');
            setStudentEname('');
            setStudentFirstName('');
            setStudentLastName('');
        }
    }, [props.lookStudentVisible]);

    //获取学生信息详情
    const getDetails = () => {
        const { record, dispatch } = props;
        setInitLoad(false);
        return dispatch({
            type: 'student/getStudentDetails',
            payload: {
                userId: record.userId,
            },
            onSuccess: (res) => {
                setInitLoad(true);
                if (res && res.parentInfoList) {
                    let resultArr = formatFamilyInfo(res.parentInfoList);
                    ids = res.parentInfoList.length;
                    console.log(resultArr);
                    setCardList(resultArr);
                    let resultObj = formatFamilyStatus(res.parentInfoList);
                    setCardStatus(resultObj);

                    //初始化赋值---学生的名字和英文名字
                    setStudentName(res.name);
                    setStudentEname(res.ename);
                    setStudentFirstName(res.enFirstName);
                    setStudentLastName(res.enLastName);
                    // setInfoObj(res);
                    setHouseholdIdStreetListValue(res.householdIdStreetId);
                    setResidentialIdStreetIIdListValue(res.residentialIdStreetId);
                    setBirthdayIdStreetIdIdListValue(res.birthdayIdStreetId);
                    setContactIdStreetIdListValue(res.connectIdStreetId);
                }
                const { studentDetailInfo } = props;
                onChangeHousehold(res.householdId && res.householdId.split('-'));
                onChangeBorn(res.birthdayAddressId && res.birthdayAddressId.split('-'));
                onChangeAddress(res.residentialId && res.residentialId.split('-'));
                onChangeContactAddress(res.contactAddressId && res.contactAddressId.split('-'));
            },
        });
    };

    // 获取学籍详情
    const getSsRecord = () => {
        const { record, dispatch } = props;
        return dispatch({
            type: 'student/studentStatusRecord',
            payload: {
                userId: record.userId,
            },
            onSuccess: (res) => {
                setSsRecord(res || []);
            },
        });
    };

    //格式化家庭成员列表
    const formatFamilyInfo = (arr) => {
        if (!arr || arr.length == 0) return [];
        let resultArr = [];
        arr.map((item, index) => {
            resultArr.push(index);
        });
        return resultArr;
    };

    //格式化要编辑的状态
    const formatFamilyStatus = (arr) => {
        if (!arr || arr.length == 0) return {};
        let resultObj = {};
        arr.map((item, index) => {
            resultObj[index] = false;
        });
        return resultObj;
    };

    //获取民族
    const getNationList = () => {
        const { dispatch } = props;
        dispatch({
            type: 'student/getNationList',
            payload: {},
        });
    };

    //获取国籍
    const getCountryList = () => {
        const { dispatch } = props;
        dispatch({
            type: 'student/getCountryList',
            payload: {},
        });
    };

    //获取学生档案中的所有年级
    const getAllGrade = () => {
        const { dispatch } = props;
        dispatch({
            type: 'student/getAllGrade',
            payload: {},
        });
    };

    const onChangeHousehold = (value) => {
        if (!value?.length) {
            const { form } = props;
            form.setFieldsValue({ householdStreetId: '' });
        }
        let { dispatch, studentDetailInfo } = props;

        if (!value) {
            dispatch({
                type: 'student/emptyStreetList',
            });
            return;
        }

        setCodeHouseholdId(value[value.length - 1]);

        dispatch({
            type: 'student/streetList',
            payload: {
                code: value[value.length - 1],
            },
        });
    };

    //出生地址街道列表
    const onChangeBorn = (value) => {
        const { dispatch, studentDetailInfo } = props;
        if (!value) {
            dispatch({
                type: 'student/emptyStreetBornList',
            });
            return;
        }
        setCodeBornId(value[value.length - 1]);
        dispatch({
            type: 'student/streetBornList',
            payload: {
                code: value[value.length - 1],
            },
        });
    };

    //居住地址街道列表
    const onChangeAddress = (value) => {
        let { dispatch, studentDetailInfo } = props;
        if (!value?.length) {
            const { form } = props;
            form.setFieldsValue({ residentialStreetId: '' });
            //setHouseholdIdStreetListValue('');
        }

        if (!value) {
            dispatch({
                type: 'student/emptyStreetAddressList',
            });
            return;
        }
        setCodeLiveId(value[value.length - 1]);
        dispatch({
            type: 'student/streetAddressList',
            payload: {
                code: value[value.length - 1],
            },
        });
    };

    //联系地址街道列表
    const onChangeContactAddress = (value) => {
        let { dispatch, studentDetailInfo } = props;
        if (!value?.length) {
            const { form } = props;
            form.setFieldsValue({ contactAddressStreetId: '' });
            //setHouseholdIdStreetListValue('');
        }
        if (!value) {
            dispatch({
                type: 'student/emptyStreetContactList',
            });
            return;
        }
        setCodeContactId(value[value.length - 1]);
        dispatch({
            type: 'student/streetContactList',
            payload: {
                code: value[value.length - 1],
            },
        });
    };

    //户籍街道id
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        // setStreetListValue(value);
    };

    //出生街道id
    const handleChangeBorn = (value) => {
        console.log(`selected ${value}`);
        // setStreetListValue(value);
    };
    //居住地址id
    const handleChangeAddress = (value) => {
        console.log(`selected ${value}`);
        // setStreetListValue(value);
    };

    //关闭窗口
    const onClose = () => {
        const { hideModal } = props;
        typeof hideModal == 'function' && hideModal.call(this, 'lookStudentDetail');
        setInitLoad(false);
    };

    //保存个人信息
    const savePersonalInfo = () => {
        const { dispatch, form, studentDetailInfo } = props;
        form.validateFields((err, values) => {
            if (!err) {
                // if (values.studentCertType == '1') {
                //     //身份证号码验证
                //     if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(values.studentCertifyNum)) {
                //         message.error(trans('student.pleaseCheckId', '请输入正确的身份证号码'));
                //         return;
                //     }
                // }
                if (values.studentPhone && !/^1(3|4|5|6|7|8|9)\d{9}$/.test(values.studentPhone)) {
                    message.error(trans('student.pleaseCheckPhone', '请填写正确的手机号码'));
                    return;
                }

                setLoading(true);
                dispatch({
                    type: 'student/updateStudentProfile',
                    payload: {
                        userId: studentDetailInfo.userId,
                        name: values.studentName,
                        ename: values.studentEname,
                        IDName: values.studentNickName,
                        nickName: values.studentNickName, //昵称
                        nameSpelling: values.studentNameSpelling, //拼音
                        sex: values.studentSex,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        certType: values.studentCertType, //证件类型
                        certNo: values.studentCertifyNum, //证件号码
                        mobile: values.studentPhone,
                        email: values.studentEmail,
                        loginId: values.loginId,
                        birthday:
                            values.studentBirthday && new Date(values.studentBirthday).getTime(),
                        nation: getNameById(values.studentNation, props.nationInfoData), //民族名称
                        nationality: getNameById(values.studentCountry, props.countryInfoData), //国籍名称
                        householdType: values.householdType, //户籍类别
                        // householdId: values.householdStreetId
                        //     ? String(values.householdStreetId)
                        //     : null, //户籍街道 id

                        householdId:
                            codeHouseholdId && values.householdStreetId
                                ? String(values.householdStreetId)
                                : codeHouseholdId
                                ? String(codeHouseholdId)
                                : null, //户籍街道 id

                        householdInfo: values.householdInfoPlace, //户籍详细地址

                        residentialId:
                            codeLiveId && values.residentialStreetId
                                ? String(values.residentialStreetId)
                                : null, //居住街道 id
                        residentialInfo: values.residentialInfo, //居住地址详细地址
                        // birthdayAddressId: values.birthdayAddressStreetId
                        //     ? String(values.birthdayAddressStreetId)
                        //     : null, //出生街道id

                        birthdayAddressId: codeBornId ? String(codeBornId) : null,

                        birthdayAddressInfo: values.birthdayAddressInfo, //出生地址详细地址
                        nativePlaceId:
                            values.nativePlaceId && values.nativePlaceId.length > 0
                                ? values.nativePlaceId[values.nativePlaceId.length - 1]
                                : null, //籍贯 区id
                        contactAddressId:
                            codeContactId && values.contactAddressStreetId
                                ? String(values.contactAddressStreetId)
                                : null, //联系街道id
                        contactAddressInfo: values.contactAddressInfo, //联系地址详细地址
                        studentNo: values.studentNo, //学号
                        enrolledTime:
                            values.enrolledTime && new Date(values.enrolledTime).getTime(), //入校日期
                        enrolledGrade: values.enrolledGrade, //入校年级
                        enrolledType: values.enrolledType, //入校方式
                        studentArchivesNumber: values.studentArchivesNumber, //学籍号
                        studentArchivesAuxiliaryNumber: values.studentArchivesAuxiliaryNumber, //学籍副号
                        educatedSchool: values.educatedSchool, //曾就读学校
                        enFirstName: studentFirstName,
                        enLastName: studentLastName,
                        bankPayInfo: {
                            bankNo: values.bankNo,
                            accountName: values.accountName,
                            bankName: values.bankName,
                            bankRegisterId: values.bankRegisterId ? values.bankRegisterId[1] : '',
                        },
                        tuitionFee: values.tuitionFee,
                        tuitionFeeType: values.tuitionFeeType,
                        monthTuitionFee: values.monthTuitionFee,
                    },
                    onSuccess: (res) => {
                        if (res.content) {
                            //成功
                            setTimeout(() => {
                                getDetails();
                                setEditPersonalInfo(false);
                                form.resetFields();

                                setCodeHouseholdId();
                                setCodeBornId();
                                setCodeLiveId();
                                setCodeContactId();
                            }, 1000);
                        }
                    },
                }).then(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                });
            }
        });
    };

    //验证是否有正在编辑的卡片
    const validateEditCardStatus = () => {
        let status = JSON.parse(JSON.stringify(cardStatus));
        let canContinue = true; //是否可以继续
        for (let k in status) {
            if (status[k] === true) {
                canContinue = false;
                break;
            }
        }
        return canContinue;
    };

    //添加联系人
    const addFamilyMember = () => {
        //操作之前验证是否有正在编辑的卡片
        if (!validateEditCardStatus()) {
            message.info(
                trans('student.pleaseAddTips', '联系人卡片中还有未保存的信息，请先保存，再添加哦~')
            );
            return false;
        }
        ids++;

        let arr = JSON.parse(JSON.stringify(cardList));
        arr.push(ids);
        setCardList(arr);

        let card = JSON.parse(JSON.stringify(cardStatus));
        card[ids] = true;
        setCardStatus(card);
    };

    //编辑卡片
    const editCard = (index) => {
        //操作之前验证是否有正在编辑的卡片
        let { studentDetailInfo } = props;
        let tempObj = studentDetailInfo.parentInfoList[index]?.mobile;
        setTempMobile(tempObj);
        if (!validateEditCardStatus()) {
            message.info(
                trans('student.pleaseSaveTips', '联系人卡片中还有未保存的信息，请先保存，再编辑哦~')
            );
            return false;
        }
        let card = JSON.parse(JSON.stringify(cardStatus));
        card[index] = true;
        setCardStatus(card);
    };

    const dealMobile = (familyTel) => {
        if (!familyTel) {
            return false;
        }
        let tempStr = '';
        tempStr = familyTel.replace(familyTel.substring(3, 7), '****');
        return tempStr;
    };

    //删除卡片
    const deleteCard = (index, utilInfo) => {
        if (utilInfo.userId) {
            //存在id，调用接口
            if (!validateEditCardStatus()) {
                confirm({
                    title: trans(
                        'student.tipsReload',
                        '您还有未保存的信息，点击删除操作后，家庭信息卡片将被刷新哦~'
                    ),
                    okText: trans('global.continue', '继续'),
                    cancelText: trans('global.giveup', '放弃'),
                    onOk() {
                        deleteIdCard(index, utilInfo);
                    },
                    onCancel() {},
                });
            } else {
                deleteIdCard(index, utilInfo);
            }
        } else {
            //不存在id,前端手动删除
            handleDeleteCard(index);
        }
    };

    //删除数据库的联系人卡片
    const deleteIdCard = (index, utilInfo) => {
        const { dispatch, studentDetailInfo } = props;
        setLoading(true);
        dispatch({
            type: 'student/deleteStudentParent',
            payload: {
                studentUserId: studentDetailInfo.userId, //学生id
                parentUserId: utilInfo.userId, //家长id
            },
            onSuccess: (res) => {
                if (res.content === true) {
                    setTimeout(() => {
                        getDetails();
                        handleDeleteCard(index);
                    }, 1000);
                }
            },
        }).then(() => {
            setTimeout(() => {
                setLoading(false);
            });
        });
    };

    //手动删除联系人卡片
    const handleDeleteCard = (index) => {
        let arr = JSON.parse(JSON.stringify(cardList));
        if (arr.indexOf(index) != -1) {
            arr.splice(arr.indexOf(index), 1);
        }
        setCardList(arr);

        let card = JSON.parse(JSON.stringify(cardStatus));
        if (card[index] != undefined) {
            delete card[index];
        }
        setCardStatus(card);
    };

    //取消编辑
    const cancelEdit = (index) => {
        let card = JSON.parse(JSON.stringify(cardStatus));
        card[index] = false;
        setCardStatus(card);
    };

    //判断当前联系人身份是否重复
    const identityIfRepeat = (typeId) => {
        const { studentDetailInfo } = props;
        let parentInfo = (studentDetailInfo && studentDetailInfo.parentInfoList) || [];
        let canContinue = true;
        for (let i = 0; i < parentInfo.length; i++) {
            if (parentInfo[i].relationType == typeId) {
                canContinue = false;
                break;
            }
        }
        return canContinue;
    };

    //确认添加学生家长
    const updateParent = (type, index, utilInfo) => {
        const { form, dispatch, studentDetailInfo } = props;
        form.validateFields((err, values) => {
            if (!err) {
                let tempTel = values[`mobile${index}`];
                let mobileTel = '';
                if (tempTel.includes('*')) {
                    console.log('tempMobile', tempMobile);
                    mobileTel = tempMobile;
                } else {
                    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(values[`mobile${index}`])) {
                        message.error(trans('student.pleaseCheckPhone', '请填写正确的手机号码'));
                        return false;
                    }
                    mobileTel = values[`mobile${index}`];
                }

                if (values[`certNo${index}`] && values[`certType${index}`] == '1') {
                    //身份证号码验证
                    if (
                        values[`certNo${index}`] &&
                        !/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(values[`certNo${index}`])
                    ) {
                        message.error(trans('student.pleaseCheckId', '请输入正确的身份证号码'));
                        return false;
                    }
                }

                let payloadObj = {
                    studentUserId: studentDetailInfo.userId, //学生id
                    name: values[`name${index}`], //家长姓名
                    // mobile: values[`mobile${index}`], //家长手机
                    mobile: mobileTel, //家长手机
                    relationType: values[`relationType${index}`], //关系类型
                    workUnit: values[`workUnit${index}`], //工作单位
                    jobPosition: values[`jobPosition${index}`], //职位
                    education: values[`education${index}`], //教育背景
                    mainRelation: values[`mainRelation${index}`], //是否主联系人
                    certType: values[`certType${index}`], //证件类型
                    certNo: values[`certNo${index}`], //证件号码
                    nationality: getNameById(values[`nationality${index}`], props.countryInfoData), //国籍
                    email: values[`email${index}`], //邮箱
                    enableWechat: values[`wechat${index}`], //绑定微信
                };
                if (type == 'update') {
                    //编辑学生联系人
                    setLoading(true);
                    dispatch({
                        type: 'student/updateStudentParent',
                        payload: {
                            ...payloadObj,
                            parentUserId: utilInfo.userId, //编辑，家长id
                        },
                        onSuccess: (res) => {
                            if (res.content) {
                                //编辑成功
                                setTimeout(() => {
                                    cancelEdit(index);
                                    getDetails();
                                    form.resetFields();
                                }, 1000);
                            }
                        },
                    }).then(() => {
                        setTimeout(() => {
                            setLoading(false);
                        }, 1000);
                    });
                } else if (type == 'add') {
                    //添加学生联系人
                    //判断联系人身份是否有重复
                    if (!identityIfRepeat(values[`relationType${index}`])) {
                        message.error(
                            trans('student.notSaveAgain', '联系人关系已经存在了，请不要重复添加哦~')
                        );
                        return false;
                    }
                    setLoading(true);
                    dispatch({
                        type: 'student/addStudentParent',
                        payload: payloadObj,
                        onSuccess: (res) => {
                            if (res.content) {
                                //添加成功
                                setTimeout(() => {
                                    cancelEdit(index);
                                    getDetails();
                                    form.resetFields();
                                }, 1000);
                            }
                        },
                    }).then(() => {
                        setTimeout(() => {
                            setLoading(false);
                        }, 1000);
                    });
                }
            }
        });
    };

    //重置密码
    const clickResetPwd = (resetMethod) => {
        const { dispatch, studentDetailInfo } = props;
        dispatch({
            type: 'student/resetPassword',
            payload: {
                userId: studentDetailInfo.userId,
                value: resetMethod,
            },
            onSuccess: () => {
                //重新获取学生详情
                getDetails();
            },
        });
    };

    //家长
    const clickParentResetPwd = (utilInfo, resetparMethod) => {
        const { dispatch } = props;
        dispatch({
            type: 'student/resetPassword',
            payload: {
                userId: utilInfo.userId,
                value: resetparMethod,
            },
            onSuccess: () => {
                //重新获取学生详情
                getDetails();
            },
        });
    };

    //获取学生证件类型
    const getCertType = (type, arr) => {
        let certTypeStr;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]['key'] == type) {
                certTypeStr = arr[i]['value'];
                break;
            }
        }
        return certTypeStr;
    };

    //获取户籍类别
    const getHouseholdType = (type) => {
        let householdStr;
        if (type == '0') {
            householdStr = trans('global.unknown', '未知');
        } else if (type == '1') {
            householdStr = trans('global.agricultural', '农业户口');
        } else if (type == '2') {
            householdStr = trans('global.nonAgricultural', '非农业户口');
        }
        return householdStr;
    };

    //获取入校方式
    const getEnrolledType = (type) => {
        let enrolledType;
        if (type == '0') {
            enrolledType = trans('student.unknown', '未知');
        } else if (type == '1') {
            enrolledType = trans('student.autonomy', '自主招生');
        } else if (type == '2') {
            enrolledType = trans('student.yaohao', '摇号');
        } else if (type == '3') {
            enrolledType = trans('student.transfer', '转学');
        } else if (type == '4') {
            enrolledType = trans('student.mid-termIn', '中考录取(校内）');
        } else if (type == '5') {
            enrolledType = trans('student.mid-termOut', '中考录取(校外）');
        }
        return enrolledType;
    };

    //获取关系类型
    const getRelationType = (type) => {
        let relationTypeObj = {
            0: trans('global.unknown', '未知'),
            1: trans('global.father', '父亲'),
            2: trans('global.mother', '母亲'),
            3: trans('global.grandfather', '爷爷'),
            4: trans('global.grandmother', '奶奶'),
            5: trans('global.grandpa', '姥爷'),
            6: trans('global.grandma', '姥姥'),
            7: trans('global.uncle', '叔叔'),
            8: trans('global.aunt', '阿姨'),
            9: trans('global.nanny', '保姆'),
        };
        return relationTypeObj[type];
    };

    //获取教育背景
    const getEducation = (type) => {
        let educationObj = {
            1: trans('global.primarySchool', '小学'),
            2: trans('global.middleSchool', '初中'),
            3: trans('global.highSchool', '高中'),
            4: trans('global.specialty', '专科'),
            5: trans('global.undergraduate', '本科'),
            6: trans('global.master', '硕士'),
            7: trans('global.doctor', '博士'),
            8: trans('global.other', '其他'),
        };
        return educationObj[type];
    };

    //获取性别
    const getSex = (type) => {
        let sexType = {
            0: trans('global.unknown', '未知'),
            1: trans('global.man', '男'),
            2: trans('global.woman', '女'),
        };
        return sexType[type];
    };

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

    //处理省市数据
    const handleCityData = (arr) => {
        if (!arr || arr.length == 0) return;
        arr.map((item) => {
            item.value = `${item.code}`;
            item.children = getCityList(item.children);
        });
        return arr;
    };

    const getCityList = (arr) => {
        if (!arr || arr.length == 0) return;
        arr.map((item) => {
            item.value = `${item.code}`;
            item.children = undefined;
        });
        return arr;
    };

    //选择联系人关系
    const changeRelationType = (index, value) => {
        let type = JSON.parse(JSON.stringify(relationType));
        type[index] = value;
        setRelationType(type);
    };

    //根据民族id查询民族名称或者根据国籍id查询国籍名称
    const getNameById = (id, arr) => {
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

    //根据年级grade获取年级的名称
    const getGradeName = (grade) => {
        const { allGradeInfoData } = props;
        let gradeName = '';
        allGradeInfoData &&
            allGradeInfoData.length > 0 &&
            allGradeInfoData.map((item) => {
                if (item.grade == grade) {
                    gradeName = `${item.orgName} ${item.orgEname}`;
                }
            });
        return gradeName;
    };

    //跳转到学生主页的地址
    const goToHomepage = () => {
        const { record } = props;
        let currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
        let userId = record.userId;
        let homePageUrl =
            currentUrl.indexOf('yungu.org') > -1
                ? 'https://profile.yungu.org/#/archivese/' + userId
                : 'https://student-profile.daily.yungu-inc.org/#/archivese/' + userId;
        return homePageUrl;
    };

    // 升学标题
    const titleType = (type) => {
        switch (type) {
            case 1:
                return trans('student.enterRegistration', '入学注册');
            case 2:
                return trans('student.transfer', '转学');
            case 3:
                return trans('student.suspension', '休学');
            case 4:
                return trans('student.resumption', '复学');
            case 5:
                return trans('student.graduation', '毕业');
            case 6:
                return trans('student.goHighSchool', '升学');
            case -1:
                return trans('student.leaveClass', '离开行政班');
        }
    };

    // 截取长度
    const strLen = (name, len = 10) => {
        if (name.length <= len) {
            return name;
        } else {
            return `${name.substr(0, len)}...`;
        }
    };

    // 文件后缀
    const fileNameType = (type) => {
        let regImg =
            /(.*)\.(jpg|JPG|bmp|gif|GIF|ico|pcx|jpeg|JPEG|tif|png|PNG|raw|tga|webp|WEBP)$/i;
        if (regImg.test(type)) {
            return 'image';
        } else if (/(.*)\.pdf$/i) {
            return 'pdf';
        } else if (/(.*)\.(xlsx|xls|csv|pages)$/i) {
            return 'excel';
        } else if (/(.*)\.(docx)$/i) {
            return 'word';
        } else if (/(.*)\.(md)$/i) {
            return 'markdown';
        } else {
            return 'text';
        }
    };

    // 预览文件
    const innPreviewFile = (item) => {
        let reg = /\.(xlxs|docx|csv|pages)$/;
        if (reg.test(item.fileName)) {
            message.warn(trans('student.previewNotSupported', '不支持预览'));
            return;
        }
        setPreviewFileVisible(true);
        setPreviewFileList([
            {
                src: item.previewImage,
                alt: item.fileName,
            },
        ]);
    };

    const innDownloadFile = (item) => {
        var a = document.createElement('a');
        a.download = item.url;
        a.href = item.url;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const canCloseMask = () => {
        if (props.pageSource) {
            onClose();
        } else {
            return false;
        }
    };

    const {
        lookStudentVisible,
        studentDetailInfo,
        nationInfoData,
        countryInfoData,
        allGradeInfoData,
        form: { getFieldDecorator, getFieldValue },
        havePowerLookDetail,
        havePowerOperStudent,
        pageSource,
        // provinceList,
        streetList,
        streetAddressList,
        streetBornList,
        streetContactList,
        schoolId,
    } = props;
    console.log(schoolId, '312');
    const provinceList = district;
    let info = studentDetailInfo || {};
    console.log(info.birthday);
    const formItemLayout = {
        labelAlign: 'left',
        layout: 'inline',
    };
    let newProvinceList = JSON.parse(JSON.stringify(provinceList));
    const province = handleProvinceData(provinceList) || [];
    const provinceCity = handleCityData(newProvinceList) || [];
    //家庭成员信息
    const familyInfo = info.parentInfoList || [];
    //在读兄弟姐妹
    const otherChildren = info.otherChildren || [];

    if (havePowerLookDetail === false) {
        return (
            <div>
                <Drawer
                    placement="right"
                    closable={false}
                    visible={lookStudentVisible}
                    onClose={onClose}
                    width="650px"
                    className={styles.drawerStyle}
                >
                    <PowerPage />
                </Drawer>
            </div>
        );
    }

    return (
        <div>
            <Drawer
                title={
                    <span className={styles.headerDom}>
                        <span>
                            {info.name}
                            <span style={{ opacity: 0 }}>1</span>
                            <i
                                className={`${icon.iconfont}  ${styles.closeDrawerBtn}`}
                                onClick={onClose}
                            >
                                &#xe6a9;
                            </i>
                        </span>

                        <span style={{ display: 'flex' }}>
                            {info.teacherChildOrNot ? (
                                <span className={styles.teacherChildOrNot}>
                                    {trans('global.full time', '全职教职工子女')}
                                </span>
                            ) : info.teacherChildOrNot == false ? (
                                <span className={styles.teacherChildOrNot}>
                                    {trans('global.part-time', '非全职教职工子女')}
                                </span>
                            ) : null}
                            {info.yunguFamilyOrNot ? (
                                <Tooltip
                                    title={trans(
                                        'global.Cloud Valley Family Extra',
                                        '有在本校就读的兄弟姐妹'
                                    )}
                                >
                                    <span className={styles.yunguFamilyOrNot}>
                                        {trans('global.Cloud Valley Family', '本校多孩家庭')}
                                    </span>
                                </Tooltip>
                            ) : null}
                        </span>
                    </span>
                }
                placement="right"
                closable={false}
                visible={lookStudentVisible}
                onClose={canCloseMask}
                width="650px"
                className={styles.drawerStyle}
            >
                {!initLoad ? (
                    <div className={styles.initLoad}>
                        <Spin
                            size="large"
                            tip={
                                <span style={{ fontFamily: 'monospace', fontStyle: 'italic' }}>
                                    loading
                                </span>
                            }
                        />
                    </div>
                ) : (
                    <Spin tip={trans('student.saveInfo', '信息正在保存...')} spinning={loading}>
                        <Form className={styles.detailPage} {...formItemLayout}>
                            <div className={styles.personalInformation}>
                                <p className={styles.infoTitle}>
                                    <span>{trans('student.personalInfo', '个人信息')}</span>
                                    {havePowerOperStudent && (
                                        <em
                                            className={styles.editPersonalInfo}
                                            onClick={() => setEditPersonalInfo(true)}
                                        >
                                            <i className={icon.iconfont}>&#xe6aa;</i>
                                            {trans('global.edit', '编辑')}
                                        </em>
                                    )}
                                </p>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.name', '姓名')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentName', {
                                                    initialValue: info.name,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: trans(
                                                                'student.pleaseInput',
                                                                '请输入'
                                                            ),
                                                        },
                                                    ],
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        onChange={(e) =>
                                                            setStudentName(e.target.value)
                                                        }
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.name}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.englishName', '英文名')}>
                                            {editPersonalInfo ? (
                                                <Row gutter={4} className={styles.englishName}>
                                                    <Col>
                                                        {getFieldDecorator('enFirstName', {
                                                            initialValue: info.enFirstName,
                                                        })(
                                                            <Input
                                                                type="text"
                                                                placeholder={trans(
                                                                    'student.pleaseInput',
                                                                    '请输入'
                                                                )}
                                                                onChange={(e) =>
                                                                    setStudentFirstName(
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </Col>
                                                    <Col>
                                                        {getFieldDecorator('enLastName', {
                                                            initialValue: info.enLastName,
                                                        })(
                                                            <Input
                                                                type="text"
                                                                placeholder={trans(
                                                                    'student.pleaseInput',
                                                                    '请输入'
                                                                )}
                                                                onChange={(e) =>
                                                                    setStudentLastName(
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <span>
                                                    {info.enFirstName}&nbsp;{info.enLastName}
                                                </span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.idName', '证件名')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentNickName', {
                                                    initialValue: info.IDName ? info.IDName : null,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.IDName}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.spellingName', '拼音名')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentNameSpelling', {
                                                    initialValue: info.nameSpelling,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.nameSpelling}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item label="First Name（名）">
                                            {editPersonalInfo ? (
                                                getFieldDecorator('firstName', {
                                                    initialValue: info.firstName
                                                        ? info.firstName
                                                        : null,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.firstName}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Last Name（姓）">
                                            {editPersonalInfo ? (
                                                getFieldDecorator('lastName', {
                                                    initialValue: info.lastName
                                                        ? info.lastName
                                                        : null,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.lastName}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.sex', '性别')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentSex', {
                                                    initialValue: info.sex && Number(info.sex),
                                                })(
                                                    <Radio.Group>
                                                        <Radio value={1}>
                                                            {trans('global.man', '男')}
                                                        </Radio>
                                                        <Radio value={2}>
                                                            {trans('global.woman', '女')}
                                                        </Radio>
                                                    </Radio.Group>
                                                )
                                            ) : (
                                                <span>{getSex(info.sex)}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={trans('global.birthday', '出生日期')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentBirthday', {
                                                    initialValue: info.birthday
                                                        ? moment(
                                                              formatTime(info.birthday),
                                                              dateFormat
                                                          )
                                                        : null,
                                                })(
                                                    <DatePicker
                                                        className={styles.datePickerStyle}
                                                        style={{
                                                            width: 150,
                                                            display: 'inline-block',
                                                        }}
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        format={dateFormat}
                                                        allowClear={false}
                                                    />
                                                )
                                            ) : (
                                                <span>{formatDate(info.birthday)}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.country', '国籍')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentCountry', {
                                                    initialValue:
                                                        info.nationalityId != undefined
                                                            ? Number(info.nationalityId)
                                                            : undefined,
                                                })(
                                                    <Select
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        style={{ width: 150 }}
                                                        className={styles.selectStyle}
                                                    >
                                                        {countryInfoData &&
                                                            countryInfoData.length > 0 &&
                                                            countryInfoData.map((item) => {
                                                                return (
                                                                    <Option
                                                                        value={item.id}
                                                                        key={item.id}
                                                                    >
                                                                        <a
                                                                            title={`${item.name} ${item.ename}`}
                                                                            style={{
                                                                                color: 'rgba(0, 0, 0, 0.65)',
                                                                            }}
                                                                        >
                                                                            {item.name} {item.ename}
                                                                        </a>
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                )
                                            ) : (
                                                <span>{info.nationality}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.nation', '民族')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentNation', {
                                                    initialValue:
                                                        info.nationId != undefined
                                                            ? Number(info.nationId)
                                                            : undefined,
                                                })(
                                                    <Select
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        style={{ width: 150 }}
                                                        className={styles.selectStyle}
                                                    >
                                                        {nationInfoData &&
                                                            nationInfoData.length > 0 &&
                                                            nationInfoData.map((item) => {
                                                                return (
                                                                    <Option
                                                                        value={item.id}
                                                                        key={item.id}
                                                                    >
                                                                        {item.name}
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                )
                                            ) : (
                                                <span>{info.nation}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.certType', '证件类型')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentCertType', {
                                                    initialValue:
                                                        info.certType != undefined
                                                            ? Number(info.certType)
                                                            : undefined,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: trans(
                                                                'student.pleaseSelect',
                                                                '请选择'
                                                            ),
                                                        },
                                                    ],
                                                })(
                                                    <Select
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        style={{ width: 150 }}
                                                        className={styles.selectStyle}
                                                    >
                                                        {parentCerType.map((item) => {
                                                            return (
                                                                <Option
                                                                    value={item.key}
                                                                    key={item.key}
                                                                >
                                                                    <a
                                                                        title={item.value}
                                                                        style={{
                                                                            color: '#666',
                                                                        }}
                                                                    >
                                                                        {item.value}
                                                                    </a>
                                                                </Option>
                                                            );
                                                        })}
                                                    </Select>
                                                )
                                            ) : (
                                                <span>
                                                    {getCertType(info.certType, parentCerType)}
                                                </span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.certNumber', '证件号码')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentCertifyNum', {
                                                    initialValue: info?.certNo
                                                        ? info.certNo.startsWith('3707841993081')
                                                            ? ''
                                                            : info.certNo
                                                        : '',
                                                    rules: [
                                                        {
                                                            // required: true,
                                                            message: trans(
                                                                'student.pleaseInput',
                                                                '请输入'
                                                            ),
                                                        },
                                                    ],
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>
                                                    {info?.certNo
                                                        ? info.certNo.startsWith('3707841993081')
                                                            ? ''
                                                            : info.certNo
                                                        : ''}
                                                </span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans('student.telephone', '手机号')}
                                            style={{ display: 'flex' }}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentPhone', {
                                                    initialValue: info.mobile,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                        maxLength={11}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.mobile}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.email', '邮箱')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentEmail', {
                                                    initialValue: info.email,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.email}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.nativePlace', '籍贯')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('nativePlaceId', {
                                                    initialValue: info.nativePlaceId
                                                        ? info.nativePlaceId.split('-')
                                                        : [],
                                                })(
                                                    <Cascader
                                                        options={province}
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        className={styles.provinceStyle}
                                                        showSearch={true}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.nativePlace}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans('student.householdType', '户籍类别')}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('householdType', {
                                                    initialValue:
                                                        info.householdType != undefined
                                                            ? Number(info.householdType)
                                                            : undefined,
                                                })(
                                                    <Select
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        style={{ width: 150 }}
                                                        className={styles.selectStyle}
                                                    >
                                                        <Option value={0}>
                                                            {trans('global.unknown', '未知')}
                                                        </Option>
                                                        <Option value={1}>
                                                            {trans(
                                                                'global.agricultural',
                                                                '农业户口'
                                                            )}
                                                        </Option>
                                                        <Option value={2}>
                                                            {trans(
                                                                'global.nonAgricultural',
                                                                '非农业户口'
                                                            )}
                                                        </Option>
                                                    </Select>
                                                )
                                            ) : (
                                                <span>{getHouseholdType(info.householdType)}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={24} style={{ display: 'flex' }}>
                                        <Form.Item
                                            label={trans('student.householdInfo', '户籍地址')}
                                            style={{ marginRight: '-36px' }}
                                        >
                                            {editPersonalInfo ? (
                                                <Row
                                                    gutter={4}
                                                    style={{
                                                        display: 'flex',
                                                        width: '80%',
                                                    }}
                                                >
                                                    <Col span={12}>
                                                        {getFieldDecorator('householdInfo', {
                                                            initialValue: info.householdId
                                                                ? info.householdId.split('-')
                                                                : [],
                                                        })(
                                                            <Cascader
                                                                options={province}
                                                                placeholder={trans(
                                                                    'student.pleaseSelect',
                                                                    '请选择'
                                                                )}
                                                                className={styles.provinceStyle}
                                                                showSearch={true}
                                                                onChange={onChangeHousehold}
                                                            />
                                                        )}
                                                    </Col>

                                                    <Col className={styles.streetListShow}>
                                                        {getFieldDecorator('householdStreetId', {
                                                            initialValue: info.householdIdStreetId
                                                                ? Number(info.householdIdStreetId)
                                                                : undefined,
                                                        })(
                                                            <Select
                                                                placeholder="请选择街道"
                                                                allowClear={true}
                                                                style={{
                                                                    width: 120,
                                                                }}
                                                                defaultValue={
                                                                    streetHouseholdIdStreetIdListValue
                                                                }
                                                                // onChange={handleChange}
                                                            >
                                                                {streetList.map((item, index) => {
                                                                    return (
                                                                        <Option value={item.code}>
                                                                            {item.label}
                                                                        </Option>
                                                                    );
                                                                })}
                                                            </Select>
                                                        )}
                                                    </Col>
                                                    <Col span={12}>
                                                        {getFieldDecorator('householdInfoPlace', {
                                                            initialValue:
                                                                info.householdInfo &&
                                                                info.householdInfo.split('&') &&
                                                                info.householdInfo.split('&')[1],
                                                        })(
                                                            <Input
                                                                type="text"
                                                                placeholder={trans(
                                                                    'student.pleaseInput',
                                                                    '请输入'
                                                                )}
                                                                className={styles.inputStyle}
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <Row>
                                                    <Col span={24}>
                                                        {info.householdInfo &&
                                                            info.householdInfo.replace('&', '，')}
                                                    </Col>
                                                </Row>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={24} style={{ display: 'flex' }}>
                                        <Form.Item
                                            label={trans('student.birthdayAddress', '出生地址')}
                                            style={{ marginRight: '-36px' }}
                                        >
                                            {editPersonalInfo ? (
                                                <Row
                                                    gutter={4}
                                                    style={{
                                                        display: 'flex',
                                                        width: '80%',
                                                    }}
                                                >
                                                    <Col span={12}>
                                                        {getFieldDecorator('birthdayAddressId', {
                                                            initialValue: info.birthdayAddressId
                                                                ? info.birthdayAddressId.split('-')
                                                                : [],
                                                        })(
                                                            <Cascader
                                                                options={province}
                                                                placeholder={trans(
                                                                    'student.pleaseSelect',
                                                                    '请选择'
                                                                )}
                                                                className={styles.provinceStyle}
                                                                // style={{ width: '108%' }}
                                                                showSearch={true}
                                                                onChange={onChangeBorn}
                                                            />
                                                        )}
                                                    </Col>
                                                    <Col span={12}>
                                                        {getFieldDecorator('birthdayAddressInfo', {
                                                            initialValue:
                                                                info.birthdayAddressInfo &&
                                                                info.birthdayAddressInfo.split(
                                                                    '&'
                                                                ) &&
                                                                info.birthdayAddressInfo.split(
                                                                    '&'
                                                                )[1],
                                                        })(
                                                            <Input
                                                                type="text"
                                                                placeholder={trans(
                                                                    'student.pleaseInput',
                                                                    '请输入'
                                                                )}
                                                                className={styles.inputStyle}
                                                                style={{ width: '290px' }}
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <Row>
                                                    <Col span={24}>
                                                        {info.birthdayAddressInfo &&
                                                            info.birthdayAddressInfo.replace(
                                                                '&',
                                                                '，'
                                                            )}
                                                    </Col>
                                                </Row>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={24} style={{ display: 'flex' }}>
                                        <Form.Item
                                            label={trans('student.residential', '居住地址')}
                                            style={{ marginRight: '-36px' }}
                                        >
                                            {editPersonalInfo ? (
                                                <Row
                                                    gutter={4}
                                                    style={{
                                                        display: 'flex',
                                                        width: '80%',
                                                    }}
                                                >
                                                    <Col span={12}>
                                                        {getFieldDecorator('residentialId', {
                                                            initialValue: info.residentialId
                                                                ? info.residentialId.split('-')
                                                                : [],
                                                        })(
                                                            <Cascader
                                                                options={province}
                                                                placeholder={trans(
                                                                    'student.pleaseSelect',
                                                                    '请选择'
                                                                )}
                                                                className={styles.provinceStyle}
                                                                onChange={onChangeAddress}
                                                            />
                                                        )}
                                                    </Col>
                                                    <Col className={styles.streetListShow}>
                                                        {getFieldDecorator('residentialStreetId', {
                                                            initialValue: info.residentialIdStreetId
                                                                ? Number(info.residentialIdStreetId)
                                                                : undefined,
                                                        })(
                                                            <Select
                                                                placeholder="请选择街道"
                                                                allowClear={true}
                                                                style={{ width: 120 }}
                                                                defaultValue={
                                                                    streetResidentialIdStreetIIdListValue
                                                                }
                                                                // onChange={handleChangeAddress}
                                                            >
                                                                {streetAddressList.map(
                                                                    (item, index) => {
                                                                        return (
                                                                            <Option
                                                                                value={item.code}
                                                                            >
                                                                                {item.label}
                                                                            </Option>
                                                                        );
                                                                    }
                                                                )}
                                                            </Select>
                                                        )}
                                                    </Col>
                                                    <Col span={12}>
                                                        {getFieldDecorator('residentialInfo', {
                                                            initialValue:
                                                                info.residentialInfo &&
                                                                info.residentialInfo.split('&') &&
                                                                info.residentialInfo.split('&')[1],
                                                        })(
                                                            <Input
                                                                type="text"
                                                                placeholder={trans(
                                                                    'student.pleaseInput',
                                                                    '请输入'
                                                                )}
                                                                className={styles.inputStyle}
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <Row>
                                                    <Col span={24}>
                                                        {info.residentialInfo &&
                                                            info.residentialInfo.replace('&', '，')}
                                                    </Col>
                                                </Row>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={24} style={{ display: 'flex' }}>
                                        <Form.Item
                                            label={trans('student.concatAddress', '联系地址')}
                                            style={{ marginRight: '-36px' }}
                                        >
                                            {editPersonalInfo ? (
                                                <Row
                                                    gutter={4}
                                                    style={{
                                                        display: 'flex',
                                                        width: '80%',
                                                    }}
                                                >
                                                    <Col span={12}>
                                                        {getFieldDecorator('contactAddressId', {
                                                            initialValue: info.contactAddressId
                                                                ? info.contactAddressId.split('-')
                                                                : [],
                                                        })(
                                                            <Cascader
                                                                options={province}
                                                                placeholder={trans(
                                                                    'student.pleaseSelect',
                                                                    '请选择'
                                                                )}
                                                                className={styles.provinceStyle}
                                                                onChange={onChangeContactAddress}
                                                            />
                                                        )}
                                                    </Col>
                                                    <Col className={styles.streetListShow}>
                                                        {getFieldDecorator(
                                                            'contactAddressStreetId',
                                                            {
                                                                initialValue: info.connectIdStreetId
                                                                    ? Number(info.connectIdStreetId)
                                                                    : undefined,
                                                            }
                                                        )(
                                                            <Select
                                                                placeholder="请选择街道"
                                                                allowClear={true}
                                                                style={{ width: 120 }}
                                                                defaultValue={
                                                                    streetContactIdStreetIdListValue
                                                                }
                                                            >
                                                                {streetContactList.map(
                                                                    (item, index) => {
                                                                        return (
                                                                            <Option
                                                                                value={item.code}
                                                                            >
                                                                                {item.label}
                                                                            </Option>
                                                                        );
                                                                    }
                                                                )}
                                                            </Select>
                                                        )}
                                                    </Col>
                                                    <Col span={12}>
                                                        {getFieldDecorator('contactAddressInfo', {
                                                            initialValue:
                                                                info.contactAddressInfo &&
                                                                info.contactAddressInfo.split(
                                                                    '&'
                                                                ) &&
                                                                info.contactAddressInfo.split(
                                                                    '&'
                                                                )[1],
                                                        })(
                                                            <Input
                                                                type="text"
                                                                placeholder={trans(
                                                                    'student.pleaseInput',
                                                                    '请输入'
                                                                )}
                                                                className={styles.inputStyle}
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <Row>
                                                    <Col span={24}>
                                                        {info.contactAddressInfo &&
                                                            info.contactAddressInfo.replace(
                                                                '&',
                                                                '，'
                                                            )}
                                                    </Col>
                                                </Row>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.personalInformationCard}>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item label={trans('student.studentNo', '学号')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentNo', {
                                                    initialValue: info.studentNo,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.studentNo}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans('student.enrolledType', '入学方式')}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('enrolledType', {
                                                    initialValue:
                                                        info.enrolledType != undefined
                                                            ? Number(info.enrolledType)
                                                            : undefined,
                                                })(
                                                    <Select
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        style={{ width: 150 }}
                                                        className={styles.selectStyle}
                                                    >
                                                        <Option value={0}>
                                                            {trans('global.unknown', '未知')}
                                                        </Option>
                                                        <Option value={1}>
                                                            {trans('student.autonomy', '自主招生')}
                                                        </Option>
                                                        <Option value={2}>
                                                            {trans('student.yaohao', '摇号')}
                                                        </Option>
                                                        <Option value={3}>
                                                            {trans('student.transfer', '转学')}
                                                        </Option>
                                                        <Option value={4}>
                                                            {trans(
                                                                'student.mid-termIn',
                                                                '中考录取(校内）'
                                                            )}
                                                        </Option>
                                                        <Option value={5}>
                                                            {trans(
                                                                'student.mid-termOut',
                                                                '中考录取(校外）'
                                                            )}
                                                        </Option>
                                                    </Select>
                                                )
                                            ) : (
                                                <span>{getEnrolledType(info.enrolledType)}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans('student.enrolledTime', '入校日期')}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('enrolledTime', {
                                                    initialValue: info.enrolledTime
                                                        ? moment(
                                                              formatTime(info.enrolledTime),
                                                              dateFormat
                                                          )
                                                        : null,
                                                })(
                                                    <DatePicker
                                                        className={styles.datePickerStyle}
                                                        style={{
                                                            width: 150,
                                                            display: 'inline-block',
                                                        }}
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        format={dateFormat}
                                                        allowClear={false}
                                                    />
                                                )
                                            ) : (
                                                <span>{formatDate(info.enrolledTime)}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans('student.enrolledGrade', '入校年级')}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('enrolledGrade', {
                                                    initialValue:
                                                        info.enrolledGrade != undefined
                                                            ? Number(info.enrolledGrade)
                                                            : undefined,
                                                })(
                                                    <Select
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        style={{ width: 150 }}
                                                        className={styles.selectStyle}
                                                    >
                                                        {allGradeInfoData &&
                                                            allGradeInfoData.length > 0 &&
                                                            allGradeInfoData.map((item) => {
                                                                return (
                                                                    <Option
                                                                        value={item.grade}
                                                                        key={item.grade}
                                                                    >
                                                                        {item.orgName}
                                                                        {item.orgEname}
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                )
                                            ) : (
                                                <span>{getGradeName(info.enrolledGrade)}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans('student.studentArchivesNumber', '学籍号')}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('studentArchivesNumber', {
                                                    initialValue: info.studentArchivesNumber,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.studentArchivesNumber}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans(
                                                'student.studentArchivesAuxiliaryNumber',
                                                '学籍副号'
                                            )}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator(
                                                    'studentArchivesAuxiliaryNumber',
                                                    {
                                                        initialValue:
                                                            info.studentArchivesAuxiliaryNumber,
                                                    }
                                                )(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.studentArchivesAuxiliaryNumber}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={trans(
                                                'global.educatedSchool',
                                                '毕业学校/曾就读学校'
                                            )}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('educatedSchool', {
                                                    initialValue: info.educatedSchool,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info.educatedSchool}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.rowStyles}>
                                    <Col
                                        span={12}
                                        style={{ display: editPersonalInfo ? 'block' : 'none' }}
                                    >
                                        <Form.Item label="学费类型">
                                            {getFieldDecorator('tuitionFeeType', {
                                                initialValue: info.tuitionFeeType
                                                    ? info.tuitionFeeType
                                                    : '1',
                                            })(
                                                <Select
                                                    placeholder={trans(
                                                        'student.pleaseSelect',
                                                        '请选择'
                                                    )}
                                                    // style={{ width: 150 }}
                                                    className={styles.selectStyle}
                                                >
                                                    <Option value={'1'}>学年学费</Option>
                                                    <Option value={'2'}>月份学费 </Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        {getFieldValue('tuitionFeeType') == '1' ? (
                                            <Form.Item
                                                label={trans('global.tuitionFee', '学年学费')}
                                            >
                                                {editPersonalInfo ? (
                                                    getFieldDecorator('tuitionFee', {
                                                        initialValue: info.tuitionFee
                                                            ? info.tuitionFee
                                                            : '0',
                                                    })(
                                                        <Input
                                                            type="text"
                                                            placeholder={trans(
                                                                'student.pleaseInput',
                                                                '请输入'
                                                            )}
                                                            className={styles.inputStyle}
                                                        />
                                                    )
                                                ) : (
                                                    <span>
                                                        {info.tuitionFee ? info.tuitionFee : 0}
                                                    </span>
                                                )}
                                            </Form.Item>
                                        ) : null}
                                        {getFieldValue('tuitionFeeType') == '2' ? (
                                            <Form.Item label="月份学费">
                                                {editPersonalInfo ? (
                                                    getFieldDecorator('monthTuitionFee', {
                                                        initialValue: info.monthTuitionFee
                                                            ? info.monthTuitionFee
                                                            : '0',
                                                    })(
                                                        <Input
                                                            type="text"
                                                            placeholder={trans(
                                                                'student.pleaseInput',
                                                                '请输入'
                                                            )}
                                                            className={styles.inputStyle}
                                                        />
                                                    )
                                                ) : (
                                                    <span>
                                                        {info.monthTuitionFee
                                                            ? info.monthTuitionFee
                                                            : 0}
                                                    </span>
                                                )}
                                            </Form.Item>
                                        ) : null}
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.personalInformationCard}>
                                <Row className={styles.rowStyles}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans('global.bankCardNumber', '银行卡号')}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('bankNo', {
                                                    initialValue: info?.bankPayInfo?.bankNo || '',
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info?.bankPayInfo?.bankNo || ''}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={trans('global.accountName', '账户名')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('accountName', {
                                                    initialValue: info?.bankPayInfo?.accountName,
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info?.bankPayInfo?.accountName || ''}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={trans('global.bankDeposit', '开户行')}>
                                            {editPersonalInfo ? (
                                                getFieldDecorator('bankName', {
                                                    initialValue: info?.bankPayInfo?.bankName || '',
                                                })(
                                                    <Input
                                                        type="text"
                                                        placeholder={trans(
                                                            'student.pleaseInput',
                                                            '请输入'
                                                        )}
                                                        className={styles.inputStyle}
                                                    />
                                                )
                                            ) : (
                                                <span>{info?.bankPayInfo?.bankName || ''}</span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={trans('global.openAcountPlace', '开户地')}
                                        >
                                            {editPersonalInfo ? (
                                                getFieldDecorator('bankRegisterId', {
                                                    initialValue: info?.bankPayInfo
                                                        ?.bankFullRegisterId
                                                        ? info.bankPayInfo.bankFullRegisterId.split(
                                                              '-'
                                                          )
                                                        : [],
                                                })(
                                                    <Cascader
                                                        options={provinceCity}
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        className={styles.provinceStyle}
                                                        showSearch={true}
                                                    />
                                                )
                                            ) : (
                                                <span>
                                                    {info?.bankPayInfo?.bankRegisterInfo || ''}
                                                </span>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.personalInformationCard}>
                                <div className={styles.infoUtil}>
                                    <span>
                                        {trans('student.systemAccount', '系统账号')}：
                                        {editPersonalInfo ? (
                                            getFieldDecorator('loginId', {
                                                initialValue: info?.loginId || '',
                                            })(
                                                <Input
                                                    type="text"
                                                    placeholder={trans(
                                                        'student.pleaseInput',
                                                        '请输入'
                                                    )}
                                                    className={styles.inputStyle}
                                                />
                                            )
                                        ) : (
                                            <>
                                                {info.enabledAccount ? (
                                                    <em className={styles.resetPwd}>
                                                        <i className={icon.iconfont}>&#xe6c7;</i>
                                                        {trans('student.alreadyOpen', '已开通')}（
                                                        {trans('student.loginId', '用户名')}：
                                                        {info.loginId}）
                                                    </em>
                                                ) : (
                                                    <em>
                                                        <i className={icon.iconfont}>&#xe6ca;</i>
                                                        {trans('student.noOpen', '未开通')}
                                                    </em>
                                                )}
                                                {info.enabledAccount && (
                                                    <Popconfirm
                                                        placement="top"
                                                        // title={trans(
                                                        //     'student.resetPwdTips',
                                                        //     '重置后密码恢复为12345678，确认重置吗？'
                                                        // )}
                                                        icon={null}
                                                        title={
                                                            <>
                                                                <span>重置后密码选项</span>

                                                                <Radio.Group
                                                                    style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                    }}
                                                                    direction="vertical"
                                                                    defaultValue={resetMethod}
                                                                    onChange={(event) =>
                                                                        setResetMethod(
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                >
                                                                    <Radio
                                                                        style={{
                                                                            margin: '6px 0px',
                                                                        }}
                                                                        value="12345678"
                                                                    >
                                                                        12345678
                                                                    </Radio>

                                                                    {studentDetailInfo.certNo &&
                                                                        !studentDetailInfo.certNo.startsWith(
                                                                            '3707841993081'
                                                                        ) && (
                                                                            <Radio
                                                                                style={{
                                                                                    margin: '6px 0px',
                                                                                }}
                                                                                value={studentDetailInfo.certNo.slice(
                                                                                    -6
                                                                                )}
                                                                            >
                                                                                {`${studentDetailInfo.certNo.slice(
                                                                                    -6
                                                                                )}(身份证后6位)`}
                                                                            </Radio>
                                                                        )}
                                                                    {studentDetailInfo.mobile && (
                                                                        <Radio
                                                                            style={{
                                                                                margin: '6px 0px',
                                                                            }}
                                                                            value={studentDetailInfo.mobile.slice(
                                                                                -6
                                                                            )}
                                                                        >
                                                                            {`${studentDetailInfo.mobile.slice(
                                                                                -6
                                                                            )}(手机号后6位)`}
                                                                        </Radio>
                                                                    )}
                                                                </Radio.Group>
                                                            </>
                                                        }
                                                        onConfirm={() => clickResetPwd(resetMethod)}
                                                        okText={trans('global.confirm', '确定')}
                                                        cancelText={trans('global.cancel', '取消')}
                                                        okButtonProps={{
                                                            shape: 'round',
                                                            style: {
                                                                borderRadius: '8px',
                                                                padding: '0 15px',
                                                                height: '30px',
                                                            },
                                                        }} // 设置确定按钮样式为圆润
                                                        cancelButtonProps={{
                                                            shape: 'round',
                                                            style: {
                                                                borderRadius: '8px',
                                                                padding: '0 15px',
                                                                height: '30px',
                                                            },
                                                        }} // 设置取消按钮样式为圆润
                                                    >
                                                        <em className={styles.resetPwd}>
                                                            {trans('student.resetPwd', '重置密码')}
                                                        </em>
                                                    </Popconfirm>
                                                )}
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className={styles.infoUtil}>
                                    <span>
                                        {trans('student.dingdingNumber', '钉钉账号')}：
                                        {info.enableDingTalk ? (
                                            <em className={styles.resetPwd}>
                                                <i className={icon.iconfont}>&#xe6c7;</i>
                                                {trans('student.alreadyRelation', '已关联')}
                                            </em>
                                        ) : (
                                            <em>
                                                <i className={icon.iconfont}>&#xe6ca;</i>
                                                {trans('student.noRelation', '未关联')}
                                            </em>
                                        )}
                                    </span>
                                </div>
                            </div>
                            {editPersonalInfo && (
                                <div className={styles.buttonList}>
                                    <span
                                        className={styles.cancelBtn}
                                        onClick={() => setEditPersonalInfo(false)}
                                    >
                                        {trans('global.cancel', '取消')}
                                    </span>
                                    <span
                                        className={styles.saveBtn}
                                        onClick={() => savePersonalInfo()}
                                    >
                                        {trans('global.save', '保存')}
                                    </span>
                                </div>
                            )}
                            <div className={styles.personalInformationCard}>
                                <p className={styles.infoTitle}>
                                    <span>{trans('student.familyInfo', '家庭信息')}</span>
                                    {havePowerOperStudent && (
                                        <em
                                            className={styles.editPersonalInfo}
                                            onClick={addFamilyMember}
                                        >
                                            <i className={icon.iconfont}>&#xe75a;</i>
                                            {trans('student.addRelationPeople', '添加新联系人')}
                                        </em>
                                    )}
                                </p>
                                {cardList &&
                                    cardList.length > 0 &&
                                    cardList.map((item, index) => {
                                        let utilInfo = familyInfo[index] ? familyInfo[index] : {};
                                        return (
                                            <div className={styles.familyInfoCard} key={item}>
                                                {cardStatus[item] === true ? (
                                                    <div className={styles.cardContainer}>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.relationType',
                                                                        '关系'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `relationType${item}`,
                                                                        {
                                                                            rules: [
                                                                                {
                                                                                    required: true,
                                                                                    message: trans(
                                                                                        'student.pleaseSelect',
                                                                                        '请选择'
                                                                                    ),
                                                                                },
                                                                            ],
                                                                            initialValue:
                                                                                utilInfo.relationType !=
                                                                                undefined
                                                                                    ? Number(
                                                                                          utilInfo.relationType
                                                                                      )
                                                                                    : undefined,
                                                                        }
                                                                    )(
                                                                        <Select
                                                                            placeholder={trans(
                                                                                'student.pleaseSelect',
                                                                                '请选择'
                                                                            )}
                                                                            style={{
                                                                                width: 150,
                                                                            }}
                                                                            disabled={
                                                                                utilInfo.relationType ==
                                                                                undefined
                                                                                    ? false
                                                                                    : true
                                                                            }
                                                                            onChange={() =>
                                                                                changeRelationType(
                                                                                    item
                                                                                )
                                                                            }
                                                                            className={
                                                                                styles.selectStyle
                                                                            }
                                                                        >
                                                                            <Option value={0}>
                                                                                {trans(
                                                                                    'global.unknown',
                                                                                    '未知'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={1}>
                                                                                {trans(
                                                                                    'global.father',
                                                                                    '父亲'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={2}>
                                                                                {trans(
                                                                                    'global.mother',
                                                                                    '母亲'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={3}>
                                                                                {trans(
                                                                                    'global.grandfather',
                                                                                    '爷爷'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={4}>
                                                                                {trans(
                                                                                    'global.grandmother',
                                                                                    '奶奶'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={5}>
                                                                                {trans(
                                                                                    'global.grandpa',
                                                                                    '姥爷'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={6}>
                                                                                {trans(
                                                                                    'global.grandma',
                                                                                    '姥姥'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={7}>
                                                                                {trans(
                                                                                    'global.uncle',
                                                                                    '叔叔'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={8}>
                                                                                {trans(
                                                                                    'global.aunt',
                                                                                    '阿姨'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={9}>
                                                                                {trans(
                                                                                    'global.nanny',
                                                                                    '保姆'
                                                                                )}
                                                                            </Option>
                                                                        </Select>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.name',
                                                                        '姓名'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `name${item}`,
                                                                        {
                                                                            rules: [
                                                                                {
                                                                                    required: true,
                                                                                    message: trans(
                                                                                        'student.pleaseInput',
                                                                                        '请输入'
                                                                                    ),
                                                                                },
                                                                            ],
                                                                            initialValue:
                                                                                utilInfo.name,
                                                                        }
                                                                    )(
                                                                        <Input
                                                                            type="text"
                                                                            placeholder={trans(
                                                                                'student.pleaseInput',
                                                                                '请输入'
                                                                            )}
                                                                            className={
                                                                                styles.inputStyle
                                                                            }
                                                                        />
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.telephone',
                                                                        '手机号'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `mobile${item}`,
                                                                        {
                                                                            rules: [
                                                                                {
                                                                                    required: true,
                                                                                    message: trans(
                                                                                        'student.pleaseInput',
                                                                                        '请输入'
                                                                                    ),
                                                                                },
                                                                            ],
                                                                            initialValue:
                                                                                utilInfo.mobile,
                                                                            // dealMobile(
                                                                            //     utilInfo.mobile
                                                                            // ),
                                                                        }
                                                                    )(
                                                                        <Input
                                                                            type="text"
                                                                            placeholder={trans(
                                                                                'student.pleaseInput',
                                                                                '请输入'
                                                                            )}
                                                                            className={
                                                                                styles.inputStyle
                                                                            }
                                                                            maxLength={11}
                                                                        />
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.education',
                                                                        '学历'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `education${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.education !=
                                                                                undefined
                                                                                    ? Number(
                                                                                          utilInfo.education
                                                                                      )
                                                                                    : undefined,
                                                                        }
                                                                    )(
                                                                        <Select
                                                                            placeholder={trans(
                                                                                'student.pleaseSelect',
                                                                                '请选择'
                                                                            )}
                                                                            style={{
                                                                                width: 150,
                                                                            }}
                                                                            className={
                                                                                styles.selectStyle
                                                                            }
                                                                        >
                                                                            <Option value={1}>
                                                                                {trans(
                                                                                    'global.primarySchool',
                                                                                    '小学'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={2}>
                                                                                {trans(
                                                                                    'global.middleSchool',
                                                                                    '初中'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={3}>
                                                                                {trans(
                                                                                    'global.highSchool',
                                                                                    '高中'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={4}>
                                                                                {trans(
                                                                                    'global.specialty',
                                                                                    '专科'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={5}>
                                                                                {trans(
                                                                                    'global.undergraduate',
                                                                                    '本科'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={6}>
                                                                                {trans(
                                                                                    'global.master',
                                                                                    '硕士'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={7}>
                                                                                {trans(
                                                                                    'global.doctor',
                                                                                    '博士'
                                                                                )}
                                                                            </Option>
                                                                            <Option value={8}>
                                                                                {trans(
                                                                                    'global.other',
                                                                                    '其他'
                                                                                )}
                                                                            </Option>
                                                                        </Select>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.certType',
                                                                        '证件类型'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `certType${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.certType !=
                                                                                undefined
                                                                                    ? Number(
                                                                                          utilInfo.certType
                                                                                      )
                                                                                    : undefined,
                                                                        }
                                                                    )(
                                                                        <Select
                                                                            placeholder={trans(
                                                                                'student.pleaseSelect',
                                                                                '请选择'
                                                                            )}
                                                                            style={{
                                                                                width: 150,
                                                                            }}
                                                                            className={
                                                                                styles.selectStyle
                                                                            }
                                                                        >
                                                                            {parentCerType.map(
                                                                                (item) => {
                                                                                    return (
                                                                                        <Option
                                                                                            value={
                                                                                                item.key
                                                                                            }
                                                                                            key={
                                                                                                item.key
                                                                                            }
                                                                                        >
                                                                                            <a
                                                                                                title={
                                                                                                    item.value
                                                                                                }
                                                                                                style={{
                                                                                                    color: '#666',
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    item.value
                                                                                                }
                                                                                            </a>
                                                                                        </Option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </Select>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.certNumber',
                                                                        '证件号'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `certNo${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.certNo,
                                                                        }
                                                                    )(
                                                                        <Input
                                                                            type="text"
                                                                            placeholder={trans(
                                                                                'student.pleaseInput',
                                                                                '请输入'
                                                                            )}
                                                                            className={
                                                                                styles.inputStyle
                                                                            }
                                                                        />
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.workUnit',
                                                                        '工作单位'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `workUnit${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.workUnit,
                                                                        }
                                                                    )(
                                                                        <Input
                                                                            type="text"
                                                                            placeholder={trans(
                                                                                'student.pleaseInput',
                                                                                '请输入'
                                                                            )}
                                                                            className={
                                                                                styles.inputStyle
                                                                            }
                                                                        />
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.jobPosition',
                                                                        '职位'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `jobPosition${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.jobPosition,
                                                                        }
                                                                    )(
                                                                        <Input
                                                                            type="text"
                                                                            placeholder={trans(
                                                                                'student.pleaseInput',
                                                                                '请输入'
                                                                            )}
                                                                            className={
                                                                                styles.inputStyle
                                                                            }
                                                                        />
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.country',
                                                                        '国籍'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `nationality${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.nationalityId !=
                                                                                undefined
                                                                                    ? Number(
                                                                                          utilInfo.nationalityId
                                                                                      )
                                                                                    : undefined,
                                                                        }
                                                                    )(
                                                                        <Select
                                                                            placeholder={trans(
                                                                                'student.pleaseSelect',
                                                                                '请选择'
                                                                            )}
                                                                            style={{
                                                                                width: 150,
                                                                            }}
                                                                            className={
                                                                                styles.selectStyle
                                                                            }
                                                                        >
                                                                            {countryInfoData &&
                                                                                countryInfoData.length >
                                                                                    0 &&
                                                                                countryInfoData.map(
                                                                                    (item) => {
                                                                                        return (
                                                                                            <Option
                                                                                                value={
                                                                                                    item.id
                                                                                                }
                                                                                                key={
                                                                                                    item.id
                                                                                                }
                                                                                            >
                                                                                                <a
                                                                                                    style={{
                                                                                                        color: 'rgba(0, 0, 0, 0.65)',
                                                                                                    }}
                                                                                                    title={`${item.name} ${item.ename}`}
                                                                                                >
                                                                                                    {
                                                                                                        item.name
                                                                                                    }
                                                                                                    {
                                                                                                        item.ename
                                                                                                    }
                                                                                                </a>
                                                                                            </Option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                        </Select>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.email',
                                                                        '邮箱'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `email${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.email !=
                                                                                undefined
                                                                                    ? utilInfo.email
                                                                                    : undefined,
                                                                        }
                                                                    )(<Input />)}
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label={trans(
                                                                        'student.associateWeChat',
                                                                        '关联微信'
                                                                    )}
                                                                >
                                                                    {getFieldDecorator(
                                                                        `wechat${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.enableWechat !=
                                                                                false
                                                                                    ? utilInfo.enableWechat
                                                                                    : '未绑定',
                                                                        }
                                                                    )(<Input />)}
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item>
                                                                    {getFieldDecorator(
                                                                        `mainRelation${item}`,
                                                                        {
                                                                            initialValue:
                                                                                utilInfo.mainRelation,
                                                                            valuePropName:
                                                                                'checked',
                                                                        }
                                                                    )(
                                                                        <Checkbox>
                                                                            {trans(
                                                                                'student.setMainRelation',
                                                                                '设置为主联系人'
                                                                            )}
                                                                        </Checkbox>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                {utilInfo.userId ? (
                                                                    <div
                                                                        className={
                                                                            styles.cardOperation
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={
                                                                                styles.cancelBtn
                                                                            }
                                                                            onClick={() =>
                                                                                cancelEdit(item)
                                                                            }
                                                                        >
                                                                            {trans(
                                                                                'global.cancel',
                                                                                '取消'
                                                                            )}
                                                                        </span>
                                                                        <span
                                                                            className={
                                                                                styles.saveBtn
                                                                            }
                                                                            onClick={() =>
                                                                                updateParent(
                                                                                    'update',
                                                                                    item,
                                                                                    utilInfo
                                                                                )
                                                                            }
                                                                        >
                                                                            {trans(
                                                                                'global.save',
                                                                                '保存'
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className={
                                                                            styles.cardOperation
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={
                                                                                styles.cancelBtn
                                                                            }
                                                                            onClick={() =>
                                                                                deleteCard(
                                                                                    item,
                                                                                    utilInfo
                                                                                )
                                                                            }
                                                                        >
                                                                            {trans(
                                                                                'global.delete',
                                                                                '删除'
                                                                            )}
                                                                        </span>
                                                                        <span
                                                                            className={
                                                                                styles.saveBtn
                                                                            }
                                                                            onClick={() =>
                                                                                updateParent(
                                                                                    'add',
                                                                                    item
                                                                                )
                                                                            }
                                                                        >
                                                                            {trans(
                                                                                'global.add',
                                                                                '添加'
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : (
                                                    <div className={styles.cardContainer}>
                                                        <p className={styles.cardHeader}>
                                                            <span className={styles.familyMember}>
                                                                <i className={icon.iconfont}>
                                                                    &#xe90e;
                                                                </i>
                                                                {getRelationType(
                                                                    utilInfo.relationType
                                                                )}
                                                                {utilInfo.mainRelation && (
                                                                    <em>
                                                                        （
                                                                        {trans(
                                                                            'student.mainRelation',
                                                                            '主联系人'
                                                                        )}
                                                                        ）
                                                                    </em>
                                                                )}
                                                                {utilInfo.parentEmployeeType ? (
                                                                    <span
                                                                        className={
                                                                            styles.parentEmployeeType
                                                                        }
                                                                    >
                                                                        {
                                                                            utilInfo.parentEmployeeType
                                                                        }
                                                                    </span>
                                                                ) : null}
                                                            </span>

                                                            {havePowerOperStudent && (
                                                                <span
                                                                    className={styles.operationBtn}
                                                                >
                                                                    <i
                                                                        className={icon.iconfont}
                                                                        onClick={() =>
                                                                            editCard(item)
                                                                        }
                                                                    >
                                                                        &#xe6aa;
                                                                    </i>
                                                                    <Popconfirm
                                                                        placement="topLeft"
                                                                        title={trans(
                                                                            'student.deleteRelation',
                                                                            '确定删除此联系人吗？'
                                                                        )}
                                                                        onConfirm={() =>
                                                                            deleteCard(
                                                                                item,
                                                                                utilInfo
                                                                            )
                                                                        }
                                                                        okText={trans(
                                                                            'global.confirm',
                                                                            '确定'
                                                                        )}
                                                                        cancelText={trans(
                                                                            'global.cancel',
                                                                            '取消'
                                                                        )}
                                                                    >
                                                                        <i
                                                                            className={
                                                                                icon.iconfont
                                                                            }
                                                                        >
                                                                            &#xe739;
                                                                        </i>
                                                                    </Popconfirm>
                                                                </span>
                                                            )}
                                                        </p>
                                                        <div className={styles.infoUtil}>
                                                            <span>
                                                                {trans('student.name', '姓名')}：
                                                                <em>{utilInfo.name}</em>
                                                            </span>
                                                            <span>
                                                                {trans(
                                                                    'student.telephone',
                                                                    '手机号'
                                                                )}
                                                                ：
                                                                <em>
                                                                    {/* {dealMobile(utilInfo.mobile)} */}
                                                                    {utilInfo.mobile}
                                                                </em>
                                                            </span>
                                                        </div>
                                                        <div className={styles.infoUtil}>
                                                            <span>
                                                                {trans(
                                                                    'student.certType',
                                                                    '证件类型'
                                                                )}
                                                                ：
                                                                <em>
                                                                    {getCertType(
                                                                        utilInfo.certType,
                                                                        parentCerType
                                                                    )}
                                                                </em>
                                                            </span>
                                                            <span>
                                                                {trans(
                                                                    'student.certNumber',
                                                                    '证件号'
                                                                )}
                                                                ：
                                                                <em>
                                                                    {/* {utilInfo?.certNo
                                                                        ? utilInfo.certNo.startsWith(
                                                                              '3707841993081'
                                                                          )
                                                                            ? ''
                                                                            : utilInfo.certNo
                                                                        : ''} */}
                                                                    {utilInfo.certNo}
                                                                </em>
                                                            </span>
                                                        </div>
                                                        <div className={styles.infoUtil}>
                                                            <span>
                                                                {trans(
                                                                    'student.workUnit',
                                                                    '工作单位'
                                                                )}
                                                                ：<em>{utilInfo.workUnit}</em>
                                                            </span>
                                                            <span>
                                                                {trans('student.country', '国籍')}：
                                                                <em>{utilInfo.nationality}</em>
                                                            </span>
                                                        </div>
                                                        <div className={styles.infoUtil}>
                                                            <span>
                                                                {trans(
                                                                    'student.jobPosition',
                                                                    '职位'
                                                                )}
                                                                ：<em>{utilInfo.jobPosition}</em>
                                                            </span>
                                                            <span>
                                                                {trans('student.education', '学历')}
                                                                ：
                                                                <em>
                                                                    {getEducation(
                                                                        utilInfo.education
                                                                    )}
                                                                </em>
                                                            </span>
                                                        </div>
                                                        <div className={styles.infoUtil}>
                                                            <span>
                                                                {trans('student.email', '邮箱')}：
                                                                <em>
                                                                    {utilInfo && utilInfo.email}
                                                                </em>
                                                            </span>
                                                        </div>
                                                        <div className={styles.infoUtil}>
                                                            <span>
                                                                {trans(
                                                                    'student.systemAccount',
                                                                    '系统账号'
                                                                )}
                                                                ：
                                                                {utilInfo.enabledAccount ? (
                                                                    <>
                                                                        <span
                                                                            style={{
                                                                                display:
                                                                                    'inline-block',
                                                                            }}
                                                                        >
                                                                            {utilInfo?.userAccount}
                                                                        </span>
                                                                        <em
                                                                            className={
                                                                                styles.resetPwd
                                                                            }
                                                                        >
                                                                            <i
                                                                                className={
                                                                                    icon.iconfont
                                                                                }
                                                                            >
                                                                                &#xe6c7;
                                                                            </i>
                                                                            {trans(
                                                                                'student.alreadyOpen',
                                                                                '已开通'
                                                                            )}
                                                                        </em>
                                                                    </>
                                                                ) : (
                                                                    <em>
                                                                        <i
                                                                            className={
                                                                                icon.iconfont
                                                                            }
                                                                        >
                                                                            &#xe6ca;
                                                                        </i>
                                                                        {trans(
                                                                            'student.noOpen',
                                                                            '未开通'
                                                                        )}
                                                                    </em>
                                                                )}
                                                                {/* 家长 */}
                                                                {utilInfo?.enabledAccount &&
                                                                    schoolId != 1 && (
                                                                        <Popconfirm
                                                                            placement="top"
                                                                            icon={null}
                                                                            title={
                                                                                <>
                                                                                    <span>
                                                                                        重置后密码选项
                                                                                    </span>

                                                                                    <Radio.Group
                                                                                        style={{
                                                                                            display:
                                                                                                'flex',
                                                                                            flexDirection:
                                                                                                'column',
                                                                                        }}
                                                                                        direction="vertical"
                                                                                        defaultValue={
                                                                                            resetparMethod
                                                                                        }
                                                                                        onChange={(
                                                                                            event
                                                                                        ) =>
                                                                                            setparResetMethod(
                                                                                                event
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <Radio
                                                                                            style={{
                                                                                                margin: '6px 0px',
                                                                                            }}
                                                                                            value="12345678"
                                                                                        >
                                                                                            12345678
                                                                                        </Radio>

                                                                                        {utilInfo.certNo && (
                                                                                            <Radio
                                                                                                style={{
                                                                                                    margin: '6px 0px',
                                                                                                }}
                                                                                                value={utilInfo.certNo.slice(
                                                                                                    -6
                                                                                                )}
                                                                                            >
                                                                                                {`${utilInfo.certNo.slice(
                                                                                                    -6
                                                                                                )}(身份证后6位)`}
                                                                                            </Radio>
                                                                                        )}
                                                                                        {utilInfo.mobile && (
                                                                                            <Radio
                                                                                                style={{
                                                                                                    margin: '6px 0px',
                                                                                                }}
                                                                                                value={utilInfo.mobile.slice(
                                                                                                    -6
                                                                                                )}
                                                                                            >
                                                                                                {`${utilInfo.mobile.slice(
                                                                                                    -6
                                                                                                )}(手机号后6位)`}
                                                                                            </Radio>
                                                                                        )}
                                                                                    </Radio.Group>
                                                                                </>
                                                                            }
                                                                            onConfirm={() =>
                                                                                clickParentResetPwd(
                                                                                    utilInfo,
                                                                                    resetparMethod
                                                                                )
                                                                            }
                                                                            okText={trans(
                                                                                'global.confirm',
                                                                                '确定'
                                                                            )}
                                                                            cancelText={trans(
                                                                                'global.cancel',
                                                                                '取消'
                                                                            )}
                                                                            okButtonProps={{
                                                                                shape: 'round',
                                                                                style: {
                                                                                    borderRadius:
                                                                                        '8px',
                                                                                    padding:
                                                                                        '0 15px',
                                                                                    height: '30px',
                                                                                },
                                                                            }} // 设置确定按钮样式为圆润
                                                                            cancelButtonProps={{
                                                                                shape: 'round',
                                                                                style: {
                                                                                    borderRadius:
                                                                                        '8px',
                                                                                    padding:
                                                                                        '0 15px',
                                                                                    height: '30px',
                                                                                },
                                                                            }} // 设置取消按钮样式为圆润
                                                                        >
                                                                            <em
                                                                                className={
                                                                                    styles.resetPwd
                                                                                }
                                                                            >
                                                                                {trans(
                                                                                    'student.resetPwd',
                                                                                    '重置密码'
                                                                                )}
                                                                            </em>
                                                                        </Popconfirm>
                                                                    )}
                                                            </span>
                                                        </div>
                                                        <div className={styles.infoUtil}>
                                                            <span>
                                                                {trans(
                                                                    'student.relationDingding',
                                                                    '关联钉钉'
                                                                )}
                                                                ：
                                                                {utilInfo.enableDingTalk ? (
                                                                    <em className={styles.resetPwd}>
                                                                        <i
                                                                            className={
                                                                                icon.iconfont
                                                                            }
                                                                        >
                                                                            &#xe6c7;
                                                                        </i>
                                                                        {trans(
                                                                            'student.alreadyRelation',
                                                                            '已关联'
                                                                        )}
                                                                    </em>
                                                                ) : (
                                                                    <em>
                                                                        <i
                                                                            className={
                                                                                icon.iconfont
                                                                            }
                                                                        >
                                                                            &#xe6ca;
                                                                        </i>
                                                                        {trans(
                                                                            'student.noRelation',
                                                                            '未关联'
                                                                        )}
                                                                    </em>
                                                                )}
                                                                {/* <em className={styles.resetPwd}>联系Ta</em> */}
                                                                {/* <em className={styles.resetPwd}>取消关联</em> */}
                                                            </span>
                                                            <span>
                                                                {trans(
                                                                    'student.associateWeChat',
                                                                    '关联微信'
                                                                )}
                                                                ：
                                                                {/* <em>
                                                                    {utilInfo.enableWechat == false
                                                                        ? '未绑定'
                                                                        : utilInfo.enableWechat}
                                                                </em> */}
                                                                {utilInfo.enableWechat ? (
                                                                    <em
                                                                        className={
                                                                            styles.resetWechat
                                                                        }
                                                                    >
                                                                        <i
                                                                            className={
                                                                                icon.iconfont
                                                                            }
                                                                        >
                                                                            &#xe6c7;
                                                                        </i>
                                                                        {trans(
                                                                            'student.Bound',
                                                                            '已绑定'
                                                                        )}
                                                                    </em>
                                                                ) : (
                                                                    <em>
                                                                        <i
                                                                            className={
                                                                                icon.iconfont
                                                                            }
                                                                        >
                                                                            &#xe6ca;
                                                                        </i>
                                                                        {trans(
                                                                            'student.Unbound',
                                                                            '未绑定'
                                                                        )}
                                                                    </em>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                {otherChildren &&
                                    otherChildren.length > 0 &&
                                    otherChildren.map((item, index) => {
                                        return (
                                            <div className={styles.familyInfoCard} key={index}>
                                                <div className={styles.cardContainer}>
                                                    <p
                                                        className={styles.cardHeader}
                                                        style={{ justifyContent: 'flex-start' }}
                                                    >
                                                        <span className={styles.familyMember}>
                                                            <i className={icon.iconfont}>
                                                                &#xe90e;
                                                            </i>
                                                            <span>{item.name}</span>
                                                        </span>
                                                        <span className={styles.yunguFamilyOrNot}>
                                                            {item.tag}
                                                        </span>
                                                    </p>
                                                    <div className={styles.infoUtil}>
                                                        <span>
                                                            {trans('student.name', '姓名')}：
                                                            <em>{item.name}</em>
                                                        </span>
                                                        <span>
                                                            {trans('student.className', '班级')}：
                                                            <em>{item.groupName}</em>
                                                        </span>
                                                    </div>
                                                    <div className={styles.infoUtil}>
                                                        <span>
                                                            {trans('student.studentNo', '学号')}：
                                                            <em>{item.studentNo}</em>
                                                        </span>
                                                        <span>
                                                            {trans('student.sex', '性别')}：
                                                            <em>{item.sex}</em>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className={styles.personalInformationCard}>
                                <p className={styles.infoTitle}>
                                    {trans('student.studentStatusRecord', '学籍变更记录')}
                                </p>
                                <div className={styles.recordAll}>
                                    <Timeline>
                                        {ssRecord &&
                                            ssRecord.length > 0 &&
                                            ssRecord.map((el, i) => (
                                                <Timeline.Item key={i} color="#3B6FF5">
                                                    <div className={styles.title}>
                                                        <span className={styles.time}>
                                                            {el.createTime}
                                                        </span>
                                                        <span>{titleType(el.type)}</span>
                                                    </div>
                                                    {el.nodeFullName &&
                                                        (el.type == 4 ||
                                                            el.type == 6 ||
                                                            el.type == -1) && (
                                                            <div className={styles.item}>
                                                                <span className={styles.sT}>
                                                                    {el.type == 4
                                                                        ? trans(
                                                                              'student.joinClass',
                                                                              '加入行政班'
                                                                          )
                                                                        : el.type == -1
                                                                        ? trans(
                                                                              'student.leaveClassName',
                                                                              '离开行政班名称'
                                                                          )
                                                                        : trans(
                                                                              'student.promotedIntoClass',
                                                                              '升入行政班'
                                                                          )}
                                                                </span>
                                                                <span className={styles.sB}>
                                                                    {el.nodeFullName}
                                                                </span>
                                                            </div>
                                                        )}
                                                    {el.startTime && el.endTime && (
                                                        <div className={styles.item}>
                                                            <span className={styles.sT}>
                                                                {trans(
                                                                    'student.suspension',
                                                                    '休学'
                                                                )}
                                                                {trans(
                                                                    'student.start-end-time',
                                                                    '起止时间'
                                                                )}
                                                            </span>
                                                            <span className={styles.sB}>
                                                                {`${el.startTime} - ${el.endTime}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {el.transfer && (el.type == 5 || el.type == 2) && (
                                                        <div className={styles.item}>
                                                            <span className={styles.sT}>
                                                                {el.type == 2
                                                                    ? trans(
                                                                          'student.enterNewSchool',
                                                                          '转入学校'
                                                                      )
                                                                    : trans(
                                                                          'student.graduationDest',
                                                                          '毕业去向'
                                                                      )}
                                                            </span>
                                                            <span className={styles.sB}>
                                                                {el.transfer}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {el.fileInfoList && el.fileInfoList.length > 0 && (
                                                        <div
                                                            className={`${styles.item} ${styles.itemFile}`}
                                                        >
                                                            <span className={styles.sT}>
                                                                {trans(
                                                                    'student.annexTitle',
                                                                    '附件'
                                                                )}
                                                            </span>
                                                            <span className={styles.sB}>
                                                                {el.fileInfoList.map((elt, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className={styles.file}
                                                                    >
                                                                        <Icon
                                                                            type={`file-${fileNameType(
                                                                                elt.fileName
                                                                            )}`}
                                                                            className={styles.icon}
                                                                        />
                                                                        <span title={elt.fileName}>
                                                                            {strLen(elt.fileName)}
                                                                        </span>
                                                                        <a
                                                                            onClick={() =>
                                                                                innPreviewFile(elt)
                                                                            }
                                                                            className={
                                                                                styles.preview
                                                                            }
                                                                        >
                                                                            {trans(
                                                                                'student.preview',
                                                                                '预览'
                                                                            )}
                                                                        </a>
                                                                        <a
                                                                            onClick={() =>
                                                                                innDownloadFile(elt)
                                                                            }
                                                                            className={
                                                                                styles.download
                                                                            }
                                                                        >
                                                                            {trans(
                                                                                'student.download',
                                                                                '下载'
                                                                            )}
                                                                        </a>
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {el.remark && (
                                                        <div className={styles.item}>
                                                            <span className={styles.sT}>
                                                                {trans('student.remarks', '备注')}
                                                            </span>
                                                            <span className={styles.sB}>
                                                                {el.remark}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Timeline.Item>
                                            ))}
                                    </Timeline>
                                </div>
                            </div>
                        </Form>
                        <div className={styles.operationList}>
                            <span className={styles.tipsInfo}>
                                {trans(
                                    'student.homepageTips',
                                    '附件资料、入学档案等信息请前往学生主页档案馆'
                                )}
                            </span>
                            <a
                                className={styles.gotoHomepage}
                                href={goToHomepage()}
                                target="_blank"
                            >
                                {trans('student.goToHomepage', '前往学生主页')}
                                <i className={icon.iconfont}>&#xe731;</i>
                            </a>
                        </div>
                    </Spin>
                )}
            </Drawer>
            <PreviewFile
                visible={previewFileVisible}
                images={previewFileList}
                close={() => {
                    setPreviewFileVisible(false);
                    setPreviewFileList([]);
                }}
            />
        </div>
    );
}

function mapStateToProps(state) {
    return {
        studentDetailInfo: state.student.studentDetailInfo,
        nationInfoData: state.student.nationInfoData,
        countryInfoData: state.student.countryInfoData,
        allGradeInfoData: state.student.allGradeInfoData,
        studentStatusRecord: state.student.studentStatusRecord,
        previewFile: state.student.previewFile,
        downloadFile: state.student.downloadFile,
        // provinceList: state.student.provinceList,
        streetList: state.student.streetList,
        streetBornList: state.student.streetBornList,
        streetAddressList: state.student.streetAddressList,
        streetContactList: state.student.streetContactList,
    };
}
export default connect(mapStateToProps)(Form.create()(LookStudentDetail));
