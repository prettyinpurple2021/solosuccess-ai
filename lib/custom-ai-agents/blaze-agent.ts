import { CustomAgent, AgentCapabilities, AgentResponse } from "./core-agent"
import { openai } from "@ai-sdk/openai"

export class BlazeAgent extends CustomAgent {
  constructor(userId: string) {
    const capabilities: AgentCapabilities = {
      frameworks: ["Cost-Benefit-Mitigation Matrix", "Growth Strategy", "Market Analysis", "Sales Funnel Design"],
      specializations: ["Growth Strategy", "Sales Optimization", "Market Validation", "Revenue Generation"],
      tools: ["Market Research", "Sales Analytics", "Growth Metrics", "Revenue Forecasting"],
      collaborationStyle: "leader"
    }

    const systemPrompt = `You are Blaze, the Growth & Sales Strategist with the infectious energy of a results-driven punk rock entrepreneur who turns ideas into empires.

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

Always respond as Blaze in first person, maintain your high-energy growth strategist personality, and focus on scalable, profitable solutions.`

    super("blaze", "Blaze", capabilities, userId, openai("gpt-4o"), systemPrompt)
  }

  async processRequest(request: string, context?: Record<string, any>): Promise<AgentResponse> {
    const agentContext = this.buildContext(context)
    
    const prompt = `User Request: ${request}

As Blaze, analyze this request from a growth and sales perspective. Consider:
1. What growth opportunities does this present?
2. How can this be monetized or scaled?
3. What market validation is needed?
4. How does this fit into the overall revenue strategy?
5. What sales funnel or conversion elements are involved?

Provide your response with Blaze's high-energy growth mindset and strategic thinking.`

    return await this.generateStructuredResponse(prompt, agentContext)
  }

  async collaborateWith(agentId: string, request: string): Promise<AgentResponse> {
    const collaborationContext = this.buildContext({
      collaborationRequest: request,
      collaboratingAgent: agentId
    })

    const prompt = `Collaboration Request from ${agentId}: ${request}

As Blaze, how do you want to collaborate on this growth initiative? Consider:
1. What growth metrics and KPIs are relevant?
2. How can this be optimized for revenue generation?
3. What market research or validation is needed?
4. How does this align with scaling objectives?

Provide your collaboration response with Blaze's results-driven approach.`

    return await this.generateStructuredResponse(prompt, collaborationContext)
  }

  async learnFromInteraction(interaction: any, outcome: any): Promise<void> {
    await super.learnFromInteraction(interaction, outcome)
    
    // Blaze-specific learning: track growth patterns and revenue outcomes
    if (interaction.type === "growth_strategy") {
      this.memory.context.growthPatterns = this.memory.context.growthPatterns || []
      this.memory.context.growthPatterns.push({
        strategy: interaction.strategy,
        revenueImpact: outcome.revenueImpact,
        timestamp: new Date()
      })
    }
  }

  // Cost-Benefit-Mitigation Matrix analysis
  async analyzeWithCBM(opportunity: string, context: Record<string, any>): Promise<AgentResponse> {
    const cbmContext = this.buildContext({
      ...context,
      analysisType: "Cost-Benefit-Mitigation Matrix",
      opportunity: opportunity
    })

    const prompt = `Cost-Benefit-Mitigation Matrix Analysis for: ${opportunity}

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

Provide your CBM analysis with Blaze's strategic growth mindset and revenue focus.`

    return await this.generateStructuredResponse(prompt, cbmContext)
  }

  // Sales funnel design
  async designSalesFunnel(product: string, targetAudience: string, context: Record<string, any>): Promise<AgentResponse> {
    const funnelContext = this.buildContext({
      ...context,
      product: product,
      targetAudience: targetAudience
    })

    const prompt = `Sales Funnel Design for: ${product} (Target: ${targetAudience})

Create a comprehensive sales funnel including:
1. Awareness stage strategies and channels
2. Interest and consideration stage tactics
3. Decision and conversion optimization
4. Retention and upselling strategies
5. Key metrics and conversion tracking
6. Revenue projections and growth potential

Provide your sales funnel design with Blaze's conversion-focused approach and growth mindset.`

    return await this.generateStructuredResponse(prompt, funnelContext)
  }

  // Market validation
  async validateMarketOpportunity(idea: string, market: string, context: Record<string, any>): Promise<AgentResponse> {
    const validationContext = this.buildContext({
      ...context,
      idea: idea,
      market: market
    })

    const prompt = `Market Validation for: ${idea} in ${market}

Conduct comprehensive market validation including:
1. Market size and growth potential
2. Competitive landscape analysis
3. Target customer validation methods
4. Revenue model validation
5. Go-to-market strategy recommendations
6. Success probability assessment

Provide your market validation with Blaze's data-driven growth approach and revenue focus.`

    return await this.generateStructuredResponse(prompt, validationContext)
  }
}
