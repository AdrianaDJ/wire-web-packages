/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
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

import type {StatusCodes as HTTP_STATUS} from 'http-status-codes';

import {BackendErrorLabel} from '../http/';
import {SyntheticErrorLabel} from './BackendErrorLabel';

export class BackendError extends Error {
  code?: HTTP_STATUS;
  label: BackendErrorLabel | SyntheticErrorLabel;
  message: string;

  constructor(
    message: string,
    label: BackendErrorLabel | SyntheticErrorLabel = SyntheticErrorLabel.UNKNOWN,
    code?: HTTP_STATUS,
  ) {
    super(message);
    this.code = code;
    this.label = label;
    this.message = message;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
