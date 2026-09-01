import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const styles = readFileSync('app/globals.css', 'utf8');

assert.match(styles, /@layer base\s*\{/);
assert.match(styles, /a\[href\]:not\(\[aria-disabled='true'\]\)/);
assert.match(styles, /button:not\(:disabled\):not\(\[aria-disabled='true'\]\)/);
assert.match(styles, /\[role='button'\]:not\(\[aria-disabled='true'\]\)/);
assert.match(styles, /\[role='link'\]:not\(\[aria-disabled='true'\]\)/);
assert.match(styles, /summary,/);
assert.match(styles, /input\[type='submit'\]:not\(:disabled\)/);
assert.match(styles, /input\[type='checkbox'\]:not\(:disabled\)/);
assert.match(styles, /cursor: pointer/);
assert.match(styles, /:where\(button:disabled, input:disabled, select:disabled, textarea:disabled\)\s*\{\s*cursor: not-allowed;/);
assert.doesNotMatch(styles, /input\[type='text'\][\s\S]{0,80}cursor: pointer/);
assert.doesNotMatch(styles, /textarea:not\(:disabled\)[\s\S]{0,80}cursor: pointer/);

console.log('INTERACTIVE_CURSOR_STYLE_CHECK: PASS');
