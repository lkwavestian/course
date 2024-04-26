//从历史学期导入弹窗
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './historyModal.less';
import CardUtil from './card.js';
import { runInThisContext } from 'vm';
import {
    Select,
    Modal,
    TreeSelect,
    Pagination,
    Input,
    Checkbox,
    Spin,
    Form,
    Skeleton,
    Icon,
    Button,
    Table,
    message,
} from 'antd';
import { trans, locale } from '../../../utils/i18n';
import { object } from 'prop-types';
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const coursePlainOptions = [];
export default class HistoryImportModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            ifImportStudent: false,
            checkStu: [],
        };
    }
    // 复选框改变回调
    checkChange = (checkedValue) => {
        console.log(checkedValue, 'checkedValue');
        if (checkedValue.indexOf('学生') >= 0) {
            this.setState({
                ifImportStudent: true,
                checkStu: checkedValue,
            });
        } else if (this.state.checkStu) {
            this.setState({
                ifImportStudent: false,
                checkStu: [],
            });
        }
    };

    // 全选回调
    onCheckAllChange = (e) => {
        const { plainOption } = this.props;
        const valueAll = [];
        plainOption.map((item, index) => {
            if (!item.disabled) {
                valueAll.push(item.value);
            }
        });
        this.setState({
            checkedList: e.target.checked ? valueAll : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };
    onChangeCourse = (checkedList, aa) => {
        const { plainOption } = this.props;
        this.setState({
            checkedList: checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOption.length,
            checkAll: checkedList.length === plainOption.length,
        });
    };

    comfrimImport = () => {
        const { dispatch, semesterValue, schoolId, importHistorySemesterList, selectCourseId } =
            this.props;
        console.log(selectCourseId, 'selectCourseId');
        const { checkedList, ifImportStudent } = this.state;
        if (checkedList.length == 0) {
            message.info('请选择课程');
            return;
        }
        let coursePlanInfoList = [];
        importHistorySemesterList &&
            importHistorySemesterList.historyImportCourseOutputModelList &&
            importHistorySemesterList.historyImportCourseOutputModelList.length &&
            importHistorySemesterList.historyImportCourseOutputModelList.map((item, index) => {
                checkedList &&
                    checkedList.length &&
                    checkedList.map((el, order) => {
                        if (el == item.coursePlanningId) {
                            console.log(selectCourseId[`${item.id}`], '>>>>>');
                            let obj = {};
                            let selectCourseIdForOne =
                                item.lastSemesterCourseList &&
                                item.lastSemesterCourseList.length > 0 &&
                                item.lastSemesterCourseList[0].id;
                            console.log(selectCourseIdForOne, 'selectCourseIdForOne');
                            obj.coursePlanId = item.coursePlanningId;
                            obj.selectCourseId = selectCourseId[`${item.id}`]
                                ? selectCourseId[`${item.id}`]
                                : selectCourseIdForOne;
                            coursePlanInfoList.push(obj);
                        }
                    });
            });
        console.log(coursePlanInfoList, 'coursePlanInfoList');
        dispatch({
            type: 'course/saveCoursePlanning',
            payload: {
                semesterId: semesterValue,
                schoolId,
                coursePlanInfoList,
                ifImportStudent,
            },
            onSuccess: () => {
                this.props.onCancelHistory();
                this.props.getCoursePlan();
                this.setState({
                    checkedList: [],
                    indeterminate: false,
                    checkAll: false,
                    checkStu: [],
                });
            },
        });
    };
    render() {
        const { fromHistoryModal, plainOption } = this.props;
        const XZplainOptions = [
            { label: '课时', value: '课时' },
            { label: '班级', value: '班级' },
            { label: '教师', value: '教师' },
            { label: '学生', value: '学生' },
        ];
        const FCplainOptions = [
            { label: '课时', value: '课时', disabled: true },
            { label: '班级', value: '班级', disabled: true },
            { label: '教师', value: '教师', disabled: true },
            { label: '学生', value: '学生', disabled: false },
        ];

        return (
            <Modal
                title={trans('course.plan.importLast', '导入上学期配置')}
                width="60vw"
                maskClosable={false}
                footer={null}
                visible={fromHistoryModal}
                onCancel={this.props.onCancelHistory}
            >
                <div className={styles.modalContent}>
                    <div className={styles.first}>
                        <div className={styles.XZclass}>
                            <span className={styles.classType}>行政班课程</span>
                            <Checkbox.Group
                                options={XZplainOptions}
                                defaultValue={['课时', '班级', '教师', '学生']}
                                disabled
                            />
                        </div>
                        <div className={styles.XZclass}>
                            <span className={styles.classType}>分层班课程</span>
                            <Checkbox.Group
                                options={FCplainOptions}
                                defaultValue={['课时', '班级', '教师']}
                                onChange={this.checkChange}
                            />
                        </div>
                        {/* <div>
                        <span className = {styles.classType}>分层班课程</span>
                        <Checkbox.Group options={XZplainOptions} defaultValue ={['课时','班级','教师','学生']} onChange={this.checkChange} value = {this.state.checkStu} />
                    </div> */}
                    </div>
                    <div className={styles.second}>
                        <div>
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                                className={styles.checkAll}
                            >
                                <span className={styles.checkAllText}>
                                    {' '}
                                    {trans('global.choiceAll', '全选')}
                                </span>
                            </Checkbox>
                        </div>
                        <span className={styles.semester}>上学期</span>
                        <span className={styles.nowSemester}>本学期</span>
                        <br />
                        <CheckboxGroup
                            options={plainOption}
                            value={this.state.checkedList}
                            onChange={this.onChangeCourse}
                            className={styles.checkGroup}
                        />
                    </div>
                    <div className={styles.btn}>
                        <span className={styles.cancel} onClick={this.props.onCancelHistory}>
                            取消
                        </span>
                        <span className={styles.comfrim} onClick={this.comfrimImport}>
                            确定
                        </span>
                    </div>
                </div>
            </Modal>
        );
    }
}
