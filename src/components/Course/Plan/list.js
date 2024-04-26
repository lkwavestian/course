//课程计划列表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import CardUtil from './card.js';
import { runInThisContext } from 'vm';

export default class CoursePlanItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getCopyCard = (copy) => {
        this.props.getCopyCard(copy);
    };
    render() {
        const { coursePlanList } = this.props;

        return (
            <div>
                {coursePlanList &&
                    coursePlanList.length > 0 &&
                    coursePlanList.map((item, index) => {
                        return (
                            <CardUtil
                                onRef={(ref) => (this.child = ref)}
                                key={item.id}
                                effictiveKey={item.id}
                                courseDetail={item}
                                cardIndex={index}
                                {...this.props}
                                getCopyCard={this.getCopyCard}
                            />
                        );
                    })}
            </div>
        );
    }
}
