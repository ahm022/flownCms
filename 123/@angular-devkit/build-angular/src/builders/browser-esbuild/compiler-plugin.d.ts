/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import type { Plugin } from 'esbuild';
import { BundleStylesheetOptions } from './stylesheets';
export declare function createCompilerPlugin(pluginOptions: {
    sourcemap: boolean;
    tsconfig: string;
    advancedOptimizations?: boolean;
}, styleOptions: BundleStylesheetOptions): Plugin;
