import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Modal, Input, Button, Icon, Spin, Checkbox } from 'antd';
import { trans } from '../../../../../utils/i18n';
import { locale } from 'moment';
import { isEmpty } from 'lodash';
import ConfigPoint from './ConfigPoint/index';
import EditDataPoint from './EditDataPoint';
import { formatterTime } from '../../../../../utils/utils';

@connect((state) => ({
    rolePermissionobj: state.global.rolePermissionobj,
    roleTagInfo: state.teacher.roleTagInfo,
    roleSchoolId: state.teacher.roleSchoolId,
    eduId: state.teacher.eduId,
    tableList: state.teacher.tableList,
    permissDetail: state.teacher.permissDetail,
    selectedIdx: state.teacher.selectedIdx,
    insertMsg: state.teacher.insertMsg,
    currentUser: state.global.currentUser, //当前用户信息
    tag: state.teacher.tag,
}))
export default class RoleTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            permissDetail: [],
            selectedIdx: undefined,
            modal2Visible: false,
            batchVisible: false,
            indeterminate: false,
            checkAll: false,
            permissionObj: {},
            loading: false,
        };
    }

    componentDidMount() {
        const { rolePermissionobj } = this.props;
        if (
            !isEmpty(rolePermissionobj) &&
            !isEmpty(rolePermissionobj.appPermissionList) &&
            !isEmpty(rolePermissionobj.appPermissionList[0].permissionDetailModels)
        ) {
            this.props.dispatch({
                type: 'teacher/setPermissiomList',
                payload: rolePermissionobj.appPermissionList[0].permissionDetailModels,
            });
            let flag = false;
            rolePermissionobj &&
                !isEmpty(rolePermissionobj.appPermissionList[0]) &&
                !isEmpty(rolePermissionobj.appPermissionList[0].permissionDetailModels) &&
                rolePermissionobj.appPermissionList[0].permissionDetailModels.map((item) => {
                    if (item.selected == false) {
                        flag = false;
                    }
                });
            this.setState({
                indeterminate: flag,
                // permissDetail: rolePermissionobj.appPermissionList[0].permissionDetailModels,
            });
        }
    }

    getRolePermission = () => {
        const { roleTagInfo, dispatch, currentUser, selectedIdx } = this.props;
        
        dispatch({
            type: 'global/listRolePermission',
            payload: {
                eduGroupCompanyId: currentUser.eduGroupcompanyId,
                schoolId: currentUser.schoolId,
                tag: roleTagInfo.tag,
            },
        }).then(() => {
            const { rolePermissionobj } = this.props;
            this.setState({
                loading: false,
            });
            if (
                !isEmpty(rolePermissionobj) &&
                !isEmpty(rolePermissionobj.appPermissionList) &&
                !isEmpty(rolePermissionobj.appPermissionList[0].permissionDetailModels)
            ) {
                this.props.dispatch({
                    type: 'teacher/setPermissiomList',
                    payload: rolePermissionobj.appPermissionList[selectedIdx].permissionDetailModels,
                });
            }
        });

        // this.props.dispatch({
        //     type: 'teacher/setPermissiomIndex',
        //     payload: 0,
        // });
    };

    showDetail = (index) => {
        const { rolePermissionobj } = this.props;
        this.props.dispatch({
            type: 'teacher/setPermissiomList',
            payload: rolePermissionobj.appPermissionList[index].permissionDetailModels,
        });
        // this.setState({
        //     permissDetail: rolePermissionobj.appPermissionList[index].permissionDetailModels,
        // });
        this.props.dispatch({
            type: 'teacher/setPermissiomIndex',
            payload: index,
        });
        let flag = true;
        rolePermissionobj &&
            !isEmpty(rolePermissionobj.appPermissionList[index]) &&
            !isEmpty(rolePermissionobj.appPermissionList[index].permissionDetailModels) &&
            rolePermissionobj.appPermissionList[index].permissionDetailModels.map((item) => {
                if (item.selected == false) {
                    flag = false;
                }
            });
        this.setState({
            indeterminate: flag,
            checkAll: false,
        });
    };

    // 单个设置
    setPermission = (obj) => {
        this.setState({
            modal2Visible: true,
            permissionObj: obj,
        });
    };

    handlePointVisible = (e) => {
        if (e) {
            this.props.dispatch({
                type: 'teacher/setPermissiomIndex',
                payload: 0,
            });
            this.setState(
                {
                    modal2Visible: false,
                },
                () => {
                    this.getRolePermission();
                }
            );
        }
    };

    handlePointCancel = () => {
        this.setState({
            modal2Visible: false,
        });
    };

    // 批量设置
    batchSet = () => {
        this.setState({
            batchVisible: true,
        });
    };

    handleBatchCancel = () => {
        this.setState({
            batchVisible: false,
        });
    };

    handleBatchCancelModal = (e) => {
        this.setState({
            batchVisible: false,
        });
        if (e) {
            this.getRolePermission();
        }
    };

    //单个选中/取消
    changeSingle = (e, index, obj) => {
        const { currentUser, rolePermissionobj } = this.props;
        let tempRoleId = null;

        this.setState({
            loading: true,
        });

        rolePermissionobj &&
            !isEmpty(rolePermissionobj.appPermissionList) &&
            rolePermissionobj.appPermissionList.map((item) => {
                item.permissionDetailModels &&
                    !isEmpty(item.permissionDetailModels) &&
                    item.permissionDetailModels.map((el) => {
                        if (el.packageId) {
                            return (tempRoleId = el.packageId);
                        }
                    });
            });

        let tempData = JSON.parse(JSON.stringify(this.props.permissDetail));

        tempData[index].selected = e.target.checked;
        let flag = 0;
        tempData && tempData.length > 0
            ? tempData.map((item) => {
                  if (item.selected) {
                      flag += 1;
                  } else {
                      flag -= 1;
                  }
              })
            : null;

        this.setState({
            checkAll: flag == tempData.length,
            indeterminate: flag == tempData.length,
        });

        if (e.target.checked) {
            this.props
                .dispatch({
                    type: 'teacher/insertSysRolePermission',
                    payload: {
                        sysRolePermissions: [
                            {
                                roleId: tempRoleId,
                                permissionId: obj.permissionId || '',
                            },
                        ],
                        type: tempRoleId ? 2 : 1,
                        accountIds: [1], // 随便传，后端校验无实际用处
                        eduGroupCompanyId: currentUser.eduGroupcompanyId,
                        schoolId: currentUser.schoolId,
                    },
                })
                .then(() => {
                    const { insertMsg } = this.props;

                    if (tempRoleId) {
                        this.getRolePermission();
                    } else {
                        this.props
                            .dispatch({
                                type: 'teacher/batchAccountPackage',
                                payload: {
                                    tagList: [this.props.tag], // 左侧选中的角色tag
                                    roleAndEffectiveTimes: [
                                        {
                                            roleId: insertMsg?.roleId || '',
                                            effectiveTime: formatterTime(new Date()),
                                            effectiveType: 1,
                                        },
                                    ], // 有效期
                                    type: 1, // 1给角色授权
                                    eduGroupCompanyId: currentUser.eduGroupcompanyId,
                                    schoolId: currentUser.schoolId,
                                },
                            })
                            .then(() => {
                                this.getRolePermission();
                            });
                    }
                });
        } else if (!e.target.checked) {
            this.props
                .dispatch({
                    type: 'teacher/delRolePermissionRelations',
                    payload: [
                        {
                            permissionId: obj.permissionId || '',
                            roleId: obj.packageId || '',
                        },
                    ],
                })
                .then(() => {
                    this.getRolePermission();
                });
        }
    };

    onCheckAllChange = (e) => {
        const { rolePermissionobj, currentUser } = this.props;

        this.setState({
            indeterminate: false,
            checkAll: e.target.checked,
            loading: true,
        });

        let tempData = JSON.parse(JSON.stringify(this.props.permissDetail));
        let tempRoleId = null;
        rolePermissionobj &&
            !isEmpty(rolePermissionobj.appPermissionList) &&
            rolePermissionobj.appPermissionList.map((item) => {
                item.permissionDetailModels &&
                    !isEmpty(item.permissionDetailModels) &&
                    item.permissionDetailModels.map((el) => {
                        if (el.packageId) {
                            return (tempRoleId = el.packageId);
                        }
                    });
            });

        if (e.target.checked) {
            tempData && tempData.length > 0
                ? tempData.forEach((item) => {
                      item.selected = true;
                  })
                : null;

            let tempSysRolePerList = [];
            !isEmpty(tempData) &&
                tempData.map((item, index) => {
                    tempSysRolePerList.push({
                        roleId: tempRoleId,
                        permissionId: item.permissionId || '',
                    });
                });

            this.props
                .dispatch({
                    type: 'teacher/insertSysRolePermission',
                    payload: {
                        sysRolePermissions: tempSysRolePerList,
                        type: tempRoleId ? 2 : 1,
                        accountIds: [1], // 随便传，后端校验无实际用处
                        eduGroupCompanyId: currentUser.eduGroupcompanyId,
                        schoolId: currentUser.schoolId,
                    },
                })
                .then(() => {
                    const { insertMsg } = this.props;
                    if (tempRoleId) {
                        this.getRolePermission();
                    } else {
                        this.props
                            .dispatch({
                                type: 'teacher/batchAccountPackage',
                                payload: {
                                    tagList: [this.props.tag], // 左侧选中的角色tag
                                    roleAndEffectiveTimes: [
                                        {
                                            roleId: insertMsg?.roleId || '',
                                            effectiveTime: formatterTime(new Date()),
                                            effectiveType: 1,
                                        },
                                    ], // 有效期
                                    type: 1, // 1给角色授权
                                    eduGroupCompanyId: currentUser.eduGroupcompanyId,
                                    schoolId: currentUser.schoolId,
                                },
                            })
                            .then(() => {
                                this.getRolePermission();
                            });
                    }
                });
        } else {
            tempData && tempData.length > 0
                ? tempData.forEach((item) => {
                      item.selected = false;
                  })
                : null;

            let tempList = [];
            !isEmpty(tempData) &&
                tempData.map((item) => {
                    tempList.push({
                        permissionId: item.permissionId || '',
                        roleId: item.packageId || '',
                    });
                });
            this.props
                .dispatch({
                    type: 'teacher/delRolePermissionRelations',
                    payload: tempList,
                })
                .then(() => {
                    this.getRolePermission();
                });
        }
    };

    render() {
        const { rolePermissionobj } = this.props;
        const { modal2Visible/* , permissDetail */ } = this.state;
        const { permissDetail, selectedIdx } = this.props;
        console.log('selectedIdx: ', selectedIdx);
        let permissionObjList = [];
        !isEmpty(permissDetail) &&
            permissDetail.map((item, index) => {
                if (item.selected) {
                    if (item.type == 3 || item.type == 2) {
                        return permissionObjList.push(item);
                    }
                }
            });

        return (
            <div className={styles.main}>
                <div className={styles.left}>
                    <div className={styles.totolStyle}>
                        <span style={{ margin: '0 130px 15px 20px' }}>全部已授权权限点</span>
                        <span style={{ color: 'blue' }}>{rolePermissionobj.allCount || 0}</span>
                    </div>
                    {rolePermissionobj &&
                        !isEmpty(rolePermissionobj.appPermissionList) &&
                        rolePermissionobj.appPermissionList.map((item, index) => {
                            return (
                                <div
                                    onClick={() => this.showDetail(index)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        margin: '12px 17px',
                                        padding: '12px 10px',
                                        borderRadius: 5,
                                    }}
                                    className={selectedIdx == index ? styles.selectedStyle : null}
                                >
                                    <span
                                        style={{ display: 'inline-block' }}
                                        className={
                                            selectedIdx == index ? styles.selNameStyle : null
                                        }
                                    >
                                        {locale() != 'en' ? item.appCodeName : item.appCodeEnName}
                                    </span>
                                    <span>
                                        <span style={item.chooseCount > 0 ? { color: 'blue' } : {}}>
                                            {item.chooseCount}
                                        </span>

                                        {`/${item.total}`}
                                    </span>
                                </div>
                            );
                        })}
                </div>
                <div className={styles.right}>
                    <Spin spinning={this.state.loading}>
                        <div className={styles.topStyle}>
                            <Checkbox
                                style={{ marginLeft: 15 }}
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                                全选
                            </Checkbox>
                            <span
                                style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={this.batchSet}
                            >
                                批量设置权限范围
                            </span>
                        </div>
                        <div className={styles.detailStyle}>
                            {!isEmpty(permissDetail)
                                ? !isEmpty(permissDetail) &&
                                  permissDetail.map((el, idx) => {
                                      return (
                                          <div style={{ margin: 12 }}>
                                              <Checkbox
                                                  checked={el.selected}
                                                  style={{ marginRight: 8 }}
                                                  onChange={(e) => this.changeSingle(e, idx, el)}
                                              />
                                              <span>
                                                  {locale() != 'en'
                                                      ? el.permissionName
                                                      : el.permissionEnName}
                                              </span>
                                              {el.type == 3 && (
                                                  <>
                                                      <span style={{ marginLeft: 32 }}>
                                                          {!isEmpty(el.ruleAndParameterModels) ? (
                                                              <span>
                                                                  权限范围：
                                                                  {el.ruleAndParameterModels.map(
                                                                      (item) => {
                                                                          return (
                                                                              <span>{`${item.ruleName} `}</span>
                                                                          );
                                                                      }
                                                                  )}
                                                              </span>
                                                          ) : (
                                                              <span style={{ color: 'red' }}>
                                                                  权限范围：未设置
                                                              </span>
                                                          )}
                                                      </span>
                                                      <span
                                                          style={{
                                                              color: 'blue',
                                                              cursor: 'pointer',
                                                              marginLeft: 10,
                                                          }}
                                                          onClick={() => this.setPermission(el)}
                                                      >
                                                          设置
                                                      </span>
                                                  </>
                                              )}
                                          </div>
                                      );
                                  })
                                : null}
                        </div>
                    </Spin>
                </div>
                {/* 单个设置 */}
                <Modal
                    visible={this.state.modal2Visible}
                    onCancel={this.handlePointCancel}
                    footer={null}
                    width="750px"
                    className={styles.modalContent}
                    destroyOnClose={true}
                    closable={false}
                >
                    <ConfigPoint
                        visible={this.handlePointVisible}
                        onCancel={this.handlePointCancel}
                        permissionObj={this.state.permissionObj}
                    />
                </Modal>
                {/* 批量设置Modal */}
                <Modal
                    visible={this.state.batchVisible}
                    onCancel={this.handleBatchCancel}
                    footer={null}
                    width="750px"
                    className={styles.modalContent}
                    destroyOnClose={true}
                    closable={false}
                >
                    <EditDataPoint
                        visible={this.handleBatchCancelModal}
                        onCancel={this.handleBatchCancel}
                        permissionObjList={permissionObjList}
                    />
                </Modal>
            </div>
        );
    }
}
