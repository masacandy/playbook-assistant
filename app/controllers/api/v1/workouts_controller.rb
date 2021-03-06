class Api::V1::WorkoutsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :authenticate_workout_user_from_id!, only: %i[show]

  def create
    @workout = Workout.create!(permit_params)
  end

  def show
    @workout = Workout.find(params[:id])

    return if @workout.finished_at.present?

    @current_exercise = FetchCurrentExerciseService.call(workout_id: params[:id])

    # 途中で更新していた場合
    return if @workout.workout_messages.exists?

    ActiveRecord::Base.transaction do
      WorkoutMessage.create!(
        workout_id: @workout.id,
        message: "さあ、今日の#{@workout.menu.name}のワークアウトの始まりだ",
        message_type: WorkoutMessage.message_types[:assistant],
        next_action_type: WorkoutMessage.next_action_types[:assistant_message],
      )

      ::CreateRecommendedWorkoutExerciseMessageService.call(workout_id: params[:id])
    end

    @workout.workout_messages.reload
  end

  private

  def permit_params
    params.require(:workout).permit(:menu_id).merge(user_id: current_user.id)
  end
end
