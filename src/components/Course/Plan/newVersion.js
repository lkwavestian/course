import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { trans, locale } from '../../../utils/i18n';
import { Table, Tooltip } from 'antd';
import { isEmpty } from 'lodash';

@connect((state) => ({
    teacherPlanData: state.course.teacherPlanData,
}))
export default class NewVersion extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dealedColumns: [],
            dealedTableSourse: [],
            widthNumber: 0,
            isLoading: false,
        };
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    selColSpan = (record, index) => {
        console.log(record, index + 1, 'record');
    };

    renderTeacherList = (teacherList) => {
        return (
            !isEmpty(teacherList) &&
            teacherList.map((item, index) => {
                if (index == teacherList.length - 1) {
                    return item.name;
                } else {
                    return `${item.name}、`;
                }
            })
        );
    };

    getXlsxTeacherPlan = () => {
        const { gradeFilterValue, dispatch, schoolId, semesterValue } = this.props;
        this.setState({
            isLoading: true,
        });
        dispatch({
            type: 'course/searchXlsxTeacherPlan',
            payload: {
                schoolId: schoolId,
                gradeIdList: gradeFilterValue != undefined ? [gradeFilterValue] : [],
                semesterId: semesterValue,
            },
        }).then(() => {
            const { teacherPlanData } = this.props;
            console.log('teacherPlanData: ', teacherPlanData);
            if (!isEmpty(teacherPlanData.xlsxTeachingPlanCourseDTOList)) {
                let tempColumns = [
                    {
                        title: '课程',
                        align: 'center',
                        fixed: 'left',
                        width: 190,
                        children: [
                            {
                                title: '协同备课教师',
                                align: 'center',
                                width: 190,
                                children: [
                                    {
                                        title: '班级',
                                        dataIndex: 'groupName',
                                        key: 'groupName',
                                        width: 126,
                                        align: 'center',
                                    },
                                    {
                                        title: '课时',
                                        dataIndex: 'totalTeachingHour',
                                        key: 'totalTeachingHour',
                                        width: 64,
                                        align: 'center',
                                    },
                                ],
                            },
                        ],
                    },
                ];
                teacherPlanData.xlsxTeachingPlanCourseDTOList &&
                teacherPlanData.xlsxTeachingPlanCourseDTOList.length > 0
                    ? teacherPlanData.xlsxTeachingPlanCourseDTOList.map((item, index) => {
                          let tempTeacherList = [];
                          !isEmpty(item.teacherList) &&
                              item.teacherList.map((element) => {
                                  tempTeacherList.push(element.name);
                              });
                          tempColumns.push({
                              title: (
                                  <Tooltip
                                      title={item.courseName}
                                      className={styles.tableTitleStyle}
                                  >
                                      {item.courseName}
                                  </Tooltip>
                              ),
                              dataIndex: item.courseName,
                              align: 'center',
                              //   onCell: (record, index) => {
                              //       return {
                              //           onClick: (event) => {
                              //               console.log('111', record, index);
                              //           },
                              //       };
                              //   },
                              //   onHeaderCell: (column) => {
                              //       return {
                              //           onClick: (event) => {
                              //               console.log(column, '222');
                              //           },
                              //       };
                              //   },
                              children: [
                                  {
                                      title: (
                                          <Tooltip
                                              title={this.renderTeacherList(item.teacherList)}
                                              //   style={{
                                              //       fontWeight: 400,
                                              //       color: 'rgba(0,0,0,0.65)',
                                              //       overflow: 'hidden',
                                              //       textOverflow: 'ellipsis',
                                              //       whiteSpace: 'nowrap',
                                              //   }}
                                              className={styles.titleStyle}
                                          >
                                              {!isEmpty(item.teacherList)
                                                  ? /* item.teacherList.map((el, idx) => {
                                                        if (idx == item.teacherList.length - 1) {
                                                            return el.name;
                                                        } else {
                                                            return `${el.name}、`;
                                                        }
                                                    }) */
                                                    tempTeacherList.join('、')
                                                  : null}
                                          </Tooltip>
                                      ),
                                      align: 'center',
                                      children: [
                                          {
                                              title: (
                                                  <span
                                                      style={{
                                                          fontWeight: 400,
                                                          color: 'rgba(0,0,0,0.65)',
                                                      }}
                                                  >
                                                      {item.courseTotalLesson}
                                                  </span>
                                              ),
                                              align: 'center',
                                              onCell: (record, index) => {
                                                  return {
                                                      onClick: (event) => {
                                                          console.log('555', record, index);
                                                      },
                                                  };
                                              },
                                              className: 'columnsStyle',
                                              render: (text, record, idx) => {
                                                  return (
                                                      <span
                                                      //   onClick={() =>
                                                      //       this.selColSpan(record, index)
                                                      //   }
                                                      >
                                                          {!isEmpty(
                                                              record.xlsxTeachingPlanDTOList &&
                                                                  record.xlsxTeachingPlanDTOList[
                                                                      index
                                                                  ] &&
                                                                  record.xlsxTeachingPlanDTOList[
                                                                      index
                                                                  ]?.defaultCoursePlanningDTOList
                                                          ) ? (
                                                              <div
                                                                  style={{
                                                                      position: 'absolute',
                                                                      top: 0,
                                                                      left: 0,
                                                                      color: 'rgba(22,119,255,.85)',
                                                                      fontSize: '12px',
                                                                  }}
                                                              >
                                                                  {record.xlsxTeachingPlanDTOList[
                                                                      index
                                                                  ].continuousLesson ? (
                                                                      <div
                                                                          className={
                                                                              styles.colStyle
                                                                          }
                                                                      >{`连${record.xlsxTeachingPlanDTOList[index].continuousLesson}`}</div>
                                                                  ) : null}
                                                                  {record.xlsxTeachingPlanDTOList[
                                                                      index
                                                                  ].combinedGroupLesson ? (
                                                                      <div
                                                                          className={
                                                                              styles.colStyle
                                                                          }
                                                                      >{`合${record.xlsxTeachingPlanDTOList[index].combinedGroupLesson}`}</div>
                                                                  ) : null}
                                                                  {record.xlsxTeachingPlanDTOList[
                                                                      index
                                                                  ].oddNumberWeekLesson ? (
                                                                      <div
                                                                          className={
                                                                              styles.colStyle
                                                                          }
                                                                      >{`单${record.xlsxTeachingPlanDTOList[index].oddNumberWeekLesson}`}</div>
                                                                  ) : null}
                                                                  {record.xlsxTeachingPlanDTOList[
                                                                      index
                                                                  ].evenWeekLesson ? (
                                                                      <div
                                                                          className={
                                                                              styles.colStyle
                                                                          }
                                                                      >{`双${record.xlsxTeachingPlanDTOList[index].evenWeekLesson}`}</div>
                                                                  ) : null}
                                                              </div>
                                                          ) : null}

                                                          {!isEmpty(
                                                              record.xlsxTeachingPlanDTOList &&
                                                                  record.xlsxTeachingPlanDTOList[
                                                                      index
                                                                  ] &&
                                                                  record.xlsxTeachingPlanDTOList[
                                                                      index
                                                                  ]?.defaultCoursePlanningDTOList
                                                          )
                                                              ? record.xlsxTeachingPlanDTOList[
                                                                    index
                                                                ].teacherTotalLesson.map(
                                                                    (el, idx) => {
                                                                        return (
                                                                            <Tooltip
                                                                                title={el}
                                                                                className={
                                                                                    styles.courseTeacherStyle
                                                                                }
                                                                            >
                                                                                {el}
                                                                            </Tooltip>
                                                                        );
                                                                    }
                                                                )
                                                              : //   record.xlsxTeachingPlanDTOList[
                                                                //         index
                                                                //     ].teacherTotalLesson.join('、')
                                                                ''}
                                                      </span>
                                                  );
                                              },
                                          },
                                      ],
                                  },
                              ],
                          });
                      })
                    : null;

                let widthNumber = (tempColumns.length + 1) * 140;

                this.setState({
                    dealedColumns: tempColumns,
                    dealedTableSourse: teacherPlanData.xlsxTeachingPlanGroupDTOList,
                    widthNumber,
                });
            } else {
                this.setState({
                    dealedColumns: teacherPlanData.xlsxTeachingPlanCourseDTOList,
                    dealedTableSourse: teacherPlanData.xlsxTeachingPlanGroupDTOList,
                    widthNumber: 0,
                });
            }
            this.setState({
                isLoading: false,
            });
        });
    };

    render() {
        const { dealedColumns, dealedTableSourse, widthNumber, isLoading } = this.state;
        const {} = this.props;
        return (
            <div>
                <Table
                    loading={isLoading}
                    className={styles.tableConStyle}
                    bordered
                    columns={dealedColumns}
                    dataSource={dealedTableSourse}
                    pagination={false}
                    scroll={{ x: widthNumber, y: `calc(100vh - 300px)` }}
                    onRow={(record, index) => {
                        return {
                            onClick: (event) => {
                                console.log('666', record, index);
                            },
                        };
                    }}
                    // onHeaderRow={(column) => {
                    //     return {
                    //         onClick: () => {
                    //             console.log(column, 'column');
                    //         }, // 点击表头行
                    //     };
                    // }}
                />
            </div>
        );
    }
}
