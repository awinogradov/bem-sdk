'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;

describe('deps/itself-deps/matching-deps/matching-tech-resolving-by-tech', () => {
    it('should include entity once if entity depends on a', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'A' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.be.eql([{ entity: { block: 'A' }, tech: 'css' }]);
            }
        });
    });
});
