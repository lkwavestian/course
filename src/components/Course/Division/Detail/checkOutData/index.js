import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import {
    Form,
    Radio,
    Icon,
    Dropdown,
    Button,
    Menu,
    Select,
    Modal,
    message,
    Table,
    Spin,
    Upload,
    Input,
    Tooltip,
} from 'antd';
import Student from './Student/index';
import Combination from './Combination/index';
import Average from './Average/index';
import Programme from './Programme/index';
import ShowPos from './ShowScore/index';
import qc from '../../../../../../src/assets/qc.png';
import { trans } from '../../../../../utils/i18n';
import lodash from 'lodash';

const { Option } = Select;
@Form.create()
@connect((state) => ({
    divisionRes: state.devision.divisionRes,
    toAdmin: state.devision.toAdmin,
    toLayer: state.devision.toLayer,
    allCLasses: state.devision.allCLasses,
    allCOurses: state.devision.allCOurses,
    importStudentResultExcel: state.devision.importStudentResultExcel,
    studentCombinationImport: state.devision.studentCombinationImport,
    importStudentResultList: state.devision.importStudentResultList,
    studentInfo: state.devision.studentInfo,
    choiceSelectList: state.devision.choiceSelectList,
    studentConfirm: state.devision.studentConfirm,
    importStudentClassSettingExcel: state.devision.importStudentClassSettingExcel,
    checkDivideResultClass: state.devision.checkDivideResultClass,
}))
export default class CheckOutData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            radioValue: 'a',
            toAdminVisible: false,
            toCourseVisible: false,
            stuIdLength: 0,
            newOrOld: 1,
            newOrNot: 1,
            combinationList: [],
            allClass: [],
            allCourses: [],
            loadingStu: false,
            newClass: undefined,
            isChange: false,
            filteredInfo: null,
            sortedInfo: null,
            importModalVisible: false,
            isUploading: false,
            fileList: [],
            sureImport: false,
            loading: false,
            displayValue: 1,
            resultTypeValue: 1,
            CombinationStyle: 1,
            changeWalkingClassCount: '',
            refSelectedRowsList: [],
            choiceValue: '',
            courseChooseDetailModelList: [],
            importClassSettingVisible: false,
            distributeValue: 0,
            isShowLoading: false,
        };
        this.ref = null;
        this.proRef = null;
    }

    componentDidMount() {
        // this.getDivResult();
        // this.ref.state.selectedRowsList;
        // console.log('this.ref.', this.ref.props);
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'devision/choiceSelectList',
        //     payload: {
        //         divideGroupId: this.props.id,
        //     },
        //     onSuccess: (res) => {
        //         console.log(res, '>>>>>>158');
        //     },
        // });
    }

    changeRadio = (e) => {
        const { dispatch } = this.props;
        this.setState({
            radioValue: e.target.value,
        });
        if (e.target.value === 'd') {
            dispatch({
                type: 'devision/checkDivideResultClass',
                payload: {
                    dividePlanId: this.props.id,
                },
            });
        }
    };

    getDivResult = () => {
        const { dispatch } = this.props;
        this.setState({
            loadingStu: true,
        });
        dispatch({
            type: 'devision/getDivResult',
            payload: {
                divideGroupId: 12,
            },
        }).then(() => {
            const { divisionRes } = this.props;
            let newArr = [];
            divisionRes.studentList.forEach((item, index) => {
                newArr.push(item.combination);
            });
            newArr = lodash.uniq(newArr);
            let combinationArr = [];
            newArr.forEach((item, index) => {
                combinationArr.push({ text: item, value: item });
            });

            this.setState({
                stuList: divisionRes.studentList,
                combinationList: combinationArr,
                loadingStu: false,
            });
        });
    };

    handleTableChange = (pagination, filters, sorter, extra) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    };
    division = () => {
        this.ref && this.ref.systemShift();
    };
    refresh = () => {
        this.proRef && this.proRef.getClassProgram();
    };
    onRef = (ref) => {
        this.ref = ref;
    };
    onProRef = (ref) => {
        this.proRef = ref;
    };
    changeType = (key) => {
        // console.log('selectedRowsList;', this.ref.state.selectedRowsList, this.ref.state.stuId);
        const { studentInfo } = this.props;
        if (
            this.ref.state.stuId &&
            this.ref.state.stuId.length == 0
            //  &&
            // this.ref.state.refSelectedRowsList.length == 0
        ) {
            message.warning('请至少选择一个学生以操作！');
            return;
        }
        // let studentInfoStuIdList = studentInfo.contentModels.map((item, index) => {
        //     return item.id;
        // });
        // if () {
        //     message.warning('请至少选择一个学生以操作！');
        //     return;
        // }
        if (this.state.radioValue == 'a') {
            // if (key.key == '1') {
            const { choiceSelectList, dispatch } = this.props;
            // const { dispatch } = this.props;
            let courseChooseDetailModelList = [];

            dispatch({
                type: 'devision/choiceSelectList',
                payload: {
                    dividePlanId: this.props.id,
                },
                /* onSuccess: (res) => {
                    console.log(res, '>>>>>>158');
                }, */
            }).then(() => {
                const { choiceSelectList } = this.props;
                choiceSelectList.map((item, index) => {
                    courseChooseDetailModelList.push({
                        groupId: -1,
                        courseName: item.courseName,
                    });
                });
                let firstPos = [];
                courseChooseDetailModelList.forEach((item, index) => {
                    if (item.courseName == '行政班') {
                        firstPos = courseChooseDetailModelList.splice(index, 1);
                    }
                });

                courseChooseDetailModelList.unshift(...firstPos);

                this.setState({
                    // refSelectedRowsList: this.ref.state.selectedRowsList,
                    refSelectedRowsList: this.ref.state.stuId,
                    stuIdLength: this.ref.state.stuId && this.ref.state.stuId.length,
                    courseChooseDetailModelList,
                    toCourseVisible: true,
                });
            });
            // }
        }
    };

    onChangeResult = (e) => {
        this.setState({
            resultTypeValue: e.target.value,
        });
    };
    onChangeStyle = (e) => {
        this.setState({
            CombinationStyle: e.target.value,
        });
    };

    layeredHandleOk = () => {
        const { dispatch } = this.props;
        const { courseChooseDetailModelList, refSelectedRowsList } = this.state;
        this.setState({
            isShowLoading: true,
        });
        dispatch({
            // type:'devision/adjustToLayered'
            type: 'devision/studentConfirm',
            payload: {
                // stuId: 1,
                dividePlanId: this.props.id,
                courseChooseDetailModelList,
                stuIdList: refSelectedRowsList,
            },
        }).then(() => {
            message.success('调整成功');
            this.setState({
                toCourseVisible: false,
                isShowLoading: false,
                refSelectedRowsList: [],
            });
            this.ref.divideResultStudentView();
            this.ref.state.selectedRowKeys = [];
        });
    };

    layeredHandleCancel = () => {
        this.setState({
            toCourseVisible: false,
        });
    };
    adminHandleOk = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/adjustToAdmin',
            payload: {
                stuId: this.ref.state.stuId,
                schoolId: this.props.id,
                toClassId: this.state.newClass,
            },
        });
        this.setState({
            toAdminVisible: false,
            newClass: undefined,
        });
    };

    adminHandleCancel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/adjustToLayered',
            payload: {
                stuId: this.ref.state.stuId,
                schoolId: this.props.id,
                toClassId: this.state.selectNewClass,
            },
        });
        this.setState({
            toAdminVisible: false,
            selectNewClass: null,
        });
    };

    onChangeClass = (e) => {
        this.setState({
            newOrOld: e.target.value,
        });
    };
    onChangeClassType = (e) => {
        this.setState({
            newOrNot: e.target.value,
        });
    };

    handleChangeClass = (value) => {
        this.setState({
            newClass: value,
        });
    };

    selectClass = (value) => {
        this.setState({
            selectNewGrade: value,
        });
    };

    handleChangeGrade = (value) => {
        this.setState({
            selectNewClass: value,
        });
    };

    getAllClass = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/getAllClass',
            payload: {
                schoolId: this.props.id,
            },
        }).then(() => {
            const { allCLasses } = this.props;
            this.setState({
                allClass: allCLasses,
            });
        });
    };
    getAllCourse = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/getAllCourse',
            payload: {
                schoolId: this.props.id,
            },
        }).then(() => {
            const { allCOurses } = this.props;
            this.setState({
                allCourses: allCOurses,
            });
        });
    };

    handleChange = (value, index) => {
        let courseChooseDetailModelList = JSON.parse(
            JSON.stringify(this.state.courseChooseDetailModelList)
        );

        courseChooseDetailModelList[index].groupId = value;
        this.setState({
            // choiceValue: key,
            // courseChooseDetailModelList:
            courseChooseDetailModelList,
        });
    };

    importClassSettingExcel = () => {
        this.setState({
            importClassSettingVisible: true,
        });
    };

    // 确定从Excel导入
    sureImportClassSetting = (e) => {
        const { fileList, radioValue } = this.state;
        let formData = new FormData();

        for (let item of fileList) {
            formData.append('file', item);
        }
        formData.append('dividePlanId', this.props.id);

        if (!lodash.isEmpty(fileList)) {
            const { dispatch } = this.props;
            const { radioValue } = this.state;
            this.setState({
                isUploading: true,
            });
            dispatch({
                type: 'devision/importStudentClassSettingExcel',
                payload: formData,
            }).then(() => {
                let importStudentClassSettingExcel = this.props.importStudentClassSettingExcel;
                this.setState({
                    fileList: [],
                    isUploading: false,
                });
                // debugger;
                if (!lodash.isEmpty(importStudentClassSettingExcel)) {
                    Modal.error({
                        content:
                            !lodash.isEmpty(importStudentClassSettingExcel) &&
                            importStudentClassSettingExcel.toString(),
                    });
                    this.setState({
                        fileList: [],
                        importClassSettingVisible: false,
                        successModalVisibility: true,
                    });
                } else {
                    // message.success(trans('global.scheduleImportSuccess', '导入成功'));
                    this.setState(
                        {
                            fileList: [],
                            importClassSettingVisible: false,
                            sureImportClassSetting: true,
                        },
                        () => {
                            this.proRef.getClassProgram();
                        }
                    );
                }
            });
        }
    };

    handleClassSettingCancel = () => {
        this.setState({
            importClassSettingVisible: false,
        });
    };

    getImportStudentResult = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/importStudentResultList',
            payload: {
                divideGroupId: id,
            },
        }).then(() => {
            const { importStudentResultList } = this.props;
            this.setState({
                gradeName: importStudentResultList.className,
                stuClass: importStudentResultList.studentList,
                loading: false,
            });
        });
        this.setState({
            loading: true,
        });
    };

    // 确定从Excel导入
    sureImport = (e) => {
        let { fileList, CombinationStyle, distributeValue, resultTypeValue, radioValue } =
            this.state;
        let formData = new FormData();

        for (let item of fileList) {
            formData.append('file', item);
        }
        formData.append('dividePlanId', this.props.id);
        // formData.append('importResultType', this.state.resultTypeValue);
        CombinationStyle == '1' ? null : formData.append('distributeValue', distributeValue); //分配方式 (1 按成绩均衡, 2按新行政班集中, 3按原行政班集中)
        // formData.append('CombinationStyle', CombinationStyle); //模板类型 (2 按组合导入, 1 按学生明细导入)
        CombinationStyle == '2' ? null : formData.append('resultTypeValue', resultTypeValue); //导入更新方式 (1覆盖更新, 2 只更新班级学生)

        if (!lodash.isEmpty(fileList)) {
            const { dispatch } = this.props;
            const { radioValue } = this.state;
            this.setState({
                isUploading: true,
            });
            dispatch({
                type:
                    CombinationStyle == 1
                        ? 'devision/importStudentResultExcel'
                        : 'devision/studentCombinationImport',
                payload: formData,
            }).then(() => {
                if (CombinationStyle == 2) {
                    let importStudentResultExcel = this.props.importStudentResultExcel;
                    this.setState({
                        fileList: [],
                        isUploading: false,
                    });
                    if (!lodash.isEmpty(importStudentResultExcel)) {
                        Modal.error({
                            content:
                                // (!lodash.isEmpty(importStudentExcel) &&
                                //     importStudentExcel.toString()) ||
                                !lodash.isEmpty(importStudentResultExcel) &&
                                importStudentResultExcel.toString(),
                            //     ||
                            // (!lodash.isEmpty(importStudentClassExcel) &&
                            //     importStudentClassExcel.toString()),
                        });
                        this.setState({
                            fileList: [],
                            importModalVisible: false,
                            successModalVisibility: true,
                            resultTypeValue: 1,
                            CombinationStyle: 1,
                            distributeValue: 0,
                        });
                    } else {
                        // message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        // this.getImportStudentResult();
                        // radioValue == 'a'
                        //     ? this.getImportStudentResult()
                        //     : radioValue == 'b'
                        //     ? this.getImportStudentResult()
                        //     : // this.ref.getImportStudentScore()
                        //       this.getImportStudentResult();
                        // this.ref.getImportStudentClass();
                        this.setState({
                            fileList: [],
                            importModalVisible: false,
                            sureImport: true,
                            resultTypeValue: 1,
                            CombinationStyle: 1,
                            distributeValue: 0,
                        });
                    }
                } else {
                    let studentCombinationImport = this.props.studentCombinationImport;
                    this.setState({
                        fileList: [],
                        isUploading: false,
                    });
                    if (!lodash.isEmpty(studentCombinationImport)) {
                        Modal.error({
                            content:
                                // (!lodash.isEmpty(importStudentExcel) &&
                                //     importStudentExcel.toString()) ||
                                !lodash.isEmpty(studentCombinationImport) &&
                                studentCombinationImport.toString(),
                            //     ||
                            // (!lodash.isEmpty(importStudentClassExcel) &&
                            //     importStudentClassExcel.toString()),
                        });
                        this.setState({
                            fileList: [],
                            importModalVisible: false,
                            successModalVisibility: true,
                            resultTypeValue: 1,
                            CombinationStyle: 1,
                            distributeValue: 0,
                        });
                    } else {
                        // message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        // this.getImportStudentResult();
                        // radioValue == 'a'
                        //     ? this.getImportStudentResult()
                        //     : radioValue == 'b'
                        //     ? this.getImportStudentResult()
                        //     : // this.ref.getImportStudentScore()
                        //       this.getImportStudentResult();
                        // this.ref.getImportStudentClass();
                        this.setState({
                            fileList: [],
                            importModalVisible: false,
                            sureImport: true,
                            resultTypeValue: 1,
                            CombinationStyle: 1,
                            distributeValue: 0,
                        });
                    }
                }
            });
        }
    };

    handleCancel = () => {
        const { radioValue } = this.state;
        this.setState({
            importModalVisible: false,
            resultTypeValue: 1,
            CombinationStyle: radioValue == 'a' ? 1 : 2,
            distributeValue: 0,
        });
    };

    importStudentResultExcel = () => {
        const { radioValue } = this.state;
        this.setState({
            importModalVisible: true,
            CombinationStyle: radioValue == 'a' ? 1 : 2,
        });
    };

    onChangeDisplay = (e) => {
        this.setState({
            displayValue: e.target.value,
        });
    };

    exportResult = () => {
        const { radioValue, displayValue } = this.state;
        const { dispatch } = this.props;
        if (radioValue == 'a') {
            dispatch({
                type: 'devision/exportDivideResultStudentView',
                payload: {},
            });
        } else if (radioValue == 'c') {
            if (displayValue == '1') {
                dispatch({
                    type: 'devision/exportDivideResultAdminClassView',
                    payload: {
                        dividePlanId: this.props.id,
                    },
                });
            } else {
                dispatch({
                    type: 'devision/exportDivideResultAdminClassScoreView',
                    payload: {
                        dividePlanId: this.props.id,
                    },
                });
            }
        } else if (radioValue == 'd') {
            dispatch({
                type: 'devision/exportDivideResultTeachingClassView',
                payload: {},
            });
        }
    };

    changeCount = (e) => {
        this.setState({
            changeWalkingClassCount: e.target.value,
        });
    };

    renderSpan = () => {
        const { choiceSelectList } = this.props;
        let { courseChooseDetailModelList } = this.state;
        let newChoiceSelectList = [];
        let resArr = choiceSelectList.find((item) => item.courseName == '行政班');
        const choiceSelectListFirst = [resArr].concat(
            choiceSelectList.filter((item) => item != resArr)
        );
        choiceSelectListFirst.map((item, index) => {
            if (item?.classModels) {
                newChoiceSelectList.push(item.classModels);
            }
        });
        let dataArr = [];
        newChoiceSelectList.map((item, index) => {
            dataArr.push(
                item && item.length > 0
                    ? item.map((item2, index2) => {
                          return {
                              groupId: item2.id,
                              courseName: item2.name,
                          };
                      })
                    : []
            );
        });
        let newDataArr = dataArr.map((item, index) => {
            return [
                { groupId: -1, courseName: '不变' },
                { groupId: null, courseName: '待分班' },
                ...item,
            ];
        });

        return newDataArr.map((item, index) => {
            return (
                <Select
                    style={{ width: '116px' }}
                    value={
                        courseChooseDetailModelList &&
                        courseChooseDetailModelList[index] &&
                        courseChooseDetailModelList[index].groupId
                    }
                    onChange={(value) => this.handleChange(value, index)}
                >
                    {item.map((item2, index2) => {
                        return (
                            <Option
                                title={item2.courseName}
                                key={item2.groupId}
                                value={item2.groupId}
                            >
                                {item2.courseName}
                            </Option>
                        );
                    })}
                </Select>
            );
        });
    };

    handleResultChange = (value) => {
        this.setState({
            distributeValue: value,
        });
    };

    render() {
        const {
            radioValue,
            toCourseVisible,
            stuIdLength,
            displayValue,
            filteredInfo,
            sortedInfo,
            fileList,
            importModalVisible,
            isUploading,
            importClassSettingVisible,
            CombinationStyle,
            distributeValue,
            isShowLoading,
        } = this.state;
        const { studentInfo, choiceSelectList, checkDivideResultClass } = this.props;

        const menu = (
            <Menu onClick={() => this.changeType()}>
                <Menu.Item key="1">批量调整学生分班</Menu.Item>
            </Menu>
        );
        const modalHead =
            choiceSelectList && choiceSelectList.length > 0
                ? choiceSelectList.map((item, index) => {
                      return item.courseName;
                  })
                : [];
        const res = '行政班';
        const list = [res].concat(modalHead.filter((item) => item != res));

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
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        const radioStyle = {
            display: 'block',
            marginBottom: '10px',
            // height: '30px',
            // lineHeight: '30px',
        };

        const conflictTip = (
            <div>
                <p>冲突情况：</p>
                {/* <p style={{ whiteSpace: 'pre-wrap' }}>{checkDivideResultClass.failMessageList}</p> */}
                <p style={{ whiteSpace: 'pre-wrap', marginTop: '-8px' }}>
                    {checkDivideResultClass.failMessageList &&
                        checkDivideResultClass.failMessageList.map((item, index) => {
                            return (
                                <span style={{ display: 'block', marginBottom: '4px' }}>
                                    ({index + 1})&nbsp;{item}
                                </span>
                            );
                        })}
                </p>
            </div>
        );

        return (
            <div>
                <div className={styles.top}>
                    <Radio.Group
                        value={radioValue}
                        buttonStyle="solid"
                        className={styles.tabs}
                        onChange={this.changeRadio}
                    >
                        <Radio.Button value="a">按学生看</Radio.Button>
                        <Radio.Button value="b">按组合看</Radio.Button>
                        <Radio.Button value="c">按行政班看</Radio.Button>
                        <Radio.Button value="d">按教学班看</Radio.Button>
                    </Radio.Group>
                    {radioValue == 'a' ? (
                        <div>
                            <span style={{ lineHeight: '32px' }}>
                                <span>{studentInfo.total}</span> &nbsp;全部 &nbsp;
                                <span>{studentInfo.arrangedTotal}</span> &nbsp;分班完成 &nbsp;
                                <span>{studentInfo.notArrangedTotal}</span> &nbsp;未完成 &nbsp;
                            </span>
                        </div>
                    ) : radioValue == 'c' ? (
                        <Radio.Group onChange={this.onChangeDisplay} value={displayValue}>
                            <Radio value={1}>显示课位</Radio>
                            <Radio value={2}>显示成绩</Radio>
                        </Radio.Group>
                    ) : (
                        ''
                    )}
                    {radioValue == 'd' ? (
                        // <div className={styles.conflictTip}>
                        //     <Icon type="info-circle" />
                        //     <span style={{ marginLeft: '8px' }}>系统检测到5条冲突</span>
                        // </div>
                        <Tooltip
                            placement="right"
                            title={conflictTip}
                            className={styles.conflictTip}
                            overlayClassName={styles.tooltip}
                        >
                            <Icon type="info-circle" />
                            <span style={{ marginLeft: '8px' }}>
                                系统检测到{checkDivideResultClass.checkCount}条冲突
                            </span>
                        </Tooltip>
                    ) : null}
                    <span>
                        {radioValue == 'd' ? (
                            ''
                        ) : (
                            <span className={styles.clear} onClick={this.clearAll}>
                                {filteredInfo || sortedInfo ? (
                                    <span className={styles.redPoint}></span>
                                ) : (
                                    ''
                                )}
                                {/* <span className={styles.redPoint}></span> */}

                                <img src={qc} width="16px" />
                                <span>清除筛选条件</span>
                            </span>
                        )}

                        <span className={styles.refresh} onClick={this.refresh}>
                            <Icon type="redo" />
                            <span>刷新</span>
                        </span>
                        {radioValue == 'c' || radioValue == 'd' ? (
                            radioValue == 'd' ? (
                                <span>
                                    <Button
                                        className={styles.antBtn}
                                        type="primary"
                                        style={{ marginRight: '20px', width: '116px' }}
                                        onClick={this.importClassSettingExcel}
                                    >
                                        导入班级设置
                                    </Button>
                                </span>
                            ) : null
                        ) : (
                            <span>
                                <Button
                                    type="primary"
                                    href={`/api/divide/result/exportDivideResultDetail?dividePlanId=${this.props.id}`}
                                    target="_blank"
                                    style={{ width: '116px', marginRight: '20px' }}
                                    className={styles.antBtn}
                                >
                                    导出分班明细
                                </Button>
                                {/* <Button type="primary" onClick={this.division}>
                                    系统分班
                                </Button> */}
                                <Button
                                    className={styles.antBtn}
                                    type="primary"
                                    style={{ marginRight: '20px', width: '116px' }}
                                    onClick={this.importStudentResultExcel}
                                >
                                    导入分班结果
                                </Button>

                                {radioValue == 'a' ? (
                                    <Dropdown
                                        className={styles.lotOperate}
                                        overlay={menu}
                                        placement="bottomCenter"
                                    >
                                        <Button
                                            className={styles.antBtn}
                                            style={{ width: '116px', marginLeft: '0px' }}
                                        >
                                            批量操作
                                            <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                ) : null}
                            </span>
                        )}

                        <Button
                            className={styles.export}
                            // onClick={this.exportResult}
                            target="_blank"
                            href={
                                radioValue == 'c' && displayValue == '1'
                                    ? `/api/divide/result/exportDivideResultAdminClassView?dividePlanId=${this.props.id}`
                                    : radioValue == 'c' && displayValue == '2'
                                    ? `/api/divide/result/exportDivideResultAdminClassScoreView?dividePlanId=${this.props.id}`
                                    : radioValue == 'a'
                                    ? `/api/divide/result/exportDivideResultStudentView?dividePlanId=${this.props.id}`
                                    : radioValue == 'b'
                                    ? `/api/divide/result/exportDivideResultCombinationView?dividePlanId=${this.props.id}`
                                    : radioValue == 'd'
                                    ? `/api/divide/result/exportDivideResultTeachingClassView?dividePlanId=${this.props.id}`
                                    : ''
                            }
                        >
                            导出
                        </Button>
                    </span>
                </div>

                {/* <Modal
                    title="批量调整学生的行政班"
                    visible={toAdminVisible}
                    onOk={this.adminHandleOk}
                    onCancel={this.adminHandleCancel}
                >
                    <p style={{ textAlign: 'center' }}>已选{stuIdLength}人</p>
                    <p className={styles.selectType}>
                        <span>选择调整类型</span>
                        <Radio.Group
                            onChange={this.onChangeClass}
                            value={newOrOld}
                            style={{ marginLeft: 10 }}
                        >
                            <Radio value={1}>调整到新班</Radio>
                            <Radio value={2}>调整到待分班</Radio>
                        </Radio.Group>
                    </p>
                    <p className={styles.afterClass}>
                        <span className={styles.setClass}>选择调整后的班级</span>
                        <Select
                            placeholder="选择班级"
                            // defaultValue="选择班级"
                            value={newClass}
                            style={{ width: 200, marginLeft: 10 }}
                            onChange={this.handleChangeClass}
                        >
                            {allClass &&
                                allClass.map((item, index) => {
                                    return <Option value={item.id}>{item.title}</Option>;
                                })}
                        </Select>
                    </p>
                </Modal> */}

                {toCourseVisible && (
                    <Modal
                        title="批量调整学生分班"
                        visible={toCourseVisible}
                        onOk={this.layeredHandleOk}
                        onCancel={this.layeredHandleCancel}
                        className={styles.adjustModal}
                    >
                        <Spin spinning={isShowLoading} tip="正在调整中...">
                            <p style={{ textAlign: 'center', marginTop: '-17px' }}>
                                所选范围内共{stuIdLength}
                                名学生，可同时调整学生的行政班，以及共同所选课程的教学班
                            </p>
                            <p className={styles.titleName}>
                                {list &&
                                    list.map((item, index) => {
                                        return <span>{item}</span>;
                                    })}
                            </p>
                            <p className={styles.selectClass}>
                                {/* {list &&
                          list.map((item, index) => {
                              return this.renderSpan(item, index);
                          })} */}
                                {this.renderSpan()}
                            </p>
                        </Spin>
                    </Modal>
                )}

                {radioValue == 'a' ? (
                    <Student
                        onRef={this.onRef}
                        id={this.props.id}
                        // stuList={stuList}
                        // combinationList={combinationList}
                        // loadingStu={loadingStu}
                        handleTableChange={this.handleTableChange}
                        filteredInfo={filteredInfo}
                        sortedInfo={sortedInfo}
                    />
                ) : radioValue == 'b' ? (
                    <Combination id={this.props.id} />
                ) : radioValue == 'c' ? (
                    displayValue == 1 ? (
                        <ShowPos id={this.props.id}></ShowPos>
                    ) : (
                        <Average id={this.props.id} />
                    )
                ) : (
                    <Programme id={this.props.id} num={this.props.num} onRef={this.onProRef} />
                )}
                <Modal
                    title="导入分班结果"
                    visible={importModalVisible}
                    onCancel={this.handleCancel}
                    onOk={this.sureImport}
                >
                    <div style={{ marginLeft: '20px' }}>
                        <div style={{ display: 'flex', marginBottom: '20px' }}>
                            <span className={styles.explain}>导入模板</span>
                            <div style={{}}>
                                <Radio.Group
                                    style={{ marginLeft: '15px' }}
                                    onChange={this.onChangeStyle}
                                    value={this.state.CombinationStyle}
                                >
                                    <div style={{ display: 'flex', marginLeft: '3px' }}>
                                        <Radio style={radioStyle} value={2}>
                                            按组合导入
                                        </Radio>
                                        {CombinationStyle == 2 ? (
                                            <a
                                                href="/api/divide/combinationTemplateDownload"
                                                target="_blank"
                                            >
                                                下载导入模板
                                            </a>
                                        ) : null}
                                    </div>
                                    <div style={{ display: 'flex', marginLeft: '3px' }}>
                                        <Radio style={radioStyle} value={1}>
                                            按学生明细导入
                                        </Radio>
                                        {CombinationStyle == 1 ? (
                                            <a
                                                href="/api/divide/result/divideStudentClassResultImportExcelTemplateDownload"
                                                target="_blank"
                                            >
                                                下载导入模板
                                            </a>
                                        ) : null}
                                    </div>
                                </Radio.Group>
                            </div>
                        </div>
                        <p style={{ display: 'flex', marginBottom: '20px' }}>
                            <span className={styles.explain}>更新方式</span>
                            {CombinationStyle == 1 ? (
                                <Radio.Group
                                    style={{ marginLeft: '18px' }}
                                    onChange={this.onChangeResult}
                                    value={this.state.resultTypeValue}
                                >
                                    <Radio value={1}>全部覆盖更新</Radio>
                                    <Radio value={2}>只更新班级学生（班级不变）</Radio>
                                </Radio.Group>
                            ) : (
                                <Radio.Group
                                    style={{ marginLeft: '18px' }}
                                    onChange={this.onChangeResult}
                                    value={this.state.resultTypeValue}
                                >
                                    <Radio value={1}>全部覆盖更新</Radio>
                                </Radio.Group>
                            )}
                        </p>
                        {CombinationStyle == 2 ? (
                            <p style={{ display: 'flex', marginBottom: '20px' }}>
                                <span className={styles.explain}>学生分配方式</span>
                                {/* <Select
                                placeholder="选择班级"
                                // defaultValue="选择班级"
                                value={newClass}
                                style={{ width: 200, marginLeft: 10 }}
                                onChange={this.handleChangeClass}
                            >
                                {allClass &&
                                    allClass.map((item, index) => {
                                        return <Option value={item.id}>{item.title}</Option>;
                                    })}
                            </Select> */}
                                <Select
                                    // defaultValue="请选择"
                                    style={{ width: 190, marginLeft: '20px', marginTop: '-4px' }}
                                    value={distributeValue}
                                    onChange={this.handleResultChange}
                                >
                                    <Option value={0}>按成绩均衡</Option>
                                    <Option value={1}>按新行政班集中</Option>
                                    <Option value={2}>按原行政班集中</Option>
                                </Select>
                            </p>
                        ) : null}
                    </div>

                    <Spin spinning={isUploading} tip="文件正在上传中">
                        <div className={styles.upLoad}>
                            <span className={styles.text}>上传文件</span>
                            <span className={styles.desc}>
                                <span className={styles.fileBtn}>
                                    <Form
                                        id="uploadForm"
                                        layout="inline"
                                        method="post"
                                        className={styles.form}
                                        encType="multipart/form-data"
                                    >
                                        <Upload {...uploadProps} maxCount={1}>
                                            <Button type="primary">
                                                {trans('global.scheduleSelectFile', '选择文件')}
                                            </Button>
                                        </Upload>
                                    </Form>
                                </span>
                            </span>
                        </div>
                    </Spin>
                </Modal>
                <Modal
                    title="导入班级设置"
                    visible={importClassSettingVisible}
                    onCancel={this.handleClassSettingCancel}
                    onOk={this.sureImportClassSetting}
                >
                    <div>
                        <span className={styles.explain}>操作说明:</span>
                        <div></div>
                        <a
                            href={`/api/divide/result/downloadStudentClassExcel?dividePlanId=${this.props.id}`}
                            target="_blank"
                            // style={{ marginLeft: "40px" }}
                        >
                            下载教学班班级 excel
                        </a>
                    </div>

                    <Spin spinning={isUploading} tip="文件正在上传中">
                        <div className={styles.upLoad} style={{ marginLeft: 0 }}>
                            <span className={styles.text}>上传文件</span>
                            <span className={styles.desc}>
                                <span className={styles.fileBtn}>
                                    <Form
                                        id="uploadForm"
                                        layout="inline"
                                        method="post"
                                        className={styles.form}
                                        encType="multipart/form-data"
                                    >
                                        <Upload {...uploadProps} maxCount={1}>
                                            <Button type="primary">
                                                {trans('global.scheduleSelectFile', '选择文件')}
                                            </Button>
                                        </Upload>
                                    </Form>
                                </span>
                            </span>
                        </div>
                    </Spin>
                </Modal>
            </div>
        );
    }
}
