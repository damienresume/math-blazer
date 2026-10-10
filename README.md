# Math Blazer

A WordPress block for the storefront of an interactive math gamification LMS. The block is a course curriculum accordion with levels, lessons, XP and badges.

## 1. Install Docker and Git

### Linux

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

### macOS

Open Terminal. Skip the first command if Homebrew is installed.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install colima docker docker-compose git
mkdir -p ~/.docker/cli-plugins
ln -sfn "$(brew --prefix)/opt/docker-compose/bin/docker-compose" ~/.docker/cli-plugins/docker-compose
colima start --cpu 4 --memory 4
```

Run `colima start --cpu 4 --memory 4` again after every restart of the Mac. Clone the project inside your home folder.

### Windows

Open PowerShell as administrator, install Ubuntu and restart the computer:

```powershell
wsl --install -d Ubuntu
```

Open Ubuntu from the Start menu, create a username and password, then run:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo service docker start
sudo usermod -aG docker $USER
newgrp docker
```

Run every command in steps 2 to 7 in the Ubuntu terminal. Run `sudo service docker start` after every restart of the computer.

### Check

```bash
docker --version
docker compose version
git --version
```

## 2. Clone the project

```bash
git clone https://github.com/damienresume/math-blazer.git
cd math-blazer
```

## 3. Create the .env file

```bash
cp .env.example .env
```

Open `.env` in a text editor and set these values:

- `WP_ADMIN_USER`: the WordPress admin username.
- `WP_ADMIN_PASSWORD`: the WordPress admin password.
- `WP_ADMIN_EMAIL`: the admin email address.
- `DB_PASSWORD`: the database password.
- `DB_ROOT_PASSWORD`: the database root password.
- `WP_PORT`: the site port. Default `8080`. Use `8088` if `8080` is in use.
- `LOCAL_UID` and `LOCAL_GID`: leave `1000` on macOS. On Linux and in the Windows Ubuntu terminal, enter the output of `id -u` and `id -g`.


## 4. Start the site

```bash
docker compose up -d
```

The first start takes a few minutes.

Check the running containers:

```bash
docker ps
```

## 5. Wait for the setup

```bash
docker compose logs -f wpcli
```

Press Ctrl+C when the log shows `The site is ready.`

## 6. Open the site

Replace `8080` with your `WP_PORT`.

- Sample course: <http://localhost:8080/sample-course/>
- Free previews: <http://localhost:8080/preview/>
- Admin: <http://localhost:8080/wp-admin>

Log in with `WP_ADMIN_USER` and `WP_ADMIN_PASSWORD` from `.env`.

## 7. Stop the site

```bash
docker compose down            # stop, keep the data
docker compose down --volumes  # stop and delete the database
```

## Commands

Run these in the project folder.

| Task | Command |
| --- | --- |
| Start | `docker compose up -d` |
| Stop | `docker compose down` |
| Rebuild the block | `docker compose run --rm node npm run build` |
| Rebuild on every change | `docker compose --profile dev up -d` |
| Type check | `docker compose run --rm node npm run typecheck` |
| Lint | `docker compose run --rm node npm run lint:js` and `docker compose run --rm node npm run lint:css` |
| Unit tests | `docker compose run --rm node npm test` |
| Recreate the sample pages | `docker compose run --rm wpcli` |

## License

GPL-2.0-or-later.
