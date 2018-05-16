export default {
  models: {
    monster: {
      documents: {
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
      },
      template: {
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
      }
    }
  }
}
