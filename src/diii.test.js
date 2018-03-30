import assert from 'assert';
import {
    registerInjection,
    inject,
    InjectionType,
    InjectionCreationType,
    registerPrimaryInjection,
    resetRegistry
} from './diii';


describe('diii', () => {

    describe('singleton injection', () => {

        class SingletonInjection {
            constructor() {
                this.prop = 1;
            }
            getProp() {
                return this.prop;
            }
        }
        registerInjection(SingletonInjection);

        const injectionInstance = (/** @type {SingletonInjection} */ inject(SingletonInjection));

        it('correct instanceof', () => {
            assert.ok(injectionInstance instanceof SingletonInjection);
        });

        it('correct init', () => {
            assert.strictEqual(injectionInstance.getProp(), 1);
        });

        it('inject same instances', () => {
            assert.strictEqual(
                inject(SingletonInjection),
                inject(SingletonInjection)
            );
        });
    });


    describe('prototype injection', () => {
        let counter = 0;
        class PrototypeInjection {
            constructor() {
                this.prop = counter += 1;
            }
        }
        registerInjection(PrototypeInjection, InjectionType.PROTOTYPE);
        const instance1 = inject(PrototypeInjection);
        const instance2 = inject(PrototypeInjection);

        it('injects are different', () => {
            assert.notStrictEqual(instance1, instance2);
        });

        it('correct order', () => {
            assert.strictEqual(instance1.prop, 1);
            assert.strictEqual(instance2.prop, 2);
        });

        it('correct instanceof', () => {
            assert.ok(instance1 instanceof PrototypeInjection);
            assert.ok(instance2 instanceof PrototypeInjection);
        });
    });


    describe('function injection', () => {
        function functionInjection() {
            return {
                prop: 1
            }
        }
        registerInjection(functionInjection, InjectionType.SINGLETON, InjectionCreationType.FUNCTION);
        const injection = inject(functionInjection);

        it('correct result', () => {
            assert.strictEqual(injection.prop, 1);
        });
    });


    describe('injections chain', () => {
        class Child {
            constructor() {
                this.isChild = true;
            }
        }
        registerInjection(Child);

        class Parent {
            constructor() {
                this.child = /** @type {Child} */ inject(Child);
            }
        }
        registerInjection(Parent);

        const parentInstance = /** @type {Parent} */inject(Parent);

        it('child is correct', () => {
            assert.ok(parentInstance.child.isChild);
        });
    });


    describe('register primary injection', () => {
        class Child {
            constructor() {
                this.prop = 'originChild';
            }
        }
        registerInjection(Child);

        class Parent {
            constructor() {
                this.child = /** @type {Child} */inject(Child);
            }
        }
        registerInjection(Parent);

        class PrimaryChild {
            constructor() {
                this.prop = 'primaryChild'
            }
        }
        registerPrimaryInjection(PrimaryChild, Child);

        const parent = /** @type {Parent} */inject(Parent);

        it('primary is override', () => {
            assert.strictEqual(parent.child.prop, 'primaryChild');
        });
    });

    describe('error notifications', () => {

        it('inject unregistered injection', () => {
            class Injection {}
            assert.throws(
                () => {
                    inject(Injection)
                }
            );
            assert.throws(
                () => {
                    inject()
                }
            )
        });

        it('inject injection with unsupported injection type', () => {
            class Injection {}
            registerInjection(Injection, 'asd');
            assert.throws(
                () => {
                    inject(Injection)
                }
            )
        });

        it('inject injection with unsupported creation type', () => {
            class Injection {}
            registerInjection(Injection, InjectionType.SINGLETON, 'asd');
            assert.throws(
                () => {
                    inject(Injection)
                }
            )
        });

    });

    describe('reset repository', () => {
        it('simple reset', () => {
            class Injection {}
            registerInjection(Injection);

            const instance = inject(Injection);
            assert.ok(instance != null);

            resetRegistry();
            assert.throws(() => {
                inject(Injection);
            })
        });
    });

});