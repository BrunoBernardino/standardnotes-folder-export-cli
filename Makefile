.PHONY: start
start:
	deno run --allow-read --allow-write main.ts

.PHONY: format
format:
	deno fmt

.PHONY: test
test:
	deno fmt --check
	deno lint
	deno test --check=all
