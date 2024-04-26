//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import SelectDetailMobile from '../../components/CourseStudentDetailMobile/index';
import { func } from 'prop-types';
export default class CourseSelectDetail extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {}
    componentDidMount = () => {};
    scroll = (e) => {
        const dom = document.getElementById('courseSelectDetail');
        const tab = document.getElementById('scrollTab');
        console.log(dom.scrollTop, tab.offsetTop, '11');
        if (dom && tab && dom.scrollTop > tab.offsetTop) {
            if (tab.className.indexOf('active') < 0) {
                tab.className += ' active';
            }
        } else {
            tab ? (tab.className = tab.className.split(' active')[0]) : null;
        }
    };
    render() {
        return (
            <div
                className={styles.courseSelectDetail}
                onScroll={this.scroll}
                id="courseSelectDetail"
            >
                <SelectDetailMobile />
            </div>
        );
    }
}
