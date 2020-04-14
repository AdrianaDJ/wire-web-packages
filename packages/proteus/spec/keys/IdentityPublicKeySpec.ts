/*
 * Wire
 * Copyright (C) 2020 Wire Swiss GmbH
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

import * as Proteus from '@wireapp/proteus';
import * as sodium from 'libsodium-wrappers-sumo';

beforeAll(async () => {
  await sodium.ready;
});

describe('IdentityPublicKey', () => {
  it('serialises and deserialises', async () => {
    const ikp = await Proteus.keys.IdentityKeyPair.new();
    const pk = ikp.public_key.public_key;
    const pk_bytes = pk.serialise();
    const pk_deser = Proteus.keys.IdentityPublicKey.deserialise(pk_bytes);

    expect(ikp.public_key.fingerprint()).toBe(pk_deser.fingerprint());
    expect(sodium.to_hex(new Uint8Array(pk_bytes))).toBe(sodium.to_hex(new Uint8Array(pk_deser.serialise())));
  });
});
