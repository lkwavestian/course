// 升年级设置弹窗
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import icon from '../../../../icon.less';
import { Modal, Form, Spin, Button, Icon, Input, Anchor } from 'antd';
import { trans, locale } from '../../../../utils/i18n';

const { Link } = Anchor;
export default class UpGradeSet extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editGroupName: '', // 中文班级名
            editGroupEnName: '', //英文班级名
            requiredId: [], // 没有必填的id
            changeCName: false, // 没有填写的是不是中文的Inpute
            changeEName: false, // 没有填写的是不是英文的Inpute
        };
    }
    editTargetGroupName(grade, group, e) {
        const { dispatch } = this.props;
        this.setState({
            editGroupName: e.target.value,
            gradeDetail: grade,
        });
        dispatch({
            type: 'student/ediGrouptName',
            payload: {
                gradeId: grade.gradeId,
                groupId: group.groupId,
                isEditCName: true,
                newTargetGroupName: e.target.value,
            },
        });
    }

    editTargetGroupEnName(grade, group, e) {
        console.log(grade, group, e, 'grade,group,e');
        const { dispatch } = this.props;
        this.setState({
            editGroupEnName: e.target.value,
            gradeDetail: grade,
        });
        dispatch({
            type: 'student/ediGrouptName',
            payload: {
                gradeId: grade.gradeId,
                groupId: group.groupId,
                isEditEName: true,
                newTargetGroupEnName: e.target.value,
            },
        });
    }

    comfrimUp() {
        const {
            dispatch,
            upgradeConfigurationList,
            selectSchoolId,
            selectSchooYearlId,
            getTreeOrgFirst,
            getNewYearInit,
            closeUpGrade,
        } = this.props;
        console.log(upgradeConfigurationList, 'upgradeConfigurationList');
        let modalList = [];
        let requiredId = [];
        let changeCName = false;
        let changeEName = false;
        console.log(upgradeConfigurationList, 'upgradeConfigurationList');
        upgradeConfigurationList &&
            upgradeConfigurationList.map((item, index) => {
                item.groupChangeModelList.map((el, order) => {
                    console.log(el, 'elel,,,');
                    if (el.targetGroupName == '' || el.targetGroupEnName == '') {
                        console.log(el, el.groupId, 'mmmmmmmmm');
                        requiredId.push(el.groupId);
                    }
                    if (el.targetGroupName == '') {
                        console.log(el, 'targetGroupName +++ ');
                        changeCName = true;
                    }
                    if (el.targetGroupEnName == '') {
                        console.log(el, 'targetGroupEnName +++ ');
                        changeEName = true;
                    }
                    console.log(el, '////el');
                    let obj = {};
                    obj.name = el.targetGroupName;
                    obj.enName = el.targetGroupEnName;
                    obj.groupId = el.groupId;
                    modalList.push(obj);
                });
            });
        this.setState({
            requiredId,
            changeCName,
            changeEName,
        });
        if (requiredId && requiredId.length > 0) {
            console.log(this.state.requiredId, 'requiredId');
            return;
        }
        console.log(modalList, 'oooooo');
        dispatch({
            type: 'student/upGradeForSure',
            payload: {
                schoolId: selectSchoolId,
                schoolYearId: selectSchooYearlId,
                groupNameFinalModels: modalList,
            },
            onSuccess: () => {
                this.props.getTreeOrgFirst();
                this.props.getNewYearInit();
                this.props.fetchTreeNodeDetail();
                this.props.closeUpGrade();
            },
        });
    }
    handleAnchorClick = (e, link) => {
        e.preventDefault();
    };
    render() {
        const { upGradeModal, upgradeConfigurationList } = this.props;
        const { requiredId, changeCName, changeEName } = this.state;
        console.log(changeCName, changeEName, 'changeCName, changeEName');
        return (
            <div>
                <Modal
                    title={<span>升年级设置</span>}
                    visible={upGradeModal}
                    footer={null}
                    onCancel={this.props.closeUpGrade}
                    width="1200px"
                    className={styles.setUpGradeModalStyle}
                >
                    <div className={styles.upGradeList} id={'modal'}>
                        {upgradeConfigurationList &&
                            upgradeConfigurationList.length > 0 &&
                            upgradeConfigurationList.map((item, index) => {
                                return (
                                    <div className={styles.setUpGrade} id={item.enName}>
                                        {item.groupChangeModelList &&
                                            item.groupChangeModelList.length > 0 && (
                                                <div>
                                                    <div className={styles.grade}>
                                                        {locale == 'en' ? item.enName : item.name}
                                                    </div>
                                                    {item.nextGradeName && (
                                                        <i
                                                            className={icon.iconfont}
                                                            style={{ margin: '0 51px' }}
                                                        >
                                                            &#xe7f4;
                                                        </i>
                                                    )}
                                                    {item.nextGradeName && (
                                                        <div className={styles.grade}>
                                                            {locale == 'en'
                                                                ? item.nextGradeEnName
                                                                : item.nextGradeName}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        {item.groupChangeModelList.map((el, order) => {
                                            let isRed = false;
                                            requiredId &&
                                                requiredId.length > 0 &&
                                                requiredId.map((id, num) => {
                                                    if (id == el.groupId) {
                                                        isRed = true;
                                                    }
                                                });
                                            let classCNameStyle =
                                                isRed && changeCName && el.targetGroupName === ''
                                                    ? styles.redClassCName
                                                    : styles.classCName;
                                            let classENameStyle =
                                                isRed && changeEName && el.targetGroupEnName === ''
                                                    ? styles.redClassEName
                                                    : styles.classEName;
                                            console.log(classCNameStyle, 'classCNameStyle');
                                            return (
                                                <div className={styles.later}>
                                                    <span className={styles.sourceName}>
                                                        {el.sourceName}
                                                    </span>
                                                    <i
                                                        className={icon.iconfont}
                                                        style={{ margin: '0 40px' }}
                                                    >
                                                        &#xe7f4;
                                                    </i>
                                                    <span className={styles.targetPrefix}>
                                                        {el.targetPrefix}
                                                    </span>
                                                    <Input
                                                        className={classCNameStyle}
                                                        defaultValue={el.targetGroupName}
                                                        onChange={this.editTargetGroupName.bind(
                                                            this,
                                                            item,
                                                            el
                                                        )}
                                                    ></Input>
                                                    <span className={styles.targetEnPrefix}>
                                                        {el.targetEnPrefix}
                                                    </span>
                                                    <Input
                                                        className={classENameStyle}
                                                        defaultValue={el.targetGroupEnName}
                                                        onChange={this.editTargetGroupEnName.bind(
                                                            this,
                                                            item,
                                                            el
                                                        )}
                                                    ></Input>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                    </div>

                    <div className={styles.fixed}>
                        <Anchor
                            onClick={this.handleAnchorClick}
                            getContainer={() => document.getElementById('modal')}
                        >
                            {upgradeConfigurationList &&
                                upgradeConfigurationList.length > 0 &&
                                upgradeConfigurationList.map((item, index) => {
                                    return <Link href={`#${item.enName}`} title={item.name}></Link>;
                                })}
                        </Anchor>
                    </div>

                    <div className={styles.btns}>
                        <span className={styles.cancelBtnUp} onClick={this.props.closeUpGrade}>
                            取消
                        </span>
                        <span className={styles.submitBtnUp} onClick={this.comfrimUp.bind(this)}>
                            确定
                        </span>
                        {requiredId && requiredId.length > 0 && (
                            <span style={{ color: 'red', marginLeft: '10px' }}>
                                <i style={{ marginRight: '10px' }} className={icon.iconfont}>
                                    &#xe788;
                                </i>
                                还有班级未完成填写
                            </span>
                        )}
                    </div>
                </Modal>
            </div>
        );
    }
}
