# `_DEV/seed`

Optional seed scripts for local data. `make seed` runs every `*.sh` here.

Quiet Santa creates its schema on boot (`src/db.js`) and normally needs no seed:
use the fake login (`/dev/login?as=alice`) to create real groups and wishes
through the UI, or start a group against live TrustNet.

If a seed is added, it must be synthetic (guard G9) and must not copy
production `data.sqlite`.
