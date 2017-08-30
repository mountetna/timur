class JanusUser
  def self.retrieve(token)
    user_info = JanusRequest.new(:check,token).json_body

    user_info ? new(user_info) : nil
  end

  def initialize(user_info)
    @user_info = user_info
  end

  def email
    @user_info[:email]
  end

  def permissions
    @user_info[:permissions].map do |perm|
      slice(perm, :role, :project_name)
    end
  end

  def to_hash
    slice(@user_info, :email, :first_name, :last_name, :token)
  end

  private

  def slice(hash, *keys)
    Hash[ keys.zip(hash.values_at(*keys)) ]
  end
end
