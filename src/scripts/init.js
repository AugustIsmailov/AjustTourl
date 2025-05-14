bind("preMatch", function() {
    if (testMode() && $.request.query === "/test error") {
        throw new Error("Тестовая ошибка");
    }
    if ($.request.query === "/start" || (!testMode() && $.currentState === "/")) {
        $.temp.targetState = "/Start";
    }
    // заполняем предыдущий стейт для тестов
    if (testMode() && $.currentState !== "/PostProcess") {
        $.session.lastState = $.session.lastState || $.currentState;
        $.session.lastContext = $.session.lastContext || $.currentState;
    }
});

bind("preMatch", function() {
    if ($.request.event !== "telegramCallbackQuery") return;

    if (getMessage() && getMessage().message_id !== $.session.lastCallbackMessageId) {
        deleteInlineButtons();
        $.session.lastCallbackMessageId = getMessage().message_id;
        if ($.request.query.startsWith("/")) {
            $.temp.targetState = $.request.query;
        } else {
            delete $.request.event;
        }
    }
}, "/", "Handle telegramCallbackQuery");

bind("preProcess", function() {
    $.temp.entryState = $.currentState;
    if ($.intent) {
        log("INTENT: " + getQuestionName());
    }

    // Обработка запросов после прощания
    if ($.request.query !== "/start" && $.session.lastContext === "/GoodBye") {
            $.temp.targetState = "/GoodBye/NewSession";
            if ($.intent && $.intent.path.startsWith("/KnowledgeBase/FAQ")
                && !$.intent.path.startsWith("/KnowledgeBase/FAQ.Контент")) {
                    $.temp.fromGoodBye = true;
                    $.temp.matchState = $.currentState;
            }
    }
});

bind("postProcess", function() {
    log($.response.replies);
    if ($.currentState !== "/PostProcess") {
        $.session.lastEntryState = $.temp.entryState;
        $.session.lastState = $.currentState;
        if (!testMode() || $.client.testTimeout) {
            $reactions.transition("/PostProcess");
        }
    }
    $.session.lastContext = $.contextPath;
});

bind("onAnyError", function() {
    if ((!testMode() || $.request.query === "/test error")
        && $.request.targetState !== "/Errors") {
        $reactions.timeout({interval: "1s", targetState: "/Errors"});
    } else {
        throw new Error($.exception.message);
    }
});
