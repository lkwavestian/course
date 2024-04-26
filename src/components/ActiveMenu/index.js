//动态菜单
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Radio, Checkbox, Tooltip } from 'antd';
import { trans } from '../../utils/i18n';
import icon from '../../icon.less';
import blankImg from '../../assets/kong.png';

/**
 * isEdit: boolean 是否编辑
 * openStage: [1,2,3,4] 开通的学段
 * menuData: [], 菜单数据内容
 * settingType: 1,2 菜单类型 1：前台菜单 2：后台菜单
 * 
*/

function ActiveMenu(props) {

    const { isEdit, openStage, menuData, checkFirstMenuStatus, checkSecondMenuStatus, closeModal } = props;

    const stageList = [{ key: "1", name: "幼儿园视图" }, { key: "2", name: '小学视图' }, { key: "3", name: '初中视图' }, { key: "4", name: "高中视图" }];
    const [stage, setStage] = useState("");
    const [identify, setIdentify] = useState("employee");
    const [currentMenuList, setCurrentMenuList] = useState([]); //当前视图下的菜单展示

    
    useEffect(() => {
        setStage(openStage[0]);
    }, [openStage])

    //切换学段
    const switchStage = key => {
        setStage(key);
    }

    //切换身份
    const switchIdentify = e => {
        setIdentify(e.target.value);
    }

    //勾选一级菜单
    const checkFirstMenu = (checked, item, index) => {
        typeof checkFirstMenuStatus == "function" && checkFirstMenuStatus(checked, item, index, stage, identify);
    }

    //勾选二级菜单
    const checkSecondMenu = (checked, item, index, subIndex) => {
        typeof checkSecondMenuStatus == "function" && checkSecondMenuStatus(checked, index, subIndex, stage, identify);
    }

    //确定
    const close = () => {
        typeof closeModal == "function" && closeModal();
    }

    //判断当前学段或身份中是否有菜单
    const judgeCurrentStageAndIdentify = () => {
        let ifHave = false;
        for(let i = 0;i < menuData.length;i++) {
            let menuStageDTOList = menuData[i]["menuStageDTOList"] || [];
            if(menuStageDTOList.findIndex(item => item.stage == stage && item.identityList && item.identityList.indexOf(identify) > -1) > -1) {
                ifHave = true;
                break;
            }
        }
        return ifHave;
    }

    return (<div className={styles.menuContent}>
        <div className={styles.condition}>
            <div className={styles.tabbar}>
                {
                    stageList.map(item => {
                        if (openStage.findIndex(l => l == item.key) > -1) {
                            return (<span className={stage == item.key ? `${styles.tabbarItem} ${styles.activeTab}` : styles.tabbarItem} key={item.key} onClick={() => switchStage(item.key)}>{item.name}</span>)
                        }
                    })
                }
            </div>
            <div className={styles.identifyList}>
                <Radio.Group onChange={switchIdentify} value={identify}>
                    <Radio value="employee"><span className={styles.identify}>教师</span></Radio>
                    <Radio value="externalUser"><span className={styles.identify}>外聘教师</span></Radio>
                    <Radio value="parent"><span className={styles.identify}>家长</span></Radio>
                    <Radio value="student"><span className={styles.identify}>学生</span></Radio>
                </Radio.Group>
            </div>
        </div>
        <div className={styles.main}>
            {
                openStage.length > 0
                ? !judgeCurrentStageAndIdentify() && !isEdit
                    ? <div className={styles.noData}>
                        <img src={blankImg} />
                        <span>当前学段该身份暂无菜单配置，动动小手配置一下吧~~</span>
                    </div>
                    : menuData?.length > 0
                        ? menuData.map((item, index) => {
                            if (isEdit === true) { //编辑状态下显示全部
                                let firstMenuIfShow = item.menuStageDTOList?.length > 0 && item.menuStageDTOList.findIndex(o => (`${o.stage}` == stage) && (o.identityList.indexOf(identify) > -1)) > -1 ? true : false; //一级菜单的显隐
                                if(item.templateGroupName?.indexOf(identify) > -1) { //过滤对应身份的菜单
                                    return (
                                        <div className={styles.programList} key={index}>
                                            <div className={styles.title}>
                                                <Checkbox checked={firstMenuIfShow} onChange={(e) => checkFirstMenu(e.target.checked, item, index)}></Checkbox>
                                                <span onClick={() => checkFirstMenu(!firstMenuIfShow, item, index)}>{item.templateGroupName}</span>
                                            </div>
                                            <div className={styles.box}>
                                                {
                                                    item.menuModelDTOList?.length > 0
                                                        ? item.menuModelDTOList.map((l, i) => {
                                                            if(l.menuTemplateName?.indexOf(identify) > -1) {
                                                                let ifChecked = l.menuStageDTOList?.findIndex(o => (`${o.stage}` == stage) && (o.identityList.indexOf(identify) > -1)) > -1  ? true : false;
                                                                return (
                                                                    <div className={styles.programItem} key={i} style={{width: '15%'}}>
                                                                        <Checkbox checked={ifChecked} onChange={(e) => checkSecondMenu(e.target.checked, l, index, i)}></Checkbox>
                                                                        <Tooltip placement='top' title={l.menuTemplateName} onClick={() => checkSecondMenu(!ifChecked, l, index, i)}>
                                                                            <span className={styles.programTitle}>{l.menuTemplateName}</span>
                                                                        </Tooltip>
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                        : null
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                               
                            } else { //预览状态下
                                if (openStage.length > 0 && item.menuStageDTOList && item.menuStageDTOList.length > 0) {
                                    if (item.menuStageDTOList.findIndex(o => (`${o.stage}` == stage) && (o.identityList.indexOf(identify) > -1)) > -1 ) { //当学段或身份同时满足，回显预览状态
                                        return (<div className={styles.programList} key={index}>
                                            <div className={styles.title}>
                                                <i className={`${icon.iconfont} ${styles.iconBack}`} dangerouslySetInnerHTML={{__html: item.menuGroupIcon}} />
                                                {item.templateGroupName}：
                                            </div>
                                            <div className={styles.box}>
                                                {
                                                    item.menuModelDTOList?.length > 0
                                                        ? item.menuModelDTOList.map((l, i) => {
                                                            if (l.menuStageDTOList?.findIndex(o => (`${o.stage}` == stage) && (o.identityList.indexOf(identify) > -1)) > -1) {
                                                                return (
                                                                    <div className={`${styles.programItem} ${styles.programCard}`} key={i}>
                                                                        <Tooltip placement='top' title={l.menuTemplateName}>
                                                                            <span className={styles.programTitle}>{l.menuTemplateName}</span>
                                                                        </Tooltip>
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                        : null
                                                }
                                            </div>
                                        </div>)
                                    }
                                }
                            }
                        })
                        : null
                :  (<div className={styles.noData}>
                    <img src={blankImg} />
                    <span>当前尚未勾选开通学段，动动小手配置一下吧~~</span>
                </div>)
            }
        </div>
        {
            isEdit == true
                ? <div className={styles.save} onClick={close}>
                    <span>确定</span>
                </div>
                : null
        }
    </div>)
}

export default ActiveMenu;

