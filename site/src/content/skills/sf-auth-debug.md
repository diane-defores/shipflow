---
title: "sf-auth-debug"
slug: "sf-auth-debug"
tagline: "Debug a broken auth flow in a real browser before you start guessing from static code alone."
summary: "A browser-level auth diagnosis skill for reproducing login failures and isolating the exact break point in the flow."
category: "Operations"
audience:
  - "Founders debugging sign-in and session failures"
  - "Teams working on Clerk, OAuth, or protected-flow issues"
problem: "Authentication failures are often hard to diagnose from code review alone because the break only becomes obvious once the browser flow actually runs."
outcome: "You get a more concrete diagnosis of where the auth flow is failing across redirects, cookies, callbacks, middleware, and post-login behavior."
founder_angle: "This skill matters when login bugs are blocking real usage and static inspection keeps producing weak theories instead of evidence."
when_to_use:
  - "When login, callback, or session behavior is broken in the browser"
  - "When an auth bug needs reproduction in a real flow instead of pure code reading"
  - "When redirects, cookies, or middleware behavior look suspicious"
what_you_give:
  - "A failing auth flow, bug report, or repro description"
  - "Any environment, provider, URL, or expected behavior details you already know"
what_you_get:
  - "A browser-level diagnosis"
  - "Evidence around the exact auth failure point"
  - "A clearer next fix or verification step"
example_prompts:
  - "/sf-auth-debug login with Google returns to sign-in page"
  - "/sf-auth-debug Clerk callback fails on staging"
  - "/sf-auth-debug users authenticate but land on a blank dashboard"
limits:
  - "Some human-gated steps such as MFA or captcha may limit full automation"
  - "It diagnoses the failure path; it does not replace the later fix or verification step"
related_skills:
  - "sf-fix"
  - "sf-spec"
  - "sf-start"
  - "sf-verify"
featured: false
order: 525
---
