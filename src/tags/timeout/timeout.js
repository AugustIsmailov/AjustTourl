function timeout(interval, targetState) {
    $reactions.timeout({interval: interval, targetState: targetState});
    $.temp.setTimeOut = true;
}
