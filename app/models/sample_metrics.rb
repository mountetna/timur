class SampleMetrics
  class Clinical < TimurMetric
    category :clinical
    def test
      @record.patient.clinical
    end
  end
  class Headshot < TimurMetric
    category :processing

    def test
      @record.headshot.file
    end
  end
  class FlowjoXml < TimurMetric
    category :flow

    def test
      @record.patient.flojo_file
    end
  end
  class TregFcs < TimurMetric
    category :flow

    def test
      @record.treg_file.file
    end
  end
  class NktbFcs < TimurMetric
    category :flow

    def test
      @record.nktb_file.file
    end
  end
  class SortFcs < TimurMetric
    category :flow

    def test
      @record.sort_file.file
    end
  end
  class DcFcs < TimurMetric
    category :flow

    def test
      @record.dc_file.file
    end
  end
  class TregPopulations < TimurMetric
    category :flow
  end
  class NktbPopulations < TimurMetric
    category :flow
  end
  class SortPopulations < TimurMetric
    category :flow
  end
  class DcPopulations < TimurMetric
    category :flow
  end
  class ValidTree < TimurMetric
    category :flow
  end
  class TregRna < TimurMetric
    category :rna
  end
  class TcellRna < TimurMetric
    category :rna
  end
  class TumorRna < TimurMetric
    category :rna
  end
  class StromaRna < TimurMetric
    category :rna
  end
  class LiveRna < TimurMetric
    category :rna
  end
  class MyeloidRna < TimurMetric
    category :rna
  end
  class TregGexp < TimurMetric
    category :rna
  end
  class TcellGexp < TimurMetric
    category :rna
  end
  class TumorGexp < TimurMetric
    category :rna
  end
  class StromaGexp < TimurMetric
    category :rna
  end
  class LiveGexp < TimurMetric
    category :rna
  end
  class MyeloidGexp < TimurMetric
    category :rna
  end
end
