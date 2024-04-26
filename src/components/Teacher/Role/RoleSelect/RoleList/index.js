import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select, Modal, Radio, Form, Input, Icon, Table, Switch, Button, Popconfirm } from 'antd';
import { EditableCell } from './editableCell';
import { trans } from '../../../../../utils/i18n';
import { TeamOutlined, PlusOutlined, TaobaoSquareFilled } from '@ant-design/icons';
import { locale } from 'moment';

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
@Form.create()
@connect((state) => ({
    roleList: state.teacher.roleList,
    roleSemester: state.teacher.roleSemester,
    roleSchoolId: state.teacher.roleSchoolId,
    systemBuiltRole: state.teacher.systemBuiltRole,
    tag: state.teacher.tag,
    currentUser: state.global.currentUser, //当前用户信息
    rolePermissionobj: state.global.rolePermissionobj,
}))
export default class RoleList extends PureComponent {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: trans('role.roles', '角色'),
                dataIndex: 'roleSourceName',
                key: 'roleSourceName',
                width: '30%',
            },
            {
                title: trans('role.isEnabled', '是否禁用'),
                dataIndex: 'enableStatus',
                key: 'enableStatus',
                render: (enableStatus, record) => {
                    return (
                        <span>
                            <Switch
                                checked={enableStatus}
                                onChange={(checked) =>
                                    this.changeEnableStatus(checked, record.systemRoleInfo)
                                }
                                checkedChildren={trans('role.enabled', '已开启')}
                                unCheckedChildren={trans('role.disabled', '未开启')}
                            ></Switch>
                        </span>
                    );
                },
                width: '30%',
            },
            {
                title: trans('role.custom.display.name', '别名'),
                dataIndex: 'name',
                key: 'name',
                editable: true,
            },
        ];
        this.state = {
            tag: '',
            createRoleVisible: false,
            managerRoleVisible: false,
            currentRoleListKey: '',
        };
    }

    setTagInfo = (tag) => {
        this.props.dispatch({
            type:'teacher/setTag',
            payload:tag
        })
    }

    roleItemClick = async (e, item) => {
        console.log(item, 'item')
        const { dispatch, roleSemester, roleSchoolId, currentUser } = this.props;
        // this.setState({
        //     tag: item.tag,
        // });
        this.setTagInfo(item.tag)
        dispatch({
            type: 'teacher/getRoleTagInfo',
            payload: item,
        }).then(()=>{
            dispatch({
                type: 'global/listRolePermission',
                payload: {
                    eduGroupCompanyId: currentUser.eduGroupcompanyId,
                    schoolId: currentUser.schoolId,
                    tag: item.tag,
                },
            }).then(()=>{
                const {rolePermissionobj} = this.props;
                dispatch({
                    type: 'teacher/setPermissiomIndex',
                    payload: 0,
                });
                dispatch({
                    type: 'teacher/setPermissiomList',
                    payload: rolePermissionobj.appPermissionList[0].permissionDetailModels,
                });
            });
        });
        await dispatch({
            type: 'teacher/toggleRoleTableLoading',
            payload: true,
        });
        await dispatch({
            type: 'teacher/getRoleUserInfo',
            payload: {
                tag: item.tag,
                schoolYearId: roleSemester,
                schoolId: roleSchoolId,
            },
        });
        
        await dispatch({
            type: 'teacher/toggleRoleTableLoading',
            payload: false,
        });

        
    };

    toggleCreateRoleVisible = (visible) => {
        this.setState({
            createRoleVisible: visible,
        });
    };

    createRole = (_, systemRoleInfo) => {
        const {
            form: { validateFields },
            dispatch,
            roleSemester,
            roleSchoolId,
        } = this.props;
        const { currentRoleListKey } = this.state;
        let roleType = currentRoleListKey === 'formalRoleTagList' ? 1 : 0;
        if (systemRoleInfo) {
            const { name, enName, scope, baseTagId, tag } = systemRoleInfo;
            dispatch({
                type: 'teacher/createRole',
                payload: {
                    name,
                    enName,
                    scope,
                    tag,
                    roleType,
                    schoolYearId: roleSemester,
                    desc: baseTagId,
                    schoolId: roleSchoolId,
                },
            }).then(() => {
                this.toggleCreateRoleVisible(false);
                this.getRoleList();
            });
        } else {
            this.toggleCreateRoleVisible(false);
            validateFields((err, values) => {
                const { name, enName, scope } = values;
                if (!err) {
                    dispatch({
                        type: 'teacher/createRole',
                        payload: {
                            name,
                            enName,
                            scope,
                            roleType,
                            schoolYearId: roleSemester,
                            schoolId: roleSchoolId,
                        },
                    }).then(() => {
                        this.toggleCreateRoleVisible(false);
                        this.getRoleList();
                    });
                }
            });
        }
    };

    editRole = (systemRoleInfo, switchStatus) => {
        const { dispatch, roleSemester, roleSchoolId } = this.props;
        const { currentRoleListKey } = this.state;
        const { name, enName, scope, baseTagId, tag } = systemRoleInfo;
        let roleType = currentRoleListKey === 'formalRoleTagList' ? 1 : 0;
        dispatch({
            type: 'teacher/editRole',
            payload: {
                name,
                enName,
                scope,
                tag,
                roleType,
                schoolId: roleSchoolId,
                schoolYearId: roleSemester,
                desc: baseTagId,
                isUse: switchStatus,
            },
        }).then(() => this.getRoleList());
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

    getSystemBuiltRole = () => {
        const { dispatch, roleSemester, roleSchoolId } = this.props;
        dispatch({
            type: 'teacher/systemBuiltRole',
            payload: {
                schoolYearId: roleSemester,
                schoolId: roleSchoolId,
            },
        });
    };

    showManagerRoleModal = (roleListKey) => {
        this.setState({
            managerRoleVisible: true,
            currentRoleListKey: roleListKey,
        });
    };

    hideManagerRoleModal = () => {
        this.setState({
            managerRoleVisible: false,
            currentRoleListKey: '',
        });
    };

    changeEnableStatus = (checked, systemRoleInfo) => {
        const {
            roleList: { formalRoleTagList, systemRoleTagList },
        } = this.props;
        const { currentRoleListKey } = this.state;
        let systemRoleTag = systemRoleInfo.tag;
        let isIncludes = (
            currentRoleListKey === 'formalRoleTagList' ? formalRoleTagList : systemRoleTagList
        )
            .map((item) => item.tag)
            .includes(systemRoleTag);
        if (checked) {
            if (isIncludes) {
                this.editRole(systemRoleInfo, true);
            } else {
                this.createRole(_, systemRoleInfo);
            }
        } else {
            this.editRole(systemRoleInfo, false);
        }
    };

    handleSave = (row) => {
        const { dispatch, roleSemester, roleSchoolId } = this.props;
        const { currentRoleListKey } = this.state;
        const { enName, scope, baseTagId, tag } = row.systemRoleInfo;
        let roleType = currentRoleListKey === 'formalRoleTagList' ? 1 : 0;
        dispatch({
            type: 'teacher/editRole',
            payload: {
                enName,
                scope,
                tag,
                roleType,
                name: row.name,
                schoolId: roleSchoolId,
                schoolYearId: roleSemester,
                desc: baseTagId,
            },
        }).then(() => {
            this.getRoleList();
            this.getSystemBuiltRole();
        });
    };

    render() {
        const {
            roleList,
            roleList: { formalRoleTagList, systemRoleTagList },
            systemBuiltRole,
            form: { getFieldDecorator },
        } = this.props;
        const { createRoleVisible, managerRoleVisible, currentRoleListKey } = this.state;
        const {tag} = this.props;
        const editComponents = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div className={styles.roleList}>
                {Object.keys(roleList).map((roleListKey, index) => (
                    <div>
                        <div className={styles.roleHead}>
                            <TeamOutlined className={styles.roleIcon} />
                            <span className={styles.roleHeadName}>
                                {roleListKey === 'formalRoleTagList'
                                    ? trans('role.officialRoles', '正式角色')
                                    : trans('role.systemRoles', '系统角色')}
                            </span>
                            <span
                                className={styles.roleAdd}
                                onClick={() => this.showManagerRoleModal(roleListKey)}
                            >
                                <Icon type="setting" style={{ marginRight: '5px' }} />
                                <span>{trans('role.configRole', '角色管理')}</span>
                            </span>
                        </div>
                        <div className={styles.roleItemList}>
                            {(roleListKey === 'formalRoleTagList'
                                ? formalRoleTagList
                                : systemRoleTagList
                            )
                                .filter((roleItem) => roleItem.isUse)
                                .map((roleItem) => (
                                    <div
                                        className={
                                            styles.roleItem +
                                            ' ' +
                                            (tag === roleItem.tag ? styles.roleItemSelect : '')
                                        }
                                        onClick={(e) => this.roleItemClick(e, roleItem)}
                                    >
                                        {locale() !== 'en'
                                            ? roleItem.roleName
                                            : roleItem.roleEnName}
                                        （{roleItem.tagCount}）
                                    </div>
                                ))}
                        </div>

                        {currentRoleListKey === roleListKey && (
                            <Modal
                                visible={managerRoleVisible}
                                title={trans('role.configRole', '角色管理')}
                                onCancel={this.hideManagerRoleModal}
                                destroyOnClose
                                footer={null}
                                wrapClassName={styles.managerRoleModal}
                                zIndex={900}
                            >
                                <PlusOutlined
                                    className={styles.plus}
                                    onClick={() => this.toggleCreateRoleVisible(true)}
                                />
                                <Table
                                    components={editComponents}
                                    dataSource={systemBuiltRole.map((systemRoleInfo) => ({
                                        systemRoleInfo,
                                        roleSourceName: systemRoleInfo.sourceName,
                                        enableStatus: (roleListKey === 'formalRoleTagList'
                                            ? formalRoleTagList
                                            : systemRoleTagList
                                        )
                                            .filter((item) => item.isUse)
                                            .map((item) => item.tag)
                                            .includes(systemRoleInfo.tag),
                                        name: systemRoleInfo.name,
                                    }))}
                                    columns={columns}
                                    rowClassName={() => 'editable-row'}
                                ></Table>
                                <Modal
                                    visible={createRoleVisible}
                                    title={trans('role.addNewRole', '添加新角色')}
                                    onCancel={() => this.toggleCreateRoleVisible(false)}
                                    onOk={this.createRole}
                                    destroyOnClose
                                    zIndex={1100}
                                    width={630}
                                    wrapClassName={styles.insertRoleModal}
                                >
                                    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 15 }}>
                                        <Form.Item label="角色名称">
                                            {getFieldDecorator('name')(<Input />)}
                                        </Form.Item>

                                        <Form.Item label={trans('charge.enName', '英文名称')}>
                                            {getFieldDecorator('enName')(<Input />)}
                                        </Form.Item>
                                        <Form.Item label="管辖范围" wrapperCol={21}>
                                            {getFieldDecorator('scope')(
                                                <Radio.Group>
                                                    <Radio value={1}>学部</Radio>
                                                    <Radio value={2}>年级</Radio>
                                                    <Radio value={3}>行政班</Radio>
                                                    <Radio value={4}>学科+年级</Radio>
                                                    <Radio value={5}>学科+学段</Radio>
                                                    <Radio value={6}>学段</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </Modal>
                        )}
                    </div>
                ))}
            </div>
        );
    }
}
