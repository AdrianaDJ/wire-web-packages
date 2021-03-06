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

import axios from 'axios';

import {HttpClient} from './HttpClient';
import {StatusCodes as HTTP_STATUS} from 'http-status-codes';
import {BackendErrorLabel} from './BackendErrorLabel';

describe('HttpClient', () => {
  describe('"_sendRequest"', () => {
    it('retries on 401 unauthorized error', async () => {
      const mockedAccessTokenStore: any = {
        accessToken: {
          access_token:
            'iJCRCjc8oROO-dkrkqCXOade997oa8Jhbz6awMUQPBQo80VenWqp_oNvfY6AnU5BxEsdDPOBfBP-uz_b0gAKBQ==.v=1.k=1.d=1498600993.t=a.l=.u=aaf9a833-ef30-4c22-86a0-9adc8a15b3b4.c=15037015562284012115',
          expires_in: 900,
          token_type: 'Bearer',
          user: 'aaf9a833-ef30-4c22-86a0-9adc8a15b3b4',
        },
      };

      const client = new HttpClient('https://test.zinfra.io', mockedAccessTokenStore);
      const requestSpy = spyOn(axios, 'request');
      // eslint-disable-next-line prefer-promise-reject-errors
      requestSpy.and.returnValue(Promise.reject({response: {status: HTTP_STATUS.UNAUTHORIZED}}));
      client.refreshAccessToken = () => {
        requestSpy.and.returnValue(Promise.resolve());
        return Promise.resolve(mockedAccessTokenStore.accessToken.access_token);
      };

      await client._sendRequest({});
    });

    it('retries on 403 token expired error', async () => {
      const mockedAccessTokenStore: any = {
        accessToken: {
          access_token:
            'iJCRCjc8oROO-dkrkqCXOade997oa8Jhbz6awMUQPBQo80VenWqp_oNvfY6AnU5BxEsdDPOBfBP-uz_b0gAKBQ==.v=1.k=1.d=1498600993.t=a.l=.u=aaf9a833-ef30-4c22-86a0-9adc8a15b3b4.c=15037015562284012115',
          expires_in: 900,
          token_type: 'Bearer',
          user: 'aaf9a833-ef30-4c22-86a0-9adc8a15b3b4',
        },
      };

      const client = new HttpClient('https://test.zinfra.io', mockedAccessTokenStore);
      const requestSpy = spyOn(axios, 'request');
      requestSpy.and.returnValue(
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({
          response: {
            data: {code: HTTP_STATUS.FORBIDDEN, label: BackendErrorLabel.INVALID_CREDENTIALS, message: 'Token expired'},
            status: HTTP_STATUS.FORBIDDEN,
          },
        }),
      );
      client.refreshAccessToken = () => {
        requestSpy.and.returnValue(Promise.resolve());
        return Promise.resolve(mockedAccessTokenStore.accessToken.access_token);
      };

      await client._sendRequest({});
    });

    it('does not retry on 403 invalid token', async () => {
      const mockedAccessTokenStore: any = {
        accessToken: {
          access_token:
            'iJCRCjc8oROO-dkrkqCXOade997oa8Jhbz6awMUQPBQo80VenWqp_oNvfY6AnU5BxEsdDPOBfBP-uz_b0gAKBQ==.v=1.k=1.d=1498600993.t=a.l=.u=aaf9a833-ef30-4c22-86a0-9adc8a15b3b4.c=15037015562284012115',
          expires_in: 900,
          token_type: 'Bearer',
          user: 'aaf9a833-ef30-4c22-86a0-9adc8a15b3b4',
        },
      };
      const client = new HttpClient('https://test.zinfra.io', mockedAccessTokenStore);
      spyOn(axios, 'request').and.returnValue(
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({
          response: {
            data: {
              code: HTTP_STATUS.FORBIDDEN,
              label: BackendErrorLabel.INVALID_CREDENTIALS,
              message: 'Invalid token',
            },
            status: HTTP_STATUS.FORBIDDEN,
          },
        }),
      );
      client.refreshAccessToken = () => {
        return Promise.reject(new Error('Should not refresh access token'));
      };

      try {
        await client._sendRequest({});
        fail();
      } catch (error) {
        expect(error.message).toBe('Authentication failed because the token is invalid.');
      }
    });
  });

  it('does not retry on 403 missing cookie', async () => {
    const mockedAccessTokenStore: any = {
      accessToken: {
        access_token:
          'iJCRCjc8oROO-dkrkqCXOade997oa8Jhbz6awMUQPBQo80VenWqp_oNvfY6AnU5BxEsdDPOBfBP-uz_b0gAKBQ==.v=1.k=1.d=1498600993.t=a.l=.u=aaf9a833-ef30-4c22-86a0-9adc8a15b3b4.c=15037015562284012115',
        expires_in: 900,
        token_type: 'Bearer',
        user: 'aaf9a833-ef30-4c22-86a0-9adc8a15b3b4',
      },
    };
    const client = new HttpClient('https://test.zinfra.io', mockedAccessTokenStore);
    spyOn(axios, 'request').and.returnValue(
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({
        response: {
          data: {
            code: HTTP_STATUS.FORBIDDEN,
            label: BackendErrorLabel.INVALID_CREDENTIALS,
            message: 'Missing cookie',
          },
          status: HTTP_STATUS.FORBIDDEN,
        },
      }),
    );
    client.refreshAccessToken = () => {
      return Promise.reject(new Error('Should not refresh access token'));
    };

    try {
      await client._sendRequest({});
      fail();
    } catch (error) {
      expect(error.message).toBe('Authentication failed because the cookie is missing.');
    }
  });
});
