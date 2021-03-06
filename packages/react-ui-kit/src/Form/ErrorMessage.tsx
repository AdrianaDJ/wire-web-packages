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

/** @jsx jsx */
import {ObjectInterpolation, jsx} from '@emotion/core';
import {COLOR} from '../Identity';
import {Theme} from '../Layout';
import {Text, TextProps, linkStyle, textStyle} from '../Text';

type ErrorMessageProps<T = HTMLSpanElement> = TextProps<T>;

export const errorMessageStyle: <T>(theme: Theme, props: ErrorMessageProps<T>) => ObjectInterpolation<undefined> = (
  theme,
  {bold = false, center = true, color = COLOR.RED, fontSize = '11px', textTransform = 'none', ...props},
) => ({
  ...textStyle(theme, {bold, center, color, fontSize, textTransform, ...props}),
  a: {
    ...linkStyle(theme, {bold, fontSize, textTransform}),
  },
  display: 'block',
  marginBottom: '12px',
});

export const ErrorMessage = (props: ErrorMessageProps) => (
  <Text css={theme => errorMessageStyle(theme, props)} {...props} />
);
