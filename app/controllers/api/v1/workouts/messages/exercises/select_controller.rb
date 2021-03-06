class Api::V1::Workouts::Messages::Exercises::SelectController < Api::V1::BaseController
  before_action :authenticate_workout_user!

  CurrentExercise = Struct.new(:id, :rep, :latest_weight, :image_url)

  def create
    @workout = Workout.find(params[:workout_id])
    menu_exercise = MenuExercise.find_by(
      menu_id: params[:menu_id],
      exercise_id: params[:exercise_id]
    )

    exercise = Exercise.find(params[:exercise_id])

    @current_exercise = CurrentExercise.new(
      menu_exercise.exercise_id,
      menu_exercise.rep,
      latest_exercise_weight,
    )

    ActiveRecord::Base.transaction do
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
  end

  private

  def latest_exercise_weight
    current_user.user_last_exercise_logs.where(
      exercise_id: params[:exercise_id],
    )&.last&.weight
  end
end
