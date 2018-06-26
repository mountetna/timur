const model_documents = {
  'Caledonian Boar': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    labor: null,
    name: 'Caledonian Boar',
    species: 'pig',
    victim: [

    ]
  },
  'Lernean Hydra': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    labor: null,
    name: 'Lernean Hydra',
    species: 'hydra',
    victim: [

    ]
  },
  'Nemean Lion': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    labor: null,
    name: 'Nemean Lion',
    species: 'lion',
    victim: [

    ]
  }
};

export const model_template = {
  name: 'monster',
  attributes: {
    created_at: {
      name: 'created_at',
      type: 'DateTime',
      attribute_class: 'Magma::Attribute',
      display_name: 'Created At',
      shown: false
    },
    updated_at: {
      name: 'updated_at',
      type: 'DateTime',
      attribute_class: 'Magma::Attribute',
      display_name: 'Updated At',
      shown: false
    },
    labor: {
      name: 'labor',
      model_name: 'labor',
      attribute_class: 'Magma::ForeignKeyAttribute',
      display_name: 'Labor',
      shown: true
    },
    name: {
      name: 'name',
      type: 'String',
      attribute_class: 'Magma::Attribute',
      display_name: 'Name',
      shown: true
    },
    species: {
      name: 'species',
      type: 'String',
      attribute_class: 'Magma::Attribute',
      display_name: 'Species',
      match: '^[a-z\\s]+$',
      shown: true
    },
    victim: {
      name: 'victim',
      model_name: 'victim',
      attribute_class: 'Magma::CollectionAttribute',
      display_name: 'Victim',
      shown: true
    }
  },
  identifier: 'name',
  parent: 'labor'
};

export const monsters = {
  models: {
    monster: {
      documents: model_documents,
      template: model_template
    }
  }
};

export const view_data = {
  views: {

    olympian: {
      model_name: 'olympian',
      project_name: 'labors',
      tabs: {
        name: 'default',
        title: '',
        index_order: 0,
        panes: {
          default: {
            name: 'default',
            title: '',
            index_order: 0,
            attributes: {
              name: {
                name: 'name',
                title: null,
                attribute_class: null,
                index_order: 1,
                plot_id: null,
                manifest_id: null
              }
            }
          }
        }
      }
    },

    monster: {
      model_name: 'monster',
      project_name: 'labors',
      tabs: {
        default: {
          name: 'default',
          title: '',
          index_order: 0,
          panes: {
            default: {
              name: 'default',
              title: '',
              index_order: 0,
              attributes: {
                labor: {
                  name: 'labor',
                  title: null,
                  attribute_class: null,
                  index_order: 0,
                  plot_id: 123,
                  manifest_id: null
                },
                name: {
                  name: 'name',
                  title: null,
                  attribute_class: null,
                  index_order: 1,
                  plot_id: null,
                  manifest_id: null
                },
                species: {
                  name: 'species',
                  title: null,
                  attribute_class: null,
                  index_order: 2,
                  plot_id: 'monkey wrench',
                  manifest_id: null
                },
                victim: {
                  name: 'victim',
                  title: null,
                  attribute_class: 'LinePlotAttribute',
                  index_order: 3,
                  plot_id: 456,
                  manifest_id: 135
                }
              }
            }
          }
        },
        other_tab: {
          name: 'other_tab',
          title: '',
          index_order: 123,
          panes: {
          }
        }
      }
    }
  }
};

/*
 * When one requests a model view that is not present in the Timur DB then we
 * return a default view object.
 */
export const default_view_data = {
  views: {
    farmers: {
      project_name: 'labors',
      model_name: 'farmers',
      tabs: {
        default: {
          name: 'default',
          title: '',
          description: '',
          index_order: 0,
          panes: {
            default: {
              name: 'default',
              title: '',
              description: '',
              index_order: 0,
              attributes: {
              }
            }
          }
        }
      }
    }
  }
}
