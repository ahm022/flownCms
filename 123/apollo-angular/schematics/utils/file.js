"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeScriptSourceFile = exports.getJsonFile = exports.parseJSON = void 0;
const ts = require("typescript");
const schematics_1 = require("@angular-devkit/schematics");
function parseJSON(path, content) {
    const { config, error } = ts.readConfigFile(path, () => content);
    if (error) {
        throw new schematics_1.SchematicsException(error.messageText.toString());
    }
    return config;
}
exports.parseJSON = parseJSON;
/**
 * Returns the parsed content of a json file.
 * @param host {Tree} The source tree.
 * @param path {String} The path to the file to read. Relative to the root of the tree.
 */
function getJsonFile(host, path) {
    const buffer = host.read(path);
    if (buffer === null) {
        throw new schematics_1.SchematicsException(`Couldn't read ${path}!`);
    }
    return parseJSON(path, buffer.toString('utf-8'));
}
exports.getJsonFile = getJsonFile;
/**
 * Reads file from given path and Returns TypeScript source file.
 * @param host {Tree} The source tree.
 * @param path {String} The path to the file to read. Relative to the root of the tree.
 * */
function getTypeScriptSourceFile(host, path) {
    const buffer = host.read(path);
    if (!buffer) {
        throw new schematics_1.SchematicsException(`Could not find ${path}!`);
    }
    const content = buffer.toString();
    const sourceFile = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
    return sourceFile;
}
exports.getTypeScriptSourceFile = getTypeScriptSourceFile;
//# sourceMappingURL=file.js.map