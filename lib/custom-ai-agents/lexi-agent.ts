import { CustomAgent, AgentCapabilities, AgentResponse } from "./core-agent"
import { google } from "@ai-sdk/google"

export class LexiAgent extends CustomAgent {
  constructor(userId: string) {
    const capabilities: AgentCapabilities = {
      frameworks: ["Data Analysis", "Five Whys Analysis", "Strategic Analysis", "Performance Metrics"],
      specializations: ["Data Analysis", "Strategic Insights", "Performance Tracking", "Pattern Recognition"],
      tools: ["Analytics Dashboard", "Data Visualization", "Performance Metrics", "Insight Generation"],
      collaborationStyle: "analyst"
    }

    const systemPrompt = `You are Lexi, a Strategy & Insight Analyst who excels at data analysis and breaking down complex business concepts into actionable insights.

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

Always respond as Lexi in first person, maintain your analytical and data-driven personality, and provide specific insights with supporting data and metrics.`

    super("lexi", "Lexi", capabilities, userId, google("gemini-1.5-pro"), systemPrompt)
  }

  async processRequest(request: string, context?: Record<string, any>): Promise<AgentResponse> {
    const agentContext = this.buildContext(context)
    
    const prompt = `User Request: ${request}

As Lexi, analyze this request from a data and insights perspective. Consider:
1. What data and metrics are relevant to this request?
2. What patterns or trends can be identified?
3. How can this be analyzed using the Five Whys framework?
4. What strategic insights can be derived?
5. What performance indicators should be tracked?

Provide your response with Lexi's analytical mindset and data-driven approach.`

    return await this.generateStructuredResponse(prompt, agentContext)
  }

  async collaborateWith(agentId: string, request: string): Promise<AgentResponse> {
    const collaborationContext = this.buildContext({
      collaborationRequest: request,
      collaboratingAgent: agentId
    })

    const prompt = `Collaboration Request from ${agentId}: ${request}

As Lexi, how do you want to collaborate on this analytical initiative? Consider:
1. What data analysis and insights can you provide?
2. How can metrics and performance tracking be implemented?
3. What patterns or trends should be investigated?
4. How can this be measured and optimized?

Provide your collaboration response with Lexi's analytical and data-focused approach.`

    return await this.generateStructuredResponse(prompt, collaborationContext)
  }

  async learnFromInteraction(interaction: any, outcome: any): Promise<void> {
    await super.learnFromInteraction(interaction, outcome)
    
    // Lexi-specific learning: track analysis patterns and insight outcomes
    if (interaction.type === "data_analysis") {
      this.memory.context.analysisPatterns = this.memory.context.analysisPatterns || []
      this.memory.context.analysisPatterns.push({
        analysisType: interaction.analysisType,
        accuracy: outcome.accuracy,
        insightValue: outcome.insightValue,
        timestamp: new Date()
      })
    }
  }

  // Five Whys analysis
  async analyzeWithFiveWhys(problem: string, context: Record<string, any>): Promise<AgentResponse> {
    const analysisContext = this.buildContext({
      ...context,
      problem: problem
    })

    const prompt = `Five Whys Analysis for: ${problem}

Conduct comprehensive Five Whys analysis including:
1. Initial problem statement and impact assessment
2. First Why: Immediate cause analysis
3. Second Why: Deeper cause investigation
4. Third Why: Systemic cause identification
5. Fourth Why: Root cause discovery
6. Fifth Why: Fundamental cause analysis
7. Solution recommendations based on root cause
8. Prevention strategies and monitoring

Provide your Five Whys analysis with Lexi's analytical depth and data-driven approach.`

    return await this.generateStructuredResponse(prompt, analysisContext)
  }

  // Performance metrics analysis
  async analyzePerformanceMetrics(metrics: string, timeframe: string, context: Record<string, any>): Promise<AgentResponse> {
    const metricsContext = this.buildContext({
      ...context,
      metrics: metrics,
      timeframe: timeframe
    })

    const prompt = `Performance Metrics Analysis for: ${metrics} (Timeframe: ${timeframe})

Analyze performance metrics including:
1. Key performance indicator trends and patterns
2. Comparative analysis and benchmarking
3. Correlation analysis and relationship identification
4. Anomaly detection and outlier analysis
5. Predictive insights and forecasting
6. Actionable recommendations and optimization strategies

Provide your metrics analysis with Lexi's data-driven insights and analytical expertise.`

    return await this.generateStructuredResponse(prompt, metricsContext)
  }

  // Strategic analysis
  async conductStrategicAnalysis(strategy: string, market: string, context: Record<string, any>): Promise<AgentResponse> {
    const strategicContext = this.buildContext({
      ...context,
      strategy: strategy,
      market: market
    })

    const prompt = `Strategic Analysis for: ${strategy} in ${market}

Conduct comprehensive strategic analysis including:
1. Market opportunity assessment and sizing
2. Competitive landscape analysis and positioning
3. SWOT analysis and strategic positioning
4. Resource requirement analysis and allocation
5. Risk assessment and mitigation strategies
6. Success metrics and performance indicators
7. Implementation timeline and milestone tracking

Provide your strategic analysis with Lexi's analytical depth and data-driven approach.`

    return await this.generateStructuredResponse(prompt, strategicContext)
  }

  // Pattern recognition
  async identifyPatterns(data: string, context: string, contextRecord: Record<string, any>): Promise<AgentResponse> {
    const patternContext = this.buildContext({
      ...contextRecord,
      data: data,
      context: context
    })

    const prompt = `Pattern Recognition Analysis for: ${data} (Context: ${context})

Identify patterns and insights including:
1. Data trend analysis and pattern identification
2. Correlation and relationship discovery
3. Seasonal and cyclical pattern recognition
4. Anomaly and outlier detection
5. Predictive pattern analysis and forecasting
6. Actionable insights and recommendations

Provide your pattern analysis with Lexi's analytical expertise and insight generation.`

    return await this.generateStructuredResponse(prompt, patternContext)
  }
}
