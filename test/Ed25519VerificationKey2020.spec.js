/*!
 * Copyright (c) 2020-2021 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
chai.should();
const {expect} = chai;

import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;

import {Ed25519VerificationKey2020} from
  '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020} from '../';
import {credential, mockKey, controllerDoc} from './mock-data.js';

import {
  documentLoaderFactory,
  contexts,
} from '@transmute/jsonld-document-loader';

import * as ed25519 from 'ed25519-signature-2020-context';

// const securityV2 = contexts
//   .W3ID_Security_Vocabulary['https://w3id.org/security/v2'];

const documentLoader = documentLoaderFactory.pluginFactory
  .build({
    contexts: {
      ...contexts.W3C_Verifiable_Credentials,
      // ...contexts.W3ID_Security_Vocabulary,
      // 'https://w3id.org/security/v2': securityV2,
      'https://w3id.org/security/ed25519-signature-2020/v1': ed25519
        .contexts.get('https://w3id.org/security/ed25519-signature-2020/v1')
    }
  })
  .addContext({
    [mockKey.controller]: controllerDoc
  })
  .buildDocumentLoader();

describe('Ed25519Signature2020', () => {
  describe('constructor', () => {
    it('should exist', async () => {
      Ed25519Signature2020.should.exist;
    });
  });

  describe('sign()', () => {
    it('should sign a document', async () => {
      const key = await Ed25519VerificationKey2020.from({...mockKey});
      const suite = new Ed25519Signature2020({key});
      suite.date = '2010-01-01T19:23:24Z';

      const signed = await jsigs.sign(credential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      console.log('Signed document:', signed);

      expect(signed).to.have.property('proof');
      expect(signed.proof.proofValue).to
        // eslint-disable-next-line max-len
        .equal('zfMw453FJfB7c6Cx4Lo9dho8ePVnZrSwLeFAhUFPZXaS3pe1nS7v3PXFNkxvK515eNweAEiCbtceWGYQyLjtD2uB');
    });
  });

  describe('verify()', () => {
    it('should verify a document', async () => {
    });
  });
});