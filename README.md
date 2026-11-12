# Former GCP Tools

個人有時候會用到的小工具集，以前放在 GCP 上，所以叫做 Former GCP Tools。

## 部署

所有工具皆為純前端頁面，以 `nuxt generate` 產生靜態檔，交由 Apache 服務，不需常駐 Node／Bun 行程。

### RPi 4B 8G Main Server

在 **RPi 4B 8G Main Server**（`rpi-4b-8g-main-server`）上，專案位於 `/home/wujidadi/workspace/Former-GCP-Tools`，由 Apache 於 84 埠服務 `.output/public`。

更新部署：

```bash
git pull
bun i
bun run generate
```

`bun run generate` 完成後即生效，Apache 不需重新載入。

Apache 站台設定備份於 `deploy/apache/former-gcp-tools.conf`；在新機器上從零部署的步驟見 [deploy/README.md](deploy/README.md)。
