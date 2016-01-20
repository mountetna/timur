class SavedItem < ActiveRecord::Base
  def to_item
    # create the appropriate type of item using this
    case item_type
    when "series"
      Series.new key, contents.symbolize_keys
    when "mapping"
      Mapping.new key, contents.symbolize_keys
    end
  end
end
