function transferWithWorkingHours(timeZone, onlyWorkDays, min, max, stateAvailable, stateUnavailable) {
    var nowTime = moment($jsapi.currentTime()).add(timeZone, "h");
    var startTime = moment(min, "HH:mm");
    var endTime = moment(max, "HH:mm");
    var isWeekend = nowTime.day() === 6 || nowTime.day() === 0;
    startTime.set({"year": nowTime.year(), "month": nowTime.month(), "date": nowTime.date()});
    endTime.set({"year": nowTime.year(), "month": nowTime.month(), "date": nowTime.date()});

    if ((!onlyWorkDays && nowTime.isBetween(startTime, endTime))
        || (onlyWorkDays && !isWeekend && nowTime.isBetween(startTime, endTime))) {
            $reactions.transition(stateAvailable);
        } else {
            $reactions.transition(stateUnavailable);
        }
    }

function getTransferReceiverByTopic() {
    $.session.transferReceiver = ($.intent && $.intent.path.split("/")[3]) || $.session.transferReceiver;
}

function setTransferReceiverByDefault(value) {
    $.session.transferReceiver = value;
}
