module BrowseHelper
  def filename_for handler
    if handler && handler.current_path
      File.basename(handler.current_path)
    else
      "no file"
    end
  end
end
