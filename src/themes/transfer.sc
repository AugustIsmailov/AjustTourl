theme: /

    state: Transfer
        TransferWithWorkingHours:
            timeZone = 3
            onlyWorkDays = true
            min = 10:00
            max = 18:00
            stateAvailable = /Transfer/Available
            stateUnavailable = /Transfer/Unavailable

        state: Available
            if: $session.entryState === "/NeedOperator" || $temp.entryState === "/Swear"
                Answer:
                    mode = random
                    key = Перевод на оператора/Явный перевод
            else:
                Answer:
                    mode = random
                    key = Перевод на оператора/Неявный перевод
                    setResult = true
            TransferToOperator:
                titleOfCloseButton = Завершить диалог с оператором
                messageBeforeTransfer =
                ignoreOffline = false
                messageForWaitingOperator = Вам ответит первый освободившийся специалист.
                noOperatorsOnlineState = /Transfer/NoLivechatOperatorsOnline
                dialogCompletedState = /EvaluationRequest
                sendMessageHistoryAmount = 10
                sendMessagesToOperator = true

        state: Unavailable
            Answer:
                mode = random
                key = Перевод на оператора/Нерабочее время
                setResult = true
            go!: /SomethingElseAfterFail

        state: NoLivechatOperatorsOnline
            event!: noLivechatOperatorsOnline
            Answer:
                mode = random
                key = Перевод на оператора/Ошибка перевода
                setResult = true
            go!: /SomethingElseAfterFail
