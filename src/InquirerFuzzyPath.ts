import Choices from "inquirer/lib/objects/choices"
import InquirerAutocomplete from "inquirer-autocomplete-prompt"
import stripAnsi from "strip-ansi"

import { getPaths } from "./get-paths"

export class InquirerFuzzyPath extends InquirerAutocomplete<any> {

    constructor(question, rl, answers) {
        const {
            depthLimit,
            itemType = "any",
            rootPath = ".",
            excludePath = () => false,
            excludeFilter = false,
        } = question
        const questionBase = Object.assign(
            {},
            question,
            {
                source: (_, pattern) => getPaths({
                    rootPath,
                    pattern,
                    excludePath,
                    excludeFilter,
                    itemType,
                    defaultItem: question.default,
                    depthLimit,
                }),
            },
        )
        super(questionBase, rl, answers)
    }

    search(searchTerm: string) {
        return super.search(searchTerm).then(() => {
            this.currentChoices.getChoice = (choiceIndex) => {
                const choice = Choices.prototype.getChoice.call(this.currentChoices, choiceIndex)
                return {
                    value: stripAnsi(choice.value),
                    name:  stripAnsi(choice.name),
                    short: stripAnsi(choice.name),
                }
            }
        })
    }

    onSubmit(line: string) {
        super.onSubmit(stripAnsi(line))
    }
}
