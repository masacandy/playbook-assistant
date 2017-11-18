class Workout < ApplicationRecord
  belongs_to :user
  belongs_to :menu
  has_many :user_exercise_logs
end
