import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Checkbox, Icon, Popconfirm, Select, Radio, Row, Col } from 'antd';
import { trans } from '../../../../utils/i18n';
import { remove } from 'lodash';
import icon from '../../../../icon.less';
import SimpleModal from '../../../CommonModal/SimpleModal';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

const startTimeArr = [
    { name: '06:00', value: 6 },
    { name: '07:00', value: 7 },
    { name: '08:00', value: 8 },
    { name: '09:00', value: 9 },
];

const endTimeArr = [
    { name: '16:00', value: 16 },
    { name: '17:00', value: 17 },
    { name: '18:00', value: 18 },
    { name: '19:00', value: 19 },
    { name: '20:00', value: 20 },
    { name: '21:00', value: 21 },
    { name: '22:00', value: 22 },
    { name: '23:00', value: 23 },
];

@connect((state) => ({
    tableView: state.timeTable.tableView,
    displayType: state.timeTable.displayType,
    /* 
        周视图：2：显示活动 4：显示课程 3：教师课表只显示班级 5：年级课表只显示课程
                6：显示简称（无简称则显示全程）7：分层班显示班级简称
        课节视图：6：显示简称（无简称则显示全程）7：分层班显示班级简称 8：显示教师 9:显示场地
                10：按照列排
    */

    displayRules: state.lessonView.displayRules,
    customCourseSearchIndex: state.lessonView.customCourseSearchIndex,
    newClassGroupList: state.rules.newClassGroupList[0]
        ? state.rules.newClassGroupList[0].gradeStudentGroupModels
        : [], //版本内-学生组
    displayDirection: state.timeTable.displayDirection,
    customGradeList: state.timeTable.customGradeList,
}))
export default class DisplayRuleList extends PureComponent {
    state = {
        startTimeValue: localStorage.getItem('startNum')
            ? JSON.parse(localStorage.getItem('startNum'))
            : 8,
        endTimeValue: localStorage.getItem('endNum')
            ? JSON.parse(localStorage.getItem('endNum'))
            : 18,
        lockModalVisible: false,
        lockType: '',
        selectedGradeIdList: [],
        indeterminateGrade: false,
        checkAllGrade: false,
        lockConfirmLoading: false,
    };

    startTimeChange = (value) => {
        this.setState(
            {
                startTimeValue: value,
            },
            () => {
                localStorage.setItem('startNum', value);
                this.getTimeLineList();
            }
        );
    };

    endTimeChange = (value) => {
        this.setState(
            {
                endTimeValue: value,
            },
            () => {
                localStorage.setItem('endNum', value);
                this.getTimeLineList();
            }
        );
    };

    getTimeLineList = () => {
        const { startTimeValue, endTimeValue } = this.state;
        const { importTimeLineList } = this.props;
        const arr = [];
        for (let index = startTimeValue; index <= endTimeValue; index++) {
            arr.push({
                start: index < 10 ? '0' + index : index + '',
            });
        }
        typeof importTimeLineList == 'function' &&
            importTimeLineList(arr, startTimeValue, endTimeValue);
    };

    viewChange = async (tableView) => {
        const {
            dispatch,
            getLessonViewMsg,
            newClassGroupList,
            currentVersion,
            updateLessonViewCustomValue,
        } = this.props;
        dispatch({
            type: 'timeTable/setTableView',
            payload: tableView,
        });

        if (tableView === 'weekLessonView') {
            if (isEmpty(newClassGroupList)) {
                await dispatch({
                    type: 'rules/newClassGroupList',
                    payload: {
                        versionId: currentVersion,
                    },
                });
                await updateLessonViewCustomValue();
                await getLessonViewMsg(true);
            } else {
                await getLessonViewMsg();
            }
        }
        localStorage.setItem('tableView', tableView);
    };

    selectListView = () => {
        const { dispatch } = this.props;
        dispatch(
            routerRedux.push({
                pathname: '/time/club',
            })
        );
        this.setState({
            isCheck: false,
        });
    };

    showChange = (checkedList, basicList) => {
        const { dispatch, displayType } = this.props;
        remove(displayType, (item) => basicList.includes(item));
        let resDisplayType = [...displayType, ...checkedList];
        localStorage.setItem('displayType', JSON.stringify(resDisplayType));
        dispatch({
            type: 'timeTable/changeDisplayType',
            payload: resDisplayType,
        });
    };

