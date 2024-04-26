//设置课程模板
import React, { PureComponent } from 'react';
import styles from './index.less';
import icon from '../../icon.less';
import { connect } from 'dva';
import { Select, Input, Icon, Checkbox, Skeleton, Spin } from 'antd';
import { trans, locale } from '../../utils/i18n';
import { isEmpty } from 'lodash';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

@connect((state) => ({
    currentSemesterSubject: state.order.currentSemesterSubject,
    stageSubject: state.order.stageSubject,
    updateStageSubject: state.order.updateStageSubject,
}))
export default class TemplateModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mubanLoading: true,
            contentLoading: false,

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

            tabIndex: 0,
            showStageManagement: false,
            showSubjectManagement: false,
            showClassMentor: false,
        };
    }

    componentDidMount() {
        this.getAllCourse();
    }

    //完成关闭弹窗
    closeModal = () => {
        const { onClose, dispatch, stageSubject, semesterValue } = this.props;
        const { checkIdList, stage, courseSubjectType } = this.state;
        console.log('semesterValue', semesterValue);
        dispatch({
            type:
                stageSubject && stageSubject.subjectIdList && stageSubject.subjectIdList.length > 0
                    ? 'order/updateStageSubject'
                    : 'order/createStageSubject',
            payload: {
                id:
                    stageSubject &&
                    stageSubject.subjectIdList &&
                    stageSubject.subjectIdList.length > 0
                        ? stageSubject && stageSubject.id
                        : null, //设置好学科后 查询回显的数据的主键
                subjectIdList: checkIdList,
                stage,
                semesterId: this.props.semesterValue, //学期ID
                // courseSubjectType,
                sheetType: Number(this.props.sheetType),
            },
        }).then(() => {
            const {} = this.props;
            this.setState({});
            typeof onClose == 'function' && onClose.call(this);
            this.props.getCheckIdList(this.state.checkIdList, this.state.stage);
            // this.props.getStage(this.state.stage);
        });
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
            type: 'order/getCurrentSemesterSubject',
        }).then(() => {
            const { currentSemesterSubject, dispatch } = this.props;
            this.setState({
                mubanLoading: false,
            });
            if (Object.values(currentSemesterSubject).length > 0) {
                Object.values(currentSemesterSubject).map((item, index) => {
                    item.map((item1, index2) => {
                        item1.label = item1.name;
                        item1.value = String(item1.id);
                    });
                });
                this.setState(
                    {
                        checkBoxValue: Object.values(currentSemesterSubject),
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

                            let showConfig =
                                stageSubject.length > 0 && stageSubject[0].showConfig
                                    ? JSON.parse(stageSubject[0].showConfig)
                                    : {};

                            if (!isEmpty(showConfig)) {
                                this.setState({
                                    showStageManagement: showConfig?.showStageManagement || false,
                                    showSubjectManagement:
                                        showConfig?.showSubjectManagement || false,
                                    showClassMentor: showConfig?.showClassMentor || false,
                                });
                            }

                            stageSubject &&
                                stageSubject.length > 0 &&
                                stageSubject.map((item) => {
                                    if (item.stage) {
                                        if (item.stage == 1) {
                                            this.setState({
                                                kinderId: item.id,
                                                kinderDefaultValue: item.subjectIdString.split(','),
                                                kindergartenValue: item.subjectIdString.split(','),
                                            });
                                        } else if (item.stage == 2) {
                                            this.setState({
                                                primaryId: item.id,
                                                primaryDefaultValue:
                                                    item.subjectIdString.split(','),
                                                primaryValue: item.subjectIdString.split(','),
                                            });
                                        } else if (item.stage == 3) {
                                            this.setState({
                                                juniorHighId: item.id,
                                                juniorHighDefaultValue:
                                                    item.subjectIdString.split(','),
                                                juniorHighValue: item.subjectIdString.split(','),
                                            });
                                        } else if (item.stage == 4) {
                                            this.setState({
                                                highId: item.id,
                                                highDefaultValue: item.subjectIdString.split(','),
                                                highValue: item.subjectIdString.split(','),
                                            });
                                        }
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

    changeTabIndex = (flag) => {
        this.setState({
            tabIndex: flag,
        });
    };

    //左侧列表
    leftHtml = () => {
        const selectedStyle = { border: '1px solid blue' };
        const { tabIndex } = this.state;
        return (
            <ul className={styles.templateContent_left}>
                <li style={!tabIndex ? selectedStyle : {}} onClick={() => this.changeTabIndex(0)}>
                    <h3>统计学科管理</h3>
                </li>
                <li style={tabIndex ? selectedStyle : {}} onClick={() => this.changeTabIndex(1)}>
                    <h3>报名显示设置</h3>
                </li>
            </ul>
        );
    };

    onCheckAllChange = (e, index) => {
        console.log(e.target.checked, index);
        let array = [];
        array = [...this.state.courseAllChange];
        array[index - 1] = e.target.checked;
        this.setState({
            courseAllChange: array,
        });
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
                sheetType: sheetType,
            },
        }).then((res) => {
            if (!kinderId || !primaryId || !juniorHighId || !highId) {
                this.getAllCourse();
            }
        });
    };

    gradeshow = (index) => {
        if (index == 1) {
            return <span>幼儿园</span>;
        } else if (index == 2) {
            return <span>小学</span>;
        } else if (index == 3) {
            return <span>初中</span>;
        } else if (index == 4) {
            return <span>高中</span>;
        }
    };

    changeViewConfig = () => {
        const { showStageManagement, showSubjectManagement, showClassMentor } = this.state;
        const { semesterValue, dispatch } = this.props;
        dispatch({
            type: 'order/changeViewConfig',
            payload: [
                {
                    showStageManagement,
                    showSubjectManagement,
                    showClassMentor,
                    sheetType: 2,
                    semesterId: semesterValue,
                },
            ],
        }).then(() => {
            this.getAllCourse();
        });
    };

    changeIsChecked = (e, type) => {
        this.setState(
            {
                [type]: e.target.checked,
            },
            () => {
                this.changeViewConfig();
            }
        );
    };

    //右侧内容
    rightHtml = () => {
        const {
            checkBoxValue,
            kindergartenValue,
            primaryValue,
            juniorHighValue,
            highValue,
            kinderDefaultValue,
            primaryDefaultValue,
            juniorHighDefaultValue,
            highDefaultValue,
            tabIndex,
            showStageManagement,
            showSubjectManagement,
            showClassMentor,
        } = this.state;

        const { currentSemesterSubject } = this.props;
        return (
            <div className={styles.templateContent_right}>
                <div className={styles.right_con}>
                    {tabIndex ? (
                        <>
                            <div className={styles.checkBox_wrap} style={{ marginBottom: '30px' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <div className={styles.labelStyle}>学校管理岗位</div>
                                    <Checkbox
                                        checked={showStageManagement}
                                        onChange={(e) =>
                                            this.changeIsChecked(e, 'showStageManagement')
                                        }
                                    >
                                        显示学段管理岗位
                                    </Checkbox>
                                </div>
                            </div>
                            <div className={styles.checkBox_wrap} style={{ marginBottom: '30px' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <div className={styles.labelStyle}>学科首席/学科组长</div>
                                    <Checkbox
                                        checked={showSubjectManagement}
                                        onChange={(e) =>
                                            this.changeIsChecked(e, 'showSubjectManagement')
                                        }
                                    >
                                        显示学科首席/学科组长
                                    </Checkbox>
                                </div>
                            </div>
                            <div className={styles.checkBox_wrap} style={{ marginBottom: '30px' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <div className={styles.labelStyle}>年级工作安排</div>
                                    <Checkbox
                                        checked={showClassMentor}
                                        onChange={(e) => this.changeIsChecked(e, 'showClassMentor')}
                                    >
                                        显示班级导师
                                    </Checkbox>
                                </div>
                            </div>
                        </>
                    ) : (
                        Object.keys(currentSemesterSubject) &&
                        Object.keys(currentSemesterSubject).length > 0 &&
                        Object.keys(currentSemesterSubject).map((item, index) => {
                            return (
                                <div
                                    className={styles.checkBox_wrap}
                                    style={{ marginBottom: '20px' }}
                                >
                                    <div style={{ marginBottom: '10px' }}>
                                        <span
                                            style={{
                                                marginRight: '10px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {this.gradeshow(item)}已选择
                                            {item == '1'
                                                ? kindergartenValue && kindergartenValue.length
                                                : item == '2'
                                                ? primaryValue && primaryValue.length
                                                : item == '3'
                                                ? juniorHighValue && juniorHighValue.length
                                                : item == '4'
                                                ? highValue && highValue.length
                                                : null}
                                            个学科
                                        </span>
                                    </div>
                                    {item == '1' ? (
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
                                    {item == '2' ? (
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
                                    {item == '3' ? (
                                        <Checkbox.Group
                                            key={juniorHighDefaultValue}
                                            options={
                                                checkBoxValue.length > 0 && checkBoxValue[index]
                                            }
                                            defaultValue={juniorHighDefaultValue}
                                            onChange={this.onChangeSubject3}
                                            style={{ marginBottom: '10px' }}
                                        />
                                    ) : null}
                                    {item == '4' ? (
                                        <Checkbox.Group
                                            key={highDefaultValue}
                                            options={
                                                checkBoxValue.length > 0 && checkBoxValue[index]
                                            }
                                            defaultValue={highDefaultValue}
                                            onChange={this.onChangeSubject4}
                                            style={{ marginBottom: '10px' }}
                                        />
                                    ) : null}
                                </div>
                            );
                        })
                    )}
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
                    {this.props.fromPerson ? (
                        <div className={styles.head_btn} onClick={this.closeModal}>
                            {trans('template.finish', '完成')}
                        </div>
                    ) : null}
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
