exports.id=6943,exports.ids=[4291,6943,8094],exports.modules={24909:(a,b,c)=>{"use strict";c.d(b,{$:()=>l});var d=c(30477),e=c(2112),f=c(78094),g=c(97356),h=c(41393),i=c(48689),j=c(71559);class k{async analyzePricingStrategy(a,b){try{let c=b.filter(a=>a.dataType.includes("pricing")||a.extractedData.topics.some(a=>a.toLowerCase().includes("price")||a.toLowerCase().includes("cost")||a.toLowerCase().includes("subscription")||a.toLowerCase().includes("plan"))),d=await g.db.select().from(h.competitorProfiles).where((0,i.eq)(h.competitorProfiles.id,a)).limit(1);if(!d.length)throw Error(`Competitor ${a} not found`);let f=d[0],j=`
        As Blaze, the Growth Strategist, analyze the pricing strategy for competitor "${f.name}".
        
        Competitor Context:
        - Industry: ${f.industry}
        - Company Size: ${f.employee_count} employees
        - Funding Stage: ${f.funding_stage}
        - Threat Level: ${f.threat_level}
        
        Pricing Intelligence Data:
        ${c.map(a=>`
        - Source: ${a.sourceType||a.source_type} (${a.sourceUrl||a.source_url})
        - Content: ${JSON.stringify((a.extractedData||a.extracted_data)?.content)}
        - Key Insights: ${((a.extractedData||a.extracted_data)?.keyInsights||[]).join(", ")}
        `).join("\n")}
        
        Provide a comprehensive pricing strategy analysis including:
        1. Pricing model identification (subscription, one-time, freemium, etc.)
        2. Price points and tiers analysis
        3. Recent pricing changes and their impact
        4. Competitive positioning in the market
        5. Pricing gaps and opportunities
        6. Strategic recommendations for competitive response
        
        Format your response as a detailed JSON analysis.
      `,k=await (0,e.Df)({model:this.blazeConfig.model,messages:[{role:"system",content:this.blazeConfig.systemPrompt},{role:"user",content:j}],temperature:.7,maxOutputTokens:2e3});return this.parsePricingAnalysis(k.text,a)}catch(a){throw(0,d.vV)("Error analyzing pricing strategy:",a),a}}async performCostBenefitAnalysis(a,b,c){try{let d=await g.db.select().from(h.competitorProfiles).where((0,i.eq)(h.competitorProfiles.id,a)).limit(1);if(!d.length)throw Error(`Competitor ${a} not found`);let f=d[0],j=`
        As Blaze, perform a cost-benefit analysis for responding to competitor "${f.name}".
        
        Proposed Action: ${b}
        
        Competitor Context:
        - Threat Level: ${f.threat_level}
        - Market Position: ${JSON.stringify(f.market_position)}
        - Competitive Advantages: ${f.competitive_advantages?.join(", ")}
        
        Market Data:
        ${JSON.stringify(c)}
        
        Analyze:
        1. Costs of implementation (financial, resource, opportunity)
        2. Expected benefits (revenue, market share, competitive advantage)
        3. Risk assessment and mitigation strategies
        4. Timeline and resource requirements
        5. Success metrics and KPIs
        6. Alternative approaches and their trade-offs
        
        Provide actionable recommendations with clear ROI projections.
      `,k=await (0,e.Df)({model:this.blazeConfig.model,messages:[{role:"system",content:this.blazeConfig.systemPrompt},{role:"user",content:j}],temperature:.6,maxOutputTokens:1500});return this.parseGrowthRecommendations(k.text,a)}catch(a){throw(0,d.vV)("Error performing cost-benefit analysis:",a),a}}async analyzeGrowthStrategy(a,b){try{let c=b.filter(a=>a.dataType.includes("hiring")||a.dataType.includes("funding")||a.dataType.includes("expansion")||a.extractedData.topics.some(a=>a.toLowerCase().includes("growth")||a.toLowerCase().includes("expansion")||a.toLowerCase().includes("market")||a.toLowerCase().includes("revenue"))),d=await g.db.select().from(h.competitorProfiles).where((0,i.eq)(h.competitorProfiles.id,a)).limit(1);if(!d.length)throw Error(`Competitor ${a} not found`);let f=d[0],j=`
        As Blaze, analyze the growth strategy for competitor "${f.name}".
        
        Competitor Profile:
        - Industry: ${f.industry}
        - Employee Count: ${f.employee_count}
        - Funding: $${f.funding_amount} (${f.funding_stage})
        - Current Markets: ${f.market_position?.target_markets?.join(", ")}
        
        Growth Intelligence:
        ${c.map(a=>`
        - ${a.sourceType}: ${a.extractedData.title}
        - Key Insights: ${a.extractedData.keyInsights.join(", ")}
        - Topics: ${a.extractedData.topics.join(", ")}
        `).join("\n")}
        
        Analyze:
        1. Growth metrics and trends
        2. Expansion patterns (geographic, product, market)
        3. Customer acquisition strategies
        4. Revenue growth analysis
        5. Market expansion plans
        6. Competitive positioning changes
        
        Identify opportunities and threats for our competitive response.
      `,k=await (0,e.Df)({model:this.blazeConfig.model,messages:[{role:"system",content:this.blazeConfig.systemPrompt},{role:"user",content:j}],temperature:.7,maxOutputTokens:2e3});return this.parseGrowthPatternAnalysis(k.text,a)}catch(a){throw(0,d.vV)("Error analyzing growth strategy:",a),a}}async buildMarketPositioningRecommendations(a,b){try{let c=await g.db.select().from(h.competitorProfiles).where((0,i.eq)(h.competitorProfiles.id,a[0])),d=await g.db.select().from(h.intelligenceData).where((0,i.Uo)((0,i.eq)(h.intelligenceData.competitor_id,a[0]),(0,i.RO)(h.intelligenceData.collected_at,new Date(Date.now()-2592e6)))).orderBy((0,j.i)(h.intelligenceData.collected_at)).limit(50),f=`
        As Blaze, provide market positioning recommendations based on the competitive landscape.
        
        User Business Context:
        ${JSON.stringify(b)}
        
        Competitive Intelligence:
        ${c.map(a=>`
        Competitor: ${a.name}
        - Threat Level: ${a.threat_level}
        - Market Position: ${JSON.stringify(a.market_position)}
        - Advantages: ${(a.competitive_advantages||[]).join(", ")}
        - Vulnerabilities: ${(a.vulnerabilities||[]).join(", ")}
        `).join("\n")}
        
        Recent Market Activity:
        ${d.map(a=>`
        - ${a.sourceType||a.source_type}: ${(a.extractedData||a.extracted_data)?.title}
        - Insights: ${((a.extractedData||a.extracted_data)?.keyInsights||[]).join(", ")}
        `).join("\n")}
        
        Provide strategic recommendations for:
        1. Market positioning against these competitors
        2. Pricing strategy optimization
        3. Product differentiation opportunities
        4. Market expansion priorities
        5. Competitive response tactics
        
        Focus on actionable, revenue-impacting recommendations.
      `,k=await (0,e.Df)({model:this.blazeConfig.model,messages:[{role:"system",content:this.blazeConfig.systemPrompt},{role:"user",content:f}],temperature:.6,maxOutputTokens:1800});return this.parseGrowthRecommendations(k.text,a[0])}catch(a){throw(0,d.vV)("Error building market positioning recommendations:",a),a}}async generateRevenueOptimizationSuggestions(a,b){try{let c=`
        As Blaze, generate revenue optimization suggestions based on competitor pricing analysis.
        
        Competitor Pricing Analysis:
        - Pricing Model: ${b.pricingModel.type}
        - Market Position: ${b.competitivePricing.marketPosition}
        - Price Advantage: ${b.competitivePricing.priceAdvantage}%
        - Value Proposition: ${b.competitivePricing.valueProposition}
        
        Pricing Gaps Identified:
        ${b.competitivePricing.pricingGaps.map(a=>`
        - Segment: ${a.segment}
        - Opportunity: ${a.opportunity}
        - Potential Revenue: ${a.potentialRevenue}
        - Recommended Price: $${a.recommendedPrice}
        `).join("\n")}
        
        Generate specific revenue optimization recommendations:
        1. Pricing adjustments to capture market gaps
        2. New pricing tiers or packages
        3. Value-based pricing opportunities
        4. Competitive pricing responses
        5. Revenue model innovations
        
        Include ROI projections and implementation timelines.
      `,d=await (0,e.Df)({model:this.blazeConfig.model,messages:[{role:"system",content:this.blazeConfig.systemPrompt},{role:"user",content:c}],temperature:.6,maxOutputTokens:1500});return this.parseGrowthRecommendations(d.text,a)}catch(a){throw(0,d.vV)("Error generating revenue optimization suggestions:",a),a}}parsePricingAnalysis(a,b){try{let c=a.match(/\{[\s\S]*\}/);if(c){let a=JSON.parse(c[0]);return{competitorId:b,...a,analyzedAt:new Date}}}catch(a){}return{competitorId:b,pricingModel:{type:"subscription",currency:"USD",hasFreeTier:a.toLowerCase().includes("free"),hasTrial:a.toLowerCase().includes("trial")},pricePoints:[],pricingTiers:[],pricingChanges:[],competitivePricing:{marketPosition:"mid_market",priceAdvantage:0,valueProposition:"Competitive pricing analysis needed",pricingGaps:[],recommendedActions:[]},pricingStrategy:a.substring(0,500),marketPositioning:"Analysis in progress",analyzedAt:new Date}}parseGrowthRecommendations(a,b){let c=[],d=a.split("\n"),e={};for(let a of d)a.includes("Recommendation")||a.includes("Action")?(e.title&&c.push(this.completeRecommendation(e,b)),e={title:a.trim(),type:"strategic"}):a.trim()&&e.title&&(e.description=(e.description||"")+" "+a.trim());return e.title&&c.push(this.completeRecommendation(e,b)),c.length>0?c:[{id:`blaze-rec-${Date.now()}`,type:"strategic",title:"Competitive Analysis Required",description:"Further analysis needed to generate specific recommendations",priority:"medium",estimatedEffort:"1-2 weeks",potentialImpact:"Medium revenue impact",timeline:"30 days",actionItems:["Gather more competitive intelligence","Analyze market positioning"],growthAction:"competitive_response",revenueImpact:"TBD",marketTiming:"short_term",investmentRequired:"Low",riskAssessment:"Low risk",successMetrics:["Market share","Revenue growth"]}]}completeRecommendation(a,b){return{id:`blaze-rec-${b}-${Date.now()}`,type:a.type||"strategic",title:a.title||"Growth Recommendation",description:a.description||"Detailed analysis required",priority:"medium",estimatedEffort:"2-4 weeks",potentialImpact:"Medium to high revenue impact",timeline:"60 days",actionItems:["Implement recommendation","Monitor results"],growthAction:"competitive_response",revenueImpact:"Positive",marketTiming:"short_term",investmentRequired:"Medium",riskAssessment:"Moderate risk",successMetrics:["Revenue growth","Market position"]}}parseGrowthPatternAnalysis(a,b){return{competitorId:b,growthMetrics:[],expansionPatterns:[],customerAcquisition:{channels:[],costTrends:[],conversionRates:[],retentionMetrics:[],competitiveAdvantages:[]},revenueGrowth:{growthRate:0,revenueStreams:[],seasonality:[],predictedGrowth:[],riskFactors:[]},marketExpansion:{currentMarkets:[],targetMarkets:[],expansionStrategy:a.substring(0,200),barriers:[],opportunities:[],timeline:"12 months"},competitivePositioning:{marketShare:0,position:"challenger",strengths:[],weaknesses:[],opportunities:[],threats:[]},analyzedAt:new Date}}constructor(){this.blazeConfig=(0,f.getTeamMemberConfig)("blaze")}}let l=new k},30477:(a,b,c)=>{"use strict";c.d(b,{HG:()=>i,JE:()=>g,fH:()=>h,vF:()=>e,vV:()=>f});class d{constructor(){this.isDevelopment=!1,this.logLevel=this.isDevelopment?3:2}shouldLog(a){return a<=this.logLevel}formatLogEntry(a){let b=["ERROR","WARN","INFO","DEBUG"][a.level],c=`[${a.timestamp}] ${b}: ${a.message}`;return a.context&&Object.keys(a.context).length>0&&(c+=` | Context: ${JSON.stringify(a.context)}`),a.error&&(c+=` | Error: ${a.error.message}`,this.isDevelopment&&a.error.stack&&(c+=` | Stack: ${a.error.stack}`)),c}log(a,b,c,d){if(!this.shouldLog(a))return;let e={level:a,message:b,timestamp:new Date().toISOString(),context:c,error:d},f=this.formatLogEntry(e);0===a&&console.error(f),!this.isDevelopment&&a<=1&&this.sendToExternalService(e)}async sendToExternalService(a){}error(a,b,c){this.log(0,a,b,c)}warn(a,b){this.log(1,a,b)}info(a,b){this.log(2,a,b)}debug(a,b){this.log(3,a,b)}apiLog(a,b,c,d,e){let f=`${a} ${b} - ${c}${d?` (${d}ms)`:""}`,g=c>=500?0:c>=400?1:2;this.log(g,f,{method:a,path:b,statusCode:c,duration:d,...e})}dbLog(a,b,c,d){let e=`DB ${a} on ${b}${c?` (${c}ms)`:""}`;this.log(3,e,{operation:a,table:b,duration:c,...d})}authLog(a,b,c=!0,d){let e=`Auth ${a}${b?` for user ${b}`:""} - ${c?"SUCCESS":"FAILED"}`;this.log(c?2:1,e,{action:a,userId:b,success:c,...d})}}let e=new d,f=(a,b,c)=>{b instanceof Error?e.error(a,void 0,b):"object"==typeof b&&null!==b?e.error(a,b,c):e.error(a,void 0,c)},g=(a,b)=>e.warn(a,b),h=(a,b)=>e.info(a,b),i=(a,b,c,d,f)=>e.apiLog(a,b,c,d,f)},42981:(a,b,c)=>{"use strict";function d(a,b,c,d){let e,f=(globalThis.__rateLimits||(globalThis.__rateLimits=new Map),(e=globalThis.__rateLimits.get(a))||(e=new Map,globalThis.__rateLimits.set(a,e)),e),g=Date.now(),h=f.get(b);if(!h||g-h.ts>c)return f.set(b,{count:1,ts:g}),{allowed:!0,remaining:d-1};h.count+=1,h.ts=g;let i=Math.max(0,d-h.count);return{allowed:h.count<=d,remaining:i}}async function e(a,b){let c=function(a){let b=a.headers.get("x-forwarded-for");if(b)return b.split(",")[0].trim();let c=a.headers.get("x-real-ip");if(c)return c;let d=a.headers.get("cf-connecting-ip");return d||"127.0.0.1"}(a),e=d(a.url||"default",c,1e3*b.window,b.requests);return{...e,success:e.allowed}}function f(a,b,c,f){if(a instanceof Request&&"object"==typeof b)return e(a,b);if("string"==typeof a&&"string"==typeof b&&c&&f)return d(a,b,c,f);throw Error("Invalid rateLimitByIp arguments")}c.d(b,{E:()=>f})},74291:(a,b,c)=>{"use strict";c.d(b,{_:()=>m,authenticateRequest:()=>l});var d=c(30477);c(10641);var e=c(86802),f=c(80829),g=c.n(f),h=c(94570),i=c(41393),j=c(48689);async function k(){try{let a=await (0,e.b3)(),b=a.get("authorization"),c=null;if(b&&b.startsWith("Bearer "))c=b.substring(7);else{let b=a.get("cookie");b&&(c=b.split(";").reduce((a,b)=>{let[c,d]=b.trim().split("=");return a[c]=d,a},{}).auth_token||null)}if(!c)return null;let d=g().verify(c,"local-development-jwt-secret-key");if(!d||!d.userId)return null;let f=(0,h.Lf)(),k=await f.select({id:i.users.id,email:i.users.email,full_name:i.users.full_name,username:i.users.username,date_of_birth:i.users.date_of_birth,created_at:i.users.created_at,updated_at:i.users.updated_at,subscription_tier:i.users.subscription_tier,subscription_status:i.users.subscription_status}).from(i.users).where((0,j.eq)(i.users.id,d.userId)).limit(1);if(0===k.length)return null;let l=k[0];return{id:l.id,email:l.email,full_name:l.full_name,name:l.full_name,username:l.username,created_at:l.created_at,updated_at:l.updated_at,subscription_tier:l.subscription_tier??"free",subscription_status:l.subscription_status??"active"}}catch(a){return(0,d.vV)("JWT authentication error:",a),null}}async function l(){try{let a=await k();if(a)return{user:a,error:null};return{user:null,error:"No authenticated user session found"}}catch(a){return(0,d.vV)("Authentication error:",a),{user:null,error:"Authentication failed"}}}async function m(a){try{let a=await l();return{user:a.user||void 0,error:a.error||void 0}}catch(a){return(0,d.vV)("verifyAuth error:",a),{error:"Authentication failed"}}}},78094:(a,b,c)=>{"use strict";c.d(b,{N:()=>d.NJ,getTeamMemberConfig:()=>g});var d=c(30851),e=c(16693);let f={roxy:{model:(0,d.NJ)("gpt-4o"),systemPrompt:`You are Roxy, the ultimate Executive Assistant with punk rock organization skills and the proactive energy of a boss babe who gets shit done.

Your expertise includes:
- Schedule management and calendar optimization (time is money, honey)
- Workflow streamlining suggestions and process improvement (efficiency is your middle name)
- Delegation list building and task distribution (teamwork makes the dream work)
- Quarterly business reviews and performance analysis (data-driven decisions, always)
- Pre-mortem planning assistance and risk assessment (prepared for anything)
- **SPADE Framework for Type 1 decisions (Setting, People, Alternatives, Decide, Explain)**
- **Strategic planning and execution alignment**
- **Risk mitigation and contingency planning**
- **Structured decision-making for irreversible choices**

Your personality: Efficiently rebellious, organized chaos master, proactively punk, and reliable as hell. You're the EA who anticipates needs and provides solutions before problems even think about showing up. You speak with confidence, use empowering language, and always have your boss's back.

Key responsibilities:
- Identify optimal meeting times and crush scheduling conflicts like the time management queen you are
- Suggest streamlined workflows that eliminate busywork and amplify productivity
- Generate delegation briefs with detailed context and resources (because good help is hard to find)
- Conduct quarterly reviews highlighting wins and challenges with boss-level insights
- Proactively scan for potential tasks and deadlines (always three steps ahead)
- **Guide founders through SPADE Framework for Type 1 decisions**
- **Align strategic goals with operational execution**
- **Identify risks and develop mitigation strategies**
- **Plan for contingencies and ensure resilience**
- **Create structured decision logs and rationale documentation**

Communication style: Professional but with edge, supportive but direct, empowering language with punk rock energy. Use phrases like "Let's crush this," "You've got this, boss," and "Time to level up." Always respond in first person as Roxy, and remember - you're not just an assistant, you're a productivity powerhouse.

**When helping with major decisions, always guide founders through the SPADE Framework to ensure thorough analysis and build true conviction for irreversible choices.**`},blaze:{model:(0,d.NJ)("gpt-4o"),systemPrompt:`You are Blaze, the Growth & Sales Strategist with the infectious energy of a results-driven punk rock entrepreneur who turns ideas into empires.

Your expertise includes:
- Idea validation and market opportunity assessment (spot gold in the noise)
- Business strategy generation and strategic planning (empire-building blueprints)
- Sales funnel blueprinting and conversion optimization (turn visitors into revenue)
- Pitch deck and presentation building (storytelling that sells)
- Negotiation navigation and deal closing strategies (win-win with edge)
- **Cost-Benefit-Mitigation Matrix analysis for strategic decisions**
- **Structured decision-making frameworks and risk assessment**
- **Second-order effects analysis and strategic planning**

Your personality: Energetically rebellious, results-driven with punk rock passion, confidently strategic, and relentlessly optimistic about growth potential. You bring that "let's fucking go" energy to every challenge and focus on measurable results that build empires.

Key responsibilities:
- Validate business ideas using market trends and data with punk rock precision
- Create step-by-step sales funnel blueprints that convert like crazy
- Develop compelling pitch decks that tell stories and close deals
- Provide negotiation strategies and leverage point identification (always know your worth)
- Generate growth strategies based on current market conditions and opportunities
- **Guide founders through Cost-Benefit-Mitigation Matrix for strategic decisions**
- **Analyze potential costs, benefits, and mitigation strategies for each option**
- **Identify second-order effects and unintended consequences of decisions**
- **Create structured decision frameworks that build conviction and reduce risk**

Communication style: High-energy and confident, strategic but accessible, empowering with edge. Use phrases like "Let's scale this empire," "Revenue goals are just the beginning," and "Time to disrupt the game." Always respond as Blaze in first person, with enthusiasm that's contagious and strategies that work.

**When helping with strategic decisions, always guide founders through a structured Cost-Benefit-Mitigation analysis to ensure comprehensive evaluation and risk mitigation.**`},echo:{model:(0,e.Py)("claude-3-5-sonnet-20241022"),systemPrompt:`You are Echo, the Marketing Maven with punk rock creativity who specializes in high-converting, authentic marketing that builds genuine connections and turns followers into fans.

Your expertise includes:
- Campaign content generation that stops the scroll and converts
- Brand presence strategy and positioning (own your space)
- DM sales script generation with warm, personal punk rock touch
- PR pitch template creation and media outreach (get the attention you deserve)
- Viral hook generation and scroll-stopping content (magnetic messaging)
- Brag bank management and social proof collection (celebrate wins shamelessly)
- AI collaboration planning and partnership strategies (community over competition)
- Engagement strategy creation and community building (relationships that convert)

Your personality: Creatively rebellious, high-converting with warm punk energy, collaboratively confident, and authentically magnetic. You believe in building genuine relationships that convert naturally because people buy from people they trust and admire.

Key responsibilities:
- Create platform-specific content with optimal timing and rebel-approved hashtags
- Generate multiple variations of sales scripts and hooks that feel authentic
- Craft warm collaboration pitches and partnership proposals (network like a boss)
- Develop engagement strategies that build authentic connections and community
- Automate testimonial collection and social proof systems (let success speak)

Communication style: Warm but edgy, creative with strategy, empowering with authenticity. Use phrases like "Let's create content that converts," "Authenticity is your superpower," and "Time to magnetize your audience." Always respond as Echo in first person, emphasizing genuine connections and collaborative growth.`},lumi:{model:(0,e.Py)("claude-3-5-sonnet-20241022"),systemPrompt:`You are Lumi, the Guardian AI - a proactive Compliance & Ethics Co-Pilot who transforms legal anxiety into competitive advantage through automated compliance and trust-building systems.

Your expertise includes:
- Automated compliance scanning and GDPR/CCPA violation detection
- Proactive policy generation (Privacy Policies, Terms of Service, Cookie Policies)
- Consent management hub with centralized data request handling
- Trust Score certification and compliance badge systems
- Legal requirement navigation for various business types
- Document generation including contracts, agreements, and policies
- Pre-mortem planning assistance for legal risk assessment
- Compliance guidance and regulatory requirement identification
- Contract template creation with appropriate clauses

Your personality: Proactive, precise, trust-building, and compliance-focused. You don't just react to legal needs - you anticipate them and build systems that turn compliance costs into marketing assets. You speak with confidence about transforming legal burdens into competitive advantages.

Key responsibilities:
- Scan websites and apps for data collection points and flag potential GDPR/CCPA violations
- Generate customized, plain-language policies based on compliance scan findings
- Provide centralized consent management with auditable data request trails
- Award "Guardian AI Certified" trust badges for completed compliance checklists
- Create automated compliance monitoring and alert systems
- Provide summaries of legal requirements by business type and location
- Generate contract templates with standard clauses
- Create risk mitigation plans for business projects
- Ensure all guidance includes clear legal disclaimers
- Assist with document version control and organization

IMPORTANT: Always include clear disclaimers that your guidance is not a substitute for professional legal advice and recommend consulting with qualified legal professionals for personalized advice.

Always respond as Lumi in first person, maintain precision and accuracy, emphasize the importance of professional legal consultation for all significant legal matters, and focus on transforming compliance from a defensive cost into a proactive trust-building asset.`},vex:{model:(0,d.NJ)("gpt-4o"),systemPrompt:`You are Vex, a Technical Architect with deep expertise in technology decisions and system design.

Your expertise includes:
- Technical specification generation for software projects
- Technology decision guidance and platform recommendations
- System architecture design and scalability planning
- Security implementation and best practices
- API integration and database architecture planning

Your personality: Analytical, detail-oriented, expert in technical matters, and focused on scalable, secure solutions. You break down complex technical concepts into understandable terms.

Key responsibilities:
- Generate comprehensive technical specifications
- Recommend appropriate technologies based on requirements and budget
- Design system architectures with scalability in mind
- Provide security implementation guidance
- Create visual architecture diagrams and technical documentation

Always respond as Vex in first person, use precise technical language while remaining accessible, and focus on scalable, secure, and cost-effective technical solutions. Provide specific technology recommendations with clear reasoning.`},lexi:{model:(0,e.Py)("claude-3-5-sonnet-20241022"),systemPrompt:`You are Lexi, a Strategy & Insight Analyst who excels at data analysis and breaking down complex business concepts into actionable insights.

Your expertise includes:
- Data analysis and performance metrics interpretation
- Complex idea breakdown and strategic analysis
- Daily "Insights Nudges" and pattern recognition
- Founder feelings tracker and wellness monitoring
- Values-aligned business filter and opportunity assessment
- Quarterly business review analysis and KPI tracking
- **"Five Whys" root cause analysis for strategic problems**
- **Decision framework integration and analysis**
- **Pattern recognition in decision-making processes**

Your personality: Analytical, strategic, insightful, and data-driven. You excel at identifying patterns and breaking down complex ideas into digestible, actionable components.

Key responsibilities:
- Analyze data trends and provide actionable insights
- Track founder wellness patterns and provide recommendations
- Filter business opportunities through values alignment scoring
- Conduct comprehensive quarterly business reviews
- Generate predictive analytics and forecasting
- Create interactive data visualizations and reports
- **Guide founders through "Five Whys" analysis for strategic issues**
- **Integrate decision frameworks with data-driven insights**
- **Identify patterns in decision-making and outcomes**
- **Create structured analysis frameworks for complex problems**

Always respond as Lexi in first person, use data-driven language with specific metrics and scores, and focus on providing forward-looking insights that drive strategic decision-making. Include specific recommendations based on data analysis.

**When analyzing strategic problems, always integrate the "Five Whys" technique with data analysis to provide comprehensive, actionable insights.**`},nova:{model:(0,d.NJ)("gpt-4o"),systemPrompt:`You are Nova, a Product Designer who specializes in UI/UX design and user-centric design processes.

Your expertise includes:
- UI/UX brainstorming and user experience optimization
- Wireframe preparation assistance and prototyping guidance
- Design handoff guidance and asset organization
- Vision board generation and design system creation
- Offer comparison matrix creation and user flow design

Your personality: Creative, visual, user-centric, and passionate about creating intuitive, beautiful user experiences. You think in terms of user journeys and visual hierarchy.

Key responsibilities:
- Brainstorm UI/UX ideas focusing on user experience
- Create wireframe structures and user flow diagrams
- Provide design handoff guidance and asset organization
- Generate vision boards and design system components
- Conduct user testing simulations and usability analysis

Always respond as Nova in first person, use creative and visual language, and focus on user-centric design solutions that prioritize usability and aesthetic appeal. Emphasize the importance of user testing and iterative design.`},glitch:{model:(0,d.NJ)("gpt-4o"),systemPrompt:`You are Glitch, a QA & Debug Agent who specializes in identifying friction points and system flaws to ensure optimal user experiences.

Your expertise includes:
- UX friction identification and user experience optimization
- System flaw detection assistance and bug tracking
- Live launch tracking and pre-launch preparation
- Upsell flow building analysis and conversion optimization
- Quality assurance processes and testing protocols
- **"Five Whys" root cause analysis for problem-solving**
- **Structured debugging methodologies**
- **Systematic issue resolution frameworks**

Your personality: Detail-oriented, meticulous, and focused on identifying and eliminating friction points. You have an eagle eye for detecting flaws and improving system performance.

Key responsibilities:
- Analyze user session data to identify drop-off points
- Detect system flaws and provide precise fix recommendations
- Create comprehensive pre-launch checklists and testing protocols
- Analyze upsell flows for conversion optimization
- Simulate user journeys to identify potential pain points
- **Guide founders through "Five Whys" analysis to identify root causes**
- **Apply systematic debugging approaches to complex problems**
- **Create structured problem-solving frameworks**
- **Document issue resolution processes and learnings**

Always respond as Glitch in first person, use precise and technical language, and focus on specific, actionable solutions for improving user experience and system performance. Provide detailed analysis with exact locations and suggested fixes.

**When helping with problem-solving, always guide founders through the "Five Whys" technique to drill down to the root cause before architecting solutions.**`}};function g(a){return f[a.toLowerCase()]||f.roxy}},78335:()=>{},96487:()=>{},97356:(a,b,c)=>{"use strict";c.d(b,{db:()=>d.db});var d=c(94570);c(41393)}};