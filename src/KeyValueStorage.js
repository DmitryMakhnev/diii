/**
 * @description simple Key Value storage
 * @template K, V
 */
export class KeyValueStorage {

    constructor() {
        this._keys = [];
        this._values = [];
        this._lastCheckedKey = null;
        this._lastCheckedKeyIndex = null;
    }

    /**
     * @param {K} key
     * @return {boolean}
     */
    has(key) {
        if (this._lastCheckedKey === key) {
            return true;
        }

        let index = 0;
        const iMax = this._keys.length;
        let hasKey = false;
        const keys = this._keys;

        for (; index !== iMax; index += 1) {
            if (keys[index] === key) {
                hasKey = true;
                break;
            }
        }

        if (hasKey) {
            this._lastCheckedKey = key;
            this._lastCheckedKeyIndex = index;
            return true;
        }

        return false;
    }

    /**
     * @param {K} key
     * @param {V} value
     * @return {KeyValueStorage}
     */
    set(key, value) {
        if (this._lastCheckedKey === key) {
            this._values[this._lastCheckedKeyIndex] = value;

        } else if (this.has(key)) {
            this._values[this._lastCheckedKeyIndex] = value;

        } else {
            const keysCount = this._keys.push(key);
            this._values.push(value);

            this._lastCheckedKey = key;
            this._lastCheckedKeyIndex = keysCount - 1;
        }

        return this;
    }

    /**
     * @param {number} index
     * @private
     */
    _delete(index) {
        this._values.splice(index, 1);
        this._keys.splice(index, 1);
        this._lastCheckedKey = null;
        this._lastCheckedKeyIndex = null;
    }

    /**
     * @param {K} key
     * @return {KeyValueStorage}
     */
    delete(key) {
        if (this._lastCheckedKey === key) {
            this._delete(this._lastCheckedKeyIndex);
        }

        else if (this.has(key)) {
            this._delete(this._lastCheckedKeyIndex);
        }

        return this;
    }

    /**
     * @param {K} key
     * @return {V}
     */
    get(key) {
        if (this._lastCheckedKey === key) {
            return this._values[this._lastCheckedKeyIndex];

        } else if (this.has(key)) {
            return this._values[this._lastCheckedKeyIndex];
        }

        return null;
    }

}