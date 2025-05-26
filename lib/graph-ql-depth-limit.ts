import { ASTNode, ASTVisitor, GraphQLError, ValidationContext } from "graphql";

export function depthLimit(maxDepth: number) {
  return function (context: ValidationContext): ASTVisitor {
    function checkDepth(node: ASTNode, depth: number) {
      if (depth > maxDepth) {
        context.reportError(
          new GraphQLError(
            `Query is too deep: ${depth}. Max allowed depth: ${maxDepth}`
          )
        );
        return;
      }
      // Only nodes with a selectionSet property should be processed here
      if (
        "selectionSet" in node &&
        node.selectionSet &&
        Array.isArray(node.selectionSet.selections)
      ) {
        for (const selection of node.selectionSet.selections) {
          checkDepth(selection, depth + 1);
        }
      }
    }
    return {
      OperationDefinition(node) {
        checkDepth(node, 1);
      },
    };
  };
}
