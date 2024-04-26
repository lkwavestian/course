import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import OutContainer from './previewOuterRoot';
import styles from './previewFile.less';

class PreviewFile extends PureComponent {
    state = {
        visible: this.props.visible || false, // 默认是隐藏状态
        images: this.props.images || [], // {src: '', alt: ''}
        pdfPreivewUrl:
            'https://yungu-xiaozhao.oss-cn-hangzhou.aliyuncs.com/yungu-website/8707360717447786054ade69716aca7ca6cdb6c6197661402.jpg',
        index: this.props.index || 0, // 默认展示第一个图片
        rotate: this.props.rotate || 0, // 旋转角度默认是0
        translateX: 0,
        translateY: 6,
        scaleX: this.props.scale || 1,
        scaleY: this.props.scale || 1,
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible,
            images: nextProps.images,
        });
    }

    moveImg = (ev) => {
        ev.preventDefault();
        const { translateX, translateY } = this.state;
        let disx = ev.pageX - translateX;
        let disy = ev.pageY - translateY;
        let _this = this;
        document.onmousemove = (ev) => {
            _this.setState({
                translateX: ev.pageX - disx,
                translateY: ev.pageY - disy,
            });
        };
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmousedown = null;
        };
    };

    haveImagesHTML() {
        let { images, pdfPreivewUrl } = this.state;
        let { index, translateX, translateY, scaleX, scaleY, rotate } = this.state;
        let imgStyle = {
            transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
        };
        let itemWidth = images.length * 48 + (images.length - 1) * 3;
        let regPDF = /(.*)\.(pdf)$/i;
        let currentUrl = images.length > 0 && images[index].src;
        let currentReg = images.length > 0 && images[index].alt;
        return (
            <div className={styles.viewHave}>
                {regPDF.test(currentReg) ? (
                    <div className={styles.currentPdf}>
                        <iframe style={imgStyle} className={styles.pdf} src={currentUrl}></iframe>
                    </div>
                ) : (
                    <div className={styles.currentImg}>
                        <img
                            draggable
                            onMouseDown={this.moveImg}
                            style={imgStyle}
                            src={currentUrl}
                        />
                    </div>
                )}
                <div className={styles.viewFooter}>
                    <p className={styles.viewTitle}>{images[index].alt}</p>
                    <div>
                        <span onClick={this.zoom.bind(this, 0.1)} className={styles.iconOut}>
                            <Icon className={styles.icon} type="plus" />
                        </span>
                        <span onClick={this.zoom.bind(this, -0.1)} className={styles.iconOut}>
                            <Icon className={styles.icon} type="minus" />
                        </span>
                        <span onClick={this.preAndDown.bind(this, 1)} className={styles.iconOut}>
                            <Icon className={styles.icon} type="left" />
                        </span>
                        <span onClick={this.preAndDown.bind(this, 2)} className={styles.iconOut}>
                            <Icon className={styles.icon} type="right" />
                        </span>
                        <span onClick={this.rotate.bind(this, 1)} className={styles.iconOut}>
                            <Icon className={styles.icon} type="undo" />
                        </span>
                        <span onClick={this.rotate.bind(this, 2)} className={styles.iconOut}>
                            <Icon className={styles.icon} type="redo" />
                        </span>
                        <span onClick={this.handstand.bind(this, 1)} className={styles.iconOut}>
                            <Icon className={styles.icon} type="column-width" />
                        </span>
                        <span onClick={this.handstand.bind(this, 2)} className={styles.iconOut}>
                            <Icon className={styles.icon} type="column-height" />
                        </span>
                    </div>
                    <div className={styles.navbar}>
                        <div className={styles.imgList} style={{ width: itemWidth + 'px' }}>
                            {images.length > 0 &&
                                images.map((el, i) => (
                                    <span className={styles.item} key={i}>
                                        <img
                                            onClick={() => {
                                                this.setState({
                                                    index: i,
                                                });
                                                this.initState();
                                            }}
                                            src={regPDF.test(el.alt) ? pdfPreivewUrl : el.src}
                                            className={i === index ? styles.img : null}
                                        />
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    initState() {
        this.setState({
            translateX: 0,
            translateY: 6,
            rotate: this.props.rotate || 0,
            scaleX: this.props.scale || 1,
            scaleY: this.props.scale || 1,
        });
    }

    zoom(num) {
        let { scaleX, scaleY } = this.state;
        scaleX += num;
        scaleY += num;
        this.setState({
            scaleX,
            scaleY,
        });
    }

    preAndDown(type) {
        let { images, index } = this.state;
        if (images.length == 0) {
            return;
        }
        if (type == 1) {
            index--;
            if (index < 0) {
                index = images.length - 1;
            }
        } else {
            index++;
            if (index > images.length - 1) {
                index = 0;
            }
        }
        this.setState({
            index,
        });
        this.initState();
    }

    rotate(type) {
        let { rotate } = this.state;
        if (type === 1) {
            rotate -= 90;
        } else {
            rotate += 90;
        }
        this.setState({
            rotate,
        });
    }

    handstand(type) {
        let { scaleX, scaleY } = this.state;
        if (type === 1) {
            scaleX = -Number(scaleX);
        } else {
            scaleY = -Number(scaleY);
        }
        this.setState({
            scaleX,
            scaleY,
        });
    }

    render() {
        let { visible, images } = this.state;
        return (
            <div>
                <OutContainer>
                    <div className={styles.NewRoot} style={{ display: visible ? 'block' : 'none' }}>
                        <div className={styles.viewerMask}></div>
                        <div
                            className={styles.closeBtn}
                            onClick={() => {
                                this.setState({
                                    visible: false,
                                    index: 0,
                                });
                                this.initState();
                                this.props.close && this.props.close();
                            }}
                        >
                            <Icon className={styles.close} type="close" />
                        </div>
                        {images.length > 0 ? (
                            <div className={styles.imgContainer}>{this.haveImagesHTML()}</div>
                        ) : (
                            <div>请输入要展示的图片</div>
                        )}
                    </div>
                </OutContainer>
            </div>
        );
    }
}

export default PreviewFile;
