//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Form, Input, Button, Icon, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import icon from '../../icon.less';
import { trans } from '../../utils/i18n';

@connect((state) => ({
    payItemCategory: state.chargePro.payItemCategory,
    newCategoryMsg: state.chargePro.newCategoryMsg,
    categoryDelMsg: state.chargePro.categoryDelMsg,
}))
@Form.create()
export default class Category extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false, // 编辑框显隐
            isEdit: false, // 是否编辑状态
            editItem: undefined, //编辑项
        };
    }

    componentDidMount() {}

    // 查询项目类型
    getCategoryList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'chargePro/queryPayItemCategory',
        });
    };

    // 新建修改项目类型
    handleFormOk = (e) => {
        const { dispatch } = this.props;
        const { editItem, isEdit } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: 'chargePro/addOrUpdPayItemCategory',
                    payload: {
                        name: values.name,
                        ename: values.ename,
                        type: isEdit ? 2 : 1, // 1 添加, 2更更新
                        id: isEdit ? editItem.id : null, // type=2,修改时必传
                    },
                }).then(() => {
                    const { newCategoryMsg } = this.props;
                    if (newCategoryMsg.status) {
                        if (newCategoryMsg.code == 2015 || newCategoryMsg.code == 2016) {
                            message.info(this.props.newCategoryMsg.message);
                            return;
                        }
                        message.success(this.props.newCategoryMsg.message);
                        this.getCategoryList();
                        this.setState({
                            isShow: false,
                            isEdit: false,
                        });
                    }
                });
            }
        });
    };

    // 删除项目类型
    delCategory = (item) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'chargePro/delPayItemCategory',
            payload: {
                id: item.id,
            },
        }).then(() => {
            if (this.props.categoryDelMsg.status) {
                message.success(this.props.categoryDelMsg.message);
                this.getCategoryList();
            }
        });
    };

    // 点击新建按钮，表单显示，非编辑状态
    showForm = () => {
        this.setState({
            isShow: true,
            isEdit: false,
        });
    };

    // 取消关闭表单框
    handleFormCancel = () => {
        this.setState({
            isShow: false,
            isEdit: false,
        });
    };

    // 点击编辑，表单显示，编辑状态
    editCategory = (item) => {
        this.setState({
            isEdit: true,
            isShow: true,
            editItem: item, // 存储当前编辑项数据
        });
    };

    modalConfirm = () => {
        this.props.confirm();
    };

    render() {
        const { payItemCategory } = this.props;
        const { isShow, editItem, isEdit } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 6,
                    offset: 17,
                },
            },
        };
        return (
            <div className={styles.category}>
                <p className={styles.title}>{trans('charge.manageChargeTypes', '管理收费类型')}</p>
                {isShow ? null : (
                    <Button type="default" className={styles.new} onClick={this.showForm}>
                        <Icon type="plus" />
                        {trans('charge.addNewTypes', '创建新类型')}
                    </Button>
                )}
                {isShow ? (
                    <div className={styles.edit}>
                        <Form {...formItemLayout} onSubmit={this.handleFormOk}>
                            <Form.Item label={trans('charge.typesName', '类型名称')}>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans('charge.enterZhName', '请输入中文名称'),
                                        },
                                    ],
                                    initialValue: isEdit ? editItem.name : undefined,
                                })(
                                    <Input
                                        placeholder={trans('charge.enterZhName', '请输入中文名称')}
                                        style={{ width: '380px' }}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={trans('charge.enName', '英文名称')}>
                                {getFieldDecorator('ename', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans('charge.enterEnName', '请输入英文名称'),
                                            pattern: /^[^\u4e00-\u9fa5]{0,}$/,
                                        },
                                    ],
                                    initialValue: isEdit ? editItem.ename : undefined,
                                })(
                                    <Input
                                        placeholder={trans('charge.enterEnName', '请输入英文名称')}
                                        style={{ width: '380px' }}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item className={styles.categoryBtn} {...tailFormItemLayout}>
                                <Button type="default" onClick={this.handleFormCancel}>
                                    {trans('charge.cancel', '取消')}
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {trans('charge.confirm', '确认')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                ) : null}
                <div className={styles.listBox}>
                    {payItemCategory && payItemCategory.length
                        ? payItemCategory.map((item, index) => {
                              return (
                                  <div className={styles.list} key={item.categoryNo}>
                                      <div className={styles.leftName}>
                                          <span className={styles.name}>{item.name}</span>
                                          <span className={styles.ename}>{item.ename}</span>
                                      </div>
                                      <div className={styles.action}>
                                          <span onClick={this.editCategory.bind(this, item)}>
                                              <i className={icon.iconfont}>&#xe6aa;</i>
                                          </span>
                                          <span onClick={this.delCategory.bind(this, item)}>
                                              <i className={icon.iconfont}>&#xe739;</i>
                                          </span>
                                      </div>
                                  </div>
                              );
                          })
                        : null}
                </div>

                <div className={styles.categoryAction}>
                    {/* <Button type="default" className={styles.default}>取消</Button> */}
                    <Button type="primary" className={styles.primary} onClick={this.modalConfirm}>
                        {trans('charge.cancel', '确认')}
                    </Button>
                </div>
            </div>
        );
    }
}
