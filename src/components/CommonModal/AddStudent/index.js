import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Modal, Icon, Select, Checkbox, Row, Col, message, Button } from 'antd';
import { locale, trans } from '../../../utils/i18n';
import { intersectionWith, isEmpty, isEqual, remove, uniqWith } from 'lodash';
const { Option } = Select;
@connect((state) => ({
    studentListOfClass: state.courseBaseDetail.studentListOfClass,
    addStudentGradeList: state.courseBaseDetail.addStudentGradeList,
    addStudentClassList: state.courseBaseDetail.addStudentClassList,
    addStudentStudentList: state.courseBaseDetail.addStudentStudentList,
    totalAddStudentStudentList: state.courseBaseDetail.totalAddStudentStudentList,
}))
export default class AddStudent extends PureComponent {
    state = {
        gradeId: '',
        groupId: '',
        keyword: '',
        selectedStudentList: [],
        ifPaste: false, //是否是拷贝进来的内容
        studentSelectEmptyValue: undefined,
        confirmBtnLoading: false,
    };

    componentDidMount() {
        this.getStudentList('total');
        //监听是否是粘贴
        document.onpaste = () => {
            this.setState({
                ifPaste: true,
            });
        };
    }

    getStudentList = (type) => {
        const { dispatch, semesterValue, sourceType, planId, classIdList } = this.props;
        const { gradeId, groupId, keyword } = this.state;
        let basePayload = {
            gradeId,
            keyword,
            type,
        };
        let payload;
        if (sourceType === 'courseBaseDetail') {
            payload = {
                ...basePayload,
                planId,
                classId: groupId,
                classIdList,
            };
        } else {
            payload = {
                ...basePayload,
                semesterId: semesterValue,
                groupId,
            };
        }
        dispatch({
            type: 'courseBaseDetail/getAddStudentRelatedList',
            payload,
        });
    };

    closeClick = () => {
        const { toggleVisible } = this.props;
        typeof toggleVisible === 'function' && toggleVisible();
    };

    confirmClick = () => {
        const { addStudentConfirm } = this.props;
        let filterStudentList = this.filterSelectedStudentListByStudentId();
        if (filterStudentList.length === 0) {
            message.warn(trans('tc.base.check.add.student', '请先勾选要添加的学生'));
            return;
        }

        if (addStudentConfirm && typeof addStudentConfirm === 'function') {
            this.setState({
                confirmBtnLoading: true,
            });
            let selectedStudentIdList = filterStudentList.map((item) => item.studentId);
            addStudentConfirm(selectedStudentIdList).then(() => {
                this.setState({
                    confirmBtnLoading: false,
                });
                this.closeClick();
            });
        }
    };

    getHeaderHtml = () => {
        const { confirmBtnLoading } = this.state;
        return (
            <Fragment>
                <Icon type="close" onClick={this.closeClick} />
                <span>选择学生</span>
                <Button
                    className={styles.confirmBtn}
                    onClick={this.confirmClick}
                    loading={confirmBtnLoading}
                >
                    确定
                </Button>
            </Fragment>
        );
    };

