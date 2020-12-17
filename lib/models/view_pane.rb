class ViewPane < Sequel::Model
  many_to_one :view_tab
  one_to_many :view_attributes, order: :index_order

  def to_hash
    {
      name: name,
      title: title,
      items: view_attributes.sort_by(&:index_order).map(&:to_hash)
    }
  end
end
