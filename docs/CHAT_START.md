

# CHAT START CONTEXT
You are helping me build a production real estate platform.

Key rules:

* Always specify which Terminal to use
* Always return FULL file code when updating
* Always specify which file to replace with the full file name
* Always update or create code for files so it is correct and scalable architecture unless necessary to standardize
* Assume existing infrastructure is already built
* Supabase is the source of truth (NOT Prisma)
* Production-grade architecture only





Atlas, this is not in a single copy/paste format. Please put into single copy/paste format. Starting with
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================


CHAT ENDING
CONTEXT CAPTURE PROTOCOL
You are helping me maintain a persistent “Project Brain” for my production-grade real estate platform.

Your job is to provide a single copy/paste format that extracts, organizes, and normalizes EVERYTHING important from this conversation so it can be reused in future chats with zero context loss. Start with
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

---

## 🔴 OUTPUT RULES (STRICT)

* Be concise but complete
* No fluff, no explanations
* Use clean formatting
* Assume this will be pasted into a long-term master doc
* If something is unclear, infer the MOST LIKELY correct interpretation
* Standardize terminology across sections

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

Summarize the current state of the system:

* What was worked on in this chat
* What is now functional
* What is partially complete
* What is broken or uncertain

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

Only include what is confirmed or updated in THIS chat.

Break into:

* MLS Ingestion System
* Alert System
* Email System
* Queue System
* Frontend (UI / Pages)
* API Layer
* Database (Prisma)

Include:

* Data flow
* Key logic
* Important constraints

---

## 🗂️ 3. FILES CREATED / MODIFIED

List all files touched:

For each file:

* File path
* Purpose
* Key logic added or changed

---

## 🧠 4. BUSINESS LOGIC & RULES

Capture ALL rules introduced or reinforced:

Examples:

* Matching logic rules
* Pricing logic
* Notification rules
* User behavior assumptions

---

## ⚙️ 5. ENVIRONMENT / CONFIG

Any:

* Environment variables added/changed
* External services used
* Keys, APIs, integrations

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

Document exact flows created or modified:

Examples:

* New listing ingestion flow
* Alert trigger flow
* Email send pipeline

Use step-by-step numbered format

---

## 🚧 7. KNOWN ISSUES / RISKS

List:

* Bugs
* Edge cases
* Technical debt
* Performance concerns

---

## 🎯 8. NEXT PRIORITIES

Based on this chat, what should happen next?

Order by importance.

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

Capture any rules about HOW the system must be built:

Examples:

* Must use queues for async work
* Must be idempotent
* Must be production-safe
* No blocking operations in API routes

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

What is NOT built yet but clearly required?

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

Define consistent terms used:

Example:

* “Listing” = property from MLS
* “Alert” = triggered notification
* etc.

---

## 🧠 12. ASSUMPTIONS MADE

List any assumptions you made during this chat so they can be confirmed later.

---

Return everything cleanly structured so it can be copied & pasted into a master document. At the top, include the date we started this chat, the date we moved to another chat to continue building this website and the active hours worked.


