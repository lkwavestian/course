import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Input, List, Spin, InputNumber, Checkbox, message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import styles from './index.less';
import icon from '../../icon.less';
import { Drawer } from 'antd-mobile';
import { trans, locale } from '../../utils/i18n';
import { judgeTimeIsSame } from '../../utils/utils';

const week = {
    1: trans('mobile.Mon', '周一'),
    2: trans('mobile.Tue', '周二'),
    3: trans('mobile.Wed', '周三'),
    4: trans('mobile.Thu', '周四'),
    5: trans('mobile.Fri', '周五'),
    6: trans('mobile.Sat', '周六'),
    7: trans('mobile.Sun', '周日'),
};

export default class MobileDetail extends PureComponent {
    formatTxt = (txt) => {
        if (txt && txt != 'undefined') {
            return txt;
        } else {
            return '';
        }
    };

    render() {
        const {
            showCoursePlanningDetail,
            needButton,
            isopen,
            detailVisible,
            lessonId,
            isCheckId,
            checkedLesson,
            isShowPrice,
            isWeide,
            chooseCoursePlanId,
        } = this.props;

        console.log('chooseCoursePlanId: ', chooseCoursePlanId);

        let feeNumber = showCoursePlanningDetail.classFeeType == 1
        ? showCoursePlanningDetail.classFee
        : showCoursePlanningDetail.classFeeType == 2
        ? checkedLesson.classFee
        : 0;

        const sidebar = (
            <div className={styles.submitBox}>
                <div className={styles.submitTop}>
                    <div className={styles.leftBox}>
                        <div
                            className={styles.submitbg}
                            style={{
                                backgroundImage: `url("${showCoursePlanningDetail.courseCover}")`,
                            }}
                        ></div>
                        <div className={styles.topMessage}>
                            <div className={styles.submitPrice}>
                                ￥
                                {(showCoursePlanningDetail.materialCost || 0) +
                                    (showCoursePlanningDetail.classFee || 0)}
                            </div>
                            {this.props.optionalMargin &&
                            this.props.optionalMargin.length &&
                            showCoursePlanningDetail.chooseCoursePlanType === 2 ? (
                                <div className={styles.nowStu}>
                                    {trans('mobile.tip5', '剩余{$num}个名额', {
                                        num:
                                            this.props.optionalMargin[0].maxStudent -
                                                this.props.optionalMargin[0].classNumber || '0',
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div>
                        <i className={icon.iconfont} onClick={this.props.openChange}>
                            &#xe6a9;
                        </i>
                    </div>
                </div>
                <div className={styles.sbumitItem}>
                    <div className={styles.itemTitle}>
                        {trans('mobile.classSelection', '班级选择')}
                    </div>
                    {showCoursePlanningDetail.planningClassModels &&
                    showCoursePlanningDetail.planningClassModels.length
                        ? showCoursePlanningDetail.planningClassModels.map((item) => (
                              <div
                                  className={[
                                      styles.sbumitLesson,
                                      lessonId && lessonId === item.groupId
                                          ? styles.checkedLesson
                                          : '',
                                  ].join(' ')}
                                  onClick={this.props.checkLesson.bind(this, item.id, item.groupId)}
                              >
                                  <span>{locale() == 'en' ? item.enName : item.name}</span>
                                  {judgeTimeIsSame(showCoursePlanningDetail.planningClassModels)
                                      ? '(' +
                                        item.startTimeString.slice(5) +
                                        '~' +
                                        item.endTimeString.slice(5) +
                                        ')'
                                      : item.classTimeModels && item.classTimeModels.length
                                      ? item.classTimeModels.map((i) => (
                                            <span>
                                                ({week[i.weekday]} {i.startTime} {i.endTime})
                                            </span>
                                        ))
                                      : null}
                              </div>
                          ))
                        : null}
                </div>
                {this.props.currentUser && this.props.currentUser.baseExternalSchool ? (
                    <div className={styles.sbumitItem}>
                        <div className={styles.itemTitle}>
                            {trans('mobild.participants', '参与人')}
                        </div>
                        {childrenList && childrenList.length
                            ? childrenList.map((item) => (
                                  <span
                                      className={[
                                          styles.sbumitLesson,
                                          styles.submitStu,
                                          checkStuId && checkStuId === item.childId
                                              ? styles.checkedLesson
                                              : '',
                                      ].join(' ')}
                                      onClick={this.props.checkStu.bind(this, item.childId)}
                                  >
                                      {item.name}
                                  </span>
                              ))
                            : null}
                        <span
                            className={[styles.sbumitLesson, styles.submitStu].join(' ')}
                            onClick={this.props.checkToMessage}
                        >
                            <i className={icon.iconfont}>&#xe7d5;</i>
                        </span>
                    </div>
                ) : null}
                {
                    <div className={styles.sbumitItem}>
                        <div className={styles.itemTitle} style={{ display: 'inline-block' }}>
                            {trans('mobild.refund agreement', '退费协议')}：
                        </div>
                        <span>
                            <Checkbox
                                checked={this.props.agreeRefund}
                                onChange={this.props.changeChecked}
                                style={{ marginLeft: '5px', marginRight: '6px' }}
                            />
                            <span onClick={this.props.checkDetail} style={{ color: '#5381dc' }}>
                                详情查看
                            </span>
                        </span>
                    </div>
                }
                <Modal
                    visible={detailVisible}
                    title="退款协议"
                    onCancel={this.props.closeModal}
                    footer={null}
                >
                    <div
                        className={styles.modalStyle}
                        dangerouslySetInnerHTML={{
                            __html: showCoursePlanningDetail.announcement,
                        }}
                    ></div>
                </Modal>
            </div>
        );

        return (
            <div className={styles.mobileDetail}  id="mobileDetail">
                {showCoursePlanningDetail && showCoursePlanningDetail.courseName ? (
                    <div>
                        <div>
                            <div id="loadingBox" className={styles.loadingBox}>
                                <div className={styles.loaded}></div>
                                <div id="refreshTxtEle" className={styles.loadText}>
                                    释放更新数据
                                </div>
                            </div>
                            <span
                                className={[icon.iconfont, styles.closeModal].join(' ')}
                                onClick={() => {
                                    this.props.detailInstructionVisibleChange();
                                }}
                            >
                                <span>{trans('mobile.return', '返回列表')}</span>
                            </span>
                        </div>
                        {showCoursePlanningDetail && showCoursePlanningDetail.courseCover && (
                            <div
                                style={{
                                    backgroundImage: `url("${showCoursePlanningDetail.courseCover}")`,
                                }}
                                className={styles.detaiImg}
                            ></div>
                        )}

                        {
                            <div className={styles.detailList}>
                                <div className={styles.detailBox}>
                                    <div className={styles.courseTitle}>
                                        {locale() == 'en'
                                            ? showCoursePlanningDetail.courseEnName
                                            : showCoursePlanningDetail.courseName}
                                    </div>
                                    {isShowPrice && (
                                        <div className={styles.price}>
                                            ¥{' '}
                                            {(showCoursePlanningDetail.materialCost || 0) +
                                                (showCoursePlanningDetail.classFee || 0)}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.detailBox}>
                                    {showCoursePlanningDetail.planningClassModels &&
                                    showCoursePlanningDetail.planningClassModels.length &&
                                    showCoursePlanningDetail.planningClassModels.length > 1 ? (
                                        <div className={styles.couseLessonBox}>
                                            {showCoursePlanningDetail.planningClassModels.map(
                                                (item, index) => (
                                                    <div
                                                        className={[
                                                            styles.checkContent,
                                                            item.groupId == isCheckId
                                                                ? isWeide
                                                                    ? styles.WeideStyle
                                                                    : styles.YunguStyle
                                                                : '',
                                                        ].join(' ')}
                                                        onClick={this.props.changeDetaiLesson.bind(
                                                            this,
                                                            item
                                                        )}
                                                    >
                                                        {locale() == 'en' ? item.enName : item.name}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : null}
                                    <div className={styles.classItem}>
                                        <div className={styles.classLabel}>
                                            {trans('mobile.startclasstime', '开班时间：')}
                                        </div>
                                        <div className={styles.classContent}>
                                            <div>
                                                {checkedLesson &&
                                                checkedLesson.classTimeModels &&
                                                checkedLesson.classTimeModels.length > 0 ? (
                                                    <>
                                                        <span>{checkedLesson.time}</span>
                                                        <div>
                                                            {checkedLesson.classTimeModels &&
                                                            checkedLesson.classTimeModels.length
                                                                ? checkedLesson.classTimeModels.map(
                                                                      (i) => (
                                                                          <span>
                                                                              {week[i.weekday]}{' '}
                                                                              {i.startTime}
                                                                              {'-'}
                                                                              {i.endTime}
                                                                              <span>&nbsp;</span>
                                                                          </span>
                                                                      )
                                                                  )
                                                                : null}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {checkedLesson?.startTimeString &&
                                                        checkedLesson?.endTimeString
                                                            ? `${checkedLesson.startTimeString} ~ ${checkedLesson.endTimeString}`
                                                            : null}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.classItem}>
                                        <div className={styles.classLabel}>
                                            {trans('mobile.faceAge', '面向年龄：')}
                                        </div>
                                        <div
                                            style={{
                                                wordBreak: 'break-all',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {checkedLesson.suitGradeList &&
                                            checkedLesson.suitGradeList.length
                                                ? checkedLesson.suitGradeList.map((ite, ind) => (
                                                      <span>
                                                          {locale() == 'en' ? ite.enName : ite.name}
                                                          {ind + 1 !==
                                                          checkedLesson.suitGradeList.length ? (
                                                              <span>、</span>
                                                          ) : null}
                                                      </span>
                                                  ))
                                                : null}
                                            {checkedLesson.maxAge ? (
                                                <div>
                                                    {checkedLesson.minAge}-{checkedLesson.maxAge}
                                                    {trans('mobile.age', '岁')}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className={styles.classItem}>
                                        <div className={styles.classLabel}>
                                            {trans('mobile.teamNumber', '组班人数')}
                                        </div>

                                        <div className={styles.classContent}>
                                            {checkedLesson.minStudentNum}-
                                            {checkedLesson.maxStudentNum}
                                            {trans('global.peopleNew', '人')}
                                        </div>
                                    </div>
                                    <div className={styles.classItem}>
                                        <div className={styles.classLabel}>
                                            {chooseCoursePlanId == 125
                                                ? '加课包:'
                                                : trans('mobile.classcost', '课时费用')}
                                        </div>

                                        <div className={styles.classContent}>
                                            
                                            {feeNumber ? trans('global.classcostNum', '{$num}元/期', {
                                                num:
                                                    showCoursePlanningDetail.classFeeType == 1
                                                        ? showCoursePlanningDetail.classFee
                                                        : showCoursePlanningDetail.classFeeType == 2
                                                        ? checkedLesson.classFee
                                                        : 0,
                                            }) : '无'}
                                        </div>
                                    </div>
                                    <div className={styles.classItem}>
                                        <div className={styles.classLabel}>
                                            {trans('mobile.materialcost', '材料费用')}
                                        </div>

                                        <div className={styles.classContent}>
                                            {showCoursePlanningDetail.materialFeeType == 2
                                                ? `${showCoursePlanningDetail.newMaterialCost}(老生${showCoursePlanningDetail.oldMaterialCost}元/期)`
                                                : trans('global.classcostNum', '{$num}元/期', {
                                                      num:
                                                          showCoursePlanningDetail.materialCost ||
                                                          '0',
                                                  })}
                                            {/* {trans('global.classcostNum', '{$num}元/期', {
                                                num: showCoursePlanningDetail.materialCost || '0',
                                            })} */}
                                        </div>
                                    </div>
                                    {showCoursePlanningDetail.teachingLanguage ? (
                                        <div className={styles.classItem}>
                                            <div className={styles.classLabel}>
                                                {trans('mobile.teachingLanguage', '授课语言')}：
                                            </div>
                                            <span>{showCoursePlanningDetail.teachingLanguage}</span>
                                        </div>
                                    ) : null}
                                    {showCoursePlanningDetail.languageRequirements ? (
                                        <div className={styles.classItem}>
                                            <div className={styles.classLabel}>
                                                {trans(
                                                    'mobile.languageRequirementsNew',
                                                    '报名条件：'
                                                )}
                                            </div>

                                            <span>
                                                {locale() == 'en'
                                                    ? showCoursePlanningDetail.enLanguageRequirements
                                                    : showCoursePlanningDetail.languageRequirements}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                                {showCoursePlanningDetail &&
                                (showCoursePlanningDetail.freePlateContent ||
                                    showCoursePlanningDetail.enFreePlateContent) ? (
                                    <div
                                        className={styles.detailBox}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                locale() == 'en'
                                                    ? showCoursePlanningDetail.enFreePlateContent ||
                                                      ''
                                                    : showCoursePlanningDetail.freePlateContent ||
                                                      '',
                                        }}
                                    ></div>
                                ) : (
                                    <div className={styles.detailBox}>
                                        {showCoursePlanningDetail.pictureUrlModelList &&
                                        showCoursePlanningDetail.pictureUrlModelList.length ? (
                                            <img
                                                src={
                                                    showCoursePlanningDetail.pictureUrlModelList[0]
                                                        .url
                                                }
                                            />
                                        ) : null}
                                        <div className={styles.classTitle}>
                                            {trans('mobile.courseObjectives', '课程目标')}
                                        </div>
                                        <div
                                            className={styles.classDes}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    locale() == 'en'
                                                        ? showCoursePlanningDetail.enCourseObjectives ||
                                                          ''
                                                        : showCoursePlanningDetail.courseObjectives ||
                                                          '',
                                            }}
                                        ></div>
                                        {showCoursePlanningDetail.pictureUrlModelList &&
                                        showCoursePlanningDetail.pictureUrlModelList.length > 1 ? (
                                            <img
                                                src={
                                                    showCoursePlanningDetail.pictureUrlModelList[1]
                                                        .url
                                                }
                                            />
                                        ) : null}
                                        <div className={styles.classTitle}>
                                            {trans('mobile.content', '课程内容')}
                                        </div>
                                        <div
                                            className={styles.classDes}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    locale() == 'en'
                                                        ? showCoursePlanningDetail.enCourseContent ||
                                                          ''
                                                        : showCoursePlanningDetail.courseContent ||
                                                          '',
                                            }}
                                        ></div>
                                        {showCoursePlanningDetail.pictureUrlModelList &&
                                        showCoursePlanningDetail.pictureUrlModelList.length > 2
                                            ? showCoursePlanningDetail.pictureUrlModelList.map(
                                                  (i, ind) => (ind > 1 ? <img src={i.url} /> : null)
                                              )
                                            : null}
                                        <div className={styles.classTitle}>
                                            {trans('mobile.intro', '师资介绍')}
                                        </div>
                                        {locale() == 'en' ? (
                                            showCoursePlanningDetail.enTeacherIntroduction &&
                                            showCoursePlanningDetail.enTeacherIntroduction !==
                                                '' ? (
                                                showCoursePlanningDetail.enTeacherIntroduction.split(
                                                    '$'
                                                )[0] && (
                                                    <div>
                                                        <div className={styles.classTeacher}>
                                                            <span
                                                                className={styles.classTeacherLeft}
                                                            >
                                                                {isWeide
                                                                    ? trans(
                                                                          'mobile.weideTeacher',
                                                                          '威德老师：'
                                                                      )
                                                                    : '本校老师：'}
                                                            </span>
                                                            <span
                                                                className={styles.classTeacherRight}
                                                            >
                                                                {this.formatTxt(
                                                                    showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                        '$'
                                                                    )[0]
                                                                )}
                                                            </span>
                                                        </div>
                                                        {showCoursePlanningDetail.enTeacherIntroduction.split(
                                                            '$'
                                                        ).length > 1
                                                            ? showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                  '$'
                                                              )[1] && (
                                                                  <div
                                                                      className={
                                                                          styles.classTeacher
                                                                      }
                                                                  >
                                                                      <span
                                                                          className={
                                                                              styles.classTeacherLeft
                                                                          }
                                                                      >
                                                                          {trans(
                                                                              'mobile.externalTeacher',
                                                                              '外聘教师：'
                                                                          )}
                                                                      </span>
                                                                      <span
                                                                          className={
                                                                              styles.classTeacherRight
                                                                          }
                                                                      >
                                                                          {this.formatTxt(
                                                                              showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                                  '$'
                                                                              )[1]
                                                                          )}
                                                                      </span>
                                                                  </div>
                                                              )
                                                            : null}
                                                        {showCoursePlanningDetail.enTeacherIntroduction.split(
                                                            '$'
                                                        ).length > 2 &&
                                                        this.formatTxt(
                                                            showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                '$'
                                                            )[2]
                                                        ) ? (
                                                            <div
                                                                className={styles.classDes}
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                            '$'
                                                                        )[2] || '',
                                                                }}
                                                            ></div>
                                                        ) : null}
                                                    </div>
                                                )
                                            ) : null
                                        ) : showCoursePlanningDetail.teacherIntroduction &&
                                          showCoursePlanningDetail.teacherIntroduction !== '' ? (
                                            <div>
                                                {showCoursePlanningDetail.teacherIntroduction.split(
                                                    '$'
                                                )[0] && (
                                                    <div
                                                        className={
                                                            isWeide
                                                                ? styles.classTeacher
                                                                : styles.classYungu
                                                        }
                                                    >
                                                        <span className={styles.classTeacherLeft}>
                                                            {isWeide
                                                                ? trans(
                                                                      'mobile.weideTeacher',
                                                                      '威德老师：'
                                                                  )
                                                                : '本校老师：'}
                                                        </span>
                                                        <span className={styles.classTeacherRight}>
                                                            {this.formatTxt(
                                                                showCoursePlanningDetail.teacherIntroduction.split(
                                                                    '$'
                                                                )[0]
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {showCoursePlanningDetail.teacherIntroduction.split(
                                                    '$'
                                                ).length > 1
                                                    ? showCoursePlanningDetail.teacherIntroduction.split(
                                                          '$'
                                                      )[1] && (
                                                          <div
                                                              className={
                                                                  isWeide
                                                                      ? styles.classTeacher
                                                                      : styles.classYungu
                                                              }
                                                          >
                                                              <span
                                                                  className={
                                                                      styles.classTeacherLeft
                                                                  }
                                                              >
                                                                  {trans(
                                                                      'mobile.externalTeacher',
                                                                      '外聘教师：'
                                                                  )}
                                                              </span>
                                                              <span
                                                                  className={
                                                                      styles.classTeacherRight
                                                                  }
                                                              >
                                                                  {this.formatTxt(
                                                                      showCoursePlanningDetail.teacherIntroduction.split(
                                                                          '$'
                                                                      )[1]
                                                                  )}
                                                              </span>
                                                          </div>
                                                      )
                                                    : null}
                                                {showCoursePlanningDetail.teacherIntroduction.split(
                                                    '$'
                                                ).length > 2 &&
                                                this.formatTxt(
                                                    showCoursePlanningDetail.teacherIntroduction.split(
                                                        '$'
                                                    )[2]
                                                ) ? (
                                                    <div
                                                        className={styles.classDes}
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                showCoursePlanningDetail.teacherIntroduction.split(
                                                                    '$'
                                                                )[2] || '',
                                                        }}
                                                    ></div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                        <div className={styles.classTitle}>
                                            {trans('mobile.preparation', '课前准备')}
                                        </div>
                                        <div
                                            className={styles.classDes}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    locale() == 'en'
                                                        ? showCoursePlanningDetail.enCoursePreparation ||
                                                          ''
                                                        : showCoursePlanningDetail.coursePreparation ||
                                                          '',
                                            }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                ) : null}
                {needButton ? (
                    showCoursePlanningDetail.signUpStatus === 0 ? (
                        <div className={styles.submitButton}>
                            <div className={[styles.submit, styles.started].join(' ')}>
                                {showCoursePlanningDetail.startTime}
                                <span className={styles.startText}>
                                    {trans('global.startChoose', '选课开始')}
                                </span>
                            </div>
                        </div>
                    ) : showCoursePlanningDetail.signUpStatus === 1 ? (
                        <div className={styles.submitButton}>
                            <div onClick={this.props.submit} className={styles.submit}>
                                {trans('mobile.sign', '我要报名')}
                            </div>
                        </div>
                    ) : showCoursePlanningDetail.signUpStatus === 2 ? (
                        <div className={styles.submitButton}>
                            <div className={[styles.submit, styles.ended].join(' ')}>
                                {trans('mobile.endedCourse', '选课已经结束')}
                            </div>
                        </div>
                    ) : null
                ) : null}
                <Drawer
                    className="my-drawer"
                    style={isopen ? { display: 'block' } : { display: 'none' }}
                    enableDragHandle
                    overlayStyle={isopen ? { display: 'block' } : { display: 'none' }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 60 }}
                    sidebar={sidebar}
                    open={isopen}
                    position={'bottom'}
                    onOpenChange={this.props.openChange}
                ></Drawer>
            </div>
        );
    }
}
