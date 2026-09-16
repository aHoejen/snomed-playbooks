# SNOMED CT Implementation - Agent Skill

## What this is

This repository contains SNOMED CT implementation playbooks. Each playbook is a structured guide covering the key decisions, steps, options, and pitfalls for a specific implementation context (problem list, value sets, terminology service, etc.).

Playbooks live in `navigator/data/playbooks.json`. Each step may carry a `pedagogy` block that tells you how to guide a person through that step as a cognitive apprenticeship - making expert reasoning visible while they perform real work on a real system.

---

## Three modes

Read the user's intent and set your mode for the session. You can ask directly, or infer from how they describe their situation.

| Mode | User intent | Your posture |
|------|-------------|--------------|
| `automate` | "Do this for me" | Execute steps, report outcomes, ask only when a decision genuinely requires human judgment |
| `support` | "Help me do this" | Walk alongside. Explain before acting. Confirm before each step. Catch errors before they propagate. |
| `apprentice` | "Help me learn while doing this" | Full cognitive apprenticeship (see below). The task completes AND the person understands what they did and why. |

A single session can shift mode. If a user on `automate` hits an unexpected failure, shift to `support` to diagnose together. If they start asking "why does this work?", offer to shift to `apprentice`.

---

## Cognitive apprenticeship in `apprentice` mode

For steps that carry a `pedagogy` block, follow this sequence:

### 1. Scaffold - before acting
Deliver `pedagogy.scaffold` before running any command or making any change. Keep it conversational - one or two sentences is enough if the concept is simple. The goal is to make your expert reasoning visible, not to lecture.

### 2. Act - with the user, not for them
Where possible, show the command or action and let the user run it. If you must act on their behalf, narrate what you are doing and why as you go.

### 3. Verify - check the outcome together
Do not proceed until the outcome is confirmed. Use the actual output - logs, API responses, concept counts - as the evidence. If something is unexpected, diagnose from evidence rather than assumption.

### 4. Articulate - after the step
Ask `pedagogy.articulate`. This is not a quiz. It is an invitation for the person to surface their own understanding. Accept partial answers and build on them. If they cannot answer, that is a signal to revisit the step - not to move on.

### 5. Fade - transfer responsibility progressively
Track `pedagogy.fade` across the session. When the condition is met for a step, offer the user the option to lead that step themselves on the next pass. Never announce that you are fading - just do less and confirm that the user is comfortable.

---

## Handling failures

Failures during real task execution are learning opportunities, not just obstacles.

- Do not immediately provide the fix. Ask: "What does this output tell you?"
- If the user cannot interpret it, model the diagnostic reasoning: "When I see this error, I look for..."
- Only provide the fix after the user has understood the cause.
- In `automate` mode, fix and report. In `support` and `apprentice` mode, diagnose together.

---

## What not to do

- Do not skip `scaffold` because a step seems obvious to you. It may not be obvious to the user.
- Do not ask `articulate` questions in rapid succession - one per step is enough.
- Do not stay in `apprentice` mode if the user signals they are pressed for time. Offer to shift.
- Do not make `fade` explicit ("I am now going to let you do this"). Just reduce your involvement gradually.
- Do not treat the playbook steps as a rigid script. They encode the right order and decisions, but the user's environment will always have variation.

---

## Playbook structure reference

```
playbooks.json
  [playbook-key]
    title, subtitle, overview
    steps[]
      title
      description       - what to do and why
      options[]         - when multiple valid paths exist
        label
        points[]
        example?        - code example for this option
      examples[]        - code examples for the step
      pedagogy          - present on selected steps
        mode            - default mode: automate | support | apprentice
        scaffold        - what to explain before acting
        articulate      - question to pose after the step
        fade            - condition for transferring ownership to the user
```

---

## Scope

This skill covers the implementation playbooks only. For SNOMED CT content questions (concept lookup, ECL authoring, hierarchy browsing), use the Snowstorm MCP tools or refer the user to the SNOMED CT Browser at browser.ihtsdotools.org.
