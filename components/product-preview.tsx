'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, CheckCircle2, ChevronDown, CircleHelp, CreditCard, FolderKanban, LayoutDashboard, Menu, MessageCircle, MoreHorizontal, Plus, Search, Settings2, Sparkles, Users, Wallet } from 'lucide-react';

const days = ['L','M','M','J','V','S','D'];
const sampleProjects = [
  {name:'Identité de marque',client:'Studio Nova',pct:82,accent:'#f16c69',icon:'✦',tag:'Design'},
  {name:'Refonte du site',client:'Maison Lune',pct:64,accent:'#50b8a5',icon:'◈',tag:'Web'},
  {name:'Campagne d’été',client:'Atelier M.',pct:46,accent:'#e6ac50',icon:'✳',tag:'Marketing'},
  {name:'Application mobile',client:'Orion Tech',pct:91,accent:'#9380d7',icon:'◎',tag:'Produit'},
  {name:'Espace client',client:'Bloom',pct:28,accent:'#e78aa8',icon:'⌘',tag:'Web'},
  {name:'Brand guidelines',client:'Nuance',pct:72,accent:'#75a6e9',icon:'▧',tag:'Design'},
  {name:'Stratégie social',client:'Studio Nova',pct:58,accent:'#83ba75',icon:'❋',tag:'Social'},
  {name:'Lancement produit',client:'Orion Tech',pct:34,accent:'#e4a275',icon:'◌',tag:'Produit'}
];
const dataBars = [37,54,43,62,49,74,59,83,64,71,53,79,68,58];
export function ProductPreview({compact=false}:{compact?:boolean}){
 const [tab,setTab]=useState('Accueil');
 const [period,setPeriod]=useState('6 mois');
 const [selectedDay,setSelectedDay]=useState(16);
 const navigation = [{name:'Accueil',icon:LayoutDashboard},{name:'Projets',icon:FolderKanban},{name:'Finances',icon:Wallet},{name:'Messages',icon:MessageCircle}];
 const tiles = [
  {label:'Projets actifs',value:'16',note:'+ 3 ce mois',color:'mint',icon:FolderKanban},
  {label:'Taux de conversion',value:'8,3 %',note:'+ 2,4 %',color:'cream',icon:ArrowUpRight},
  {label:'Chiffre d’affaires',value:'42 500 €',note:'+ 12,8 %',color:'coral',icon:Wallet},
  {label:'Satisfaction client',value:'98 %',note:'+ 4,2 %',color:'lavender',icon:Sparkles}
 ];
 return <section className={'nx-preview '+(compact?'nx-preview-compact':'')} aria-label="Démonstration interactive de NEXORA">
   <aside className="nx-preview-side">
     <div className="nx-preview-logo"><span className="nx-preview-sun">✳</span><span>NEXORA<small>WORKSPACE</small></span></div>
     <div className="nx-preview-side-label">MENU PRINCIPAL</div>
     <div className="nx-preview-navigation">{navigation.map(n=><button key={n.name} type="button" className={tab===n.name?'selected':''} onClick={()=>setTab(n.name)}><n.icon size={16}/><span>{n.name}</span>{n.name==='Messages'&&<i>2</i>}</button>)}</div>
     <div className="nx-preview-side-label second">ESPACE DE TRAVAIL</div>
     <div className="nx-preview-navigation muted"><button type="button" onClick={()=>setTab('Équipe')} className={tab==='Équipe'?'selected':''}><Users size={16}/>Équipe</button><button type="button" onClick={()=>setTab('Réglages')} className={tab==='Réglages'?'selected':''}><Settings2 size={16}/>Réglages</button></div>
     <div className="nx-preview-user"><span className="nx-preview-user-face">A</span><span><strong>Mon espace</strong><small>Compte démo</small></span><MoreHorizontal size={17}/></div>
   </aside>
   <div className="nx-preview-main">
     <div className="nx-preview-top"><span className="nx-preview-breadcrumb">Espace personnel <b>/</b> {tab}</span><div className="nx-preview-toptools"><Search size={16}/><Bell size={16}/><span className="nx-preview-profile">A</span></div></div>
     {tab==='Accueil'?<>
       <div className="nx-preview-heading"><div><span className="nx-preview-subtitle">MARDI 17 NOVEMBRE 2026 <span>✦</span></span><h2>Bonjour, bienvenue <span>✳</span></h2><p>Prêt à faire avancer vos projets aujourd’hui ?</p></div><button type="button" onClick={()=>setTab('Projets')} className="nx-preview-darkbutton"><Plus size={15}/> Nouveau projet</button></div>
       <div className="nx-preview-herorow">
         <div className="nx-preview-hero"><div className="nx-preview-hero-content"><span className="nx-preview-kicker">VOTRE ACTIVITÉ EN UN COUP D’ŒIL <span>↗</span></span><h3>Tout roule à<br/>merveille cette semaine.</h3><p>Vos projets avancent et vos objectifs se rapprochent.</p><div className="nx-preview-hero-bottom"><div><strong>98 %</strong><small>Objectif atteint</small></div><button type="button" onClick={()=>setTab('Finances')}>Voir les statistiques <ArrowRight size={14}/></button></div></div><div className="nx-preview-orbit"><div className="nx-preview-ring"><span>68 %<small>TERMINÉ</small></span></div>{['✦','◈','✳','★','✿','●'].map((s,i)=><span key={i} className={'nx-preview-orb orb-'+i}>{s}</span>)}</div></div>
         <div className="nx-preview-calendar"><div className="nx-preview-calendar-title"><span><strong>16</strong><span>Lundi<small>Novembre 2026</small></span></span><CalendarDays size={19}/></div><div className="nx-preview-week">{days.map((d,i)=><span key={i}>{d}</span>)}{Array.from({length:28},(_,i)=><button type="button" onClick={()=>setSelectedDay(i+1)} className={selectedDay===i+1?'picked':''} key={i}>{i+1}</button>)}</div><div className="nx-preview-events"><div><span>09:30</span><p><b>Point équipe produit</b><small>Réunion hebdomadaire</small></p></div><div><span>14:00</span><p><b>Appel client • Nova</b><small>Livrables & validation</small></p></div></div></div>
       </div>
       <div className="nx-preview-kpis">{tiles.map(t=><div key={t.label} className={'nx-preview-kpi '+t.color}><div className="nx-preview-kpi-top"><span>{t.label}</span><t.icon size={15}/></div><strong>{t.value}</strong><span className="nx-preview-kpi-growth">{t.note} <ArrowUpRight size={12}/></span></div>)}</div>
       <div className="nx-preview-lower">
         <div className="nx-preview-graphpanel"><div className="nx-preview-panel-head"><div><strong>Revenus & activité</strong><small>Évolution de votre entreprise</small></div><div className="nx-preview-periods">{['3 mois','6 mois','12 mois'].map(p=><button key={p} type="button" onClick={()=>setPeriod(p)} className={period===p?'active':''}>{p}</button>)}</div></div><div className="nx-preview-bars"><div className="nx-preview-gridlines"><span>45k</span><span>30k</span><span>15k</span><span>0</span></div><div className="nx-preview-barfield">{dataBars.map((h,i)=><div className="nx-preview-bar-group" key={i}><span className="red" style={{height:(h*(period==='3 mois'?.75:period==='12 mois'?.88:1))+'%'}}/><span className="dark" style={{height:(h*.58)+'%'}}/></div>)}</div></div><div className="nx-preview-graphfoot"><span>JAN</span><span>FÉV</span><span>MAR</span><span>AVR</span><span>MAI</span><span>JUN</span><span>JUL</span></div></div>
         <div className="nx-preview-sidepanel"><div className="nx-preview-panel-head"><div><strong>Prochaines tâches</strong><small>Votre journée, organisée</small></div><MoreHorizontal size={18}/></div>{[{task:'Valider les maquettes',p:'Studio Nova',done:false},{task:'Répondre au support',p:'3 conversations',done:false},{task:'Envoyer le devis',p:'Maison Lune',done:true},{task:'Planifier la livraison',p:'Orion Tech',done:false}].map((t,i)=><div className="nx-preview-task" key={i}><span className={t.done?'checked':''}>{t.done&&<Check size={11}/>}</span><p><b>{t.task}</b><small>{t.p}</small></p><MoreHorizontal size={14}/></div>)}<button className="nx-preview-all" type="button" onClick={()=>setTab('Projets')}>Toutes les tâches <ArrowRight size={13}/></button></div>
       </div>
     </>:tab==='Projets'?<div className="nx-preview-tabcontent"><div className="nx-preview-heading"><div><span className="nx-preview-subtitle">ORGANISATION</span><h2>Tous vos projets <span>✳</span></h2><p>Retrouvez votre travail au même endroit.</p></div><button type="button" className="nx-preview-darkbutton" onClick={()=>setTab('Accueil')}><ArrowRight size={14}/> Vue d’ensemble</button></div><div className="nx-preview-projectgrid">{sampleProjects.map(p=><article key={p.name} className="nx-preview-project"><div className="nx-preview-project-head"><span style={{background:p.accent+'26',color:p.accent}}>{p.icon}</span><MoreHorizontal size={16}/></div><strong>{p.name}</strong><small>{p.client} · {p.tag}</small><div className="nx-preview-project-progress"><span style={{width:p.pct+'%',background:p.accent}}/></div><div className="nx-preview-project-foot"><span>Progression</span><b>{p.pct}%</b></div></article>)}</div></div>:tab==='Finances'?<div className="nx-preview-tabcontent"><div className="nx-preview-heading"><div><span className="nx-preview-subtitle">ANALYSES</span><h2>Vos finances <span>✳</span></h2><p>Des chiffres qui racontent votre croissance.</p></div></div><div className="nx-preview-kpis">{tiles.map(t=><div className={'nx-preview-kpi '+t.color} key={t.label}><span>{t.label}</span><strong>{t.value}</strong><span className="nx-preview-kpi-growth">{t.note}</span></div>)}</div><div className="nx-preview-graphpanel expanded"><div className="nx-preview-panel-head"><div><strong>Vue financière</strong><small>Exemple de données de démonstration</small></div><Wallet size={17}/></div><svg className="nx-preview-area" viewBox="0 0 740 240" preserveAspectRatio="none" role="img" aria-label="Graphique de revenus fictifs"><defs><linearGradient id="nx-preview-chart-gradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ec7168" stopOpacity=".38"/><stop offset="1" stopColor="#ec7168" stopOpacity="0"/></linearGradient></defs><path fill="url(#nx-preview-chart-gradient)" d="M0 176 C65 158 95 208 160 163 S248 116 295 144 S385 160 430 115 S508 62 560 92 S651 64 740 76 L740 240 L0 240Z"/><path stroke="#d76d62" fill="none" strokeWidth="4" strokeLinecap="round" d="M0 176 C65 158 95 208 160 163 S248 116 295 144 S385 160 430 115 S508 62 560 92 S651 64 740 76"/><path stroke="#95796f" fill="none" strokeWidth="3" strokeLinecap="round" d="M0 198 C75 232 98 142 170 182 S255 238 322 183 S405 216 475 194 S563 232 640 177 S697 193 740 187"/></svg></div></div>:tab==='Messages'?<div className="nx-preview-tabcontent"><div className="nx-preview-heading"><div><span className="nx-preview-subtitle">COMMUNICATION</span><h2>Conversations <span>✳</span></h2><p>Un espace pour rester connecté avec votre équipe.</p></div></div><div className="nx-preview-chat"><span className="nx-preview-chatdate">AUJOURD’HUI</span><p className="bubble">Bonjour ! On avance bien sur les maquettes de la nouvelle version.</p><p className="bubble me">Super, on valide la direction ! ✨</p><p className="bubble">Je t’envoie les derniers écrans cet après-midi 🙌</p><div className="nx-preview-chatinput">Écrivez un message… <span>➤</span></div></div></div>:<div className="nx-preview-empty"><Sparkles size={30}/><h2>Un espace pensé pour vous</h2><p>Cette section sera disponible prochainement.</p></div>}
     <div className="nx-preview-disclaimer"><span className="nx-preview-disclaimer-dot"/> Démonstration interactive · Données fictives</div>
   </div>
 </section>;
}
