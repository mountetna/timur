class ProjectJsonUpdate < JsonUpdate
  def update
    patch_attribute(:whats_new) {|a| a.attribute_class = "MarkdownAttribute"}
    patch_attribute(:faq) {|a| a.attribute_class = "MarkdownAttribute"}
  end
end


