const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export default async request=>{if(request.method!=='POST')return json(405,{sent:false,error:'Method not allowed.'});return json(200,{sent:false,disabled:true,message:'Transactional email notifications are temporarily disabled.'});};
