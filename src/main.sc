require: requirements.sc
theme: /

    state: Start
        q!: $regex</start>
        StartSession:
        SetTransferReceiverByDefault:
            value = 123456789
        go!: /Hello

    state: Hello
        intent!: /Приветствие
        SetScenarioAction:
            value = IncomingChat
        SetAutomationStatus:
            value = false
        UtcGreeting:
            timeZone = 3
        if: $temp.fromGoodBye
            go!: {{$temp.matchState}}
        else:
            go!: /CompanyIntroduction

    state: CompanyIntroduction
        Answer:
            mode = random
            key = Представление компании
            setResult = true
        go!: /HowCanIHelpYou

    state: HowCanIHelpYou
        intent!: /Главное меню
        Answer:
            mode = random
            key = Уточнение причины обращения
            setResult = true
        ShowButtons:
            inline = true
            buttons = ["Технические проблемы", "Услуги и продукты", "Программы лояльности", "О сотрудничестве", "Контакты"]
            other = true

    state: Other || noContext = true
        intent!: /Другое
        Answer:
            mode = random
            key = Другое
            setResult = true
        ShowButtons:
            inline = true
            buttons = ["Вернуться в главное меню"]
            other = false

    state: SomethingElse
        Answer:
            mode = random
            key = Уточнение наличия дополнительных вопросов
            setResult = true
        ShowButtons:
            inline = true
            buttons = ["Технические проблемы", "Услуги и продукты", "Программы лояльности", "О сотрудничестве", "Контакты"]
            other = true
        intent: /Да || toState = "/SomethingElse/Yes", onlyThisState = true
        intent: /Нет || toState = "/SomethingElse/No", onlyThisState = true

        state: Yes || noContext = true
            Answer:
                mode = random
                key = Есть дополнительный вопрос
                setResult = true

        state: No
            SetAutomationStatus:
                value = true
            go!: /NPS


    state: SomethingElseAfterFail
        Answer:
            mode = random
            key = Уточнение наличия дополнительных вопросов после ошибки
            setResult = true
        go: /SomethingElse

    state: NPS
        event: livechatFinished
        Timeout:
            interval = 5h
            targetState = /GoodBye
        NPS:
            buttons = ["🤩","😐","☹️"]
            successState = /GoodBye

    state: GoodBye
        intent!: /Прощание
        if: $session.lastState !== "/Evaluation/Request/Received"
            CounterWithTransition:
                    inRow = false
                    limit = 2
                    key =
                    targetState = /NPS
        Answer:
            mode = random
            key = Прощание
            setResult = true

        state: NewSession || noContext = true
            event: noMatch
            if: (!$.intent)
                go!: /Hello
            elseif: ($.intent.path != "/Благодарность" && $.intent.path != "/Прощание")
                go!: /Start


    state: Offtopic
        intentGroup!: /KnowledgeBase/FAQ.Офтопик
        SetSessionTopicFAQ:
            value =
        Answer:
            mode = random
            key =
            setResult = true
        go!: /SomethingElse

    state: FAQ
        intentGroup!: /KnowledgeBase/FAQ.FAQ
        SetSessionTopicFAQ:
            value =
        SetAutomationStatus:
            value = true
        Answer:
            mode = random
            key =
            setResult = true
        go!: /SomethingElse

    state: TransferTriggers
        intentGroup!: /KnowledgeBase/FAQ.Перевод на оператора
        SetSessionTopicFAQ:
            value =
        SetAutomationStatus:
            value = true
        GetTransferReceiverByTopic:
        go!: /Transfer
