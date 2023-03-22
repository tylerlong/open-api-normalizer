import { OpenAPIV3 } from 'openapi-types';
import { doc } from '../../raw-data';
import { NamedSchema } from '../../types';

export const handleSpecialCases = () => {
  //  infinite recursion
  const ScimSchemaAttribute = doc.components!.schemas!.ScimSchemaAttribute as OpenAPIV3.SchemaObject;
  const subScimSchemaAttribute = JSON.parse(JSON.stringify(ScimSchemaAttribute));
  delete subScimSchemaAttribute.properties!.subAttributes;
  (ScimSchemaAttribute.properties!.subAttributes as OpenAPIV3.ArraySchemaObject).items = subScimSchemaAttribute;

  // attachment
  const Attachment: NamedSchema = {
    name: 'Attachment',
    description: 'Attachment is a file to be uploaded',
    required: ['content'],
    properties: {
      filename: {
        type: 'string',
        description: 'Filename with extension, such as "image.png"',
      },
      content: {
        type: 'string',
        format: 'binary',
        description: 'Binary content of the file',
      },
      contentType: {
        type: 'string',
        description: 'Content type of the file, such as "image/png"',
      },
    },
  };
  return [Attachment];
};
