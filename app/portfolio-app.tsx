"use client";

import { useEffect, useMemo, useState } from "react";

type View = "overview" | "ceo" | "finance" | "technology" | "cases";
type Filter = { year: string; entity: string; department: string };

const money = (value: number, compact = true) =>
  new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);

const entityFactor: Record<string, number> = {"All entities":1,"Real Estate":.46,Retail:.34,"Corporate Services":.2};
const yearFactor: Record<string, number> = {"2024":.88,"2025":.94,"2026":1};
const deptFactor: Record<string, number> = {"All departments":1,Finance:.28,Operations:.38,Technology:.18,Procurement:.16};
const base = {revenue:245_000_000,cost:98_000_000,profit:74_000_000,budget:93,saving:800_000,maturity:78};
const monthly = [16.2,17.4,18.1,18.8,19.7,20.4,20.1,21.3,21.8,22.6,23.1,25.5];
const colors = ["#30c7b5","#4f8df7","#d6af61","#8395ad"];

function Icon({name}:{name:string}) {
  const symbols:Record<string,string>={arrow:"↗",finance:"◒",reset:"↻",insight:"✦",back:"←",check:"✓"};
  return <span aria-hidden="true">{symbols[name]||"•"}</span>;
}

function Stat({label,value,note,tone="blue",onClick}:{label:string;value:string;note:string;tone?:string;onClick?:()=>void}) {
  const content=<><span className="stat-label">{label}</span><strong>{value}</strong><span className={`stat-note ${tone}`}>{note}</span></>;
  return onClick?<button className="stat interactive" onClick={onClick} aria-label={`Drill into ${label}`}>{content}<span className="drill">Drill down ↘</span></button>:<article className="stat">{content}</article>;
}

function Bars({labels,values,suffix="M"}:{labels:string[];values:number[];suffix?:string}) {
  const max=Math.max(...values);
  return <div className="bars" role="img" aria-label={`${labels.join(", ")} comparative bar chart`}>
    {labels.map((label,i)=><div className="bar-row" key={label}><span>{label}</span><div className="bar-track"><i style={{width:`${values[i]/max*100}%`,background:colors[i%colors.length]}}/></div><b>{values[i]}{suffix}</b></div>)}
  </div>;
}

function Trend({factor=1}:{factor?:number}) {
  const max=Math.max(...monthly);
  return <div className="trend" role="img" aria-label="Monthly revenue trend from January to December">
    {monthly.map((v,i)=><div className="trend-col" key={i}><span className="trend-value">{(v*factor).toFixed(1)}</span><i style={{height:`${v/max*100}%`}}/><small>{"JFMAMJJASOND"[i]}</small></div>)}
  </div>;
}

function DemoBadge(){return <span className="demo-badge"><i/> Fictional demo data</span>;}

