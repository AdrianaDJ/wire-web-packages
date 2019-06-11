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

import {Spec} from 'swagger-schema-official';

import {ClassesGenerator} from './ClassesGenerator';
import {InterfacesGenerator} from './InterfacesGenerator';

export class MainGenerator {
  private readonly classes: ClassesGenerator;
  private readonly interfaces: InterfacesGenerator;
  private readonly specification: Spec;

  constructor(specification: Spec, interfaces: InterfacesGenerator, classes: ClassesGenerator) {
    this.classes = classes;
    this.interfaces = interfaces;
    this.specification = specification;
  }

  toString(): string {
    return '';
  }
}
