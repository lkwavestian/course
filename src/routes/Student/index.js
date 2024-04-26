//学生管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import { Spin } from 'antd';
import BasicHeader from '../../layouts/BasicLayout';
// import Administration from '../../components/Student/Administration/index';
// import TeachingOrg from '../../components/Student/TeachingOrg/index';
import PowerPage from '../../components/PowerPage/index';
import Management from '../../components/Student/Management/index';

import { saveCurrent } from '../../utils/utils';

@connect((state) => ({
    powerStatus: state.global.powerStatus, //是否有权限
}))
export default class StudentManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            handleLoading: true,
            isGraduation: false,
            isSuspend: false,
            cur: sessionStorage.getItem('studentMenu') || '0',
        };
    }

    componentDidMount() {
        this.ifHavePower();
        document.getElementsByTagName('title')[0].innerHTML = '学生管理';
    }

    //判断是否有权限
    ifHavePower() {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/havePower',
            payload: {},
        }).then(() => {
            this.setState({
                loading: true,
            });
            let { powerStatus } = this.props;
            if (powerStatus) {
                if (powerStatus.content.indexOf('smart:teaching:student:graduation:list') != -1) {
                    this.setState({
                        isGraduation: true,
                    });
                }
                if (powerStatus.content.indexOf('smart:teaching:student:suspend:list') != -1) {
                    this.setState({
                        isSuspend: true,
                    });
                }
            }
        });
    }

    switchNavList = (key, type) => {
        // type 此参数在页面被动跳转时才用，目前用在“转学”，“休学”弹窗“前往查看”功能
        if (type == 1) {
            this.setState({
                handleLoading: false,
            });
            // 等到浏览器空闲时间重新加载
            requestIdleCallback(() => {
                this.setState({
                    cur: key,
                    handleLoading: true,
                });
                saveCurrent('studentMenu', key);
            });
        } else {
            this.setState({
                cur: key,
            });
            saveCurrent('studentMenu', key);
        }
    };

    render() {
        const { cur, isGraduation, isSuspend, loading } = this.state;
        const navList = [
            { name: trans('student.studentManagement.beRead', '在读'), key: '0' },
            // { name: '行政组织', key: '1' },
            // { name: '教学组织', key: '2' }
            { name: trans('student.suspension', '休学'), key: '1' },
            { name: trans('student.studentManagement.leftSchool', '已离校'), key: '2' },
            { name: trans('student.studentManagement.beRecruited', '待招'), key: '3' },
        ];

        if (!this.state.handleLoading || !loading) {
            return (
                <div className={styles.studentPage}>
                    <BasicHeader navList={navList} cur={cur} switchNavList={this.switchNavList} />
                    <div className={styles.loading}>
                        <Spin size="large" tip="loading" />
                    </div>
                </div>
            );
        }
        return (
            <div className={styles.studentPage}>
                <BasicHeader navList={navList} cur={cur} switchNavList={this.switchNavList} />
                <div className={styles.mainContent}>
                    {cur == '0' && (
                        <Management
                            {...this.props}
                            switchNavList={this.switchNavList}
                            statusType={1}
                        />
                    )}
                    {/* {
                    cur == '1' && <Administration />
                }
                {
                    cur == '2' && <TeachingOrg />
                } */}

                    {/* 教务1.3 */}
                    {cur == '1' &&
                        (isSuspend ? (
                            <Management
                                {...this.props}
                                switchNavList={this.switchNavList}
                                statusType={2}
                            />
                        ) : (
                            <PowerPage />
                        ))}
                    {cur == '2' &&
                        (isGraduation ? (
                            <Management
                                {...this.props}
                                switchNavList={this.switchNavList}
                                statusType={3}
                            />
                        ) : (
                            <PowerPage />
                        ))}
                    {cur == '3' && (
                        <div className={styles.beRecruited}>
                            <a href="https://recruit.yungu.org/" target="_blank">
                                招生后台管理系统
                            </a>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
