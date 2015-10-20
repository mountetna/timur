# README

Timur is a data browser. It is primarily intended to consume data from Magma, a data warehouse.

There are three ways to interact with Timur:

## Browse

The 'browse' view is intended to allow simple record viewing and editing. Magma
publishes a JSON template describing each model and a JSON document describing
each record; Timur merely renders each document using a view built from this
template. This allows us to browse and edit any record in Magma with a single
generic viewer.

Since Magma publishes certain fixed data types, Timur displays each record by
examining the types of the model and rendering it appropriately (for example an
attribute of type 'Date' would be formatted according to local time when
viewing and would show a Date/Time picker when editing).

Occasionally we wish to add custom attributes to the view for a model, or
change the way a certain attribute is displayed (for example, we may always
want to show the Date in Cairo time). In these cases, Timur will patch the
template and record to describe the new attribute and include additional
required data in the record, before passing it on to the client (web browser),
which renders the template as given. This is especially useful for adding custom
plots to a view; we might add a new attribute of class 'BarPlot' to our model,
and include the appropriate bar plot data in the record, which may be rendered
by a component using d3.js.

## Search

(This section is mostly theoretical.)

Timur should allow users to generate queries that define subsets of the data that they
are interested in. We can break this down in three primary phases:

1) Filter layer - Here we define a series of interests - the set of entities we
are interested in. Starting with the full set of entities of interests (e.g.
Patients), we may define a susbset of this initial set by filtering based on
its attributes. E.g., we filter our set to those Patients that are part of the
'Colorectal' Experiment and have a tumor grade of 'poorly differentiated'.

2) Map layer - Here we reduce our set of entities to a single variable based on
the set.  For example, for each Patient in our set we might extract the
expression level of the gene 'TERT' in the 'Tumor' RnaSeq dataset, producing a vector
of values (either numerical or categorical).

3) Equation layer - a vector of mapped variables may be combined with other
mapped variables to yield new variables (for example, the ratio of two counts).

These variables may be fed into plots.

## Plot

Given a set of variables, we might want to produce fixed plots (again using d3.js). Possible plot types:

1) XY scatter - plot two numerical variables against each other

2) One-dimensional scatter - plot a single numerical variable against a categorical variable

3) Cluster/heatmap - Plot N numerical variables against each other.
