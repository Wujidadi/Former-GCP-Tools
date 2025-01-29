# Former GCP Tools

個人有時候會用到的小工具集，以前放在 GCP 上，所以叫做 Former GCP Tools。

## 運行生產環境伺服器參考指令

```bash
bun i
bun run build
NITRO_PORT=3000 bun ./.output/server/index.mjs &
sudo NITRO_PORT=84 $(which bun) ./.output/server/index.mjs & # Under port 1024
```
