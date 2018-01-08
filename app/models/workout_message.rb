class WorkoutMessage < ApplicationRecord
  belongs_to :workout

  enum message_type: {
    user: 0,
    assistant: 1,
  }

  enum next_action_type: {
    assistant_message: 0,
    user_input_reps: 1,
    user_input_weight: 2,
    next_exercise: 3,
    finish_workout: 4,
    user_choose_exercise: 5,
    user_select_exercise: 6,
  }
end
