import React, { Fragment } from 'react';
import styles from './addStudent.less';
import { Modal, Input, Button, Icon, Select, Checkbox, Spin, Row, Col, message } from 'antd';
import NavTitle from './navTitle';
import { connect } from 'dva';
import powerUrl from '../../../assets/noData.png';
import InfiniteScroll from 'react-infinite-scroller';
import { getUrlSearch } from '../../../utils/utils';
import { trans, locale } from '../../../utils/i18n';

const { Option } = Select;

@connect((state) => ({
    allStudent: state.time.allStudent,
}))
class AddStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: getUrlSearch('planId'),
            pageNum: 1,
            pageSize: 10000,
            checkedTotal: 0, // 已经选过学生总个数
            gradeId: '',
            classId: '',
            classIds: [], // 班级ID集合
            allClassIds: [], // 所有班级ID集合
            studentName: '', // 搜索的学生名字
            classIndex: -1, // 默认选中第一个所有班级
            gradeList: [], // 年级列表
            classList: [], // 班级列表分类
            gradeToClassMap: {}, // 年级Id对应班级的map结构
            originalStudentList: [], // 原始学生列表格式
            studentList: [], // 学生列表
            studentIdsList: [], // 选中的学生
            allChecked: false, // 默认不是全选
            loading: false, // 每次搜索加载中
            studentsMap: new Map(), // 所有学生 id-学生信息map结构
            infinitKey: 'init', // 下拉时父级DIV外层的 key 值
            hasMore: true,
            studentType: 0, //教职工子女筛选
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visibleAddStudent != this.props.visibleAddStudent) {
            if (nextProps.visibleAddStudent) {
                this.initPropsData(nextProps, () => {
                    this.initStudentData();
                });
            }
        }
    }

    componentDidMount() {}

    // 处理接受到的原始参数
    initPropsData(props, callback) {
        let { gradeList = [], classList = [] } = props;

        let allClassIds = [];
        // 对获取到的班级列表进行属性扩展
        classList = classList.map((el) => {
            allClassIds.push(el.classId);
            return {
                ...el,
                classNumber: 0, // 选中的个数初始化为0，
                allStudentIds: [], // 首次初始化，存储所有本班级学生ID
            };
        });

        let gradeToClassMap = {};

        if (classList.length > 0) {
            // map结构以数组形式存储，对应年级存储对应班级
            classList.forEach((el) => {
                if (gradeToClassMap[String(el.gradeId)] !== undefined) {
                    gradeToClassMap[String(el.gradeId)].push(el);
                } else {
                    gradeToClassMap[String(el.gradeId)] = [el];
                }
            });

            // 年级多余班级时，多余的班级给空数组
            gradeList.forEach((el) => {
                if (gradeToClassMap[String(el.id)] === undefined) {
                    gradeToClassMap[String(el.id)] = [];
                }
            });
        } else {
            // 班级为空时
            gradeList.forEach((el) => {
                gradeToClassMap[String(el.id)] = [];
            });
        }

        classList.sort((a, b) => a.classId - b.classId);
        this.setState(
            {
                allClassIds, // 所有年级集合
                classIds: allClassIds,
                gradeList: gradeList,
                classList,
                gradeToClassMap,
            },
            () => {
                // 参数处理完成之后，发送 ajax 请求
                typeof callback === 'function' && callback();
            }
        );
    }

    /**
     * 初始化搜索的学生
     * @param {*} nextLoad
     */
    initStudentData = (nextLoad = false) => {
        const { dispatch, batchId } = this.props;
        let self = this;
        let checkedTotal = 0;
        let { planId, studentName, pageSize, classIds, pageNum, hasMore, studentType } = self.state;

        // 无数据了
        if (!hasMore) {
            return;
        }

        if (classIds.length === 0) {
            message.warn(trans('tc.base.grade.next.no.class', '该年级下暂无对应班级'));
            return;
        }

        if (!nextLoad) {
            self.setState({
                loading: false,
            });
        }

        dispatch({
            type: 'time/allStudent',
            payload: {
                planId: Number(planId) || getUrlSearch('planId'),
                keyWord: studentName,
                classIds,
                batchId,
                pageNum,
                pageSize,
                studentType,
            },
        }).then(() => {
            let { classList, studentsMap, originalStudentList, studentIdsList } = self.state;

            let { data, total } = self.props.allStudent;

            if (data && data.length === 0 && total === 0) {
                self.setState({
                    loading: true,
                    hasMore: false,
                });
                // return;
            }

            data = data || [];
            let _studentIds = [];
            let newData = []; // 请求的数据和老数据合并，并且过滤重复学生
            let newObj = {}; // 保存序列

            // 下拉加载时，合并上一页数据
            if (nextLoad) {
                // 合并学生去重
                newData = originalStudentList.concat(data).reduce((cur, next) => {
                    newObj[next.studentId] ? '' : (newObj[next.studentId] = true && cur.push(next));
                    return cur;
                }, []);
            } else {
                // 搜索请求或者第一次请求，直接操作第一页数据
                newData = data;
            }

            let classToStudentMap = {};

            // 1. 把所有学生 studentId 按照班级归类
            newData.forEach((el) => {
                // 只存储为未被选中的学生
                if (el.addedFlag == 0) {
                    if (classToStudentMap[String(el.classId)]) {
                        classToStudentMap[String(el.classId)].push(el.studentId);
                    } else {
                        classToStudentMap[String(el.classId)] = [el.studentId];
                    }

                    // 把学生的信息都以map结构形式存储
                    studentsMap.set(String(el.studentId), el);
                    _studentIds.push(el.studentId);
                } else {
                    // 已经选过的学生，不可以选
                    checkedTotal++;
                }
            });

            // 2. 把按照班级归类好的学生存储班级列表中
            classList = classList.map((el) => {
                if (
                    classToStudentMap[String(el.classId)] &&
                    classToStudentMap[String(el.classId)].length > 0
                ) {
                    let allStudentIds = Array.from(
                        new Set(el.allStudentIds.concat(classToStudentMap[String(el.classId)]))
                    );
                    return {
                        ...el,
                        allStudentIds,
                    };
                } else {
                    return {
                        ...el,
                    };
                }
            });

            // 判断新请求数据是否所有被选过
            let _index = 0;
            _studentIds.forEach((el) => {
                if (studentIdsList.includes(el)) _index++;
            });
            // 判断是否都选过
            if (checkedTotal === newData.length || _studentIds.length === _index) {
                this.setState({
                    allChecked: true,
                });
            } else {
                this.setState({
                    allChecked: false,
                });
            }

            pageNum++;
            self.setState({
                originalStudentList: newData,
                hasMore: newData.length < total,
                studentList: self.arrTrans(3, newData),
                loading: true,
                pageNum,
                classList,
                studentsMap,
                checkedTotal,
            });
        });
    };

    /**
     * 一维数组转换为二维数组, 主要目的是为了排列
     * @param {*} num
     * @param {*} arr
     */
    arrTrans(num, arr) {
        const iconsArr = [];
        arr.forEach((item, index) => {
            const page = Math.floor(index / num);
            if (!iconsArr[page]) {
                iconsArr[page] = [];
            }
            iconsArr[page].push(item);
        });
        return iconsArr;
    }

    handleOkAddStudent = () => {
        let { planId, studentIdsList } = this.state;
        let { resetData, self } = this.props;
        if (studentIdsList.length === 0) {
            message.warn(trans('tc.base.check.add.student', '请先勾选要添加的学生'));
            return;
        }
        let { dispatch, batchId } = this.props;
        dispatch({
            type: 'courseTeacherDetail/addStudent',
            payload: {
                planId,
                batchId,
                userIdList: studentIdsList,
            },
        }).then(() => {
            this.onCancel();
            typeof resetData === 'function' && resetData.call(self); // 调用父级 this
        });
    };

    // 重置所有条件
    resetSearch = () => {
        this.setState({
            pageNum: 1,
            gradeId: '',
            classId: '',
            studentName: '', // 搜索的学生名字
            classIndex: -1, // 默认选中第一个所有班级
            originalStudentList: [], // 原始学生列表格式
            studentList: [], // 学生列表
            studentIdsList: [], // 选中的学生
            studentsMap: new Map(),
            hasMore: true,
            studentType: 0,
        });
    };

    onCancel = () => {
        const { hideModal, self } = this.props;
        typeof hideModal == 'function' && hideModal.call(self, 'visibleAddStudent');
        this.resetSearch();
    };

    // 切换年级，搜索对应班级
    handleChangeGrade = (value) => {
        let { gradeToClassMap, allClassIds } = this.state;

        if (this.state.gradeId === value) return;

        if (value === '') {
            // 所有班级
            let allClassList = [];
            // 收集所有班级信息
            for (const key in gradeToClassMap) {
                if (gradeToClassMap.hasOwnProperty(key)) {
                    allClassList = allClassList.concat(gradeToClassMap[key]);
                }
            }

            // 班级排序
            allClassList.sort((a, b) => a.classId - b.classId);

            this.setState(
                {
                    classIds: allClassIds,
                    classList: allClassList,
                    gradeId: value,
                    hasMore: true,
                    classIndex: -1, // 都恢复默认所有班级
                    pageNum: 1,
                    originalStudentList: [],
                },
                () => {
                    this.initStudentData();
                }
            );
        } else {
            let classList = gradeToClassMap[String(value)];
            let classIds = [];
            classList.forEach((el) => {
                classIds.push(el.classId);
            });
            this.setState(
                {
                    gradeId: value,
                    classList,
                    classIds,
                    classIndex: -1,
                    hasMore: true,
                    classId: '',
                    pageNum: 1,
                    originalStudentList: [],
                },
                () => {
                    this.initStudentData();
                }
            );
        }
    };

    // 切换班级
    tabClass = (i, classId) => {
        let { gradeId, gradeToClassMap, loading, classIndex, allClassIds } = this.state;
        if (!loading) {
            message.warn(trans('tc.base.data.is.loading', '数据正在请求中,请稍后...'));
            return;
        }

        // 当点击同班级时，禁止操作
        if (classIndex === i) return;

        let _classIds = [];
        // 点击获取全部班级
        if (gradeId === '') {
            _classIds = allClassIds;
        } else if (classId === '') {
            let list = gradeToClassMap[String(gradeId)] || [];
            list.forEach((el) => {
                _classIds.push(el.classId);
            });
        }

        this.setState(
            {
                classIndex: i,
                classId,
                classIds: classId === '' ? _classIds : [classId],
                pageNum: 1,
                hasMore: true,
                originalStudentList: [], // 切换班级时情况原始学生列表
            },
            () => {
                this.initStudentData();
            }
        );
    };

    leftHTML() {
        let { gradeList, gradeId, classList, classIndex } = this.state;
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
                                    {el.classNumber > 0 && (
                                        <span className={styles.num}>{el.classNumber}</span>
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
        let {
            classList,
            studentIdsList,
            gradeToClassMap,
            originalStudentList,
            gradeId,
            classIndex,
            classId,
        } = this.state;
        if (e.target.checked) {
            // 全部班级
            if (classId === '') {
                classList = classList.map((el) => {
                    studentIdsList = studentIdsList.concat(el.allStudentIds);
                    el.classNumber = el.allStudentIds.length;

                    this.updateGradeToClassMap(el, classId, 1);
                    return el;
                });
                // 固定班级
            } else {
                classList = classList.map((el) => {
                    if (classId == el.classId) {
                        studentIdsList = studentIdsList.concat(el.allStudentIds);
                        el.classNumber = el.allStudentIds.length;

                        this.updateGradeToClassMap(el, classId, 1);
                    }
                    return el;
                });
            }

            studentIdsList = Array.from(new Set(studentIdsList));
        } else {
            // 所有学生Id集合
            let currentStudentIds = [];
            originalStudentList.forEach((el) => {
                currentStudentIds.push(el.studentId);
            });

            if (classId === '') {
                classList = classList.map((el) => {
                    // 删除本次搜索内容的学生
                    el.classNumber = el.allStudentIds.filter(
                        (el) => !currentStudentIds.includes(el)
                    ).length;
                    studentIdsList = studentIdsList.filter((el) => !currentStudentIds.includes(el));

                    this.updateGradeToClassMap(el, classId, 2);
                    return el;
                });
            } else {
                classList = classList.map((el) => {
                    if (classId == el.classId) {
                        // 删除本次搜索内容的学生
                        el.classNumber = el.allStudentIds.filter(
                            (el) => !currentStudentIds.includes(el)
                        ).length;
                        studentIdsList = studentIdsList.filter(
                            (el) => !currentStudentIds.includes(el)
                        );

                        this.updateGradeToClassMap(el, classId, 2);
                    }
                    return el;
                });
            }
        }
        this.setState({
            studentIdsList,
            classList,
            gradeToClassMap,
            allChecked: e.target.checked,
        });
    };

    // 全选/反选时，更新 map 结构，主要更新 map 里面对应班级的学生数量
    updateGradeToClassMap(el, classId, type) {
        let { gradeToClassMap } = this.state;
        let _classList = gradeToClassMap[String(el.gradeId)] || [];
        let index = undefined;
        _classList.forEach((el, i) => {
            if (el.classId == classId) {
                index = i;
            }
        });

        if (type === 1 && index !== undefined) {
            gradeToClassMap[String(el.gradeId)][index].classNumber = el.allStudentIds.length;
        } else if (type === 2 && index !== undefined) {
            gradeToClassMap[String(el.gradeId)][index].classNumber = 0;
        }
        this.setState({
            gradeToClassMap,
        });
    }

    removeItem(array, num) {
        let index = array.indexOf(num);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    // 选择学生时
    handleChangeStudent = (item, e) => {
        let { classList, studentIdsList, originalStudentList, checkedTotal } = this.state;
        if (e.target.checked) {
            studentIdsList.push(item.studentId);

            // 判断是否都选中
            let _studentIds = []; // 收集所有未被提交的ID
            let _index = 0;
            originalStudentList.forEach((el) => {
                if (el.addedFlag == 0) _studentIds.push(el.studentId);
            });
            _studentIds.forEach((el) => {
                if (studentIdsList.includes(el)) _index++;
            });
            // 判断都是选过
            if (checkedTotal === originalStudentList.length || _studentIds.length === _index) {
                this.setState({
                    allChecked: true,
                });
            }
        } else {
            this.removeItem(studentIdsList, item.studentId);
            this.setState({
                allChecked: false,
            });
        }

        for (let i = 0; i < classList.length; i++) {
            let elt = classList[i];
            if (elt.allStudentIds.length > 0 && item.classId == elt.classId) {
                elt.classNumber = this.intersection(elt.allStudentIds, studentIdsList).length;

                this.updateSingleGradeToClassMap(item, elt);
            }
        }

        this.setState(
            {
                classList,
                studentIdsList,
            },
            () => {
                this.forceUpdate();
            }
        );
    };

    // 删除学生
    removeStudent = (item) => {
        let { studentIdsList, classList } = this.state;
        this.removeItem(studentIdsList, item.studentId);

        // 更新班级对应的人数
        for (let i = 0; i < classList.length; i++) {
            let elt = classList[i];
            if (elt.allStudentIds.length > 0 && item.classId == elt.classId) {
                elt.classNumber--;

                this.updateSingleGradeToClassMap(item, elt);
            }
        }

        this.setState(
            {
                studentIdsList,
                classList,
                allChecked: false,
            },
            () => {
                this.forceUpdate();
            }
        );
    };

    // 更新 map 结构
    updateSingleGradeToClassMap(item, elt) {
        let { gradeToClassMap } = this.state;
        let classListInner = gradeToClassMap[String(item.gradeId)] || [];

        let index = undefined;
        classListInner.forEach((el, i) => {
            if (el.classId == item.classId) {
                index = i;
            }
        });
        if (index !== undefined) {
            gradeToClassMap[String(item.gradeId)][index] = elt;
            this.setState({
                gradeToClassMap,
            });
        }
    }

    // 清空所有选中的学生
    clearCheckedStudent = () => {
        let { studentIdsList, classList } = this.state;

        studentIdsList = [];
        classList = classList.map((el) => {
            el.classNumber = 0;
            return el;
        });

        this.setState({
            studentIdsList,
            classList,
            allChecked: false,
        });
    };

    // 两个数组的交集，即班内所选学生个数
    intersection(arr1, arr2) {
        return arr1.filter(function (val) {
            return arr2.indexOf(val) > -1;
        });
    }

    changeInfinite = () => {
        this.setState({
            infinitKey: Math.random().toString(36).substr(2),
        });
    };

    rightHTML() {
        let {
            studentList,
            studentIdsList,
            allChecked,
            loading,
            checkedTotal,
            originalStudentList,
            pageNum,
            infinitKey,
            hasMore,
            studentType,
        } = this.state;
        return (
            <div className={styles.rightContent}>
                <div className={styles.allChecked}>
                    <Checkbox
                        checked={originalStudentList.length === checkedTotal || allChecked}
                        disabled={originalStudentList.length === checkedTotal}
                        onChange={this.checkedAll}
                    >
                        <span className={styles.a}>
                            {trans('course.plan.allStudents', '所有学生')}
                        </span>
                    </Checkbox>
                    <div className={styles.allNum}>
                        {/* {
                            studentIdsList.length > 0 &&
                            <span>共{studentIdsList.length}个学生</span>
                        } */}
                    </div>
                    <Select
                        style={{ width: 120 }}
                        defaultValue={studentType}
                        onChange={this.studentTypeChange}
                    >
                        <Option value={0}>{trans('global.all.students', '全部学生')}</Option>
                        <Option value={1}>
                            {trans('global.Children of Employee', '教职工子女')}
                        </Option>
                        <Option value={2}>
                            {trans('global.Not Children of Employee', '非教职工子女')}
                        </Option>
                    </Select>
                </div>
                <div className={styles.studentList} onClick={this.changeInfinite}>
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={pageNum}
                        loadMore={() => {
                            this.initStudentData(true);
                        }}
                        hasMore={hasMore}
                        useWindow={false}
                        key={infinitKey}
                    >
                        {studentList.map((el, i) => (
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
                                                {val.studentName} {val.studentEname || ''}
                                            </span>
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        ))}
                    </InfiniteScroll>
                    {hasMore ? (
                        <div className={styles.tryLoad}>
                            {/* <Spin tip="Try to loading ..." /> */}
                        </div>
                    ) : (
                        <span className={styles.noMore}>
                            {trans('tc.base.no.more', '没有更多了')}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // 回车查询
    pressEnter = (e) => {
        this.setState(
            {
                pageNum: 1,
                hasMore: true,
                originalStudentList: [],
            },
            () => {
                this.initStudentData();
            }
        );
    };

    comprehensiveHTML() {
        let { studentsMap, originalStudentList, studentIdsList, loading } = this.state;
        let { classList } = this.props;
        return (
            <div className={styles.addStudent}>
                <div className={styles.top}>
                    {studentIdsList.length > 0 && (
                        <Fragment>
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
                            </div>
                            <div onClick={this.clearCheckedStudent} className={styles.del}>
                                <Icon type="delete" />
                            </div>
                        </Fragment>
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
                        {!loading ? (
                            <div className={styles.load}>
                                <Spin tip="Try to loading ..." />
                            </div>
                        ) : classList.length === 0 ? (
                            this.noDataHTML()
                        ) : (
                            this.rightHTML()
                        )}
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

    studentTypeChange = (value) => {
        this.setState(
            {
                pageNum: 1,
                studentType: value,
                hasMore: true,
            },
            () => {
                this.initStudentData();
            }
        );
    };

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
                            <Button onClick={this.handleOkAddStudent} type="primary">
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
                style={{ top: '10px' }}
            >
                {this.comprehensiveHTML()}
            </Modal>
        );
    }
}

export default AddStudent;
