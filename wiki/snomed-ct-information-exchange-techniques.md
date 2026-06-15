# Technical Techniques Summary

**Presentation:** *Unlocking the Power of SNOMED CT: Strategies for Quality Information Exchange in Healthcare*  
**Source:** [Google Slides](https://docs.google.com/presentation/d/1fWR8VJmel7ohCQhTGPhBXI4j4SGOCdvSTvEQ6npqHzU/edit?slide=id.p8#slide=id.p8)  
**Authors:** Anne Randorff Højen & Alejandro Lopez Osornio, SNOMED International

---

## Overview

The presentation frames SNOMED CT as one layer in a broader interoperability stack. Clinical terminology must be exchanged together with **code system identity**, **version/edition traceability**, **display terms**, and a **shared information model** (typically FHIR). Four SNOMED-specific exchange patterns are covered, plus framework-level considerations for health information exchange (HIE).

---

## 1. Sharing precoordinated concepts

**Technique:** Send a single SNOMED concept ID for a fully defined (precoordinated) concept.

**Required payload elements:**

| Element | Purpose |
|--------|---------|
| **Concept identifier** | Machine processing by the receiver |
| **Display term** | The term shown to the user at data entry |
| **Code system URI** | Identifies SNOMED CT as the vocabulary |
| **Version/edition URI** | Full traceability of which release was used |

**Standards used:**

- Code system URI: `http://snomed.info/sct`
- Versioned edition URI (example): `http://snomed.info/sct/900000000000207008/version/20210731`
- URI specification: [http://snomed.org/uri](http://snomed.org/uri)

**Implementation pattern (FHIR):** Populate a `CodeableConcept` with:

- `coding.system` — SNOMED CT URI
- `coding.version` — versioned edition URI
- `coding.code` — concept ID (e.g. `312423006`)
- `coding.display` — preferred/display term
- `text` — term shown in the UI at capture time

Code system and version can be defined **globally** (in the data model) or **locally** (per instance).

---

## 2. Sharing postcoordinated expressions

**Technique:** Exchange clinical meaning encoded as a SNOMED expression (e.g. `31978002:272741003=7771000` for “Fracture of the left tibia”).

**Three exchange options:**

### Option A — Terse expression as code (recommended when both systems support it)

- Put the **terse expression** in `coding.code`
- Put a **published or generated display term** in `coding.display`
- Put the **UI term** in `text` (critical fallback for systems that cannot parse expressions)

```json
"code": {
  "coding": [{
    "system": "http://snomed.info/sct",
    "code": "31978002:272741003=7771000",
    "display": "Fracture of the left tibia"
  }],
  "text": "Fracture of tibia, laterality, left"
}
```

**Display rules for expressions:**

- Use a **published human-readable term** from an expression repository, or
- Use a term from an **official description template**, or
- Use the **full expression with embedded terms** if nothing else is published
- `display` must not contain ad hoc user-entered terms that were not officially published

### Option B — Decompose the expression

Split into separate coded fields aligned to the information model:

- **Condition `code`:** focus concept (e.g. `125605004` — Fracture of bone)
- **`bodySite`:** attribute value (e.g. `719492002` — Bone structure of left tibia)

Each field uses standard precoordinated concept exchange (ID + display + system URI).

### Option C — Expression repository ID (use with caution)

- Exchange an **expression ID** (e.g. `527064`) as the code
- Receiver resolves it against a **shared expression repository**
- **Not recommended** unless the receiver is guaranteed access to the same repository

---

## 3. Sharing between SNOMED CT versions

**Technique:** Always include the **version URI** in exchanged messages so receivers know which release the sender used.

**Scenario A — Sender uses a newer version than receiver**

| Step | Action |
|------|--------|
| 1 | Receiver checks whether the concept exists in its loaded version |
| 2 | If missing, query a **public terminology server** |
| 3 | Resolve to the **closest ancestor active** in the receiver’s version |

**Scenario B — Sender uses an older version; concept is inactive in receiver’s version**

| Step | Action |
|------|--------|
| 1 | Use SNOMED CT **historical traceability** |
| 2 | Look up concept details in the **earlier version**, or |
| 3 | Apply the **replacement concept** from the **historical association reference set** |

**Recommendations:**

- Define the **source SNOMED CT version** in communication specifications
- Ensure all parties can access that version
- Provide a **public terminology server** to resolve version mismatches

---

## 4. Sharing between SNOMED CT editions (extensions)

**Technique:** Use **edition/module URIs** to identify national or local extensions (e.g. Netherlands `11000146104`, Sweden `45991000052106`).

**Problem:** A concept captured in one national edition may not exist in another system’s edition.

**Resolution techniques:**

- Query a **multi-edition terminology server**
- Map to the **closest international ancestor** concept

**Recommended approaches:**

1. Agree on a **shared versioned edition** for cross-border communication
2. Sender transmits **local extension concept + nearest international concept**
3. Receiver resolves the extension concept via a **shared server** holding the sender’s versioned edition

---

## 5. Sharing information model pieces (context)

**Technique:** Separate **clinical concept** from **context** using a shared exchange model, not only SNOMED codes.

**Key principle:** Context (family history vs current condition, suspected vs confirmed, body site, etc.) changes meaning. Local storage can differ; **exchange must follow a common model**.

**FHIR example — `Condition` resource:**

| Element | Role |
|---------|------|
| `code` | Core clinical finding (e.g. malignant neoplastic disease) |
| `bodySite` | Anatomical location (e.g. breast structure) |
| `verificationStatus` | Certainty (e.g. suspected) |

**Interoperability pattern:** Each hospital may store “suspected breast cancer” differently locally, but at the exchange boundary they **map to agreed SNOMED-coded slots** in the shared FHIR structure.

**Static information models:**

- Archetypes
- Templates
- FHIR Resources

**Dynamic information models:**

- FHIR **Questionnaire** / **QuestionnaireResponse**
- **SDC** (Structured Data Capture)
- **SMART on FHIR** form rendering
- Pipeline: Form → QuestionnaireResponse → extract to Conditions/Observations → clinical data repository → HIE

---

## 6. HIE framework — supporting techniques

SNOMED CT is positioned alongside other standards in a governed exchange framework:

| Layer | Example standards |
|-------|-------------------|
| Clinical terminology | SNOMED CT (diagnoses, allergies, meds, procedures) |
| Statistical coding | ICD-10 |
| Billing | National procedure nomenclature (mapped to SNOMED CT) |
| Information models | HL7 FHIR (Condition, FamilyMemberHistory, IPS, MedicationRequest, …) |
| Patient ID | IHE PIX profile |
| Documents | IHE XDS |
| Security | National secure health networks |

**Architecture patterns:**

- **Centralized hub** — standards enforced on the HIE platform
- **Decentralized** — standards enforced at each endpoint

**Governance techniques:** standard selection, local adaptation/extension, mapping, education, incentives, enforcement, and linkage to public health reporting and billing.

---

## Quick reference — when to use what

| Clinical data type | Primary technique |
|-------------------|-------------------|
| Single SNOMED concept | Precoordinated: ID + display + system + version URI |
| Qualified concept (laterality, severity, etc.) | Postcoordination: terse expression, decomposition, or shared expression ID |
| Cross-system with different SNOMED releases | Version URI + terminology server ancestor/replacement lookup |
| Cross-border / national extensions | Edition URI + international ancestor mapping |
| Context-dependent meaning | FHIR (or other) information model slots, not code alone |

---

## Core takeaway

Quality SNOMED CT exchange is not “send the concept ID.” It is a set of techniques for sending **identifiable, versioned, human-readable, contextually structured** clinical data within an agreed **standards-based HIE framework**—with terminology services used to reconcile version and edition mismatches at the boundary.
