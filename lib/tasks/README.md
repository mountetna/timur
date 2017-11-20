## About the Timur view migration.

The data that contained the Timur view layout used to be in a model file. This was not a good solution. The Timur view layout data should be kept in the Timur DB.

To that end the `01.make_view_models.rake` task read the data out of the Timur view models and into the database.

The DB structure to support the Timur view was insufficent. The DB was changed to have three tables that supported the Timur view `view_tabs`, `view_pane`, and `view_attributes`.

The files `02.transform_ipi_views.rake` and `02.load_view_manifests.rake` extacted the view data out of the Timur view models and also separated the manifests from the view data.

However, at this point the Timur DB diverged and the Timur view models were not sufficent to rebuild the Timur view.

The file `03.extract_old_db_views.rake` extracts the view data from the Timur DB and place the view data in files located at `./lib/assets`. 

The files `03.*` and `03.*` then take that data and load it into the udpated database structure.

## Steps for the Timur view migration.

The following should only ever have to happen once.

Back up the database and restore it to a DB called `timur_old`.

`$ pgdump timur > ./timur_db_backup.sql`

In postgres:
```
postgres=# CREATE DATABASE timur_old;
postgres=# \c timur_old;
postgres=# REVOKE ALL ON schema public FROM public;
postgres=# REVOKE ALL ON DATABASE timur_old FROM public;
postgres=# GRANT CONNECT ON DATABASE timur_old TO developer;
postgres=# CREATE SCHEMA private;
postgres=# GRANT CREATE, USAGE ON SCHEMA private TO developer;
postgres=# GRANT CREATE, USAGE ON SCHEMA public TO developer;
```

`$ psql timur_old < ./timur_db_backup.sql`

Now point the current Timur database configuration to the `timur_old` db.

Extract the current view data from the DB.
`$ bundle exec rake timur:extract_old_db_views`

Migrate the database.
`$ bundle exec rake db:migrate:up VERSION=20171107000013`

Load the view data from their cache files into the DB. Make sure you load the views before the manfiests so the rake task can make the DB associations.
`$ bundle exec rake timur:load_new_db_views`
`$ bundle exec rake timur:load_view_manifests`

On the following code release Timur should automatically point back to the `timur` database with it's new view schema. And the Timur code that deals with this new view schema will be updated at the same time as well.

## How do you know if this is done or not?

Look at the DB, if you see the three tables `view_tabs`, `view_pane`, and `view_attributes` then you are all good to go. Nothing needs to be done and you should be up to date.
