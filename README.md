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

The Search interface allows simple filtering of records by their attribute data and bulk download via TSV.
The filter uses the Magma /retrieve api's filter syntax, described in detail here: https://github.com/mountetna/magma/wiki/Retrieve

## Manifests

A Manifest allows data to be collected from multiple sources, usually starting
from Magma, and possibly passing through several calculation services (Rtemis
and Pythia). Manifests are written in a scripting language with R-like syntax
(tentatively dubbed TimurLang). Writing a manifest is necessary for extracting
data for use in plots with Timur.

## Plot

Plots allow data retrieved using a manifest to be graphed in the browser. Timur features a few basic plot types:

1) XY scatter - plot two numerical variables against each other

2) Cluster/heatmap - Plot N numerical variables against each other.
