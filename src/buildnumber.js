#!/usr/bin/env node

"use strict";

(() => {

    const fs = require("fs");
    const path = require('path');
    const commander = require("commander");

    const nbn_meta = require("../package.json");

    const package_file = "/package.json";

    commander.version(nbn_meta.version)
        .option("--auto-commit")
        .option("--major")
        .option("--minor")
        .option("--rev")
        .parse(process.argv);

    const resolve_package_metadata = () => {

        const package_resolvers = [

            () => {
                return process.cwd();
            },

            () => {
                return path.dirname(require.main.filename);
            },

            () => {
                return "..";
            }
        ];

        for (let prix = 0; prix < package_resolvers.length; prix++) {
            let where = package_resolvers[prix]();
            if (fs.existsSync(where + package_file)) {
                return where;
            }
        }

        throw new Error("<NBNS> Could not locate package.json")
    };

    function write_meta(pathToPackageJson) {

        const package_dir = pathToPackageJson || resolve_package_metadata();
        const node_meta = require(package_dir + package_file);

        let vspl = node_meta.version.split(".");
        if (commander.major) {
            node_meta.version = `${parseInt(vspl[0])+1}.0.0`;
            node_meta.build = undefined;
        } else if (commander.minor) {
            node_meta.version = `${vspl[0]}.${parseInt(vspl[1])+1}.0`;
            node_meta.build = undefined;
        } else if (commander.rev) {
            node_meta.version = `${vspl[0]}.${vspl[1]}.${parseInt(vspl[2])+1}`;
            node_meta.build = undefined;
        }

        const __n = (!node_meta.build ? 1 : node_meta.build.number + 1);

        node_meta.build = {
            number: __n,
            timestamp: new Date().toLocaleString(),
        };

        const meta_files = {
            temp: package_dir + "/package-new.json",
            backup: package_dir + "/package-back.json",
            node: package_dir + package_file
        };

        if (fs.existsSync(meta_files.backup)) {
            fs.unlinkSync(meta_files.backup);
        }

        fs.writeFile(meta_files.temp, JSON.stringify(node_meta, null, 2), function (err) {
            if (err) {
                console.log("<NBNS> Could not write build metadata file:", meta_files.temp);
                return console.log(err);

            } else {
                fs.renameSync(meta_files.node, meta_files.backup);
                fs.renameSync(meta_files.temp, meta_files.node);
                fs.unlinkSync(meta_files.backup);
                console.log("<NBNS> Build metadata updated:",'build ' + String(node_meta.build.number) + ' at ' + node_meta.build.timestamp);
            }
        });
    }

    if (require.main === module) {
        write_meta();
    } else {
        module.exports = {
            writeMetadata: write_meta
        }
    }
})();
