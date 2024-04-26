import { createElement } from 'react';
import dynamic from 'dva/dynamic';

let routerDataCache;

const modelNotExisted = (app, model) =>
    //eslint-disable-next-line
    !app._models.some(({ namespace }) => {
        return namespace === model.substring(model.lastIndexOf('/') + 1);
    });

//Modal基于路由，动态加载
const dynamicWrapper = (app, models, component) => {
    if (component.toString().indexOf('.then(') < 0) {
        models.forEach((model) => {
            if (modelNotExisted(app, model)) {
                app.model(require(`../models/${model}`).default);
            }
        });
        return (props) => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return createElement(component().default, {
                ...props,
                routerData: routerDataCache,
            });
        };
    }
    return dynamic({
        app,
        models: () =>
            models
                .filter((model) => modelNotExisted(app, model))
                .map((m) => import('../models/' + m + '.js')),
        component: () => {
            // add routerData prop
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return component().then((raw) => {
                const Component = raw.default || raw;
                return (props) =>
                    createElement(Component, {
                        ...props,
                        routerData: routerDataCache,
                    });
            });
        },
    });
};

export const getRouterData = (app) => {
    return [
        {
            path: '/course/index/:tabs?/:tabType?',
            name: 'course',
            component: dynamicWrapper(
                app,
                [
                    'global',
                    'time',
                    'course',
                    'timeTable',
                    'choose',
                    'rules',
                    'club',
                    'exchangeCourse',
                    'organize',
                    'courseBaseDetail',
                    'devision',
                    'application',
                    'lessonView',
                    'replace',
                ],
                () => import('../routes/Course/index')
            ),
        },
        {
            path: '/Division/index/:id/:num?',
            name: 'division',
            component: dynamicWrapper(
                app,
                [
                    'global',
                    'time',
                    'course',
                    'timeTable',
                    'choose',
                    'rules',
                    'club',
                    'exchangeCourse',
                    'organize',
                    'courseBaseDetail',
                    'devision',
                ],
                () => import('../routes/Division/index')
            ),
        },

        {
            path: '/time/index',
            name: 'time',
            component: dynamicWrapper(
                app,
                [
                    'global',
                    'time',
                    'timeTable',
                    'course',
                    'rules',
                    'club',
                    'exchangeCourse',
                    'lessonView',
                ],
                () => import('../routes/Time/index')
            ),
        },
        {
            path: '/student/index', //学生管理
            name: 'student',
            component: dynamicWrapper(
                app,
                ['global', 'teacher', 'student', 'timeTable', 'organize'],
                () => import('../routes/Student/index')
            ),
        },
        {
            path: '/mobilePay/index', // 移动端支付（云谷）
            name: 'mobilePay',
            component: dynamicWrapper(app, ['global', 'mobilePay'], () =>
                import('../routes/MobilePay/index')
            ),
        },
        {
            path: '/wdMobilePay/index', // 移动端支付（威德）
            name: 'wdMobilePay',
            component: dynamicWrapper(app, ['global', 'mobilePay'], () =>
                import('../routes/WdMobilePay/index')
            ),
        },
        {
            path: '/payDetail/index',
            name: 'payDetail',
            component: dynamicWrapper(app, ['global', 'mobilePay'], () =>
                import('../routes/MobilePayDetail/index')
            ),
        },
        {
            path: '/wdPayDetail/index',
            name: 'wdPayDetail',
            component: dynamicWrapper(app, ['global', 'mobilePay'], () =>
                import('../routes/WdMobilePayDetail/index')
            ),
        },
        {
            path: '/confirmPay/index', // 确认支付（云谷）
            name: 'confirmPay',
            component: dynamicWrapper(app, ['global', 'mobilePay'], () =>
                import('../routes/ConfirmPay/index')
            ),
        },
        {
            path: '/wdConfirmPay/index', // 确认支付（威德）
            name: 'wdConfirmPay',
            component: dynamicWrapper(app, ['global', 'mobilePay'], () =>
                import('../routes/WdConfirmPay/index')
            ),
        },
        {
            path: '/eBank/index',
            name: 'eBank',
            component: dynamicWrapper(app, ['global', 'mobilePay'], () =>
                import('../routes/Ebank/index')
            ),
        },
        {
            path: '/charge/index/:currentIndex?',
            name: 'charge',
            component: dynamicWrapper(
                app,
                ['global', 'account', 'chargePro', 'pay', 'order', 'course'],
                () => import('../routes/Charge/index')
            ),
        },

        {
            path: '/kanBan/index/:currentIndex?', // 看板
            name: 'kanBan',
            component: dynamicWrapper(
                app,
                ['global', 'account', 'chargePro', 'pay', 'order', 'teacher', 'student', 'course'],
                () => import('../routes/Kanban/index')
            ),
        },
        {
            path: '/address/detail',
            name: 'detail',
            component: dynamicWrapper(app, ['global', 'pay', 'account', 'course'], () =>
                import('../components/PayNotice/detail')
            ),
        },
        {
            path: '/organize/index/:currentIndex?',
            name: 'organize',
            component: dynamicWrapper(
                app,
                ['global', 'teacher', 'student', 'organize', 'course'],
                () => import('../routes/Organization/index')
            ),
        },
        {
            path: '/address/index',
            name: 'address',
            component: dynamicWrapper(app, ['global'], () => import('../routes/Address/index')),
        },
        {
            path: '/mobile',
            name: 'mobile',
            component: dynamicWrapper(app, ['global', 'student'], () =>
                import('../routes/Mobile/index')
            ),
        },
        {
            path: '/mobileInitiative',
            name: 'mobileInitiative',
            component: dynamicWrapper(app, ['global', 'student'], () =>
                import('../routes/MobileInitiative/index')
            ),
        },
        {
            path: '/course/student/list',
            name: 'studentList',
            component: dynamicWrapper(app, ['global', 'course', 'courseStudentDetail'], () =>
                import('../routes/CourseStudentList/index')
            ),
        },
        {
            path: '/course/student/detail',
            name: 'studentDetail',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'course', 'choose', 'courseStudentDetail', 'courseBaseDetail'],
                () => import('../routes/CourseStudentDetail/index')
            ),
        },
        {
            path: '/course/student/myLesson',
            name: 'myLesson',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'course', 'choose', 'courseStudentDetail'],
                () => import('../routes/MyLesson/index')
            ),
        },
        {
            path: '/course/student/detailMobile',
            name: 'studentDetailMobile',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'courseStudentDetail', 'course'],
                () => import('../routes/CourseStudentDetailMobile/index')
            ),
        },
        {
            path: '/user/loginH5',
            name: 'studentDetailLoginH5',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'courseStudentDetail', 'course'],
                () => import('../routes/CourseStudentDetailMobile/index')
            ),
        },
        {
            path: '/course/student/MyDetailMobile',
            name: 'studentMyDetail',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'courseStudentDetail', 'course', 'courseBaseDetail'],
                () => import('../routes/CourseStudentDetailMobileYunGu/index')
            ),
        },
        {
            path: '/courseDetail/:planId/:chooseCourseId/:needButton/:groupId?/:stuId?/:checkLesson?',
            name: 'courseDetail',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'courseStudentDetail', 'course'],
                () => import('../routes/CourseDetail/index')
            ),
        },
        {
            path: '/course/student/personal',
            name: 'studentDetailPerson',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'courseStudentDetail', 'course'],
                () => import('../routes/PersonalMobile/index')
            ),
        },
        {
            path: '/course/student/accountSafe', //账户安全（移动端）
            name: 'studentDetailSafe',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'courseStudentDetail', 'course'],
                () => import('../routes/AccountSafe/index')
            ),
        },
        {
            path: '/course/student/personalMessage',
            name: 'studentDetailMsg',
            component: dynamicWrapper(
                app,
                ['global', 'rules', 'courseStudentDetail', 'course'],
                () => import('../routes/PersonalMessage/index')
            ),
        },
        {
            path: '/course/student/mobileList',
            name: 'studentList',
            component: dynamicWrapper(app, ['global', 'courseStudentDetail'], () =>
                import('../routes/CourseStudentListMobile/index')
            ),
        },
        {
            path: '/course/student/myMobileList', // 云谷选课家长端
            name: 'myMobileList',
            component: dynamicWrapper(app, ['global', 'courseStudentDetail'], () =>
                import('../routes/CourseStudentListMobileYunGu/index')
            ),
        },
        {
            path: '/course/student/MobileCourseDetail',
            name: 'MobileCourseDetail',
            component: dynamicWrapper(
                app,
                ['global', 'courseStudentDetail', 'choose', 'course'],
                () => import('../routes/StudentCourseDetail/index')
            ),
        },
        {
            path: '/course/base/print',
            name: 'printCourseSelection',
            component: dynamicWrapper(
                app,
                [
                    'global',
                    'time',
                    'course',
                    'timeTable',
                    'choose',
                    'rules',
                    'club',
                    'exchangeCourse',
                    'organize',
                    'courseBaseDetail',
                ],
                () => import('../components/PrintBaseInfor/index')
            ),
        },
        {
            path: '/course/teacher/detail/:currentIndex?',
            name: 'teacherDetail',
            component: dynamicWrapper(
                app,
                [
                    'global',
                    'rules',
                    'time',
                    'course',
                    'choose',
                    'courseTeacherDetail',
                    'courseBaseDetail',
                    'timeTable',
                    'courseStudentDetail',
                    'pay',
                    'account',
                ],
                () => import('../routes/CourseTeacherDetail/index')
            ),
        },
        {
            path: '/course/base/detail',
            name: 'baseDetail',
            component: dynamicWrapper(
                app,
                [
                    'global',
                    'rules',
                    'time',
                    'course',
                    'choose',
                    'courseBaseDetail',
                    'courseTeacherDetail',
                ],
                () => import('../routes/CourseBaseDetail/index')
            ),
        },
        {
            path: '/school/application',
            name: 'application',
            component: dynamicWrapper(app, ['global', 'application', 'student'], () =>
                import('../routes/Application/index')
            ),
        },
        {
            path: '/school/applicationList',
            name: 'applicationList',
            component: dynamicWrapper(app, ['global', 'application', 'student'], () =>
                import('../routes/ApplicationList/index')
            ),
        },
        {
            path: '/mobile/index',
            name: 'calendar',
            component: dynamicWrapper(app, ['global'], () =>
                import('../components/CourseStudentDetailMobile/myCalendar')
            ),
        },
        {
            path: '/archives',
            name: 'archives',
            component: dynamicWrapper(app, ['global'], () =>
                import('../components/CourseStudentDetailMobile/record')
            ),
        },
        {
            path: '/studentTabulation',
            name: 'studentTabulation', //学生列表--老铁需求
            component: dynamicWrapper(app, ['global', 'studentTabulation', 'course'], () =>
                import('../routes/StudentTabulation/index')
            ),
        },
        {
            path: '/',
            name: 'teacher',
            component: dynamicWrapper(
                app,
                ['global', 'teacher', 'student', 'course', 'organize'],
                () => import('../routes/Teacher/index')
            ),
        },
        {
            path: '/:currentIndex?',
            name: 'teacher',
            component: dynamicWrapper(
                app,
                ['global', 'teacher', 'student', 'course', 'time', 'organize'],
                () => import('../routes/Teacher/index')
            ),
        },
        {
            path: '/replaceRedirect/index',
            name: 'replaceRedirect',
            component: dynamicWrapper(app, [], () => import('../routes/ReplaceRedirect/index')),
        },
        {
            path: '/replace/index',
            name: 'replace',
            component: dynamicWrapper(app, ['replace'], () => import('../routes/Replace/index')),
        },
        {
            path: '/replace/index/application',
            name: 'replaceAppLication',
            component: dynamicWrapper(app, ['replace'], () =>
                import('../routes/ReplaceApplication/index')
            ),
        },
        {
            path: '/replace/mobile/index/:tabs?',
            name: 'replaceMobile',
            component: dynamicWrapper(app, ['replace', 'global'], () =>
                import('../routes/ReplaceMobile/index')
            ),
        },
        {
            path: '/replace/mobile/application/index/:tabs?',
            name: 'replaceMobileApplication',
            component: dynamicWrapper(app, ['replace'], () =>
                import('../routes/ReplaceMobileApplication/index')
            ),
        },
        {
            path: '/employee/application/:edit/:schoolId/:eduGroupcompanyId/:userTemplateUnionId?',
            name: 'employeeMobileApplication',
            component: dynamicWrapper(app, ['global', 'teacher', 'student', 'course'], () =>
                import('../routes/EmployeeMobileApplication/index')
            ),
        },
        {
            path: '/taskCourseManage/index',
            name: 'taskCourseManage',
            component: dynamicWrapper(
                app,
                [
                    'global',
                    'time',
                    'course',
                    'timeTable',
                    'choose',
                    'rules',
                    'club',
                    'exchangeCourse',
                    'organize',
                    'courseBaseDetail',
                    'devision',
                    'application',
                    'lessonView',
                    'replace',
                ],
                () => import('../routes/TaskCourseManage/index')
            ),
        },
        {
            path: '/order/Detail/:orderNo/:tuitionPlanId',
            name: 'orderDetail',
            component: dynamicWrapper(
                app,
                [
                    'global',
                    'time',
                    'course',
                    'timeTable',
                    'choose',
                    'rules',
                    'club',
                    'exchangeCourse',
                    'organize',
                    'courseBaseDetail',
                    'devision',
                    'application',
                    'lessonView',
                    'pay',
                ],
                () => import('../routes/OrderDetail/index')
            ),
        },
        {
            path: '/teachingWeekManage/index',
            name: 'teachingWeekManage',
            component: dynamicWrapper(app, ['organize', 'course'], () =>
                import('../routes/TeachingWeekManageRoute/index')
            ),
        },
    ];
};
