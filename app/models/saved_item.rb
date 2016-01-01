class SavedItem < ActiveRecord::Base
  def to_item
    # create the appropriate type of item using this
    case item_type
    when "series"
      Series.new key, contents
    when "mapping"
      Mapping.new key, contents
    end
  end
end
