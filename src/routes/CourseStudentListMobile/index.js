//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import StudentList from '../../components/CourseStudentList/index';
import BasicHeader from '../../layouts/BasicLayout';
import { Link } from 'dva/router';
import { getUrlSearch } from '../../utils/utils';
import studentCourse from '../../assets/studentCourse.png';
import Header from '../../components/CourseStudentDetailMobile/header';
import Banner from '../../components/MobileBanner/index';

@connect((state) => ({
    studentCourseList: state.studentDetail.studentCourseList,
    currentUser: state.global.currentUser,
}))
export default class CourseStudentListMobile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cur: '0',
            listHeight: document.body.clientHeight - 60,
            page: 1,
            pageSize: 9,
        };
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getNewCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
        document.getElementsByTagName('title')[0].innerHTML = '选课';
        this.props.dispatch({
            type: 'studentDetail/getOpenStatus',
            payload: {
                open: this.props.location.isNeedOpen,
            },
        });
        this.props.dispatch({
            type: 'studentDetail/getStudentListCourse',
            payload: {
                pageNum: this.state.page,
                pageSize: this.state.pageSize,
            },
        });
    }
    toDetail = (item) => {
        let planMsg = JSON.stringify(item);
        localStorage.setItem('planMsg', planMsg);
    };
    switchNavList = (key) => {};

    render() {
        const { studentCourseList, currentUser } = this.props;
        const navList = [
            {
                name: `${trans('list.header.tab', '选课')}`,
                key: '0',
            },
        ];
        let isIPad = getUrlSearch('isIPad') === 'true' ? true : false;
        const { isNeedOpen } = this.props.location;
        return (
            <div className={styles.CourseStudentListMobile}>
                <div className={styles.studentListMobile}>
                    <Header />
                    <Banner currentUser={currentUser} />
                    {studentCourseList.choosePlanList && studentCourseList.choosePlanList.length
                        ? studentCourseList.choosePlanList.map((item) => (
                              <Link
                                  to={`/course/student/detailMobile`}
                                  onClick={this.toDetail.bind(this, item)}
                              >
                                  <div
                                      className={styles.mobileCard}
                                      style={{ backgroundImage: `url("${studentCourse}")` }}
                                  >
                                      <div className={styles.classTitle}>{item.name}</div>
                                      <div className={styles.startTime}>
                                          {item.startTime}
                                          <span style={{ marginLeft: '5px' }}>
                                              {trans('global.startChoose', '选课开始')}
                                          </span>
                                      </div>
                                      <div className={styles.startTime}>
                                          {item.endTime}
                                          <span style={{ marginLeft: '5px' }}>
                                              {trans('global.endChoose', '选课结束')}
                                          </span>
                                      </div>
                                  </div>
                              </Link>
                          ))
                        : null}
                </div>
            </div>
        );
    }
}
