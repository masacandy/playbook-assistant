class CreateRecommendedWorkoutExerciseMessageService
  attr_accessor :workout

  def self.call(workout_id:)
    new(workout_id).call
  end

  def initialize(workout_id)
    @workout = Workout.find(workout_id)
  end

  def call
    done_exercise_ids = UserExerciseLog.where(user_id: workout.user_id, workout_id: workout.id).pluck(:exercise_id).uniq
    recommend_exercise = MenuExercise.where(menu_id: workout.menu_id).where.not(exercise_id: done_exercise_ids).order(sort: :asc).first.exercise

    head_message = done_exercise_ids.blank? ? '最初の' : '次の'

    WorkoutMessage.create!(
      workout_id: workout.id,
      message: "#{head_message}種目は#{recommend_exercise.name}がおすすめです",
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    WorkoutMessage.create!(
      workout_id: workout.id,
      message: "#{recommend_exercise.name}を行いますか？",
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:user_choose_exercise],
    )
  end
end
