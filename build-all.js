const fs = require('fs');
const path = require('path');

const esBuild = require('esbuild');
const { pathPlugin } = require('./build-plugins')

const IS_PROD =
    process.argv.findIndex((arg) => arg === '--prod') >= 0;
const SHOULD_WATCH =
    process.argv.findIndex((arg) => arg === '--watch') >= 0;

const resolveResources = (pathLike) => {
    let results = [];
    const dirList = fs.readdirSync(pathLike);

    dirList.forEach((file, _) => {
        const fileStats = fs.statSync( path.join(pathLike.toString(), file) );

        results = [...results, ...(fileStats && fileStats.isDirectory() ?
            resolveResources(
                path.join( pathLike.toString(), file )
            ): [ file ])]
    })

    return results.map((filePath) => path.resolve(pathLike.toString(), filePath))
        .filter((filePath) => filePath.endsWith('build.config.js'));
}

async function buildResources() {
    const resources = resolveResources('./resources');

    if (resources.length <= 0) {
        return console.log(`[BUILD]: Couldn't locate any valid resources to build!`);
    }

    for (const resourcePath of resources) {
        try {
            const { name, clientEntry, serverEntry } = await require(resourcePath);

            if (!name) {
                console.log(`[BUILD]: Skipping; Couldn't find name property in ${resourcePath.split('\\').at(-2)} build config..`);
                continue;
            }

            for (const [entryIndex, entryPath] of [clientEntry, serverEntry].entries()) {
                const isServer = entryIndex > 0;

                if (!entryPath) {
                    console.log(`[BUILD]: Skipping; ${name} due to an invalid ${isServer ? 'server' : 'client'} entry path..`)
                    continue;
                }

                const buildResult = await esBuild.build(
                    {
                        entryPoints: [ path.resolve(resourcePath, '../' + entryPath) ],
                        outdir: path.resolve(resourcePath, `../build/`),

                        target: isServer ? ['node16'] : ['chrome93'] ,

                        format: 'iife',
                        minify: IS_PROD,
                        bundle: true,
                        sourcemap: IS_PROD == false,

                        metafile: true,

                        watch: SHOULD_WATCH ?
                            {
                                onRebuild: (error, result) => {
                                    if (error) {
                                        return console.error(error)
                                    }

                                    console.log(`[BUILD]: Successfully rebuilt ${name}/${isServer ? 'server' : 'client'}, with ${result.warnings.length} warnings..`)
                                }
                            } : false,

                        plugins: isServer ? [ pathPlugin ] : []
                    }
                )

                if (!IS_PROD) {
                    const buildAnalysis = esBuild.analyzeMetafileSync(buildResult.metafile, { color: true, verbose: true });
                    console.log(buildAnalysis)
                }
            }

            console.log(`[BUILD/ ${IS_PROD ? 'Production' : 'Development' }]: ${name} has been built successfully..`)
        } catch (err) {
            console.log(err)
        }
    }
}

buildResources();