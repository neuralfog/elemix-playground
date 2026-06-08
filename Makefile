.PHONY: dev assets image rebuild up down install

dev:
	@pnpm dev

assets:
	@pnpm build

image:
	@docker compose build

rebuild:
	@docker compose build --no-cache --pull

up:
	@docker compose up -d

down:
	@docker compose down

install: rebuild
	@sed "s|^WorkingDirectory=.*|WorkingDirectory=$(CURDIR)|" elemix-playground.service \
		> /etc/systemd/system/elemix-playground.service
	@systemctl daemon-reload
	@systemctl enable elemix-playground
	@systemctl restart elemix-playground
