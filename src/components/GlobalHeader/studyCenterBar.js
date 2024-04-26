//学习中心卡片
import React, { PureComponent } from 'react';
import { Popover } from 'antd';
import styles from './studyCenterBar.less';
import icon from '../../icon.less';
import { locale } from '../../utils/i18n';

export default class StudyCenterBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            customJson: {},
        };
    }

    componentDidMount() {
        //获取可配置信息
        const { currentUser } = this.props;
        let currentIdentity = currentUser.currentIdentity;
        if (currentIdentity == 'employee' || currentIdentity == 'externalUser') {
            this.fetchTeacherTool();
        } else if (currentIdentity == 'student') {
            this.fetchStudentTool();
        }
    }

    //学生身份可配置toolbox
    fetchStudentTool() {
        const { currentUser } = this.props;
        let grade = currentUser.grade;
        let self = this;
        fetch('https://yungu-public.oss-cn-hangzhou.aliyuncs.com/config/ipadVersion.json', {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                let toolbox = json ? json.toolbox : {};
                let stage = {},
                    appEntry = [];
                if (grade <= 0) {
                    stage = toolbox.kindergarten ? toolbox.kindergarten : {};
                } else if (grade > 0 && grade <= 6) {
                    stage = toolbox.primary ? toolbox.primary : {};
                } else if (grade > 6 && grade <= 9) {
                    stage = toolbox.juniorHigh ? toolbox.juniorHigh : {};
                } else if (grade > 9 && grade <= 12) {
                    stage = toolbox.high ? toolbox.high : {};
                }
                appEntry = stage.appEntry || [];
                self.setState({
                    customJson: appEntry,
                });
            });
    }

    //教师身份可配置toolbox
    fetchTeacherTool() {
        let self = this;
        fetch('https://yungu-public.oss-cn-hangzhou.aliyuncs.com/config/ipadVersionTecher.json', {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                let toolbox = json ? json.toolbox : {};
                let appEntry = toolbox.teacher ? toolbox.teacher.appEntry : [];
                self.setState({
                    customJson: appEntry,
                });
            });
    }

    //渲染按钮
    renderLink() {
        const { customJson } = this.state;
        return (
            <div>
                {customJson && customJson.length > 0
                    ? customJson.map((item, index) => (
                          <a
                              className={styles.studyCenterBtn}
                              href={item.link}
                              target="_blank"
                              key={index}
                          >
                              <em style={{ backgroundImage: `url("${item.icon}")` }}></em>
                              <span>{locale() == 'en' ? item.eName : item.name}</span>
                          </a>
                      ))
                    : null}
            </div>
        );
    }

    render() {
        return (
            <div className={styles.studyCenterIcon}>
                <Popover
                    trigger="click"
                    placement="bottom"
                    content={this.renderLink()}
                    overlayClassName={styles.studyPop}
                >
                    <i className={`${icon.iconfont} ${styles.toolIcon}`}>&#xe86a;</i>
                </Popover>
            </div>
        );
    }
}
