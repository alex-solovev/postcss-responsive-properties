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
        'a {font-size: 14px}@media screen and (min-width: 768px) ' +
        '{a {font-size: 16px;}}@media screen and (min-width: 1600px) ' +
        '{a {font-size: 19px;}}'
    );
});

test('does not process commented responsive values', t => {
    return run(
        t,
        'a {font-size: {0: 14px; /*768: 16px;*/ 1024: 18px;}}',
        'a {font-size: 14px}@media screen and (min-width: 1024px)' +
        ' {a {font-size: 18px;}}'
    );
});

test('does not change commented blocks output', t => {
    return run(
        t,
        '/*a {font-size: { 0: 14px; 768: 16px; }}*/',
        '/*a {font-size: { 0: 14px; 768: 16px; }}*/'
    );
});

test('keeps properties with no breakpoint shortcuts', t => {
    return run(
        t,
        'a {font-size:{ 0: 14px; 768: 16px; 1600: 19px; } color: red;}',
        'a {font-size: 14px; color: red;}' +
		'@media screen and (min-width: 768px) ' +
        '{a {font-size: 16px;}}@media screen and (min-width: 1600px) ' +
        '{a {font-size: 19px;}}'
    );
});

test('compiles multiple properties', t => {
    return run(
        t,
        'a {font-size:{ 0: 14px; 768: 16px; 1600: 19px; } ' +
		'color:{ 0: red; 768: blue; 1600: green }}',
        'a {font-size: 14px; color: red}@media screen and (min-width: 768px) ' +
        '{a {font-size: 16px;color: blue;}}' +
		'@media screen and (min-width: 1600px) ' +
        '{a {font-size: 19px;color: green;}}'
    );
});

