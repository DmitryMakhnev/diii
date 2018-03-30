import { createKeyValueStorage } from './createKeyValueStorage';


/**
 * @enum
 */
export const InjectionType = {
    SINGLETON: 'SINGLETON',
    PROTOTYPE: 'PROTOTYPE'
};

/**
 * @enum
 */
export const InjectionCreationType = {
    CONSTRUCTOR: 'CONSTRUCTOR',
    FUNCTION: 'FUNCTION'
};


/**
 * @template V
 */
class InjectionCreator {

    /**
     * @param {Function} injectionPointer
     * @param {InjectionType} type
     * @param {InjectionCreationType} creationType
     */
    constructor(
        injectionPointer,
        type = InjectionType.SINGLETON,
        creationType = InjectionCreationType.CONSTRUCTOR
    ) {
        this._injection = injectionPointer;
        this._type = type;
        this._creationType = creationType;
        this._cache = null;
    }

    /**
     * @return {V}
     * @private
     */
    _createInjectionInstance() {
        switch (this._creationType) {
            case InjectionCreationType.CONSTRUCTOR:
                return new this._injection();

            case InjectionCreationType.FUNCTION:
                return this._injection();

            default:
                throw new Error(
                    'diii: unsupported InjectionCreationType \'' + this._creationType.toString()
                    + '\'  for\n----\n'
                    + this._injection.toString()
                );
                // TODO: [dmitry.makhnev] think about custom creators
        }
    }

    /**
     * @return {V}
     */
    get() {
        switch (this._type) {
            case InjectionType.SINGLETON:
                if (this._cache === null) {
                    this._cache = this._createInjectionInstance();
                }
                return this._cache;


            case InjectionType.PROTOTYPE:
                return this._createInjectionInstance();

            default:
                throw new Error(
                    'diii: unsupported InjectionType \'' + this._type.toString()
                    + '\'  for\n----\n'
                    + this._injection.toString()
                );
                // TODO: [dmitry.makhnev] think about custom types
        }
    }
}


class InjectionsRegistry {

    constructor() {
        /**
         * @type {Map.<Function, InjectionCreator>|KeyValueStorage.<Function, InjectionCreator>}
         * @private
         */
        this._injectionCreators = createKeyValueStorage();
    }

    /**
     * @param {Function} injectorPointer
     * @return {*}
     */
    get(injectorPointer) {
        const container = /** @type {InjectionCreator} */this._injectionCreators.get(injectorPointer);
        if (container == null) {
            throw new Error(
                'diii: unregistered injection which is\n----\n'
                + (injectorPointer != null ? injectorPointer.toString() : injectorPointer)
            );
        }
        return container.get();
    }

    /**
     * @param {Function} injectorPointer
     * @param {InjectionType} injectionType
     * @param {InjectionCreationType} injectionCreationType
     * @return {InjectionsRegistry}
     */
    register(injectorPointer, injectionType, injectionCreationType) {
        const injectionCreator = new InjectionCreator(injectorPointer, injectionType, injectionCreationType);
        this._injectionCreators.set(
            injectorPointer,
            injectionCreator
        );
        return this;
    }

    /**
     * @param {Function} primaryInjectionPointer
     * @param {Function} overridingInjection
     * @param {InjectionType} injectionType
     * @param {InjectionCreationType} injectionCreationType
     * @return {InjectionsRegistry}
     */
    registerAs(primaryInjectionPointer, overridingInjection, injectionType, injectionCreationType) {
        const injectionCreator = this._injectionCreators;
        const primaryInjectionCreator = new InjectionCreator(primaryInjectionPointer, injectionType, injectionCreationType);
        injectionCreator.set(overridingInjection, primaryInjectionCreator);
        return this;
    }

}


let registry = new InjectionsRegistry();

export function resetRegistry() {
    registry = new InjectionsRegistry();
}


/**
 * @param {Function} injectorPointer
 * @param {InjectionType} [injectionType]
 * @param {InjectionCreationType} [injectionCreationType]
 * @return {Function}
 */
export function registerInjection(
    injectorPointer,
    injectionType = InjectionType.SINGLETON,
    injectionCreationType = InjectionCreationType.CONSTRUCTOR
) {
    registry.register(injectorPointer, injectionType, injectionCreationType);
    return injectorPointer;
}

/**
 * @param {Function} primaryInjectionPointer
 * @param {Function} overridingInjectionPointer
 * @param {InjectionType} [injectionType]
 * @param {InjectionCreationType} [injectionCreationType]
 * @return {Function}
 */
export function registerPrimaryInjection(
    primaryInjectionPointer,
    overridingInjectionPointer,
    injectionType = InjectionType.SINGLETON,
    injectionCreationType = InjectionCreationType.CONSTRUCTOR
) {
    registry.registerAs(primaryInjectionPointer, overridingInjectionPointer, injectionType, injectionCreationType);
    return primaryInjectionPointer;
}

/**
 * @template T
 * @param {function(): T}injectorPointer
 * @return {T}
 */
export function inject(injectorPointer) {
    return registry.get(injectorPointer);
}