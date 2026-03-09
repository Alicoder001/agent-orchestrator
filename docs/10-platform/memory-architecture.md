# Memory Architecture

## Maqsad

Ushbu hujjat platformadagi memory qatlamining tuzilmasini belgilaydi.

Memory bu raw chat history emas. U tanlangan, tekshirilgan va qayta foydalanishga yaroqli bilim qatlami hisoblanadi.

## Asosiy prinsip

Memory:

- `curated`
- `typed`
- `scoped`
- `policy-controlled`
- `expirable`

bo'lishi kerak.

## Memory turlari

### Working Memory

Qisqa umrli, session-level memory:

- current task state
- immediate decisions
- short-lived assumptions
- active blockers

### Episodic Memory

Oldingi ishlar va natijalar tarixi:

- oldingi sprint outcome
- agent attempts
- failure patterns
- intervention history

### Semantic Memory

Barqaror va uzoq yashovchi bilim:

- architecture facts
- domain model
- project constraints
- naming standards
- operating rules

### Preference Memory

Foydalanuvchi yoki organization afzalliklari:

- response style
- risk tolerance
- approval expectations
- formatting preference

## Metadata policy

Har bir memory record quyidagilar bilan yuradi:

- type
- scope
- owner
- confidence
- source
- freshness
- review status
- expiry rule

## Scope modeli

Memory quyidagi scope'larda bo'lishi mumkin:

- platform
- organization
- team
- workspace
- project
- agent
- user
- session

## Lifecycle

1. raw event or raw input
2. candidate fact extraction
3. policy filtering
4. confidence assignment
5. memory write
6. retrieval scoring
7. expiry or refresh

## Contradiction handling

Qarama-qarshi bilimlar quyidagilar bilan boshqariladi:

- source comparison
- freshness comparison
- confidence comparison
- review-required flag

## Forgetting policy

Quyidagilar unutilishi yoki pastlashtirilishi mumkin:

- stale transient facts
- outdated assumptions
- superseded project states
- low-confidence derived memory

## Transcriptdan farqi

- transcript tarixdir
- event log operatsion izdir
- memory qayta foydalaniladigan bilimdir

## Yakuniy hukm

Platforma memory'ni boshqariladigan knowledge infrastructure sifatida quradi.
