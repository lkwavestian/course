//个人信息
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import { InputItem } from 'antd-mobile';
import { Modal, Switch, Icon, message } from 'antd';
import icon from '../../icon.less';
import { Link } from 'dva/router';
import SelectDetailMobile from '../../components/CourseStudentDetailMobile/index';
// import VConsole from 'vconsole';
@connect(state => ({
    information: state.studentDetail.information,
    ifLogout: state.studentDetail.ifLogout,
    currentUser: state.global.currentUser,
}))

export default class PersonalMobile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: 3,
            openStatus: null,
            ifSwitch: false,
            modalVisible: false,
            name: '',
            code: '',
            phone: null,
            mail: '',
            role: '',
            phoneCheck: false,
            logoutVisible: false,
            internalChildrenInformationList: [],
            childList: [
                {
                    childrenName: '',
                    sex: null,
                    cardNo: null,
                    educatedSchool: '',
                }
            ]
        }
    }

    componentDidMount() {
        this.getInformation();
        // let vConsole = new VConsole();
    }

    componentWillUnmount() {
        this.setState({
            type: 3,
            openStatus: null,
            modalVisible: false,
            name: '',
            phone: null,
            mail: '',
            role: '',
            childList: [
                {
                    childrenName: '',
                    sex: null,
                    cardNo: null,
                    educatedSchool: '',
                }
            ]
        })
    }

    //获取个人信息
    getInformation = () => {
        this.props.dispatch({
            type: 'studentDetail/getInformation',
            payload: {},
            onFail: () => {
                let hash =
                    window.location.hash &&
                    window.location.hash.split('#/') &&
                    window.location.hash.split('#/')[1];
                let currentUrl = `${window.location.origin}/myCourse${window.location.search}&path=${hash}`;
                let host =
                    currentUrl.indexOf('daily') > -1
                        ? 'https://login.daily.yungu-inc.org'
                        : 'https://login.yungu.org';
                let userIdentity = localStorage.getItem('userIdentity');
                window.location.href =
                    host + '/cas/login?service=' + encodeURIComponent(currentUrl);
            }
        }).then(() => {
            const { information } = this.props;
            let info = information || {};
            this.setState({
                name: info.name ? info.name : '',
                phone: info.phone ? info.phone : null,
                phoneCheck: info.mobileValid,
                mail: info.email ? info.email : null,
                role: info.sex? info.sex : '',
                ifSwitch: info.phone && info.phone !== '' ? false : true,
                internalChildrenInformationList: info.internalChildrenInformationList || [],
                childList: info.externalSchool ? info.childrenInformationList && info.childrenInformationList.length>0 ? info.childrenInformationList:
                [{
                    childrenName: '',
                    sex: null,
                    cardNo: null,
                    educatedSchool: '',
                }
            ] : []
            })
        })
    }

    componentWillMount() { }
    closaModal = () => {
        this.setState({
            modalVisible: false,
            openStatus: null,
        })
    }
    nameChange = (value) => {
        this.setState({
            name: value,
        })
    }
    phoneChange = (value) => {
        this.setState({
            phone: value,
        })
    }
    mailChange = (value) => {
        this.setState({
            mail: value,
        })
    }
    checkRole = (value) => {
        if(!(this.props.information && this.props.information.externalSchool)) {
            return;
        }
        this.setState({
            role: value,
        })
    }
    childNameChange = (index, value) => {
        const list = JSON.parse(JSON.stringify(this.state.childList));
        list[index].childrenName = value;
        this.setState({
            childList: list,
        })
    }
    changeSchool = (index, value) => {
        const list = JSON.parse(JSON.stringify(this.state.childList));
        list[index].educatedSchool = value;
        this.setState({
            childList: list,
        })
    }
    cardIdChange = (index, value) => {
        const list = JSON.parse(JSON.stringify(this.state.childList));
        list[index].cardNo = value;
        this.setState({
            childList: list,
        })
    }
    cardIdChangeInter = (index, value) => {
        const list = JSON.parse(JSON.stringify(this.state.internalChildrenInformationList));
        list[index].cardNo = value;
        console.log(list, 'll')
        this.setState({
            internalChildrenInformationList: list,
        })
    }
    checkGender = (index, value) => {
        if(!(this.props.information && this.props.information.externalSchool)) {
            return;
        }
        const list = JSON.parse(JSON.stringify(this.state.childList));
        list[index].sex = value;
        this.setState({
            childList: list,
        })
    }
    checkGenderInter = (index, value) => {
        const list = JSON.parse(JSON.stringify(this.state.internalChildrenInformationList));
        list[index].sex = value;
        this.setState({
            internalChildrenInformationList: list,
        })
    }
    addChild = () => {
        const list = JSON.parse(JSON.stringify(this.state.childList));
        list.push({
            childrenName: '',
            sex: null,
            cardNo: null,
        })
        this.setState({
            childList: list,
        })
    }
    submit = () => {
        console.log(this.state, 'ssa')
        // debugger;
        if (!this.state.name || this.state.name === '') {
            message.error(trans('global.noname', '请填写个人姓名'));
            return;
        } else if (!this.state.phone || this.state.phone === '') {
            message.error(trans('global.nophone', '请填写手机号码'));
            return;
        }
        else if (this.props.information.externalSchool && !this.state.phoneCheck) {
            message.error(trans('global.noCheckPhone', '请绑定手机号码'));
        } else if (!this.state.mail || this.state.mail === '') {
            message.error(trans('global.nomail', '请填写邮箱'));
            return;
        } else if (this.props.information.externalSchool && (!this.state.role || this.state.role === '')) {
            message.error(trans('global.norole', '请选择角色'));
            return;
        } else if (this.props.information.externalSchool && this.props.information.externalSchool && this.state.childList && this.state.childList.length) {
            let ifReturn = false;
            this.state.childList.map(item => {
                if (!item.childrenName || item.childrenName === '') {
                    message.error(trans('global.nochildName', '请填写子女姓名'));
                    ifReturn = true;
                    return;
                } else if (!item.sex || item.sex === '') {
                    message.error(trans('global.nochildGender', '请选择子女性别'));
                    ifReturn = true;
                    return;
                } else if(!item.educatedSchool || item.educatedSchool === '') {
                    message.error(trans('global.noSchool', '请填写子女就读学校'));
                    ifReturn = true;
                    return;
                }
            })
            console.log(ifReturn, 'ifif')
            if (ifReturn) {
                return;
            } else {
                console.log(this.state.internalChildrenInformationList, '111')
                this.props.dispatch({
                    type: 'studentDetail/saveInformation',
                    payload: {
                        name: this.state.name,
                        phone: this.state.phone.replace(/\s+/g,""),
                        email: this.state.mail,
                        sex: this.state.role,
                        childrenInformationList:  this.state.childList.concat(this.state.internalChildrenInformationList),
                    },
                    onSuccess: () => {
                        // message.success(111, "success");
                        if(window.location.search && window.location.search !== '' && window.location.search.indexOf('fromDetail') !== -1) {
                            let search = window.location.search.split('&fromDetail=true')[0] + window.location.search.split('&fromDetail=true')[1]
                            window.location.href = `${window.location.origin}/myCourse${search}#/course/student/detailMobile`
                        } else {
                            setTimeout(() => {
                                window.location.href = `${window.location.origin}${window.location.pathname}#/course/student/personal`;
                            }, 200);
                        }
                        
                    }
                })
            }
        } else if (!this.props.information.externalSchool && this.state.childList && this.state.childList.length === 0) {
            this.props.dispatch({
                type: 'studentDetail/saveInformation',
                payload: {
                    name: this.state.name,
                    phone: this.state.phone.replace(/\s+/g,""),
                    email: this.state.mail,
                    sex: this.state.role,
                    childrenInformationList:  this.state.childList.concat(this.state.internalChildrenInformationList),
                },
                onSuccess: () => {
                    // message.success(111, "success");
                    this.goBack();
                }
            })
        }
        console.log('success')
    }
    goBack = () => {
        if(window.location.search && window.location.search !== '' && window.location.search.indexOf('fromDetail') !== -1) {
            let search = window.location.search.split('fromDetail=')[1].split('&')[0];
            if(window.location.search.indexOf('planMsgId=') !== -1) {
                window.location.href = `${window.location.origin}${window.location.pathname}?planMsgId=${window.location.search.split('planMsgId=')[1].split('&')[0]}#/${search}`           
            } else {
                window.location.href = `${window.location.origin}${window.location.pathname}#/${search}`
            }
        } else {
            setTimeout(() => {
                window.location.href = `${window.location.origin}${window.location.pathname}#/course/student/personal`;
            }, 200);
        }
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
            this.unbindOtherAccount(1);
        }
        // this.setState({
        //     phoneCheck: checked,
        // })
    }
    delStu = (index) => {
        let list = JSON.parse(JSON.stringify(this.state.childList));
        list.splice(index, 1)
        console.log(index)
        console.log(list, 'll')
        this.setState({
            childList: list,
        })
    }
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
    numberChange = (value) => {
        this.setState({
            code: value,
        })
    }
    unbindOtherAccount = (type) => {
        this.props.dispatch({
            type: 'studentDetail/unbindOtherAccount',
            payload: {
                type
            },
            onSuccess: () => {
                this.setState({
                    phoneCheck: false,
                })
                this.getInformation();
            }
      })  
    }
    sureCode = () => {
        this.checkMessageCode(1, () => {
            this.setState({
                modalVisible: false,
                openStatus: null,
                ifSwitch: false,
                phoneCheck: true,
            }) 
        })
    }
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
                // this.getInformation();
            }
        }).then(() => {
            console.log(this.props.ifLogout, 'aa')
            if(this.props.ifLogout) {
                message.success(trans('global.outMessage', "已经为您匹配到了相关信息"));
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
    logout = () => {
        let hash =
                        window.location.hash &&
                        window.location.hash.split('#/') &&
                        window.location.hash.split('#/')[1];
        window.location.href = `${window.location.origin}/myCourse?doLogout=yes&service=${encodeURIComponent(`${window.location.origin}/myCourse?hash=${hash}`)}`;
    }
    render() {
        const { childList, role, openStatus, internalChildrenInformationList } = this.state;
        const { currentUser } = this.props;
        let hash =
                    window.location.hash &&
                    window.location.hash.split('#/') &&
                    window.location.hash.split('#/')[1];
                let currentUrl = `${window.location.origin}/myCourse${window.location.search}&path=${hash}`;
                console.log(currentUser, currentUrl, 'c')
        return (
            <div className={styles.personMessage}>
                <div className={styles.messageList}>
                    <div className={styles.safeTitle}>{trans('global.personMessage', '个人信息')}</div>
                    <div className={styles.parentBox}>
                        <InputItem
                            placeholder={trans('mobile.name', '姓名')}
                            // ref={el => this.inputRef = el}
                            // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                            clear={false}
                            disabled={!(this.props.information && this.props.information.externalSchool)}
                            value={this.state.name}
                            onChange={this.nameChange}
                        // disabledKeys={['.', '0', '3']}
                        >{trans('mobile.name', '姓名')}</InputItem>
                        <div className={styles.safeItem}>
                            <InputItem
                                type={"phone"}
                                placeholder={trans('mobile.phoneNumber', '手机号码')}
                                // ref={el => this.inputRef = el}
                                // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                clear={false}
                                value={this.state.phone}
                                disabled={!(this.props.information && this.props.information.externalSchool) ? true : this.state.phoneCheck}
                                onChange={this.phoneChange}
                            // disabledKeys={['.', '0', '3']}
                            >{trans('mobile.phoneNumber', '手机号码')}</InputItem>
                                <Switch checkedChildren={trans('mobile.unBind', '解绑')} disabled={!(this.props.information && this.props.information.externalSchool)} unCheckedChildren={trans('mobile.bind', '绑定')} size="large" onChange={this.phoneCheck} checked={this.state.phoneCheck}/>
                        </div>
                        <InputItem
                            placeholder=""
                            // ref={el => this.inputRef = el}
                            // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                            clear={false}
                            value={this.state.mail}
                            onChange={this.mailChange}
                            disabled={!(this.props.information && this.props.information.externalSchool)}
                        // disabledKeys={['.', '0', '3']}
                        >{trans('mobile.email', '邮箱')}</InputItem>
                        {
                            this.props.information && this.props.information.externalSchool ? 
                            <div className={styles.messageItem}>
                                <div className={styles.name}>{trans('global.role', '角色')}</div>
                                <div>
                                    <span className={[styles.role, role == 1 ? styles.isCheck : null].join(' ')} onClick={this.checkRole.bind(this, 1)}>{trans('global.father', '父亲')}</span>
                                    <span className={[styles.role, role == 2 ? styles.isCheck : null].join(' ')} onClick={this.checkRole.bind(this, 2)}>{trans('global.mother', '母亲')}</span>
                                </div>
                                <div className={styles.bottomBar}></div>
                            </div> : null
                        }
                    </div>
                    {
                        currentIdentity && currentIdentity !== 'student' ? 
                        <div className={styles.stuMessageBox}>
                            <div className={[styles.safeTitle, styles.secondTitle].join(' ')}>{trans('global.childMessage', '子女信息')}</div>
                            <div>
                            {
                                childList && childList.length ?
                                    childList.map((item, index) => (
                                        <div key={index} className={[styles.stuBox, index === 0 ? styles.firstBox : ''].join(' ')}>
                                            <div className={[styles.stuNameBox]}>
                                            <InputItem
                                                placeholder={trans('mobile.name', '姓名')}
                                                // ref={el => this.inputRef = el}
                                                // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                                clear={false}
                                                value={item.childrenName}
                                                onChange={this.childNameChange.bind(this, index)}
                                            // disabledKeys={['.', '0', '3']}
                                            >{trans('mobile.childrenName', '子女姓名')}</InputItem>
                                            {/* <i className={[styles.delStu, icon.iconfont].join(' ')} onClick={this.delStu.bind(this, index)}>&#xe739;</i> */}
                                            </div>
                                            <div className={styles.messageItem}>
                                                <div className={styles.name}>{trans('global.gender', '性别')}</div>
                                                <div>
                                                    <span className={[styles.role, item.sex == 1 ? styles.isCheck : null].join(' ')} onClick={this.checkGender.bind(this, index, 1)}>{trans('global.boy', '男')}</span>
                                                    <span className={[styles.role, item.sex === 2 ? styles.isCheck : null].join(' ')} onClick={this.checkGender.bind(this, index, 2)}>{trans('global.girl', '女')}</span>
                                                </div>
                                                <div className={styles.bottomBar}></div>
                                            </div>
                                            <InputItem
                                                placeholder={trans('mobile.cardNum', '身份证号码')}
                                                // ref={el => this.inputRef = el}
                                                // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                                clear={false}
                                                value={item.cardNo && item.cardNo.indexOf('3707841993081') !== -1 ? '' : item.cardNo}
                                                onChange={this.cardIdChange.bind(this, index)}
                                            // disabledKeys={['.', '0', '3']}
                                            >{trans('mobile.card', '身份证')}</InputItem>
                                                <InputItem
                                                    placeholder={trans('mobile.pleaseSchool', '请输入学校名称')}
                                                    // ref={el => this.inputRef = el}
                                                    // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                                    clear={false}
                                                    value={item.educatedSchool || ''}
                                                    onChange={this.changeSchool.bind(this, index)}
                                                // disabledKeys={['.', '0', '3']}
                                                >{trans('mobile.nowSchool', '现就读学校')}</InputItem>
                                                <div className={styles.bottomBar}></div>
                                        </div>
                                    )) : null
                            }
                            {
                                internalChildrenInformationList && internalChildrenInformationList.length ?
                                internalChildrenInformationList.map((item, index) => (
                                    <div key={index} className={styles.stuBox}>
                                            <InputItem
                                                placeholder={trans('mobile.name', '姓名')}
                                                // ref={el => this.inputRef = el}
                                                // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                                clear={false}
                                                value={item.childrenName}
                                                disabled={true}
                                                onChange={this.childNameChange.bind(this, index)}
                                            // disabledKeys={['.', '0', '3']}
                                            >{trans('mobile.childrenName', '子女姓名')}</InputItem>
                                            <div className={styles.messageItem}>
                                                <div className={styles.name}>{trans('global.gender', '性别')}</div>
                                                <div>
                                                    <span className={[styles.role, item.sex == 1 ? styles.isCheck : null].join(' ')}>{trans('global.boy', '男')}</span>
                                                    <span className={[styles.role, item.sex === 2 ? styles.isCheck : null].join(' ')}>{trans('global.girl', '女')}</span>
                                                </div>
                                                <div className={styles.bottomBar}></div>
                                            </div>
                                            <InputItem
                                                placeholder={trans('mobile.cardNum', '身份证号码')}
                                                // ref={el => this.inputRef = el}
                                                // onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                                clear={false}
                                                value={item.cardNo && item.cardNo.indexOf('3707841993081') !== -1 ? '' : item.cardNo}
                                                onChange={this.cardIdChangeInter.bind(this, index)}
                                            // disabledKeys={['.', '0', '3']}
                                            >{trans('mobile.card', '身份证')}</InputItem>
                                            <div className={styles.bottomBar}></div>
                                        </div>
                                )) : null
                            }
                            </div>
                    {
                        this.props.information &&  this.props.information.externalSchool ?
                        <div className={styles.addChild} onClick={this.addChild}>
                            <i className={icon.iconfont}>&#xe759;</i>
                            <span>{trans('global.addChild', '添加子女')}</span>
                        </div> : null
                    }
                        </div> : null
                    }  
                    
                    
                </div>
                    <div className={styles.closeModal} onClick={this.goBack}>
                        <span>{trans('pay.confirmCancelBackPrevious', '返回上层')}</span>
                    </div>
                {
                    this.props.information &&  this.props.information.externalSchool ?
                    <div className={styles.submitButton}>
                        <div onClick={this.submit} className={styles.submit}>{trans('global.save', '保存')}</div>
                    </div> : null
                }          
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
                                <div className={styles.messBox}>{trans('mobile.tip9', '验证码已发送至您的手机，请输入验证码')}</div>
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
                         <div className={styles.messBox}>{trans('mobile.tip10','验证码已发送至您的邮箱，请输入验证码')}</div>
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
                             >{trans('mobile.tip12', '确认新密码')}</InputItem>
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
