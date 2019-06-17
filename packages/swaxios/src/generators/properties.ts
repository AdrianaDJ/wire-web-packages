/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import {
  FormDataParameter,
  HeaderParameter,
  ParameterType,
  PathParameter,
  QueryParameter,
} from 'swagger-schema-official';

export enum TypeScriptType {
  ANY = 'any',
  ARRAY = 'Array',
  BOOLEAN = 'boolean',
  EMPTY_OBJECT = '{}',
  INTERFACE = 'interface',
  NUMBER = 'number',
  STRING = 'string',
  TYPE = 'type',
}

export enum SwaggerType {
  ARRAY = 'array',
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
  NUMBER = 'number',
  OBJECT = 'object',
  STRING = 'string',
}

export type NoBodyParameter = FormDataParameter | QueryParameter | PathParameter | HeaderParameter;

export function generateSimpleType(type: ParameterType): TypeScriptType {
  switch (type.toLowerCase()) {
    case SwaggerType.INTEGER:
    case SwaggerType.NUMBER: {
      return TypeScriptType.NUMBER;
    }
    case SwaggerType.STRING: {
      return TypeScriptType.STRING;
    }
    case SwaggerType.BOOLEAN: {
      return TypeScriptType.BOOLEAN;
    }
    default: {
      return TypeScriptType.ANY;
    }
  }
}

export function generateProperty(data: NoBodyParameter): string {
  const {description, format, name, required, type} = data;

  const buildDescription = () => {
    if (!description && !format) {
      return '';
    }

    const formatString = `format: ${format}`;

    let result = `/** `;

    if (description) {
      result += description;

      if (format) {
        result += ` (${formatString})`;
      }
    } else if (format) {
      result += formatString;
    }

    return (result += ' */\n');
  };

  return `${buildDescription()}${name}${required ? '' : '?'}: ${generateSimpleType(type)}`;
}
