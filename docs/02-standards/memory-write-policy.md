# Memory Write Policy

## Maqsad

Ushbu hujjat qaysi ma'lumot memoryga yozilishi, qaysilari yozilmasligi va qanday shartlarda yozilishi kerakligini belgilaydi.

## Yozish mezonlari

Memoryga yoziladigan ma'lumot quyidagilarga javob berishi kerak:

- useful
- durable
- scoped
- attributable
- policy-allowed

## Yozilishi mumkin

- verified architecture facts
- stable project constraints
- persistent preferences
- important decisions
- recurring failure patterns
- durable workflow facts

## Yozilmasligi kerak

- raw transcript noise
- temporary confusion
- unverified assumptions
- sensitive data without policy approval
- stale runtime state
- redundant repeated text

## Confidence policy

Har bir memory record confidence bilan yoziladi:

- low
- medium
- high

Low-confidence memory dominant contextga default chiqmaydi.

## Review policy

Review talab qiladigan holatlar:

- cross-team facts
- security-relevant facts
- org-wide preferences
- architecture-level derived facts

## Expiry policy

Har bir memory type expiry yoki refresh strategiyasiga ega bo'ladi.

## Yakuniy hukm

Platforma memory'ni nazoratli bilim sifatida saqlaydi, raw dump sifatida emas.
