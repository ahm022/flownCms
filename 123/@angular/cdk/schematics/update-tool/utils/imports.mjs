"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImportOfIdentifier = void 0;
const ts = require("typescript");
/** Resolves the import of the specified identifier. */
function getImportOfIdentifier(node, typeChecker) {
    // Free standing identifiers which resolve to an import will be handled
    // as direct imports. e.g. "@Component()" where "Component" is an identifier
    // referring to an import specifier.
    const directImport = getSpecificImportOfIdentifier(node, typeChecker);
    if (directImport !== null) {
        return directImport;
    }
    else if (ts.isQualifiedName(node.parent) && node.parent.right === node) {
        // Determines the import of a qualified name. e.g. "let t: core.Component". In that
        // case, the import of the most left identifier will be determined ("core").
        const qualifierRoot = getQualifiedNameRoot(node.parent);
        if (qualifierRoot) {
            const moduleName = getImportOfNamespacedIdentifier(qualifierRoot, typeChecker);
            if (moduleName) {
                return { moduleName, symbolName: node.text };
            }
        }
    }
    else if (ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) {
        // Determines the import of a property expression. e.g. "@core.Component". In that
        // case, the import of the most left identifier will be determined ("core").
        const rootIdentifier = getPropertyAccessRoot(node.parent);
        if (rootIdentifier) {
            const moduleName = getImportOfNamespacedIdentifier(rootIdentifier, typeChecker);
            if (moduleName) {
                return { moduleName, symbolName: node.text };
            }
        }
    }
    return null;
}
exports.getImportOfIdentifier = getImportOfIdentifier;
/**
 * Resolves the import of the specified identifier. Expects the identifier to resolve
 * to a fine-grained import declaration with import specifiers.
 */
function getSpecificImportOfIdentifier(node, typeChecker) {
    const symbol = typeChecker.getSymbolAtLocation(node);
    if (!symbol || !symbol.declarations || !symbol.declarations.length) {
        return null;
    }
    const declaration = symbol.declarations[0];
    if (!ts.isImportSpecifier(declaration)) {
        return null;
    }
    // Since the declaration is an import specifier, we can walk up three times to get a reference
    // to the import declaration node (NamedImports -> ImportClause -> ImportDeclaration).
    const importDecl = declaration.parent.parent.parent;
    if (!ts.isStringLiteral(importDecl.moduleSpecifier)) {
        return null;
    }
    return {
        moduleName: importDecl.moduleSpecifier.text,
        symbolName: declaration.propertyName ? declaration.propertyName.text : declaration.name.text,
    };
}
/**
 * Resolves the import of the specified identifier. Expects the identifier to
 * resolve to a namespaced import declaration. e.g. "import * as core from ...".
 */
function getImportOfNamespacedIdentifier(node, typeChecker) {
    const symbol = typeChecker.getSymbolAtLocation(node);
    if (!symbol || !symbol.declarations || !symbol.declarations.length) {
        return null;
    }
    const declaration = symbol.declarations[0];
    if (!ts.isNamespaceImport(declaration)) {
        return null;
    }
    // Since the declaration is a namespace import, we can walk up three times to get a reference
    // to the import declaration node (NamespaceImport -> ImportClause -> ImportDeclaration).
    const importDecl = declaration.parent.parent;
    if (!ts.isStringLiteral(importDecl.moduleSpecifier)) {
        return null;
    }
    return importDecl.moduleSpecifier.text;
}
/**
 * Gets the root identifier of a qualified type chain. For example: "core.GestureConfig"
 * will return the "core" identifier. Allowing us to find the import of "core".
 */
function getQualifiedNameRoot(name) {
    while (ts.isQualifiedName(name.left)) {
        name = name.left;
    }
    return ts.isIdentifier(name.left) ? name.left : null;
}
/**
 * Gets the root identifier of a property access chain. For example: "core.GestureConfig"
 * will return the "core" identifier. Allowing us to find the import of "core".
 */
