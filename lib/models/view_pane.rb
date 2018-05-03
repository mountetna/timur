class ViewPane < Sequel::Model
  many_to_one :view_tab
  one_to_many :view_attributes, order: :index_order

  def to_hash
    {
      id: id,
      name: name,
      title: title,
      index_order: index_order,
      attributes: Hash[ view_attributes.map{|a| [ a.name, a.to_hash ] } ]
    }
  end
end
