class Web::Workouts::FinishController < Web::BaseController
  before_action :authenticate_user!

  def index
    workout = Workout.find(params[:workout_id])

    gon.app_bar_type = 1
    gon.title = "#{workout.menu.name}のワークアウト終了"

    return if workout.finished_at.present?

    WorkoutMessage.create!(
      workout_id: workout.id,
      message: 'ワークアウト終了',
      message_type: WorkoutMessage.message_types[:user],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    FinishWorkoutService.call(workout_id: workout.id)
  end
end
