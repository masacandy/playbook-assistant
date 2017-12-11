class Api::V1::Workouts::Messages::RepsController < Api::V1::BaseController
  protect_from_forgery except: :create

  before_action :find_menu_exercise

  def create
    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: "#{params[:reps]}回",
      message_type: WorkoutMessage.message_types[:user],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    UserExerciseLog.create!(
      user_id: current_user.id,
      workout_id: params[:workout_id],
      exercise_id: params[:exercise_id],
      weight: params[:weight],
      reps: params[:reps],
    )

    create_next_action_message

    @workout = Workout.find(params[:workout_id])
    @workout_messages = WorkoutMessage.where(workout_id: params[:workout_id]).order(id: :asc)
    @weight = params[:weight]
    @current_exercise = OpenStruct.new(
      id: next_exercise? ? next_menu_exercise.exercise_id : params[:exercise_id],
    )
  end

  private

  def find_menu_exercise
    @menu_exercise = MenuExercise.find_by(menu_id: params[:menu_id], exercise_id: params[:exercise_id])
  end

  def create_next_action_message
    message = "Great!"
    message += next_exercise? ? "次の種目だ" : "その調子で続けよう！"

    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: message,
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    return create_next_exercise_message if next_exercise?
    create_next_reps_message
  end

  def next_exercise?
    exercise_done_set_count = UserExerciseLog.where(
      user_id: current_user.id,
      workout_id: params[:workout_id],
      exercise_id: params[:exercise_id],
    ).count

    @menu_exercise.set == exercise_done_set_count
  end

  def create_next_exercise_message
    update_latest_log

    ::CreateSwitchWorkoutExerciseMessageService.call(workout_id: params[:workout_id], next_menu_exercise: next_menu_exercise)
  end

  def update_latest_log
    weight_up = UserExerciseLog.where(
      user_id: current_user.id,
      workout_id: params[:workout_id],
      exercise_id: params[:exercise_id],
    ).all? { |user_exercise_log| user_exercise_log.reps == @menu_exercise.rep }

    UserLastExerciseLog.create!(
      user_id: current_user.id,
      exercise_id: params[:exercise_id],
      weight: params[:weight],
      weight_up: weight_up
    )
  end

  def next_menu_exercise
    MenuExercise.find_by(
      menu_id: params[:menu_id],
      sort: @menu_exercise.sort + 1,
    )
  end

  def create_next_reps_message
    reps_count = UserExerciseLog.where(
      user_id: current_user.id,
      workout_id: params[:workout_id],
      exercise_id: params[:exercise_id],
    ).count

    message = "#{reps_count + 1}回目のレップ数を教えてください"

    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: message,
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:user_input_reps],
    )
  end
end
