//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import { Link } from 'dva/router';
import studentCourseImgSrc from '../../assets/studentCourse.png';
import { Tabs } from 'antd';
import moment from 'moment';
const { TabPane } = Tabs;
@connect((state) => ({
    studentCourseList: state.studentDetail.studentCourseList,
    parentChildList: state.studentDetail.parentChildList,
    currentUser: state.global.currentUser,
}))
export default class CourseStudentListMobileYunGu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 9,
            studentUserId: '',
            gradeNum: '',
        };
    }

    async componentDidMount() {
        const { dispatch } = this.props;
        document.getElementsByTagName('title')[0].innerHTML = '选课';
        await this.getCurrentUser();
        await this.getParentChildList();
        await this.getStudentListCourse();
    }

    getCurrentUser = () => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'global/getCurrentUser',
        });
    };

    getParentChildList = () => {
        const { dispatch, currentUser } = this.props;
        return dispatch({
            type: 'studentDetail/getParentChildList',
            payload: {
                schoolId: currentUser.schoolId,
                userId: currentUser.userId,
            },
        });
    };

    getStudentListCourse = () => {
        const { dispatch, parentChildList } = this.props;
        const { page, pageSize, studentUserId } = this.state;
        localStorage.setItem('userId', parentChildList[0].userId)
        return dispatch({
            type: 'studentDetail/getStudentListCourse',
            payload: {
                pageNum: page,
                pageSize: pageSize,
                userId: studentUserId ? studentUserId : parentChildList[0].userId,
            },
        });
    };

    setPlanMsg = (planMsg) => {
        const { dispatch, parentChildList } = this.props;
        const { studentUserId, gradeNum } = this.state;
        console.log('studentUserId: ', studentUserId, parentChildList);
        localStorage.setItem(
            'planMsgH5',
            JSON.stringify({
                ...planMsg,
                userId: studentUserId ? studentUserId : parentChildList[0].userId,
            })
        );
        
        localStorage.setItem('gradeNum',gradeNum || parentChildList[0].gradeNumber)
        dispatch({
            type: 'studentDetail/setPlanMsg',
            payload: planMsg,
        });
        // dispatch({
        //     type: 'studentDetail/getStudentCourseDetails',
        //     payload: {
        //         planId: planMsg.id, // --选课计划 id
        //     },
        // });
    };

    getStudentCourseListHtml = () => {
        const { studentCourseList } = this.props;
        return (
            <div className={styles.studentListMobile}>
                {studentCourseList.choosePlanList && studentCourseList.choosePlanList.length
                    ? studentCourseList.choosePlanList.map((item) => (
                          <Link
                              to={`/course/student/MyDetailMobile/`}
                              onClick={() => this.setPlanMsg(item)}
                          >
                              <div
                                  className={styles.mobileCard}
                                  style={{ backgroundImage: `url("${studentCourseImgSrc}")` }}
                              >
                                  <div className={styles.classTitle}>{item.name}</div>
                                  <div className={styles.timeWrapper}>
                                      <div className={styles.courseTime}>
                                          <span>{trans('global.startChoose', '选课开始')}</span>
                                          {moment(item.startTime).format('YYYY-MM-DD HH:mm')}
                                      </div>
                                      <div className={styles.courseTime}>
                                          <span>{trans('global.endChoose', '选课结束')}</span>
                                          {moment(item.endTime).format('YYYY-MM-DD HH:mm')}
                                      </div>
                                  </div>
                                  {item.status == 0 && (
                                      <div>
                                          <span className={styles.type}>未开始</span>
                                      </div>
                                  )}
                                  {(item.status == 1 || item.status == 2) && (
                                      <div>
                                          <span className={styles.type}>选课中</span>
                                      </div>
                                  )}
                                  {item.status == 3 && (
                                      <div>
                                          <span className={styles.type}>已结束</span>
                                      </div>
                                  )}
                              </div>
                          </Link>
                      ))
                    : null}
            </div>
        );
    };

    childTabChange = (key) => {
        console.log('key: ', key);
        const {parentChildList} = this.props;
        console.log('parentChildList: ', parentChildList,parentChildList[key-1]);
        let tempObj = parentChildList.filter(obj=>obj.userId == key);
        console.log('tempObj: ', tempObj);

        let tempNumber = tempObj[0].gradeNumber;
        console.log('tempNumber: ', tempNumber);

        this.setState(
            {
                studentUserId: Number(key),
                gradeNum: tempNumber
            },
            () => {
                console.log(this.state.studentUserId,'studentUserId')
                this.getStudentListCourse();
            }
        );
    };

    render() {
        const { parentChildList } = this.props;
        return (
            <div className={styles.CourseStudentListMobileYunGu}>
                <Tabs onChange={this.childTabChange}>
                    {parentChildList.map((item) => (
                        <TabPane tab={item.name} key={item.userId}>
                            {this.getStudentCourseListHtml()}
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        );
    }
}
