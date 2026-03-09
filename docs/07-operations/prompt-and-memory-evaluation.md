# Prompt and Memory Evaluation

## Maqsad

Ushbu hujjat prompt, context va memory qatlamlari sifatini qanday baholashni belgilaydi.

## Nima uchun bu kerak

Prompt architecture production tizimda evalsiz yashamasligi kerak.

Har bir muhim o'zgarish quyidagilarga ta'sir qiladi:

- correctness
- safety
- consistency
- tool discipline
- context usage quality
- memory recall quality

## Evaluation yo'nalishlari

### Prompt eval

Tekshiradi:

- instruction following
- output structure
- escalation discipline
- hallucination resistance
- provider adaptation quality

### Context eval

Tekshiradi:

- context relevance
- missing critical facts
- overstuffed context
- source attribution integrity

### Memory eval

Tekshiradi:

- correct recall
- false recall rate
- stale memory leakage
- contradiction handling
- preference persistence quality

## Evaluation formatlari

- golden tasks
- regression suites
- red-team scenarios
- provider comparison runs
- human review samples

## Release gate

Prompt, context yoki memory qatlami o'zgarishi productionga quyidagi shartlarsiz chiqmaydi:

- regression pass
- safety check pass
- major failure delta yo'qligi
- documented change intent

## Operational ownership

Owner'lar aniq bo'lishi kerak:

- prompt systems owner
- platform architecture owner
- product quality owner

## Yakuniy hukm

Prompt va memory sifati fikr bilan emas, evaluation bilan boshqariladi.