    tableWidthChange = (value) => {
        localStorage.setItem('tableWidthRatio', value);
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/changeTableWidth',
            payload: value,
        });
    };

    tableHeightChange = (value) => {
        localStorage.setItem('tableHeightRatio', value);
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/changeTableHeight',
            payload: value,
        });
    };

    lessonViewTableHeightChange = (value) => {
        localStorage.setItem('lessonViewTableHeightRatio', value);
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/changeLessonViewTableHeight',
            payload: value,
        });
    };

    timeSelectChange = (type, value) => {
        const { dispatch, displayRules } = this.props;
        let payload = {
            ...displayRules,
            [type]: value,
        };
        dispatch({
            type: 'lessonView/setDisplayRules',
            payload,
        });
        localStorage.setItem('displayRules', JSON.stringify(payload));
    };

    changeWeekendShow = (e) => {
        const { dispatch } = this.props;
        let payload = e.target.checked;
        dispatch({
            type: 'lessonView/setShowWeekend',
            payload,
        });
        localStorage.setItem('showWeekend', payload);
    };

    displayDirectionChange = (e) => {
        const { dispatch } = this.props;
        let payload = e.target.value;
        dispatch({
            type: 'timeTable/setDisplayDirection',
            payload,
        });
        localStorage.setItem('setDisplayDirection', payload);
    };

    lockOrUnLockClick = (type) => {
        this.setState({
            lockType: type,
            lockModalVisible: true,
        });
    };

    toggleLockModalVisible = () => {
        const { lockModalVisible } = this.state;

        this.setState(
            {
                lockModalVisible: !lockModalVisible,
            },
            () => {
                const { lockModalVisible } = this.state;
                if (!lockModalVisible) {
                    this.setState({
                        lockType: '',
                        selectedGradeIdList: [],
                        indeterminateGrade: false,
                        checkAllGrade: false,
                        lockConfirmLoading: false,
                    });
                }
            }
        );
    };

    confirmLockOrUnLock = () => {
        const { dispatch, showTable, tableView, getLessonViewMsg, currentVersion } = this.props;
        const { lockType, selectedGradeIdList } = this.state;
        this.setState({
            lockConfirmLoading: true,
        });
        dispatch({
            type: 'timeTable/confirmLock',
            payload: {
                gradeIdList: selectedGradeIdList,
                lockType: lockType === 'lock' ? 1 : 2,
                versionId: currentVersion,
            },
        }).then(() => {
            this.setState({
                lockConfirmLoading: false,
            });
            this.toggleLockModalVisible();
            if (tableView === 'weekLessonView') {
                typeof showTable === 'function' && showTable();
                typeof getLessonViewMsg === 'function' && getLessonViewMsg();
            } else {
                typeof showTable === 'function' && showTable();
            }
        });
    };

    selectedGradeChange = (checkedList) => {
        const { customGradeList } = this.props;
        this.setState({
            selectedGradeIdList: checkedList,
            indeterminateGrade:
                checkedList.length !== 0 && checkedList.length < customGradeList.length,
            checkAllGrade: checkedList.length === customGradeList.length,
        });
    };

    onCheckAllChange = (e) => {
        const { customGradeList } = this.props;
        this.setState({
            selectedGradeIdList: e.target.checked ? customGradeList.map((item) => item.id) : [],
            indeterminateGrade: false,
            checkAllGrade: e.target.checked,
        });
    };

    getLockList = () => {
        return (
            <div className={styles.lockList}>
                <span className={styles.lock} onClick={() => this.lockOrUnLockClick('lock')}>
                    <i className={icon.iconfont}>&#xe744;</i>
                    <span>锁定</span>
                </span>
                <span className={styles.unLock} onClick={() => this.lockOrUnLockClick('unLock')}>
                    <i className={icon.iconfont}>&#xe747;</i>
                    <span>解锁</span>
                </span>
            </div>
        );
    };

    render() {
        const {
            displayType,
            tableView,
            displayRules,
            showWeekend,
            customCourseSearchIndex,
            displayDirection,
            customGradeList,
        } = this.props;

        const {
            startTimeValue,
            endTimeValue,
            lockType,
            lockModalVisible,
            indeterminateGrade,
            checkAllGrade,
            selectedGradeIdList,
            lockConfirmLoading,
        } = this.state;
        let tableWidthArr = [
            {
                label: '100%',
                value: 1.0,
            },
            {
                label: '110%',
                value: 1.1,
            },
            {
                label: '120%',
                value: 1.2,
            },
            {
                label: '130%',
                value: 1.3,
            },
            {
                label: '140%',
                value: 1.4,
            },
            {
                label: '150%',
                value: 1.5,
            },
            {
                label: '200%',
                value: 2.0,
            },
            {
                label: '250%',
                value: 2.5,
            },
            {
                label: '300%',
                value: 3.0,
            },
            {
                label: '350%',
                value: 3.5,
            },
            {
                label: '400%',
                value: 4.0,
            },
            {
                label: '450%',
                value: 4.5,
            },
            {
                label: '500%',
                value: 5.0,
            },
        ];
        let tableHeighArr = [
            {
                label: '50%',
                value: 0.5,
            },
            {
                label: '60%',
                value: 0.6,
            },
            {
                label: '70%',
                value: 0.7,
            },
            {
                label: '80%',
                value: 0.8,
            },
            {
                label: '90%',
                value: 0.9,
            },
            {
                label: '100%',
                value: 1.0,
            },
            {
                label: '110%',
                value: 1.1,
            },
            {
                label: '120%',
                value: 1.2,
            },
            {
                label: '130%',
                value: 1.3,
            },
            {
                label: '140%',
                value: 1.4,
            },
            {
                label: '150%',
                value: 1.5,
            },
            {
                label: '200%',
                value: 2.0,
            },
            {
                label: '250%',
                value: 2.5,
            },
            {
                label: '300%',
                value: 3.0,
            },
        ];
        return (
            <div className={styles.displayRuleList}>
                {tableView === 'weekLessonView' ? (
                    <Fragment>
                        {customCourseSearchIndex == 0 ? (
                            <CheckboxGroup
                                defaultValue={
                                    JSON.parse(localStorage.getItem('displayType'))
                                        ? JSON.parse(localStorage.getItem('displayType'))
                                        : [2, 4]
                                }
                                onChange={(checkedList) => this.showChange(checkedList, [8, 9])}
                            >
                                <Checkbox value={8}>显示教师</Checkbox>
                                <Checkbox value={9}>显示场地</Checkbox>
                            </CheckboxGroup>
                        ) : (
                            <CheckboxGroup
                                defaultValue={
                                    JSON.parse(localStorage.getItem('displayType'))
                                        ? JSON.parse(localStorage.getItem('displayType'))
                                        : [2, 4]
                                }
                                onChange={(checkedList) => this.showChange(checkedList, [10])}
                            >
                                <Checkbox value={10}>显示场地</Checkbox>
                            </CheckboxGroup>
                        )}

                        <Popconfirm
                            title={
                                <div className={styles.settingPopconfirmContentWrapper}>
                                    <div className={styles.settingPopconfirmContent}>
                                        <div className={styles.timeSelectWrapper}>
                                            <span className={styles.displayRulesText}>
                                                {trans('global.displayRange', '显示范围')}
                                            </span>
                                            <span className={styles.remarkText}>
                                                {trans(
                                                    'global.forTeacherAndAddress',
                                                    '适用于教师/场地列表'
                                                )}
                                            </span>
                                        </div>
                                        <div className={styles.timeSelectWrapper}>
                                            <div className={styles.timeSelect}>
                                                <span> {trans('global.morning', '上午')}</span>
                                                <Select
                                                    onChange={(value) =>
                                                        this.timeSelectChange(
                                                            'morningLessonNum',
                                                            value
                                                        )
                                                    }
                                                    defaultValue={displayRules.morningLessonNum}
                                                >
                                                    <Option value={0}>0</Option>
                                                    <Option value={1}>1</Option>
                                                    <Option value={2}>2</Option>
                                                    <Option value={3}>3</Option>
                                                    <Option value={4}>4</Option>
                                                    <Option value={5}>5</Option>
                                                </Select>
                                            </div>
                                            <div className={styles.timeSelect}>
                                                <span> {trans('global.Afternoon', '下午')}</span>
                                                <Select
                                                    onChange={(value) =>
                                                        this.timeSelectChange(
                                                            'afternoonLessonNum',
                                                            value
                                                        )
                                                    }
                                                    defaultValue={displayRules.afternoonLessonNum}
                                                >
                                                    <Option value={0}>0</Option>
                                                    <Option value={1}>1</Option>
                                                    <Option value={2}>2</Option>
                                                    <Option value={3}>3</Option>
                                                    <Option value={4}>4</Option>
                                                    <Option value={5}>5</Option>
                                                </Select>
                                            </div>
                                            <div className={styles.timeSelect}>
                                                <span> {trans('global.Evening', '晚上')}</span>
                                                <Select
                                                    onChange={(value) =>
                                                        this.timeSelectChange(
                                                            'eveningLessonNum',
                                                            value
                                                        )
                                                    }
                                                    defaultValue={displayRules.eveningLessonNum}
                                                >
                                                    <Option value={0}>0</Option>
                                                    <Option value={1}>1</Option>
                                                    <Option value={2}>2</Option>
                                                    <Option value={3}>3</Option>
                                                    <Option value={4}>4</Option>
                                                    <Option value={5}>5</Option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className={styles.time}>
                                            <span>{trans('global.Grid Height', '课节高度')}</span>
                                            <Select
                                                onChange={this.lessonViewTableHeightChange}
                                                defaultValue={
                                                    JSON.parse(
                                                        localStorage.getItem(
                                                            'lessonViewTableHeightRatio'
                                                        )
                                                    )
                                                        ? JSON.parse(
                                                              localStorage.getItem(
                                                                  'lessonViewTableHeightRatio'
                                                              )
                                                          )
                                                        : 1
                                                }
                                            >
                                                {tableHeighArr.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </div>
                                    </div>
                                    <div className={styles.settingPopconfirmContent}>
                                        <span className={styles.displayRulesText}>显示内容</span>
                                        <div className={styles.time}>
                                            <CheckboxGroup
                                                defaultValue={
                                                    JSON.parse(localStorage.getItem('displayType'))
                                                        ? JSON.parse(
                                                              localStorage.getItem('displayType')
                                                          )
                                                        : [2, 4]
                                                }
                                                onChange={(checkedList) =>
                                                    this.showChange(checkedList, [6, 7])
                                                }
                                            >
                                                <Checkbox value={6}>
                                                    {trans(
                                                        'global.displayAbbreviation',
                                                        '显示简称（无简称则显示全称'
                                                    )}
                                                </Checkbox>
                                                <Checkbox value={7}>分层班显示班级简称</Checkbox>
                                                <div>
                                                    <span>走班课节展示</span>
                                                    <Radio.Group
                                                        onChange={this.displayDirectionChange}
                                                        style={{ marginLeft: 20 }}
                                                        value={displayDirection}
                                                    >
                                                        <Radio value={1}>纵向</Radio>
                                                        <Radio value={2}>横向</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </CheckboxGroup>
                                        </div>
                                    </div>
                                </div>
                            }
                            placement="bottom"
                            overlayClassName={styles.settingPopconfirm}
                            arrowPointAtCenter={true}
                        >
                            <Icon type="setting" />
                            &nbsp;
                            {trans('global.moreSetting', '更多设置')}
                        </Popconfirm>
                        {this.getLockList()}
                    </Fragment>
                ) : (
                    <Fragment>
                        <CheckboxGroup
                            defaultValue={
                                JSON.parse(localStorage.getItem('displayType'))
                                    ? JSON.parse(localStorage.getItem('displayType'))
                                    : [2, 4]
                            }
                            onChange={(checkedList) => this.showChange(checkedList, [2, 4])}
                        >
                            <Checkbox value={2}>
                                {trans('global.Display activities', '显示活动')}
                            </Checkbox>
                            <Checkbox value={4}>
                                {trans('global.Display courses', '显示课程')}
                            </Checkbox>
                        </CheckboxGroup>
                        <Popconfirm
                            title={
                                <div className={styles.settingPopconfirmContentWrapper}>
                                    <div className={styles.settingPopconfirmContent}>
                                        <span className={styles.displayRulesText}>
                                            {trans('global.displayRange', '显示范围')}
                                        </span>
                                        <div className={styles.time}>
                                            <span>{trans('global.timeRange', '展示时间范围')}</span>
                                            <Select
                                                value={startTimeValue}
                                                onChange={this.startTimeChange}
                                            >
                                                {startTimeArr.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.value}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                            <Select
                                                value={endTimeValue}
                                                onChange={this.endTimeChange}
                                            >
                                                {endTimeArr.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.value}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </div>
                                        <div className={styles.time}>
                                            <span>{trans('global.Grid Width', '课节宽度')}</span>
                                            <Select
                                                onChange={this.tableWidthChange}
                                                defaultValue={
                                                    JSON.parse(
                                                        localStorage.getItem('tableWidthRatio')
                                                    )
                                                        ? JSON.parse(
                                                              localStorage.getItem(
                                                                  'tableWidthRatio'
                                                              )
                                                          )
                                                        : 1
                                                }
                                            >
                                                {tableWidthArr.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </div>
                                        <div className={styles.time}>
                                            <span>{trans('global.Grid Height', '课节高度')}</span>
                                            <Select
                                                onChange={this.tableHeightChange}
                                                defaultValue={
                                                    JSON.parse(
                                                        localStorage.getItem('tableHeightRatio')
                                                    )
                                                        ? JSON.parse(
                                                              localStorage.getItem(
                                                                  'tableHeightRatio'
                                                              )
                                                          )
                                                        : 1
                                                }
                                            >
                                                {tableHeighArr.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </div>
                                    </div>
                                    <div className={styles.settingPopconfirmContent}>
                                        <span className={styles.displayRulesText}>显示内容</span>
                                        <div className={styles.time}>
                                            <CheckboxGroup
                                                defaultValue={
                                                    JSON.parse(localStorage.getItem('displayType'))
                                                        ? JSON.parse(
                                                              localStorage.getItem('displayType')
                                                          )
                                                        : [2, 4]
                                                }
                                                onChange={(checkedList) =>
                                                    this.showChange(checkedList, [3, 5, 6, 7])
                                                }
                                            >
                                                <Checkbox value={3}>
                                                    {trans(
                                                        'global.display class name',
                                                        '教师课表只显示班级'
                                                    )}
                                                </Checkbox>
                                                <Checkbox value={5}>
                                                    {trans(
                                                        'global.display course name',
                                                        '年级课表只显示课程'
                                                    )}
                                                </Checkbox>
                                                <Checkbox value={6}>
                                                    {trans(
                                                        'global.displayAbbreviation',
                                                        '显示简称（无简称则显示全称'
                                                    )}
                                                </Checkbox>
                                                <Checkbox value={7}>分层班显示班级简称</Checkbox>
                                            </CheckboxGroup>
                                        </div>
                                    </div>
                                </div>
                            }
                            placement="bottom"
                            overlayClassName={styles.settingPopconfirm}
                            arrowPointAtCenter={true}
                        >
                            <Icon type="setting" />
                            &nbsp;
                            {trans('global.moreSetting', '更多设置')}
                        </Popconfirm>
                        {this.getLockList()}
                    </Fragment>
                )}
                {lockModalVisible && (
                    <SimpleModal
                        visible={lockModalVisible}
                        title={`${lockType === 'lock' ? '锁定' : '解锁'}排课结果`}
                        onOk={this.confirmLockOrUnLock}
                        onCancel={this.toggleLockModalVisible}
                        maskClosable={false}
                        confirmLoading={lockConfirmLoading}
                        content={
                            <div className={styles.lockModalContent}>
                                <Row>
                                    <Col span={5} className={styles.gradeRange}>
                                        <span className={styles.icon}>*</span>
                                        <span>年级范围：</span>
                                    </Col>
                                    <Col span={19}>
                                        <Checkbox
                                            indeterminate={indeterminateGrade}
                                            onChange={this.onCheckAllChange}
                                            checked={checkAllGrade}
                                            style={{ marginBottom: 10 }}
                                        >
                                            全部年级
                                        </Checkbox>
                                        <CheckboxGroup
                                            onChange={this.selectedGradeChange}
                                            value={selectedGradeIdList}
                                        >
                                            <Row>
                                                {customGradeList.map((item) => (
                                                    <Col span={8}>
                                                        <Checkbox
                                                            value={item.id}
                                                            style={{ marginBottom: 10 }}
                                                        >
                                                            {item.name}
                                                        </Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </CheckboxGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={5}>
                                        <span className={styles.instructions}>操作说明：</span>
                                    </Col>
                                    <Col span={19}>
                                        <span className={styles.instructionsText}>
                                            如需要按照节次或课程等维度进行锁定或解锁，可以切换到视图，点击右侧工具栏【批量】-【批量锁定】进行操作
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        }
                    />
                )}
            </div>
        );
    }
}
