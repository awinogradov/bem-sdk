var expect  = require('chai').expect,
    _       = require('lodash'),
    resolve = require('../../../../lib/index').resolve;

describe('resolving unordered dependencies: tech - tech for mismatching tech', function () {
    it('should resolve tech depending on another tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'B' },
                        tech: 'js'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'B' }],
            tech: 'js'
        });
    });

    it('should resolve tech depending on multiple techs', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'bh'
                        },
                        {
                            entity: { block: 'B' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain(
            {
                entities: [{ block: 'B' }],
                tech: 'bh'
            }
        ).and.to.contain(
            {
                entities: [{ block: 'B' }],
                tech: 'js'
            }
        );
    });

    it('should resolve multiple tech in entity depending on tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'js'
                        }
                    ]
                },
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'B' }],
            tech: 'js'
        });
    });

    it('should resolve tech in multiple entities depending on different with resolving tech in another ' +
        'entity', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'C' },
                        tech: 'js'
                    }]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'C' },
                        tech: 'js'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'C' }],
            tech: 'js'
        });
    });

    it('should resolve tech dependency depending on tech different with resolving in another entity', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'C' }],
            tech: 'js'
        });
    });

    it('should resolve tech dependency depending on tech different from resolving tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'bh'
                        },
                        {
                            entity: { block: 'D' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain(
            {
                entities: [{ block: 'C' }],
                tech: 'bh'
            }
        ).and.to.contain(
            {
                entities: [{ block: 'D' }],
                tech: 'js'
            }
        );
    });

    it('should resolve multiple tech dependencies depending on another tech different from resolving' +
        ' tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        },
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [{
                        entity: { block: 'D' },
                        tech: 'js'
                    }]
                },
                {
                    entity: { block: 'C' },
                    dependOn: [{
                        entity: { block: 'D' },
                        tech: 'js'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'D' }],
            tech: 'js'
        });
    });

    it('should include tech to result once if tech of multiple entities depends on this tech and this tech is' +
        ' not matching with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts),
            jsDepsIndex = _.findIndex(resolved.dependOn, function (techDeps) {
                return techDeps.tech === 'js';
            }),
            firstIndex = _.findIndex(resolved.dependOn[jsDepsIndex], { block: 'C' }),
            lastIndex = _.findLastIndex(resolved.dependOn[jsDepsIndex], { block: 'C' });

        expect(jsDepsIndex).to.not.be(-1);
        expect(firstIndex).to.be.equal(lastIndex);
    });

    it('should not add tech to dependOn if dependency matching resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.be.empty();
    });
});
