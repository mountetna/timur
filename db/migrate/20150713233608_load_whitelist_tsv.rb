class LoadWhitelistTsv < ActiveRecord::Migration
  def up
    Whitelist.delete_all

    ActiveRecord::Base.transaction do
      File.foreach("whitelist.tsv") do |line|
        email, access = line.chomp.split(/\t/)
        Whitelist.create(email: email, access: access)
      end
    end
  end

  def down
    Whitelist.delete_all
  end
end
