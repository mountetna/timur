class SampleView < TimurView
  tab :overview do
    pane :default do 
      title "Summary"
      shows :patient, :headshot, :tumor_type, :processed, :description
      show :notes do
        attribute_class "TextAttribute"
      end
    end
    pane :qc do
      title "Quality Control"
      show :qc do
        attribute_class "BarPlotAttribute"
        display_name "Immune Fractions"
        plot(
          name: "sample_qc",
          manifest: [
            [ :qc, "table(
                [ 'sample', [ 'sample_name', '::equals', @record_name ] ],
                [
                  treg_cd45_count: [ 'population', [ 'stain', '::equals', 'treg' ], [ 'name', '::equals', 'CD45+' ], '::first', 'count' ],
                  treg_live_count: [ 'population', [ 'stain', '::equals', 'treg' ], [ 'name', '::equals', 'Live' ], '::first', 'count' ],
                  nktb_cd45_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'CD45+' ], '::first', 'count' ],
                  nktb_live_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'Live' ], '::first', 'count' ],
                  sort_cd45_count: [ 'population', [ 'stain', '::equals', 'sort' ], [ 'name', '::equals', 'CD45+' ], '::first', 'count' ],
                  sort_live_count: [ 'population', [ 'stain', '::equals', 'sort' ], [ 'name', '::equals', 'Live' ], '::first', 'count' ],
                  dc_cd45_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'CD45+' ], '::first', 'count' ],
                  dc_live_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'Live' ], '::first', 'count' ]
                ])"
            ],
            [ :bars, "[
              [
                name: 'CD45+/live',
                color: 'greenyellow',
                height: @qc$treg_cd45_count / @qc$treg_live_count,
                select: @qc$row_name == @record_name
              ],
              [
                name: 'CD45+/live',
                color: 'coral',
                height: @qc$nktb_cd45_count / @qc$nktb_live_count,
                select: @qc$row_name == @record_name
              ],
              [
                name: 'CD45+/live',
                color: 'khaki',
                height: @qc$sort_cd45_count / @qc$sort_live_count,
                select: @qc$row_name == @record_name
              ],
              [
                name: 'CD45+/live',
                color: 'seagreen',
                height: @qc$dc_cd45_count / @qc$dc_live_count,
                select: @qc$row_name == @record_name
              ]
            ]" ],
            
          ],
          legend: [
            { name: 'treg', color: 'greenyellow' },
            { name: 'nktb', color: 'coral' },
            { name: 'sort', color: 'khaki' },
            { name: 'dc', color:   'seagreen' },
          ],
          dimensions: {
            width: 300,
            height: 200,
            margin: { top: 10, right: 20, bottom: 60, left: 50}
          }
        )
      end
    end
  end

  tab :processing do
    pane :sample_features do
      title "Characteristics"
      shows :weight do
        placeholder "Mass in grams"
      end
      show :site, :stage, :grade
      show :post_digest_cell_count do
        placeholder "Integer count, e.g. 2000 or 200_000"
      end
    end
  end

  tab :flow_cytometry do
    pane :gating do
      title "Gating"
      show :finger_print do
        attribute_class "BarPlotAttribute"
        display_name "FingerPrint"
        plot(
          name: "fingerprint",
          manifest: [
            [
              :experiment_name,
              "question([ 'sample', [ 'sample_name', '::equals', @record_name ], '::first', 'patient', 'experiment', 'name' ])"
            ],
            [ :fingerprint, "table(
              [ 'sample', [ 'patient', 'experiment', 'name', '::equals', @experiment_name ] ],
              [
                patient_name: [ 'patient', 'ipi_number' ],
                treg_cd45_count: [ 'population', [ 'stain', '::equals', 'treg' ], [ 'name', '::equals', 'CD45+' ], '::first', 'count' ],
                nktb_cd45_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'CD45+' ], '::first', 'count' ],
                sort_cd45_count: [ 'population', [ 'stain', '::equals', 'sort' ], [ 'name', '::equals', 'CD45+' ], '::first', 'count' ],
                dc_cd45_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'CD45+' ], '::first', 'count' ],
                treg_live_count: [ 'population', [ 'stain', '::equals', 'treg' ], [ 'name', '::equals', 'Live' ], '::first', 'count' ],
                nktb_live_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'Live' ], '::first', 'count' ],
                sort_live_count: [ 'population', [ 'stain', '::equals', 'sort' ], [ 'name', '::equals', 'Live' ], '::first', 'count' ],
                dc_live_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'Live' ], '::first', 'count' ],
                sort_epcam_count: [ 'population', [ 'stain', '::equals', 'sort' ], [ 'name', '::equals', 'EPCAM+' ], '::first', 'count' ],
                dc_lineage_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'Lineage+' ], '::first', 'count' ],
                dc_hladr_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'HLADR+' ], '::first', 'count' ],
                dc_neutrophil_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'Neutrophils' ], '::first', 'count' ],
                dc_eosinophil_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'Eosinophils' ], '::first', 'count' ],
                nktb_cd3_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'CD3+ all' ], '::first', 'count' ],
                nktb_nk_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'HLADR-,CD3-,CD56+ (NK)' ], '::first', 'count' ],
                nktb_bcell_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'B-cells' ], '::first', 'count' ],

                nktb_cd4_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'Q1: CD8a-,CD4+' ], [ 'ancestry', '::matches', '^CD3\\+ all' ], '::first', 'count' ],
                nktb_cd8_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'Q2: CD8a+,CD4+' ], [ 'ancestry', '::matches', '^CD3\\+ all' ], '::first', 'count' ],
                nktb_dn_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'Q3: CD8a+,CD4-' ], [ 'ancestry', '::matches', '^CD3\\+ all' ], '::first', 'count' ],
                nktb_dp_count: [ 'population', [ 'stain', '::equals', 'nktb' ], [ 'name', '::equals', 'Q4: CD8a-,CD4-' ], [ 'ancestry', '::matches', '^CD3\\+ all' ], '::first', 'count' ],

                treg_treg_count: [ 'population', [ 'stain', '::equals', 'treg' ], [ 'name', '::equals', 'CD3 all,CD4+,CD25+,FoxP3+ (Tr)' ], '::first', 'count' ],
                treg_thelper_count: [ 'population', [ 'stain', '::equals', 'treg' ], [ 'name', '::equals', 'CD3 all,CD4+,CD25- (Th)' ], '::first', 'count' ],
                treg_cd3_count: [ 'population', [ 'stain', '::equals', 'treg' ], [ 'name', '::equals', 'CD3+ all' ], '::first', 'count' ],
                dc_monocyte_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'CD16+ Monocytes' ], '::first', 'count' ],
                dc_hladr_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'HLADR+' ], '::first', 'count' ],
                dc_cd14pos_tam_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'CD14+ TAMs' ], '::first', 'count' ],
                dc_cd14neg_tam_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'CD14- TAMs' ], '::first', 'count' ],
                dc_cd11cpos_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'CD11c+' ], '::first', 'count' ],
                dc_cd11cneg_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'CD11c-' ], '::first', 'count' ],
                dc_bdca1_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'BDCA1+ DCs' ], '::first', 'count' ],
                dc_bdca3_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'BDCA3+ DCs' ], '::first', 'count' ],
                dc_pdc_count: [ 'population', [ 'stain', '::equals', 'dc' ], [ 'name', '::equals', 'pDCs' ], '::first', 'count' ]
              ])"
            ],
            [ :nktb_lineage_count, "@fingerprint$nktb_cd3_count + @fingerprint$nktb_nk_count + @fingerprint$nktb_bcell_count" ],
            [ :bars, "[
                [
                  name: 'CD45+/live',
                  color: 'greenyellow',
                  height: @fingerprint$treg_cd45_count / @fingerprint$treg_live_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [
                  name: 'EPCAM+ tumor/live (3)',
                  color: 'seagreen',
                  height: @fingerprint$sort_epcam_count / @fingerprint$sort_live_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],

                [ name: 'Lineage+/CD45+ (dc)',
                  color: 'coral',
                  height: @fingerprint$dc_lineage_count / @fingerprint$dc_cd45_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'HLADR+,Lineage-/CD45+ (dc)',
                  color: 'coral',
                  height: @fingerprint$dc_hladr_count / @fingerprint$dc_cd45_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'Neutrophils/CD45+ (dc)',
                  color: 'coral',
                  height: @fingerprint$dc_neutrophil_count / @fingerprint$dc_cd45_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'Eosinophils/CD45+ (dc)',
                  color: 'coral',
                  height: @fingerprint$dc_eosinophil_count / @fingerprint$dc_cd45_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],

                [ name: 'T cells/lineage+ (nktb)',
                  color: 'dodgerblue',
                  height: @fingerprint$nktb_cd3_count / @nktb_lineage_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'NK cells/lineage+ (nktb)',
                  color: 'dodgerblue',
                  height: @fingerprint$nktb_nk_count / @nktb_lineage_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'B-cells/lineage+ (nktb)',
                  color: 'dodgerblue',
                  height: @fingerprint$nktb_bcell_count / @nktb_lineage_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'CD8a-,CD4+ / CD3+',
                  color: 'magenta',
                  height: @fingerprint$nktb_cd4_count / @fingerprint$nktb_cd3_count,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'CD8a+,CD4+ / CD3+',
                  color: 'magenta',
                  height: '@fingerprint$nktb_cd8_count / @fingerprint$nktb_cd3_count',
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'CD8a+,CD4- / CD3+',
                  color: 'magenta',
                  height: @fingerprint$nktb_dn_count / @fingerprint$nktb_cd3_count,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'CD8a-,CD4- / CD3+',
                  color: 'magenta',
                  height: @fingerprint$nktb_dp_count / @fingerprint$nktb_cd3_count,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'T-regs/CD3+ (treg)',
                  color: 'chocolate',
                  height: @fingerprint$treg_treg_count / @fingerprint$treg_cd3_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'T-helpers(CD4+,CD25-)/CD3+ (treg)',
                  color: 'chocolate',
                  height: @fingerprint$treg_thelper_count / @fingerprint$treg_thelper_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],

                [ name: 'CD16+ monocytes/HLADR+ (dc)',
                  color: 'greenyellow',
                  height: @fingerprint$dc_monocyte_count / @fingerprint$dc_hladr_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],

                [ name: 'CD14+ TAMs/HLADR+ (dc)',
                  color: 'greenyellow',
                  height: @fingerprint$dc_cd14pos_tam_count / @fingerprint$dc_hladr_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'CD14- TAMs/HLADR+ (dc)',
                  color: 'greenyellow',
                  height: @fingerprint$dc_cd14neg_tam_count / @fingerprint$dc_hladr_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'CD11c-/HLADR+ (dc)',
                  color: 'greenyellow',
                  height: @fingerprint$dc_cd11cneg_count / @fingerprint$dc_hladr_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'CD11c+/HLADR+ (dc)',
                  color: 'greenyellow',
                  height: @fingerprint$dc_cd11cpos_count / @fingerprint$dc_hladr_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'BDCA1+ DCs/HLADR+ (dc)',
                  color: 'greenyellow',
                  height: @fingerprint$dc_bdca1_count / @fingerprint$dc_hladr_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],

                [ name: 'BDCA3+ DCs/HLADR+ (dc)',
                  color: 'greenyellow',
                  height: @fingerprint$dc_bdca3_count / @fingerprint$dc_hladr_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ],
                [ name: 'pDCs (CD85g+)/HLADR+ (dc)',
                  color: 'greenyellow',
                  height: @fingerprint$dc_pdc_count / @fingerprint$dc_hladr_count,
                  select: @fingerprint$row_name == @record_name,
                  highlight_names: @fingerprint$patient_name,
                  category: @fingerprint$row_name =~ '.T.$' ? 'tumor' : 'normal'
                ]
              ]"
            ]
          ],
          dimensions: {
            width: 900,
            height: 200,
            margin: { top: 10, right: 20, bottom: 60, left: 30},
          },
          legend: [
            {
              name: "overall", 
              color: "seagreen",
            },
            {
              name: "immune", 
              color: "coral",
            },
            {
              name: "lineage", 
              color: "dodgerblue",
            },
            {
              name: "t-cell", 
              color: "chocolate",
            },
            {
              name: "cd4/8", 
              color: "magenta",
            },
            {
              name: "apcs",
              color: "greenyellow",
            }
          ],
        )
      end
      shows :population
    end
    pane :files do
      title "FCS files"
      shows :treg_file, :nktb_file, :sort_file, :dc_file, :innate_file
    end
  end

  tab :rna_seq do
    pane :default do
      shows :rna_seq
    end
  end

  tab :imaging do
    pane :default do
      shows :he_low, :he_high, :he_zstack
    end
  end
end
