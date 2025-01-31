const dh = require('../dh')
const test = require('tape')

test('constants', function (assert) {
  assert.ok(dh.DHLEN >= 32, 'DHLEN conforms to Noise Protocol')
  assert.end()
})

test('generateKeypair', function (assert) {
  const kp1 = { sk: Buffer.alloc(dh.SKLEN), pk: Buffer.alloc(dh.PKLEN) }
  const kp2 = { sk: Buffer.alloc(dh.SKLEN), pk: Buffer.alloc(dh.PKLEN) }
  const kp3 = { sk: Buffer.alloc(dh.SKLEN), pk: Buffer.alloc(dh.PKLEN) }

  dh.generateKeypair(kp2.pk, kp2.sk)
  dh.generateKeypair(kp3.pk, kp3.sk)

  assert.notOk(kp1.pk.equals(kp2.pk))
  assert.notOk(kp1.pk.equals(kp3.pk))
  assert.notOk(kp2.pk.equals(kp3.pk))

  assert.notOk(kp1.sk.equals(kp2.sk))
  assert.notOk(kp2.sk.equals(kp3.sk))
  assert.notOk(kp1.sk.equals(kp3.sk))

  assert.notOk(kp2.pk.equals(kp2.sk))
  assert.notOk(kp3.pk.equals(kp3.sk))

  assert.end()
})

test('initiator / responder', function (assert) {
  const server = { sk: Buffer.alloc(dh.SKLEN), pk: Buffer.alloc(dh.PKLEN) }
  const client = { sk: Buffer.alloc(dh.SKLEN), pk: Buffer.alloc(dh.PKLEN) }

  dh.generateKeypair(server.pk, server.sk)
  dh.generateKeypair(client.pk, client.sk)

  const dhc = dh.dh(client.pk, server.sk)
  const dhs = dh.dh(server.pk, client.sk)

  assert.ok(dhc.equals(dhs))

  assert.end()
})

const badKeys = [
  // Infinity
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Multiplicative Identity
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Order 8
  [224, 235, 122, 124, 59, 65, 184, 174, 22, 86, 227, 250, 241, 159, 196, 106, 218, 9, 141, 235, 156, 50, 177, 253, 134, 98, 5, 22, 95, 73, 184, 0],
  // Order 8
  [95, 156, 149, 188, 163, 80, 140, 36, 177, 208, 177, 85, 156, 131, 239, 91, 4, 68, 92, 196, 88, 28, 142, 134, 216, 34, 78, 221, 208, 159, 17, 87],
  // p - 1 (order 8)
  [236, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 127],
  // p (same as Infinity)
  [237, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 127],
  // 1 (Multiplicative identity)
  [238, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 127],
  // Order 8
  [205, 235, 122, 124, 59, 65, 184, 174, 22, 86, 227, 250, 241, 159, 196, 106, 218, 9, 141, 235, 156, 50, 177, 253, 134, 98, 5, 22, 95, 73, 184, 128],
  [76, 156, 149, 188, 163, 80, 140, 36, 177, 208, 177, 85, 156, 131, 239, 91, 4, 68, 92, 196, 88, 28, 142, 134, 216, 34, 78, 221, 208, 159, 17, 215],
  [217, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
  [218, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
  [219, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 25]
]

test('bad keys', function (assert) {
  const keypair = { sk: Buffer.alloc(dh.SKLEN), pk: Buffer.alloc(dh.PKLEN) }
  dh.generateKeypair(keypair.pk, keypair.sk)

  const dho = Buffer.alloc(dh.DHLEN)
  for (var i = 0; i < badKeys.length; i++) {
    assert.throws(() => dh.dh(dho, keypair.sk, badKeys[i]))
  }

  assert.end()
})
