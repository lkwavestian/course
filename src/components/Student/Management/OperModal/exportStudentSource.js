//批量导出学生档案
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Checkbox, message } from 'antd';
import { trans } from '../../../../utils/i18n';
import { mockForm } from '../../../../utils/utils';
import { isEmpty } from 'lodash';

function ExportStudentSource(props) {
    const [studentInfo, setStudentInfo] = useState([1]);
    const [familyInfo, setFamilyInfo] = useState([]);

    //取消
    const handleCancel = () => {
        const { hideModal } = props;
        setStudentInfo([1]);
        setFamilyInfo([]);
        typeof hideModal == 'function' && hideModal.call(this, 'exportSource');
    };

    //选择学生信息
    const selectStudentInfo = (value) => {
        setStudentInfo(value);
    };

    //选择家庭信息
    const selectFamilyInfo = (value) => {
        value.map((item) => {
            if (item == 4) {
                value.push(5);
            }
        });
        setFamilyInfo(value);
    };

    const exportButtonList = () => {
        const {
            rowIds,
            exportType,
            selectSchooYearlId,
            treeId,
            searchValue,
            pageSize,
            current,
            checkValue,
            searchRole,
            studentStatus,
            searchStartTime,
            searchEndTime,
            transferDest,
            ifAll,
            sexSelectValue,
            studentGroupId,
            dormId,
            schoolBus,
            speTutor,
            studentType,
            searchTeacherValue,
            statusType,
            searchSpeTeacherValue,
        } = props;
        let paramsObj = {};
        if (searchRole == 'student') {
            paramsObj.keyWord = searchValue || '';
        } else {
            paramsObj.parentMobile = searchValue || null;
        }
        if (treeId && treeId > 0) {
            paramsObj.nodeId = treeId;
        } else {
            paramsObj.studentGroupId = studentGroupId;
        }
        const rangeList = familyInfo ? studentInfo.concat(familyInfo) : studentInfo;
        const { hideModal } = props;
        setStudentInfo([1]);
        setFamilyInfo([]);

        let listToString = !isEmpty(rangeList) ? rangeList.toString() : '';
        let idListToString = !isEmpty(rowIds) ? rowIds.toString() : '';

        typeof hideModal == 'function' && hideModal.call(this, 'exportSource');
        let payload = {
            userIdList: idListToString,
            typeList: listToString,
            pageType: exportType, // 导出 1本页 2所有页
            schoolYearId: selectSchooYearlId, // 所选学年
        };
        if (exportType == 2) {
            payload = {
                ...payload,

                // 筛选学生信息 or 父母手机号
                keyWord: searchRole == 'student' ? searchValue : '',
                parentMobile: searchRole != 'student' ? searchValue : '',

                // 判断当前选中组织节点nodeId是否存在
                nodeId: treeId && treeId > 0 ? treeId : undefined,
                studentGroupId: treeId && treeId > 0 ? undefined : studentGroupId,

                // 基础信息筛选
                tutorUserId: searchTeacherValue,
                gender: sexSelectValue,
                status: studentStatus,
                studentType,
                dormId,
                schoolBus,
                specialtyTutorUserId: searchSpeTeacherValue,

                pageSize: pageSize,
                pageNum: current,
                ifShowSub: true, //是否显示子部门学生
                studentStatusList: props.getStudentStatus(Number(studentStatus)),
                startTime: (searchStartTime && `${searchStartTime} 00:00:00`) || '',
                endTime: (searchEndTime && `${searchEndTime} 23:59:59`) || '',
                transfer: transferDest,
                statusType,
                speTutor,
            };
        }
        props
            .dispatch({
                type: 'student/batchExport',
                payload: payload,
            })
            .then(() => {
                props.downloadData && props.downloadData();
            });
        // setTimeout(() => {
        // props.downloadData && props.downloadData();
        // }, 600);

        // mockForm('/api/teaching/excel/export', {
        //     userIdList: rowIds,
        //     typeList: rangeList,
        //     pageType: exportType,
        //     schoolYearId: selectSchooYearlId,
        //     keyWord: searchRole == 'student' ? searchValue : '',
        //     parentMobile: searchRole == 'student' ? searchValue : '',
        //     nodeId: treeId && treeId > 0 ? treeId : undefined,
        //     studentGroupId: treeId && treeId > 0  ? undefined : studentGroupId,

        //     pageSize: pageSize,
        //     pageNum: current,
        //     ifShowSub:  true, //是否显示子部门学生
        //     studentStatusList: props.getStudentStatus(Number(studentStatus)),
        //     status: studentStatus,
        //     startTime: (searchStartTime && `${searchStartTime} 00:00:00`) || '',
        //     endTime: (searchEndTime && `${searchEndTime} 23:59:59`) || '',
        //     transfer: transferDest,
        //     statusType,
        //     tutorUserId: searchTeacherValue,
        //     specialtyTutorUserId: searchSpeTeacherValue,
        //     gender: sexSelectValue,
        //     dormId,
        //     schoolBus,
        //     speTutor,
        //     studentType,
        // });
    };

    const { exportModalVisible } = props;
    return (
        <Modal
            visible={exportModalVisible}
            title={trans('student.exportMore', '批量导出')}
            footer={null}
            width="670px"
            onCancel={handleCancel}
        >
            <div>
                <div className={styles.exportRange}>
                    <span className={styles.exportTitle}>{trans('student.student', '学生')}：</span>
                    <Checkbox.Group onChange={selectStudentInfo} value={studentInfo}>
                        <p>
                            <Checkbox value={1} disabled={true}>
                                <em className={styles.checkboxContent}>
                                    {trans('student.basicInfo', '基本信息')}
                                </em>
                            </Checkbox>
                            <span className={styles.exportTips}>
                                {trans(
                                    'student.basicInfoTips',
                                    '（仅姓名、英文名、学号、年级、班级、显示名、拼音名、性别、首席导师、导师、邮箱）'
                                )}
                            </span>
                        </p>
                        <p>
                            <Checkbox value={2}>
                                <em className={styles.checkboxContent}>
                                    {trans('student.otherInfo', '其他信息')}
                                </em>
                            </Checkbox>
                            <span className={styles.exportTips}>
                                {trans('student.otherInfoTipsOne', '（除基本信息外其他所有信息）')}
                            </span>
                        </p>
                    </Checkbox.Group>
                </div>
                <div className={styles.exportRange}>
                    <span className={styles.exportTitle}>{trans('student.parent', '家长')}：</span>
                    <Checkbox.Group onChange={selectFamilyInfo} value={familyInfo}>
                        <p>
                            <Checkbox value={3}>
                                <em className={styles.checkboxContent}>
                                    {trans('student.basicInfo', '基本信息')}
                                </em>
                            </Checkbox>
                            <span className={styles.exportTips}>
                                {trans('student.basicInfoTipsTwo', '（仅姓名、手机号）')}
                            </span>
                        </p>
                        <p>
                            <Checkbox value={4}>
                                <em className={styles.checkboxContent}>
                                    {trans('student.otherInfo', '其他信息')}
                                </em>
                            </Checkbox>
                            <span className={styles.exportTips}>
                                {trans('student.otherInfoTipsTwo', '（除基本信息外其他所有信息）')}
                            </span>
                        </p>
                    </Checkbox.Group>
                </div>
                <div className={styles.operationList}>
                    <div className={styles.exportButtonList}>
                        <span
                            className={styles.modalBtn + ' ' + styles.cancelBtn}
                            onClick={handleCancel}
                        >
                            {trans('global.cancel', '取消')}
                        </span>
                        <span
                            className={styles.modalBtn + ' ' + styles.submitBtn}
                            // href={confirmExportUrl}
                            onClick={exportButtonList}
                        >
                            {trans('global.confirmExport', '确认导出')}
                        </span>
                        {/* <a href={`${url}/api/teaching/excel/export`} style={{ opacity: '0' }}><span id="sp"></span></a> */}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function mapStateProps(state) {
    return {};
}
export default connect(mapStateProps)(ExportStudentSource);
