class FetchCurrentExerciseService
  attr_accessor :workout

  CurrentExercise = Struct.new(:id, :rep, :latest_weight)

  def self.call(workout_id:)
    new(workout_id).call
  end

  def initialize(workout_id)
    @workout = Workout.find(workout_id)
  end

  def call
    return first_exercise if last_exercise_log.nil?

    return next_exercise if next_exercise?
    current_exercise
  end

  def first_exercise
    first_menu_exercise = workout.menu.menu_exercises.first

    CurrentExercise.new(
      first_menu_exercise.exercise_id,
      first_menu_exercise.rep,
      exercise_weight(first_menu_exercise.exercise_id)
    )
  end

  def exercise_weight(exercise_id)
    last_exercise_weight = UserExerciseLog.where(workout: workout.id, exercise_id: exercise_id).last&.weight

    return last_exercise_weight unless last_exercise_weight.nil?

    workout.user.user_last_exercise_logs.where(
      exercise_id: exercise_id,
    )&.last&.weight
  end

  def last_exercise_log
    UserExerciseLog.where(workout_id: workout.id).order(id: :asc)&.last
  end

  # ログの最後のメニューのやるべきセット数
  def last_exercise_set_count
    last_exercise_id = last_exercise_log.exercise_id
    workout.menu.menu_exercises.find_by(exercise_id: last_exercise_log.exercise_id).set
  end

  # ログの最後のメニューの完了セット数
  def last_exercise_set_count_from_log
    workout.user_exercise_logs.where(exercise_id: last_exercise_log.exercise_id).count
  end

  def next_exercise?
    return false if last_exercise_set_count.nil?
    last_exercise_set_count == last_exercise_set_count_from_log
  end

  def next_exercise
    recommend_next_exercise = ::FetchUnfinishedExercisesService.call(workout_id: @workout.id).first
    menu_exercise = workout.menu.menu_exercises.find_by(exercise_id: recommend_next_exercise.id)

    CurrentExercise.new(
      menu_exercise.exercise_id,
      menu_exercise.rep,
      latest_exercise_weight(menu_exercise.exercise_id)
    )
  end

  def current_menu_exercise
    MenuExercise.find_by(
      menu_id: workout.menu_id,
      exercise_id: last_exercise_log.exercise_id,
    )
  end

  def current_exercise
    CurrentExercise.new(
      current_menu_exercise.exercise_id,
      current_menu_exercise.rep,
      latest_exercise_weight(current_menu_exercise.exercise_id),
    )
  end
end
