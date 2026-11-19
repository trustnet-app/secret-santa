_DEV_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
COMPOSE  := docker compose -f $(CURDIR)/docker-compose.yml

.DEFAULT_GOAL := help

.PHONY: help
help: ## List targets
	@awk 'BEGIN {FS = ":.*## "; print "Usage: make <target>\n"} /^[a-zA-Z0-9_-]+:.*## / {printf "  %-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: up
up: ## Start the app container (needs ../oauth.env)
	$(COMPOSE) up -d --wait

.PHONY: down
down: ## Stop the container, keep the SQLite file
	$(COMPOSE) down

.PHONY: reset
reset: ## Stop the container and destroy the node_modules volume
	$(COMPOSE) down -v --remove-orphans

.PHONY: logs
logs: ## Follow logs (SERVICE=name to narrow)
	$(COMPOSE) logs -f $(SERVICE)

.PHONY: ps
ps: ## Show container status
	$(COMPOSE) ps

.PHONY: dev
dev: ## Run the app on the host instead (live logs)
	cd .. && node --env-file=oauth.env src/server.js

.PHONY: seed
seed: ## Run seed scripts from _DEV/seed/
	@for f in seed/*.sh; do [ -e "$$f" ] || continue; echo "== $$f"; sh "$$f"; done

.PHONY: e2e-deps
e2e-deps: ## Install end-to-end test dependencies
	cd ../_TEST && npm install --include=dev && npx playwright install --with-deps chromium

.PHONY: e2e
e2e: ## Run the end-to-end suite against the running app
	cd ../_TEST && npm test

.PHONY: e2e-full
e2e-full: up ## Bring the app up, then run the end-to-end suite
	$(MAKE) e2e
