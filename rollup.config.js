import typescript from "@rollup/plugin-typescript"
// import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"

/** @type {import('rollup').RollupOptions} */
const config = {
    input: "./src/InquirerFuzzyPath.ts",
    output: [
        {
            // dir: "dist",
            format: "esm",
            file: "./lib/index.js",
            // sourcemap: true,
            // inlineDynamicImports: true,
        },
        // {
        //     file: "dist/index.cjs",
        //     format: "cjs",
        //     exports: "named",
        // },
    ],
    external: [
        "fuzzy",
        "inquirer",
        "strip-ansi",
        "ansi-styles",
        "inquirer-autocomplete-prompt",
    ],
    plugins: [
        nodeResolve({
            // moduleDirectories: ["node_modules"],
            // jsnext: false,
            modulesOnly: true,
            // main: true,
            preferBuiltins: true,
        }),
        typescript({
            tsconfig: "tsconfig.json",
            // inlineSources: true,
            // allowJs: true,
            // sourceMap: true,

        }),
        // commonjs({
        //     include: [ "./main.ts", "node_modules/**" ], // Default: undefined
        //     extensions: [".js", ".ts"], // the ".ts" extension is required
        //     // if true then uses of `global` won't be dealt with by this plugin
        //     ignoreGlobal: true, // Default: false
        // }),
    ],
}

export default config
