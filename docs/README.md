# Documentation

This documentation tree is the source of truth for the new monorepo.

## Writing Order

1. `00-foundation`
2. `09-product`
3. `01-architecture`
4. `10-platform`
5. `12-experience`
6. `05-governance`
7. `13-decisions`
8. `02-standards`
9. `03-templates`
10. `04-roadmap`
11. `11-ecosystem`
12. `07-operations`
13. `08-worklogs`
14. `14-research`

## Rules

- Architecture decisions should be written before code structure is finalized.
- Templates should standardize future docs, not replace thinking.
- Roadmap should follow architecture, not drive it blindly.
- Governance should define how the team and agents operate before execution scales.
- ADRs should capture important technical decisions as they are made.
- Worklogs should be append-only and simple enough to keep current.
- General project understanding should live inside `docs`, but in dedicated layers:
  - `00-foundation` for platform thesis and vision
  - `09-product` for product identity and models
  - `01-architecture` and `10-platform` for system design
