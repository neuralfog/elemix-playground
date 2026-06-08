.PHONY: dev assets image up down install

dev:
	@pnpm dev

assets:
	@pnpm build

image:
	@docker compose build

up:
	@docker compose up -d

down:
	@docker compose down

install: image
	@sed "s|^WorkingDirectory=.*|WorkingDirectory=$(CURDIR)|" elemix-playground.service \
		> /etc/systemd/system/elemix-playground.service
	@systemctl daemon-reload
	@systemctl enable elemix-playground
	@systemctl restart elemix-playground
