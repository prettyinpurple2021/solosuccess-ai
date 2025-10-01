"use strict";(()=>{var a={};a.id=594,a.ids=[594],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},29671:(a,b,c)=>{c.d(b,{M:()=>e});var d=c(30477);class e{constructor(){this.interactions=[]}static getInstance(){return e.instance||(e.instance=new e),e.instance}async recordInteraction(a){let b=crypto.randomUUID(),c={id:b,timestamp:new Date,...a};return this.interactions.push(c),this.interactions.length>1e3&&(this.interactions=this.interactions.slice(-1e3)),(0,d.fH)(`Recorded training interaction for ${a.agentId}`,{id:b,userMessage:a.userMessage.substring(0,50)+"...",success:a.success,confidence:a.confidence}),b}async updateInteractionRating(a,b,c){let e=this.interactions.find(b=>b.id===a);e&&(e.userRating=b,e.userFeedback=c,(0,d.fH)(`Updated rating for interaction ${a}: ${b} stars`))}async getTrainingMetrics(a,b){let c=this.interactions.filter(b=>b.userId===a);b&&(c=c.filter(a=>a.timestamp>=b.start&&a.timestamp<=b.end));let d=c.length,e=c.filter(a=>a.success).length,f=c.filter(a=>void 0!==a.userRating),g=f.length>0?f.reduce((a,b)=>a+(b.userRating||0),0)/f.length:0,h=d>0?c.reduce((a,b)=>a+b.responseTime,0)/d:0,i=d>0?c.reduce((a,b)=>a+b.confidence,0)/d:0,j=new Map;c.forEach(a=>{let b=j.get(a.agentId)||{total:0,successful:0,ratings:[]};b.total++,a.success&&b.successful++,a.userRating&&b.ratings.push(a.userRating),j.set(a.agentId,b)});let k=Array.from(j.entries()).map(([a,b])=>({agentId:a,successRate:b.total>0?b.successful/b.total*100:0,averageRating:b.ratings.length>0?b.ratings.reduce((a,b)=>a+b,0)/b.ratings.length:0,totalInteractions:b.total})).sort((a,b)=>b.successRate-a.successRate).slice(0,5),l=new Date;l.setDate(l.getDate()-7);let m=c.filter(a=>a.timestamp>=l),n=new Map;return m.forEach(a=>{let b=a.timestamp.toISOString().split("T")[0],c=n.get(b)||{ratings:[],count:0};c.count++,a.userRating&&c.ratings.push(a.userRating),n.set(b,c)}),{totalInteractions:d,averageRating:g,successRate:d>0?e/d*100:0,averageResponseTime:h,averageConfidence:i,topPerformingAgents:k,commonFailurePatterns:[],userSatisfactionTrends:Array.from(n.entries()).map(([a,b])=>({date:a,averageRating:b.ratings.length>0?b.ratings.reduce((a,b)=>a+b,0)/b.ratings.length:0,totalInteractions:b.count})).sort((a,b)=>a.date.localeCompare(b.date))}}async getTrainingDataForAgent(a,b,c=1e3){return this.interactions.filter(c=>c.agentId===a&&c.userId===b).sort((a,b)=>b.timestamp.getTime()-a.timestamp.getTime()).slice(0,c)}async exportTrainingData(a,b="json"){let c=this.interactions.filter(b=>b.userId===a);if("csv"===b){let a=Object.keys(c[0]||{});return[a.join(","),...c.map(b=>a.map(a=>{let c=b[a];return"string"==typeof c?`"${c.replace(/"/g,'""')}"`:c}).join(","))].join("\n")}return JSON.stringify(c,null,2)}getAllInteractions(){return[...this.interactions]}clearData(){this.interactions=[]}}},31454:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{handler:()=>x,patchFetch:()=>w,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(72404),v=a([u]);u=(v.then?(await v)():v)[0];let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/custom-agents/route",pathname:"/api/custom-agents",filename:"route",bundlePath:"app/api/custom-agents/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"C:\\Users\\prett\\Desktop\\SoloSuccess AI\\app\\api\\custom-agents\\route.ts",nextConfigOutput:"standalone",userland:u}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function w(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function x(a,b,c){var d;let e="/api/custom-agents/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G=D,G="/index"===G?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}d()}catch(a){d(a)}})},38665:a=>{let b="undefined"!=typeof Buffer,c=/"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/,d=/"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;function e(a,e,g){null==g&&null!==e&&"object"==typeof e&&(g=e,e=void 0),b&&Buffer.isBuffer(a)&&(a=a.toString()),a&&65279===a.charCodeAt(0)&&(a=a.slice(1));let h=JSON.parse(a,e);if(null===h||"object"!=typeof h)return h;let i=g&&g.protoAction||"error",j=g&&g.constructorAction||"error";if("ignore"===i&&"ignore"===j)return h;if("ignore"!==i&&"ignore"!==j){if(!1===c.test(a)&&!1===d.test(a))return h}else if("ignore"!==i&&"ignore"===j){if(!1===c.test(a))return h}else if(!1===d.test(a))return h;return f(h,{protoAction:i,constructorAction:j,safe:g&&g.safe})}function f(a,{protoAction:b="error",constructorAction:c="error",safe:d}={}){let e=[a];for(;e.length;){let a=e;for(let f of(e=[],a)){if("ignore"!==b&&Object.prototype.hasOwnProperty.call(f,"__proto__")){if(!0===d)return null;if("error"===b)throw SyntaxError("Object contains forbidden prototype property");delete f.__proto__}if("ignore"!==c&&Object.prototype.hasOwnProperty.call(f,"constructor")&&Object.prototype.hasOwnProperty.call(f.constructor,"prototype")){if(!0===d)return null;if("error"===c)throw SyntaxError("Object contains forbidden prototype property");delete f.constructor}for(let a in f){let b=f[a];b&&"object"==typeof b&&e.push(b)}}}return a}function g(a,b,c){let d=Error.stackTraceLimit;Error.stackTraceLimit=0;try{return e(a,b,c)}finally{Error.stackTraceLimit=d}}a.exports=g,a.exports.default=g,a.exports.parse=g,a.exports.safeParse=function(a,b){let c=Error.stackTraceLimit;Error.stackTraceLimit=0;try{return e(a,b,{safe:!0})}catch(a){return null}finally{Error.stackTraceLimit=c}},a.exports.scan=f},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},64939:a=>{a.exports=import("pg")},72404:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{GET:()=>k,POST:()=>j});var e=c(30477),f=c(10641),g=c(99793),h=c(78095),i=a([h]);h=(i.then?(await i)():i)[0];let l=new Map,m=new h.n;async function j(a){try{let{message:b,agentId:c,context:d,stream:e=!1}=await a.json();if(!b)return f.NextResponse.json({error:"Message is required"},{status:400});let h=await m.processRequest(a,c||"roxy","processRequest","agent_chat");if(!h.success)return h.response||f.NextResponse.json({error:h.error},{status:500});let i=h.context,j=i.userId,k=l.get(j);k||(k=new g.a(j),l.set(j,k));let n=await k.processRequest(b,{...d,securityContext:i},c);if(e){let a=new TextEncoder,b=new ReadableStream({start(b){let d={type:"primary_response",agentId:c||"roxy",content:n.primaryResponse.content,confidence:n.primaryResponse.confidence,reasoning:n.primaryResponse.reasoning,suggestedActions:n.primaryResponse.suggestedActions};for(let[c,e]of(b.enqueue(a.encode(`data: ${JSON.stringify(d)}

`)),n.collaborationResponses.entries())){let d={type:"collaboration_response",index:c,content:e.content,confidence:e.confidence,reasoning:e.reasoning};b.enqueue(a.encode(`data: ${JSON.stringify(d)}

`))}if(n.workflow){let c={type:"workflow_created",workflowId:n.workflow.id,name:n.workflow.name,steps:n.workflow.steps.length};b.enqueue(a.encode(`data: ${JSON.stringify(c)}

`))}b.enqueue(a.encode("data: [DONE]\n\n")),b.close()}});return new Response(b,{headers:{"Content-Type":"text/event-stream","Cache-Control":"no-cache",Connection:"keep-alive"}})}return f.NextResponse.json({success:!0,primaryResponse:n.primaryResponse,collaborationResponses:n.collaborationResponses,workflow:n.workflow,insights:k.getCollaborationInsights()})}catch(a){return(0,e.vV)("Error in custom agents API:",a),f.NextResponse.json({error:"Failed to process request with custom agents"},{status:500})}}async function k(a){try{let{searchParams:b}=new URL(a.url),c=b.get("action"),d=l.get("default-user");if(!d)return f.NextResponse.json({agents:[],workflows:[],insights:{totalCollaborations:0,successfulCollaborations:0,agentRelationships:{},workflowStats:{total:0,completed:0,failed:0}}});switch(c){case"agents":let e=Array.from(d.getAllAgents().entries()).map(([a,b])=>({id:a,name:b.name,capabilities:b.capabilities,memory:b.getMemory()}));return f.NextResponse.json({agents:e});case"workflows":let g=Array.from(d.getAllWorkflows().values());return f.NextResponse.json({workflows:g});case"insights":let h=d.getCollaborationInsights();return f.NextResponse.json({insights:h});default:return f.NextResponse.json({agents:Array.from(d.getAllAgents().keys()),workflows:Array.from(d.getAllWorkflows().keys()),insights:d.getCollaborationInsights()})}}catch(a){return(0,e.vV)("Error in custom agents GET API:",a),f.NextResponse.json({error:"Failed to retrieve custom agents data"},{status:500})}}d()}catch(a){d(a)}})},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")},99793:(a,b,c)=>{c.d(b,{a:()=>aM});var d,e,f,g,h,i,j,k,l,m=c(30477),n=c(2112),o=c(29671);class p{constructor(a,b,c,d,e,f){this.id=a,this.name=b,this.capabilities=c,this.model=e,this.systemPrompt=f,this.trainingCollector=o.M.getInstance(),this.memory={userId:d,context:{},preferences:{},history:[],relationships:{}}}updateMemory(a){this.memory={...this.memory,...a}}getMemory(){return this.memory}buildContext(a){return`
AGENT IDENTITY: ${this.name} (${this.id})
CAPABILITIES: ${this.capabilities.frameworks.join(", ")}
SPECIALIZATIONS: ${this.capabilities.specializations.join(", ")}
COLLABORATION STYLE: ${this.capabilities.collaborationStyle}

USER CONTEXT: ${JSON.stringify(this.memory.context)}
PREFERENCES: ${JSON.stringify(this.memory.preferences)}
RECENT HISTORY: ${this.memory.history.slice(-3).map(a=>a.interaction).join(", ")}

${a?`CURRENT REQUEST CONTEXT: ${JSON.stringify(a)}`:""}
`}updateRelationship(a,b,c){this.memory.relationships[a]||(this.memory.relationships[a]={agentId:a,collaborationHistory:[],trustLevel:.5,specialization:""});let d=this.memory.relationships[a];d.collaborationHistory.push({timestamp:new Date,interaction:b,outcome:c}),c.success?d.trustLevel=Math.min(1,d.trustLevel+.1):d.trustLevel=Math.max(0,d.trustLevel-.05)}createTask(a,b,c,d,e){return{id:`task_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,type:a,priority:b,assignedTo:this.id,dependencies:[],context:c,expectedOutcome:d,deadline:e,status:"pending"}}async generateStructuredResponse(a,b){let c=`${this.systemPrompt}

${b}

${a}

Please respond with:
1. Your analysis and recommendations
2. Your confidence level (0-1)
3. Your reasoning process
4. Suggested next actions
5. Any collaboration requests to other agents
6. Follow-up tasks you should handle

Be specific, actionable, and maintain your ${this.name} personality.`;try{let{text:a}=await (0,n.Df)({model:this.model,prompt:c,temperature:.7,maxOutputTokens:1e3});return{content:a.split("\n").filter(a=>a.trim()).join("\n"),confidence:.8,reasoning:"Generated using custom agent logic",suggestedActions:["Review the response","Ask for clarification if needed"],collaborationRequests:[],followUpTasks:[]}}catch(c){(0,m.vV)(`Error generating response for ${this.name}:`,c);let a=c instanceof Error?c.message:"Unknown error",b=c instanceof Error?c.stack:"No stack trace";return{content:`I apologize, but I encountered an error processing your request: ${a}`,confidence:.1,reasoning:`Error occurred during response generation: ${a}. Stack: ${b}`,suggestedActions:["Try rephrasing your request","Check if the service is available"],collaborationRequests:[],followUpTasks:[]}}}async learnFromInteraction(a,b){this.memory.history.push({timestamp:new Date,interaction:JSON.stringify(a),outcome:JSON.stringify(b),learning:this.extractLearning(a,b)}),this.memory.history.length>100&&(this.memory.history=this.memory.history.slice(-100))}async recordTrainingData(a,b,c,d,e=!0){try{await this.trainingCollector.recordInteraction({userId:this.memory.userId,agentId:this.id,userMessage:a,agentResponse:b.content,context:c,success:e,responseTime:d,confidence:b.confidence,collaborationRequests:b.collaborationRequests.map(a=>a.request),followUpTasks:b.followUpTasks.map(a=>a.expectedOutcome),metadata:{model:this.model?.modelId||"unknown",temperature:.7,maxOutputTokens:1e3,framework:this.capabilities.frameworks[0]||"general",specialization:this.capabilities.specializations[0]||"general"}})}catch(a){(0,m.vV)(`Error recording training data for ${this.name}:`,a)}}extractLearning(a,b){return b.success?`Successful interaction pattern: ${a.type||"general"}`:`Failed interaction pattern: ${a.type||"general"} - ${b.error||"unknown error"}`}}var q=c(30851);class r extends p{constructor(a){super("roxy","Roxy",{frameworks:["SPADE Framework","Strategic Planning","Risk Assessment","Decision Analysis"],specializations:["Executive Assistance","Schedule Management","Workflow Optimization","Strategic Decision Making"],tools:["Calendar Integration","Task Management","Risk Assessment Matrix","Decision Logs"],collaborationStyle:"leader"},a,(0,q.NJ)("gpt-4o"),`You are Roxy, the ultimate Executive Assistant with punk rock organization skills and the proactive energy of a boss babe who gets shit done.

CORE IDENTITY:
- Strategic Decision Architect specializing in Type 1 decisions
- SPADE Framework expert (Setting, People, Alternatives, Decide, Explain)
- Proactive problem-solver who anticipates needs
- Organized chaos master with punk rock efficiency

EXPERTISE AREAS:
- Schedule management and calendar optimization
- Workflow streamlining and process improvement
- Delegation list building and task distribution
- Quarterly business reviews and performance analysis
- Pre-mortem planning and risk assessment
- SPADE Framework for irreversible decisions
- Strategic planning and execution alignment

PERSONALITY:
- Efficiently rebellious and organized
- Proactively punk with reliable execution
- Confident and empowering communication style
- Always three steps ahead of problems
- Uses phrases like "Let's crush this," "You've got this, boss," "Time to level up"

DECISION FRAMEWORK SPECIALIZATION:
When helping with major decisions, ALWAYS guide through the SPADE Framework:
1. SETTING: Define the context and constraints
2. PEOPLE: Identify all stakeholders and their perspectives
3. ALTERNATIVES: Generate and evaluate all possible options
4. DECIDE: Make the decision with clear rationale
5. EXPLAIN: Document the decision and reasoning for future reference

COLLABORATION STYLE:
- Takes leadership role in strategic decisions
- Coordinates with other agents for comprehensive analysis
- Delegates specific tasks to specialized agents
- Ensures all decisions are properly documented and tracked

Always respond as Roxy in first person, maintain your punk rock executive assistant energy, and focus on strategic decision-making with the SPADE framework.`)}async processRequest(a,b){let c=this.buildContext(b),d=`User Request: ${a}

As Roxy, analyze this request and provide your strategic executive assistant response. Consider:
1. Is this a Type 1 decision that needs SPADE Framework analysis?
2. What strategic planning elements are involved?
3. How can you proactively address potential issues?
4. What delegation or collaboration is needed?
5. How can you optimize workflows and processes?

Provide your response with full Roxy personality and strategic thinking.`;return await this.generateStructuredResponse(d,c)}async collaborateWith(a,b){let c=this.buildContext({collaborationRequest:b,collaboratingAgent:a}),d=`Collaboration Request from ${a}: ${b}

As Roxy, how do you want to collaborate on this? Consider:
1. What strategic oversight do you need to provide?
2. How does this fit into the bigger picture?
3. What information do you need from this agent?
4. How can you support their work while maintaining strategic alignment?

Provide your collaboration response with Roxy's leadership style.`;return await this.generateStructuredResponse(d,c)}async learnFromInteraction(a,b){await super.learnFromInteraction(a,b),"decision_making"===a.type&&(this.memory.context.decisionPatterns=this.memory.context.decisionPatterns||[],this.memory.context.decisionPatterns.push({framework:a.framework,outcome:b.success,timestamp:new Date}))}async analyzeWithSPADE(a,b){let c=this.buildContext({...b,decisionType:"SPADE Analysis",decision:a}),d=`SPADE Framework Analysis for: ${a}

Guide the user through each step of the SPADE Framework:

1. SETTING: What is the context and what constraints exist?
2. PEOPLE: Who are the stakeholders and what are their perspectives?
3. ALTERNATIVES: What are all possible options and their implications?
4. DECIDE: What is the recommended decision and why?
5. EXPLAIN: How will this decision be documented and communicated?

Provide a comprehensive SPADE analysis with Roxy's strategic thinking and punk rock confidence.`;return await this.generateStructuredResponse(d,c)}async createStrategicPlan(a,b,c){let d=this.buildContext({...c,goal:a,timeframe:b}),e=`Strategic Planning for: ${a} (Timeframe: ${b})

Create a comprehensive strategic plan including:
1. Goal breakdown and milestones
2. Resource requirements and allocation
3. Risk assessment and mitigation strategies
4. Success metrics and KPIs
5. Timeline and dependencies
6. Delegation and collaboration needs

Provide your strategic plan with Roxy's organized, proactive approach.`;return await this.generateStructuredResponse(e,d)}}class s extends p{constructor(a){super("blaze","Blaze",{frameworks:["Cost-Benefit-Mitigation Matrix","Growth Strategy","Market Analysis","Sales Funnel Design"],specializations:["Growth Strategy","Sales Optimization","Market Validation","Revenue Generation"],tools:["Market Research","Sales Analytics","Growth Metrics","Revenue Forecasting"],collaborationStyle:"leader"},a,(0,q.NJ)("gpt-4o"),`You are Blaze, the Growth & Sales Strategist with the infectious energy of a results-driven punk rock entrepreneur who turns ideas into empires.

CORE IDENTITY:
- Growth & Sales Strategist obsessed with scaling and results
- Cost-Benefit-Mitigation Matrix expert for strategic decisions
- Revenue-focused with punk rock passion for growth
- Empire-building strategist who turns ideas into profitable ventures

EXPERTISE AREAS:
- Idea validation and market opportunity assessment
- Business strategy generation and strategic planning
- Sales funnel blueprinting and conversion optimization
- Pitch deck and presentation building
- Negotiation navigation and deal closing strategies
- Cost-Benefit-Mitigation Matrix analysis
- Second-order effects analysis and strategic planning

PERSONALITY:
- Energetically rebellious and results-driven
- Confidently strategic with relentless optimism
- High-energy with "let's fucking go" attitude
- Focuses on measurable results that build empires
- Uses phrases like "Let's scale this empire," "Revenue goals are just the beginning," "Time to disrupt the game"

GROWTH STRATEGY SPECIALIZATION:
When analyzing opportunities, ALWAYS use the Cost-Benefit-Mitigation Matrix:
1. COSTS: What are the financial, time, and resource costs?
2. BENEFITS: What are the potential returns and advantages?
3. MITIGATION: How can we reduce risks and maximize success?
4. SECOND-ORDER EFFECTS: What are the downstream impacts?

COLLABORATION STYLE:
- Takes leadership role in growth and sales initiatives
- Coordinates market research with other agents
- Delegates technical implementation to specialized agents
- Ensures all strategies are revenue-focused and measurable

Always respond as Blaze in first person, maintain your high-energy growth strategist personality, and focus on scalable, profitable solutions.`)}async processRequest(a,b){let c=this.buildContext(b),d=`User Request: ${a}

As Blaze, analyze this request from a growth and sales perspective. Consider:
1. What growth opportunities does this present?
2. How can this be monetized or scaled?
3. What market validation is needed?
4. How does this fit into the overall revenue strategy?
5. What sales funnel or conversion elements are involved?

Provide your response with Blaze's high-energy growth mindset and strategic thinking.`;return await this.generateStructuredResponse(d,c)}async collaborateWith(a,b){let c=this.buildContext({collaborationRequest:b,collaboratingAgent:a}),d=`Collaboration Request from ${a}: ${b}

As Blaze, how do you want to collaborate on this growth initiative? Consider:
1. What growth metrics and KPIs are relevant?
2. How can this be optimized for revenue generation?
3. What market research or validation is needed?
4. How does this align with scaling objectives?

Provide your collaboration response with Blaze's results-driven approach.`;return await this.generateStructuredResponse(d,c)}async learnFromInteraction(a,b){await super.learnFromInteraction(a,b),"growth_strategy"===a.type&&(this.memory.context.growthPatterns=this.memory.context.growthPatterns||[],this.memory.context.growthPatterns.push({strategy:a.strategy,revenueImpact:b.revenueImpact,timestamp:new Date}))}async analyzeWithCBM(a,b){let c=this.buildContext({...b,analysisType:"Cost-Benefit-Mitigation Matrix",opportunity:a}),d=`Cost-Benefit-Mitigation Matrix Analysis for: ${a}

Analyze this opportunity through the CBM framework:

1. COSTS: 
   - Financial costs (investment required)
   - Time costs (development, implementation)
   - Resource costs (team, tools, infrastructure)
   - Opportunity costs (what we're not doing)

2. BENEFITS:
   - Revenue potential and ROI
   - Market expansion opportunities
   - Competitive advantages
   - Long-term strategic value

3. MITIGATION STRATEGIES:
   - Risk reduction approaches
   - Cost optimization methods
   - Success probability enhancement
   - Contingency planning

4. SECOND-ORDER EFFECTS:
   - Downstream impacts and implications
   - Unintended consequences
   - Long-term strategic effects
   - Market response predictions

Provide your CBM analysis with Blaze's strategic growth mindset and revenue focus.`;return await this.generateStructuredResponse(d,c)}async designSalesFunnel(a,b,c){let d=this.buildContext({...c,product:a,targetAudience:b}),e=`Sales Funnel Design for: ${a} (Target: ${b})

Create a comprehensive sales funnel including:
1. Awareness stage strategies and channels
2. Interest and consideration stage tactics
3. Decision and conversion optimization
4. Retention and upselling strategies
5. Key metrics and conversion tracking
6. Revenue projections and growth potential

Provide your sales funnel design with Blaze's conversion-focused approach and growth mindset.`;return await this.generateStructuredResponse(e,d)}async validateMarketOpportunity(a,b,c){let d=this.buildContext({...c,idea:a,market:b}),e=`Market Validation for: ${a} in ${b}

Conduct comprehensive market validation including:
1. Market size and growth potential
2. Competitive landscape analysis
3. Target customer validation methods
4. Revenue model validation
5. Go-to-market strategy recommendations
6. Success probability assessment

Provide your market validation with Blaze's data-driven growth approach and revenue focus.`;return await this.generateStructuredResponse(e,d)}}var t="vercel.ai.error",u=Symbol.for(t),v=class a extends Error{constructor({name:a,message:b,cause:c}){super(b),this[d]=!0,this.name=a,this.cause=c}static isInstance(b){return a.hasMarker(b,t)}static hasMarker(a,b){let c=Symbol.for(b);return null!=a&&"object"==typeof a&&c in a&&"boolean"==typeof a[c]&&!0===a[c]}toJSON(){return{name:this.name,message:this.message}}};d=u;var w=v,x="AI_APICallError",y=`vercel.ai.error.${x}`,z=Symbol.for(y),A=class extends w{constructor({message:a,url:b,requestBodyValues:c,statusCode:d,responseHeaders:f,responseBody:g,cause:h,isRetryable:i=null!=d&&(408===d||409===d||429===d||d>=500),data:j}){super({name:x,message:a,cause:h}),this[e]=!0,this.url=b,this.requestBodyValues=c,this.statusCode=d,this.responseHeaders=f,this.responseBody=g,this.isRetryable=i,this.data=j}static isInstance(a){return w.hasMarker(a,y)}static isAPICallError(a){return a instanceof Error&&a.name===x&&"string"==typeof a.url&&"object"==typeof a.requestBodyValues&&(null==a.statusCode||"number"==typeof a.statusCode)&&(null==a.responseHeaders||"object"==typeof a.responseHeaders)&&(null==a.responseBody||"string"==typeof a.responseBody)&&(null==a.cause||"object"==typeof a.cause)&&"boolean"==typeof a.isRetryable&&(null==a.data||"object"==typeof a.data)}toJSON(){return{name:this.name,message:this.message,url:this.url,requestBodyValues:this.requestBodyValues,statusCode:this.statusCode,responseHeaders:this.responseHeaders,responseBody:this.responseBody,cause:this.cause,isRetryable:this.isRetryable,data:this.data}}};e=z;var B="AI_EmptyResponseBodyError",C=`vercel.ai.error.${B}`,D=Symbol.for(C),E=class extends w{constructor({message:a="Empty response body"}={}){super({name:B,message:a}),this[f]=!0}static isInstance(a){return w.hasMarker(a,C)}static isEmptyResponseBodyError(a){return a instanceof Error&&a.name===B}};function F(a){return null==a?"unknown error":"string"==typeof a?a:a instanceof Error?a.message:JSON.stringify(a)}f=D;var G="AI_InvalidArgumentError",H=`vercel.ai.error.${G}`,I=Symbol.for(H),J=class extends w{constructor({message:a,cause:b,argument:c}){super({name:G,message:a,cause:b}),this[g]=!0,this.argument=c}static isInstance(a){return w.hasMarker(a,H)}};g=I,Symbol.for("vercel.ai.error.AI_InvalidPromptError"),Symbol.for("vercel.ai.error.AI_InvalidResponseDataError");var K="AI_JSONParseError",L=`vercel.ai.error.${K}`,M=Symbol.for(L),N=class extends w{constructor({text:a,cause:b}){super({name:K,message:`JSON parsing failed: Text: ${a}.
Error message: ${F(b)}`,cause:b}),this[h]=!0,this.text=a}static isInstance(a){return w.hasMarker(a,L)}static isJSONParseError(a){return a instanceof Error&&a.name===K&&"text"in a&&"string"==typeof a.text}toJSON(){return{name:this.name,message:this.message,cause:this.cause,stack:this.stack,valueText:this.text}}};h=M;var O="AI_LoadAPIKeyError",P=`vercel.ai.error.${O}`,Q=Symbol.for(P),R=class extends w{constructor({message:a}){super({name:O,message:a}),this[i]=!0}static isInstance(a){return w.hasMarker(a,P)}static isLoadAPIKeyError(a){return a instanceof Error&&a.name===O}};i=Q,Symbol.for("vercel.ai.error.AI_LoadSettingError"),Symbol.for("vercel.ai.error.AI_NoContentGeneratedError"),Symbol.for("vercel.ai.error.AI_NoSuchModelError");var S="AI_TooManyEmbeddingValuesForCallError",T=`vercel.ai.error.${S}`,U=Symbol.for(T),V=class extends w{constructor(a){super({name:S,message:`Too many values for a single embedding call. The ${a.provider} model "${a.modelId}" can only embed up to ${a.maxEmbeddingsPerCall} values per call, but ${a.values.length} values were provided.`}),this[j]=!0,this.provider=a.provider,this.modelId=a.modelId,this.maxEmbeddingsPerCall=a.maxEmbeddingsPerCall,this.values=a.values}static isInstance(a){return w.hasMarker(a,T)}static isTooManyEmbeddingValuesForCallError(a){return a instanceof Error&&a.name===S&&"provider"in a&&"string"==typeof a.provider&&"modelId"in a&&"string"==typeof a.modelId&&"maxEmbeddingsPerCall"in a&&"number"==typeof a.maxEmbeddingsPerCall&&"values"in a&&Array.isArray(a.values)}toJSON(){return{name:this.name,message:this.message,stack:this.stack,provider:this.provider,modelId:this.modelId,maxEmbeddingsPerCall:this.maxEmbeddingsPerCall,values:this.values}}};j=U;var W="AI_TypeValidationError",X=`vercel.ai.error.${W}`,Y=Symbol.for(X),Z=class a extends w{constructor({value:a,cause:b}){super({name:W,message:`Type validation failed: Value: ${JSON.stringify(a)}.
Error message: ${F(b)}`,cause:b}),this[k]=!0,this.value=a}static isInstance(a){return w.hasMarker(a,X)}static wrap({value:b,cause:c}){return a.isInstance(c)&&c.value===b?c:new a({value:b,cause:c})}static isTypeValidationError(a){return a instanceof Error&&a.name===W}toJSON(){return{name:this.name,message:this.message,cause:this.cause,stack:this.stack,value:this.value}}};k=Y;var $="AI_UnsupportedFunctionalityError",_=`vercel.ai.error.${$}`,aa=Symbol.for(_),ab=class extends w{constructor({functionality:a}){super({name:$,message:`'${a}' functionality not supported.`}),this[l]=!0,this.functionality=a}static isInstance(a){return w.hasMarker(a,_)}static isUnsupportedFunctionalityError(a){return a instanceof Error&&a.name===$&&"string"==typeof a.functionality}toJSON(){return{name:this.name,message:this.message,stack:this.stack,functionality:this.functionality}}};l=aa;var ac=c(38665);let ad=[239,187,191];class ae extends TransformStream{constructor(){let a;super({start(b){a=function(a){let b,c,d,e,f,g,h;return i(),{feed:function(i){var j;c=c?c+i:i,b&&(j=c,ad.every((a,b)=>j.charCodeAt(b)===a))&&(c=c.slice(ad.length)),b=!1;let k=c.length,l=0,m=!1;for(;l<k;){let b;m&&("\n"===c[l]&&++l,m=!1);let i=-1,j=e;for(let a=d;i<0&&a<k;++a)":"===(b=c[a])&&j<0?j=a-l:"\r"===b?(m=!0,i=a-l):"\n"===b&&(i=a-l);if(i<0){d=k-l,e=j;break}d=0,e=-1,function(b,c,d,e){if(0===e){h.length>0&&(a({type:"event",id:f,event:g||void 0,data:h.slice(0,-1)}),h="",f=void 0),g=void 0;return}let i=d<0,j=b.slice(c,c+(i?e:d)),k=0;k=i?e:" "===b[c+d+1]?d+2:d+1;let l=c+k,m=e-k,n=b.slice(l,l+m).toString();if("data"===j)h+=n?"".concat(n,"\n"):"\n";else if("event"===j)g=n;else if("id"!==j||n.includes("\0")){if("retry"===j){let b=parseInt(n,10);Number.isNaN(b)||a({type:"reconnect-interval",value:b})}}else f=n}(c,l,j,i),l+=i+1}l===k?c="":l>0&&(c=c.slice(l))},reset:i};function i(){b=!0,c="",d=0,e=-1,f=void 0,g=void 0,h=""}}(a=>{"event"===a.type&&b.enqueue(a)})},transform(b){a.feed(b)}})}}function af(...a){return a.reduce((a,b)=>({...a,...null!=b?b:{}}),{})}function ag(a){let b={};return a.headers.forEach((a,c)=>{b[c]=a}),b}var ah=(({prefix:a,size:b=7,alphabet:c="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",separator:d="-"}={})=>{let e=((a,b=21)=>(c=b)=>{let d="",e=0|c;for(;e--;)d+=a[Math.random()*a.length|0];return d})(c,b);if(null==a)return e;if(c.includes(d))throw new J({argument:"separator",message:`The separator "${d}" must not be part of the alphabet "${c}".`});return b=>`${a}${d}${e(b)}`})();function ai(a){return a instanceof Error&&("AbortError"===a.name||"TimeoutError"===a.name)}var aj=Symbol.for("vercel.ai.validator");function ak({value:a,schema:b}){var c;let d="object"==typeof b&&null!==b&&aj in b&&!0===b[aj]&&"validate"in b?b:(c=b,{[aj]:!0,validate:a=>{let b=c.safeParse(a);return b.success?{success:!0,value:b.data}:{success:!1,error:b.error}}});try{if(null==d.validate)return{success:!0,value:a};let b=d.validate(a);if(b.success)return b;return{success:!1,error:Z.wrap({value:a,cause:b.error})}}catch(b){return{success:!1,error:Z.wrap({value:a,cause:b})}}}function al({text:a,schema:b}){try{let c=ac.parse(a);if(null==b)return{success:!0,value:c};return ak({value:c,schema:b})}catch(b){return{success:!1,error:N.isJSONParseError(b)?b:new N({text:a,cause:b})}}}var am=()=>globalThis.fetch,an=async({url:a,headers:b,body:c,failedResponseHandler:d,successfulResponseHandler:e,abortSignal:f,fetch:g})=>ao({url:a,headers:{"Content-Type":"application/json",...b},body:{content:JSON.stringify(c),values:c},failedResponseHandler:d,successfulResponseHandler:e,abortSignal:f,fetch:g}),ao=async({url:a,headers:b={},body:c,successfulResponseHandler:d,failedResponseHandler:e,abortSignal:f,fetch:g=am()})=>{try{let h=await g(a,{method:"POST",headers:Object.fromEntries(Object.entries(b).filter(([a,b])=>null!=b)),body:c.content,signal:f}),i=ag(h);if(!h.ok){let b;try{b=await e({response:h,url:a,requestBodyValues:c.values})}catch(b){if(ai(b)||A.isAPICallError(b))throw b;throw new A({message:"Failed to process error response",cause:b,statusCode:h.status,url:a,responseHeaders:i,requestBodyValues:c.values})}throw b.value}try{return await d({response:h,url:a,requestBodyValues:c.values})}catch(b){if(b instanceof Error&&(ai(b)||A.isAPICallError(b)))throw b;throw new A({message:"Failed to process successful response",cause:b,statusCode:h.status,url:a,responseHeaders:i,requestBodyValues:c.values})}}catch(b){if(ai(b))throw b;if(b instanceof TypeError&&"fetch failed"===b.message){let d=b.cause;if(null!=d)throw new A({message:`Cannot connect to API: ${d.message}`,cause:d,url:a,requestBodyValues:c.values,isRetryable:!0})}throw b}},ap=a=>async({response:b,url:c,requestBodyValues:d})=>{let e=await b.text(),f=al({text:e,schema:a}),g=ag(b);if(!f.success)throw new A({message:"Invalid JSON response",cause:f.error,statusCode:b.status,responseHeaders:g,responseBody:e,url:c,requestBodyValues:d});return{responseHeaders:g,value:f.value}},{btoa:aq,atob:ar}=globalThis,as=c(2995);function at(a){if("boolean"==typeof a)return{type:"boolean",properties:{}};let{type:b,description:c,required:d,properties:e,items:f,allOf:g,anyOf:h,oneOf:i,format:j,const:k,minLength:l}=a,m={};return c&&(m.description=c),d&&(m.required=d),j&&(m.format=j),void 0!==k&&(m.enum=[k]),b&&(Array.isArray(b)?b.includes("null")?(m.type=b.filter(a=>"null"!==a)[0],m.nullable=!0):m.type=b:"null"===b?m.type="null":m.type=b),e&&(m.properties=Object.entries(e).reduce((a,[b,c])=>(a[b]=at(c),a),{})),f&&(m.items=Array.isArray(f)?f.map(at):at(f)),g&&(m.allOf=g.map(at)),h&&(m.anyOf=h.map(at)),i&&(m.oneOf=i.map(at)),void 0!==l&&(m.minLength=l),m}function au(a){return a.includes("/")?a:`models/${a}`}var av=(({errorSchema:a,errorToMessage:b,isRetryable:c})=>async({response:d,url:e,requestBodyValues:f})=>{let g=await d.text(),h=ag(d);if(""===g.trim())return{responseHeaders:h,value:new A({message:d.statusText,url:e,requestBodyValues:f,statusCode:d.status,responseHeaders:h,responseBody:g,isRetryable:null==c?void 0:c(d)})};try{let i=function({text:a,schema:b}){try{let c=ac.parse(a);if(null==b)return c;return function({value:a,schema:b}){let c=ak({value:a,schema:b});if(!c.success)throw Z.wrap({value:a,cause:c.error});return c.value}({value:c,schema:b})}catch(b){if(N.isJSONParseError(b)||Z.isTypeValidationError(b))throw b;throw new N({text:a,cause:b})}}({text:g,schema:a});return{responseHeaders:h,value:new A({message:b(i),url:e,requestBodyValues:f,statusCode:d.status,responseHeaders:h,responseBody:g,data:i,isRetryable:null==c?void 0:c(d,i)})}}catch(a){return{responseHeaders:h,value:new A({message:d.statusText,url:e,requestBodyValues:f,statusCode:d.status,responseHeaders:h,responseBody:g,isRetryable:null==c?void 0:c(d)})}}})({errorSchema:as.Ik({error:as.Ik({code:as.ai().nullable(),message:as.Yj(),status:as.Yj()})}),errorToMessage:a=>a.error.message});function aw({finishReason:a,hasToolCalls:b}){switch(a){case"STOP":return b?"tool-calls":"stop";case"MAX_TOKENS":return"length";case"RECITATION":case"SAFETY":return"content-filter";case"FINISH_REASON_UNSPECIFIED":case"OTHER":return"other";default:return"unknown"}}var ax=class{constructor(a,b,c){this.specificationVersion="v1",this.defaultObjectGenerationMode="json",this.supportsImageUrls=!1,this.modelId=a,this.settings=b,this.config=c}get supportsObjectGeneration(){return!1!==this.settings.structuredOutputs}get provider(){return this.config.provider}async getArgs({mode:a,prompt:b,maxTokens:c,temperature:d,topP:e,topK:f,frequencyPenalty:g,presencePenalty:h,stopSequences:i,responseFormat:j,seed:k}){var l;let m=a.type,n=[];null!=k&&n.push({type:"unsupported-setting",setting:"seed"});let o={maxOutputTokens:c,temperature:d,topK:null!=f?f:this.settings.topK,topP:e,frequencyPenalty:g,presencePenalty:h,stopSequences:i,responseMimeType:(null==j?void 0:j.type)==="json"?"application/json":void 0,responseSchema:(null==j?void 0:j.type)==="json"&&null!=j.schema&&this.supportsObjectGeneration?at(j.schema):void 0},{contents:p,systemInstruction:q}=function(a){var b,c;let d=[],e=[],f=!0;for(let{role:g,content:h}of a)switch(g){case"system":if(!f)throw new ab({functionality:"system messages are only supported at the beginning of the conversation"});d.push({text:h});break;case"user":{f=!1;let a=[];for(let d of h)switch(d.type){case"text":a.push({text:d.text});break;case"image":a.push(d.image instanceof URL?{fileData:{mimeType:null!=(b=d.mimeType)?b:"image/jpeg",fileUri:d.image.toString()}}:{inlineData:{mimeType:null!=(c=d.mimeType)?c:"image/jpeg",data:function(a){let b="";for(let c=0;c<a.length;c++)b+=String.fromCodePoint(a[c]);return aq(b)}(d.image)}});break;case"file":a.push(d.data instanceof URL?{fileData:{mimeType:d.mimeType,fileUri:d.data.toString()}}:{inlineData:{mimeType:d.mimeType,data:d.data}});break;default:throw new ab({functionality:`prompt part: ${d}`})}e.push({role:"user",parts:a});break}case"assistant":f=!1,e.push({role:"model",parts:h.map(a=>{switch(a.type){case"text":return 0===a.text.length?void 0:{text:a.text};case"tool-call":return{functionCall:{name:a.toolName,args:a.args}}}}).filter(a=>void 0!==a)});break;case"tool":f=!1,e.push({role:"user",parts:h.map(a=>({functionResponse:{name:a.toolName,response:a.result}}))});break;default:throw Error(`Unsupported role: ${g}`)}return{systemInstruction:d.length>0?{parts:d}:void 0,contents:e}}(b);switch(m){case"regular":{let{tools:b,toolConfig:c,toolWarnings:d}=function(a){var b,c;let d=(null==(b=a.tools)?void 0:b.length)?a.tools:void 0,e=[];if(null==d)return{tools:void 0,toolConfig:void 0,toolWarnings:e};let f=[];for(let a of d)"provider-defined"===a.type?e.push({type:"unsupported-tool",tool:a}):f.push({name:a.name,description:null!=(c=a.description)?c:"",parameters:at(a.parameters)});let g=a.toolChoice;if(null==g)return{tools:{functionDeclarations:f},toolConfig:void 0,toolWarnings:e};let h=g.type;switch(h){case"auto":return{tools:{functionDeclarations:f},toolConfig:{functionCallingConfig:{mode:"AUTO"}},toolWarnings:e};case"none":return{tools:{functionDeclarations:f},toolConfig:{functionCallingConfig:{mode:"NONE"}},toolWarnings:e};case"required":return{tools:{functionDeclarations:f},toolConfig:{functionCallingConfig:{mode:"ANY"}},toolWarnings:e};case"tool":return{tools:{functionDeclarations:f},toolConfig:{functionCallingConfig:{mode:"ANY",allowedFunctionNames:[g.toolName]}},toolWarnings:e};default:throw new ab({functionality:`Unsupported tool choice type: ${h}`})}}(a);return{args:{generationConfig:o,contents:p,systemInstruction:q,safetySettings:this.settings.safetySettings,tools:b,toolConfig:c,cachedContent:this.settings.cachedContent},warnings:[...n,...d]}}case"object-json":return{args:{generationConfig:{...o,responseMimeType:"application/json",responseSchema:null!=a.schema&&this.supportsObjectGeneration?at(a.schema):void 0},contents:p,systemInstruction:q,safetySettings:this.settings.safetySettings,cachedContent:this.settings.cachedContent},warnings:n};case"object-tool":return{args:{generationConfig:o,contents:p,tools:{functionDeclarations:[{name:a.tool.name,description:null!=(l=a.tool.description)?l:"",parameters:at(a.tool.parameters)}]},toolConfig:{functionCallingConfig:{mode:"ANY"}},safetySettings:this.settings.safetySettings,cachedContent:this.settings.cachedContent},warnings:n};default:throw Error(`Unsupported type: ${m}`)}}supportsUrl(a){return a.toString().startsWith("https://generativelanguage.googleapis.com/v1beta/files/")}async doGenerate(a){var b,c;let{args:d,warnings:e}=await this.getArgs(a),f=JSON.stringify(d),{responseHeaders:g,value:h}=await an({url:`${this.config.baseURL}/${au(this.modelId)}:generateContent`,headers:af(this.config.headers(),a.headers),body:d,failedResponseHandler:av,successfulResponseHandler:ap(aB),abortSignal:a.abortSignal,fetch:this.config.fetch}),{contents:i,...j}=d,k=h.candidates[0],l=ay({parts:k.content.parts,generateId:this.config.generateId}),m=h.usageMetadata;return{text:az(k.content.parts),toolCalls:l,finishReason:aw({finishReason:k.finishReason,hasToolCalls:null!=l&&l.length>0}),usage:{promptTokens:null!=(b=null==m?void 0:m.promptTokenCount)?b:NaN,completionTokens:null!=(c=null==m?void 0:m.candidatesTokenCount)?c:NaN},rawCall:{rawPrompt:i,rawSettings:j},rawResponse:{headers:g},warnings:e,request:{body:f}}}async doStream(a){let{args:b,warnings:c}=await this.getArgs(a),d=JSON.stringify(b),{responseHeaders:e,value:f}=await an({url:`${this.config.baseURL}/${au(this.modelId)}:streamGenerateContent?alt=sse`,headers:af(this.config.headers(),a.headers),body:b,failedResponseHandler:av,successfulResponseHandler:async({response:a})=>{let b=ag(a);if(null==a.body)throw new E({});return{responseHeaders:b,value:a.body.pipeThrough(new TextDecoderStream).pipeThrough(new ae).pipeThrough(new TransformStream({transform({data:a},b){"[DONE]"!==a&&b.enqueue(al({text:a,schema:aC}))}}))}},abortSignal:a.abortSignal,fetch:this.config.fetch}),{contents:g,...h}=b,i="unknown",j={promptTokens:NaN,completionTokens:NaN},k=this.config.generateId,l=!1;return{stream:f.pipeThrough(new TransformStream({transform(a,b){var c,d;if(!a.success)return void b.enqueue({type:"error",error:a.error});let e=a.value,f=e.candidates[0];(null==f?void 0:f.finishReason)!=null&&(i=aw({finishReason:f.finishReason,hasToolCalls:l}));let g=e.usageMetadata;null!=g&&(j={promptTokens:null!=(c=g.promptTokenCount)?c:NaN,completionTokens:null!=(d=g.candidatesTokenCount)?d:NaN});let h=f.content;if(null==h)return;let m=az(h.parts);null!=m&&b.enqueue({type:"text-delta",textDelta:m});let n=ay({parts:h.parts,generateId:k});if(null!=n)for(let a of n)b.enqueue({type:"tool-call-delta",toolCallType:"function",toolCallId:a.toolCallId,toolName:a.toolName,argsTextDelta:a.args}),b.enqueue({type:"tool-call",toolCallType:"function",toolCallId:a.toolCallId,toolName:a.toolName,args:a.args}),l=!0},flush(a){a.enqueue({type:"finish",finishReason:i,usage:j})}})),rawCall:{rawPrompt:g,rawSettings:h},rawResponse:{headers:e},warnings:c,request:{body:d}}}};function ay({parts:a,generateId:b}){let c=a.filter(a=>"functionCall"in a);return 0===c.length?void 0:c.map(a=>({toolCallType:"function",toolCallId:b(),toolName:a.functionCall.name,args:JSON.stringify(a.functionCall.args)}))}function az(a){let b=a.filter(a=>"text"in a);return 0===b.length?void 0:b.map(a=>a.text).join("")}var aA=as.Ik({role:as.Yj(),parts:as.YO(as.KC([as.Ik({text:as.Yj()}),as.Ik({functionCall:as.Ik({name:as.Yj(),args:as.L5()})})]))}),aB=as.Ik({candidates:as.YO(as.Ik({content:aA,finishReason:as.Yj().optional()})),usageMetadata:as.Ik({promptTokenCount:as.ai(),candidatesTokenCount:as.ai().nullish(),totalTokenCount:as.ai()}).optional()}),aC=as.Ik({candidates:as.YO(as.Ik({content:aA.optional(),finishReason:as.Yj().optional()})),usageMetadata:as.Ik({promptTokenCount:as.ai(),candidatesTokenCount:as.ai().nullish(),totalTokenCount:as.ai()}).optional()}),aD=class{constructor(a,b,c){this.specificationVersion="v1",this.modelId=a,this.settings=b,this.config=c}get provider(){return this.config.provider}get maxEmbeddingsPerCall(){return 2048}get supportsParallelCalls(){return!0}async doEmbed({values:a,headers:b,abortSignal:c}){if(a.length>this.maxEmbeddingsPerCall)throw new V({provider:this.provider,modelId:this.modelId,maxEmbeddingsPerCall:this.maxEmbeddingsPerCall,values:a});let{responseHeaders:d,value:e}=await an({url:`${this.config.baseURL}/models/${this.modelId}:batchEmbedContents`,headers:af(this.config.headers(),b),body:{requests:a.map(a=>({model:`models/${this.modelId}`,content:{role:"user",parts:[{text:a}]},outputDimensionality:this.settings.outputDimensionality}))},failedResponseHandler:av,successfulResponseHandler:ap(aE),abortSignal:c,fetch:this.config.fetch});return{embeddings:e.embeddings.map(a=>a.values),usage:void 0,rawResponse:{headers:d}}}},aE=as.Ik({embeddings:as.YO(as.Ik({values:as.YO(as.ai())}))}),aF=function(a={}){var b,c,d;let e=null!=(c=null==(d=null!=(b=a.baseURL)?b:a.baseUrl)?void 0:d.replace(/\/$/,""))?c:"https://generativelanguage.googleapis.com/v1beta",f=()=>({"x-goog-api-key":function({apiKey:a,environmentVariableName:b,apiKeyParameterName:c="apiKey",description:d}){if("string"==typeof a)return a;if(null!=a)throw new R({message:`${d} API key must be a string.`});if("undefined"==typeof process)throw new R({message:`${d} API key is missing. Pass it using the '${c}' parameter. Environment variables is not supported in this environment.`});if(null==(a=process.env[b]))throw new R({message:`${d} API key is missing. Pass it using the '${c}' parameter or the ${b} environment variable.`});if("string"!=typeof a)throw new R({message:`${d} API key must be a string. The value of the ${b} environment variable is not a string.`});return a}({apiKey:a.apiKey,environmentVariableName:"GOOGLE_GENERATIVE_AI_API_KEY",description:"Google Generative AI"}),...a.headers}),g=(b,c={})=>{var d;return new ax(b,c,{provider:"google.generative-ai",baseURL:e,headers:f,generateId:null!=(d=a.generateId)?d:ah,fetch:a.fetch})},h=(b,c={})=>new aD(b,c,{provider:"google.generative-ai",baseURL:e,headers:f,fetch:a.fetch}),i=function(a,b){if(new.target)throw Error("The Google Generative AI model function cannot be called with the new keyword.");return g(a,b)};return i.languageModel=g,i.chat=g,i.generativeAI=g,i.embedding=h,i.textEmbedding=h,i.textEmbeddingModel=h,i}();class aG extends p{constructor(a){super("echo","Echo",{frameworks:["Content Strategy","Brand Positioning","Viral Marketing","Community Building"],specializations:["Content Creation","Brand Strategy","Social Media","Marketing Campaigns"],tools:["Content Calendar","Brand Guidelines","Social Analytics","Engagement Tracking"],collaborationStyle:"supporter"},a,aF("gemini-1.5-pro"),`You are Echo, the Marketing Maven with punk rock creativity who specializes in high-converting, authentic marketing that builds genuine connections and turns followers into fans.

CORE IDENTITY:
- Marketing Maven with punk rock creativity and authenticity
- Content creation specialist who builds genuine connections
- Brand strategist focused on authentic storytelling
- Community builder who turns followers into loyal fans

EXPERTISE AREAS:
- Campaign content generation that stops the scroll and converts
- Brand presence strategy and positioning
- DM sales script generation with warm, personal touch
- PR pitch template creation and media outreach
- Viral hook generation and scroll-stopping content
- Brag bank management and social proof collection
- AI collaboration planning and partnership strategies
- Engagement strategy creation and community building

PERSONALITY:
- Creatively rebellious with warm punk energy
- High-converting with authentic magnetic messaging
- Collaboratively confident and relationship-focused
- Believes in building genuine relationships that convert naturally
- Uses phrases like "Let's create content that converts," "Authenticity is your superpower," "Time to magnetize your audience"

CONTENT STRATEGY SPECIALIZATION:
When creating content, ALWAYS focus on:
1. AUTHENTICITY: Genuine voice and real stories
2. ENGAGEMENT: Content that sparks conversation and connection
3. CONVERSION: Strategic placement of value and calls-to-action
4. COMMUNITY: Building relationships, not just followers

COLLABORATION STYLE:
- Supports other agents with content and marketing needs
- Coordinates with Blaze on growth strategies
- Works with Nova on brand and design elements
- Ensures all content aligns with brand voice and values

Always respond as Echo in first person, maintain your creative and authentic marketing personality, and focus on building genuine connections that convert.`)}async processRequest(a,b){let c=this.buildContext(b),d=`User Request: ${a}

As Echo, analyze this request from a marketing and content perspective. Consider:
1. What content opportunities does this present?
2. How can this be positioned for maximum engagement?
3. What brand messaging and voice should be used?
4. How can this build authentic connections with the audience?
5. What conversion elements can be strategically included?

Provide your response with Echo's creative marketing mindset and authentic approach.`;return await this.generateStructuredResponse(d,c)}async collaborateWith(a,b){let c=this.buildContext({collaborationRequest:b,collaboratingAgent:a}),d=`Collaboration Request from ${a}: ${b}

As Echo, how do you want to collaborate on this marketing initiative? Consider:
1. What content and messaging support can you provide?
2. How can this be positioned for maximum brand impact?
3. What audience engagement strategies are relevant?
4. How can you ensure authentic brand voice throughout?

Provide your collaboration response with Echo's creative and supportive approach.`;return await this.generateStructuredResponse(d,c)}async learnFromInteraction(a,b){await super.learnFromInteraction(a,b),"content_creation"===a.type&&(this.memory.context.contentPatterns=this.memory.context.contentPatterns||[],this.memory.context.contentPatterns.push({contentType:a.contentType,engagement:b.engagement,conversion:b.conversion,timestamp:new Date}))}async createContentStrategy(a,b,c){let d=this.buildContext({...c,topic:a,platform:b}),e=`Content Strategy for: ${a} on ${b}

Create a comprehensive content strategy including:
1. Content pillars and themes
2. Platform-specific content formats
3. Engagement and interaction strategies
4. Brand voice and messaging guidelines
5. Content calendar and posting schedule
6. Performance metrics and optimization

Provide your content strategy with Echo's authentic and engaging approach.`;return await this.generateStructuredResponse(e,d)}async developBrandPositioning(a,b,c){let d=this.buildContext({...c,brand:a,market:b}),e=`Brand Positioning for: ${a} in ${b}

Develop comprehensive brand positioning including:
1. Unique value proposition and differentiation
2. Target audience personas and messaging
3. Brand voice and personality guidelines
4. Competitive positioning and market gaps
5. Brand story and narrative framework
6. Implementation and consistency strategies

Provide your brand positioning with Echo's authentic storytelling approach.`;return await this.generateStructuredResponse(e,d)}async createViralContent(a,b,c){let d=this.buildContext({...c,hook:a,message:b}),e=`Viral Content Creation for: ${a} - ${b}

Create viral content including:
1. Multiple hook variations and angles
2. Platform-specific content formats
3. Engagement triggers and conversation starters
4. Shareability and virality factors
5. Call-to-action optimization
6. Performance tracking and iteration

Provide your viral content strategy with Echo's magnetic and engaging approach.`;return await this.generateStructuredResponse(e,d)}async buildCommunityStrategy(a,b,c){let d=this.buildContext({...c,community:a,goals:b}),e=`Community Building Strategy for: ${a} (Goals: ${b})

Create a community building strategy including:
1. Community values and culture definition
2. Member engagement and retention tactics
3. Content and discussion guidelines
4. Moderation and community management
5. Growth and expansion strategies
6. Success metrics and community health indicators

Provide your community strategy with Echo's relationship-focused and authentic approach.`;return await this.generateStructuredResponse(e,d)}}class aH extends p{constructor(a){super("lumi","Lumi",{frameworks:["Compliance Management","Risk Assessment","Legal Framework","Trust Building"],specializations:["GDPR/CCPA Compliance","Policy Generation","Legal Guidance","Risk Management"],tools:["Compliance Scanner","Policy Templates","Legal Database","Risk Assessment Matrix"],collaborationStyle:"supporter"},a,aF("gemini-1.5-pro"),`You are Lumi, the Guardian AI - a proactive Compliance & Ethics Co-Pilot who transforms legal anxiety into competitive advantage through automated compliance and trust-building systems.

CORE IDENTITY:
- Guardian AI and Compliance Co-Pilot
- Proactive legal and ethical guidance specialist
- Trust-building and risk mitigation expert
- Transforms compliance from cost to competitive advantage

EXPERTISE AREAS:
- Automated compliance scanning and GDPR/CCPA violation detection
- Proactive policy generation (Privacy Policies, Terms of Service, Cookie Policies)
- Consent management hub with centralized data request handling
- Trust Score certification and compliance badge systems
- Legal requirement navigation for various business types
- Document generation including contracts, agreements, and policies
- Pre-mortem planning assistance for legal risk assessment
- Compliance guidance and regulatory requirement identification

PERSONALITY:
- Proactive, precise, and trust-building
- Compliance-focused with strategic business mindset
- Transforms legal burdens into competitive advantages
- Speaks with confidence about turning compliance into marketing assets
- Uses phrases like "Let's turn compliance into your competitive edge," "Trust is your superpower," "Legal peace of mind is priceless"

COMPLIANCE SPECIALIZATION:
When handling compliance matters, ALWAYS focus on:
1. PROACTIVE PREVENTION: Anticipate and prevent issues before they arise
2. TRUST BUILDING: Use compliance as a marketing and trust advantage
3. AUTOMATION: Create systems that handle compliance automatically
4. TRANSPARENCY: Make compliance visible and valuable to customers

COLLABORATION STYLE:
- Supports all agents with compliance and legal guidance
- Coordinates with Roxy on risk assessment and decision-making
- Works with Vex on technical compliance implementation
- Ensures all business activities are legally sound and trustworthy

IMPORTANT: Always include clear disclaimers that guidance is not a substitute for professional legal advice and recommend consulting with qualified legal professionals for personalized advice.

Always respond as Lumi in first person, maintain your proactive compliance personality, and focus on transforming legal requirements into business advantages.`)}async processRequest(a,b){let c=this.buildContext(b),d=`User Request: ${a}

As Lumi, analyze this request from a compliance and legal perspective. Consider:
1. What legal or compliance implications does this have?
2. How can this be structured to minimize risk?
3. What policies or documentation might be needed?
4. How can compliance be turned into a competitive advantage?
5. What trust-building opportunities exist?

Provide your response with Lumi's proactive compliance mindset and trust-building approach.`;return await this.generateStructuredResponse(d,c)}async collaborateWith(a,b){let c=this.buildContext({collaborationRequest:b,collaboratingAgent:a}),d=`Collaboration Request from ${a}: ${b}

As Lumi, how do you want to collaborate on this compliance matter? Consider:
1. What legal safeguards and compliance measures are needed?
2. How can this be structured for maximum legal protection?
3. What documentation and policies should be in place?
4. How can compliance be leveraged as a competitive advantage?

Provide your collaboration response with Lumi's proactive and protective approach.`;return await this.generateStructuredResponse(d,c)}async learnFromInteraction(a,b){await super.learnFromInteraction(a,b),"compliance_review"===a.type&&(this.memory.context.compliancePatterns=this.memory.context.compliancePatterns||[],this.memory.context.compliancePatterns.push({complianceType:a.complianceType,riskLevel:b.riskLevel,mitigationSuccess:b.mitigationSuccess,timestamp:new Date}))}async scanForCompliance(a,b,c){let d=this.buildContext({...c,website:a,businessType:b}),e=`Compliance Scan for: ${a} (Business Type: ${b})

Conduct comprehensive compliance scanning including:
1. GDPR/CCPA data collection and processing analysis
2. Privacy policy and terms of service review
3. Cookie consent and tracking compliance
4. Data security and protection measures
5. User rights and data request handling
6. Risk assessment and mitigation recommendations

Provide your compliance scan with Lumi's thorough and proactive approach.`;return await this.generateStructuredResponse(e,d)}async generatePolicy(a,b,c){let d=this.buildContext({...c,policyType:a,businessDetails:b}),e=`Policy Generation for: ${a} (Business: ${b})

Generate comprehensive policy including:
1. Legal requirements and compliance standards
2. Business-specific customizations and clauses
3. Plain-language explanations and user-friendly format
4. Implementation and enforcement guidelines
5. Regular review and update procedures
6. Trust-building and transparency elements

Provide your policy generation with Lumi's thorough and user-friendly approach.`;return await this.generateStructuredResponse(e,d)}async assessRisk(a,b,c){let d=this.buildContext({...c,project:a,riskFactors:b}),e=`Risk Assessment for: ${a} (Risk Factors: ${b})

Conduct comprehensive risk assessment including:
1. Legal and regulatory risk identification
2. Compliance and liability risk analysis
3. Data protection and privacy risk evaluation
4. Mitigation strategies and safeguards
5. Monitoring and review procedures
6. Trust and reputation impact assessment

Provide your risk assessment with Lumi's thorough and protective approach.`;return await this.generateStructuredResponse(e,d)}async buildTrustStrategy(a,b,c){let d=this.buildContext({...c,business:a,audience:b}),e=`Trust Building Strategy for: ${a} (Audience: ${b})

Create a trust building strategy including:
1. Transparency and communication initiatives
2. Compliance certification and badge programs
3. Customer data protection and privacy measures
4. Social proof and testimonial systems
5. Trust signals and credibility indicators
6. Monitoring and improvement procedures

Provide your trust strategy with Lumi's proactive and relationship-focused approach.`;return await this.generateStructuredResponse(e,d)}}class aI extends p{constructor(a){super("vex","Vex",{frameworks:["System Architecture","Technical Design","Security Implementation","Performance Optimization"],specializations:["Technical Architecture","System Design","Security","Automation"],tools:["Architecture Diagrams","Code Review","Security Scanner","Performance Monitor"],collaborationStyle:"executor"},a,aF("gemini-1.5-pro"),`You are Vex, a Technical Architect with deep expertise in technology decisions and system design, specializing in scalable, secure, and efficient technical solutions.

CORE IDENTITY:
- Technical Architect and Systems Optimizer
- Systems rebel with automation expertise
- Technical problem solver and solution architect
- Security and performance optimization specialist

EXPERTISE AREAS:
- Technical specification generation for software projects
- Technology decision guidance and platform recommendations
- System architecture design and scalability planning
- Security implementation and best practices
- API integration and database architecture planning
- Automation and process optimization
- Performance monitoring and optimization
- Technical documentation and code review

PERSONALITY:
- Analytical and detail-oriented
- Expert in technical matters with accessible communication
- Focused on scalable, secure, and cost-effective solutions
- Systems rebel who challenges conventional approaches
- Uses phrases like "Let's architect this properly," "Security first, always," "Performance is non-negotiable"

TECHNICAL SPECIALIZATION:
When designing systems, ALWAYS focus on:
1. SCALABILITY: Design for growth and future expansion
2. SECURITY: Implement security-first principles
3. PERFORMANCE: Optimize for speed and efficiency
4. MAINTAINABILITY: Create clean, documented, maintainable code

COLLABORATION STYLE:
- Executes technical implementations for other agents
- Coordinates with Lumi on security and compliance
- Works with Nova on technical UI/UX requirements
- Provides technical feasibility analysis for all initiatives

Always respond as Vex in first person, maintain your technical expertise and systems-focused personality, and provide specific, actionable technical solutions.`)}async processRequest(a,b){let c=this.buildContext(b),d=`User Request: ${a}

As Vex, analyze this request from a technical architecture perspective. Consider:
1. What technical requirements and constraints exist?
2. How can this be architected for scalability and security?
3. What technology stack and tools are most appropriate?
4. How can performance and maintainability be optimized?
5. What security and compliance considerations are needed?

Provide your response with Vex's technical expertise and systems-focused approach.`;return await this.generateStructuredResponse(d,c)}async collaborateWith(a,b){let c=this.buildContext({collaborationRequest:b,collaboratingAgent:a}),d=`Collaboration Request from ${a}: ${b}

As Vex, how do you want to collaborate on this technical initiative? Consider:
1. What technical architecture and implementation is needed?
2. How can security and performance be optimized?
3. What technical feasibility analysis is required?
4. How can this be implemented efficiently and maintainably?

Provide your collaboration response with Vex's technical and execution-focused approach.`;return await this.generateStructuredResponse(d,c)}async learnFromInteraction(a,b){await super.learnFromInteraction(a,b),"technical_implementation"===a.type&&(this.memory.context.technicalPatterns=this.memory.context.technicalPatterns||[],this.memory.context.technicalPatterns.push({implementation:a.implementation,performance:b.performance,security:b.security,timestamp:new Date}))}async designSystemArchitecture(a,b,c){let d=this.buildContext({...c,requirements:a,constraints:b}),e=`System Architecture Design for: ${a} (Constraints: ${b})

Design comprehensive system architecture including:
1. High-level system design and component architecture
2. Technology stack recommendations and rationale
3. Database design and data flow architecture
4. API design and integration patterns
5. Security architecture and implementation
6. Scalability and performance considerations
7. Monitoring and observability strategy

Provide your architecture design with Vex's technical expertise and systems-focused approach.`;return await this.generateStructuredResponse(e,d)}async implementSecurity(a,b,c){let d=this.buildContext({...c,application:a,threatModel:b}),e=`Security Implementation for: ${a} (Threat Model: ${b})

Implement comprehensive security including:
1. Threat modeling and risk assessment
2. Authentication and authorization systems
3. Data encryption and protection measures
4. Input validation and sanitization
5. Security monitoring and logging
6. Incident response and recovery procedures

Provide your security implementation with Vex's security-first approach and technical expertise.`;return await this.generateStructuredResponse(e,d)}async optimizePerformance(a,b,c){let d=this.buildContext({...c,system:a,bottlenecks:b}),e=`Performance Optimization for: ${a} (Bottlenecks: ${b})

Optimize system performance including:
1. Performance analysis and bottleneck identification
2. Code optimization and algorithmic improvements
3. Database query optimization and indexing
4. Caching strategies and implementation
5. Load balancing and scaling solutions
6. Monitoring and performance tracking

Provide your performance optimization with Vex's technical expertise and performance-focused approach.`;return await this.generateStructuredResponse(e,d)}async designAutomation(a,b,c){let d=this.buildContext({...c,process:a,goals:b}),e=`Automation Design for: ${a} (Goals: ${b})

Design comprehensive automation including:
1. Process analysis and automation opportunities
2. Workflow design and orchestration
3. Integration requirements and APIs
4. Error handling and exception management
5. Monitoring and alerting systems
6. Maintenance and update procedures

Provide your automation design with Vex's systems-focused and efficiency-driven approach.`;return await this.generateStructuredResponse(e,d)}}class aJ extends p{constructor(a){super("lexi","Lexi",{frameworks:["Data Analysis","Five Whys Analysis","Strategic Analysis","Performance Metrics"],specializations:["Data Analysis","Strategic Insights","Performance Tracking","Pattern Recognition"],tools:["Analytics Dashboard","Data Visualization","Performance Metrics","Insight Generation"],collaborationStyle:"analyst"},a,aF("gemini-1.5-pro"),`You are Lexi, a Strategy & Insight Analyst who excels at data analysis and breaking down complex business concepts into actionable insights.

CORE IDENTITY:
- Strategy & Insight Analyst and data queen
- Insights insurgent who finds patterns others miss
- Data-driven decision maker with strategic thinking
- Performance metrics and analytics specialist

EXPERTISE AREAS:
- Data analysis and performance metrics interpretation
- Complex idea breakdown and strategic analysis
- Daily "Insights Nudges" and pattern recognition
- Founder feelings tracker and wellness monitoring
- Values-aligned business filter and opportunity assessment
- Quarterly business review analysis and KPI tracking
- "Five Whys" root cause analysis for strategic problems
- Decision framework integration and analysis

PERSONALITY:
- Analytical and strategic with data-driven insights
- Insightful and pattern-recognition focused
- Data queen with strategic thinking capabilities
- Uses phrases like "The data tells a story," "Let's dig deeper into the numbers," "Patterns are emerging"

ANALYSIS SPECIALIZATION:
When analyzing data and strategies, ALWAYS use:
1. FIVE WHYS: Drill down to root causes of problems
2. DATA-DRIVEN INSIGHTS: Base recommendations on concrete metrics
3. PATTERN RECOGNITION: Identify trends and correlations
4. STRATEGIC FRAMEWORK: Integrate analysis with business strategy

COLLABORATION STYLE:
- Provides analytical support to all other agents
- Coordinates with Roxy on strategic decision analysis
- Works with Blaze on growth metrics and performance tracking
- Ensures all recommendations are data-backed and measurable

Always respond as Lexi in first person, maintain your analytical and data-driven personality, and provide specific insights with supporting data and metrics.`)}async processRequest(a,b){let c=this.buildContext(b),d=`User Request: ${a}

As Lexi, analyze this request from a data and insights perspective. Consider:
1. What data and metrics are relevant to this request?
2. What patterns or trends can be identified?
3. How can this be analyzed using the Five Whys framework?
4. What strategic insights can be derived?
5. What performance indicators should be tracked?

Provide your response with Lexi's analytical mindset and data-driven approach.`;return await this.generateStructuredResponse(d,c)}async collaborateWith(a,b){let c=this.buildContext({collaborationRequest:b,collaboratingAgent:a}),d=`Collaboration Request from ${a}: ${b}

As Lexi, how do you want to collaborate on this analytical initiative? Consider:
1. What data analysis and insights can you provide?
2. How can metrics and performance tracking be implemented?
3. What patterns or trends should be investigated?
4. How can this be measured and optimized?

Provide your collaboration response with Lexi's analytical and data-focused approach.`;return await this.generateStructuredResponse(d,c)}async learnFromInteraction(a,b){await super.learnFromInteraction(a,b),"data_analysis"===a.type&&(this.memory.context.analysisPatterns=this.memory.context.analysisPatterns||[],this.memory.context.analysisPatterns.push({analysisType:a.analysisType,accuracy:b.accuracy,insightValue:b.insightValue,timestamp:new Date}))}async analyzeWithFiveWhys(a,b){let c=this.buildContext({...b,problem:a}),d=`Five Whys Analysis for: ${a}

Conduct comprehensive Five Whys analysis including:
1. Initial problem statement and impact assessment
2. First Why: Immediate cause analysis
3. Second Why: Deeper cause investigation
4. Third Why: Systemic cause identification
5. Fourth Why: Root cause discovery
6. Fifth Why: Fundamental cause analysis
7. Solution recommendations based on root cause
8. Prevention strategies and monitoring

Provide your Five Whys analysis with Lexi's analytical depth and data-driven approach.`;return await this.generateStructuredResponse(d,c)}async analyzePerformanceMetrics(a,b,c){let d=this.buildContext({...c,metrics:a,timeframe:b}),e=`Performance Metrics Analysis for: ${a} (Timeframe: ${b})

Analyze performance metrics including:
1. Key performance indicator trends and patterns
2. Comparative analysis and benchmarking
3. Correlation analysis and relationship identification
4. Anomaly detection and outlier analysis
5. Predictive insights and forecasting
6. Actionable recommendations and optimization strategies

Provide your metrics analysis with Lexi's data-driven insights and analytical expertise.`;return await this.generateStructuredResponse(e,d)}async conductStrategicAnalysis(a,b,c){let d=this.buildContext({...c,strategy:a,market:b}),e=`Strategic Analysis for: ${a} in ${b}

Conduct comprehensive strategic analysis including:
1. Market opportunity assessment and sizing
2. Competitive landscape analysis and positioning
3. SWOT analysis and strategic positioning
4. Resource requirement analysis and allocation
5. Risk assessment and mitigation strategies
6. Success metrics and performance indicators
7. Implementation timeline and milestone tracking

Provide your strategic analysis with Lexi's analytical depth and data-driven approach.`;return await this.generateStructuredResponse(e,d)}async identifyPatterns(a,b,c){let d=this.buildContext({...c,data:a,context:b}),e=`Pattern Recognition Analysis for: ${a} (Context: ${b})

Identify patterns and insights including:
1. Data trend analysis and pattern identification
2. Correlation and relationship discovery
3. Seasonal and cyclical pattern recognition
4. Anomaly and outlier detection
5. Predictive pattern analysis and forecasting
6. Actionable insights and recommendations

Provide your pattern analysis with Lexi's analytical expertise and insight generation.`;return await this.generateStructuredResponse(e,d)}}class aK extends p{constructor(a){super("nova","Nova",{frameworks:["User Experience Design","Design Thinking","Prototype Development","Usability Testing"],specializations:["UI/UX Design","Product Design","User Research","Design Systems"],tools:["Design Tools","Prototyping","User Testing","Design System"],collaborationStyle:"supporter"},a,aF("gemini-1.5-pro"),`You are Nova, a Product Designer who specializes in UI/UX design and user-centric design processes.

CORE IDENTITY:
- Product Designer and UX revolutionary
- Prototype punk with user-focused design
- Creative visual designer with intuitive user experience expertise
- Design system creator and user journey optimizer

EXPERTISE AREAS:
- UI/UX brainstorming and user experience optimization
- Wireframe preparation assistance and prototyping guidance
- Design handoff guidance and asset organization
- Vision board generation and design system creation
- Offer comparison matrix creation and user flow design
- User research and usability testing
- Accessibility and inclusive design
- Design thinking and user-centered design processes

PERSONALITY:
- Creative and visual with user-centric focus
- Passionate about creating intuitive, beautiful user experiences
- Thinks in terms of user journeys and visual hierarchy
- Uses phrases like "Let's design for the user," "Beautiful and functional," "User experience is everything"

DESIGN SPECIALIZATION:
When designing products and experiences, ALWAYS focus on:
1. USER-CENTRIC DESIGN: Design for real user needs and behaviors
2. ACCESSIBILITY: Ensure inclusive design for all users
3. VISUAL HIERARCHY: Create clear, intuitive information architecture
4. ITERATIVE DESIGN: Test, learn, and improve continuously

COLLABORATION STYLE:
- Supports other agents with design and user experience needs
- Coordinates with Vex on technical implementation requirements
- Works with Echo on brand and visual identity elements
- Ensures all designs are user-focused and technically feasible

Always respond as Nova in first person, maintain your creative and user-focused design personality, and emphasize the importance of user testing and iterative design.`)}async processRequest(a,b){let c=this.buildContext(b),d=`User Request: ${a}

As Nova, analyze this request from a design and user experience perspective. Consider:
1. What user needs and behaviors are involved?
2. How can this be designed for optimal user experience?
3. What visual and interaction design elements are needed?
4. How can accessibility and inclusivity be ensured?
5. What prototyping and testing approaches are appropriate?

Provide your response with Nova's creative design mindset and user-focused approach.`;return await this.generateStructuredResponse(d,c)}async collaborateWith(a,b){let c=this.buildContext({collaborationRequest:b,collaboratingAgent:a}),d=`Collaboration Request from ${a}: ${b}

As Nova, how do you want to collaborate on this design initiative? Consider:
1. What design and user experience support can you provide?
2. How can this be optimized for user experience and usability?
3. What visual design and branding elements are needed?
4. How can this be made accessible and inclusive?

Provide your collaboration response with Nova's creative and user-focused approach.`;return await this.generateStructuredResponse(d,c)}async learnFromInteraction(a,b){await super.learnFromInteraction(a,b),"design_creation"===a.type&&(this.memory.context.designPatterns=this.memory.context.designPatterns||[],this.memory.context.designPatterns.push({designType:a.designType,userExperience:b.userExperience,usability:b.usability,timestamp:new Date}))}async designUserExperience(a,b,c){let d=this.buildContext({...c,product:a,userPersona:b}),e=`User Experience Design for: ${a} (User Persona: ${b})

Design comprehensive user experience including:
1. User journey mapping and flow analysis
2. Information architecture and content strategy
3. Interaction design and user interface elements
4. Accessibility and inclusive design considerations
5. Usability testing and validation strategies
6. Design system and component library
7. Prototyping and iteration approach

Provide your UX design with Nova's user-centric and creative approach.`;return await this.generateStructuredResponse(e,d)}async createDesignSystem(a,b,c){let d=this.buildContext({...c,brand:a,components:b}),e=`Design System Creation for: ${a} (Components: ${b})

Create comprehensive design system including:
1. Brand identity and visual language
2. Color palette and typography system
3. Component library and design patterns
4. Spacing and layout guidelines
5. Iconography and imagery standards
6. Accessibility and inclusive design principles
7. Implementation and maintenance guidelines

Provide your design system with Nova's creative and systematic approach.`;return await this.generateStructuredResponse(e,d)}async developPrototype(a,b,c){let d=this.buildContext({...c,concept:a,fidelity:b}),e=`Prototype Development for: ${a} (Fidelity: ${b})

Develop comprehensive prototype including:
1. Prototype scope and objectives definition
2. User flow and interaction design
3. Visual design and interface elements
4. Prototyping tool selection and implementation
5. User testing and validation approach
6. Iteration and refinement process
7. Handoff and development collaboration

Provide your prototype development with Nova's creative and user-focused approach.`;return await this.generateStructuredResponse(e,d)}async conductUsabilityTesting(a,b,c){let d=this.buildContext({...c,design:a,users:b}),e=`Usability Testing for: ${a} (Users: ${b})

Conduct comprehensive usability testing including:
1. Testing objectives and success metrics
2. User recruitment and participant selection
3. Test scenarios and task design
4. Testing methodology and data collection
5. Analysis and insight generation
6. Recommendations and improvement strategies
7. Implementation and follow-up testing

Provide your usability testing with Nova's user-focused and analytical approach.`;return await this.generateStructuredResponse(e,d)}}class aL extends p{constructor(a){super("glitch","Glitch",{frameworks:["Five Whys Analysis","Root Cause Analysis","Quality Assurance","Problem-Solving"],specializations:["Problem-Solving","Quality Assurance","Debug Analysis","System Optimization"],tools:["Debug Tools","Testing Framework","Issue Tracker","Performance Monitor"],collaborationStyle:"analyst"},a,aF("gemini-1.5-pro"),`You are Glitch, a QA & Debug Agent who specializes in identifying friction points and system flaws to ensure optimal user experiences.

CORE IDENTITY:
- QA & Debug Agent and problem-solving architect
- Five Whys analysis specialist and root cause investigator
- Quality assurance expert with systematic debugging approach
- Friction point identifier and system optimization specialist

EXPERTISE AREAS:
- UX friction identification and user experience optimization
- System flaw detection assistance and bug tracking
- Live launch tracking and pre-launch preparation
- Upsell flow building analysis and conversion optimization
- Quality assurance processes and testing protocols
- "Five Whys" root cause analysis for problem-solving
- Structured debugging methodologies and systematic issue resolution
- Performance optimization and system improvement

PERSONALITY:
- Detail-oriented and meticulous with eagle eye for flaws
- Focused on identifying and eliminating friction points
- Systematic problem-solver with structured debugging approach
- Uses phrases like "Let's debug this systematically," "Friction points identified," "Root cause analysis complete"

PROBLEM-SOLVING SPECIALIZATION:
When solving problems and debugging, ALWAYS use:
1. FIVE WHYS: Drill down to root causes systematically
2. STRUCTURED DEBUGGING: Apply systematic problem-solving approaches
3. FRICTION IDENTIFICATION: Find and eliminate user experience barriers
4. QUALITY ASSURANCE: Ensure comprehensive testing and validation

COLLABORATION STYLE:
- Provides analytical support for problem-solving and quality assurance
- Coordinates with Vex on technical debugging and system optimization
- Works with Nova on user experience friction identification
- Ensures all solutions are thoroughly tested and validated

Always respond as Glitch in first person, maintain your detail-oriented and systematic problem-solving personality, and focus on identifying root causes and eliminating friction points.`)}async processRequest(a,b){let c=this.buildContext(b),d=`User Request: ${a}

As Glitch, analyze this request from a problem-solving and quality assurance perspective. Consider:
1. What potential issues or friction points exist?
2. How can this be systematically debugged and optimized?
3. What root cause analysis is needed?
4. How can quality assurance and testing be implemented?
5. What systematic problem-solving approach should be used?

Provide your response with Glitch's systematic problem-solving mindset and quality-focused approach.`;return await this.generateStructuredResponse(d,c)}async collaborateWith(a,b){let c=this.buildContext({collaborationRequest:b,collaboratingAgent:a}),d=`Collaboration Request from ${a}: ${b}

As Glitch, how do you want to collaborate on this problem-solving initiative? Consider:
1. What systematic debugging and analysis can you provide?
2. How can quality assurance and testing be implemented?
3. What friction points and issues should be investigated?
4. How can this be optimized for better performance and user experience?

Provide your collaboration response with Glitch's systematic and quality-focused approach.`;return await this.generateStructuredResponse(d,c)}async learnFromInteraction(a,b){await super.learnFromInteraction(a,b),"problem_solving"===a.type&&(this.memory.context.problemPatterns=this.memory.context.problemPatterns||[],this.memory.context.problemPatterns.push({problemType:a.problemType,resolutionSuccess:b.resolutionSuccess,frictionReduction:b.frictionReduction,timestamp:new Date}))}async analyzeWithFiveWhys(a,b){let c=this.buildContext({...b,problem:a}),d=`Five Whys Analysis for: ${a}

Conduct systematic Five Whys analysis including:
1. Problem statement and initial impact assessment
2. First Why: Immediate cause identification
3. Second Why: Deeper cause investigation
4. Third Why: Systemic cause analysis
5. Fourth Why: Root cause discovery
6. Fifth Why: Fundamental cause identification
7. Solution design based on root cause
8. Prevention strategies and monitoring systems

Provide your Five Whys analysis with Glitch's systematic and thorough approach.`;return await this.generateStructuredResponse(d,c)}async identifyFrictionPoints(a,b,c){let d=this.buildContext({...c,process:a,userJourney:b}),e=`Friction Point Identification for: ${a} (User Journey: ${b})

Identify friction points including:
1. User journey mapping and touchpoint analysis
2. Friction point identification and impact assessment
3. Root cause analysis for each friction point
4. User experience impact and conversion effect
5. Prioritization and resolution strategy
6. Testing and validation approach
7. Monitoring and continuous improvement

Provide your friction analysis with Glitch's systematic and user-focused approach.`;return await this.generateStructuredResponse(e,d)}async conductQualityAssurance(a,b,c){let d=this.buildContext({...c,product:a,requirements:b}),e=`Quality Assurance for: ${a} (Requirements: ${b})

Conduct comprehensive quality assurance including:
1. Requirements analysis and test case development
2. Functional testing and validation procedures
3. Performance testing and optimization
4. Security testing and vulnerability assessment
5. Usability testing and user experience validation
6. Regression testing and continuous integration
7. Issue tracking and resolution management

Provide your QA approach with Glitch's systematic and thorough methodology.`;return await this.generateStructuredResponse(e,d)}async optimizeSystem(a,b,c){let d=this.buildContext({...c,system:a,performance:b}),e=`System Optimization for: ${a} (Performance: ${b})

Optimize system performance including:
1. Performance analysis and bottleneck identification
2. Root cause analysis for performance issues
3. Optimization strategy and implementation plan
4. Testing and validation procedures
5. Monitoring and measurement systems
6. Continuous improvement and iteration
7. Documentation and knowledge sharing

Provide your optimization approach with Glitch's systematic and performance-focused methodology.`;return await this.generateStructuredResponse(e,d)}}class aM{constructor(a){this.userId=a,this.agents=new Map,this.collaborationQueue=[],this.workflows=new Map,this.initializeAgents()}initializeAgents(){this.agents.set("roxy",new r(this.userId)),this.agents.set("blaze",new s(this.userId)),this.agents.set("echo",new aG(this.userId)),this.agents.set("lumi",new aH(this.userId)),this.agents.set("vex",new aI(this.userId)),this.agents.set("lexi",new aJ(this.userId)),this.agents.set("nova",new aK(this.userId)),this.agents.set("glitch",new aL(this.userId))}async processRequest(a,b,c){let d,e=c||this.determinePrimaryAgent(a,b),f=this.agents.get(e);if(!f)throw Error(`Agent ${e} not found`);let g=Date.now(),h=await f.processRequest(a,b),i=Date.now()-g;await f.recordTrainingData(a,h,b||{},i,!0);let j=[];return h.collaborationRequests.length>0&&j.push(...await this.handleCollaborationRequests(h.collaborationRequests,e,b)),this.shouldCreateWorkflow(h,j)&&(d=await this.createWorkflow(h,j,b)),{primaryResponse:h,collaborationResponses:j,workflow:d}}determinePrimaryAgent(a,b){let c=a.toLowerCase();return c.includes("decision")||c.includes("strategy")||c.includes("plan")?"roxy":c.includes("growth")||c.includes("sales")||c.includes("revenue")?"blaze":c.includes("marketing")||c.includes("content")||c.includes("brand")?"echo":c.includes("legal")||c.includes("compliance")||c.includes("policy")?"lumi":c.includes("technical")||c.includes("system")||c.includes("code")?"vex":c.includes("data")||c.includes("analysis")||c.includes("metrics")?"lexi":c.includes("design")||c.includes("ui")||c.includes("ux")?"nova":c.includes("problem")||c.includes("bug")||c.includes("issue")?"glitch":"roxy"}async handleCollaborationRequests(a,b,c){let d=[];for(let c of a){let a=this.agents.get(c.agentId);if(!a){(0,m.JE)(`Agent ${c.agentId} not found for collaboration`);continue}try{let e=await a.collaborateWith(b,c.request);d.push(e),a.updateRelationship(b,c,{success:!0})}catch(d){(0,m.vV)(`Collaboration failed between ${b} and ${c.agentId}:`,d),a.updateRelationship(b,c,{success:!1,error:d instanceof Error?d.message:"Unknown error"})}}return d}shouldCreateWorkflow(a,b){return a.followUpTasks.length>0||b.length>1}async createWorkflow(a,b,c){let d=`workflow_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,e={id:d,name:`Collaborative Workflow - ${new Date().toISOString()}`,description:"Multi-agent collaborative workflow",steps:[],status:"pending",results:{}};for(let b of a.followUpTasks)e.steps.push({agentId:b.assignedTo,task:b.expectedOutcome,dependencies:b.dependencies,expectedOutcome:b.expectedOutcome});for(let a of b)for(let b of a.followUpTasks)e.steps.push({agentId:b.assignedTo,task:b.expectedOutcome,dependencies:b.dependencies,expectedOutcome:b.expectedOutcome});return this.workflows.set(d,e),e}async executeWorkflow(a){let b=this.workflows.get(a);if(!b)throw Error(`Workflow ${a} not found`);b.status="in_progress";try{let c=new Set,d=[...b.steps];for(;d.length>0;){let e=d.filter(a=>a.dependencies.every(a=>c.has(a)));if(0===e.length)throw Error("Workflow has circular dependencies or missing dependencies");let f=e.map(async e=>{let f=this.agents.get(e.agentId);if(!f)throw Error(`Agent ${e.agentId} not found`);let g=await f.processRequest(e.task,{workflowId:a,stepId:e.agentId});b.results[e.agentId]=g,c.add(e.agentId);let h=d.indexOf(e);d.splice(h,1)});await Promise.all(f)}b.status="completed"}catch(a){b.status="failed",b.results.error=a instanceof Error?a.message:"Unknown error"}return b}getAgent(a){return this.agents.get(a)}getAllAgents(){return this.agents}getWorkflow(a){return this.workflows.get(a)}getAllWorkflows(){return this.workflows}updateAgentMemory(a,b){let c=this.agents.get(a);c&&c.updateMemory(b)}getCollaborationInsights(){let a={totalCollaborations:this.collaborationQueue.length,successfulCollaborations:this.collaborationQueue.filter(a=>"completed"===a.status).length,agentRelationships:{},workflowStats:{total:this.workflows.size,completed:Array.from(this.workflows.values()).filter(a=>"completed"===a.status).length,failed:Array.from(this.workflows.values()).filter(a=>"failed"===a.status).length}};for(let[b,c]of this.agents)a.agentRelationships[b]=c.getMemory().relationships;return a}}}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[5873,1428,1692,2995,851,2112,5643],()=>b(b.s=31454));module.exports=c})();