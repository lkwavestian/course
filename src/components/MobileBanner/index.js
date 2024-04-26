import React, { PureComponent } from 'react';
import { Carousel } from 'antd-mobile';
import styles from './swiper.less';
import { connect } from 'dva';
import { trans } from '../../utils/i18n';
import MyCalendarPng from '../../assets/Calendar.svg';
import RecordPng from '../../assets/Edit Square.svg';
import MyCoursePng from '../../assets/Bookmark.svg';
import MyAccountPng from '../../assets/Password.svg';
import Wallet from '../../assets/Wallet.svg';

class Banner extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bannerList: [],
        };
    }

    componentDidMount() {
        const { courseList } = this.props;
        // this.getBannerList(courseList);
    }

    componentWillReceiveProps(nextProps) {
        const { courseList } = nextProps;
        // this.getBannerList(courseList);
    }

    // 移动端查看详情
    checkDetai = (chooseCoursePlanId, coursePlanningId) => {
        // this.props.dispatch({
        //   type: 'course/showCoursePlanningDetailMobile',
        //   payload: {
        //     coursePlanningId: coursePlanningId,
        //     chooseCoursePlanId: chooseCoursePlanId,
        //     schoolId: schoolId || null,
        //   }
        // }).then(() => {
        //   if (this.props.showCoursePlanningDetail && this.props.showCoursePlanningDetail.courseName) {
        //     this.props.detailInstructionVisibleChange();
        //   }
        // })
        window.location.href = `${window.location.origin}${window.location.pathname}#/courseDetail/${coursePlanningId}/${chooseCoursePlanId}/true`;
    };

    // getBannerList = (courseList) => {
    //   let arr = [];
    //   if (courseList && courseList.length <= 5) {
    //     arr = courseList;
    //   } else {
    //     arr = courseList.slice(0, 5);
    //   }
    //   this.setState({
    //     bannerList: arr
    //   })
    // }
    remove = () => {
        localStorage.removeItem('scrollTop');
    };
    render() {
        const { bannerList } = this.state;
        return (
            <div>
                <div className={styles.tabBar}>
                    <div className={styles.tabItem}>
                        <a
                            href={`${window.location.origin}/myCourse#/course/student/myLesson`}
                            onClick={this.remove}
                        >
                            <div className={styles.itemIcon}>
                                <img src={MyCoursePng} />
                            </div>
                            <div className={styles.itemName}>
                                {trans('mobile.myCourse', '我的课程')}
                            </div>
                        </a>
                    </div>

                    <div className={styles.tabItem}>
                        <a
                            href={`${window.location.origin}/myCourse#/mobile/index`}
                            onClick={this.remove}
                        >
                            <div className={styles.itemIcon}>
                                <img src={MyCalendarPng} />
                            </div>
                            <div className={styles.itemName}>
                                {trans('mobile.myCalendar', '我的日程')}
                            </div>
                        </a>
                    </div>

                    <div className={styles.tabItem}>
                        <a
                            href={`${window.location.origin}/myCourse#/archives`}
                            onClick={this.remove}
                        >
                            <div className={styles.itemIcon}>
                                <img src={RecordPng} />
                            </div>
                            <div className={styles.itemName}>
                                {trans('mobile.archives', '成长记录')}
                            </div>
                        </a>
                    </div>

                    <div className={styles.tabItem}>
                        <a
                            href={`${
                                window.location.origin.indexOf('yungu.org') > -1
                                    ? 'https://smart-scheduling.yungu.org/?'
                                    : 'https://smart-scheduling.daily.yungu-inc.org/?'
                            }/myCourse#/wdMobilePay/index`}
                            onClick={this.remove}
                        >
                            <div className={styles.itemIcon}>
                                <img src={Wallet} />
                            </div>
                            <div className={styles.itemName}>{trans('charge.payFees', '缴费')}</div>
                        </a>
                    </div>

                    <div className={styles.tabItem}>
                        <a
                            href={`${window.location.origin}/myCourse#/course/student/personal`}
                            onClick={this.remove}
                        >
                            <div className={styles.itemIcon}>
                                <img src={MyAccountPng} />
                            </div>
                            <div className={styles.itemName}>
                                {trans('mobile.myAccount', '我的账号')}
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Banner;
