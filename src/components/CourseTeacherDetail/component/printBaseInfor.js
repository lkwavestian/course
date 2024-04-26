import React from 'react';
import styles from './printBaseInfor.less';
import { Steps, Popover, Icon } from 'antd';
import { trans, locale } from '../../../utils/i18n';
import { number } from 'prop-types';
import cca from '../../../assets/cca.png';

function PrintBaseInfor(props) {
    console.log('props', props);

    let newArr = props.teacherIntroduction && props.teacherIntroduction.split('$');

    newArr &&
        newArr.forEach((item, index) => {
            if (item == 'undefined') {
                newArr[index] = '';
            }
        });

    let suitGradeList = [];
    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            if (item.name) {
                let courseName = props.courseName && props.courseName;
                let nameString = '';
                for (
                    let i = 0;
                    i <
                    (props.planningClassModels[index].name &&
                        props.planningClassModels[index].name.length);
                    i++
                ) {
                    if (props.planningClassModels[index].name[i] != courseName[i]) {
                        nameString += props.planningClassModels[index].name[i];
                    }
                }
                if (item.suitGradeList) {
                    suitGradeList.push({
                        name: nameString,
                        suitGrades: item.suitGradeList,
                    });
                }
            }
        });

    console.log('suitGradeList', suitGradeList);

    let min = [];
    let max = [];
    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            if (item.minStudentNum && typeof item.minStudentNum == 'number') {
                min.push(item.minStudentNum);
            }
            if (typeof item.maxStudentNum && typeof item.maxStudentNum == 'number') {
                max.push(item.maxStudentNum);
            }
        });
    let arr = [...min, ...max];
    arr = arr.sort(function (a, b) {
        return a - b;
    });
    let newMin = arr[0];
    let newMax = arr[arr.length - 1];

    let courseTime = [];

    let courseName = props.courseName && props.courseName;

    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            let nameString = '';
            for (
                let i = 0;
                i <
                (props.planningClassModels[index].name &&
                    props.planningClassModels[index].name.length);
                i++
            ) {
                if (props.planningClassModels[index].name[i] != courseName[i]) {
                    nameString += props.planningClassModels[index].name[i];
                }
            }
            let weekDay = '';
            item.classTimeModels.map((el, ind) => {
                weekDay += `${ind == 0 ? '周' : ''}${props.noToChinese(el.weekday)}${
                    ind != item.classTimeModels.length - 1 ? '、' : ''
                }`;
                if (ind == item.classTimeModels.length - 1) {
                    courseTime.push(
                        `${nameString}  ` +
                            `${weekDay} ` +
                            (Number(el.endTime.split(':')[0] * 60) +
                                Number(el.endTime.split(':')[1]) -
                                (Number(el.startTime.split(':')[0] * 60) +
                                    Number(el.startTime.split(':')[1]))) +
                            '分钟'
                    );
                }
            });
        });

    let newImageList = [];
    props?.pictureUrlModelList &&
        props.pictureUrlModelList.map((item, index) => {
            newImageList.push({
                // ...item,
                uid: index,
                type: 'image/png',
                url: window.location.origin + item.url,
            });
        });

    let pictorialColor = '';
    if (props.subjectList && props.subjectList.length > 0) {
        pictorialColor = props.subjectList[0].color;
    }
    return (
        <>
            <div className={styles.content}>
                <div className={styles.main}>
                    {/* <p style={{ fontSize: '16px' }}>Co-curricular Activity</p> */}
                    <p
                        style={{
                            fontSize: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>Co-curricular Activity</span>
                        <img src={cca} alt="" />
                        {/* <img src={cca}} > */}
                    </p>
                    <hr></hr>
                    <div className={styles.detail}>
                        <span className={styles.left}>
                            <p className={styles.base} style={{ color: pictorialColor }}>
                                {props.courseName ? props.courseName : ''}
                            </p>
                            <p className={styles.two}>
                                {typeof props.coursePlanType == 'number' ? (
                                    <span style={{ backgroundColor: pictorialColor }}>
                                        {props.coursePlanType == 0
                                            ? '新课'
                                            : props.coursePlanType == 1
                                            ? '进阶'
                                            : props.coursePlanType == 2
                                            ? '校队'
                                            : ''}
                                    </span>
                                ) : (
                                    ''
                                )}
                                {typeof props.admissionType == 'number' ? (
                                    <span
                                        style={{
                                            marginLeft: '16px',
                                            backgroundColor: pictorialColor,
                                        }}
                                    >
                                        {props.admissionType == 0
                                            ? '零基础纳新'
                                            : props.admissionType == 1
                                            ? '有条件纳新'
                                            : props.admissionType == 2
                                            ? '不纳新'
                                            : ''}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </p>
                            <p className={styles.three}>
                                <p
                                    className={styles.line}
                                    style={{ background: pictorialColor }}
                                ></p>
                                <p className={styles.four}>
                                    {props.levelList ? (
                                        <span
                                            style={{
                                                background:
                                                    props?.levelList.indexOf('L1') != -1
                                                        ? pictorialColor
                                                        : '#fff',
                                                color:
                                                    props?.levelList.indexOf('L1') != -1
                                                        ? '#fff'
                                                        : pictorialColor,
                                                border:
                                                    props?.levelList.indexOf('L1') != -1
                                                        ? ''
                                                        : '1px solid rgba(1,17,61,0.12)',
                                                width:
                                                    props?.levelList.indexOf('L1') != -1
                                                        ? '35px'
                                                        : '',
                                                height:
                                                    props?.levelList.indexOf('L1') != -1
                                                        ? '35px'
                                                        : '',
                                                lineHeight:
                                                    props?.levelList.indexOf('L1') != -1
                                                        ? '35px'
                                                        : '',
                                                position:
                                                    props?.levelList.indexOf('L1') != -1
                                                        ? 'relative'
                                                        : '',
                                                top:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '-4px'
                                                        : props?.levelList.indexOf('L3') != -1
                                                        ? '-6px'
                                                        : props?.levelList.indexOf('L2') != -1
                                                        ? '-6px'
                                                        : props?.levelList.indexOf('L1') != -1
                                                        ? '-6px'
                                                        : '',
                                                left:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '-4px'
                                                        : props?.levelList.indexOf('L3') != -1
                                                        ? '-5px'
                                                        : props?.levelList.indexOf('L2') != -1
                                                        ? '-2px'
                                                        : props?.levelList.indexOf('L1') != -1
                                                        ? '-6px'
                                                        : '',
                                            }}
                                        >
                                            L1
                                        </span>
                                    ) : (
                                        <span>L1</span>
                                    )}
                                    {props.levelList ? (
                                        <span
                                            style={{
                                                background:
                                                    props?.levelList.indexOf('L2') != -1
                                                        ? pictorialColor
                                                        : '#fff',
                                                color:
                                                    props?.levelList.indexOf('L2') != -1
                                                        ? '#fff'
                                                        : pictorialColor,
                                                border:
                                                    props?.levelList.indexOf('L2') != -1
                                                        ? ''
                                                        : '1px solid rgba(1,17,61,0.12)',
                                                width:
                                                    props?.levelList.indexOf('L2') != -1
                                                        ? '35px'
                                                        : '',
                                                height:
                                                    props?.levelList.indexOf('L2') != -1
                                                        ? '35px'
                                                        : '',
                                                lineHeight:
                                                    props?.levelList.indexOf('L2') != -1
                                                        ? '35px'
                                                        : '',
                                                position:
                                                    props?.levelList.indexOf('L2') != -1
                                                        ? 'relative'
                                                        : '',
                                                top:
                                                    /* props?.levelList.indexOf('L2') != -1
                                                        ? '-6px'
                                                        : '', */
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '-2px'
                                                        : props?.levelList.indexOf('L3') != -1
                                                        ? '-3px'
                                                        : props?.levelList.indexOf('L2') != -1
                                                        ? '-3px'
                                                        : props?.levelList.indexOf('L1') != -1
                                                        ? '-5px'
                                                        : '',
                                                left:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '-2px'
                                                        : props?.levelList.indexOf('L3') != -1
                                                        ? '-5px'
                                                        : props?.levelList.indexOf('L2') != -1
                                                        ? '-8px'
                                                        : props?.levelList.indexOf('L1') != -1
                                                        ? '-9px'
                                                        : '',
                                            }}
                                        >
                                            L2
                                        </span>
                                    ) : (
                                        <span>L2</span>
                                    )}
                                    {props.levelList ? (
                                        <span
                                            style={{
                                                background:
                                                    props?.levelList.indexOf('L3') != -1
                                                        ? pictorialColor
                                                        : '#fff',
                                                color:
                                                    props?.levelList.indexOf('L3') != -1
                                                        ? '#fff'
                                                        : pictorialColor,
                                                border:
                                                    props?.levelList.indexOf('L3') != -1
                                                        ? ''
                                                        : '1px solid rgba(1,17,61,0.12)',
                                                width:
                                                    props?.levelList.indexOf('L3') != -1
                                                        ? '35px'
                                                        : '',
                                                height:
                                                    props?.levelList.indexOf('L3') != -1
                                                        ? '35px'
                                                        : '',
                                                lineHeight:
                                                    props?.levelList.indexOf('L3') != -1
                                                        ? '35px'
                                                        : '',
                                                position:
                                                    props?.levelList.indexOf('L1' || 'L3') != -1
                                                        ? 'relative'
                                                        : '',
                                                top:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '-2px'
                                                        : props?.levelList.indexOf('L3') != -1
                                                        ? '-3px'
                                                        : props?.levelList.indexOf('L2') != -1
                                                        ? '2px'
                                                        : props?.levelList.indexOf('L1') != -1
                                                        ? '0px'
                                                        : '',
                                                left:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '2px'
                                                        : props?.levelList.indexOf('L3') != -1
                                                        ? '-5px'
                                                        : props?.levelList.indexOf('L2') != -1
                                                        ? '-6px'
                                                        : props?.levelList.indexOf('L1') != -1
                                                        ? '-5px'
                                                        : '',
                                            }}
                                        >
                                            L3
                                        </span>
                                    ) : (
                                        <span>L3</span>
                                    )}
                                    {props.levelList ? (
                                        <span
                                            style={{
                                                background:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? pictorialColor
                                                        : '#fff',
                                                color:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '#fff'
                                                        : pictorialColor,
                                                border:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? ''
                                                        : '1px solid rgba(1,17,61,0.12)',
                                                width:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '35px'
                                                        : '',
                                                height:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '35px'
                                                        : '',
                                                lineHeight:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '35px'
                                                        : '',
                                                position:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? 'relative'
                                                        : '',
                                                top:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '-3px'
                                                        : props?.levelList.indexOf('L3') != -1
                                                        ? '-6px'
                                                        : props?.levelList.indexOf('L2') != -1
                                                        ? '-6px'
                                                        : props?.levelList.indexOf('L1') != -1
                                                        ? '-6px'
                                                        : '',
                                                left:
                                                    props?.levelList.indexOf('L4') != -1
                                                        ? '5px'
                                                        : props?.levelList.indexOf('L3') != -1
                                                        ? '0'
                                                        : props?.levelList.indexOf('L2') != -1
                                                        ? '0px'
                                                        : props?.levelList.indexOf('L1') != -1
                                                        ? '0px'
                                                        : '',
                                            }}
                                        >
                                            L4
                                        </span>
                                    ) : (
                                        <span>L4</span>
                                    )}
                                </p>
                                <p className={styles.level}>
                                    <span
                                        style={{
                                            color:
                                                props.levelList &&
                                                props.levelList.indexOf('L1') != -1
                                                    ? pictorialColor
                                                    : pictorialColor
                                                    ? props.hexToRgba(pictorialColor, 0.7)
                                                    : '',
                                            /* opacity:
                                                props.levelList &&
                                                props.levelList.indexOf('L1') != -1
                                                    ? 0.7
                                                    : '', */
                                        }}
                                    >
                                        萌芽
                                    </span>
                                    <span
                                        style={{
                                            color:
                                                props.levelList &&
                                                props.levelList.indexOf('L2') != -1
                                                    ? pictorialColor
                                                    : pictorialColor
                                                    ? props.hexToRgba(pictorialColor, 0.7)
                                                    : '',
                                            /* opacity:
                                                props.levelList &&
                                                props.levelList.indexOf('L2') != -1
                                                    ? 0.7
                                                    : '', */
                                        }}
                                    >
                                        生长
                                    </span>
                                    <span
                                        style={{
                                            color:
                                                props.levelList &&
                                                props.levelList.indexOf('L3') != -1
                                                    ? pictorialColor
                                                    : pictorialColor
                                                    ? props.hexToRgba(pictorialColor, 0.7)
                                                    : '',
                                            /* opacity:
                                                props.levelList &&
                                                props.levelList.indexOf('L3') != -1
                                                    ? 0.7
                                                    : '', */
                                        }}
                                    >
                                        精熟
                                    </span>
                                    <span
                                        style={{
                                            color:
                                                props.levelList &&
                                                props.levelList.indexOf('L4') != -1
                                                    ? pictorialColor
                                                    : pictorialColor
                                                    ? props.hexToRgba(pictorialColor, 0.7)
                                                    : '',
                                            /* opacity:
                                                props.levelList &&
                                                props.levelList.indexOf('L4') != -1
                                                    ? 0.7
                                                    : '', */
                                        }}
                                    >
                                        超越
                                    </span>
                                </p>
                            </p>
                        </span>
                        <span
                            className={styles.right}
                            style={{
                                /* backgroundColor: props.pictorialColor ? props.pictorialColor : '',
                                opacity: props.pictorialColor ? 0.04 : '', */
                                background: pictorialColor
                                    ? pictorialColor
                                        ? props.hexToRgba(pictorialColor, 0.04)
                                        : ''
                                    : '',
                            }}
                        >
                            <p className={styles.grade}>
                                <span>面向年级:</span>
                                <span>
                                    {suitGradeList &&
                                        suitGradeList.map((item, index) => {
                                            return (
                                                <>
                                                    <span
                                                        style={{
                                                            marginRight: item.name ? '5px' : '',
                                                        }}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    {item.suitGrades &&
                                                        item.suitGrades.length > 0 &&
                                                        item.suitGrades.map((item2, index2) => {
                                                            return (
                                                                <>
                                                                    {item2.name}
                                                                    {item.suitGrades.length - 1 ===
                                                                    index2 ? (
                                                                        <br />
                                                                    ) : (
                                                                        '、'
                                                                    )}
                                                                </>
                                                            );
                                                        })}
                                                </>
                                            );
                                        })}
                                </span>
                            </p>
                            <p className={styles.grade} style={{ display: 'flex' }}>
                                <span>上课时间:</span>
                                <span>
                                    {courseTime &&
                                        courseTime.map((item, index) => {
                                            return (
                                                <>
                                                    {item}
                                                    <br />
                                                </>
                                            );
                                        })}
                                </span>
                            </p>
                            {props?.conditionDescription && props.admissionType == 1 ? (
                                <p className={styles.grade}>
                                    <span>报名条件:</span>
                                    <span>
                                        {props?.conditionDescription
                                            ? props.conditionDescription
                                            : ''}
                                    </span>
                                </p>
                            ) : (
                                ''
                            )}
                            {/* <p className={styles.grade}>
                                <span>报名条件:</span>
                                <span>
                                    {props?.conditionDescription ? props.conditionDescription : ''}
                                </span>
                            </p> */}
                            <p className={styles.grade}>
                                <span>每班人数:</span>
                                <span>{newMin && newMax ? `${newMin}-${newMax}人` : ''}</span>
                            </p>
                            <p className={styles.grade}>
                                <span>材料费:</span>
                                <span style={{ marginLeft: '21px' }}>
                                    {props?.materialFeeType == 0
                                        ? '无'
                                        : props?.materialFeeType == 1
                                        ? props?.materialCost + '元'
                                        : props?.materialFeeType == 2
                                        ? props?.newMaterialCost +
                                          '(' +
                                          '老生' +
                                          props?.oldMaterialCost +
                                          '元' +
                                          ')'
                                        : ''}
                                </span>
                            </p>
                        </span>
                    </div>
                    <div className={styles.bottom}>
                        <span className={styles.left}>
                            <div className={styles.target}>
                                <p>课程目标</p>
                                <p>{props.courseObjectives}</p>
                            </div>
                            <div className={styles.Ccontent}>
                                <p>课程内容</p>
                                <p>{props.courseContent}</p>
                            </div>
                            <div className={styles.teacher}>
                                <p>师资介绍</p>
                                <p>
                                    {newArr && newArr.length > 0 && newArr[0] ? (
                                        <span
                                            style={{
                                                background: pictorialColor
                                                    ? pictorialColor
                                                        ? props.hexToRgba(pictorialColor, 0.12)
                                                        : ''
                                                    : '',
                                                // opacity: 0.12,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: pictorialColor,

                                                    opacity: 1,
                                                }}
                                            >
                                                本校老师：
                                            </span>
                                            <span
                                                style={{
                                                    color: pictorialColor,
                                                    opacity: 1,
                                                }}
                                            >
                                                {newArr && newArr.length > 0 ? newArr[0] : ''}
                                            </span>
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                    {newArr && newArr.length > 1 && newArr[1] ? (
                                        <span
                                            style={{
                                                marginLeft: '8px',
                                                background: pictorialColor
                                                    ? pictorialColor
                                                        ? props.hexToRgba(pictorialColor, 0.12)
                                                        : ''
                                                    : '',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: pictorialColor,
                                                    opacity: 1,
                                                }}
                                            >
                                                外聘老师：
                                            </span>
                                            <span
                                                style={{
                                                    color: pictorialColor,
                                                    opacity: 1,
                                                }}
                                            >
                                                {newArr && newArr.length > 1 ? newArr[1] : ''}
                                            </span>
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </p>
                                <p style={{ whiteSpace: 'pre-wrap' }}>
                                    {newArr && newArr.length > 2 ? newArr[2] : ''}
                                </p>
                            </div>
                            <div className={styles.prepation}>
                                <p>
                                    <span>{trans('mobile.preparation', '课前准备')}</span>
                                    <span>含报名材料、材料费说明等</span>
                                </p>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{props.coursePreparation}</p>
                            </div>
                        </span>
                        <span className={styles.right}>
                            {props &&
                            props.pictureUrlModelList &&
                            props.pictureUrlModelList.length > 0 ? (
                                <p>
                                    <img
                                        style={{
                                            height:
                                                props?.pictureType && props.pictureType == 1
                                                    ? '244px'
                                                    : //   '185px'
                                                    props.pictureType && props.pictureType == 2
                                                    ? '200px'
                                                    : //   '152px'
                                                    props.pictureType && props.pictureType == 3
                                                    ? // ? '280px'
                                                      '370px'
                                                    : '',
                                        }}
                                        src={
                                            props &&
                                            props.pictureUrlModelList &&
                                            props.pictureUrlModelList.length > 0
                                                ? window.location.origin +
                                                  props.pictureUrlModelList[0].url
                                                : ''
                                        }
                                        alt=""
                                    ></img>
                                </p>
                            ) : (
                                ''
                            )}

                            {props &&
                            props.pictureUrlModelList &&
                            props.pictureUrlModelList.length > 1 ? (
                                <p>
                                    <img
                                        style={{
                                            height:
                                                props?.pictureType && props.pictureType == 1
                                                    ? '244px'
                                                    : //   '185px'
                                                    props.pictureType && props.pictureType == 2
                                                    ? '200px'
                                                    : //   '152px'
                                                    props.pictureType && props.pictureType == 3
                                                    ? '370px'
                                                    : //   '280px'
                                                      '',
                                        }}
                                        src={
                                            props &&
                                            props.pictureUrlModelList &&
                                            props.pictureUrlModelList.length > 1
                                                ? window.location.origin +
                                                  props.pictureUrlModelList[1].url
                                                : ''
                                        }
                                        alt=""
                                    ></img>
                                </p>
                            ) : (
                                ''
                            )}

                            {/* {props?.pictureType && props.pictureType == 3 ? ( */}
                            {props &&
                            props.pictureUrlModelList &&
                            props.pictureUrlModelList.length > 2 ? (
                                <p>
                                    <img
                                        style={{
                                            height:
                                                props?.pictureType && props.pictureType == 1
                                                    ? '244px'
                                                    : //   '152px'
                                                    props.pictureType && props.pictureType == 2
                                                    ? '330px'
                                                    : //   '250px'
                                                      '0',
                                        }}
                                        src={
                                            props &&
                                            props.pictureUrlModelList &&
                                            props.pictureUrlModelList.length > 2
                                                ? window.location.origin +
                                                  props.pictureUrlModelList[2].url
                                                : ''
                                        }
                                        alt=""
                                    ></img>
                                </p>
                            ) : (
                                ''
                            )}
                        </span>
                    </div>
                </div>
            </div>
            {/* <hr className={styles.horizon} />
            <span className={styles.tips}>以下内容超出一页A4显示范围</span> */}
        </>
    );
}

export default PrintBaseInfor;
