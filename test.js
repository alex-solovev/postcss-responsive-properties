import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('compiles breakpoints shortcuts to @media rules', t => {
    return run(
        t,
        'a {font-size:{ 0: 14px; 768: 16px; 1600: 19px; }}',
        'a {font-size: 14px;}\n@media screen and (min-width: 768px) {\na {font-size: 16px;}}\n@media screen and (min-width: 1600px) {\na {font-size: 19px;}}'
    );
});

test('does not process commented responsive values', t => {
    return run(
        t,
        'a {font-size: {0: 14px; /*768: 16px;*/ 1024: 18px;}}',
        'a {font-size: 14px;}\n@media screen and (min-width: 1024px) {\na {font-size: 18px;}}'
    );
});

test('does not change commented blocks output', t => {
    return run(
        t,
        '/*a {font-size: { 0: 14px; 768: 16px; }}*/',
        '/*a {font-size: { 0: 14px; 768: 16px; }}*/'
    );
});

test('compiles breakpoints shortcuts to @media rules with variables', t => {
    return run(
        t,
        '$tablet: 768px; a {font-size:{ 0: 14px; tablet: 16px; 1600: 19px; }}',
        '$tablet: 768px; a {font-size: 14px;} @media screen and (min-width: $tablet) { a {font-size: 16px;}} @media screen and (min-width: 1600px) { a {font-size: 19px;}}'
    );
});