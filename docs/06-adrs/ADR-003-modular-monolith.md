# ADR-003: Backend Modular Monolith sifatida boshlanadi

## Status
ACCEPTED

## Kontekst

Platform backend'ni qanday tuzish kerak? Microservices yoki monolith?

Platformaning v1 holatida:
- Domain chegaralari hali to'liq aniqlangan emas
- Team kichik
- Deployment complexity minimal bo'lishi kerak
- Performance talabi bor (agent orchestration)

## Qaror

Backend **modular monolith** sifatida boshlanadi — aniq domain boundary bilan, lekin bitta deploy unit.

## Sabab

**Modular monolith tanlash sabablari:**
- Domain boundary'lar noto'g'ri chizilsa microservice'da fix qilish qimmat
- Network hop yo'q — orchestration latency minimal
- Bitta deploy, bitta monitoring, bitta log stream
- Bounded contexts hujjatida belgilangan chegaralar kod ichida modul sifatida yashaydı
- Keyinchalik service extraction qilinsa — boundary allaqachon aniq

**Microservices rad etilish sababi (v1 uchun):**
- Operational complexity: service discovery, network partition, distributed tracing
- Team kichik — har bir service'ga mas'ul kishi yo'q
- Domain boundary'lar hali 100% aniq emas

**Extraction qoidasi:**
Quyidagi holatlarda service extraction qilinadi:
- Bitta domain mustaqil scale talab qilsa (masalan: Realtime Context)
- Bitta domain boshqa tech stack'ga muhtoj bo'lsa
- Team yetarlicha kattalashsa

## Oqibatlar

**Ijobiy:**
- Birinchi yil deployment va debugging sodda
- Bounded context chegaralari kod modullariga to'g'ri keladI
- Refactoring oson — bitta repo, bitta codebase

**Salbiy:**
- Katta traffic'da bottleneck bo'lishi mumkin (keyinroq hal qilinadi)
- Accidental coupling xavfi — modullar o'rtasida import qoidalariga rioya qilish kerak

## Chegaralar

Modular monolith ichida quyidagi qoidalar qat'iy:
- `identity` paketi boshqa paketga import qilinmaydi (u boshqalarni import qiladi)
- `orchestration` paketi `organization` paketini faqat interface orqali chaqiradi
- Paketlar o'rtasida to'g'ridan struct sharing taqiqlangan — faqat interface va DTO

## Alternativlar ko'rib chiqildi

- Microservices from day 1 — rad etildi (yuqorida)
- Serverless — rad etildi (long-running session'lar uchun mos emas)
