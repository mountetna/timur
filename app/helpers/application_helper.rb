module ApplicationHelper
  def attribute_name att
    att.name.to_s.split(/_/).map(&:capitalize).join(' ')
  end
end
