function setScenarioAction(value) {
    $analytics.setScenarioAction(value);
}

function setAutomationStatus(value) {
    $analytics.setAutomationStatus(value);
}

function setSessionTopic(value) {
    $analytics.setSessionTopic(value);
}

function setSessionTopicFAQ(value) {
    var faqValue = value || ($.intent && $.intent.path.split("/")[4]);
    $analytics.setSessionTopic(faqValue);
}

function setSessionResult(value, safeMode) {
    if (safeMode && $.response.analytics && $.response.analytics.sessionResult) return;
    $analytics.setSessionResult(value);
}