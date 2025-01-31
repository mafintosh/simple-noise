/* eslint-disable camelcase */
const { crypto_kx_SEEDBYTES, crypto_kx_keypair, crypto_kx_seed_keypair } = require('sodium-universal/crypto_kx')
const { crypto_scalarmult_BYTES, crypto_scalarmult_SCALARBYTES, crypto_scalarmult } = require('sodium-universal/crypto_scalarmult')

const assert = require('nanoassert')

const DHLEN = crypto_scalarmult_BYTES
const PKLEN = crypto_scalarmult_BYTES
const SKLEN = crypto_scalarmult_SCALARBYTES
const SEEDLEN = crypto_kx_SEEDBYTES
const ALG = '25519'

module.exports = {
  DHLEN,
  PKLEN,
  SKLEN,
  SEEDLEN,
  ALG,
  generateKeypair,
  generateSeedKeypair,
  dh
}

function generateKeypair (privKey) {
  const keyPair = {}

  keyPair.priv = privKey || Buffer.alloc(SKLEN)
  keyPair.pub = Buffer.alloc(PKLEN)
  crypto_kx_keypair(keyPair.pub, keyPair.priv)

  return keyPair
}

function generateSeedKeypair (pk, sk, seed) {
  assert(pk.byteLength === PKLEN)
  assert(sk.byteLength === SKLEN)
  assert(seed.byteLength === SKLEN)

  crypto_kx_seed_keypair(pk, sk, seed)
}

function dh (pk, lsk) {
  assert(lsk.byteLength === SKLEN)
  assert(pk.byteLength === PKLEN)

  const output = Buffer.alloc(DHLEN)

  crypto_scalarmult(
    output,
    lsk,
    pk
  )

  return output
}
