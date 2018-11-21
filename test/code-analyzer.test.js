import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty input', () => {
        assert.deepEqual(
            parseCode(''),
            []
        );
    });

    it('is parsing simple let', () => {
        assert.deepEqual(
            (parseCode('let x;')),
            [[1,'variable declaration', 'x','','null']]
        );
    });

    it('is parsing assignment let', () => {
        assert.deepEqual(
            (parseCode('let x=1;')),
            [[1,'variable declaration', 'x','',1]]
        );
    });

    it('is testing assignment', () => {
        assert.deepEqual(
            (parseCode('x=1;')),
            [[1,'assignment expression', 'x','',1]]
        );
    });

    it('is testing while', () => {
        assert.deepEqual(
            (parseCode('while(yosi<3){\n' +
                '    x=r+5;\n' +
                '}')),
            [[1,'while statement', '','yosi<3',''], [2,'assignment expression', 'x','','r+5']]
        );
    });

    it('is testing while', () => {
        assert.deepEqual(
            (parseCode('if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            x=-3;')),
            [[1,'if statement', '','X < V[mid]',''],
                [2,'assignment expression', 'high','','mid - 1'],
                [3, 'else if statement', '', 'X > V[mid]', ''],
                [4, 'assignment expression', 'low', '', 'mid + 1'],
                [6, 'assignment expression', 'x', '', '-3']]
        );
    });

    it('is testing while', () => {
        assert.deepEqual(
            (parseCode('if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            x=-num;')),
            [[1,'if statement', '','X < V[mid]',''],
                [2,'assignment expression', 'high','','mid - 1'],
                [3, 'else if statement', '', 'X > V[mid]', ''],
                [4, 'assignment expression', 'low', '', 'mid + 1'],
                [6, 'assignment expression', 'x', '', '-num']]
        );
    });

    it('is testing while', () => {
        assert.deepEqual(
            (parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')),
            [[1, 'function declaration', 'binarySearch', '', ''],
                [1, 'variable declaration', 'X', '', ''],
                [1, 'variable declaration', 'V', '', ''],
                [1, 'variable declaration', 'n', '', ''],
                [2, 'variable declaration', 'low', '', 'null'],
                [2, 'variable declaration', 'high', '', 'null'],
                [2, 'variable declaration', 'mid', '', 'null'],
                [3, 'assignment expression', 'low', '', 0],
                [4, 'assignment expression', 'high', '', 'n - 1'],
                [5, 'while statement', '', 'low <= high', ''],
                [6, 'assignment expression', 'mid', '', '(low + high)/2'],
                [7, 'if statement', '', 'X < V[mid]', ''],
                [8, 'assignment expression', 'high', '', 'mid - 1'],
                [9, 'else if statement', '', 'X > V[mid]', ''],
                [10, 'assignment expression', 'low', '', 'mid + 1'],
                [12, 'return statement', '', '', 'mid'],
                [14, 'return statement', '', '', '-1']]
        );
    });

    it('is testing while', () => {
        assert.deepEqual(
            (parseCode('for(let x=0;x<7;x++){\n' +
                '    x=7-5;\n' +
                '    y=3232;\n' +
                '}')),
            [[1, 'for statement', '', 'let x=0;x<7;x++', ''],
                [2, 'assignment expression', 'x', '', '7-5'],
                [3, 'assignment expression', 'y', '', 3232]]
        );
    });

    it('is testing funcy punky', () => {
        assert.deepEqual(
            (parseCode('' +
                'function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    return me;\n' +
                '}')),
            [[1, 'function declaration', 'binarySearch', '', ''],
                [1, 'variable declaration', 'X', '', ''],
                [1, 'variable declaration', 'V', '', ''],
                [1, 'variable declaration', 'n', '', ''],
                [2, 'variable declaration', 'low', '', 'null'],
                [2, 'variable declaration', 'high', '', 'null'],
                [2, 'variable declaration', 'mid', '', 'null'],
                [3, 'return statement', '', '', 'me']]
        );
    });


    it('is testing more if', () => {
        assert.deepEqual(
            (parseCode('if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else if(d==4)\n' +
                '            f = mid;')),
            [[1, 'if statement', '', 'X < V[mid]', ''],
                [2, 'assignment expression', 'high', '', 'mid - 1'],
                [3, 'else if statement', '', 'X > V[mid]', ''],
                [4, 'assignment expression', 'low', '', 'mid + 1'],
                [5, 'else if statement', '', 'd==4', ''],
                [6, 'assignment expression', 'f', '', 'mid']]
        );
    });



});
