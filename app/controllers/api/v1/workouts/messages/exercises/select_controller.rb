class Api::V1::Workouts::Messages::Exercises::SelectController < Api::V1::BaseController
  CurrentExercise = Struct.new(:id, :rep, :latest_weight)

  def create
    @workout = Workout.find(params[:workout_id])
    menu_exercise = MenuExercise.find_by(
      menu_id: params[:menu_id],
      exercise_id: params[:exercise_id]
    )

    @current_exercise = CurrentExercise.new(
      menu_exercise.exercise_id,
      menu_exercise.rep,
      latest_exercise_weight,
    )

    exercise = Exercise.find(params[:exercise_id])

    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: exercise.name,
      message_type: WorkoutMessage.message_types[:user],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message]
    )

    ::CreateSwitchWorkoutExerciseMessageService.call(
      workout_id: params[:workout_id],
      next_menu_exercise_id: params[:exercise_id]
    )
  end

  private

  def latest_exercise_weight
    current_user.user_last_exercise_logs.where(
      exercise_id: params[:exercise_id],
    )&.last&.weight
  end
end
