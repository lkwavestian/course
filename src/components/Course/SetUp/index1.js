//分组学生
import React, { useState, useEffect, useRef } from 'react';
import styles from './teamTable.less';
import { Table, Modal, message, Checkbox, Tooltip, Dropdown, Menu, Popover } from 'antd';
import { NewNotice } from '@yungu-fed/yungu-userinfo';
import { getAvatarUrl } from '../../utils/utils';
import icon from '../../icon.less';
import { trans, locale } from '../../utils/i18n';
import { connect } from 'dva';
import ResetPwd from './resetPwd';
import StudentList from './studentList';
import EditTitle from './editTitle';
import Empty from '../Task/empty';
import { Container, Draggable } from 'react-smooth-dnd';

const mapStateToProps = state => {
  return {
    studentList: state.newStudent.studentList,
    groupInfoList: state.newStudent.groupInfoList
  }
}

let timer = {};//定时器

function TableList(props) {
  const [modalVisible, setModalVisible] = useState(false); ////重置密码二次确认框
  const [userId, setUserId] = useState(undefined);//学生userId
  const [allPage, setAllPage] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]); //成员选中
  const [checkedTeamIndex, setCheckedTeamIndex] = useState([]); //小组选中
  const [groupInfoList, setGroupInfoList] = useState(props.groupInfoList || []); //小组列表
  const [deleteVisible, setDeleteVisible] = useState({});
  const [studentVisible, setStudentVisible] = useState(false); //学生列表展示
  const [readOnly, setReadOnly] = useState(true); //学生列表是否只读
  const [editItem, setEditItem] = useState({}); //编辑的小组
  const [editTitleVisible, setEditTitleVisible] = useState(false); //编辑小组标题


  useEffect(() => {
    setGroupInfoList(props.groupInfoList || [])
  }, [props.groupInfoList])

  useEffect(() => {
    return () => {
      console.log(12233334455)
      clearInterval(timer);
    };
  }, [props.bigGroupId])

  //选中全部学生
  const selectAllStudent = e => {
    let ids = JSON.parse(JSON.stringify(checkedIds));
    let teamIndex = JSON.parse(JSON.stringify(checkedTeamIndex));
    if (e.target.checked && groupInfoList && groupInfoList.length) {
      groupInfoList.map((item, index) => {
        if (item && item.studentUserList && item.studentUserList.length) {
          teamIndex.push(index);
          item.studentUserList.map((el) => {
            ids.push(el.id);
          })
        }
      })
    } else {
      ids = [];
      teamIndex = [];
    }
    setAllPage(e.target.checked);
    setCheckedIds(ids);
    setCheckedTeamIndex(teamIndex);
  }

  //获取总数
  const getAllPageTotal = () => {
    let num = 0;
    if (groupInfoList && groupInfoList.length) {
      groupInfoList.map((item => {
        num = item && item.studentUserList && item.studentUserList.length ? num + item.studentUserList.length : num;
      }))
    }
    return num;
  }

  //小组是否选中
  const ifTeamChecked = (index) => {
    return checkedTeamIndex.indexOf(index) > -1 ? true : false;
  }

  //点击行
  const clickTeamRow = (teamIndex, e) => {
    let indexs = JSON.parse(JSON.stringify(checkedTeamIndex));
    let ids = JSON.parse(JSON.stringify(checkedIds));
    let allPageTotal = getAllPageTotal();
    let currntTeam = getIds(teamIndex);
    if (e.target.checked) {
      indexs.push(teamIndex);
      ids = ids.concat(currntTeam);
    } else {
      let index = indexs.indexOf(teamIndex);
      if (index > -1) {
        indexs.splice(index, 1);
        ids = filterArr(checkedIds, currntTeam);
      }
    }
    ids = Array.from(new Set(ids));
    setAllPage(ids.length == allPageTotal && (allPageTotal != 0) ? true : false);
    setCheckedTeamIndex(indexs);
    setCheckedIds(ids);
  }

  const filterArr = (arr1, arr2) => {
    const arr = [...arr1, ...arr2];
    const newArr = arr.filter((t) => {
      return !(arr1.includes(t) && arr2.includes(t));
    });
    return newArr;
  };

  //获取当前小组的ids
  const getIds = (index) => {
    let list = groupInfoList[`${index}`] && groupInfoList[`${index}`].studentUserList || [];
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      arr.push(list[i].id);
    }
    return arr;
  }

  //学生是否选中
  const ifChecked = (record) => {
    let id = record.id;
    return checkedIds.indexOf(id) > -1 ? true : false;
  }

  //点击行
  const clickRow = (record, e, currentTeamIndex) => {
    let ids = JSON.parse(JSON.stringify(checkedIds));
    let teamIndex = JSON.parse(JSON.stringify(checkedTeamIndex));
    let allPageTotal = getAllPageTotal();
    let currentTeamIds = getIds(currentTeamIndex); //当前小组
    if (e.target.checked) {
      ids.push(record.id);
    } else {
      let index = ids.indexOf(record.id);
      if (index > -1) {
        ids.splice(index, 1);
      }
    }
    ids = Array.from(new Set(ids));
    let diffArr = filterArr(currentTeamIds, ids);
    if (diffArr && diffArr.length) {
      let index = teamIndex.indexOf(currentTeamIndex);
      if (index > -1) {
        teamIndex.splice(index, 1);
      }
    } else {
      teamIndex.push(currentTeamIndex);
    }
    teamIndex = Array.from(new Set(teamIndex));
    setAllPage(ids.length == allPageTotal && (allPageTotal != 0) ? true : false);
    setCheckedIds(ids);
    setCheckedTeamIndex(teamIndex);
  }

  //头部渲染
  const renderTitle = () => {
    return <div className={styles.head}>
      <span className={styles.check}><Checkbox checked={allPage} onChange={(e) => selectAllStudent(e)}></Checkbox></span>
      <span className={styles.stuAvatar}></span>
      <span className={styles.name}>{trans('global.name', '姓名')}</span>
      <span className={styles.englishName}>{trans('global.englishName', '英文名')}</span>
      <span className={styles.studentNo}>{trans("global.schoolNumber", "学号")}</span>
      <span className={styles.gender}>{trans('global.gender', '性别')}</span>
      <span>{trans('student.adminGroup', "行政班")}</span>
      {props.editPermission && <span className={styles.operate}><i>{trans("result.operation", "操作")}</i></span>}
    </div>
  }

  const getMenu = (el, item, index) => {
    return <Menu onClick={(e) => onChange(e, el, item, index)} className={styles.menuStyle}>
      <Menu.Item key="1">{trans('student.remove', "从该组移除")}</Menu.Item>
      <Menu.Item key="2">{trans('global.resetPwd', '重置密码')}</Menu.Item>
      <Menu.Item key="3">{el.id == item.leaderUserId ? trans('student.notTeamLeader', "取消组长") : trans('student.setTeamLeader', "设为组长")}</Menu.Item>
    </Menu>
  }

  const onChange = (e, el, item, index) => {
    switch (e.key) {
      case "1":
        Modal.confirm({
          title: trans('global.tip', '温馨提示'),
          content: <div className={styles.deleteTxt} dangerouslySetInnerHTML={{ __html: trans('student.removeStuTip', "您确定要将{$name}从{$teamName}移除吗？移除后，该学生将被移入待分组名单中，您可以继续分到其它组。", { name: `${el.name} ${el.englishName}`, teamName: item.teamName }) }}></div>,
          okText: <span className={styles.confirmBtn}>{trans('global.confirm', '确定')}</span>,
          cancelText: <span className={styles.cancelBtn}>{trans('global.cancel', '取消')}</span>,
          maskClosable: true,
          className: styles.deleteStyle,
          onOk: () => removeStu(el, index)
        });
        break;
      case "2":
        handelVisible(true, el.id);
        break;
      case "3":
        setTeamLeader(el, item.leaderUserId, index);
        break;
    }
  }

  //图片onError
  const checkError = (e, defaultImg) => {
    e.target.src = defaultImg;
  }

  //移除学生
  const removeStu = (el, index) => {
    let list = JSON.parse(JSON.stringify(groupInfoList));
    let info = list[`${index}`] || {};
    let studentUserList = info.studentUserList || [];
    let currentIndex = studentUserList.findIndex(item => item.id == el.id);
    if (currentIndex > -1) {
      studentUserList.splice(currentIndex, 1);
    }
    if (info.leaderUserId == el.id) {
      list[`${index}`].leaderUserId = null;
    }
    list[`${index}`].studentUserList = studentUserList;
    updateBigGroupInfo(list);
  }

  //重置密码弹框
  const handelVisible = (type, id) => {
    setModalVisible(type);
    setUserId(id ? id : undefined)
  }

  //重置密码
  const confirm = () => {
    const { dispatch, groupId } = props;
    dispatch({
      type: 'course/resetPwd',
      payload: {
        userId,
        groupId
      },
      onSuccess: () => {
        message.success(trans('global.successToast', '成功'));
      }
    }).then(() => {
      handelVisible(false, undefined);
    })
  }

  //设为组长
  const setTeamLeader = (el, leaderUserId, index) => {
    let list = JSON.parse(JSON.stringify(groupInfoList));
    let info = list[`${index}`] || {};
    info.leaderUserId = el.id == leaderUserId ? null : el.id;
    list[`${index}`] = info;
    updateBigGroupInfo(list);
  }

  const onDrop = (dropResult, index) => {
    console.log(dropResult, 'onDrop--dropResult--');
    console.log(index, 'onDrop--index---')
    let sourceKey = dropResult.removedIndex;
    let targetKey = dropResult.addedIndex;
    let itemToAdd = dropResult.payload; //拖拽的元素
    let list = JSON.parse(JSON.stringify(groupInfoList));
    if (sourceKey != null && targetKey != null) {
      let info = list[`${index}`] || {};
      let student = info.studentUserList;
      student.splice(targetKey, 0, ...student.splice(sourceKey, 1));
      list[`${index}`] = info;

    } else if (sourceKey != null || targetKey != null) {
      if (sourceKey != null) { //当前组去掉该元素
        let info = list[`${index}`] || {};
        let student = info.studentUserList;
        student.splice(sourceKey, 1);
        list[`${index}`] = info;
      } else { //在当前组插入该元素
        let info = list[`${index}`] || {};
        let student = info.studentUserList;
        student.splice(targetKey, 0, itemToAdd);
      }
    }
    setGroupInfoList(list);

    //先清除定时器，10秒后自动保存
    clearTimer();
    timer = setInterval(() => {
      updateBigGroupInfo(list, true, () => {
        clearTimer();
      });
    }, 10000);
  }

  const clearTimer = () => {
    clearInterval(timer);
  }

  const onColumnDrop = (value) => {
    console.log(value, 'onColumnDrop--value----')
  }
  const getCardPayload = (index, i) => {
    console.log(index, 'getCardPayload--index');
    console.log(i, 'getCardPayload---i----')
    if (index || index == 0) {
      let list = JSON.parse(JSON.stringify(groupInfoList));
      let info = list[`${index}`] || {};
      let student = info.studentUserList && info.studentUserList.length > i ? info.studentUserList[i] : {};
      student.teamIndex = index;
      return student;
    }
  }

  //渲染内容区
  const renderContent = () => {
    const { editPermission, identify } = props;
    let ifShowHomePage = identify && identify.indexOf('employee') > -1 ? true : false;//头像是否可以点击
    return <div className={styles.content} id="contentArea">
      {
        groupInfoList && groupInfoList.length ?
          <Container
            onDrop={(value) => onColumnDrop(value)}
            dragHandleSelector=".column-drag-handle"
            dropPlaceholder={{
              animationDuration: 150,
              showOnTop: true,
              className: 'cards-drop-preview'
            }}
          >
            {
              groupInfoList.map((item, index) => {
                return <Draggable key={`groupInfo${index}`}>
                  <div className={styles.groupInfo} id={`groupInfo${index}`}>
                    <div className={styles.teamNameArea} key={index}>
                      <div className={`card-column-header ${styles.title}`}>
                        <i className={icon.iconfont} onClick={() => changeFold(index, !item.ifFold)}>&#xe659;</i>
                        <Checkbox checked={ifTeamChecked(index)} onChange={(e) => clickTeamRow(index, e)}></Checkbox>
                        <span className={styles.teamName}>{item.teamName}</span>
                        {
                          editPermission && <i className={`${icon.iconfont} ${styles.editIcon}`} onClick={() => editTitle(item, index)}>&#xe796;</i>
                        }
                      </div>
                      {
                        editPermission &&
                        <div className={styles.operBtn}>
                          <Popover
                            content={getDeleteContent(item, index)}
                            title={null}
                            trigger="click"
                            placement="bottom"
                            visible={deleteVisible[`${index}`]}
                            onVisibleChange={(visible) => changeDeleteVisible(visible, index)}
                          >
                            <Tooltip title={trans('result.delete', '删除')}>
                              <span><i className={icon.iconfont}>&#xe865;</i></span>
                            </Tooltip>
                          </Popover>
                          <Tooltip title={trans('student.up', "上移")}>
                            {
                              index == 0 ?
                                <span><i className={`${icon.iconfont} ${styles.notAllowedBtn}`}>&#xeb0b;</i></span> :
                                <span><i className={icon.iconfont} onClick={() => changePosition(index, 'up')}>&#xeb0b;</i></span>
                            }
                          </Tooltip>
                          <Tooltip title={trans('student.down', "下移")}>
                            {
                              index == groupInfoList.length - 1 ?
                                <span><i className={`${icon.iconfont} ${styles.notAllowedBtn}`}>&#xeb0a;</i></span> :
                                <span><i className={icon.iconfont} onClick={() => changePosition(index, 'down')}>&#xeb0a;</i></span>
                            }
                          </Tooltip>
                          <Tooltip title={trans('student.personnel', "人员调整")}>
                            <span onClick={() => editStudent(item, index, item.ifFold)}><i className={icon.iconfont}>&#xe864;</i></span>
                          </Tooltip>
                        </div>
                      }
                    </div>
                    {
                      !item.ifFold &&
                      <div className={styles.studentArea}>
                        {
                          editItem && editItem.currentIndex == index && studentVisible ?
                            <div className={styles.editData}>{item.studentUserList && item.studentUserList.length ? "正在调整学生" : "正在添加学生"}</div> :
                            item.studentUserList && item.studentUserList.length ?
                              <Container
                                onDrop={(dropResult) => onDrop(dropResult, index)}
                                {...item.props}
                                groupName="col"
                                getChildPayload={i =>
                                  getCardPayload(index, i)
                                }
                                dropPlaceholder={{
                                  // animationDuration: 150,
                                  // showOnTop: true,
                                  className: styles.cardGhost
                                }}
                              >
                                {
                                  item.studentUserList.map((el, eIndex) => {

                                    let defaultImg = el.gender && (el.gender == 'male' || el.gender == '男') ? "https://assets.yungu.org/statics/0.0.1/task/boy.png" : "https://assets.yungu.org/statics/0.0.1/task/girl.png";
                                    let imgSrc = el.userUnionId ? getAvatarUrl(el.userUnionId) : "";
                                    let content = <img src={imgSrc} className={styles.avatar} onError={(e) => checkError(e, defaultImg)} alt="头像" style={{ cursor: "pointer" }} />;
                                    let url = window.location.origin.indexOf("yungu.org") > -1 ? "https://task.yungu.org/api/student/detail" : "https://task.daily.yungu-inc.org/api/student/detail";
                                    let language = locale() === 'en' ? 'en' : 'cn';

                                    return <Draggable key={item.id}><div className={styles.head} key={eIndex} id={`card${index}_${eIndex}`}>
                                      <i className={icon.iconfont}>&#xe643;</i>
                                      <span className={styles.check}><Checkbox checked={ifChecked(el)} onChange={(e) => clickRow(el, e, index)}></Checkbox></span>
                                      <span className={styles.stuAvatar}>
                                        <div className={styles.avatarArea}>
                                          {
                                            ifShowHomePage ?
                                              <NewNotice userId={el.id} renderDom={content} placement={"rightTop"} language={language} url={url} defaultImg={defaultImg} ifShowHomePage={true} /> :
                                              <img src={imgSrc} className={styles.avatar} onError={(e) => checkError(e, defaultImg)} alt="头像" />
                                          }
                                          {
                                            el.ifLeave ?
                                              <span className={styles.leave}>{trans('student.leave', "请假")}</span> : null
                                          }

                                        </div>
                                      </span>
                                      <span className={styles.name}><span>{el.name}</span>{item.leaderUserId == el.id ? <em>{trans('student.teamLeader', "组长")}</em> : null}</span>
                                      <span className={styles.englishName}>{el.englishName}</span>
                                      <span className={styles.studentNo}>{el.studentNo}</span>
                                      <span className={styles.gender}>{el.gender}</span>
                                      <span>{el.adminGroup}</span>
                                      {props.editPermission && <span className={styles.operate}>
                                        <Dropdown
                                          overlay={getMenu(el, item, index)}
                                          trigger={['click']}
                                          placement="bottomRight"
                                          getPopupContainer={() => document.getElementById(`card${index}_${eIndex}`)}
                                        >
                                          <i className={icon.iconfont}>&#xe6fd;</i>
                                        </Dropdown>
                                      </span>}
                                    </div>
                                    </Draggable>
                                  })
                                }
                              </Container>
                              : editPermission ?
                                <div className={styles.noData} onClick={() => editStudent(item, index, item.ifFold)}><i className={icon.iconfont}>&#xe85b;</i>{trans('student.addSudent', "点击此处添加学生")}</div> :
                                <div className={styles.noData}>{trans('global.noStudent', '暂无学生')}</div>
                        }
                      </div>
                    }
                  </div>
                </Draggable>
              })
            }
          </Container> : <div className={styles.noDataArea}>
            <Empty
              type="4"
              title={props.name ? trans('global.noStudent', '暂无学生') : editPermission ? trans('student.noTeam', "暂无小组，快去手动创建吧") : trans('global.noGroup', '暂无小组')}
            />
          </div>
      }
    </div>
  }

  //排序
  const changePosition = (i, type) => {
    let list = JSON.parse(JSON.stringify(groupInfoList));
    if (type === 'up') { //上移
      [list[i - 1], list[i]] = [list[i], list[i - 1]];
    } else {//下移
      [list[i], list[i + 1]] = [list[i + 1], list[i]];
    }
    updateBigGroupInfo(list);
  }

  //删除小组提示文案
  const getDeleteContent = (item, index) => {
    return <div className={styles.deleteModal}>
      <div className={styles.deleteTxt}>{trans('student.deleteTeamTip', "删除该小组后，组内学生将会移入待分组名单中，您确定要删除“{$teamName}”吗？", { teamName: item.teamName })}</div>
      <div className={styles.buttonStyle}>
        <span
          className={styles.cancelBtn}
          onClick={() => changeDeleteVisible(false, index)}
        >
          {trans('global.cancel', '取消')}
        </span>
        <span
          className={styles.deleteBtn}
          onClick={() => deleteTeam(index)}
        >
          {trans('result.delete', '删除')}
        </span>
      </div>
    </div>
  }

  //删除显隐
  const changeDeleteVisible = (visible, index) => {
    let deleteVisible = {};
    deleteVisible[`${index}`] = visible;
    setDeleteVisible(deleteVisible);
  }

  //删除小组
  const deleteTeam = (index) => {
    changeDeleteVisible(false, index);
    if (groupInfoList && groupInfoList.length == 1) {
      message.info(trans('student.atLeast', "至少要有一个小组哦~"))
      return;
    }
    let list = JSON.parse(JSON.stringify(groupInfoList));
    list.splice(index, 1);
    updateBigGroupInfo(list);
  }

  //学生列表可见
  const changeStudentVisible = (visible, type) => {
    if (studentVisible && visible) {
      message.info(trans('student.operateTip', "当前有正在进行的操作，请提交或者取消后再进行此操作"));
      return;
    }
    setStudentVisible(visible);
    setReadOnly(type ? true : false);
    if (!visible) {
      setEditItem({});
    }
  }

  const editStudent = (item, index, ifFold) => {
    // if (studentVisible && editItem && (editItem.currentIndex || editItem.currentIndex == 0)) {
    //   message.info(trans('student.operateTip', "当前有正在进行的操作，请提交或者取消后再进行此操作"));
    //   return;
    // }
    if (studentVisible) {
      message.info(trans('student.operateTip', "当前有正在进行的操作，请提交或者取消后再进行此操作"));
      return;
    }
    if (ifFold) {
      changeFold(index, false);
    }
    setEditItem({
      currentIndex: index,
      ...item
    })
    changeStudentVisible(true, false);
  }

  //添加或者调整学生后更新小组信息
  const updataTeamInfo = (checkedStudents, index) => {
    let list = JSON.parse(JSON.stringify(groupInfoList));
    if (index || index == 0) { //从待分组选择人员
      list[`${index}`].studentUserList = list[`${index}`].studentUserList.concat(checkedStudents);
    } else { //调整人员
      let currentIndex = editItem && editItem["currentIndex"];
      for (let i = 0; i < groupInfoList.length; i++) {
        if (i == currentIndex) {
          list[`${i}`].studentUserList = checkedStudents;
        } else {
          list[`${i}`].studentUserList = differArr(list[`${i}`].studentUserList, checkedStudents);
        }
      }
    }
    updateBigGroupInfo(list);
  }

  //回到顶部
  const toTop = () => {
    let contentArea = document.getElementById("contentArea");
    contentArea.scrollTop = 0;
  }

  const formatList = (list) => {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      let studentUserList = list[i].studentUserList || [];
      arr.push({
        ...list[i],
        studentUserIds: getStuIds(studentUserList)
      })
    }
    return arr;
  }

  const getStuIds = (list) => {
    let arr = [];
    if (list && list.length) {
      list.map(el => {
        arr.push(el.id);
      })
    }
    return arr;
  }

  //更新最新小组信息
  const updateBigGroupInfo = (list, noMessage, callBack) => {
    const { bigGroupId, semesterId, courseId, groupId, bigGroupInfo } = props;

    let payloadObj = {
      bigGroupName: bigGroupInfo.name,
      semesterId,
      courseId,
      groupId,
      type: bigGroupInfo.type,
      open: bigGroupInfo.open,
      teamList: formatList(list),
      bigGroupId,
      tempGroup: true
    }
    props.dispatch({
      type: 'newStudent/saveGroupTeam',
      payload: {
        ...payloadObj
      },
      onSuccess: (id) => {
        if (!noMessage) {
          message.success(trans('global.successToast', '成功'));
        }
        setGroupInfoList(list);
        callBack && callBack();
      }
    })
  }

  //设置分组
  const setBigGroup = () => {
    typeof props.setBigGroup === "function" && props.setBigGroup();
  }

  //待分组成员
  const getWaitGroup = () => {
    const { studentList } = props;
    let arr = [];
    groupInfoList && groupInfoList.map((item) => {
      arr = arr.concat(item.studentUserList);
    })
    return differArr(studentList, arr);
  }

  //比较两个小组的不同
  const differArr = (arr1, arr2) => {
    return arr1.filter(x => !arr2.some(y => y.id == x.id));
  }

  //添加小组
  const addTeam = () => {
    let list = JSON.parse(JSON.stringify(groupInfoList));
    list.push({
      teamId: null,
      teamName: `第${list.length + 1}组`,
      studentUserList: []
    })
    updateBigGroupInfo(list, true, () => {
      setTimeout(() => {
        let el = document.getElementById(`groupInfo${list.length - 1}`);
        el && el.scrollIntoView({ behavior: 'smooth', bAlignToTop: false, inline: 'nearest' });
      }, 10);
    })
  }

  //导出名单
  const exportList = () => {
    const { bigGroupId } = props;
    let origin = window.location.origin.indexOf("yungu.org") > -1 ? 'https://task.yungu.org' : 'https://task.daily.yungu-inc.org';
    let url = `${origin}/api/exportStudentForTeam?bigGroupId=${bigGroupId}`;
    window.location.href = url;
  }

  const editTitle = (item, index) => {
    setEditItem({
      currentIndex: index,
      ...item
    })
    setEditTitleVisible(true);
  }

  const changeEditTitleVisible = (visible) => {
    setEditTitleVisible(visible);
    if (!visible) {
      setEditItem({});
    }
  }

  const updateTeamName = (name) => {
    let list = JSON.parse(JSON.stringify(groupInfoList));
    let currentIndex = editItem && editItem["currentIndex"];
    list[`${currentIndex}`].teamName = name;
    changeEditTitleVisible(false);
    updateBigGroupInfo(list);
  }

  //折叠
  const changeFold = (index, visible) => {
    let groupInfo = JSON.parse(JSON.stringify(groupInfoList));
    let info = groupInfo[`${index}`];
    info.ifFold = visible;
    groupInfo[`${index}`] = info;
    setGroupInfoList(groupInfo);
  }

  const { dataSource, identify, editPermission } = props;
  let ifShowHomePage = identify && identify.indexOf('employee') > -1 ? true : false;//头像是否可以点击
  let waitGroupList = getWaitGroup();
  return <div className={styles.studentList}>
    <div className={props.source ? `${styles.contentWrap} ${styles.classModeContentWrap}` : styles.contentWrap}>
      {renderTitle()}
      {renderContent()}
    </div>
    <div className={styles.bottom}>
      <span className={styles.choose}><Checkbox checked={allPage} onChange={(e) => selectAllStudent(e)}>{trans('student.allCheck', "全选")}</Checkbox></span>
      <span className={styles.operateArea}>
        {
          editPermission && [
            <span className={styles.exportList} onClick={addTeam}><i className={icon.iconfont}>&#xe85b;</i>{trans('student.team', "小组")}</span>,
            <span className={styles.exportList} onClick={setBigGroup}><i className={icon.iconfont}>&#xe6b3;</i>{trans('student.set', "设置")}</span>
          ]
        }
        <span className={styles.exportList} onClick={exportList}><i className={icon.iconfont4}>&#xe6aa;</i>{trans('global.export', '导出')}</span>
        <span className={styles.exportList} onClick={() => changeStudentVisible(true, true)}>{trans('student.toBeGrouped', "待分组")} ({waitGroupList.length || "0"})</span>
      </span>

    </div>
    {
      modalVisible &&
      <ResetPwd
        groupId={props.groupId}
        userId={userId}
        modalVisible={modalVisible}
        handelVisible={handelVisible}
        dispatch={props.dispatch}
      />
    }

    {
      studentVisible &&
      <StudentList
        list={waitGroupList}
        allStudentList={props.studentList || []}
        changeStudentVisible={changeStudentVisible}
        readOnly={readOnly}
        editItem={editItem}
        updataTeamInfo={updataTeamInfo}
        groupInfoList={groupInfoList}
        source={props.source}
      />
    }
    {
      editTitleVisible &&
      <EditTitle
        editItem={editItem}
        changeEditTitleVisible={changeEditTitleVisible}
        updateTeamName={updateTeamName}
      />
    }


  </div>
}

export default connect(mapStateToProps, null)(TableList);