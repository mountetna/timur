class User < ActiveRecord::Base
  has_one :whitelist, {class_name: 'Whitelist', foreign_key: :email, primary_key: :email}
  has_many :saved_items
  has_many :manifests

  DEFAULT_MAPPINGS = {
    'jriqm66' => { key: 'jriqm66', stain: 'sort', name: 'Immune fraction(sort)', type: 'Population Fraction', v1: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime", v2: "Live##Single Cells 2\tSingle Cells\tTime" },
    'fx1c25w' => { key: 'fx1c25w', stain: 'treg', name: 'Immune fraction(treg)', type: 'Population Fraction', v1: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime", v2: "Live##Single Cells 2\tSingle Cells\tTime" },
    'th6z20p' => { key: 'th6z20p', stain: 'dc', name: 'Immune fraction(dc)', type: 'Population Fraction', v1: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime", v2: "Live##Single Cells 2\tSingle Cells\tTime" },
    '25mnjl4' => { key: '25mnjl4', stain: 'sort', name: 'Tumor fraction', type: 'Population Fraction', v1: "EPCAM+##CD45-\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45-##Live\tSingle Cells 2\tSingle Cells\tTime" },  
    '2a5w8s6' => { key: '2a5w8s6', stain: 'treg', name: 'T-cell fraction(treg)', type: 'Population Fraction', v1: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime" },
    'iu8xauo' => { key: 'iu8xauo', stain: 'treg', name: 'HLADR+ T-cell fraction', type: 'Population Fraction', v1: "CD3+,HLADR+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    '656kp08' => { key: '656kp08', stain: 'treg', name: 'HLADR- T-cell fraction', type: 'Population Fraction', v1: "CD3+,HLADR-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'p23n5b9' => { key: 'p23n5b9', stain: 'nktb', name: 'T-cell fraction(nktb)', type: 'Population Fraction', v1: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime" },
    'f6ri0of' => { key: 'f6ri0of', stain: 'nktb', name: 'Q5 (56-,19-)T-cell fraction', type: 'Population Fraction', v1: "Q5: CD56-,CD19+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'zfoukvr' => { key: 'zfoukvr', stain: 'nktb', name: 'Q6 (56+,19+)T-cell fraction', type: 'Population Fraction', v1: "Q6: CD56+,CD19+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'tunsano' => { key: 'tunsano', stain: 'nktb', name: 'Q7 (NKT)cell fraction', type: 'Population Fraction', v1: "Q7: CD56+,CD19-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'djhkkid' => { key: 'djhkkid', stain: 'nktb', name: 'Q8 cd19+ T-cell fraction', type: 'Population Fraction', v1: "Q8: CD56-,CD19-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },      
    'ytkvy2i' => { key: 'ytkvy2i', stain: 'nktb', name: 'CD4+ T-cell fraction(nktb)', type: 'Population Fraction', v1: "Q1: CD8a-,CD4+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'pgbktsu' => { key: 'pgbktsu', stain: 'treg', name: 'CD4+ T-cell fraction(treg)', type: 'Population Fraction', v1: "Q1: CD8a-,CD4+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'csoray1' => { key: 'csoray1', stain: 'treg', name: 'CD4+ HLADR+ T-cell fraction', type: 'Population Fraction', v1: "Q1: CD8a-,CD4+##CD3+,HLADR+\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+,HLADR+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    '2x4keqv' => { key: '2x4keqv', stain: 'treg', name: 'CD4+ HLADR- T-cell fraction', type: 'Population Fraction', v1: "Q1: CD8a-,CD4+##CD3+,HLADR-\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+,HLADR-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'l2isg28' => { key: 'l2isg28', stain: 'sort', name: 'memory Treg fraction', type: 'Population Fraction', v1: "Q2: CD90+,CD44+##CD4+,CD25+ (Tr)\tCD3+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD4+,CD25+ (Tr)##CD3+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'lz9tvxt' => { key: 'lz9tvxt', stain: 'sort', name: 'memory Treg / CD8', type: 'Population Fraction', v1: "Q2: CD90+,CD44+##CD4-\tCD3+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD4-##CD3+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'gwuwbxb' => { key: 'gwuwbxb', stain: 'treg', name: 'Treg HLADR+ CD4+ fraction', type: 'Population Fraction', v1: "CD3+,HLADR+,CD4+,CD25+,FoxP3+ (Tr)##Q1: CD8a-,CD4+\tCD3+,HLADR+\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "Q1: CD8a-,CD4+##CD3+,HLADR+\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'pet8ri2' => { key: 'pet8ri2', stain: 'treg', name: 'Treg HLADR- CD4+ fraction', type: 'Population Fraction', v1: "CD3+,HLADR-,CD4+,CD25+,FoxP3+ (Tr)##Q1: CD8a-,CD4+\tCD3+,HLADR-\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "Q1: CD8a-,CD4+##CD3+,HLADR-\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'x4ch024' => { key: 'x4ch024', stain: 'nktb', name: 'CD8+ T-cell fraction(nktb)', type: 'Population Fraction', v1: "Q3: CD8a+,CD4-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'q8jilzt' => { key: 'q8jilzt', stain: 'treg', name: 'CD8+ T-cell fraction(treg)', type: 'Population Fraction', v1: "Q3: CD8a+,CD4-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'e6bim0s' => { key: 'e6bim0s', stain: 'treg', name: 'CD8+ HLADR+ T-cell fraction', type: 'Population Fraction', v1: "Q3: CD8a+,CD4-##CD3+,HLADR+\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+,HLADR+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'ljh2v88' => { key: 'ljh2v88', stain: 'treg', name: 'CD8+ HLADR- T-cell fraction', type: 'Population Fraction', v1: "Q3: CD8a+,CD4-##CD3+,HLADR-\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+,HLADR-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'qxa2k1s' => { key: 'qxa2k1s', stain: 'treg', name: 'PD1+ CTLA4+ CD8 fraction', type: 'Population Fraction', v1: "Q2: PD1+,CTLA4+##Q3: CD8a+,CD4-\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "Q3: CD8a+,CD4-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'ci1ruin' => { key: 'ci1ruin', stain: 'nktb', name: 'DP T-cell fraction(nktb)', type: 'Population Fraction', v1: "Q2: CD8a+,CD4+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    '87jj9xc' => { key: '87jj9xc', stain: 'treg', name: 'DP T-cell fraction(treg)', type: 'Population Fraction', v1: "Q2: CD8a+,CD4+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    '58uadwa' => { key: '58uadwa', stain: 'treg', name: 'DP HLADR+ T-cell fraction', type: 'Population Fraction', v1: "Q2: CD8a+,CD4+##CD3+,HLADR+\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+,HLADR+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    '9qnmcpv' => { key: '9qnmcpv', stain: 'treg', name: 'DP HLADR- T-cell fraction', type: 'Population Fraction', v1: "Q2: CD8a+,CD4+##CD3+,HLADR-\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+,HLADR-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'o1g0lvm' => { key: 'o1g0lvm', stain: 'nktb', name: 'DN T-cell fraction(nktb)', type: 'Population Fraction', v1: "Q4: CD8a-,CD4-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    '34pvk6q' => { key: '34pvk6q', stain: 'treg', name: 'DN T-cell fraction(treg)', type: 'Population Fraction', v1: "Q4: CD8a-,CD4-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+ all##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'kh7au5u' => { key: 'kh7au5u', stain: 'treg', name: 'DN HLADR+ T-cell fraction', type: 'Population Fraction', v1: "Q4: CD8a-,CD4-##CD3+,HLADR+\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+,HLADR+##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'fmi03zn' => { key: 'fmi03zn', stain: 'treg', name: 'DN HLADR- T-cell fraction', type: 'Population Fraction', v1: "Q4: CD8a-,CD4-##CD3+,HLADR-\tCD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD3+,HLADR-##CD3+ all\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'uanuatp' => { key: 'uanuatp', stain: 'nktb', name: 'HLADR+ fraction', type: 'Population Fraction', v1: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime" },
    '87njjvi' => { key: '87njjvi', stain: 'dc', name: 'Monocyte fraction', type: 'Population Fraction', v1: "CD16+ Monocytes##HLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime" },
    'nxjbuq0' => { key: 'nxjbuq0', stain: 'dc', name: 'Monocyte HLADR+ fraction', type: 'Population Fraction', v1: "CD16+ Monocytes##HLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'domny9x' => { key: 'domny9x', stain: 'dc', name: 'CD14+ TAM HLADR+ fraction', type: 'Population Fraction', v1: "CD14+ TAMs##not monocytes\tHLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'gui19sc' => { key: 'gui19sc', stain: 'dc', name: 'CD14- TAM HLADR+ fraction', type: 'Population Fraction', v1: "CD14- TAMs##not pDCs\tCD11c+\tnot monocytes\tHLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'fjdb36p' => { key: 'fjdb36p', stain: 'dc', name: 'CD11c- HLADR+ fraction', type: 'Population Fraction', v1: "CD11c-##not monocytes\tHLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'vt783zx' => { key: 'vt783zx', stain: 'dc', name: 'pDC HLADR+ fraction', type: 'Population Fraction', v1: "pDCs##CD11c+\tnot monocytes\tHLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    '7owlprt' => { key: '7owlprt', stain: 'dc', name: 'BDCA1+ DC HLADR+ fraction', type: 'Population Fraction', v1: "BDCA1+ DCs##not pDCs\tCD11c+\tnot monocytes\tHLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'oxe2w8o' => { key: 'oxe2w8o', stain: 'dc', name: 'BDCA3+ DC HLADR+ fraction', type: 'Population Fraction', v1: "BDCA3+ DCs##not pDCs\tCD11c+\tnot monocytes\tHLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    '9qhkg6s' => { key: '9qhkg6s', stain: 'nktb', name: 'B-cell HLADR+ fraction', type: 'Population Fraction', v1: "B-cells##HLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "HLADR+##CD45+\tLive\tSingle Cells 2\tSingle Cells\tTime" },
    'stw8337' => { key: 'stw8337', stain: 'nktb', name: 'B-cell immune fraction', type: 'Population Fraction', v1: "B-cells##HLADR+\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime" },
    'd2sl3vb' => { key: 'd2sl3vb', stain: 'nktb', name: 'NK fraction', type: 'Population Fraction', v1: "HLADR-,CD3-,CD56+ (NK)##CD3-,HLADR-\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime" },
    'j0wthrp' => { key: 'j0wthrp', stain: 'dc', name: 'Eosinophil fraction', type: 'Population Fraction', v1: "Eosinophils##Lineage-,HLADR-\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime" },
    'pzz00h5' => { key: 'pzz00h5', stain: 'dc', name: 'Neutrophil fraction', type: 'Population Fraction', v1: "Neutrophils##Lineage-,HLADR-\tCD45+\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45+##Live\tSingle Cells 2\tSingle Cells\tTime" },  
    'tgd1vc3' => { key: 'tgd1vc3', stain: 'sort', name: 'CD44+ Stromal Cells CD90- fraction', type: 'Population Fraction', v1: "Q1: CD90-,CD44+##CD45-\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45-##Live\tSingle Cells 2\tSingle Cells\tTime" },
    'fex3r8l' => { key: 'fex3r8l', stain: 'sort', name: 'CD44+ Stromal Cells CD90+ fraction', type: 'Population Fraction', v1: "Q2: CD90+,CD44+##CD45-\tLive\tSingle Cells 2\tSingle Cells\tTime", v2: "CD45-##Live\tSingle Cells 2\tSingle Cells\tTime" },
  }

  def can_read?(project_name)
    whitelist && whitelist.can_read?(project_name)
  end

  def can_edit?(project_name)
    whitelist && whitelist.can_edit?(project_name)
  end

  def is_admin?(project_name)
    whitelist && whitelist.is_admin?(project_name)
  end

  def get_save(key)
    if saves['series'].has_key?(key)
      return Series.new(key, saves['series'][key].symbolize_keys)
    end

    if DEFAULT_MAPPINGS.has_key?(key)
      return Mapping.new(key, DEFAULT_MAPPINGS[key])
    end

    if saves['mappings'].has_key?(key)
      return Mapping.new(key, saves['mappings'][key].symbolize_keys)
    end
  end
end
