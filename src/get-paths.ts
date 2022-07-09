import { readdir } from "fs/promises"
import path from "path"

import style from "ansi-styles"
import fuzzy from "fuzzy"

export interface GetPathsOptions {
    rootPath: string
    pattern: any
    excludePath: (nodePath: string) => boolean
    excludeFilter: (nodePath: string) => boolean
    itemType: "any" | "directory" | "file"
    defaultItem: any
    depthLimit: number
}

export const getPaths = (options: GetPathsOptions) => {

    const {
        rootPath,
        pattern,
        excludeFilter,
        defaultItem,
        depthLimit,
    } = options

    const fuzzOptions = {
        pre: style.green.open,
        post: style.green.close,
    }

    const nodes = listNodes(rootPath, depthLimit, options)
    const filterPromise = nodes.then((nodeList: string[]) => {

        const preFilteredNodes =
            !excludeFilter
                ? nodeList
                : nodeList.filter(node => !excludeFilter(node))

        const filteredNodes =
            fuzzy
                .filter(pattern || "", preFilteredNodes, fuzzOptions)
                .map(e => e.string)

        if (!pattern && defaultItem) {
            filteredNodes.unshift(defaultItem)
        }
        return filteredNodes
    })
    return filterPromise
}

const listNodes = async (nodePath: string, level: number, options: GetPathsOptions) => {

    const {
        excludePath,
        itemType,
        depthLimit,
    } = options

    try {
        if (excludePath(nodePath)) {
            return []
        }
        const nodes = await readdir(nodePath)
        const currentNode = (itemType !== "file" ? [nodePath] : [])
        if (nodes.length > 0 && (depthLimit === undefined || level >= 0)) {
            const nodesWithPath = nodes.map(
                nodeName => listNodes(
                    path.join(nodePath, nodeName),
                    depthLimit ? level - 1 : undefined,
                    options,
                ),
            )
            const subNodes = await Promise.all(nodesWithPath)
            return subNodes.reduce((acc, val) => acc.concat(val), currentNode)
        }
        return currentNode
    } catch (err) {
        if (err.code === "ENOTDIR") {
            return itemType !== "directory" ? [nodePath] : []
        }
        return []
    }
}
