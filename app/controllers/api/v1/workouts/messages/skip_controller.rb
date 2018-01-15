class Api::V1::Workouts::Messages::SkipController < Api::V1::BaseController
  ZERO_WEIGHT = 0
  ZERO_REPS = 0

  def create
    @workout = Workout.find(params[:workout_id])
    exercise = Exercise.find(params[:exercise_id])

    last_exercise_log = @workout&.user_exercise_logs&.where(exercise_id: exercise.id)&.last

    if last_exercise_log.present?
      create_user_last_exercise_log(exercise_id: exercise.id, weight: last_exercise_log.weight)
    else
      create_empty_exercise_log(exercise.id)
      create_user_last_exercise_log(exercise_id: exercise.id, weight: ZERO_WEIGHT)
    end

    WorkoutMessage.create!(
      workout_id: @workout.id,
      message: "#{exercise.name}を終了します",
      message_type: WorkoutMessage.message_types[:user],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    ::CreateRecommendedWorkoutExerciseMessageService.call(workout_id: @workout.id)

    @current_exercise = OpenStruct.new(
      id: next_menu_exercise&.exercise_id,
      rep: next_menu_exercise&.rep,
    )

    @weight = nil
  end

  private

  def create_user_last_exercise_log(exercise_id:, weight:)
    UserLastExerciseLog.create!(
      user_id: current_user.id,
      exercise_id: exercise_id,
      weight: weight,
      weight_up: false,
    )
  end

  def create_empty_exercise_log(exercise_id)
    UserExerciseLog.create!(
      user_id: current_user.id,
      workout_id: @workout.id,
      exercise_id: exercise_id,
      weight: ZERO_WEIGHT,
      reps: ZERO_REPS,
    )
  end

  def next_menu_exercise
    recommend_next_exercise = ::FetchUnfinishedExercisesService.call(workout_id: @workout.id).first
    @workout.menu.menu_exercises.find_by(exercise_id: recommend_next_exercise.id)
  end
end
