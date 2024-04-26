//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Form, Select, Dropdown, Menu, Table, Pagination, Button, Tabs, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { trans } from '../../../../utils/i18n';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { TabPane } = Tabs;

@connect((state) => ({
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    transactionsDetailList: state.order.transactionsDetailList,
    busiAndChannelList: state.account.busiAndChannelList,
    gradeDetails: state.order.gradeDetails,
    subjectChief: state.order.subjectChief,
}))
export default class GradeTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tableList: [],
            navTop: false,
        };
        this.$tab = null;
        this.offsetTop = 0;
    }

    componentDidMount() {
        // this.getSubjectChiefList();
        this.props.onRef(this);
        this.$tab = document.getElementById('tab');
        if (this.$tab) {
            this.offsetTop = this.$tab.offsetTop;
            window.addEventListener('scroll', this.handleScroll);
        }
    }

    handleScroll = () => {
        let sTop =
            document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        console.log('this.state.navTop', this.state.navTop);
        if (!this.state.navTop && sTop >= this.offsetTop) {
            this.setState({
                navTop: true,
            });
        }
        if (sTop < this.offsetTop) {
            this.setState({
                navTop: false,
            });
        }
    };

    // 获取年级明细列表
    getSubjectChiefList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'order/gradeDetails',
            payload: {
                stage: this.props.schoolSectionKey,
                semesterId: this.props.semesterValue,
                subjectIdList: this.props.checkIdList,
            },
        });
    };
    getDun = (key, index) => {
        if (key.length > 0 && key.length - 1 !== index) {
            return <span>、</span>;
        }
    };
    menu = (data) => {
        return (
            <Menu className={styles.menuStyle}>
                <Menu.Item>
                    {data.map((el, index) => (
                        <span>
                            {el.name}
                            {this.getDun(data, index)}
                        </span>
                    ))}
                </Menu.Item>
            </Menu>
        );
    };
    render() {
        const { gradeDetails, subjectChief, showClassMentor } = this.props;

        return (
            <div className={styles.dealFlow} style={{ position: 'absolute' }}>
                <table style={{ position: 'relative' }}>
                    <div
                        style={{
                            background: 'rgb(249,249,249)',
                            minHeight: '38px',
                            fontWeight: '500',
                            // position: this.state.navTop ? 'fixed' : null,
                            // top: '20px',
                            // width: this.state.navTop ? '100%' : null,
                            // overflowX: this.state.navTop ? 'scroll' : null,
                            width: '100%',
                            overflowX: 'scroll',
                            display: 'flex',
                            position: 'sticky',
                            top: 0,
                        }}
                        id="tab"
                        className={styles.commonStyleHead}
                    >
                        <div className={styles.commonStyle1}>班级</div>
                        <div className={styles.commonStyle2}>首席导师</div>
                        {this.props.showClassMentor && (
                            <div className={styles.commonStyle3}>班级导师</div>
                        )}

                        {subjectChief &&
                            subjectChief.length > 0 &&
                            subjectChief.map((item, index) => {
                                return (
                                    <div
                                        className={styles.commonStyle}
                                        style={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                        {item.subjectName}
                                    </div>
                                );
                            })}
                    </div>
                    <div style={{ height: '420px' }}>
                        {gradeDetails &&
                            gradeDetails.length > 0 &&
                            gradeDetails.map((item) => {
                                return (
                                    <>
                                        <div
                                            className={styles.head}
                                            style={{ border: '1px solid #e8e8e8', height: '38px' }}
                                            id={item.gradeId}
                                        >
                                            <td colSpan="10">
                                                <span style={{ marginRight: '15px' }}>
                                                    {item.gradeTeacherNumber == 0 ||
                                                    !item.gradeTeacherNumber
                                                        ? null
                                                        : `${item.gradeName}:${item.gradeTeacherNumber} 人`}
                                                </span>
                                                <span style={{ marginRight: '15px' }}>
                                                    年级组长：
                                                    {item.gradeLeaderTeacherName
                                                        ? item.gradeLeaderTeacherName
                                                        : '未设置'}
                                                </span>
                                                {item.gradeOtherTeacher &&
                                                item.gradeOtherTeacher.length > 0 ? (
                                                    <span>
                                                        <span>年级不配班老师：</span>
                                                        {item.gradeOtherTeacher.map(
                                                            (res, index) => {
                                                                return (
                                                                    <span>
                                                                        {res.name}
                                                                        {this.getDun(
                                                                            item.gradeOtherTeacher,
                                                                            index
                                                                        )}
                                                                    </span>
                                                                );
                                                            }
                                                        )}
                                                    </span>
                                                ) : null}
                                            </td>
                                        </div>
                                        {item.classTeacherWorkSheetDTOList &&
                                            item.classTeacherWorkSheetDTOList.length > 0 &&
                                            item.classTeacherWorkSheetDTOList.map((res) => {
                                                return (
                                                    <div
                                                        className={styles.trContent}
                                                        style={{ display: 'flex' }}
                                                    >
                                                        <span className={styles.commonStyle1}>
                                                            {res.groupName}
                                                        </span>
                                                        <span className={styles.commonStyle2}>
                                                            {res.classChiefTeacherName}
                                                        </span>
                                                        {this.props.showClassMentor &&
                                                        res.classTutorList &&
                                                        res.classTutorList.length > 0 ? (
                                                            res.classTutorList.length > 10 ? (
                                                                <span
                                                                    className={styles.commonStyle3}
                                                                >
                                                                    <Dropdown
                                                                        overlay={this.menu(
                                                                            res.classTutorList
                                                                        )}
                                                                        placement="topRight"
                                                                    >
                                                                        <span>
                                                                            {res.classTutorList.map(
                                                                                (el, index) => {
                                                                                    return (
                                                                                        <span>
                                                                                            {
                                                                                                el.name
                                                                                            }
                                                                                            {this.getDun(
                                                                                                res.classTutorList,
                                                                                                index
                                                                                            )}
                                                                                        </span>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </span>
                                                                    </Dropdown>
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className={styles.commonStyle3}
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <div>
                                                                        {res.classTutorList.map(
                                                                            (el, index) => {
                                                                                return (
                                                                                    <span>
                                                                                        {el.name}
                                                                                        {this.getDun(
                                                                                            res.classTutorList,
                                                                                            index
                                                                                        )}
                                                                                    </span>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </span>
                                                            )
                                                        ) : null}

                                                        {subjectChief &&
                                                            subjectChief.length > 0 &&
                                                            subjectChief.map((item, index) => {
                                                                return (
                                                                    <span
                                                                        className={
                                                                            styles.commonStyle
                                                                        }
                                                                    >
                                                                        {res.subjectTeacherList &&
                                                                            res.subjectTeacherList
                                                                                .length > 0 &&
                                                                            res.subjectTeacherList.map(
                                                                                (arr, arrIndex) => {
                                                                                    if (
                                                                                        arr.subjectName ===
                                                                                        item.subjectName
                                                                                    ) {
                                                                                        return (
                                                                                            <>
                                                                                                {arr.teacherList &&
                                                                                                arr
                                                                                                    .teacherList
                                                                                                    .length >
                                                                                                    0 ? (
                                                                                                    arr
                                                                                                        .teacherList
                                                                                                        .length >
                                                                                                    8 ? (
                                                                                                        <Dropdown
                                                                                                            overlay={this.menu(
                                                                                                                arr.teacherList
                                                                                                            )}
                                                                                                            placement="topRight"
                                                                                                        >
                                                                                                            <div>
                                                                                                                {arr.teacherList.map(
                                                                                                                    (
                                                                                                                        query,
                                                                                                                        queryIndex
                                                                                                                    ) => {
                                                                                                                        return (
                                                                                                                            <span>
                                                                                                                                {
                                                                                                                                    query.name
                                                                                                                                }
                                                                                                                                {this.getDun(
                                                                                                                                    arr.teacherList,
                                                                                                                                    queryIndex
                                                                                                                                )}
                                                                                                                            </span>
                                                                                                                        );
                                                                                                                    }
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </Dropdown>
                                                                                                    ) : (
                                                                                                        <div>
                                                                                                            {arr.teacherList.map(
                                                                                                                (
                                                                                                                    query,
                                                                                                                    queryIndex
                                                                                                                ) => {
                                                                                                                    return (
                                                                                                                        <span>
                                                                                                                            {
                                                                                                                                query.name
                                                                                                                            }
                                                                                                                            {this.getDun(
                                                                                                                                arr.teacherList,
                                                                                                                                queryIndex
                                                                                                                            )}
                                                                                                                        </span>
                                                                                                                    );
                                                                                                                }
                                                                                                            )}
                                                                                                        </div>
                                                                                                    )
                                                                                                ) : null}
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                }
                                                                            )}
                                                                    </span>
                                                                );
                                                            })}
                                                    </div>
                                                );
                                            })}
                                    </>
                                );
                            })}
                    </div>
                </table>
            </div>
        );
    }
}
