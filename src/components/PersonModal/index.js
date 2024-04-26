//设置课程模板
import React, { PureComponent } from 'react';
import styles from './index.less';
import icon from '../../icon.less';
import { connect } from 'dva';
import { Select, Input, Icon, Checkbox, Skeleton, Spin } from 'antd';
import { trans, locale } from '../../utils/i18n';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

@connect((state) => ({
    // subjectList: state.template.subjectList, //所有科目列表
    // teachingOrgList: state.template.teachingOrgList, //所有年级列表
    // templateList: state.template.templateList, //模版信息和各个模版课程数量
    // coursesList: state.template.coursesList, //根据条件获得模版中课程与所有课程

    currentSemesterSubject: state.order.currentSemesterSubject,
    stageSubject: state.order.stageSubject,
    updateStageSubject: state.order.updateStageSubject,
    personalSubjectTemplate: state.order.personalSubjectTemplate,
}))
export default class TemplateModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mubanLoading: true,
            contentLoading: false,

            // checkedList: defaultCheckedList,
            checkedList: [[], [], [], []],
            courseAllChange: [[], [], [], []],
            indeterminate: false,
            checkAll: false,
            checked: false,
            plainOptions: [],
            stage: this.props.schoolSectionKey,
            checkIdList: [],
            checkNameList: [],
            courseSubjectType: '',
            checkBoxValue: [],
            kindergartenValue: [], //幼儿园选中数据
            primaryValue: [], //小学选中数据
            juniorHighValue: [], //初中选中数据
            highValue: [], //高中选中数据

            kinderDefaultValue: [], //幼儿园默认选中数据
            primaryDefaultValue: [], //小学默认选中数据
            juniorHighDefaultValue: [], //初中默认选中数据
            highDefaultValue: [], //高中默认选中数据

            kinderId: '',
            primaryId: '',
            juniorHighId: '',
            highId: '',
        };
    }

    componentDidMount() {
        this.getAllCourse();
    }

    //完成关闭弹窗
    closeModal = () => {
        const { onClose, dispatch, stageSubject } = this.props;
        typeof onClose == 'function' && onClose.call(this);
        // this.props.getCheckIdList(this.state.checkIdList, this.state.stage);
    };

    closeTemplateModal = () => {
        const { onClose, dispatch, stageSubject } = this.props;
        typeof onClose == 'function' && onClose.call(this);
    };

    //根据条件获得模版中课程与所有课程
    getAllCourse = () => {
        const {} = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'order/currentSemesterSubject',
        }).then(() => {
            const { personalSubjectTemplate, dispatch } = this.props;
            this.setState({
                mubanLoading: false,
            });
            if (Object.values(personalSubjectTemplate).length > 0) {
                Object.values(personalSubjectTemplate).map((item, index) => {
                    item.map((item1, index2) => {
                        item1.label = item1.name;
                        item1.value = String(item1.id);
                    });
                });
                this.setState(
                    {
                        checkBoxValue: Object.values(personalSubjectTemplate),
                    },
                    () => {
                        const { dispatch, sheetType, semesterValue } = this.props;
                        const { stage, courseSubjectType } = this.state;
                        dispatch({
                            type: 'order/stageSubject',
                            payload: {
                                semesterId: this.props.semesterValue, //学期ID
                                // stage: this.state.stage,
                                sheetType: this.props.sheetType,
                            },
                        }).then(() => {
                            const { stageSubject } = this.props;
                            stageSubject &&
                                stageSubject.length > 0 &&
                                stageSubject.map((item) => {
                                        if (item.courseSubjectType == 0) {
                                            this.setState({
                                                kinderId: item.id,
                                                kinderDefaultValue: item.subjectIdString.split(','),
                                                kindergartenValue: item.subjectIdString.split(','),
                                            });
                                        } else if (item.courseSubjectType == 1) {
                                            this.setState({
                                                primaryId: item.id,
                                                primaryDefaultValue:
                                                item.subjectIdString.split(','),
                                                primaryValue: item.subjectIdString.split(','),
                                            });
                                        }
                                });
                        });
                    }
                );
            }
        });
    };

    changeSubject = (key) => {
        this.setState(
            {
                stage: key,
            },
            () => {
                this.getAllCourse();
            }
        );
    };

    //左侧列表
    leftHtml = () => {
        const { templateList, stage } = this.state;
        const { currentSemesterSubject, updateStageSubject, schoolSectionKey } = this.props;
        return (
            <ul className={styles.templateContent_left}>
                <li>
                    <h3>统计学科管理</h3>
                </li>
            </ul>
        );
    };

    onCheckAllChange = (e, index) => {
        console.log(e.target.checked, index);
        let array = [];
        array = [...this.state.courseAllChange];
        array[index - 1] = e.target.checked;
        this.setState(
            {
                courseAllChange: array,
            },
            () => {
                console.log(this.state.courseAllChange);
            }
        );
    };

    onChangeSubject1 = (value) => {
        this.setState(
            {
                kindergartenValue: value,
            },
            () => {
                this.checkBoxClick(1);
            }
        );
    };
    onChangeSubject2 = (value) => {
        this.setState(
            {
                primaryValue: value,
            },
            () => {
                this.checkBoxClick(2);
            }
        );
    };
    onChangeSubject3 = (value) => {
        this.setState(
            {
                juniorHighValue: value,
            },
            () => {
                this.checkBoxClick(3);
            }
        );
    };
    onChangeSubject4 = (value) => {
        this.setState(
            {
                highValue: value,
            },
            () => {
                this.checkBoxClick(4);
            }
        );
    };
    //checkbox按钮接口请求
    checkBoxClick = (key) => {
        const {
            kinderId,
            primaryId,
            juniorHighId,
            highId,
            kinderDefaultValue,
            primaryDefaultValue,
            juniorHighDefaultValue,
            highDefaultValue,
            kindergartenValue,
            primaryValue,
            juniorHighValue,
            highValue,
        } = this.state;
        if (key == 1) {
            if (kinderDefaultValue.length > 0 || kindergartenValue.length > 1) {
                this.setApi(1, kinderId, 1);
            } else {
                this.setApi(2, null, 1);
            }
        } else if (key == 2) {
            if (primaryDefaultValue.length > 0 || primaryValue.length > 1) {
                this.setApi(1, primaryId, 2);
            } else {
                this.setApi(2, null, 2);
            }
        } else if (key == 3) {
            if (juniorHighDefaultValue.length > 0 || juniorHighValue.length > 1) {
                this.setApi(1, juniorHighId, 3);
            } else {
                this.setApi(2, null, 3);
            }
        } else if (key == 4) {
            if (highDefaultValue.length > 0 || highValue.length > 1) {
                this.setApi(1, highId, 4);
            } else {
                this.setApi(2, null, 4);
            }
        }
    };
    setApi = (key, id, secTion) => {
        const { dispatch, sheetType, semesterValue } = this.props;
        const {
            stage,
            highValue,
            kindergartenValue,
            primaryValue,
            juniorHighValue,
            kinderId,
            primaryId,
            juniorHighId,
            highId,
        } = this.state;
        dispatch({
            // 'order/updateStageSubject'
            type: key == 1 ? 'order/updateStageSubject' : 'order/createStageSubject',
            payload: {
                id: id,
                subjectIdList:
                    secTion == 1
                        ? kindergartenValue
                        : secTion == 2
                        ? primaryValue
                        : secTion == 3
                        ? juniorHighValue
                        : secTion == 4
                        ? highValue
                        : [],
                stage: secTion,
                semesterId: semesterValue, //学期ID
                courseSubjectType: secTion == 1 ? 0 : 1,
                sheetType: sheetType,
            },
        }).then((res) => {
            console.log(res, 'res111');
            if (!kinderId || !primaryId || !juniorHighId || !highId) {
                this.getAllCourse();
            }
        });
    };

    gradeshow = (index) => {
        console.log('index', index)
        if (index == 0) {
            return <span>必修</span>;
        } else if (index == 1) {
            return <span>选休</span>;
        }
    };

    //右侧内容
    rightHtml = () => {
        const {
            checkedList,
            plainOptions,
            checkBoxValue,
            kindergartenValue,
            primaryValue,
            juniorHighValue,
            highValue,
            courseAllChange,
            kinderDefaultValue,
            primaryDefaultValue,
            juniorHighDefaultValue,
            highDefaultValue,
            checkAll,
            checked,
        } = this.state;

        const { personalSubjectTemplate } = this.props;
        return (
            <div className={styles.templateContent_right}>
                <div className={styles.right_con}>
                    {Object.keys(personalSubjectTemplate) &&
                        Object.keys(personalSubjectTemplate).length > 0 &&
                        Object.keys(personalSubjectTemplate).map((item, index) => {
                            return (
                                <div
                                    className={styles.checkBox_wrap}
                                    style={{ marginBottom: '20px' }}
                                >
                                    <div style={{ marginBottom: '10px' }}>
                                        {/* <Checkbox
                                            // indeterminate={checked}
                                            onChange={() => this.onCheckAllChange(event, item)}
                                            checked={courseAllChange[index] == true}
                                        >
                                            全选
                                        </Checkbox> */}
                                        <span
                                            style={{ marginRight: '10px', display: 'inline-block' }}
                                        >
                                            {this.gradeshow(item)}已选择
                                            {item == '0'
                                                ? kindergartenValue && kindergartenValue.length
                                                : item == '1'
                                                ? primaryValue && primaryValue.length
                                                : null}
                                            个学科
                                        </span>
                                    </div>
                                    {item == '0' ? (
                                        <Checkbox.Group
                                            key={kinderDefaultValue}
                                            options={
                                                checkBoxValue.length > 0 && checkBoxValue[index]
                                            }
                                            defaultValue={kinderDefaultValue}
                                            onChange={this.onChangeSubject1}
                                            style={{ marginBottom: '10px' }}
                                        />
                                    ) : null}
                                    {item == '1' ? (
                                        <Checkbox.Group
                                            key={primaryDefaultValue}
                                            options={
                                                checkBoxValue.length > 0 && checkBoxValue[index]
                                            }
                                            defaultValue={primaryDefaultValue}
                                            onChange={this.onChangeSubject2}
                                            style={{ marginBottom: '10px' }}
                                        />
                                    ) : null}
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };

    render() {
        const { mubanLoading, contentLoading, checkedList, courseAllChange } = this.state;
        const { modalTitle } = this.props;
        return (
            <div style={{ height: '100vh', overflow: 'hidden' }}>
                <div className={styles.head}>
                    <i
                        className={`${icon.iconfont} ${styles.icon}`}
                        onClick={this.closeTemplateModal}
                    >
                        &#xe6e2;
                    </i>
                    <span className={styles.head_title}>
                        {trans('globalutil.setCourseTemplate', '设置学校课程模板')}&nbsp;&nbsp;
                        {modalTitle}
                    </span>
                </div>
                {mubanLoading ? (
                    <div className={styles.templateContent}>
                        <Skeleton active />
                    </div>
                ) : (
                    <div className={styles.templateContent}>
                        {this.leftHtml()}
                        {contentLoading ? (
                            <div className={styles.templateContent_right_loading}>
                                <Spin />
                            </div>
                        ) : (
                            this.rightHtml()
                        )}
                    </div>
                )}
            </div>
        );
    }
}
