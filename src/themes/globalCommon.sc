theme: /

    state: PostProcess || noContext = true
        if: $session.lastContext !== "/GoodBye" && !$temp.setTimeOut && !$context.contextPath.startsWith("/Evaluation")
            Timeout:
                interval = 2h
                targetState = /Silence

    state: Silence
        SetScenarioAction:
            value = Silence
        Answer:
            mode = random
            key = Клиент молчит
            setResult = true
        Timeout:
            interval = 2h
            targetState = /NPS
        intent: /Да || toState = "/SomethingElse/Yes", onlyThisState = true
        intent: /Нет || toState = "/GoodBye", onlyThisState = true

    state: GlobalFallback || noContext = true
        event!: noMatch
        SetScenarioAction:
            value = NoMatch
        CounterWithTransition:
            inRow = true
            limit = 1
            key =
            targetState = /GlobalFallback/Transfer
        Answer:
            mode = next
            key = Запрос не распознан
            setResult = true
        ShowButtons:
            inline = true
            buttons = ["Технические проблемы", "Услуги и продукты", "Программы лояльности", "О сотрудничестве", "Контакты"]
            other = true

        state: Transfer
            SetScenarioAction:
                value = NoMatchTransfer
            SetAutomationStatus:
                value = false
            go!: /Transfer

    state: NeedOperator || noContext = true
        intent!: /Просьба перевести на оператора
        SetScenarioAction:
            value = AskForOperator
        if: $session.lastState === "/HowCanIHelpYou"
            CounterWithTransition:
                inRow = true
                limit = 1
                key =
                targetState = /Transfer
            Answer:
                mode = random
                key = Просьба перевести на оператора
                setResult = true
        else:
            SetScenarioAction:
                value = AskForOperatorTransfer
            SetAutomationStatus:
                value = false
            go!: /Transfer

    state: Swear || noContext = true
        intent!: /Нецензурная лексика
        SetScenarioAction:
            value = Swear
        if: $session.lastState === "/HowCanIHelpYou"
            Answer:
                mode = random
                key = Нецензурная лексика
                setResult = true
        else:
            SetScenarioAction:
                value = SwearTransfer
            SetAutomationStatus:
                value = false
            go!: /Transfer

    state: Gratitude || noContext = true
        intent!: /Благодарность
        Answer:
            mode = random
            key = Благодарность
            setResult = true
        go!: /SomethingElse

    state: Wrong || noContext = true
        intent!: /Некорректный ответ
        SetScenarioAction:
            value = Wrong
        SetAutomationStatus:
            value = false
        Answer:
            mode = random
            key = Некорректный ответ
            setResult = true

    state: Errors
        Answer:
            mode = random
            key = Ошибка
            setResult = true
        go!: /SomethingElseAfterFail

    state: LenghtLimit || noContext = true
        event: timeLimit
        event: lengthLimit
        event: nluSystemLimit
        Answer:
            mode = random
            key = Превышен лимит запроса
            setResult = true
