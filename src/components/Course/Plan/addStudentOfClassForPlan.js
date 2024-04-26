import React from 'react';
import styles from './addStudent.less';
import { Modal, Input, Button, Icon, Select, Checkbox, Spin, Row, Col, message } from 'antd';
import NavTitle from './navTitle';
import { connect } from 'dva';
import powerUrl from '../../../assets/noData.png';
import { getUrlSearch } from '../../../utils/utils';
import { trans, locale } from '../../../utils/i18n';

const { Option } = Select;

@connect((state) => ({
    studentListOfClass: state.courseBaseDetail.studentListOfClass,
}))
class AddStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: getUrlSearch('chooseCoursePlanId'),
            total: 0, // 默认总页数
            allTotal: 0, // 总学生个数
            gradeId: '',
            classId: '',
            classIds: [], // 班级ID集合
            studentName: '', // 搜索的学生名字
            classIndex: -1, // 默认选中第一个所有班级
            gradeList: [], // 年级列表
            classList: [], // 班级列表分类
            originalStudentList: [], // 原始学生列表格式
            studentList: [], // 学生列表
            studentIdsList: [], // 选中的学生
            allChecked: false, // 默认不是全选
            loading: false, // 每次搜索加载中
            studentsMap: new Map(), // 所有学生 id-学生信息map结构
            map: new Map(), // 每次搜索完 年级ID-班级ID-名称 组合的 map缓存结构
            classMap: new Map(), // 每个班对应的人数集合
            okLoad: false, // 提交中
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visibleAddStudent != this.props.visibleAddStudent) {
            if (nextProps.visibleAddStudent) {
                this.initStudentData();
            }
        }
    }

    componentDidMount() {}

    /**
     * 初始化搜索的学生
     * @param {*} nextLoad
     */
    initStudentData = (nextLoad = false) => {
        const { dispatch, classIdList } = this.props;
        let self = this;
        let { planId, studentName, gradeId, classId, map, studentsMap, studentIdsList, classMap } =
            self.state;
        let attrName = this.getAttrName();

        // 如果有缓存数据，则不再请求接口
        if (map.has(attrName)) {
            let { originalStudentList } = map.get(attrName);
            let allChecked = true;
            originalStudentList.forEach((el) => {
                if (!studentIdsList.includes(el.studentId)) {
                    allChecked = false;
                    return;
                }
            });

            this.setState({
                allChecked,
            });
            this.setState(map.get(attrName));
            return;
        }

        self.setState({
            loading: false,
        });
        dispatch({
            type: 'courseBaseDetail/studentListOfClass',
            payload: {
                planId,
                keyword: studentName,
                gradeId,
                classId,
                classIdList,
            },
        }).then(() => {
            let {
                gradeList = [],
                classList = [],
                studentList = [],
            } = self.props.studentListOfClass || {};

            let allTotal = 0;
            // 每个班对应的学生
            let classIdsOfStudentMap = {};
            studentList.forEach((el, i) => {
                if (el.addedFlag == 0) {
                    if (classIdsOfStudentMap[String(el.classId)]) {
                        classIdsOfStudentMap[String(el.classId)].push(el.studentId);
                    } else {
                        classIdsOfStudentMap[String(el.classId)] = [el.studentId];
                    }

                    allTotal++;
                    studentsMap.set(String(el.studentId), el);
                }
            });

            classList = classList.map((el) => {
                // 初始化班级空数组
                if (!classMap.has(String(el.classId))) {
                    classMap.set(String(el.classId), []);
                }
                return {
                    ...el,
                    checkedStudentIds: [], // 对应选中的ID个数
                    allStudentIds: classIdsOfStudentMap[String(el.classId)] || [], // 对应本班所有学生ID集合
                };
            });

            // 选中的结果中合并所有搜索历史的学生ID
            // ...

            let allChecked = true;
            studentList.forEach((el) => {
                if (!studentIdsList.includes(el.studentId)) {
                    allChecked = false;
                    return;
                }
            });

            let obj = {
                gradeList,
                classList,
                studentList: self.arrTrans(3, studentList),
                originalStudentList: studentList,
                allTotal,
            };

            // 组合
            map.set(attrName, obj);

            // 更新数据
            this.setState(
                Object.assign(
                    {
                        studentsMap,
                        loading: true,
                        allChecked,
                        classMap,
                    },
                    obj
                )
            );
        });
    };

    // 年级-班级-学生名-对应的分班班级 组合的 map 属性名
    getAttrName() {
        let { classIdList } = this.props;
        let { studentName, gradeId, classId } = this.state;
        let attrName = `ZM_${gradeId}_${classId}_${this.charCode(studentName)}_${classIdList.join(
            ''
        )}`;
        return attrName;
    }

    charCode(name) {
        if (!name) {
            return '';
        }
        let code = '';
        for (let i = 0; i < name.length; i++) {
            code += name[i].charCodeAt();
        }
        return code;
    }

    arrTrans(num, arr) {
        // 一维数组转换为二维数组
        const iconsArr = []; // 声明数组
        arr.forEach((item, index) => {
            const page = Math.floor(index / num); // 计算该元素为第几个素组内
            if (!iconsArr[page]) {
                // 判断是否存在
                iconsArr[page] = [];
            }
            iconsArr[page].push(item);
        });
        return iconsArr;
    }

    handleOkAddStudent = () => {
        let { planId, studentIdsList, okLoad } = this.state;
        let { classIdList, dispatch } = this.props;
        if (studentIdsList.length === 0) {
            message.warn(trans('tc.base.check.add.student', '请先勾选要添加的学生'));
            return;
        }

        if (okLoad) {
            return;
        }
        this.setState({
            okLoad: true,
        });

        dispatch({
            type: 'courseBaseDetail/addStudentClass',
            payload: {
                planId,
                classId: classIdList[0],
                courseId: getUrlSearch('courseId'),
                coursePlanningId: getUrlSearch('coursePlanningId'),
                userIdList: studentIdsList,
            },
        }).then(() => {
            this.setState({
                okLoad: false,
            });
            this.onCancel();
            this.resetSearch();
            let { getStudentTable, self } = this.props;
            typeof getStudentTable === 'function' && getStudentTable.call(self);
        });
    };

    // 重置所有条件
    resetSearch = () => {
        this.setState({
            total: 0, // 默认总页数
            gradeId: '',
            classId: '',
            studentName: '', // 搜索的学生名字
            classIndex: -1, // 默认选中第一个所有班级
            originalStudentList: [], // 原始学生列表格式
            studentList: [], // 学生列表
            studentIdsList: [], // 选中的学生
            map: new Map(),
            classMap: new Map(),
        });
    };

    onCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'visibleAddStudent');
    };

    // 切换年级，搜索对应班级
    handleChangeGrade = (value) => {
        let { loading, gradeId } = this.state;
        if (!loading) {
            message.warn(trans('tc.base.data.is.loading', '数据正在请求中,请稍后...'));
            return;
        }
        if (gradeId == value) {
            return;
        }
        this.setState(
            {
                gradeId: value,
                classIndex: -1,
            },
            () => {
                this.initStudentData();
            }
        );
    };

    // 切换班级
    tabClass = (i, classId) => {
        let { loading, classIndex } = this.state;
        if (!loading) {
            message.warn(trans('tc.base.data.is.loading', '数据正在请求中,请稍后...'));
            return;
        }
        if (classIndex === i) {
            return;
        }

        this.setState(
            {
                classId,
                classIndex: i,
            },
            () => {
                this.initStudentData();
            }
        );
    };

    leftHTML() {
        let { gradeList, gradeId, classList, classIndex, classMap } = this.state;
        return (
            <div>
                <div className={styles.gradeList}>
                    <Select
                        defaultValue={gradeId}
                        style={{ width: '100%' }}
                        className={styles.select}
                        onChange={this.handleChangeGrade}
                    >
                        <Option value={''} key="all">
                            {trans('course.plan.allGrade', '全部年级')}
                        </Option>
                        {gradeList.length > 0 &&
                            gradeList.map((item, index) => {
                                return (
                                    <Option value={item.id} key={index}>
                                        {locale() != 'en' ? item.orgName : item.orgEname}
                                    </Option>
                                );
                            })}
                    </Select>
                </div>
                <div className={styles.classList}>
                    <div
                        onClick={this.tabClass.bind(this, -1, '')}
                        className={
                            classIndex === -1 ? `${styles.item} ${styles.active}` : styles.item
                        }
                    >
                        <span>{trans('course.plan.allClass', '所有班级')}</span>
                        <span></span>
                    </div>
                    {classList &&
                        classList.length > 0 &&
                        classList.map((el, i) => (
                            <div
                                onClick={this.tabClass.bind(this, i, el.classId)}
                                className={
                                    i === classIndex
                                        ? `${styles.item} ${styles.active}`
                                        : styles.item
                                }
                                key={i}
                            >
                                <span>{locale() != 'en' ? el.className : el.classEname}</span>
                                <span>
                                    {classMap.get(String(el.classId)) &&
                                        classMap.get(String(el.classId)).length > 0 && (
                                            <span className={styles.num}>
                                                {classMap.get(String(el.classId)).length}
                                            </span>
                                        )}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        );
    }

    // 全选，或者都不选
    checkedAll = (e) => {
        let { classList, studentIdsList, originalStudentList, map, classMap } = this.state;
        // 更新map结构中学生数量
        let attrName = this.getAttrName();
        let itemInfor = map.get(attrName);
        if (e.target.checked) {
            classList = classList.map((el) => {
                studentIdsList = studentIdsList.concat(el.allStudentIds);
                el.checkedStudentIds = Array.from(
                    new Set([...el.checkedStudentIds, ...el.allStudentIds])
                );

                // 重新计算每个班级学生个数
                let newClassIdsList = classMap.get(String(el.classId)) || [];
                newClassIdsList = newClassIdsList.concat(el.allStudentIds);
                newClassIdsList = Array.from(new Set(newClassIdsList));
                classMap.set(String(el.classId), newClassIdsList);
                return el;
            });
        } else {
            // 所有学生Id集合
            let currentStudentIds = [];
            originalStudentList.forEach((el) => {
                currentStudentIds.push(el.studentId);
            });

            classList = classList.map((el) => {
                // 删除本次搜索内容的学生
                el.checkedStudentIds = el.allStudentIds.filter(
                    (e) => !currentStudentIds.includes(e)
                );
                studentIdsList = studentIdsList.filter((e) => !currentStudentIds.includes(e));

                // 删除
                let newClassIdsList = classMap.get(String(el.classId)) || [];
                newClassIdsList = newClassIdsList.filter((e) => !el.allStudentIds.includes(e));
                classMap.set(String(el.classId), newClassIdsList);
                return el;
            });
        }

        // 对应搜索 map 结构更新
        itemInfor.classList = classList;
        map.set(attrName, itemInfor);
        studentIdsList = Array.from(new Set(studentIdsList));

        this.setState({
            studentIdsList,
            classList,
            allChecked: e.target.checked,
            classMap,
        });
    };

    removeItem(array, num) {
        let index = array.indexOf(num);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    // 选择学生时
    handleChangeStudent = (item, e) => {
        let { classList, studentIdsList, allTotal, map, classMap } = this.state;

        let newClassIdsList = classMap.get(String(item.classId)) || [];
        if (e.target.checked) {
            studentIdsList.push(item.studentId);

            newClassIdsList.push(item.studentId);
        } else {
            // 从选中的学生中移除
            this.removeItem(studentIdsList, item.studentId);

            this.removeItem(newClassIdsList, item.studentId);

            this.setState({
                allChecked: false,
            });
        }

        classMap.set(String(item.classId), newClassIdsList);

        for (let i = 0; i < classList.length; i++) {
            let elt = classList[i];
            if (elt.allStudentIds.length > 0 && item.classId == elt.classId) {
                elt.checkedStudentIds = this.intersection(elt.allStudentIds, studentIdsList);
            }
        }

        // 更新map结构中班级列表
        let attrName = this.getAttrName();
        let itemInfor = map.get(attrName);
        itemInfor.classList = classList;
        map.set(attrName, itemInfor);

        // 全选中
        let classAllTotal = 0; // 所有班级学生总和
        for (let i = 0; i < classList.length; i++) {
            classAllTotal += classList[i].checkedStudentIds.length;
        }
        if (classAllTotal === allTotal) {
            this.setState({
                allChecked: true,
            });
        }

        this.setState({
            classList,
            studentIdsList,
            map,
            classMap,
        });
    };

    // 删除学生
    removeStudent = (item) => {
        let { studentIdsList, classList, map } = this.state;
        this.removeItem(studentIdsList, item.studentId);

        // 更新班级对应的人数
        for (let i = 0; i < classList.length; i++) {
            let elt = classList[i];
            if (elt.allStudentIds.length > 0 && item.classId == elt.classId) {
                this.removeItem(elt.checkedStudentIds, item.studentId);
            }
        }

        // 更新map结构中班级列表
        let attrName = this.getAttrName();
        let itemInfor = map.get(attrName);
        itemInfor.classList = classList;
        map.set(attrName, itemInfor);

        this.setState({
            studentIdsList,
            classList,
            map,
            allChecked: false,
        });
    };

    // 清空所有选中的学生
    clearCheckedStudent = () => {
        let { studentIdsList, classList } = this.state;

        studentIdsList = [];
        classList = classList.map((el) => {
            el.checkedStudentIds = [];
            return el;
        });

        this.setState({
            studentIdsList,
            classList,
            allChecked: false,
            classMap: new Map(),
        });
    };

    // 两个数组的交集，即班内所选学生个数
    intersection(arr1, arr2) {
        return arr1.filter(function (val) {
            return arr2.indexOf(val) > -1;
        });
    }

    rightHTML() {
        let { studentList, studentIdsList, allChecked, loading, allTotal, originalStudentList } =
            this.state;
        let num = studentIdsList.length;
        return (
            <div className={styles.rightContent}>
                <div className={styles.allChecked}>
                    <Checkbox
                        checked={
                            originalStudentList.length - allTotal === originalStudentList.length ||
                            allChecked
                        }
                        disabled={
                            originalStudentList.length - allTotal === originalStudentList.length
                        }
                        onChange={this.checkedAll}
                    >
                        <span className={styles.a}>
                            {trans('course.plan.allStudents', '所有学生')}
                        </span>
                    </Checkbox>
                    <div className={styles.allNum}>
                        {studentIdsList.length > 0 && (
                            <span>
                                {trans('course.basedetail.total.students', '共 {$num} 个学生', {
                                    num,
                                })}
                            </span>
                        )}
                    </div>
                </div>
                {!loading && (
                    <div className={styles.load}>
                        <Spin tip="Try to loading ..." />
                    </div>
                )}
                <div className={styles.studentList}>
                    {loading &&
                        studentList &&
                        studentList.length > 0 &&
                        studentList.map((el, i) => (
                            <Row key={i}>
                                {el.map((val, y) => (
                                    <Col span={8} key={y} className={styles.item}>
                                        <Checkbox
                                            disabled={val.addedFlag == 1 ? true : false}
                                            onChange={this.handleChangeStudent.bind(this, val)}
                                            checked={
                                                val.addedFlag == 1 ||
                                                studentIdsList.includes(val.studentId)
                                            }
                                        >
                                            <span className={styles.name}>
                                                {val.studentName} {val.studentEname || ''}{' '}
                                            </span>
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        ))}
                </div>
            </div>
        );
    }

    // 回车查询
    pressEnter = (e) => {
        this.initStudentData();
    };

    comprehensiveHTML() {
        let { studentsMap, originalStudentList, studentIdsList, classList } = this.state;
        return (
            <div className={styles.addStudent}>
                <div className={styles.top}>
                    {studentIdsList.length > 0 && (
                        <div className={styles.list}>
                            {studentIdsList.map((el, i) => (
                                <span className={styles.item} key={i}>
                                    {studentsMap.get(String(el)).studentName}
                                    <Icon
                                        onClick={this.removeStudent.bind(
                                            this,
                                            studentsMap.get(String(el))
                                        )}
                                        className={styles.icon}
                                        type="close"
                                    />
                                </span>
                            ))}
                            <div onClick={this.clearCheckedStudent} className={styles.del}>
                                <Icon type="delete" />
                            </div>
                        </div>
                    )}
                    <div className={styles.search}>
                        <Input
                            onChange={(e) => {
                                this.setState({
                                    studentName: e.target.value,
                                });
                            }}
                            onPressEnter={this.pressEnter}
                            placeholder={trans(
                                'tc.base.search.student.name.enter',
                                '请输入学生姓名搜索,回车查询'
                            )}
                        />
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.left}>{this.leftHTML()}</div>
                    <div className={styles.right}>
                        {originalStudentList.length === 0 || classList.length === 0
                            ? this.noDataHTML()
                            : this.rightHTML()}
                    </div>
                </div>
            </div>
        );
    }

    noDataHTML() {
        return (
            <div className={styles.noData}>
                <div>
                    <img src={powerUrl} />
                    <div className={styles.title}>
                        {trans('tc.base.no.add.student', '暂无要添加的学生')}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let { visibleAddStudent } = this.props;
        let { studentIdsList } = this.state;
        let num = studentIdsList.length;
        return (
            <Modal
                title={
                    <NavTitle
                        title={
                            studentIdsList.length > 0
                                ? trans('student.select.number', '已选择:{$num}名学生', { num })
                                : trans('tc.base.select.add.student', '请选择要添加的学生')
                        }
                        onCancel={this.onCancel.bind(this, 'visibleAddStudent')}
                    >
                        <div className={styles.studentNavTitle}>
                            {/* <Button>设置选课起止时间</Button> */}
                            <Button
                                // onClick={this.handleOkAddStudent}
                                type="primary"
                            >
                                {trans('global.confirm', '确定')}
                            </Button>
                        </div>
                    </NavTitle>
                }
                bodyStyle={{ backgroundColor: '#f0f0f0' }}
                width="90vw"
                maskClosable={false}
                footer={null}
                closable={false}
                visible={visibleAddStudent}
            >
                {this.comprehensiveHTML()}
            </Modal>
        );
    }
}

export default AddStudent;
