"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const ts = __importStar(require("../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const ast_utils_1 = require("../utility/ast-utils");
const change_1 = require("../utility/change");
const find_module_1 = require("../utility/find-module");
const parse_name_1 = require("../utility/parse-name");
const workspace_1 = require("../utility/workspace");
const schema_1 = require("./schema");
function buildRelativeModulePath(options, modulePath) {
    const importModulePath = (0, core_1.normalize)(`/${options.path}/` +
        (options.flat ? '' : schematics_1.strings.dasherize(options.name) + '/') +
        schematics_1.strings.dasherize(options.name) +
        '.module');
    return (0, find_module_1.buildRelativePath)(modulePath, importModulePath);
}
function addDeclarationToNgModule(options) {
    return (host) => {
        if (!options.module) {
            return host;
        }
        const modulePath = options.module;
        const sourceText = host.readText(modulePath);
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
        const relativePath = buildRelativeModulePath(options, modulePath);
        const changes = (0, ast_utils_1.addImportToModule)(source, modulePath, schematics_1.strings.classify(`${options.name}Module`), relativePath);
        const recorder = host.beginUpdate(modulePath);
        for (const change of changes) {
            if (change instanceof change_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}
function addRouteDeclarationToNgModule(options, routingModulePath) {
    return (host) => {
        if (!options.route) {
            return host;
        }
        if (!options.module) {
            throw new Error('Module option required when creating a lazy loaded routing module.');
        }
        let path;
        if (routingModulePath) {
            path = routingModulePath;
        }
        else {
            path = options.module;
        }
        const sourceText = host.readText(path);
        const addDeclaration = (0, ast_utils_1.addRouteDeclarationToModule)(ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true), path, buildRoute(options, options.module));
        const recorder = host.beginUpdate(path);
        recorder.insertLeft(addDeclaration.pos, addDeclaration.toAdd);
        host.commitUpdate(recorder);
        return host;
    };
}
function getRoutingModulePath(host, modulePath) {
    const routingModulePath = modulePath.endsWith(find_module_1.ROUTING_MODULE_EXT)
        ? modulePath
        : modulePath.replace(find_module_1.MODULE_EXT, find_module_1.ROUTING_MODULE_EXT);
    return host.exists(routingModulePath) ? (0, core_1.normalize)(routingModulePath) : undefined;
}
function buildRoute(options, modulePath) {
    const relativeModulePath = buildRelativeModulePath(options, modulePath);
    const moduleName = `${schematics_1.strings.classify(options.name)}Module`;
    const loadChildren = `() => import('${relativeModulePath}').then(m => m.${moduleName})`;
    return `{ path: '${options.route}', loadChildren: ${loadChildren} }`;
}
function default_1(options) {
    return async (host) => {
        if (options.path === undefined) {
            options.path = await (0, workspace_1.createDefaultPath)(host, options.project);
        }
        if (options.module) {
            options.module = (0, find_module_1.findModuleFromOptions)(host, options);
        }
        let routingModulePath;
        const isLazyLoadedModuleGen = !!(options.route && options.module);
        if (isLazyLoadedModuleGen) {
            options.routingScope = schema_1.RoutingScope.Child;
            routingModulePath = getRoutingModulePath(host, options.module);
        }
        const parsedPath = (0, parse_name_1.parseName)(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            options.routing || (isLazyLoadedModuleGen && routingModulePath)
                ? (0, schematics_1.noop)()
                : (0, schematics_1.filter)((path) => !path.endsWith('-routing.module.ts.template')),
            (0, schematics_1.applyTemplates)({
                ...schematics_1.strings,
                'if-flat': (s) => (options.flat ? '' : s),
                lazyRoute: isLazyLoadedModuleGen,
                lazyRouteWithoutRouteModule: isLazyLoadedModuleGen && !routingModulePath,
                lazyRouteWithRouteModule: isLazyLoadedModuleGen && !!routingModulePath,
                ...options,
            }),
            (0, schematics_1.move)(parsedPath.path),
        ]);
        const moduleDasherized = schematics_1.strings.dasherize(options.name);
        const modulePath = `${!options.flat ? moduleDasherized + '/' : ''}${moduleDasherized}.module.ts`;
        const componentOptions = {
            module: modulePath,
            flat: options.flat,
            name: options.name,
            path: options.path,
            project: options.project,
        };
        return (0, schematics_1.chain)([
            !isLazyLoadedModuleGen ? addDeclarationToNgModule(options) : (0, schematics_1.noop)(),
            addRouteDeclarationToNgModule(options, routingModulePath),
            (0, schematics_1.mergeWith)(templateSource),
            isLazyLoadedModuleGen ? (0, schematics_1.schematic)('component', componentOptions) : (0, schematics_1.noop)(),
        ]);
    };
}
exports.default = default_1;
