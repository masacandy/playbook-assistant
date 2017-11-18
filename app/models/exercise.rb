class Exercise < ApplicationRecord
  has_many :menu_exercises
  has_many :menus, through: :menu_exercises
  has_many :user_last_exercise_logs
end
