//日程
import React, { PureComponent } from 'react';
import styles from './iframe.less';
import Header from './header';
import icon from '../../icon.less';
import { connect } from 'dva';
import { trans } from '../../utils/i18n';

@connect((state) => ({}))

export default class MyCalendar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
    }
  }

  componentDidMount() {
    if (this.state.type == 1) {
      this.getCurrentUserInfo();
    }
    // 自适应高度
    this.updateSize();
  }

  getCurrentUserInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getNewCurrentUser',
    }).then(() => {
      const { currentUser } = this.props;
      localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
    });
  };

  changeType = (type) => {
    this.setState({
      type,
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateSize());
  }

  updateSize() {
    // 窗口变化时重新获取高度
    let __windowClientHeight = document.body.clientHeight;
    this.setState({
      height: __windowClientHeight - 60,
    });
  }
  render() {
    let origin = window.location.origin.indexOf("yungu.org") > -1 ? "https://calendar.yungu.org/#/" : "https://calendar.daily.yungu-inc.org/#/";
    let url = origin + `mobile/weekIndex/no`;
    return <div className={styles.contentBox}>
      <div className={styles.header}>
        <Header cur={1} />
      </div>
      <div className={styles.content}>
        <iframe src={url} width="100%"></iframe>
      </div>
      {/* <div className={styles.lessonChangeTab}>
        <div className={[styles.changeButton].join(' ')}>
          <div><i className={[icon.iconfont, styles.isCheck].join(' ')}>&#xe628;</i></div>
          <div className={styles.isCheckName}>{trans('mobile.allCourse', '全部课程')}</div>
        </div>
        <div className={[styles.changeButton].join(' ')}>
          <a href={`${window.location.origin}/exteriorCourse?type=2#/course/student/detailMobile`}>
            <div><i className={icon.iconfont}>&#xe798;</i></div>
            <div>{trans('mobile.myCourse', '我的课程')}</div>
          </a>
        </div>
        <div className={[styles.changeButton].join(' ')}>
          <a href={`${window.location.origin}/exteriorCourse?type=1#/course/student/personal`}>
            <div><i className={icon.iconfont}>&#xe60f;</i></div>
            <div>{trans('mobile.myAccount', '我的账号')}</div>
          </a>
        </div>
      </div> */}
      <a href={`${window.location.origin}${window.location.pathname}#/course/student/detailMobile`}>
                <span
                    className={[icon.iconfont, styles.closeModal].join(' ')}
                >
                    {trans('mobile.returnHome', '返回首页')}
                </span>
                </a>
    </div>
  }
}
