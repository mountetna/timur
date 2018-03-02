The files in this directory are the old plot data used by the views of the IPI project. The data used to be spread across multiple files and databases. The data is now normalized and consolidated into single files. This data gets used in the migration `20171107000013_change_view_models.rb`.

There is also a rake task that is used by the migration just mentioned. (migrate_views.rake). That task is where the files contained in this directory get used. See `./lib/tasks/migrate_views.rake` for more detail on the migration.

For outside users. None of this is important. This data is a temporary stop on the generalization of our code base and will be deleted within the year. This is only important to the maintainers of the Mt. Etna project.
