namespace :timur do
  desc "Create saved_items"
  task create_saves: :environment do
    User.where.not(saves: nil).each do |user|
      user.saves["series"].each do |key,series|
        saved_item = user.saved_items.build(
          key: key,
          item_type: "series",
          contents: series
        )
        saved_item.save
      end
      user.saves["mappings"].each do |key,mapping|
        saved_item = user.saved_items.build(
          key: key,
          item_type: "mapping",
          contents: mapping
        )
        saved_item.save
      end
    end
  end
  desc "Fix users"
  task fix_users: :environment do
    User.where.not(saves: nil).each do |user|
      next unless user.saves["series"]
      user.saves["series"].each do |key,series|
        if series["indication"]
          series["experiment"] = series["indication"]
          series.delete "indication"
        end
      end
      user.saves["mappings"].each do |key,mapping|
        if mapping["type"] == "Population Fraction" && mapping["v1"]
          mapping["population1"], mapping["ancestor1"] = mapping.delete("v1").split(/##/)
          mapping["population2"], mapping["ancestor2"] = mapping.delete("v2").split(/##/)
        end
        if mapping["type"] == "MFI" && mapping["population"]
          mapping["name"], mapping["ancestor"] = mapping.delete("population").split(/##/)
        end
        if mapping["type"] == "MFI" && mapping["mfi"]
          mapping["channel"] = mapping.delete "mfi"
        end
      end
      user.save
    end
  end
end
