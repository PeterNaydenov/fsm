import resolve    from '@rollup/plugin-node-resolve'
import commonjs   from '@rollup/plugin-commonjs'
import terser     from '@rollup/plugin-terser';


export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'fsm',
			file: 'dist/fsm.umd.js',
			format: 'umd',
            globals : {
                'ask-for-promise': 'askForPromise',
                'dt-toolbox': 'dtbox',
                '@peter.naydenov/dt-queries': 'dtQueries',
            }
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
			, terser()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		external: ['ask-for-promise', 'dt-toolbox', '@peter.naydenov/dt-queries'],
		output: [
			{ file: 'dist/fsm.cjs'    , format: 'cjs' },
			{ file: 'dist/fsm.esm.mjs', format: 'es' }
		],
		plugins: [ terser() ]
	}
];