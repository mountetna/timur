module ApplicationHelper
  def attribute_name att
    att.name.to_s.split(/_/).map(&:titleize).join(' ')
  end
end
