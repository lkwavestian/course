import React, { Component, Fragment } from 'react';
import styles from './autoHeight.less';

class AutoHeight extends Component {
    constructor(props) {
        super(props);
        // 240 是左边导航固定宽度
        this.state = {
            width: document.body.clientWidth - 240 - 16,
            hight: document.body.clientHeight - 58 - 16,
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
        this.setState({
            width: document.body.clientWidth - 240 - 16,
            hight: document.body.clientHeight - 58 - 16,
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
