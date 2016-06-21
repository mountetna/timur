class Activity < ActiveRecord::Base
  belongs_to :user

  class << self
    def post user, model_name, record_name, action
      act = Activity.create(user_id: user.id,
                            magma_model: model_name,
                            identifier: record_name,
                            action: action)
      act.save
    end
  end
end
