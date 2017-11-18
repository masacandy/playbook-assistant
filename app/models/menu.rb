class Menu < ApplicationRecord
  has_many :user_menus
  has_many :users, through: :user_menus
  has_many :menu_exercises
  has_many :exercises, through: :menu_exercises
  has_many :user_exercise_logs
end
