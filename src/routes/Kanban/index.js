//看板管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import * as dd from 'dingtalk-jsapi';
import { trans } from '../../utils/i18n';
import { saveCurrent } from '../../utils/utils';
import BasicHeader from '../../layouts/BasicLayout';
import { routerRedux } from 'dva/router';
import TeacherData from '../../components/KanBan/index';

@connect((state) => ({
}))
export default class TeacherManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cur: sessionStorage.getItem('teachingMenu') || '0',
        };
    }
    componentWillMount() {
        document.getElementsByTagName('title')[0].innerHTML = '教务中心';
        let params = new URLSearchParams(window.location.search);
        if (params.get('path')) {
            window.location.href =
                '#/' + params.get('path') + '/?recordId=' + params.get('recordId');
        }
    }

    componentDidMount() {
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
                cur: params && params.currentIndex ? params && params.currentIndex : '1',
            });
        }
    }

    switchNavList = (key) => {
        this.setState({
            cur: key,
        });
        saveCurrent('teachingMenu', key);
        this.props.dispatch(routerRedux.push('/kanBan/index'));
    };
    render() {
        const { cur } = this.state;
        const navList = [{ name: trans('teacher.teachingData', '教师数据'), key: '0' }];
        return (
            <div className={styles.teacherPage}>
                <BasicHeader navList={navList} cur={cur} switchNavList={this.switchNavList} />
                <div className={styles.mainContent}>
                    {cur == '0' && (
                        <TeacherData
                            {...this.state}
                        />
                    )}
                    {/* {cur == '1' && <TeacherData />} */}
                    {/* {cur == '2' && <TeacherAdministration />} */}
                </div>
            </div>
        );
    }
}
