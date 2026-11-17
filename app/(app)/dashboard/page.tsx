import {supabaseServer} from '@/lib/supabase';
import {redirect} from 'next/navigation';
import {WorkspaceView} from '@/components/workspace-view';
export default async function Dashboard(){
 const s=await supabaseServer();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');
 const {data:memberships}=await s.from('workspace_members').select('workspace_id,role,workspaces(id,name,plan)').eq('user_id',user.id);
 const ws=(memberships||[]).map(m=>m.workspaces).flat().filter(Boolean) as unknown as {id:string;name:string;plan:string}[];
 const active=ws[0];const {data:projects}=active?await s.from('projects').select('id,name,status').eq('workspace_id',active.id).order('created_at',{ascending:false}):{data:[]};
 const ids=(projects||[]).map(p=>p.id);const {data:tasks}=ids.length?await s.from('tasks').select('id,title,status,project_id').in('project_id',ids):{data:[]};
 return <WorkspaceView email={user.email||'Utilisateur'} workspaces={ws} projects={projects||[]} tasks={tasks||[]}/>;
}
