## The problem

Pharmaceutical quality teams need software that regulators will trust, not just software that's fast. Records have to be attributable, tamper-evident and approved by the right people.

## What I built

VeraPlex is a compliance-first pharmaceutical intelligence platform. It's a FastAPI modular monolith built around a core modeled on 21 CFR Part 11:

- **Audit trail.** Every change is written to a SHA-256 hash-chained log, so tampering is detectable.
- **Electronic signatures.** Each signature is bound to the exact version of the record that was signed.
- **Segregation of duties.** AI agents are locked out of signing and approvals; those stay with authorized people.
- **Tenant isolation.** PostgreSQL row-level security keeps each organization's data separate.

It's built with Python, FastAPI, PostgreSQL, SQLAlchemy and Alembic.

## Where it stands

VeraPlex is in development. The current foundation work is on GitHub.
