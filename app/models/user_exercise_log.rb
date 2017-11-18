class UserExcerciseLog < ApplicationRecord
  belongs_to :user
  belongs_to :workout
  belongs_to :exercise
end
