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

function Stat({label,value,note,tone="blue",onClick,drill="Drill down ↘"}:{label:string;value:string;note:string;tone?:string;onClick?:()=>void;drill?:string}) {
  const content=<><span className="stat-label">{label}</span><strong>{value}</strong><span className={`stat-note ${tone}`}>{note}</span></>;
  return onClick?<button className="stat interactive" onClick={onClick} aria-label={`Drill into ${label}`}>{content}<span className="drill">{drill}</span></button>:<article className="stat">{content}</article>;
}

function Bars({labels,values,suffix="M"}:{labels:readonly string[];values:number[];suffix?:string}) {
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

function DemoBadge({label="Fictional demo data"}:{label?:string}){return <span className="demo-badge"><i/> {label}</span>;}

function DashboardHeader({title,eyebrow,filters,setFilters,d,tr}:{title:string;eyebrow:string;filters:Filter;setFilters:(f:Filter)=>void;d:{year:string;entity:string;department:string;reset:string;updated:string;demo:string};tr:(x:string)=>string}) {
  return <><div className="dashboard-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div><div className="title-meta"><DemoBadge label={d.demo}/><span>{d.updated}</span></div></div>
  <div className="filters" aria-label="Dashboard filters">
    <label>{d.year}<select value={filters.year} onChange={e=>setFilters({...filters,year:e.target.value})}>{["2026","2025","2024"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>{d.entity}<select value={filters.entity} onChange={e=>setFilters({...filters,entity:e.target.value})}>{Object.keys(entityFactor).map(x=><option key={x} value={x}>{tr(x)}</option>)}</select></label>
    <label>{d.department}<select value={filters.department} onChange={e=>setFilters({...filters,department:e.target.value})}>{Object.keys(deptFactor).map(x=><option key={x} value={x}>{tr(x)}</option>)}</select></label>
    <button className="reset" onClick={()=>setFilters({year:"2026",entity:"All entities",department:"All departments"})}><Icon name="reset"/> {d.reset}</button>
  </div></>;
}

type Lang = "en" | "ar";
const AR_MAP: Record<string, string> = {
  "All entities": "كل الكيانات", "Real Estate": "العقارات", Retail: "التجزئة", "Corporate Services": "الخدمات المؤسسية",
  "All departments": "كل الإدارات", Finance: "المالية", Operations: "العمليات", Technology: "التقنية", Procurement: "المشتريات",
  Revenue: "الإيرادات", Expense: "المصروفات", "Business unit": "وحدة الأعمال", Department: "الإدارة",
  Operation: "العملية", "Revenue category": "فئة الإيرادات", "Cost category": "فئة التكلفة", "Application / service": "التطبيق / الخدمة",
};
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
    dash: {
      updated: "Updated 24 Jul 2026", year: "Year", entity: "Entity", department: "Department", reset: "Reset",
      demo: "Fictional demo data", drill: "Drill down ↘",
    },
    ceo: {
      title: "Enterprise Performance Cockpit", eyebrow: "CEO & Board view",
      stats: { revenue: ["Revenue", "+12.5% vs prior year"], cost: ["Operating cost", "4.8% below budget"], profit: ["Net profit", "30.2% margin"], saving: ["Technology saving", "Recurring annual value"], budget: ["Budget utilization", "On plan"], maturity: ["Digital maturity", "+9 points YoY"] },
      back: "Overview",
      trend: ["PERFORMANCE TREND", "Revenue momentum", "SAR millions"],
      mix: ["BUSINESS MIX", "Unit performance"], mixLabels: ["Real Estate", "Retail", "Corporate"],
      delivery: ["STRATEGIC DELIVERY", "Transformation progress"],
      progress: ["ERP optimization", "Finance automation", "Decision intelligence", "Digital workplace"],
      insightHead: "RULES-BASED DEMONSTRATION INSIGHT",
      insightTech: "Prioritize low-use license renewal decisions.",
      insightVar: "Investigate negative budget variance in the selected scope.",
      insightScale: "Scale automation into the next high-volume approval process.",
      impactA: "Estimated impact: ", impactB: " recurring annual value. Recommended next action: assign an executive owner and validate the opportunity within 30 days.",
      drillTag: "DRILL-DOWN", contribution: "{x} contribution analysis", ret: "Return to overview",
      selLevel: "Selected level", driver: "Primary driver", driverRev: "Recurring operating income", driverCost: "Application & service spend",
      mgmtAction: "Management action", mgmtText: "Validate variance and owner", next: "Drill to next level ↓",
    },
    finance: {
      title: "Finance Systems & Performance", eyebrow: "CFO & Finance view",
      noticeB: "Management reporting demonstration.", notice: "This view illustrates finance ERP concepts; it is not an accounting system.",
      stats: [["Revenue", "+6.5% vs budget"], ["Operating expenses", "-6.7% vs budget"], ["EBITDA", "42% margin"], ["Net profit", "+13.8% vs budget"]],
      monthly: ["ACTUAL · BUDGET · FORECAST", "Monthly performance"],
      gl: ["GENERAL LEDGER", "GL category summary"], glLabels: ["Revenue", "Payroll", "Occupancy", "Technology"],
      coa: ["CHART OF ACCOUNTS", "Hierarchy model"],
      coaTree: [["1000 · Assets", ["1100 Current assets", "1200 Fixed assets"]], ["4000 · Revenue", ["4100 Operating revenue", "4200 Service revenue"]], ["5000 · Expenses", ["5100 People", "5400 Technology"]]],
      cc: ["COST CENTERS", "Budget variance"], ccLabels: ["Operations", "Finance", "Technology", "Procurement"],
      wc: ["WORKING CAPITAL", "AR / AP aging example"], aging: ["Current", "1–30 days", "31–60 days", "61–90 days", "90+ days"],
    },
    technology: {
      title: "Technology Value & Optimization", eyebrow: "CIO & Investment view",
      stats: [["Annual SaaS spend", "From SAR 3.2M baseline"], ["License utilization", "Up from 78%"], ["Annual saving", "Recurring value"], ["Automation coverage", "+14 points YoY"]],
      before: ["BEFORE OPTIMIZATION", "22% unused licenses · 8 overlaps · 78% utilization"], beforeVal: "SAR 3.2M",
      arrow: ["SAR 800K", "annual value"],
      after: ["AFTER OPTIMIZATION", "5% unused licenses · 2 overlaps · 95% utilization"], afterVal: "SAR 2.4M",
      portfolio: ["APPLICATION PORTFOLIO", "Value-based decisions"],
      tableHead: ["Application", "Category", "Annual cost", "Utilization", "Business value", "Recommendation"],
      rows: [["ERP Platform", "Core ERP", "SAR 1.1M", "96%", "High", "Keep / optimize", "teal"], ["Collaboration Hub", "Collaboration", "SAR 420K", "91%", "High", "Keep", "teal"], ["Reporting Tool A", "Analytics", "SAR 310K", "43%", "Medium", "Consolidate", "gold"], ["Workflow Tool B", "Automation", "SAR 190K", "31%", "Low", "Retire", "red"], ["Document Platform", "Content", "SAR 380K", "84%", "High", "Optimize", "teal"]],
      calc: ["DECISION TOOL", "Subscription savings & ROI calculator", "Fictional assumptions"],
      calcLabels: ["Number of licenses", "Cost per license / month", "Current utilization %", "Target utilization %", "Duplicate tool annual cost", "One-time transition cost"],
      res: ["Current annual cost", "Optimized annual cost", "Annual recurring saving", "First-year net saving", "Three-year net saving", "Payback period", "Three-year ROI"],
      months: " months",
      assume: "Assumes unused licenses can be removed at renewal and duplicate tool cost is fully avoided. Transition cost is incurred once.",
      insightHead: "RULES-BASED DEMONSTRATION INSIGHT",
      insightUtil: "License utilization requires immediate intervention.",
      insightDup: "Consolidate overlapping tools before the next renewal cycle.",
      insightRole: "Prioritize role-based license right-sizing.",
      impactA: "Estimated three-year impact: ", impactB: ". Next action: validate assigned users, usage telemetry, contractual notice dates, and transition dependencies.",
    },
    cases: {
      eyebrow: "Executive case studies", h1: "Transformation frameworks designed for enterprise reality.",
      p: "Concise examples of leadership approach and systems thinking. Outcomes are illustrative unless explicitly stated.",
      items: [
        ["01", "ERP Transformation", "Standardize processes while preserving business continuity.", "Finance · Leasing · Procurement · Reporting · Integration", ["Define executive governance and decision rights", "Align process owners to the ERP operating model", "Sequence adoption, integrations, data, and controls", "Establish a continuous-improvement backlog"], "Illustrative outcome: stronger governance, clearer reporting, and scalable adoption."],
        ["02", "Finance Transformation", "Connect the Chart of Accounts to better management decisions.", "GL · Dimensions · Cost Centers · Budget · Forecast", ["Map COA design to management reporting needs", "Standardize financial dimensions and ownership", "Connect actual, budget, forecast, and P&L views", "Strengthen access, controls, and audit support"], "Illustrative outcome: a common financial language and faster variance action."],
        ["03", "Technology Cost Optimization", "Turn recurring technology spend into a governed value portfolio.", "Inventory · Usage · Licensing · Consolidation · Renewals", ["Create a defensible subscription inventory", "Compare utilization with role and business value", "Consolidate overlapping capabilities", "Track recurring savings and renewal decisions"], "Illustrative outcome: SAR 800K modeled annual saving using fictional data."],
        ["04", "Digital Transformation", "Replace fragmented manual work with governed digital flow.", "SharePoint DMS · Approvals · Reporting · Integration", ["Design document taxonomy and ownership", "Digitize high-volume approval journeys", "Automate reporting and exception visibility", "Lead change, adoption, and service improvement"], "Illustrative outcome: better traceability, shorter cycle time, and stronger adoption."],
      ],
      ctaEyebrow: "See the thinking in action", ctaH2: "Explore the interactive executive analytics suite.", ctaBtn: "Open executive dashboard",
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
    dash: {
      updated: "تحديث 24 يوليو 2026", year: "السنة", entity: "الكيان", department: "الإدارة", reset: "إعادة ضبط",
      demo: "بيانات توضيحية افتراضية", drill: "استعراض تفصيلي ↘",
    },
    ceo: {
      title: "قمرة قيادة الأداء المؤسسي", eyebrow: "عرض الرئيس التنفيذي والمجلس",
      stats: { revenue: ["الإيرادات", "‏+12.5% مقارنة بالعام السابق"], cost: ["التكلفة التشغيلية", "أقل من الموازنة بنسبة 4.8%"], profit: ["صافي الربح", "هامش 30.2%"], saving: ["التوفير التقني", "قيمة سنوية متكررة"], budget: ["استخدام الموازنة", "وفق الخطة"], maturity: ["النضج الرقمي", "‏+9 نقاط سنويًا"] },
      back: "نظرة عامة",
      trend: ["اتجاه الأداء", "زخم الإيرادات", "بملايين الريالات"],
      mix: ["مزيج الأعمال", "أداء الوحدات"], mixLabels: ["العقارات", "التجزئة", "الشركات"],
      delivery: ["التنفيذ الاستراتيجي", "تقدّم التحول"],
      progress: ["تحسين ERP", "أتمتة المالية", "ذكاء القرار", "بيئة العمل الرقمية"],
      insightHead: "رؤية توضيحية مبنية على قواعد",
      insightTech: "أولوية لقرارات تجديد التراخيص منخفضة الاستخدام.",
      insightVar: "افحص الانحراف السلبي للموازنة في النطاق المحدد.",
      insightScale: "وسّع الأتمتة إلى عملية الاعتماد التالية عالية الحجم.",
      impactA: "الأثر المقدّر: ", impactB: " قيمة سنوية متكررة. الإجراء الموصى به: تعيين مالك تنفيذي والتحقق من الفرصة خلال 30 يومًا.",
      drillTag: "تفصيل", contribution: "تحليل مساهمة {x}", ret: "العودة إلى النظرة العامة",
      selLevel: "المستوى المحدد", driver: "المحرّك الرئيسي", driverRev: "دخل تشغيلي متكرر", driverCost: "إنفاق التطبيقات والخدمات",
      mgmtAction: "إجراء إداري", mgmtText: "التحقق من الانحراف والمالك", next: "انتقل إلى المستوى التالي ↓",
    },
    finance: {
      title: "الأنظمة المالية والأداء", eyebrow: "عرض المدير المالي",
      noticeB: "عرض توضيحي للتقارير الإدارية.", notice: "يوضح هذا العرض مفاهيم ERP المالية، وليس نظامًا محاسبيًا.",
      stats: [["الإيرادات", "‏+6.5% مقابل الموازنة"], ["المصروفات التشغيلية", "‏-6.7% مقابل الموازنة"], ["EBITDA", "هامش 42%"], ["صافي الربح", "‏+13.8% مقابل الموازنة"]],
      monthly: ["فعلي · موازنة · تنبؤ", "الأداء الشهري"],
      gl: ["دفتر الأستاذ العام", "ملخص فئات دفتر الأستاذ"], glLabels: ["الإيرادات", "الرواتب", "الإشغال", "التقنية"],
      coa: ["شجرة الحسابات", "النموذج الهرمي"],
      coaTree: [["1000 · الأصول", ["1100 أصول متداولة", "1200 أصول ثابتة"]], ["4000 · الإيرادات", ["4100 إيرادات تشغيلية", "4200 إيرادات خدمات"]], ["5000 · المصروفات", ["5100 الموارد البشرية", "5400 التقنية"]]],
      cc: ["مراكز التكلفة", "انحراف الموازنة"], ccLabels: ["العمليات", "المالية", "التقنية", "المشتريات"],
      wc: ["رأس المال العامل", "مثال أعمار الذمم المدينة / الدائنة"], aging: ["حالي", "1–30 يومًا", "31–60 يومًا", "61–90 يومًا", "أكثر من 90 يومًا"],
    },
    technology: {
      title: "قيمة التقنية والتحسين", eyebrow: "عرض مدير التقنية والاستثمار",
      stats: [["الإنفاق السنوي على SaaS", "من أساس 3.2 مليون ريال"], ["استخدام التراخيص", "ارتفاعًا من 78%"], ["التوفير السنوي", "قيمة متكررة"], ["تغطية الأتمتة", "‏+14 نقطة سنويًا"]],
      before: ["قبل التحسين", "22% تراخيص غير مستخدمة · 8 تداخلات · استخدام 78%"], beforeVal: "3.2 مليون ريال",
      arrow: ["800 ألف ريال", "قيمة سنوية"],
      after: ["بعد التحسين", "5% تراخيص غير مستخدمة · تداخلان · استخدام 95%"], afterVal: "2.4 مليون ريال",
      portfolio: ["محفظة التطبيقات", "قرارات مبنية على القيمة"],
      tableHead: ["التطبيق", "الفئة", "التكلفة السنوية", "الاستخدام", "قيمة الأعمال", "التوصية"],
      rows: [["منصة ERP", "ERP أساسي", "1.1 مليون ريال", "96%", "مرتفعة", "إبقاء / تحسين", "teal"], ["مركز التعاون", "التعاون", "420 ألف ريال", "91%", "مرتفعة", "إبقاء", "teal"], ["أداة تقارير أ", "التحليلات", "310 آلاف ريال", "43%", "متوسطة", "دمج", "gold"], ["أداة سير عمل ب", "الأتمتة", "190 ألف ريال", "31%", "منخفضة", "استبعاد", "red"], ["منصة المستندات", "المحتوى", "380 ألف ريال", "84%", "مرتفعة", "تحسين", "teal"]],
      calc: ["أداة قرار", "حاسبة توفير الاشتراكات والعائد على الاستثمار", "افتراضات توضيحية"],
      calcLabels: ["عدد التراخيص", "تكلفة الترخيص شهريًا", "نسبة الاستخدام الحالية %", "نسبة الاستخدام المستهدفة %", "التكلفة السنوية للأداة المكررة", "تكلفة انتقال لمرة واحدة"],
      res: ["التكلفة السنوية الحالية", "التكلفة السنوية بعد التحسين", "التوفير السنوي المتكرر", "صافي توفير السنة الأولى", "صافي توفير ثلاث سنوات", "فترة الاسترداد", "العائد على الاستثمار لثلاث سنوات"],
      months: " شهرًا",
      assume: "يفترض إمكانية إلغاء التراخيص غير المستخدمة عند التجديد وتجنّب تكلفة الأداة المكررة بالكامل. تُحتسب تكلفة الانتقال مرة واحدة.",
      insightHead: "رؤية توضيحية مبنية على قواعد",
      insightUtil: "استخدام التراخيص يتطلب تدخلًا فوريًا.",
      insightDup: "ادمج الأدوات المتداخلة قبل دورة التجديد القادمة.",
      insightRole: "أولوية لضبط أعداد التراخيص حسب الدور.",
      impactA: "الأثر المقدّر لثلاث سنوات: ", impactB: ". الإجراء التالي: التحقق من المستخدمين المعيّنين وبيانات الاستخدام وتواريخ الإشعار التعاقدية وتبعيات الانتقال.",
    },
    cases: {
      eyebrow: "دراسات حالة تنفيذية", h1: "أطر تحول مصممة لواقع المؤسسات.",
      p: "أمثلة موجزة على المنهج القيادي والتفكير المنظومي. النتائج توضيحية ما لم يُذكر خلاف ذلك.",
      items: [
        ["01", "تحويل أنظمة ERP", "توحيد العمليات مع الحفاظ على استمرارية الأعمال.", "المالية · التأجير · المشتريات · التقارير · التكامل", ["تحديد الحوكمة التنفيذية وصلاحيات القرار", "مواءمة ملّاك العمليات مع نموذج تشغيل ERP", "تسلسل التبنّي والتكاملات والبيانات والضوابط", "إنشاء سجل تحسين مستمر"], "نتيجة توضيحية: حوكمة أقوى وتقارير أوضح وتبنٍّ قابل للتوسع."],
        ["02", "التحول المالي", "ربط شجرة الحسابات بقرارات إدارية أفضل.", "دفتر الأستاذ · الأبعاد · مراكز التكلفة · الموازنة · التنبؤ", ["مواءمة تصميم شجرة الحسابات مع احتياجات التقارير الإدارية", "توحيد الأبعاد المالية وملكيتها", "ربط الفعلي والموازنة والتنبؤ وقوائم الأرباح والخسائر", "تعزيز الصلاحيات والضوابط ودعم التدقيق"], "نتيجة توضيحية: لغة مالية موحّدة وتحرّك أسرع تجاه الانحرافات."],
        ["03", "تحسين التكاليف التقنية", "تحويل الإنفاق التقني المتكرر إلى محفظة قيمة محوكمة.", "الجرد · الاستخدام · الترخيص · الدمج · التجديدات", ["إنشاء جرد اشتراكات موثوق", "مقارنة الاستخدام بالدور وقيمة الأعمال", "دمج القدرات المتداخلة", "تتبّع التوفير المتكرر وقرارات التجديد"], "نتيجة توضيحية: توفير سنوي مقدّر بنحو 800 ألف ريال باستخدام بيانات افتراضية."],
        ["04", "التحول الرقمي", "استبدال العمل اليدوي المجزأ بتدفق رقمي محوكم.", "SharePoint DMS · الاعتمادات · التقارير · التكامل", ["تصميم تصنيف المستندات وملكيتها", "رقمنة رحلات الاعتماد عالية الحجم", "أتمتة التقارير وإظهار الاستثناءات", "قيادة التغيير والتبنّي وتحسين الخدمة"], "نتيجة توضيحية: تتبّع أفضل وزمن دورة أقصر وتبنٍّ أقوى."],
      ],
      ctaEyebrow: "شاهد الفكر مطبقًا", ctaH2: "استكشف جناح التحليلات التنفيذية التفاعلي.", ctaBtn: "افتح اللوحة التنفيذية",
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
  const tr=(x:string)=>lang==="ar"?(AR_MAP[x]??x):x;
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
      <div className="hero-console" aria-label="Executive value preview"><div className="console-head"><span>{t.console.cockpit}</span><DemoBadge label={t.dash.demo}/></div><div className="console-score"><span>{t.console.index}</span><b>78<small>/100</small></b></div><div className="mini-grid">{t.console.mini.map((l,i)=><div key={i}><small>{l}</small><b>{[86,78,95][i]}%</b><i style={{width:`${[86,78,95][i]}%`}}/></div>)}</div><div className="console-insight"><Icon name="insight"/><span><small>{t.console.signal}</small><b>{t.console.signalText}</b></span></div></div></section>
      <section className="section"><div className="section-heading"><span className="eyebrow">{t.about.eyebrow}</span><h2>{t.about.h2}</h2><p>{t.about.p}</p></div></section>
      <section className="section value-section"><div className="section-heading"><span className="eyebrow">{t.value.eyebrow}</span><h2>{t.value.h2}</h2><p>{t.value.p}</p></div><div className="value-grid">{t.value.cards.map(([n,ti,d])=><article className="value-card" key={n}><span>{n}</span><h3>{ti}</h3><p>{d}</p></article>)}</div></section>
      <section className="section featured"><div className="section-heading split"><div><span className="eyebrow">{t.featured.eyebrow}</span><h2>{t.featured.h2}</h2></div><button className="text-link" onClick={()=>nav("ceo")}>{t.featured.link}</button></div><div className="portfolio-grid"><button className="feature-card major" onClick={()=>nav("ceo")}><span>{t.featured.cards[0][0]}</span><h3>{t.featured.cards[0][1]}</h3><p>{t.featured.cards[0][2]}</p><div className="fake-chart"><i/><i/><i/><i/><i/><i/></div><b>{t.featured.cards[0][3]}</b></button><button className="feature-card" onClick={()=>nav("finance")}><span>{t.featured.cards[1][0]}</span><h3>{t.featured.cards[1][1]}</h3><p>{t.featured.cards[1][2]}</p><b>{t.featured.cards[1][3]}</b></button><button className="feature-card" onClick={()=>nav("technology")}><span>{t.featured.cards[2][0]}</span><h3>{t.featured.cards[2][1]}</h3><p>{t.featured.cards[2][2]}</p><b>{t.featured.cards[2][3]}</b></button></div></section>
      <section className="section expertise"><div className="section-heading"><span className="eyebrow">{t.expertise.eyebrow}</span><h2>{t.expertise.h2}</h2></div><div className="expertise-grid">{t.expertise.items.map(([ti,d])=><article key={ti}><h3>{ti}</h3><p>{d}</p></article>)}</div></section>
      <section className="contact"><div><span className="eyebrow">{t.contact.eyebrow}</span><h2>{t.contact.h2}</h2></div><div className="contact-links"><a href="mailto:mahboub80@gmail.com">{t.contact.email} <span>↗</span></a><a href="https://www.linkedin.com/in/eng-ahmed-mahboub-1a79191a" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a><a href="https://github.com/mahboubgs1" target="_blank" rel="noreferrer">GitHub <span>↗</span></a></div></section>
    </>}

    {view==="ceo"&&<section className="dashboard-shell"><DashboardHeader title={t.ceo.title} eyebrow={t.ceo.eyebrow} filters={filters} setFilters={setFilters} d={t.dash} tr={tr}/>
      {drill.length>0&&<div className="breadcrumbs"><button onClick={()=>setDrill([])}><Icon name="back"/> {t.ceo.back}</button>{drill.map((x,i)=><span key={`${x}${i}`}>/ <button onClick={()=>setDrill(drill.slice(0,i+1))}>{tr(x)}</button></span>)}</div>}
      {drill.length===0?<><div className="stats-grid"><Stat label={t.ceo.stats.revenue[0]} value={money(metrics.revenue)} note={t.ceo.stats.revenue[1]} tone="teal" drill={t.dash.drill} onClick={()=>setDrill(["Revenue","Business unit"])}/><Stat label={t.ceo.stats.cost[0]} value={money(metrics.cost)} note={t.ceo.stats.cost[1]} tone="teal" drill={t.dash.drill} onClick={()=>setDrill(["Expense","Department"])}/><Stat label={t.ceo.stats.profit[0]} value={money(metrics.profit)} note={t.ceo.stats.profit[1]}/><Stat label={t.ceo.stats.saving[0]} value={money(metrics.saving)} note={t.ceo.stats.saving[1]} tone="gold"/><Stat label={t.ceo.stats.budget[0]} value={`${metrics.budget}%`} note={t.ceo.stats.budget[1]}/><Stat label={t.ceo.stats.maturity[0]} value={`${metrics.maturity}/100`} note={t.ceo.stats.maturity[1]} tone="teal"/></div>
      <div className="dashboard-grid"><article className="panel wide"><div className="panel-head"><div><span>{t.ceo.trend[0]}</span><h2>{t.ceo.trend[1]}</h2></div><b>{t.ceo.trend[2]}</b></div><Trend factor={factor}/></article><article className="panel"><div className="panel-head"><div><span>{t.ceo.mix[0]}</span><h2>{t.ceo.mix[1]}</h2></div></div><Bars labels={t.ceo.mixLabels} values={[112.7,83.3,49].map(v=>+(v*yearFactor[filters.year]).toFixed(1))}/></article><article className="panel"><div className="panel-head"><div><span>{t.ceo.delivery[0]}</span><h2>{t.ceo.delivery[1]}</h2></div></div><div className="progress-list">{t.ceo.progress.map((l,i)=><div key={l}><span>{l}<b>{[86,78,72,81][i]}%</b></span><i><em style={{width:`${[86,78,72,81][i]}%`}}/></i></div>)}</div></article><article className="panel insight-panel"><div className="insight-icon"><Icon name="insight"/></div><div><span>{t.ceo.insightHead}</span><h2>{filters.department==="Technology"?t.ceo.insightTech:metrics.budget<92?t.ceo.insightVar:t.ceo.insightScale}</h2><p>{t.ceo.impactA}{money(metrics.saving*.34)}{t.ceo.impactB}</p></div></article></div></>:
      <article className="panel drill-panel"><div className="panel-head"><div><span>{t.ceo.drillTag} · {drill.map(tr).join(" / ")}</span><h2>{t.ceo.contribution.replace("{x}",tr(drill[0]))}</h2></div><button className="secondary small" onClick={()=>setDrill([])}>{t.ceo.ret}</button></div><Bars labels={(drill[0]==="Revenue"?["Real Estate","Retail","Corporate Services"]:["Operations","Finance","Technology","Procurement"]).map(tr)} values={drill[0]==="Revenue"?[112.7,83.3,49]:[37.2,27.4,17.6,15.8]}/><div className="detail-table"><div><b>{t.ceo.selLevel}</b><span>{tr(drill.at(-1)||"")}</span></div><div><b>{t.ceo.driver}</b><span>{drill[0]==="Revenue"?t.ceo.driverRev:t.ceo.driverCost}</span></div><div><b>{t.ceo.mgmtAction}</b><span>{t.ceo.mgmtText}</span></div></div>{drill.length<4&&<button className="primary" onClick={()=>setDrill([...drill,drill[0]==="Revenue"?(drill.length===2?"Operation":"Revenue category"):(drill.length===2?"Cost category":"Application / service")])}>{t.ceo.next}</button>}</article>}
    </section>}

    {view==="finance"&&<section className="dashboard-shell"><DashboardHeader title={t.finance.title} eyebrow={t.finance.eyebrow} filters={filters} setFilters={setFilters} d={t.dash} tr={tr}/><div className="notice"><Icon name="finance"/><span><b>{t.finance.noticeB}</b> {t.finance.notice}</span></div><div className="stats-grid four"><Stat label={t.finance.stats[0][0]} value={money(metrics.revenue)} note={t.finance.stats[0][1]} tone="teal"/><Stat label={t.finance.stats[1][0]} value={money(metrics.cost)} note={t.finance.stats[1][1]} tone="teal"/><Stat label={t.finance.stats[2][0]} value={money(metrics.revenue-metrics.cost)} note={t.finance.stats[2][1]}/><Stat label={t.finance.stats[3][0]} value={money(metrics.profit)} note={t.finance.stats[3][1]} tone="gold"/></div>
      <div className="dashboard-grid"><article className="panel wide"><div className="panel-head"><div><span>{t.finance.monthly[0]}</span><h2>{t.finance.monthly[1]}</h2></div></div><Trend factor={factor}/></article><article className="panel"><div className="panel-head"><div><span>{t.finance.gl[0]}</span><h2>{t.finance.gl[1]}</h2></div></div><Bars labels={t.finance.glLabels} values={[245,38,31,14]}/></article><article className="panel coa"><div className="panel-head"><div><span>{t.finance.coa[0]}</span><h2>{t.finance.coa[1]}</h2></div></div><ul>{t.finance.coaTree.map(g=><li key={g[0]}><b>{g[0]}</b><ul>{g[1].map(x=><li key={x}>{x}</li>)}</ul></li>)}</ul></article><article className="panel"><div className="panel-head"><div><span>{t.finance.cc[0]}</span><h2>{t.finance.cc[1]}</h2></div></div><Bars labels={t.finance.ccLabels} values={[97,91,88,94]} suffix="%"/></article><article className="panel wide"><div className="panel-head"><div><span>{t.finance.wc[0]}</span><h2>{t.finance.wc[1]}</h2></div></div><div className="aging-grid">{t.finance.aging.map((x,i)=><div key={x}><span>{x}</span><b>{money([18.4,7.2,3.8,1.9,.8][i]*1_000_000)}</b><small>{[57,22,12,6,3][i]}%</small></div>)}</div></article></div>
    </section>}

    {view==="technology"&&<section className="dashboard-shell"><DashboardHeader title={t.technology.title} eyebrow={t.technology.eyebrow} filters={filters} setFilters={setFilters} d={t.dash} tr={tr}/><div className="stats-grid four"><Stat label={t.technology.stats[0][0]} value={money(2_400_000*factor)} note={t.technology.stats[0][1]}/><Stat label={t.technology.stats[1][0]} value="95%" note={t.technology.stats[1][1]} tone="teal"/><Stat label={t.technology.stats[2][0]} value={money(metrics.saving)} note={t.technology.stats[2][1]} tone="gold"/><Stat label={t.technology.stats[3][0]} value="78%" note={t.technology.stats[3][1]} tone="teal"/></div>
      <div className="before-after"><div><span>{t.technology.before[0]}</span><b>{t.technology.beforeVal}</b><p>{t.technology.before[1]}</p></div><div className="value-arrow">{lang==="ar"?"←":"→"} <small>{t.technology.arrow[0]}<br/>{t.technology.arrow[1]}</small></div><div><span>{t.technology.after[0]}</span><b>{t.technology.afterVal}</b><p>{t.technology.after[1]}</p></div></div>
      <div className="dashboard-grid"><article className="panel full"><div className="panel-head"><div><span>{t.technology.portfolio[0]}</span><h2>{t.technology.portfolio[1]}</h2></div><DemoBadge label={t.dash.demo}/></div><div className="table-wrap"><table><thead><tr>{t.technology.tableHead.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{t.technology.rows.map(row=><tr key={row[0]}>{row.slice(0,6).map((c,i)=><td key={i}>{i===5?<span className={`recommend ${row[6]}`}>{c}</span>:c}</td>)}</tr>)}</tbody></table></div></article>
      <article className="panel calculator full"><div className="panel-head"><div><span>{t.technology.calc[0]}</span><h2>{t.technology.calc[1]}</h2></div><b>{t.technology.calc[2]}</b></div><div className="calc-layout"><div className="calc-inputs">{([["licenses",1],["cost",10],["util",1],["target",1],["duplicate",10000],["transition",10000]] as [keyof typeof calc,number][]).map(([key,step],i)=><label key={key}>{t.technology.calcLabels[i]}<input type="number" min="0" step={step} value={calc[key]} onChange={e=>setCalc({...calc,[key]:Math.max(0,Number(e.target.value))})}/></label>)}</div><div className="calc-results"><div><span>{t.technology.res[0]}</span><b>{money(currentAnnual,false)}</b></div><div><span>{t.technology.res[1]}</span><b>{money(optimizedAnnual,false)}</b></div><div className="highlight"><span>{t.technology.res[2]}</span><b>{money(annualSaving,false)}</b></div><div><span>{t.technology.res[3]}</span><b>{money(firstYear,false)}</b></div><div><span>{t.technology.res[4]}</span><b>{money(threeYear,false)}</b></div><div><span>{t.technology.res[5]}</span><b>{payback.toFixed(1)}{t.technology.months}</b></div><div><span>{t.technology.res[6]}</span><b>{roi.toFixed(0)}%</b></div><p>{t.technology.assume}</p></div></div></article>
      <article className="panel insight-panel full"><div className="insight-icon"><Icon name="insight"/></div><div><span>{t.technology.insightHead}</span><h2>{calc.util<70?t.technology.insightUtil:calc.duplicate>200000?t.technology.insightDup:t.technology.insightRole}</h2><p>{t.technology.impactA}{money(threeYear)}{t.technology.impactB}</p></div></article></div>
    </section>}

    {view==="cases"&&<section className="case-shell"><div className="case-intro"><span className="eyebrow">{t.cases.eyebrow}</span><h1>{t.cases.h1}</h1><p>{t.cases.p}</p><DemoBadge label={t.dash.demo}/></div><div className="case-grid">{t.cases.items.map(c=><article className="case-card" key={c[0]}><span className="case-number">{c[0]}</span><h2>{c[1]}</h2><p className="case-lead">{c[2]}</p><small>{c[3]}</small><ol>{c[4].map(x=><li key={x}><Icon name="check"/>{x}</li>)}</ol><p className="outcome">{c[5]}</p></article>)}</div><div className="case-cta"><div><span className="eyebrow">{t.cases.ctaEyebrow}</span><h2>{t.cases.ctaH2}</h2></div><button className="primary" onClick={()=>nav("ceo")}>{t.cases.ctaBtn} <Icon name="arrow"/></button></div></section>}

    <footer><div><b>Ahmed Mahboub</b><span>{t.footer.tag}</span></div><p>{t.footer.disclaimer}</p><span>© 2026</span></footer>
  </main>;
}
