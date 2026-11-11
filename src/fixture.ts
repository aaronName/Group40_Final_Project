export const defectIds = ['N01','N02','N03','V01','V02','V03','O01','O02','O03','K01','K02','K03','F01','F02','F03','S01','S02','S03'] as const;
export type DefectId = typeof defectIds[number];
export type StateId = 'list' | 'detail' | 'form-errors' | 'dialog';
const query = new URLSearchParams(location.search);
// Opaque labels reduce clues in participant URLs. The runner controls the assignment.
// Source inspection is still forbidden by the independent-check protocol.
const cases: Record<string,string> = {q7m:'fixed',r2p:'N01',h8v:'N02',c4n:'N03',t9b:'V01',a6k:'V02',w3d:'V03',e5x:'O01',u8f:'O02',j2s:'O03',p6r:'K01',b9h:'K02',n4a:'K03',x7c:'F01',d3w:'F02',s5j:'F03',m8e:'S01',k2u:'S02',v6t:'S03',f9q:'all'};
const caseCode = query.get('case');
if (caseCode && (query.has('variant') || !cases[caseCode])) throw new Error('Invalid or conflicting case');
export const variant = caseCode ? cases[caseCode] : query.get('variant') ?? 'fixed';
if (variant !== 'fixed' && variant !== 'all' && !defectIds.includes(variant as DefectId)) {
  throw new Error('Unknown variant. Use fixed, all, or an assigned defect ID.');
}
export const has = (id: DefectId) => variant === 'all' || variant === id;
export function route(state: StateId) {
  return caseCode ? `?case=${encodeURIComponent(caseCode)}&state=${state}` : `?variant=${encodeURIComponent(variant)}&state=${state}`;
}
export const initialState: StateId = (() => {
  const state = query.get('state') ?? 'list';
  if (!['list','detail','form-errors','dialog'].includes(state)) throw new Error('Unknown state');
  return state as StateId;
})();
