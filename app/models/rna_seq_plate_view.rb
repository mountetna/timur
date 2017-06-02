class RnaSeqPlateView < TimurView

  tab :overview do
    pane :default do
    end
  end

  tab :metrics do
    pane :default do

      show :composition_metric do
        attribute_class "StackedBarPlotAttribute"
        display_name "Read Composition"
        plot(
            name: "rna_seq_plate_read_composition_qc",
            manifest: [
                [ :composition, "table(
                [ 'rna_seq', [ 'rna_seq_plate', 'plate_name', '::equals', @record_name ] ],
                [
                  intergenic_count: [ 'intergenic_count' ],
                  introns_count: [ 'introns_count' ],
                  utr_count: [ 'utr_count' ],
                  coding_count: [ 'coding_count' ],
                  mt_coding_count: [ 'mt_coding_count' ],
                  rrna_count: [ 'rrna_count' ],
                  mt_rrna_count: [ 'mt_rrna_count' ]
                ],
                [ order: 'coding_count' ])"
                ],
                [ :totals, "@composition$intergenic_count + @composition$introns_count + @composition$utr_count +
                            @composition$coding_count + @composition$mt_coding_count + @composition$rrna_count +
                            @composition$mt_rrna_count + 1"
                ],
                [ :data, "[
                    intergenic_ratio: @composition$intergenic_count / @totals,
                    introns_ratio: @composition$introns_count / @totals,
                    utr_ratio: @composition$utr_count / @totals,
                    coding_ratio: @composition$coding_count / @totals,
                    mt_coding_ratio: @composition$mt_coding_count / @totals,
                    rrna_ratio: @composition$rrna_count / @totals,
                    mt_rrna_ratio: @composition$mt_rrna_count / @totals
                ]" ]
            ],
            properties: [
                { field: 'coding_ratio', label: 'coding count', color: 'magenta' },
                { field: 'intergenic_ratio', label: 'intergenic count', color: 'red' },
                { field: 'introns_ratio', label: 'introns count', color: 'green' },
                { field: 'utr_ratio', label: 'utr count', color: 'orange' },
                { field: 'mt_coding_ratio', label: 'mt coding count', color: 'cyan'},
                { field: 'rrna_ratio', label: 'rrna count', color: 'lime'},
                { field: 'mt_rrna_ratio', label: 'mt rrna count', color: 'blue'}
            ],
            order_by: 'coding_ratio',
            dimensions: {
                width: 1400,
                height: 400,
                margin: { top: 10, right: 200, bottom: 150, left: 150}
            }
        )
      end

      show :read_count_distribution do
        attribute_class "HistogramAttribute"
        display_name "Read Count Distribution"
        plot(
            name: "read_count_distribution",
            manifest: [
                [ :data, "question(
                  [ 'rna_seq',
                    [ 'rna_seq_plate','plate_name', '::equals', @record_name ],
                    '::all', 'read_count'
                  ]
                )"],
                [ :xmin, '0' ],
                [ :xmax, "max(question(
                  [ 'rna_seq',
                    '::all', 'read_count'
                  ]
                ))" ],
                [ :interval, '50000000'],
                [ :ymax, '40' ],
                [ :yLabel, "'Number of Samples'" ],
                [ :xLabel, "'Read Count'"]

            ],
            dimensions: {
                width: 600,
                height: 400,
                margin: { top: 10, right: 0, bottom: 150, left: 150}
            }
        )
      end

      show :median_cv_coverage_distribution do
        attribute_class "HistogramAttribute"
        display_name "Median Cv Coverage Distribution"
        plot(
            name: "median_cv_coverage_distribution",
            manifest: [
                [ :data, "question(
                  [ 'rna_seq',
                    [ 'rna_seq_plate','plate_name', '::equals', @record_name ],
                    '::all', 'median_cv_coverage'
                  ]
                )" ],
                [ :xmin, '0' ],
                [ :xmax, "max(question(
                  [ 'rna_seq',
                    '::all', 'median_cv_coverage'
                  ]
                ))" ],
                [ :interval, '0.2' ],
                [ :ymax, '40' ],
                [ :yLabel, "'Number of Samples'" ],
                [ :xLabel, "'Median Cv Coverage'"]
            ],
            dimensions: {
                width: 600,
                height: 400,
                margin: { top: 10, right: 0, bottom: 150, left: 150}
            }
        )
      end

      show :eisenberg_genes do
        attribute_class "SwarmAttribute"
        display_name "Eisenberg Genes"
        plot(
            name: "plate_eisenberg_swarm_plot",
            manifest: [
                [ :genes, "['VPS29', 'VCP', 'SNRPD3', 'REEP5', 'RAB7A', 'PSMB4', 'PSMB2', 'GPI', 'CHMP2A', 'C1orf43']" ],
                [ :data, "table(
                  [ 'gene_exp',
                    [ 'rna_seq', 'rna_seq_plate', 'plate_name', '::equals', @record_name  ],
                    [ 'hugo_name', '::in', @genes ]
                  ],
                  [
                    tpm: [ 'expression' ],
                    hugo_name: [ 'hugo_name' ],
                    indication: [ 'rna_seq', 'sample', 'patient', 'experiment', 'name' ]
                  ]
                )" ],
                [ :tpm_log_2, "log2(@data$tpm + 0.1)" ],
            ],
            yLabel: "Eisenberg Genes",
            xLabel: "Log2(TPM + 0.1)",
            xmin: -5,
            xmax: 15,
            groupByKey: "hugo_name",
            datumKey: "tpm_log_2",
            legendKey: "indication",
            legend: [
                {category: "Bladder", color: "dodgerblue"},
                {category: "Colorectal", color: "forestgreen"},
                {category: "Gynecologic", color: "seagreen"},
                {category: "Head and Neck", color: "khaki"},
                {category: "Kidney", color: "coral"},
                {category: "Lung", color: "gold"},
                {category: "Melanoma", color: "teal"},
                {category: "Pancreatic", color: "indianred"}
            ],
            calculated_columns: ['tpm_log_2'],
            dimensions: {
                width: 900,
                height: 500,
                margin: { top: 10, right: 200, bottom: 150, left: 150}
            }
        )
      end
    end
  end
end