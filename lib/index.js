import Choices from 'inquirer/lib/objects/choices';
import InquirerAutocomplete from 'inquirer-autocomplete-prompt';
import stripAnsi from 'strip-ansi';
import { readdir } from 'fs/promises';
import path from 'path';
import style from 'ansi-styles';
import fuzzy from 'fuzzy';

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const getPaths = (options) => {
    const { rootPath, pattern, excludeFilter, defaultItem, depthLimit, } = options;
    const fuzzOptions = {
        pre: style.green.open,
        post: style.green.close,
    };
    const nodes = listNodes(rootPath, depthLimit, options);
    const filterPromise = nodes.then((nodeList) => {
        const preFilteredNodes = !excludeFilter
            ? nodeList
            : nodeList.filter(node => !excludeFilter(node));
        const filteredNodes = fuzzy
            .filter(pattern || "", preFilteredNodes, fuzzOptions)
            .map(e => e.string);
        if (!pattern && defaultItem) {
            filteredNodes.unshift(defaultItem);
        }
        return filteredNodes;
    });
    return filterPromise;
};
const listNodes = (nodePath, level, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { excludePath, itemType, depthLimit, } = options;
    try {
        if (excludePath(nodePath)) {
            return [];
        }
        const nodes = yield readdir(nodePath);
        const currentNode = (itemType !== "file" ? [nodePath] : []);
        if (nodes.length > 0 && (depthLimit === undefined || level >= 0)) {
            const nodesWithPath = nodes.map(nodeName => listNodes(path.join(nodePath, nodeName), depthLimit ? level - 1 : undefined, options));
            const subNodes = yield Promise.all(nodesWithPath);
            return subNodes.reduce((acc, val) => acc.concat(val), currentNode);
        }
        return currentNode;
    }
    catch (err) {
        if (err.code === "ENOTDIR") {
            return itemType !== "directory" ? [nodePath] : [];
        }
        return [];
    }
});

class InquirerFuzzyPath extends InquirerAutocomplete {
    constructor(question, rl, answers) {
        const { depthLimit, itemType = "any", rootPath = ".", excludePath = () => false, excludeFilter = false, } = question;
        const questionBase = Object.assign({}, question, {
            source: (_, pattern) => getPaths({
                rootPath,
                pattern,
                excludePath,
                excludeFilter,
                itemType,
                defaultItem: question.default,
                depthLimit,
            }),
        });
        super(questionBase, rl, answers);
    }
    search(searchTerm) {
        return super.search(searchTerm).then(() => {
            this.currentChoices.getChoice = (choiceIndex) => {
                const choice = Choices.prototype.getChoice.call(this.currentChoices, choiceIndex);
                return {
                    value: stripAnsi(choice.value),
                    name: stripAnsi(choice.name),
                    short: stripAnsi(choice.name),
                };
            };
        });
    }
    onSubmit(line) {
        super.onSubmit(stripAnsi(line));
    }
}

export { InquirerFuzzyPath };
//# sourceMappingURL=index.js.map
