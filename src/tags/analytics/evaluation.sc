theme: /Evaluation

    state: Request
        script:
            $session.Nps = $request.data.args;
            log("error" + JSON.stringify($request.data))
            var buttonsArray = JSON.parse($session.Nps.buttons)
            var buttonsType = getButtonsType();
            if (getCurrentChannelInfo()[buttonsType] && buttonsArray) {
                answer("random", "Запрос оценки диалога/Запрос c кнопками");
                $reactions[buttonsType](buttonsArray);
            } else {
                answer("random", "Запрос оценки диалога/Запрос без кнопок");
            }
        
        state: Received
            intent: /Запрос оценки диалога
            script:
                $analytics.setNps($parseTree._evaluation);
                addTestResponse("NPS", $parseTree._evaluation);
            Answer:
                mode = next
                key = Запрос оценки диалога/Получили оценку
            go!: {{$session.Nps.successState}}
