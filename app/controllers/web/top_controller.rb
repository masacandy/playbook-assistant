class Web::TopController < Web::BaseController
  def index
    gon.logged = current_user.present?

    return if current_user.nil?

    gon.user_menus = current_user.menus
  end

  private

  def hours_from_last_workout(last_workout_finished_at)
    (Time.current - last_workout_finished_at).to_i / 60 / 60
  end
end
