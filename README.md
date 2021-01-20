# Ghost Fluent UI

Ghost theme using the Fluent UI framework and based on the Microsoft SharePoint design.

[[_TOC_]]

## Configuration

To enjoy the features of this theme, some of them should be configured manually in accordance with your wishes.

You can see more information about the configuration into the [Wiki](../../wikis) pages of this project.

## Path to awesome

* `npm i` to install dependencies
* `npm run dev` to launch watcher

## Developer environment

### Windows Prerequisites

* Python for Windows
* Install NPM Build Tools as Administrator
    ```bash
    npm install --global --production windows-build-tools
    ```

### Docker environment

Use the provided Docker compose to install and test the theme:

1. Install Docker for Desktop
2. Create `data` folder into the parent folder of the solution (`../`) to keep persistent data
   1. Create `ghost` folder
   2. Create `mysql` folder
   3. Create `elasticsearch` folder
   4. Create `isso` folder
3. Launch Docker compose
    ```bash
    docker-compose -f ghost-compose.yml up -d
    ```
4. Edit your `hosts` file by adding at the end of the file:
    ```
    127.0.0.1   fluent-ui.local
    ```
   * Windows
        ```
        C:\Windows\System32\driver\etc\hosts
        ```
   * MAC and Linux
        ```
        /etc/hosts
        ```
5. From your favorite browser, go to http://fluent-ui.local/ghost
6. Configure your developer environment and active **fluent-ui** theme

### Local deployment test

Among the different gulp tasks, one of thme consist to deploy automatically the theme into the target Ghost environment.

It is possible to test it locally:

1. Create a Ghost integration access token (from the admin web interface)
2. Create a `.env` file into the root of the solution
3. Append to the environment file, `GHOST_API_URL=`
4. Append to the environment file, `GHOST_ADMIN_API_KEY`