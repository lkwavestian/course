//club列表
import React, { PureComponent } from 'react';
import styles from './preview.less';
import { connect } from 'dva';
import { trans } from '../../utils/i18n';

@connect((state) => ({}))
export default class Preview extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice: null,
        };
    }

    componentDidMount() {
        const { previewContent } = this.props;
        let price = null;
        previewContent &&
            previewContent.payChargeItemDetailModelList &&
            previewContent.payChargeItemDetailModelList.map((item) => {
                price += item.price * item.quantity;
            });
        this.setState({
            totalPrice: price,
        });
    }

    handlePreviewCancel = () => {
        this.props.previewCancel();
    };

    render() {
        const { previewContent } = this.props;
        const { totalPrice } = this.state;
        return (
            <div className={styles.showPreview} onClick={this.handlePreviewCancel}>
                <div className={styles.preview}>
                    <div className={styles.previewCover}>
                        <span className={styles.close} onClick={this.handlePreviewCancel}>
                            x
                        </span>
                        <div
                            className={styles.previewContent}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className={styles.head}>
                                {previewContent && previewContent.payStatus == 1 ? (
                                    <div className={styles.head}>
                                        {trans('charge.toPaid', '待缴费')}
                                    </div>
                                ) : previewContent && previewContent.payStatus == 2 ? (
                                    <div className={styles.head}>
                                        {trans('pay.partPay', '部分缴费')}
                                    </div>
                                ) : previewContent && previewContent.payStatus == 3 ? (
                                    <div className={styles.head}>
                                        {trans('pay.payed', '已缴清')}
                                    </div>
                                ) : previewContent && previewContent.payStatus == 4 ? (
                                    <div className={styles.head}>
                                        {trans('pay.close', '已关闭')}
                                    </div>
                                ) : (
                                    <div className={styles.head}>
                                        {trans('mobile.toBePaid', '待支付')}
                                    </div>
                                )}
                            </div>
                            <div className={styles.msg}>
                                <span className={styles.title}>
                                    {previewContent && previewContent.zhName}
                                </span>
                                <span className={styles.item}>
                                    <span className={styles.label}>
                                        {trans('charge.studentName', '学生姓名')}
                                    </span>
                                    <span>{previewContent && previewContent.userName}</span>
                                </span>
                                <span className={styles.item}>
                                    <span className={styles.label}>
                                        {trans('charge.sendDate', '发送日期')}
                                    </span>
                                    <span>{previewContent && previewContent.lastSenderDate}</span>
                                </span>
                                {/* <span className={styles.item}><span className={styles.label}>截至日期</span><span>{previewContent && previewContent.deadline}</span></span> */}
                                <span className={styles.item}>
                                    <span className={styles.label}>
                                        {trans('charge.orderNo1', '订单号')}
                                    </span>
                                    <span>{previewContent && previewContent.orderNo}</span>
                                </span>
                            </div>
                            <div className={styles.card}>
                                <div className={styles.cardList}>
                                    {previewContent &&
                                        previewContent.payChargeItemDetailModelList &&
                                        previewContent.payChargeItemDetailModelList.map(
                                            (item, index) => {
                                                return (
                                                    <div className={styles.item} key={index}>
                                                        <span className={styles.itemPrice}>
                                                            <span className={styles.title}>
                                                                {item.payChargeItemName ||
                                                                    item.name}
                                                            </span>
                                                            <span className={styles.price}>
                                                                <span className={styles.unitPrice}>
                                                                    ￥{item.price}
                                                                </span>
                                                                <span className={styles.amount}>
                                                                    x
                                                                    {item.quantity
                                                                        ? item.quantity
                                                                        : 1}
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span className={styles.add}>
                                                            ￥{item.price * item.quantity}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )}
                                </div>
                                <span className={styles.total}>
                                    <span>{trans('pay.amount', '合计：')}</span>￥
                                    {previewContent && previewContent.amount
                                        ? previewContent.amount
                                        : totalPrice}
                                </span>
                            </div>
                            <div className={styles.mention}>
                                <span className={styles.label}>
                                    {trans('pay.description', '费用说明')}
                                </span>
                                <span className={styles.text}>
                                    {previewContent && previewContent.zhDescription}
                                </span>
                            </div>
                        </div>

                        {/* 英文 */}
                        <div
                            className={styles.previewContent}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className={styles.head}>
                                {previewContent && previewContent.payStatus == 1 ? (
                                    <div className={styles.head}>Unpaid</div>
                                ) : previewContent && previewContent.payStatus == 2 ? (
                                    <div className={styles.head}>Partly Paid</div>
                                ) : previewContent && previewContent.payStatus == 3 ? (
                                    <div className={styles.head}>Paid</div>
                                ) : previewContent && previewContent.payStatus == 4 ? (
                                    <div className={styles.head}>Order Closed</div>
                                ) : (
                                    <div className={styles.head}>Unpaid</div>
                                )}
                            </div>
                            <div className={styles.msg}>
                                <span className={styles.title}>
                                    {previewContent && previewContent.enName}
                                </span>
                                <span className={styles.item}>
                                    <span className={styles.label}>Student Name</span>
                                    <span>{previewContent && previewContent.userName}</span>
                                </span>
                                <span className={styles.item}>
                                    <span className={styles.label}>Date of Notice</span>
                                    <span>{previewContent && previewContent.lastSenderDate}</span>
                                </span>
                                {/* <span className={styles.item}><span className={styles.label}>Due Date</span><span>{previewContent && previewContent.deadline}</span></span> */}
                                <span className={styles.item}>
                                    <span className={styles.label}>Order ID</span>
                                    <span>{previewContent && previewContent.orderNo}</span>
                                </span>
                            </div>
                            <div className={styles.card}>
                                <div className={styles.cardList}>
                                    {previewContent &&
                                        previewContent.payChargeItemDetailModelList &&
                                        previewContent.payChargeItemDetailModelList.map(
                                            (item, index) => {
                                                return (
                                                    <div className={styles.item} key={index}>
                                                        <span className={styles.itemPrice}>
                                                            <span className={styles.title}>
                                                                {item.ename ||
                                                                    item.payChargeItemName}
                                                            </span>
                                                            <span className={styles.price}>
                                                                <span className={styles.unitPrice}>
                                                                    ￥{item.price}
                                                                </span>
                                                                <span className={styles.amount}>
                                                                    x
                                                                    {item.quantity
                                                                        ? item.quantity
                                                                        : 1}
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span className={styles.add}>
                                                            ￥{item.price * item.quantity}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )}
                                </div>
                                <span className={styles.total}>
                                    <span>Overall：</span>￥
                                    {previewContent && previewContent.amount
                                        ? previewContent.amount
                                        : totalPrice}
                                </span>
                            </div>
                            <div className={styles.mention}>
                                <span className={styles.label}>Description</span>
                                <span className={styles.text}>
                                    {previewContent && previewContent.enDescription}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
