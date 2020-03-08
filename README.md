# KPZ MPK API

## Setup

What do you need?

#### For POSIX
- asdf - https://asdf-vm.com/#/core-manage-asdf-vm
- asdf-nodejs - https://github.com/asdf-vm/asdf-nodejs
- docker - https://www.docker.com/products/docker-desktop

#### For Windows
- Get WSL2 - https://docs.microsoft.com/en-us/windows/wsl/wsl2-install
- Install asdf* into WSL2
- Clone repo into WSL2
- For database use Docker for Windows with Linux containers.


```sh
# Clone the repo
git clone git@github.com:angrynerds-pl/kpz-mpk-api.git

# Go to the repo
cd kpz-mpk-api

# Install deps
asdf install

# Install yarn
npm i -g yarn

# Install node deps
yarn --ignore-platform

# Create the database or just use Kitematic lol
# docker run --name kpz_mpk_api_postgres -p 5432:5432 mdillon/postgis:11
# use kitematic https://kitematic.com/

# Create the configuration file
export DATABASE_URL='postgresql://postgres:mysecretpassword@localhost:6969/postgres' > .env
```

### Development

```sh
# Load the config
source .env

# Run the application in development mode
yarn dev
```

### Running checks

Run this before you commit changes. It should be redundent if you have been editing files using IDE with `prettier` and `eslint` plugins properly configured.

```sh
yarn format
yarn lint --fix
```
