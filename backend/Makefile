# Food Delivery Application - Docker Makefile

# Variables
VERSION ?= latest
REGISTRY ?= food-delivery
COMPOSE_FILE = docker-compose.yml
COMPOSE_DEV = docker-compose.dev.yml
ENV_FILE = .env.local

# Services
SERVICES = api-gateway auth-service user-service restaurant-service order-service payment-service delivery-service notification-service review-service promotion-service

# Colors for output
CYAN = \033[0;36m
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m # No Color

.PHONY: help
help: ## Show this help message
	@echo "$(CYAN)Food Delivery Application - Docker Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-30s$(NC) %s\n", $$1, $$2}'

##@ Development

.PHONY: dev-up
dev-up: ## Start development environment (infrastructure + dev tools)
	@echo "$(CYAN)Starting development environment...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV) up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "PgAdmin: http://localhost:5050"
	@echo "Redis Commander: http://localhost:8081"

.PHONY: dev-down
dev-down: ## Stop development environment
	@echo "$(CYAN)Stopping development environment...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV) down

.PHONY: dev-infra
dev-infra: ## Start only infrastructure (postgres, redis, pgadmin, redis-commander)
	@echo "$(CYAN)Starting infrastructure services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV) up -d postgres redis pgadmin redis-commander
	@echo "$(GREEN)Infrastructure services started!$(NC)"

##@ Production

.PHONY: up
up: ## Start all services in production mode
	@echo "$(CYAN)Starting all services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)All services started!$(NC)"

.PHONY: down
down: ## Stop all services
	@echo "$(CYAN)Stopping all services...$(NC)"
	docker-compose down

.PHONY: restart
restart: down up ## Restart all services

.PHONY: ps
ps: ## Show status of all services
	docker-compose ps

##@ Building

.PHONY: build
build: ## Build all service images
	@echo "$(CYAN)Building all services...$(NC)"
	@for service in $(SERVICES); do \
		echo "$(YELLOW)Building $$service...$(NC)"; \
		docker build -f apps/$$service/Dockerfile -t $(REGISTRY)/$$service:$(VERSION) -t $(REGISTRY)/$$service:latest .; \
	done
	@echo "$(GREEN)All services built successfully!$(NC)"

.PHONY: build-service
build-service: ## Build a specific service (usage: make build-service SERVICE=api-gateway)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(YELLOW)Usage: make build-service SERVICE=<service-name>$(NC)"; \
		exit 1; \
	fi
	@echo "$(CYAN)Building $(SERVICE)...$(NC)"
	docker build -f apps/$(SERVICE)/Dockerfile -t $(REGISTRY)/$(SERVICE):$(VERSION) -t $(REGISTRY)/$(SERVICE):latest .
	@echo "$(GREEN)$(SERVICE) built successfully!$(NC)"

.PHONY: build-nx
build-nx: ## Build all services using NX
	@echo "$(CYAN)Building all services with NX...$(NC)"
	@for service in $(SERVICES); do \
		echo "$(YELLOW)Building $$service with NX...$(NC)"; \
		npx nx docker-build $$service; \
	done

##@ Logs

.PHONY: logs
logs: ## Show logs for all services
	docker-compose logs -f

.PHONY: logs-service
logs-service: ## Show logs for a specific service (usage: make logs-service SERVICE=api-gateway)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(YELLOW)Usage: make logs-service SERVICE=<service-name>$(NC)"; \
		exit 1; \
	fi
	docker-compose logs -f $(SERVICE)

##@ Database

.PHONY: db-shell
db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d food_delivery

.PHONY: db-migrate
db-migrate: ## Run database migrations (placeholder)
	@echo "$(YELLOW)Run your migration commands here$(NC)"
	# docker-compose exec api-gateway npm run migration:run

.PHONY: db-backup
db-backup: ## Backup database
	@echo "$(CYAN)Creating database backup...$(NC)"
	docker-compose exec -T postgres pg_dump -U postgres food_delivery > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup created!$(NC)"

.PHONY: db-restore
db-restore: ## Restore database (usage: make db-restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(YELLOW)Usage: make db-restore FILE=<backup-file>$(NC)"; \
		exit 1; \
	fi
	@echo "$(CYAN)Restoring database from $(FILE)...$(NC)"
	docker-compose exec -T postgres psql -U postgres food_delivery < $(FILE)
	@echo "$(GREEN)Database restored!$(NC)"

##@ Redis

.PHONY: redis-cli
redis-cli: ## Open Redis CLI
	docker-compose exec redis redis-cli -a $$(grep REDIS_PASSWORD $(ENV_FILE) | cut -d '=' -f2)

.PHONY: redis-flush
redis-flush: ## Flush Redis cache (WARNING: Deletes all cache)
	@echo "$(YELLOW)WARNING: This will delete all cache!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose exec redis redis-cli -a $$(grep REDIS_PASSWORD $(ENV_FILE) | cut -d '=' -f2) FLUSHALL; \
		echo "$(GREEN)Cache flushed!$(NC)"; \
	fi

##@ Cleanup

.PHONY: clean
clean: ## Remove stopped containers and unused images
	@echo "$(CYAN)Cleaning up...$(NC)"
	docker-compose down -v --remove-orphans
	docker system prune -f
	@echo "$(GREEN)Cleanup complete!$(NC)"

.PHONY: clean-all
clean-all: ## Remove all containers, images, and volumes (WARNING: Deletes all data)
	@echo "$(YELLOW)WARNING: This will delete ALL Docker data including volumes!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker system prune -a -f --volumes; \
		echo "$(GREEN)All Docker data removed!$(NC)"; \
	fi

##@ Health & Monitoring

.PHONY: health
health: ## Check health status of all services
	@echo "$(CYAN)Checking service health...$(NC)"
	@docker-compose ps | grep -E "Up|healthy"

.PHONY: stats
stats: ## Show container resource usage
	docker stats --no-stream

##@ Testing

.PHONY: test
test: ## Run tests (placeholder)
	@echo "$(CYAN)Running tests...$(NC)"
	# Add your test commands here
	# npx nx run-many --target=test --all

##@ Utility

.PHONY: env-setup
env-setup: ## Copy environment template
	@if [ -f $(ENV_FILE) ]; then \
		echo "$(YELLOW)$(ENV_FILE) already exists!$(NC)"; \
	else \
		cp .env.docker.example $(ENV_FILE); \
		echo "$(GREEN)$(ENV_FILE) created from template!$(NC)"; \
		echo "$(YELLOW)Please edit $(ENV_FILE) with your configuration.$(NC)"; \
	fi

.PHONY: shell
shell: ## Open shell in a service container (usage: make shell SERVICE=api-gateway)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(YELLOW)Usage: make shell SERVICE=<service-name>$(NC)"; \
		exit 1; \
	fi
	docker-compose exec $(SERVICE) sh

.PHONY: validate
validate: ## Validate docker-compose configuration
	docker-compose config

.PHONY: version
version: ## Show versions
	@echo "Docker version:"
	@docker --version
	@echo "\nDocker Compose version:"
	@docker-compose --version
	@echo "\nCurrent VERSION: $(VERSION)"

##@ Quick Commands

.PHONY: quick-start
quick-start: env-setup up ## Quick start (setup env + start all services)
	@echo "$(GREEN)Application started!$(NC)"
	@echo "API Gateway: http://localhost:3000"

.PHONY: rebuild
rebuild: down build up ## Rebuild and restart all services

.PHONY: reset
reset: clean build up ## Full reset: clean, build, and start
