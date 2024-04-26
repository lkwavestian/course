import React, { PureComponent } from 'react';
import {
    Tabs,
    Select,
    Input,
    Button,
    Icon,
    Modal,
    Upload,
    Form,
    Spin,
    message,
    Checkbox,
} from 'antd';
import styles from './rules.less';
import { connect } from 'dva';
import { isArray, isEmpty, unionBy } from 'lodash';
import { trans } from '../../../../../utils/i18n';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
@connect((state) => ({
    gradeList: state.time.gradeList,
    compareGroupList: state.rules.compareGroupList,
    newClassGroupList: state.rules.newClassGroupList,
    currentLang: state.global.currentLang,
}))
export default class classBind extends PureComponent {
    state = {
        importModalVisible: false,
        fileList: [],
        gradeIdList: [],
        groupIdList: [],
        loading: false,
        studentGroupList: [],
        batchDeleteStatus: false,
        selectedGroupIdList: [],
        deleteModalVisible: false,
    };

    componentDidMount() {
        const { currentVersion } = this.props;
        if (currentVersion) {
            this.getCompareGroupList();
            this.getNewStudentGroupList();
        }
    }

    getCompareGroupList = () => {
        const { dispatch, semesterValue } = this.props;
        const { gradeIdList, groupIdList } = this.state;
        this.setState(
            {
                loading: true,
            },
            () => {
                dispatch({
                    type: 'rules/getCompareGroupList',
                    payload: {
                        gradeIdList,
                        groupIdList,
                        semesterId: semesterValue,
                    },
                }).then(() => {
                    this.setState({
                        loading: false,
                    });
                });
            }
        );
    };

