"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestApp = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const testing_1 = require("@angular-devkit/schematics/testing");
const collectionPath = (0, path_1.join)(__dirname, '../collection.json');
function createTestApp(appOptions = {}) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const runner = new testing_1.SchematicTestRunner('apollo-angular', collectionPath);
        const workspaceTree = yield runner
            .runExternalSchematicAsync('@schematics/angular', 'workspace', {
            name: 'workspace',
            version: '11.0.0',
            newProjectRoot: 'projects',
        })
            .toPromise();
        return runner
            .runExternalSchematicAsync('@schematics/angular', 'application', Object.assign(Object.assign({}, appOptions), { name: 'apollo' }), workspaceTree)
            .toPromise();
    });
}
exports.createTestApp = createTestApp;
//# sourceMappingURL=test.js.map