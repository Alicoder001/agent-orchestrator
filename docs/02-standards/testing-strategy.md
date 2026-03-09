# Testing Strategy

## Maqsad

Ushbu hujjat platformadagi test strategiyasini, test turlari, coverage talablari, va release gate'larini belgilaydi.

Bu hujjat `engineering-principles.md` (test at the boundary), `coding-standards.md` (architecture guards) va `implementation-sequencing.md` (70% coverage exit criteria) ga asoslanadi.

---

## Test Pyramid

```
          ╱╲
         ╱  ╲         E2E Tests (5%)
        ╱    ╲         Browser-based, slow, critical paths only
       ╱──────╲
      ╱        ╲       Integration Tests (25%)
     ╱          ╲       Real database, cross-module, API-level
    ╱────────────╲
   ╱              ╲     Unit Tests (70%)
  ╱                ╲     Fast, isolated, behavior-focused
 ╱──────────────────╲
```

| Test turi | Nisbat | Tezlik | Ishlatiladi |
|-----------|--------|--------|-------------|
| Unit | 70% | < 1s per test | Har bir PR, local dev |
| Integration | 25% | < 10s per test | Har bir PR, CI |
| E2E | 5% | < 60s per test | Release oldidan, CI (optional) |

---

## Test turlari va qo'llanishi

### Unit Tests

**Maqsad:** Bitta module yoki function'ning behavior'ini isolated tekshirish.

**Go:**
```go
// service_test.go
func TestOrganizationService_Create(t *testing.T) {
    // Given — mock repository
    repo := &MockOrgRepository{
        CreateFn: func(ctx context.Context, org *Organization) error {
            return nil
        },
    }
    svc := NewService(repo, &MockEventBus{})

    // When
    org, err := svc.Create(context.Background(), CreateOrgInput{
        Name: "Acme Corp",
        Slug: "acme",
        Type: "company",
    })

    // Then
    assert.NoError(t, err)
    assert.Equal(t, "Acme Corp", org.Name)
    assert.Equal(t, "acme", org.Slug)
}
```

**TypeScript:**
```typescript
// session-card.test.tsx
describe('SessionCard', () => {
  it('renders session status badge', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText('working')).toBeInTheDocument();
  });

  it('shows critical attention for failed CI', () => {
    const session = { ...mockSession, attention: 'critical' };
    render(<SessionCard session={session} />);
    expect(screen.getByTestId('attention-badge')).toHaveClass('critical');
  });
});
```

**Qoidalar:**
- Har bir public function/method uchun kamida 1 test
- Happy path + edge case + error case
- External dependency mock qilinadi (database, API, event bus)
- Test nomi format: `Test{Subject}_{Method}_{Scenario}`

### Integration Tests

**Maqsad:** Module chegarasida real dependency bilan ishlashni tekshirish (database, Redis).

**Go:**
```go
// repository_integration_test.go
// +build integration

func TestOrgRepository_Create_Integration(t *testing.T) {
    // Given — real database (test container)
    db := setupTestDB(t)
    repo := NewRepository(db)

    // When
    org, err := repo.Create(context.Background(), &Organization{
        Name: "Test Org",
        Slug: "test-org",
        Type: "company",
    })

    // Then
    assert.NoError(t, err)
    assert.NotEmpty(t, org.ID)

    // Verify — re-read from DB
    found, err := repo.FindBySlug(context.Background(), "test-org")
    assert.NoError(t, err)
    assert.Equal(t, org.ID, found.ID)
}
```

**API Integration test:**
```go
func TestCreateOrganization_API(t *testing.T) {
    // Given — running server with test database
    server := setupTestServer(t)

    // When
    resp := server.POST("/api/v1/orgs", `{
        "name": "Acme",
        "slug": "acme",
        "type": "company"
    }`)

    // Then
    assert.Equal(t, http.StatusCreated, resp.Code)
    var body map[string]interface{}
    json.Unmarshal(resp.Body.Bytes(), &body)
    assert.Equal(t, "Acme", body["data"].(map[string]interface{})["name"])
}
```

