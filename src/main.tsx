import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {has, initialState, route} from './fixture';
import './styles.css';

function App() {
  const isForm = initialState === 'form-errors' || initialState === 'dialog';
  const [category, setCategory] = useState('全部活動');
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [guide, setGuide] = useState(false);
  const [step, setStep] = useState(0);
  const [stepMessage, setStepMessage] = useState('請依序完成場次與席位確認。');
  const [values, setValues] = useState({name: initialState === 'dialog' ? '測試同學' : '', email: initialState === 'dialog' ? 'student@example.test' : ''});
  const [consent, setConsent] = useState(initialState === 'dialog');
  const [errors, setErrors] = useState(initialState === 'form-errors');
  const [dialog, setDialog] = useState(initialState === 'dialog');
  const [success, setSuccess] = useState('');
  const opener = useRef<HTMLButtonElement>(null);
  const modal = useRef<HTMLDivElement>(null);
  const modalTitle = useRef<HTMLHeadingElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const guideOpener = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const background = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dialog) return;
    // F02 intentionally leaves focus on the trigger and background reachable.
    if (has('F02')) opener.current?.focus();
    else modalTitle.current?.focus();
  }, [dialog]);
  useEffect(() => {
    if (background.current) background.current.inert = dialog && !has('F02');
  }, [dialog]);
  useEffect(() => { if (guide) guideRef.current?.focus(); }, [guide]);

  function closeDialog() {
    setDialog(false);
    if (background.current) background.current.inert = false;
    if (has('F03')) (document.activeElement as HTMLElement)?.blur();
    else opener.current?.focus();
  }
  function focusLoop(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); closeDialog(); }
    if (event.key !== 'Tab') return;
    const controls = Array.from(modal.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === modalTitle.current)) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modalTitle.current)) {
      event.preventDefault(); first?.focus();
    }
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const validName = values.name.trim().length > 0;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
    if (!validName || !validEmail || !consent) {
      setErrors(true);
      if (!validName) nameRef.current?.focus();
      else if (!validEmail) emailRef.current?.focus();
      else consentRef.current?.focus();
      return;
    }
    setErrors(false); setDialog(true);
  }
  const activate = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); callback();}
  };
  const stepButtons = [1,2,3].map(n => <button key={n} data-testid={`step-${n}`} type="button" style={{order: n}} onClick={() => {
    if (n > step + 1) setStepMessage('尚未完成前一步，請從第 1 步開始。');
    else {setStep(Math.max(step, n)); setStepMessage(`已完成第 ${n} 步。`);}
  }}><span className="step-number">0{n}</span>{['確認週三場次','確認一般席位','確認報名資格'][n - 1]}</button>);

  return <>
    <div ref={background}>
      <a className="skip" href="#main">跳至主要內容</a>
      <header className="header"><a href={route('list')} className="brand"><span className="brand-mark" aria-hidden="true">拾</span>校園拾光<span className="brand-sub">CAMPUS MOMENTS</span></a><nav aria-label="主要導覽"><a href={route('list')} aria-current={initialState === 'list' ? 'page' : undefined}>探索活動</a><a href={route('detail')}>本週精選</a></nav></header>
      <main id="main" tabIndex={-1}>
      {initialState === 'list' ? <>
        <section className="hero"><div><p className="eyebrow">LEARN. CONNECT. GROW.</p><h1>課堂之外，<br/>還有更多可能。</h1><p className={has('V01') ? 'intro low-contrast' : 'intro'} data-testid="intro">探索校園講座與工作坊，為這學期留下一段新的故事。</p><a className="primary" href="#events">尋找你的下一場活動 <span aria-hidden="true">↗</span></a></div><div className="hero-art" aria-hidden="true"><div className="orbit"/><span className="art-label">AUTUMN<br/>COLLECTION<br/>2026</span><div className="art-circle"/><span className="art-plus">✳</span><span className="art-note">每一次參與，都是新的起點。</span></div></section>
        <section id="events" aria-labelledby="events-title"><div className="section-heading"><div><p className="eyebrow">WHAT'S ON CAMPUS</p><h2 id="events-title">找到你的靈感現場</h2></div><span className="muted">本期 2 場活動</span></div>
          <div className="filters" aria-label="活動分類">{['全部活動','科技與設計','人文與生活'].map(cat => has('K01') && cat === '科技與設計' ? <div key={cat} role="button" tabIndex={0} aria-pressed={category === cat} className={`chip ${category === cat ? 'selected' : ''}`} data-testid="category-tech" onClick={() => setCategory(cat)}>{cat}</div> : <button key={cat} className={`chip ${category === cat ? 'selected' : ''}`} aria-pressed={category === cat} onClick={() => setCategory(cat)} data-testid={cat === '科技與設計' ? 'category-tech' : undefined}>{cat}</button>)}</div>
          <div className="cards">{category !== '人文與生活' && <article className="event-card"><div className="card-cover cover-green" aria-hidden="true"><span>DESIGN<br/>FOR EVERYONE.</span><span className="cover-shape">◎</span></div><div className="card-body"><div className="card-meta"><span className="tag">科技與設計</span><span>11.18 WED</span></div><h3><a data-testid="event-link" href={route('detail')}>讓每個人都能參與的網頁設計</a></h3><p>從鍵盤操作到資訊理解，一起探索更友善的數位體驗。</p><div className="card-bottom"><span>圖書館 201 教室 · 免費</span><button data-testid="save-event" className="icon-button" aria-label={has('N02') ? undefined : saved ? '取消收藏網頁設計活動' : '收藏網頁設計活動'} aria-pressed={saved} onClick={() => setSaved(!saved)}><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"/></svg></button></div></div></article>}
          {category !== '科技與設計' && <article className="event-card"><div className="card-cover cover-peach" aria-hidden="true"><span>A WALK<br/>TO REMEMBER.</span><span className="cover-shape">✳</span></div><div className="card-body"><div className="card-meta"><span className="tag">人文與生活</span><span>11.25 WED</span></div><h3>用散步重新認識校園</h3><p>跟著導覽員走進日常風景，發現熟悉地方的新故事。</p><div className="card-bottom"><span>校園中庭 · 免費</span><span className="muted">即將開放</span></div></div></article>}</div>
        </section>
      </> : initialState === 'detail' ? <>
        <div className="breadcrumb"><a href={route('list')}>探索活動</a><span aria-hidden="true">/</span><span>活動詳細資料</span></div>
        <section className="detail-heading"><span className="tag">科技與設計</span><h1>讓每個人都能參與<br/>的網頁設計</h1><p className="intro">好的設計，從理解不同使用者開始。</p></section>
        <div className="detail-grid"><article><h2>一起打造更友善的數位體驗</h2><p>這場工作坊將透過真實操作，帶你認識鍵盤導覽、表單標示與介面回饋。無須程式背景，歡迎帶著好奇心參加。</p><h2>抵達活動現場</h2><img className="venue-map" data-testid="venue-map" src="/venue.svg" alt={has('S01') ? '午餐菜單：咖哩飯與紅茶' : '從校園北門直走至圖書館，搭乘電梯至二樓 201 教室；無障礙入口位於圖書館東側。'}/>
          <button ref={guideOpener} className="secondary" data-testid="open-guide" onClick={() => setGuide(true)}>開啟場地導覽</button>
          {guide && <section className="guide" aria-labelledby="guide-title"><h3 id="guide-title">場地導覽</h3><div ref={guideRef} tabIndex={0} role="region" aria-label="場地導覽互動區" data-testid="guide-region" onKeyDown={e => {if (has('K03') && (e.key === 'Tab' || e.key === 'Escape')) e.preventDefault(); else if (e.key === 'Escape') {setGuide(false); guideOpener.current?.focus();}}}>圖書館東側入口 → 電梯 → 二樓 201 教室</div><button tabIndex={has('K03') ? -1 : 0} data-testid="close-guide" onClick={() => {setGuide(false); guideOpener.current?.focus();}}>關閉導覽</button></section>}
          <h2>活動流程</h2><div role="button" tabIndex={0} className="disclosure" data-testid="agenda-toggle" aria-expanded={expanded} aria-controls="agenda" onClick={() => setExpanded(!expanded)} onKeyDown={has('K02') ? undefined : e => activate(e, () => setExpanded(!expanded))}>查看完整活動流程 <span aria-hidden="true">{expanded ? '−' : '+'}</span></div><div id="agenda" hidden={!expanded}><ol><li>14:00 - 14:20 認識無障礙設計</li><li>14:20 - 15:20 體驗與實作</li><li>15:20 - 16:00 分享與討論</li></ol></div>
          <h2>參加前的三步確認</h2><div className="steps" data-testid="steps">{has('O02') ? [...stepButtons].reverse() : stepButtons}</div><p role="status">{stepMessage}</p>
          <h2>延伸資訊</h2><p><a href="#rules" data-testid="rules-link">{has('S02') ? '按此' : '閱讀活動退費與取消辦法'}</a></p><section id="rules"><h3>活動退費與取消辦法</h3><p>本活動免費。欲取消報名，請於活動前透過活動主辦窗口辦理。</p></section>
        </article><aside className="booking" aria-label="報名資訊"><p className="eyebrow">SAVE YOUR SEAT</p><h2>留一個位子給自己</h2><dl><dt>日期</dt><dd>2026 年 11 月 18 日（三）</dd><dt>時間</dt><dd>14:00 - 16:00</dd><dt>地點</dt><dd>圖書館 201 教室</dd><dt>費用</dt><dd>免費 · 共 30 個名額</dd></dl><a data-testid="enroll" className={`primary ${has('F01') ? 'no-focus' : ''}`} href={route('form-errors')}>前往報名 <span aria-hidden="true">↗</span></a><p className="small muted">使用模擬資料，不會寄送郵件或保留個資。</p></aside></div>
      </> : <>
        <div className="breadcrumb"><a href={route('list')}>探索活動</a><span aria-hidden="true">/</span><a href={route('detail')}>活動詳細資料</a><span aria-hidden="true">/</span><span>活動報名</span></div>
        <section className="form-heading"><p className="eyebrow">ONE STEP CLOSER</p><h1>把好奇心，帶到現場。</h1><p className="intro">讓每個人都能參與的網頁設計 · 11 月 18 日 14:00</p></section>
        <form noValidate onSubmit={submit} className="registration" aria-label="活動報名表單">
          <h2>填寫報名資料</h2><p className="muted">所有欄位皆為必填。請使用測試姓名與測試信箱。</p>
          {errors && <div className={`error-summary ${has('V03') ? 'faint-error' : ''}`} data-testid="error-summary"><strong>請確認報名資料</strong><p>填寫姓名、有效電子郵件，並勾選活動規範後，即可繼續。</p></div>}
          <div className="field"><span id="name-label" className="label">姓名</span><input ref={nameRef} id="name" data-testid="name" aria-labelledby={has('N01') ? undefined : 'name-label'} aria-required="true" aria-invalid={errors && !values.name.trim()} aria-describedby={errors && !values.name.trim() ? 'name-error' : undefined} autoComplete="off" value={values.name} onChange={e => setValues({...values,name:e.target.value})}/>{errors && !values.name.trim() && <p id="name-error" className="field-error">請填寫姓名。</p>}</div>
          <div className="field"><label htmlFor={has('N03') ? 'email-missing' : 'email'}>電子郵件</label><input ref={emailRef} id="email" data-testid="email" type="email" tabIndex={has('O01') ? 1 : undefined} autoComplete="off" aria-required="true" aria-invalid={errors && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)} aria-describedby="email-hint" value={values.email} onChange={e => setValues({...values,email:e.target.value})}/><p id="email-hint" data-testid="email-hint" className={`hint ${has('V02') ? 'low-contrast' : ''}`}>例如 student@example.test；此頁不會寄送郵件。</p></div>
          <div className="form-ending">
            {has('O03') && <button ref={opener} className="primary submit" data-testid="review" type="submit">檢查並確認報名 ↗</button>}
            <label className="consent"><input ref={consentRef} data-testid="consent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>我已閱讀活動規範，並同意以測試資料體驗報名流程。</label>
            {!has('O03') && <button ref={opener} className="primary submit" data-testid="review" type="submit">檢查並確認報名 ↗</button>}
          </div>
          <div data-testid="success" role={has('S03') ? undefined : 'status'} aria-live={has('S03') ? undefined : 'polite'} aria-atomic={has('S03') ? undefined : true} className={success ? 'success' : ''}>{success}</div>
        </form>
      </>}
      </main>
      <footer><span>校園拾光</span><span>Group40 · 軟體測試 · 模擬活動報名網站</span><span>讓參與，成為日常。</span></footer>
    </div>
    {isForm && dialog && <div className="modal-backdrop"><div ref={modal} role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description" data-testid="confirm-dialog" className="modal" onKeyDown={focusLoop}><p className="eyebrow">READY TO JOIN?</p><h2 ref={modalTitle} tabIndex={-1} id="dialog-title">確認你的報名資料</h2><p id="dialog-description">確認後將顯示報名成功訊息，這是模擬流程。</p><dl><dt>姓名</dt><dd>{values.name}</dd><dt>電子郵件</dt><dd>{values.email}</dd><dt>活動</dt><dd>讓每個人都能參與的網頁設計</dd></dl><div className="modal-actions"><button className="secondary" data-testid="dialog-cancel" onClick={closeDialog}>返回修改</button><button className="primary" data-testid="dialog-confirm" onClick={() => {closeDialog(); setSuccess('報名成功！你已取得 11 月 18 日活動的模擬席位。');}}>確認報名</button></div></div></div>}
  </>;
}
createRoot(document.getElementById('root')!).render(<App/>);
