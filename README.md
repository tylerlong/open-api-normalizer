# OpenAPI Normalizer

OpenAPI is very flexible and it is a good thing for authors.

However, it is a bad thing for consumers. It's just too flexible to be consumed.

The project is trying to produce an easy-to-consume alternative spec.

Please note that this is not a general-purpose project. Because it is only tested against RingCentral API spec.

## The main process

### models

#### Sources

models are the class definitions that we need to generate for SDKs, such as `AccountStatusInfo`.

There are 3 main sources for models:

- components/schemas
- request Bodies
- request Query Params

There is a special model named `Attachment`, which we use to handle binary file upload and it is manually written.

Please refer to [./src/models/collect/](./src/models/collect/).

#### Adjust

Some models are not in the format we expect, so we need to adjust them.

- de-ref: we don't like models of types `string` and `string[]`. Because these are primitive types. So we inline them instead of `$ref` them.
- ref: we don't like properties of type `object`, because they should be a new mode instead and we `$ref` them.
- fax: by default, the fax doesn't support multiple attachments and the parameter `to` is wrong.
- greeting: something is wrong with account-level and extension-level greeting HTTP post body
- merge-of: anyOf, oneOf, allOf, we merge them. Because most programming language doesn't have direct support for them.
- miscellaneous

Please refer to [./src/models/adjust/](./src/models/adjust/).

#### Normalize

This step is just data structure conversion, with no information change. We changed the properties object to an array of fields.

Please refer to [./src/models/normalize.ts](./src/models/normalize.ts).

## Todo:

- notification encryption enum false only.
