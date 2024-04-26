import React, { PureComponent } from 'react';
import { withRouter } from 'dva/router';
import styles from './index.less';
import { Modal } from 'antd-mobile';

import { connect } from 'dva';
import Application from './Application';
import SearchReplace from './SearchReplace';
import SearchExchange from './SearchExchange';
import Calendar from './Calendar';
import { trans, locale } from '../../utils/i18n';

@connect((state) => ({
    selectedTeacherItem: state.replace.selectedTeacherItem,
}))
class ReplaceMobileApplication extends PureComponent {
    state = {
        calendarModalVisible: false,
        currentLang: 'cn',
    };

    componentDidMount() {
        this.setState({
            currentLang: locale() === 'en' ? 'en' : 'cn',
        });
    }

    changeCalendarModalVisible = () => {
        const { calendarModalVisible } = this.state;
        this.setState({
            calendarModalVisible: !calendarModalVisible,
        });
    };

    render() {
        console.log('ReplaceMobile/index/render');

        const { cur, history, selectedTeacherItem } = this.props;
        const { calendarModalVisible, currentLang } = this.state;

        /* 
            cur 0：调代课申请 1：代课页面 2：换课页面
        */
        return (
            <div className={styles.ReplaceMobileApplication}>
                {cur == '0' ? (
                    <Application history={history} currentLang={currentLang} />
                ) : cur == '1' ? (
                    <SearchReplace
                        history={history}
                        changeCalendarModalVisible={this.changeCalendarModalVisible}
                        currentLang={currentLang}
                    />
                ) : (
                    <SearchExchange
                        history={history}
                        changeCalendarModalVisible={this.changeCalendarModalVisible}
                        currentLang={currentLang}
                    />
                )}
                {calendarModalVisible && (
                    <Modal
                        title={
                            currentLang === 'cn'
                                ? `${selectedTeacherItem.name}的日程`
                                : `${selectedTeacherItem.englishName}'s Schedule`
                        }
                        visible={calendarModalVisible}
                        getContainer={false}
                        wrapClassName={styles.calendarWrapper}
                        closable
                        onClose={this.changeCalendarModalVisible}
                    >
                        <Calendar
                            changeCalendarModalVisible={this.changeCalendarModalVisible}
                            currentLang={currentLang}
                        />
                    </Modal>
                )}
            </div>
        );
    }
}
export default withRouter(ReplaceMobileApplication);
