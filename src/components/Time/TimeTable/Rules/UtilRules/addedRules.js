//已添加规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './rules.less';
import { Switch } from 'antd';
import CommonList from './common/commonList';

@connect((state) => ({}))
export default class AddedRules extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeKey != this.props.activeKey) {
            if (nextProps.activeKey == nextProps.selfId) {
                const { currentVersion } = this.props;
                if (currentVersion) {
                    this.updateAddedRules();
                }
            }
        }
    }

    //已添加规则接口
    updateAddedRules = () => {
        const { getAddRules } = this.props;
        typeof getAddRules == 'function' && getAddRules.call(this);
    };

    render() {
        const { addedRulesList } = this.props;
        return (
            <div className={styles.addedRulesList}>
                <div>
                    {addedRulesList &&
                        addedRulesList.weekRuleModelList &&
                        addedRulesList.weekRuleModelList.length > 0 &&
                        addedRulesList.weekRuleModelList.map((item, index) => {
                            return (
                                <CommonList
                                    currentKey="addRules"
                                    key={item.id}
                                    dataSource={item}
                                    {...this.props}
                                />
                            );
                        })}
                </div>
            </div>
        );
    }
}
