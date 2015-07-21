namespace :timur do
  desc "Update the whitelist"
  task update_whitelist: :environment do
    raise unless File.exists? "whitelist.tsv"
    Whitelist.delete_all
    ActiveRecord::Base.transaction do
      File.foreach("whitelist.tsv") do |line|
        email, access = line.chomp.split(/\t/)
        Whitelist.create(email: email, access: access)
      end
    end
  end
end
