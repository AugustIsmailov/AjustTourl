function getCurrentChannelInfo() {
    if (testMode() && !currentChannel()) {
        return $Channels.chatwidget;
    }
    return $Channels[currentChannel()] || {};
}

function showButtons(inline, other, _buttons) {
    var buttons = copyObject(_buttons);
    var buttonsType = getButtonsType(inline);
    // если в конфиге есть макс кол-во кнопок, обрезаем
    var maxButtons = getCurrentChannelInfo()[buttonsType] && getCurrentChannelInfo()[buttonsType].amount;
    if (maxButtons && maxButtons < buttons.length) {
        var limit = other ? maxButtons - 1 : maxButtons;
        buttons = buttons.slice(0, limit);
    }
    if (other) {
        buttons.push("Другое");
    }
    $reactions[buttonsType](buttons);
}

function getButtonsType(inline) {
    // если нет инфы в конфиге, верим в пользователя
    var channelInfo = getCurrentChannelInfo();
    log("channelInfo " + JSON.stringify(channelInfo));
    if (!channelInfo) {
        return inline ? "inlineButtons" : "buttons";
    }
    if (inline
        && channelInfo.inlineButtons
        && channelInfo.inlineButtons.usage) {
        return "inlineButtons";
    }
    return "buttons";
}
