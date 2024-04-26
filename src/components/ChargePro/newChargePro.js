//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Form, Input, Select, Radio, Button, message, Checkbox, InputNumber } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import icon from '../../icon.less';
import { trans } from '../../utils/i18n';
import { locale } from 'moment';

const { Option } = Select;
const { TextArea } = Input;

@connect((state) => ({
    payItemCategory: state.chargePro.payItemCategory,
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    accountList: state.account.accountList,
    newProMsg: state.chargePro.newProMsg,
    currentUser: state.global.currentUser,
}))
@Form.create()
export default class NewChargePro extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkboxObject: [],
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/selectTeachingOrgStage',
        });
        let { formList: { itemDiscountType, itemDiscountRatio, tags }, isEdit, visible } = this.props;
        this.setState({
            consignmentFee: tags,
            discountType: itemDiscountType,
            discountRadio: itemDiscountRatio,
        })
    }

    // componentWillReceiveProps(nextProps){
    //     console.log(nextProps.visible, this.props.visible,' uwuw')
    //     if(nextProps.visible != this.props.visible ){
    //         let { formList: { itemDiscountType, itemDiscountRatio, tags }, isEdit, visible } = this.props;
    //         console.log('formList', itemDiscountType, itemDiscountRatio, isEdit )
    //         if(isEdit && visible){
    //             this.setState({
    //                 consignmentFee: tags,
    //                 discountType: itemDiscountType,
    //                 discountRadio: itemDiscountRatio,
    //             })
    //         }
    //     }
        
    // }

    handleSubmit = (e) => {
        const { dispatch, isEdit, campusAndStage, currentUser } = this.props;
        const { discountRadio, discountType, consignmentFee } = this.state;

        if(currentUser.schoolId == 1 && consignmentFee == 0){
            if(!discountType){
                message.warning('请选择是否享受折扣！')
                return
            }
        }

        if ( currentUser.schoolId == 1 && discountType == 2) {
            if (!discountRadio) {
                message.warning('请输入折扣比例后提交！');
                return;
            }
        }
        
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const checkboxObjects = [];
            values.stageId.map((item) => {
                campusAndStage.stage.map((items, index) => {
                    if (item == items.stage) {
                        checkboxObjects.push(items);
                    }
                });
            });
            if (!err) {
                dispatch({
                    type: 'chargePro/addOrUpdPayChargeItem',
                    payload: {
                        suitStage: checkboxObjects,
                        category: values.category,
                        accountId: values.account,
                        remark: values.note,
                        price: values.price,
                        id: isEdit ? this.props.id : 1, // type=2,修改时必传
                        type: isEdit ? 2 : 1, // 1 添加, 2更更新
                        ename: values.ename,
                        name: values.name,
                        tags: values.tags,
                        itemDiscountType:
                            currentUser.schoolId == 1 && values.tags == 0 ? discountType : null,
                        itemDiscountRatio: discountType == 2 ? discountRadio : null
                    },
                }).then(() => {
                    const { newProMsg } = this.props;
                    if (newProMsg.status) {
                        if (newProMsg.code == 2014 || newProMsg.code == 2013) {
                            message.success(newProMsg.message);
                        } else {
                            this.props.cancel(false);
                        }
                    }
                });
            }
        });
    };

    onRadioChange = (e) => {
        this.setState({
            consignmentFee: e.target.value,
        });
    };

    changeDiscount = (e) => {
        this.setState({
            discountType: e.target.value,
        });
    };

    changeDiscountRadio = (e) => {
        this.setState({
            discountRadio: e.target.value,
        });
    };

    handleCancel = (e) => {
        this.props.cancel(false);
    };
    checkboxChange = (checkedValues) => {
        const { campusAndStage } = this.props;
        const checkboxObject = [];
        checkedValues.map((item) => {
            campusAndStage.stage.map((items, index) => {
                if (item == items.stage) {
                    checkboxObject.push(items);
                }
            });
        });
        this.setState({
            checkboxObject,
        });
    };

    render() {
        const { isEdit, accountList, payItemCategory, formList, campusAndStage, currentUser } =
            this.props;
        const ids = [];
        formList &&
            formList.stageName &&
            typeof formList.stageName != 'string' &&
            formList.stageName.length > 0 &&
            formList.stageName.map((item) => {
                ids.push(item.stage);
            });
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        console.log(campusAndStage, 'vc2');
        console.log('consignmentFee',this.state.consignmentFee)
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 24,
                    // offset: 8,
                },
            },
        };
        return (
            <div className={styles.newChargePro}>
                <p className={styles.newTitle}>
                    {isEdit
                        ? trans('charge.editChargedItems', '编辑收费项目')
                        : trans('charge.addChargedItems', '新建收费项目')}
                </p>

                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label={trans('charge.changeType', '收费类型')}>
                        {getFieldDecorator('category', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('charge.chooseChangeType', '请选择收费类型'),
                                },
                            ],
                            initialValue: isEdit ? formList.categoryNo : undefined,
                        })(
                            <Select
                                placeholder={trans('charge.chooseChangeType', '请选择收费类型')}
                                size="large"
                                style={{ width: '320px' }}
                            >
                                {payItemCategory &&
                                    payItemCategory.length &&
                                    payItemCategory.map((item, index) => {
                                        return (
                                            <Option value={item.categoryNo} key={item.categoryNo}>
                                                {item.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label={trans('charge.chineseName', '中文名称')}>
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('charge.enterZhName', '请输入中文名称'),
                                },
                            ],
                            initialValue: isEdit ? formList.name : undefined,
                        })(
                            <Input
                                placeholder={trans('charge.enterZhName', '请输入中文名称')}
                                size="large"
                                style={{ width: '500px' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={trans('charge.enName', '英文名称')}>
                        {getFieldDecorator('ename', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter English title',
                                    pattern: /^[^\u4e00-\u9fa5]{0,}$/,
                                },
                            ],
                            initialValue: isEdit ? formList.ename : undefined,
                        })(
                            <Input
                                placeholder="Please enter English title"
                                size="large"
                                style={{ width: '500px' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={trans('charge.defaultAmount', '预设金额')}>
                        {getFieldDecorator('price', {
                            rules: [
                                {
                                    required: true,
                                    message: trans(
                                        'charge.enter_defaultAmount',
                                        '请输入预设收款金额'
                                    ),
                                    // pattern: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/,
                                },
                            ],
                            initialValue: isEdit ? formList.price : undefined,
                        })(
                            <Input
                                placeholder={trans(
                                    'charge.enter_defaultAmountTwo',
                                    '请输入预设收款金额, 最多支持2位小数'
                                )}
                                size="large"
                                style={{ width: '500px' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={trans('charge.accountsReceivable', '收款账户')}>
                        {getFieldDecorator('account', {
                            rules: [
                                {
                                    required: true,
                                    message: trans(
                                        'charge.enter_accountsReceivable',
                                        '请选择收款账户'
                                    ),
                                },
                            ],
                            initialValue: isEdit ? formList.accountId : undefined,
                        })(
                            <Select
                                placeholder={trans(
                                    'charge.enter_accountsReceivable',
                                    '请选择收款账户'
                                )}
                                size="large"
                                style={{ width: '380px' }}
                            >
                                {accountList.data &&
                                    accountList.data.length &&
                                    accountList.data.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.accountName}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label={trans('charge.isEscrowFee', '是否为代管费')}>
                        {getFieldDecorator('tags', {
                            rules: [
                                { required: true, message: trans('charge.pleaseSelect', '请选择') },
                            ],
                            initialValue: isEdit ? formList.tags : undefined,
                        })(
                            <Radio.Group onChange={this.onRadioChange} /* disabled={isEdit} */>
                                <Radio value={1}>
                                    {/* {' '}
                                    {currentUser.schoolId == 1
                                        ? '代管费，面向教职工子女无折扣'
                                        : trans('charge.Yes', '是')} */}
                                    {trans('payTheFees.consignmentFee', '代管费')}
                                </Radio>
                                <Radio value={0}>
                                    {/* {currentUser.schoolId == 1
                                        ? '非代管费，面向教职工子女享受7折'
                                        : trans('charge.No', '否')} */}
                                    
                                    {trans('payTheFees.nonEscrow', '非代管费')}
                                </Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {currentUser.schoolId == 1 && this.state.consignmentFee == 0 ? (
                        <Form.Item label={trans('payTheFees.discountOrNot','教职工子女折扣')}>
                            {getFieldDecorator('itemDiscountType', {
                                // rules: [
                                //     { required: true, message: trans('charge.pleaseSelect', '请选择') },
                                // ],
                                initialValue: isEdit ? formList.itemDiscountType : undefined,
                            })(
                                <>
                                    <Radio.Group
                                        onChange={this.changeDiscount}
                                        value={this.state.discountType}
                                    >
                                        <Radio value={1}>{trans('payTheFees.noDiscount','无折扣')}</Radio>
                                        <Radio value={2}>{trans('payTheFees.discounted','有折扣')}</Radio>
                                    </Radio.Group>
                                    {this.state.discountType == 2 ? (
                                        <Input
                                            style={{ width: locale() != 'en' ? 130 : 200 }}
                                            placeholder={trans('payTheFees.discountRadio','输入折扣比例')}
                                            onChange={this.changeDiscountRadio}
                                            value={this.state.discountRadio}
                                        />
                                    ) : null}
                                </>
                            )}
                        </Form.Item>
                    ) : null}
                    <Form.Item label={trans('charge.applicableSemester', '适用学段:')}>
                        {getFieldDecorator('stageId', {
                            rules: [{ required: true, message: '请选择' }],
                            initialValue: isEdit ? ids : undefined,
                        })(
                            <Checkbox.Group onChange={this.checkboxChange}>
                                {campusAndStage.stage &&
                                    campusAndStage.stage.length &&
                                    campusAndStage.stage.map((item, index) => {
                                        return (
                                            <Checkbox value={Number(item.stage)} key={item.stage}>
                                                {locale() == 'en' ? item.ename : item.name}
                                            </Checkbox>
                                        );
                                    })}
                            </Checkbox.Group>
                        )}
                    </Form.Item>

                    <Form.Item label={trans('charge.remark', '备注')} className={styles.formItem}>
                        {getFieldDecorator('note', {
                            initialValue: isEdit ? formList.remark : undefined,
                        })(<TextArea rows={4} style={{ width: '500px' }} />)}
                    </Form.Item>

                    <Form.Item className={styles.btnBox} {...tailFormItemLayout}>
                        <Button
                            type="default"
                            onClick={this.handleCancel}
                            style={{
                                width: '88px',
                                height: '36px',
                                borderRadius: '8px',
                                marginRight: '4px',
                                border: '0',
                                color: 'rgba(1, 17, 61, 0.65)',
                                background: 'rgba(1, 17, 61, 0.07)',
                                lineHeight: '36px',
                            }}
                        >
                            {trans('charge.cancel', '取消')}
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                width: '88px',
                                height: '36px',
                                borderRadius: '8px',
                                marginLeft: '4px',
                                background: '#3B6FF5',
                                lineHeight: '36px',
                            }}
                        >
                            {trans('charge.confirm', '确认')}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
