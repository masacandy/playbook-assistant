class Api::V1::Workouts::Messages::RepsController < Api::V1::BaseController
  protect_from_forgery except: :create

  before_action :find_menu_exercise

  def create
    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: "#{params[:weight]}kg, #{params[:reps]}回",
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

    @workout = Workout.find(params[:workout_id])

    create_next_action_message

    @workout_messages = WorkoutMessage.where(workout_id: params[:workout_id]).order(id: :asc)
    @weight = params[:weight]
    @current_exercise = OpenStruct.new(
      id: last_set? ? next_menu_exercise&.exercise_id : params[:exercise_id],
      rep: last_set? ? next_menu_exercise&.rep : @menu_exercise.rep,
    )
  end

  private

  def find_menu_exercise
    @menu_exercise = MenuExercise.find_by(menu_id: params[:menu_id], exercise_id: params[:exercise_id])
  end

  def create_next_action_message
    message = "Great!"
    message += last_set? ? "次の種目だ" : "その調子で続けよう！" unless last_exercise?

    WorkoutMessage.create!(
      workout_id: params[:workout_id],
      message: message,
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    return create_next_reps_message unless last_set?

    update_latest_log

    return ::FinishWorkoutService.call(workout_id: params[:workout_id]) if last_exercise?

    ::CreateRecommendedWorkoutExerciseMessageService.call(workout_id: params[:workout_id])
  end

  def last_set?
    exercise_done_set_count = UserExerciseLog.where(
      user_id: current_user.id,
      workout_id: params[:workout_id],
      exercise_id: params[:exercise_id],
    ).count

    @menu_exercise.set == exercise_done_set_count
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

  def last_exercise?
    ::FetchUnfinishedExercisesService.call(workout_id: @workout.id).blank?
  end

  def next_menu_exercise
    recommend_next_exercise = ::FetchUnfinishedExercisesService.call(workout_id: @workout.id)&.first
    return nil if recommend_next_exercise.nil?
    @workout.menu.menu_exercises.find_by(exercise_id: recommend_next_exercise.id)
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
