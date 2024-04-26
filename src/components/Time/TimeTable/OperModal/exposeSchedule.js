import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './exposeSchedule.less';
import { Modal, DatePicker, message, Table, Checkbox, Row, Col, Radio, Input, Space } from 'antd';
import { mockForm } from '../../../../utils/utils';

@connect((state) => ({
    teacherIdList: state.timeTable.teacherIdList,
    studentIdList: state.timeTable.studentIdList,
    customCourseSearchIndex: state.lessonView.customCourseSearchIndex,
    tableView: state.timeTable.tableView,
}))
export default class ExposeSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            exposeInfo: ['course'],
            exportType: 0,
            showCourse: true,
            showAddress: false,
            showTeacher: false,
            showGroup: false,
            newExportType: 0,
            onePage: false,
            morePage: false,
            showRestSet: false,
            restSetInfo: '',
            showCourseName: true,
            showSubject: false,
            showWholeGroup: true,
            showSimpleGroup: false,
            course: 1,
            Class: 1,
            showTitle: true,
            title: 1,
            otherOptions: ['title'],
            showScheduleDetail: false,
            showLogo: false,
        };
    }

    handleCancel = () => {
        const { hideModal } = this.props;
        this.setState({
            exposeInfo: ['course'],
            exportType: 0,
            showCourse: true,
            showAddress: false,
            showTeacher: false,
            showGroup: false,
            newExportType: 0,
            onePage: false,
            morePage: false,
            showRestSet: false,
            restSetInfo: '',
        });
        typeof hideModal == 'function' && hideModal('exposeSchedule');
    };

    selectExposeInfo = (checkedValue) => {
        if (checkedValue.indexOf('course') > -1) {
            this.setState({
                showCourse: true,
            });
        } else {
            console.log('ppp');
            this.setState({
                showCourse: false,
            });
        }
        if (checkedValue.indexOf('address') > -1) {
            this.setState({
                showAddress: true,
            });
        } else {
            this.setState({
                showAddress: false,
            });
        }
        if (checkedValue.indexOf('teacher') > -1) {
            this.setState({
                showTeacher: true,
            });
        } else {
            this.setState({
                showTeacher: false,
            });
        }
        if (checkedValue.indexOf('class') > -1) {
            this.setState({
                showGroup: true,
            });
        } else {
            this.setState({
                showGroup: false,
            });
        }
        this.setState({
            exposeInfo: checkedValue,
        });
    };

    selectExposeFormat = (e) => {
        this.setState({
            exportType: e.target.value,
        });
    };

    newExportTypeChange = (e) => {
        this.setState({
            newExportType: e.target.value,
        });
    };

    setRest = (e) => {
        this.setState({
            restSetInfo: e.target.value,
        });
    };

    comfrimExpose = () => {
        const {
            dispatch,
            versionId,
            gradeValue,
            courseValue,
            scheduleObjectList,
            teacherIdList,
            studentIdList,
            searchIndex,
            customCourseSearchIndex,
            tableView,
        } = this.props;
        const {
            exposeInfo,
            newExportType,
            restSetInfo,
            onePage,
            showCourse,
            showAddress,
            showTeacher,
            showGroup,
            exportType,
            showCourseName,
            showSubject,
            showWholeGroup,
            showSimpleGroup,
            otherOptions,
            title,
            showScheduleDetail,
            showLogo,
        } = this.state;
        let exportOptions = {};
        exportOptions.ifShowNonClassSchedule = restSetInfo == 'classTime' ? true : false;
        exportOptions.ifShowAttendClassSchedule = restSetInfo == 'notClassTime' ? true : false;
        exportOptions.sheetTypeSchedule = onePage ? 0 : 1;
        exportOptions.showCourse = showCourse ? showCourseName : false;
        exportOptions.showSubject = showSubject;
        exportOptions.showGroup = showGroup ? showWholeGroup : false;
        exportOptions.showSimpleGroup = showSimpleGroup;
        exportOptions.showAddress = showAddress;
        exportOptions.showTeacher = showTeacher;
        exportOptions.showScheduleDetail = true;
        exportOptions.showLogo = showLogo;
        exportOptions.showTime = title === 1;
        exportOptions.showChiefTutor = title === 2;
        let obj = {};
        obj.versionId = versionId;
        obj.gradeIdList = gradeValue;
        obj.courseIdList = courseValue;
        obj.scheduleObjectList = scheduleObjectList;
        obj.exportOptions = exportOptions;
        obj.exportType = exportType;
        obj.teacherIdList = teacherIdList;
        obj.studentIdList = studentIdList;
        obj.newExportType = newExportType;
        obj.newWeekSchedule =
            tableView == 'timeLineView' ? searchIndex == 0 : customCourseSearchIndex == 0;

        console.log('obj', obj);
        let json = JSON.stringify(obj);
        let lastJson = encodeURI(json);
        // window.open(`/api/scheduleResult/exportExcelResult?stringData=${lastJson}`)
        mockForm('/api/scheduleResult/exportExcelResult', { stringData: lastJson });
        this.setState({
            exposeInfo: ['course'],
            exportType: 0,
            showCourse: true,
            showAddress: false,
            showTeacher: false,
            showGroup: false,
        });
        this.handleCancel();
    };

    changeCourseName = (e) => {
        this.setState({
            course: e.target.value,
        });
        if (e.target.value == 1) {
            this.setState({
                showCourseName: true,
                showSubject: false,
            });
        } else if (e.target.value == 2) {
            this.setState({
                showCourseName: false,
                showSubject: true,
            });
        }
    };
    changeSimpleName = (e) => {
        this.setState({
            Class: e.target.value,
        });
        if (e.target.value == 1) {
            this.setState({
                showWholeGroup: true,
                showSimpleGroup: false,
            });
        } else if (e.target.value == 2) {
            this.setState({
                showWholeGroup: false,
                showSimpleGroup: true,
            });
        }
    };

    otherOptionsChange = (otherOptions) => {
        const { title } = this.state;
        this.setState({
            otherOptions,
        });
        if (otherOptions.indexOf('title') > -1) {
            this.setState({
                showTitle: true,
                title: title ? title : 1,
            });
        } else {
            this.setState({
                showTitle: false,
                title: 1,
            });
        }
        this.setState({
            showScheduleDetail: otherOptions.indexOf('scheduleDetail') > -1,
            showLogo: otherOptions.indexOf('logo') > -1,
        });
    };

    changeTitle = (e) => {
        this.setState({
            title: e.target.value,
        });
    };

    render() {
        const {
            exposeModal,
            searchIndex,
            idNum,
            textType,
            scheduleObjectList,
            customCourseSearchIndex,
        } = this.props;
        const { newExportType, exportType } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <Modal
                visible={exposeModal}
                title="导出课表"
                footer={null}
                onCancel={this.handleCancel}
                width={600}
                centered
            >
                <p className={styles.remark}>{`系统将导出当前显示的${idNum}个${textType}课表`}</p>
                <div>
                    <span>导出信息</span>
                    <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={this.selectExposeInfo}
                        className={styles.exposeCheck}
                        value={this.state.exposeInfo}
                    >
                        <Row>
                            <div className={styles.msgStyle}>
                                <Col span={24}>
                                    <Checkbox value="course">课程</Checkbox>
                                    {this.state.showCourse ? (
                                        <Radio.Group
                                            value={this.state.course}
                                            onChange={this.changeCourseName}
                                        >
                                            <Radio value={1}>显示课程名</Radio>
                                            <Radio value={2}>显示学科名</Radio>
                                        </Radio.Group>
                                    ) : (
                                        ''
                                    )}
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="class">班级</Checkbox>
                                    {this.state.showGroup ? (
                                        <Radio.Group
                                            value={this.state.Class}
                                            onChange={this.changeSimpleName}
                                        >
                                            <Radio value={1}>显示完整名称</Radio>
                                            <Radio value={2}>显示简称</Radio>
                                        </Radio.Group>
                                    ) : (
                                        ''
                                    )}
                                </Col>

                                <Col span={24}>
                                    <Checkbox value="teacher">教师</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Checkbox value="address">场地</Checkbox>
                                </Col>
                            </div>
                        </Row>
                    </Checkbox.Group>
                </div>
                <div>
                    <span>导出格式</span>
                    <Radio.Group
                        style={{ width: '100%' }}
                        onChange={this.selectExposeFormat}
                        className={styles.exposeCheck}
                        value={this.state.exportType}
                    >
                        <Row>
                            <Col span={24} className={styles.formatStyle}>
                                <Radio value={0}>
                                    周课表（导出的维度、范围和当前课表展示一致）
                                </Radio>
                            </Col>
                            <Col
                                span={24}
                                className={styles.formatStyle}
                                style={{
                                    display: !scheduleObjectList.every(
                                        (item) =>
                                            item.scheduleQueryType === 0 ||
                                            item.scheduleQueryType === 1
                                    )
                                        ? 'none'
                                        : 'block',
                                }}
                            >
                                <Radio
                                    value={1}
                                    disabled={
                                        !scheduleObjectList.every(
                                            (item) =>
                                                item.scheduleQueryType === 0 ||
                                                item.scheduleQueryType === 1
                                        )
                                    }
                                >
                                    班级总表（一列一个班级）
                                </Radio>
                            </Col>
                            <Col
                                span={24}
                                className={styles.formatStyle}
                                style={{
                                    display: !scheduleObjectList.every(
                                        (item) =>
                                            item.scheduleQueryType === 0 ||
                                            item.scheduleQueryType === 1
                                    )
                                        ? 'none'
                                        : 'block',
                                }}
                            >
                                <Radio
                                    value={3}
                                    disabled={
                                        !scheduleObjectList.every(
                                            (item) =>
                                                item.scheduleQueryType === 0 ||
                                                item.scheduleQueryType === 1
                                        )
                                    }
                                >
                                    班级总表（一行一个行政班， 教学班单独合并为一行，支持再导入）
                                </Radio>
                            </Col>
                            <Col
                                span={24}
                                className={styles.formatStyle}
                                style={{
                                    display: !scheduleObjectList.every(
                                        (item) =>
                                            item.scheduleQueryType === 0 ||
                                            item.scheduleQueryType === 1 ||
                                            item.scheduleQueryType === 2
                                    )
                                        ? 'none'
                                        : 'block',
                                }}
                            >
                                <Radio
                                    value={2}
                                    disabled={
                                        !scheduleObjectList.every(
                                            (item) =>
                                                item.scheduleQueryType === 0 ||
                                                item.scheduleQueryType === 1 ||
                                                item.scheduleQueryType === 2
                                        )
                                    }
                                >
                                    学生总表（一行一个学生）
                                </Radio>
                            </Col>
                            <Col
                                span={24}
                                className={styles.formatStyle}
                                style={{
                                    display: !scheduleObjectList.every(
                                        (item) =>
                                            item.scheduleQueryType === 0 ||
                                            item.scheduleQueryType === 1
                                    )
                                        ? 'none'
                                        : 'block',
                                }}
                            >
                                <Radio
                                    value={5}
                                    disabled={
                                        !scheduleObjectList.every(
                                            (item) =>
                                                item.scheduleQueryType === 0 ||
                                                item.scheduleQueryType === 1
                                        )
                                    }
                                    width={350}
                                >
                                    班级总表（一行一个行政班，教学班合并到行政班展示）
                                </Radio>
                            </Col>
                            <Col
                                span={24}
                                className={styles.formatStyle}
                                style={{
                                    display: !scheduleObjectList.every(
                                        (item) =>
                                            item.scheduleQueryType === 0 ||
                                            item.scheduleQueryType === 1 ||
                                            item.scheduleQueryType === 4
                                    )
                                        ? 'none'
                                        : 'block',
                                }}
                            >
                                <Radio
                                    value={4}
                                    disabled={
                                        !scheduleObjectList.every(
                                            (item) =>
                                                item.scheduleQueryType === 0 ||
                                                item.scheduleQueryType === 1 ||
                                                item.scheduleQueryType === 4
                                        )
                                    }
                                >
                                    场地总表（一列一个场地）
                                </Radio>
                            </Col>
                            <Col span={24} className={styles.formatStyle}>
                                <Radio
                                    value={6}
                                    /* disabled={
                                        !scheduleObjectList.every(
                                            (item) => item.scheduleQueryType === 0
                                        )
                                    } */
                                    style={{
                                        display: !scheduleObjectList.every(
                                            (item) =>
                                                item.scheduleQueryType === 0 ||
                                                item.scheduleQueryType === 3 ||
                                                item.scheduleQueryType === 1
                                        )
                                            ? 'none'
                                            : 'block',
                                    }}
                                >
                                    教师总表（一行一个教师）
                                </Radio>
                            </Col>
                        </Row>
                    </Radio.Group>
                </div>
                {(searchIndex == 0 || customCourseSearchIndex == 0) && exportType == 0 && (
                    <div style={{ marginTop: '-20px' }}>
                        <span>排版格式</span>
                        <Radio.Group
                            onChange={this.newExportTypeChange}
                            value={newExportType}
                            style={{ width: '100%' }}
                            className={styles.exposeCheck}
                        >
                            <Row>
                                <Col span={24} className={styles.formatStyle}>
                                    <Radio value={0}>固定行高（排版固定，方便打印）</Radio>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className={styles.formatStyle}>
                                    <Radio value={1}>动态行高（分层走班不合并）</Radio>
                                </Col>
                            </Row>
                        </Radio.Group>
                    </div>
                )}
                {(searchIndex == 0 || customCourseSearchIndex == 0) && exportType == 0 && (
                    <div style={{ marginTop: '-20px' }}>
                        <span>其他选项</span>
                        <Checkbox.Group
                            className={styles.exposeCheck}
                            style={{ width: '100%' }}
                            onChange={this.otherOptionsChange}
                            value={this.state.otherOptions}
                        >
                            <Row>
                                <div className={styles.msgStyle}>
                                    <Col span={24}>
                                        <Checkbox value="title">标题角注</Checkbox>
                                        {this.state.showTitle ? (
                                            <Radio.Group
                                                value={this.state.title}
                                                onChange={this.changeTitle}
                                            >
                                                <Radio value={1}>显示生效日期</Radio>
                                                <Radio value={2}>显示班主任</Radio>
                                            </Radio.Group>
                                        ) : (
                                            ''
                                        )}
                                    </Col>
                                    {/* <Col span={24}>
                                        <Checkbox value="scheduleDetail">作息</Checkbox>
                                    </Col> */}

                                    <Col span={24}>
                                        <Checkbox value="logo">Logo</Checkbox>
                                    </Col>
                                </div>
                            </Row>
                        </Checkbox.Group>
                    </div>
                )}

                {this.state.showRestSet && (
                    <div className={styles.setRest}>
                        <span className={styles.text}>作息设置</span>
                        <Radio.Group onChange={this.setRest} value={this.state.restSetInfo}>
                            <Radio value="classTime" style={radioStyle}>
                                只导出上课时段
                            </Radio>
                            <Radio value="notClassTime" style={radioStyle}>
                                同时导出非上课时段（仅当导出范围为单个作息时有效）
                            </Radio>
                        </Radio.Group>
                    </div>
                )}
                <div className={styles.btns} style={{ marginTop: '-30px' }}>
                    <span onClick={this.handleCancel}>取消</span>
                    <span onClick={this.comfrimExpose}>确定</span>
                </div>
            </Modal>
        );
    }
}
