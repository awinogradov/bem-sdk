import { INamingConvention } from './types';

export const react: INamingConvention = {
    delims: {
        elem: '-',
        mod: { name: '_', val: '_' }
    },
    fs: {
        delims: { elem: '' },
        pattern: '${layer?${layer}.}blocks/${entity}.${tech}',
        scheme: 'nested'
    },
    wordPattern: '[a-zA-Z0-9]+'
};
