# Database

MS SQL database

## Install and setup steps

### Microsoft

...

### Mac OS

1. Download Docker
2. Use these commands to pull and startup a database

    ```
    docker pull mcr.microsoft.com/mssql/server:2022-latest
    ```

    ```
    docker run -d --name POLLOR_DATABASE -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=myPassw0rd' -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
    ```

    ```
    docker start POLLOR_DATABASE
    ```

3. Download Azure Data Studio and fill the values:
   
   - Server: `localhost`
   - Authentication Type: `SQL Login`
   - username: `sa`
   - password: `myPassw0rd`
   - Database: `<default>`
   - Server Group: `<default>`

4. Open query and type `CREATE DATABASE pollor_db;`

5. Copy file contents of `migration.sql` and paste it into a Query (results: database is setup)

6. Copy file contents of `seed.sql` and paste into a Query (results: database is filled with test data)

7. Make sure the values of `.env` are correct

    ```
    DB_SERVER=localhost
    DB_NAME=pollor_db
    DB_UID=sa
    DB_PASSWORD=myPassw0rd
    ```



