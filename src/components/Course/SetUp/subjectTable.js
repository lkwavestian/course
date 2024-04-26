import React from 'react';
import {
    Table,
    Icon,
    Pagination,
    Input,
    Button,
    Modal,
    message,
    Divider,
    Form,
    Upload,
    Checkbox,
    Select,
    Radio,
} from 'antd';
import { connect } from 'dva';
import reqwest from 'reqwest';
import styles from './index.less';
import { trans, locale } from '../../../utils/i18n';
import { debounce } from '../../../utils/utils';
import lodash, { isEmpty } from 'lodash';
import icon from '../../../icon.less';

const { Search } = Input;
const confirm = Modal.confirm;
const { Option } = Select;

const colorList = [
    '#1EA5FC',
    '#00C0DF',
    '#00ACAA',
    '#0F6D8E',
    '#0054AF',
    '#F9B100',
    '#EB7D37',
    '#FC592A',
    '#E61220',
    '#788991',
    '#48AC4F',
    '#466D1B',
    '#937963',
    '#BA7C47',
    '#8B5161',
    '#8962F8',
    '#DA45BB',
    '#F05A8F',
];
const STAGE_NAME = {
    1: trans('course.plan.kindergarten', '幼儿园'),
    2: trans('course.plan.primarySchool', '小学'),
    3: trans('course.plan.juniorSchool', '初中'),
    4: trans('course.plan.highSchool', '高中'),
};
@connect((state) => ({
    listKeywordSubject: state.course.listKeywordSubject,
    suitStageList: state.course.suitStageList,
}))
class SubjectTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // 页面数据正在加载中
            currentPage: 1,
            pageSize: 50,
            orgSubjectList: [],
            total: 0,
            keywords: '', // 搜索关键字
            visibleNewSubject: false, // 新建学科弹窗默认是隐藏
            visibleNewAreas: false, // 新领域弹窗默认是隐藏
            isNewAreaBtn: true, // 创建新领域默认
            subjectId: undefined,
            name: undefined,
            enName: undefined,
            lyName: undefined, // 领域中文名
            lyEname: undefined, // 领域英文名
            index: 0,
            isEdit: false, // 默认学科是编辑状态
            visibleFromExcel: false, // 从Excel导入弹层显隐
            fileList: [],
            sortNo: undefined,
            stage: [],
            selectedColor: '#1EA5FC',
            filterStageId: '',
            charperValue: true, //启用章节目录
            knowledgeValue: true, //启用知识点
            teachingVersion: undefined, //章节目录教材版本
            knowledgeTeachingMaterial: undefined, //知识点教材版本
        };
    }

    componentDidMount() {
        this.fetchSuitStage();
        this.initList();
    }

    initList = () => {
        const { dispatch } = this.props;
        const { currentPage, pageSize, keywords } = this.state;
        this.setState({
            loading: true,
        });
        dispatch({
            type: 'course/listKeywordSubject',
            payload: {
                pageNum: currentPage,
                pageSize,
                keywords: keywords || '',
                suitStages: this.state.filterStageId ? [this.state.filterStageId] : [],
            },
            onSuccess: (data) => {
                if (data) {
                    let { orgSubjectList, total } = data;
                    this.setState({
                        orgSubjectList,
                        loading: false,
                        total,
                    });
                }
            },
        });
    };

    getColumns() {
        const { orgSubjectList } = this.state;
        return [
            {
                title: trans('global.subjectName', '学科名称'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                width: 180,
            },
            {
                title: trans('global.subjectEName', '学科英文名'),
                dataIndex: 'enName',
                key: 'enName',
                align: 'center',
                width: 180,
            },
            {
                title: trans('global.subjectArea', '领域'),
                dataIndex: 'courseCode',
                key: 'courseCode',
                align: 'center',
                width: 130,
                render: (tag) => (
                    <span style={{ color: '#969fa9' }}>
                        {orgSubjectList &&
                            orgSubjectList.map((item, index) => {
                                return <span>{item.courseCode ? item.courseCode : null}</span>;
                            })}
                    </span>
                ),
            },
            {
                title: trans('course.step1.applicable.section', '适用学段'),
                dataIndex: 'stageIds',
                key: 'stageIds',
                align: 'center',
                width: 130,
                render: (text, record) => {
                    return record.stageIds && record.stageIds.length > 0 ? (
                        record.stageIds.map((item, index) => (
                            <span className={styles.stageStyle} key={item}>
                                {index != record.stageIds.length - 1
                                    ? `${STAGE_NAME[item]}，`
                                    : STAGE_NAME[item]}
                            </span>
                        ))
                    ) : (
                        <span></span>
                    );
                },
            },
            {
                title: trans('global.sortNo.', '排序'),
                dataIndex: 'sortNo',
                key: 'sortNo',
                align: 'center',
                width: 90,
            },
            {
                title: locale() == 'en' ? 'Subject Color' : '课表颜色',
                dataIndex: 'color',
                key: 'color',
                align: 'center',
                width: 90,
                render: (text, record) => (
                    <span
                        className={styles.tableColorBox}
                        style={{ backgroundColor: record.color }}
                    />
                ),
            },
            {
                title: trans('global.subjectNumber', '关联课程数量'),
                dataIndex: 'relatedcCoursesNumber',
                key: 'relatedcCoursesNumber',
                align: 'center',
                width: 90,
            },
            {
                title: '章节目录',
                dataIndex: 'chapterEnable',
                key: 'chapterEnable',
                align: 'center',
                width: 80,
                render: (text, record, index) => {
                    return text == true ? '启用' : text == false ? '不启用' : null;
                },
            },
            {
                title: '章节目录教材版本',
                dataIndex: 'teachingMaterial',
                key: 'teachingMaterial',
                align: 'center',
                width: 150,
                render: (text, record, index) => {
                    return text == 'ZHE_JIAO'
                        ? '浙教版'
                        : text == 'REN_JIAO'
                        ? '人教版'
                        : text == 'WAI_YAN'
                        ? '外研版(一年级起点)'
                        : text == 'QING_DAO'
                        ? '青岛版(六三职)'
                        : text == 'XIANG_MEI'
                        ? '湘美版'
                        : text == 'ZI_YAN'
                        ? '自研版'
                        : text == 'BU_BIAN'
                        ? '部编版'
                        : text == 'REN_JIAO_XIN_KE_BIAO_B'
                        ? '人教新课标B版'
                        : text == 'XIANG_WEN_YI_BAN'
                        ? '湘文艺版'
                        : text == 'REN_MEI'
                        ? '人美版'
                        : text == 'HUA_DONG_SHI_DA'
                        ? '华东师大版'
                        : text == 'YUE_JIAO'
                        ? '粤教版'
                        : text == 'YUE_KE'
                        ? '粤科版'
                        : text == "WAI_YAN_CHU_ZHONG" 
                        ? '外研（初中）'
                        : text == "JI_NAN" 
                        ? '济南'
                        : text == "XIANG_JIAO" 
                        ? '湘教版'
                        : text == "ZHEJIANG_SHENDING" 
                        ? '浙江省审定版'
                        : text == "ZHE_JIAO_YUNGU" 
                        ? '浙教版(云谷)'
                        : text == "REN_JIAO_YUNGU" 
                        ? '人教版(云谷)'
                        : text == "HU_JIAO" 
                        ? '沪教版'
                        :  text == "BU_BIAN_FIVE_FOUR" 
                        ? '部编版(五四制)'
                        :  text == "ZHONG_TU" 
                        ? '中图版'
                        :  text == "NIU_JIN_SHANG_HAI" 
                        ? '牛津上海版'
                        :  text == "SHANG_HAI_WAI_JIAO" 
                        ? '上海外教班'
                        : null;
                },
            },
            {
                title: '知识点',
                dataIndex: 'knowledgeEnable',
                key: 'knowledgeEnable',
                align: 'center',
                width: 80,
                render: (text, record, index) => {
                    return text == true ? '启用' : text == false ? '不启用' : null;
                },
            },
            {
                title: '知识点教材版本',
                dataIndex: 'knowledgeTeachingMaterial',
                key: 'knowledgeTeachingMaterial',
                align: 'center',
                width: 150,
                render: (text, record, index) => {
                    return text == 'ZHE_JIAO'
                        ? '浙教版'
                        : text == 'REN_JIAO'
                        ? '人教版'
                        : text == 'WAI_YAN'
                        ? '外研版(一年级起点)'
                        : text == 'QING_DAO'
                        ? '青岛版(六三职)'
                        : text == 'XIANG_MEI'
                        ? '湘美版'
                        : text == 'ZI_YAN'
                        ? '自研版'
                        : text == 'BU_BIAN'
                        ? '部编版'
                        : text == 'REN_JIAO_XIN_KE_BIAO_B'
                        ? '人教新课标B版'
                        : text == 'XIANG_WEN_YI_BAN'
                        ? '湘文艺版'
                        : text == 'REN_MEI'
                        ? '人美版'
                        : text == 'HUA_DONG_SHI_DA'
                        ? '华东师大版'
                        : text == 'YUE_JIAO'
                        ? '粤教版'
                        : text == 'YUE_KE'
                        ? '粤科版'
                        : text == "WAI_YAN_CHU_ZHONG" 
                        ? '外研（初中）'
                        : text == "JI_NAN" 
                        ? '济南'
                        : text == "XIANG_JIAO" 
                        ? '湘教版'
                        : text == "ZHEJIANG_SHENDING" 
                        ? '浙江省审定版'
                        : text == "ZHE_JIAO_YUNGU" 
                        ? '浙教版(云谷)'
                        : text == "REN_JIAO_YUNGU" 
                        ? '人教版(云谷)'
                        : text == "HU_JIAO" 
                        ? '沪教版'
                        :  text == "BU_BIAN_FIVE_FOUR" 
                        ? '部编版(五四制)'
                        :  text == "ZHONG_TU" 
                        ? '中图版'
                        :  text == "NIU_JIN_SHANG_HAI" 
                        ? '牛津上海版'
                        :  text == "SHANG_HAI_WAI_JIAO" 
                        ? '上海外教班'
                        : null;
                },
            },
            {
                title: trans('student.opeation', '操作'),
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                width: 180,
                fixed: 'right',
                render: (tag, item) => (
                    <>
                        <a size="small" onClick={this.showNewSubject.bind(this, item)}>
                            {trans('global.edit', '编辑')}
                        </a>
                        <Divider type="vertical" />
                        <a size="small" onClick={this.del.bind(this, item)}>
                            {trans('global.delete', '删除')}
                        </a>
                    </>
                ),
            },
        ];
    }

    del = (item) => {
        let self = this;
        let { orgSubjectList } = this.state;
        confirm({
            title: trans('global.deleteIf', '是否删除该学科？'),
            content: null,
            onOk() {
                const { dispatch } = self.props;
                dispatch({
                    type: 'course/deleteSubject',
                    payload: {
                        id: item.id,
                    },
                    onSuccess: (data) => {
                        orgSubjectList.splice(item.index, 1);
                        self.setState({
                            orgSubjectList,
                        });
                    },
                });
            },
            onCancel() {},
        });
    };

    showNewSubject = (item) => {
        this.setState({
            name: item.name,
            enName: item.enName,
            visibleNewSubject: true,
            index: item.index,
            subjectId: item.id,
            sortNo: item.sortNo,
            isEdit: false,
            stage: item.stageIds || [],
            selectedColor: item.color,
            subjectTitle: '编辑学科',
            charperValue: item.chapterEnable,
            knowledgeValue: item.knowledgeEnable,
            teachingVersion: item.teachingMaterial,
            knowledgeTeachingMaterial: item.knowledgeTeachingMaterial,
        });
    };

    //切换分页
    switchPage = (page, size) => {
        this.setState(
            {
                currentPage: page,
                pageSize: size,
            },
            () => {
                this.initList();
            }
        );
    };

    //切换每页条数
    switchPageSize = (page, size) => {
        this.setState(
            {
                currentPage: page,
                pageSize: size,
            },
            () => {
                this.initList();
            }
        );
    };

    handleChange = (type, e) => {
        this.setState({
            [type]: e.target.value,
        });
    };

    subjectListHTML() {
        let { loading, currentPage, pageSize, orgSubjectList, total } = this.state;
        return (
            <div className={styles.CourseTable}>
                <Table
                    loading={{
                        indicator: <Icon type="loading" />,
                        spinning: loading,
                        tip: '课程列表正在努力加载中...',
                    }}
                    bordered={true}
                    scroll={{ x: 920, y: 700 }}
                    dataSource={orgSubjectList}
                    columns={this.getColumns()}
                    pagination={false}
                />
                <div className={styles.pagination}>
                    <Pagination
                        showSizeChanger
                        showQuickJumper
                        current={currentPage}
                        total={total}
                        locale="zh-CN"
                        defaultPageSize={pageSize}
                        pageSizeOptions={['20', '50', '100', '500', '1000']}
                        onChange={this.switchPage}
                        onShowSizeChange={this.switchPageSize}
                    />
                </div>
            </div>
        );
    }

    handleCancel = (type) => {
        this.setState({
            [type]: false,
            isEdit: false,
            name: undefined,
            enName: undefined,
            sortNo: undefined,
            stage: [],
            selectedColor: '#1EA5FC',
        });
    };

    titleHTML(type) {
        return (
            <div className={styles.courseNav}>
                <span onClick={this.handleCancel.bind(this, type)} className={styles.icon}>
                    <Icon type="close" />
                </span>
                <span>{this.state.subjectTitle}</span>
                <div></div>
            </div>
        );
    }

    //选择学段
    changeStage = (stage) => {
        this.setState({
            stage,
        });
    };

    //选择课程颜色
    changeColor = (selectedColor) => {
        this.setState({
            selectedColor,
        });
    };

    //查询适用学段
    fetchSuitStage() {
        this.props.dispatch({
            type: 'course/fetchSuitStage',
            payload: {},
        });
    }

    //是否启用章节目录
    changeCharper = (e) => {
        this.setState({
            charperValue: e.target.value,
        });
    };

    //是否启用知识点
    changeKnowledge = (e) => {
        this.setState({
            knowledgeValue: e.target.value,
        });
    };

    //选择章节目录教材版本
    changeVersion = (value) => {
        this.setState({
            teachingVersion: value,
        });
    };

    //选择知识点教材版本
    changeKnowledgeVersion = (value) => {
        this.setState({
            knowledgeTeachingMaterial: value,
        });
    };

    newSubjectHTML() {
        const { suitStageList } = this.props;
        let {
            name,
            enName,
            sortNo,
            charperValue,
            knowledgeValue,
            teachingVersion,
            knowledgeTeachingMaterial,
        } = this.state;
        return (
            <Modal
                title={this.titleHTML('visibleNewSubject')}
                closable={false}
                maskClosable={false}
                visible={this.state.visibleNewSubject}
                onCancel={this.handleCancel.bind(this, 'visibleNewSubject')}
                onOk={this.handleOkNewSubject}
                className={styles.subjectModalWrap}
                width={611}
            >
                <div className={styles.NewSubjectModal}>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            <em>*</em>
                            <span>{trans('charge.chineseName', '中文名称')}</span>
                        </div>
                        <Input
                            value={name}
                            onChange={this.handleChange.bind(this, 'name')}
                            placeholder={trans('global.please.fill.in', '请填写')}
                        />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            <em>*</em>
                            <span>{trans('charge.enName', '英文名称')}</span>
                        </div>
                        <Input
                            value={enName}
                            onChange={this.handleChange.bind(this, 'enName')}
                            placeholder={trans('global.please.fill.in', '请填写')}
                        />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            <em>*</em>
                            <span>{trans('course.step1.applicable.section', '适用学段')}</span>
                        </div>
                        <Checkbox.Group onChange={this.changeStage} value={this.state.stage}>
                            {suitStageList && suitStageList.length > 0
                                ? suitStageList.map((item) => (
                                      <Checkbox value={item} key={item}>
                                          {STAGE_NAME[item]}
                                      </Checkbox>
                                  ))
                                : null}
                        </Checkbox.Group>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            <em>*</em>
                            <span>{trans('charge.sortNo', '排序')}</span>
                        </div>
                        <Input
                            value={sortNo}
                            onChange={this.handleChange.bind(this, 'sortNo')}
                            placeholder="填写数字，学科展示时按数字从小到大排序"
                        />
                    </div>

                    <div className={styles.item}>
                        <div className={styles.title}>章节目录</div>
                        <Radio.Group
                            onChange={this.changeCharper}
                            value={charperValue}
                            // style={{ marginTop: 7 }}
                        >
                            <Radio value={true}>启用</Radio>
                            <Radio value={false}>不启用</Radio>
                        </Radio.Group>
                        {charperValue && (
                            <span>
                                <span className={styles.title} style={{ marginInlineStart: 10 }}>
                                    教材版本
                                </span>
                                <span className={styles.select}>
                                    <span className={styles.elt}>
                                        <Select
                                            style={{ width: 150 }}
                                            className={styles.selectStyle}
                                            value={teachingVersion}
                                            placeholder="请选择教材版本"
                                            onChange={this.changeVersion}
                                        >
                                            <Option value={'ZHE_JIAO'}>浙教版</Option>
                                            <Option value={'REN_JIAO'}>人教版</Option>
                                            <Option value={'WAI_YAN'}>外研版(一年级起点)</Option>
                                            <Option value={'QING_DAO'}>青岛版(六三职)</Option>
                                            <Option value={'XIANG_MEI'}>湘美版</Option>
                                            <Option value={'ZI_YAN'}>自研版</Option>
                                            <Option value={'BU_BIAN'}>部编版</Option>
                                            <Option value={'REN_JIAO_XIN_KE_BIAO_B'}>
                                                人教新课标B版
                                            </Option>
                                            <Option value={'XIANG_WEN_YI_BAN'}>湘文艺版</Option>
                                            <Option value={'REN_MEI'}>人美版</Option>
                                            <Option value={'HUA_DONG_SHI_DA'}>华东师大版</Option>
                                            <Option value={'YUE_JIAO'}>粤教版</Option>
                                            <Option value={'YUE_KE'}>粤科版</Option>

                                            <Option value={'WAI_YAN_CHU_ZHONG'}>外研（初中）</Option>
                                            <Option value={'JI_NAN'}>济南</Option>
                                            <Option value={'XIANG_JIAO'}>湘教版</Option>

                                            <Option value={'ZHEJIANG_SHENDING'}>浙江省审定版</Option>
                                            <Option value={'ZHE_JIAO_YUNGU'}>浙教版(云谷)</Option>
                                            <Option value={'REN_JIAO_YUNGU'}>人教版(云谷)</Option>
                                            <Option value={'HU_JIAO'}>沪教版</Option>
                                            <Option value={'BU_BIAN_FIVE_FOUR'}>部编版(五四制)</Option>
                                            <Option value={'ZHONG_TU'}>中图版</Option>
                                            <Option value={'NIU_JIN_SHANG_HAI'}>牛津上海版</Option>
                                            <Option value={'SHANG_HAI_WAI_JIAO'}>上海外教班</Option>
                                        </Select>
                                    </span>
                                </span>
                            </span>
                        )}
                    </div>

                    <div className={styles.item}>
                        <div className={styles.title}>知识点</div>
                        <Radio.Group
                            onChange={this.changeKnowledge}
                            value={knowledgeValue}
                            // style={{ marginTop: 7 }}
                        >
                            <Radio value={true}>启用</Radio>
                            <Radio value={false}>不启用</Radio>
                        </Radio.Group>
                        {knowledgeValue && (
                            <span>
                                <span className={styles.title} style={{ marginInlineStart: 10 }}>
                                    教材版本
                                </span>
                                <span className={styles.select}>
                                    <span className={styles.elt}>
                                        <Select
                                            style={{ width: 150 }}
                                            className={styles.selectStyle}
                                            value={knowledgeTeachingMaterial}
                                            placeholder="请选择教材版本"
                                            onChange={this.changeKnowledgeVersion}
                                        >
                                            <Option value={'ZHE_JIAO'}>浙教版</Option>
                                            <Option value={'REN_JIAO'}>人教版</Option>
                                            <Option value={'WAI_YAN'}>外研版(一年级起点)</Option>
                                            <Option value={'QING_DAO'}>青岛版(六三职)</Option>
                                            <Option value={'XIANG_MEI'}>湘美版</Option>
                                            <Option value={'ZI_YAN'}>自研版</Option>
                                            <Option value={'BU_BIAN'}>部编版</Option>
                                            <Option value={'REN_JIAO_XIN_KE_BIAO_B'}>
                                                人教新课标B版
                                            </Option>
                                            <Option value={'XIANG_WEN_YI_BAN'}>湘文艺版</Option>
                                            <Option value={'REN_MEI'}>人美版</Option>
                                            <Option value={'HUA_DONG_SHI_DA'}>华东师大版</Option>
                                            <Option value={'YUE_JIAO'}>粤教版</Option>
                                            <Option value={'YUE_KE'}>粤科版</Option>

                                            <Option value={'WAI_YAN_CHU_ZHONG'}>外研（初中）</Option>
                                            <Option value={'JI_NAN'}>济南</Option>
                                            <Option value={'XIANG_JIAO'}>湘教版</Option>

                                            <Option value={'ZHEJIANG_SHENDING'}>浙江省审定版</Option>
                                            <Option value={'ZHE_JIAO_YUNGU'}>浙教版(云谷)</Option>
                                            <Option value={'REN_JIAO_YUNGU'}>人教版(云谷)</Option>
                                            <Option value={'HU_JIAO'}>沪教版</Option>
                                            <Option value={'BU_BIAN_FIVE_FOUR'}>部编版(五四制)</Option>
                                            <Option value={'ZHONG_TU'}>中图版</Option>
                                            <Option value={'NIU_JIN_SHANG_HAI'}>牛津上海版</Option>
                                            <Option value={'SHANG_HAI_WAI_JIAO'}>上海外教班</Option>
                                        </Select>
                                    </span>
                                </span>
                            </span>
                        )}
                    </div>

                    <div className={styles.item}>
                        <div className={styles.title}>
                            <em>*</em>
                            <span>{locale() == 'en' ? 'Subject Color' : '课表颜色'}</span>
                        </div>
                        <div className={styles.colorMain}>
                            {colorList.map((item, index) => (
                                <span
                                    className={styles.colorBox}
                                    key={index}
                                    style={{ background: `${item}` }}
                                    onClick={() => this.changeColor(item)}
                                >
                                    {this.state.selectedColor == item ? (
                                        <i className={icon.iconfont}>&#xe6a8;</i>
                                    ) : null}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    handleOkNewSubject = () => {
        const { dispatch } = this.props;
        const {
            name,
            enName,
            sortNo,
            subjectId,
            isEdit,
            index,
            orgSubjectList,
            stage,
            selectedColor,
            charperValue,
            knowledgeValue,
            teachingVersion,
            knowledgeTeachingMaterial,
        } = this.state;
        if (!name || !enName || !stage.length || sortNo === undefined || !selectedColor) {
            message.info(trans('teacher.completeBeforeUpload', '请完善信息再提交哦~'));
            return false;
        }
        dispatch({
            type: isEdit ? 'course/addedSubject' : 'course/updateSubject',
            payload: {
                id: subjectId,
                name,
                ename: enName,
                sortNo,
                suitStages: stage,
                color: selectedColor,
                chapterEnable: charperValue,
                teachingMaterial: charperValue ? teachingVersion : '',

                knowledgeEnable: knowledgeValue,
                knowledgeTeachingMaterial: knowledgeValue ? knowledgeTeachingMaterial : '',
            },
            onSuccess: () => {
                if (isEdit) {
                    // this.setState(
                    //     {
                    //         currentPage: 1,
                    //     },
                    //     () => {
                    //         this.initList();
                    //     }
                    // );
                } else {
                    orgSubjectList[index].name = name;
                    orgSubjectList[index].enName = enName;
                    orgSubjectList[index].sortNo = sortNo;
                    orgSubjectList[index].stageIds = stage;
                    orgSubjectList[index].color = selectedColor;
                    this.setState({
                        orgSubjectList,
                    });
                }

                this.setState(
                    {
                        name: undefined,
                        enName: undefined,
                        visibleNewSubject: false,
                        sortNo: undefined,
                        stage: [],
                        selectedColor: '#1EA5FC',
                        charperValue: true,
                        knowledgeValue: true,
                        teachingVersion: undefined,
                        knowledgeTeachingMaterial: undefined,
                        currentPage: 1,
                    },
                    () => {
                        this.initList();
                    }
                );
            },
        });
    };

    newAreaHTML() {
        let { isNewAreaBtn, lyName, lyEname } = this.state;
        return (
            <Modal
                title={this.titleHTML('visibleNewAreas')}
                closable={false}
                visible={this.state.visibleNewAreas}
                onCancel={this.handleCancel.bind(this, 'visibleNewAreas')}
                maskClosable={false}
                onOk={this.handleOkNewArea}
            >
                <div className={styles.NewAreas}>
                    <div>
                        {isNewAreaBtn ? (
                            <div
                                className={styles.newAreasBtn}
                                onClick={() => {
                                    this.setState({
                                        isNewAreaBtn: !isNewAreaBtn,
                                    });
                                }}
                            >
                                <Icon type="plus" />
                                创建新领域
                            </div>
                        ) : (
                            <div className={styles.newField}>
                                <div className={styles.NewSubjectModal}>
                                    <div className={styles.item}>
                                        <div className={styles.title}>
                                            {trans('charge.chineseName', '中文名称')}
                                        </div>
                                        <Input
                                            value={lyName}
                                            onChange={this.handleChange.bind(this, 'lyName')}
                                            placeholder="请输入标题(必填)"
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <div className={styles.title}>
                                            {trans('charge.enName', '英文名称')}
                                        </div>
                                        <Input
                                            value={lyEname}
                                            onChange={this.handleChange.bind(this, 'lyEname')}
                                            placeholder="Please enter the title in Englist(required)"
                                        />
                                    </div>
                                </div>
                                <div className={styles.btn}>
                                    <a
                                        onClick={() => {
                                            this.setState({
                                                isNewAreaBtn: !isNewAreaBtn,
                                            });
                                        }}
                                    >
                                        {' '}
                                        取消
                                    </a>
                                    <Button size="small"> 确认</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        );
    }

    handleOkNewArea = () => {};

    // 关闭Excel导入弹层
    excelModalClose = () => {
        this.setState({
            visibleFromExcel: false,
            fileList: [],
        });
    };

    // 确定从Excel导入

    sureImport = (e) => {
        let { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('subjectFile', item);
        }
        if (!lodash.isEmpty(fileList)) {
            this.props.dispatch({
                type: 'course/subjectImport',
                payload: formData,
                onSuccess: (res) => {
                    console.log('res :>> ', res);
                    message.success('导入成功');
                    this.setState({
                        fileList: [],
                        visibleFromExcel: false,
                    });
                    this.initList();
                },
            });
        }
    };

    //筛选学段-查询list
    filterStage = (value) => {
        this.setState(
            {
                filterStageId: value,
            },
            () => {
                this.initList();
            }
        );
    };

    render() {
        const { suitStageList } = this.props;
        const { visibleFromExcel, fileList } = this.state;
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
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <div>
                <div className={styles.subjectContent}>
                    <div className={styles.handle}>
                        <div>
                            <Select
                                value={this.state.filterStageId}
                                className={styles.conditionSelectStyle}
                                onChange={this.filterStage}
                            >
                                <Option value="" key="all">
                                    全部学段
                                </Option>
                                {suitStageList.length > 0 &&
                                    suitStageList.map((item, index) => (
                                        <Option value={item} key={index}>
                                            {STAGE_NAME[item]}
                                        </Option>
                                    ))}
                            </Select>
                            <Search
                                placeholder={trans('global.searchPlaceholder', '请输入关键字搜索')}
                                onSearch={() => {
                                    this.initList();
                                }}
                                onChange={this.handleChange.bind(this, 'keywords')}
                                style={{ width: 300 }}
                                className={styles.searchStyle}
                            />
                        </div>
                        <div>
                            <Modal
                                title={trans('global.importSubjectExcel', '导入学科')}
                                visible={visibleFromExcel}
                                onCancel={this.excelModalClose}
                                onOk={debounce(this.sureImport)}
                                className={styles.exportModal}
                                okText={trans('global.importScheduleConfirm', '确认导入')}
                            >
                                <div>
                                    {/* <span className={styles.explain}>{trans('', '操作说明')}</span> */}
                                    <p>
                                        <span style={{ marginRight: '8px' }}>①</span>
                                        {trans(
                                            'global.downloadTemplateSubject',
                                            '下载导入模板，批量填写学科信息'
                                        )}
                                        <a
                                            href="/api/course/manager/subjectTemplateDownload"
                                            target="_blank"
                                            style={{ marginLeft: '20px' }}
                                        >
                                            {/* 下载导入模板 */}
                                            {trans('global.downloadImportTemplate', '下载导入模板')}
                                        </a>
                                    </p>
                                    <p>
                                        <span style={{ marginRight: '8px' }}>②</span>
                                        {trans('global.uploadForm', '上传填写好的信息表')}
                                    </p>
                                </div>
                                <div className={styles.upLoad}>
                                    {/* <span className={styles.text}>{trans('', '上传文件')}</span> */}
                                    <span className={styles.desc}>
                                        <span className={styles.fileBtn}>
                                            <Form
                                                id="uploadForm"
                                                layout="inline"
                                                method="post"
                                                className={styles.form}
                                                encType="multipart/form-data"
                                            >
                                                <Upload {...uploadProps} maxCount={1}>
                                                    <Button>
                                                        {/* <Icon type="upload" /> */}
                                                        {trans(
                                                            'global.scheduleSelectFile',
                                                            '选择文件'
                                                        )}
                                                    </Button>
                                                </Upload>
                                            </Form>
                                        </span>
                                    </span>
                                    {/* <span>
                                        科目导入模板请{' '}
                                        <a
                                            href="/api/course/manager/subjectTemplateDownload"
                                            target="_blank"
                                        >
                                            下载导入模板
                                        </a>
                                    </span> */}
                                </div>
                            </Modal>
                            <Button
                                className={styles.btn}
                                onClick={() => {
                                    this.setState({
                                        visibleFromExcel: true,
                                    });
                                }}
                                type="primary"
                                shape="round"
                            >
                                {trans('global.importSubject', '导入学科')}
                            </Button>
                            {/* <Button
                                className={styles.btn}
                                onClick={() => {
                                    message.warn('暂未开放');
                                }}
                            >
                                {trans('global.manageSubject', '领域管理')}
                            </Button> */}
                            <Button
                                className={styles.btn}
                                onClick={() => {
                                    this.setState({
                                        visibleNewSubject: true,
                                        isEdit: true,
                                        subjectTitle: '新建学科',
                                    });
                                }}
                                type="primary"
                            >
                                {trans('global.addSubject', '+新建学科')}
                            </Button>
                        </div>
                    </div>
                    {this.subjectListHTML()}
                </div>
                {this.newSubjectHTML()}
                {this.newAreaHTML()}
            </div>
        );
    }
}

export default SubjectTable;
