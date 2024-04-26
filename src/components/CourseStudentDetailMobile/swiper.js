import React, { PureComponent } from 'react';
import { Carousel } from 'antd-mobile';
import styles from './swiper.less';
import { connect } from 'dva';
import { trans } from '../../utils/i18n';
import MyCalendarPng from '../../assets/Calendar.svg';
import RecordPng from '../../assets/Edit Square.svg';
import MyCoursePng from '../../assets/Bookmark.svg';
import MyAccountPng from '../../assets/Password.svg';
@connect((state) => ({
    courseList: state.studentDetail.courseList,
    showCoursePlanningDetail: state.course.showCoursePlanningDetail,
}))
class Banner extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bannerList: [],
        };
    }

    componentDidMount() {
        const { courseList } = this.props;
        this.getBannerList(courseList);
    }

    componentWillReceiveProps(nextProps) {
        const { courseList } = nextProps;
        this.getBannerList(courseList);
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
        localStorage.removeItem('scrollTop');
        if (this.props.planMsgId && !externalSchool) {
            window.location.href = `${window.location.origin}${window.location.pathname}?planMsgId=${this.props.planMsgId}#/courseDetail/${coursePlanningId}/${chooseCoursePlanId}/true`;
        } else {
            window.location.href = `${window.location.origin}${window.location.pathname}#/courseDetail/${coursePlanningId}/${chooseCoursePlanId}/true`;
        }
    };

    getBannerList = (courseList) => {
        let arr = [];
        if (courseList && courseList.length <= 5) {
            arr = courseList;
        } else {
            arr = (courseList && courseList.slice(0, 5)) || [];
        }
        this.setState({
            bannerList: arr,
        });
    };

    render() {
        const { bannerList } = this.state;
        return (
            <div>
                {bannerList && bannerList.length > 0 ? (
                    <div className={styles.swiperBox}>
                        <Carousel
                            autoplay={true}
                            infinite={true}
                            // frameOverflow="visible"
                            cellSpacing={10}
                            slideWidth={0.9}
                            className={styles.swiperList}
                        >
                            {bannerList.map((item, index) => (
                                <div
                                    className={styles.banner}
                                    key={index}
                                    style={{ backgroundImage: `url('${item.courseCover}')` }}
                                    onClick={() =>
                                        this.checkDetai(
                                            item.chooseCoursePlanId,
                                            item.coursePlanningId
                                        )
                                    }
                                ></div>
                            ))}
                        </Carousel>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Banner;
