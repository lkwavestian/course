//选择部门和人员组件
import React, { PureComponent } from 'react';
import { SearchTeacher } from '@yungu-fed/yungu-selector';
import { Select, Icon } from 'antd';
import styles from './index.less';
import { locale } from '../../../../../../utils/i18n';
import icon from '../../../../../../icon.less';

const { Option } = Select;
export default class SelectTeacherAndOrg extends PureComponent {
    constructor(props) {
        super();
        this.state = {
            value: this.concatIds(props)?.length > 0 ? this.concatIds(props) : [], //教师与部门
            modalVisible: false,
            userIds: props.userIds?.length > 0 ? props.userIds : [], //人员id
            orgIds: props.orgIds?.length > 0 ? props.orgIds : [], //组织id
        };
    }

    //合并id
    concatIds(props) {
        console.log('props :>> ', props);
        let userIds = props.userIds || [],
            orgIds = props.orgIds || [];
        let result = userIds.concat(orgIds);
        return result;
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    selectOption = (value) => {
        const { changeTeacher } = this.props;
        typeof changeTeacher === 'function' && changeTeacher(value);
        this.setState(
            {
                value,
            },
            () => {
                this.setState({
                    userIds: this.formatId(this.state.value, 'user'),
                    orgIds: this.formatId(this.state.value, 'org'),
                });
            }
        );
    };

    formatId(list, type) {
        let org = [],
            user = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] && typeof list[i] == 'string' && list[i].indexOf('org-') > -1) {
                let id = Number(list[i].split('org-')[1]);
                org.push(id);
            } else {
                user.push(list[i]);
            }
        }
        if (type == 'org') {
            return org;
        } else if (type == 'user') {
            return user;
        }
    }

    renderOption = () => {
        let treeData = this.formatTree();
        let people = locale() == 'en' ? 'people' : '人';
        return (
            treeData?.length > 0 &&
            treeData.map((item) => (
                <Option value={item.id} key={item.id}>
                    {item.total > 0
                        ? `${locale() == 'en' ? item.enName || item.name : item.name}(${
                              item.total
                          }${people})`
                        : `${item.name} ${item.enName || ''}`}
                </Option>
            ))
        );
    };

    changeModalVisible = (visible) => {
        this.setState({
            modalVisible: visible ?? false,
        });
    };

    confirm = (ids) => {
        //获得组织和人员id {orgIds: [], userIds: [] }, 全体人员[1,2,3]
        console.log('ids :>> ', ids);
        const { changeTeacher } = this.props;
        typeof changeTeacher === 'function' && changeTeacher(ids);
        let idList = JSON.parse(JSON.stringify(ids));
        if (this.props.selectType === '2') {
            let orgIds = idList?.orgIds || [], //组织ids
                userIds = idList?.userIds || []; //人员ids
            for (let i = 0; i < orgIds.length; i++) {
                orgIds[i] = `org-${orgIds[i]}`;
            }
            this.setState(
                {
                    value: Array.from(new Set(orgIds.concat(userIds))),
                },
                () => {
                    console.log('value', this.state.value);
                    this.setState({
                        userIds: this.formatId(this.state.value, 'user'),
                        orgIds: this.formatId(this.state.value, 'org'),
                    });
                    this.changeModalVisible(false);
                }
            );
        } else {
            this.setState(
                {
                    value: Array.from(new Set(idList)),
                },
                () => {
                    this.setState({
                        userIds: this.state.value,
                    });
                    this.changeModalVisible(false);
                }
            );
        }
    };

    //处理回显数据
    handleData = (data) => {
        let tree = this.formatTree();
        let result = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < tree.length; j++) {
                if (tree[j]['id'] == data[i]) {
                    let info = {
                        id: data[i],
                        name: tree[j]['name'],
                        englishName: tree[j]['enName'],
                        total: tree[j]['total'] || 0,
                    };
                    result.push(info);
                }
            }
        }
        return result;
    };

    //处理人员和组织数据-人员和组织的id有重复的，所以组织的id添加org-标识
    formatTree() {
        const { treeData } = this.props;
        let tree = JSON.parse(JSON.stringify(treeData || []));
        tree.map((item) => {
            item.id = item.orgFlag ? `org-${item.id}` : item.id;
        });
        return tree;
    }

    lessonViewTextClick = () => {
        this.setState({
            modalVisible: true,
        });
    };

    emptyValue = (e) => {
        e.stopPropagation();
        this.setState({
            value: [],
        });
    };

    render() {
        const { source } = this.props;
        return source !== 'lessonView' ? (
            <div className={styles.searchMain}>
                <span className={styles.addButton} onClick={() => this.changeModalVisible(true)}>
                    <i className={icon.iconfont}>&#xe75a;</i>添加
                </span>
                <Select
                    showSearch
                    mode="multiple"
                    filterOption={true}
                    optionFilterProp="children"
                    onChange={this.selectOption}
                    value={this.state.value}
                    className={styles.selectStyle}
                    placeholder={this.props.placeholder}
                >
                    {this.renderOption()}
                </Select>

                {this.state.modalVisible && (
                    <SearchTeacher
                        modalVisible={this.state.modalVisible}
                        cancel={this.changeModalVisible}
                        language={'zh_CN'}
                        confirm={this.confirm}
                        selectedList={this.handleData(this.state.value)} //选中人员，组件当中回显{[id: 1, name: '', englishName: '']},如果是组织id，id处理成"org-1"的形式
                        selectType={this.props.selectType} // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                        // selectType="2"
                    />
                )}
            </div>
        ) : (
            <div className={styles.lessonViewSearchMain}>
                <div onClick={this.lessonViewTextClick} className={styles.lessonViewText}>
                    {this.state.value.length === 0 ? (
                        <span className={styles.placeholder}>搜索教师</span>
                    ) : (
                        <div className={styles.textWrapper}>
                            <span
                                className={styles.text}
                            >{`${this.state.value.length}个教师`}</span>
                            <Icon
                                type="close-circle"
                                theme="filled"
                                onClick={this.emptyValue}
                                style={{ color: 'rgb(187,187,187)' }}
                            />
                        </div>
                    )}
                </div>

                {this.state.modalVisible && (
                    <SearchTeacher
                        modalVisible={this.state.modalVisible}
                        cancel={this.changeModalVisible}
                        language={'zh_CN'}
                        confirm={this.confirm}
                        selectedList={this.handleData(this.state.value)} //选中人员，组件当中回显{[id: 1, name: '', englishName: '']},如果是组织id，id处理成"org-1"的形式
                        selectType={this.props.selectType} // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                        // selectType="2"
                    />
                )}
            </div>
        );
    }
}
