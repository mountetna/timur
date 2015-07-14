class Whitelist < ActiveRecord::Base
  def can_read?
    access == "admin" || access == "editor" || access == "viewer"
  end
  def can_edit?
    access == "admin" || access == "editor"
  end
end
