declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}
declare module "*.gql" {
  import type { DocumentNode } from "graphql";

  const content: DocumentNode;
  export default content;
}
declare module "*.graphql" {
  import type { DocumentNode } from "graphql";

  const content: DocumentNode;
  export default content;
}
