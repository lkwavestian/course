//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import {
    Icon,
    Popconfirm,
    InputNumber,
    Form,
    Input,
    Select,
    Radio,
    Button,
    message,
    Checkbox,
    DatePicker,
    Upload,
    Table,
    Pagination,
    Modal,
} from 'antd';
import { trans } from '../../utils/i18n';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import icon from '../../icon.less';
import moment, { locale } from 'moment';
import FreeSelect from './freeSelect.js';
import AddPro from './addPro.js';
import Preview from './preview.js';
import { numMulti, loginRedirect } from '../../utils/utils';

const dateFormat = 'YYYY-MM-DD';

const { Option } = Select;
const { TextArea } = Input;
const previewContent = {};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

@connect((state) => ({
    student: state.pay.student, // 查询学生
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    chargeList: state.pay.chargeList, // 查询收费项目
    downMsg: state.pay.downMsg,
    updatePayTuitionPlanMsg: state.pay.updatePayTuitionPlanMsg,
    newNoticeMsg: state.pay.newNoticeMsg,
}))
@Form.create()
export default class NewNoticePro extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true, // 日期禁填状态
            timeValue: '', // 时间选择value
            searchValue: '', // 学生模糊查询
            gradeValue: null, // 学生组件选择年级
            groupValue: null, // 学生组件选择班级
            isPro: false, // 添加项目组件显隐
            searchChargeValue: '', // 查询项目关键字
            actionCharge: [], // 保存选中项目
            importTypeValue: 1, // 导入方式value
            page: 1,
            pageSize: 10,
            total: 0,
            checkedStudentList: [], // 手动上传：保存选择发送的学生
            uploadErrorList: [], // 批量上传：保存返回的上传失败的收费项目
            uploadSuccessList: [], // 批量上传：保存返回的上传成功的收费项目
            uploadModalVisible: false, // 批量上传：返回数据modal显隐
            isShowList: true, // 批量上传：上传错误的list的显隐
            submitStatus: null, // 提交或保存状态
            previewVisible: false, // 预览显隐
            stageValue: [], // 通知学段
            campusValue: '', // 通知校区
            campusId: '',
            zhName: '', // 中文标题
            enName: '', // 英文标题
            description: '', // 中文描述
            enDescription: '', // 英文描述
            endTimeValue: 1, // 截至日期
            chargeMsg: '', // 收费信息
            id: '', // 计划id
            studentList: undefined, //学生组件：学生list
            gradeList: undefined, //学生组件：年级list
            groupList: undefined, //学生组件：班级list
            chargeList: [], // 收费项目数据存储
            isUpdateMain: '', // 判断学生组件的mainList是否需要更新
            isSubmit: false, // 防止按钮多次点击，重复提交
            campusDefaultValue: '', // 校区默认值
            planType: '', //计划类型
            isShow: true,
        };
    }

    componentDidMount() {
        const updatePlanList = { ...this.props.updatePlanList };
        // 编辑状态且有返回值
        if (Object.keys(updatePlanList).length && this.props.isEdit) {
            updatePlanList.payChargeItemIds =
                updatePlanList.payChargeItemIds &&
                updatePlanList.payChargeItemIds.map((item) => {
                    return JSON.stringify(item);
                });
            this.getEditPreview(updatePlanList); // 编辑查看预览
            if (updatePlanList.chooseCoursePlanId) {
                this.setState({
                    isShow: false,
                });
            }
            this.setState(
                {
                    timeValue: updatePlanList.deadline,
                    isOpen: updatePlanList.deadline ? false : true,
                    importTypeValue: updatePlanList.importStatus,
                    actionCharge: updatePlanList.payChargeItemIds,
                    uploadSuccessList: updatePlanList.chargeItemImportPojo,
                    campusId: updatePlanList.campusId,
                    campusValue: JSON.stringify({
                        orgId: updatePlanList && updatePlanList.campusId,
                        orgName: updatePlanList && updatePlanList.campusName,
                    }),
                    stageValue: this.isNull(updatePlanList.section) ? updatePlanList.section : [],
                    zhName: updatePlanList.zhName,
                    enName: updatePlanList.enName,
                    description: updatePlanList.zhDescription,
                    enDescription: updatePlanList.enDescription,
                    endTimeValue: updatePlanList.deadline ? 2 : 1,
                    checkedStudentList: updatePlanList.userIds,
                    id: updatePlanList.id,
                    planType: updatePlanList.planType,
                },
                () => {
                    if (this.state.importTypeValue == 1) {
                        this.getStudentData();
                    }
                }
            );
        } else {
            // 新建操作，预览previewContent各字段清空
            previewContent.deadline = '';
            previewContent.orderNo = '';
            previewContent.payChargeItemDetailModelList = [];
            previewContent.amount = '';
            previewContent.zhDescription = '';
            previewContent.enDescription = '';
            previewContent.zhName = '';
            previewContent.enName = '';
            previewContent.userName = '';
            this.setState({
                actionCharge: [],
                uploadSuccessList: [],
            });
        }
        document.querySelector('body').addEventListener('click', (e) => {
            if (!this.state.isPro) {
                return;
            }
            // 点击元素为该组件内的，不执行
            if (this.payChargeBox && this.payChargeBox.contains(e.target)) {
                return;
            }
            this.addPro();
        });
        this.getCampusAndStage();
        this.getChargeList(updatePlanList.payChargeItemIds);
    }

    //判断空值
    isNull = (value) => {
        let arr = true;
        value &&
            value.length > 0 &&
            value.map((item) => {
                if (!item) {
                    arr = false;
                }
            });
        return arr;
    };

    // 编辑预览处理
    getEditPreview = (content) => {
        const { student } = this.props;
        previewContent.deadline = content.deadline;
        previewContent.orderNo = content.orderNo;
        previewContent.payChargeItemDetailModelList = [];
        previewContent.amount = content.amount;
        previewContent.zhDescription = content.zhDescription;
        previewContent.enDescription = content.enDescription;
        previewContent.zhName = content.zhName;
        previewContent.enName = content.enName;
        if (content.payChargeItemIds && content.payChargeItemIds.length) {
            content.payChargeItemIds.map((item) => {
                item = JSON.parse(item);
                previewContent.payChargeItemDetailModelList.push({
                    payChargeItemName: item.name,
                    ename: item.ename,
                    price: item.price,
                    quantity: item.quantity,
                });
            });
            student &&
                student.studentList &&
                student.studentList.map((item) => {
                    content.section.map((e) => {
                        if (e == item.userId) {
                            previewContent.userName = item.name;
                            return;
                        }
                    });
                });
        } else if (content.chargeItemImportPojo && content.chargeItemImportPojo.length) {
            previewContent.userName = content.chargeItemImportPojo[0].userName;
            content.chargeItemImportPojo.map((item) => {
                previewContent.payChargeItemDetailModelList.push({
                    payChargeItemName: item.payChargeItemName,
                    ename: item.ename,
                    price: item.price,
                    quantity: item.quantity,
                });
            });
        }
    };

    // 获取校区学段
    getCampusAndStage = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/selectTeachingOrgStage',
        }).then(() => {
            const { campusAndStage, isEdit } = this.props;
            if (!isEdit) {
                // 非编辑状态下，选中手动导入，若item存在selected,校区默认勾选
                campusAndStage.campus &&
                    campusAndStage.campus.map((item, index) => {
                        if (item.selected) {
                            this.setState({
                                campusValue: JSON.stringify({
                                    orgId: item.id,
                                    orgName: item.orgName,
                                }),
                                campusId: item.id,
                            });
                            return;
                        }
                    });
            }
        });
    };

    // 查询收费项目
    getChargeList = (data) => {
        const { dispatch } = this.props;
        const { searchChargeValue } = this.state;
        dispatch({
            type: 'pay/getChargeItem',
            payload: {
                matchName: searchChargeValue,
            },
        }).then(() => {
            const list = this.props.chargeList.map((e) => {
                e.payChargeItemMapperModelList.map((item) => {
                    if (data && data.length) {
                        let len = data.length;
                        for (let i = 0; i < len; i++) {
                            let parseItem =
                                typeof data[i] == 'string' ? JSON.parse(data[i]) : data[i];
                            if (item.chargeItemNo === parseItem.chargeItemNo) {
                                item.quantity = parseItem.quantity;
                            }
                        }
                    } else {
                        item.quantity = 1;
                    }
                    return item;
                });
                return e;
            });
            this.setState({
                chargeList: list,
            });
        });
    };

    // 获取关键字搜索的value
    getSearchValue = (value, cb) => {
        this.setState(
            {
                searchValue: value,
            },
            () => {
                this.getStudentData(2, cb);
            }
        );
    };

    // 获取关键字搜索的收费项目
    getChargeSearchValue = (value) => {
        this.setState(
            {
                searchChargeValue: value,
            },
            () => {
                this.getChargeList();
            }
        );
    };

    // 获取年级
    getGradeValue = (value) => {
        this.setState(
            {
                gradeValue: value,
            },
            () => {
                this.getStudentData(1);
            }
        );
    };

    // 获取班级
    getGroupValue = (value, cb) => {
        value = JSON.parse(value);
        this.setState(
            {
                groupValue: value && value.groupId,
                gradeValue: value && value.grade,
            },
            () => {
                this.getStudentData(2, cb);
            }
        );
    };

    // 获取学生组件数据
    getStudentData = (type, cb) => {
        const { dispatch } = this.props;
        const { searchValue, gradeValue, groupValue, campusId, stageValue } = this.state;
        dispatch({
            type: 'pay/selectStudentGroup',
            payload: {
                campusId: campusId, // 校区
                stages: stageValue, // 学段
                gradeId: gradeValue, // 年级
                groupId: groupValue, // 班级
                matchName: searchValue, // 学生姓名
            },
        }).then(() => {
            const { student } = this.props;
            if (type == 1) {
                // type=1根据年级查询,班级列表更新，学生更新；
                this.setState({
                    studentList: student && student.studentList,
                    groupList: student && student.groupList,
                    isUpdateMain: type,
                });
            } else if (type == 2) {
                // type=2班级列表不变，学生更新
                this.setState({
                    studentList: student && student.studentList,
                    isUpdateMain: type,
                });
            } else {
                // type=3校区学段查询，年级、班级、学生更新
                this.setState({
                    studentList: student && student.studentList,
                    gradeList: student && student.gradeList,
                    groupList: student && student.groupList,
                    isUpdateMain: type,
                });
            }
            cb && cb(student);
        });
    };

    submitForm = (values) => {
        const { dispatch } = this.props;
        const {
            checkedStudentList,
            zhName,
            enName,
            campusValue,
            description,
            enDescription,
            endTimeValue,
            stageValue,
            importTypeValue,
            submitStatus,
            actionCharge,
            uploadSuccessList,
            timeValue,
            planType,
        } = this.state;
        const charge = [];
        if (importTypeValue == 1) {
            if (actionCharge.length <= 0) {
                message.info(trans('charge.addChargeProject', '新建收费项目'));
                return;
            } else {
                actionCharge.map((e) => {
                    e = JSON.parse(e);
                    if (!e.quantity) {
                        e.quantity = 1;
                    }
                    charge.push(e);
                });
            }
        } else {
            if (uploadSuccessList.length <= 0) {
                message.info('请导入信息');
                return;
            }
        }
        this.setState(
            {
                isSubmit: true,
            },
            () => {
                const campus = campusValue ? JSON.parse(campusValue) : {};
                dispatch({
                    type: 'pay/addPayTuitionPlan',
                    payload: {
                        amount: null,
                        campusId: campus.orgId, // 通知校区id
                        campusName: campus.orgName, // 通知校区名称
                        chargeItemImportPojo: uploadSuccessList, // 批量导入
                        createrId: null,
                        createrIdentity: null,
                        deadline: endTimeValue === 2 ? timeValue : '', // 截至日期
                        deleted: 1,
                        enDescription: enDescription, // 英文费用说明
                        enName: enName, // 英文名称
                        fundAccountId: null,
                        fundAccountName: '',
                        gmtCreateTime: null,
                        gmtModifiedTime: null,
                        id: null,
                        importStatus: importTypeValue,
                        lastModifieName: '',
                        lastModifierId: null,
                        lastSenderDate: null,
                        lastSenderId: null,
                        lastSenderName: '',
                        orgId: null,
                        orgName: '',
                        payChargeItemIds: charge, // 手动导入
                        planType: planType,
                        remark: '',
                        section: stageValue,
                        sectionId: '',
                        sectionName: '',
                        semesterId: null,
                        submitStatus: submitStatus,
                        userIds: importTypeValue === 1 ? checkedStudentList : [], // 发送给，手动导入时传
                        zhDescription: description, // 中文费用说明
                        zhName: zhName, // 中文名称
                    },
                }).then(() => {
                    const { newNoticeMsg, addEdit } = this.props;
                    // debugger;
                    if (newNoticeMsg.status && newNoticeMsg.code == 1001) {
                        message.success(newNoticeMsg.message);
                        this.setState({
                            isSubmit: false,
                        });
                        // submitStatus==1保存；submitStatus=2保存并发送
                        if (addEdit) {
                            console.log('1', 1);
                            this.props.closeEdit(1);
                        } else if (submitStatus === 2) {
                            console.log('2', 2);
                            this.props.closeEdit(1); // 1：保存发送，弹窗关闭
                        } else if (submitStatus === 1) {
                            console.log('3', 3);
                            this.props.closeEdit(2, newNoticeMsg.content, true); // 2:保存显示详情
                        }
                    } else if (!newNoticeMsg.status) {
                        message.info(newNoticeMsg.message);
                        this.setState({
                            isSubmit: false,
                        });
                        this.props.closeEdit(3);
                    }
                });
            }
        );
    };

    // 编辑提交
    updateForm = (values) => {
        const { dispatch } = this.props;
        const params = { ...this.props.updatePlanList };
        const {
            id,
            checkedStudentList,
            zhName,
            enName,
            campusValue,
            description,
            enDescription,
            endTimeValue,
            stageValue,
            importTypeValue,
            submitStatus,
            actionCharge,
            uploadSuccessList,
            timeValue,
            isShow
        } = this.state;
        const charge = [];
        if(isShow){
            if (importTypeValue == 1) {
            if (actionCharge.length <= 0) {
                message.info(trans('charge.addChargeProject', '新建收费项目'));
                return;
            } else {
                actionCharge.map((e) => {
                    e = JSON.parse(e);
                    if (!e.quantity) {
                        e.quantity = 1;
                    }
                    charge.push(e);
                });
            }
        } else {
            if (uploadSuccessList.length <= 0) {
                message.info('请导入信息');
                return;
            }
        }
        }
        

        this.setState(
            {
                isSubmit: true,
            },
            () => {
                console.log('params', params)
                if(isShow){
                    const campus = campusValue ? JSON.parse(campusValue) : {};
                    params.zhName = zhName; // 中文名称
                    params.enName = enName;
                    params.zhDescription = description;
                    params.enDescription = enDescription;
                    params.deadline = endTimeValue === 2 ? timeValue : '';
                    params.id = id;
                    params.submitStatus = submitStatus;

                    params.campusId = campus.orgId || '';
                    params.campusName = campus.orgName || '';
                    params.chargeItemImportPojo = uploadSuccessList;
                    params.importStatus = importTypeValue;
                    params.payChargeItemIds = charge;
                    params.section = stageValue;
                    params.userIds = importTypeValue === 1 ? checkedStudentList : []; // 发送给，手动导入时传
                }else{
                    params.zhName = zhName; // 中文名称
                    params.enName = enName;
                    params.zhDescription = description;
                    params.enDescription = enDescription;
                    params.deadline = endTimeValue === 2 ? timeValue : '';
                    params.id = id;
                    params.submitStatus = submitStatus;
                    
                    params.campusId && delete params.campusId;
                    params.campusName && delete params.campusName;
                    params.chargeItemImportPojo && delete params.chargeItemImportPojo;
                    params.importStatus && delete params.importStatus;
                    params.payChargeItemIds && delete params.payChargeItemIds;
                    params.section && delete params.section;
                    params.userIds && delete params.userIds;
                }
                
                dispatch({
                    type: 'pay/updatePayTuitionPlan',
                    payload: params,
                }).then(() => {
                    const { updatePayTuitionPlanMsg } = this.props;
                    if (updatePayTuitionPlanMsg.status) {
                        if (updatePayTuitionPlanMsg.code == 1001) {
                            message.success(updatePayTuitionPlanMsg.message);
                            let iframeUrlMan =
                                window.location.origin.indexOf('yungu.org') > -1
                                    ? 'https://smart-scheduling.yungu.org/#/charge/index'
                                    : 'https://smart-scheduling.daily.yungu-inc.org/#/charge/index';
                            // window.open(iframeUrlMan, '_self');
                            this.setState({
                                isSubmit: false,
                            });

                            if (submitStatus === 2) {
                                // 发送通知
                                this.props.closeEdit(1, updatePayTuitionPlanMsg.content); // 1：弹窗关闭，将更新后的计划id传入父组件
                            } else if (submitStatus === 1) {
                                // 保存通知
                                this.setState(
                                    {
                                        id: updatePayTuitionPlanMsg.content,
                                    },
                                    () => {
                                        this.props.closeEdit(2, updatePayTuitionPlanMsg.content); // 2:弹窗关闭 ，将更新后的计划id传入父组件,显示详情
                                    }
                                );
                            }
                        }
                    } else if (!updatePayTuitionPlanMsg.status) {
                        message.info(updatePayTuitionPlanMsg.message);
                        this.setState({
                            isSubmit: false,
                        });
                        this.props.closeEdit(3);
                    }
                });
            }
        );
    };

    handleSubmit = (isEdit, e) => {
        const { addEdit } = this.props;
        const {
            checkedStudentList,
            zhName,
            enName,
            campusValue,
            description,
            enDescription,
            endTimeValue,
            stageValue,
            importTypeValue,
            submitStatus,
            actionCharge,
            uploadSuccessList,
            timeValue,
            isShow,
        } = this.state;

        if(isShow){
            if (
                !zhName ||
                !enName ||
                !description ||
                !enDescription ||
                !endTimeValue ||
                !importTypeValue
            ) {
                this.warning();
                return;
            }

            if (
                importTypeValue == 1 &&
                (!(checkedStudentList && checkedStudentList.length) ||
                    !(actionCharge && actionCharge.length) ||
                    !campusValue ||
                    !(stageValue && stageValue.length))
            ) {
                this.warning();
                return;
            } else if (importTypeValue == 2 && !(uploadSuccessList && uploadSuccessList.length)) {
                this.warning();
                return;
            } else if (endTimeValue == 2 && !timeValue) {
                this.warning();
                return;
            }
        }else{
            if (
                !zhName ||
                !enName ||
                !description ||
                !enDescription ||
                !endTimeValue
            ) {
                this.warning();
                return;
            }
        }
        
        this.setState(
            {
                submitStatus: e,
            },
            () => {
                if (isEdit && addEdit) {
                    this.submitForm();
                } else if (isEdit) {
                    this.updateForm();
                } else {
                    this.submitForm();
                }
            }
        );
    };

    warning = () => {
        Modal.warning({
            title: trans('charge.requiredHint', '请把信息填写完整！'),
            okText: trans('charge.confirm', '确认'),
        });
    };

    // 截至日期处理
    getEndTime = (date, dateString) => {
        previewContent.deadline = dateString ? dateString + ' 23:59:59' : null;
        this.setState({
            timeValue: dateString ? dateString + ' 23:59:59' : null,
        });
    };

    // 选择截至日期
    endTimeRadioChange = (e) => {
        this.setState(
            {
                endTimeValue: e.target.value,
            },
            () => {
                if (this.state.endTimeValue === 2) {
                    previewContent.deadline = '';
                    this.setState({
                        isOpen: false,
                    });
                } else {
                    this.setState({
                        isOpen: true,
                        timeValue: null,
                    });
                }
            }
        );
    };

    // 点击添加项目
    addPro = () => {
        this.setState(
            {
                isPro: !this.state.isPro,
            },
            () => {
                if (this.state.isPro) {
                    this.payChargeBox.scrollIntoView();
                }
            }
        );
    };

    // 手动导入，获取选择的收费项目
    getActionChargeList = (list) => {
        previewContent.payChargeItemDetailModelList = list.map((item) => {
            return JSON.parse(item);
        });
        this.setState({
            actionCharge: list,
        });
    };

    // 收费项目个数变化
    onNumberChange = (item, value) => {
        let changeNumItem = null;

        // 遍历已选中的收费项目
        const actionCharge = this.state.actionCharge.map((e) => {
            e = JSON.parse(e);
            // 若chargeItemNo相等，将value赋值quantity
            if (item.chargeItemNo == e.chargeItemNo) {
                changeNumItem = e;
                e.quantity = value || 1;
            }
            e = JSON.stringify(e);
            return e;
        });
        let { chargeList } = this.state,
            len = chargeList.length;
        for (let i = 0; i < len; i++) {
            let innerArr = chargeList[i].payChargeItemMapperModelList,
                innerLen = innerArr.length,
                isOk = false;
            if (isOk) {
                break;
            }
            for (let u = 0; u < innerLen; u++) {
                if (changeNumItem.chargeItemNo === innerArr[u].chargeItemNo) {
                    innerArr[u].quantity = changeNumItem.quantity;

                    isOk = true;
                    break;
                }
            }
        }
        previewContent.payChargeItemDetailModelList = actionCharge.map((item) => {
            return JSON.parse(item);
        });
        this.setState({
            actionCharge,
            chargeList,
            number: value,
        });
    };

    // 删除选中的某个收费项目
    handleDeleteCharge = (item) => {
        const list = this.state.actionCharge.filter((e) => {
            e = JSON.parse(e);
            return e.chargeItemNo != item.chargeItemNo;
        });

        previewContent.payChargeItemDetailModelList = list.map((item) => {
            return JSON.parse(item);
        });

        this.setState({
            actionCharge: list,
        });
    };

    // 选择年级
    getCampus = (e) => {
        const obj = JSON.parse(e.target.value);
        this.setState(
            {
                campusValue: e.target.value,
                campusId: obj.orgId,
            },
            () => {
                if (this.state.stageValue.length) {
                    this.getStudentData(3);
                }
            }
        );
    };

    // 选择学段
    getStage = (e) => {
        this.setState(
            {
                stageValue: e,
            },
            () => {
                if (!e || !(e && e.length)) {
                    // this.setState({
                    //     importTypeValue: 0
                    // })
                    return;
                }
                if (this.state.campusValue) {
                    this.getStudentData(3);
                }
            }
        );
    };

    // 选择导入方式
    importType = (e) => {
        if (e.target.value == 1) {
            // 手动导入
            this.setState(
                {
                    // uploadSuccessList: [],
                    importTypeValue: e.target.value,
                },
                () => {
                    const { campusAndStage, isEdit } = this.props;
                    // if (!isEdit) { // 非编辑状态下，选中手动导入，若item存在selected,校区默认勾选
                    campusAndStage.campus &&
                        campusAndStage.campus.map((item, index) => {
                            if (item.selected) {
                                this.setState(
                                    {
                                        campusValue: JSON.stringify({
                                            orgId: item.id,
                                            orgName: item.orgName,
                                        }),
                                        campusId: item.id,
                                    },
                                    () => {
                                        this.getStudentData();
                                    }
                                );
                                return;
                            }
                        });
                    // }
                }
            );
        } else if (e.target.value == 2) {
            this.setState({
                // actionCharge: [],
                importTypeValue: e.target.value,
                // campusValue: '',
                // stageValue: [],
            });
        }
    };

    // 切换页面
    changePage = (page, pageSize) => {
        this.setState({
            page,
        });
    };

    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            page: 1,
            pageSize,
        });
    };

    uploadFile = (e, { file, fileList }) => {
        if (file.response && !file.response.ifLogin) {
            loginRedirect();
            return;
        }
        let bol = false;
        if (e == 1) {
            bol = true;
        } else {
            bol = false;
        }
        if (file.status == 'done') {
            const uploadResponse = file && file.response && file.response.content;
            previewContent.payChargeItemDetailModelList =
                uploadResponse && uploadResponse.previewUser;
            previewContent.userName =
                uploadResponse &&
                uploadResponse.chargeItemInfo &&
                uploadResponse.chargeItemInfo[0] &&
                uploadResponse.chargeItemInfo[0].userName;
            this.setState({
                uploadErrorList: uploadResponse && uploadResponse.errorMessages,
                uploadSuccessList: uploadResponse && uploadResponse.chargeItemInfo,
                uploadModalVisible: true,
            });
        }
    };

    //上传文件后点击确认弹窗关闭
    hideUploadModal = () => {
        this.setState({
            uploadModalVisible: false,
        });
    };

    // 删除表格某项，二次确认删除
    popoverOk = (record) => {
        const list = [...this.state.uploadSuccessList];
        this.state.uploadSuccessList.map((item) => {
            if (item.userId == record.id && item.chargeItemNo == record.chargeItemNo) {
                list.remove(item);
            }
        });
        this.setState({
            uploadSuccessList: list,
        });
        previewContent.payChargeItemDetailModelList = this.state.uploadSuccessList;
    };

    showErrorList = () => {
        this.setState({
            isShowList: !this.state.isShowList,
        });
    };

    // 选择发送人员校验事件
    checkSelectStudent = (rules, value, callback) => {
        if (value.checkedStudentList.length > 0) {
            return callback();
        }
        callback(trans('charge.searchAssociation', '搜索选择关联学生'));
    };

    // 下载模板
    handleDownload = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/template',
        });
    };

    // 预览
    showPreview = () => {
        this.setState({
            previewVisible: true,
        });
    };

    // 关闭预览
    handlePreviewCancel = () => {
        this.setState({
            previewVisible: false,
        });
    };

    // 通知名称改变
    zhNameChange = (e) => {
        previewContent.zhName = e.target.value;
        this.setState({
            zhName: e.target.value,
        });
    };

    enNameChange = (e) => {
        let reg = new RegExp(/^[^\u4e00-\u9fa5]{0,}$/);
        let value = e.target.value;
        if (!reg.test(value)) {
            message.error(trans('charge.enterEnName', '请输入英文名称'));
            return;
        }
        previewContent.enName = value;
        this.setState({
            enName: value,
        });
    };

    // 费用说明改变
    noteChange = (e) => {
        var reg = new RegExp('\r\n', 'g');

        previewContent.zhDescription = e.target.value.replace(reg, '<br/>');
        this.setState({
            description: e.target.value,
        });
    };

    enNoteChange = (e) => {
        previewContent.enDescription = e.target.value;
        this.setState({
            enDescription: e.target.value,
        });
    };

    selectStudentChange = (value) => {
        const { student } = this.props;
        if (value.checkedStudentList.length) {
            student &&
                student.studentList &&
                student.studentList.map((item) => {
                    value.checkedStudentList.map((e) => {
                        if (e == item.userId) {
                            previewContent.userName = item.name;
                            return;
                        }
                    });
                });
        } else {
            previewContent.userName = '';
        }
    };

    // 子组件传入已选中的学生
    exportUserList = (list) => {
        const { student } = this.props;
        student &&
            student.studentList &&
            student.studentList.map((item) => {
                list.map((e) => {
                    if (e == item.userId) {
                        previewContent.userName = item.name;
                        return;
                    }
                });
            });
        this.setState({
            checkedStudentList: list,
        });
    };

    disabledDate = (current) => {
        return current && current < moment(new Date()).subtract(1, 'days');
    };

    render() {
        const {
            chargeList,
            studentList,
            gradeList,
            groupList,
            stageValue,
            campusValue,
            zhName,
            enName,
            description,
            previewVisible,
            enDescription,
            endTimeValue,
            chargeMsg,
            isShowList,
            uploadModalVisible,
            uploadSuccessList,
            uploadErrorList,
            checkedStudentList,
            page,
            pageSize,
            total,
            isOpen,
            timeValue,
            isPro,
            actionCharge,
            number,
            importTypeValue,
            isUpdateMain,
            isSubmit,
            submitStatus,
            searchChargeValue,
            isShow,
        } = this.state;
        const { isEdit, student, campusAndStage } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        const formItemLayoutAddPro = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 },
        };

        const formItemLayoutCpt = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 24,
                    // offset: 8,
                },
            },
        };

        const uploadProps = {
            name: 'file',
            action: '/api/pay/importChargeItem',
            // method:'post'
        };

        const content = <div>{trans('charge.isDeleteRecord', '确认删除该条记录吗？')}</div>;

        const columns = [
            {
                title: trans('student.studentNo', '学号'),
                dataIndex: 'studentNo',
                key: 'studentNo',
                width: 80,
                render: (text, record) => <span>{record.studentNo}</span>,
            },
            {
                title: trans('student.name', '姓名'),
                dataIndex: 'name',
                key: 'name',
                width: 100,
                render: (text) => <span>{text}</span>,
            },
            {
                title: trans('student.adminstrativeClass', '行政班'),
                dataIndex: 'group',
                key: 'group',
                width: 100,
                render: (text) => <span>{text}</span>,
            },
            {
                title: trans('charge.items', '收费项目'),
                dataIndex: 'charge',
                key: 'charge',
                width: 200,
                render: (text, record) => {
                    return (
                        <span>
                            {record.charge}
                            {record.tags == 1 ? (
                                <span className={styles.tags}>
                                    {trans('charge.escrowFee', '代管费')}
                                </span>
                            ) : null}
                        </span>
                    );
                },
            },
            {
                title: trans('charge.money', '金额'),
                dataIndex: 'price',
                key: 'price',
                render: (text, record) => {
                    return (
                        <span>
                            {record.price} x{record.quantity || 1} = {record.amount}
                        </span>
                    );
                },
            },
            {
                title: trans('charge.operate', '操作'),
                key: 'action',
                width: 60,
                render: (text, record) => (
                    <span className={styles.delCharge}>
                        <Popconfirm
                            placement="top"
                            title={content}
                            onConfirm={this.popoverOk.bind(this, record)}
                            okText={trans('charge.isdelete', '确认删除')}
                            cancelText={trans('charge.cancel', '取消')}
                            icon={null}
                            style={{ zIndex: 1999 }}
                        >
                            <a>{trans('charge.delete', '删除')}</a>
                        </Popconfirm>
                    </span>
                ),
            },
        ];

        const data = [];
        if (uploadSuccessList && uploadSuccessList.length) {
            for (let i = 0; i < uploadSuccessList.length; i++) {
                data.push({
                    key: i,
                    studentNo: uploadSuccessList[i].studentNo,
                    id: uploadSuccessList[i].userId, // 与后端确定id的字段
                    name: uploadSuccessList[i].userName,
                    group: uploadSuccessList[i].studentGroupName,
                    charge: uploadSuccessList[i].payChargeItemName,
                    price: uploadSuccessList[i].price,
                    quantity: uploadSuccessList[i].quantity,
                    amount: uploadSuccessList[i].amount,
                    tags: uploadSuccessList[i].tags,
                    chargeItemNo: uploadSuccessList[i].chargeItemNo,
                    sectionName: uploadSuccessList[i].sectionName,
                });
            }
        }
        const isArray = (value) => {
            if (value == 1) {
                return true;
            } else {
                return false;
            }
        };
        return (
            <div className={styles.newNoticePro}>
                <p className={styles.newTitle}>
                    {isEdit
                        ? trans('charge.editAddNotice', '编辑缴费通知')
                        : trans('charge.new_payment_notice', '新建缴费通知')}
                </p>

                <Form {...formItemLayout} className={styles.form}>
                    <Form.Item
                        label={
                            <span>
                                <span className={styles.require}>*</span>
                                {trans('course.step1.chinese.title', '中文标题')}
                            </span>
                        }
                    >
                        <Input
                            required="required"
                            value={zhName}
                            placeholder={trans('charge.enter_chinese_title', '请输入中文标题')}
                            size="large"
                            style={{ width: '500px' }}
                            onChange={this.zhNameChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                <span className={styles.require}>*</span>
                                {trans('course.step1.english.title', '英文标题')}
                            </span>
                        }
                    >
                        <Input
                            value={enName}
                            onChange={this.enNameChange}
                            placeholder="Please enter English title"
                            size="large"
                            style={{ width: '500px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                <span className={styles.require}>*</span>
                                {trans('charge.feeDescription_chinese', '费用说明（中文）')}
                            </span>
                        }
                    >
                        <TextArea
                            value={description}
                            rows={4}
                            style={{ width: '500px' }}
                            onChange={this.noteChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                <span className={styles.require}>*</span>
                                {trans('charge.feeDescription_english', '费用说明（英文）')}
                            </span>
                        }
                    >
                        <TextArea
                            value={enDescription}
                            rows={4}
                            style={{ width: '500px' }}
                            onChange={this.enNoteChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                <span className={styles.require}>*</span>
                                {trans('charge.expirationDate', '截至日期')}
                            </span>
                        }
                    >
                        <Radio.Group
                            onChange={this.endTimeRadioChange}
                            value={endTimeValue ? endTimeValue : 1}
                        >
                            <Radio value={1}>{trans('charge.unlimited', '不限')}</Radio>
                            <Radio value={2}>
                                <DatePicker
                                    disabled={isOpen}
                                    format={dateFormat}
                                    placeholder={trans('charge.please_changeDate', '请选择日期')}
                                    size="large"
                                    onChange={this.getEndTime}
                                    value={timeValue ? moment(timeValue, dateFormat) : null}
                                    disabledDate={this.disabledDate}
                                />
                            </Radio>
                        </Radio.Group>
                    </Form.Item>

                    {isShow && (
                        <div>
                            <Form.Item
                                label={
                                    <span>
                                        <span className={styles.require}>*</span>
                                        {trans('charge.charge_information', '收费信息')}
                                    </span>
                                }
                            >
                                <Radio.Group onChange={this.importType} value={importTypeValue}>
                                    <Radio value={1}>
                                        {trans('charge.manualSelection', '手动选择')}
                                    </Radio>
                                    <Radio value={2}>
                                        {trans('student.batchImport', '批量导入')}
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            {importTypeValue == 1 ? (
                                <div>
                                    <Form.Item
                                        label={
                                            <span>
                                                <span className={styles.require}>*</span>
                                                {trans('charge.notifyCampus', '通知校区')}
                                            </span>
                                        }
                                    >
                                        <Radio.Group onChange={this.getCampus} value={campusValue}>
                                            {campusAndStage.campus &&
                                                campusAndStage.campus.length &&
                                                campusAndStage.campus.map((item, index) => {
                                                    return (
                                                        <Radio
                                                            value={JSON.stringify({
                                                                orgId: item.id,
                                                                orgName: item.orgName,
                                                            })}
                                                            key={item.id}
                                                        >
                                                            {/* {item.orgName} */}
                                                            {locale() == 'en'
                                                                ? item.orgEname
                                                                : item.orgName}
                                                        </Radio>
                                                    );
                                                })}
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                        label={
                                            <span>
                                                <span className={styles.require}>*</span>
                                                {trans('charge.notifySemester', '通知学段')}
                                            </span>
                                        }
                                    >
                                        <div ref={(ref) => (this.stageBox = ref)}>
                                            <Checkbox.Group
                                                onChange={this.getStage}
                                                onClick={() => {
                                                    this.stageBox.scrollIntoView();
                                                }}
                                                value={stageValue}
                                            >
                                                {campusAndStage.stage &&
                                                    campusAndStage.stage.length &&
                                                    campusAndStage.stage.map((item, index) => {
                                                        return (
                                                            <Checkbox
                                                                value={JSON.stringify(item.stage)}
                                                                key={item.stage}
                                                            >
                                                                {/* {item.name} */}
                                                                {locale() == 'en'
                                                                    ? item.ename
                                                                    : item.name}
                                                            </Checkbox>
                                                        );
                                                    })}
                                            </Checkbox.Group>
                                        </div>
                                    </Form.Item>
                                </div>
                            ) : null}

                            {isArray(importTypeValue) &&
                            campusValue &&
                            stageValue &&
                            stageValue.length ? (
                                <div>
                                    <Form.Item
                                        label={
                                            <span>
                                                <span className={styles.require}>*</span>
                                                {trans('charge.items', '收费项目')}
                                            </span>
                                        }
                                        {...formItemLayoutAddPro}
                                    >
                                        <div
                                            className={styles.payCarge}
                                            ref={(ref) => (this.payChargeBox = ref)}
                                        >
                                            {actionCharge && actionCharge.length ? (
                                                <span style={{ color: '#999' }}>
                                                    {trans(
                                                        'charge.changeProjectNum',
                                                        '已选择：{$length}个收费项目',
                                                        { length: actionCharge.length }
                                                    )}
                                                </span>
                                            ) : null}
                                            {actionCharge && actionCharge.length
                                                ? actionCharge.map((item, index) => {
                                                      item = JSON.parse(item);
                                                      return (
                                                          <div className={styles.card}>
                                                              <span className={styles.name}>
                                                                  {item.name}
                                                                  {item.tags == 1 ? (
                                                                      <span className={styles.tags}>
                                                                          {trans(
                                                                              'charge.escrowFee',
                                                                              '代管费'
                                                                          )}
                                                                      </span>
                                                                  ) : null}
                                                              </span>
                                                              <span className={styles.price}>
                                                                  ￥{item.price}x{' '}
                                                                  <InputNumber
                                                                      size="small"
                                                                      min={1}
                                                                      value={item.quantity || 1}
                                                                      onChange={this.onNumberChange.bind(
                                                                          this,
                                                                          item
                                                                      )}
                                                                      style={{ width: '56px' }}
                                                                  />
                                                                  ={' '}
                                                                  <span className={styles.rst}>
                                                                      {numMulti(
                                                                          item.price,
                                                                          item.quantity || 1
                                                                      )}
                                                                  </span>
                                                              </span>
                                                              <span
                                                                  className={styles.del}
                                                                  onClick={this.handleDeleteCharge.bind(
                                                                      this,
                                                                      item
                                                                  )}
                                                              >
                                                                  <i className={icon.iconfont}>
                                                                      &#xe739;
                                                                  </i>
                                                              </span>
                                                          </div>
                                                      );
                                                  })
                                                : null}

                                            <Button
                                                onClick={this.addPro}
                                                type="primary"
                                                className="default"
                                                style={{
                                                    width: '96px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    background: '#4d7fff',
                                                }}
                                            >
                                                {trans('charge.addProject1', '+添加项目')}
                                            </Button>
                                            {isPro ? (
                                                <AddPro
                                                    chargeList={chargeList}
                                                    getChargeList={this.getChargeSearchValue}
                                                    getActionChargeList={this.getActionChargeList}
                                                    actionCharge={actionCharge}
                                                    searchChargeValue={searchChargeValue}
                                                />
                                            ) : null}
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                        {...formItemLayoutCpt}
                                        label={
                                            <span>
                                                <span className={styles.require}>*</span>
                                                {trans('charge.sendTo', '发送给')}
                                            </span>
                                        }
                                    >
                                        <div ref={(ref) => (this.studentBox = ref)}>
                                            {studentList || gradeList || groupList ? (
                                                <FreeSelect
                                                    student={studentList}
                                                    grade={gradeList}
                                                    group={groupList}
                                                    getList={this.getSearchValue}
                                                    getGradeList={this.getGradeValue}
                                                    getGroupValue={this.getGroupValue}
                                                    onChange={this.selectStudentChange}
                                                    exportUserList={this.exportUserList}
                                                    checkedStudentList={checkedStudentList}
                                                    isUpdateMain={isUpdateMain}
                                                    studentBox={this.studentBox}
                                                />
                                            ) : (
                                                <span></span>
                                            )}
                                        </div>
                                    </Form.Item>
                                </div>
                            ) : importTypeValue == 2 ? (
                                <Form.Item
                                    label={
                                        <span>
                                            <span className={styles.require}>*</span>
                                            {trans('charge.importInfo', '导入信息')}
                                        </span>
                                    }
                                    extra={[
                                        <span style={{ fontSize: '12px' }}>
                                            <Icon
                                                type="exclamation-circle"
                                                theme="filled"
                                                style={{ color: '#4D7FFF' }}
                                            />
                                            {trans(
                                                'charge.uploadHint',
                                                '请下载模板并完成信息后再上传文件。重新导入时，本次信息将全部覆盖'
                                            )}
                                        </span>,
                                    ]}
                                >
                                    <div className={styles.upload}>
                                        <span style={{ display: 'inline-block' }}>
                                            <Upload
                                                {...uploadProps}
                                                onChange={this.uploadFile.bind(this, 1)}
                                                showUploadList={false}
                                            >
                                                <Button
                                                    type="default"
                                                    style={{
                                                        width: '96px',
                                                        height: '40px',
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(77,127,255,1)',
                                                        color: '#4d7fff',
                                                    }}
                                                >
                                                    {trans('global.scheduleSelectFile', '选择文件')}
                                                </Button>
                                            </Upload>
                                        </span>
                                        {/* <span>文件模板请 <a href="/download/chargeItem/template" target="_blank" onClick={this.handleDownload}>点击下载</a></span> */}
                                        <span>
                                            文件模板请{' '}
                                            <a
                                                href="/api/pay/download/chargeItem/template"
                                                target="_blank"
                                            >
                                                点击下载
                                            </a>
                                        </span>
                                        {uploadSuccessList && uploadSuccessList.length ? (
                                            <div className={styles.uploadTable}>
                                                <Table
                                                    columns={columns}
                                                    dataSource={data}
                                                    pagination={{
                                                        total: uploadSuccessList.length,
                                                        showSizeChanger: true,
                                                        showQuickJumper: true,
                                                        style: { float: 'right', margin: '20px 0' },
                                                        onChange: this.changePage,
                                                        onShowSizeChange: this.onShowSizeChange,
                                                        current: page,
                                                        pageSize: pageSize,
                                                    }}
                                                />
                                                <span className={styles.allData}>
                                                    共 {uploadSuccessList.length} 条记录{' '}
                                                </span>
                                            </div>
                                        ) : null}
                                        <Modal
                                            // visible={true}
                                            visible={uploadModalVisible}
                                            onCancel={this.hideUploadModal}
                                            footer={null}
                                            bodyStyle={{ minHeight: '240px', position: 'relative' }}
                                            zIndex={1031}
                                        >
                                            {uploadErrorList && uploadErrorList.length ? (
                                                <div className={styles.result}>
                                                    <div className={styles.all}>
                                                        <Icon
                                                            type="exclamation-circle"
                                                            style={{
                                                                color: '#E9B635',
                                                                marginRight: '8px',
                                                            }}
                                                        />
                                                        <span>
                                                            已成功导入{uploadSuccessList.length}
                                                            条记录，失败
                                                            {uploadErrorList.length}条
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={styles.drown}
                                                        onClick={this.showErrorList}
                                                    >
                                                        {trans('charge.failRecord', '失败记录明细')}{' '}
                                                        {isShowList ? (
                                                            <Icon type="down" />
                                                        ) : (
                                                            <Icon type="up" />
                                                        )}
                                                    </div>
                                                    {isShowList ? (
                                                        <div className={styles.menu}>
                                                            {uploadErrorList &&
                                                                uploadErrorList.map(
                                                                    (item, index) => {
                                                                        return (
                                                                            <p
                                                                                key={index}
                                                                                className={
                                                                                    styles.menuItem
                                                                                }
                                                                            >
                                                                                <Icon
                                                                                    type="close-circle"
                                                                                    theme="filled"
                                                                                    style={{
                                                                                        color: 'red',
                                                                                    }}
                                                                                />
                                                                                <span title={item}>
                                                                                    {item}
                                                                                </span>
                                                                            </p>
                                                                        );
                                                                    }
                                                                )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ) : (
                                                <div className={styles.success}>
                                                    <Icon
                                                        type="check-circle"
                                                        style={{
                                                            color: '#52c41a',
                                                            marginRight: '8px',
                                                        }}
                                                    />
                                                    {trans(
                                                        'charge.importRecord_length',
                                                        '已成功导入{$length}条记录，失败0条',
                                                        {
                                                            length:
                                                                uploadSuccessList &&
                                                                uploadSuccessList.length,
                                                        }
                                                    )}
                                                </div>
                                            )}

                                            <div className={styles.uploadBtnBox}>
                                                <Upload
                                                    {...uploadProps}
                                                    accept=".xls,.xlsx"
                                                    onChange={this.uploadFile.bind(this, 2)}
                                                    showUploadList={false}
                                                >
                                                    <Button
                                                        type="primary"
                                                        className={styles.reImport}
                                                    >
                                                        {trans('charge.againImport', '重新导入')}
                                                    </Button>
                                                </Upload>
                                                <Button
                                                    type="default"
                                                    onClick={this.hideUploadModal}
                                                    className={styles.confirm}
                                                >
                                                    {trans('charge.confirm', '确认')}
                                                </Button>
                                            </div>
                                        </Modal>
                                    </div>
                                </Form.Item>
                            ) : null}
                            <div className={styles.empty}></div>
                        </div>
                    )}
                </Form>
                <div className={styles.btnBox} {...tailFormItemLayout}>
                    <Button
                        onClick={this.showPreview}
                        type="default"
                        style={{
                            width: '88px',
                            height: '36px',
                            borderRadius: '8px',
                            marginRight: '4px',
                            lineHeight: '36px',
                        }}
                    >
                        {trans('student.preview', '预览')}
                    </Button>
                    <Button
                        type="primary"
                        className={styles.saveBtn}
                        disabled={submitStatus == 1 && isSubmit ? true : false}
                        onClick={this.handleSubmit.bind(this, isEdit, 1)}
                        style={{
                            width: '88px',
                            height: '36px',
                            borderRadius: '8px',
                            marginRight: '4px',
                            lineHeight: '36px',
                            background: '#3B6FF5',
                        }}
                    >
                        {trans('global.save', '保存')}
                    </Button>
                </div>

                {previewVisible ? (
                    <Preview
                        previewCancel={this.handlePreviewCancel}
                        previewContent={previewContent}
                    />
                ) : null}
            </div>
        );
    }
}
