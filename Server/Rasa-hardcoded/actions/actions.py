# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

import json
import random

#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []


class ActionAskQuestion(Action):
    def name(self) -> Text:
        return "action_ask_question"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, any]) -> List[Dict[Text, Any]]:
        entities = tracker.latest_message['entities']
        print(entities)
        message = ""

        file = open('../words.json').read()
        jFile = json.loads(file)

        for e in entities:
            if e['entity'] == 'question':
                name = e['value']

            if name not in jFile:
                return

            message = jFile[name]

            dispatcher.utter_message(text=name + ":=:" + message)

            print(message)

        return []
