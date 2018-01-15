class Api::V1::Workouts::Messages::Exercises::ChooseController < Api::V1::BaseController
  CurrentExercise = Struct.new(:id, :rep, :latest_weight)

  def create
    @workout = Workout.find(params[:workout_id])
    menu_exercise = MenuExercise.find_by(
      menu_id: params[:menu_id],
      exercise_id: params[:exercise_id]
    )

    message = params[:answer] == true ? 'はい' : 'いいえ、別の種目にします。'

    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: message,
      message_type: WorkoutMessage.message_types[:user],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message]
    )

    return create_with_recommended_exercise if params[:answer] == true

    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: '次に行う種目を選んでください',
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:user_select_exercise]
    )
  end

  private

  def create_with_recommended_exercise
    done_exercise_ids = UserExerciseLog.where(user_id: current_user.id, workout_id: params[:workout_id]).order(exercise_id: :asc).pluck(:exercise_id).uniq
    recommended_menu_exercise = MenuExercise.where(menu_id: params[:menu_id]).where.not(exercise_id: done_exercise_ids).first

    @current_exercise = CurrentExercise.new(
      recommended_menu_exercise.exercise_id,
      recommended_menu_exercise.rep,
      latest_exercise_weight(recommended_menu_exercise.id),
    )


    ::CreateSwitchWorkoutExerciseMessageService.call(
      workout_id: params[:workout_id],
      next_menu_exercise_id: recommended_menu_exercise.id,
    )
  end

  def latest_exercise_weight(exercise_id)
    current_user.user_last_exercise_logs.where(
      exercise_id: exercise_id,
    )&.last&.weight
  end
end
