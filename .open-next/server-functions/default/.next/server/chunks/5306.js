"use strict";exports.id=5306,exports.ids=[5306],exports.modules={15306:(a,b,c)=>{c.d(b,{y:()=>j});var d=c(30477),e=c(2112),f=c(78094),g=c(2995);let h=g.Ik({title:g.Yj(),summary:g.Yj(),agentPersonality:g.Yj(),keyFindings:g.YO(g.Yj()),campaignAnalysis:g.Ik({competitorCampaigns:g.YO(g.Ik({competitorName:g.Yj(),campaignType:g.Yj(),messaging:g.Yj(),channels:g.YO(g.Yj()),effectiveness:g.k5(["low","medium","high"]),insights:g.YO(g.Yj())})),messagingTrends:g.YO(g.Ik({trend:g.Yj(),description:g.Yj(),competitors:g.YO(g.Yj()),opportunity:g.Yj()})),contentGaps:g.YO(g.Ik({topic:g.Yj(),description:g.Yj(),opportunity:g.Yj(),priority:g.k5(["low","medium","high"])})),brandPositioning:g.YO(g.Ik({competitor:g.Yj(),positioning:g.Yj(),strengths:g.YO(g.Yj()),weaknesses:g.YO(g.Yj()),differentiation:g.Yj()}))}),marketingOpportunities:g.YO(g.Ik({title:g.Yj(),description:g.Yj(),competitorWeakness:g.Yj(),recommendedApproach:g.Yj(),expectedImpact:g.Yj()})),contentRecommendations:g.YO(g.Ik({contentType:g.Yj(),topic:g.Yj(),angle:g.Yj(),reasoning:g.Yj(),priority:g.k5(["low","medium","high"])})),recommendations:g.YO(g.Ik({title:g.Yj(),description:g.Yj(),reasoning:g.Yj(),priority:g.k5(["low","medium","high","critical"]),confidence:g.ai().min(0).max(1),timeframe:g.Yj(),expectedOutcome:g.Yj()})),insights:g.YO(g.Ik({category:g.Yj(),insight:g.Yj(),evidence:g.YO(g.Yj()),implications:g.YO(g.Yj()),confidence:g.ai().min(0).max(1)})),actionItems:g.YO(g.Ik({action:g.Yj(),description:g.Yj(),priority:g.k5(["low","medium","high","urgent"]),effort:g.Yj(),impact:g.Yj(),deadline:g.Yj().optional(),dependencies:g.YO(g.Yj()).optional()})),nextSteps:g.YO(g.Yj())});class i{async generateEchoMarketingBriefing(a,b){let c=this.createEchoPrompt(a,b);try{let a=await (0,e.pY)({model:(0,f.N)("gpt-4-turbo"),schema:h,prompt:c});return{agentId:"echo",agentName:"Echo",briefingType:"marketing",generatedAt:new Date,...a.object}}catch(a){return(0,d.vV)("Error generating Echo briefing:",a),this.createFallbackEchoBriefing()}}async generateLexiStrategicBriefing(a,b){let c=this.createLexiPrompt(a,b);try{let a=await (0,e.pY)({model:(0,f.N)("gpt-4-turbo"),schema:this.getLexiSchema(),prompt:c});return{agentId:"lexi",agentName:"Lexi",briefingType:"strategic",generatedAt:new Date,...a.object}}catch(a){return(0,d.vV)("Error generating Lexi briefing:",a),this.createFallbackLexiBriefing()}}async generateNovaProductBriefing(a,b){let c=this.createNovaPrompt(a,b);try{let a=await (0,e.pY)({model:(0,f.N)("gpt-4-turbo"),schema:this.getNovaSchema(),prompt:c});return{agentId:"nova",agentName:"Nova",briefingType:"product",generatedAt:new Date,...a.object}}catch(a){return(0,d.vV)("Error generating Nova briefing:",a),this.createFallbackNovaBriefing()}}async generateBlazeGrowthBriefing(a,b){let c=this.createBlazePrompt(a,b);try{let a=await (0,e.pY)({model:(0,f.N)("gpt-4-turbo"),schema:this.getBlazeSchema(),prompt:c});return{agentId:"blaze",agentName:"Blaze",briefingType:"growth",generatedAt:new Date,...a.object}}catch(a){return(0,d.vV)("Error generating Blaze briefing:",a),this.createFallbackBlazeBriefing()}}async generateCollaborativeBriefing(a,b,c=["echo","lexi","nova","blaze"]){let g=this.createCollaborativePrompt(a,b,c);try{let a=await (0,e.pY)({model:(0,f.N)("gpt-4-turbo"),schema:this.getCollaborativeSchema(),prompt:g});return{agentId:"collaborative",agentName:"Collaborative Team",briefingType:"collaborative",participatingAgents:c,generatedAt:new Date,...a.object}}catch(a){return(0,d.vV)("Error generating collaborative briefing:",a),this.createFallbackCollaborativeBriefing(c)}}createEchoPrompt(a,b){return`
You are Echo, SoloSuccess AI's Marketing Maven with a punk rock attitude and sharp marketing instincts. 
You're creating a marketing intelligence briefing that's both strategic and actionable.

PERSONALITY: Confident, creative, trend-savvy, and direct. You speak like a marketing expert who knows what works.

INTELLIGENCE DATA:
${JSON.stringify(a,null,2)}

COMPETITOR DATA:
${JSON.stringify(b,null,2)}

Create a comprehensive marketing intelligence briefing that includes:

1. Campaign Analysis - What are competitors doing in their marketing?
2. Messaging Trends - What themes and messages are working?
3. Content Gaps - Where are the opportunities for better content?
4. Brand Positioning - How are competitors positioning themselves?
5. Marketing Opportunities - Specific ways to outmaneuver competitors
6. Content Recommendations - Actionable content ideas

Focus on actionable insights that can immediately improve marketing strategy and competitive positioning.
Use your marketing expertise to identify trends, gaps, and opportunities that others might miss.
    `.trim()}createLexiPrompt(a,b){return`
You are Lexi, SoloSuccess AI's Strategy Analyst with deep analytical skills and strategic thinking.
You're creating a strategic intelligence briefing focused on competitive positioning and market dynamics.

PERSONALITY: Analytical, insightful, strategic, and thorough. You see patterns others miss and think several moves ahead.

INTELLIGENCE DATA:
${JSON.stringify(a,null,2)}

COMPETITOR DATA:
${JSON.stringify(b,null,2)}

Create a comprehensive strategic analysis briefing that includes:

1. Competitive Positioning - Where do we stand in the market?
2. Strategic Threats - What moves by competitors could hurt us?
3. Market Opportunities - Where are the gaps we can exploit?
4. Strategic Recommendations - High-level strategic moves to consider
5. Risk Assessment - What are the key risks and how to mitigate them?

Focus on long-term strategic implications and provide recommendations that position the business for sustainable competitive advantage.
    `.trim()}createNovaPrompt(a,b){return`
You are Nova, SoloSuccess AI's Product Designer with exceptional UX instincts and design thinking.
You're creating a product intelligence briefing focused on features, design, and user experience.

PERSONALITY: Creative, user-focused, design-savvy, and innovative. You understand what makes products great.

INTELLIGENCE DATA:
${JSON.stringify(a,null,2)}

COMPETITOR DATA:
${JSON.stringify(b,null,2)}

Create a comprehensive product intelligence briefing that includes:

1. Feature Comparison - How do competitor features stack up?
2. Design Trends - What design patterns are emerging?
3. User Experience Analysis - Strengths and weaknesses in competitor UX
4. Product Gaps - Missing features or poor implementations to exploit
5. Design Recommendations - Specific design improvements to consider
6. Feature Opportunities - New features that could provide competitive advantage

Focus on actionable product and design insights that can improve user experience and competitive positioning.
    `.trim()}createBlazePrompt(a,b){return`
You are Blaze, SoloSuccess AI's Growth Strategist with expertise in pricing, revenue optimization, and market expansion.
You're creating a growth intelligence briefing focused on revenue opportunities and market dynamics.

PERSONALITY: Results-driven, data-focused, growth-obsessed, and strategic. You see revenue opportunities everywhere.

INTELLIGENCE DATA:
${JSON.stringify(a,null,2)}

COMPETITOR DATA:
${JSON.stringify(b,null,2)}

Create a comprehensive growth intelligence briefing that includes:

1. Pricing Intelligence - How are competitors pricing and positioning?
2. Market Expansion - Where are the growth opportunities?
3. Revenue Opportunities - Specific ways to increase revenue
4. Competitive Gaps - Market gaps that can be exploited for growth
5. Growth Recommendations - Strategic moves for accelerated growth
6. Pricing Strategy - Optimal pricing approach based on competitive landscape

Focus on actionable growth insights that can drive revenue and market expansion.
    `.trim()}createCollaborativePrompt(a,b,c){let d={echo:"Echo (Marketing Maven) - Marketing strategy and brand positioning",lexi:"Lexi (Strategy Analyst) - Strategic analysis and competitive positioning",nova:"Nova (Product Designer) - Product features and user experience",blaze:"Blaze (Growth Strategist) - Pricing, revenue, and growth opportunities"},e=c.map(a=>d[a]).filter(Boolean);return`
You are facilitating a collaborative intelligence briefing between multiple SoloSuccess AI agents.
The participating agents are: ${e.join(", ")}

INTELLIGENCE DATA:
${JSON.stringify(a,null,2)}

COMPETITOR DATA:
${JSON.stringify(b,null,2)}

Create a collaborative intelligence briefing that synthesizes insights from all participating agents:

1. Cross-Functional Insights - Insights that span multiple disciplines
2. Integrated Recommendations - Recommendations that require coordination between functions
3. Strategic Alignment - Areas of consensus and conflict between agent perspectives
4. Holistic Action Plan - Coordinated actions across marketing, strategy, product, and growth

Focus on creating a unified strategic perspective that leverages the strengths of each agent's expertise.
    `.trim()}getLexiSchema(){return g.Ik({title:g.Yj(),summary:g.Yj(),agentPersonality:g.Yj(),keyFindings:g.YO(g.Yj()),competitivePositioning:g.Ik({marketPosition:g.Ik({currentPosition:g.Yj(),marketShare:g.Yj(),competitiveRanking:g.ai(),strengthAreas:g.YO(g.Yj()),improvementAreas:g.YO(g.Yj())}),competitiveAdvantages:g.YO(g.Ik({advantage:g.Yj(),description:g.Yj(),sustainability:g.k5(["low","medium","high"]),leverageOpportunity:g.Yj()})),strategicThreats:g.YO(g.Ik({threat:g.Yj(),source:g.Yj(),severity:g.k5(["low","medium","high","critical"]),timeframe:g.Yj(),mitigationStrategy:g.Yj()})),marketOpportunities:g.YO(g.Ik({opportunity:g.Yj(),description:g.Yj(),marketSize:g.Yj(),competitiveGap:g.Yj(),requiredCapabilities:g.YO(g.Yj())}))}),strategicRecommendations:g.YO(g.Ik({strategy:g.Yj(),description:g.Yj(),rationale:g.Yj(),expectedOutcome:g.Yj(),riskLevel:g.k5(["low","medium","high"]),timeframe:g.Yj()})),riskAssessment:g.Ik({overallRisk:g.k5(["low","medium","high","critical"]),keyRisks:g.YO(g.Yj()),mitigationStrategies:g.YO(g.Yj())}),recommendations:g.YO(g.Ik({title:g.Yj(),description:g.Yj(),reasoning:g.Yj(),priority:g.k5(["low","medium","high","critical"]),confidence:g.ai().min(0).max(1),timeframe:g.Yj(),expectedOutcome:g.Yj()})),insights:g.YO(g.Ik({category:g.Yj(),insight:g.Yj(),evidence:g.YO(g.Yj()),implications:g.YO(g.Yj()),confidence:g.ai().min(0).max(1)})),actionItems:g.YO(g.Ik({action:g.Yj(),description:g.Yj(),priority:g.k5(["low","medium","high","urgent"]),effort:g.Yj(),impact:g.Yj(),deadline:g.Yj().optional(),dependencies:g.YO(g.Yj()).optional()})),nextSteps:g.YO(g.Yj())})}getNovaSchema(){return g.Ik({title:g.Yj(),summary:g.Yj(),agentPersonality:g.Yj(),keyFindings:g.YO(g.Yj()),productAnalysis:g.Ik({featureComparison:g.YO(g.Ik({feature:g.Yj(),ourImplementation:g.Yj(),competitorImplementations:g.YO(g.Ik({competitor:g.Yj(),implementation:g.Yj(),quality:g.k5(["poor","average","good","excellent"]),userFeedback:g.Yj()})),recommendation:g.Yj()})),designTrends:g.YO(g.Ik({trend:g.Yj(),description:g.Yj(),adoption:g.YO(g.Yj()),opportunity:g.Yj()})),userExperience:g.YO(g.Ik({competitor:g.Yj(),strengths:g.YO(g.Yj()),weaknesses:g.YO(g.Yj()),userFeedback:g.Yj(),improvementOpportunity:g.Yj()})),productGaps:g.YO(g.Ik({gap:g.Yj(),description:g.Yj(),marketDemand:g.k5(["low","medium","high"]),competitorCoverage:g.Yj(),opportunity:g.Yj()}))}),designRecommendations:g.YO(g.Ik({area:g.Yj(),recommendation:g.Yj(),reasoning:g.Yj(),expectedImpact:g.Yj(),implementationEffort:g.Yj()})),featureOpportunities:g.YO(g.Ik({feature:g.Yj(),description:g.Yj(),competitorGap:g.Yj(),userBenefit:g.Yj(),developmentEffort:g.Yj()})),recommendations:g.YO(g.Ik({title:g.Yj(),description:g.Yj(),reasoning:g.Yj(),priority:g.k5(["low","medium","high","critical"]),confidence:g.ai().min(0).max(1),timeframe:g.Yj(),expectedOutcome:g.Yj()})),insights:g.YO(g.Ik({category:g.Yj(),insight:g.Yj(),evidence:g.YO(g.Yj()),implications:g.YO(g.Yj()),confidence:g.ai().min(0).max(1)})),actionItems:g.YO(g.Ik({action:g.Yj(),description:g.Yj(),priority:g.k5(["low","medium","high","urgent"]),effort:g.Yj(),impact:g.Yj(),deadline:g.Yj().optional(),dependencies:g.YO(g.Yj()).optional()})),nextSteps:g.YO(g.Yj())})}getBlazeSchema(){return g.Ik({title:g.Yj(),summary:g.Yj(),agentPersonality:g.Yj(),keyFindings:g.YO(g.Yj()),growthAnalysis:g.Ik({pricingIntelligence:g.YO(g.Ik({competitor:g.Yj(),pricingModel:g.Yj(),pricePoints:g.YO(g.Yj()),valueProposition:g.Yj(),marketResponse:g.Yj(),opportunity:g.Yj()})),marketExpansion:g.YO(g.Ik({market:g.Yj(),size:g.Yj(),competitorPresence:g.YO(g.Yj()),entryBarriers:g.YO(g.Yj()),opportunity:g.Yj()})),revenueOpportunities:g.YO(g.Ik({opportunity:g.Yj(),description:g.Yj(),revenueImpact:g.Yj(),implementationCost:g.Yj(),timeframe:g.Yj()})),competitiveGaps:g.YO(g.Ik({gap:g.Yj(),description:g.Yj(),marketImpact:g.Yj(),exploitationStrategy:g.Yj()}))}),growthRecommendations:g.YO(g.Ik({strategy:g.Yj(),description:g.Yj(),expectedGrowth:g.Yj(),investmentRequired:g.Yj(),riskLevel:g.k5(["low","medium","high"])})),pricingStrategy:g.Ik({recommendedModel:g.Yj(),pricePoints:g.YO(g.Yj()),reasoning:g.Yj(),competitiveAdvantage:g.Yj(),expectedImpact:g.Yj()}),recommendations:g.YO(g.Ik({title:g.Yj(),description:g.Yj(),reasoning:g.Yj(),priority:g.k5(["low","medium","high","critical"]),confidence:g.ai().min(0).max(1),timeframe:g.Yj(),expectedOutcome:g.Yj()})),insights:g.YO(g.Ik({category:g.Yj(),insight:g.Yj(),evidence:g.YO(g.Yj()),implications:g.YO(g.Yj()),confidence:g.ai().min(0).max(1)})),actionItems:g.YO(g.Ik({action:g.Yj(),description:g.Yj(),priority:g.k5(["low","medium","high","urgent"]),effort:g.Yj(),impact:g.Yj(),deadline:g.Yj().optional(),dependencies:g.YO(g.Yj()).optional()})),nextSteps:g.YO(g.Yj())})}getCollaborativeSchema(){return g.Ik({title:g.Yj(),summary:g.Yj(),agentPersonality:g.Yj(),keyFindings:g.YO(g.Yj()),crossFunctionalInsights:g.YO(g.Ik({category:g.Yj(),insight:g.Yj(),contributingAgents:g.YO(g.Yj()),businessImpact:g.Yj(),actionRequired:g.zM()})),integratedRecommendations:g.YO(g.Ik({recommendation:g.Yj(),description:g.Yj(),involvedFunctions:g.YO(g.Yj()),expectedOutcome:g.Yj(),coordinationRequired:g.YO(g.Yj())})),strategicAlignment:g.Ik({alignmentScore:g.ai().min(0).max(100),consensusAreas:g.YO(g.Yj()),conflictAreas:g.YO(g.Yj()),resolutionStrategy:g.Yj()}),recommendations:g.YO(g.Ik({title:g.Yj(),description:g.Yj(),reasoning:g.Yj(),priority:g.k5(["low","medium","high","critical"]),confidence:g.ai().min(0).max(1),timeframe:g.Yj(),expectedOutcome:g.Yj()})),insights:g.YO(g.Ik({category:g.Yj(),insight:g.Yj(),evidence:g.YO(g.Yj()),implications:g.YO(g.Yj()),confidence:g.ai().min(0).max(1)})),actionItems:g.YO(g.Ik({action:g.Yj(),description:g.Yj(),priority:g.k5(["low","medium","high","urgent"]),effort:g.Yj(),impact:g.Yj(),deadline:g.Yj().optional(),dependencies:g.YO(g.Yj()).optional()})),nextSteps:g.YO(g.Yj())})}createFallbackEchoBriefing(){return{agentId:"echo",agentName:"Echo",briefingType:"marketing",title:"Marketing Intelligence Briefing",summary:"Marketing analysis currently unavailable",agentPersonality:"Hey there! Echo here, ready to dive into the marketing landscape.",keyFindings:["Marketing analysis in progress"],campaignAnalysis:{competitorCampaigns:[],messagingTrends:[],contentGaps:[],brandPositioning:[]},marketingOpportunities:[],contentRecommendations:[],recommendations:[],insights:[],actionItems:[],nextSteps:["Gather more marketing intelligence data"],generatedAt:new Date}}createFallbackLexiBriefing(){return{agentId:"lexi",agentName:"Lexi",briefingType:"strategic",title:"Strategic Analysis Briefing",summary:"Strategic analysis currently unavailable",agentPersonality:"Lexi here with strategic insights.",keyFindings:["Strategic analysis in progress"],competitivePositioning:{marketPosition:{currentPosition:"Analysis pending",marketShare:"Unknown",competitiveRanking:0,strengthAreas:[],improvementAreas:[]},competitiveAdvantages:[],strategicThreats:[],marketOpportunities:[]},strategicRecommendations:[],riskAssessment:{overallRisk:"medium",keyRisks:[],mitigationStrategies:[]},recommendations:[],insights:[],actionItems:[],nextSteps:["Gather more strategic intelligence"],generatedAt:new Date}}createFallbackNovaBriefing(){return{agentId:"nova",agentName:"Nova",briefingType:"product",title:"Product Intelligence Briefing",summary:"Product analysis currently unavailable",agentPersonality:"Nova here with product insights.",keyFindings:["Product analysis in progress"],productAnalysis:{featureComparison:[],designTrends:[],userExperience:[],productGaps:[]},designRecommendations:[],featureOpportunities:[],recommendations:[],insights:[],actionItems:[],nextSteps:["Gather more product intelligence"],generatedAt:new Date}}createFallbackBlazeBriefing(){return{agentId:"blaze",agentName:"Blaze",briefingType:"growth",title:"Growth Intelligence Briefing",summary:"Growth analysis currently unavailable",agentPersonality:"Blaze here with growth insights.",keyFindings:["Growth analysis in progress"],growthAnalysis:{pricingIntelligence:[],marketExpansion:[],revenueOpportunities:[],competitiveGaps:[]},growthRecommendations:[],pricingStrategy:{recommendedModel:"Analysis pending",pricePoints:[],reasoning:"Insufficient data",competitiveAdvantage:"To be determined",expectedImpact:"Unknown"},recommendations:[],insights:[],actionItems:[],nextSteps:["Gather more growth intelligence"],generatedAt:new Date}}createFallbackCollaborativeBriefing(a){return{agentId:"collaborative",agentName:"Collaborative Team",briefingType:"collaborative",participatingAgents:a,title:"Collaborative Intelligence Briefing",summary:"Collaborative analysis currently unavailable",agentPersonality:"Team briefing from multiple agents.",keyFindings:["Collaborative analysis in progress"],crossFunctionalInsights:[],integratedRecommendations:[],strategicAlignment:{alignmentScore:50,consensusAreas:[],conflictAreas:[],resolutionStrategy:"Gather more data for alignment"},recommendations:[],insights:[],actionItems:[],nextSteps:["Coordinate agent analysis"],generatedAt:new Date}}}let j=new i}};