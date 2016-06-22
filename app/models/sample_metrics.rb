class SampleMetrics
  class Clinical < TimurMetric
    category :clinical
    def test
      ::Clinical.join(:patients, :clinical_id => :clinicals__id)
        .join(:samples, :samples__patient_id => :patients__id)
        .where(:sample_name => @record.sample_name).count > 0
    end
  end
  class Headshot < TimurMetric
    category :processing

    def test
      @record.headshot.file
    end
  end
  class TumorType < TimurMetric
    category :processing

    def test
      if !@record.tumor_type
        @message = "Tumor type is not set."
      end
      @record.tumor_type
    end
  end
  class FlowjoXml < TimurMetric
    category :flow

    def test
      @record.patient.flojo_file.file
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

    def test
      result = @record.population.any? do |pop|
        pop.stain == "treg"
      end

      if !result
        @message = "Could not find any populations from the treg stain."
      end
      
      result
    end
  end
  class NktbPopulations < TimurMetric
    category :flow

    def test
      result = @record.population.any? do |pop|
        pop.stain == "nktb"
      end

      if !result
        @message = "Could not find any populations from the nktb stain."
      end
      
      result
    end
  end
  class SortPopulations < TimurMetric
    category :flow

    def test
      result = @record.population.any? do |pop|
        pop.stain == "sort"
      end

      if !result
        @message = "Could not find any populations from the sort stain."
      end
      
      result
    end
  end
  class DcPopulations < TimurMetric
    category :flow

    def test
      result = @record.population.any? do |pop|
        pop.stain == "dc"
      end

      if !result
        @message = "Could not find any populations from the dc stain."
      end
      
      result
    end
  end
  class ValidTree < TimurMetric
    category :flow

    def test
      @message = "This test is not written."
      nil
    end
  end
  class TregRna < TimurMetric
    category :rna

    def test
      result = @record.rna_seq.any? do |rna|
        rna.compartment == "treg"
      end
      Rails.logger.info "Testing treg_rna, got #{result} for #{@record.inspect}"

      if !result
        @message = "Could not find an rna_seq for the treg compartment"
      end
      result
    end
  end
  class TcellRna < TimurMetric
    category :rna

    def test
      result = @record.rna_seq.any? do |rna|
        rna.compartment == "tcell"
      end

      if !result
        @message = "Could not find an rna_seq for the tcell compartment"
      end
      result
    end
  end
  class TumorRna < TimurMetric
    category :rna

    def test
      result = @record.rna_seq.any? do |rna|
        rna.compartment == "tumor"
      end

      if !result
        @message = "Could not find an rna_seq for the tumor compartment"
      end
      result
    end
  end
  class StromaRna < TimurMetric
    category :rna

    def test
      result = @record.rna_seq.any? do |rna|
        rna.compartment == "stroma"
      end

      if !result
        @message = "Could not find an rna_seq for the stroma compartment"
      end
      result
    end
  end
  class LiveRna < TimurMetric
    category :rna

    def test
      result = @record.rna_seq.any? do |rna|
        rna.compartment == "live"
      end

      if !result
        @message = "Could not find an rna_seq for the live compartment"
      end
      result
    end
  end
  class MyeloidRna < TimurMetric
    category :rna

    def test
      result = @record.rna_seq.any? do |rna|
        rna.compartment == "myeloid"
      end

      if !result
        @message = "Could not find an rna_seq for the myeloid compartment"
      end
      result
    end
  end
  class TregGexp < TimurMetric
    category :rna

    def test
      result = GeneExp.join(:rna_seqs, :gene_exps__rna_seq_id => :rna_seqs__id)
        .join(:samples, :samples__id => :rna_seqs__sample_id)
        .where(rna_seqs__compartment: "treg")
        .where(sample_name: @record.sample_name).count > 1

      if !result
        @message = "Could not find gene expression for the treg compartment"
      end
      result
    end
  end
  class TcellGexp < TimurMetric
    category :rna

    def test
      result = GeneExp.join(:rna_seqs, :gene_exps__rna_seq_id => :rna_seqs__id)
        .join(:samples, :samples__id => :rna_seqs__sample_id)
        .where(rna_seqs__compartment: "tcell")
        .where(sample_name: @record.sample_name).count > 1

      if !result
        @message = "Could not find gene expression for the tcell compartment"
      end
      result
    end
  end
  class TumorGexp < TimurMetric
    category :rna

    def test
      result = GeneExp.join(:rna_seqs, :gene_exps__rna_seq_id => :rna_seqs__id)
        .join(:samples, :samples__id => :rna_seqs__sample_id)
        .where(rna_seqs__compartment: "tumor")
        .where(sample_name: @record.sample_name).count > 1

      if !result
        @message = "Could not find gene expression for the tumor compartment"
      end
      result
    end
  end
  class StromaGexp < TimurMetric
    category :rna

    def test
      result = GeneExp.join(:rna_seqs, :gene_exps__rna_seq_id => :rna_seqs__id)
        .join(:samples, :samples__id => :rna_seqs__sample_id)
        .where(rna_seqs__compartment: "stroma")
        .where(sample_name: @record.sample_name).count > 1

      if !result
        @message = "Could not find gene expression for the stroma compartment"
      end
      result
    end
  end
  class LiveGexp < TimurMetric
    category :rna

    def test
      result = GeneExp.join(:rna_seqs, :gene_exps__rna_seq_id => :rna_seqs__id)
        .join(:samples, :samples__id => :rna_seqs__sample_id)
        .where(rna_seqs__compartment: "live")
        .where(sample_name: @record.sample_name).count > 1

      if !result
        @message = "Could not find gene expression for the live compartment"
      end
      result
    end
  end
  class MyeloidGexp < TimurMetric
    category :rna

    def test
      result = GeneExp.join(:rna_seqs, :gene_exps__rna_seq_id => :rna_seqs__id)
        .join(:samples, :samples__id => :rna_seqs__sample_id)
        .where(rna_seqs__compartment: "myeloid")
        .where(sample_name: @record.sample_name).count > 1

      if !result
        @message = "Could not find gene expression for the myeloid compartment"
      end
      result
    end
  end
end
