import React, { Component, Fragment } from 'react';
import styles from './autoHeight.less';

// 自适应宽度载体，108 是导航的固定高度
class AutoHeight extends Component {
    constructor(props) {
        super(props);
        // 150 是左边导航固定宽度
        this.state = {
            width: document.body.clientWidth - 175 - 36,
            hight: document.body.clientHeight - 108,
        };
    }

    componentDidMount() {
        this.updateSize();
        window.addEventListener('resize', () => this.updateSize());
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => this.updateSize());
    }

    updateSize() {
        // 窗口变化时重新获取高度
        let __windowClientHeight = document.body.clientHeight;
        this.setState({
            hight: __windowClientHeight - 108,
            width: document.body.clientWidth - 175 - 36,
        });
    }

    reactChildren(index) {
        return (
            <Fragment>
                {React.Children.map(this.props.children, function (child, i) {
                    return i == index ? <Fragment>{child}</Fragment> : null;
                })}
            </Fragment>
        );
    }

    render() {
        return (
            <div className={styles.AutoHeight} style={{ height: `${this.state.hight}px` }}>
                <div className={styles.left}>{this.reactChildren(0)}</div>
                <div style={{ width: `${this.state.width}px` }} className={styles.right}>
                    {this.reactChildren(1)}
                </div>
            </div>
        );
    }
}

export default AutoHeight;
