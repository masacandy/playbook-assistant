class Web::Workouts::FinishController < Web::BaseController
  def index
    workout = Workout.find(params[:workout_id])

    WorkoutMessage.create!(
      workout_id: workout.id,
      message: 'ワークアウト終了',
      message_type: WorkoutMessage.message_types[:user],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    FinishWorkoutService.call(workout_id: workout.id) if workout.finished_at.nil?

    @menu_name = workout.menu.name
  end
end
