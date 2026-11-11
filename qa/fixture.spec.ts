// A's fixture verification only. These checks are NOT B's frozen research assertions.
import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const ids = ['N01','N02','N03','V01','V02','V03','O01','O02','O03','K01','K02','K03','F01','F02','F03','S01','S02','S03'];
const states = ['list','detail','form-errors','dialog'];
const url = (v:string,s:string) => `/?variant=${v}&state=${s}`;

for (const state of states) test(`fixed: ${state} baseline axe`,async({page})=>{
  await page.goto(url('fixed',state));
  await expect(page.locator('main')).toBeAttached();
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});

test('fixed: complete registration, dialog trap, Escape, return and live message', async({page})=>{
  await page.goto(url('fixed','form-errors'));
  await page.getByTestId('name').fill('測試同學'); await page.getByTestId('email').fill('student@example.test');
  await page.getByTestId('consent').check(); await page.getByTestId('review').click();
  await expect(page.locator('#dialog-title')).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(page.getByTestId('dialog-confirm')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByTestId('dialog-cancel')).toBeFocused();
  await page.keyboard.press('Escape'); await expect(page.getByTestId('review')).toBeFocused();
  await page.getByTestId('review').click(); await page.getByTestId('dialog-confirm').click();
  await expect(page.getByTestId('success')).toContainText('報名成功');
  await expect(page.getByTestId('success')).toHaveAttribute('role','status');
});

test('fixed: category, disclosure and venue guide support keyboard',async({page})=>{
  await page.goto(url('fixed','list')); await page.getByTestId('category-tech').focus();
  await page.keyboard.press('Space'); await expect(page.getByTestId('category-tech')).toHaveAttribute('aria-pressed','true');
  await page.goto(url('fixed','detail')); await page.getByTestId('agenda-toggle').focus();
  await page.keyboard.press('Enter'); await expect(page.getByTestId('agenda-toggle')).toHaveAttribute('aria-expanded','true');
  await page.getByTestId('open-guide').click(); await page.keyboard.press('Tab');
  await expect(page.getByTestId('close-guide')).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.getByTestId('open-guide')).toBeFocused();
});

test('all 20 variants reach all four states without runtime errors',async({page})=>{
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  for(const v of ['fixed',...ids,'all']) for(const s of states) {
    await page.goto(url(v,s)); await expect(page.locator('h1')).toBeVisible();
    if(s==='dialog') await expect(page.getByTestId('confirm-dialog')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('N01 N02 N03: missing names are reproducible',async({page})=>{
  for(const [id,state,rule] of [['N01','form-errors','label'],['N02','list','button-name'],['N03','form-errors','label']]){
    await page.goto(url(id,state));
    const result=await new AxeBuilder({page}).analyze();
    expect(result.violations.some(v=>v.id===rule)).toBeTruthy();
  }
});
test('V01 V02 V03: low contrast is measurable',async({page})=>{
  for(const [id,state,target] of [['V01','list','intro'],['V02','form-errors','email-hint'],['V03','form-errors','error-summary']]) {
    await page.goto(url(id,state));
    const result=await new AxeBuilder({page}).analyze();
    const found = result.violations.some(v => v.id === 'color-contrast' && v.nodes.some(n =>
      n.html.includes(`data-testid="${target}"`) || n.target.some(t => String(t).includes(target))
    ));
    expect(found).toBeTruthy();
  }
});
test('O01 O02 O03: conflicting focus orders are reproducible',async({page})=>{
  await page.goto(url('O01','form-errors')); await page.locator('body').click({position:{x:1,y:1}});
  await page.keyboard.press('Tab'); await expect(page.getByTestId('email')).toBeFocused();
  await page.goto(url('O02','detail')); await page.getByTestId('agenda-toggle').focus();
  await page.keyboard.press('Tab'); await expect(page.getByTestId('step-3')).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.getByRole('status')).toContainText('尚未完成');
  await page.goto(url('O03','form-errors')); await page.getByTestId('email').focus();
  await page.keyboard.press('Tab'); await expect(page.getByTestId('review')).toBeFocused();
});
test('K01 K02 K03: keyboard defects differ from mouse behavior',async({page})=>{
  await page.goto(url('K01','list')); await page.getByTestId('category-tech').focus(); await page.keyboard.press('Enter');
  await expect(page.getByTestId('category-tech')).toHaveAttribute('aria-pressed','false');
  await page.getByTestId('category-tech').click(); await expect(page.getByTestId('category-tech')).toHaveAttribute('aria-pressed','true');
  await page.goto(url('K02','detail')); await page.getByTestId('agenda-toggle').focus(); await page.keyboard.press('Space');
  await expect(page.getByTestId('agenda-toggle')).toHaveAttribute('aria-expanded','false');
  await page.getByTestId('agenda-toggle').click(); await expect(page.getByTestId('agenda-toggle')).toHaveAttribute('aria-expanded','true');
  await page.getByTestId('agenda-toggle').focus(); await page.keyboard.press('Enter');
  await page.goto(url('K03','detail')); await page.getByTestId('open-guide').click();
  for(const key of ['Tab','Shift+Tab','Escape']) {await page.keyboard.press(key); await expect(page.getByTestId('guide-region')).toBeFocused();}
  await page.getByTestId('close-guide').click(); await expect(page.getByTestId('guide-region')).toHaveCount(0);
});
test('F01 F02 F03: focus changes are reproducible',async({page})=>{
  await page.goto(url('F01','detail')); await page.getByTestId('enroll').focus();
  expect(await page.getByTestId('enroll').evaluate(e=>getComputedStyle(e).outlineStyle)).toBe('none');
  await page.goto(url('F02','dialog')); await expect(page.getByTestId('review')).toBeFocused();
  await page.goto(url('F03','dialog')); await page.keyboard.press('Escape');
  await expect(page.getByTestId('review')).not.toBeFocused(); expect(await page.locator('body').evaluate(e=>document.activeElement===e)).toBeTruthy();
});
test('S01 S02 S03: semantic mutations are reproducible (human judgment still required)',async({page})=>{
  await page.goto(url('S01','detail')); await expect(page.getByTestId('venue-map')).toHaveAttribute('alt','午餐菜單：咖哩飯與紅茶');
  await page.goto(url('S02','detail')); await expect(page.getByTestId('rules-link')).toHaveText('按此');
  await page.goto(url('S03','dialog')); await page.getByTestId('dialog-confirm').click();
  await expect(page.getByTestId('success')).toContainText('報名成功');
  expect(await page.getByTestId('success').getAttribute('role')).toBeNull();
  expect(await page.getByTestId('success').getAttribute('aria-live')).toBeNull();
});
