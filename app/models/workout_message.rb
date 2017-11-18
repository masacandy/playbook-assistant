class WorkoutMessage < ApplicationRecord
  belongs_to :workout

  enum message_type: {
    user: 0,
    assistant: 1,
  }
end
