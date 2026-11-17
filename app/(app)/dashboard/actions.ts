'use server';
import {supabaseServer} from '@/lib/supabase';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
export async function createWorkspace(form:FormData){const s=await supabaseServer();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const name=String(form.get('name')||'').trim();if(!name||name.length>80)throw new Error('Nom invalide');const {error}=await s.rpc('create_workspace',{workspace_name:name});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function createProject(form:FormData){const s=await supabaseServer();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const name=String(form.get('name')||'').trim();const workspace_id=String(form.get('workspace_id')||'');if(!name||name.length>120)throw new Error('Nom invalide');const {error}=await s.from('projects').insert({name,workspace_id,created_by:user.id});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function createTask(form:FormData){const s=await supabaseServer();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const title=String(form.get('title')||'').trim();const project_id=String(form.get('project_id')||'');if(!title||title.length>160)throw new Error('Titre invalide');const {error}=await s.from('tasks').insert({title,project_id,created_by:user.id});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function signOut(){const s=await supabaseServer();await s.auth.signOut();redirect('/')}
