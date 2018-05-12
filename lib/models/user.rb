class User < Sequel::Model
  one_to_many :manifests
  one_to_many :plots

  def etna_user= user
    @etna_user = user
  end

  [
    :is_superuser?,
    :can_edit?,
    :can_view?,
    :can_see_restricted?,
    :is_admin?
  ].each do |test|
    define_method test do |project|
      @etna_user.send(test, project)
    end
  end
end
