# 從零部署

在全新的樹莓派 + Ubuntu 上部署本專案的步驟。
現行部署環境為 RPi 4B 8G Main Server（`rpi-4b-8g-main-server`，Ubuntu 24.04、Apache 2.4.58、Bun 1.4.4）。

## 需依新機器調整的設定

| 項目       | 位置                                            | 現值                                                       |
| ---------- | ----------------------------------------------- | ---------------------------------------------------------- |
| 靜態檔目錄 | `apache/former-gcp-tools.conf` 的 `Define`      | `/home/wujidadi/workspace/Former-GCP-Tools/.output/public` |
| 服務埠     | `apache/former-gcp-tools.conf` 的 `Listen`      | `84`                                                       |
| 管理者信箱 | `apache/former-gcp-tools.conf` 的 `ServerAdmin` | `wujidadi@gmail.com`                                       |

若新機器已有其他設定佔用 84 埠（`ports.conf` 或其他站台的 `Listen 84`），須移除重複的 `Listen` 或改用其他埠，否則 Apache 無法啟動。

## 步驟

1. 安裝系統套件：

   ```bash
   sudo apt update
   sudo apt install -y apache2 git unzip
   ```

2. 安裝 Bun（版本與 `bun.lock` 一致）：

   ```bash
   curl -fsSL https://bun.sh/install | bash -s "bun-v1.4.4"
   exec $SHELL -l
   ```

3. 取得原始碼並產生靜態檔：

   ```bash
   mkdir -p ~/workspace && cd ~/workspace
   git clone git@github.com:Wujidadi/Former-GCP-Tools.git
   cd Former-GCP-Tools
   bun i
   bun run generate
   ```

   在 RPi 4B 上約需 1 分鐘，記憶體峰值約 600 MB。

4. 讓 Apache（`www-data`）能進入家目錄。
   Ubuntu 24.04 的 `HOME_MODE` 預設為 `0750`，`www-data` 無法穿越家目錄，網站會回 403：

   ```bash
   chmod o+x ~
   ```

   路徑上的其他目錄（`~/workspace` 以下）預設為 `755`，不需調整。

5. 啟用 Apache 模組與站台：

   ```bash
   sudo a2enmod headers
   sudo install -m 644 deploy/apache/former-gcp-tools.conf /etc/apache2/sites-available/
   sudo a2ensite former-gcp-tools
   sudo apache2ctl configtest && sudo systemctl reload apache2
   ```

   Ubuntu 預設未啟用 `mod_headers`；`mod_deflate` 預設已啟用，負責壓縮回應。

6. 若啟用了 `ufw`，開放服務埠：

   ```bash
   sudo ufw allow 84/tcp
   ```

7. 驗證：

   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:84/              # 200
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:84/nope          # 404
   ```

## 更新部署

```bash
git pull
bun i
bun run generate
```

`bun run generate` 完成後即生效，Apache 不需重新載入。
