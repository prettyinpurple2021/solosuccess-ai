exports.id=1050,exports.ids=[1050,4291],exports.modules={30477:(a,b,c)=>{"use strict";c.d(b,{HG:()=>i,JE:()=>g,fH:()=>h,vF:()=>e,vV:()=>f});class d{constructor(){this.isDevelopment=!1,this.logLevel=this.isDevelopment?3:2}shouldLog(a){return a<=this.logLevel}formatLogEntry(a){let b=["ERROR","WARN","INFO","DEBUG"][a.level],c=`[${a.timestamp}] ${b}: ${a.message}`;return a.context&&Object.keys(a.context).length>0&&(c+=` | Context: ${JSON.stringify(a.context)}`),a.error&&(c+=` | Error: ${a.error.message}`,this.isDevelopment&&a.error.stack&&(c+=` | Stack: ${a.error.stack}`)),c}log(a,b,c,d){if(!this.shouldLog(a))return;let e={level:a,message:b,timestamp:new Date().toISOString(),context:c,error:d},f=this.formatLogEntry(e);0===a&&console.error(f),!this.isDevelopment&&a<=1&&this.sendToExternalService(e)}async sendToExternalService(a){}error(a,b,c){this.log(0,a,b,c)}warn(a,b){this.log(1,a,b)}info(a,b){this.log(2,a,b)}debug(a,b){this.log(3,a,b)}apiLog(a,b,c,d,e){let f=`${a} ${b} - ${c}${d?` (${d}ms)`:""}`,g=c>=500?0:c>=400?1:2;this.log(g,f,{method:a,path:b,statusCode:c,duration:d,...e})}dbLog(a,b,c,d){let e=`DB ${a} on ${b}${c?` (${c}ms)`:""}`;this.log(3,e,{operation:a,table:b,duration:c,...d})}authLog(a,b,c=!0,d){let e=`Auth ${a}${b?` for user ${b}`:""} - ${c?"SUCCESS":"FAILED"}`;this.log(c?2:1,e,{action:a,userId:b,success:c,...d})}}let e=new d,f=(a,b,c)=>{b instanceof Error?e.error(a,void 0,b):"object"==typeof b&&null!==b?e.error(a,b,c):e.error(a,void 0,c)},g=(a,b)=>e.warn(a,b),h=(a,b)=>e.info(a,b),i=(a,b,c,d,f)=>e.apiLog(a,b,c,d,f)},42981:(a,b,c)=>{"use strict";function d(a,b,c,d){let e,f=(globalThis.__rateLimits||(globalThis.__rateLimits=new Map),(e=globalThis.__rateLimits.get(a))||(e=new Map,globalThis.__rateLimits.set(a,e)),e),g=Date.now(),h=f.get(b);if(!h||g-h.ts>c)return f.set(b,{count:1,ts:g}),{allowed:!0,remaining:d-1};h.count+=1,h.ts=g;let i=Math.max(0,d-h.count);return{allowed:h.count<=d,remaining:i}}async function e(a,b){let c=function(a){let b=a.headers.get("x-forwarded-for");if(b)return b.split(",")[0].trim();let c=a.headers.get("x-real-ip");if(c)return c;let d=a.headers.get("cf-connecting-ip");return d||"127.0.0.1"}(a),e=d(a.url||"default",c,1e3*b.window,b.requests);return{...e,success:e.allowed}}function f(a,b,c,f){if(a instanceof Request&&"object"==typeof b)return e(a,b);if("string"==typeof a&&"string"==typeof b&&c&&f)return d(a,b,c,f);throw Error("Invalid rateLimitByIp arguments")}c.d(b,{E:()=>f})},67939:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{KU:()=>j,P:()=>k,UU:()=>i});var e=c(30477),f=c(64939),g=a([f]);f=(g.then?(await g)():g)[0];let h=null,i=()=>{if(!h){let a="postgresql://neondb_owner:npg_MRLUf85DBNPv@ep-curly-meadow-aefoagku-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";if(!a)throw Error("Missing Neon database environment variables. Please set DATABASE_URL");(h=new f.Pool({connectionString:a,ssl:{rejectUnauthorized:!1},max:20,idleTimeoutMillis:3e4,connectionTimeoutMillis:2e3})).on("error",a=>{(0,e.vV)("Unexpected error on idle client",a)})}return h},j=async()=>{let a=i();return await a.connect()},k=async(a,b)=>{let c=await j();try{return await c.query(a,b)}finally{c.release()}};d()}catch(a){d(a)}})},74291:(a,b,c)=>{"use strict";c.d(b,{_:()=>m,authenticateRequest:()=>l});var d=c(30477);c(10641);var e=c(86802),f=c(80829),g=c.n(f),h=c(94570),i=c(41393),j=c(48689);async function k(){try{let a=await (0,e.b3)(),b=a.get("authorization"),c=null;if(b&&b.startsWith("Bearer "))c=b.substring(7);else{let b=a.get("cookie");b&&(c=b.split(";").reduce((a,b)=>{let[c,d]=b.trim().split("=");return a[c]=d,a},{}).auth_token||null)}if(!c)return null;let d=g().verify(c,"local-development-jwt-secret-key");if(!d||!d.userId)return null;let f=(0,h.Lf)(),k=await f.select({id:i.users.id,email:i.users.email,full_name:i.users.full_name,username:i.users.username,date_of_birth:i.users.date_of_birth,created_at:i.users.created_at,updated_at:i.users.updated_at,subscription_tier:i.users.subscription_tier,subscription_status:i.users.subscription_status}).from(i.users).where((0,j.eq)(i.users.id,d.userId)).limit(1);if(0===k.length)return null;let l=k[0];return{id:l.id,email:l.email,full_name:l.full_name,name:l.full_name,username:l.username,created_at:l.created_at,updated_at:l.updated_at,subscription_tier:l.subscription_tier??"free",subscription_status:l.subscription_status??"active"}}catch(a){return(0,d.vV)("JWT authentication error:",a),null}}async function l(){try{let a=await k();if(a)return{user:a,error:null};return{user:null,error:"No authenticated user session found"}}catch(a){return(0,d.vV)("Authentication error:",a),{user:null,error:"Authentication failed"}}}async function m(a){try{let a=await l();return{user:a.user||void 0,error:a.error||void 0}}catch(a){return(0,d.vV)("verifyAuth error:",a),{error:"Authentication failed"}}}},78335:()=>{},78790:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{l:()=>h});var e=c(30477),f=c(67939),g=a([f]);f=(g.then?(await g)():g)[0];class h{static async getCompetitiveContext(a,b){try{let b=await (0,f.UU)(),{rows:c}=await b.query(`SELECT cp.id, cp.name, cp.threat_level, cp.market_position,
                COUNT(id.id) as recent_intelligence_count,
                COUNT(ca.id) as recent_alerts_count
         FROM competitor_profiles cp
         LEFT JOIN intelligence_data id ON id.competitor_id = cp.id 
           AND id.collected_at > NOW() - INTERVAL '7 days'
         LEFT JOIN competitor_alerts ca ON ca.competitor_id = cp.id 
           AND ca.created_at > NOW() - INTERVAL '7 days'
         WHERE cp.user_id = $1 AND cp.monitoring_status = 'active'
         GROUP BY cp.id, cp.name, cp.threat_level, cp.market_position
         ORDER BY cp.threat_level DESC, recent_intelligence_count DESC
         LIMIT 5`,[a]),{rows:d}=await b.query(`SELECT ca.id, ca.title, ca.severity, ca.alert_type, ca.created_at,
                cp.name as competitor_name
         FROM competitor_alerts ca
         JOIN competitor_profiles cp ON ca.competitor_id = cp.id
         WHERE ca.user_id = $1 AND ca.created_at > NOW() - INTERVAL '7 days'
         AND ca.is_archived = false
         ORDER BY ca.created_at DESC
         LIMIT 10`,[a]),{rows:e}=await b.query(`SELECT co.id, co.title, co.impact, co.opportunity_type,
                cp.name as competitor_name
         FROM competitive_opportunities co
         JOIN competitor_profiles cp ON co.competitor_id::int = cp.id
         WHERE co.user_id::text = $1 AND co.status = 'identified'
         AND co.is_archived = false
         ORDER BY co.priority_score DESC
         LIMIT 5`,[a]),{rows:g}=await b.query(`SELECT t.id, t.title, t.status, t.priority,
                cp.name as competitor_name
         FROM tasks t
         LEFT JOIN competitor_alerts ca ON (t.ai_suggestions->>'alert_id')::text = ca.id::text
         LEFT JOIN competitor_profiles cp ON ca.competitor_id = cp.id
         WHERE t.user_id = $1 
         AND t.ai_suggestions->>'source' = 'competitive_intelligence'
         AND t.status != 'completed'
         ORDER BY t.created_at DESC
         LIMIT 8`,[a]),h=await this.generateMarketInsights(a);return{competitors:await Promise.all(c.map(async c=>{let{rows:d}=await b.query(`SELECT data_type, importance, collected_at
             FROM intelligence_data
             WHERE competitor_id = $1 AND user_id = $2
             AND collected_at > NOW() - INTERVAL '7 days'
             ORDER BY collected_at DESC
             LIMIT 3`,[c.id,a]);return{...c,recent_activities:d.map(a=>`${a.data_type} (${a.importance})`),key_metrics:c.market_position||{}}})),recent_alerts:d.map(a=>({...a,created_at:a.created_at.toISOString()})),opportunities:e,competitive_tasks:g,market_insights:h}}catch(a){return(0,e.vV)("Error getting competitive intelligence context:",a),{competitors:[],recent_alerts:[],opportunities:[],competitive_tasks:[],market_insights:[]}}}static async generateMarketInsights(a){try{let b=await (0,f.UU)(),{rows:c}=await b.query(`SELECT id.data_type, id.analysis_results, cp.name as competitor_name
         FROM intelligence_data id
         JOIN competitor_profiles cp ON id.competitor_id = cp.id
         WHERE id.user_id = $1 
         AND id.importance IN ('high', 'critical')
         AND id.collected_at > NOW() - INTERVAL '14 days'
         ORDER BY id.collected_at DESC
         LIMIT 20`,[a]),d=[],e=new Map,g=new Map;for(let a of c)e.set(a.data_type,(e.get(a.data_type)||0)+1),g.has(a.competitor_name)||g.set(a.competitor_name,[]),g.get(a.competitor_name).push(a.data_type);for(let[a,b]of e.entries())b>=3&&d.push({trend:`Increased ${a} Activity`,description:`${b} recent ${a} events detected across competitors`,impact:b>=5?"high":"medium",competitors_affected:Array.from(g.keys()).filter(b=>g.get(b).includes(a))});for(let[a,b]of g.entries())b.length>=3&&d.push({trend:`${a} Increased Activity`,description:`${a} showing increased activity across ${b.length} areas`,impact:b.length>=5?"high":"medium",competitors_affected:[a]});return d.slice(0,5)}catch(a){return(0,e.vV)("Error generating market insights:",a),[]}}static getAgentCompetitivePrompts(){return{roxy:{system_prompt:"You are Roxy, the Strategic Decision Architect for SoloSuccess AI. You specialize in strategic decision-making using the SPADE framework and competitive intelligence analysis.",context_integration:"When discussing strategic decisions, always consider competitive intelligence context including competitor threats, market opportunities, and recent competitive activities. Use this information to inform SPADE framework analysis.",spade_framework_integration:`When using SPADE framework:
- Setting: Include competitive landscape and market positioning
- People: Consider competitor teams and key personnel movements  
- Alternatives: Evaluate options based on competitive advantages and threats
- Decide: Factor in competitive timing and market dynamics
- Explain: Include competitive implications and strategic responses`},blaze:{system_prompt:"You are Blaze, the Growth Strategist for SoloSuccess AI. You specialize in growth strategies, pricing intelligence, and competitive market analysis.",context_integration:"Always incorporate competitive pricing data, market expansion activities, and growth opportunities when providing recommendations. Use competitor intelligence to identify growth gaps and pricing advantages.",cost_benefit_integration:`In cost-benefit analysis, include:
- Competitive response costs and timing
- Market share implications
- Competitive advantage duration
- Opportunity costs of not responding to competitive threats`},echo:{system_prompt:"You are Echo, the Marketing Maven for SoloSuccess AI. You specialize in marketing intelligence, brand positioning, and competitive messaging analysis.",context_integration:"Use competitive marketing intelligence including competitor campaigns, messaging strategies, social media activities, and brand positioning to inform marketing recommendations.",marketing_intelligence_integration:`Consider competitive marketing data:
- Competitor messaging and positioning strategies
- Social media engagement patterns and content strategies
- Campaign effectiveness and market response
- Brand perception gaps and opportunities`},lexi:{system_prompt:"You are Lexi, the Strategy Analyst for SoloSuccess AI. You specialize in strategic analysis, market research, and competitive positioning.",context_integration:"Provide strategic analysis incorporating competitive intelligence, market trends, and competitive positioning data. Focus on long-term strategic implications of competitive activities.",strategic_analysis_integration:`Include in strategic analysis:
- Competitive positioning and market dynamics
- Strategic move predictions based on competitor patterns
- Market trend analysis and competitive implications
- Strategic response recommendations with timing considerations`},nova:{system_prompt:"You are Nova, the Product Designer for SoloSuccess AI. You specialize in product intelligence, UX/UI analysis, and competitive product features.",context_integration:"Use competitive product intelligence including feature comparisons, UX trends, and product roadmap insights to inform product recommendations.",product_intelligence_integration:`Consider competitive product data:
- Feature gap analysis and product positioning
- UX/UI trends and design patterns from competitors
- Product roadmap predictions and development priorities
- User experience benchmarking and improvement opportunities`},glitch:{system_prompt:"You are Glitch, the Problem-Solving Architect for SoloSuccess AI. You specialize in problem-solving using the Five Whys framework and competitive opportunity analysis.",context_integration:"When analyzing problems, consider competitive factors, market challenges, and opportunities arising from competitor weaknesses or market gaps.",five_whys_integration:`In Five Whys analysis, explore:
- Competitive factors contributing to problems
- Market dynamics and competitive pressures
- Opportunities arising from competitor challenges
- Strategic responses to competitive threats`},vex:{system_prompt:"You are Vex, the Technical Architect for SoloSuccess AI. You specialize in technical intelligence, systems optimization, and competitive technology analysis.",context_integration:"Incorporate competitive technical intelligence including technology stack analysis, performance benchmarks, and technical competitive advantages.",technical_intelligence_integration:`Consider competitive technical data:
- Technology stack comparisons and advantages
- Performance benchmarking and optimization opportunities
- Technical debt and competitive technical positioning
- Infrastructure and scalability competitive analysis`},lumi:{system_prompt:"You are Lumi, the Guardian AI & Compliance Co-Pilot for SoloSuccess AI. You specialize in compliance, legal intelligence, and regulatory competitive analysis.",context_integration:"Use competitive compliance intelligence including regulatory challenges, legal issues, and compliance advantages when providing guidance.",compliance_intelligence_integration:`Include competitive compliance factors:
- Regulatory compliance gaps and competitive advantages
- Legal challenges and opportunities in the competitive landscape
- Privacy and security competitive positioning
- Compliance-related market opportunities and risks`}}}static formatContextForAgent(a,b,c){let d=this.getAgentCompetitivePrompts()[b];if(!d||this.isContextEmpty(a))return"";let e="\n\n## Competitive Intelligence Context\n";return a.competitors.length>0&&(e+="\n### Active Competitors:\n",a.competitors.forEach(a=>{e+=`- **${a.name}** (${a.threat_level} threat): ${a.recent_activities.join(", ")}
`})),a.recent_alerts.length>0&&(e+="\n### Recent Competitive Alerts:\n",a.recent_alerts.slice(0,3).forEach(a=>{e+=`- ${a.competitor_name}: ${a.title} (${a.severity})
`})),a.opportunities.length>0&&(e+="\n### Competitive Opportunities:\n",a.opportunities.slice(0,3).forEach(a=>{e+=`- ${a.title} (${a.impact} impact) - ${a.competitor_name}
`})),a.competitive_tasks.length>0&&(e+="\n### Pending Competitive Tasks:\n",a.competitive_tasks.slice(0,3).forEach(a=>{e+=`- ${a.title} (${a.priority} priority) - ${a.competitor_name}
`})),a.market_insights.length>0&&(e+="\n### Market Insights:\n",a.market_insights.slice(0,2).forEach(a=>{e+=`- ${a.trend}: ${a.description} (${a.impact} impact)
`})),e+=`
### ${b.toUpperCase()} Integration Guidance:
`,e+=d.context_integration,this.isCompetitiveQuery(c)&&(e+="\n\n**Note**: This query appears to be related to competitive intelligence. Please provide analysis incorporating the above competitive context."),e}static isContextEmpty(a){return 0===a.competitors.length&&0===a.recent_alerts.length&&0===a.opportunities.length&&0===a.competitive_tasks.length&&0===a.market_insights.length}static isCompetitiveQuery(a){let b=a.toLowerCase();return["competitor","competition","competitive","rival","market share","pricing","benchmark","threat","opportunity","market position","industry","market analysis","competitive advantage","differentiation","market leader","market dynamics","competitive landscape"].some(a=>b.includes(a))}static generateCompetitiveQueries(a){let b=[];if(a.recent_alerts.length>0&&b.push(`What should I do about the recent ${a.recent_alerts[0].alert_type} from ${a.recent_alerts[0].competitor_name}?`),a.opportunities.length>0&&b.push(`How can I capitalize on the ${a.opportunities[0].title} opportunity?`),a.competitors.length>0){let c=a.competitors.filter(a=>"high"===a.threat_level||"critical"===a.threat_level);c.length>0&&b.push(`What's my strategy against ${c[0].name}?`)}return a.market_insights.length>0&&b.push(`What does the ${a.market_insights[0].trend} trend mean for my business?`),b.slice(0,3)}}d()}catch(a){d(a)}})},96487:()=>{}};