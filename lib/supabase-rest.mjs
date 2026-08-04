const url=(process.env.SUPABASE_URL||'').replace(/\/$/,'');
const key=process.env.SUPABASE_SERVICE_ROLE_KEY||'';

export const supabaseEnabled=Boolean(url&&key);

function headers(extra={}){
  return {
    apikey:key,
    Authorization:`Bearer ${key}`,
    'Content-Type':'application/json',
    ...extra
  };
}

async function request(path,options={}){
  if(!supabaseEnabled)throw new Error('Supabase is not configured');
  const response=await fetch(`${url}${path}`,{...options,headers:headers(options.headers)});
  const text=await response.text();
  const data=text?JSON.parse(text):null;
  if(!response.ok)throw new Error(data?.message||data?.error_description||`Supabase request failed (${response.status})`);
  return data;
}

export async function select(table,{columns='*',filters={},order,limit}={}){
  const query=new URLSearchParams({select:columns});
  for(const [name,value] of Object.entries(filters))query.set(name,`eq.${value}`);
  if(order)query.set('order',order);
  if(limit)query.set('limit',String(limit));
  return request(`/rest/v1/${table}?${query}`);
}

export async function insert(table,record,{returning=true}={}){
  return request(`/rest/v1/${table}`,{
    method:'POST',
    headers:{Prefer:returning?'return=representation':'return=minimal'},
    body:JSON.stringify(record)
  });
}

export async function update(table,record,filters={}){
  const query=new URLSearchParams();
  for(const [name,value] of Object.entries(filters))query.set(name,`eq.${value}`);
  return request(`/rest/v1/${table}?${query}`,{
    method:'PATCH',
    headers:{Prefer:'return=representation'},
    body:JSON.stringify(record)
  });
}

export async function remove(table,filters={}){
  const query=new URLSearchParams();
  for(const [name,value] of Object.entries(filters))query.set(name,`eq.${value}`);
  return request(`/rest/v1/${table}?${query}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
}

export async function authPassword(email,password){
  return request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
}

export async function authUser(accessToken){
  if(!supabaseEnabled)throw new Error('Supabase is not configured');
  const response=await fetch(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:`Bearer ${accessToken}`}});
  const data=await response.json();
  if(!response.ok)throw new Error(data?.message||'Invalid access token');
  return data;
}

export async function healthCheck(){
  if(!supabaseEnabled)return{enabled:false,ok:false};
  try{
    await select('schools',{columns:'id',limit:1});
    return{enabled:true,ok:true};
  }catch(error){
    return{enabled:true,ok:false,error:error.message};
  }
}
