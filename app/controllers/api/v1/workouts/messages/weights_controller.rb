class Api::V1::Workouts::Messages::WeightsController < Api::V1::BaseController
  def create
    create_first_log if first_input_exercise_weight?

    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: "#{params[:weight]}kg",
      message_type: WorkoutMessage.message_types[:user],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    create_next_action_message

    @workout_messages = WorkoutMessage.where(workout_id: params[:workout_id]).order(id: :asc)
    @weight = params[:weight].to_i
  end

  private

  def create_next_action_message
    menu_exercise = MenuExercise.find_by(menu_id: params[:menu_id], exercise_id: params[:exercise_id])
    message = "OK! #{params[:weight]}kgだな。\n今日は#{menu_exercise.rep}回を#{menu_exercise.set}セットだ！"
    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: message,
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    message = '1セット目のレップ数を教えてください'

    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: message,
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:user_input_reps],
    )
  end

  def first_input_exercise_weight?
    UserLastExerciseLog.find_by(
      user_id: current_user.id,
      exercise_id: params[:exercise_id]
    ).nil?
  end

  def create_first_log
    UserLastExerciseLog.create!(
      user_id: current_user.id,
      exercise_id: params[:exercise_id],
      weight: params[:weight],
    )
  end
end
