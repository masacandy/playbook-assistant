class FetchUnfinishedExercisesService
  attr_accessor :workout

  def self.call(workout_id:)
    new(workout_id).call
  end

  def initialize(workout_id)
    @workout = Workout.find(workout_id)
  end

  def call
    done_exercise_ids = UserExerciseLog.where(user_id: workout.user_id, workout_id: workout.id).pluck(:exercise_id).uniq
    unfinished_menu_exercise_ids = MenuExercise.where(menu_id: workout.menu_id).where.not(exercise_id: done_exercise_ids)&.order(sort: :asc)&.pluck(:exercise_id)
    return nil if unfinished_menu_exercise_ids.blank?

    Exercise.where(id: unfinished_menu_exercise_ids)
  end
end
