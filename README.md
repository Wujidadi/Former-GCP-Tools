# Former GCP Tools

個人有時候會用到的小工具集，以前放在 GCP 上，所以叫做 Former GCP Tools。

## 運行生產環境伺服器參考指令

```bash
bun i
bun run build
NITRO_PORT=3000 bun ./.output/server/index.mjs &
sudo NITRO_PORT=84 $(which bun) ./.output/server/index.mjs & # Under port 1024
```

## 在 RPi 4B 8G Main Server 上啟動

在 **RPi 4B 8G Main Server**（`rpi-4b-8g-main-server`）上啟動服務：

1. `tmux` 進入獨立的 tmux session
2. `sudo NITRO_PORT=84 $(which bun) ./.output/server/index.mjs &` 在 tmux session 中背景啟動伺服器
3. 先按 Ctrl + B，再按 D 離開 tmux session
