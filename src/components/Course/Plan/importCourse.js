import React from 'react';
import { connect } from 'dva';
import { Modal, Icon, Button, Select, Input, Row, Col, Checkbox, Spin } from 'antd';
import styles from './importCourse.less';
import { trans } from '../../../utils/i18n';

const { Option } = Select;
const { Search } = Input;

@connect((state) => ({
    courseLists: state.time.getCourseLists,
}))
class ImportCourse extends React.Component {
    state = {
        stageId: '',
        gradeId: '',
        subjectId: '',
        keywords: '',
        courseLists: [],
        courseIds: [],
        allCourseIds: [],
        allChecked: false,
        loading: false,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.visibleImportCourse != this.props.visibleImportCourse) {
            if (nextProps.visibleImportCourse) {
                this.initCourseList();
            }
        }
    }

    componentDidMount() {}

    onCancel = () => {
        const { hideModal, self } = this.props;
        typeof hideModal == 'function' && hideModal.call(self, 'visibleImportCourse');
    };

    initCourseList() {
        const { dispatch, schoolYearId } = this.props;
        const { keywords, subjectId, stageId, gradeId } = this.state;
        this.setState({
            loading: false,
        });
        dispatch({
            type: 'time/getCourseLists',
            payload: {
                schoolYearId,
                stage: stageId,
                teachingOrgId: gradeId,
                subjectId,
                name: keywords,
            },
        }).then(() => {
            const { courseLists = [] } = this.props;
            let allCourseIds = [];
            courseLists.forEach((el) => {
                if (!el.choose) {
                    allCourseIds.push(el.id);
                }
            });
            this.setState({
                loading: true,
                allCourseIds,
                courseLists: this.arrTrans(4, courseLists),
            });
        });
    }

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

    subment = () => {
        const { dispatch, schoolId } = this.props;
        const { courseIds } = this.state;
        dispatch({
            type: 'course/importHistory',
            payload: {
                courseIds,
                schoolId,
            },
            onSuccess: () => {
                this.onCancel();
            },
        });
    };

    titleHTML() {
        return (
            <div className={styles.title}>
                <span onClick={this.onCancel} className={styles.icon}>
                    <Icon type="close" />
                </span>
                <span>课程范围</span>
                <Button onClick={this.subment} type="primary">
                    导入
                </Button>
            </div>
        );
    }

    handleChange = (type, e) => {
        this.setState(
            {
                [type]: e,
            },
            () => {
                if (type !== 'courseIds') {
                    this.initCourseList();
                }
            }
        );

        if (type === 'courseIds') {
            let { allCourseIds } = this.state;
            if (allCourseIds.length === e.length) {
                this.setState({
                    allChecked: true,
                });
            } else {
                this.setState({
                    allChecked: false,
                });
            }
        }
    };

    checkedAll = (e) => {
        let { allCourseIds } = this.state;
        if (e.target.checked) {
            this.setState({
                allChecked: true,
                courseIds: allCourseIds,
            });
        } else {
            this.setState({
                allChecked: false,
                courseIds: [],
            });
        }
    };

    render() {
        let {
            visibleImportCourse,
            allStage,
            allGrade,
            subjectList,
            schoolList,
            semesterList,
            schoolId,
            schoolYearId,
        } = this.props;
        let { stageId, gradeId, subjectId, courseLists, allChecked, courseIds, loading } =
            this.state;
        return (
            <Modal
                title={this.titleHTML()}
                width="90vw"
                maskClosable={false}
                footer={null}
                closable={false}
                visible={visibleImportCourse}
            >
                <div className={styles.importCourse}>
                    <div className={styles.condition}>
                        <div className={styles.item}>
                            <span className={styles.title}>校区</span>
                            <Select className={styles.selectStyle} disabled={true} value={schoolId}>
                                <Option value="" key="all">
                                    {trans('course.plan.school', '全部校区')}
                                </Option>
                                {schoolList &&
                                    schoolList.length > 0 &&
                                    schoolList.map((item, index) => (
                                        <Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.title}>学年</span>
                            <Select
                                className={styles.selectStyle}
                                disabled={true}
                                value={schoolYearId}
                            >
                                <Option value="" key="all">
                                    {trans('course.plan.school', '全部学年')}
                                </Option>
                                {semesterList &&
                                    semesterList.length > 0 &&
                                    semesterList.map((item, index) => (
                                        <Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                    </div>
                    <div className={styles.condition}>
                        <div className={styles.item}>
                            <span className={styles.title}>学段</span>
                            <Select
                                value={stageId}
                                className={styles.selectStyle}
                                onChange={this.handleChange.bind(this, 'stageId')}
                            >
                                <Option value="" key="all">
                                    全部学段
                                </Option>
                                {allStage &&
                                    allStage.length > 0 &&
                                    allStage.map((item, index) => (
                                        <Option value={item.stage} key={item.id}>
                                            {item.orgName}
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.title}>年级</span>
                            <Select
                                className={styles.selectStyle}
                                onChange={this.handleChange.bind(this, 'gradeId')}
                                value={gradeId}
                            >
                                <Option value="" key="all">
                                    {trans('course.plan.allGrade', '全部年级')}
                                </Option>
                                {allGrade &&
                                    allGrade.length > 0 &&
                                    allGrade.map((item, index) => (
                                        <Option value={item.id} key={item.id}>
                                            {item.orgName}
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.title}>科目</span>
                            <Select
                                value={subjectId}
                                className={styles.selectStyle}
                                onChange={this.handleChange.bind(this, 'subjectId')}
                            >
                                <Option value="" key="all">
                                    {trans('course.plan.allsubject', '全部科目')}
                                </Option>
                                {subjectList &&
                                    subjectList.length > 0 &&
                                    subjectList.map((item, index) => (
                                        <Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                        <Search
                            className={styles.Search}
                            placeholder={trans('course.plan.keywords', '输入关键词搜索')}
                            onChange={(e) => {
                                this.setState({
                                    keywords: e.target.value,
                                });
                            }}
                            onSearch={this.handleChange.bind(this, 'keywords')}
                            style={{ width: 200, borderRadius: '24px' }}
                        />
                    </div>

                    <div>
                        <div className={styles.all}>
                            <Checkbox checked={allChecked} onChange={this.checkedAll}>
                                <span className={styles.a}>
                                    {' '}
                                    {trans('global.choiceAll', '全选')}
                                </span>
                            </Checkbox>
                            {courseIds.length > 0 && (
                                <span className={styles.title}>
                                    已选择: {courseIds.length} 个课程
                                </span>
                            )}
                        </div>
                        {loading ? (
                            <div className={styles.box}>
                                <Checkbox.Group
                                    value={courseIds}
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange.bind(this, 'courseIds')}
                                >
                                    {courseLists.map((el, i) => (
                                        <Row key={i}>
                                            {el.map((val, y) => (
                                                <Col span={6} key={y} className={styles.item}>
                                                    <Checkbox disabled={val.choose} value={val.id}>
                                                        <span className={styles.name}>
                                                            {val.name}
                                                        </span>
                                                    </Checkbox>
                                                </Col>
                                            ))}
                                        </Row>
                                    ))}
                                </Checkbox.Group>
                            </div>
                        ) : (
                            <div className={styles.tryLoad}>
                                <Spin tip="Try to loading ..." />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ImportCourse;
