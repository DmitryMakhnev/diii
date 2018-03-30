import assert from 'assert';
import { KeyValueStorage } from './KeyValueStorage';


describe('KeyValueStorage', () => {

    const storage = new KeyValueStorage();

    const key1 = {};
    const key2 = {};
    const key3 = {};

    describe('.set()', () => {
        it('one item', () => {
            storage.set(key1, '1!');
            assert.strictEqual(storage.get(key1), '1!');
        });
        it('chain', () => {
            storage.set(key2, '2!')
                .set(key3, '3!');
            assert.strictEqual(storage.get(key3), '3!');
        });
        it('override', () => {
            storage.set(key1, '1!!');
            assert.strictEqual(storage.get(key1), '1!!');
            storage.set(key1, '1!');
            assert.strictEqual(storage.get(key1), '1!');
        });
    });

    describe('.has()', () => {
        it('empty', () => {
            assert.strictEqual(storage.has({}), false);
        });
        it('random key', () => {
            assert.strictEqual(storage.has(key1), true);
        });
        it('repeat key for cache checking', () => {
            storage.has(key1);
            assert.strictEqual(storage.has(key1), true);
        });
    });

    describe('.get', () => {
        it('random', () => {
            storage.get({});
            assert.strictEqual(storage.get(key1), '1!');
        });
        it('repeat key for cache checking', () => {
            storage.get(key2);
            assert.strictEqual(storage.get(key2), '2!');
        });
    });

    describe('.delete', () => {
        it('simple', () => {
            assert.strictEqual(storage.get(key1), '1!');
            storage.delete(key1);
            assert.strictEqual(storage.get(key1), null);
        });
    });

});