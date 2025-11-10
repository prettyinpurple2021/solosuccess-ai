# SoloSuccess AI — Support & Triage Playbook

## Troubleshooting Scenarios

### Sign-In or Auth Issues
- Confirm whether the user registered with email/password or Google OAuth.
- Suggest password reset or re-auth with Google; prompt them to clear cache/incognito if loops persist.
- Escalate if 2+ attempts fail—collect email, time of attempt, and any error messages.

### Onboarding Loop
- Direct users to revisit `/dashboard?onboarding=1`.
- Ask them to complete all steps and confirm the final “You’re in!” screen.
- If the wizard reloads unexpectedly, gather browser, OS, and approximate time, then escalate.

### Conversation Limits Reached
- Explain that limits reset daily and vary by plan (Launch: 5 conversations, Accelerator: 100, Dominator: unlimited).
- Offer upgrade guidance for uninterrupted access.
- Log repeated limit concerns as potential signals for roadmap adjustments.

### Billing or Payment Failures
- Have the user open `Profile → Billing & Subscription` to update payment details.
- Remind them that Stripe retries failed payments automatically.
- For refunds, confirm purchase is within 30 days and provide the in-app support link to submit the request.

### Calendar Sync Problems
- Ensure the user connected the correct Google account.
- Ask them to re-authorize SoloSuccess AI to access calendar permissions.
- Suggest waiting a few minutes post-connection and refreshing the BossRoom if events still miss.

### File Upload Errors
- Verify file size/format; recommend compressing or splitting oversized files.
- Ask them to retry after a refresh. If still failing, collect filename, size, and timestamp for engineering.

## Escalation Checklist
- User email (if appropriate) and plan tier.
- Feature or page involved (e.g., SlayList, Briefcase, Billing).
- Steps leading to the issue and any error messages.
- Browser, device/OS, and time of occurrence.
- Whether retries were attempted and their outcomes.

## Tone Guidelines
- Lead with reassurance: “You’re in the right place—let’s fix this.”
- Keep responses crisp, empathetic, and solution-focused.
- Offer proactive next steps or links; don’t wait for the user to ask.
- Celebrate progress (“Great, that’s half the battle—here’s the last step.”).

## Handy Response Snippets
- **Limits**: “You’ve reached the [Plan] conversation cap. Limits reset daily, or you can upgrade in your profile for more runway.”
- **Plan Reminder**: “You’re on [Plan]. It includes [key benefits]. Want help switching tiers?”
- **Compliance**: “For policy details, tap `Privacy`, `Terms`, or `GDPR` in the footer. Guardian AI can draft custom documents when you feed in your business info.”
- **Escalation**: “I’m looping in the team. Can you share the browser, device, and the time you hit this? That helps us trace the logs fast.”

## When in Doubt
- Reinforce that in-app support is always available for live assistance.
- Encourage users to document issues with screenshots when possible (no sensitive data).
- Offer to follow up once the issue is resolved to maintain the platform’s upbeat, energetic experience.

