import React, { PureComponent, Fragment } from 'react';
import styles from './step.less';
import { Switch, InputNumber, Radio, Checkbox, message } from 'antd';
import { trans } from '../../../../utils/i18n';

class Step3 extends PureComponent {
    constructor(props) {
        super(props);
        let { isEdit, chooseCourseDetails } = props;
        let elt = chooseCourseDetails;
        let _tabIndex = -1;
        if (isEdit) {
            if (elt.type == 1) {
                // 志愿申报
                _tabIndex = 0;
            } else if (elt.type == 2) {
                // 先到先得
                _tabIndex = 1;
            }
        }
        this.state = {
            tabList: [
                {
                    title: trans('course.step3.voluntary.declaration', '志愿申报'),
                    sub: trans(
                        'course.step3.tabList_0',
                        '学生先填志愿，后台进行志愿分配后再公布结果'
                    ),
                },
                {
                    title: trans('course.step3.first.come.first.served', '先到先得'),
                    sub: trans(
                        'course.step3.tabList_1',
                        '学生提交报名即刻出结果；当报名人数已满时，无法继续报名'
                    ),
                },
            ],
            distributeList: [
                { label: trans('course.step3.gender.balance', '男女均衡'), value: 1 },
                { label: trans('course.step3.population.balance', '人数均衡'), value: 2 },
            ],
            tabIndex: _tabIndex,
            isOpen: (isEdit && elt.isOpen === 0 && true) || false, // 是否开启学分下限
            creditLowerLimit: (isEdit && elt.creditLowerLimit) || 0, // 学分下限
            creditLowerLimitSubmit: (isEdit && elt.creditLowerLimitSubmit) || 0, // 学分下限是否提交（0:不允许；1:允许）
            periodMaxQuantity: (isEdit && elt.periodMaxQuantity) || 0, // 时段最大志愿数量
            quantityNotEnoughSubmit: (isEdit && elt.quantityNotEnoughSubmit) || 0, // 志愿数量不足是否提交（0:不允许；1:允许）
            historyNotSatisfiedPriority:
                (isEdit && elt.historyNotSatisfiedPriority === 1 && true) || false, // 历史未被满足志愿优先
            chooseCourseRuleOpen: (isEdit && elt.chooseCourseRuleOpen === 1 && true) || false, // 选课规则是否开启（相同学科课程需按照级别依次选修）（0:不开启；1:开启）
            courseClassRule: (isEdit && elt.courseClassRule) || 1, // 同课程开始同个班级时规则（1:系统自动分配，男女均衡，人数均衡；2:学生自主选择)
            chooseCourseCurrencyQuantity: (isEdit && elt.chooseCourseCurrencyQuantity) || 0, // 选课币数量
            influenceChoose: (isEdit && elt.influenceChoose === 1 && true) || false, // 选课币的数量是否影响分配志愿结果(0 不影响 ; 1影响)
        };
    }

    componentDidMount() {
        typeof this.props.onRef === 'function' && this.props.onRef(this);
    }

    handleChange = (num, type, e) => {
        if (num === 1) {
            this.setState({
                [type]: e,
            });
        } else if (num === 2) {
            this.setState({
                [type]: e.target.value,
            });
        }
    };