    getNewStudentGroupList = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/newClassGroupList',
            payload: {
                versionId: currentVersion,
            },
        }).then(() => {
            this.setState({
                studentGroupList: this.getStudentGroupByGrade(),
            });
        });
    };

    importRules = () => {
        this.setState({
            importModalVisible: true,
        });
    };

    modalCancelClick = () => {
        this.setState({
            importModalVisible: false,
            fileList: [],
        });
    };

    submitImport = () => {
        const { dispatch, semesterValue } = this.props;
        const { fileList } = this.state;

        if (!isEmpty(fileList)) {
            let formData = new FormData();
            for (let item of fileList) {
                formData.append('file', item);
            }
            formData.append('semesterId', semesterValue);
            dispatch({
                type: 'rules/compareGroupGroupingExcelImport',
                payload: formData,
                onSuccess: () => {
                    message.success('导入成功');
                    this.getCompareGroupList();
                    this.modalCancelClick();
                },
                onError: (errorList, response) => {
                    if (isArray(errorList)) {
                        errorList.map((item) => message.error(item.errorMessage));
                    } else {
                        message.error(response.message);
                    }
                },
            });
        } else {
            message.error('请选择导入文件');
        }
    };

    getStudentGroupByGrade = (gradeIdList) => {
        let res = [];
        const { newClassGroupList } = this.props;
        newClassGroupList.map((item) => {
            item.gradeStudentGroupModels.map((groupModel) => {
                if (!isEmpty(gradeIdList)) {
                    if (gradeIdList.includes(groupModel.gradeId)) {
                        res.push(...groupModel.studentGroupList);
                    }
                } else {
                    res.push(...groupModel.studentGroupList);
                }
            });
        });

        //针对求知专线等分层班去重
        return unionBy(res, 'id');
    };

    gradeIdListChange = (value) => {
        console.log('value :>> ', value);
        this.setState(
            {
                gradeIdList: value,
            },
            () => {
                this.getCompareGroupList();
                this.setState({
                    studentGroupList: this.getStudentGroupByGrade(value),
                });
            }
        );
    };

    groupIdListChange = (value) => {
        this.setState(
            {
                groupIdList: value ? [value] : [],
            },
            () => {
                this.getCompareGroupList();
            }
        );
    };

    batchDelete = () => {
        this.setState({
            batchDeleteStatus: true,
        });
    };

    cancelDelete = () => {
        this.setState({
            batchDeleteStatus: false,
            selectedGroupIdList: [],
        });
    };

    studentGroupClick = (id) => {
        const { selectedGroupIdList, batchDeleteStatus } = this.state;
        let selectedGroupIdListCopy = [...selectedGroupIdList];
        let targetIdIndex = selectedGroupIdListCopy.findIndex((item) => item === id);
        if (targetIdIndex !== -1) {
            selectedGroupIdListCopy.splice(targetIdIndex, 1);
        } else {
            selectedGroupIdListCopy.push(id);
        }
        this.setState({
            selectedGroupIdList: selectedGroupIdListCopy,
        });
    };

    deleteAll = (e) => {
        const { compareGroupList } = this.props;
        if (e.target.checked) {
            this.setState({
                selectedGroupIdList: compareGroupList.map((item) => item.id),
            });
        } else {
            this.setState({
                selectedGroupIdList: [],
            });
        }
    };

    confirmDelete = () => {
        const { dispatch } = this.props;
        const { selectedGroupIdList } = this.state;
        this.setState({
            deleteModalVisible: false,
        });
        dispatch({
            type: 'rules/deleteCompareGroupGrouping',
            payload: {
                groupingIds: selectedGroupIdList.join(','),
            },
            onSuccess: () => {
                message.success('删除成功');
                this.getCompareGroupList();
                this.setState({
                    selectedGroupIdList: [],
                    batchDeleteStatus: false,
                });
            },
        });
    };

    changeDeleteModalVisible = (value) => {
        this.setState({
            deleteModalVisible: value,
        });
    };

    deleteIconClick = (e, id) => {
        e.stopPropagation();
        const { selectedGroupIdList } = this.state;
        let selectedGroupIdListCopy = [...selectedGroupIdList];
        let targetIdIndex = selectedGroupIdListCopy.findIndex((item) => item === id);
        if (targetIdIndex === -1) {
            selectedGroupIdListCopy.push(id);
        }
        this.setState({
            selectedGroupIdList: selectedGroupIdListCopy,
        });
        this.changeDeleteModalVisible(true);
    };

    exportRules = () => {
        const { dispatch, semesterValue } = this.props;
        const { gradeIdList } = this.state;
        window.open(
            `/api/stratify/exportCompareGroupGrouping?gradeIdString=${gradeIdList.join()}&semesterId=${semesterValue}`
        );
    };

    render() {
        const { gradeList, compareGroupList, currentLang } = this.props;
        const {
            importModalVisible,
            fileList,
            loading,
            studentGroupList,
            gradeIdList,
            groupIdList,
            batchDeleteStatus,
            selectedGroupIdList,
            deleteModalVisible,
        } = this.state;

        const uploadProps = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState((state) => ({
                    fileList: [file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <Spin spinning={loading}>
                <Tabs tabPosition="top" defaultActiveKey="globalRules">
                    <TabPane tab={trans('global.globalRules', '全局规则')} key="globalRules">
                        <div className={styles.classBind}>
                            <div className={styles.topText}>
                                {currentLang != 'en'
                                    ? `规则说明：班级绑定适用于分层走班排课，同一条绑定规则内不同分组的班级视为学生存在交集，排课时会错开，避免学生上课时间冲突，此规则按学期全局生效。\n
                                    设置示例：
                                          如果想将八年级1班、2班学生英语和理科进行分层，每个分层有3个班，设置方法如下：
                                          来源班级：八年级1班、八年级2班
                                          英语分层：八A英1、八A英2、八A英3
                                          理科分层：八A理1、八A理2、八A理3
                                          `
                                    : ` Rule Description: Class binding is applicable to hierarchical class scheduling. Classes in different groups within the same binding rule are considered to have intersections among students, and system scheduling will avoid conflicts among different groups. This rule takes effect globally by semester. 
                                    Setting example:  
                                        &nbsp;If you want to divide students in Class G8C1 and G8C2 into three different groups for each English and Science, the setting method is as follows:
                                        Source class: G8C1，G8C2
                                        English groups: G8 English A, G8 English B，G8 English C
                                        Science groups: G8 Science A, G8 Science B，G8 Science C`}
                            </div>
                            <div className={styles.globalRulesHeader}>
                                {batchDeleteStatus ? (
                                    <div className={styles.deleteHeader}>
                                        <div className={styles.leftSide}>
                                            <Checkbox
                                                onClick={this.deleteAll}
                                                checked={
                                                    selectedGroupIdList.length !== 0 &&
                                                    selectedGroupIdList.length ===
                                                        compareGroupList.map((item) => item.id)
                                                            .length
                                                }
                                            >
                                                全选
                                            </Checkbox>
                                        </div>
                                        <div className={styles.rightSide}>
                                            <span
                                                onClick={this.cancelDelete}
                                                className={styles.cancelDelete}
                                            >
                                                取消
                                            </span>
                                            <Button
                                                type="primary"
                                                onClick={() => this.changeDeleteModalVisible(true)}
                                            >
                                                确认删除
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.selectHeader}>
                                        <Select
                                            mode="multiple"
                                            style={{ width: 120 }}
                                            showArrow={true}
                                            placeholder={trans('global.selectGrade', '选择年级')}
                                            onChange={this.gradeIdListChange}
                                            value={gradeIdList}
                                            allowClear={true}
                                            maxTagCount={1}
                                        >
                                            {gradeList &&
                                                gradeList.map((item, index) => {
                                                    return (
                                                        <Option key={item.id} value={item.id}>
                                                            {item.orgName}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Select
                                            style={{ width: 120 }}
                                            showArrow={true}
                                            placeholder={trans('global.selectClass', '选择班级')}
                                            value={groupIdList}
                                            allowClear={true}
                                            onChange={this.groupIdListChange}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {studentGroupList &&
                                                studentGroupList.map((item, index) => {
                                                    return (
                                                        <Option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Button type="primary" onClick={this.batchDelete}>
                                            {trans('global.batchDelete', '批量删除')}
                                        </Button>
                                        <Button type="primary" onClick={this.importRules}>
                                            {trans('global.ruleImport', '导入')}
                                        </Button>
                                        <Button type="primary" onClick={this.exportRules}>
                                            导出
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className={styles.contentWrapper}>
                                {compareGroupList.map((item) => {
                                    return (
                                        <div
                                            className={styles.roleItem}
                                            key={item.id}
                                            onClick={() => this.studentGroupClick(item.id)}
                                            style={{
                                                borderColor: selectedGroupIdList.includes(item.id)
                                                    ? '#3B6FF5'
                                                    : 'rgba(1, 17, 61, 0.1)',
                                            }}
                                        >
                                            <div className={styles.roleItemHeader}>
                                                <div className={styles.studentGroupName}>
                                                    {item.adminGroupingName}
                                                </div>
                                                {!batchDeleteStatus && (
                                                    <div className={styles.btnList}>
                                                        {/* <Icon type="form" /> */}
                                                        <Icon
                                                            type="delete"
                                                            onClick={(e) =>
                                                                this.deleteIconClick(e, item.id)
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.layerList}>
                                                <div className={styles.layerItem}>
                                                    <div className={styles.leftPart}>
                                                        来源班级：
                                                    </div>
                                                    <div className={styles.rightPart}>
                                                        {item.adminGroupList
                                                            .map((item) => item.name)
                                                            .join('、')}
                                                    </div>
                                                </div>
                                                {item.compareGroupingJsonDTOList.map(
                                                    (groupItem) => (
                                                        <div className={styles.layerItem}>
                                                            <div className={styles.leftPart}>
                                                                {groupItem.groupingName}：
                                                            </div>
                                                            <div className={styles.rightPart}>
                                                                {groupItem.compareGroupList
                                                                    .map((item) => item.name)
                                                                    .join('、')}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
                {importModalVisible && (
                    <Modal
                        visible={importModalVisible}
                        width={375}
                        wrapClassName={styles.importModalWrapper}
                        title="导入班级绑定"
                        footer={[
                            <Button
                                key="cancel"
                                type="cancel"
                                onClick={this.modalCancelClick}
                                className={styles.cancelBtn}
                            >
                                取消
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                className={styles.submitBtn}
                                onClick={this.submitImport}
                            >
                                确定导入
                            </Button>,
                        ]}
                        onCancel={this.modalCancelClick}
                    >
                        <div className={styles.importModal}>
                            <div className={styles.modalItem}>
                                <div>①下载模版</div>
                                <a
                                    className={styles.uploadBtn}
                                    href="/api/stratify/compareGroupGroupingExcelDownload"
                                    target="_blank"
                                >
                                    下载模板
                                </a>
                            </div>
                            <div className={styles.modalItem}>
                                <div>②上传填写后的信息表</div>
                                <Form
                                    id="uploadForm"
                                    layout="inline"
                                    method="post"
                                    className={styles.form}
                                    encType="multipart/form-data"
                                >
                                    <Upload {...uploadProps} maxCount={1}>
                                        <span className={styles.uploadBtn}>上传文件</span>
                                    </Upload>
                                </Form>
                            </div>
                        </div>
                    </Modal>
                )}
                {deleteModalVisible && (
                    <Modal
                        visible={deleteModalVisible}
                        width={400}
                        wrapClassName={styles.deleteModalWrapper}
                        footer={[
                            <Button
                                key="cancel"
                                type="cancel"
                                onClick={() => this.changeDeleteModalVisible(false)}
                                className={styles.cancelBtn}
                            >
                                取消
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                className={styles.submitBtn}
                                onClick={this.confirmDelete}
                            >
                                确定删除
                            </Button>,
                        ]}
                        closable={false}
                    >
                        <p>您确定要删除所选规则吗？</p>
                    </Modal>
                )}
            </Spin>
        );
    }
}
