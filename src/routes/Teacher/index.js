//教师管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import * as dd from 'dingtalk-jsapi';
import { trans } from '../../utils/i18n';
import { saveCurrent } from '../../utils/utils';
import BasicHeader from '../../layouts/BasicLayout';
import TeacherStructure from '../../components/Teacher/Structure/index';
import TeacherRole from '../../components/Teacher/Role/index';
import TeacherAdministration from '../../components/Teacher/Administration/index';
import { routerRedux } from 'dva/router';

@connect((state) => ({
    powerStatus: state.global.powerStatus, //是否有权限
}))
export default class TeacherManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // cur: sessionStorage.getItem('teachingMenu') || '0',
            cur: '0',
        };
    }
    componentWillMount() {
        document.getElementsByTagName('title')[0].innerHTML = '教务中心';
        let params = new URLSearchParams(window.location.search);
        if (params.get('path')) {
            window.location.href =
                '#/' + params.get('path') + '/?recordId=' + params.get('recordId');
            // dd.biz.navigation.setTitle({
            //     title : '完善学生信息',//控制标题文本，空字符串表示显示默认文本
            //     onSuccess : function(result) {
            //       /*结构
            //       {
            //       }*/
            //     },
            //     onFail : function(err) {}
            // });
        }
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        console.log(params, 'params')
        this.setState({
            cur: params && params.currentIndex ? params.currentIndex : '0',
        });

        const { dispatch } = this.props;
        dispatch({
            type: 'global/havePower',
            payload: {},
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.location &&
            nextProps.location.pathname != this.props.location &&
            this.props.location.pathname
        ) {
            const {
                match: { params },
            } = nextProps;
            this.setState({
                cur: params && params.currentIndex ? params.currentIndex : '0',
            });
        }
    }

    switchNavList = (key) => {
        this.setState({
            cur: key,
        });
        // saveCurrent('teachingMenu', key);
        this.props.dispatch(routerRedux.push(`/${key}`));
    };
    render() {
        const { cur } = this.state;
        const { powerStatus } = this.props;
        //判断是否有权限编辑人员信息、批量设置直线主管
        let havePowerEditInfo =
            powerStatus.content && powerStatus.content.indexOf('smart:external:permission') != -1
                ? true
                : false;

        console.log('havePowerEditInfo: ', havePowerEditInfo);
        let navList = [];
        if(havePowerEditInfo){
            navList = [
                { name: trans('teacher.teachingOrg', '组织架构'), key: '0' },
                { name: '角色', key: '1' },
                { name: '外聘教师', key: '2' },
            ];
        }else{
            navList = [
                { name: trans('teacher.teachingOrg', '组织架构'), key: '0' },
                { name: '角色', key: '1' },
            ];
        }
        return (
            <div className={styles.teacherPage}>
                <BasicHeader navList={navList} cur={cur} switchNavList={this.switchNavList} />
                <div className={styles.mainContent}>
                    {cur == '0' && <TeacherStructure />}
                    {cur == '1' && <TeacherRole />}
                    {cur == '2' && <TeacherAdministration />}
                </div>
            </div>
        );
    }
}
