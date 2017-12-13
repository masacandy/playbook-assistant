class Api::V1::WorkoutsController < Api::V1::BaseController
  def show
    @workout = Workout.find(params[:id])

    return if @workout.finished_at.present?

    @current_exercise = FetchCurrentExerciseService.call(workout_id: params[:id])

    # 途中で更新していた場合
    return if @workout.workout_messages.exists?

    menu_exercise = @workout.menu.menu_exercises.order(sort: :asc).first

    ::CreateSwitchWorkoutExerciseMessageService.call(workout_id: params[:id], next_menu_exercise: menu_exercise)

    @workout.workout_messages.reload
  end
end
