(()=>{var a={};a.id=4618,a.ids=[4618],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},6867:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>H,patchFetch:()=>G,routeModule:()=>C,serverHooks:()=>F,workAsyncStorage:()=>D,workUnitAsyncStorage:()=>E});var d={};c.r(d),c.d(d,{GET:()=>B,dynamic:()=>z});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(30477),v=c(10641),w=c(9608),x=c(80829),y=c.n(x);let z="force-dynamic";async function A(a){try{let b=a.headers.get("authorization");if(!b||!b.startsWith("Bearer "))return(0,u.vV)("Dashboard API: No authorization header found"),{user:null,error:"No authorization header"};let c=b.substring(7),d=y().verify(c,"local-development-jwt-secret-key");return(0,u.fH)("Dashboard API: JWT token verified successfully",{userId:d.userId}),{user:{id:d.userId,email:d.email,full_name:d.full_name||null,avatar_url:null,subscription_tier:"free",level:1,total_points:0,current_streak:0,wellness_score:50,focus_minutes:0,onboarding_completed:!1},error:null}}catch(a){return(0,u.vV)("Dashboard API: JWT authentication error:",a),{user:null,error:"Invalid token"}}}async function B(a){try{let b,c,d,e,f,g,h,i,{user:j,error:k}=await A(a);if(k||!j)return v.NextResponse.json({error:"Unauthorized"},{status:401});let l=function(){let a="postgresql://neondb_owner:npg_MRLUf85DBNPv@ep-curly-meadow-aefoagku-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";if(!a)throw Error("DATABASE_URL is not set");return(0,w.lw)(a)}(),m=(await l`
      SELECT id, email, full_name, avatar_url, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, cancel_at_period_end, is_verified, created_at, updated_at
      FROM users 
      WHERE id = ${j.id}
    `)[0];m||(m=(await l`
        INSERT INTO users (id, email, full_name, avatar_url, subscription_tier, subscription_status, cancel_at_period_end, is_verified, created_at, updated_at)
        VALUES (${j.id}, ${j.email}, ${j.full_name}, ${j.avatar_url}, 'launch', 'active', false, false, NOW(), NOW())
        RETURNING id, email, full_name, avatar_url, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, cancel_at_period_end, is_verified, created_at, updated_at
      `)[0]);try{i=await l`
        SELECT 
          COALESCE(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END), 0) AS total_tasks_completed,
          COALESCE(COUNT(DISTINCT t.id), 0) AS total_tasks,
          COALESCE(SUM(CASE WHEN t.status = 'completed' AND DATE(t.updated_at) = CURRENT_DATE THEN 1 ELSE 0 END), 0) AS tasks_completed_today,
          COALESCE(COUNT(DISTINCT CASE WHEN g.status = 'completed' THEN g.id END), 0) AS goals_achieved,
          COALESCE(COUNT(DISTINCT c.id), 0) AS ai_interactions,
          COALESCE(SUM(CASE WHEN t.estimated_minutes IS NOT NULL THEN t.estimated_minutes ELSE 0 END), 0) AS total_focus_minutes,
          -- Calculate user level based on completed tasks (1 level per 10 tasks)
          GREATEST(1, FLOOR(COALESCE(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END), 0) / 10) + 1) AS user_level,
          -- Calculate total points (10 points per completed task, 50 per completed goal)
          (COALESCE(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END), 0) * 10) + 
          (COALESCE(COUNT(DISTINCT CASE WHEN g.status = 'completed' THEN g.id END), 0) * 50) AS total_points,
          -- Calculate current streak (simplified - consecutive days with completed tasks)
          COALESCE((
            SELECT COUNT(DISTINCT DATE(updated_at))
            FROM tasks 
            WHERE user_id = ${j.id} 
              AND status = 'completed' 
              AND updated_at >= CURRENT_DATE - INTERVAL '30 days'
          ), 0) AS current_streak,
          -- Calculate wellness score based on task completion rate and goal progress
          LEAST(100, GREATEST(0, 
            CASE 
              WHEN COUNT(DISTINCT t.id) = 0 THEN 50
              ELSE ROUND(
                (COALESCE(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END), 0)::FLOAT / 
                 NULLIF(COUNT(DISTINCT t.id), 0)) * 100
              )
            END
          )) AS wellness_score
        FROM users u
        LEFT JOIN tasks t ON u.id = t.user_id
        LEFT JOIN goals g ON u.id = g.user_id
        LEFT JOIN conversations c ON u.id = c.user_id
        WHERE u.id = ${j.id}
      `,b=await l`
        SELECT 
            COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END),0) AS tasks_completed,
            COUNT(*) AS total_tasks,
            COALESCE((
              SELECT SUM(duration_minutes) 
              FROM focus_sessions 
              WHERE user_id = ${j.id} 
                AND DATE(started_at) = CURRENT_DATE
            ), 0) AS focus_minutes,
            COALESCE((
              SELECT COUNT(DISTINCT id) 
              FROM conversations 
              WHERE user_id = ${j.id} 
                AND DATE(last_message_at) = CURRENT_DATE
            ), 0) AS ai_interactions,
            COALESCE((
              SELECT COUNT(DISTINCT g.id) 
              FROM goals g
              WHERE g.user_id = ${j.id} 
                AND g.status = 'completed'
                AND DATE(g.updated_at) = CURRENT_DATE
            ), 0) AS goals_achieved,
            -- Calculate productivity score based on task completion rate
            CASE 
              WHEN COUNT(*) = 0 THEN 0
              ELSE ROUND(
                (COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0)::FLOAT / 
                 COUNT(*)) * 100
              )
            END AS productivity_score
         FROM tasks 
         WHERE user_id = ${j.id} AND DATE(updated_at) = CURRENT_DATE
      `,c=await l`
        SELECT id, title, description, status, priority, due_date
           FROM tasks
          WHERE user_id = ${j.id}
          ORDER BY COALESCE(due_date, NOW()) ASC
          LIMIT 10
      `,h=await l`
        SELECT 
          b.id, b.title, b.description, b.status, b.metadata,
          b.created_at, b.updated_at,
          COUNT(DISTINCT g.id) as goal_count,
          COUNT(DISTINCT t.id) as task_count
        FROM briefcases b
        LEFT JOIN goals g ON b.id = g.briefcase_id
        LEFT JOIN tasks t ON b.id = t.briefcase_id
        WHERE b.user_id = ${j.id}
        GROUP BY b.id, b.title, b.description, b.status, b.metadata, b.created_at, b.updated_at
        ORDER BY b.updated_at DESC
        LIMIT 6
      `}catch(a){i=[{total_tasks_completed:0,total_tasks:0,tasks_completed_today:0,goals_achieved:0,ai_interactions:0,total_focus_minutes:0,user_level:1,total_points:0,current_streak:0,wellness_score:50}],b=[{tasks_completed:0,total_tasks:0,focus_minutes:0,ai_interactions:0,goals_achieved:0,productivity_score:0}],c=[],h=[]}try{d=await l`
        SELECT 
          g.id, g.title, g.description, g.target_date, g.category, g.status,
          COALESCE(
            ROUND(
              (COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::FLOAT / 
               NULLIF(COUNT(t.id), 0)) * 100
            ), 0
          ) AS progress_percentage,
          COUNT(t.id) AS tasks_total,
          COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS tasks_completed
        FROM goals g
        LEFT JOIN tasks t ON g.id = t.goal_id
        WHERE g.user_id = ${j.id} AND g.status = 'active'
        GROUP BY g.id, g.title, g.description, g.target_date, g.category, g.status
        ORDER BY g.updated_at DESC
        LIMIT 5
      `}catch(a){d=[]}try{e=await l`
        SELECT 
          c.id, c.title, c.last_message_at,
          a.name, a.display_name, a.accent_color
        FROM conversations c
        LEFT JOIN agents a ON c.agent_id = a.id
        WHERE c.user_id = ${j.id}
        ORDER BY c.last_message_at DESC
        LIMIT 5
      `}catch(a){e=[]}try{f=await l`
        SELECT 
          ua.id, ua.earned_at,
          a.name, a.title, a.description, a.icon, a.points
        FROM user_achievements ua
        LEFT JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = ${j.id}
        ORDER BY ua.earned_at DESC
        LIMIT 5
      `}catch(a){f=[]}try{g=await l`
        SELECT 
          COALESCE(SUM(duration_minutes), 0) AS total_minutes,
          COUNT(*) AS sessions_count,
          CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND(AVG(duration_minutes), 1)
          END AS average_session
        FROM focus_sessions 
        WHERE user_id = ${j.id} 
          AND started_at >= CURRENT_DATE - INTERVAL '7 days'
      `}catch(a){g=[{total_minutes:0,sessions_count:0,average_session:0}]}let n=b[0]||{tasks_completed:0,total_tasks:0,focus_minutes:0,ai_interactions:0,goals_achieved:0,productivity_score:0},o=c.map(a=>({id:a.id,title:a.title,description:a.description,status:a.status,priority:a.priority,due_date:a.due_date,goal:null})),p=d.map(a=>({id:a.id,title:a.title,description:a.description,progress_percentage:a.progress_percentage,target_date:a.target_date,category:a.category,tasks_total:a.tasks_total,tasks_completed:a.tasks_completed})),q=e.map(a=>({id:a.id,title:null,last_message_at:a.last_message_at,agent:{name:a.name,display_name:a.display_name,accent_color:a.accent_color}})),r=f.map(a=>({id:a.id,earned_at:a.earned_at,achievement:{name:a.name,title:a.title,description:a.description,icon:a.icon,points:a.points}})),s=g[0]||{total_minutes:0,sessions_count:0,average_session:0},t=h.map(a=>({id:a.id,title:a.title,description:a.description,status:a.status,goal_count:parseInt(a.goal_count),task_count:parseInt(a.task_count),created_at:a.created_at,updated_at:a.updated_at})),u=0===o.length&&0===t.length?[{type:"welcome",title:"Welcome to SoloSuccess AI!",description:"Start by creating your first briefcase (project) to get organized.",action:"Create Briefcase"}]:[],x=i?.[0]||{total_tasks_completed:0,total_tasks:0,tasks_completed_today:0,goals_achieved:0,ai_interactions:0,total_focus_minutes:0,user_level:1,total_points:0,current_streak:0,wellness_score:50},y={user:{id:m.id,email:m.email,full_name:m.full_name||j.full_name||null,avatar_url:m.avatar_url||j.avatar_url||null,subscription_tier:m.subscription_tier||"free",level:x.user_level,total_points:x.total_points,current_streak:x.current_streak,wellness_score:x.wellness_score,focus_minutes:x.total_focus_minutes,onboarding_completed:m.onboarding_completed||!1},todaysStats:n,todaysTasks:o,activeGoals:p,recentConversations:q,recentAchievements:r,recentBriefcases:t,weeklyFocus:s,insights:u};return v.NextResponse.json(y)}catch(a){return(0,u.vV)("Dashboard API error:",a),(0,u.vV)("Error details:",{message:a instanceof Error?a.message:"Unknown error",stack:a instanceof Error?a.stack:void 0,name:a instanceof Error?a.name:void 0}),v.NextResponse.json({error:"Internal server error",details:void 0},{status:500})}}let C=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/dashboard/route",pathname:"/api/dashboard",filename:"route",bundlePath:"app/api/dashboard/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"C:\\Users\\prett\\Desktop\\SoloSuccess AI\\app\\api\\dashboard\\route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:D,workUnitAsyncStorage:E,serverHooks:F}=C;function G(){return(0,g.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:E})}async function H(a,b,c){var d;let e="/api/dashboard/route";"/index"===e&&(e="/");let g=await C.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||C.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===C.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>C.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>C.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await C.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await C.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await C.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},30477:(a,b,c)=>{"use strict";c.d(b,{HG:()=>i,JE:()=>g,fH:()=>h,vF:()=>e,vV:()=>f});class d{constructor(){this.isDevelopment=!1,this.logLevel=this.isDevelopment?3:2}shouldLog(a){return a<=this.logLevel}formatLogEntry(a){let b=["ERROR","WARN","INFO","DEBUG"][a.level],c=`[${a.timestamp}] ${b}: ${a.message}`;return a.context&&Object.keys(a.context).length>0&&(c+=` | Context: ${JSON.stringify(a.context)}`),a.error&&(c+=` | Error: ${a.error.message}`,this.isDevelopment&&a.error.stack&&(c+=` | Stack: ${a.error.stack}`)),c}log(a,b,c,d){if(!this.shouldLog(a))return;let e={level:a,message:b,timestamp:new Date().toISOString(),context:c,error:d},f=this.formatLogEntry(e);0===a&&console.error(f),!this.isDevelopment&&a<=1&&this.sendToExternalService(e)}async sendToExternalService(a){}error(a,b,c){this.log(0,a,b,c)}warn(a,b){this.log(1,a,b)}info(a,b){this.log(2,a,b)}debug(a,b){this.log(3,a,b)}apiLog(a,b,c,d,e){let f=`${a} ${b} - ${c}${d?` (${d}ms)`:""}`,g=c>=500?0:c>=400?1:2;this.log(g,f,{method:a,path:b,statusCode:c,duration:d,...e})}dbLog(a,b,c,d){let e=`DB ${a} on ${b}${c?` (${c}ms)`:""}`;this.log(3,e,{operation:a,table:b,duration:c,...d})}authLog(a,b,c=!0,d){let e=`Auth ${a}${b?` for user ${b}`:""} - ${c?"SUCCESS":"FAILED"}`;this.log(c?2:1,e,{action:a,userId:b,success:c,...d})}}let e=new d,f=(a,b,c)=>{b instanceof Error?e.error(a,void 0,b):"object"==typeof b&&null!==b?e.error(a,b,c):e.error(a,void 0,c)},g=(a,b)=>e.warn(a,b),h=(a,b)=>e.info(a,b),i=(a,b,c,d,f)=>e.apiLog(a,b,c,d,f)},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},80829:a=>{"use strict";a.exports=require("jsonwebtoken")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[5873,1428,1692,9608],()=>b(b.s=6867));module.exports=c})();