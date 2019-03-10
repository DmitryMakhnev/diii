import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';


const env = process.env.NODE_ENV;
const config = {
    input: './src/diii.js',
    output: [],
    plugins: []
};


switch (env) {
    case 'umd':
        config.output.push(
            {
                file: './build/diii.js',
                name: 'diii',
                format: 'umd',
                sourcemap: true
            }
        );
        config.plugins.push(
            buble()
        );
        break;
    case 'production':
        config.output.push(
            {
                file: './build/diii.min.js',
                name: 'diii',
                format: 'umd',
                sourcemap: true
            }
        );
        config.plugins.push(
            buble(),
            uglify()
        );
        break;
    case 'cjs':
        config.output.push(
            {
                file: './build/diii.cjs.js',
                format: 'cjs',
                sourcemap: true
            }
        );
        config.plugins.push(
            buble(),
        );
        break;
    case 'es':
        config.output.push(
            {
                file: './build/diii.es.js',
                format: 'es',
                sourcemap: true
            }
        );
}


export default config;
