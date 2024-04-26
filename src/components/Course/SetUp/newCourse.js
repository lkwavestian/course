import React from 'react';
import {
    Modal,
    Input,
    Checkbox,
    Select,
    Icon,
    Button,
    message,
    Spin,
    TreeSelect,
    Radio,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { string } from 'prop-types';
import { trans, locale } from '../../../utils/i18n';

const Option = Select.Option;
const confirm = Modal.confirm;

@connect((state) => ({
    allAddress: state.course.allAddress,
    getLinkCourse: state.course.getLinkCourse,
    courseBySubject: state.timeTable.courseBySubject, //科目-课程联动
    userSchoolId: state.global.userSchoolId,
}))
class NewCourse extends React.Component {
    constructor(props) {
        super(props);
        let { semesterList, gradeList, subjectList, schoolList, isCourseEdit, data, allAddress } =
            props;

        let subjectIds = [];
        let creditSubjectList = [];
        let subjectIndexToIdMap = {};
        if (data.creditSubjectList) {
            data.creditSubjectList.forEach((el) => {
                subjectIds.push(el.subjectId);
                creditSubjectList.push(el);
            });
        } else {
            creditSubjectList = [{ subjectId: undefined }];
        }

        subjectList.forEach((el, i) => {
            if (subjectIds.includes(el.subjectId)) {
                subjectIndexToIdMap[string(i)] = el.subjectId;
            }
        });

        semesterList =
            semesterList &&
            semesterList.map((el) => {
                return {
                    label: el.officialSemesterName,
                    value: el.id,
                };
            });

        gradeList =
            gradeList &&
            gradeList.map((el) => {
                return {
                    label: locale() == 'en' ? el.orgEname : el.orgName,
                    value: el.id,
                };
            });

        let levelList = [
            { label: 'L1萌芽', value: 'L1' },
            { label: 'L2生长', value: 'L2' },
            { label: 'L3精熟', value: 'L3' },
            { label: 'L4超越', value: 'L4' },
        ];

        let wdLevelList = [
            { label: locale() == 'en' ? 'Primary' : '初级', value: 'L1' },
            { label: locale() == 'en' ? 'Intermediate' : '中级', value: 'L2' },
            { label: locale() == 'en' ? 'Advanced' : '高级', value: 'L3' },
        ];

        schoolList =
            schoolList &&
            schoolList.map((el) => {
                return {
                    label: el.name,
                    value: el.id,
                };
            });

        // 被选中的
        let siteIdList = [];
        data.siteList &&
            data.siteList.forEach((el) => {
                siteIdList.push(el.id);
            });

        let courseValue = [];
        data.prefaceCourses &&
            data.prefaceCourses.forEach((el) => {
                courseValue.push(el.id);
            });

        let editLevelList = [];
        data.levelList &&
            data.levelList.forEach((el) => {
                editLevelList.push(el);
            });

        let schoolIdList = [];
        data.schoolList &&
            data.schoolList.forEach((el) => {
                schoolIdList.push(el.id);
            });

        let gradeIdList = [];
        if (data.applyCampus) {
            data.applyCampus.forEach((el) => {
                // eslint-disable-next-line no-undef
                applyIdCampus.push(el.id);
            });
        }
        if (data.gradeList) {
            data.gradeList.forEach((el) => {
                gradeIdList.push(el.gradeId);
            });
        }

        let charperValue = isCourseEdit ? true : data.chapterEnable;
        let knowledgeValue = isCourseEdit ? true : data.knowledgeEnable;
        let teachingVersion = data.teachingMaterial;
        let knowledgeTeachingMaterial = data.knowledgeTeachingMaterial;

        this.lastFetchNameId = 0;
        this.state = {
            coursesId: data.coursesId, // 编辑时的课程ID
            isCourseEdit, // 是编辑还是新建
            semesterList,
            gradeList,
            levelList,
            wdLevelList,
            subjectList,
            schoolList,
            schoolIdList,
            creditSubjectList: isCourseEdit ? [{ subjectId: undefined }] : creditSubjectList, // 默认最低有一个
            name: isCourseEdit ? undefined : data.name,
            ename: isCourseEdit ? undefined : data.ename,
            courseType: isCourseEdit ? 1 : data.courseType, //必修or选修
            courseCode: isCourseEdit ? undefined : data.courseCode,
            gradeIdList, // 被选中的年级
            // siteList: isCourseEdit ? allAddress : data.siteList,
            siteList: allAddress,
            siteIdList, // 被选中的场地ID集合
            courseValue, //前序课程id集合
            editLevelList, //被选中的课程级别集合
            subjectIds, // 被选中的所有科目ID集合
            subjectIndexToIdMap, // 序列号和科目ID对应
            fetching: false,
            prevSubject: undefined,
            prevCourse: undefined,
            levelLists: [],
            shortName: isCourseEdit ? '' : data.courseShortName,
            enShortName: isCourseEdit ? '' : data.courseShortEnName,
            alias: isCourseEdit ? '' : data.alias,
            difficulty: isCourseEdit ? '' : data.difficulty,
            credit: isCourseEdit ? undefined : data.credit,
            charperValue: charperValue, //启用章节目录
            knowledgeValue: knowledgeValue, //启用知识点
            teachingVersion: teachingVersion || undefined, //章节教材版本
            knowledgeTeachingMaterial: knowledgeTeachingMaterial || undefined, //知识点教材版本
        };
    }

    /* componentDidMount = () => {
        this.getCourseBySubject();
    }; */

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'visibleNewCourse');
    };

    handleOk = (bol = false) => {
        let { dispatch } = this.props;
        let {
            name,
            ename,
            courseCode,
            schoolIdList,
            gradeIdList,
            siteIdList,
            editLevelList,
            charperValue,
            knowledgeValue,
            teachingVersion,
            knowledgeTeachingMaterial,
            creditSubjectList,
            isCourseEdit,
            coursesId,
            prevSubject,
            courseValue,
            courseType,
            subjectIds,
            shortName,
            alias,
            enShortName,
            difficulty,
            credit,
        } = this.state;
        let self = this;

        if (!name) {
            message.warn(trans('course.addcourse.chinese.is.required', '中文名称必填'));
            return;
        }
        if (!ename) {
            message.warn(trans('course.addcourse.english.is.required', '英文名称必填'));
            return;
        }

        if (subjectIds.length == 0) {
            message.warn('学科必填');
            return;
        }

        if (courseType !== 0 && courseType !== 1 && courseType !== 2 && courseType !== 3) {
            message.warn('请选择课程类别');
            return;
        }

        if (gradeIdList.length === 0) {
            message.warn(trans('course.addcourse.select.at.least.one.grade', '至少选一个适用年级'));
            return;
        }

        // if (!ename) {
        //     message.warn(trans('course.addcourse.english.is.required', '英文名称必填'));
        //     return;
        // }
        // if (!courseCode) {
        //     message.warn(trans('course.setup.index.rule.code', '请按照规则填写课程编码'));
        //     return;
        // }
        // if (schoolIdList.length === 0) {
        //     message.warn(trans("course.addcourse.select.at.least.one.campus", "至少选一个所属校区"));
        //     return;
        // }

        let creditSubjectListJson = creditSubjectList.filter(
            (item) => '{}' !== JSON.stringify(item)
        );

        creditSubjectListJson = creditSubjectListJson.map((el) => {
            return el.credit ? el : { ...el, credit: 0 };
        });
        dispatch({
            type: isCourseEdit ? 'course/addedCourse' : 'course/updateCourse',
            payload: {
                id: coursesId,
                editFlag: 0,
                name,
                ename,
                courseCode,
                schoolId: schoolIdList,
                rootId: 0,
                gradeIdList,
                siteIdList,
                editLevelList,
                creditSubjectJson: creditSubjectListJson,
                levelList: editLevelList,
                chapterEnable: charperValue,
                teachingMaterial: charperValue ? teachingVersion : '',
                knowledgeEnable: knowledgeValue,
                knowledgeTeachingMaterial: knowledgeValue ? knowledgeTeachingMaterial : '',
                prefaceCourseIdList: courseValue,
                courseType,
                shortName,
                alias,
                enShortName,
                difficulty,
                credit,
            },
            onSuccess: () => {
                setTimeout(() => {
                    self.handleCancel();
                    const { searchCourse } = self.props;
                    typeof searchCourse == 'function' && searchCourse.call(self);
                }, 2000);
            },
        });
    };

    add = () => {
        let { creditSubjectList } = this.state;
        creditSubjectList.push({});
        this.setState({
            creditSubjectList,
        });
    };

    del = (i) => {
        let self = this;
        let { creditSubjectList } = self.state;
        // if (creditSubjectList.length <= 1) {
        //     message.warn("至少保留一个");
        //     return;
        // }
        confirm({
            title: '是否删除该学科/学分',
            content: null,
            onOk() {
                creditSubjectList.splice(i, 1);
                self.setState({
                    creditSubjectList,
                });
            },
            onCancel() {},
        });
    };

    titleHTML() {
        return (
            <div className={styles.courseNav}>
                <span onClick={this.handleCancel} className={styles.icon}>
                    <Icon type="close" />
                </span>
                {/* <span>{trans('course.setup.index.new.course', '新建课程')}</span> */}
                <span>
                    {this.props.isCourseEdit
                        ? trans('course.setup.index.new.course', '新建课程')
                        : trans('course.setup.edit.course', '编辑课程')}
                </span>
                <div>
                    <Button
                        type="primary"
                        onClick={this.handleOk}
                        className={`${styles.btn} ${styles.saveBtn}`}
                    >
                        {trans('global.save', '保存')}
                    </Button>
                </div>
            </div>
        );
    }

    changeValue = (name, type, e) => {
        if (type === 1) {
            this.setState({
                [name]: e.target.value,
            });
        } else {
            this.setState({
                [name]: e,
            });
        }
    };

    changeType = (e) => {
        this.setState({
            editLevelList: e,
        });
    };

    //是否启用章节目录
    changeCharper = (e) => {
        this.setState({
            charperValue: e.target.value,
        });
    };

    //是否启用知识点
    changeKnowledge = (e) => {
        this.setState({
            knowledgeValue: e.target.value,
        });
    };

    //选择章节目录教材版本
    changeVersion = (value) => {
        this.setState({
            teachingVersion: value,
        });
    };

    //选择知识点教材版本 20230915
    changeKnowLedgeVersion = (value) => {
        this.setState({
            knowledgeTeachingMaterial: value,
        });
    };

    changeSubject = (i, val) => {
        let { creditSubjectList, subjectIds, subjectIndexToIdMap } = this.state;

        let id = subjectIndexToIdMap[i];
        // 如果选过，再次选时禁止选
        if (id !== undefined) {
            let index = subjectIds.indexOf(id);
            subjectIds.splice(index, 1);
        }

        if (!creditSubjectList[i]) {
            creditSubjectList[i] = {};
        }

        creditSubjectList[i].subjectId = val;
        subjectIds.push(val);
        subjectIndexToIdMap[String(i)] = val;
        this.setState({
            creditSubjectList,
            subjectIds: Array.from(new Set(subjectIds)),
            subjectIndexToIdMap,
        });
    };

    changeCourseType = (e) => {
        this.setState({
            courseType: e.target.value,
        });
    };

    /* changePrevSubject = (value) => {
        const { dispatch } = this.props;
        this.setState(
            {
                prevSubject: value,
            },
            () => {
                dispatch({
                    type: 'course/getLinkCourse',
                    payload: {
                        subject: value,
                    },
                });
            }
        );
    }; */
    changePrevCourse = (value) => {
        this.setState({
            prevCourse: value,
        });
    };

    changeScore = (i, e) => {
        let { creditSubjectList } = this.state;
        if (!creditSubjectList[i]) {
            creditSubjectList[i] = {};
        }
        creditSubjectList[i].credit = e.target.value;
        this.setState({
            creditSubjectList,
        });
    };

    fetchRelatePerson = (val) => {
        this.lastFetchNameId += 1;
        const fetchId = this.lastFetchNameId;
        this.setState({ siteList: [], fetching: true });
        let { dispatch } = this.props;
        dispatch({
            type: 'course/allAddress',
            payload: {
                name: val,
            },
        }).then(() => {
            // 请求时序控制
            if (fetchId !== this.lastFetchNameId) {
                // for fetch callback order
                return;
            }
            //返回的搜索的场地
            let { allAddress } = this.props;
            if (allAddress) {
                this.setState({ siteList: allAddress, fetching: false });
            }
        });
    };

    ruleHTML() {
        return (
            <div className={styles.ruleDetail}>
                <span className={styles.zd}>{trans('global.rule', '规则')}:</span>
                {trans(
                    'course.setup.index.rule.description',
                    '课程编码格式为2~4位字母+4位数字。其中字母部分代表同一类课程，数字的前2位代表级别，数字越大级别越高，建议幼儿园的课程使用00，中小学使用01~09，高中从10开始。举例：幼儿园美术-ART0001，五年级美术-ART0901，九年级美术-ART0901，高中美术-ART1001。'
                )}
            </div>
        );
    }

    //选择课程
    changeCourse = (value) => {
        this.setState({
            courseValue: value,
        });
    };

    //处理课程数据
    formatCourseData = (courseList) => {
        if (!courseList || courseList.length < 0) return;
        let courseData = [];
        courseList.map((item, index) => {
            let obj = {};
            obj.title = locale() != 'en' ? item.name : item.ename;
            obj.key = 'subject_' + item.id;
            obj.value = 'subject_' + item.id;
            obj.children = this.formatCourseChildren(item.courseList);
            courseData.push(obj);
        });
        return courseData;
    };

    //处理课程子节点
    formatCourseChildren = (arr) => {
        if (!arr || arr.length < 0) return [];
        let resultArr = [];
        arr.map((item) => {
            let obj = {
                title: locale() != 'en' ? item.name : item.englishName,
                value: item.id,
                key: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    //科目-课程级联
    getCourseBySubject() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/fetchCourseBySubject',
            payload: {},
        });
    }

    render() {
        let {
            gradeList,
            subjectList,
            schoolList,
            name,
            ename,
            courseCode,
            schoolIdList,
            gradeIdList,
            siteIdList,
            editLevelList,
            charperValue,
            knowledgeValue,
            teachingVersion,
            knowledgeTeachingMaterial,
            creditSubjectList,
            subjectIds,
            fetching,
            levelList,
            wdLevelList,
            courseValue,
            courseType,
            shortName,
            alias,
            enShortName,
            difficulty,
            credit,
        } = this.state;

        const { courseBySubject, userSchoolId } = this.props;

        const courseProps = {
            treeData: this.formatCourseData(courseBySubject),
            value: courseValue,
            placeholder:
                locale() != 'en' ? trans('course.plan.allcourse', '全部课程') : 'All Courses',
            onChange: this.changeCourse,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            style: {
                width: 400,
                marginRight: 8,
                verticalAlign: 'middle',
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            // disabled: showExchangeClassTable, // 自定义、学生视角禁用筛选
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            // maxTagCount: 5,
        };
        return (
            <Modal
                title={this.titleHTML()}
                width="60vw"
                style={{ top: window.self != window.top ? '10px' : '50px' }}
                footer={null}
                maskClosable={false}
                closable={false}
                visible={this.props.visibleNewCourse}
                className={window.self != window.top ? styles.newCourseModal : styles.createStyle}
                // className={styles.addOrEdit}
            >
                <div className={styles.NewCourse}>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('course.step1.stepchinese.title', '中文名称')}
                            <span style={{ color: 'red' }}>*</span>
                        </div>
                        <Input
                            placeholder={trans(
                                'global.enter.a.title.(required)',
                                '请输入标题(必填)'
                            )}
                            value={name}
                            onChange={this.changeValue.bind(this, 'name', 1)}
                        />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('course.step1.english.title', '英文名称')}
                            <span style={{ color: 'red' }}>*</span>
                        </div>
                        <Input
                            placeholder="Please enter the title in English"
                            value={ename}
                            onChange={this.changeValue.bind(this, 'ename', 1)}
                        />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {/* {trans('course.step1.nick.name', '课程别名')} */}
                            课程简称
                        </div>
                        <Input
                            placeholder="请输入课程别名 "
                            value={shortName}
                            onChange={this.changeValue.bind(this, 'shortName', 1)}
                        />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {/* {trans('course.setup.aliasNameEn', '课程别名英文')} */}
                            {trans('course.step1.nick.name', '课程别名')}
                        </div>
                        <Input
                            placeholder="Please enter the nick name "
                            value={alias}
                            onChange={this.changeValue.bind(this, 'alias', 1)}
                        />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('course.setup.aliasNameEn', '课程别名英文')}
                        </div>
                        <Input
                            placeholder="Please enter the nick ename "
                            value={enShortName}
                            onChange={this.changeValue.bind(this, 'enShortName', 1)}
                        />
                    </div>

                    <div className={styles.itemBox}>
                        <div className={styles.title}>
                            {trans('course.setup.newcourse.choose.subject', '选择学科')}
                            <span style={{ color: 'red' }}>*</span>
                        </div>
                        <div className={styles.select}>
                            {creditSubjectList.map((el, i) => (
                                <div key={i} className={styles.elt}>
                                    <Select
                                        // defaultValue={el.subjectId}
                                        defaultValue={
                                            creditSubjectList &&
                                            creditSubjectList.length > 0 &&
                                            creditSubjectList[0].subjectId
                                        }
                                        style={{ width: 150 }}
                                        className={styles.selectStyle}
                                        placeholder={trans(
                                            'course.setup.newcourse.choose.subject',
                                            '选择学科'
                                        )}
                                        onChange={this.changeSubject.bind(this, i)}
                                    >
                                        {subjectList &&
                                            subjectList.length > 0 &&
                                            subjectList.map((item, index) => {
                                                return (
                                                    <Option
                                                        disabled={subjectIds.includes(item.id)}
                                                        value={item.id}
                                                        key={item.id}
                                                    >
                                                        {locale() == 'en' ? item.ename : item.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                    {/* <span className={styles.core}>
                                        {trans('course.setup.newcourse.setup.credits', '设置学分')}
                                    </span>
                                    <Input
                                        style={{ width: 82 }}
                                        className={styles.input}
                                        placeholder={trans('global.placeholder', '请输入')}
                                        onChange={this.changeScore.bind(this, i)}
                                        value={el.credit}
                                    /> */}
                                    {/* <span onClick={this.del.bind(this, i)} className={styles.del}>
                                        <Icon type="minus-circle" />
                                    </span> */}
                                    {/* {creditSubjectList.length - 1 == i ? (
                                        <span onClick={this.add} className={styles.btn}>
                                            <Icon type="plus-circle" />
                                            {trans(
                                                'course.setup.newcourse.associate.multiple',
                                                '关联多个'
                                            )}
                                        </span>
                                    ) : null} */}
                                </div>
                            ))}
                        </div>
                        {/* {creditSubjectList.length === 0 ? (
                            <span onClick={this.add} className={styles.noBtn}>
                                <Icon type="plus-circle" />
                                {trans('course.setup.newcourse.associate.multiple', '关联多个')}
                            </span>
                        ) : null} */}
                    </div>
                    <div className={styles.itemBox}>
                        <div
                            className={styles.title}
                            style={{ height: '32px', lineHeight: '32px' }}
                        >
                            {trans('courseSet.courseType', '课程类别')}
                            <span style={{ color: 'red' }}>*</span>
                        </div>
                        <Radio.Group
                            onChange={this.changeCourseType}
                            value={courseType}
                            style={{ lineHeight: '32px' }}
                        >
                            <Radio value={0}>{locale() == 'en' ? 'Required' : '必修'}</Radio>
                            <Radio value={1}>
                                {locale() == 'en' ? 'Extracurricular Electives' : '课外选修'}
                            </Radio>
                            <Radio value={2}>
                                {locale() == 'en' ? 'course.Electives' : '课内选修'}
                            </Radio>
                            <Radio value={3}>
                                {locale() == 'en' ? 'Vrtual Course' : '虚拟课程'}
                            </Radio>
                        </Radio.Group>
                    </div>
                    <div className={styles.itemBox}>
                        <div className={styles.title}>
                            {trans('course.step2.applicable.grade', '适用年级')}
                            <span style={{ color: 'red' }}>*</span>
                        </div>
                        <Checkbox.Group
                            className={styles.box}
                            options={gradeList}
                            value={gradeIdList}
                            onChange={this.changeValue.bind(this, 'gradeIdList', 2)}
                        />
                    </div>
                    {/* 课程难度占位 */}
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('course.step1.course.difficulty', '课程难度')}
                        </div>
                        <Input
                            placeholder="请输入课程难度"
                            value={difficulty}
                            onChange={this.changeValue.bind(this, 'difficulty', 1)}
                        />
                    </div>

                    {/* 课程学分占位 */}
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('course.step1.course.credit', '课程学分')}
                        </div>
                        <Input
                            placeholder="请输入课程学分"
                            value={credit}
                            onChange={this.changeValue.bind(this, 'credit', 1)}
                        />
                    </div>
                    <div>
                        <div className={`${styles.item} ${styles.item2}`}>
                            <div className={styles.title}>
                                {trans('course.setup.course.code', '课程编码')}
                            </div>
                            <Input
                                value={courseCode}
                                placeholder={trans('global.please.fill.in', '请填写')}
                                onChange={this.changeValue.bind(this, 'courseCode', 1)}
                            />
                        </div>
                        {this.ruleHTML()}
                    </div>
                    <div className={styles.itemBox}>
                        <div className={styles.title}>
                            {trans('course.setup.newcourse.course.level', '课程级别')}
                        </div>
                        <Checkbox.Group
                            className={styles.box}
                            options={userSchoolId ? wdLevelList : levelList}
                            // options={levelList}
                            value={editLevelList}
                            onChange={this.changeType}
                        />
                    </div>
                    {userSchoolId ? null : (
                        <div className={styles.itemBox}>
                            <div className={styles.title}>
                                {/* {trans('course.setup.newcourse.course.prev', '前序课程')} */}
                                {trans('courseSet.prevCourse', '前序课程')}
                            </div>
                            <div className={styles.select} style={{ width: '400px' }}>
                                <TreeSelect {...courseProps} />
                            </div>
                        </div>
                    )}

                    <div className={styles.itemBox}>
                        <div className={styles.title}>章节目录</div>
                        <Radio.Group
                            onChange={this.changeCharper}
                            value={charperValue}
                            style={{ marginTop: 12 }}
                        >
                            <Radio value={true}>启用</Radio>
                            <Radio value={false}>不启用</Radio>
                        </Radio.Group>
                        {charperValue && (
                            <span style={{ marginLeft: 30 }}>
                                <span className={styles.title}>教材版本</span>
                                <span className={styles.select} style={{ marginLeft: 16 }}>
                                    <span className={styles.elt}>
                                        <Select
                                            style={{ width: 150 }}
                                            className={styles.selectStyle}
                                            value={teachingVersion}
                                            placeholder="请选择教材版本"
                                            onChange={this.changeVersion}
                                        >
                                            <Option value={'ZHE_JIAO'}>浙教版</Option>
                                            <Option value={'REN_JIAO'}>人教版</Option>
                                            <Option value={'WAI_YAN'}>外研版(一年级起点)</Option>
                                            <Option value={'QING_DAO'}>青岛版(六三职)</Option>
                                            <Option value={'XIANG_MEI'}>湘美版</Option>
                                            <Option value={'ZI_YAN'}>自研版</Option>
                                            <Option value={'BU_BIAN'}>部编版</Option>
                                            <Option value={'REN_JIAO_XIN_KE_BIAO_B'}>
                                                人教新课标B版
                                            </Option>
                                            <Option value={'XIANG_WEN_YI_BAN'}>湘文艺版</Option>
                                            <Option value={'REN_MEI'}>人美版</Option>
                                            <Option value={'HUA_DONG_SHI_DA'}>华东师大版</Option>
                                            <Option value={'YUE_JIAO'}>粤教版</Option>
                                            <Option value={'YUE_KE'}>粤科版</Option>

                                            <Option value={'WAI_YAN_CHU_ZHONG'}>外研（初中）</Option>
                                            <Option value={'JI_NAN'}>济南</Option>
                                            <Option value={'XIANG_JIAO'}>湘教版</Option>

                                            <Option value={'ZHEJIANG_SHENDING'}>浙江省审定版</Option>
                                            <Option value={'ZHE_JIAO_YUNGU'}>浙教版(云谷)</Option>
                                            <Option value={'REN_JIAO_YUNGU'}>人教版(云谷)</Option>
                                            <Option value={'HU_JIAO'}>沪教版</Option>
                                            <Option value={'BU_BIAN_FIVE_FOUR'}>部编版(五四制)</Option>
                                            <Option value={'ZHONG_TU'}>中图版</Option>
                                            <Option value={'NIU_JIN_SHANG_HAI'}>牛津上海版</Option>
                                            <Option value={'SHANG_HAI_WAI_JIAO'}>上海外教班</Option>
                                        </Select>
                                    </span>
                                </span>
                            </span>
                        )}
                    </div>

                    <div className={styles.itemBox}>
                        <div className={styles.title}>知识点</div>
                        <Radio.Group
                            onChange={this.changeKnowledge}
                            value={knowledgeValue}
                            style={{ marginTop: 7 }}
                        >
                            <Radio value={true}>启用</Radio>
                            <Radio value={false}>不启用</Radio>
                        </Radio.Group>
                        {knowledgeValue && (
                            <span style={{ marginLeft: 30 }}>
                                <span className={styles.title}>教材版本</span>
                                <span className={styles.select} style={{ marginLeft: 16 }}>
                                    <span className={styles.elt}>
                                        <Select
                                            style={{ width: 150 }}
                                            className={styles.selectStyle}
                                            value={knowledgeTeachingMaterial}
                                            placeholder="请选择教材版本"
                                            onChange={this.changeKnowLedgeVersion}
                                        >
                                            <Option value={'ZHE_JIAO'}>浙教版</Option>
                                            <Option value={'REN_JIAO'}>人教版</Option>
                                            <Option value={'WAI_YAN'}>外研版(一年级起点)</Option>
                                            <Option value={'QING_DAO'}>青岛版(六三职)</Option>
                                            <Option value={'XIANG_MEI'}>湘美版</Option>
                                            <Option value={'ZI_YAN'}>自研版</Option>
                                            <Option value={'BU_BIAN'}>部编版</Option>
                                            <Option value={'REN_JIAO_XIN_KE_BIAO_B'}>
                                                人教新课标B版
                                            </Option>
                                            <Option value={'XIANG_WEN_YI_BAN'}>湘文艺版</Option>
                                            <Option value={'REN_MEI'}>人美版</Option>
                                            <Option value={'HUA_DONG_SHI_DA'}>华东师大版</Option>
                                            <Option value={'YUE_JIAO'}>粤教版</Option>
                                            <Option value={'YUE_KE'}>粤科版</Option>

                                            <Option value={'WAI_YAN_CHU_ZHONG'}>外研（初中）</Option>
                                            <Option value={'JI_NAN'}>济南</Option>
                                            <Option value={'XIANG_JIAO'}>湘教版</Option>

                                            <Option value={'ZHEJIANG_SHENDING'}>浙江省审定版</Option>
                                            <Option value={'ZHE_JIAO_YUNGU'}>浙教版(云谷)</Option>
                                            <Option value={'REN_JIAO_YUNGU'}>人教版(云谷)</Option>
                                            <Option value={'HU_JIAO'}>沪教版</Option>
                                            <Option value={'BU_BIAN_FIVE_FOUR'}>部编版(五四制)</Option>
                                            <Option value={'ZHONG_TU'}>中图版</Option>
                                            <Option value={'NIU_JIN_SHANG_HAI'}>牛津上海版</Option>
                                            <Option value={'SHANG_HAI_WAI_JIAO'}>上海外教班</Option>
                                        </Select>
                                    </span>
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </Modal>
        );
    }
}

export default NewCourse;