function DashboardHeader({title,eyebrow,filters,setFilters}:{title:string;eyebrow:string;filters:Filter;setFilters:(f:Filter)=>void}) {
  return <><div className="dashboard-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div><div className="title-meta"><DemoBadge/><span>Updated 24 Jul 2026</span></div></div>
  <div className="filters" aria-label="Dashboard filters">
    <label>Year<select value={filters.year} onChange={e=>setFilters({...filters,year:e.target.value})}>{["2026","2025","2024"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Entity<select value={filters.entity} onChange={e=>setFilters({...filters,entity:e.target.value})}>{Object.keys(entityFactor).map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Department<select value={filters.department} onChange={e=>setFilters({...filters,department:e.target.value})}>{Object.keys(deptFactor).map(x=><option key={x}>{x}</option>)}</select></label>
    <button className="reset" onClick={()=>setFilters({year:"2026",entity:"All entities",department:"All departments"})}><Icon name="reset"/> Reset</button>
  </div></>;
}

type Lang = "en" | "ar";
const STR = {
  en: {
    brand: "Enterprise Transformation",
    nav: ["Overview", "Executive dashboard", "Finance", "Technology", "Case studies"],
    cta: "Explore dashboard",
    hero: {
      eyebrow: "Enterprise Applications Leader · Digital Transformation",
      h1a: "Turning enterprise complexity into ",
      h1em: "measurable business value.",
      p: "Executive technology leadership across ERP strategy, finance systems, decision intelligence, automation, and cost optimization—with 20+ years of cross-sector experience.",
      primary: "View executive dashboard",
      secondary: "Explore case studies",
      cred: [["20+", "years"], ["3", "business entities"], ["ERP", "to board insight"]],
    },
    console: {
      cockpit: "ENTERPRISE VALUE COCKPIT",
      index: "Transformation value index",
      mini: ["ERP adoption", "Automation", "License use"],
      signal: "Executive signal",
      signalText: "SAR 800K annual technology saving modeled",
    },
    about: {
      eyebrow: "About",
      h2: "Enterprise applications leader who builds, not just directs.",
      p: "Enterprise Applications and Development leader with 20+ years turning ERP, finance, and automation investments into measurable business value. Currently IT Applications Manager at Red Sea Markets Co. (Red Sea Mall), Jeddah — owning the full application landscape across a three-entity group: Yardi Voyager ERP, SharePoint, Power BI, and Microsoft 365. Hands-on from ERP configuration and SQL/Power BI reporting to SPFx/TypeScript development and AI-enabled automation. MBA (GPA 4.92/5) and PhD candidate researching AI adoption in digital transformation.",
    },
    value: {
      eyebrow: "Executive value architecture",
      h2: "From core systems to board-level decisions",
      p: "A leadership portfolio connecting technology investment to financial and operational outcomes.",
      cards: [
        ["01", "ERP Transformation", "Strategy, governance, implementation, integrations, adoption, and continuous optimization."],
        ["02", "Finance Systems", "GL, Chart of Accounts, dimensions, budgeting, forecasting, P&L, and controls."],
        ["03", "Decision Intelligence", "Executive KPI frameworks, Power BI thinking, automated reporting, and focused action."],
        ["04", "Cost Optimization", "SaaS rationalization, role-based licensing, consolidation, workflow automation, and ROI."],
      ],
    },
    featured: {
      eyebrow: "Interactive portfolio",
      h2: "Four lenses. One enterprise agenda.",
      link: "Open analytics suite →",
      cards: [
        ["CEO LENS", "Executive business dashboard", "Revenue, profitability, transformation progress, and drill-down decision support.", "Explore dashboard ↗"],
        ["CFO LENS", "Finance ERP knowledge", "Management P&L, COA hierarchy, budget variance, cost centers, and aging.", "Open finance view ↗"],
        ["CIO LENS", "Technology value", "Application portfolio, license utilization, savings pipeline, and ROI calculator.", "Open technology view ↗"],
      ],
    },
    expertise: {
      eyebrow: "Enterprise capabilities",
      h2: "Built at the intersection of business, finance, and technology",
      items: [
        ["ERP", "Yardi Voyager · Governance · Implementation · Optimization · Integration · Adoption"],
        ["Finance", "GL · Chart of Accounts · AP/AR concepts · Budgeting · Forecasting · P&L"],
        ["Analytics", "Power BI · KPI design · Data modeling · Executive reporting · Decision support"],
        ["Transformation", "SharePoint DMS · Workflow automation · Change · Vendors · Stakeholders"],
        ["Optimization", "SaaS rationalization · License utilization · Consolidation · ROI · Renewals"],
      ],
    },
    contact: {
      eyebrow: "Let’s connect",
      h2: "Building enterprise systems that leaders can trust.",
      email: "Email",
    },
    footer: {
      tag: "ERP · Enterprise Applications · Digital Transformation",
      disclaimer: "Portfolio data is fictional and for demonstration only. No confidential employer information is used.",
    },
  },
  ar: {
    brand: "التحول المؤسسي",
    nav: ["نظرة عامة", "اللوحة التنفيذية", "المالية", "التقنية", "دراسات الحالة"],
    cta: "استعرض اللوحة",
    hero: {
      eyebrow: "قائد تطبيقات المؤسسة · التحول الرقمي",
      h1a: "نحوّل تعقيد المؤسسة إلى ",
      h1em: "قيمة عملية قابلة للقياس.",
      p: "قيادة تقنية تنفيذية عبر استراتيجية أنظمة ERP، والأنظمة المالية، وذكاء القرار، والأتمتة، وتحسين التكاليف — بخبرة تتجاوز 20 عامًا عبر قطاعات متعددة.",
      primary: "عرض اللوحة التنفيذية",
      secondary: "استعرض دراسات الحالة",
      cred: [["+20", "سنة خبرة"], ["3", "كيانات تجارية"], ["ERP", "إلى رؤى المجلس"]],
    },
    console: {
      cockpit: "قمرة قيادة قيمة المؤسسة",
      index: "مؤشر قيمة التحول",
      mini: ["تبنّي ERP", "الأتمتة", "استخدام التراخيص"],
      signal: "إشارة تنفيذية",
      signalText: "توفير تقني سنوي مقدّر بنحو 800 ألف ريال",
    },
    about: {
      eyebrow: "نبذة",
      h2: "قائد تطبيقات مؤسسية يبني بنفسه، لا يوجّه فقط.",
      p: "قائد في تطبيقات المؤسسة والتطوير بخبرة تتجاوز 20 عامًا في تحويل استثمارات ERP والمالية والأتمتة إلى قيمة عملية قابلة للقياس. حاليًا مدير تطبيقات تقنية المعلومات في شركة أسواق البحر الأحمر (ريد سي مول) بجدة — مسؤول عن كامل منظومة التطبيقات عبر مجموعة من ثلاثة كيانات: نظام Yardi Voyager ERP، وSharePoint، وPower BI، وMicrosoft 365. عملي التنفيذ من إعداد ERP وتقارير SQL/Power BI إلى تطوير SPFx/TypeScript والأتمتة المدعومة بالذكاء الاصطناعي. حاصل على ماجستير إدارة الأعمال (معدل 4.92/5) ومرشّح لدرجة الدكتوراه في بحث تبنّي الذكاء الاصطناعي بالتحول الرقمي.",
    },
    value: {
      eyebrow: "بنية القيمة التنفيذية",
      h2: "من الأنظمة الأساسية إلى قرارات مجلس الإدارة",
      p: "محفظة قيادية تربط الاستثمار التقني بالنتائج المالية والتشغيلية.",
      cards: [
        ["01", "تحويل أنظمة ERP", "الاستراتيجية، والحوكمة، والتنفيذ، والتكامل، والتبنّي، والتحسين المستمر."],
        ["02", "الأنظمة المالية", "دفتر الأستاذ العام، وشجرة الحسابات، والأبعاد، والموازنة، والتنبؤ، وقوائم الأرباح والخسائر، والضوابط."],
        ["03", "ذكاء القرار", "أطر مؤشرات الأداء التنفيذية، وتفكير Power BI، والتقارير الآلية، والإجراءات المركّزة."],
        ["04", "تحسين التكاليف", "ترشيد SaaS، والترخيص حسب الدور، والدمج، وأتمتة سير العمل، والعائد على الاستثمار."],
      ],
    },
    featured: {
      eyebrow: "محفظة تفاعلية",
      h2: "أربع عدسات. أجندة مؤسسية واحدة.",
      link: "افتح جناح التحليلات ←",
      cards: [
        ["عدسة الرئيس التنفيذي", "لوحة الأعمال التنفيذية", "الإيرادات، والربحية، وتقدّم التحول، ودعم القرار بالتفصيل.", "استعرض اللوحة ↗"],
        ["عدسة المدير المالي", "معرفة ERP المالية", "قائمة الأرباح والخسائر الإدارية، وهيكل شجرة الحسابات، وانحراف الموازنة، ومراكز التكلفة، والأعمار.", "افتح العرض المالي ↗"],
        ["عدسة مدير التقنية", "قيمة التقنية", "محفظة التطبيقات، واستخدام التراخيص، وخط التوفير، وحاسبة العائد على الاستثمار.", "افتح عرض التقنية ↗"],
      ],
    },
    expertise: {
      eyebrow: "قدرات مؤسسية",
      h2: "مبنيّة عند تقاطع الأعمال والمالية والتقنية",
      items: [
        ["ERP", "Yardi Voyager · الحوكمة · التنفيذ · التحسين · التكامل · التبنّي"],
        ["المالية", "دفتر الأستاذ · شجرة الحسابات · مفاهيم المدينون/الدائنون · الموازنة · التنبؤ · الأرباح والخسائر"],
        ["التحليلات", "Power BI · تصميم المؤشرات · نمذجة البيانات · التقارير التنفيذية · دعم القرار"],
        ["التحول", "SharePoint DMS · أتمتة سير العمل · إدارة التغيير · المورّدون · أصحاب المصلحة"],
        ["التحسين", "ترشيد SaaS · استخدام التراخيص · الدمج · العائد على الاستثمار · التجديدات"],
      ],
    },
    contact: {
      eyebrow: "لنتواصل",
      h2: "نبني أنظمة مؤسسية يثق بها القادة.",
      email: "البريد",
    },
    footer: {
      tag: "ERP · تطبيقات المؤسسة · التحول الرقمي",
      disclaimer: "بيانات المحفظة افتراضية ولأغراض العرض فقط. لا تُستخدم أي معلومات سرّية لجهة العمل.",
    },
  },
} as const;

export default function PortfolioApp(){
  const [view,setView]=useState<View>("overview");
  const [menuOpen,setMenuOpen]=useState(false);
  const [filters,setFilters]=useState<Filter>({year:"2026",entity:"All entities",department:"All departments"});
  const [drill,setDrill]=useState<string[]>([]);
  const [calc,setCalc]=useState({licenses:320,cost:280,util:78,target:95,duplicate:240000,transition:180000});
  const factor=yearFactor[filters.year]*entityFactor[filters.entity]*deptFactor[filters.department];
  const metrics=useMemo(()=>({revenue:base.revenue*factor,cost:base.cost*factor,profit:base.profit*factor,saving:base.saving*Math.max(.35,factor),budget:Math.round(base.budget-(1-factor)*4),maturity:Math.round(base.maturity-(1-factor)*8)}),[factor]);
  const currentAnnual=calc.licenses*calc.cost*12+calc.duplicate;
  const optimizedLicenses=Math.ceil(calc.licenses*(calc.util/Math.max(calc.target,1)));
  const optimizedAnnual=optimizedLicenses*calc.cost*12;
  const annualSaving=Math.max(0,currentAnnual-optimizedAnnual);
  const firstYear=annualSaving-calc.transition, threeYear=annualSaving*3-calc.transition;
  const payback=annualSaving?calc.transition/annualSaving*12:0, roi=calc.transition?threeYear/calc.transition*100:0;
  const nav=(next:View)=>{setView(next);setMenuOpen(false);setDrill([]);window.scrollTo({top:0,behavior:"smooth"});};
  const [lang,setLang]=useState<Lang>("en");
  useEffect(()=>{
    const q=new URLSearchParams(window.location.search).get("lang");
    let stored:string|null=null; try{stored=localStorage.getItem("lang");}catch{}
    const init:Lang=q==="ar"||q==="en"?q:(stored==="ar"||stored==="en"?stored:"en");
    setLang(init);
  },[]);
  useEffect(()=>{
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==="ar"?"rtl":"ltr";
    try{localStorage.setItem("lang",lang);}catch{}
  },[lang]);
  const t=STR[lang];
  const toggleLang=()=>{
    const next:Lang=lang==="ar"?"en":"ar";
    setLang(next);
    try{const u=new URL(window.location.href);u.searchParams.set("lang",next);window.history.replaceState({},"",u);}catch{}
  };

  return <main>
    <header className="site-header">
      <button className="brand" onClick={()=>nav("overview")} aria-label="Ahmed Mahboub home"><span className="brand-mark">AM</span><span><b>Ahmed Mahboub</b><small>{t.brand}</small></span></button>
      <button className="menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>☰</button>
      <nav className={menuOpen?"open":""} aria-label="Primary navigation">
        {(["overview","ceo","finance","technology","cases"] as View[]).map((id,i)=><button key={id} onClick={()=>nav(id)} className={view===id?"active":""}>{t.nav[i]}</button>)}
      </nav>
      <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language" title="العربية / English">{lang==="ar"?"EN":"ع"}</button>
      <button className="header-cta" onClick={()=>nav("ceo")}>{t.cta} <Icon name="arrow"/></button>
    </header>

    {view==="overview"&&<>
      <section className="hero"><div className="hero-copy"><span className="eyebrow">{t.hero.eyebrow}</span><h1>{t.hero.h1a}<em>{t.hero.h1em}</em></h1><p>{t.hero.p}</p><div className="hero-actions"><button className="primary" onClick={()=>nav("ceo")}>{t.hero.primary} <Icon name="arrow"/></button><button className="secondary" onClick={()=>nav("cases")}>{t.hero.secondary}</button></div><div className="credentials">{t.hero.cred.map((c,i)=><span key={i}><b>{c[0]}</b> {c[1]}</span>)}</div></div>
      <div className="hero-console" aria-label="Executive value preview"><div className="console-head"><span>{t.console.cockpit}</span><DemoBadge/></div><div className="console-score"><span>{t.console.index}</span><b>78<small>/100</small></b></div><div className="mini-grid">{t.console.mini.map((l,i)=><div key={i}><small>{l}</small><b>{[86,78,95][i]}%</b><i style={{width:`${[86,78,95][i]}%`}}/></div>)}</div><div className="console-insight"><Icon name="insight"/><span><small>{t.console.signal}</small><b>{t.console.signalText}</b></span></div></div></section>
      <section className="section"><div className="section-heading"><span className="eyebrow">{t.about.eyebrow}</span><h2>{t.about.h2}</h2><p>{t.about.p}</p></div></section>
      <section className="section value-section"><div className="section-heading"><span className="eyebrow">{t.value.eyebrow}</span><h2>{t.value.h2}</h2><p>{t.value.p}</p></div><div className="value-grid">{t.value.cards.map(([n,ti,d])=><article className="value-card" key={n}><span>{n}</span><h3>{ti}</h3><p>{d}</p></article>)}</div></section>
      <section className="section featured"><div className="section-heading split"><div><span className="eyebrow">{t.featured.eyebrow}</span><h2>{t.featured.h2}</h2></div><button className="text-link" onClick={()=>nav("ceo")}>{t.featured.link}</button></div><div className="portfolio-grid"><button className="feature-card major" onClick={()=>nav("ceo")}><span>{t.featured.cards[0][0]}</span><h3>{t.featured.cards[0][1]}</h3><p>{t.featured.cards[0][2]}</p><div className="fake-chart"><i/><i/><i/><i/><i/><i/></div><b>{t.featured.cards[0][3]}</b></button><button className="feature-card" onClick={()=>nav("finance")}><span>{t.featured.cards[1][0]}</span><h3>{t.featured.cards[1][1]}</h3><p>{t.featured.cards[1][2]}</p><b>{t.featured.cards[1][3]}</b></button><button className="feature-card" onClick={()=>nav("technology")}><span>{t.featured.cards[2][0]}</span><h3>{t.featured.cards[2][1]}</h3><p>{t.featured.cards[2][2]}</p><b>{t.featured.cards[2][3]}</b></button></div></section>
      <section className="section expertise"><div className="section-heading"><span className="eyebrow">{t.expertise.eyebrow}</span><h2>{t.expertise.h2}</h2></div><div className="expertise-grid">{t.expertise.items.map(([ti,d])=><article key={ti}><h3>{ti}</h3><p>{d}</p></article>)}</div></section>
      <section className="contact"><div><span className="eyebrow">{t.contact.eyebrow}</span><h2>{t.contact.h2}</h2></div><div className="contact-links"><a href="mailto:mahboub80@gmail.com">{t.contact.email} <span>↗</span></a><a href="https://www.linkedin.com/in/eng-ahmed-mahboub-1a79191a" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a><a href="https://github.com/mahboubgs1" target="_blank" rel="noreferrer">GitHub <span>↗</span></a></div></section>
    </>}

    {view==="ceo"&&<section className="dashboard-shell"><DashboardHeader title="Enterprise Performance Cockpit" eyebrow="CEO & Board view" filters={filters} setFilters={setFilters}/>
      {drill.length>0&&<div className="breadcrumbs"><button onClick={()=>setDrill([])}><Icon name="back"/> Overview</button>{drill.map((x,i)=><span key={`${x}${i}`}>/ <button onClick={()=>setDrill(drill.slice(0,i+1))}>{x}</button></span>)}</div>}
      {drill.length===0?<><div className="stats-grid"><Stat label="Revenue" value={money(metrics.revenue)} note="+12.5% vs prior year" tone="teal" onClick={()=>setDrill(["Revenue","Business unit"])}/><Stat label="Operating cost" value={money(metrics.cost)} note="4.8% below budget" tone="teal" onClick={()=>setDrill(["Expense","Department"])}/><Stat label="Net profit" value={money(metrics.profit)} note="30.2% margin"/><Stat label="Technology saving" value={money(metrics.saving)} note="Recurring annual value" tone="gold"/><Stat label="Budget utilization" value={`${metrics.budget}%`} note="On plan"/><Stat label="Digital maturity" value={`${metrics.maturity}/100`} note="+9 points YoY" tone="teal"/></div>
      <div className="dashboard-grid"><article className="panel wide"><div className="panel-head"><div><span>PERFORMANCE TREND</span><h2>Revenue momentum</h2></div><b>SAR millions</b></div><Trend factor={factor}/></article><article className="panel"><div className="panel-head"><div><span>BUSINESS MIX</span><h2>Unit performance</h2></div></div><Bars labels={["Real Estate","Retail","Corporate"]} values={[112.7,83.3,49].map(v=>+(v*yearFactor[filters.year]).toFixed(1))}/></article><article className="panel"><div className="panel-head"><div><span>STRATEGIC DELIVERY</span><h2>Transformation progress</h2></div></div><div className="progress-list">{[["ERP optimization",86],["Finance automation",78],["Decision intelligence",72],["Digital workplace",81]].map(([l,v])=><div key={l as string}><span>{l}<b>{v}%</b></span><i><em style={{width:`${v}%`}}/></i></div>)}</div></article><article className="panel insight-panel"><div className="insight-icon"><Icon name="insight"/></div><div><span>RULES-BASED DEMONSTRATION INSIGHT</span><h2>{filters.department==="Technology"?"Prioritize low-use license renewal decisions.":metrics.budget<92?"Investigate negative budget variance in the selected scope.":"Scale automation into the next high-volume approval process."}</h2><p>Estimated impact: {money(metrics.saving*.34)} recurring annual value. Recommended next action: assign an executive owner and validate the opportunity within 30 days.</p></div></article></div></>:
      <article className="panel drill-panel"><div className="panel-head"><div><span>DRILL-DOWN · {drill.join(" / ")}</span><h2>{drill[0]} contribution analysis</h2></div><button className="secondary small" onClick={()=>setDrill([])}>Return to overview</button></div><Bars labels={drill[0]==="Revenue"?["Real Estate","Retail","Corporate Services"]:["Operations","Finance","Technology","Procurement"]} values={drill[0]==="Revenue"?[112.7,83.3,49]:[37.2,27.4,17.6,15.8]}/><div className="detail-table"><div><b>Selected level</b><span>{drill.at(-1)}</span></div><div><b>Primary driver</b><span>{drill[0]==="Revenue"?"Recurring operating income":"Application & service spend"}</span></div><div><b>Management action</b><span>Validate variance and owner</span></div></div>{drill.length<4&&<button className="primary" onClick={()=>setDrill([...drill,drill[0]==="Revenue"?(drill.length===2?"Operation":"Revenue category"):(drill.length===2?"Cost category":"Application / service")])}>Drill to next level ↓</button>}</article>}
    </section>}

    {view==="finance"&&<section className="dashboard-shell"><DashboardHeader title="Finance Systems & Performance" eyebrow="CFO & Finance view" filters={filters} setFilters={setFilters}/><div className="notice"><Icon name="finance"/><span><b>Management reporting demonstration.</b> This view illustrates finance ERP concepts; it is not an accounting system.</span></div><div className="stats-grid four"><Stat label="Revenue" value={money(metrics.revenue)} note="+6.5% vs budget" tone="teal"/><Stat label="Operating expenses" value={money(metrics.cost)} note="-6.7% vs budget" tone="teal"/><Stat label="EBITDA" value={money(metrics.revenue-metrics.cost)} note="42% margin"/><Stat label="Net profit" value={money(metrics.profit)} note="+13.8% vs budget" tone="gold"/></div>
      <div className="dashboard-grid"><article className="panel wide"><div className="panel-head"><div><span>ACTUAL · BUDGET · FORECAST</span><h2>Monthly performance</h2></div></div><Trend factor={factor}/></article><article className="panel"><div className="panel-head"><div><span>GENERAL LEDGER</span><h2>GL category summary</h2></div></div><Bars labels={["Revenue","Payroll","Occupancy","Technology"]} values={[245,38,31,14]}/></article><article className="panel coa"><div className="panel-head"><div><span>CHART OF ACCOUNTS</span><h2>Hierarchy model</h2></div></div><ul><li><b>1000 · Assets</b><ul><li>1100 Current assets</li><li>1200 Fixed assets</li></ul></li><li><b>4000 · Revenue</b><ul><li>4100 Operating revenue</li><li>4200 Service revenue</li></ul></li><li><b>5000 · Expenses</b><ul><li>5100 People</li><li>5400 Technology</li></ul></li></ul></article><article className="panel"><div className="panel-head"><div><span>COST CENTERS</span><h2>Budget variance</h2></div></div><Bars labels={["Operations","Finance","Technology","Procurement"]} values={[97,91,88,94]} suffix="%"/></article><article className="panel wide"><div className="panel-head"><div><span>WORKING CAPITAL</span><h2>AR / AP aging example</h2></div></div><div className="aging-grid">{["Current","1–30 days","31–60 days","61–90 days","90+ days"].map((x,i)=><div key={x}><span>{x}</span><b>{money([18.4,7.2,3.8,1.9,.8][i]*1_000_000)}</b><small>{[57,22,12,6,3][i]}%</small></div>)}</div></article></div>
    </section>}

    {view==="technology"&&<section className="dashboard-shell"><DashboardHeader title="Technology Value & Optimization" eyebrow="CIO & Investment view" filters={filters} setFilters={setFilters}/><div className="stats-grid four"><Stat label="Annual SaaS spend" value={money(2_400_000*factor)} note="From SAR 3.2M baseline"/><Stat label="License utilization" value="95%" note="Up from 78%" tone="teal"/><Stat label="Annual saving" value={money(metrics.saving)} note="Recurring value" tone="gold"/><Stat label="Automation coverage" value="78%" note="+14 points YoY" tone="teal"/></div>
      <div className="before-after"><div><span>BEFORE OPTIMIZATION</span><b>SAR 3.2M</b><p>22% unused licenses · 8 overlaps · 78% utilization</p></div><div className="value-arrow">→ <small>SAR 800K<br/>annual value</small></div><div><span>AFTER OPTIMIZATION</span><b>SAR 2.4M</b><p>5% unused licenses · 2 overlaps · 95% utilization</p></div></div>
      <div className="dashboard-grid"><article className="panel full"><div className="panel-head"><div><span>APPLICATION PORTFOLIO</span><h2>Value-based decisions</h2></div><DemoBadge/></div><div className="table-wrap"><table><thead><tr><th>Application</th><th>Category</th><th>Annual cost</th><th>Utilization</th><th>Business value</th><th>Recommendation</th></tr></thead><tbody>{[
        ["ERP Platform","Core ERP","SAR 1.1M","96%","High","Keep / optimize"],["Collaboration Hub","Collaboration","SAR 420K","91%","High","Keep"],["Reporting Tool A","Analytics","SAR 310K","43%","Medium","Consolidate"],["Workflow Tool B","Automation","SAR 190K","31%","Low","Retire"],["Document Platform","Content","SAR 380K","84%","High","Optimize"]
      ].map(row=><tr key={row[0]}>{row.map((c,i)=><td key={c}>{i===5?<span className={`recommend ${c.includes("Retire")?"red":c.includes("Consolidate")?"gold":"teal"}`}>{c}</span>:c}</td>)}</tr>)}</tbody></table></div></article>
      <article className="panel calculator full"><div className="panel-head"><div><span>DECISION TOOL</span><h2>Subscription savings & ROI calculator</h2></div><b>Fictional assumptions</b></div><div className="calc-layout"><div className="calc-inputs">{([["licenses","Number of licenses",1],["cost","Cost per license / month",10],["util","Current utilization %",1],["target","Target utilization %",1],["duplicate","Duplicate tool annual cost",10000],["transition","One-time transition cost",10000]] as [keyof typeof calc,string,number][]).map(([key,label,step])=><label key={key}>{label}<input type="number" min="0" step={step} value={calc[key]} onChange={e=>setCalc({...calc,[key]:Math.max(0,Number(e.target.value))})}/></label>)}</div><div className="calc-results"><div><span>Current annual cost</span><b>{money(currentAnnual,false)}</b></div><div><span>Optimized annual cost</span><b>{money(optimizedAnnual,false)}</b></div><div className="highlight"><span>Annual recurring saving</span><b>{money(annualSaving,false)}</b></div><div><span>First-year net saving</span><b>{money(firstYear,false)}</b></div><div><span>Three-year net saving</span><b>{money(threeYear,false)}</b></div><div><span>Payback period</span><b>{payback.toFixed(1)} months</b></div><div><span>Three-year ROI</span><b>{roi.toFixed(0)}%</b></div><p>Assumes unused licenses can be removed at renewal and duplicate tool cost is fully avoided. Transition cost is incurred once.</p></div></div></article>
      <article className="panel insight-panel full"><div className="insight-icon"><Icon name="insight"/></div><div><span>RULES-BASED DEMONSTRATION INSIGHT</span><h2>{calc.util<70?"License utilization requires immediate intervention.":calc.duplicate>200000?"Consolidate overlapping tools before the next renewal cycle.":"Prioritize role-based license right-sizing."}</h2><p>Estimated three-year impact: {money(threeYear)}. Next action: validate assigned users, usage telemetry, contractual notice dates, and transition dependencies.</p></div></article></div>
    </section>}

    {view==="cases"&&<section className="case-shell"><div className="case-intro"><span className="eyebrow">Executive case studies</span><h1>Transformation frameworks designed for enterprise reality.</h1><p>Concise examples of leadership approach and systems thinking. Outcomes are illustrative unless explicitly stated.</p><DemoBadge/></div><div className="case-grid">{[
      ["01","ERP Transformation","Standardize processes while preserving business continuity.","Finance · Leasing · Procurement · Reporting · Integration",["Define executive governance and decision rights","Align process owners to the ERP operating model","Sequence adoption, integrations, data, and controls","Establish a continuous-improvement backlog"],"Illustrative outcome: stronger governance, clearer reporting, and scalable adoption."],
      ["02","Finance Transformation","Connect the Chart of Accounts to better management decisions.","GL · Dimensions · Cost Centers · Budget · Forecast",["Map COA design to management reporting needs","Standardize financial dimensions and ownership","Connect actual, budget, forecast, and P&L views","Strengthen access, controls, and audit support"],"Illustrative outcome: a common financial language and faster variance action."],
      ["03","Technology Cost Optimization","Turn recurring technology spend into a governed value portfolio.","Inventory · Usage · Licensing · Consolidation · Renewals",["Create a defensible subscription inventory","Compare utilization with role and business value","Consolidate overlapping capabilities","Track recurring savings and renewal decisions"],"Illustrative outcome: SAR 800K modeled annual saving using fictional data."],
      ["04","Digital Transformation","Replace fragmented manual work with governed digital flow.","SharePoint DMS · Approvals · Reporting · Integration",["Design document taxonomy and ownership","Digitize high-volume approval journeys","Automate reporting and exception visibility","Lead change, adoption, and service improvement"],"Illustrative outcome: better traceability, shorter cycle time, and stronger adoption."]
    ].map(([n,t,lead,tags,steps,outcome])=><article className="case-card" key={n as string}><span className="case-number">{n}</span><h2>{t}</h2><p className="case-lead">{lead}</p><small>{tags}</small><ol>{(steps as string[]).map(x=><li key={x}><Icon name="check"/>{x}</li>)}</ol><p className="outcome">{outcome}</p></article>)}</div><div className="case-cta"><div><span className="eyebrow">See the thinking in action</span><h2>Explore the interactive executive analytics suite.</h2></div><button className="primary" onClick={()=>nav("ceo")}>Open executive dashboard <Icon name="arrow"/></button></div></section>}

    <footer><div><b>Ahmed Mahboub</b><span>{t.footer.tag}</span></div><p>{t.footer.disclaimer}</p><span>© 2026</span></footer>
  </main>;
}