**Qoidalar:**
- Test database — Docker container bilan (testcontainers-go)
- Har bir test transaction ichida yoki alohida schema'da
- Test data factory ishlatiladi (hardcoded data emas)
- Cleanup: har test o'z data'sini tozalaydi

### E2E Tests

**Maqsad:** Foydalanuvchi scenariysi — register'dan session spawn'gacha to'liq flow.

**Critical paths (V1):**
1. User registration → login → token olish
2. Organization yaratish → team qo'shish → member invite
3. Project yaratish → task yaratish → session spawn
4. Session lifecycle: spawn → working → needs_response → done

**Tool:** Playwright (frontend E2E), yoki API E2E (Go test)

**Qoidalar:**
- Faqat critical user flow'lar uchun
- Parallel run
- Flaky test 3 marta fail bo'lsa → tuzatiladi yoki o'chiriladi
- E2E test CI'da optional (merge bloklamaydi, lekin release blokLaydi)

---

## Required Coverage by Layer

| Layer | Min coverage | Tekshirish usuli |
|-------|-------------|-----------------|
| Handler (HTTP) | 60% | Request/response test |
| Service (Business) | 80% | Unit + mock |
| Repository (Data) | 70% | Integration + test DB |
| Shared/Utils | 90% | Unit test |
| Frontend Components | 70% | React Testing Library |
| Frontend Hooks | 80% | renderHook + mock API |
| **Umumiy modul** | **≥ 70%** | CI enforcement |

### Coverage tool'lari

| Stack | Tool | Command |
|-------|------|---------|
| Go | Built-in | `go test -coverprofile=coverage.out ./...` |
| TypeScript | Vitest | `vitest run --coverage` |

---

## Contract Testing

### OpenAPI contract validation

```yaml
# CI step
- name: Validate API Contract
  run: |
    # Check that all API responses match OpenAPI schema
    openapi-diff --fail-on-incompatible api/openapi.yaml api/openapi-prev.yaml
```

### Inter-module contract

Module'lar arasi qoida (`bounded-contexts.md` L211-214):
- Module A → Module B faqat interface orqali
- Interface contract test: B'ning interface implementatsiyasi spec'ga mos kelishini tekshirish

```go
// Ensure OrgQuerier interface is satisfied
var _ identity.OrgQuerier = (*organization.Service)(nil)
```

### Event contract

Event bus orqali yuborilgan event'lar:
- Event struct uchun type test (serialization/deserialization)
- Subscriber test: to'g'ri event olganida to'g'ri reaction beradi

---

## Release Gates

### PR merge uchun (har bir PR)

| Gate | Reqiured | Vosita |
|------|----------|--------|
| `go test ./...` pass | ✅ | GitHub Actions |
| `golangci-lint` pass | ✅ | GitHub Actions |
| `tsc --noEmit` pass | ✅ | GitHub Actions |
| `eslint .` pass | ✅ | GitHub Actions |
| `vitest run` pass | ✅ | GitHub Actions |
| Coverage ≥ 70% (yangi modul) | ✅ | CI + codecov |
| Peer review approved | ✅ | GitHub PR |

### Release uchun (staging/production)

| Gate | Required | Vosita |
|------|----------|--------|
| All PR gates pass | ✅ | CI |
| Integration tests pass | ✅ | CI (test containers) |
| E2E critical paths pass | ✅ | CI (Playwright / API) |
| OpenAPI contract valid | ✅ | CI |
| No known P0 bugs | ✅ | Manual check |
| Changelog updated | ✅ | Manual check |

---

## Test data management

### Factory pattern (Go)

```go
// testutil/factory.go
func NewTestOrganization(overrides ...func(*Organization)) *Organization {
    org := &Organization{
        ID:        uuid.Must(uuid.NewV7()),
        Name:      "Test Org",
        Slug:      "test-org-" + randomSuffix(),
        Type:      "company",
        CreatedAt: time.Now(),
    }
    for _, fn := range overrides {
        fn(org)
    }
    return org
}
```

### Test environment

```yaml
# docker-compose.test.yml
services:
  postgres-test:
    image: postgres:16
    environment:
      POSTGRES_DB: agent_orchestrator_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - "5433:5432"

  redis-test:
    image: redis:7-alpine
    ports:
      - "6380:6379"
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 1 tugagandan keyin
