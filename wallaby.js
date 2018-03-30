module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
            '!src/**/*.test.js'
        ],

        tests: [
            'src/**/*.test.js'
        ],

        env: {
            type: 'node',
            params: {
                runner: `-r ${require.resolve('esm')}`
            }
        },

        testFramework: 'mocha',
    };
};