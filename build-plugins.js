const path = require('path');

const pathPlugin =
    {
        name: "ts-paths",
        setup: (build) => {

            build.onResolve({ filter: /.*/ }, (args) => {

                if (
                    !args.path.match(/^(@|\.|\\|\/)/) &&
                    args.kind === "import-statement"
                ) {
                    let modulePath = require.resolve(args.path);

                    if (path.isAbsolute(modulePath)) {

                        modulePath = path.join(
                            ...process.cwd().split(path.sep),
                            "node_modules",
                            args.path
                        );

                    }

                    return {
                        path: modulePath,
                        external: true,
                    };
                }
            })

        },
    }

module.exports = {
    pathPlugin
}
