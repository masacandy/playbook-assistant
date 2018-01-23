class Web::BaseController < ApplicationController
  before_action :authenticate_user!

  def authenticate_workout_user!
    workout = Workout.find(params[:workout_id])
    return if current_user.id == workout.user_id

    render_404
  end

  def render_404
    respond_to do |format|
      format.html {
        render file: "#{Rails.root}/public/404",
        layout: false,
        status: :not_found
      }
    end
  end
end
