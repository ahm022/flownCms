"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDependenciesMap = exports.factory = void 0;
const path_1 = require("path");
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
const core_1 = require("@angular-devkit/core");
const utils_1 = require("../utils");
const ast_1 = require("../utils/ast");
function factory(options) {
    return (0, schematics_1.chain)([
        addDependencies(options),
        inludeAsyncIterableLib(),
        allowSyntheticDefaultImports(),
        addSetupFiles(options),
        importSetupModule(options),
        importHttpClientModule(options),
    ]);
}
exports.factory = factory;
function createDependenciesMap(options) {
    var _a;
    return {
        'apollo-angular': '^3.0.1',
        '@apollo/client': '^3.0.0',
        graphql: `^${(_a = options.graphql) !== null && _a !== void 0 ? _a : '16.0.0'}`,
    };
}
exports.createDependenciesMap = createDependenciesMap;
/**
 * Add all necessary node packages
 * as dependencies in the package.json
 * and installs them by running `npm install`.
 */
function addDependencies(options) {
    return (host, context) => {
        const packageJsonPath = 'package.json';
        const packageJson = (0, utils_1.getJsonFile)(host, packageJsonPath);
        packageJson.dependencies = packageJson.dependencies || {};
        const dependenciesMap = createDependenciesMap(options);
        for (const dependency in dependenciesMap) {
            if (dependenciesMap.hasOwnProperty(dependency)) {
                const version = dependenciesMap[dependency];
                if (!packageJson.dependencies[dependency]) {
                    packageJson.dependencies[dependency] = version;
                }
            }
        }
        // save the changed file
        host.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
        // schedule `npm install`
        context.addTask(new tasks_1.NodePackageInstallTask());
        return host;
    };
}
function inludeAsyncIterableLib() {
    const requiredLib = 'esnext.asynciterable';
    function updateFn(tsconfig) {
        const compilerOptions = tsconfig.compilerOptions;
        if (compilerOptions &&
            compilerOptions.lib &&
            !compilerOptions.lib.find((lib) => lib.toLowerCase() === requiredLib)) {
            compilerOptions.lib.push(requiredLib);
            return true;
        }
    }
    return (host) => {
        if (!updateTSConfig('tsconfig.json', host, updateFn) &&
            !updateTSConfig('tsconfig.base.json', host, updateFn)) {
            console.error('\n' +
                core_1.tags.stripIndent `
              We couln't find '${requiredLib}' in the list of library files to be included in the compilation.
              It's required by '@apollo/client/core' package so please add it to your tsconfig.
            ` +
                '\n');
        }
        return host;
    };
}
function updateTSConfig(tsconfigPath, host, updateFn) {
    try {
        const tsconfig = (0, utils_1.getJsonFile)(host, tsconfigPath);
        if (updateFn(tsconfig)) {
            host.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2));
            return true;
        }
    }
    catch (error) {
        //
    }
    return false;
}
function allowSyntheticDefaultImports() {
    function updateFn(tsconfig) {
        var _a;
        if ((tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) &&
            ((_a = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) === null || _a === void 0 ? void 0 : _a.lib) &&
            !tsconfig.compilerOptions.allowSyntheticDefaultImports) {
            tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
            return true;
        }
    }
    return (host) => {
        if (!updateTSConfig('tsconfig.json', host, updateFn) &&
            !updateTSConfig('tsconfig.base.json', host, updateFn)) {
            console.error('\n' +
                core_1.tags.stripIndent `
              We couln't enable 'allowSyntheticDefaultImports' flag.
              It's required by '@apollo/client/core' package so please add it to your tsconfig.
            ` +
                '\n');
        }
        return host;
    };
}
function addSetupFiles(options) {
    return (host) => {
        const mainPath = (0, utils_1.getMainPath)(host, options.project);
        const appModulePath = (0, ng_ast_utils_1.getAppModulePath)(host, mainPath);
        const appModuleDirectory = (0, path_1.dirname)(appModulePath);
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.template)({
                endpoint: options.endpoint,
            }),
            (0, schematics_1.move)(appModuleDirectory),
        ]);
        return (0, schematics_1.mergeWith)(templateSource);
    };
}
function importSetupModule(options) {
    return (host) => {
        (0, ast_1.addModuleImportToRootModule)(host, 'GraphQLModule', './graphql.module', options.project);
        return host;
    };
}
function importHttpClientModule(options) {
    return (host) => {
        (0, ast_1.addModuleImportToRootModule)(host, 'HttpClientModule', '@angular/common/http', options.project);
    };
}
//# sourceMappingURL=index.js.map