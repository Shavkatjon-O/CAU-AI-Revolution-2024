NGINX_SETUP_SCRIPT := nginx.setup.sh

.PHONY: nginx-setup

nginx-setup:
	chmod +x $(NGINX_SETUP_SCRIPT)
	./$(NGINX_SETUP_SCRIPT)

deploy:
	git pull origin main
	docker compose down
	docker compose up -d --build
