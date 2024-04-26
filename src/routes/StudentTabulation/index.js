//铁子哥需求-学生列表嵌入task
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import {
    Select,
    Input,
    Table,
    Spin,
    Checkbox,
    Pagination,
    Icon,
    Button,
    Modal,
    Form,
    Upload,
    message,
} from 'antd';
import { connect } from 'dva';
import { locale, trans } from '../../utils/i18n';
import { downloadFileByPost } from '../../utils/utils';
import { NewNotice } from '@yungu-fed/yungu-userinfo';
import lodash, { isEmpty, set } from 'lodash';
import { isMobile } from 'react-device-detect';
import { SearchTeacher } from '@yungu-fed/yungu-selector';

import * as dd from 'dingtalk-jsapi';

const { Option } = Select;
const { Search } = Input;

function StudentTabulation(props) {
    const {
        studentTableData,
        groupList,
        currentUser,
        dispatch,
        teacherList,
        importMsg,
        msgCode,
        powerStatus,
    } = props;

    const [activeTab, setActiveTab] = useState(1);
    const [groupId, setGroupId] = useState(undefined);
    const [searchValue, setSearchValue] = useState('');
    const [checkedIds, setCheckedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allPage, setAllPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [showEdit, setShowEdit] = useState(false); // 根据首导身份展示编辑入口
    //学生
    const [isEdit, setIsEdit] = useState(undefined); // 0 || 1 展示修改 2 展示退出编辑
    const [editId, setEditId] = useState(undefined); // 修改当前学生的userId
    const [stuNumber, setStuNumber] = useState(undefined); // 小学号
    //导师
    const [editIndex, setIndex] = useState(undefined);
    const [editTutor, setTutor] = useState(undefined); // 0 || 1 展示修改 2 展示退出编辑
    const [tutorId, setTutorId] = useState(undefined); // 修改当前导师的tutorId

    const [importVisible, setImport] = useState(false); // 上传
    const [fileList, setFileList] = useState([]); // 上传文件
    const [isUploading, setIsUploading] = useState(false); // 上传加载

    const [stuObj, setStuObj] = useState({});
    const [teachObj, setTeachObj] = useState({});

    const [searchTeacherModal, setSearchTeacherModal] = useState(false); //组织搜索老师弹窗

    const ref = useRef();
    const languageConfigCode = typeof languageConfigCode != 'undefined' && languageConfigCode;
    const tutorEnable = typeof tutorEnable != 'undefined' && tutorEnable == 'true' ? true : false;
    useEffect(() => {
        ref.current = groupId;
    });

    useEffect(() => {
        dispatch({
            type: 'global/havePower',
            payload: {},
        });
        // dispatch({
        //     type: 'studentTabulation/showConfig',
        // });
    }, []);

    //获取班级列表
    const fetchGroupList = (tab) => {
        dispatch({
            type: 'studentTabulation/fetchGroupList',
            payload: {
                type: tab,
            },
        });
    };

    //获取用户信息
    const fetchUserInfo = () => {
        dispatch({
            type: 'global/getCurrentUser',
            payload: {},
        });
    };
    //教师列表
    const fetchTeachers = () => {
        dispatch({
            type: 'studentTabulation/getTeacherList',
            payload: {},
        });
    };

    //获取表格数据
    const fetchTableData = (pageSize, pageNumber, callback) => {
        setLoading(true);
        dispatch({
            type: 'studentTabulation/fetchStudentTableData',
            payload: {
                pageSize: pageSize,
                pageNum: pageNumber,
                groupIds: groupId ? [groupId] : [],
                keyword: searchValue,
                exportType: activeTab,
            },
        }).then(() => {
            setLoading(false);
            setCurrentPage(false);
            callback && callback();
        });
    };

    const submitStuNum = (obj) => {
        setLoading(true);
        dispatch({
            type: 'studentTabulation/updateStudentTutorOrNumber',
            payload: {
                studentTutorAndNumberUpdateDTOList: [
                    {
                        studentId: obj.userId,
                        studentName: obj.stuName,
                        teacherId: tutorId || obj.tutorId,
                        number: stuNumber,
                    },
                ],
                groupId,
            },
        }).then(() => {
            setEditId(undefined);
            setStuNumber(undefined);
            // setIsEdit(0);
            setIndex(undefined);
            setLoading(false);
            fetchTableData(pageSize, 1, () => {
                setAllPage(false);
            });
        });
    };

    const submitTutorNum = (obj) => {
        setLoading(true);
        dispatch({
            type: 'studentTabulation/updateStudentTutorOrNumber',
            payload: {
                studentTutorAndNumberUpdateDTOList: [
                    {
                        studentId: obj.userId,
                        studentName: obj.stuName,
                        teacherId: tutorId || obj.tutorId,
                        number: stuNumber || obj.stuNumber,
                    },
                ],
                groupId,
            },
        }).then(() => {
            setEditId(undefined);
            setStuNumber(undefined);
            // setIsEdit(0);

            setIndex(undefined);
            // setTutor(undefined);

            setLoading(false);
            fetchTableData(pageSize, 1, () => {
                setAllPage(false);
            });
        });
    };

    useEffect(() => {
        fetchUserInfo();
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (allPage == true) {
            let ids = [];
            let tableData =
                activeTab == 0
                    ? studentTableData?.chiefStuDetails?.data || []
                    : studentTableData?.classStuDetails?.data || [];
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i]?.userId) {
                    ids.push(tableData[i].userId);
                }
            }
            setCheckedIds(Array.from(new Set(ids)));
        }
    }, [studentTableData]);

    useEffect(() => {
        if (groupList?.length > 0) {
            let currentGroupId = undefined;
            let tempObj = groupList.find((item) => item?.isChiefTutorGroup == 1);
            if (
                activeTab == 1 &&
                tempObj &&
                tempObj.isChiefTutorGroup &&
                tempObj.isChiefTutorGroup == 1
            ) {
                setShowEdit(1);
                setGroupId(tempObj?.id);
            } else {
                setShowEdit(0);
                currentGroupId = groupList[0]?.id;
                setGroupId(currentGroupId);
            }
            setIsEdit(0);
        }
    }, [groupList]);

    useEffect(() => {
        if (importMsg && importMsg.length > 0) {
            setFileList([]);
        } else {
            setFileList([]);
            setImport(false);
            if (msgCode == 0) {
                setTimeout(requestData, 1000);
            }
            // setTimeout(requestData, 1000);
            // fetchTableData(pageSize, 1, () => {
            //     setAllPage(false);
            // });
            setEditId(undefined);
            setStuNumber(undefined);
            setIsEdit(0);

            setIndex(undefined);
            setTutor(undefined);
        }
    }, [importMsg]);

    useEffect(() => {
        // let newTab =
        //     currentUser?.tags?.indexOf('CHIEF_TUTOR') > -1 ||
        //     currentUser?.tags?.indexOf('TUTOR') > -1
        //         ? 0
        //         : 1;
        // setActiveTab(newTab);
        if (JSON.stringify(currentUser) != '{}') {
            // fetchGroupList(newTab);
            fetchGroupList(1);
        }
    }, [currentUser]);

    useEffect(() => {
        // if(JSON.stringify(ref.current) == 'undefined' && groupId !== undefined){
        //     return false
        // }
        if (groupId !== undefined) {
            fetchTableData(pageSize, 1, () => {
                setAllPage(false);
            });
        }
    }, [groupId]);

    const requestData = () => {
        fetchTableData(pageSize, 1, () => {
            setAllPage(false);
        });
    };

    //切换菜单
    const changeTab = (activeTab) => {
        fetchGroupList(activeTab);
        setActiveTab(activeTab);
        setGroupId(undefined);
        setSearchValue('');
        setCheckedIds([]);
        setAllPage(false);
        setCurrentPage(false);
        setPageNumber(1);
        setPageSize(50);
    };

    //切换年级
    const changeGrade = (value) => {
        let selecwtedObj = groupList.find((el) => el.id == value);
        setShowEdit(selecwtedObj.isChiefTutorGroup);
        if (selecwtedObj?.isChiefTutorGroup == 1) {
            setIsEdit(0);
        } else {
            setIsEdit(undefined);
            setTutor(undefined);
        }
        setGroupId(value);
        setCheckedIds([]);
        setAllPage(false);
        setCurrentPage(false);
        setPageNumber(1);
    };

    //输入姓名
    const fillSearch = (e) => {
        setSearchValue(e.target.value);
    };

    //搜索
    const search = () => {
        setCheckedIds([]);
        setAllPage(false);
        setCurrentPage(false);
        fetchTableData(pageSize, 1);
    };

    //选中全部筛选结果
    const checkAllPage = (e) => {
        let ids = [];
        if (e.target.checked) {
            let tableData =
                activeTab == 0
                    ? studentTableData?.chiefStuDetails?.data || []
                    : studentTableData?.classStuDetails?.data || [];
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i]?.userId) {
                    ids.push(tableData[i].userId);
                }
            }
        } else {
            ids = [];
        }
        setCheckedIds(ids);
        setAllPage(e.target.checked);
        setCurrentPage(false);
    };

    //选中当页筛选结果
    const checkCurrentPage = (e) => {
        let ids = JSON.parse(JSON.stringify(checkedIds));
        let tableData =
            activeTab == 0
                ? studentTableData?.chiefStuDetails?.data || []
                : studentTableData?.classStuDetails?.data || [];
        ids = [];
        if (e.target.checked) {
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i]?.userId) {
                    ids.push(tableData[i].userId);
                }
            }
        } else {
            ids = [];
        }
        setCheckedIds(Array.from(new Set(ids)));
        setCurrentPage(e.target.checked);
        setAllPage(false);
    };

    const changePageNumber = (page, size) => {
        if (currentPage) {
            setCheckedIds([]);
            setCurrentPage(false);
        }
        fetchTableData(size, page);
        setPageNumber(page);
        setPageSize(size);
    };

    const switchPageSize = (page, size) => {
        setCheckedIds([]);
        setCurrentPage(false);
        setAllPage(false);
        fetchTableData(size, 1, () => {
            setAllPage(false);
        });
        setPageNumber(1);
        setPageSize(size);
    };

    const changeText = () => {
        setIsEdit(2);
        setTutor(2);
    };

    const exitEdit = () => {
        setIsEdit(0);
        setEditId(undefined);
        setStuNumber(undefined);

        setTutor(0);
        setTutorId(undefined);
        setIndex(undefined);
    };

    //批量修改导师
    const batchEditTeacher = () => {
        if (checkedIds && checkedIds.length > 0) {
            setSearchTeacherModal(true);
        } else {
            message.info(trans('global.studentTabulation.checkModify', '请先勾选要修改的导师哦~'));
        }
    };

    //确认添加人员
    const confirmAddPerson = (ids) => {
        let receivedIds = JSON.parse(JSON.stringify(ids));
        let paramsIds = Array.from(new Set(receivedIds));
        let tableData = studentTableData?.classStuDetails?.data || [];
        for (let i = 0; i < checkedIds.length; i++) {
            let rowInfo = tableData.find((item) => item.userId == checkedIds[i]);
            dispatch({
                type: 'studentTabulation/updateStudentTutorOrNumber',
                payload: {
                    studentTutorAndNumberUpdateDTOList: [
                        {
                            studentId: rowInfo.userId,
                            studentName: rowInfo.stuName,
                            teacherId: paramsIds[0] || rowInfo.tutorId,
                            number: rowInfo.stuNumber,
                        },
                    ],
                    groupId,
                },
            }).then(() => {
                setEditId(undefined);
                setStuNumber(undefined);

                setIndex(undefined);

                setLoading(false);

                fetchTableData(pageSize, 1, () => {
                    setAllPage(false);
                });
            });
        }
        setSearchTeacherModal(false);
    };

    const clickRow = (record, e) => {
        let ids = JSON.parse(JSON.stringify(checkedIds));
        let total =
            activeTab == 0
                ? studentTableData?.chiefStuDetails?.total || 0
                : studentTableData?.classStuDetails?.total || 0;
        if (e.target.checked) {
            ids.push(record.userId);
        } else {
            let index = ids.indexOf(record.userId);
            if (index > -1) {
                ids.splice(index, 1);
            }
        }
        let resultId = Array.from(new Set(ids));
        setCheckedIds(resultId);
        setCurrentPage(resultId.length == pageSize && total != 0 ? true : false);
    };

    const ifChecked = (record) => {
        let id = record.userId;
        return checkedIds.indexOf(id) > -1 ? true : false;
    };

    const changeEdit = (obj) => {
        setStuObj(obj);
        //当前行正在编辑时，点击其他行
        if (obj.userId != editId && editId != undefined) {
            setTutor(2);
            setTutorId(undefined);
            setIndex(undefined);
            setEditId(undefined);
            setEditId(obj.userId);
            if (obj.userId != teachObj.userId) {
                setIsEdit(2);
            }
            return;
        } else if (obj.userId != teachObj.userId) {
            setTutor(2);
            setIndex(undefined);
        }
        setIsEdit(2);
        setEditId(obj.userId);
        setStuNumber(obj.number);
    };

    const changeTutorEdit = (obj, index) => {
        setTeachObj(obj);
        //当前行正在编辑时，点击其他行
        if (index != editIndex && editIndex != undefined) {
            setIsEdit(2);
            setEditId(undefined);
            setStuNumber(undefined);
            setIndex(index);
            return;
        } else if (stuObj.userId != obj.userId) {
            setIsEdit(2);
            setEditId(undefined);
        }
        setTutor(2);
        setIndex(index);
        setTutorId(obj.tutorId);
    };

    const cancelEdit = () => {
        setEditId(undefined);
        setStuNumber(undefined);
    };

    const cancelTutorEdit = () => {
        setTutor(2);
        setTutorId(undefined);
        setIndex(undefined);
    };

    //图片onError
    const checkError = (e, defaultImg) => {
        e.target.src = defaultImg;
    };

    const exportFees = () => {
        // downloadFileByPost(
        //     '/api/student/roster/export',
        //     {
        //         stuIds: allPage == true ? [] : checkedIds,
        //         exportType: activeTab,
        //     },
        //     '学生数据'
        // );
        window.open(`/api/student/roster/updateNumberExport?groupId=${groupId}`);
    };

    const lotImportFee = () => {
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }
        formData.append('groupId', groupId);

        if (!lodash.isEmpty(fileList)) {
            setIsUploading(true);

            dispatch({
                type: 'studentTabulation/importNum',
                payload: formData,
            }).then(() => {
                setIsUploading(false);
            });
        }
    };

    const jumpToUpdate = () => {
        const isIframe = window.self != window.top;
        // 判断是否为iframe嵌套
        if (isIframe) {
            let newUrl =
                window.location.origin.indexOf('yungu.org') > -1
                    ? 'https://task.yungu.org/#/studentTabulation/1'
                    : 'https://task.daily.yungu-inc.org/#/studentTabulation/1';

            window.parent.location.href = newUrl;
        } else {
            window.open(
                window.location.origin.indexOf('yungu.org') > -1
                    ? 'https://smart-scheduling.yungu.org/#/student/index'
                    : 'https://smart-scheduling.daily.yungu-inc.org/#/student/index'
            );
        }
    };

    //渲染表头
    const renderColumns = !isMobile
        ? [
              {
                  title: (
                      <div className={styles.filterArea}>
                          {isMobile ? null : (
                              <>
                                  <Checkbox checked={allPage} onChange={checkAllPage}>
                                      <span className={styles.txt}>
                                          {trans('studentTabulation.allFilter', '全部')}
                                      </span>
                                  </Checkbox>
                                  <Checkbox checked={currentPage} onChange={checkCurrentPage}>
                                      <span className={styles.txt}>
                                          {trans('studentTabulation.currentPageStudent', '本页')}
                                      </span>
                                  </Checkbox>
                              </>
                          )}
                      </div>
                  ),
                  dataIndex: 'group',
                  key: 'group',
                  width: isMobile ? 80 : 'auto',
                  fixed: isMobile ? 'left' : false,
                  render: (text, record) => (
                      <div>
                          {isMobile ? (
                              <div className={styles.studentName}>{record.groupName}</div>
                          ) : (
                              <Checkbox
                                  checked={ifChecked(record)}
                                  onChange={(e) => clickRow(record, e)}
                              >
                                  <div className={styles.studentName}>
                                      {locale() == 'en' ? record.groupEnName : record.groupName}
                                  </div>
                              </Checkbox>
                          )}
                      </div>
                  ),
              },
              {
                  title: <span className={styles.txt}>{trans('student.student', '学生')}</span>,
                  dataIndex: 'student',
                  key: 'student',
                  align: 'left',
                  width: isMobile ? 80 : 'auto',
                  fixed: isMobile ? 'left' : false,
                  render: (text, record) => {
                      let defaultImg =
                          record.sex && (record.sex == 'male' || record.sex == '男')
                              ? 'https://assets.yungu.org/statics/0.0.1/task/boy.png'
                              : 'https://assets.yungu.org/statics/0.0.1/task/girl.png';
                      let imgSrc = record.sex ? defaultImg : '';
                      let content = (
                          <img
                              src={imgSrc}
                              className={styles.avatar}
                              onError={(e) => checkError(e, defaultImg)}
                              alt="头像"
                              style={{ cursor: 'pointer' }}
                          />
                      );
                      let url =
                          window.location.origin.indexOf('yungu.org') > -1
                              ? 'https://task.yungu.org/api/student/detail'
                              : 'https://task.daily.yungu-inc.org/api/student/detail';
                      let language = locale() === 'en' ? 'en' : 'cn';
                      return (
                          <>
                              <div className={styles.infoStyle}>
                                  <NewNotice
                                      width={40}
                                      userId={record.userId}
                                      renderDom={content}
                                      placement={'rightTop'}
                                      language={language}
                                      url={url}
                                      defaultImg={defaultImg}
                                      ifShowHomePage={true}
                                      isMobile={isMobile}
                                  />
                                  {!isMobile ? (
                                      <span className={styles.studentName}>
                                          {languageConfigCode == 'Chinese Witch English'
                                              ? `${record.stuName} ${record?.stuEnName || ''}`
                                              : locale() == 'en'
                                              ? record.stuEnName
                                              : record.stuName}
                                      </span>
                                  ) : (
                                      <span className={styles.studentName}>
                                          {locale() == 'en' ? record.stuEnName : record.stuName}
                                      </span>
                                  )}
                              </div>
                          </>
                      );
                  },
              },
              {
                  title: <span className={styles.txt}>{trans('student.studentNo', '学号')}</span>,
                  dataIndex: 'studentNo',
                  key: 'studentNo',
                  align: 'center',
                  width: isMobile ? 80 : 'auto',
                  render: (text, record) => (
                      <div className={styles.studentName}>{record.stuNo}</div>
                  ),
              },
              {
                  title: (
                      <span className={styles.txt}>
                          {locale() == 'en' ? 'No. In Class' : '小学号'}
                      </span>
                  ),
                  dataIndex: 'studentLittleNo',
                  key: 'studentLittleNo',
                  align: 'center',
                  width: 210,
                  render: (text, record) => (
                      <div className={styles.studentName}>
                          {editId == record.userId && isEdit == 2 ? (
                              <>
                                  <Input
                                      style={{ width: 75, height: 25 }}
                                      value={stuNumber}
                                      onChange={(e) => setStuNumber(e.target.value)}
                                  />
                                  <Icon
                                      type="check-circle"
                                      onClick={() => submitStuNum(record)}
                                      style={{ color: 'blue', margin: '0 5px' }}
                                  />
                                  <Icon type="close-circle" onClick={cancelEdit} />
                              </>
                          ) : isEdit == 2 ? (
                              <>
                                  <span>{record.number}</span>
                                  <span>
                                      <Icon onClick={() => changeEdit(record)} type="edit" />
                                  </span>
                              </>
                          ) : (
                              <span>{record.number}</span>
                          )}
                      </div>
                  ),
              },
              {
                  title: <span className={styles.txt}>{trans('student.sex', '性别')}</span>,
                  dataIndex: 'sex',
                  key: 'sex',
                  align: 'center',
                  render: (text, record) => (
                      <div className={styles.studentName}>
                          {record.sex == '男'
                              ? locale() == 'en'
                                  ? 'male'
                                  : '男'
                              : record.sex == '女'
                              ? locale() == 'en'
                                  ? 'female'
                                  : '女'
                              : ''}
                      </div>
                  ),
              },
              {
                  title: (
                      <span className={styles.txt}>{trans('student.teacherNameShow', '导师')}</span>
                  ),
                  dataIndex: 'tutor',
                  key: 'tutor',
                  align: 'center',
                  width: 330,
                  render: (text, record, index) =>
                      index == editIndex && editTutor == 2 ? (
                          <>
                              <Select
                                  showSearch
                                  style={{ width: 120 }}
                                  showArrow={true}
                                  placeholder={trans(
                                      'global.studentTabulation.search.teachers',
                                      '搜索选择教师'
                                  )}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                      option.props.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                  }
                                  className={styles.selectTeacher}
                                  onChange={(value) => setTutorId(value)}
                                  allowClear={true}
                              >
                                  {teacherList.map((item) => (
                                      <Option value={item.teacherId} key={item.teacherId}>
                                          {item.name}
                                      </Option>
                                  ))}
                              </Select>
                              <Icon
                                  type="check-circle"
                                  onClick={() => submitTutorNum(record)}
                                  style={{ color: 'blue', margin: '0 5px' }}
                              />
                              <Icon type="close-circle" onClick={cancelTutorEdit} />
                          </>
                      ) : editTutor == 2 ? (
                          <>
                              <div className={styles.studentName}>
                                  {languageConfigCode == 'Chinese Witch English'
                                      ? `${record.tutorName} ${record?.tutorEnName || ''}`
                                      : locale() == 'en'
                                      ? record.tutorEnName
                                      : record.tutorName}
                                  <Icon
                                      onClick={() => changeTutorEdit(record, index)}
                                      type="edit"
                                  />
                              </div>
                          </>
                      ) : (
                          <div className={styles.studentName}>
                              {languageConfigCode == 'Chinese Witch English'
                                  ? `${record.tutorName} ${record?.tutorEnName || ''}`
                                  : locale() == 'en'
                                  ? record.tutorEnName
                                  : record.tutorName}
                          </div>
                      ),
              },
              {
                  title: (
                      <span className={styles.txt}>
                          {trans('studentTabulation.chiefTutor', '首席导师')}
                      </span>
                  ),
                  dataIndex: 'chiefTutor',
                  key: 'chiefTutor',
                  align: 'center',
                  width: isMobile ? 100 : 'auto',
                  render: (text, record) => (
                      <div className={styles.studentName}>
                          {languageConfigCode == 'Chinese Witch English'
                              ? `${record.chiefTutorName} ${record?.chiefTutorEnName || ''}`
                              : locale() == 'en'
                              ? record?.chiefTutorEnName || ''
                              : record.chiefTutorName}
                      </div>
                  ),
              },
              {
                  title: (
                      <span className={styles.txt}>
                          {trans('student.special.coach', '特长教练')}
                      </span>
                  ),
                  dataIndex: 'SpecialtyTutorName',
                  key: 'SpecialtyTutorName',
                  align: 'center',
                  width: isMobile ? 100 : 'auto',
                  render: (text, record) => (
                      <div className={styles.studentName}>
                          {languageConfigCode == 'Chinese Witch English'
                              ? `${record.specialtyTutorName} ${record?.specialtyTutorEnName || ''}`
                              : locale() == 'en'
                              ? record?.specialtyTutorEnName || ''
                              : record.specialtyTutorName}
                      </div>
                  ),
              },
          ]
        : [
              {
                  title: (
                      <div className={styles.filterArea}>
                          {isMobile ? null : (
                              <>
                                  <Checkbox checked={allPage} onChange={checkAllPage}>
                                      <span className={styles.txt}>
                                          {trans('studentTabulation.allFilter', '全部')}
                                      </span>
                                  </Checkbox>
                                  <Checkbox checked={currentPage} onChange={checkCurrentPage}>
                                      <span className={styles.txt}>
                                          {trans('studentTabulation.currentPageStudent', '本页')}
                                      </span>
                                  </Checkbox>
                              </>
                          )}
                      </div>
                  ),
                  dataIndex: 'group',
                  key: 'group',
                  width: isMobile ? 60 : 'auto',
                  fixed: isMobile ? 'left' : false,
                  render: (text, record) => (
                      <div>
                          {isMobile ? (
                              <div className={styles.studentName}>
                                  {record.groupName
                                      ? record.groupName.split('年级').join('')
                                      : record.groupName}
                              </div>
                          ) : (
                              <Checkbox
                                  checked={ifChecked(record)}
                                  onChange={(e) => clickRow(record, e)}
                              >
                                  <div className={styles.studentName}>{record.groupName}</div>
                              </Checkbox>
                          )}
                      </div>
                  ),
              },
              {
                  title: <span className={styles.txt}>{trans('student.student', '学生')}</span>,
                  dataIndex: 'student',
                  key: 'student',
                  align: 'left',
                  width: isMobile ? 80 : 'auto',
                  fixed: isMobile ? 'left' : false,
                  render: (text, record) => {
                      let defaultImg =
                          record.sex && (record.sex == 'male' || record.sex == '男')
                              ? 'https://assets.yungu.org/statics/0.0.1/task/boy.png'
                              : 'https://assets.yungu.org/statics/0.0.1/task/girl.png';
                      let imgSrc = record.sex ? defaultImg : '';
                      let content = (
                          <img
                              src={imgSrc}
                              className={styles.avatar}
                              onError={(e) => checkError(e, defaultImg)}
                              alt="头像"
                              style={{ cursor: 'pointer' }}
                          />
                      );
                      let url =
                          window.location.origin.indexOf('yungu.org') > -1
                              ? 'https://task.yungu.org/api/student/detail'
                              : 'https://task.daily.yungu-inc.org/api/student/detail';
                      let language = locale() === 'en' ? 'en' : 'cn';
                      return (
                          <>
                              <div className={styles.infoStyle}>
                                  <NewNotice
                                      width={40}
                                      userId={record.userId}
                                      renderDom={content}
                                      placement={'rightTop'}
                                      language={language}
                                      url={url}
                                      defaultImg={defaultImg}
                                      ifShowHomePage={true}
                                      isMobile={isMobile}
                                  />
                                  {!isMobile ? (
                                      <span className={styles.studentName}>
                                          {record.stuName} {record.stuEnName}
                                      </span>
                                  ) : (
                                      <span className={styles.studentName}>
                                          {locale() == 'en' ? record.stuEnName : record.stuName}
                                      </span>
                                  )}
                              </div>
                          </>
                      );
                  },
              },
              {
                  title: (
                      <span className={styles.txt}>
                          {trans('student.studentLittleNo', '小学号')}
                      </span>
                  ),
                  dataIndex: 'studentLittleNo',
                  key: 'studentLittleNo',
                  align: 'center',
                  width: 50,
                  render: (text, record) => (
                      <div className={styles.studentName}>
                          {editId == record.userId && isEdit == 2 ? (
                              <>
                                  <Input
                                      style={{ width: 75, height: 25 }}
                                      value={stuNumber}
                                      onChange={(e) => setStuNumber(e.target.value)}
                                  />
                                  <Icon
                                      type="check-circle"
                                      onClick={() => submitStuNum(record)}
                                      style={{ color: 'blue', margin: '0 5px' }}
                                  />
                                  <Icon type="close-circle" onClick={cancelEdit} />
                              </>
                          ) : isEdit == 2 ? (
                              <>
                                  <span>{record.number}</span>
                                  <span>
                                      <Icon onClick={() => changeEdit(record)} type="edit" />
                                  </span>
                              </>
                          ) : (
                              <span>{record.number}</span>
                          )}
                      </div>
                  ),
              },
              {
                  title: <span className={styles.txt}>{trans('student.sex', '性别')}</span>,
                  dataIndex: 'sex',
                  key: 'sex',
                  align: 'center',
                  width: 50,
                  render: (text, record) => <div className={styles.studentName}>{record.sex}</div>,
              },
              {
                  title: (
                      <span className={styles.txt}>{trans('student.teacherNameShow', '导师')}</span>
                  ),
                  dataIndex: 'tutor',
                  key: 'tutor',
                  align: 'center',
                  width: 60,
                  render: (text, record, index) =>
                      index == editIndex && editTutor == 2 ? (
                          <>
                              <Select
                                  showSearch
                                  style={{ width: 120 }}
                                  showArrow={true}
                                  placeholder={trans(
                                      'global.studentTabulation.search.teachers',
                                      '搜索选择教师'
                                  )}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                      option.props.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                  }
                                  className={styles.selectTeacher}
                                  onChange={(value) => setTutorId(value)}
                                  allowClear={true}
                              >
                                  {teacherList.map((item) => (
                                      <Option value={item.teacherId} key={item.teacherId}>
                                          {item.name}
                                      </Option>
                                  ))}
                              </Select>
                              <Icon
                                  type="check-circle"
                                  onClick={() => submitTutorNum(record)}
                                  style={{ color: 'blue', margin: '0 5px' }}
                              />
                              <Icon type="close-circle" onClick={cancelTutorEdit} />
                          </>
                      ) : editTutor == 2 ? (
                          <>
                              <div className={styles.studentName}>
                                  {record.tutorName}
                                  <Icon
                                      onClick={() => changeTutorEdit(record, index)}
                                      type="edit"
                                  />
                              </div>
                          </>
                      ) : (
                          <div className={styles.studentName}>{record.tutorName}</div>
                      ),
              },
              {
                  title: (
                      <span className={styles.txt}>
                          {trans('studentTabulation.chiefTutorMobile', '首席导师')}
                      </span>
                  ),
                  dataIndex: 'chiefTutor',
                  key: 'chiefTutor',
                  align: 'center',
                  width: isMobile ? 60 : 'auto',
                  render: (text, record) => (
                      <div className={styles.studentName}>{record.chiefTutorName}</div>
                  ),
              },
              {
                  title: null,
              },
          ];

    const uploadProps = {
        onRemove: (file) => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };
    const mobileWidth = window.innerWidth ? window.innerWidth - 24 : 920;
    const overflowX = { x: isMobile ? mobileWidth : 0 };

    const havePowerToJumpDetail =
        powerStatus.content &&
        powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') != -1
            ? true
            : false;

    const identityFlag =
        currentUser?.tags?.indexOf('CHIEF_TUTOR') > -1 ||
        currentUser?.tags?.indexOf('TUTOR') > -1 ||
        currentUser?.tags?.indexOf('SPECIALTY_TUTOR') > -1;
    const isShowMyStudentFlag = tutorEnable && identityFlag;

    return (
        <div className={isMobile ? styles.mobilePageMain : styles.pageMain}>
            <div className={styles.main}>
                <div className={styles.conditionArea}>
                    <div className={styles.tabbar}>
                        {isShowMyStudentFlag ? (
                            <span
                                className={activeTab == 0 ? styles.activeTab : ''}
                                onClick={() => changeTab(0)}
                            >
                                {trans('studentTabulation.myStudent', '我的导生')}
                            </span>
                        ) : null}
                        <span
                            className={activeTab == 1 ? styles.activeTab : ''}
                            onClick={() => changeTab(1)}
                        >
                            {trans('studentTabulation.myClass', '我的班级')}
                        </span>
                    </div>
                    <div className={styles.rightArea}>
                        <span
                            style={
                                !isMobile
                                    ? {
                                          color: 'blue',
                                          display: 'inline-block',
                                          marginRight: '10px',
                                      }
                                    : { color: 'blue', position: 'absolute', top: 20, right: 12 }
                            }
                        >
                            {showEdit ? (
                                isEdit == 1 || isEdit == 0 ? (
                                    <span onClick={changeText} style={{ cursor: 'pointer' }}>
                                        {trans(
                                            'global.studentTabulation.updateInfo',
                                            '修改导师/小学号'
                                        )}
                                    </span>
                                ) : isEdit == 2 ? (
                                    <>
                                        <span
                                            onClick={batchEditTeacher}
                                            style={{ marginRight: 12, cursor: 'pointer' }}
                                        >
                                            {trans(
                                                'global.studentTabulation.updateMentors',
                                                '批量修改导师'
                                            )}
                                        </span>
                                        <span onClick={exitEdit}>
                                            {trans(
                                                'global.studentTabulation.exitEditing',
                                                '退出编辑模式'
                                            )}
                                        </span>
                                    </>
                                ) : null
                            ) : null}
                        </span>

                        {showEdit && havePowerToJumpDetail ? (
                            isEdit == 1 || isEdit == 0 ? (
                                <span
                                    onClick={jumpToUpdate}
                                    style={{
                                        color: 'blue',
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {trans('global.studentTabulation.updateMore', '修改更多信息')}
                                </span>
                            ) : null
                        ) : null}

                        {activeTab == 0 ? (
                            <div className={isMobile ? styles.mobileSearch : styles.inlineBlock}>
                                <Select
                                    className={styles.selectStyle}
                                    onChange={changeGrade}
                                    value={groupId}
                                    placeholder={trans('global.select', '请选择')}
                                    dropdownMatchSelectWidth={false}
                                    dropdownStyle={{
                                        width: isMobile ? 120 : 200,
                                    }}
                                >
                                    {groupList?.length > 0
                                        ? groupList.map((item) => (
                                              <Option value={item.id} key={item.id}>
                                                  {locale() == 'en' ? item.enName : item.name}
                                              </Option>
                                          ))
                                        : null}
                                </Select>
                                <Search
                                    placeholder={trans(
                                        'studentTabulation.searchStudent',
                                        '请输入学生姓名搜索'
                                    )}
                                    className={styles.inputStyle}
                                    onChange={fillSearch}
                                    onSearch={search}
                                    value={searchValue}
                                />
                                {checkedIds.length > 0 || allPage == true ? (
                                    <em className={styles.checkedTips}>
                                        {trans('studentTabulation.selected', '选中')} （
                                        {allPage == true
                                            ? activeTab == 0
                                                ? studentTableData?.chiefStuDetails?.total || 0
                                                : studentTableData?.classStuDetails?.total || 0
                                            : checkedIds.length}
                                        ）
                                    </em>
                                ) : null}
                                {isMobile ? null : checkedIds.length > 0 || allPage == true ? (
                                    <a
                                        className={styles.exportBtn}
                                        onClick={() =>
                                            downloadFileByPost(
                                                '/api/student/roster/export',
                                                {
                                                    stuIds: allPage == true ? [] : checkedIds,
                                                    exportType: activeTab,
                                                },
                                                '学生数据'
                                            )
                                        }
                                    >
                                        {trans('studentTabulation.exportData', '导出数据')}
                                    </a>
                                ) : (
                                    <a className={styles.exportBtnGray}>
                                        {trans('studentTabulation.exportData', '导出数据')}
                                    </a>
                                )}
                            </div>
                        ) : activeTab == 1 && isEdit == 2 && !isMobile ? (
                            <Button type="primary" onClick={() => setImport(true)}>
                                {trans('importInfo', '批量导入小学号')}
                            </Button>
                        ) : (
                            <div className={isMobile ? styles.mobileSearch : styles.inlineBlock}>
                                <Select
                                    className={styles.selectStyle}
                                    onChange={changeGrade}
                                    value={groupId}
                                    placeholder={trans('global.select', '请选择')}
                                    dropdownMatchSelectWidth={false}
                                    dropdownStyle={{
                                        width: 200,
                                    }}
                                >
                                    {groupList?.length > 0
                                        ? groupList.map((item) => (
                                              <Option value={item.id} key={item.id}>
                                                  {locale() == 'en' ? item.enName : item.name}
                                              </Option>
                                          ))
                                        : null}
                                </Select>
                                <Search
                                    placeholder={trans(
                                        'studentTabulation.searchStudent',
                                        '请输入学生姓名搜索'
                                    )}
                                    className={styles.inputStyle}
                                    onChange={fillSearch}
                                    onSearch={search}
                                    value={searchValue}
                                />
                                {checkedIds.length > 0 || allPage == true ? (
                                    <em className={styles.checkedTips}>
                                        {trans('studentTabulation.selected', '选中')} （
                                        {allPage == true
                                            ? activeTab == 0
                                                ? studentTableData?.chiefStuDetails?.total || 0
                                                : studentTableData?.classStuDetails?.total || 0
                                            : checkedIds.length}
                                        ）
                                    </em>
                                ) : null}
                                {isMobile ? null : checkedIds.length > 0 || allPage == true ? (
                                    <a
                                        className={styles.exportBtn}
                                        onClick={() =>
                                            downloadFileByPost(
                                                '/api/student/roster/export',
                                                {
                                                    stuIds: allPage == true ? [] : checkedIds,
                                                    exportType: activeTab,
                                                },
                                                '学生数据'
                                            )
                                        }
                                    >
                                        {trans('studentTabulation.exportData', '导出数据')}
                                    </a>
                                ) : (
                                    <a className={styles.exportBtnGray}>
                                        {trans('studentTabulation.exportData', '导出数据')}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.tabMain}>
                    <Spin spinning={loading} size="large">
                        <Table
                            columns={renderColumns}
                            // bordered
                            dataSource={
                                activeTab == 0
                                    ? studentTableData?.chiefStuDetails?.data || []
                                    : studentTableData?.classStuDetails?.data || []
                            }
                            pagination={false}
                            scroll={overflowX}
                        />
                    </Spin>
                    <div className={styles.showPage}>
                        <Pagination
                            total={
                                activeTab == 0
                                    ? studentTableData?.chiefStuDetails?.total || 0
                                    : studentTableData?.classStuDetails?.total || 0
                            }
                            showSizeChanger
                            showQuickJumper
                            onChange={changePageNumber}
                            onShowSizeChange={switchPageSize}
                            current={pageNumber}
                            pageSize={pageSize}
                            pageSizeOptions={['50', '70']}
                            hideOnSinglePage={true}
                        />
                    </div>
                </div>
            </div>

            <Modal
                className={styles.importFees}
                title="上传小学号"
                visible={importVisible}
                onCancel={() => setImport(false)}
                footer={
                    <div>
                        <Button
                            onClick={() => setImport(false)}
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
                            onClick={lotImportFee}
                            type="primary"
                        >
                            {trans('charge.confirm', '确认')}
                        </Button>
                    </div>
                }
            >
                <Spin spinning={isUploading} tip={trans('global.file uploading', '文件正在上传中')}>
                    <div className={styles.upLoad}>
                        <div
                            className={styles.importMsg}
                            style={{ width: '70%', margin: '0 auto 16px' }}
                        >
                            <span>①</span>&nbsp;
                            <span>导出当前的小学号设置</span>
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
                                onClick={exportFees}
                            >
                                {trans('global.Export', '导出')}
                            </Button>
                        </div>
                        <div
                            className={styles.importMsg}
                            style={{ width: '70%', margin: 'auto', height: '40px' }}
                        >
                            <p style={{ verticalAlign: 'top', marginBottom: 0 }}>
                                <span>②</span>&nbsp;
                                <span>上传修改后的信息表</span>
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

            {searchTeacherModal === true ? (
                <SearchTeacher
                    modalVisible={searchTeacherModal}
                    cancel={() => setSearchTeacherModal(false)}
                    language={locale() == 'en' ? 'en' : 'zh_CN'}
                    confirm={confirmAddPerson}
                    selectedList={[]} //选中人员，组件当中回显{[id: 1, name: '', englishName: '']},如果是组织id，id处理成"org-1"的形式
                    selectType="1" //1：全体人员 2：人员和组织id
                />
            ) : null}
        </div>
    );
}

export default connect((state) => ({
    studentTableData: state.studentTabulation.studentTableData,
    groupList: state.studentTabulation.groupList,
    allStudentTableData: state.studentTabulation.allStudentTableData,
    teacherList: state.studentTabulation.teacherList,
    currentUser: state.global.currentUser,
    importMsg: state.studentTabulation.importMsg,
    powerStatus: state.global.powerStatus, //是否有权限
}))(StudentTabulation);
