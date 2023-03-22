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
