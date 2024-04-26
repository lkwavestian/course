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
}))
export default class TemplateModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mubanLoading: true,
            contentLoading: false,

            // checkedList: defaultCheckedList,
            checkedList: [],
            indeterminate: true,
            checkAll: false,
            plainOptions: [],
            stage: this.props.schoolSectionKey,
            checkIdList: [],
            checkNameList: [],
            courseSubjectType: '',
        };
    }

    componentDidMount() {
        // console.log('first', first)
        // this.setState(
        //     {
        //         stage: this.props.schoolSectionKey,
        //     },
        //     () => {
        this.getAllCourse();
        //     }
        // );
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
                sheetType: this.props.sheetType,
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
        // this.setState({
        //     showTemplateModal: false,
        // });
        const { onClose, dispatch, stageSubject } = this.props;
        typeof onClose == 'function' && onClose.call(this);
    };

    //根据条件获得模版中课程与所有课程
    getAllCourse = () => {
        const { templateId, subjectId, teachingOrgId, inputValue, stage, courseSubjectType } =
            this.state;
        const { dispatch, stageSubject } = this.props;
        dispatch({
            type: 'order/currentSemesterSubject',
            payload: {
                // semesterId: this.props.semesterValue, //学期ID
                // stage: this.props.schoolSectionKey,
                stage: this.state.stage,
                // sheetType: this.props.sheetType,
            },
        }).then(() => {
            const { currentSemesterSubject, dispatch } = this.props;
            const { stage, courseSubjectType } = this.state;
            const plainOptions = [];
            currentSemesterSubject &&
                currentSemesterSubject.length > 0 &&
                currentSemesterSubject.map((item, index) => {
                    return plainOptions.push(item.name);
                });
            this.setState(
                {
                    mubanLoading: false,
                    plainOptions,
                    // stage: this.props.schoolSectionKey,
                },
                () => {
                    // console.log('statef', this.state.stage);
                    dispatch({
                        type: 'order/stageSubject',
                        payload: {
                            semesterId: this.props.semesterValue, //学期ID
                            stage: this.state.stage,
                            sheetType: this.props.sheetType,
                        },
                    }).then(() => {
                        const { stageSubject } = this.props;
                        let checkNameList = [];
                        console.log('stageSubject', stageSubject);
                        stageSubject &&
                            stageSubject.subjectIdList &&
                            stageSubject.subjectIdList.length > 0 &&
                            stageSubject.subjectIdList.map((item, index) => {
                                currentSemesterSubject &&
                                    currentSemesterSubject.length > 0 &&
                                    currentSemesterSubject.map((el, order) => {
                                        if (item == el.id) {
                                            checkNameList.push(el.name);
                                        }
                                    });
                            });
                        let idList = [];
                        stageSubject &&
                            stageSubject.subjectIdList &&
                            stageSubject.subjectIdList.length > 0 &&
                            stageSubject.subjectIdList.map((item, index) => {
                                return idList.push(item);
                            });

                        this.setState(
                            {
                                checkedList: checkNameList,
                                // checkNameList,
                                // stage: stageSubject && stageSubject.stage,
                                checkIdList: idList,
                            },
                            () => {
                                console.log(
                                    'checkedList',
                                    this.state.checkedList,
                                    this.state.checkIdList
                                );
                            }
                        );
                    });
                }
            );
        });
    };

    changeSubject = (key) => {
        console.log('key', key);
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
        const { currentSemesterSubject, updateStageSubject } = this.props;
        return (
            <ul className={styles.templateContent_left}>
                <li
                    onClick={() => this.changeSubject(1)}
                    className={stage === 1 ? styles.active_li : ''}
                >
                    <h3>幼儿园统计学科</h3>
                    <p>
                        {currentSemesterSubject &&
                            currentSemesterSubject.length > 0 &&
                            currentSemesterSubject.length}
                        个学科
                    </p>
                </li>
                <li
                    onClick={() => this.changeSubject(2)}
                    className={stage === 2 ? styles.active_li : ''}
                >
                    <h3>小学统计学科</h3>
                    <p>
                        {currentSemesterSubject &&
                            currentSemesterSubject.length > 0 &&
                            currentSemesterSubject.length}
                        个学科
                    </p>
                </li>
                <li
                    onClick={() => this.changeSubject(3)}
                    className={stage === 3 ? styles.active_li : ''}
                >
                    <h3>初中统计学科</h3>
                    <p>
                        {currentSemesterSubject &&
                            currentSemesterSubject.length > 0 &&
                            currentSemesterSubject.length}
                        个学科
                    </p>
                </li>
                <li
                    onClick={() => this.changeSubject(4)}
                    className={stage === 4 ? styles.active_li : ''}
                >
                    <h3>高中统计学科</h3>
                    <p>
                        {currentSemesterSubject &&
                            currentSemesterSubject.length > 0 &&
                            currentSemesterSubject.length}
                        个学科
                    </p>
                </li>
            </ul>
        );
    };

    onCheckAllChange = (e) => {
        const { plainOptions } = this.state;
        console.log('e', e);
        this.setState(
            {
                checkedList: e.target.checked ? plainOptions : [],
                indeterminate: false,
                checkAll: e.target.checked,
            },
            () => {
                // this.props.getCheckIdList(this.state.checkIdList);
            }
        );
    };

    onChangeSubject = (checkedList) => {
        const { plainOptions, checkNameList } = this.state;
        const { currentSemesterSubject } = this.props;
        console.log('chistsdfvef', checkedList);
        checkedList.concat(this.state.checkedList);
        console.log('chistsdfvef', checkedList);
        let checkIdList = [];
        checkedList &&
            checkedList.length > 0 &&
            checkedList.map((el, order) => {
                currentSemesterSubject &&
                    currentSemesterSubject.length > 0 &&
                    currentSemesterSubject.map((item, index) => {
                        console.log('item', item);
                        if (el == item.name) {
                            checkIdList.push(item.id);
                        }
                    });
            });
        console.log('checkIdList', checkIdList);
        console.log('checkedList', checkedList);
        this.setState(
            {
                checkedList,
                indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
                checkAll: checkedList.length === plainOptions.length,
                checkIdList,
            },
            () => {
                // this.props.getCheckIdList(this.state.checkIdList);
            }
        );
    };

    //课程展示
    renderCourse = () => {
        const { coursesList, checkedList, courseCount, plainOptions } = this.state;
        const { currentSemesterSubject } = this.props;
        console.log('currentSemesterSubject', currentSemesterSubject);

        return (
            <div className={styles.checkBox_wrap}>
                <div style={{ marginBottom: '10px' }}>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        全选
                    </Checkbox>
                    <span style={{ marginRight: '10px', display: 'inline-block' }}>
                        已选择{checkedList && checkedList.length}个学科
                    </span>
                </div>
                {currentSemesterSubject && currentSemesterSubject.length ? (
                    <CheckboxGroup
                        options={plainOptions}
                        value={this.state.checkedList}
                        onChange={this.onChangeSubject}
                        style={{ marginBottom: '10px' }}
                    />
                ) : (
                    <div className={styles.checkGroup}>
                        {trans('template.noData', '当前查询暂无数据')}
                    </div>
                )}
            </div>
        );
    };

    //右侧内容
    rightHtml = () => {
        const { subjectList, inputValue, teachingOrgList } = this.state;
        return (
            <div className={styles.templateContent_right}>
                <div className={styles.right_con}>{this.renderCourse()}</div>
            </div>
        );
    };

    render() {
        const { mubanLoading, contentLoading } = this.state;
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
                        {trans('globalutil.setCourseTemplate', '设置课程模板')}
                    </span>
                    <div className={styles.head_btn} onClick={this.closeModal}>
                        {trans('template.finish', '完成')}
                    </div>
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
