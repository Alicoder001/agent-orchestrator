# Prompt Engineering Architecture

## Maqsad

Ushbu hujjat platformadagi prompt engineering tizimining arxitekturasini belgilaydi.

Prompt engineering bu platformada oddiy prompt yozish amaliyoti emas. U platforma sifati, xavfsizligi, boshqaruvchanligi va agent xulqini ushlab turadigan asosiy infratuzilma qatlamidir.

## Asosiy prinsip

Promptlar:

- `versioned`
- `layered`
- `composed`
- `policy-controlled`
- `evaluated`

bo'lishi kerak.

## Prompt qatlamlari

### Default Ultra Layer

Bu qatlam platformaning o'zgarmas yadro prompt qismidir.

U quyidagilarni o'z ichiga oladi:

- ultra golden rules
- safety rules
- anti-hallucination rules
- escalation rules
- tool-use discipline
- output discipline

Bu qatlam:

- har doim faol
- foydalanuvchi tomonidan o'chirilmaydi
- custom prompt bilan override qilinmaydi

### Advanced Prompt Layer

Bu qatlam kuchli foydalanuvchilar va advanced use-case'lar uchun ishlatiladi.

U quyidagilarni boshqaradi:

- role presetlar
- department presetlar
- mode-specific prompting
- reasoning depth tuning
- response structure tuning
- runtime-specific adaptation

### Custom Prompt Layer

Bu qatlam foydalanuvchi va organization darajasidagi maxsus ehtiyojlar uchun ishlatiladi.

Scope misollari:

- organization prompt
- team prompt
- workspace prompt
- project prompt
- agent prompt
- task prompt
- session prompt

Bu qatlam extension sifatida ishlaydi, core policy sifatida emas.

## Prompt composition tartibi

Final prompt quyidagi tartibda yig'iladi:

1. platform core rules
2. security and policy rules
3. organization rules
4. team and workspace rules
5. project rules
6. agent role rules
7. task instructions
8. session context
9. provider or runtime adaptation

## Prompt registry

Har bir prompt pack registry orqali boshqariladi.

Minimal metadata:

- prompt ID
- version
- scope
- owner
- status
- allowed override level
- evaluation history

## Prompt va context farqi

- `prompt` agent qanday ishlashi kerakligini belgilaydi
- `context` agent nimalarni bilib ish boshlashi kerakligini belgilaydi

Bu ikkalasi aralashtirilmaydi.

## Provider adaptation

Platforma semantics bir xil qoladi, lekin final instruction uslubi turli runtime va providerlarga moslashtiriladi:

- Claude-oriented adaptation
- Codex-oriented adaptation
- Gemini-oriented adaptation
- Qwen-oriented adaptation
- local LLM adaptation

## Qat'iy qoidalar

- raw custom promptlar core policy'ni sindirmaydi
- promptlar source-controlled bo'ladi
- promptlar evalsiz production status olmaydi
- provider-specific promptlar platforma semantics'ni almashtirmaydi

## Yakuniy hukm

Prompt engineering platformadagi strategik va boshqariladigan intelligence qatlami hisoblanadi.
