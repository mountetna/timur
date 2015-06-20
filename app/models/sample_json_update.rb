class SampleJsonUpdate < JsonUpdate
  def json_template
    # any global patches?
    super

    patch_attribute :notes do |att|
      att.attribute_class = "TextAttribute"
    end
    template
  end
end
