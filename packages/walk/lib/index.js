'use strict';

const { Readable } = require('stream');
const each = require('async-each');
const deprecate = require('depd')('@bem/sdk.walk');

const namingCreate = require('@bem/sdk.naming.presets/create');
const walkers = require('./walkers');

/**
 * Scans levels in file system.
 *
 * If file or directory is valid BEM entity then `add` will be called with info about this file.
 *
 * @param {string[]} levels                The paths to levels.
 * @param {object} options                 The options.
 * @param {object} options.levels          The level map. A key is path to a level,
 *                                         a value is an options object for this level.
 * @param {object} options.defaults        The options for levels by default.
 * @param {object} options.defaults.naming Any options for `@bem/naming`.
 * @param {string} options.defaults.scheme The name of level scheme. Available values: `flat` or `nested`.
 *
 * @returns {module:stream.Readable} stream with info about found files and directories.
 */
module.exports = (levels, options) => {
    options || (options = {});

    const defaults = options.defaults || {};

    // Turn warning about old using old walkers in the next major
    defaults.scheme && deprecate('Please stop using old API');

    const levelConfigs = options.levels || {};
    const defaultNaming = defaults.naming || {};
    const defaultScheme = defaultNaming.scheme || defaults.scheme;
    const defaultWalker = (typeof defaultScheme === 'string' ? walkers[defaultScheme] : defaultScheme) || walkers.sdk;

    const output = new Readable({ objectMode: true, read() {} });
    const add = (obj) => output.push(obj);

    const scan = (level, callback) => {
        const config = levelConfigs[level] || {};
        const isLegacyScheme = 'scheme' in config;
        const userNaming = typeof config.naming === 'object'
            ? config.naming
            : {preset: config.naming || (isLegacyScheme ? 'legacy' : 'origin')};

        // Fallback for slowpokes
        if (config.scheme) {
            userNaming.fs || (userNaming.fs = {});
            userNaming.fs.scheme = config.scheme;
        }

        const naming = namingCreate(userNaming, defaultNaming);

        const scheme = config && config.scheme || naming.fs && naming.fs.scheme;

        // TODO: Drop or doc custom function scheme support (?)
        const walker = (config.legacyWalker || isLegacyScheme)
            ? (typeof scheme === 'string' ? walkers[scheme] : (scheme || defaultWalker))
            : defaultWalker;

        walker({ path: level, naming: naming /* extend with defauls */ }, add, callback);
    };

    each(levels, scan, err => {
        err
            ? output.emit('error', err)
            : output.push(null);
    });

    return output;
};
