// Hand-off utility for B. Real UI interactions; no hidden application test API.
import type {Page} from '@playwright/test';
export const states = ['list','detail','form-errors','dialog'] as const;
export async function enterState(page:Page,variant:string,state:typeof states[number]) {
  await page.goto(`/?variant=${encodeURIComponent(variant)}&state=list`);
  if(state==='list') return;
  await page.getByTestId('event-link').click();
  if(state==='detail') return;
  await page.getByTestId('enroll').click();
  // Visiting form-errors deliberately presents invalid empty fields; submit to reproduce validation.
  if(state==='form-errors'){await page.getByTestId('review').click();return;}
  await page.getByTestId('name').fill('測試同學');
  await page.getByTestId('email').fill('student@example.test');
  await page.getByTestId('consent').check();
  await page.getByTestId('review').click();
  await page.getByTestId('confirm-dialog').waitFor({state:'visible'});
}
