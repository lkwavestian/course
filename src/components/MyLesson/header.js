import React, { PureComponent } from 'react';
import styles from './header.less';
import { Dropdown, Avatar, Menu, Modal } from 'antd';
import { trans, locale } from '../../utils/i18n';
import { connect } from 'dva';
import icon from '../../icon.less';

@connect(state => ({
  currentUser: state.global.currentUser,
}))

export default class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showValue: false,
      iframeVisible: false,
      cur: 0,
      organizationVisible: false,
    }
  }

  componentDidMount() {
    const self = this
    window.onmessage = function (message) {
      if (message.data == 'close') {
        self.setState({
          iframeVisible: false,
          organizationVisible: false,
        })
      } else if (message.data == 'reload') {
        self.setState({
          iframeVisible: false,
          organizationVisible: false,
        })
        window.location.reload();
      }
    }
  }

  selectClick = () => {
    if (window._czc) {
      window._czc.push(["_trackEvent", 'changeIdentity', '切换身份']);
    }
    this.setState({
      showValue: false,
      iframeVisible: true
    })
  }
  organizationClick = () => {
    if (window._czc) {
      window._czc.push(["_trackEvent", 'changeorganization', '切换组织']);
    }
    this.setState({
      showValue: false,
      organizationVisible: true
    })
  }
  showOff = () => {
    this.setState({
      iframeVisible: false
    })
  }

  languageClick = () => {
    let lang = locale() === "en" ? "cn" : "en";
    this.props.dispatch({
      type: 'global/checkLangeNew',
      payload: {
        languageCode: lang,
      },
    });
  }

  //处理可配置化nav
  configureNav = (nav) => {
    const { currentUser } = this.props;
    let schoolId = currentUser && currentUser.schoolId ? currentUser.schoolId : "";
    let externalParent = currentUser && currentUser.externalSchool && currentUser.currentIdentity == "parent" ? true : false;
    if (schoolId && schoolId != 1 && !externalParent) {//非云谷学校
      let module = typeof purchaseModuleList != "undefined" ? (purchaseModuleList || []) : [];
      let resultNav = nav;
      for (let i = 0; i < module.length; i++) {
        if (module[i].code == 2) { //记录
          resultNav.push({
            title: trans('mobile.archives', '成长记录'),
            key: 2,
            path: `${window.location.origin}/exteriorCourse?type=1#/archives`
          })
        }
        if (module[i].code == 14) { //日程
          resultNav.push({
            title: trans('mobile.myCalendar', '我的日程'),
            key: 1,
            path: `${window.location.origin}/exteriorCourse?type=1#/mobile/index`
          })
        }
      }
      return resultNav;
    } else { //云谷学校
      return nav;
    }
  }

  renderTab = () => {
    const { cur } = this.props;
    let nav = [
      {
        title: trans('mobile.allCourse', '全部课程'),
        key: 0,
        path: `${window.location.origin}/exteriorCourse?type=1#/course/student/detailMobile`
      }
    ]
    nav = this.configureNav(nav);
    return <div className={styles.tabContent}>
      {
        nav.map((item) => (
          <a className={cur == item.key ? styles.activeItem : ''} href={item.path} style={{ marginRight: locale() === "en" ? "5px" : "10px" }}>{item.title}</a>
        ))
      }
    </div>
  }

  renderIdentify = () => {
    const { currentUser } = this.props;
    const menu = (
      <Menu className={styles.menu}>
        <Menu.Item onClick={this.languageClick}>{locale() === 'en' ? '切换至中文' : 'Switch to EN'}</Menu.Item>
        <Menu.Item onClick={this.organizationClick}>{locale() === 'en' ? 'Organization switch' : '切换组织'} </Menu.Item>
        <Menu.Item onClick={this.selectClick}>{locale() === 'en' ? 'Role switch' : '切换身份'} </Menu.Item>
        <Menu.Item onClick={()=>{location.href="/myCourse?doLogout=yes"}}>{locale() === 'en' ? 'Exit' : '退出登录'} </Menu.Item>
      </Menu>
    )
    return <div>
      {

        currentUser.userId
          ? (<Dropdown overlay={menu} trigger={['click']} onVisibleChange={this.visibleChange} overlayClassName={styles.dropStyle}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
              <span className={styles.name} style={{ color: "#595959" }}>{currentUser.name || "..."}</span>
              <i className={icon.iconfont} style={{ color: "#595959" }}>&#xe659;</i>
            </span>
          </Dropdown>)
          : null
      }

    </div>
  }

  render() {
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/ig, '');
    let identifyHost = currentUrl.indexOf('yungu.org') > -1
      ? 'https://task.yungu.org/common/switchIdentity/#/user/switchIdentity?language=zh-CN'
      : 'https://task.daily.yungu-inc.org/common/switchIdentity/#/user/switchIdentity?language=zh-CN';
    let organizationHost = currentUrl.indexOf('yungu.org') > -1
    ? 'https://task.yungu.org/common/switchIdentity/#/user/switchOrganization?language=zh-CN'
    : 'https://task.daily.yungu-inc.org/common/switchIdentity/#/user/switchOrganization?language=zh-CN';
    return <div>
      <div className={styles.header}>
        {this.renderTab()}
        {this.renderIdentify()}
      </div>
      {
        this.state.iframeVisible
        &&
        <div className={styles.ifDiv}>
          <div className={styles.ifDiv2} onClick={this.showOff}></div>
          <div className={styles.ifDiv3}>
            <div className={styles.ifDiv4}>
              <div className={styles.ifDivFont}>{locale() === 'en' ? 'Role switch' : '切换身份'}</div>
              <i className={icon.iconfont} onClick={() => { this.setState({ iframeVisible: false }) }} style={{ cursor: "pointer" }}>&#xe6e2;</i>
            </div>
            <iframe
              src={identifyHost}
              className={styles.iframeStyle}
              display="initial"
              position="relative"
              marginWidth="0"
              marginHeight="0"
              scrolling="no"
              width="100%"
            />
          </div>
        </div>
      }
      {
        this.state.organizationVisible && 
        <div className={styles.ifDiv}>
          <div className={styles.ifDiv2} onClick={this.showOff}></div>
          <div className={styles.ifDiv3}>
            <div className={styles.ifDiv4}>
              <div className={styles.ifDivFont}>{locale() === 'en' ? 'Organization switch' : '切换组织'}</div>
              <i className={icon.iconfont} onClick={() => { this.setState({ organizationVisible: false }) }} style={{ cursor: "pointer" }}>&#xe6e2;</i>
            </div>
            <iframe
              src={organizationHost}
              className={styles.iframeStyle}
              display="initial"
              position="relative"
              marginWidth="0"
              marginHeight="0"
              scrolling="no"
              width="100%"
            />
          </div>
        </div>
      }
    </div>

  }
} 