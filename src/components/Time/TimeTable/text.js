getMsg = () => {
    const { dispatch, currentVersion, lessonViewScheduleData } = this.props;
    lessonViewScheduleData
        .filter((item) => item.view)
        .map((item) => {
            dispatch({
                type: 'lessonView/findCustomSchedule',
                payload: {
                    id: currentVersion,
                    [item.idType]: [item.studentGroup.id],
                    type: item.view,
                    idType: item.idType,
                },
            });
        });
};