    getSelectStudentHtml = () => {
        const { totalAddStudentStudentList } = this.props;
        const { selectedStudentList, studentSelectEmptyValue } = this.state;
        let filterStudentList = this.filterSelectedStudentListByStudentId();
        return (
            <div className={styles.selectStudent + ' ' + styles.commonStyle}>
                <div className={styles.selectStudentHeader}>
                    <span>已选择：{filterStudentList.length}名学生</span>
                    <span className={styles.icon}>
                        <Icon type="delete" />
                        <span onClick={() => this.deleteSelectedStudentList()}>清空</span>
                    </span>
                </div>
                <div className={styles.selectedStudentList}>
                    {!isEmpty(selectedStudentList) && (
                        <div className={styles.list}>
                            {selectedStudentList.map((item, index) => {
                                let includeFlag = item.studentId;
                                console.log('includeFlag :>> ', includeFlag);
                                return (
                                    <div
                                        className={
                                            includeFlag
                                                ? styles.selectedStudentItem
                                                : styles.noIncludeStudentItem
                                        }
                                    >
                                        <span className={styles.name}>{item.studentName}</span>
                                        <Icon
                                            className={styles.icon}
                                            type="close"
                                            onClick={() =>
                                                this.deleteSelectedStudentList(item, index)
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div className={styles.search}>
                        <Select
                            style={{ width: '100%' }}
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                            }
                            value={studentSelectEmptyValue}
                            // searchValue={studentSelectEmptyValue}
                            searchValue="a"
                            placeholder="输入姓名关键字搜索，或者复制粘贴（多个学生请用 , ; ，；、/ | 等字符分隔开哦）"
                            onSelect={this.studentSelectOnChange}
                            onSearch={this.studentSelectOnSearch}
                            showArrow={false}
                            // autoFocus={true}
                            allowClear={true}
                        >
                            {totalAddStudentStudentList.map((item) => (
                                <Option key={item.studentId} value={item.studentId}>
                                    {item.studentName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>
        );
    };

    handleGradeChange = (value) => {
        const { gradeId } = this.state;
        if (gradeId === value) {
            return;
        }
        this.setState(
            {
                gradeId: value,
                groupId: '',
            },
            () => {
                this.getStudentList('grade');
            }
        );
    };

    handleClassChange = (value) => {
        const { groupId } = this.state;
        if (groupId === value) {
            return;
        }
        this.setState(
            {
                groupId: value,
            },
            () => {
                this.getStudentList('class');
            }
        );
    };

    handleStudentChange = (e, studentItem) => {
        const { selectedStudentList } = this.state;
        let copySelectedStudentList = [...selectedStudentList];
        if (e.target.checked) {
            copySelectedStudentList.push(studentItem);
        } else {
            remove(copySelectedStudentList, (item) => item.studentId === studentItem.studentId);
        }
        this.setState({
            selectedStudentList: copySelectedStudentList,
        });
    };

    getClassListHtml = () => {
        const { addStudentGradeList, addStudentClassList } = this.props;
        const { gradeId, groupId } = this.state;
        return (
            <div className={styles.classList + ' ' + styles.commonStyle}>
                <div className={styles.gradeList}>
                    <Select
                        value={gradeId}
                        onChange={this.handleGradeChange}
                        style={{ width: '100%' }}
                    >
                        <Option value={''} key="all">
                            {trans('course.plan.allGrade', '全部年级')}
                        </Option>
                        {addStudentGradeList.map((item) => {
                            return (
                                <Option value={item.id} key={item.id}>
                                    {locale() != 'en' ? item.orgName : item.orgEname}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
                <div className={styles.studentGroupList}>
                    <div
                        onClick={() => this.handleClassChange('')}
                        className={
                            styles.classItem +
                            ' ' +
                            (groupId === '' ? styles.selectedClassItem : ' ')
                        }
                    >
                        <span>{trans('course.plan.allClass', '所有班级')}</span>
                    </div>
                    {addStudentClassList.map((item) => (
                        <div
                            onClick={() => this.handleClassChange(item.classId)}
                            key={item.classId}
                            className={
                                styles.classItem +
                                ' ' +
                                (groupId === item.classId ? styles.selectedClassItem : ' ')
                            }
                        >
                            <span>{locale() != 'en' ? item.className : item.classEname}</span>
                            {this.getStudentCount(item) !== 0 && (
                                <span className={styles.count}>{this.getStudentCount(item)}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    getStudentListHtml = () => {
        const { addStudentStudentList, sourceType } = this.props;
        const { selectedStudentList } = this.state;
        console.log('selectedStudentList :>> ', selectedStudentList);
        return (
            <div className={styles.studentList + ' ' + styles.commonStyle}>
                <Checkbox
                    checked={this.judgeIsSelectAllStudent()}
                    key={-1}
                    onChange={this.selectAllStudent}
                >
                    全部学生
                    {sourceType === 'courseBaseDetail'
                        ? '（仅显示本次选课各批次中已添加的学生）'
                        : ''}
                </Checkbox>
                <Row>
                    {addStudentStudentList.map((item) => (
                        <Col span={12}>
                            <Checkbox
                                value={item.studentId}
                                key={item.studentId}
                                checked={selectedStudentList
                                    .map((studentItem) => studentItem.studentId)
                                    .includes(item.studentId)}
                                onChange={(e) => this.handleStudentChange(e, item)}
                            >
                                {item.studentName}
                            </Checkbox>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    };

    selectAllStudent = (e) => {
        const { addStudentStudentList } = this.props;
        const { selectedStudentList } = this.state;
        let copySelectedStudentList = [...selectedStudentList];
        let checked = e.target.checked;

        //如果全部学生勾选，合并之前的学生列表和当前学生列表，并去重
        if (checked) {
            copySelectedStudentList = uniqWith(
                [...copySelectedStudentList, ...addStudentStudentList],
                isEqual
            );
        } else {
            //如果取消学生勾选，在已选学生列表中去除当前学生列表
            remove(copySelectedStudentList, (item) =>
                addStudentStudentList.map((item) => item.studentId).includes(item.studentId)
            );
        }
        this.setState({
            selectedStudentList: copySelectedStudentList,
        });
    };

    judgeIsSelectAllStudent = () => {
        const { addStudentStudentList } = this.props;
        const { selectedStudentList } = this.state;
        //判断mapIdList是否是studentIdList的子集
        //先算出两个数组的交集，之后判断交集长度是否和mapIdList长度一致
        if (
            intersectionWith(selectedStudentList, addStudentStudentList, isEqual).length ===
            addStudentStudentList.length
        ) {
            return true;
        } else {
            return false;
        }
    };

    getStudentCount = (classItem) => {
        const { selectedStudentList } = this.state;
        return selectedStudentList.filter((item) => item.classId === classItem.classId).length;
    };

    deleteSelectedStudentList = (studentItem, index) => {
        const { selectedStudentList } = this.state;
        if (!studentItem) {
            this.setState({
                selectedStudentList: [],
            });
        } else {
            this.setState({
                selectedStudentList: selectedStudentList.toSpliced(index, 1),
            });
        }
    };

    studentSelectOnChange = (value, option) => {
        const { totalAddStudentStudentList } = this.props;
        const { selectedStudentList } = this.state;
        let targetStudentItem = totalAddStudentStudentList.find((item) => item.studentId === value);
        if (targetStudentItem) {
            if (targetStudentItem) {
                if (
                    selectedStudentList.find(
                        (item) => item.studentId === targetStudentItem.studentId
                    )
                ) {
                    message.warning(`${targetStudentItem.studentName}已选择`);
                } else {
                    this.setState({
                        selectedStudentList: [...selectedStudentList, targetStudentItem],
                    });
                }
            }
        }
    };

    studentSelectOnSearch = (value) => {
        const { totalAddStudentStudentList } = this.props;
        const { ifPaste, selectedStudentList } = this.state;
        if (ifPaste) {
            console.log('value :>> ', value);
            let res = [];
            let nameList = value.split(/[,｜;，；、/|\s\n]/);
            nameList.forEach((nameItem) => {
                let num = 0;
                let targetItem;

                //在总的学生列表里面找是否存在，及其数量
                totalAddStudentStudentList.forEach((item) => {
                    if (item.studentName === nameItem || item.studentEname === nameItem) {
                        num++;
                        targetItem = item;
                    }
                });

                //判断是否重复
                if (num > 1) {
                    message.warning('该学生存在重名');
                }

                //如果存在并且数量是1，推入
                //如果不存在，或者数量大于2，标红
                if (targetItem && num === 1) {
                    if (
                        selectedStudentList.find((item) => item.studentId === targetItem.studentId)
                    ) {
                        message.warning(`${targetItem.studentName}已选择`);
                    } else {
                        res.push(targetItem);
                    }
                } else {
                    res.push({ studentName: nameItem });
                }
            });
            this.setState({
                selectedStudentList: uniqWith([...selectedStudentList, ...res], isEqual),
                // studentSelectEmptyValue: undefined,
            });
        }
        this.setState({
            ifPaste: false,
        });
    };

    filterSelectedStudentListByStudentId = () => {
        const { selectedStudentList } = this.state;
        return selectedStudentList.filter((item) => item.studentId);
    };

    render() {
        console.log('render');
        const { visible } = this.props;
        return (
            <Modal
                width="900px"
                maskClosable={false}
                footer={null}
                closable={false}
                visible={visible}
                wrapClassName={styles.addStudentWrapper}
            >
                <div className={styles.addStudent}>
                    <div className={styles.header}>{this.getHeaderHtml()}</div>
                    <div className={styles.content}>
                        {this.getSelectStudentHtml()}
                        {this.getClassListHtml()}
                        {this.getStudentListHtml()}
                    </div>
                </div>
            </Modal>
        );
    }
}
