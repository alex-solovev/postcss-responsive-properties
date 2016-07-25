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
        'a {font-size: 14px;}\n@media screen and (min-width: 768px) {\n\ta {\n\t\tfont-size: 16px;\n\t}\n};\n@media screen and (min-width: 1600px) {\n\ta {\n\t\tfont-size: 19px;\n\t}\n}'
    );
});

test('does not compile commented breakpoints', t => {
    return run(
        t,
        'a {font-size: { 0: 14px; /*768: 16px;*/ }}',
        'a {font-size: 14px;}'
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
        '$tablet: 768px; a {font-size: 14px;} @media screen and (min-width: $tablet) {\n\ta {\n\t\tfont-size: 16px;\n\t}\n}; @media screen and (min-width: 1600px) {\n\ta {\n\t\tfont-size: 19px;\n\t}\n}'
    );
});