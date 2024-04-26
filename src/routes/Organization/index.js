//机构管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import BasicHeader from '../../layouts/BasicLayout';
import FrameworkComponent from '../../components/Organization/Framework/index';
import DingRecord from '../../components/Organization/DingRecord/index';
import AcademicSemesters from '../../components/Organization/AcademicSemesters/index';
import TemporaryAddress from '../../components/Organization/TemporaryAddress/index';
import { saveCurrent } from '../../utils/utils';
import { routerRedux } from 'dva/router';

@connect((state) => ({
    powerStatus: state.global.powerStatus, //是否有权限
}))
export default class OrganizationManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cur: '0',
            isShowBtn: false,
        };
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/havePower',
            payload: {},
        }).then(() => {
            const { powerStatus } = this.props;
            let responseContent = powerStatus.content || [];
            if (responseContent.indexOf('smart:teaching:agency:tree') != -1) {
                //组织架构的入口
                this.setState({
                    isShowBtn: true,
                });
            } else {
                this.setState({
                    isShowBtn: false,
                });
            }
        });
    }

    componentDidMount() {
        document.getElementsByTagName('title')[0].innerHTML = '机构管理';
        const {
            match: { params },
        } = this.props;
        this.setState({
            cur: params && params.currentIndex ? params && params.currentIndex : '0',
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
                cur: params && params.currentIndex ? params && params.currentIndex : '0',
            });
        }
    }

    switchNavList = (key) => {
        this.setState({
            cur: key,
        });
        saveCurrent('organizationMenu', key);
        this.props.dispatch(routerRedux.push(`/organize/index/${key}`));
    };

    render() {
        const { cur, isShowBtn } = this.state;
        let navList;
        if (isShowBtn == true) {
            navList = [
                { name: trans('role.Sync DingTalk', '同步钉钉'), key: '0' },
                { name: trans('role.organization', '组织架构'), key: '1' },
                { name: trans('role.schoolYear', '学年管理'), key: '2' },
                { name: trans('role.spaces', '场地管理'), key: '3' },
            ];
        } else {
            navList = [{ name: trans('role.Sync DingTalk', '同步钉钉'), key: '0' }];
        }
        return (
            <div className={styles.organizationPage}>
                <BasicHeader navList={navList} cur={cur} switchNavList={this.switchNavList} />
                <div className={styles.mainContent}>
                    {cur == '0' && <DingRecord />}
                    {cur == '1' && <FrameworkComponent />}
                    {cur == '2' && <AcademicSemesters></AcademicSemesters>}
                    {cur == '3' && <TemporaryAddress></TemporaryAddress>}
                    {cur == '4' && <RoleManagement></RoleManagement>}
                </div>
            </div>
        );
    }
}
