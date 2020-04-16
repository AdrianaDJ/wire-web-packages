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

import * as CBOR from '@wireapp/cbor';

import * as ClassUtil from '../util/ClassUtil';
import {IdentityKey} from './IdentityKey';
import {KeyPair} from './KeyPair';
import {SecretKey} from './SecretKey';

export class IdentityKeyPair {
  public_key: IdentityKey;
  secret_key: SecretKey;
  version: number;

  constructor() {
    this.public_key = new IdentityKey();
    this.secret_key = new SecretKey();
    this.version = -1;
  }

  static async new(): Promise<IdentityKeyPair> {
    const key_pair = await KeyPair.new();

    const ikp = ClassUtil.new_instance(IdentityKeyPair);
    ikp.version = 1;
    ikp.secret_key = key_pair.secret_key;
    ikp.public_key = IdentityKey.new(key_pair.public_key);

    return ikp;
  }

  serialise(): ArrayBuffer {
    const encoder = new CBOR.Encoder();
    this.encode(encoder);
    return encoder.get_buffer();
  }

  static deserialise(buf: ArrayBuffer): IdentityKeyPair {
    const decoder = new CBOR.Decoder(buf);
    return IdentityKeyPair.decode(decoder);
  }

  encode(encoder: CBOR.Encoder): CBOR.Encoder {
    // Prepare KeyPair with three elements
    encoder.object(3);

    // Add version at position 0
    encoder.u8(0);
    encoder.u8(this.version);

    // Add SecretKey at position 1
    encoder.u8(1);
    encoder.object(1);
    encoder.u8(0);
    encoder.bytes(this.secret_key.sec_edward);

    // Add IdentityKey at position 2
    encoder.u8(2);
    encoder.object(1);
    // Add PublicKey at position 0 of IdentityKey
    encoder.u8(0);
    encoder.object(1);
    encoder.u8(0);
    encoder.bytes(this.public_key.public_key.pub_edward);

    return encoder;
  }

  static decode(decoder: CBOR.Decoder): IdentityKeyPair {
    const self = ClassUtil.new_instance(IdentityKeyPair);

    const nprops = decoder.object();
    for (let index = 0; index <= nprops - 1; index++) {
      switch (decoder.u8()) {
        case 0:
          self.version = decoder.u8();
          break;
        case 1:
          self.secret_key = SecretKey.decode(decoder);
          break;
        case 2:
          self.public_key = IdentityKey.decode(decoder);
          break;
        default:
          decoder.skip();
      }
    }

    return self;
  }
}
