import { KeyValueStorage } from './KeyValueStorage';


/**
 * @return {Map|KeyValueStorage}
 */
let _createKeyValueStorage = function () {
    let map;
    try {
        map = new Map();
        _createKeyValueStorage = function () {
            return new Map();
        }
    } catch (e) {
        map = new KeyValueStorage();
        _createKeyValueStorage = function () {
            return new KeyValueStorage();
        }
    }
    return map;
};


/**
 * @return {Map|KeyValueStorage}
 */
export function createKeyValueStorage() {
    return _createKeyValueStorage();
}