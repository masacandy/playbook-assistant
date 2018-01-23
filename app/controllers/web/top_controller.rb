class Web::TopController < Web::BaseController
  def index
    @menus = current_user.menus
    gon.title = "週２筋トレ部"
    gon.app_bar_type = 1
    last_workout_finished_at = Workout.where(user_id: current_user.id).where.not(finished_at: nil).last.finished_at
    return if last_workout_finished_at.nil?
    @hours = hours_from_last_workout(last_workout_finished_at)
  end

  private

  def hours_from_last_workout(last_workout_finished_at)
    (Time.current - last_workout_finished_at).to_i / 60 / 60
  end
end
