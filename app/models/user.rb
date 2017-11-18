class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable

  has_many :user_menus
  has_many :menus, through: :user_menus
  has_many :workouts
  has_many :user_exercise_logs
  has_many :user_last_exercise_logs

  protected

  # メールアドレスの確認なしでも使えるようにした
  def confirmation_required?
    false
  end
end
