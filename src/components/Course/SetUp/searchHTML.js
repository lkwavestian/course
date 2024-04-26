//课程设置
import React from 'react';
import { Input, Select } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import { trans, locale } from '../../../utils/i18n';

const { Search } = Input;
const Option = Select.Option;

@connect((state) => ({
    gradeList: state.time.allGrade,
    currentUser: state.global.currentUser,
}))
class SearchHTML extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolId: '',
            semesterId: '',
            gradeId: '',
            subjectId: '',
            courseType: '',
            keywords: '',
            gradeList: [],
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        console.log(this.props.currentUser.schoolId, 'aaa')
        // this.setState({
        //     schoolId: this.props.currentUser.schoolId
        // },()=>{
        // })
        this.initGradeList();

    }

    initGradeList(semesterId = '') {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getallGrade',
            payload: {
                stage: semesterId,
            },
        }).then(() => {
            this.setState({
                gradeList: (this.props.gradeList && this.props.gradeList) || [],
            });
        });
    }

    changeSearch = (e) => {
        this.setState({
            keywords: e.target.value,
        });
    };

    handleChange(type, val) {
        console.log('val', val)
        if (type === 'semesterId') {
            this.initGradeList(val);
            this.setState({
                gradeId: '',
            });
        }

        this.setState(
            {
                [type]: val,
            },
            () => {
                // 回调函数
                this.props.callback && this.props.callback();
            }
        );
    }

    render() {
        let { schoolId, semesterId, gradeId, subjectId, keywords, gradeList, courseType } =
            this.state;
        let { subjectList, listSchoolInfo, allStage } = this.props;
        return (
            <div className={styles.SearchHTML}>
                {window.top === window.self ? (
                    <span>
                        <span className={styles.itemTitle}>
                            {trans('course.plan.school.title', '校区')}
                        </span>
                        <Select
                            defaultValue={this.props.currentUser.schoolId}
                            // value={schoolId}
                            placeholder='选择校区'
                            style={{ width: 150 }}
                            className={styles.selectStyle}
                            onChange={this.handleChange.bind(this, 'schoolId')}
                        >
                            {/* <Option value="" key="all">
                                {trans('course.plan.school', '全部校区')}
                            </Option> */}
                            {listSchoolInfo &&
                                listSchoolInfo.length > 0 &&
                                listSchoolInfo.map((item, index) => {
                                    return (
                                        <Option value={item.schoolId} key={item.schoolId}>
                                            {locale() != 'en' ? item.name : item.enName}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </span>
                ) : null}
                <span
                    className={
                        window.top == window.self
                            ? `${styles.itemTitle} ${styles.itemTitle2}`
                            : `${styles.itemTitle}`
                    }
                >
                    {trans('course.plan.grade', '年级')}
                </span>
                <Select
                    value={semesterId}
                    style={{ width: 150 }}
                    onChange={this.handleChange.bind(this, 'semesterId')}
                    className={styles.selectStyle}
                >
                    <Option value="" key="all">
                        {trans('course.plan.stage', '全部学段')}
                    </Option>
                    {allStage &&
                        allStage.length > 0 &&
                        allStage.map((item, index) => (
                            <Option value={item.stage} key={item.id}>
                                {locale() != 'en' ? item.orgName : item.orgEname}
                            </Option>
                        ))}
                </Select>
                <Select
                    value={gradeId}
                    style={{ width: 150, marginLeft: 12 }}
                    className={styles.selectStyle}
                    onChange={this.handleChange.bind(this, 'gradeId')}
                >
                    <Option value="" key="all">
                        {trans('course.plan.allGrade', '全部年级')}
                    </Option>
                    {gradeList &&
                        gradeList.length > 0 &&
                        gradeList.map((item, index) => {
                            return (
                                <Option value={item.id} key={item.grade}>
                                    {locale() != 'en' ? item.orgName : item.orgEname}
                                </Option>
                            );
                        })}
                </Select>

                <span className={`${styles.itemTitle} ${styles.itemTitle2}`}>
                    {trans('course.plan.subject.title', '学科')}
                </span>
                <Select
                    value={subjectId}
                    style={{ width: 150 }}
                    className={styles.selectStyle}
                    onChange={this.handleChange.bind(this, 'subjectId')}
                >
                    <Option value="" key="all">
                        {trans('course.plan.allsubject', '全部科目')}
                    </Option>
                    {subjectList &&
                        subjectList.length > 0 &&
                        subjectList.map((item, index) => {
                            return (
                                <Option title={item.name} value={item.id} key={item.id}>
                                    {locale() != 'en' ? item.name : item.ename}
                                </Option>
                            );
                        })}
                </Select>
                <span className={`${styles.itemTitle} ${styles.itemTitle2}`}>类别</span>
                <Select
                    value={courseType}
                    style={{ width: 150 }}
                    className={styles.selectStyle}
                    onChange={this.handleChange.bind(this, 'courseType')}
                >
                    <Option value="" key="all">
                        全部类别
                    </Option>
                    <Option key={0} value={0}>
                        必修
                    </Option>
                    <Option key={1} value={1}>
                        课外选修
                    </Option>
                    <Option key={2} value={2}>
                        课内选修
                    </Option>
                    <Option key={3} value={3}>
                        虚拟课程
                    </Option>
                </Select>
                <Search
                    value={keywords}
                    placeholder={trans(
                        'course.setup.search.kewwrod',
                        '请输入中文名/英文名/课程编号搜索'
                    )}
                    onSearch={this.handleChange.bind(this, 'keywords')}
                    onChange={this.changeSearch}
                    style={{ width: 290 }}
                    className={styles.searchStyle}
                />
            </div>
        );
    }
}

export default SearchHTML;
