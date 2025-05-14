// счетчик попаданий
function countRepeats(_key) {
    var key = _key || $.currentState;
    $.session.repeats = $.session.repeats || {};
    $.session.repeats[key] = $.session.repeats[key] ? $.session.repeats[key] + 1 : 1;
    log(key + " count: " + $.session.repeats[key]);
    return $.session.repeats[key];
}

// счетчик попаданий подряд
function countRepeatsInRow(_key) {
    var key = _key || $.currentState;
    $.temp.inRowCounterKeys = $.temp.inRowCounterKeys || [];
    $.temp.inRowCounterKeys.push(key);
    $.session.repeatsInRow = $.session.repeatsInRow || {};
    $.session.repeatsInRow[key] = $.session.repeatsInRow[key] ? $.session.repeatsInRow[key] + 1 : 1;
    log(key + " count in row: " + $.session.repeatsInRow);
    return $.session.repeatsInRow[key];
}

bind("postProcess", function() {
    $.session.repeatsInRow = _.pick($.session.repeatsInRow, $.temp.inRowCounterKeys);
});

function counterWithTransition(inRow, limit, key, targetState) {
    if ($.temp.repeat) return;
    var counter = inRow ? countRepeatsInRow(key) : countRepeats(key);
    if (counter > limit) {
        $reactions.transition(targetState);
    }
}

function countSessionNumber() {
    $.client.sessionNum = $.client.sessionNum || 0;
    $.client.sessionNum += 1;
}
