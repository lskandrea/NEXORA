'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Activity, ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, CreditCard, FolderKanban, LayoutDashboard, ListTodo, LogOut, MessageCircle, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Sparkles, Users, Wallet, X } from 'lucide-react';
import { BillingButtons } from './billing-buttons';
import { createProject, createTask, createWorkspace, signOut } from '../app/(app)/dashboard/actions';

type Project = { id:string; name:string; status:string };
type Task = { id:string; title:string; status:string; project_id:string };
type Workspace = { id:string; name:string; plan:string };
type Tab = 'overview' | 'projects' | 'tasks' | 'analytics' | 'calendar' | 'messages' | 'team' | 'billing' | 'settings';

const palette = ['#ed6b64','#57b6a4','#d6a24f','#9a88d2','#df87aa','#75a5d9','#79b47a','#d78d69'];
const navPrimary = [
 {id:'overview' as Tab,label:'Vue d’ensemble',icon:LayoutDashboard},
 {id:'projects' as Tab,label:'Projets',icon:FolderKanban},
 {id:'tasks' as Tab,label:'Tâches',icon:ListTodo},
 {id:'analytics' as Tab,label:'Analyses',icon:Activity},
 {id:'calendar' as Tab,label:'Calendrier',icon:CalendarDays},
 {id:'messages' as Tab,label:'Messages',icon:MessageCircle}
];
const navSecondary = [
 {id:'team' as Tab,label:'Équipe',icon:Users},
 {id:'billing' as Tab,label:'Abonnement',icon:CreditCard},
 {id:'settings' as Tab,label:'Paramètres',icon:Settings2}
];

function ProgressRing({percent}:{percent:number}) {
 return <div className="nx-ws-progress-ring" style={{'--percent':percent} as CSSProperties}><div>{percent}<span>%</span><small>TERMINÉ</small></div></div>;
}
function EmptyMessage({title,description}:{title:string;description:string}) {
 return <div className="nx-ws-empty"><span>✳</span><h3>{title}</h3><p>{description}</p></div>;
}
function Graph({projects,tasks}:{projects:Project[];tasks:Task[]}) {
 const counts=projects.slice(0,9).map(p=>tasks.filter(t=>t.project_id===p.id).length);
 const max=Math.max(1,...counts);
 const slots=counts.length?counts:Array.from({length:9},()=>0);
 return <div className="nx-ws-graph"><div className="nx-ws-graph-axis"><span>{max*2}</span><span>{max}</span><span>0</span></div><div className="nx-ws-graph-bars">{slots.map((n,i)=><div className="nx-ws-graph-pair" key={i}><span className="nx-ws-graph-bar primary" style={{height:(n?Math.max(12,n/max*83):3)+'%'}}/><span className="nx-ws-graph-bar secondary" style={{height:(n?Math.max(8,n/max*53):3)+'%'}}/></div>)}</div><div className="nx-ws-graph-labels"><span>PROJETS</span><span>RÉPARTITION DES TÂCHES</span></div></div>;
}
function CalendarPanel({full=false}:{full?:boolean}) {
 const [current,setCurrent]=useState<{year:number;month:number;day:number}>({year:2026,month:10,day:17});
 const [picked,setPicked]=useState(17);
 useEffect(()=>{const d=new Date();setCurrent({year:d.getFullYear(),month:d.getMonth(),day:d.getDate()});setPicked(d.getDate());},[]);
 const first=(new Date(current.year,current.month,1).getDay()+6)%7;
 const count=new Date(current.year,current.month+1,0).getDate();
 const dateLabel=new Intl.DateTimeFormat('fr-FR',{month:'long',year:'numeric'}).format(new Date(current.year,current.month,1));
 return <div className={'nx-ws-calendarbox '+(full?'large':'')}>
  <div className="nx-ws-calendar-head"><div><b>{String(picked).padStart(2,'0')}</b><span><strong>{new Intl.DateTimeFormat('fr-FR',{weekday:'long'}).format(new Date(current.year,current.month,picked))}</strong><small>{dateLabel}</small></span></div><CalendarDays size={19}/></div>
  <div className="nx-ws-calendar-grid">{['L','M','M','J','V','S','D'].map((n,i)=><span key={i}>{n}</span>)}{Array.from({length:first},(_,i)=><i key={'blank'+i}/>)}{Array.from({length:count},(_,i)=><button type="button" className={picked===i+1?'chosen':''} key={i} onClick={()=>setPicked(i+1)}>{i+1}</button>)}</div>
  <div className="nx-ws-calendar-agenda"><span className="nx-ws-small-label">AGENDA DU JOUR</span><div><span className="nx-ws-agenda-icon"><CalendarDays size={16}/></span><p><b>Aucun événement planifié</b><small>Les échéances seront bientôt disponibles.</small></p></div></div>
 </div>;
}

