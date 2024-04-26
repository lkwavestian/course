//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Input, message, Modal, Radio } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { trans } from '../../utils/i18n';

@connect((state) => ({
    paymentMethodJudgment: state.account.paymentMethodJudgment,
    addMerChant: state.account.addMerChant,
    queryPayBusinessById: state.account.queryPayBusinessById,
}))
export default class MerChant extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            alipayKey: '',
            appKey: '',
            appId: '',
            appPublicKey: '',
            collectionValue: '',
        };
    }

    componentDidMount() {
        // this.getList();
        const { dispatch, queryPayBusinessById, isMerchantEdit } = this.props;
        isMerchantEdit ? this.getMerchantBusiAndChannel() : null;
    }

    getMerchantBusiAndChannel = () => {
        const { dispatch, formMerChantList } = this.props;
        dispatch({
            type: 'account/queryPayBusinessById',
            payload: {
                id: formMerChantList && formMerChantList.id,
            },
        }).then(() => {
            const { queryPayBusinessById } = this.props;
            this.setState({
                collectionValue: queryPayBusinessById.payType,
                name: queryPayBusinessById.name,
                appId: queryPayBusinessById.appId,
                appKey: queryPayBusinessById.appKey,
                appPublicKey: queryPayBusinessById.appPublicKey,
                alipayKey: queryPayBusinessById.alipayKey,
            });
        });
        dispatch({
            type: 'account/paymentMethodJudgment',
            payload: {},
            onSuccess: () => {},
        });
    };

    handleCancel = () => {
        this.props.onClose(false);
    };
    //ok
    onOk = () => {
        const { dispatch, isMerchantEdit, formMerChantList } = this.props;
        const { name, alipayKey, appKey, appId, appPublicKey, collectionValue } = this.state;
        console.log('formMerChantList', formMerChantList);
        if (!name || !alipayKey || !appKey || !appId || !appPublicKey || !collectionValue) {
            message.info('请填写完整');
            return;
        }
        dispatch({
            type: 'account/addMerChant',
            payload: {
                name,
                alipayKey,
                appKey,
                appId,
                appPublicKey,
                alipayType: '2',
                payType: collectionValue,
                id: isMerchantEdit ? formMerChantList.id : null,
                // type: isMerchantEdit ? 2 : 1, // 1 添加, 2更新
                // id: isMerchantEdit ? accountId : null, // 主键,type=2,修改时必传
            },
            onSuccess: () => {
                this.props.getMerchantList();
            },
        });
        this.props.onClose(false);
    };
    //商户名称
    nameChange = (e) => {
        this.setState({
            name: e.target.value,
        });
    };
    //appd
    appdChange = (e) => {
        this.setState({
            appId: e.target.value,
        });
    };
    //应用公钥
    applicationChange = (e) => {
        this.setState({
            appKey: e.target.value,
        });
    };
    //应用密钥
    appPublicKeyChange = (e) => {
        this.setState({
            appPublicKey: e.target.value,
        });
    };
    //支付宝公钥
    zfbChange = (e) => {
        this.setState({
            alipayKey: e.target.value,
        });
    };

    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            collectionValue: e.target.value,
        });
    };

    getQuerySchoolPayType = () => {
        const { paymentMethodJudgment } = this.props;
        if (
            paymentMethodJudgment &&
            paymentMethodJudgment.length > 0 &&
            paymentMethodJudgment.length == 2
        ) {
            return (
                <>
                    <Radio value={2}>微信支付</Radio>
                    <Radio value={1}>支付宝</Radio>
                </>
            );
        } else if (paymentMethodJudgment.length == 1) {
            this.setState({
                collectionValue: paymentMethodJudgment[0],
            });
            return (
                <>
                    <Radio value={paymentMethodJudgment[0]}>
                        {paymentMethodJudgment[0] == 2
                            ? '微信支付'
                            : paymentMethodJudgment[0] == 1
                            ? '支付宝'
                            : null}
                    </Radio>
                </>
            );
            // return (
            //     <>
            //         <Radio>微信支</Radio>
            //     </>
            // );
        }
    };

    render() {
        const {
            visible,
            paymentMethodJudgment,
            isMerchantEdit,
            queryPayBusinessById,
            formMerChantList,
        } = this.props;
        const { collectionValue, name, alipayKey, appKey, appId, appPublicKey } = this.state;
        console.log('isMerchantEdit', isMerchantEdit);
        return (
            <Modal
                visible={visible}
                title={
                    isMerchantEdit
                        ? trans('charge.addMerchantEdit', '编辑商户')
                        : trans('charge.addMerchant1', '新建商户')
                }
                // title={trans('charge.addMerchant1', '新建商户')}
                onOk={this.onOk}
                okText={trans('charge.confirm', '确认')}
                onCancel={this.handleCancel}
                destroyOnClose
                width={650}
                className={styles.addaCcount}
            >
                <div className={styles.merchantName}>
                    <div className={styles.titleBox}>
                        <span className={styles.notes}>*</span>
                        <span>{trans('charge.Collection channel', '收款渠道：')}</span>
                    </div>
                    <Radio.Group
                        onChange={this.onChange}
                        value={collectionValue}
                        // defaultValue={
                        //     isMerchantEdit ? queryPayBusinessById.payType : collectionValue
                        // }
                    >
                        {this.getQuerySchoolPayType()}
                    </Radio.Group>
                </div>
                {collectionValue == 1 ? (
                    <div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>{trans('charge.businessName', '商户名称：')}</span>
                            </div>
                            <Input
                                className={styles.merchantNameIpt}
                                onChange={this.nameChange}
                                value={name}
                            ></Input>
                        </div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>APPID：</span>
                            </div>
                            <Input
                                className={styles.merchantNameIpt}
                                placeholder={trans(
                                    'charge.aliPayHint',
                                    '请在支付宝，我是开发者身份登陆后获得'
                                )}
                                onChange={this.appdChange}
                                value={appId}
                            ></Input>
                        </div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>{trans('charge.app_public_key', '应用公钥：')}</span>
                            </div>
                            <Input.TextArea
                                className={styles.merchantNameIpt}
                                placeholder={trans(
                                    'charge.aliPayKey',
                                    '支付宝密钥生成工具中的应用公钥'
                                )}
                                onChange={this.applicationChange}
                                value={appKey}
                            ></Input.TextArea>
                        </div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>{trans('charge.app_key', '应用密钥：')}</span>
                            </div>
                            <Input.TextArea
                                className={styles.merchantNameIpt}
                                placeholder={trans(
                                    'charge.aliPay_app_key',
                                    '支付宝密钥生成工具中的应用密钥'
                                )}
                                onChange={this.appPublicKeyChange}
                                value={appPublicKey}
                            ></Input.TextArea>
                        </div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>{trans('charge.aliPay_public_key', '支付宝公钥：')}</span>
                            </div>
                            <Input.TextArea
                                className={styles.merchantNameIpt}
                                placeholder={trans(
                                    'charge.getAliPay_public_key',
                                    '在支付宝-开放平台密钥页面，找到应用的接口加签方式获得'
                                )}
                                onChange={this.zfbChange}
                                value={alipayKey}
                            ></Input.TextArea>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>{trans('charge.businessName', '商户名称：')}</span>
                            </div>
                            <Input
                                className={styles.merchantNameIpt}
                                onChange={this.nameChange}
                                value={name}
                            ></Input>
                        </div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>公共账号ID：</span>
                            </div>
                            <Input
                                className={styles.merchantNameIpt}
                                // placeholder={trans(
                                //     'charge.aliPayHint',
                                //     '请在支付宝，我是开发者身份登陆后获得'
                                // )}
                                onChange={this.appdChange}
                                value={appId}
                            ></Input>
                        </div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox} style={{ marginLeft: '-14px' }}>
                                <span className={styles.notes}>*</span>
                                <span>{trans('charge.public account key', '公共账号秘钥：')}</span>
                            </div>
                            <Input.TextArea
                                className={styles.merchantNameIpt}
                                // placeholder={trans(
                                //     'charge.aliPayKey',
                                //     '支付宝密钥生成工具中的应用公钥'
                                // )}
                                onChange={this.applicationChange}
                                value={appKey}
                            ></Input.TextArea>
                        </div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>{trans('charge.Merchant_key', '商户账号：')}</span>
                            </div>
                            <Input.TextArea
                                className={styles.merchantNameIpt}
                                // placeholder={trans(
                                //     'charge.aliPay_app_key',
                                //     '支付宝密钥生成工具中的应用密钥'
                                // )}
                                onChange={this.appPublicKeyChange}
                                value={appPublicKey}
                            ></Input.TextArea>
                        </div>
                        <div className={styles.merchantName}>
                            <div className={styles.titleBox}>
                                <span className={styles.notes}>*</span>
                                <span>{trans('charge.aliPay_Merchant_key', '商户秘钥：')}</span>
                            </div>
                            <Input.TextArea
                                className={styles.merchantNameIpt}
                                // placeholder={trans(
                                //     'charge.getAliPay_public_key',
                                //     '在支付宝-开放平台密钥页面，找到应用的接口加签方式获得'
                                // )}
                                onChange={this.zfbChange}
                                value={alipayKey}
                            ></Input.TextArea>
                        </div>
                    </div>
                )}
            </Modal>
        );
    }
}
