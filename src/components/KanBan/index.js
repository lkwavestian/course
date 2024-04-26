//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import icon from '../../icon.less';
import moment from 'moment';
import { formatTime } from '../../utils/utils';
import PaymentDetail from './PaymentDetail/index.js';
import DealFlow from './DealFlow/index.js';
import { trans } from '../../utils/i18n';
import { getUrlSearch } from '../../utils/utils';

const dateFormat = 'YYYY/MM/DD';
const { TabPane } = Tabs;

@connect((state) => ({}))
export default class TeacherData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sheetType: 2,
            semesterValue: '',
        };
    }

    componentWillMount() {
        this.setState({
            sheetType:
                getUrlSearch('type') && getUrlSearch('type') === 'detailOfWorkArrangement' ? 1 : 2,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.location &&
            nextProps.location.pathname != this.props.location &&
            this.props.location.pathname
        ) {
            this.setState({
                sheetType:
                    getUrlSearch('type') && getUrlSearch('type') === 'detailOfWorkArrangement'
                        ? 1
                        : 2,
            });
        }
    }

    tabChange = (key) => {
        this.setState({
            sheetType: key,
        });
    };

    getSemesterValue = (key) => {
        this.setState({
            semesterValue: key,
        });
    };

    render() {
        return (
            <div className={styles.batchOrder}>
                {window.self != window.top ? (
                    this.state.sheetType == 1 ? (
                        <PaymentDetail
                            sheetType={this.state.sheetType}
                            getSemesterValue={this.getSemesterValue}
                            semesterValue={this.state.semesterValue}
                        />
                    ) : (
                        <DealFlow
                            sheetType={this.state.sheetType}
                        />
                    )
                ) : (
                    <Tabs activeKey={`${this.state.sheetType}`} onChange={this.tabChange}>
                        <TabPane
                            tab={trans('charge.school work arrangement', '学校工作安排')}
                            key="2"
                        >
                            <DealFlow
                                sheetType={this.state.sheetType}
                            />
                        </TabPane>
                        <TabPane
                            tab={trans('charge.personal work arrangements', '个人工作安排')}
                            key="1"
                        >
                            <PaymentDetail
                                sheetType={this.state.sheetType}
                                getSemesterValue={this.getSemesterValue}
                                semesterValue={this.state.semesterValue}
                            />
                        </TabPane>
                    </Tabs>
                )}
            </div>
        );
    }
}
