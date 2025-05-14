function getFullPath(key) {
    var pathParts = _.filter(key.split("/"), function (part) {
        return !!part;
    });
        switch (pathParts.length) {
        case 1:
            return "/KnowledgeBase/FAQ.Контент/Root/" + pathParts.join("/");
        case 2:
            return "/KnowledgeBase/FAQ.Контент/" + pathParts.join("/");
        case 3:
            if (!pathParts[0].startsWith("FAQ.")) {
                pathParts[0] = "FAQ." + pathParts[0];
            }
            return "/KnowledgeBase/" + pathParts.join("/");
        case 4:
            return "/" + pathParts.join("/");
        default:
            return key;
    }
}

// чтобы проверка на стейт работала в тестах
$reactions.pushReply = _.wrap($reactions.pushReply, function(pushFunc, params) {
    var newParams = copyObject(params);
    newParams.state = $.currentState;
    pushFunc(newParams);
});

function getAnswer(key, setResult) {
    var replies;
    var path;
    if (key) {
        path = getFullPath(key);
        log("path " + path);
        replies = $faq.getReplies(path);
        $.temp.currentQuestion = path;
    } else {
        replies = $faq.getReplies();
        $.temp.currentQuestion = $.intent.path;
    }
    if (setResult) {
        setSessionResult(_.last($.temp.currentQuestion.split("/")), true);
    }
    if (!replies || _.isEmpty(replies) || !replies[0]) {
        throw new Error("В Базе знаний нет ответа на вопрос \""
            + $.temp.currentQuestion + "\"");
    }
    return replies;
}

// случайный ответ
function answerRandom(key, setResult) {
    var arr = getAnswer(key, setResult);
    $reactions.pushReply(selectRandomArg(arr));
}

// ответ по порядку
function answerNext(key, setResult) {
    var arr = getAnswer(key, setResult);
    // работа с повторами
    var inx;
    $.session.repeatsInfo = $.session.repeatsInfo || {};
    inx = $.session.repeatsInfo[$.currentState];
    inx = inx === undefined ? 0 : inx + 1;
    inx = inx > arr.length - 1 ? 0 : inx;
    $.session.repeatsInfo[$.currentState] = inx;

    $reactions.pushReply(arr[inx]);
}

// ответ в зависимости от попытки
function answerOnAttempt(key, setResult) {
    var arr = getAnswer(key, setResult);
    var inx = $.client.sessionNum - 1 || 0;
    inx %= arr.length;
    $reactions.pushReply(arr[inx]);
}

function answerAll(key, setResult) {
    var arr = copyObject(getAnswer(key, setResult));
    arr.forEach(function(ans) {
        $reactions.pushReply(ans);
});
}

function answer(_mode, key, setResult) {
    var mode = _mode.toLowerCase();
    if (mode === "случайно" || mode === "random") {
        answerRandom(key, setResult);
    } else if (mode === "по порядку" || mode === "next") {
        answerNext(key, setResult);
    } else if (mode === "по номеру сессии" || mode === "by session number") {
        answerOnAttempt(key, setResult);
    } else if (mode === "все" || mode === "all") {
        answerAll(key, setResult);
    } else {
        throw new Error("Неверный режим в блоке \"Ответ\": " + mode + ". Возможные режимы: случайный, следующий по порядку, по номеру сессии, все.\nСтейт: " + $.currentState);
    }
}

function utcGreeting(timeZone) {
    var currentTime = moment($jsapi.currentTime()).add(timeZone, "h").hour();
    log("time = " + currentTime);
    if (currentTime < 12 || currentTime >= 22) {
        answerRandom("Приветствие/Общее");
    } else if (currentTime >= 12 && currentTime <= 17) {
        answerRandom("Приветствие/День");
    } else if (currentTime >= 18 && currentTime <= 21) {
        answerRandom("Приветствие/Вечер");
    }
    setSessionResult("Приветствие", true)
}
