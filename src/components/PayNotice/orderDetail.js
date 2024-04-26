//club列表
import React, { PureComponent } from 'react';
import styles from './orderDetail.less';
import { Drawer, Row, Col } from 'antd';
import { connect } from 'dva';
import { numMulti } from '../../utils/utils';
import { trans } from '../../utils/i18n';

@connect((state) => ({}))
export default class OrderDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            totalPrice: '',
        };
    }

    componentDidMount() {
        if (this.props.isViewDetail) {
            this.showDrawer();
        }
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.props.closeDrawer(false);
        this.setState({
            visible: false,
        });
    };

    // 订单状态、创建人、完成时间待确定 , 交易信息确认
    render() {
        const { orderDetailContent, useWallet, fullScreen } = this.props;
        const { totalPrice } = this.state;
        const payStatus = orderDetailContent && orderDetailContent.payStatus;
        const payCloseOrderInfoModel =
            orderDetailContent && orderDetailContent.payCloseOrderInfoModel;
        const title = (
            <span className={styles.drawerTitle}>
                <span>
                    {trans('charge.orderDetails', '{$userName}的订单详情', {
                        userName: orderDetailContent && orderDetailContent.userName,
                    })}
                </span>
                <span className={styles.titlePayStatus}>
                    {payStatus == 1
                        ? trans('mobile.toBePaid', '待支付')
                        : payStatus == 2
                        ? trans('charge.partialPayment', '部分支付')
                        : payStatus == 3
                        ? trans('mobile.paymentCompleted', '支付完成')
                        : payStatus == 4
                        ? trans('charge.closed', '已关闭')
                        : ''}
                </span>
            </span>
        );
        return (
            <div className={styles.drawer}>
                <Drawer
                    title={title}
                    placement="right"
                    closable={fullScreen ? false : true}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    getContainer={false}
                    // style={{ position: 'absolute' }}
                    width={fullScreen ? '100%' : '640px'}
                >
                    <div className={styles.orderDetail}>
                        <span className={styles.title}>
                            {orderDetailContent && orderDetailContent.zhName}
                        </span>
                        <div className={styles.orderMsg}>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.name', '姓名：')}
                                </span>
                                {orderDetailContent && orderDetailContent.userName}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.studentNo', '学号：')}
                                </span>
                                {orderDetailContent && orderDetailContent.studentNo}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.campus', '校区：')}
                                </span>
                                {orderDetailContent && orderDetailContent.campusName}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.stage', '学段：')}
                                </span>
                                {orderDetailContent && orderDetailContent.sectionName}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.administrativeClass', '行政班：')}
                                </span>
                                {orderDetailContent && orderDetailContent.studentGroupName}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.orderStatus', '订单状态：')}
                                </span>
                                {payStatus == 1
                                    ? trans('mobile.toBePaid', '待支付')
                                    : payStatus == 2
                                    ? trans('charge.partialPayment', '部分支付')
                                    : payStatus == 3
                                    ? trans('mobile.paymentCompleted', '支付完成')
                                    : payStatus == 4
                                    ? trans('charge.closed', '已关闭')
                                    : ''}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.founder', '创建人：')}
                                </span>
                                {orderDetailContent && orderDetailContent.createrName}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.foundTime', '创建时间：')}
                                </span>
                                {orderDetailContent && orderDetailContent.gmtCreateTime}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.endEditPerson', '最后编辑人：')}
                                </span>
                                {orderDetailContent && orderDetailContent.modifierName}
                            </span>
                            <span className={styles.orderMsgItem}>
                                <span className={styles.label}>
                                    {trans('charge.finishTime', '完成时间：')}
                                </span>
                                {orderDetailContent && orderDetailContent.tradePayTime}
                            </span>
                            <span className={styles.orderMsgDescription}>
                                <span className={styles.label}>
                                    {trans('charge.feeDescription', '费用说明：')}
                                </span>
                                {orderDetailContent && orderDetailContent.zhDescription}
                            </span>
                        </div>
                        <div className={styles.orderItem}>
                            <span className={styles.mainLabel}>
                                {trans('charge.items', '收费项目')}
                            </span>
                            <div className={styles.orderCard}>
                                {orderDetailContent &&
                                    orderDetailContent.payChargeItemDetailModelList &&
                                    orderDetailContent.payChargeItemDetailModelList.map(
                                        (item, index) => {
                                            return (
                                                <div className={styles.item} key={index}>
                                                    <span className={styles.itemPrice}>
                                                        <span className={styles.title}>
                                                            {orderDetailContent.payOrderName &&
                                                                orderDetailContent.payOrderName}
                                                            &nbsp;
                                                            {item.payChargeItemName || item.name}
                                                        </span>
                                                        <span className={styles.price}>
                                                            <span className={styles.unitPrice}>
                                                                ￥{item.price}
                                                            </span>
                                                            <span className={styles.amount}>
                                                                x{item.quantity ? item.quantity : 1}
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className={styles.add}>
                                                        ￥{numMulti(item.price, item.quantity || 1)}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )}

                                <span className={styles.aboutPrice}>
                                    <span className={styles.total}>
                                        <span>{trans('pay.amount', '合计：')}</span>￥
                                        {orderDetailContent && orderDetailContent.amount}
                                    </span>
                                    {orderDetailContent.deductionAmount != '0.00' && (
                                        <span className={styles.total}>
                                            <span>
                                                {trans('pay.balanceDeduting', '余额抵扣：')}
                                            </span>
                                            ￥
                                            {orderDetailContent &&
                                                orderDetailContent.deductionAmount}
                                        </span>
                                    )}

                                    <span className={styles.total}>
                                        <span>{trans('pay.realPayment', '实付款：')}</span>￥
                                        {orderDetailContent && orderDetailContent.realPayAmount}
                                    </span>
                                    {/* <span className={styles.total}>
                                        <span>{trans('charge.paid', '已支付：')}</span>￥
                                        {orderDetailContent &&
                                            orderDetailContent.batchAccumulatedAmount}
                                    </span> */}
                                    <span className={styles.total}>
                                        <span>{trans('charge.outstanding1', '欠缴：')}</span>￥
                                        {orderDetailContent && orderDetailContent.owedAmount}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className={styles.tradeInfo}>
                            <span className={styles.mainLabel}>
                                {trans('charge.mainLabel', '交易信息')}
                            </span>
                            {payCloseOrderInfoModel ? (
                                <div className={styles.closeInfo}>
                                    <span className={styles.half}>
                                        <span className={styles.label}>
                                            {trans('charge.closeReason1', '关闭原因：')}
                                        </span>
                                        {payCloseOrderInfoModel.closeType === 1
                                            ? trans('charge.closeChannel', '已在其他渠道缴费')
                                            : payCloseOrderInfoModel.closeType === 2
                                            ? trans('charge.noPay1', '无需继续缴费(如转学,退学等)')
                                            : null}
                                    </span>
                                    {payCloseOrderInfoModel.closeType === 1 ? (
                                        <span className={styles.half}>
                                            <span className={styles.label}>
                                                {trans('charge.actualPrice1', '实收金额：')}
                                            </span>
                                            {payCloseOrderInfoModel.price}
                                        </span>
                                    ) : null}
                                    {payCloseOrderInfoModel.closeType === 1 ? (
                                        <span className={styles.infoItem}>
                                            <span className={styles.label}>
                                                {trans('charge.bankName1', '缴费银行：')}
                                            </span>
                                            {payCloseOrderInfoModel.bankName}
                                        </span>
                                    ) : null}
                                    {payCloseOrderInfoModel.closeType === 1 ? (
                                        <span className={styles.infoItem}>
                                            <span className={styles.label}>
                                                {trans('charge.bankCardNo1', '缴费卡号：')}
                                            </span>
                                            {payCloseOrderInfoModel.bankCardNo}
                                        </span>
                                    ) : null}
                                    <span className={styles.infoItem}>
                                        <span className={styles.label}>
                                            {trans('charge.remark1', '备注：')}
                                        </span>
                                        {payCloseOrderInfoModel.remark}
                                    </span>
                                    <span className={styles.infoItem + ' ' + styles.imgUpload}>
                                        <span className={styles.label}>
                                            {trans('charge.annexTitle', '附件：')}
                                        </span>
                                        {payCloseOrderInfoModel.fileUrl && (
                                            <a
                                                className={styles.img}
                                                href={
                                                    window.location.origin +
                                                    payCloseOrderInfoModel.fileUrl
                                                }
                                                target="_blank"
                                            >
                                                <img
                                                    src={
                                                        window.location.origin +
                                                        payCloseOrderInfoModel.fileUrl
                                                    }
                                                />
                                                {/* <img src='https://yungu-xiaozhao.oss-cn-hangzhou.aliyuncs.com/yungu-website/89488622205479970046a35b56d2b585d6f6e78fc97f8c7a2.jpeg' /> */}
                                            </a>
                                        )}
                                    </span>
                                </div>
                            ) : (
                                orderDetailContent &&
                                orderDetailContent.payTuitionBatchOrderModels &&
                                orderDetailContent.payTuitionBatchOrderModels.map((item, index) => {
                                    return (
                                        <div className={styles.info} key={index}>
                                            {item.deductionBill ? null : (
                                                <span className={styles.half}>
                                                    <span className={styles.label}>
                                                        {trans('charge.half', '账户：')}
                                                    </span>
                                                    {item.fundAccountName}
                                                </span>
                                            )}

                                            <span className={styles.half}>
                                                <span className={styles.label}>
                                                    {trans('charge.payMode1', '支付方式：')}
                                                </span>
                                                {item.fundChannelName}
                                            </span>
                                            {item.deductionBill ? null : (
                                                <>
                                                    <span className={styles.infoItem}>
                                                        <span className={styles.label}>
                                                            {trans(
                                                                'charge.channelTradeNo',
                                                                '渠道订单号：'
                                                            )}
                                                        </span>
                                                        {item.channelTradeNo}
                                                    </span>
                                                    <span className={styles.infoItem}>
                                                        <span className={styles.label}>
                                                            {trans('charge.orderNo', '支付单号：')}
                                                        </span>
                                                        {item.orderNo}
                                                    </span>
                                                </>
                                            )}

                                            <span className={styles.half}>
                                                <span className={styles.label}>
                                                    {trans('charge.money1', '金额：')}
                                                </span>
                                                {item.amount}
                                            </span>
                                            <span className={styles.half}>
                                                <span className={styles.label}>
                                                    {trans('charge.payTime', '付款时间：')}
                                                </span>
                                                {item.payTime}
                                            </span>
                                            {/* <span className={styles.half}>
                                                <span className={styles.label}>
                                                    {trans('charge.operator', '操作人：')}
                                                </span>
                                                {item.createUserName}
                                            </span> */}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </Drawer>
            </div>
        );
    }
}
