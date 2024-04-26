//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Drawer, InputItem } from 'antd-mobile';
import styles from './index.less';
import { Modal, Switch, Icon, message } from 'antd';
import { trans } from '../../utils/i18n';
// import {md5} from 'md5';
import icon from '../../icon.less';
import { config, encryptPassword } from '../../utils/utils'
import { Link } from 'dva/router';
import SelectDetailMobile from '../../components/CourseStudentDetailMobile/index';
import { throttleSetter } from 'lodash-decorators';

const md5 = require('md5');

@connect(state => ({
    bindInformation: state.studentDetail.bindInformation,
    ifLogout: state.studentDetail.ifLogout,
    publicKey: state.global.publicKey, //公钥
}))
    
export default class AccountSafe extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: 3,
            openStatus: null,
            modalVisible: false,
            phone: null,
            code: null,
            mailCheck: false,
            weixinCheck: false,
            mailCode: null,
            mail: null,
            weixin: '',
            passWord: null,
            surepassWord: null,
            logoutVisible: false,
        }
    }

    //获取公钥
    getPublicKey(callback) {
        //let fetchUrl = "/cas/getPublicKey";
        let fetchUrl = window.location.origin.indexOf("yungu.org") > -1 ? "https://login.yungu.org/cas/getPublicKey" : "https://login.daily.yungu-inc.org/cas/getPublicKey"
        window.fetch(fetchUrl, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            redirect: 'follow'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            if(json.status) {
                callback && callback(json.content);
            }else {
                message.error(json.message);
            }
        })
    }


    componentDidMount() {
        this.getUserAccountBindInformation();
    }

    //获取绑定信息
    getUserAccountBindInformation = () => {
        this.props.dispatch({
            type: 'studentDetail/getUserAccountBindInformation',
            payload: {}
        }).then(() => {
            const { bindInformation } = this.props;
            let info = bindInformation || {};
            this.setState({
                phone: info.mobile,
                phoneCheck: info.mobileIsValid,
                mail: info.email,
                mailCheck: info.emailIsValid,
                weixin: info.weiXin,
                weixinCheck: info.weiXinIsValid
            })
        })
    }

    componentWillUnmount() {
        this.setState({
            type: 3,
            openStatus: null,
            modalVisible: false,
            phone: null,
            code: null,
            mailCheck: false,
            weixinCheck: false,
            mailCode: null,
            mail: null,
            weixin: '',
            passWord: null,
            surepassWord: null,
        })
    }

    componentWillMount() {}
    closaModal = () => {
        this.setState({
            modalVisible: false,
            openStatus: null,
            code: null,
            mailCode: null,
            passWord: null,
            surepassWord: null,
        })
    }
    phoneChange = (value) => {
        this.setState({
            phone: value
        })
    }
    mailChange = (value) => {
        this.setState({
            mail: value
        })
    }
    sureCode = () => {
        this.checkMessageCode(1, () => {
            this.setState({
                modalVisible: false,
                openStatus: null,
            }) 
        })
    }
    sureMail = () => {
        this.checkMessageCode(2, () => {
            this.setState({
                modalVisible: false,
                openStatus: null,
            })
        })
    }
    numberChange = (value) => {
        this.setState({
            code: value,
        })
    }
    mailCodeChange = (value) => {
        this.setState({
            mailCode: value,
        })
    }
    passChange = (value) => {
        this.setState({
            passWord: value,
        })
    }
    surepassChange = (value) => {
        this.setState({
            surepassWord: value,
        })
    }
    phoneCheck = (checked) => {
        if (!this.state.phone) {
            message.info(trans('mobile.tip7', "请先输入手机号哦~"));
            return;
        }
        if(checked) {
            this.sendMessageCode(1, () => {
                this.setState({
                    modalVisible: true,
                    openStatus: 1,
                })
            });
        } else {
            let flag = this.judgeUnbind();
            if (!flag) {
                message.info(trans('mobile.tip6', "手机号、邮箱、微信至少要绑定一个哦~"));
                return;
            } else {
                this.unbindOtherAccount(1); 
            }
        }
        // this.setState({
        //     phoneCheck: checked,
        // })
    }
    mailCheck = (checked) => {
        if (!this.state.mail) {
            message.info(trans('mobile.tip8', "请先输入邮箱账号哦~"));
            return;
        }
        if (checked) {
            this.sendMessageCode(2, () => {
                this.setState({
                    modalVisible: true,
                    openStatus: 2,
                })
            });
            
        } else {
            let flag = this.judgeUnbind();
            if (!flag) {
                message.info(trans('mobile.tip6', "手机号、邮箱、微信至少要绑定一个哦~"));
                return;
            } else {
                this.unbindOtherAccount(2); 
            }
        }
        // this.setState({
        //     mailCheck: checked,
        // })
    }
    weixinCheck = (checked) => {
        if(checked) {
            this.setState({
                modalVisible: true,
                openStatus: 3,
            })
        } else {
            let flag = this.judgeUnbind();
            if (!flag) {
                message.info(trans('mobile.tip6', "手机号、邮箱、微信至少要绑定一个哦~"));
                return;
            } else {
                this.unbindWeChat();  
            }
        }
        // this.setState({
        //     weixinCheck: checked,
        // })
    }

    //发送验证码
    sendMessageCode = (type, callback) => {
        let payload = {};
        if (type == 1) {
            payload.mobile = this.state.phone.replace(/\s+/g,"");
        } else {
            payload.email = this.state.mail; 
        }
        this.props.dispatch({
            type: 'studentDetail/sendMessageCode',
            payload: { ...payload },
            onSuccess: () => {
                callback && callback();
            }
        })
    }

    //校验验证码
    checkMessageCode = (type, callback) => {
        let payload = {};
        if (type == 1) {
            payload.mobile = this.state.phone.replace(/\s+/g,"");
            payload.code = this.state.code;
        } else {
            payload.email = this.state.mail;
            payload.code = this.state.mailCode;
        }
        this.props.dispatch({
            type: 'studentDetail/checkMessageCode',
            payload: { ...payload },
            onSuccess: () => {
                callback && callback();
                this.getUserAccountBindInformation();
            }
        }).then(() => {
           if(this.props.ifLogout) {
                setTimeout(() => {
                    window.location.href = `${window.location.origin}/myCourse?v=${new Date().getTime()}#/course/student/detailMobile`;   
                    // let hash =
                    //     window.location.hash &&
                    //     window.location.hash.split('#/') &&
                    //     window.location.hash.split('#/')[1];
                    // window.location.href = `${window.location.origin}/myCourse?doLogout=yes&service=${encodeURIComponent(`${window.location.origin}/myCourse?hash=${hash}`)}`;
                }, 1000);  
                // this.setState({
                //     logoutVisible: true,
                // })
            }
        })
    }

    //判断解绑
    judgeUnbind = () => {
        let flag = true;
        let count = 0;
        if (this.state.phoneCheck) {
            count = count + 1;
        }
        if (this.state.mailCheck) {
            count = count + 1;
        }
        if (this.state.weixinCheck) {
            count = count + 1;
        }
        flag = count > 1 ? true : false;
        return flag;
    }

    //解绑账号
    unbindOtherAccount = (type) => {
        this.props.dispatch({
            type: 'studentDetail/unbindOtherAccount',
            payload: {
                type
            },
            onSuccess: () => {
                this.getUserAccountBindInformation();
            }
      })  
    }
    logout = () => {
        let hash =
                        window.location.hash &&
                        window.location.hash.split('#/') &&
                        window.location.hash.split('#/')[1];
        window.location.href = `${window.location.origin}/?doLogout=yes&service=${`${window.location.origin}/exteriorCourse?hash=${hash}`}`;
    }

    //微信解绑
    unbindWeChat = () => {
        this.props.dispatch({
            type: 'studentDetail/unbindWeChat',
            payload: {},
            onSuccess: () => {
                this.getUserAccountBindInformation();
            }
      })  
    }

    setPass = () => {
        this.setState({
            modalVisible: true,
            openStatus: 4,
        })
    }
    submitPassWord = () => {
        if(!this.state.passWord || this.state.passWord === '') {
            message.error(trans('global.nopassword', '请输入新密码'))
            return;
        }
        if(!this.state.surepassWord || this.state.surepassWord === '') {
            message.error(trans('global.nosurepassword', '请确认新密码'))
            return;
        }
        if(this.state.passWord !== this.state.surepassWord) {
            message.error(trans('global.passWordNotSame', '输入密码不一致'))
            return;
        }
    
        this.getPublicKey((publicKey) => {
            this.props.dispatch({
                type: 'studentDetail/updatePassword',
                payload: {
                    password: encryptPassword(publicKey, this.state.passWord)
                },
                onSuccess: () => {
                    this.setState({
                        modalVisible: false,
                        openStatus: null,
                        passWord: undefined,
                        surepassWord: undefined
                    })  
                }
            })
        })
    }
    render() {
        const { openStatus } = this.state;
        let hash =
                        window.location.hash &&
                        window.location.hash.split('#/') &&
                        window.location.hash.split('#/')[1];
        let currentUrl = `https://login.yungu.org/api/os/osWeChatCallBack?domain=${`${window.location.origin}/exteriorCourse?hash=${hash}`}&schooId=${schoolId}&userUnionId=${this.props.bindInformation.userUnionId}`;
        return (
            <div className={styles.accountSafe}>
                <div className={styles.safeTitle}>{trans('global.accountSafe', '账号安全')}</div>
                <div className={styles.safeItem}>
                <InputItem
                    type={"phone"}
                    placeholder=""
                    // ref={el => this.inputRef = el}
                    // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                    clear={false}
                    value={this.state.phone}
                    onChange={this.phoneChange}
                    // disabledKeys={['.', '0', '3']}
                    disabled={this.state.phoneCheck}
                    >{trans('mobile.phone', '手机')}</InputItem>
                <Switch checkedChildren={trans('mobile.unBind', '解绑')} unCheckedChildren={trans('mobile.bind', '绑定')} size="large" onChange={this.phoneCheck} checked={this.state.phoneCheck}/>
                </div>
                <div className={styles.safeItem}>
                <InputItem
                    placeholder=""
                    // ref={el => this.inputRef = el}
                    // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                    clear={false}
                    value={this.state.mail}
                    onChange={this.mailChange}
                    disabled={this.state.mailCheck}
                    // disabledKeys={['.', '0', '3']}
                >{trans('mobile.email', '邮箱')}</InputItem>
                <Switch checkedChildren={trans('mobile.unBind', '解绑')} unCheckedChildren={trans('mobile.bind', '绑定')} size="large" onChange={this.mailCheck} checked={this.state.mailCheck}/>
                </div>
                <div className={styles.safeItem}>
                <InputItem
                    placeholder=""
                    // ref={el => this.inputRef = el}
                    // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                    clear={false}
                    editable={false}
                    value={this.state.weixin}
                    // onChange={this.mailChange}
                    // disabledKeys={['.', '0', '3']}
                    >{trans('mobile.weChat', '微信')}</InputItem>
                <Switch checkedChildren={trans('mobile.unBind', '解绑')} unCheckedChildren={trans('mobile.bind', '绑定')} size="large" onChange={this.weixinCheck} checked={this.state.weixinCheck}/>
                </div>
                <div className={styles.safeItem}>
                    <div className={styles.setPassButton} onClick={this.setPass} >{trans('global.setPass', '修改密码')}</div>
                </div>
                <Link to={`/course/student/personal`}>
                    <div className={styles.closeModal}>
                        <span>{trans('pay.confirmCancelBackPrevious', '返回上层')}</span></div>
                </Link>
                <Modal
                    visible={this.state.modalVisible}
                    footer={null}
                    destroyOnClose={true}
                    // width="100%"
                    getContainer={false}
                    closable={true}
                    className={styles.detailInstructionModal}
                    onCancel={() => {
                       this.closaModal()
                    }}
                    style={{ top: '60px' }}
                >
                    {
                        openStatus && openStatus === 1 ?
                        <div>
                            <div>{trans('mobile.tip9', '验证码已发送至您的手机，请输入验证码')}</div>
                            <InputItem
                                type={"money"}
                                placeholder=""
                                // ref={el => this.inputRef = el}
                                // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                clear={false}
                                value={this.state.code}
                                onChange={this.numberChange}
                                onVirtualKeyboardConfirm={this.sureCode}
                                // disabledKeys={['.', '0', '3']}
                            >{trans('mobile.code', '验证码')}</InputItem>
                        </div> : 
                         openStatus && openStatus === 2 ?
                         <div>
                            <div>{trans('mobile.tip10', '验证码已发送至您的邮箱，请输入验证码')}</div>
                         <InputItem
                             type={"money"}
                             placeholder=""
                             // ref={el => this.inputRef = el}
                             // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                             clear={false}
                             value={this.state.mailCode}
                             onChange={this.mailCodeChange}
                             onVirtualKeyboardConfirm={this.sureMail}
                             // disabledKeys={['.', '0', '3']}
                         >{trans('mobile.code', '验证码')}</InputItem>
                     </div> : openStatus && openStatus === 3 ?
                            <a className={styles.weChatLogin}
                            href={`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.weixinAppid
                                }&redirect_uri=${encodeURIComponent(
                                    currentUrl
                                )}&response_type=code&scope=snsapi_userinfo&state=app#wechat_redirect`}
                        >
                            <Icon type="wechat" />
                            <span>{trans("global.weixin", '绑定微信')}</span>
                        </a> :  openStatus && openStatus === 4 ?
                        <div className={styles.pwdArea}>
                            <InputItem
                             type={"password"}
                             placeholder={trans('mobile.tip11', '输入新密码')}
                             // ref={el => this.inputRef = el}
                             // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                             clear={false}
                             value={this.state.passWord}
                             onChange={this.passChange}
                             onVirtualKeyboardConfirm={this.sureMail}
                             // disabledKeys={['.', '0', '3']}
                         >{trans('mobie.newPwd', '新密码')}</InputItem>
                          <InputItem
                             type={"password"}
                             placeholder={trans('mobile.tip12', '确认新密码')}
                             // ref={el => this.inputRef = el}
                             // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                             clear={false}
                             value={this.state.surepassWord}
                             onChange={this.surepassChange}
                             onVirtualKeyboardConfirm={this.sureMail}
                             // disabledKeys={['.', '0', '3']}
                         >{trans('mobile.tipSurePwd', '确认新密码')}</InputItem>
                                            <div className={styles.surepassWord} onClick={this.submitPassWord}>{trans('mobile.submit', '提交')}</div>
                        </div>
                        : null
                    }
                </Modal>
                <Modal
                    visible={this.state.logoutVisible}
                    footer={null}
                    destroyOnClose={true}
                    // width="100%"
                    getContainer={false}
                    closable={false}
                    className={styles.logoutModal}
                >
                    <div>
                        <div>{trans('global.outMessage', "已经为您匹配到了相关信息，请重新登录")}</div>
                        <div className={styles.sureButton} onClick={this.logout}>{trans('global.confirm', '确定')}</div>
                    </div>
                </Modal>
            </div>
        );
    }
}
