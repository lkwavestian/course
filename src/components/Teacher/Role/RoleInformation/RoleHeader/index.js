import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Modal, Radio, Form, Input, Button, Tooltip, message } from 'antd';
import { PlusOutlined, ImportOutlined, AppstoreOutlined } from '@ant-design/icons';
import CommonUpload from '../../../../CommonModal/CommonUpload';
import { locale } from 'moment';
import { trans } from '../../../../../utils/i18n';
const { confirm } = Modal;

@connect((state) => ({
    roleUserInfo: state.teacher.roleUserInfo,
    roleTagInfo: state.teacher.roleTagInfo,
    roleSemester: state.teacher.roleSemester,
    roleSchoolId: state.teacher.roleSchoolId,
    systemBuiltRole: state.teacher.systemBuiltRole,
}))
@Form.create()
export default class RoleHeader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editRoleVisible: false,
            importModalVisible: false,
        };
    }

    toggleEditRoleVisible = (visible) => {
        this.setState({
            editRoleVisible: visible,
        });
    };

    editRole = () => {
        const {
            roleSemester,
            form: { validateFields },
            dispatch,
            roleTagInfo,
            roleSchoolId,
        } = this.props;
        let _this = this;
        validateFields((err, values) => {
            const { name, enName, scope } = values;
            const { tag, desc } = roleTagInfo;
            if (roleTagInfo.scope === scope) {
                dispatch({
                    type: 'teacher/editRole',
                    payload: {
                        schoolId: roleSchoolId,
                        schoolYearId: roleSemester,
                        name,
                        enName,
                        scope,
                        tag,
                        desc,
                        delete: 0,
                    },
                    onSuccess: () => {
                        message.success('编辑成功');
                    },
                }).then(() => {
                    _this.toggleEditRoleVisible(false);
                    _this.getRoleList();
                });
            } else {
                confirm({
                    content:
                        '修改管辖范围类型后，该角色中已有人员的管辖范围需要重新设置，是否确认修改',
                    onOk() {
                        if (!err) {
                            dispatch({
                                type: 'teacher/editRole',
                                payload: {
                                    schoolId: roleSchoolId,
                                    schoolYearId: roleSemester,
                                    name,
                                    enName,
                                    scope,
                                    tag,
                                    desc,
                                    delete: 0,
                                },
                                onSuccess: () => {
                                    message.success('编辑成功');
                                },
                            }).then(() => {
                                _this.toggleEditRoleVisible(false);
                                _this.getRoleList();
                            });
                        }
                    },
                });
            }
        });
    };

    clickEditRole = () => {
        const {
            roleTagInfo: { roleName, roleEnName, scope },
            form: { setFieldsValue },
        } = this.props;
        setFieldsValue(
            {
                name: roleName,
                enName: roleEnName,
                scope: scope,
            },
            () => {
                this.toggleEditRoleVisible(true);
            }
        );
    };

    getRoleList = () => {
        const { dispatch, roleSemester, roleSchoolId } = this.props;
        dispatch({
            type: 'teacher/getRoleList',
            payload: {
                schoolId: roleSchoolId,
                schoolYearId: roleSemester,
            },
        });
    };

    deleteRole = () => {
        console.log('aa');
        const {
            dispatch,
            roleSemester,
            roleTagInfo: { roleName, roleEnName, scope, tag },
            roleSchoolId,
        } = this.props;
        let _this = this;
        confirm({
            content: trans(
                'role.deleteTitle',
                '删除角色后，该角色中已有人员及相应的权限将会失效，是否确认删除'
            ),
            onOk() {
                dispatch({
                    type: 'teacher/editRole',
                    payload: {
                        schoolId: roleSchoolId,
                        schoolYearId: roleSemester,
                        name: roleName,
                        enName: roleEnName,
                        scope,
                        tag,
                        delete: 1,
                    },
                    onSuccess: () => {
                        message.success('删除成功');
                    },
                }).then(() => {
                    _this.getRoleList();
                    _this.toggleEditRoleVisible(false);
                });
            },
            onCancel() {
                console.log('Cancel');
            },
            okText: '删除',
            cancelText: '取消',
        });
    };

    import = () => {
        this.setState({
            importModalVisible: true,
        });
    };

    importSuccessCb = () => {
        console.log('importSuccessCb');
    };

    hideModal = () => {
        this.setState({
            importModalVisible: false,
        });
    };

    render() {
        const {
            roleUserInfo,
            roleTagInfo,
            systemBuiltRole,
            form: { getFieldDecorator },
        } = this.props;
        const { editRoleVisible, importModalVisible } = this.state;
        return (
            <div className={styles.roleHeader}>
                <span className={styles.roleTag}>
                    {locale() !== 'en' ? roleTagInfo.roleName : roleTagInfo.roleEnName}
                </span>
                <span className={styles.roleEdit}>
                    <span onClick={this.clickEditRole}>
                        {locale() == 'en' ? 'Edit' : '编辑角色'}
                    </span>
                    {/* <span>{locale() == 'en' ? 'Configure Permissions' : '配置权限'}</span> */}
                </span>
                <span className={styles.btnList}>
                    <span className={styles.operateBtn}>
                        <PlusOutlined />

                        {locale() == 'en' ? 'Add Person' : '添加人员'}
                    </span>
                    <span className={styles.operateBtn} onClick={this.import}>
                        <PlusOutlined />
                        {trans('course.plan.toLead', '导入')}
                    </span>
                    <span className={styles.operateBtn}>
                        <ImportOutlined className={styles.rotateIcon} />
                        {trans('global.Export', '导出')}
                    </span>
                    <span className={styles.operateBtn}>
                        <AppstoreOutlined />
                        {trans('student.batchOperation', '批量操作')}
                    </span>
                </span>
                <Modal
                    visible={editRoleVisible}
                    title={locale() == 'en' ? 'Edit' : '编辑角色'}
                    onCancel={() => this.toggleEditRoleVisible(false)}
                    getContainer={false}
                    footer={[
                        <Button style={{ float: 'left' }} onClick={this.deleteRole}>
                            {trans('role.deleteRole', '删除角色')}
                        </Button>,
                        <Button key="submit" onClick={() => this.toggleEditRoleVisible(false)}>
                            {trans('course.plan.cancelText', '取消')}
                        </Button>,
                        <Button key="back" type="primary" onClick={this.editRole}>
                            {trans('course.plan.okText', '确认')}
                        </Button>,
                    ]}
                    width={630}
                    wrapClassName={styles.editRoleModal}
                >
                    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 15 }}>
                        <Form.Item label={locale() == 'en' ? 'Role name' : '角色名称'}>
                            {getFieldDecorator('name')(<Input />)}
                        </Form.Item>

                        <Form.Item label={trans('global.englishTitleTable', '英文名称')}>
                            {getFieldDecorator('enName')(<Input />)}
                        </Form.Item>
                        <Form.Item
                            label={locale() == 'en' ? 'Jurisdiction' : '管辖范围'}
                            wrapperCol={21}
                        >
                            {getFieldDecorator('scope')(
                                <Radio.Group
                                    disabled={systemBuiltRole
                                        .map((item) => item.tag)
                                        .includes(roleTagInfo.tag)}
                                >
                                    <Radio value={1}>
                                        {trans('role.campusDepartment', '学部')}
                                    </Radio>
                                    <Radio value={2}>{trans('course.plan.grade', '年级')}</Radio>
                                    <Radio value={3}>
                                        {trans(
                                            'course.basedetail.base.administrative.class',
                                            '行政班'
                                        )}
                                    </Radio>
                                    <Radio value={4}>学科+年级</Radio>
                                    <Radio value={5}>学科+学段</Radio>
                                    <Radio value={6}>{trans('role.studyStage', '学段')}</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <CommonUpload
                    importModalVisible={importModalVisible}
                    hideModal={this.hideModal}
                    importSuccessCb={this.importSuccessCb}
                    downLoadUrl="/api/role/baseTag/download"
                    checkUrl="/api/role/baseTag/checkExcelImport"
                    uploadUrl="/api/role/baseTag/excelImport"
                />
            </div>
        );
    }
}
