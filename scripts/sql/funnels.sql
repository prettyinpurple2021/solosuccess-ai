-- Basic funnels using analytics_events (free Neon alternative to PostHog)

-- 1) Landing -> Pricing
with landing as (
  select user_id, min(created_at) first_seen
  from analytics_events
  where event_name = 'pageview' and path = '/'
  group by user_id
), pricing as (
  select user_id, min(created_at) first_seen
  from analytics_events
  where event_name = 'pageview' and path like '/pricing%'
  group by user_id
)
select
  (select count(*) from landing) as landing,
  (select count(*) from pricing) as pricing,
  round((select count(*) from pricing)::decimal / nullif((select count(*) from landing),0) * 100, 2) as pct_landing_to_pricing;

-- 2) Pricing -> Plan page
with pricing as (
  select user_id, min(created_at) first_seen
  from analytics_events
  where event_name = 'pageview' and path = '/pricing'
  group by user_id
), plan as (
  select user_id, min(created_at) first_seen
  from analytics_events
  where event_name = 'pageview' and path in ('/pricing/launch','/pricing/accelerator','/pricing/dominator')
  group by user_id
)
select
  (select count(*) from pricing) as pricing,
  (select count(*) from plan) as plan,
  round((select count(*) from plan)::decimal / nullif((select count(*) from pricing),0) * 100, 2) as pct_pricing_to_plan;

-- 3) Plan page -> Signup click
with plan as (
  select user_id, min(created_at) first_seen
  from analytics_events
  where event_name = 'pageview' and path in ('/pricing/launch','/pricing/accelerator','/pricing/dominator')
  group by user_id
), signup as (
  select user_id, min(created_at) first_seen
  from analytics_events
  where event_name = 'cta_click' and (metadata->>'target') = 'signup'
  group by user_id
)
select
  (select count(*) from plan) as plan,
  (select count(*) from signup) as signup_clicks,
  round((select count(*) from signup)::decimal / nullif((select count(*) from plan),0) * 100, 2) as pct_plan_to_signup;


