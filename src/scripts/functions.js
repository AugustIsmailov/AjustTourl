function getQuestionName(_intentPath) {
    var intentPath = _intentPath || $.intent.path;
    return _.last(intentPath.split("/"));
}

/** Запись любых значений в $response.test для проверки в xml-тестах через тег <responseData field="test">. Также
 * записывает значение в логи для удобства отладки. Запись в $response.test происходит только в тестовом контексте.
 * @param {string} key - название поля
 * @param {any} value - значение поля
 * @param {boolean} add - добавить к предыдущему значению (будет записываться в массив),
 *      иначе будет перетираться при каждом вызове
 */
function addTestResponse(key, value, add) {
    if (testMode()) {
        $.response.test = $.response.test || {};
        if (add) {
            $.response.test[key] = $.response.test[key] || [];
            $.response.test[key].push(value);
        } else {
            $.response.test[key] = value;
        }
    }
    log(key + ": " + JSON.stringify(value));
}

function getMessage() {
    return $.request.rawRequest
    && $.request.rawRequest.callback_query
    && $.request.rawRequest.callback_query.message;
}

function deleteInlineButtons() {
    if (currentChannel() !== "telegram") return;
    var message = getMessage();
    var messageId = message.message_id;
    if (!messageId) {
        log("ERROR: cannot get message_id to delete inline buttons");
        return;
    }
    var body = {
        message_id: messageId,
        reply_markup: {
            inline_keyboard: []
        }
    };
    body.chat_id = message.chat.id;
    $conversationApi.sendRepliesToClient([{
        "type": "raw",
        "body": body,
        "method": "editMessageReplyMarkup"
      }]);
}

// на случай, если при кастомизации решения понадобится в условие запихать
function currentChannel() {
    return $.request.channelType;
}

$reactions.timeout = _.wrap($reactions.timeout, function(realFunc, args) {
    var index = _.pluck($.response.replies, "type").indexOf("timeout");
    if (index !== -1) {
        $.response.replies.splice(index, 1);
    }
    realFunc(args);
});