export function WorkspaceView({email,workspaces,projects,tasks}:{email:string;workspaces:Workspace[];projects:Project[];tasks:Task[]}) {
 const [tab,setTab]=useState<Tab>('overview');
 const [query,setQuery]=useState('');
 const [filter,setFilter]=useState<'all'|'todo'|'done'>('all');
 const [accent,setAccent]=useState('#ec6a61');
 const [notice,setNotice]=useState(false);
 const [mobileNav,setMobileNav]=useState(false);
 const active=workspaces[0];
 const done=tasks.filter(t=>t.status==='done').length;
 const completion=tasks.length?Math.round(done/tasks.length*100):0;
 const activeTasks=tasks.filter(t=>t.status!=='done');
 const searchedProjects=projects.filter(p=>p.name.toLowerCase().includes(query.toLowerCase()));
 const searchedTasks=tasks.filter(t=>(t.title.toLowerCase().includes(query.toLowerCase()))&&(filter==='all'||(filter==='done'?t.status==='done':t.status!=='done')));
 const todayText='Votre espace de travail, à votre rythme.';
 const allNav=[...navPrimary,...navSecondary];
 const sectionTitle=allNav.find(n=>n.id===tab)?.label||'Vue d’ensemble';
 const completionByProject=(id:string)=>{const list=tasks.filter(t=>t.project_id===id);return list.length?Math.round(list.filter(t=>t.status==='done').length/list.length*100):0;};
 const projectForm=active&&<form action={createProject} className="nx-ws-form"><input name="workspace_id" type="hidden" value={active.id}/><input required maxLength={120} name="name" aria-label="Nom du nouveau projet" placeholder="Ex. Refonte du site web"/><button type="submit"><Plus size={16}/> Ajouter le projet</button></form>;
 const taskForm=projects.length>0&&<form action={createTask} className="nx-ws-form"><input name="title" required maxLength={160} aria-label="Titre de la tâche" placeholder="Ex. Envoyer le devis client"/><select name="project_id" aria-label="Projet associé">{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><button type="submit"><Plus size={16}/> Ajouter</button></form>;
 const changeTab=(id:Tab)=>{setTab(id);setQuery('');setFilter('all');setMobileNav(false);};
 const cards=[
  {label:'Projets actifs',value:projects.length.toString().padStart(2,'0'),caption:'Espaces de création',tone:'mint',icon:FolderKanban},
  {label:'Tâches en cours',value:activeTasks.length.toString().padStart(2,'0'),caption:'À faire avancer',tone:'peach',icon:Clock3},
  {label:'Tâches terminées',value:done.toString().padStart(2,'0'),caption:'Travail accompli',tone:'coral',icon:CheckCircle2},
  {label:'Progression totale',value:completion+' %',caption:'Toutes vos tâches',tone:'lilac',icon:Activity}
 ];
 const projectCards=<div className="nx-ws-project-grid">{searchedProjects.map((p,i)=>{const total=tasks.filter(t=>t.project_id===p.id).length;const progress=completionByProject(p.id);return <article className="nx-ws-project-card" key={p.id}><div className="nx-ws-project-card-head"><span style={{background:palette[i%palette.length]+'24',color:palette[i%palette.length]}}>{['✳','◈','✦','◎','❋','▧','✹','◆'][i%8]}</span><FolderKanban size={17}/></div><h3>{p.name}</h3><p>{total} tâche{total===1?'':'s'} · {p.status||'Actif'}</p><div className="nx-ws-project-bar"><span style={{width:progress+'%',background:palette[i%palette.length]}}/></div><div className="nx-ws-project-bottom"><span>Progression</span><b>{progress}%</b></div></article>})}{searchedProjects.length===0&&<EmptyMessage title="Vos projets commencent ici" description={projects.length?'Aucun résultat pour cette recherche.':'Créez votre premier projet et suivez sa progression dans un espace élégant.'}/>}</div>;
 return <div className="nx-ws" style={{'--nx-accent':accent} as CSSProperties}>
   <aside className={'nx-ws-sidebar '+(mobileNav?'open':'')}><div className="nx-ws-brand"><span className="nx-ws-brand-icon">✳</span><span>NEXORA<small>WORKSPACE</small></span><button className="nx-ws-close" type="button" onClick={()=>setMobileNav(false)} aria-label="Fermer le menu"><X size={18}/></button></div>
    <span className="nx-ws-side-caption">MENU PRINCIPAL</span><nav className="nx-ws-nav">{navPrimary.map(n=><button type="button" key={n.id} className={tab===n.id?'active':''} onClick={()=>changeTab(n.id)}><n.icon size={18}/>{n.label}{n.id==='messages'&&<span className="nx-ws-coming-dot"/>}</button>)}</nav>
    <span className="nx-ws-side-caption second">ESPACE DE TRAVAIL</span><nav className="nx-ws-nav">{navSecondary.map(n=><button type="button" key={n.id} className={tab===n.id?'active':''} onClick={()=>changeTab(n.id)}><n.icon size={18}/>{n.label}</button>)}</nav>
    <div className="nx-ws-side-footer"><div className="nx-ws-help"><Sparkles size={20}/><b>Un espace à vous.</b><small>Concentrez-vous sur ce qui compte vraiment.</small></div><div className="nx-ws-account"><span>{email.slice(0,1).toUpperCase()}</span><p><b>{email.split('@')[0]}</b><small>{email}</small></p><ChevronDown size={15}/></div></div>
   </aside>
   <main className="nx-ws-main">
    <div className="nx-ws-topbar"><div className="nx-ws-crumb"><button type="button" onClick={()=>setMobileNav(true)} aria-label="Afficher le menu"><span>☰</span></button><span>{active?.name||'Mon espace'}</span><i>/</i><strong>{sectionTitle}</strong></div><div className="nx-ws-top-actions"><span className="nx-ws-secure"><ShieldCheck size={15}/> Espace privé</span><button type="button" onClick={()=>setNotice(!notice)} aria-label="Notifications" aria-expanded={notice}><Bell size={18}/></button><span className="nx-ws-userinitial">{email.slice(0,1).toUpperCase()}</span></div>{notice&&<div className="nx-ws-notice"><b>Notifications</b><p>Aucune notification pour le moment.</p></div>}</div>
    {!active?<div className="nx-ws-startup"><span className="nx-ws-kicker">BIENVENUE SUR NEXORA</span><h1>Votre nouvel espace commence ici.</h1><p>Créez votre espace de travail pour organiser vos projets, tâches et futurs collaborateurs.</p><form action={createWorkspace} className="nx-ws-form"><input name="name" placeholder="Nom de votre entreprise" maxLength={80} required/><button type="submit"><Plus size={16}/> Créer mon espace</button></form></div>:<>
    <header className="nx-ws-header"><div><span className="nx-ws-kicker">VOTRE ESPACE DE TRAVAIL <span>✦</span></span><h1>{tab==='overview'?'Bonjour, bienvenue ✳':sectionTitle}</h1><p>{tab==='overview'?todayText:'Organisez votre activité en toute simplicité.'}</p></div><div className="nx-ws-header-action"><span className="nx-ws-plan"><span/> {active.plan.toUpperCase()}</span><button type="button" onClick={()=>changeTab('projects')}><Plus size={16}/> Nouveau projet</button></div></header>
    {tab==='overview'&&<>
      <div className="nx-ws-hero-layout">
       <div className="nx-ws-hero"><div className="nx-ws-hero-copy"><span>VOTRE ACTIVITÉ EN UN COUP D’ŒIL <ArrowUpRight size={13}/></span><h2>Tout est prêt pour<br/>une belle journée.</h2><p>Chaque tâche terminée vous rapproche de vos objectifs.</p><div className="nx-ws-hero-actions"><div><strong>{completion}%</strong><small>Progression globale</small></div><button onClick={()=>changeTab('analytics')} type="button">Voir mon activité <ArrowRight size={14}/></button></div></div><div className="nx-ws-hero-visual"><ProgressRing percent={completion}/>{['✦','✳','✿','★','◈','◎'].map((sign,i)=><span className={'nx-ws-bubble bubble-'+i} key={i}>{sign}</span>)}</div></div>
       <CalendarPanel/>
      </div>
      <div className="nx-ws-stats">{cards.map(c=><article key={c.label} className={'nx-ws-stat '+c.tone}><div><span>{c.label}</span><c.icon size={17}/></div><strong>{c.value}</strong><small>{c.caption}</small></article>)}</div>
      <div className="nx-ws-main-grid"><section className="nx-ws-panel nx-ws-activity"><div className="nx-ws-panel-heading"><div><h2>Activité de vos projets</h2><p>Répartition des tâches par projet</p></div><span className="nx-ws-badge">Projets & tâches</span></div><Graph projects={projects} tasks={tasks}/></section><section className="nx-ws-panel nx-ws-priority"><div className="nx-ws-panel-heading"><div><h2>À faire en priorité</h2><p>Votre travail à venir</p></div><button type="button" onClick={()=>changeTab('tasks')}><ArrowUpRight size={17}/></button></div>{activeTasks.slice(0,4).map((t,i)=><div className="nx-ws-priority-item" key={t.id}><span className="nx-ws-checkbox"/><div><b>{t.title}</b><small>{projects.find(p=>p.id===t.project_id)?.name||'Projet'}</small></div><span className="nx-ws-item-count">{String(i+1).padStart(2,'0')}</span></div>)}{!activeTasks.length&&<div className="nx-ws-priority-empty"><CheckCircle2 size={26}/><b>Tout est à jour !</b><small>Aucune tâche en attente.</small></div>}<button type="button" className="nx-ws-textlink" onClick={()=>changeTab('tasks')}>Toutes les tâches <ArrowRight size={14}/></button></section></div>
      <section className="nx-ws-panel nx-ws-recent"><div className="nx-ws-panel-heading"><div><h2>Projets récents</h2><p>Gardez un œil sur vos réalisations</p></div><button onClick={()=>changeTab('projects')} type="button" className="nx-ws-textlink">Tout voir <ArrowRight size={14}/></button></div>{projectCards}</section>
    </>}
    {(['projects','tasks'] as Tab[]).includes(tab)&&<div className="nx-ws-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={tab==='projects'?'Rechercher un projet…':'Rechercher une tâche…'} aria-label="Rechercher"/><span>⌘ K</span></div>}
    {tab==='projects'&&<section className="nx-ws-panel nx-ws-section"><div className="nx-ws-panel-heading"><div><h2>Votre collection de projets <span className="nx-ws-count">{projects.length}</span></h2><p>Donnez vie à vos idées et suivez leur avancement.</p></div></div>{projectForm}{projectCards}</section>}
    {tab==='tasks'&&<section className="nx-ws-panel nx-ws-section"><div className="nx-ws-panel-heading"><div><h2>Les tâches du moment <span className="nx-ws-count">{tasks.length}</span></h2><p>Une petite avancée à la fois.</p></div></div>{taskForm}<div className="nx-ws-filters">{[{id:'all',text:'Toutes'},{id:'todo',text:'À faire'},{id:'done',text:'Terminées'}].map(f=><button key={f.id} onClick={()=>setFilter(f.id as 'all'|'todo'|'done')} className={filter===f.id?'active':''} type="button">{f.text}</button>)}</div><div className="nx-ws-tasklist">{searchedTasks.map((t,i)=><div className="nx-ws-taskrow" key={t.id}><span className={t.status==='done'?'done':''}>{t.status==='done'&&<Check size={14}/>}</span><div><strong>{t.title}</strong><small>{projects.find(p=>p.id===t.project_id)?.name||'Projet'}</small></div><span className={t.status==='done'?'nx-ws-tasktag done':'nx-ws-tasktag'}>{t.status==='done'?'Terminée':'À faire'}</span><span className="nx-ws-task-index">{String(i+1).padStart(2,'0')}</span></div>)}{searchedTasks.length===0&&<EmptyMessage title="Rien à afficher pour le moment" description={tasks.length?'Essayez un autre filtre ou une autre recherche.':'Ajoutez une tâche dans un projet pour commencer.'}/>}</div></section>}
    {tab==='analytics'&&<div className="nx-ws-analytics"><div className="nx-ws-stats">{cards.map(c=><article key={c.label} className={'nx-ws-stat '+c.tone}><div><span>{c.label}</span><c.icon size={17}/></div><strong>{c.value}</strong><small>{c.caption}</small></article>)}</div><div className="nx-ws-main-grid"><section className="nx-ws-panel nx-ws-activity"><div className="nx-ws-panel-heading"><div><h2>Progression des projets</h2><p>Une lecture claire de votre charge de travail</p></div><span className="nx-ws-badge">Données réelles</span></div><Graph projects={projects} tasks={tasks}/></section><section className="nx-ws-panel"><div className="nx-ws-panel-heading"><div><h2>Avancement général</h2><p>Tâches terminées / total</p></div></div><div className="nx-ws-completion"><ProgressRing percent={completion}/><b>{done} sur {tasks.length} tâches</b><small>{tasks.length?'Continuez sur cette lancée !':'Créez des tâches pour afficher les statistiques.'}</small></div></section></div><p className="nx-ws-honesty">Les indicateurs reflètent vos projets et vos tâches. Le suivi des revenus n’est pas encore connecté à une source de données.</p></div>}
    {tab==='calendar'&&<div className="nx-ws-calendar-page"><CalendarPanel full/><section className="nx-ws-panel"><div className="nx-ws-panel-heading"><div><h2>Votre planning</h2><p>Un aperçu de votre organisation</p></div></div><EmptyMessage title="Votre agenda prend forme" description="La planification d'échéances et la synchronisation de calendriers seront disponibles dans une prochaine version."/></section></div>}
    {tab==='messages'&&<section className="nx-ws-panel nx-ws-messages"><div className="nx-ws-panel-heading"><div><h2>Vos conversations</h2><p>Un espace d’échange pour les projets.</p></div><span className="nx-ws-badge">Bientôt disponible</span></div><div className="nx-ws-chatbox"><span className="nx-ws-chatday">ESPACE MESSAGERIE</span><p className="nx-ws-chat-bubble">Bienvenue dans votre futur espace de conversation ! 👋</p><p className="nx-ws-chat-bubble self">Bientôt, tout sera ici ✨</p><p className="nx-ws-chat-bubble">Les conversations et fichiers pourront être liés à vos projets.</p><div className="nx-ws-chatinput">La messagerie n’est pas encore activée <MessageCircle size={18}/></div></div><p className="nx-ws-honesty">Aucun message de démonstration n’est envoyé ou enregistré.</p></section>}
    {tab==='team'&&<section className="nx-ws-panel nx-ws-section"><div className="nx-ws-panel-heading"><div><h2>Votre équipe</h2><p>Les personnes qui font grandir vos idées.</p></div><span className="nx-ws-badge">Invitations à venir</span></div><div className="nx-ws-team-member"><span>{email.slice(0,1).toUpperCase()}</span><div><strong>{email.split('@')[0]}</strong><small>{email}</small></div><b>Compte connecté</b></div><p className="nx-ws-honesty">Les invitations et les rôles ne sont pas encore activés. Aucun accès n’est accordé à d’autres utilisateurs.</p></section>}
    {tab==='billing'&&<section className="nx-ws-panel nx-ws-section nx-ws-billing"><div><span className="nx-ws-kicker">VOTRE FORMULE</span><h2>Un abonnement à votre rythme.</h2><p>Offre actuelle : <b>{active.plan}</b>. Retrouvez vos options de gestion sécurisée.</p><small>Les paiements utilisent Stripe en mode test tant que la configuration de production n’est pas effectuée.</small></div><BillingButtons workspaceId={active.id}/></section>}
    {tab==='settings'&&<div className="nx-ws-settings-grid"><section className="nx-ws-panel"><div className="nx-ws-panel-heading"><div><h2>Votre profil</h2><p>Informations du compte connecté.</p></div></div><div className="nx-ws-profilebox"><span>{email.slice(0,1).toUpperCase()}</span><div><strong>{email.split('@')[0]}</strong><small>{email}</small></div></div><div className="nx-ws-setting-line"><span>Espace de travail</span><b>{active.name}</b></div><div className="nx-ws-setting-line"><span>Formule</span><b>{active.plan}</b></div></section><section className="nx-ws-panel"><div className="nx-ws-panel-heading"><div><h2>Apparence</h2><p>Personnalisez la couleur de votre espace.</p></div></div><div className="nx-ws-themechoices">{[{color:'#ec6a61',name:'Corail'},{color:'#4aa99a',name:'Menthe'},{color:'#8e79d4',name:'Lavande'},{color:'#3a3d49',name:'Nuit'}].map(c=><button type="button" key={c.name} onClick={()=>setAccent(c.color)} className={accent===c.color?'active':''}><span style={{background:c.color}}/>{c.name}{accent===c.color&&<Check size={15}/>}</button>)}</div><p className="nx-ws-honesty">La couleur est conservée uniquement pendant cette session.</p></section><section className="nx-ws-panel nx-ws-signout"><div><h2>Déconnexion</h2><p>Terminer votre session en toute sécurité.</p></div><form action={signOut}><button type="submit"><LogOut size={16}/> Se déconnecter</button></form></section></div>}
    </>}
   </main>
 </div>;
}
