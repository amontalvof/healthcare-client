const formatStartAndEndTime = (selectedTime: string) => {
    // selectedTime is 'HH:mm:ss'
    const [hourStr, minuteStr, secondStr] = selectedTime.split(':');
    const hours = Number(hourStr);
    const minutes = Number(minuteStr);
    const seconds = Number(secondStr);
    // startTime remains the same as input
    const startTime = selectedTime;
    // build Date and add 59 minutes
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    const endDate = new Date(date.getTime() + 59 * 60 * 1000);
    const endTime = [
        endDate.getHours().toString().padStart(2, '0'),
        endDate.getMinutes().toString().padStart(2, '0'),
        endDate.getSeconds().toString().padStart(2, '0'),
    ].join(':');
    return { startTime, endTime };
};

export default formatStartAndEndTime;
