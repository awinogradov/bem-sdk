var expect  = require('chai').expect,
    _       = require('lodash'),
    resolve = require('../../../lib/index').resolve;

describe('resolving unordered dependencies: entity - tech', function () {
    it('should resolve entity depending by tech on another entity', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [{
                        entity: { block: 'B' },
                        tech: 'css'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' });
    });

    it('should resolve entity depending by tech on multiple entities', function () {
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
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' })
            .and.to.contain({ block: 'C' });
    });

    it('should resolve entity depending by multiple techs on another entity', function () {
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
                            entity: { block: 'B' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' });
    });

    it('should resolve dependency depending by tech on another entity', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        { entity: { block: 'B' } }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' });
    });

    it('should resolve dependency depending by multiple techs on another entity', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        { entity: { block: 'B' } }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        },
                        {
                            entity: { block: 'C' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' });
    });

    it('should resolve dependency depending by multiple techs on another entities', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        { entity: { block: 'B' } }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        },
                        {
                            entity: { block: 'D' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' })
            .and.to.contain({ block: 'D' });
    });

    it('should include tech dependency to result once if multiple entities depend on this entity', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts),
            firstIndex = _.findIndex(resolved.entities, { block: 'C' }),
            lastIndex = _.findLastIndex(resolved.entities, { block: 'C' });

        expect(resolved.entities).to.contain({ block: 'C' });
        expect(firstIndex).to.be.equal(lastIndex);
    });

    it('should not include entity if no entity from decl depends on it and this entity has tech dependency on' +
        ' entity listed in decl', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).not.to.contain({ block: 'B' });
    });

    it('should not include dependencie\'s dependency if no entity from decl\'s dependencies depends ' +
        'on it', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'C' },
                    dependOn: [
                        {
                            entity: { block: 'D' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.not.contain({ block: 'D' });
    });
});
