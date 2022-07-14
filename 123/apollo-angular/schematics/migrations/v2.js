"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateImports = exports.migrateTsConfig = void 0;
const tslib_1 = require("tslib");
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const ts = require("typescript");
const utils_1 = require("../utils");
const index_1 = require("../install/index");
function default_1() {
    return (0, schematics_1.chain)([migrateImports, migrateTsConfig, migrateDependencies]);
}
exports.default = default_1;
function migrateDependencies() {
    return (tree, context) => {
        const packageJsonPath = 'package.json';
        const packageJson = (0, utils_1.getJsonFile)(tree, packageJsonPath);
        packageJson.dependencies = packageJson.dependencies || {};
        const dependenciesMap = (0, index_1.createDependenciesMap)({});
        for (const dependency in dependenciesMap) {
            if (dependenciesMap.hasOwnProperty(dependency)) {
                const version = dependenciesMap[dependency];
                packageJson.dependencies[dependency] = version;
            }
        }
        const packagesToRemove = [
            'graphql-tag',
            'apollo-client',
            'apollo-cache',
            'apollo-cache-inmemory',
            'apollo-utilities',
            'apollo-link',
            'apollo-link-http',
            'apollo-link-batch-http',
            'apollo-link-context',
            'apollo-link-error',
            'apollo-link-schema',
            'apollo-link-ws',
            'apollo-angular-link-http',
            'apollo-angular-link-http-batch',
            'apollo-angular-link-headers',
        ];
        const removedPackages = [];
        packagesToRemove.forEach((packageName) => {
            var _a, _b;
            let removed = false;
            if ((_a = packageJson.dependencies) === null || _a === void 0 ? void 0 : _a[packageName]) {
                delete packageJson.dependencies[packageName];
                removed = true;
            }
            if ((_b = packageJson.devDependencies) === null || _b === void 0 ? void 0 : _b[packageName]) {
                delete packageJson.devDependencies[packageName];
                removed = true;
            }
            if (removed) {
                removedPackages.push(packageName);
            }
        });
        removedPackages.forEach((packageName) => {
            context.logger.info(`Removed ${packageName} dependency`);
        });
        // save the changed file
        tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
        // schedule `npm install`
        context.addTask(new tasks_1.NodePackageInstallTask());
        return tree;
    };
}
function migrateTsConfig(tree) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const tsconfigPath = 'tsconfig.json';
        const tsconfig = (0, utils_1.getJsonFile)(tree, tsconfigPath);
        const compilerOptions = tsconfig.compilerOptions;
        if (compilerOptions) {
            compilerOptions.allowSyntheticDefaultImports = true;
            tree.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2));
        }
        else {
            const tsconfigBasePath = 'tsconfig.base.json';
            const tsconfigBase = (0, utils_1.getJsonFile)(tree, tsconfigBasePath);
            const baseCompilerOptions = tsconfigBase.compilerOptions;
            if (baseCompilerOptions) {
                baseCompilerOptions.allowSyntheticDefaultImports = true;
                tree.overwrite(tsconfigBasePath, JSON.stringify(tsconfigBase, null, 2));
            }
        }
    });
}
exports.migrateTsConfig = migrateTsConfig;
function getIdentifiers(namedBindings, onIdentifier) {
    namedBindings.forEachChild((named) => {
        if (ts.isImportSpecifier(named)) {
            const name = named.propertyName && typeof named.propertyName !== 'undefined'
                ? named.propertyName.escapedText.toString()
                : named.name.escapedText.toString();
            onIdentifier({
                name,
                alias: name === named.name.escapedText.toString() ? undefined : name,
            });
        }
    });
}
function migrateImports(tree) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        tree.visit((path) => {
            if (path.includes('node_modules') || !path.endsWith('.ts')) {
                return;
            }
            const importsMap = {};
            function collectIdentifiers(packageName, namedBindings) {
                getIdentifiers(namedBindings, ({ name, alias }) => {
                    if (!importsMap[packageName]) {
                        importsMap[packageName] = [];
                    }
                    importsMap[packageName].push({
                        name,
                        alias,
                    });
                });
            }
            function redirectImport({ source, target, modulePath, statement, recorder, }) {
                if (modulePath === source) {
                    if (statement.importClause.namedBindings) {
                        collectIdentifiers(target, statement.importClause.namedBindings);
                    }
                    recorder.remove(statement.getStart(), statement.getWidth());
                }
            }
            function redirectDefaultImport({ identifier, source, target, modulePath, statement, recorder, }) {
                if (modulePath === source && statement.importClause.name) {
                    if (!importsMap[target]) {
                        importsMap[target] = [];
                    }
                    const alias = statement.importClause.name.escapedText.toString();
                    importsMap[target].push({
                        name: identifier,
                        alias: alias !== identifier ? alias : undefined,
                    });
                    recorder.remove(statement.getStart(), statement.getWidth());
                }
            }
            const sourceFile = ts.createSourceFile(path, tree.read(path).toString(), ts.ScriptTarget.Latest, true);
            const recorder = tree.beginUpdate(path);
            sourceFile.statements.forEach((statement) => {
                if (ts.isImportDeclaration(statement) &&
                    ts.isStringLiteral(statement.moduleSpecifier)) {
                    const nodeText = statement.moduleSpecifier.getText(sourceFile);
                    const modulePath = statement.moduleSpecifier
                        .getText(sourceFile)
                        .substr(1, nodeText.length - 2);
                    redirectImport({
                        source: 'apollo-cache-inmemory',
                        target: '@apollo/client/core',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-client',
                        target: '@apollo/client/core',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-link',
                        target: '@apollo/client/core',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-cache',
                        target: '@apollo/client/core',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-angular-link-http',
                        target: 'apollo-angular/http',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-angular-link-http-batch',
                        target: 'apollo-angular/http',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-utilities',
                        target: '@apollo/client/utilities',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-link-http',
                        target: '@apollo/client/link/http',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-link-batch-http',
                        target: '@apollo/client/link/batch-http',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-link-context',
                        target: '@apollo/client/link/context',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-link-error',
                        target: '@apollo/client/link/error',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-link-schema',
                        target: '@apollo/client/link/schema',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-link-ws',
                        target: '@apollo/client/link/ws',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-angular',
                        target: 'apollo-angular',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectImport({
                        source: 'apollo-angular-link-headers',
                        target: 'apollo-angular/headers',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectDefaultImport({
                        identifier: 'ApolloClient',
                        source: 'apollo-client',
                        target: '@apollo/client/core',
                        recorder,
                        statement,
                        modulePath,
                    });
                    redirectDefaultImport({
                        identifier: 'gql',
                        source: 'graphql-tag',
                        target: 'apollo-angular',
                        recorder,
                        statement,
                        modulePath,
                    });
                }
            });
            const importSources = Object.keys(importsMap);
            importSources.forEach((importSource) => {
                const props = importsMap[importSource]
                    .filter((im, i, all) => {
                    if (im.alias) {
                        return all.findIndex((f) => f.alias === im.alias) === i;
                    }
                    return all.findIndex((f) => f.name === im.name) === i;
                })
                    .map((im) => (im.alias ? `${im.name} as ${im.alias}` : im.name))
                    .join(', ');
                recorder.insertLeft(sourceFile.getStart(), `import {${props}} from '${importSource}';\n`);
            });
            if (importSources.length) {
                tree.commitUpdate(recorder);
            }
        });
    });
}
exports.migrateImports = migrateImports;
//# sourceMappingURL=v2.js.map