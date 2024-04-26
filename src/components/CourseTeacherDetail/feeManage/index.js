import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import {
    Select,
    Input,
    Button,
    Table,
    Form,
    Tooltip,
    Modal,
    Radio,
    Spin,
    Upload,
    message,
    InputNumber,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { trans, locale } from '../../../utils/i18n';
import { getUrlSearch } from '../../../utils/utils';
import lodash from 'lodash';
import debounce from 'lodash/debounce';
import RadioGroup from 'antd/lib/radio/group';
import AddChargeModal from '../component/addChargeModal';
import { mockForm } from '../../../utils/utils';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

@connect((state) => ({
    gradeList: state.time.gradeList,
    subjectList: state.course.subjectList,
    showDetail: state.course.showDetail,
    allGradeAndGroup: state.courseTeacherDetail.allGradeAndGroup,
    getLotSubjects: state.course.getLotSubjects,
    importFeeMessage: state.course.importFeeMessage,
    userSchoolId: state.global.userSchoolId,
}))
@Form.create()
class FeeManage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            grade: [],
            subject: [],
            KeyWords: '',
            tableData: [],
            setCourseFeeVisible: false,
            courseInfo: {},
            importFeeVisible: false,
            isUploading: false,
            planId: getUrlSearch('planId'),
            isDisplay: false, //生成收费单modal控制
            loading: false,
            importErrorList: [],
            errorVisible: false,
            fileList: [],
        };

        this.delayShowDetail = debounce(this.showDetail, 1000);
    }

    componentDidMount() {
        this.getGradeList();
        this.getSubjectList();
        this.showDetail();
    }

    //生成收费单
    chargeBtn = () => {
        this.setState({
            isDisplay: true,
        });
    };
    ifRefresh = (value) => {
        this.setState({
            isDisplay: value,
        });
    };

    showDetail = () => {
        this.setState({
            loading: true,
        });
        const { dispatch } = this.props;
        const { grade, subject, KeyWords } = this.state;
        dispatch({
            type: 'course/showDetail',
            payload: {
                chooseCoursePlanId: Number(this.props.chooseCoursePlanId),
                gradeIdList: grade,
                subjectIdList: subject,
                keyword: KeyWords,
            },
        }).then(() => {
            const { showDetail } = this.props;
            let tableData = [];
            showDetail &&
                showDetail.length > 0 &&
                showDetail.map((item, index) => {
                    const len = item.groupDetailList ? item.groupDetailList.length : '';
                    item.groupDetailList.map((item2, index2) => {
                        tableData.push({
                            classFee: item.classFee,
                            classFeeType: item.classFeeType,
                            classFeeModelList: item.classFeeModelList,
                            courseEnName: item.courseEnName,
                            courseId: item.courseId,
                            courseName: item.courseName,
                            coursePlanningId: item.coursePlanningId,
                            gradeList: item.gradeList,
                            materialFeeType: item.materialFeeType,
                            coursePlanType: item.coursePlanType,
                            newMaterialCost: item.newMaterialCost,
                            oldMaterialCost: item.oldMaterialCost,
                            materialCost: item.materialCost,
                            materialCostModelList: item.materialCostModelList,
                            prefaceCourseList: item.prefaceCourseList,
                            subjectList: item.subjectList,
                            ...item2,
                            span: index2 === 0 ? len : 0,
                        });
                    });
                });
            this.setState({
                tableData,
                loading: false,
            });
        });
    };

    getGradeList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getGradeList',
        });
    };
    getSubjectList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getSubjectList',
        });
    };

    /* debounce(fn, delay) {
        let timer = null; //借助闭包
        return function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(fn, delay); // 简化写法
        };
    } */

    changeGrade = (value) => {
        this.setState(
            {
                grade: value,
            },

            () => {
                // lodash.debounce(this.showDetail(), 1000);
                // let timer = setInterval(() => {
                // }, 1000);
                // this.showDetail();
                // this.delayShowDetail();
            }
        );
        /* lodash.debounce(this.showDetail, 1000); */
        // this.showDetail = debounce(this.showDetail, 1000);
        // this.debounce(this.showDetail, 1000);
        this.delayShowDetail();
    };

    changeSubject = (value) => {
        this.setState(
            {
                subject: value,
            }
            /* () => {
                this.showDetail();
            } */
        );
        this.delayShowDetail();
    };

    searchCourse = (e) => {
        this.setState(
            {
                KeyWords: e,
            },
            () => {
                this.showDetail();
            }
        );
    };

    noToChinese = (num) => {
        if (!/^\d*(\.\d*)?$/.test(num)) {
            alert('Number is wrong!');
            return 'Number is wrong!';
        }
        // eslint-disable-next-line no-array-constructor
        var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
        // eslint-disable-next-line no-array-constructor
        var BB = new Array('', '十', '百', '千', '万', '亿', '点', '');
        var a = ('' + num).replace(/(^0*)/g, '').split('.'),
            k = 0,
            re = '';
        for (var i = a[0].length - 1; i >= 0; i--) {
            // eslint-disable-next-line default-case
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0]))
                        re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
            if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            k++;
        }
        if (a.length > 1) {
            //加上小数部分(如果有小数部分)
            re += BB[6];
            for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
        }
        return re;
    };

    setCourseFee = (record) => {
        const { showDetail } = this.props;
        let courseInfo = {};
        showDetail.map((item, index) => {
            if (item.courseId == record.courseId) {
                return (courseInfo = showDetail[index]);
            }
        });
        this.setState({
            setCourseFeeVisible: true,
            courseInfo,
        });
    };

    setFeeOk = () => {
        const { dispatch, userSchoolId } = this.props;
        const { planId } = this.state;

        let courseInfo = this.state.courseInfo;

        if (courseInfo.classFeeType === 0) {
            courseInfo.classFee = undefined;
            courseInfo.classFeeModelList = undefined;
        }
        if (courseInfo.classFeeType === 1) {
            courseInfo.classFeeModelList = undefined;
        }
        if (courseInfo.classFeeType === 2) {
            courseInfo.classFee = undefined;
        }

        if (courseInfo.materialFeeType === 0) {
            courseInfo.materialCost = undefined;
            courseInfo.newMaterialCost = undefined;
            courseInfo.oldMaterialCost = undefined;
            courseInfo.materialCostModelList = undefined;
        }
        if (courseInfo.materialFeeType === 1) {
            courseInfo.newMaterialCost = undefined;
            courseInfo.oldMaterialCost = undefined;
            courseInfo.materialCostModelList = undefined;
        }
        if (courseInfo.materialFeeType === 2) {
            courseInfo.materialCost = undefined;
            courseInfo.materialCostModelList = undefined;
        }
        if (courseInfo.materialFeeType === 3) {
            courseInfo.materialCost = undefined;
            courseInfo.newMaterialCost = undefined;
            courseInfo.oldMaterialCost = undefined;
        }

        courseInfo = JSON.parse(
            JSON.stringify(courseInfo).replace(/groupDetailList/g, 'detailModels')
        );

        courseInfo = {
            ...courseInfo,
            detailModels: courseInfo.detailModels.map((item) => {
                if (item.supplierPricingType === 1) {
                    return {
                        ...item,
                        masterTeacherFee: undefined,
                        assistTeacherFee: undefined,
                    };
                } else if (item.supplierPricingType === 0) {
                    return {
                        ...item,
                        studentFee: undefined,
                    };
                } else {
                    return {
                        ...item,
                        masterTeacherFee: undefined,
                        assistTeacherFee: undefined,
                        studentFee: undefined,
                    };
                }
            }),
        };

        if (courseInfo.classFeeType == undefined) {
            message.warn('请设置课时费！');
            return;
        }
        if (courseInfo.classFeeType == 1 && courseInfo.classFee == undefined) {
            message.warn('启用统一课时费时，请填写具体费用!');
            return;
        }
        if (
            courseInfo.classFeeType == 2 &&
            courseInfo.classFeeModelList.find((item) => item.fee == undefined)
        ) {
            message.warn('启用按班级收费时，请分别填写费用!');
            return;
        }

        if (courseInfo.materialFeeType == undefined) {
            message.warn('请设置材料费！');
            return;
        }
        if (courseInfo.materialFeeType == 1 && courseInfo.materialCost == undefined) {
            message.warn('启用统一材料费时，请填写具体费用!');
            return;
        }
        if (courseInfo.materialFeeType == 2) {
            if (
                courseInfo.newMaterialCost == undefined ||
                courseInfo.oldMaterialCost == undefined
            ) {
                message.warn('启用新老学员不同时，请分别填写费用!');
                return;
            }
        }
        if (
            courseInfo.materialFeeType == 3 &&
            courseInfo.materialCostModelList.find((item) => item.fee == undefined)
        ) {
            message.warn('启用按班级收费时，请分别填写费用!');
            return;
        }

        dispatch({
            type: 'course/editCourseFee',
            payload: {
                coursePlanningId: Number(this.props.chooseCoursePlanId),
                chooseCoursePlanId: Number(planId),
                ...courseInfo,
            },
        }).then(() => {
            this.setState({
                setCourseFeeVisible: false,
            });
            this.showDetail();
        });
    };

    materialFeeTypeChange = (e) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.materialFeeType = e.target.value;
        if (e.target.value == 0) {
            courseInfo.materialCost = undefined;
            courseInfo.newMaterialCost = undefined;
            courseInfo.oldMaterialCost = undefined;
        } else if (e.target.value == 1) {
            courseInfo.newMaterialCost = undefined;
            courseInfo.oldMaterialCost = undefined;
        } else if (e.target.value == 2) {
            courseInfo.materialCost = undefined;
        }
        this.setState({
            courseInfo,
        });
    };

    changeUnite = (e) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.materialCost = e.target.value;
        this.setState({
            courseInfo,
        });
    };

    changeSupplierPricingType = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].supplierPricingType = e.target.value;
        if (e.target.value == 1) {
            courseInfo.groupDetailList[index].masterTeacherFee = undefined;
            courseInfo.groupDetailList[index].assistTeacherFee = undefined;
        } else if (e.target.value == 0) {
            courseInfo.groupDetailList[index].studentFee = undefined;
        }
        this.setState({
            courseInfo,
        });
    };

    changeMasterFee = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].masterTeacherFee = e.target.value;
        this.setState({
            courseInfo,
        });
    };

    changeAssistFee = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].assistTeacherFee = e.target.value;
        this.setState({
            courseInfo,
        });
    };
    changeStudentFee = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].studentFee = e.target.value;
        this.setState({
            courseInfo,
        });
    };
    changeLessonCost = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].lessonActualCost = e.target.value;
        this.setState({
            courseInfo,
        });
    };
    changeMaterialCost = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].materialActualCost = e.target.value;
        this.setState({
            courseInfo,
        });
    };
    changeRemark = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].remark = e.target.value;
        this.setState({
            courseInfo,
        });
    };
    changeRatio = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].teacherStudentRatio = e.target.value;
        this.setState({
            courseInfo,
        });
    };
    changeSupplier = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].supplier = e.target.value;
        this.setState({
            courseInfo,
        });
    };
    changeMatchmaker = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].supplierMatchmaker = e.target.value;
        this.setState({
            courseInfo,
        });
    };
    changeContact = (e, index) => {
        let courseInfo = JSON.parse(JSON.stringify(this.state.courseInfo));
        courseInfo.groupDetailList[index].supplierContact = e.target.value;
        this.setState({
            courseInfo,
        });
    };

    importFee = () => {
        this.setState({
            importFeeVisible: true,
        });
    };

    exportFees = () => {
        const { chooseCoursePlanId } = this.props;
        const { grade, subject, KeyWords } = this.state;
        let obj = {};
        obj.chooseCoursePlanId = chooseCoursePlanId;
        obj.gradeIdList = grade;
        obj.subjectIdList = subject;
        obj.keyword = KeyWords;
        let json = JSON.stringify(obj);
        let lastJson = encodeURI(json);
        // window.open(`/api/courseFee/exportExcel?stringData=${lastJson}`);
        mockForm('/api/courseFee/exportExcel', { stringData: lastJson });
    };

    lotImportFee = () => {
        const { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }
        formData.append('chooseCoursePlanId', Number(this.props.chooseCoursePlanId));

        if (!lodash.isEmpty(fileList)) {
            const { dispatch } = this.props;
            this.setState({
                isUploading: true,
            });

            dispatch({
                type: 'course/importFee',
                payload: formData,
            }).then(() => {
                let importFeeMessage = this.props.importFeeMessage;
                this.setState({
                    isUploading: false,
                });
                if (!lodash.isEmpty(importFeeMessage)) {
                    this.setState({
                        fileList: [],
                        importErrorList: importFeeMessage.checkErrorMessageList,
                        errorVisible: true,
                    });
                } else {
                    this.setState(
                        {
                            fileList: [],
                            importFeeVisible: false,
                        },
                        () => this.showDetail()
                    );
                }
            });
        }
    };

    commonOnChange = (value, type, groupId) => {
        const { courseInfo } = this.state;
        if (type === 'classFeeModelList' || type === 'materialCostModelList') {
            this.setState({
                courseInfo: {
                    ...courseInfo,
                    [type]: courseInfo[type].map((item) => {
                        if (item.groupId === groupId) {
                            return {
                                ...item,
                                fee: value,
                            };
                        } else {
                            return item;
                        }
                    }),
                },
            });
        } else {
            this.setState({
                courseInfo: { ...courseInfo, [type]: value },
            });
        }
    };

    getGroupName = (sourceGroupName, courseInfo) => {
        const { courseName, courseEnName } = courseInfo;

        if (sourceGroupName.includes(courseName) && sourceGroupName !== courseName) {
            return sourceGroupName.split(courseName)[1].trimStart();
        }
        if (sourceGroupName.includes(courseEnName) && sourceGroupName !== courseEnName) {
            return sourceGroupName.split(courseEnName)[1].trimStart();
        }
        return sourceGroupName;
    };

    render() {
        const {
            subject,
            grade,
            tableData,
            setCourseFeeVisible,
            courseInfo,
            importFeeVisible,
            isUploading,
            fileList,
            planId,
            loading,
            importErrorList,
            errorVisible,
        } = this.state;
        const { gradeList, getLotSubjects, allGradeAndGroup, userSchoolId, nonAdminType } =
            this.props;

        let columns = [
            {
                title: trans('global.course', '课程'),
                dataIndex: 'courseName',
                key: 'courseName',
                // width: 280,
                width: 180,
                align: 'center',
                fixed: 'left',
                render: (value, row, index) => {
                    return {
                        children: (
                            <>
                                <p style={{ textAlign: 'center' }}>
                                    <span
                                        onClick={() =>
                                            window.open(
                                                `#/course/base/detail?chooseCoursePlanId=${
                                                    this.props.chooseCoursePlanId
                                                }&coursePlanningId=${
                                                    row.coursePlanningId
                                                }&classId=${row.groupId}&courseId=${
                                                    row.courseId
                                                }&chooseCourseName=${
                                                    row.courseName
                                                }&chooseCourseEname=${
                                                    row.courseEnName
                                                }&courseName=${row.name}&courseEname=${
                                                    row.enName
                                                }&sectionIds=${getUrlSearch(
                                                    'sectionIds'
                                                )}&isAdmin=${
                                                    this.props.isAdmin
                                                }&nonAdminType=${nonAdminType}`
                                            )
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {locale() !== 'en' ? value : row.courseEnName}
                                    </span>
                                    &nbsp;&nbsp;
                                    <span style={{ color: 'orange' }}>
                                        {row.coursePlanType == 0
                                            ? trans('global.new class', '新课')
                                            : /* : row.coursePlanType == 1
                                            ? '续班' */
                                              ''}
                                    </span>
                                    {row.coursePlanType == 1 ? (
                                        <Tooltip
                                            placement="topLeft"
                                            overlayClassName={styles.tips}
                                            title={
                                                <div>
                                                    {trans('courseSet.prevCourse', '前序课程')}:
                                                    {row.prefaceCourseList &&
                                                        row.prefaceCourseList.length > 0 &&
                                                        row.prefaceCourseList.map(
                                                            (item2, index2) => {
                                                                return <p>{item2.name}</p>;
                                                            }
                                                        )}
                                                </div>
                                            }
                                        >
                                            <span style={{ color: 'orange' }}>
                                                {row.coursePlanType == 0
                                                    ? trans('global.new class', '新课')
                                                    : row.coursePlanType == 1
                                                    ? trans('global.Continuation of class', '进阶')
                                                    : row.coursePlanType == 2
                                                    ? trans('course.plan.schoolTeam')
                                                    : ''}
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        ''
                                    )}
                                </p>
                                <p
                                    style={{
                                        color: 'blue',
                                        // display: 'flex',
                                        // justifyContent: 'space-around',
                                    }}
                                >
                                    <span
                                        onClick={() => this.setCourseFee(row)}
                                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                                    >
                                        {trans('global.Set course fees', '设置课程费用')}
                                    </span>
                                </p>
                            </>
                        ),
                        props: { rowSpan: row.span },
                    };
                },
            },
            {
                title: trans('global.Fees for students', '面向学员收费标准 元/期'),
                dataIndex: 'fee',
                key: 'fee',
                width: locale() !== 'en' ? 220 : 340,
                align: 'center',
                fixed: 'left',
                render: (value, record, index) => {
                    return {
                        children: (
                            <>
                                <p>
                                    {record.classFeeType == 0 ? (
                                        '无课时费'
                                    ) : record.classFeeType == 1 ? (
                                        `${trans('tc.base.course.cost', '课时费')}:${
                                            record.classFee
                                        }元`
                                    ) : record.classFeeType == 2 ? (
                                        <span>
                                            课时费：
                                            {record.classFeeModelList.map((item, index) => (
                                                <span>
                                                    <span>
                                                        {this.getGroupName(
                                                            locale() !== 'en'
                                                                ? item.groupName
                                                                : item.groupEnName,
                                                            record
                                                        )}
                                                    </span>
                                                    {item.fee != undefined ? (
                                                        <Fragment>
                                                            <span>{item.fee}</span>
                                                            <span>元</span>
                                                        </Fragment>
                                                    ) : (
                                                        <span>(未设置)</span>
                                                    )}

                                                    <span>
                                                        {index !==
                                                        record.classFeeModelList.length - 1
                                                            ? '、'
                                                            : ''}
                                                    </span>
                                                </span>
                                            ))}
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </p>
                                <p>
                                    {record.materialFeeType == 0 ? (
                                        trans('global.No material fee', '无材料费')
                                    ) : record.materialFeeType == 1 ? (
                                        // `材料费:${record.materialCost}元`
                                        trans('global.materialCost', '材料费:{$num}元', {
                                            num: String(record.materialCost),
                                        })
                                    ) : record.materialFeeType == 2 ? (
                                        trans(
                                            'global.materialFeeType',
                                            '新生{$num}元、老生{$oldNum}元',
                                            {
                                                num: String(record.newMaterialCost),
                                                oldNum: String(record.oldMaterialCost),
                                            }
                                        )
                                    ) : record.materialFeeType === 3 ? (
                                        <span>
                                            材料费：
                                            {record.materialCostModelList.map((item, index) => (
                                                <span>
                                                    <span>
                                                        {this.getGroupName(
                                                            locale() !== 'en'
                                                                ? item.groupName
                                                                : item.groupEnName,
                                                            record
                                                        )}
                                                    </span>
                                                    {item.fee != undefined ? (
                                                        <Fragment>
                                                            <span>{item.fee}</span>
                                                            <span>元</span>
                                                        </Fragment>
                                                    ) : (
                                                        <span>(未设置)</span>
                                                    )}
                                                    <span>
                                                        {index !==
                                                        record.materialCostModelList.length - 1
                                                            ? '、'
                                                            : ''}
                                                    </span>
                                                </span>
                                            ))}
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </p>
                            </>
                        ),
                        props: { rowSpan: record.span },
                    };
                },
            },
            {
                title: trans('global.class', '班级'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                // width: 300,
                width: 180,
                fixed: 'left',
                render: (text, record, index) => {
                    return (
                        <Tooltip
                            overlayClassName={styles.tips}
                            title={
                                <>
                                    <p>
                                        {trans('course.basedetail.master.teacher', '主教老师')}:
                                        {record?.masterTeachers &&
                                            record.masterTeachers.length > 0 &&
                                            record.masterTeachers.map((item, index) => {
                                                return (
                                                    <>
                                                        {locale() !== 'en'
                                                            ? item.name
                                                            : item.enName}
                                                        {index === record.masterTeachers.length - 1
                                                            ? ''
                                                            : '、'}
                                                    </>
                                                );
                                                // return <>{item.name index==record.masterTeachers.length-1 ? '' : '、'</>;
                                            })}
                                    </p>
                                    <p>
                                        {trans('course.basedetail.sub.teacher', '助教老师')}:
                                        {record?.assistTeachers &&
                                            record.assistTeachers.length > 0 &&
                                            record.assistTeachers.map((item, index) => {
                                                return (
                                                    <>
                                                        {locale() !== 'en'
                                                            ? item.name
                                                            : item.enName}
                                                        {index === record.masterTeachers.length - 1
                                                            ? ''
                                                            : '、'}
                                                    </>
                                                );
                                            })}
                                    </p>
                                    <p>
                                        {trans('global.number of people', '人数限制')}:
                                        {record.maxStudentNum && record.minStudentNum
                                            ? record.minStudentNum +
                                              '-' +
                                              record.maxStudentNum +
                                              trans('global.people', '人')
                                            : ''}
                                    </p>
                                    <p style={{ display: 'flex' }}>
                                        <span>
                                            {trans('course.step1.selection.classTime', '上课时间')}:
                                        </span>
                                        <span>
                                            {record.classTimeModels
                                                ? record.classTimeModels.map((item, index) => {
                                                      return (
                                                          <p>
                                                              {'周' +
                                                                  this.noToChinese(item.weekday) +
                                                                  item.startTime +
                                                                  '-' +
                                                                  item.endTime}
                                                              {index ===
                                                              record.classTimeModels.length - 1
                                                                  ? ''
                                                                  : '、'}
                                                          </p>
                                                      );
                                                  })
                                                : ''}
                                        </span>
                                    </p>
                                    <p>
                                        {trans('global.class locations', '上课地点')}:
                                        {record?.addressModels &&
                                            record.addressModels.length > 0 &&
                                            record.addressModels.map((item, index) => {
                                                return item.name;
                                            })}
                                        {record.rainyDayLocation
                                            ? '(' + record.rainyDayLocation + ')'
                                            : ''}
                                    </p>
                                </>
                            }
                        >
                            <span>
                                {this.getGroupName(
                                    locale() !== 'en' ? text : record.courseEnName,
                                    record
                                )}
                            </span>
                        </Tooltip>
                    );
                },
            },
            {
                title: trans('global.Number applicants', '报名人数'),
                dataIndex: 'totalNum',
                key: 'totalNum',
                // width: 220,
                width: locale() !== 'en' ? 120 : 180,
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <>
                            {record.total ? (
                                <>
                                    {record.total}人
                                    {record.newTotal
                                        ? // `(新生${record.newTotal}人)`
                                          trans('global.newTotal', '(新生{$num}人)', {
                                              num: record.newTotal,
                                          })
                                        : ''}
                                    {record.oldTotal
                                        ? // `(老生${record.oldTotal}人)`
                                          trans('global.oldTotal', '(老生{$num}人)', {
                                              num: record.oldTotal,
                                          })
                                        : ''}
                                </> /* `${record.total}人(新生${record.newTotal}人、老生${record.oldTotal}人)` */
                            ) : (
                                '无'
                            )}
                        </>
                    );
                },
            },
            {
                title: trans('global.Supplier pricing', '供应商计价方式'),
                dataIndex: 'supplierPricingType',
                key: 'supplierPricingType',
                align: 'center',
                width: locale() !== 'en' ? 160 : 200,
                render: (text, record, index) => {
                    return text == 0 ? (
                        <>
                            {record.masterTeacherFee && record.assistTeacherFee
                                ? // `主教${record.masterTeacherFee}元/课次、助教${record.assistTeacherFee}元/课次`
                                  trans(
                                      'global.masterTeacherFee And assistTeacherFee',
                                      '主教{$masterTeacherFeeNum}元/课次、助教{$assistTeacherFeeNum}元/课次',
                                      {
                                          masterTeacherFeeNum: record.masterTeacherFee,
                                          assistTeacherFeeNum: record.assistTeacherFee,
                                      }
                                  )
                                : record.masterTeacherFee
                                ? // `主教${record.masterTeacherFee}元/课次`
                                  trans('global.masterTeacherFeeY', '主教{$num}元/课次', {
                                      num: record.masterTeacherFee,
                                  })
                                : record.assistTeacherFee
                                ? // `助教${record.assistTeacherFee}元/课次`
                                  trans('global.assistTeacherFeeY', '助教{$num}元/课次', {
                                      num: record.record.assistTeacherFee,
                                  })
                                : ''}
                        </>
                    ) : text == 1 ? (
                        <>
                            {record.studentFee
                                ? // `${record.studentFee}元/学员/课次`
                                  trans('global.studentFeeY', '{$num}元/学员/课次', {
                                      num: record.studentFee,
                                  })
                                : ''}
                        </>
                    ) : (
                        ''
                    );
                },
            },
            {
                title: trans('global.Classes taken', '已上课次'),
                dataIndex: 'attendedClassCount',
                key: 'attendedClassCount',
                align: 'center',
                width: 130,
            },
            {
                title: trans('global.plan fee', '预算费用'),
                dataIndex: 'prevFee',
                key: 'prevFee',
                width: locale() !== 'en' ? 130 : 140,
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <>
                            {record.lessonEstimatedCost || record.lessonEstimatedCost == 0 ? (
                                <p>
                                    {trans('tc.base.course.cost', '课时费')}:
                                    {record.lessonEstimatedCost}
                                </p>
                            ) : (
                                ''
                            )}
                            {record.materialEstimatedCost || record.materialEstimatedCost == 0 ? (
                                <p>
                                    {trans('tc.base.material.cost', '材料费')}:
                                    {record.materialEstimatedCost}
                                </p>
                            ) : (
                                ''
                            )}
                        </>
                    );
                },
            },
            {
                title: trans('global.actual cost', '实际费用'),
                dataIndex: 'realFee',
                key: 'realFee',
                align: 'center',
                width: 130,
                render: (text, record, index) => {
                    return (
                        <>
                            {record.lessonActualCost ? (
                                <p>
                                    {trans('tc.base.course.cost', '课时费')}:
                                    {record.lessonActualCost}
                                </p>
                            ) : (
                                ''
                            )}
                            {record.materialActualCost ? (
                                <p>
                                    {trans('tc.base.material.cost', '材料费')}:
                                    {record.materialActualCost}
                                </p>
                            ) : (
                                ''
                            )}
                        </>
                    );
                },
            },
            {
                title: trans('global.teacher-student ratio', '师生配比'),
                dataIndex: 'teacherStudentRatio',
                key: 'teacherStudentRatio',
                width: locale() !== 'en' ? 130 : 210,
                align: 'center',
            },
            {
                title: trans('global.Remarks information', '备注信息'),
                dataIndex: 'remark',
                key: 'remark',
                width: 130,
                align: 'center',
            },
            {
                title: trans('global.Supplier Organization', '供应商机构'),
                dataIndex: 'supplier',
                key: 'supplier',
                width: locale() !== 'en' ? 130 : 180,
                align: 'center',
            },
            {
                title: trans('global.Institutional contact person', '机构对接人'),
                dataIndex: 'supplierMatchmaker',
                key: 'supplierMatchmaker',
                width: locale() !== 'en' ? 130 : 180,
                align: 'center',
            },
            {
                title: trans('global.contact details', '联系方式'),
                dataIndex: 'supplierContact',
                width: 130,
                key: 'supplierContact',
                align: 'center',
            },
        ];

        let errorColumns = [
            {
                title: trans('global.rowNumber', '行号'),
                dataIndex: 'lineNumber',
                width: 100,
                key: 'lineNumber',
                align: 'center',
            },
            {
                title: trans('global.scheduleImportError', '错误信息'),
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                align: 'center',
            },
        ];

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
            <div className={styles.feeManageBox}>
                <div className={styles.top}>
                    <p className={styles.topLeft}>
                        <Select
                            value={grade}
                            style={{ width: '30%', height: '36px' }}
                            placeholder={trans('course.plan.allGrade', '全部年级')}
                            onChange={this.changeGrade}
                            mode="multiple"
                        >
                            {/* <Option value="" key="all">
                                全部年级
                            </Option> */}
                            {gradeList &&
                                gradeList.map((item, index) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {locale() !== 'en' ? item.orgName : item.orgEname}
                                        </Option>
                                    );
                                })}
                        </Select>
                        <Select
                            value={subject}
                            style={{ width: '30%', height: '36px' }}
                            onChange={this.changeSubject}
                            placeholder={trans('global.all Subjects', '全部学科')}
                            mode="multiple"
                        >
                            {/* <Option value="" key="all">
                                全部科目
                            </Option> */}
                            {getLotSubjects &&
                                getLotSubjects.length > 0 &&
                                getLotSubjects.map((item, index) => {
                                    return (
                                        <Option
                                            value={item.id}
                                            key={item.id}
                                            title={locale() != 'en' ? item.name : item.ename}
                                        >
                                            {locale() != 'en' ? item.name : item.ename}
                                        </Option>
                                    );
                                })}
                        </Select>
                        <Search
                            placeholder={trans(
                                'global.course keyword to search',
                                '输入课程关键字搜索'
                            )}
                            onSearch={this.searchCourse}
                            className={styles.searchCourse}
                            style={{ width: '35%', height: '36px' }}
                        />
                    </p>
                    <p className={styles.topRight}>
                        <Button type="primary" onClick={this.importFee}>
                            {trans('global.Import Fees in Bulk', '批量导入费用')}
                        </Button>
                        <Button
                            style={{ lineHeight: '40px', marginLeft: '15px' }}
                            type="primary"
                            onClick={this.exportFees}
                        >
                            +&nbsp;{trans('global.Export', '导出')}
                        </Button>
                        <Button
                            className={styles.btn}
                            onClick={this.chargeBtn}
                            style={{ marginLeft: '15px' }}
                        >
                            {trans('course.action.chargeSingle', '生成收费单')}
                        </Button>
                    </p>
                </div>
                <div className={styles.content}>
                    <Table
                        columns={columns}
                        bordered={true}
                        dataSource={tableData}
                        scroll={{ x: '100%' }}
                        loading={loading}
                    />
                </div>
                <Modal
                    visible={errorVisible}
                    footer={[
                        <Button
                            type="primary"
                            className={styles.reUpload}
                            onClick={() => {
                                this.setState({
                                    fileList: [],
                                    errorVisible: false,
                                });
                            }}
                        >
                            {trans('global.uploadAgain', '重新上传')}
                        </Button>,
                    ]}
                    onCancel={() =>
                        this.setState({
                            errorVisible: false,
                            fileList: [],
                        })
                    }
                    title={trans('', '导入费用失败信息')}
                    width={720}
                >
                    <p style={{ textAlign: 'center' }}>
                        {trans('global.thereAre', '当前上传的文件中共有')} &nbsp;
                        <span style={{ color: 'red' }}>
                            {importErrorList && importErrorList.length > 0
                                ? importErrorList.length
                                : null}
                        </span>
                        &nbsp;
                        {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                    </p>
                    <Table
                        columns={errorColumns}
                        dataSource={importErrorList}
                        rowKey="lineNumber"
                        pagination={false}
                    ></Table>
                </Modal>
                <Modal
                    title={trans('global.Set course fees', '设置课程费用')}
                    visible={setCourseFeeVisible}
                    onCancel={() =>
                        this.setState({
                            setCourseFeeVisible: false,
                        })
                    }
                    onOk={this.setFeeOk}
                    className={styles.courseInfo}
                    maskClosable={false}
                >
                    <div className={styles.feeContent}>
                        <div className={styles.baseInfo}>
                            <p
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    marginBottom: '20px',
                                }}
                            >
                                {courseInfo
                                    ? `${
                                          locale() !== 'en'
                                              ? courseInfo.courseName
                                              : courseInfo.courseEnName
                                      } ${trans(
                                          'global.Information on fees for students',
                                          '面向学员收费信息'
                                      )}`
                                    : ''}
                            </p>
                            <p className={styles.feeWrapper}>
                                <span className={styles.feeText}>
                                    {trans('tc.base.course.cost', '课时费')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <span className={styles.feeContentWrapper}>
                                    <RadioGroup
                                        className={styles.feeRadioWrapper}
                                        value={courseInfo.classFeeType}
                                        onChange={(e) =>
                                            this.commonOnChange(e.target.value, 'classFeeType')
                                        }
                                    >
                                        <span className={styles.feeRadio}>
                                            <Radio value={0}>
                                                {trans('tc.not.course.fee', '无课时费')}
                                            </Radio>
                                        </span>
                                        <span className={styles.feeRadio}>
                                            <Radio value={1}>
                                                {trans('tc.unified.course.fee', '统一课时费')}
                                            </Radio>
                                            {courseInfo.classFeeType === 1 && (
                                                <span className={styles.feeItemWrapper}>
                                                    <span className={styles.feeItem}>
                                                        <span>
                                                            {trans('tc.base.course.cost', '课时费')}
                                                        </span>
                                                        <InputNumber
                                                            style={{ width: '80px' }}
                                                            onChange={(value) => {
                                                                this.commonOnChange(
                                                                    value,
                                                                    'classFee'
                                                                );
                                                            }}
                                                            placeholder={trans(
                                                                'global.Please enter the lesson fee',
                                                                '请输入课时费'
                                                            )}
                                                            value={courseInfo.classFee}
                                                        ></InputNumber>
                                                        <span>{trans('tc.fee.unit', '元/期')}</span>
                                                    </span>
                                                </span>
                                            )}
                                        </span>
                                        {userSchoolId ? null : (
                                            <span className={styles.feeRadio}>
                                                <Radio value={2}>
                                                    {trans('tc.charge.by.class', '按班级收费')}
                                                </Radio>
                                                {courseInfo.classFeeType === 2 && (
                                                    <span className={styles.feeItemWrapper}>
                                                        {courseInfo.classFeeModelList?.map(
                                                            (item) => (
                                                                <span className={styles.feeItem}>
                                                                    <span>
                                                                        {this.getGroupName(
                                                                            item.groupName,
                                                                            courseInfo
                                                                        )}
                                                                    </span>
                                                                    <InputNumber
                                                                        style={{ width: '80px' }}
                                                                        onChange={(value) =>
                                                                            this.commonOnChange(
                                                                                value,
                                                                                'classFeeModelList',
                                                                                item.groupId
                                                                            )
                                                                        }
                                                                        placeholder={trans(
                                                                            'global.Please enter the lesson fee',
                                                                            '请输入课时费'
                                                                        )}
                                                                        value={item.fee}
                                                                    ></InputNumber>
                                                                    <span>
                                                                        {trans(
                                                                            'tc.fee.unit',
                                                                            '元/期'
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            )
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </RadioGroup>
                                </span>
                            </p>
                            <p className={styles.feeWrapper}>
                                <span className={styles.feeText}>
                                    {trans('tc.base.material.cost', '材料费')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <span className={styles.feeContentWrapper}>
                                    <RadioGroup
                                        className={styles.feeRadioWrapper}
                                        value={courseInfo ? courseInfo.materialFeeType : ''}
                                        onChange={(e) =>
                                            this.commonOnChange(e.target.value, 'materialFeeType')
                                        }
                                    >
                                        <span className={styles.feeRadio}>
                                            <Radio value={0}>
                                                {trans('global.No material fee', '无材料费')}
                                            </Radio>
                                        </span>
                                        <span className={styles.feeRadio}>
                                            <Radio value={1}>
                                                {trans('global.flat material fee', '统一材料费')}
                                            </Radio>
                                            {courseInfo && courseInfo.materialFeeType == 1 && (
                                                <span className={styles.feeItemWrapper}>
                                                    <span className={styles.feeItem}>
                                                        <span>
                                                            {trans(
                                                                'tc.base.material.cost',
                                                                '材料费'
                                                            )}
                                                        </span>
                                                        <InputNumber
                                                            style={{ width: '80px' }}
                                                            value={courseInfo.materialCost}
                                                            onChange={(value) =>
                                                                this.commonOnChange(
                                                                    value,
                                                                    'materialCost'
                                                                )
                                                            }
                                                        ></InputNumber>
                                                        <span>{trans('tc.fee.unit', '元/期')}</span>
                                                    </span>
                                                </span>
                                            )}
                                        </span>
                                        {userSchoolId ? null : (
                                            <span className={styles.feeRadio}>
                                                <Radio value={2}>
                                                    {trans(
                                                        'global.New and old students',
                                                        '新老学员不同'
                                                    )}
                                                </Radio>
                                                {courseInfo && courseInfo.materialFeeType == 2 && (
                                                    <span className={styles.feeItemWrapper}>
                                                        <span className={styles.feeItem}>
                                                            <span>
                                                                {trans(
                                                                    'global.new student',
                                                                    '新学员'
                                                                )}
                                                            </span>
                                                            <InputNumber
                                                                style={{ width: '80px' }}
                                                                value={courseInfo.newMaterialCost}
                                                                onChange={(value) =>
                                                                    this.commonOnChange(
                                                                        value,
                                                                        'newMaterialCost'
                                                                    )
                                                                }
                                                            ></InputNumber>
                                                            <span>
                                                                {trans('tc.fee.unit', '元/期')}
                                                            </span>
                                                        </span>
                                                        <span className={styles.feeItem}>
                                                            <span>
                                                                {trans(
                                                                    'global.old student',
                                                                    '老学员'
                                                                )}
                                                            </span>
                                                            <InputNumber
                                                                style={{ width: '80px' }}
                                                                value={courseInfo.oldMaterialCost}
                                                                onChange={(value) =>
                                                                    this.commonOnChange(
                                                                        value,
                                                                        'oldMaterialCost'
                                                                    )
                                                                }
                                                            ></InputNumber>
                                                            <span>
                                                                {trans('tc.fee.unit', '元/期')}
                                                            </span>
                                                        </span>
                                                    </span>
                                                )}
                                            </span>
                                        )}

                                        {userSchoolId ? null : (
                                            <span className={styles.feeRadio}>
                                                <Radio value={3}>
                                                    {trans('tc.charge.by.class', '按班级收费')}
                                                </Radio>
                                                {courseInfo && courseInfo.materialFeeType == 3 && (
                                                    <span className={styles.feeItemWrapper}>
                                                        {courseInfo.materialCostModelList?.map(
                                                            (item) => (
                                                                <span className={styles.feeItem}>
                                                                    {this.getGroupName(
                                                                        item.groupName,
                                                                        courseInfo
                                                                    )}
                                                                    <InputNumber
                                                                        style={{ width: '80px' }}
                                                                        onChange={(value) =>
                                                                            this.commonOnChange(
                                                                                value,
                                                                                'materialCostModelList',
                                                                                item.groupId
                                                                            )
                                                                        }
                                                                        placeholder={trans(
                                                                            'global.Please enter the lesson fee',
                                                                            '请输入课时费'
                                                                        )}
                                                                        value={item.fee}
                                                                    ></InputNumber>
                                                                    <span>
                                                                        {trans(
                                                                            'tc.fee.unit',
                                                                            '元/期'
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            )
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </RadioGroup>
                                </span>
                            </p>
                        </div>
                        <div className={styles.courseBaseInfo}>
                            {courseInfo?.groupDetailList &&
                                courseInfo.groupDetailList.length > 0 &&
                                courseInfo.groupDetailList.map((item, index) => {
                                    return (
                                        <>
                                            <p
                                                style={{
                                                    fontWeight: 'bold',
                                                    marginBottom: '20px',
                                                    marginTop: '30px',
                                                    marginLeft: '207px',
                                                }}
                                            >
                                                <span style={{ width: '205px' }}>
                                                    {locale() !== 'en' ? item.name : item.enName}
                                                </span>
                                                &nbsp;&nbsp;
                                                <span>
                                                    {trans(
                                                        'global.Billing information for suppliers',
                                                        '面向供应商收费信息'
                                                    )}
                                                </span>
                                            </p>
                                            <p style={{ display: 'flex' }}>
                                                <span
                                                    style={{
                                                        position: 'relative',
                                                        top: '6px',
                                                        right: '50px',
                                                        // width: '106px',
                                                    }}
                                                >
                                                    {trans(
                                                        'global.Supplier pricing',
                                                        '供应商计价方式'
                                                    )}
                                                </span>
                                                <span
                                                    style={{
                                                        marginLeft: '-27px',
                                                    }}
                                                >
                                                    <RadioGroup
                                                        value={item ? item.supplierPricingType : ''}
                                                        onChange={(value) =>
                                                            this.changeSupplierPricingType(
                                                                value,
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <p
                                                            style={{
                                                                height: '33px',
                                                                lineHeight: '33px',
                                                            }}
                                                        >
                                                            <Radio value={0}>
                                                                {trans(
                                                                    'global.By teacher',
                                                                    '按教师计价'
                                                                )}
                                                            </Radio>
                                                            <div
                                                                style={{
                                                                    display: item
                                                                        ? item.supplierPricingType ==
                                                                          0
                                                                            ? 'inline-block'
                                                                            : 'none'
                                                                        : '',
                                                                }}
                                                            >
                                                                <span style={{}}>
                                                                    {trans('global.bishop', '主教')}
                                                                    &nbsp;
                                                                    <Input
                                                                        value={
                                                                            item
                                                                                ? item.masterTeacherFee
                                                                                : ''
                                                                        }
                                                                        style={{ width: '55px' }}
                                                                        onChange={(value) =>
                                                                            this.changeMasterFee(
                                                                                value,
                                                                                index
                                                                            )
                                                                        }
                                                                    ></Input>
                                                                    &nbsp;
                                                                    {trans(
                                                                        'global.yuan/class',
                                                                        '元/课次'
                                                                    )}
                                                                </span>
                                                                &nbsp;&nbsp;
                                                                <span>
                                                                    {trans(
                                                                        'global.teachingAssistant',
                                                                        '助教'
                                                                    )}
                                                                    &nbsp;
                                                                    <Input
                                                                        value={
                                                                            item
                                                                                ? item.assistTeacherFee
                                                                                : ''
                                                                        }
                                                                        style={{ width: '55px' }}
                                                                        onChange={(value) =>
                                                                            this.changeAssistFee(
                                                                                value,
                                                                                index
                                                                            )
                                                                        }
                                                                    ></Input>
                                                                    &nbsp;
                                                                    {trans(
                                                                        'global.yuan/class',
                                                                        '元/课次'
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </p>
                                                        <p
                                                            style={{
                                                                height: '33px',
                                                                lineHeight: '33px',
                                                                // marginTop: '37px',
                                                            }}
                                                        >
                                                            <Radio value={1}>
                                                                {trans(
                                                                    'global.Priced by student',
                                                                    '按学员计价'
                                                                )}
                                                            </Radio>
                                                            <div
                                                                style={{
                                                                    display: item
                                                                        ? item.supplierPricingType ==
                                                                          1
                                                                            ? 'inline-block'
                                                                            : 'none'
                                                                        : '',
                                                                    marginLeft: '27px',
                                                                }}
                                                            >
                                                                <span>
                                                                    &nbsp;
                                                                    <Input
                                                                        value={
                                                                            item
                                                                                ? item.studentFee
                                                                                : ''
                                                                        }
                                                                        style={{ width: '60px' }}
                                                                        onChange={(value) =>
                                                                            this.changeStudentFee(
                                                                                value,
                                                                                index
                                                                            )
                                                                        }
                                                                    ></Input>
                                                                    &nbsp;
                                                                    {trans(
                                                                        'global.Yuan/student/class',
                                                                        '元/学员/课次'
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </p>
                                                    </RadioGroup>
                                                </span>
                                            </p>
                                            <p>
                                                <span
                                                    style={{
                                                        position: 'relative',
                                                        right: '50px',
                                                        bottom: '49px',
                                                    }}
                                                >
                                                    {trans('global.actual cost', '实际费用')}
                                                </span>
                                                <div
                                                    style={{
                                                        display: 'inline-block',
                                                        marginLeft: '-27px',
                                                        bottom: '47px',
                                                    }}
                                                >
                                                    <p>
                                                        <span
                                                            style={
                                                                {
                                                                    // width: '90px',
                                                                    // display: 'inline-block',
                                                                    // textAlign: 'right',
                                                                }
                                                            }
                                                        >
                                                            {trans('tc.base.course.cost', '课时费')}
                                                            &nbsp;
                                                        </span>
                                                        <span>
                                                            <Input
                                                                value={
                                                                    item
                                                                        ? item.lessonActualCost
                                                                        : ''
                                                                }
                                                                style={{ width: '60px' }}
                                                                onChange={(value) =>
                                                                    this.changeLessonCost(
                                                                        value,
                                                                        index
                                                                    )
                                                                }
                                                            ></Input>
                                                            &nbsp;
                                                            {trans('tc.fee.unit', '元/期')}
                                                        </span>
                                                        <span>
                                                            {trans('global.plan fee', '预算费用')}:
                                                            {trans('global.Budget', '{$num}元', {
                                                                num: item.lessonEstimatedCost
                                                                    ? item.lessonEstimatedCost
                                                                    : '0',
                                                            })}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span>
                                                            {trans(
                                                                'tc.base.material.cost',
                                                                '材料费'
                                                            )}
                                                            &nbsp;
                                                        </span>
                                                        <span>
                                                            <Input
                                                                value={
                                                                    item
                                                                        ? item.materialActualCost
                                                                        : ''
                                                                }
                                                                style={{ width: '60px' }}
                                                                onChange={(value) =>
                                                                    this.changeMaterialCost(
                                                                        value,
                                                                        index
                                                                    )
                                                                }
                                                            ></Input>
                                                            &nbsp;
                                                            {trans('tc.fee.unit', '元/期')}
                                                        </span>
                                                        <span>
                                                            {trans('global.plan fee', '预算费用')}:
                                                            {trans(
                                                                'global.baseBudget',
                                                                '{$num}元',
                                                                {
                                                                    num: item.materialEstimatedCost
                                                                        ? item.materialEstimatedCost
                                                                        : '0',
                                                                }
                                                            )}
                                                        </span>
                                                    </p>
                                                </div>
                                            </p>
                                            <p className={styles.remark}>
                                                <span
                                                    style={{
                                                        // position: 'relative',
                                                        // marginLeft: '16px',
                                                        // lineHeight: '36px',
                                                        position: 'relative',
                                                        right: '50px',
                                                        top: '15px',
                                                    }}
                                                >
                                                    {trans('global.remark', '备注')}
                                                </span>
                                                <TextArea
                                                    value={item ? item.remark : ''}
                                                    style={{
                                                        width: '416px',
                                                        marginLeft: '-26px',
                                                    }}
                                                    onChange={(value) =>
                                                        this.changeRemark(value, index)
                                                    }
                                                ></TextArea>
                                            </p>
                                            <p>
                                                <span
                                                    style={{ position: 'relative', right: '50px' }}
                                                >
                                                    {trans(
                                                        'global.teacher-student ratio',
                                                        '师生配比'
                                                    )}
                                                </span>
                                                <Input
                                                    value={item ? item.teacherStudentRatio : ''}
                                                    style={{ width: '416px', marginLeft: '-27px' }}
                                                    onChange={(value) =>
                                                        this.changeRatio(value, index)
                                                    }
                                                ></Input>
                                            </p>
                                            <p>
                                                <span
                                                    style={{ position: 'relative', right: '50px' }}
                                                >
                                                    {trans(
                                                        'global.Supplier Organization',
                                                        '供应商机构'
                                                    )}
                                                </span>
                                                <Input
                                                    value={item ? item.supplier : ''}
                                                    style={{ width: '416px', marginLeft: '-27px' }}
                                                    onChange={(value) =>
                                                        this.changeSupplier(value, index)
                                                    }
                                                ></Input>
                                            </p>
                                            <p>
                                                <span style={{ width: '295px' }}>
                                                    <span
                                                        style={{
                                                            position: 'relative',
                                                            right: '25px',
                                                        }}
                                                    >
                                                        {trans(
                                                            'global.Institutional contact person',
                                                            '机构对接人'
                                                        )}
                                                    </span>
                                                    <Input
                                                        value={item ? item.supplierMatchmaker : ''}
                                                        style={{ width: '150px' }}
                                                        onChange={(value) =>
                                                            this.changeMatchmaker(value, index)
                                                        }
                                                    ></Input>
                                                </span>
                                                <span>
                                                    <span style={{ margin: '0 20px' }}>
                                                        {trans(
                                                            'global.contact details',
                                                            '联系方式'
                                                        )}
                                                    </span>
                                                    <Input
                                                        value={item ? item.supplierContact : ''}
                                                        style={{ width: '150px' }}
                                                        onChange={(value) =>
                                                            this.changeContact(value, index)
                                                        }
                                                    ></Input>
                                                </span>
                                            </p>
                                        </>
                                    );
                                })}
                        </div>
                    </div>
                </Modal>
                <Modal
                    className={styles.importFees}
                    title={trans('global.Import Fees in Bulk', '批量导入费用')}
                    visible={importFeeVisible}
                    onCancel={() =>
                        this.setState({
                            importFeeVisible: false,
                        })
                    }
                    /* onOk={this.lotImportFee} */
                    footer={
                        <div>
                            <Button
                                onClick={() =>
                                    this.setState({
                                        importFeeVisible: false,
                                    })
                                }
                                style={{
                                    borderRadius: '5px',
                                    border: 'none',
                                    color: 'rgb(90,99,128)',
                                    backgroundColor: '#E8E9EE',
                                    height: '32px',
                                }}
                            >
                                {trans('charge.cancel', '取消')}
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: fileList.length == 0 ? '#ccc' : 'blue',
                                    borderRadius: '5px',
                                    border: 'none',
                                    color: 'white',
                                    height: '32px',
                                    width: 'auto',
                                }}
                                disabled={fileList == [] ? true : false}
                                onClick={() => this.lotImportFee()}
                                type="primary"
                            >
                                {trans('charge.confirm', '确认')}
                            </Button>
                        </div>
                    }
                >
                    <Spin
                        spinning={isUploading}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
                        <div className={styles.upLoad}>
                            <div
                                className={styles.importMsg}
                                style={{ width: '70%', margin: '0 auto 16px' }}
                            >
                                <span>①</span>&nbsp;
                                <span>
                                    {trans('global.set up in batches', '导出需要批量设置的课程')}
                                </span>
                                <Button
                                    style={{
                                        color: 'white',
                                        marginLeft: '10px',
                                        backgroundColor: '#1890ff',
                                        borderRadius: '5px',
                                        padding: '0px 15px',
                                        display: 'inline-block',
                                        height: '32px',
                                        lineHeight: '32px',
                                    }}
                                    type="primary"
                                    onClick={this.exportFees}
                                >
                                    {trans('global.Export', '导出')}
                                </Button>
                            </div>
                            <div
                                className={styles.importMsg}
                                style={{ width: '70%', margin: 'auto', height: '40px' }}
                            >
                                <p
                                    style={{
                                        /* display: 'inline-block', */ verticalAlign: 'top',
                                        marginBottom: 0,
                                    }}
                                >
                                    <span>②</span>&nbsp;
                                    <span>{trans('student.uploadFile', '上传文件')}</span>
                                </p>

                                <span className={styles.desc}>
                                    <span className={styles.fileBtn}>
                                        <Form
                                            id="uploadForm"
                                            layout="inline"
                                            method="post"
                                            className={styles.form}
                                            encType="multipart/form-data"
                                            style={{ display: 'inline-block' }}
                                        >
                                            <Upload {...uploadProps} maxCount={1}>
                                                <Button type="primary" style={{ height: '32px' }}>
                                                    {trans('global.scheduleSelectFile', '选择文件')}
                                                </Button>
                                            </Upload>
                                        </Form>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </Spin>
                </Modal>
                <AddChargeModal
                    isDisplay={this.state.isDisplay}
                    planId={planId && planId}
                    dispatch={this.state.dispatch}
                    ifRefresh={this.ifRefresh.bind(this)}
                    switchTab={this.props.switchTab}
                ></AddChargeModal>
            </div>
        );
    }
}

module.exports = FeeManage;