    tabHTML() {
        let { tabList, tabIndex } = this.state;
        return (
            <div className={styles.tab}>
                {tabList.map((el, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            this.setState({
                                tabIndex: i,
                            });
                        }}
                        className={tabIndex === i ? `${styles.active} ${styles.item}` : styles.item}
                    >
                        <div className={styles.a}>{el.title}</div>
                        <div className={styles.b}>{el.sub}</div>
                    </div>
                ))}
            </div>
        );
    }

    // 学分要求
    scoreHTML() {
        let { isOpen, creditLowerLimit, creditLowerLimitSubmit } = this.state;
        return (
            <div className={styles.item}>
                <span className={styles.title}>
                    {trans('course.step3.credit.limit', '学分下限')}
                </span>
                <Switch
                    checked={isOpen}
                    style={{ marginRight: 24 }}
                    onChange={this.handleChange.bind(this, 1, 'isOpen')}
                    checkedChildren={trans('global.open', '开')}
                    unCheckedChildren={trans('global.close', '关')}
                    defaultChecked
                />
                {isOpen && (
                    <Fragment>
                        <span className={styles.sub}>
                            {trans('course.step3.credit.is.less.than', '当提交人学分低于')}
                        </span>
                        <InputNumber
                            value={creditLowerLimit}
                            onChange={this.handleChange.bind(this, 1, 'creditLowerLimit')}
                            style={{ width: 72, marginRight: 24 }}
                            precision={1}
                            step={0.1}
                            min={0}
                        />
                        <span className={styles.sub}>
                            {trans('course.step3.time.sharing', '分时')}:
                        </span>
                        <Radio.Group
                            onChange={this.handleChange.bind(this, 2, 'creditLowerLimitSubmit')}
                            value={creditLowerLimitSubmit}
                        >
                            <Radio value={1}>
                                <span className={styles.radio}>
                                    {trans(
                                        'course.step3.allowed.to.submit',
                                        '允许提交但要提示申报人'
                                    )}
                                </span>
                            </Radio>
                            <Radio value={0}>
                                <span className={styles.radio}>
                                    {trans('course.step3.submission.not.allowed', '不允许提交')}
                                </span>
                            </Radio>
                        </Radio.Group>
                    </Fragment>
                )}
            </div>
        );
    }

    // 同学科，多班级
    subjectAndMoreCourseHTML() {
        let { distributeList, chooseCourseRuleOpen, courseClassRule } = this.state;
        return (
            <Fragment>
                <div className={`${styles.item} ${styles.itemTop}`}>
                    <span className={styles.title}>
                        {trans('course.step3.according.to.their.grades', '同学科按级别依次选修')}
                    </span>
                    <Switch
                        checked={chooseCourseRuleOpen}
                        style={{ marginRight: 24 }}
                        onChange={this.handleChange.bind(this, 1, 'chooseCourseRuleOpen')}
                        checkedChildren="开"
                        unCheckedChildren="关"
                        defaultChecked
                    />
                    <span className={styles.sub}>
                        {trans(
                            'course.step3.rule.one',
                            '可在课程中设置课程级别，学生必须已经修完（或者已经选修）同学科低一级别的课程中的一门；跨学科课程不受此规则约束。'
                        )}
                    </span>
                </div>
                <div className={`${styles.item} ${styles.itemBottom}`}>
                    <span className={`${styles.title} ${styles.textTop}`}>
                        {trans('course.step3.multiple.classes', '同课程同时开设多个班级时')}
                    </span>
                    <Radio.Group
                        onChange={this.handleChange.bind(this, 2, 'courseClassRule')}
                        value={courseClassRule}
                    >
                        <div className={styles.grey}>
                            <Radio value={1}>
                                {trans('course.step3.system.allocates', '系统按规则自动分配')}
                            </Radio>
                            {courseClassRule === 1 && (
                                <Checkbox.Group disabled value={[1, 2]} options={distributeList} />
                            )}
                        </div>
                        <div className={styles.grey}>
                            <Radio value={2}>
                                {trans('course.step3.open.to.students', '开放给学生选择')}
                            </Radio>
                        </div>
                    </Radio.Group>
                </div>
            </Fragment>
        );
    }

    // 资源申报
    voluntaryDeclarationHTML() {
        let {
            periodMaxQuantity,
            quantityNotEnoughSubmit,
            historyNotSatisfiedPriority,
            chooseCourseCurrencyQuantity,
            influenceChoose,
        } = this.state;
        return (
            <div className={styles.content}>
                {this.scoreHTML()}
                <div className={`${styles.item} ${styles.itemTop}`}>
                    <span className={styles.title}>
                        {trans('course.step3.maximum.number', '每个时段最大可报志愿数量')}
                    </span>
                    <InputNumber
                        value={periodMaxQuantity}
                        onChange={this.handleChange.bind(this, 1, 'periodMaxQuantity')}
                        style={{ width: 60 }}
                        max={2}
                        min={0}
                    />
                </div>
                <div className={`${styles.item} ${styles.itemMid}`}>
                    <span className={styles.title}>
                        {trans('course.step3.number.insufficient', '当所选志愿数量不足时')}
                    </span>
                    <Radio.Group
                        onChange={this.handleChange.bind(this, 2, 'quantityNotEnoughSubmit')}
                        value={quantityNotEnoughSubmit}
                    >
                        <Radio value={1}>
                            <span className={styles.radio}>
                                {trans('course.step3.allowed.to.submit', '允许提交但要提示申报人')}
                            </span>
                        </Radio>
                        <Radio value={0}>
                            <span className={styles.radio}>
                                {trans('course.step3.submission.not.allowed', '不允许提交')}
                            </span>
                        </Radio>
                    </Radio.Group>
                </div>
                <div className={`${styles.item} ${styles.itemBottom}`}>
                    <span className={styles.title}>
                        {trans('course.step3.history.volunteer.priority', '历史未被满足的志愿优先')}
                    </span>
                    <Switch
                        checked={historyNotSatisfiedPriority}
                        style={{ marginRight: 24 }}
                        onChange={this.handleChange.bind(this, 1, 'historyNotSatisfiedPriority')}
                        checkedChildren="开"
                        unCheckedChildren="关"
                        defaultChecked
                    />
                    <span className={styles.sub}>
                        {trans(
                            'course.step3.rule.two',
                            '本次选课时，学生报名的课程是曾经落选的志愿，则优先满足该志愿。'
                        )}
                    </span>
                </div>
                {this.subjectAndMoreCourseHTML()}
                <div
                    className={
                        influenceChoose
                            ? `${styles.item} ${styles.itemTop} `
                            : `${styles.item} ${styles.itemTop} ${styles.itemLast}`
                    }
                >
                    <span className={styles.title}>
                        {trans('course.step3.course.currency', '选课币')}
                    </span>
                    <Switch
                        checked={influenceChoose}
                        style={{ marginRight: 24 }}
                        onChange={this.handleChange.bind(this, 1, 'influenceChoose')}
                        checkedChildren="开"
                        unCheckedChildren="关"
                        defaultChecked
                    />
                    <span className={styles.sub}>
                        {trans(
                            'course.step3.rule.three',
                            '本次选课时，学生投入的选课币多少将影响系统分配志愿的结果'
                        )}
                    </span>
                </div>
                {influenceChoose && (
                    <div className={`${styles.item} ${styles.itemBottom}`}>
                        <span className={styles.title}>
                            {trans(
                                'course.step3.course.currency.number',
                                '本次选课发放的选课币数量'
                            )}
                        </span>
                        <InputNumber
                            value={chooseCourseCurrencyQuantity}
                            onChange={this.handleChange.bind(
                                this,
                                1,
                                'chooseCourseCurrencyQuantity'
                            )}
                            style={{ width: 60 }}
                            min={0}
                        />
                    </div>
                )}
            </div>
        );
    }

    // 先到先得
    firstComeFirstServedHTML() {
        return (
            <div className={styles.content}>
                {this.scoreHTML()}
                {this.subjectAndMoreCourseHTML()}
            </div>
        );
    }

    comprehensiveHTML() {
        let { tabIndex } = this.state;
        return (
            <Fragment>
                <div style={{ display: tabIndex === 0 ? 'block' : 'none' }}>
                    {this.voluntaryDeclarationHTML()}
                </div>
                <div style={{ display: tabIndex === 1 ? 'block' : 'none' }}>
                    {this.firstComeFirstServedHTML()}
                </div>
            </Fragment>
        );
    }

    render() {
        return (
            <div className={styles.Step3}>
                {this.tabHTML()}
                {this.comprehensiveHTML()}
            </div>
        );
    }
}

export default Step3;
