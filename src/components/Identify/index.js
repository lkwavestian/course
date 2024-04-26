import React, { Component } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dropdown, Avatar, Menu, Modal } from 'antd';
import icon from '../../icon.less';
import { trans, locale } from '../../utils/i18n';

@connect(state => ({
  currentUser: state.global.currentUser,
}))

class Identify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showValue: false,
      iframeVisible: false,
    };
  }

  componentDidMount() {
    const self = this
    window.onmessage = function (message) {
      if (message.data == 'close') {
        self.setState({
          iframeVisible: false
        })
      } else if (message.data == 'reload') {
        self.setState({
          iframeVisible: false
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

  render() {
    const { currentUser } = this.props;
    console.log(currentUser, 'currentUsers')
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/ig, '');
    let identifyHost = currentUrl.indexOf('yungu.org') > -1
      ? 'https://task.yungu.org/common/switchIdentity/#/user/switchIdentity?language=zh-CN'
      : 'https://task.daily.yungu-inc.org/common/switchIdentity/#/user/switchIdentity?language=zh-CN';
    const menu = (
      <Menu className={styles.men}>
        <Menu.Item onClick={this.languageClick}>{locale() === 'en' ? '切换至中文' : 'Switch to EN'}</Menu.Item>
        <Menu.Item onClick={this.selectClick}>{locale() === 'en' ? 'Role switch' : '切换身份'} </Menu.Item>
      </Menu>
    )
    return <div>
      {

        currentUser.userId
          ? (<Dropdown overlay={menu} trigger={['click']} onVisibleChange={this.visibleChange}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
              <span className={styles.name} style={{ color: "#595959" }}>{currentUser.identityShowName || "..."}</span>
              <i className={icon.iconfont} style={{ color: "#595959" }}>&#xe659;</i>
            </span>
          </Dropdown>)
          : null
      }
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
    </div>
  }
}

export default Identify;