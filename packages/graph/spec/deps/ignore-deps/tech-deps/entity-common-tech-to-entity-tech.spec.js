'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;

describe('deps/ignore-deps/tech-deps/entity-common-tech-to-entity-tech', () => {
    it('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
        ' listed in decl', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'A' }, 'css'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).not.to.deep.contain({ entity: { block: 'B' }, tech: 'css' });
            }
        });
    });

    it('should not include dependency if no entity from decl\'s dependencies depends on it', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'C' })
                    [linkMethod]({ block: 'D' }, 'css'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).not.to.deep.contain({ entity: { block: 'D' }, tech: 'css' });
            }
        });
    });
});
