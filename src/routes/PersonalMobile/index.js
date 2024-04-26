//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Modal, Switch, Icon } from 'antd';
import { trans } from '../../utils/i18n';
import icon from '../../icon.less';

import SelectDetailMobile from '../../components/CourseStudentDetailMobile/index';
@connect((state) => ({
   
    currentUser: state.global.currentUser,
}))
export default class PersonalMobile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: 3,
            openStatus: null,
            modalVisible: false,
        }
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getNewCurrentUser',
            onFail: () => {
                console.log('/11111')
                let hash =
                        window.location.hash &&
                        window.location.hash.split('#/') &&
                        window.location.hash.split('#/')[1];
                    let currentUrl = `${window.location.origin}/myCourse?path=${hash}`;
                    let host =
                        currentUrl.indexOf('daily') > -1
                            ? 'https://login.daily.yungu-inc.org'
                            : 'https://login.yungu.org';
                    let userIdentity = localStorage.getItem('userIdentity');
                    // debugger;
                    window.location.href =
                        host + '/cas/login?service=' + encodeURIComponent(currentUrl);
            }
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });

    }
    logout = () => {
        let hash =
                        window.location.hash &&
                        window.location.hash.split('#/') &&
                        window.location.hash.split('#/')[1];
        window.location.href = `${window.location.origin}/myCourse?doLogout=yes&service=${encodeURIComponent(`${window.location.origin}/myCourse?hash=${hash}`)}`;
    }
    closaModal = () => {
        this.setState({
            modalVisible: false,
            openStatus: null,
        })
    }
    render() {
        return (
            <div className={styles.personalList}>
                <div className={styles.cardList}>
                    <div className={styles.personal}>
                    <a href={`${window.location.origin}/exteriorCourse#/course/student/PersonalMessage`}>
                        <div className={styles.personBox}>
                            
                                <div>{trans('student.personalInfo', '个人信息')}</div>
                                <i className={icon.iconfont}>&#xe731;</i>
                                                    
                        </div>
                        </a> 
                        <a href={`${window.location.origin}/exteriorCourse#/course/student/AccountSafe`}>
                        <div className={styles.personBox}>
                        
                            <div>{trans('global.accountSafe', '账号安全')}</div>
                            <i className={icon.iconfont}>&#xe731;</i>                       
                        </div>
                        </a>
                    </div> 
                    <div onClick={this.logout} className={styles.logoutButton}>
                        {trans('global.logot', '退出登录')}
                    </div>
                </div>
                <a href={`${window.location.origin}${window.location.pathname}#/course/student/detailMobile`}>
                <span
                    className={[icon.iconfont, styles.closeModal].join(' ')}
                >
                    <span>{trans('mobile.returnHome', '返回首页')}</span>
                </span>
                </a>
            </div>
        );
    }
}
