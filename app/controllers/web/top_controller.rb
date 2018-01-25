class Web::TopController < Web::BaseController
  def index
    gon.logged = false

    return if current_user.nil?

    @menus = current_user.menus
    gon.logged = true
    last_workout_finished_at = Workout.where(user_id: current_user.id).where.not(finished_at: nil).last&.finished_at
    return if last_workout_finished_at.nil?
    @hours = hours_from_last_workout(last_workout_finished_at)
  end

  private

  def hours_from_last_workout(last_workout_finished_at)
    (Time.current - last_workout_finished_at).to_i / 60 / 60
  end
end
