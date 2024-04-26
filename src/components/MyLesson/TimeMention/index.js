import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../../utils/i18n';
import { calculateDetailTime } from '../../../utils/utils';
import { color } from '../config.js';
import icon from '../../../icon.less';
import { Modal } from 'antd';

export default class TimeMention extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            instructionVisible: false, // 查看选课说明显隐状态
        };
    }

    // 查看选课说明弹窗显示
    checkInstruction = () => {
        this.setState({
            instructionVisible: true,
        });
    };

    render() {
        const { planMsg, planStatus, submitStatus, courseDetail } = this.props;
        const { instructionVisible } = this.state;
        // 选课计划不同状态不同样式
        const timeAndremain = {
            borderColor:
                submitStatus != 3 &&
                (planStatus === 0
                    ? color.yellow
                    : planStatus === 1
                    ? color.yellow
                    : planStatus === 3
                    ? color.gray
                    : ''),
            color:
                submitStatus != 3 &&
                (planStatus === 0
                    ? color.yellow
                    : planStatus === 1
                    ? color.yellow
                    : planStatus === 3
                    ? color.gray
                    : ''),
            background:
                submitStatus != 3 &&
                (planStatus === 0
                    ? color.backgroundYellow
                    : planStatus === 1
                    ? color.backgroundBlue
                    : planStatus === 3
                    ? '#fafafa'
                    : ''),
        };
        return (
            <div className={styles.timeMention} style={{ color: timeAndremain.color }}>
                <span className={styles.icon}>
                    {' '}
                    <i className={icon.iconfont}>&#xe7d9;</i>{' '}
                </span>
                <span className={styles.selectTime}>
                    选课时间：{planMsg.startTime} ~ {planMsg.endTime}{' '}
                </span>
                <span className={styles.remain}>
                    {/* {
                planStatus === 0 ?`【${trans("planDetail.NotOpened",'{$time} 后开始' , {time:calculateDetailTime(planMsg.startTime)})}】`
                    : planStatus == 1 ? `【${trans("planDetail.being",'{$time} 后截止选课' , {time:calculateDetailTime(planMsg.endTime)})}】`
                        : planStatus == 3 ? `【${trans("planDetail.ended",'本次选课已结束')}】`
                            : null
            } */}
                </span>
                <span className={styles.checkInstruction} onClick={this.checkInstruction}>
                    {' '}
                    {trans('planDetail.viewInstructions', '查看选课说明')}{' '}
                </span>
                <Modal
                    className={styles.checkInstructionModal}
                    footer={null}
                    visible={instructionVisible}
                    width="56%"
                    onCancel={() => {
                        this.setState({ instructionVisible: false });
                    }}
                >
                    <p className={styles.title}> {trans('planDetail.instructions', '选课说明')} </p>
                    {courseDetail && courseDetail.announcement ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: (courseDetail && courseDetail.announcement) || '',
                            }}
                        />
                    ) : (
                        <span className={styles.inform}>
                            {trans('planDetail.read.message', '详细选课说明请查阅学校相关通知。')}
                        </span>
                    )}
                </Modal>
            </div>
        );
    }
}
