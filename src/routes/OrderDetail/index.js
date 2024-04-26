//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import OrderDetails from '../../components/PayNotice/orderDetail';
import { getUrlSearch } from '../../utils/utils';

@connect((state) => ({
    orderDetailContent: state.pay.orderDetailContent, // 订单详情
}))
export default class OrderDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            useWallet: '',
        };
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/getAccountOderDetail',
            payload: {
                orderNo: params.orderNo,
                tuitionPlanId: params.tuitionPlanId,
            },
        });

        dispatch({
            type: 'pay/selectTuitionPlanDetails',
            payload: {
                ifOfflineTransfer: '',
                matchName: '',
                messageStatus: '',
                pageNum: 1,
                pageSize: 40,
                payStatus: '',
                studentGroup: '',
                tuitionPlanId: params.tuitionPlanId,
            },
        }).then(() => {
            const { detailContent } = this.props;
            this.setState({
                useWallet:
                    detailContent &&
                    detailContent.pagerResult &&
                    detailContent.pagerResult.data &&
                    detailContent.pagerResult.data.canUseWallet,
            });
        });
    }

    render() {
        document.title = '学费详情';
        const { useWallet } = this.state;
        const { orderDetailContent } = this.props;
        return (
            <OrderDetails
                useWallet={useWallet}
                isViewDetail={true}
                orderDetailContent={orderDetailContent}
                fullScreen={true}
            />
        );
    }
}
