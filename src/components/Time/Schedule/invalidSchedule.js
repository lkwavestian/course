//复制排课结果
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './invalidSchedule.less';
import { message, Modal, Radio, Button } from 'antd';
import { trans } from '../../../utils/i18n';
import { locale } from 'moment';

@connect((state) => ({
    invalidInfo: state.time.invalidInfo,
}))
export default class InvalidSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            radioValue: '',
        };
    }

    componentDidMount() {
        this.getInvalidInfo();
    }

    getInvalidInfo = () => {
        const { dispatch, scheduleInfoItem } = this.props;
        dispatch({
            type: 'time/scheduleInvalidInfo',
            payload: {
                scheduleId: scheduleInfoItem && scheduleInfoItem.id,
            },
        });
    };

    handleCancel = () => {
        const { handleCancelInvalid } = this.props;
        typeof handleCancelInvalid == 'function' && handleCancelInvalid();
    };

    selectInvalidChange = (e) => {
        this.setState({
            radioValue: e.target.value,
        });
    };

    handleConfirm = () => {
        const { dispatch, scheduleInfoItem, getSelectDate, getLastSchedule } = this.props;
        const { radioValue } = this.state;
        if (!JSON.stringify(radioValue)) {
            message.info('请选择作废方式');
            return;
        }
        dispatch({
            type: 'time/confirmInvalid',
            payload: {
                scheduleId: scheduleInfoItem && scheduleInfoItem.id,
                type: 0,
            },
            onSuccess: () => {
                this.handleCancel(); // 关闭弹窗
                typeof getLastSchedule == 'function' && getLastSchedule();
                typeof getSelectDate == 'function' && getSelectDate();
            },
        });
    };

    render() {
        const { invalidVisible, applyGradeList, scheduleTime, scheduleInfoItem, invalidInfo } =
            this.props;
        return (
            <Modal
                visible={invalidVisible}
                title={trans('global.Void this schedule', '作废作息表')}
                onCancel={this.handleCancel}
                footer={null}
                className={styles.invalidModal}
            >
                <p className={styles.title}>
                    <span className={styles.label}>
                        {trans('global.Selected schedule', '已选作息表')}:
                    </span>
                    <span className={styles.text}>
                        {applyGradeList} {scheduleTime}
                        {scheduleInfoItem.scheduleType === 0
                            ? ' (' + trans('global.Effective', '未生效') + ')'
                            : scheduleInfoItem.scheduleType === 1
                            ? ' (' + trans('global.Not effective', '已生效') + ')'
                            : scheduleInfoItem.scheduleType === 2
                            ? ' (' + trans('global.Invalid', '作废') + ')'
                            : ''}
                    </span>
                </p>
                {/* {invalidInfo ? (
                    <p className={styles.invalidInfo}>
                        {invalidInfo.type === 1
                            ? `该作息表关联了 ${invalidInfo.total} 个课表版本，作废后如需生效到课表，请在课表中进行作息更换。`
                            : invalidInfo.type === 0
                            ? `该作息表已关联 ${invalidInfo.total} 个已发生的课表版本，不允许作废。如需调整未发生时段的作息表，可调整原作息表起止日期，并创建新的作息表。`
                            : ''}
                    </p>
                ) : null} */}
                <p>
                    {locale() != 'en'
                        ? '确认将该作息表作废吗?'
                        : 'Are you sure to void this schedule?'}
                </p>

                {/* <Radio.Group onChange={this.selectInvalidChange}>
                    <Radio value={0}>仅作废</Radio>
                    <br />
                    <Radio value={1}>作废并新建空作息表</Radio>
                    <br />
                    <Radio value={2}>作废并在原作息表修改</Radio>
                </Radio.Group> */}
                <div className={styles.btn}>
                    <Button className={styles.cancel} onClick={this.handleCancel}>
                        {' '}
                        {invalidInfo && invalidInfo.type === 0
                            ? trans('global.I know', '知道了')
                            : trans('global.cancel', '取消')}
                    </Button>
                    {invalidInfo && invalidInfo.type === 0 ? (
                        ''
                    ) : (
                        <Button className={styles.confirm} onClick={this.handleConfirm}>
                            {trans('global.confirm', '确认操作')}
                        </Button>
                    )}
                </div>
            </Modal>
        );
    }
}
