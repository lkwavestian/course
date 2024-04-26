//保存版本
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './exportPlan.less';
import { Modal, Checkbox, Radio, message } from 'antd';
import { cloneDeep } from 'lodash';

const CheckboxGroup = Checkbox.Group;
const { confirm } = Modal;
@connect((state) => ({
    exportPlanGroupList: state.timeTable.exportPlanGroupList,
}))
export default class ExportPlan extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            groupList: [],
            radioValue: 1,
        };
        this.fetchImport = false;
    }

    componentWillMount() {
        const { dispatch, versionId, courseId } = this.props;
        dispatch({
            type: 'timeTable/getExportGroupList',
            payload: {
                versionId,
                courseId,
            },
        });
    }

    handleCancel = () => {
        const { hideExportPlanModal } = this.props;
        typeof hideExportPlanModal == 'function' && hideExportPlanModal();
    };

    formatOptions = () => {
        const { exportPlanGroupList } = this.props;
        const arr = [];
        exportPlanGroupList.map((item, index) => {
            let obj = {};
            obj.label = item.groupName;
            obj.value = item.defaultCoursePlanIdList;
            obj.disabled = !item.canBeSelected;
            arr.push(obj);
        });
        return arr;
    };

    handleGroupChange = (value) => {
        let newList =
            value && value.length > 0
                ? value.reduce(function (a, b) {
                      return a.concat(b);
                  })
                : [];
        this.setState({
            groupList: newList,
        });
    };

    onRadioChange = (e) => {
        this.setState({
            radioValue: e.target.value,
        });
    };

    handleConfirm = () => {
        const { radioValue } = this.state;
        let _this = this;
        if (radioValue === 0) {
            confirm({
                title: (
                    <span className={styles.deletetitle}>
                        系统将删除该课程所有排课结果，并从基础课时计划重新导入，是否确认操作？
                    </span>
                ),
                onOk() {
                    _this.fetchImportByCourse();
                },
                okText: <span className={styles.deleteConfirm}>确认</span>,
                cancelText: <span className={styles.deleteCancel}>取消</span>,
                onCancel() {
                    console.log('Cancel');
                },
                className: styles.deleteConfirmModa,
            });
        } else {
            this.fetchImportByCourse();
        }
    };

    fetchImportByCourse = () => {
        const {
            dispatch,
            versionId,
            courseId,
            getshowAcCourseList,
            hideExportPlanModal,
            showTable,
        } = this.props;
        const { radioValue, groupList } = this.state;
        if (radioValue === 1 && (!groupList || (groupList && !groupList.length))) {
            message.info('请选择班级');
            return;
        }
        if (this.fetchImport) {
            return;
        }
        this.fetchImport = true;
        dispatch({
            type: 'timeTable/importByCourse',
            payload: {
                weekVersionId: versionId,
                courseId,
                importType: radioValue,
                defaultCoursePlanIdList: radioValue === 1 ? groupList : null,
            },
            onSuccess: () => {
                typeof getshowAcCourseList == 'function' && getshowAcCourseList.call(this);
                typeof hideExportPlanModal == 'function' && hideExportPlanModal();
                if (radioValue === 0) {
                    typeof showTable == 'function' && showTable('删除班课计划');
                }
                this.fetchImport = false;
            },
        }).then(() => {
            this.fetchImport = false;
            typeof hideExportPlanModal == 'function' && hideExportPlanModal();
        });
    };

    render() {
        const { exportPlanVisible, exportPlanGroupList } = this.props;
        const { radioValue } = this.state;

        return (
            <Modal
                visible={exportPlanVisible}
                title="导入课时计划"
                onCancel={this.handleCancel}
                footer={null}
                className={styles.exportPlanModal}
            >
                <Radio.Group
                    onChange={this.onRadioChange}
                    value={radioValue}
                    className={styles.radioGroup}
                >
                    <Radio value={0}>删除该课程所有排课结果并重新导入</Radio>
                    <br />
                    <Radio value={1}>导入班级课时计划</Radio>
                </Radio.Group>
                <div className={styles.groupCheck}>
                    {radioValue === 1 ? (
                        <CheckboxGroup
                            options={this.formatOptions()}
                            onChange={this.handleGroupChange}
                        />
                    ) : null}
                </div>
                <div className={styles.btn}>
                    <span className={styles.cancel} onClick={this.handleCancel}>
                        取消
                    </span>
                    <span className={styles.confirm} onClick={this.handleConfirm}>
                        确认
                    </span>
                </div>
            </Modal>
        );
    }
}