function getPropertyAccessRoot(node) {
    while (ts.isPropertyAccessExpression(node.expression)) {
        node = node.expression;
    }
    return ts.isIdentifier(node.expression) ? node.expression : null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy91cGRhdGUtdG9vbC91dGlscy9pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILGlDQUFpQztBQVVqQyx1REFBdUQ7QUFDdkQsU0FBZ0IscUJBQXFCLENBQ25DLElBQW1CLEVBQ25CLFdBQTJCO0lBRTNCLHVFQUF1RTtJQUN2RSw0RUFBNEU7SUFDNUUsb0NBQW9DO0lBQ3BDLE1BQU0sWUFBWSxHQUFHLDZCQUE2QixDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RSxJQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7UUFDekIsT0FBTyxZQUFZLENBQUM7S0FDckI7U0FBTSxJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtRQUN4RSxtRkFBbUY7UUFDbkYsNEVBQTRFO1FBQzVFLE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxJQUFJLGFBQWEsRUFBRTtZQUNqQixNQUFNLFVBQVUsR0FBRywrQkFBK0IsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDL0UsSUFBSSxVQUFVLEVBQUU7Z0JBQ2QsT0FBTyxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDO2FBQzVDO1NBQ0Y7S0FDRjtTQUFNLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7UUFDbEYsa0ZBQWtGO1FBQ2xGLDRFQUE0RTtRQUM1RSxNQUFNLGNBQWMsR0FBRyxx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R0FHRztBQUNILFNBQVMscUJBQXFCLENBQUMsSUFBaUM7SUFDOUQsT0FBTyxFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3JELElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0tBQ3hCO0lBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ25FLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKiBJbnRlcmZhY2UgZGVzY3JpYmluZyBhIHJlc29sdmVkIGltcG9ydC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0IHtcbiAgLyoqIE5hbWUgb2YgdGhlIGltcG9ydGVkIHN5bWJvbC4gKi9cbiAgc3ltYm9sTmFtZTogc3RyaW5nO1xuICAvKiogTW9kdWxlIG5hbWUgZnJvbSB3aGljaCB0aGUgc3ltYm9sIGhhcyBiZWVuIGltcG9ydGVkLiAqL1xuICBtb2R1bGVOYW1lOiBzdHJpbmc7XG59XG5cbi8qKiBSZXNvbHZlcyB0aGUgaW1wb3J0IG9mIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbXBvcnRPZklkZW50aWZpZXIoXG4gIG5vZGU6IHRzLklkZW50aWZpZXIsXG4gIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbik6IEltcG9ydCB8IG51bGwge1xuICAvLyBGcmVlIHN0YW5kaW5nIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gYW4gaW1wb3J0IHdpbGwgYmUgaGFuZGxlZFxuICAvLyBhcyBkaXJlY3QgaW1wb3J0cy4gZS5nLiBcIkBDb21wb25lbnQoKVwiIHdoZXJlIFwiQ29tcG9uZW50XCIgaXMgYW4gaWRlbnRpZmllclxuICAvLyByZWZlcnJpbmcgdG8gYW4gaW1wb3J0IHNwZWNpZmllci5cbiAgY29uc3QgZGlyZWN0SW1wb3J0ID0gZ2V0U3BlY2lmaWNJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdHlwZUNoZWNrZXIpO1xuICBpZiAoZGlyZWN0SW1wb3J0ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGRpcmVjdEltcG9ydDtcbiAgfSBlbHNlIGlmICh0cy5pc1F1YWxpZmllZE5hbWUobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50LnJpZ2h0ID09PSBub2RlKSB7XG4gICAgLy8gRGV0ZXJtaW5lcyB0aGUgaW1wb3J0IG9mIGEgcXVhbGlmaWVkIG5hbWUuIGUuZy4gXCJsZXQgdDogY29yZS5Db21wb25lbnRcIi4gSW4gdGhhdFxuICAgIC8vIGNhc2UsIHRoZSBpbXBvcnQgb2YgdGhlIG1vc3QgbGVmdCBpZGVudGlmaWVyIHdpbGwgYmUgZGV0ZXJtaW5lZCAoXCJjb3JlXCIpLlxuICAgIGNvbnN0IHF1YWxpZmllclJvb3QgPSBnZXRRdWFsaWZpZWROYW1lUm9vdChub2RlLnBhcmVudCk7XG4gICAgaWYgKHF1YWxpZmllclJvb3QpIHtcbiAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSBnZXRJbXBvcnRPZk5hbWVzcGFjZWRJZGVudGlmaWVyKHF1YWxpZmllclJvb3QsIHR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChtb2R1bGVOYW1lKSB7XG4gICAgICAgIHJldHVybiB7bW9kdWxlTmFtZSwgc3ltYm9sTmFtZTogbm9kZS50ZXh0fTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50Lm5hbWUgPT09IG5vZGUpIHtcbiAgICAvLyBEZXRlcm1pbmVzIHRoZSBpbXBvcnQgb2YgYSBwcm9wZXJ0eSBleHByZXNzaW9uLiBlLmcuIFwiQGNvcmUuQ29tcG9uZW50XCIuIEluIHRoYXRcbiAgICAvLyBjYXNlLCB0aGUgaW1wb3J0IG9mIHRoZSBtb3N0IGxlZnQgaWRlbnRpZmllciB3aWxsIGJlIGRldGVybWluZWQgKFwiY29yZVwiKS5cbiAgICBjb25zdCByb290SWRlbnRpZmllciA9IGdldFByb3BlcnR5QWNjZXNzUm9vdChub2RlLnBhcmVudCk7XG4gICAgaWYgKHJvb3RJZGVudGlmaWVyKSB7XG4gICAgICBjb25zdCBtb2R1bGVOYW1lID0gZ2V0SW1wb3J0T2ZOYW1lc3BhY2VkSWRlbnRpZmllcihyb290SWRlbnRpZmllciwgdHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKG1vZHVsZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHttb2R1bGVOYW1lLCBzeW1ib2xOYW1lOiBub2RlLnRleHR9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyB0aGUgaW1wb3J0IG9mIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci4gRXhwZWN0cyB0aGUgaWRlbnRpZmllciB0byByZXNvbHZlXG4gKiB0byBhIGZpbmUtZ3JhaW5lZCBpbXBvcnQgZGVjbGFyYXRpb24gd2l0aCBpbXBvcnQgc3BlY2lmaWVycy5cbiAqL1xuZnVuY3Rpb24gZ2V0U3BlY2lmaWNJbXBvcnRPZklkZW50aWZpZXIoXG4gIG5vZGU6IHRzLklkZW50aWZpZXIsXG4gIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbik6IEltcG9ydCB8IG51bGwge1xuICBjb25zdCBzeW1ib2wgPSB0eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuICBpZiAoIXN5bWJvbCB8fCAhc3ltYm9sLmRlY2xhcmF0aW9ucyB8fCAhc3ltYm9sLmRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBkZWNsYXJhdGlvbiA9IHN5bWJvbC5kZWNsYXJhdGlvbnNbMF07XG4gIGlmICghdHMuaXNJbXBvcnRTcGVjaWZpZXIoZGVjbGFyYXRpb24pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gU2luY2UgdGhlIGRlY2xhcmF0aW9uIGlzIGFuIGltcG9ydCBzcGVjaWZpZXIsIHdlIGNhbiB3YWxrIHVwIHRocmVlIHRpbWVzIHRvIGdldCBhIHJlZmVyZW5jZVxuICAvLyB0byB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIG5vZGUgKE5hbWVkSW1wb3J0cyAtPiBJbXBvcnRDbGF1c2UgLT4gSW1wb3J0RGVjbGFyYXRpb24pLlxuICBjb25zdCBpbXBvcnREZWNsID0gZGVjbGFyYXRpb24ucGFyZW50LnBhcmVudC5wYXJlbnQ7XG4gIGlmICghdHMuaXNTdHJpbmdMaXRlcmFsKGltcG9ydERlY2wubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW9kdWxlTmFtZTogaW1wb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIudGV4dCxcbiAgICBzeW1ib2xOYW1lOiBkZWNsYXJhdGlvbi5wcm9wZXJ0eU5hbWUgPyBkZWNsYXJhdGlvbi5wcm9wZXJ0eU5hbWUudGV4dCA6IGRlY2xhcmF0aW9uLm5hbWUudGV4dCxcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyB0aGUgaW1wb3J0IG9mIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci4gRXhwZWN0cyB0aGUgaWRlbnRpZmllciB0b1xuICogcmVzb2x2ZSB0byBhIG5hbWVzcGFjZWQgaW1wb3J0IGRlY2xhcmF0aW9uLiBlLmcuIFwiaW1wb3J0ICogYXMgY29yZSBmcm9tIC4uLlwiLlxuICovXG5mdW5jdGlvbiBnZXRJbXBvcnRPZk5hbWVzcGFjZWRJZGVudGlmaWVyKFxuICBub2RlOiB0cy5JZGVudGlmaWVyLFxuICB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3Qgc3ltYm9sID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcbiAgaWYgKCFzeW1ib2wgfHwgIXN5bWJvbC5kZWNsYXJhdGlvbnMgfHwgIXN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZGVjbGFyYXRpb24gPSBzeW1ib2wuZGVjbGFyYXRpb25zWzBdO1xuICBpZiAoIXRzLmlzTmFtZXNwYWNlSW1wb3J0KGRlY2xhcmF0aW9uKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8vIFNpbmNlIHRoZSBkZWNsYXJhdGlvbiBpcyBhIG5hbWVzcGFjZSBpbXBvcnQsIHdlIGNhbiB3YWxrIHVwIHRocmVlIHRpbWVzIHRvIGdldCBhIHJlZmVyZW5jZVxuICAvLyB0byB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIG5vZGUgKE5hbWVzcGFjZUltcG9ydCAtPiBJbXBvcnRDbGF1c2UgLT4gSW1wb3J0RGVjbGFyYXRpb24pLlxuICBjb25zdCBpbXBvcnREZWNsID0gZGVjbGFyYXRpb24ucGFyZW50LnBhcmVudDtcbiAgaWYgKCF0cy5pc1N0cmluZ0xpdGVyYWwoaW1wb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gaW1wb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIudGV4dDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSByb290IGlkZW50aWZpZXIgb2YgYSBxdWFsaWZpZWQgdHlwZSBjaGFpbi4gRm9yIGV4YW1wbGU6IFwiY29yZS5HZXN0dXJlQ29uZmlnXCJcbiAqIHdpbGwgcmV0dXJuIHRoZSBcImNvcmVcIiBpZGVudGlmaWVyLiBBbGxvd2luZyB1cyB0byBmaW5kIHRoZSBpbXBvcnQgb2YgXCJjb3JlXCIuXG4gKi9cbmZ1bmN0aW9uIGdldFF1YWxpZmllZE5hbWVSb290KG5hbWU6IHRzLlF1YWxpZmllZE5hbWUpOiB0cy5JZGVudGlmaWVyIHwgbnVsbCB7XG4gIHdoaWxlICh0cy5pc1F1YWxpZmllZE5hbWUobmFtZS5sZWZ0KSkge1xuICAgIG5hbWUgPSBuYW1lLmxlZnQ7XG4gIH1cbiAgcmV0dXJuIHRzLmlzSWRlbnRpZmllcihuYW1lLmxlZnQpID8gbmFtZS5sZWZ0IDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSByb290IGlkZW50aWZpZXIgb2YgYSBwcm9wZXJ0eSBhY2Nlc3MgY2hhaW4uIEZvciBleGFtcGxlOiBcImNvcmUuR2VzdHVyZUNvbmZpZ1wiXG4gKiB3aWxsIHJldHVybiB0aGUgXCJjb3JlXCIgaWRlbnRpZmllci4gQWxsb3dpbmcgdXMgdG8gZmluZCB0aGUgaW1wb3J0IG9mIFwiY29yZVwiLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eUFjY2Vzc1Jvb3Qobm9kZTogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKTogdHMuSWRlbnRpZmllciB8IG51bGwge1xuICB3aGlsZSAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKSkge1xuICAgIG5vZGUgPSBub2RlLmV4cHJlc3Npb247XG4gIH1cbiAgcmV0dXJuIHRzLmlzSWRlbnRpZmllcihub2RlLmV4cHJlc3Npb24pID8gbm9kZS5leHByZXNzaW9uIDogbnVsbDtcbn1cbiJdfQ==