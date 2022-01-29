/* eslint-disable */
const fs = require('fs')
const esbuild = require('esbuild')
const { gzip } = require('zlib')
const pkg = require('../package.json')
const path = require('path')
const alias = require('esbuild-plugin-alias')
const { log } = console

async function main() {
  await esbuild.init
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true }, e => {
      if (e) {
        throw e
      }
    })
  }

  const deps = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    'solid-js/store',
  ]

  try {
    await esbuild.build({
      entryPoints: ['./src/index.ts'],
      outdir: 'dist/cjs',
      minify: false,
      bundle: true,
      format: 'cjs',
      target: 'es6',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      tsconfig: './tsconfig.build.json',
      external: deps,
      metafile: true,
      sourcemap: true,
      plugins: [
        alias({
          mobx: path.join(__dirname, '/../src/solid-mobx.ts'),
        }),
      ],
    })

    const esmResult = await esbuild.build({
      entryPoints: ['./src/index.ts'],
      outdir: 'dist/esm',
      minify: false,
      bundle: true,
      format: 'esm',
      target: 'es6',
      tsconfig: './tsconfig.build.json',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      external: deps,
      metafile: true,
      sourcemap: true,
    })

    const esmSize = Object.values(esmResult.metafile.outputs).reduce(
      (acc, { bytes }) => acc + bytes,
      0
    )

    fs.readFile('./dist/esm/index.js', (_err, data) => {
      gzip(data, (_err, result) => {
        log(
          `✔ ${pkg.name}: Built package. ${(esmSize / 1000).toFixed(2)}kb (${(
            result.length / 1000
          ).toFixed(2)}kb gzipped)`
        )
      })
    })
  } catch (e) {
    log(`× ${pkg.name}: Build failed due to an error.`)
    log(e)
  }
}

main()
