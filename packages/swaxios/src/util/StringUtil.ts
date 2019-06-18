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

export function camelCase(words: string[], isPascalCase: boolean = false): string {
  const casedWords = words.map(
    word =>
      word
        .toLowerCase()
        .charAt(0)
        .toUpperCase() + word.slice(1)
  );
  if (!isPascalCase) {
    casedWords[0] = casedWords[0].toLowerCase();
  }
  return casedWords.join('');
}

export function pascalCase(words: string[]): string {
  return camelCase(words, true);
}

export function camelize(resourceName: string, isPascalCase = false): string {
  return camelCase(resourceName.split('-'), isPascalCase);
}

export function generateServiceName(url: string): string {
  const urlParts = url.split('/').filter(part => part.length && !part.startsWith('{'));
  const lastUrlPart = urlParts[urlParts.length - 1];
  const resourceName = lastUrlPart || 'Root';

  return camelize(`${resourceName}-service`, true);
}

export function normalizeUrl(url: string): string {
  return url.replace(/\/\{.*\}/g, '');
}

export function uniqueServiceName(serviceName: string, serviceNames: string[]): string {
  if (!serviceNames.includes(serviceName)) {
    return serviceName;
  }

  let alternativeFilename = serviceName;

  while (serviceNames.includes(alternativeFilename)) {
    const indexNumberMatch = alternativeFilename.match(/(\d+)$/);
    const indexNumber = indexNumberMatch ? parseInt(indexNumberMatch[0], 10) + 1 : 1;
    alternativeFilename = `${serviceName}${indexNumber}`;
  }

  return alternativeFilename;
}
